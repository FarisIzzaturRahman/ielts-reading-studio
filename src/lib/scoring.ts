import type { Question, QuestionType, ReadingTest, SkillTag, UserAnswers } from "@/data/types";

export type QuestionResult = {
  question: Question;
  userAnswer: string;
  isCorrect: boolean;
  status: "correct" | "incorrect" | "unanswered";
};

export type SkillBreakdown = Record<
  SkillTag,
  {
    correct: number;
    total: number;
  }
>;

export type ScoreResult = {
  correct: number;
  total: number;
  unanswered: number;
  incorrect: number;
  percentage: number;
  estimatedBand: string;
  questionResults: QuestionResult[];
  skillBreakdown: SkillBreakdown;
  typeBreakdown: Record<QuestionType, { correct: number; total: number }>;
};

export function normalizeAnswer(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[.,;:!?()[\]"']/g, "")
    .replace(/\s+/g, " ");
}

export function isAnswerCorrect(question: Question, rawAnswer = "") {
  if (!rawAnswer.trim()) {
    return false;
  }

  const normalizedUserAnswer = normalizeAnswer(rawAnswer);
  const accepted = [question.answer, ...(question.acceptedAnswers ?? [])].map(normalizeAnswer);

  return accepted.includes(normalizedUserAnswer);
}

export function estimateMiniBand(correct: number, total = 20) {
  const scaledCorrect = total === 20 ? correct : Math.round((correct / Math.max(total, 1)) * 20);

  if (scaledCorrect >= 18) return "8.5-9.0";
  if (scaledCorrect >= 16) return "8.0";
  if (scaledCorrect >= 14) return "7.0-7.5";
  if (scaledCorrect >= 12) return "6.5";
  if (scaledCorrect >= 10) return "6.0";
  if (scaledCorrect >= 8) return "5.5";
  if (scaledCorrect >= 6) return "5.0";
  return "Below 5.0";
}

export function scoreTest(test: ReadingTest, answers: UserAnswers): ScoreResult {
  const questionResults = test.questions.map((question) => {
    const userAnswer = answers[question.id] ?? "";
    const isUnanswered = !userAnswer.trim();
    const isCorrect = isAnswerCorrect(question, userAnswer);
    const status: QuestionResult["status"] = isUnanswered ? "unanswered" : isCorrect ? "correct" : "incorrect";

    return {
      question,
      userAnswer,
      isCorrect,
      status,
    };
  });

  const correct = questionResults.filter((result) => result.isCorrect).length;
  const unanswered = questionResults.filter((result) => !result.userAnswer.trim()).length;
  const incorrect = test.questions.length - correct - unanswered;
  const skillBreakdown = questionResults.reduce((acc, result) => {
    const existing = acc[result.question.skill] ?? { correct: 0, total: 0 };
    acc[result.question.skill] = {
      correct: existing.correct + (result.isCorrect ? 1 : 0),
      total: existing.total + 1,
    };
    return acc;
  }, {} as SkillBreakdown);
  const typeBreakdown = questionResults.reduce(
    (acc, result) => {
      const existing = acc[result.question.type] ?? { correct: 0, total: 0 };
      acc[result.question.type] = {
        correct: existing.correct + (result.isCorrect ? 1 : 0),
        total: existing.total + 1,
      };
      return acc;
    },
    {} as Record<QuestionType, { correct: number; total: number }>,
  );
  const total = test.questions.length;

  return {
    correct,
    total,
    unanswered,
    incorrect,
    percentage: total ? Math.round((correct / total) * 100) : 0,
    estimatedBand: estimateMiniBand(correct, total),
    questionResults,
    skillBreakdown,
    typeBreakdown,
  };
}

export function formatDuration(totalSeconds: number) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
