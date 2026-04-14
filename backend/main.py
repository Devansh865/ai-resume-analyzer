from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import pdfplumber
import re
import os
import json
from google import genai
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from dotenv import load_dotenv

app = FastAPI()

# Load the SentenceTransformer model globally for fast semantic similarity computation

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Predefined list of skills
SKILL_ALIASES = {
    "sql": ["mysql", "postgresql", "sqlite"],
    "javascript": ["js", "node.js"],
    "machine learning": ["ml", "deep learning"],
    "react": ["react.js"],
    "c++": ["cpp"],
}
PREDEFINED_SKILLS = [
    "python", "java", "c++", "c#", "javascript", "typescript", "html", "css",
    "react", "angular", "vue", "node.js", "express", "django", "flask",
    "fastapi", "spring boot", "sql", "mysql", "postgresql", "mongodb",
    "machine learning", "deep learning", "data science", "aws", "azure", 
    "gcp", "docker", "kubernetes", "git", "linux", "agile", "scrum"
]

# Pre-compile regex patterns for massive performance boost during requests
COMPILED_SKILLS = {}
for skill in PREDEFINED_SKILLS:
    # Match the skill itself
    patterns = [re.compile(r'\b' + re.escape(skill) + r'\b')]
    # Match any aliases
    if skill in SKILL_ALIASES:
        for alias in SKILL_ALIASES[skill]:
            patterns.append(re.compile(r'\b' + re.escape(alias) + r'\b'))
    COMPILED_SKILLS[skill] = patterns

def is_skill_covered(skill, found_skills_set):
    if skill in found_skills_set:
        return True
    if skill in SKILL_ALIASES:
        for alias in SKILL_ALIASES[skill]:
            if alias in found_skills_set:
                return True
    return False


load_dotenv()
client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

def generate_ai_feedback(resume_text: str, job_description: str):

    try:
        prompt = f"""
You are a senior technical recruiter hiring for this role.

Analyze the resume VERY critically and compare it with the job description.

Resume:
{resume_text}

Job Description:
{job_description}

Return ONLY valid JSON:

{{
  "strengths": [
    "specific strengths with technologies or experience mentioned"
  ],
  "weaknesses": [
    "clear gaps with examples (missing tools, lack of impact, weak projects)"
  ],
  "improvements": [
    "actionable suggestions tied to job description"
  ],
  "rewritten_points": [
    "rewrite weak resume bullet into strong one with metrics and action verbs"
  ]
}}

Rules:
- DO NOT use generic phrases like "good formatting"
- Mention specific technologies (e.g., SQL, React, Docker, AWS)
- Highlight missing skills from the job description explicitly
- Focus on measurable impact (numbers, results)
- Think like a recruiter deciding to shortlist or reject
"""

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt
        )

        response_text = response.text.strip()

        # Clean markdown if Gemini adds it
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        elif response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]

        # SAFE JSON parsing
        try:
            return json.loads(response_text)
        except Exception:
            print("JSON parsing failed, raw response:", response_text)
            return {
                "strengths": [],
                "weaknesses": ["AI response parsing failed"],
                "improvements": ["Try again"],
                "rewritten_points": []
            }

    except Exception as e:
        print(f"Gemini API Error: {e}")
        return {
            "strengths": [],
            "weaknesses": ["AI unavailable"],
            "improvements": ["Try again later"],
            "rewritten_points": []
        }

