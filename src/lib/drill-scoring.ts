import type { DrillSet, QuestionType, SkillTag, TrapType, UserAnswers } from "@/data/types";
import {
  calculateQuestionTypePerformance,
  calculateSkillPerformance,
  calculateTrapTypePerformance,
  identifyMostCommonTrap,
  identifyStrongestSkill,
  identifyWeakestSkill,
  type PerformanceEntry,
} from "./diagnosis";
import { questionTypeSlug, skillSlug } from "./taxonomy";
import { isAnswerCorrect, type QuestionResult, type ScoreResult } from "./scoring";

export type DrillRecommendation = {
  id: string;
  title: string;
  description: string;
  href: string;
};

export type DrillScoreResult = {
  drillId: string;
  rawScore: number;
  totalQuestions: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  percentage: number;
  questionResults: QuestionResult[];
  questionTypePerformance: PerformanceEntry[];
  skillPerformance: PerformanceEntry[];
  trapTypePerformance: PerformanceEntry[];
  strongestSkill?: PerformanceEntry;
  weakestSkill?: PerformanceEntry;
  mostCommonTrap?: PerformanceEntry;
  mistakeSummary: string;
  feedback: string;
  strategyReminder: string;
  recommendations: DrillRecommendation[];
  completedAt: string;
};

function toScoreResult(questionResults: QuestionResult[], percentage: number): ScoreResult {
  const correct = questionResults.filter((result) => result.status === "correct").length;
  const unanswered = questionResults.filter((result) => result.status === "unanswered").length;
  const incorrect = questionResults.length - correct - unanswered;

  return {
    correct,
    total: questionResults.length,
    unanswered,
    incorrect,
    percentage,
    estimatedBand: "Not applicable",
    questionResults,
    skillBreakdown: questionResults.reduce(
      (acc, result) => {
        const existing = acc[result.question.skill] ?? { correct: 0, total: 0 };
        acc[result.question.skill] = {
          correct: existing.correct + (result.status === "correct" ? 1 : 0),
          total: existing.total + 1,
        };
        return acc;
      },
      {} as Record<SkillTag, { correct: number; total: number }>,
    ),
    typeBreakdown: questionResults.reduce(
      (acc, result) => {
        const existing = acc[result.question.type] ?? { correct: 0, total: 0 };
        acc[result.question.type] = {
          correct: existing.correct + (result.status === "correct" ? 1 : 0),
          total: existing.total + 1,
        };
        return acc;
      },
      {} as Record<QuestionType, { correct: number; total: number }>,
    ),
  };
}

export function calculateDrillAccuracy(correct: number, total: number) {
  return total ? Math.round((correct / total) * 100) : 0;
}

export function generateDrillFeedback(percentage: number) {
  if (percentage >= 90) {
    return "Excellent control of this focus area. Try a harder drill or a Band 8-9 challenge after reviewing any small errors.";
  }
  if (percentage >= 70) {
    return "Good performance. Review the incorrect answers and continue with a similar or slightly harder drill.";
  }
  if (percentage >= 50) {
    return "This area is developing. Review the strategy lesson, then retry the drill with closer evidence checking.";
  }
  return "This area needs more foundation practice. Study the strategy lesson again before retrying the drill.";
}

function trapAdvice(trap?: PerformanceEntry) {
  if (!trap) return "No single trap dominated this drill.";

  const advice: Partial<Record<TrapType, string>> = {
    "Not Given trap":
      "Your mistakes were mostly related to Not Given traps. You may be treating mentioned topics as confirmed information.",
    "Extreme wording trap":
      "Extreme wording appeared in your mistakes. Recheck words such as all, every, always, never and only.",
    "Similar keyword trap":
      "Similar keyword traps appeared in your mistakes. Check meaning, not only repeated words.",
    "Partial match trap":
      "Partial matches appeared in your mistakes. Make sure the whole question is answered, not just one detail.",
    "Wrong paragraph trap":
      "Wrong paragraph traps appeared in your mistakes. Confirm the exact location before selecting an answer.",
    "Distractor detail trap":
      "Distractor details appeared in your mistakes. Eliminate options that are plausible but not directly supported.",
    "Grammar form trap":
      "Grammar form traps appeared in your mistakes. Check the words before and after each completion gap.",
    "Assumption trap":
      "Assumption traps appeared in your mistakes. Avoid adding outside knowledge beyond the passage.",
  };

  return advice[trap.label as TrapType] ?? "Review each evidence sentence and compare it with the exact question wording.";
}

