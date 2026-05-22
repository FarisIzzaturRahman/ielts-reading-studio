"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ReadingTest } from "@/data/types";
import { getAttemptStatus, startNewAttempt } from "@/lib/attempt";
import { scoreTest } from "@/lib/scoring";
import { isStorageAvailable } from "@/lib/storage";
import { getTestPath } from "@/lib/test-routing";

type AttemptState = ReturnType<typeof getAttemptStatus> | null;

export function AttemptActions({ test }: { test: ReadingTest }) {
  const router = useRouter();
  const [attemptState, setAttemptState] = useState<AttemptState>(null);
  const [storageAvailable, setStorageAvailable] = useState(true);

  useEffect(() => {
    let isMounted = true;
    queueMicrotask(() => {
      if (isMounted) {
        setStorageAvailable(isStorageAvailable());
        setAttemptState(getAttemptStatus(test));
      }
    });

    return () => {
      isMounted = false;
    };
  }, [test]);

  function beginNewAttempt() {
    const { saved } = startNewAttempt(test);
    setStorageAvailable(saved);
    router.push(getTestPath(test, "practice"));
  }

  const score = attemptState?.result ? scoreTest(test, attemptState.result.answers) : null;

  return (
    <div className="mt-8 rounded-md border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-950">
            Status: {attemptState?.status ?? "Checking saved progress"}
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            {attemptState?.status === "Completed" && score
              ? `Last score: ${score.correct}/${score.total} (${score.percentage}%), approximate Band ${score.estimatedBand}.`
              : attemptState?.status === "In Progress"
                ? "An unfinished attempt is saved in this browser."
                : "No saved attempt was found for this test."}
          </p>
          {!storageAvailable ? (
            <p className="mt-2 text-sm font-medium text-amber-800">
              Local progress could not be saved. You can still practise, but refresh recovery may not work.
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/tests"
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Back to library
          </Link>
          {attemptState?.status === "In Progress" ? (
            <Link
              href={getTestPath(test, "practice")}
              className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Continue test
            </Link>
          ) : null}
          {attemptState?.status === "Completed" ? (
            <Link
              href={getTestPath(test, "review")}
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Review last attempt
            </Link>
          ) : null}
          <button
            type="button"
            onClick={beginNewAttempt}
            className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            {attemptState?.status === "Completed"
              ? "Retake test"
              : attemptState?.status === "In Progress"
                ? "Restart test"
                : "Start test"}
          </button>
        </div>
      </div>
    </div>
  );
}
