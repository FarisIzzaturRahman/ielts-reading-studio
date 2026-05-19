"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ReadingTest } from "@/data/types";
import { getAttemptStatus } from "@/lib/attempt";
import { scoreTest } from "@/lib/scoring";

export function TestCard({ test }: { test: ReadingTest }) {
  const [attemptState, setAttemptState] = useState<ReturnType<typeof getAttemptStatus> | null>(null);

  useEffect(() => {
    let isMounted = true;
    queueMicrotask(() => {
      if (isMounted) {
        setAttemptState(getAttemptStatus(test));
      }
    });

    return () => {
      isMounted = false;
    };
  }, [test]);

  const score = attemptState?.result ? scoreTest(test, attemptState.result.answers) : null;
  const status = attemptState?.status ?? "Not Started";
  const primaryLabel =
    status === "In Progress" ? "Continue or restart" : status === "Completed" ? "Review or retake" : "Open test";

  return (
    <article className="test-panel flex h-full flex-col justify-between p-5">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
              {test.difficulty}
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">{test.title}</h2>
          </div>
          <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
            {test.targetBand}
          </span>
        </div>
        <p className="text-sm leading-6 text-slate-600">{test.description}</p>
        <dl className="grid grid-cols-3 gap-3 text-sm">
          <div>
            <dt className="text-slate-500">Passages</dt>
            <dd className="font-semibold">{test.passages.length}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Questions</dt>
            <dd className="font-semibold">{test.questions.length}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Time</dt>
            <dd className="font-semibold">{test.timeLimitMinutes} min</dd>
          </div>
        </dl>
        <p
          className={`rounded-md px-3 py-2 text-sm font-medium ${
            status === "Completed"
              ? "bg-emerald-50 text-emerald-900"
              : status === "In Progress"
                ? "bg-amber-50 text-amber-900"
                : "bg-slate-50 text-slate-600"
          }`}
        >
          Status: {status}
        </p>
        {score ? (
          <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
            Last score: <strong>{score.correct}/{score.total}</strong> ({score.percentage}%), approx Band{" "}
            {score.estimatedBand}
          </p>
        ) : (
          <p className="rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-600">
            Progress is saved only on this browser.
          </p>
        )}
      </div>
      <Link
        href={`/tests/${test.testId}/instructions`}
        className="mt-5 inline-flex items-center justify-center rounded-md bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
      >
        {primaryLabel}
      </Link>
    </article>
  );
}
