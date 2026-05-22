"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ReadingTest } from "@/data/types";
import { getRecommendedNextTest } from "@/data/tests";
import { getSavedResult } from "@/lib/attempt";
import { generateDiagnosis } from "@/lib/diagnosis";
import { scoreTest } from "@/lib/scoring";
import type { SavedResult } from "@/lib/storage";
import { getTestPath } from "@/lib/test-routing";
import { MistakePatternSummary } from "./MistakePatternSummary";
import { PerformanceBreakdown } from "./PerformanceBreakdown";
import { Recommendations } from "./Recommendations";
import { ResultSummary } from "./ResultSummary";
import { ReviewQuestion } from "./ReviewQuestion";

export function ResultPageClient({ test }: { test: ReadingTest }) {
  const [savedResult, setSavedResult] = useState<SavedResult | null>(null);
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
          href={getTestPath(test, "instructions")}
          className="mt-6 inline-flex rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
        >
          Go to instructions
        </Link>
      </div>
    );
  }

  const score = scoreTest(test, savedResult.answers);
  const diagnosis = savedResult.diagnosis ?? generateDiagnosis(test.testId, score, savedResult.submittedAt);
  const nextTest = getRecommendedNextTest(test.testId, score.correct);

  return (
    <div className="space-y-6">
      <ResultSummary
        test={test}
        score={score}
        diagnosis={diagnosis}
        elapsedSeconds={savedResult.elapsedSeconds}
        nextTest={nextTest}
      />
      <div className="grid gap-6 xl:grid-cols-2">
        <PerformanceBreakdown
          title="Performance by question type"
          description="This shows which IELTS Academic Reading task formats were easiest and hardest in this attempt."
          entries={diagnosis.questionTypePerformance}
          strongest={diagnosis.strongestQuestionType}
          weakest={diagnosis.weakestQuestionType}
        />
        <PerformanceBreakdown
          title="Performance by reading skill"
          description="This shows the underlying reading skills tested by your correct, incorrect and unanswered questions."
          entries={diagnosis.skillPerformance}
          strongest={diagnosis.strongestSkill}
          weakest={diagnosis.weakestSkill}
        />
      </div>
      <PerformanceBreakdown
        title="Trap type pattern"
        description="Trap types explain why an attractive wrong answer may seem correct before the evidence is checked carefully."
        entries={diagnosis.trapTypePerformance}
        weakest={diagnosis.mostCommonTrap}
      />
      <MistakePatternSummary diagnosis={diagnosis} />
      <Recommendations recommendations={diagnosis.recommendations} />
      <section id="answer-explanations" className="test-panel p-6">
        <h2 className="text-xl font-semibold tracking-tight text-slate-950">Answer explanations</h2>
        <div className="mt-5 grid gap-4">
          {score.questionResults.slice(0, 6).map((result) => (
            <ReviewQuestion key={result.question.id} result={result} />
          ))}
        </div>
        <Link
          href={getTestPath(test, "review")}
          className="mt-5 inline-flex rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Open full review
        </Link>
      </section>
    </div>
  );
}
