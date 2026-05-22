"use client";

import type { FlaggedQuestions, Question, UserAnswers } from "@/data/types";

export function QuestionNavigator({
  questions,
  answers,
  flagged,
  activeQuestionId,
  onSelectQuestion,
}: {
  questions: Question[];
  answers: UserAnswers;
  flagged: FlaggedQuestions;
  activeQuestionId: number;
  onSelectQuestion: (questionId: number) => void;
}) {
  const answered = questions.filter((question) => answers[question.id]?.trim()).length;

  return (
    <aside className="test-panel p-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-sm font-semibold text-slate-950">Question navigator</h2>
        <span className="text-sm text-slate-500">
          {answered}/{questions.length}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-5 gap-2">
        {questions.map((question) => {
          const isAnswered = Boolean(answers[question.id]?.trim());
          const isFlagged = Boolean(flagged[question.id]);
          const isActive = activeQuestionId === question.id;

          return (
            <a
              key={question.id}
              href={`#question-${question.id}`}
              onClick={() => onSelectQuestion(question.id)}
              className={`flex h-9 items-center justify-center rounded-md border text-sm font-semibold ${
                isActive
                  ? "border-slate-950 bg-slate-950 text-white"
                  : isAnswered
                  ? "border-emerald-700 bg-emerald-700 text-white"
                  : "border-slate-300 bg-white text-slate-700"
              } ${isFlagged ? "ring-2 ring-amber-300" : ""}`}
              aria-current={isActive ? "true" : undefined}
              aria-label={`Go to question ${question.id}${isFlagged ? ", flagged" : ""}`}
            >
              {question.id}
            </a>
          );
        })}
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-500">Use the numbers to move through the test.</p>
      <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-600">
        <span className="inline-flex items-center gap-1">
          <span className="h-3 w-3 rounded-sm bg-emerald-700" /> Answered
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-3 w-3 rounded-sm border border-slate-300 bg-white" /> Blank
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-3 w-3 rounded-sm border border-amber-300 ring-2 ring-amber-300" /> Flagged
        </span>
      </div>
    </aside>
  );
}
