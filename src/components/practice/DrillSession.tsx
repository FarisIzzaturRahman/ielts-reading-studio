"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { DrillSet, FlaggedQuestions, UserAnswers } from "@/data/types";
import { getStrategyLesson } from "@/data/strategy-lessons";
import { scoreDrillAttempt } from "@/lib/drill-scoring";
import { isStorageAvailable } from "@/lib/storage";
import {
  getSavedDrillProgress,
  saveDrillProgress,
  saveDrillResult,
  type SavedDrillProgress,
} from "@/lib/practice-storage";
import { PassageViewer } from "@/components/PassageViewer";
import { QuestionNavigator } from "@/components/QuestionNavigator";
import { QuestionRenderer } from "@/components/QuestionRenderer";
import { SubmitModal } from "@/components/SubmitModal";
import { StrategyLesson } from "./StrategyLesson";
import { useRouter } from "next/navigation";

export function DrillSession({ drill }: { drill: DrillSet }) {
  const router = useRouter();
  const lesson = getStrategyLesson(drill.strategyLessonId);
  const [hydrated, setHydrated] = useState(false);
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [flagged, setFlagged] = useState<FlaggedQuestions>({});
  const [activeQuestionId, setActiveQuestionId] = useState(drill.questions[0]?.id ?? 1);
  const [mobileView, setMobileView] = useState<"passage" | "questions" | "navigator">("passage");
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [storageWarning, setStorageWarning] = useState("");
  const [startedAt, setStartedAt] = useState("");

  useEffect(() => {
    let isMounted = true;
    queueMicrotask(() => {
      if (!isMounted) return;

      if (!isStorageAvailable()) {
        setStorageWarning("Local practice progress could not be saved in this browser. You can still practise in this tab.");
      }

      const saved = getSavedDrillProgress(drill.drillId);
      if (saved) {
        setAnswers(saved.answers ?? {});
        setStartedAt(saved.startedAt);
        setStarted(true);
      }
      setHydrated(true);
    });

    return () => {
      isMounted = false;
    };
  }, [drill.drillId]);

  useEffect(() => {
    if (!hydrated || !started) return;

    const progress: SavedDrillProgress = {
      version: 1,
      drillId: drill.drillId,
      answers,
      startedAt: startedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const saved = saveDrillProgress(progress);
    if (!saved) {
      queueMicrotask(() => {
        setStorageWarning("Local practice progress could not be saved in this browser. You can still practise in this tab.");
      });
    }
  }, [answers, drill.drillId, hydrated, started, startedAt]);

  const scorePreview = useMemo(() => scoreDrillAttempt(drill, answers), [answers, drill]);
  const flaggedCount = Object.values(flagged).filter(Boolean).length;

  function startDrill() {
    const now = new Date().toISOString();
    setStartedAt(now);
    setAnswers({});
    setFlagged({});
    setActiveQuestionId(drill.questions[0]?.id ?? 1);
    setStarted(true);
  }

  function handleAnswer(questionId: number, answer: string) {
    setAnswers((current) => ({ ...current, [questionId]: answer }));
    setActiveQuestionId(questionId);
  }

  function toggleFlag(questionId: number) {
    setFlagged((current) => ({ ...current, [questionId]: !current[questionId] }));
    setActiveQuestionId(questionId);
  }

  function submitDrill() {
    const score = scoreDrillAttempt(drill, answers);
    saveDrillResult({
      version: 1,
      drillId: drill.drillId,
      completedAt: score.completedAt,
      answers,
      score,
    });
    router.push(`/practice/drills/${drill.drillId}/result`);
  }

  if (!drill.passages.length || !drill.questions.length) {
    return (
      <div className="mx-auto max-w-2xl rounded-md border border-rose-200 bg-white p-6">
        <h1 className="text-2xl font-semibold text-slate-950">This drill is not available</h1>
        <p className="mt-3 text-slate-600">The passage or question data is missing. Please choose another practice drill.</p>
        <Link href="/practice" className="mt-5 inline-flex rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
          Back to Practice Hub
        </Link>
      </div>
    );
  }

  if (!hydrated) {
    return (
      <section className="test-panel p-6">
        <h1 className="text-2xl font-semibold text-slate-950">Loading this drill</h1>
        <p className="mt-3 text-slate-600">Checking saved practice progress in this browser.</p>
      </section>
    );
  }

  if (!started) {
    return (
      <div className="space-y-4">
        <Link href="/practice" className="text-sm font-semibold text-emerald-800 hover:text-emerald-700">
          Back to Practice Hub
        </Link>
        {lesson ? (
          <StrategyLesson lesson={lesson} onStart={startDrill} />
        ) : (
          <section className="test-panel p-6">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">{drill.title}</h1>
            <p className="mt-3 text-slate-600">
              The strategy lesson for this drill is not available yet. You can still start the practice set.
            </p>
            <button
              type="button"
              onClick={startDrill}
              className="mt-6 rounded-md bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Start practice
            </button>
          </section>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-stone-50/95 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link href="/practice" className="text-sm font-medium text-emerald-800 hover:text-emerald-700">
              Back to Practice Hub
            </Link>
            <h1 className="mt-1 text-lg font-semibold text-slate-950">{drill.title}</h1>
            <p className="mt-1 text-sm text-slate-600">Suggested time: {drill.estimatedTimeMinutes} minutes</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
              Answered {drill.questions.length - scorePreview.unanswered}/{drill.questions.length}
            </span>
            <button
              type="button"
              onClick={() => setShowSubmitModal(true)}
              className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Submit drill
            </button>
          </div>
        </div>
        <div className="mx-auto mt-3 flex max-w-[1440px] gap-2 lg:hidden">
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
        <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
          {storageWarning}
        </p>
      ) : null}
      <main className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.8fr)]">
        <div className={mobileView === "passage" ? "block" : "hidden lg:block"}>
          <PassageViewer passages={drill.passages} highlights={[]} onAddHighlight={() => undefined} readOnly />
        </div>
        <section className="space-y-4">
          <div className={mobileView === "navigator" ? "space-y-4" : "hidden space-y-4 lg:block"}>
            <QuestionNavigator
              questions={drill.questions}
              answers={answers}
              flagged={flagged}
              activeQuestionId={activeQuestionId}
              onSelectQuestion={(questionId) => {
                setActiveQuestionId(questionId);
                setMobileView("questions");
              }}
            />
          </div>
          <div className={mobileView === "questions" ? "block" : "hidden lg:block"}>
            <QuestionRenderer
              questions={drill.questions}
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
          answered={drill.questions.length - scorePreview.unanswered}
          unanswered={scorePreview.unanswered}
          flagged={flaggedCount}
          title="Submit this drill?"
          completeMessage="All questions have an answer. Submit now to see focused practice feedback."
          warning="Submission is final for this drill attempt. You can retry the drill after reviewing your answers."
          cancelLabel="Return to drill"
          confirmLabel="Submit drill"
          onCancel={() => setShowSubmitModal(false)}
          onConfirm={submitDrill}
        />
      ) : null}
    </div>
  );
}
