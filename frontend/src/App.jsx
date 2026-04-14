import { useState } from 'react';
import ScoreCard from './components/ScoreCard';
import KeyInsight from './components/KeyInsight';
import SkillsSection from './components/SkillsSection';
import FeedbackCard from './components/FeedbackCard';
import RewrittenPointsCard from './components/RewrittenPointsCard';

function App() {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      alert("Please upload a resume.");
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('jobDescription', jobDescription);
      formData.append('resume', resumeFile);

      // Sending dummy values for fields still required by backend
      formData.append('fullName', 'User');
      formData.append('targetJob', 'Applicant');
      formData.append('yoe', 0);

      // Connect to the backend
      const response = await fetch('http://127.0.0.1:8000/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        alert("Error: " + (data.message || "Failed to analyze resume."));
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Network error. Make sure the backend is running at http://127.0.0.1:8080");
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F19] via-[#1e1b4b] to-[#0B0F19] text-white font-sans flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className={`w-full transition-all duration-700 mx-auto relative z-10 ${
        !result ? 'max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12' : 'max-w-[1400px] flex flex-col'
      }`}>

        {/* Left Side: Hero (Only visible before analysis) */}
        {!result && (
          <div className="flex flex-col justify-center gap-6 animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="inline-block w-max px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-semibold tracking-wide">
              ✨ Powered by Advanced AI
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              Elevate Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                Career Path
              </span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md">
              Match your resume directly with job descriptions. Get instant feedback on skills, improvements, and match probability.
            </p>

            <div className="flex gap-4 mt-4">
              <div className="flex items-center gap-2 text-slate-300">
                <div className="w-10 h-10 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-xl">🎯</div>
                <span className="font-medium">Precision Match</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <div className="w-10 h-10 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-xl">⚡</div>
                <span className="font-medium">Instant Feedback</span>
              </div>
            </div>
          </div>
        )}

        {/* Right Side: Form OR Full Width Dashboard */}
        <div className="w-full">
          {!result ? (
            <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 flex flex-col gap-6 w-full max-w-lg mx-auto transform transition-all duration-500">
              <h2 className="text-2xl font-semibold mb-2">Analyze Resume</h2>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-300 ml-1">Job Description</label>
                <textarea
                  className="input-field min-h-[140px] resize-y"
                  placeholder="Paste the target job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-300 ml-1">Upload Resume (PDF)</label>
                <div className="relative group border-2 border-dashed border-slate-600 hover:border-indigo-500 rounded-xl p-8 text-center transition-colors cursor-pointer bg-slate-900/30">
                  <input
                    type="file"
                    accept=".pdf"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                    required
                  />
                  <div className="text-4xl mb-3 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">📄</div>
                  {resumeFile ? (
                    <p className="text-indigo-400 font-medium font-sm">{resumeFile.name}</p>
                  ) : (
                    <p className="text-slate-400 text-sm">Drag & drop your PDF or <span className="text-indigo-400 font-medium">browse</span></p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-semibold py-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-3 relative overflow-hidden group"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <span>Start Analysis</span>
                )}
                {/* Button shine effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              </button>
            </form>
          ) : (
            /* Results Dashboard Card (Full Width Mode) */
            <div className="glass rounded-3xl p-6 lg:p-10 w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
              
              <KeyInsight summary={result.summary} />
              
              {/* TOP ROW: Score & Skills */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="h-full w-full">
                  <ScoreCard score={result.score || result.match_score || 0} />
                </div>
                <div className="h-full w-full">
                  <SkillsSection 
                    matchedSkills={result.skills} 
                    missingSkills={result.missing_skills} 
                  />
                </div>
              </div>

              {/* AI FEEDBACK GRIDS */}
              {result.ai_feedback && (
                <div className="flex flex-col gap-8">
                  {/* SECOND ROW: Strengths & Weaknesses */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="h-full w-full">
                      <FeedbackCard 
                        title="Strengths" 
                        items={result.ai_feedback.strengths} 
                        type="strengths" 
                      />
                    </div>
                    <div className="h-full w-full">
                      <FeedbackCard 
                        title="Weaknesses" 
                        items={result.ai_feedback.weaknesses} 
                        type="weaknesses" 
                      />
                    </div>
                  </div>
                  
                  {/* THIRD ROW: Improvements */}
                  <div className="w-full">
                    <FeedbackCard 
                      title="Improvements" 
                      items={result.ai_feedback.improvements} 
                      type="improvements" 
                    />
                  </div>
                  
                  {/* FOURTH ROW: Rewritten Points */}
                  <div className="w-full">
                    <RewrittenPointsCard 
                      points={result.ai_feedback.rewritten_points} 
                    />
                  </div>
                </div>
              )}

              <div className="mt-10 flex justify-center border-t border-slate-700/50 pt-8">
                <button
                  onClick={() => setResult(null)}
                  className="px-8 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 focus:ring-2 focus:ring-indigo-500 text-slate-300 hover:text-white rounded-xl font-medium transition-all"
                >
                  Analyze Another Resume
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
