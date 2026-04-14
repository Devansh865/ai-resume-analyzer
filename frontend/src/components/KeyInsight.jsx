export default function KeyInsight({ summary }) {
  if (!summary) return null;

  return (
    <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/20 to-transparent border-l-4 border-indigo-500 p-6 sm:p-8 rounded-r-2xl rounded-bl-2xl shadow-[0_4px_30px_rgba(99,102,241,0.1)] mb-8 animate-fadeIn">
      <div className="flex items-start gap-4">
        <div className="bg-indigo-500/20 p-3 rounded-xl ring-1 ring-indigo-500/30">
          <span className="text-2xl block">🔍</span>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-indigo-400 uppercase tracking-[0.15em] text-xs mb-2 drop-shadow-sm">Executive Key Insight</h3>
          <p className="text-white font-medium text-lg md:text-xl leading-relaxed text-balance">
            {summary}
          </p>
        </div>
      </div>
    </div>
  );
}
