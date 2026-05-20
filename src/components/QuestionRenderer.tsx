"use client";

import { Flag } from "lucide-react";
import type { FlaggedQuestions, Question, UserAnswers } from "@/data/types";
import { formatPassageLabel, QUESTION_TYPE_LABELS } from "@/lib/question-labels";

export function QuestionRenderer({
  questions,
  answers,
  flagged,
  activeQuestionId,
  onAnswer,
  onToggleFlag,
  onFocusQuestion,
}: {
  questions: Question[];
  answers: UserAnswers;
  flagged: FlaggedQuestions;
  activeQuestionId: number;
  onAnswer: (questionId: number, answer: string) => void;
  onToggleFlag: (questionId: number) => void;
  onFocusQuestion: (questionId: number) => void;
}) {
  return (
    <div className="space-y-4">
      {questions.map((question) => {
        const isActive = activeQuestionId === question.id;

        return (
          <article
            id={`question-${question.id}`}
            key={question.id}
            className={`scroll-mt-32 rounded-md border bg-white p-4 ${
              isActive ? "border-slate-950 ring-2 ring-slate-200" : "border-slate-200"
            }`}
            onFocus={() => onFocusQuestion(question.id)}
          >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Question {question.questionNumber} · Passage {formatPassageLabel(question.passageId)} ·{" "}
                {QUESTION_TYPE_LABELS[question.type]}
              </p>
              {question.groupTitle ? (
                <p className="mt-2 text-sm font-medium text-emerald-800">{question.groupTitle}</p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => onToggleFlag(question.id)}
              className={`rounded-md border p-2 ${
                flagged[question.id]
                  ? "border-amber-300 bg-amber-100 text-amber-900"
                  : "border-slate-200 text-slate-500 hover:bg-slate-50"
              }`}
              aria-pressed={Boolean(flagged[question.id])}
              aria-label={`Flag question ${question.id}`}
            >
              <Flag className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <label htmlFor={`answer-${question.id}`} className="mt-4 block text-base leading-7 text-slate-900">
            {question.prompt}
          </label>
          {question.maxWords ? (
            <p className="mt-1 text-sm text-slate-500">Use no more than {question.maxWords} words.</p>
          ) : null}
          <div className="mt-4">
            {question.options?.length ? (
              <select
                id={`answer-${question.id}`}
                value={answers[question.id] ?? ""}
                onChange={(event) => onAnswer(question.id, event.target.value)}
                onFocus={() => onFocusQuestion(question.id)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="">Select an answer</option>
                {question.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={`answer-${question.id}`}
                value={answers[question.id] ?? ""}
                onChange={(event) => onAnswer(question.id, event.target.value)}
                onFocus={() => onFocusQuestion(question.id)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                placeholder="Type your answer"
              />
            )}
          </div>
          </article>
        );
      })}
    </div>
  );
}
