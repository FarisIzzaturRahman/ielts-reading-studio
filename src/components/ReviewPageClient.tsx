"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { ReadingTest } from "@/data/types";
import { getSavedResult } from "@/lib/attempt";
import { scoreTest } from "@/lib/scoring";
import { progressKey, resultKey, saveJson, type SavedResult } from "@/lib/storage";
import { getTestPath } from "@/lib/test-routing";
import { PassageViewer } from "./PassageViewer";
import { ReviewQuestion } from "./ReviewQuestion";

export function ReviewPageClient({ test }: { test: ReadingTest }) {
  const [savedResult, setSavedResult] = useState<SavedResult | null>(null);
  const [mobileView, setMobileView] = useState<"passage" | "review">("review");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;
    queueMicrotask(() => {
      if (isMounted) {
        setSavedResult(getSavedResult(test));
        setHydrated(true);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [test]);

  const score = useMemo(
    () => (savedResult ? scoreTest(test, savedResult.answers) : null),
    [savedResult, test],
  );

  function updateResultHighlights(highlights: string[]) {
    if (!savedResult) return;

    const updatedResult = {
      ...savedResult,
      testId: test.testId,
      highlights,
      updatedAt: new Date().toISOString(),
    };

    setSavedResult(updatedResult);
    saveJson(resultKey(test.testId), updatedResult);
    saveJson(progressKey(test.testId), updatedResult);
  }

  function removeHighlight(highlight: string) {
    updateResultHighlights((savedResult?.highlights ?? []).filter((item) => item !== highlight));
  }

  function clearHighlights() {
    updateResultHighlights([]);
  }

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
          href={getTestPath(test, "instructions")}
          className="mt-6 inline-flex rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
        >
          Go to instructions
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:h-[calc(100vh-8rem)] lg:min-h-[560px] lg:overflow-hidden">
      <div className="grid grid-cols-2 gap-2 lg:hidden">
        {[
          ["passage", "Passage"],
          ["review", "Review"],
        ].map(([view, label]) => (
          <button
            key={view}
            type="button"
            onClick={() => setMobileView(view as "passage" | "review")}
            className={`rounded-md border px-3 py-2 text-sm font-semibold ${
              mobileView === view
                ? "border-emerald-700 bg-emerald-700 text-white"
                : "border-slate-300 bg-white text-slate-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="grid gap-4 lg:h-full lg:min-h-0 lg:grid-cols-[minmax(420px,0.95fr)_minmax(560px,1fr)] lg:overflow-hidden">
        <div
          className={
            mobileView === "passage" ? "block lg:h-full lg:min-h-0" : "hidden lg:block lg:h-full lg:min-h-0"
          }
        >
          <PassageViewer
            passages={test.passages}
            highlights={savedResult.highlights ?? []}
            onRemoveHighlight={removeHighlight}
            onClearHighlights={clearHighlights}
            readOnly
            className="lg:h-full lg:min-h-0"
            showPassageTitle={false}
            showSourceNote={false}
          />
        </div>
        <section
          className={
            mobileView === "review"
              ? "space-y-4 lg:h-full lg:min-h-0 lg:overflow-y-auto lg:pr-1"
              : "hidden space-y-4 lg:block lg:h-full lg:min-h-0 lg:overflow-y-auto lg:pr-1"
          }
        >
          <div className="test-panel p-5">
            <Link href={getTestPath(test, "results")} className="text-sm font-medium text-emerald-800">
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
    </div>
  );
}