@app.post("/upload")
async def upload_resume(
    fullName: str = Form(...),
    targetJob: str = Form(...),
    yoe: int = Form(...),
    jobDescription: str = Form(...),
    resume: UploadFile = File(...)
):
    text = ""

    # Parse PDF if applicable
    try:
        if resume.filename.lower().endswith(".pdf"):
            with pdfplumber.open(resume.file) as pdf:
                for page in pdf.pages:
                    extracted = page.extract_text()
                    if extracted:
                        text += extracted
        else:
            text = "Unsupported format (Only PDF supported right now)."
    except Exception as e:
        text = f"Error reading file: {str(e)}"

    text_lower = text.lower()
    
    # 1. Extract skills from resume
    found_skills = []
    
    for skill, patterns in COMPILED_SKILLS.items():
        if any(p.search(text_lower) for p in patterns):
            found_skills.append(skill)

    display_skills = [skill.title() if skill not in ["aws", "gcp", "html", "css", "sql"] else skill.upper() for skill in found_skills]

    # 2. Check for presence of key sections
    sections = {
        "experience": "experience",
        "education": "education",
        "projects": "projects"
    }
    found_sections = []
    for section_name, keyword in sections.items():
        if keyword in text_lower:
            found_sections.append(section_name)

    # Calculate base resume score (max 100)
    section_score = len(found_sections) * 10
    skill_score = min(len(found_skills) * 7, 70)
    base_score = section_score + skill_score

    # 3. Job description analysis
    jd_lower = jobDescription.lower()
    jd_skills = []
    if jd_lower.strip():
        for skill, patterns in COMPILED_SKILLS.items():
            if any(p.search(jd_lower) for p in patterns):
                jd_skills.append(skill)
    
    missing_skills = []
    found_skills_set = set(found_skills)

    for skill in jd_skills:
        if not is_skill_covered(skill, found_skills_set):
            missing_skills.append(skill)
    # Compute Semantic Similarity Match Score using Machine Learning
    match_score = 0
    if jobDescription.strip() and text.strip():
        vectorizer = TfidfVectorizer()

        vectors = vectorizer.fit_transform([text, jobDescription])
        similarity = cosine_similarity(vectors[0:1], vectors[1:2])[0][0]

        match_score = int(similarity * 100)
    
    final_score = base_score
    if jobDescription.strip():
        final_score = int((base_score * 0.4) + (match_score * 0.6))

    # Generate improvement suggestions
    improvements = []
    if "projects" not in found_sections:
        improvements.append("Add a dedicated 'Projects' section to showcase your practical experience.")
    if "experience" not in found_sections:
        improvements.append("Ensure your 'Experience' section is clearly labeled and highlights your work history.")
    if "education" not in found_sections:
        improvements.append("Include an 'Education' section detailing your academic background.")
    
    if len(found_skills) < 5:
        improvements.append("Incorporate more relevant technical skills keywords throughout your resume.")
    if missing_skills:
        improvements.append(f"Consider learning or highlighting these skills to better match the job description: {', '.join(missing_skills[:3])}.")
    
    general_tips = [
        "Quantify your achievements with concrete metrics (e.g., 'improved performance by 20%').",
        "Use strong action verbs to start bullet points (e.g., 'Developed', 'Led', 'Optimized').",
        "Ensure consistent formatting, font size, and spacing throughout the document."
    ]
    for tip in general_tips:
        if len(improvements) < 3:
            improvements.append(tip)
        else:
            break

    improvements = improvements[:3]

    summary = f"Your resume scored {final_score}/100. "
    if jd_skills:
        summary += f"It has a {match_score}% skill match with the provided job description. "
    
    if final_score >= 80:
        summary += "This is a strong resume with a solid foundation. Great job highlighting key skills!"
    elif final_score >= 50:
        summary += "Your resume is on the right track, but could use some refinement to increase its impact."
    else:
        summary += "Your resume may be missing critical sections or keywords; review the improvements to strengthen it."

    # Call the LLM-based intelligent analysis
    ai_feedback = generate_ai_feedback(text, jobDescription)

    return {
        "status": "success",
        "filename": resume.filename,
        "content_preview": text[:1000],
        "score": final_score,
        "match_score": match_score,
        "skills": display_skills,
        "missing_skills": missing_skills,
        "improvements": ai_feedback.get("improvements", improvements),
        "summary": summary,
        "ai_feedback": {
            "strengths": ai_feedback.get("strengths", []),
            "weaknesses": ai_feedback.get("weaknesses", []),
            "improvements": ai_feedback.get("improvements", []),
            "rewritten_points": ai_feedback.get("rewritten_points", [])
        }
    }
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8080)