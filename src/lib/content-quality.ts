import { DIFFICULTY_LEVELS } from "@/data/taxonomy/difficulty";
import { QUESTION_TYPES } from "@/data/taxonomy/question-types";
import { READING_SKILLS } from "@/data/taxonomy/skills";
import { TOPICS } from "@/data/taxonomy/topics";
import { TRAP_TYPES } from "@/data/taxonomy/trap-types";
import type { ContentLibrary } from "@/lib/content-relationships";

export type DistributionEntry = {
  id: string;
  label: string;
  count: number;
  percentage: number;
};

export type DuplicateTextEntry = {
  text: string;
  count: number;
  examples: string[];
};

export type ContentQualityReport = {
  totals: {
    tests: number;
    drills: number;
    lessons: number;
    testQuestions: number;
    drillQuestions: number;
  };
  difficultyDistribution: DistributionEntry[];
  topicDistribution: DistributionEntry[];
  questionTypeDistribution: DistributionEntry[];
  skillDistribution: DistributionEntry[];
  trapDistribution: DistributionEntry[];
  duplicateQuestionPrompts: DuplicateTextEntry[];
  coverageGaps: {
    questionTypesWithoutDrills: string[];
    skillsWithoutDrills: string[];
    trapsWithoutDrills: string[];
  };
};

function increment(map: Map<string, number>, key: string) {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function distribution(
  map: Map<string, number>,
  labels: Map<string, string>,
  total: number,
): DistributionEntry[] {
  return [...map.entries()]
    .map(([id, count]) => ({
      id,
      label: labels.get(id) ?? id,
      count,
      percentage: total ? Math.round((count / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

function normalizeText(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").replace(/[^a-z0-9 ]/g, "").trim();
}

function duplicateTexts(items: Array<{ id: string; text: string }>, minimumCount = 4): DuplicateTextEntry[] {
  const groups = new Map<string, { text: string; examples: string[] }>();

  for (const item of items) {
    const normalized = normalizeText(item.text);
    if (!normalized) continue;
    const group = groups.get(normalized) ?? { text: item.text, examples: [] };
    group.examples.push(item.id);
    groups.set(normalized, group);
  }

  return [...groups.values()]
    .filter((group) => group.examples.length >= minimumCount)
    .map((group) => ({
      text: group.text,
      count: group.examples.length,
      examples: group.examples.slice(0, 8),
    }))
    .sort((a, b) => b.count - a.count);
}

export function analyzeContentLibrary(library: ContentLibrary): ContentQualityReport {
  const difficultyCounts = new Map(DIFFICULTY_LEVELS.map((item) => [item.id, 0]));
  const topicCounts = new Map<string, number>();
  const questionTypeCounts = new Map(QUESTION_TYPES.map((item) => [item.id, 0]));
  const skillCounts = new Map(READING_SKILLS.map((item) => [item.id, 0]));
  const trapCounts = new Map(TRAP_TYPES.map((item) => [item.id, 0]));
  const drillQuestionTypes = new Set<string>();
  const drillSkills = new Set<string>();
  const drillTraps = new Set<string>();
  const questionPrompts: Array<{ id: string; text: string }> = [];

  for (const test of library.tests) {
    increment(difficultyCounts, test.difficulty);

    for (const topic of test.metadata.topicFocus) {
      increment(topicCounts, topic);
    }

    for (const question of test.questions) {
      increment(questionTypeCounts, question.type);
      increment(skillCounts, question.skill);
      increment(trapCounts, question.trapType);
      questionPrompts.push({ id: `${test.testId}:q${question.questionNumber}`, text: question.prompt });
    }
  }

  for (const drill of library.drills) {
    increment(difficultyCounts, drill.difficulty);
    if (drill.questionType) drillQuestionTypes.add(drill.questionType);
    drill.skillFocus.forEach((skill) => drillSkills.add(skill));
    drill.trapFocus.forEach((trap) => drillTraps.add(trap));

    for (const topic of drill.topicFocus) {
      increment(topicCounts, topic);
    }

    for (const question of drill.questions) {
      increment(questionTypeCounts, question.type);
      increment(skillCounts, question.skill);
      increment(trapCounts, question.trapType);
      questionPrompts.push({ id: `${drill.drillId}:q${question.questionNumber}`, text: question.prompt });
    }
  }

  const totalQuestions =
    library.tests.reduce((sum, test) => sum + test.questions.length, 0) +
    library.drills.reduce((sum, drill) => sum + drill.questions.length, 0);

  return {
    totals: {
      tests: library.tests.length,
      drills: library.drills.length,
      lessons: library.lessons.length,
      testQuestions: library.tests.reduce((sum, test) => sum + test.questions.length, 0),
      drillQuestions: library.drills.reduce((sum, drill) => sum + drill.questions.length, 0),
    },
    difficultyDistribution: distribution(
      difficultyCounts,
      new Map(DIFFICULTY_LEVELS.map((item) => [item.id, item.displayName])),
      library.tests.length + library.drills.length,
    ),
    topicDistribution: distribution(
      topicCounts,
      new Map(TOPICS.map((item) => [item.id, item.displayName])),
      [...topicCounts.values()].reduce((sum, count) => sum + count, 0),
    ),
    questionTypeDistribution: distribution(
      questionTypeCounts,
      new Map(QUESTION_TYPES.map((item) => [item.id, item.displayName])),
      totalQuestions,
    ),
    skillDistribution: distribution(
      skillCounts,
      new Map(READING_SKILLS.map((item) => [item.id, item.displayName])),
      totalQuestions,
    ),
    trapDistribution: distribution(
      trapCounts,
      new Map(TRAP_TYPES.map((item) => [item.id, item.displayName])),
      totalQuestions,
    ),
    duplicateQuestionPrompts: duplicateTexts(questionPrompts),
    coverageGaps: {
      questionTypesWithoutDrills: QUESTION_TYPES.filter((item) => !drillQuestionTypes.has(item.id)).map((item) => item.displayName),
      skillsWithoutDrills: READING_SKILLS.filter((item) => !drillSkills.has(item.id)).map((item) => item.displayName),
      trapsWithoutDrills: TRAP_TYPES.filter((item) => item.id !== "No major trap" && !drillTraps.has(item.id)).map((item) => item.displayName),
    },
  };
}
