export default function ScoreCard({ score }) {
  // Determine color and label based on score
  let colorClass = "text-rose-500";
  let dropShadow = "drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]";
  let borderGlow = "shadow-[0_0_20px_rgba(244,63,94,0.15)] border-rose-500/30";
  let label = "Weak Match";

  if (score >= 80) {
    colorClass = "text-emerald-500";
    dropShadow = "drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]";
    borderGlow = "shadow-[0_0_20px_rgba(16,185,129,0.15)] border-emerald-500/30";
    label = "Strong Match";
  } else if (score >= 50) {
    colorClass = "text-amber-500";
    dropShadow = "drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]";
    borderGlow = "shadow-[0_0_20px_rgba(245,158,11,0.15)] border-amber-500/30";
    label = "Moderate Match";
  }

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * score) / 100;

  return (
    <div className={`flex flex-col items-center justify-center p-10 bg-slate-800/60 rounded-2xl border ${borderGlow} h-full transition-all duration-300`}>
      <h2 className="text-slate-400 text-sm font-semibold uppercase tracking-widest mb-6">Match Score</h2>
      <div className="relative inline-flex items-center justify-center">
        <svg className="w-40 h-40 transform -rotate-90">
          <circle 
            cx="80" cy="80" r={radius} 
            stroke="currentColor" strokeWidth="10" fill="transparent" 
            className="text-slate-700/50" 
          />
          <circle 
            cx="80" cy="80" r={radius} 
            stroke="currentColor" strokeWidth="10" fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={`${colorClass} ${dropShadow} transition-all duration-1000 ease-out`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className={`text-5xl font-bold tracking-tight drop-shadow-md ${colorClass}`}>
            {score}%
          </span>
        </div>
      </div>
      <h3 className={`mt-6 font-bold text-xl drop-shadow-sm ${colorClass}`}>{label}</h3>
    </div>
  );
}
