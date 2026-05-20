"use client";

import type { QuestionResult } from "@/lib/scoring";
import { QUESTION_TYPE_LABELS } from "@/lib/question-labels";

export function ReviewQuestion({ result, passageTitle }: { result: QuestionResult; passageTitle?: string }) {
  const label =
    result.status === "correct" ? "Correct" : result.status === "unanswered" ? "Unanswered" : "Incorrect";

  return (
    <article className="rounded-md border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-950">Question {result.question.questionNumber}</h3>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Passage {result.question.passageId.replace("p", "")} · {QUESTION_TYPE_LABELS[result.question.type]}
          </p>
        </div>
        <span
          className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
            result.status === "correct"
              ? "bg-emerald-50 text-emerald-800"
              : result.status === "unanswered"
                ? "bg-amber-50 text-amber-800"
                : "bg-rose-50 text-rose-800"
          }`}
        >
          {label}
        </span>
      </div>
      <p className="mt-3 leading-7 text-slate-900">{result.question.prompt}</p>
      <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
        <div className="rounded-md bg-slate-50 p-3">
          <dt className="text-slate-500">Your answer</dt>
          <dd className="mt-1 font-semibold text-slate-950">{result.userAnswer || "No answer"}</dd>
        </div>
        <div className="rounded-md bg-emerald-50 p-3">
          <dt className="text-emerald-800">Correct answer</dt>
          <dd className="mt-1 font-semibold text-emerald-950">{result.question.answer}</dd>
        </div>
      </dl>
      <div className="mt-4 space-y-3">
        <details className="rounded-md border border-slate-200 bg-slate-50 p-3" open>
          <summary className="cursor-pointer text-sm font-semibold text-slate-950">Evidence</summary>
          <div className="mt-3 text-sm leading-6 text-slate-700">
            {passageTitle ? (
              <p>
                <strong>Passage title:</strong> {passageTitle}
              </p>
            ) : null}
            <p>
              <strong>Reference:</strong> {result.question.evidenceParagraph ?? "Evidence not specified"}
            </p>
            <p className="mt-2">{result.question.evidenceText ?? "No evidence text is available for this item."}</p>
          </div>
        </details>
        <details className="rounded-md border border-slate-200 bg-white p-3" open>
          <summary className="cursor-pointer text-sm font-semibold text-slate-950">Explanation</summary>
          <div className="mt-3 space-y-3 text-sm leading-6 text-slate-700">
            <p>
              <strong>Short explanation:</strong> {result.question.explanation}
            </p>
            <p>
              <strong>Why the correct answer is correct:</strong> {result.question.whyCorrect}
            </p>
            {result.status !== "correct" ? (
              <p>
                <strong>Why your answer was incorrect:</strong> {result.question.whyWrong}
              </p>
            ) : null}
          </div>
        </details>
      </div>
      <dl className="mt-4 grid gap-3 text-xs font-medium uppercase tracking-[0.14em] text-slate-500 md:grid-cols-3">
        <div>
          <dt>Skill</dt>
          <dd className="mt-1 text-sm normal-case tracking-normal text-slate-800">{result.question.skill}</dd>
        </div>
        <div>
          <dt>Trap Type</dt>
          <dd className="mt-1 text-sm normal-case tracking-normal text-slate-800">{result.question.trapType}</dd>
        </div>
        <div>
          <dt>Difficulty</dt>
          <dd className="mt-1 text-sm normal-case tracking-normal text-slate-800">{result.question.difficulty}</dd>
        </div>
      </dl>
      {result.question.secondarySkills?.length ? (
        <p className="mt-3 text-sm leading-6 text-slate-600">
          <strong>Secondary skills:</strong> {result.question.secondarySkills.join(", ")}
        </p>
      ) : null}
      <p className="mt-4 rounded-md bg-amber-50 px-3 py-2 text-sm leading-6 text-amber-950">
        <strong>Strategy tip:</strong> {result.question.strategyTip}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
          disabled
        >
          Mark for Review
        </button>
        <button
          type="button"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
          disabled
        >
          Practice Similar Questions
        </button>
      </div>
    </article>
  );
}
