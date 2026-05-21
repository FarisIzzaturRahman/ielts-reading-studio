import type {
  ContentRelationship,
  DensityLevel,
  DrillMetadata,
  DrillSet,
  EvidenceStrength,
  LessonMetadata,
  Passage,
  PassageMetadata,
  Question,
  QuestionMetadata,
  QuestionType,
  ReadingDifficulty,
  ReadingTest,
  StrategyLesson,
  TestMetadata,
  TrapType,
} from "@/data/types";
import type { CognitiveLevel } from "@/data/taxonomy/cognitive-levels";
import { difficultySlug } from "@/data/taxonomy/difficulty";
import { questionTypeSlug } from "@/data/taxonomy/question-types";
import { skillSlug } from "@/data/taxonomy/skills";
import { inferTopicId } from "@/data/taxonomy/topics";
import { trapTypeSlug } from "@/data/taxonomy/trap-types";

const WORD_RE = /\b[\w'-]+\b/g;
const SENTENCE_RE = /[.!?]+/g;

export function countWords(text: string) {
  return text.match(WORD_RE)?.length ?? 0;
}

function countSentences(text: string) {
  return Math.max(1, text.match(SENTENCE_RE)?.length ?? 1);
}

function densityFromDifficulty(difficulty: ReadingDifficulty): DensityLevel {
  if (difficulty === "Easy") return "Low";
  if (difficulty === "Medium") return "Moderate";
  if (difficulty === "Hard") return "High";
  return "Very high";
}

function difficultyScore(difficulty: ReadingDifficulty) {
  if (difficulty === "Easy") return 35;
  if (difficulty === "Medium") return 55;
  if (difficulty === "Hard") return 75;
  return 90;
}

function batchIdFromNumber(value: number) {
  if (value <= 15) return "phase-2-seed-content";
  if (value <= 25) return "phase-3a2-batch-1";
  if (value <= 30) return "phase-3a2-challenge-and-diversity";
  return "phase-3a2-expansion";
}

function testNumberFromId(testId: string) {
  return Number(testId.match(/(\d+)$/)?.[1] ?? 0);
}

export function cognitiveLevelForQuestion(type: QuestionType, answer: string): CognitiveLevel {
  if (answer === "Not Given") return "Analyse";

  const map: Record<QuestionType, CognitiveLevel> = {
    "true-false-not-given": "Analyse",
    "yes-no-not-given": "Evaluate",
    "multiple-choice": "Infer",
    "matching-headings": "Understand",
    "matching-information": "Locate",
    "matching-features": "Locate",
    "sentence-completion": "Understand",
    "summary-completion": "Understand",
    "note-completion": "Locate",
    "table-completion": "Locate",
    "flow-chart-completion": "Analyse",
    "short-answer": "Locate",
    "diagram-label-completion": "Infer",
    "matching-sentence-endings": "Understand",
  };

  return map[type];
}

export function evidenceStrengthForQuestion(question: Pick<Question, "answer" | "evidenceParagraph" | "evidenceText" | "type">): EvidenceStrength {
  if (question.answer === "Not Given") return "Missing";
  if (!question.evidenceParagraph || !question.evidenceText) return "Distributed";
  if (question.type === "multiple-choice" || question.type === "diagram-label-completion") return "Inferred";
  if (question.evidenceText.toLowerCase().includes("paragraph")) return "Paraphrased";
  return "Direct";
}

export function buildPassageMetadata(
  passage: Omit<Passage, "metadata">,
  context: {
    difficulty: ReadingDifficulty;
    estimatedBand: string;
    subtopic?: string;
    batchId?: string;
  },
): PassageMetadata {
  const text = passage.paragraphs.map((paragraph) => paragraph.text).join(" ");
  const wordCount = countWords(text);
  const sentenceCount = countSentences(text);
  const avgSentenceLength = wordCount / sentenceCount;
  const sentenceComplexity = avgSentenceLength > 28 ? "High" : avgSentenceLength > 20 ? "Moderate" : "Low";
  const topicId = inferTopicId(`${passage.topic} ${passage.title}`);

  return {
    status: "published",
    batchId: context.batchId ?? "phase-3a2-generated-passage",
    topic: topicId,
    subtopic: context.subtopic ?? passage.topic,
    difficulty: context.difficulty,
    estimatedBand: context.estimatedBand,
    passageStyle: "Analytical",
    wordCount,
    paragraphCount: passage.paragraphs.length,
    lexicalDensity: densityFromDifficulty(context.difficulty),
    sentenceComplexity,
    inferenceDensity: context.difficulty === "Easy" ? "Low" : context.difficulty === "Medium" ? "Moderate" : "High",
    paraphraseDensity: densityFromDifficulty(context.difficulty),
    estimatedReadingTime: Math.max(1, Math.ceil(wordCount / 180)),
    tags: ["academic-reading", topicId, difficultySlug(context.difficulty), "original-content"],
  };
}

export function buildQuestionMetadata(question: Omit<Question, "metadata">): QuestionMetadata {
  const secondarySkills = question.secondarySkills ?? [];
  const evidenceStrength = evidenceStrengthForQuestion(question);
  const trapModifier = question.trapType === "No major trap" ? 0 : 8;
  const cognitiveModifier = cognitiveLevelForQuestion(question.type, question.answer) === "Infer" ? 8 : 0;

  return {
    status: "published",
    batchId: question.tags.find((tag) => tag.startsWith("phase-")) ?? "phase-3a2-generated-question",
    questionType: question.type,
    primarySkill: question.skill,
    secondarySkills,
    trapType: question.trapType,
    difficulty: question.difficulty,
    cognitiveLevel: cognitiveLevelForQuestion(question.type, question.answer),
    evidenceStrength,
    evidenceParagraph: question.evidenceParagraph,
    evidenceText: question.evidenceText,
    strategyTip: question.strategyTip,
    estimatedDifficultyScore: Math.min(100, difficultyScore(question.difficulty) + trapModifier + cognitiveModifier),
    tags: [
      ...question.tags,
      questionTypeSlug(question.type),
      skillSlug(question.skill),
      trapTypeSlug(question.trapType),
      difficultySlug(question.difficulty),
    ],
  };
}

export function recommendationCategoryForDrill(
  drill: Pick<DrillSet, "practiceMode" | "trapFocus" | "questionType" | "skill">,
): DrillMetadata["recommendationCategory"] {
  if (drill.trapFocus.length) return "trap-repair";
  if (drill.practiceMode === "question-type" && drill.questionType) return "question-type-strategy";
  if (drill.practiceMode === "skill" && drill.skill) return "skill-practice";
  return "foundation-review";
}

export function buildDrillMetadata(drill: Omit<DrillSet, "metadata">): DrillMetadata {
  return {
    status: "published",
    batchId: drill.tags.find((tag) => tag.startsWith("phase-")) ?? "phase-3a-realism-drill",
    practiceMode: drill.practiceMode,
    questionTypeFocus: drill.questionType,
    skillFocus: drill.skillFocus,
    trapFocus: drill.trapFocus,
    difficulty: drill.difficulty,
    targetBand: drill.targetBand,
    estimatedTimeMinutes: drill.estimatedTimeMinutes,
    totalQuestions: drill.questions.length,
    topicFocus: drill.topicFocus,
    recommendationCategory: drill.recommendationCategory,
    tags: drill.tags,
  };
}

export function buildLessonMetadata(lesson: Omit<StrategyLesson, "metadata">): LessonMetadata {
  return {
    status: "published",
    batchId: lesson.tags.find((tag) => tag.startsWith("phase-")) ?? "phase-3a2-lesson-expansion",
    relatedQuestionTypes: lesson.relatedQuestionTypes,
    relatedSkills: lesson.relatedSkills,
    relatedTraps: lesson.relatedTraps,
    targetLevel: lesson.targetLevel,
    estimatedStudyTime: lesson.estimatedStudyTime,
    tags: lesson.tags,
  };
}

export function buildTestMetadata(test: Omit<ReadingTest, "metadata">): TestMetadata {
  const testNumber = testNumberFromId(test.testId);

  return {
    status: "published",
    batchId: batchIdFromNumber(testNumber),
    testType: "Academic",
    difficulty: test.difficulty,
    targetBand: test.targetBand,
    totalPassages: test.passages.length,
    totalQuestions: test.questions.length,
    estimatedTimeMinutes: test.estimatedTimeMinutes,
    topicFocus: [...new Set(test.passages.map((passage) => passage.metadata.topic))],
    tags: ["academic-reading", "mini-test", difficultySlug(test.difficulty), inferTopicId(test.topic)],
  };
}

export function buildDrillRelationships(drill: Pick<DrillSet, "drillId" | "questionType" | "skill" | "skillFocus" | "trapFocus" | "strategyLessonId" | "questions" | "passages">): ContentRelationship[] {
  const relationships: ContentRelationship[] = [];

  if (drill.questionType) {
    relationships.push({
      contentType: "drill",
      contentId: drill.drillId,
      relationship: "targets-question-type",
      targetId: drill.questionType,
    });
  }

  const skillTargets = new Set(drill.skill ? [drill.skill, ...drill.skillFocus] : drill.skillFocus);

  for (const skill of skillTargets) {
    relationships.push({
      contentType: "drill",
      contentId: drill.drillId,
      relationship: "targets-skill",
      targetId: skill,
    });
  }

  for (const trap of drill.trapFocus) {
    relationships.push({
      contentType: "drill",
      contentId: drill.drillId,
      relationship: "targets-trap",
      targetId: trap,
    });
  }

  relationships.push({
    contentType: "drill",
    contentId: drill.drillId,
    relationship: "uses-lesson",
    targetId: drill.strategyLessonId,
  });

  for (const question of drill.questions) {
    relationships.push({
      contentType: "drill",
      contentId: drill.drillId,
      relationship: "contains-question",
      targetId: `${drill.drillId}:q${question.questionNumber}`,
    });
  }

  for (const passage of drill.passages) {
    relationships.push({
      contentType: "drill",
      contentId: drill.drillId,
      relationship: "contains-passage",
      targetId: `${drill.drillId}:${passage.passageId}`,
    });
  }

  return relationships;
}

export function inferTrapFocus(questions: Array<Pick<Question, "trapType">>): TrapType[] {
  return [...new Set(questions.map((question) => question.trapType).filter((trap) => trap !== "No major trap"))];
}

export function inferTopicFocus(passages: Array<Pick<Passage, "metadata">>) {
  return [...new Set(passages.map((passage) => passage.metadata.topic))];
}

export function inferTargetBand(difficulty: ReadingDifficulty) {
  if (difficulty === "Easy") return "Band 5-6";
  if (difficulty === "Medium") return "Band 6-7";
  if (difficulty === "Hard") return "Band 7-8";
  return "Band 8-9";
}

export function inferLessonTraps(commonTraps: string[]): TrapType[] {
  const knownTraps: TrapType[] = [
    "Synonym trap",
    "Opposite meaning trap",
    "Extreme wording trap",
    "Overgeneralisation trap",
    "Not Given trap",
    "Partial match trap",
    "Similar keyword trap",
    "Wrong paragraph trap",
    "Distractor detail trap",
    "Chronology trap",
    "Cause-effect confusion",
    "Comparison confusion",
    "Writer opinion confusion",
    "Grammar form trap",
    "Assumption trap",
  ];

  return knownTraps.filter((trap) =>
    commonTraps.some((item) => item.toLowerCase().includes(trap.replace(" trap", "").toLowerCase())),
  );
}
