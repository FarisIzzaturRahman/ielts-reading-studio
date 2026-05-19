"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ReadingTest } from "@/data/types";
import { getRecommendedNextTest } from "@/data/tests";
import { scoreTest } from "@/lib/scoring";
import { loadJson, resultKey, type SavedResult } from "@/lib/storage";
import { QuestionTypeDiagnosis } from "./QuestionTypeDiagnosis";
import { ResultSummary } from "./ResultSummary";
import { ReviewQuestion } from "./ReviewQuestion";
import { SkillDiagnosis } from "./SkillDiagnosis";

export function ResultPageClient({ test }: { test: ReadingTest }) {
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

  if (!hydrated) {
    return (
      <div className="test-panel p-8 text-center">
        <h1 className="text-2xl font-semibold text-slate-950">Loading result</h1>
        <p className="mt-3 text-slate-600">Checking saved submission data in this browser.</p>
      </div>
    );
  }

  if (!savedResult) {
    return (
      <div className="test-panel p-8 text-center">
        <h1 className="text-2xl font-semibold text-slate-950">No submitted result yet</h1>
        <p className="mt-3 text-slate-600">Start the test first, then submit it to unlock scoring and review.</p>
        <Link
          href={`/tests/${test.testId}/instructions`}
          className="mt-6 inline-flex rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
        >
          Go to instructions
        </Link>
      </div>
    );
  }

  const score = scoreTest(test, savedResult.answers);
  const nextTest = getRecommendedNextTest(test.testId, score.correct);

  return (
    <div className="space-y-6">
      <ResultSummary
        test={test}
        score={score}
        elapsedSeconds={savedResult.elapsedSeconds}
        nextTestId={nextTest?.testId}
      />
      <SkillDiagnosis skillBreakdown={score.skillBreakdown} />
      <QuestionTypeDiagnosis score={score} />
      <section className="test-panel p-6">
        <h2 className="text-xl font-semibold tracking-tight text-slate-950">Answer explanations</h2>
        <div className="mt-5 grid gap-4">
          {score.questionResults.slice(0, 6).map((result) => (
            <ReviewQuestion key={result.question.id} result={result} />
          ))}
        </div>
        <Link
          href={`/tests/${test.testId}/review`}
          className="mt-5 inline-flex rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Open full review
        </Link>
      </section>
    </div>
  );
}
