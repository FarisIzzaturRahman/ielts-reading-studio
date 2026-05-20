"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { FlaggedQuestions, ReadingTest, UserAnswers } from "@/data/types";
import { buildResult, getSavedProgress, saveDiagnosisResult, startNewAttempt } from "@/lib/attempt";
import { scoreTest } from "@/lib/scoring";
import { isStorageAvailable, progressKey, resultKey, saveJson, type SavedProgress } from "@/lib/storage";
import { clampRemaining, createDeadline, secondsUntil } from "@/lib/timer";
import { PassageViewer } from "./PassageViewer";
import { QuestionNavigator } from "./QuestionNavigator";
import { QuestionRenderer } from "./QuestionRenderer";
import { SubmitModal } from "./SubmitModal";
import { Timer } from "./Timer";

export function TestRunner({ test }: { test: ReadingTest }) {
  const router = useRouter();
  const initialSeconds = test.timeLimitMinutes * 60;
  const [hydrated, setHydrated] = useState(false);
  const [needsStart, setNeedsStart] = useState(false);
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [flagged, setFlagged] = useState<FlaggedQuestions>({});
  const [notes, setNotes] = useState("");
  const [highlights, setHighlights] = useState<string[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(initialSeconds);
  const [startedAt, setStartedAt] = useState("");
  const [deadlineAt, setDeadlineAt] = useState("");
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [mobileView, setMobileView] = useState<"passage" | "questions" | "navigator">("passage");
  const [activeQuestionId, setActiveQuestionId] = useState(test.questions[0]?.id ?? 1);
  const [storageWarning, setStorageWarning] = useState("");
  const hasSubmittedRef = useRef(false);

  const applyProgress = useCallback(
    (progress: SavedProgress) => {
      const repairedDeadline = progress.deadlineAt || createDeadline(test.timeLimitMinutes);
      const fallbackRemaining = clampRemaining(progress.timeRemainingSeconds, initialSeconds);
      const remaining = secondsUntil(repairedDeadline, fallbackRemaining);

      setAnswers(progress.answers ?? {});
      setFlagged(progress.flagged ?? {});
      setNotes(progress.notes ?? "");
      setHighlights(progress.highlights ?? []);
      setStartedAt(progress.startedAt);
      setDeadlineAt(repairedDeadline);
      setTimeRemaining(remaining);
      setNeedsStart(false);
    },
    [initialSeconds, test.timeLimitMinutes],
  );

  useEffect(() => {
    let isMounted = true;
    queueMicrotask(() => {
      if (!isMounted) return;

      if (!isStorageAvailable()) {
        setStorageWarning("Local progress could not be saved in this browser. You can still practise in this tab.");
      }

      const saved = getSavedProgress(test.testId);
      if (saved?.status === "in-progress") {
        applyProgress(saved);
      } else {
        setNeedsStart(true);
      }
      setHydrated(true);
    });

    return () => {
      isMounted = false;
    };
  }, [applyProgress, test.testId]);

  useEffect(() => {
    if (!hydrated || needsStart || !deadlineAt) return;

    const interval = window.setInterval(() => {
      setTimeRemaining((current) => secondsUntil(deadlineAt, current));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [deadlineAt, hydrated, needsStart]);

  useEffect(() => {
    if (!hydrated || needsStart || hasSubmittedRef.current) return;

    const progress: SavedProgress = {
      version: 1,
      testId: test.testId,
      status: "in-progress",
      answers,
      flagged,
      notes,
      highlights,
      startedAt,
      deadlineAt,
      timeRemainingSeconds: timeRemaining,
      updatedAt: new Date().toISOString(),
    };
    const saved = saveJson(progressKey(test.testId), progress);
    if (!saved) {
      queueMicrotask(() => {
        setStorageWarning("Local progress could not be saved in this browser. You can still practise in this tab.");
      });
    }
  }, [answers, deadlineAt, flagged, highlights, hydrated, needsStart, notes, startedAt, test.testId, timeRemaining]);

  function startAttemptFromPracticePage() {
    const { progress, saved } = startNewAttempt(test);
    if (!saved) {
      setStorageWarning("Local progress could not be saved in this browser. You can still practise in this tab.");
    }
    applyProgress(progress);
    setHydrated(true);
  }

  const submitTest = useCallback(() => {
    if (hasSubmittedRef.current) return;
    hasSubmittedRef.current = true;

    const score = scoreTest(test, answers);
    const parsedStartedAt = new Date(startedAt).getTime();
    const elapsedSeconds = Number.isNaN(parsedStartedAt)
      ? initialSeconds - timeRemaining
      : Math.max(0, Math.round((Date.now() - parsedStartedAt) / 1000));
    const progress: SavedProgress = {
      version: 1,
      testId: test.testId,
      status: "in-progress",
      answers,
      flagged,
      notes,
      highlights,
      startedAt,
      deadlineAt,
      timeRemainingSeconds: timeRemaining,
      updatedAt: new Date().toISOString(),
    };
    const result = buildResult(test, progress, score, elapsedSeconds);

    saveJson(resultKey(test.testId), result);
    saveJson(progressKey(test.testId), result);
    saveDiagnosisResult(result);
    router.push(`/tests/${test.testId}/results`);
  }, [answers, deadlineAt, flagged, highlights, initialSeconds, notes, router, startedAt, test, timeRemaining]);

  useEffect(() => {
    if (timeRemaining === 0) {
      submitTest();
    }
  }, [submitTest, timeRemaining]);

  function handleAnswer(questionId: number, answer: string) {
    setAnswers((current) => ({ ...current, [questionId]: answer }));
    setActiveQuestionId(questionId);
  }

  function toggleFlag(questionId: number) {
    setFlagged((current) => ({ ...current, [questionId]: !current[questionId] }));
    setActiveQuestionId(questionId);
  }

  function addHighlight(highlight: string) {
    setHighlights((current) => (current.includes(highlight) ? current : [...current, highlight]));
  }

  const scorePreview = scoreTest(test, answers);
  const flaggedCount = Object.values(flagged).filter(Boolean).length;

  if (!test.passages.length || !test.questions.length) {
    return (
      <div className="min-h-screen bg-stone-50 px-4 py-10">
        <div className="mx-auto max-w-2xl rounded-md border border-rose-200 bg-white p-6">
          <h1 className="text-2xl font-semibold text-slate-950">This test is not available</h1>
          <p className="mt-3 text-slate-600">
            The passage or question data is missing. Please choose another IELTS Academic Reading test.
          </p>
          <Link
            href="/tests"
            className="mt-5 inline-flex rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
          >
            Back to test library
          </Link>
        </div>
      </div>
    );
  }

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-stone-50 px-4 py-10">
        <div className="mx-auto max-w-2xl rounded-md border border-slate-200 bg-white p-6">
          <h1 className="text-2xl font-semibold text-slate-950">Loading your attempt</h1>
          <p className="mt-3 text-slate-600">Checking saved progress in this browser.</p>
        </div>
      </div>
    );
  }

  if (needsStart) {
    return (
      <div className="min-h-screen bg-stone-50 px-4 py-10">
        <div className="mx-auto max-w-2xl rounded-md border border-slate-200 bg-white p-6">
          <Link href={`/tests/${test.testId}/instructions`} className="text-sm font-medium text-emerald-800">
            Back to instructions
          </Link>
          <h1 className="mt-3 text-2xl font-semibold text-slate-950">Start {test.title}</h1>
          <p className="mt-3 leading-7 text-slate-600">
            The timer starts when you begin this attempt. This free IELTS Academic Reading simulator does not
            require login; progress is saved only on this device and browser.
          </p>
          {storageWarning ? <p className="mt-3 text-sm font-medium text-amber-800">{storageWarning}</p> : null}
          <button
            type="button"
            onClick={startAttemptFromPracticePage}
            className="mt-6 rounded-md bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            Start test
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-stone-50/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <Link href="/tests" className="text-sm font-medium text-emerald-800 hover:text-emerald-700">
              Back to test library
            </Link>
            <h1 className="mt-1 text-lg font-semibold text-slate-950">{test.title}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Timer seconds={timeRemaining} />
            <span className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
              Answered {test.questions.length - scorePreview.unanswered}/{test.questions.length}
            </span>
            <button
              type="button"
              onClick={() => setShowSubmitModal(true)}
              className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Submit
            </button>
          </div>
        </div>
        <div className="mx-auto flex max-w-[1440px] gap-2 px-4 pb-3 sm:px-6 lg:hidden">
          {[
            ["passage", "Passage"],
            ["questions", "Questions"],
            ["navigator", "Review"],
          ].map(([view, label]) => (
            <button
              key={view}
              type="button"
              onClick={() => setMobileView(view as "passage" | "questions" | "navigator")}
              className={`flex-1 rounded-md border px-3 py-2 text-sm font-semibold ${
                mobileView === view
                  ? "border-emerald-700 bg-emerald-700 text-white"
                  : "border-slate-300 bg-white text-slate-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </header>
      {storageWarning ? (
        <div className="mx-auto max-w-[1440px] px-4 pt-4 sm:px-6 lg:px-8">
          <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
            {storageWarning}
          </p>
        </div>
      ) : null}
      <main className="mx-auto grid max-w-[1440px] gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.8fr)] lg:px-8">
        <div className={mobileView === "passage" ? "block" : "hidden lg:block"}>
          <PassageViewer passages={test.passages} highlights={highlights} onAddHighlight={addHighlight} />
        </div>
        <section className="space-y-4">
          <div className={mobileView === "navigator" ? "space-y-4" : "hidden space-y-4 lg:block"}>
            <QuestionNavigator
              questions={test.questions}
              answers={answers}
              flagged={flagged}
              activeQuestionId={activeQuestionId}
              onSelectQuestion={(questionId) => {
                setActiveQuestionId(questionId);
                setMobileView("questions");
              }}
            />
            <div className="test-panel p-4">
              <label htmlFor="test-notes" className="text-sm font-semibold text-slate-950">
                Notes
              </label>
              <textarea
                id="test-notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                className="mt-2 min-h-24 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                placeholder="Optional private notes for this attempt"
              />
            </div>
          </div>
          <div className={mobileView === "questions" ? "block" : "hidden lg:block"}>
            <QuestionRenderer
              questions={test.questions}
              answers={answers}
              flagged={flagged}
              activeQuestionId={activeQuestionId}
              onAnswer={handleAnswer}
              onToggleFlag={toggleFlag}
              onFocusQuestion={setActiveQuestionId}
            />
          </div>
        </section>
      </main>
      {showSubmitModal ? (
        <SubmitModal
          answered={test.questions.length - scorePreview.unanswered}
          unanswered={scorePreview.unanswered}
          flagged={flaggedCount}
          onCancel={() => setShowSubmitModal(false)}
          onConfirm={submitTest}
        />
      ) : null}
    </div>
  );
}
