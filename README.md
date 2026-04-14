# 🚀 AI Resume Analyzer

An AI-powered web application that analyzes resumes against job descriptions and provides intelligent feedback to improve job matching.

---

## 🌐 Live Demo

👉 https://ai-resume-analyzer-tau-neon.vercel.app/
*(Note: First request may take ~30 seconds due to free backend hosting)*

---

## 🧠 Features

* 📊 **Match Score Analysis**
  Calculates similarity between resume and job description.

* 🧩 **Skill Extraction & Gap Detection**
  Identifies matched and missing skills using rule-based + alias mapping.

* 🤖 **AI Feedback (LLM-powered)**
  Generates:

  * 💪 Strengths
  * ⚠️ Weaknesses
  * ✨ Improvements
  * ✍️ Rewritten resume points

* 🎯 **Key Insight Summary**
  Quick overview of resume performance.

* 📱 **Dashboard UI**
  Clean, modern interface with structured insights.

---

## 🏗️ Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Vercel (Deployment)

### Backend

* FastAPI
* Python
* Render (Deployment)

### AI / ML

* TF-IDF Vectorization (for match scoring)
* Google Gemini API (for intelligent feedback)

---

## ⚙️ How It Works

1. User uploads resume (PDF)
2. Text is extracted using `pdfplumber`
3. Skills are detected using predefined list + alias mapping
4. Match score is calculated using TF-IDF similarity
5. Gemini API generates intelligent feedback
6. Results are displayed in a structured dashboard

---

## 🚀 Deployment

* **Frontend:** Vercel
* **Backend:** Render

⚠️ Backend may sleep due to free tier, causing initial delay.

---

## 📦 Installation (Local Setup)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/ai-resume-analyzer.git
cd ai-resume-analyzer
```

### 2. Backend setup

```bash
cd backend
pip install -r requirements.txt
```

Create `.env` file:

```env
GEMINI_API_KEY=your_api_key_here
```

Run backend:

```bash
uvicorn main:app --reload
```

---

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

---

## 💡 Future Improvements

* 🔐 User authentication
* 📂 Resume history storage
* 📊 Advanced analytics
* 🌍 Multi-language support

---

## 🧑‍💻 Author

**Devansh Sharma**

---

## ⭐ If you like this project

Give it a star ⭐ on GitHub!
