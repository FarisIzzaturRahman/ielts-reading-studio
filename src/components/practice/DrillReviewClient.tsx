"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { DrillSet } from "@/data/types";
import { getSavedDrillResult, type SavedDrillResult } from "@/lib/practice-storage";
import { PassageViewer } from "@/components/PassageViewer";
import { ReviewQuestion } from "@/components/ReviewQuestion";

export function DrillReviewClient({
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

  const passageTitles = useMemo(() => new Map(drill.passages.map((passage) => [passage.passageId, passage.title])), [drill]);

  if (result === undefined) {
    return (
      <section className="test-panel p-6">
        <h1 className="text-2xl font-semibold text-slate-950">Loading drill review</h1>
        <p className="mt-3 text-slate-600">Checking saved practice result in this browser.</p>
      </section>
    );
  }

  if (!result) {
    return (
      <section className="test-panel p-6">
        <h1 className="text-2xl font-semibold text-slate-950">No review available</h1>
        <p className="mt-3 max-w-2xl leading-7 text-slate-600">
          Complete this drill before opening the review page. Review data is stored only in this browser.
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

  return (
    <div className="space-y-5">
      <section className="test-panel p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">Drill review</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Drill review</h1>
        <p className="mt-2 text-lg font-semibold text-slate-800">{drill.title}</p>
        <p className="mt-3 max-w-3xl leading-7 text-slate-600">
          Review each answer with evidence, why-correct notes, trap type, skill focus and strategy tips.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href={`/practice/drills/${drill.drillId}`}
            className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            Retry this drill
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
            href="/tests"
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Take a mini test
          </Link>
          <Link
            href="/practice"
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Back to Practice Hub
          </Link>
        </div>
      </section>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(420px,0.8fr)]">
        <PassageViewer passages={drill.passages} highlights={[]} onAddHighlight={() => undefined} readOnly />
        <section className="space-y-4">
          {result.score.questionResults.map((questionResult) => (
            <ReviewQuestion
              key={questionResult.question.id}
              result={questionResult}
              passageTitle={passageTitles.get(questionResult.question.passageId)}
            />
          ))}
        </section>
      </div>
    </div>
  );
}