export function summarizeDrillMistakes(result: {
  correct: number;
  totalQuestions: number;
  unanswered: number;
  weakestSkill?: PerformanceEntry;
  mostCommonTrap?: PerformanceEntry;
}) {
  if (result.correct === result.totalQuestions) {
    return "You answered every question correctly in this drill. Keep the same evidence-checking habits in timed mini tests.";
  }

  const unanswered =
    result.unanswered > 0
      ? ` You left ${result.unanswered} question${result.unanswered === 1 ? "" : "s"} unanswered, so speed or confidence may need attention.`
      : "";
  const skill = result.weakestSkill
    ? ` The weakest skill in this drill was ${result.weakestSkill.label}.`
    : "";

  return `${trapAdvice(result.mostCommonTrap)}${skill}${unanswered}`;
}

export function generateNextDrillRecommendations(drill: DrillSet, result: Pick<DrillScoreResult, "percentage" | "weakestSkill">) {
  const recommendations: DrillRecommendation[] = [];

  if (drill.questionType) {
    recommendations.push({
      id: `${drill.questionType}-strategy`,
      title: `Review ${drill.title.split(":")[0]} strategy`,
      description: "Read the strategy again, then retry the drill with stricter evidence checking.",
      href: `/practice/question-types/${questionTypeSlug(drill.questionType)}`,
    });
  }

  if (result.weakestSkill) {
    recommendations.push({
      id: `skill-${skillSlug(result.weakestSkill.label)}`,
      title: `Practise ${result.weakestSkill.label}`,
      description: "Move to a skill-focused page connected to the weakest area in this drill.",
      href: `/practice/skills/${skillSlug(result.weakestSkill.label)}`,
    });
  }

  if (result.percentage >= 85) {
    recommendations.push({
      id: "next-mini-test",
      title: "Take a mini Academic Reading test",
      description: "Check whether this stronger skill transfers under timed conditions.",
      href: "/tests",
    });
  } else {
    recommendations.push({
      id: "retry-drill",
      title: "Retry this drill",
      description: "Repeat the same short set after reviewing evidence and strategy notes.",
      href: `/practice/drills/${drill.drillId}`,
    });
  }

  recommendations.push({
    id: "practice-hub",
    title: "Choose another focused practice",
    description: "Use the Practice Hub to target a different IELTS Academic Reading weakness.",
    href: "/practice",
  });

  return recommendations.slice(0, 4);
}

export function scoreDrillAttempt(drill: DrillSet, answers: UserAnswers, completedAt = new Date().toISOString()): DrillScoreResult {
  const questionResults = drill.questions.map((question) => {
    const userAnswer = answers[question.id] ?? "";
    const isUnanswered = !userAnswer.trim();
    const isCorrect = isAnswerCorrect(question, userAnswer);

    return {
      question,
      userAnswer,
      isCorrect,
      status: isUnanswered ? "unanswered" : isCorrect ? "correct" : "incorrect",
    } satisfies QuestionResult;
  });

  const correct = questionResults.filter((result) => result.status === "correct").length;
  const totalQuestions = questionResults.length;
  const unanswered = questionResults.filter((result) => result.status === "unanswered").length;
  const incorrect = totalQuestions - correct - unanswered;
  const percentage = calculateDrillAccuracy(correct, totalQuestions);
  const scoreShape = toScoreResult(questionResults, percentage);
  const questionTypePerformance = calculateQuestionTypePerformance(scoreShape);
  const skillPerformance = calculateSkillPerformance(scoreShape);
  const trapTypePerformance = calculateTrapTypePerformance(scoreShape);
  const strongestSkill = identifyStrongestSkill(skillPerformance);
  const weakestSkill = identifyWeakestSkill(skillPerformance);
  const mostCommonTrap = identifyMostCommonTrap(trapTypePerformance);
  const partialResult = {
    drillId: drill.drillId,
    rawScore: correct,
    totalQuestions,
    correct,
    incorrect,
    unanswered,
    percentage,
    questionResults,
    questionTypePerformance,
    skillPerformance,
    trapTypePerformance,
    strongestSkill,
    weakestSkill,
    mostCommonTrap,
    mistakeSummary: "",
    feedback: generateDrillFeedback(percentage),
    strategyReminder: drill.description,
    recommendations: [],
    completedAt,
  };

  const mistakeSummary = summarizeDrillMistakes(partialResult);

  return {
    ...partialResult,
    mistakeSummary,
    recommendations: generateNextDrillRecommendations(drill, {
      percentage,
      weakestSkill,
    }),
  };
}
