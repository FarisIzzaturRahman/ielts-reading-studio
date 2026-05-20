import type { QuestionType, SkillTag, TrapType } from "@/data/types";
import { QUESTION_TYPE_LABELS } from "./question-labels";
import type { QuestionResult, ScoreResult } from "./scoring";
import { skillSlug } from "./taxonomy";

export type PerformanceEntry = {
  id: string;
  label: string;
  correct: number;
  incorrect: number;
  unanswered: number;
  total: number;
  accuracy: number;
};

export type Recommendation = {
  id: string;
  title: string;
  description: string;
  reason: string;
  href: string;
  priority: "high" | "medium" | "low";
};

export type DiagnosisResult = {
  testId: string;
  completedAt: string;
  rawScore: number;
  totalQuestions: number;
  percentage: number;
  estimatedBand: string;
  questionTypePerformance: PerformanceEntry[];
  skillPerformance: PerformanceEntry[];
  trapTypePerformance: PerformanceEntry[];
  strongestQuestionType?: PerformanceEntry;
  weakestQuestionType?: PerformanceEntry;
  strongestSkill?: PerformanceEntry;
  weakestSkill?: PerformanceEntry;
  mostCommonTrap?: PerformanceEntry;
  mistakeSummary: string;
  recommendations: Recommendation[];
};

type GroupKey = QuestionType | SkillTag | TrapType;

function emptyPerformance(id: string, label: string): PerformanceEntry {
  return {
    id,
    label,
    correct: 0,
    incorrect: 0,
    unanswered: 0,
    total: 0,
    accuracy: 0,
  };
}

function calculatePerformance(
  questionResults: QuestionResult[],
  getKey: (result: QuestionResult) => GroupKey,
  getLabel: (key: GroupKey) => string,
) {
  const groups = new Map<string, PerformanceEntry>();

  for (const result of questionResults) {
    const key = getKey(result);
    const id = String(key);
    const existing = groups.get(id) ?? emptyPerformance(id, getLabel(key));
    existing.total += 1;

    if (result.status === "correct") {
      existing.correct += 1;
    } else if (result.status === "unanswered") {
      existing.unanswered += 1;
    } else {
      existing.incorrect += 1;
    }

    existing.accuracy = Math.round((existing.correct / existing.total) * 100);
    groups.set(id, existing);
  }

  return [...groups.values()].sort((a, b) => a.label.localeCompare(b.label));
}

export function calculateQuestionTypePerformance(score: ScoreResult) {
  return calculatePerformance(
    score.questionResults,
    (result) => result.question.type,
    (key) => QUESTION_TYPE_LABELS[key as QuestionType],
  );
}

export function calculateSkillPerformance(score: ScoreResult) {
  return calculatePerformance(
    score.questionResults,
    (result) => result.question.skill,
    (key) => String(key),
  );
}

export function calculateTrapTypePerformance(score: ScoreResult) {
  return calculatePerformance(
    score.questionResults,
    (result) => result.question.trapType,
    (key) => String(key),
  );
}

function sortByAccuracy(entries: PerformanceEntry[]) {
  return [...entries].sort((a, b) => {
    if (a.accuracy !== b.accuracy) return a.accuracy - b.accuracy;
    return b.total - a.total;
  });
}

export function identifyStrongestQuestionType(entries: PerformanceEntry[]) {
  return sortByAccuracy(entries).reverse()[0];
}

export function identifyWeakestQuestionType(entries: PerformanceEntry[]) {
  return sortByAccuracy(entries).find((entry) => entry.total > 0);
}

export function identifyStrongestSkill(entries: PerformanceEntry[]) {
  return sortByAccuracy(entries).reverse()[0];
}

export function identifyWeakestSkill(entries: PerformanceEntry[]) {
  return sortByAccuracy(entries).find((entry) => entry.total > 0);
}

export function identifyMostCommonTrap(entries: PerformanceEntry[]) {
  return [...entries]
    .filter((entry) => entry.incorrect + entry.unanswered > 0 && entry.label !== "No major trap")
    .sort((a, b) => b.incorrect + b.unanswered - (a.incorrect + a.unanswered))[0];
}

