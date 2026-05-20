"use client";

import type { DiagnosisResult } from "@/lib/diagnosis";

export function MistakePatternSummary({ diagnosis }: { diagnosis: DiagnosisResult }) {
  return (
    <section className="test-panel p-6">
      <h2 className="text-xl font-semibold tracking-tight text-slate-950">Mistake pattern summary</h2>
      <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-700">{diagnosis.mistakeSummary}</p>
      <dl className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-md bg-slate-50 p-4">
          <dt className="text-sm text-slate-500">Weakest question type</dt>
          <dd className="mt-1 font-semibold text-slate-950">
            {diagnosis.weakestQuestionType?.label ?? "No clear pattern"}
          </dd>
        </div>
        <div className="rounded-md bg-slate-50 p-4">
          <dt className="text-sm text-slate-500">Weakest skill</dt>
          <dd className="mt-1 font-semibold text-slate-950">{diagnosis.weakestSkill?.label ?? "No clear pattern"}</dd>
        </div>
        <div className="rounded-md bg-slate-50 p-4">
          <dt className="text-sm text-slate-500">Most common trap</dt>
          <dd className="mt-1 font-semibold text-slate-950">
            {diagnosis.mostCommonTrap?.label ?? "No dominant trap"}
          </dd>
        </div>
      </dl>
    </section>
  );
}
