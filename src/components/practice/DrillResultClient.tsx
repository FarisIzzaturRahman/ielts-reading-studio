"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { DrillSet } from "@/data/types";
import { QUESTION_TYPE_LABELS } from "@/lib/question-labels";
import { getSavedDrillResult, type SavedDrillResult } from "@/lib/practice-storage";
import { PerformanceBreakdown } from "@/components/PerformanceBreakdown";

export function DrillResultClient({
  drill,
  relatedDrill,
}: {
  drill: DrillSet;
  relatedDrill?: Pick<DrillSet, "drillId" | "title">;
}) {
  const [result, setResult] = useState<SavedDrillResult | null | undefined>(undefined);

  useEffect(() => {
    let isMounted = true;
    queueMicrotask(() => {
      if (isMounted) {
        setResult(getSavedDrillResult(drill.drillId));
      }
    });
    return () => {
      isMounted = false;
    };
  }, [drill.drillId]);

  if (result === undefined) {
    return (
      <section className="test-panel p-6">
        <h1 className="text-2xl font-semibold text-slate-950">Loading drill result</h1>
        <p className="mt-3 text-slate-600">Checking saved practice result in this browser.</p>
      </section>
    );
  }

  if (!result) {
    return (
      <section className="test-panel p-6">
        <h1 className="text-2xl font-semibold text-slate-950">No completed drill found</h1>
        <p className="mt-3 max-w-2xl leading-7 text-slate-600">
          This browser does not have a saved result for this drill yet. Start the drill first to receive feedback.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href={`/practice/drills/${drill.drillId}`} className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white">
            Start drill
          </Link>
          <Link href="/practice" className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
            Back to Practice Hub
          </Link>
        </div>
      </section>
    );
  }

  const score = result.score;
  const focusLabel = drill.questionType ? QUESTION_TYPE_LABELS[drill.questionType] : drill.skill;

  return (
    <div className="space-y-5">
      <section className="test-panel p-6">
        <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">Drill result</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{drill.title}</h1>
            <p className="mt-3 max-w-3xl leading-7 text-slate-600">
              You scored {score.rawScore} out of {score.totalQuestions} on this {focusLabel} practice drill.
              Short drills do not produce an IELTS band estimate.
            </p>
            <p className="mt-3 rounded-md bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">{score.feedback}</p>
          </div>
          <dl className="grid grid-cols-2 gap-3">
            <div className="rounded-md bg-slate-50 p-4">
              <dt className="text-sm text-slate-500">Raw score</dt>
              <dd className="mt-1 text-3xl font-semibold text-slate-950">
                {score.rawScore}/{score.totalQuestions}
              </dd>
            </div>
            <div className="rounded-md bg-slate-50 p-4">
              <dt className="text-sm text-slate-500">Accuracy</dt>
              <dd className="mt-1 text-3xl font-semibold text-slate-950">{score.percentage}%</dd>
            </div>
            <div className="rounded-md bg-slate-50 p-4">
              <dt className="text-sm text-slate-500">Incorrect</dt>
              <dd className="mt-1 text-3xl font-semibold text-slate-950">{score.incorrect}</dd>
            </div>
            <div className="rounded-md bg-slate-50 p-4">
              <dt className="text-sm text-slate-500">Unanswered</dt>
              <dd className="mt-1 text-3xl font-semibold text-slate-950">{score.unanswered}</dd>
            </div>
          </dl>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/practice/drills/${drill.drillId}/review`}
            className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Review answers
          </Link>
          <Link
            href={`/practice/drills/${drill.drillId}`}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Retry drill
          </Link>
          {relatedDrill ? (
            <Link
              href={`/practice/drills/${relatedDrill.drillId}`}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Try similar drill
            </Link>
          ) : null}
          <Link
            href="/practice"
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Back to Practice Hub
          </Link>
        </div>
      </section>

      <section className="test-panel p-6">
        <h2 className="text-xl font-semibold tracking-tight text-slate-950">Mistake pattern</h2>
        <p className="mt-3 max-w-3xl leading-7 text-slate-700">{score.mistakeSummary}</p>
        <p className="mt-3 rounded-md bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">
          <strong>Strategy reminder:</strong> {score.strategyReminder}
        </p>
      </section>

      <PerformanceBreakdown
        title="Skill performance"
        description="This shows which reading skills appeared in the drill and how accurately you handled them."
        entries={score.skillPerformance}
        strongest={score.strongestSkill}
        weakest={score.weakestSkill}
      />

      <PerformanceBreakdown
        title="Trap type pattern"
        description="This shows the traps connected to the drill questions and your mistakes."
        entries={score.trapTypePerformance}
        strongest={undefined}
        weakest={score.mostCommonTrap}
      />

      <section className="test-panel p-6">
        <h2 className="text-xl font-semibold tracking-tight text-slate-950">Recommended next practice</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {score.recommendations.map((recommendation) => (
            <article key={recommendation.id} className="rounded-md border border-slate-200 p-4">
              <h3 className="font-semibold text-slate-950">{recommendation.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">{recommendation.description}</p>
              <Link
                href={recommendation.href}
                className="mt-4 inline-flex rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Open
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