function trapInterpretation(trap?: PerformanceEntry) {
  if (!trap) {
    return "No single trap dominated your mistakes in this attempt.";
  }

  const map: Record<string, string> = {
    "Not Given trap":
      "You may be treating mentioned topics as confirmed information. In IELTS Reading, Not Given means the passage does not provide enough evidence to confirm or contradict the statement.",
    "Extreme wording trap":
      "Absolute words may be changing the meaning of the statement. Check words such as all, always, never, only, every and completely.",
    "Overgeneralisation trap":
      "You may be choosing answers that are broader than the passage evidence supports.",
    "Partial match trap":
      "You may be matching one attractive detail while missing the full meaning required by the question.",
    "Similar keyword trap":
      "You may be relying on repeated keywords instead of checking whether the meaning is the same.",
    "Wrong paragraph trap":
      "You may be locating a related idea but not the exact paragraph that answers the question.",
    "Distractor detail trap":
      "You may be choosing options that are true or plausible but do not answer this specific question.",
    "Grammar form trap":
      "You may be finding the right passage area but not checking that the answer fits the sentence grammar.",
    "Assumption trap":
      "You may be adding outside knowledge or assumptions beyond what the passage supports.",
  };

  return map[trap.label] ?? "Review the evidence sentence for each mistake and compare it with the exact wording of the question.";
}

export function generateMistakeSummary(score: ScoreResult, diagnosis: {
  weakestQuestionType?: PerformanceEntry;
  weakestSkill?: PerformanceEntry;
  mostCommonTrap?: PerformanceEntry;
}) {
  if (score.correct === score.total) {
    return "You answered every question correctly in this mini test. Keep practising with harder Academic Reading passages to maintain accuracy under time pressure.";
  }

  const unansweredNote =
    score.unanswered > 0
      ? ` You left ${score.unanswered} question${score.unanswered === 1 ? "" : "s"} unanswered, so time management should also be reviewed.`
      : "";

  if (diagnosis.weakestQuestionType && diagnosis.weakestSkill) {
    return `Your main mistake pattern was in ${diagnosis.weakestQuestionType.label}, linked most strongly to ${diagnosis.weakestSkill.label}. ${trapInterpretation(
      diagnosis.mostCommonTrap,
    )}${unansweredNote}`;
  }

  return `Your result suggests that some answers were chosen without enough evidence checking. ${trapInterpretation(
    diagnosis.mostCommonTrap,
  )}${unansweredNote}`;
}

