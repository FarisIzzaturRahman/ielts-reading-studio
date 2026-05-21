import type { DrillSet, Passage, Question, QuestionType, SkillTag } from "./types";
import { readingTests } from "./tests";
import {
  buildDrillMetadata,
  buildDrillRelationships,
  buildPassageMetadata,
  buildQuestionMetadata,
  inferTargetBand,
  inferTopicFocus,
  inferTrapFocus,
  recommendationCategoryForDrill,
} from "@/lib/content-metadata";

type DrillReference = {
  testId: string;
  questionId: number;
};

type DrillBlueprint = Omit<
  DrillSet,
  | "passages"
  | "questions"
  | "trapFocus"
  | "targetBand"
  | "totalQuestions"
  | "topicFocus"
  | "recommendationCategory"
  | "tags"
  | "relationships"
  | "metadata"
> & {
  refs: DrillReference[];
};

function getSourceQuestion(ref: DrillReference) {
  const test = readingTests.find((item) => item.testId === ref.testId);
  const question = test?.questions.find((item) => item.id === ref.questionId);
  const passage = test?.passages.find((item) => item.passageId === question?.passageId);

  if (!test || !question || !passage) {
    throw new Error(`Invalid drill reference: ${ref.testId} question ${ref.questionId}`);
  }

  return { test, question, passage };
}

function evidenceParagraphText(passage: Passage, question: Question) {
  if (!question.paragraphRef) return question.evidenceText;
  return passage.paragraphs.find((paragraph) => paragraph.label === question.paragraphRef)?.text ?? question.evidenceText;
}

function createExcerptPassage(passage: Passage, question: Question, passageId: string, sourceTitle: string): Passage {
  const paragraphs = question.paragraphRef
    ? passage.paragraphs.filter((paragraph) => paragraph.label === question.paragraphRef)
    : passage.paragraphs;
  const excerptWithoutMetadata: Omit<Passage, "metadata"> = {
    ...passage,
    passageId,
    title: `${passage.title} (${sourceTitle})`,
    sourceNote: "Original IELTS-style practice excerpt created for this app.",
    paragraphs: paragraphs.length ? paragraphs : passage.paragraphs,
  };

  return {
    ...excerptWithoutMetadata,
    metadata: buildPassageMetadata(excerptWithoutMetadata, {
      difficulty: question.difficulty,
      estimatedBand: passage.metadata.estimatedBand,
      subtopic: passage.metadata.subtopic,
    }),
  };
}

function materializeDrill(blueprint: DrillBlueprint): DrillSet {
  const passages: Passage[] = [];
  const questions: Question[] = blueprint.refs.map((ref, index) => {
    const { test, question, passage } = getSourceQuestion(ref);
    const passageId = `p${index + 1}`;
    const evidenceText = evidenceParagraphText(passage, question);
    const excerpt = createExcerptPassage(passage, question, passageId, test.title);
    passages.push(excerpt);

    const questionWithoutMetadata: Omit<Question, "metadata"> = {
      ...question,
      id: index + 1,
      questionNumber: index + 1,
      passageId,
      groupTitle: question.groupTitle ? `${question.groupTitle} (${test.title})` : `Source: ${test.title}`,
      evidenceText,
      whyCorrect: `The correct answer is ${question.answer} because the evidence in the excerpt supports that meaning.`,
      tags: [...question.tags, "focused-drill", blueprint.drillId],
    };

    return {
      ...questionWithoutMetadata,
      metadata: buildQuestionMetadata(questionWithoutMetadata),
    };
  });

  const baseDrill = {
    drillId: blueprint.drillId,
    title: blueprint.title,
    practiceMode: blueprint.practiceMode,
    questionType: blueprint.questionType,
    skill: blueprint.skill,
    skillFocus: blueprint.skillFocus,
    difficulty: blueprint.difficulty,
    estimatedTimeMinutes: blueprint.estimatedTimeMinutes,
    description: blueprint.description,
    strategyLessonId: blueprint.strategyLessonId,
  };
  const drillWithoutMetadata: Omit<DrillSet, "metadata"> = {
    ...baseDrill,
    passages,
    questions,
    trapFocus: inferTrapFocus(questions),
    targetBand: inferTargetBand(blueprint.difficulty),
    totalQuestions: questions.length,
    topicFocus: inferTopicFocus(passages),
    recommendationCategory: recommendationCategoryForDrill({
      practiceMode: blueprint.practiceMode,
      trapFocus: inferTrapFocus(questions),
      questionType: blueprint.questionType,
      skill: blueprint.skill,
    }),
    tags: [
      "academic-reading",
      "focused-drill",
      blueprint.practiceMode,
      blueprint.questionType ?? "skill-practice",
      blueprint.skill ?? "question-type-practice",
      blueprint.difficulty.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    ],
    relationships: [],
  };

  return {
    ...drillWithoutMetadata,
    relationships: buildDrillRelationships(drillWithoutMetadata),
    metadata: buildDrillMetadata(drillWithoutMetadata),
  };
}

