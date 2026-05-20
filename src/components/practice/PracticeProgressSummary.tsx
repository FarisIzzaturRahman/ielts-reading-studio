"use client";

import { useEffect, useState } from "react";
import {
  getPracticeProgress,
  type PracticeDrillStorageMeta,
  type PracticeProgressSummary as PracticeSummary,
} from "@/lib/practice-storage";

export function PracticeProgressSummary({ drills }: { drills: PracticeDrillStorageMeta[] }) {
  const [summary, setSummary] = useState<PracticeSummary | null>(null);

  useEffect(() => {
    let isMounted = true;
    queueMicrotask(() => {
      if (isMounted) {
        setSummary(getPracticeProgress(drills));
      }
    });
    return () => {
      isMounted = false;
    };
  }, [drills]);

  if (!summary) {
    return (
      <section className="test-panel p-5">
        <h2 className="text-lg font-semibold text-slate-950">Practice progress</h2>
        <p className="mt-2 text-sm text-slate-600">Checking local practice history.</p>
      </section>
    );
  }

  const latest = summary.history[0];

  return (
    <section className="test-panel p-5">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Practice progress</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Your practice progress is saved only on this device and browser.
          </p>
        </div>
        <dl className="grid grid-cols-2 gap-2 text-sm md:min-w-96 md:grid-cols-3">
          <div className="rounded-md bg-slate-50 p-3">
            <dt className="text-slate-500">Completed</dt>
            <dd className="mt-1 text-2xl font-semibold text-slate-950">{summary.completedDrillIds.length}</dd>
          </div>
          <div className="rounded-md bg-slate-50 p-3">
            <dt className="text-slate-500">Latest</dt>
            <dd className="mt-1 text-2xl font-semibold text-slate-950">{latest ? `${latest.percentage}%` : "-"}</dd>
          </div>
          <div className="rounded-md bg-slate-50 p-3">
            <dt className="text-slate-500">History</dt>
            <dd className="mt-1 text-2xl font-semibold text-slate-950">{summary.history.length}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
