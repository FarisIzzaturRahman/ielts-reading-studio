import type { DrillSet, QuestionType, ReadingTest, SkillTag, StrategyLesson, TrapType } from "@/data/types";

export type ContentLibrary = {
  tests: ReadingTest[];
  drills: DrillSet[];
  lessons: StrategyLesson[];
};

export type ContentRelationshipIndex = {
  drillsByQuestionType: Record<string, string[]>;
  drillsBySkill: Record<string, string[]>;
  drillsByTrap: Record<string, string[]>;
  drillsByTopic: Record<string, string[]>;
  lessonsByQuestionType: Record<string, string[]>;
  lessonsBySkill: Record<string, string[]>;
  lessonsByTrap: Record<string, string[]>;
  questionsByQuestionType: Record<string, string[]>;
  questionsBySkill: Record<string, string[]>;
  questionsByTrap: Record<string, string[]>;
  testsByTopic: Record<string, string[]>;
};

export type PracticeTargetQuery = {
  questionType?: QuestionType;
  skill?: SkillTag;
  trapType?: TrapType;
  topic?: string;
};

export type PracticeTargets = {
  drillIds: string[];
  lessonIds: string[];
  testIds: string[];
};

function addToIndex(index: Map<string, Set<string>>, key: string | undefined, value: string) {
  if (!key) return;
  const values = index.get(key) ?? new Set<string>();
  values.add(value);
  index.set(key, values);
}

function toRecord(index: Map<string, Set<string>>) {
  return Object.fromEntries([...index.entries()].map(([key, values]) => [key, [...values].sort()]));
}

export function buildContentRelationshipIndex(library: ContentLibrary): ContentRelationshipIndex {
  const drillsByQuestionType = new Map<string, Set<string>>();
  const drillsBySkill = new Map<string, Set<string>>();
  const drillsByTrap = new Map<string, Set<string>>();
  const drillsByTopic = new Map<string, Set<string>>();
  const lessonsByQuestionType = new Map<string, Set<string>>();
  const lessonsBySkill = new Map<string, Set<string>>();
  const lessonsByTrap = new Map<string, Set<string>>();
  const questionsByQuestionType = new Map<string, Set<string>>();
  const questionsBySkill = new Map<string, Set<string>>();
  const questionsByTrap = new Map<string, Set<string>>();
  const testsByTopic = new Map<string, Set<string>>();

  for (const test of library.tests) {
    for (const topic of test.metadata.topicFocus) {
      addToIndex(testsByTopic, topic, test.testId);
    }

    for (const question of test.questions) {
      const questionId = `${test.testId}:q${question.questionNumber}`;
      addToIndex(questionsByQuestionType, question.type, questionId);
      addToIndex(questionsBySkill, question.skill, questionId);
      addToIndex(questionsByTrap, question.trapType, questionId);
    }
  }

  for (const drill of library.drills) {
    addToIndex(drillsByQuestionType, drill.questionType, drill.drillId);

    for (const skill of drill.skill ? [drill.skill, ...drill.skillFocus] : drill.skillFocus) {
      addToIndex(drillsBySkill, skill, drill.drillId);
    }

    for (const trap of drill.trapFocus) {
      addToIndex(drillsByTrap, trap, drill.drillId);
    }

    for (const topic of drill.topicFocus) {
      addToIndex(drillsByTopic, topic, drill.drillId);
    }

    for (const question of drill.questions) {
      const questionId = `${drill.drillId}:q${question.questionNumber}`;
      addToIndex(questionsByQuestionType, question.type, questionId);
      addToIndex(questionsBySkill, question.skill, questionId);
      addToIndex(questionsByTrap, question.trapType, questionId);
    }
  }

  for (const lesson of library.lessons) {
    for (const questionType of lesson.relatedQuestionTypes) {
      addToIndex(lessonsByQuestionType, questionType, lesson.lessonId);
    }

    for (const skill of lesson.relatedSkills) {
      addToIndex(lessonsBySkill, skill, lesson.lessonId);
    }

    for (const trap of lesson.relatedTraps) {
      addToIndex(lessonsByTrap, trap, lesson.lessonId);
    }
  }

  return {
    drillsByQuestionType: toRecord(drillsByQuestionType),
    drillsBySkill: toRecord(drillsBySkill),
    drillsByTrap: toRecord(drillsByTrap),
    drillsByTopic: toRecord(drillsByTopic),
    lessonsByQuestionType: toRecord(lessonsByQuestionType),
    lessonsBySkill: toRecord(lessonsBySkill),
    lessonsByTrap: toRecord(lessonsByTrap),
    questionsByQuestionType: toRecord(questionsByQuestionType),
    questionsBySkill: toRecord(questionsBySkill),
    questionsByTrap: toRecord(questionsByTrap),
    testsByTopic: toRecord(testsByTopic),
  };
}

export function getPracticeTargets(index: ContentRelationshipIndex, query: PracticeTargetQuery): PracticeTargets {
  const drillIds = new Set<string>();
  const lessonIds = new Set<string>();
  const testIds = new Set<string>();

  if (query.questionType) {
    index.drillsByQuestionType[query.questionType]?.forEach((id) => drillIds.add(id));
    index.lessonsByQuestionType[query.questionType]?.forEach((id) => lessonIds.add(id));
  }

  if (query.skill) {
    index.drillsBySkill[query.skill]?.forEach((id) => drillIds.add(id));
    index.lessonsBySkill[query.skill]?.forEach((id) => lessonIds.add(id));
  }

  if (query.trapType) {
    index.drillsByTrap[query.trapType]?.forEach((id) => drillIds.add(id));
    index.lessonsByTrap[query.trapType]?.forEach((id) => lessonIds.add(id));
  }

  if (query.topic) {
    index.drillsByTopic[query.topic]?.forEach((id) => drillIds.add(id));
    index.testsByTopic[query.topic]?.forEach((id) => testIds.add(id));
  }

  return {
    drillIds: [...drillIds].sort(),
    lessonIds: [...lessonIds].sort(),
    testIds: [...testIds].sort(),
  };
}
