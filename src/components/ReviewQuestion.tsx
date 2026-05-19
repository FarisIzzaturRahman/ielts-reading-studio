"use client";

import type { QuestionResult } from "@/lib/scoring";
import { QUESTION_TYPE_LABELS } from "@/lib/question-labels";

export function ReviewQuestion({ result }: { result: QuestionResult }) {
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
      <p className="mt-4 text-sm leading-6 text-slate-700">
        <strong>Explanation:</strong> {result.question.explanation}
      </p>
      {result.question.evidenceText ? (
        <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-700">
          <p className="font-semibold text-slate-950">
            Evidence{result.question.evidenceParagraph ? `: Paragraph ${result.question.evidenceParagraph}` : ""}
          </p>
          <p className="mt-1">{result.question.evidenceText}</p>
        </div>
      ) : null}
      <dl className="mt-4 grid gap-3 text-xs font-medium uppercase tracking-[0.14em] text-slate-500 md:grid-cols-2">
        <div>
          <dt>Skill</dt>
          <dd className="mt-1 text-sm normal-case tracking-normal text-slate-800">{result.question.skill}</dd>
        </div>
        <div>
          <dt>Difficulty</dt>
          <dd className="mt-1 text-sm normal-case tracking-normal text-slate-800">{result.question.difficulty}</dd>
        </div>
      </dl>
      {result.status !== "correct" ? (
        <p className="mt-4 rounded-md bg-amber-50 px-3 py-2 text-sm leading-6 text-amber-950">
          Strategy: compare the exact wording in the question with the evidence paragraph. Watch for limiting
          words such as all, only, always, never and selected.
        </p>
      ) : null}
    </article>
  );
}
