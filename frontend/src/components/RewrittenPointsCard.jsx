import { useState } from 'react';

export default function RewrittenPointsCard({ points = [] }) {
  const [expanded, setExpanded] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!points || points.length === 0) return null;

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const displayPoints = expanded ? points : points.slice(0, 2);
  const hasMore = points.length > 2;

  return (
    <div className="p-6 sm:p-10 rounded-2xl border border-indigo-500/20 bg-[#050811] shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-300">
      <h4 className="text-base font-bold uppercase tracking-[0.1em] mb-6 flex items-center gap-3 text-indigo-300">
        <span className="text-2xl">✨</span> AI Improved Version
      </h4>
      
      <div className="grid grid-cols-1 gap-3">
        {displayPoints.map((point, i) => (
          <div
            key={i}
            className="group relative bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/40 p-4 rounded-xl transition-all duration-300"
          >
            <p className="text-[15px] font-medium text-slate-200 pr-14 leading-relaxed">
              {point}
            </p>
            <button
              onClick={() => handleCopy(point, i)}
              className="absolute top-4 right-4 p-2 bg-slate-700/50 text-slate-400 hover:bg-blue-500/20 hover:text-blue-400 rounded-lg transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100"
              title="Copy to clipboard"
            >
              {copiedIndex === i ? (
                <span className="text-emerald-400 text-xs font-semibold px-2">Copied!</span>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                </svg>
              )}
            </button>
          </div>
        ))}
      </div>

      {hasMore && (
        <button 
          onClick={() => setExpanded(!expanded)} 
          className="mt-4 text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1"
        >
          {expanded ? "Show Less ↑" : `Show ${points.length - 2} More ↓`}
        </button>
      )}
    </div>
  );
}