export function generateRecommendations(score: ScoreResult, diagnosis: {
  weakestQuestionType?: PerformanceEntry;
  weakestSkill?: PerformanceEntry;
  mostCommonTrap?: PerformanceEntry;
}) {
  const recommendations: Recommendation[] = [];
  const unansweredRate = score.total ? score.unanswered / score.total : 0;

  function addRecommendation(recommendation: Recommendation) {
    if (!recommendations.some((item) => item.id === recommendation.id)) {
      recommendations.push(recommendation);
    }
  }

  if (diagnosis.weakestQuestionType?.label === "Matching Headings" && diagnosis.weakestQuestionType.accuracy < 60) {
    addRecommendation({
      id: "matching-headings-main-idea",
      title: "Review Matching Headings strategy",
      description: "Practise identifying paragraph main ideas before looking at individual details.",
      reason: "Matching Headings was your weakest question type.",
      href: "/practice/question-types/matching-headings",
      priority: "high",
    });
  }

  if (
    diagnosis.weakestQuestionType?.label === "True / False / Not Given" &&
    diagnosis.weakestQuestionType.accuracy < 60
  ) {
    addRecommendation({
      id: "tfng-exact-meaning",
      title: "Practise True / False / Not Given exact meaning",
      description: "Focus on the difference between contradiction and missing information.",
      reason: "True / False / Not Given accuracy was below 60% in this test.",
      href: "/practice/question-types/true-false-not-given",
      priority: "high",
    });
  }

  if (diagnosis.weakestSkill?.label === "Making inference" && diagnosis.weakestSkill.accuracy < 60) {
    addRecommendation({
      id: "inference-evidence",
      title: "Practise evidence-based inference",
      description: "Work on implied meaning without adding outside knowledge.",
      reason: "Making inference was your weakest reading skill.",
      href: "/practice/skills/making-inference",
      priority: "high",
    });
  }

  if (diagnosis.mostCommonTrap?.label === "Not Given trap") {
    addRecommendation({
      id: "not-given-trap",
      title: "Review Not Given traps",
      description: "Practise deciding when the passage does not give enough evidence.",
      reason: "Not Given traps appeared in your mistake pattern.",
      href: "/practice/drills/tfng-drill-001",
      priority: "medium",
    });
  }

  if (unansweredRate > 0.2) {
    addRecommendation({
      id: "timed-scanning",
      title: "Do timed scanning practice",
      description: "Use shorter drills to improve speed without losing evidence accuracy.",
      reason: "More than 20% of questions were unanswered.",
      href: "/practice/skills/time-efficient-scanning",
      priority: "high",
    });
  }

  if (score.percentage >= 85) {
    addRecommendation({
      id: "band-8-9-challenge",
      title: "Try a Band 8-9 Challenge test",
      description: "Move to dense academic passages and harder inference questions.",
      reason: "Your overall accuracy was 85% or higher.",
      href: "/tests?difficulty=band-8-9",
      priority: "medium",
    });
  }

  if (score.percentage < 50) {
    addRecommendation({
      id: "foundation-reading",
      title: "Review Academic Reading foundations",
      description: "Start with easier tests and practise vocabulary, paraphrase and exact meaning.",
      reason: "Your overall accuracy was below 50%.",
      href: "/practice",
      priority: "high",
    });
  }

  if (diagnosis.weakestSkill && diagnosis.weakestSkill.accuracy < 70) {
    addRecommendation({
      id: `skill-${diagnosis.weakestSkill.id.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      title: `Practise ${diagnosis.weakestSkill.label}`,
      description: "Review the questions linked to this skill, then try another mini test with careful evidence checking.",
      reason: `${diagnosis.weakestSkill.label} was your weakest skill area.`,
      href: `/practice/skills/${skillSlug(diagnosis.weakestSkill.label)}`,
      priority: "medium",
    });
  }

  if (recommendations.length < 2) {
    addRecommendation({
      id: "review-incorrect-first",
      title: "Review incorrect answers before retaking",
      description: "Read the evidence and why-wrong notes before starting a new attempt.",
      reason: "Focused review is the fastest way to turn this test into learning.",
      href: "#answer-explanations",
      priority: "medium",
    });
  }

  addRecommendation({
    id: "next-mini-test",
    title: "Try another Academic Reading mini test",
    description: "Use the next test to check whether the same pattern appears again.",
    reason: "Repeated timed practice helps confirm whether a weakness is consistent.",
    href: "/tests",
    priority: "low",
  });

  return recommendations.slice(0, 4);
}

export function generateDiagnosis(testId: string, score: ScoreResult, completedAt = new Date().toISOString()): DiagnosisResult {
  const questionTypePerformance = calculateQuestionTypePerformance(score);
  const skillPerformance = calculateSkillPerformance(score);
  const trapTypePerformance = calculateTrapTypePerformance(score);
  const strongestQuestionType = identifyStrongestQuestionType(questionTypePerformance);
  const weakestQuestionType = identifyWeakestQuestionType(questionTypePerformance);
  const strongestSkill = identifyStrongestSkill(skillPerformance);
  const weakestSkill = identifyWeakestSkill(skillPerformance);
  const mostCommonTrap = identifyMostCommonTrap(trapTypePerformance);
  const diagnosis = {
    weakestQuestionType,
    weakestSkill,
    mostCommonTrap,
  };

  return {
    testId,
    completedAt,
    rawScore: score.correct,
    totalQuestions: score.total,
    percentage: score.percentage,
    estimatedBand: score.estimatedBand,
    questionTypePerformance,
    skillPerformance,
    trapTypePerformance,
    strongestQuestionType,
    weakestQuestionType,
    strongestSkill,
    weakestSkill,
    mostCommonTrap,
    mistakeSummary: generateMistakeSummary(score, diagnosis),
    recommendations: generateRecommendations(score, diagnosis),
  };
}
