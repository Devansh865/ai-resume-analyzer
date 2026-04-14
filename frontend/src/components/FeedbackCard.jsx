import { useState } from 'react';

export default function FeedbackCard({ title, items = [], type = "info" }) {
  const [expanded, setExpanded] = useState(false);

  if (!items || items.length === 0) return null;

  // Determine styling based on type
  let borderClass = "border-slate-700/50";
  let icon = "💬";
  let titleColor = "text-slate-300";
  let listItemColor = "text-slate-300";
  let bulletColor = "text-slate-500";
  let bgClass = "bg-slate-800/40";

  switch (type) {
    case "strengths":
      borderClass = "border-l-4 border-l-emerald-500 border-t-slate-700/50 border-r-slate-700/50 border-b-slate-700/50";
      icon = "💪";
      titleColor = "text-emerald-400";
      bulletColor = "text-emerald-500";
      break;
    case "weaknesses":
      borderClass = "border-l-[6px] border-l-rose-500 border-t-rose-500/20 border-r-rose-500/20 border-b-rose-500/20";
      bgClass = "bg-rose-500/10 shadow-[0_4px_20px_rgba(244,63,94,0.05)]";
      icon = "⚠️";
      titleColor = "text-rose-400 font-extrabold tracking-widest";
      bulletColor = "text-rose-500";
      listItemColor = "text-rose-200/90 font-medium";
      break;
    case "improvements":
      borderClass = "border-l-4 border-l-violet-500 border-t-slate-700/50 border-r-slate-700/50 border-b-slate-700/50";
      bgClass = "bg-violet-500/5";
      icon = "✨";
      titleColor = "text-violet-400";
      bulletColor = "text-violet-500";
      break;
  }

  const displayItems = expanded ? items : items.slice(0, 2);
  const hasMore = items.length > 2;

  return (
    <div className={`p-6 sm:p-8 flex flex-col h-full rounded-2xl border ${borderClass} ${bgClass} transition-all duration-300`}>
      <h4 className={`text-sm uppercase mb-5 flex items-center gap-2 ${titleColor} ${type !== 'weaknesses' ? 'font-bold tracking-wider' : ''}`}>
        <span className="text-xl">{icon}</span> {title}
      </h4>
      <ul className="space-y-4 flex-grow">
        {displayItems.map((item, i) => (
          <li key={i} className={`flex items-start gap-4 text-[15px] ${listItemColor} leading-relaxed`}>
            <span className={`${bulletColor} mt-1 shrink-0`}>•</span>
            <span className="line-clamp-2 md:line-clamp-none">{item}</span>
          </li>
        ))}
      </ul>
      
      {hasMore && (
        <button 
          onClick={() => setExpanded(!expanded)} 
          className="mt-6 text-sm font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1 self-start"
        >
          {expanded ? "Show Less ↑" : `Show ${items.length - 2} More ↓`}
        </button>
      )}
    </div>
  );
}
