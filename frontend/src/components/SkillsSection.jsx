export default function SkillsSection({ matchedSkills = [], missingSkills = [] }) {
  if (matchedSkills.length === 0 && missingSkills.length === 0) return null;

  return (
    <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 flex flex-col gap-4">
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Skill Analysis</h3>
      
      <div className="flex flex-col gap-4">
        {matchedSkills.length > 0 && (
          <div>
            <div className="text-xs text-emerald-400 mb-2 font-semibold">✓ MATCHED</div>
            <div className="flex flex-wrap gap-2">
              {matchedSkills.map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-lg text-sm font-medium shadow-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {missingSkills.length > 0 && (
          <div>
            <div className="text-xs text-rose-400 mb-2 font-semibold">❌ MISSING FROM RESUME</div>
            <div className="flex flex-wrap gap-2">
              {missingSkills.map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-transparent border border-rose-500/50 text-rose-300 rounded-lg text-sm font-medium shadow-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
