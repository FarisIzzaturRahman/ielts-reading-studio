"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReadingTest } from "@/data/types";
import { startNewAttempt } from "@/lib/attempt";
import type { ScoreResult } from "@/lib/scoring";
import { formatDuration } from "@/lib/scoring";

export function ResultSummary({
  test,
  score,
  elapsedSeconds,
  nextTestId,
}: {
  test: ReadingTest;
  score: ScoreResult;
  elapsedSeconds: number;
  nextTestId?: string;
}) {
  const router = useRouter();
  const weakestSkill = Object.entries(score.skillBreakdown)
    .sort(([, a], [, b]) => a.correct / a.total - b.correct / b.total)
    .at(0);
  const strongestSkill = Object.entries(score.skillBreakdown)
    .sort(([, a], [, b]) => b.correct / b.total - a.correct / a.total)
    .at(0);

  function retakeTest() {
    startNewAttempt(test);
    router.push(`/tests/${test.testId}/practice`);
  }

  return (
    <section className="test-panel p-6">
      <div className="grid gap-5 lg:grid-cols-[1fr_0.7fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
            Result
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{test.title}</h1>
          <p className="mt-3 text-slate-600">
            Approximate mini-test band: <strong className="text-slate-950">{score.estimatedBand}</strong>. This
            is a {score.total}-question practice conversion, not an official IELTS band score.
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Your estimated band range is {score.estimatedBand} for this mini test.{" "}
            {strongestSkill ? `Your strongest area was ${strongestSkill[0]}. ` : ""}
            {weakestSkill ? `Review ${weakestSkill[0]} questions before starting another test.` : ""}
          </p>
        </div>
        <dl className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          <div className="rounded-md bg-slate-50 p-4">
            <dt className="text-sm text-slate-500">Raw score</dt>
            <dd className="mt-1 text-3xl font-semibold text-slate-950">
              {score.correct}/{score.total}
            </dd>
          </div>
          <div className="rounded-md bg-slate-50 p-4">
            <dt className="text-sm text-slate-500">Time used</dt>
            <dd className="mt-1 text-3xl font-semibold text-slate-950">{formatDuration(elapsedSeconds)}</dd>
          </div>
          <div className="rounded-md bg-slate-50 p-4">
            <dt className="text-sm text-slate-500">Percentage</dt>
            <dd className="mt-1 text-3xl font-semibold text-slate-950">{score.percentage}%</dd>
          </div>
          <div className="rounded-md bg-slate-50 p-4">
            <dt className="text-sm text-slate-500">Correct</dt>
            <dd className="mt-1 text-3xl font-semibold text-slate-950">{score.correct}</dd>
          </div>
          <div className="rounded-md bg-slate-50 p-4">
            <dt className="text-sm text-slate-500">Incorrect</dt>
            <dd className="mt-1 text-3xl font-semibold text-slate-950">{score.incorrect}</dd>
          </div>
          <div className="rounded-md bg-slate-50 p-4">
            <dt className="text-sm text-slate-500">Unanswered</dt>
            <dd className="mt-1 text-3xl font-semibold text-slate-950">{score.unanswered}</dd>
          </div>
          <div className="rounded-md bg-slate-50 p-4">
            <dt className="text-sm text-slate-500">Focus skill</dt>
            <dd className="mt-1 text-base font-semibold text-slate-950">
              {weakestSkill ? weakestSkill[0] : "Balanced review"}
            </dd>
          </div>
        </dl>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={`/tests/${test.testId}/review`}
          className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Review answers
        </Link>
        <button
          type="button"
          onClick={retakeTest}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Retake test
        </button>
        <Link
          href="/tests"
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Back to test library
        </Link>
        {nextTestId ? (
          <Link
            href={`/tests/${nextTestId}/instructions`}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Recommended next practice
          </Link>
        ) : null}
      </div>
    </section>
  );
}
