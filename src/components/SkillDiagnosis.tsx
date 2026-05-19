"use client";

import type { SkillBreakdown } from "@/lib/scoring";

export function SkillDiagnosis({ skillBreakdown }: { skillBreakdown: SkillBreakdown }) {
  const entries = Object.entries(skillBreakdown);

  return (
    <section className="test-panel p-6">
      <h2 className="text-xl font-semibold tracking-tight text-slate-950">Skill diagnosis</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {entries.map(([skill, value]) => {
          const percent = Math.round((value.correct / value.total) * 100);
          return (
            <div key={skill}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-800">{skill}</span>
                <span className="text-slate-500">
                  {value.correct}/{value.total}
                </span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-slate-100">
                <div className="h-2 rounded-full bg-emerald-700" style={{ width: `${percent}%` }} />
              </div>
              <p className="mt-2 text-sm text-slate-600">
                {percent >= 80
                  ? "Strong performance. Keep practising under stricter time limits."
                  : percent >= 50
                    ? "Developing skill. Review the evidence location before moving on."
                    : "Priority area. Slow down and compare the exact wording with the passage."}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