function refs(testIds: string[], questionId: number): DrillReference[] {
  return testIds.map((testId) => ({ testId, questionId }));
}

function mixedRefs(items: Array<[string, number]>): DrillReference[] {
  return items.map(([testId, questionId]) => ({ testId, questionId }));
}

const firstFive = ["test-01", "test-02", "test-03", "test-04", "test-05"];
const secondFive = ["test-06", "test-07", "test-08", "test-09", "test-10"];

const drillBlueprints: DrillBlueprint[] = [
  {
    drillId: "tfng-drill-001",
    title: "True / False / Not Given Drill 1: Exact Meaning",
    practiceMode: "question-type",
    questionType: "true-false-not-given",
    skillFocus: ["Understanding detail", "Avoiding overgeneralisation"],
    difficulty: "Medium",
    estimatedTimeMinutes: 8,
    description: "Practise deciding whether statements agree, contradict, or are not supported by the passage.",
    strategyLessonId: "strategy-tfng",
    refs: mixedRefs([
      ["test-01", 1],
      ["test-02", 2],
      ["test-03", 3],
      ["test-04", 11],
      ["test-05", 1],
    ]),
  },
  {
    drillId: "matching-headings-drill-001",
    title: "Matching Headings Drill 1: Main Ideas",
    practiceMode: "question-type",
    questionType: "matching-headings",
    skillFocus: ["Understanding main idea", "Identifying paragraph function"],
    difficulty: "Medium",
    estimatedTimeMinutes: 8,
    description: "Practise choosing headings that capture paragraph purpose rather than single details.",
    strategyLessonId: "strategy-matching-headings",
    refs: refs(firstFive, 5),
  },
  {
    drillId: "matching-information-drill-001",
    title: "Matching Information Drill 1: Locating Details",
    practiceMode: "question-type",
    questionType: "matching-information",
    skillFocus: ["Locating explicit information", "Time-efficient scanning"],
    difficulty: "Medium",
    estimatedTimeMinutes: 8,
    description: "Practise finding the paragraph that contains specific information.",
    strategyLessonId: "strategy-matching-information",
    refs: refs(firstFive, 9),
  },
  {
    drillId: "summary-completion-drill-001",
    title: "Summary Completion Drill 1: Grammar and Meaning",
    practiceMode: "question-type",
    questionType: "summary-completion",
    skillFocus: ["Recognising paraphrase", "Understanding detail"],
    difficulty: "Medium",
    estimatedTimeMinutes: 8,
    description: "Practise completing summaries with answers that fit both meaning and grammar.",
    strategyLessonId: "strategy-summary-completion",
    refs: refs(firstFive, 8),
  },
  {
    drillId: "sentence-completion-drill-001",
    title: "Sentence Completion Drill 1: Precise Details",
    practiceMode: "question-type",
    questionType: "sentence-completion",
    skillFocus: ["Understanding detail", "Understanding vocabulary in context"],
    difficulty: "Medium",
    estimatedTimeMinutes: 7,
    description: "Practise choosing concise words that complete a sentence accurately.",
    strategyLessonId: "strategy-sentence-completion",
    refs: refs(firstFive, 6),
  },
  {
    drillId: "multiple-choice-drill-001",
    title: "Multiple Choice Drill 1: Avoiding Distractors",
    practiceMode: "question-type",
    questionType: "multiple-choice",
    skillFocus: ["Recognising paraphrase", "Making inference"],
    difficulty: "Hard",
    estimatedTimeMinutes: 8,
    description: "Practise eliminating plausible but unsupported options.",
    strategyLessonId: "strategy-multiple-choice",
    refs: mixedRefs([
      ["test-01", 4],
      ["test-02", 17],
      ["test-03", 4],
      ["test-04", 17],
      ["test-05", 4],
    ]),
  },
  {
    drillId: "recognising-paraphrase-drill-001",
    title: "Recognising Paraphrase Drill 1",
    practiceMode: "skill",
    skill: "Recognising paraphrase",
    skillFocus: ["Recognising paraphrase", "Understanding detail"],
    difficulty: "Medium",
    estimatedTimeMinutes: 8,
    description: "Practise connecting IELTS question wording with equivalent passage meaning.",
    strategyLessonId: "strategy-paraphrase",
    refs: refs(secondFive, 8),
  },
  {
    drillId: "main-idea-drill-001",
    title: "Main Idea Drill 1",
    practiceMode: "skill",
    skill: "Understanding main idea",
    skillFocus: ["Understanding main idea", "Identifying paragraph function"],
    difficulty: "Medium",
    estimatedTimeMinutes: 8,
    description: "Practise identifying the central idea and function of short academic paragraphs.",
    strategyLessonId: "strategy-main-idea",
    refs: refs(secondFive, 5),
  },
  {
    drillId: "inference-drill-001",
    title: "Inference Practice Drill 1",
    practiceMode: "skill",
    skill: "Making inference",
    skillFocus: ["Making inference", "Distinguishing fact from claim"],
    difficulty: "Hard",
    estimatedTimeMinutes: 9,
    description: "Practise drawing careful conclusions from evidence without adding outside assumptions.",
    strategyLessonId: "strategy-inference",
    refs: refs(secondFive, 16),
  },
  {
    drillId: "scanning-drill-001",
    title: "Time-efficient Scanning Drill 1",
    practiceMode: "skill",
    skill: "Time-efficient scanning",
    skillFocus: ["Time-efficient scanning", "Locating explicit information"],
    difficulty: "Easy",
    estimatedTimeMinutes: 7,
    description: "Practise finding specific paragraph information quickly while checking exact meaning.",
    strategyLessonId: "strategy-scanning",
    refs: refs(secondFive, 9),
  },
];

export const practiceDrills: DrillSet[] = drillBlueprints.map(materializeDrill);

export function getDrillById(drillId: string) {
  return practiceDrills.find((drill) => drill.drillId === drillId);
}

export function getDrillsByQuestionType(questionType: QuestionType) {
  return practiceDrills.filter((drill) => drill.questionType === questionType);
}

export function getDrillsBySkill(skill: SkillTag) {
  return practiceDrills.filter((drill) => drill.skill === skill || drill.skillFocus.includes(skill));
}

export function getRelatedDrills(drill: DrillSet, limit = 3) {
  const related = practiceDrills.filter((item) => {
    if (item.drillId === drill.drillId) return false;
    if (drill.questionType && item.questionType === drill.questionType) return true;
    if (drill.skill && (item.skill === drill.skill || item.skillFocus.includes(drill.skill))) return true;
    return item.skillFocus.some((skill) => drill.skillFocus.includes(skill));
  });

  return related.slice(0, limit);
}
