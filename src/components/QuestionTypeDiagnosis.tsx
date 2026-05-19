"use client";

import type { ScoreResult } from "@/lib/scoring";
import { QUESTION_TYPE_LABELS } from "@/lib/question-labels";

export function QuestionTypeDiagnosis({ score }: { score: ScoreResult }) {
  const entries = Object.entries(score.typeBreakdown);

  return (
    <section className="test-panel p-6">
      <h2 className="text-xl font-semibold tracking-tight text-slate-950">Performance by question type</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {entries.map(([type, value]) => {
          const percent = Math.round((value.correct / value.total) * 100);
          return (
            <div key={type} className="rounded-md border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium text-slate-800">
                  {QUESTION_TYPE_LABELS[type as keyof typeof QUESTION_TYPE_LABELS]}
                </span>
                <span className="text-slate-500">
                  {value.correct}/{value.total}
                </span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-slate-100">
                <div className="h-2 rounded-full bg-slate-950" style={{ width: `${percent}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
