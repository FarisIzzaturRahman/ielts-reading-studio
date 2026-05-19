"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { ReadingTest } from "@/data/types";
import { scoreTest } from "@/lib/scoring";
import { loadJson, resultKey, type SavedResult } from "@/lib/storage";
import { PassageViewer } from "./PassageViewer";
import { ReviewQuestion } from "./ReviewQuestion";

export function ReviewPageClient({ test }: { test: ReadingTest }) {
  const [savedResult, setSavedResult] = useState<SavedResult | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;
    queueMicrotask(() => {
      if (isMounted) {
        setSavedResult(loadJson<SavedResult>(resultKey(test.testId)));
        setHydrated(true);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [test.testId]);

  const score = useMemo(
    () => (savedResult ? scoreTest(test, savedResult.answers) : null),
    [savedResult, test],
  );

  if (!hydrated) {
    return (
      <div className="test-panel p-8 text-center">
        <h1 className="text-2xl font-semibold text-slate-950">Loading review</h1>
        <p className="mt-3 text-slate-600">Checking saved submission data in this browser.</p>
      </div>
    );
  }

  if (!savedResult || !score) {
    return (
      <div className="test-panel p-8 text-center">
        <h1 className="text-2xl font-semibold text-slate-950">Review is not available yet</h1>
        <p className="mt-3 text-slate-600">Submit this test first to see the passage, your answers and explanations.</p>
        <Link
          href={`/tests/${test.testId}/instructions`}
          className="mt-6 inline-flex rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
        >
          Go to instructions
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.8fr)]">
      <PassageViewer
        passages={test.passages}
        highlights={savedResult.highlights ?? []}
        onAddHighlight={() => undefined}
        readOnly
      />
      <section className="space-y-4">
        <div className="test-panel p-5">
          <Link href={`/tests/${test.testId}/results`} className="text-sm font-medium text-emerald-800">
            Back to result
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-slate-950">Review: {test.title}</h1>
          <p className="mt-2 text-sm text-slate-600">
            Compare your answer with the accepted answer and read the explanation for each item.
          </p>
        </div>
        {score.questionResults.map((result) => (
          <ReviewQuestion key={result.question.id} result={result} />
        ))}
      </section>
    </div>
  );
}
