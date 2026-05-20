"use client";

import type { PerformanceEntry } from "@/lib/diagnosis";

export function PerformanceBreakdown({
  title,
  description,
  entries,
  strongest,
  weakest,
}: {
  title: string;
  description: string;
  entries: PerformanceEntry[];
  strongest?: PerformanceEntry;
  weakest?: PerformanceEntry;
}) {
  return (
    <section className="test-panel p-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-950">{title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{description}</p>
        </div>
        {(strongest || weakest) && (
          <div className="grid gap-2 text-sm sm:grid-cols-2 md:min-w-80">
            {strongest ? (
              <div className="rounded-md bg-emerald-50 p-3 text-emerald-950">
                <p className="text-xs font-semibold uppercase tracking-[0.14em]">Strongest</p>
                <p className="mt-1 font-semibold">{strongest.label}</p>
              </div>
            ) : null}
            {weakest ? (
              <div className="rounded-md bg-amber-50 p-3 text-amber-950">
                <p className="text-xs font-semibold uppercase tracking-[0.14em]">Needs Review</p>
                <p className="mt-1 font-semibold">{weakest.label}</p>
              </div>
            ) : null}
          </div>
        )}
      </div>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[640px] border-separate border-spacing-0 text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-[0.14em] text-slate-500">
              <th className="border-b border-slate-200 py-3 pr-4 font-semibold">Area</th>
              <th className="border-b border-slate-200 px-4 py-3 font-semibold">Correct</th>
              <th className="border-b border-slate-200 px-4 py-3 font-semibold">Incorrect</th>
              <th className="border-b border-slate-200 px-4 py-3 font-semibold">Unanswered</th>
              <th className="border-b border-slate-200 px-4 py-3 font-semibold">Accuracy</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id}>
                <td className="border-b border-slate-100 py-3 pr-4 font-medium text-slate-900">{entry.label}</td>
                <td className="border-b border-slate-100 px-4 py-3 text-slate-700">{entry.correct}</td>
                <td className="border-b border-slate-100 px-4 py-3 text-slate-700">{entry.incorrect}</td>
                <td className="border-b border-slate-100 px-4 py-3 text-slate-700">{entry.unanswered}</td>
                <td className="border-b border-slate-100 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="w-10 font-semibold text-slate-950">{entry.accuracy}%</span>
                    <span className="h-2 flex-1 rounded-full bg-slate-100">
                      <span className="block h-2 rounded-full bg-emerald-700" style={{ width: `${entry.accuracy}%` }} />
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
