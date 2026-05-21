import type { DrillSet, Passage, Question, QuestionType, SkillTag, TrapType } from "./types";
import { QUESTION_TYPES } from "./taxonomy/question-types";
import { READING_SKILLS } from "./taxonomy/skills";
import { skillSlug } from "./taxonomy/skills";
import { slugifyLabel } from "./taxonomy/utils";
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
  trapFocusOverride?: TrapType[];
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
  const trapFocus = blueprint.trapFocusOverride ?? inferTrapFocus(questions);
  const drillWithoutMetadata: Omit<DrillSet, "metadata"> = {
    ...baseDrill,
    passages,
    questions,
    trapFocus,
    targetBand: inferTargetBand(blueprint.difficulty),
    totalQuestions: questions.length,
    topicFocus: inferTopicFocus(passages),
    recommendationCategory: blueprint.drillId.startsWith("trap-")
      ? "trap-repair"
      : blueprint.drillId.startsWith("band9-")
        ? "challenge-test"
        : recommendationCategoryForDrill({
            practiceMode: blueprint.practiceMode,
            trapFocus: [],
            questionType: blueprint.questionType,
            skill: blueprint.skill,
          }),
    tags: [
      "academic-reading",
      "focused-drill",
      blueprint.drillId.includes("001") ? "phase-2b-launch-drill" : "phase-3a2-drill-expansion",
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

const seedDrillBlueprints: DrillBlueprint[] = [
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

function testId(number: number) {
  const normalized = ((number - 1) % 30) + 1;
  return `test-${String(normalized).padStart(2, "0")}`;
}

function windowRefs(startTestNumber: number, questionIds: number[], length = 5): DrillReference[] {
  return Array.from({ length }, (_, index) => ({
    testId: testId(startTestNumber + index),
    questionId: questionIds[index % questionIds.length],
  }));
}

const questionIdsByType: Record<QuestionType, number[]> = {
  "true-false-not-given": [1, 2, 3, 11],
  "yes-no-not-given": [10, 20],
  "multiple-choice": [4, 17],
  "matching-headings": [5],
  "matching-information": [9],
  "matching-features": [12],
  "sentence-completion": [6],
  "summary-completion": [8],
  "note-completion": [13],
  "table-completion": [14],
  "flow-chart-completion": [15],
  "short-answer": [7, 19],
  "diagram-label-completion": [16],
  "matching-sentence-endings": [18],
};

const lessonIdByQuestionType: Record<QuestionType, string> = {
  "true-false-not-given": "strategy-tfng",
  "yes-no-not-given": "strategy-yes-no-not-given",
  "multiple-choice": "strategy-multiple-choice",
  "matching-headings": "strategy-matching-headings",
  "matching-information": "strategy-matching-information",
  "matching-features": "strategy-matching-features",
  "sentence-completion": "strategy-sentence-completion",
  "summary-completion": "strategy-summary-completion",
  "note-completion": "strategy-note-completion",
  "table-completion": "strategy-table-completion",
  "flow-chart-completion": "strategy-flow-chart-completion",
  "short-answer": "strategy-short-answer-questions",
  "diagram-label-completion": "strategy-diagram-label-completion",
  "matching-sentence-endings": "strategy-matching-sentence-endings",
};

const lessonIdBySkill: Partial<Record<SkillTag, string>> = {
  "Recognising paraphrase": "strategy-paraphrase",
  "Understanding main idea": "strategy-main-idea",
  "Making inference": "strategy-inference",
  "Time-efficient scanning": "strategy-scanning",
};

function strategyLessonForSkill(skill: SkillTag) {
  return lessonIdBySkill[skill] ?? `strategy-skill-${skillSlug(skill)}`;
}

function primarySkillForQuestionType(questionType: QuestionType): SkillTag[] {
  return QUESTION_TYPES.find((item) => item.id === questionType)?.commonSkills.slice(0, 2) ?? ["Understanding detail"];
}

function questionTypeDrillBlueprints(): DrillBlueprint[] {
  return QUESTION_TYPES.flatMap((questionType, questionTypeIndex) =>
    [2, 3, 4].map((variant) => ({
      drillId: `${questionType.slug}-drill-${String(variant).padStart(3, "0")}`,
      title: `${questionType.displayName} Drill ${variant}: ${variant === 2 ? "Evidence Control" : variant === 3 ? "Paraphrase and Traps" : "Timed Accuracy"}`,
      practiceMode: "question-type" as const,
      questionType: questionType.id,
      skillFocus: primarySkillForQuestionType(questionType.id),
      difficulty: variant === 4 ? "Hard" : questionType.difficulty,
      estimatedTimeMinutes: variant === 4 ? 10 : questionType.estimatedTimeMinutes,
      description: `Structured ${questionType.displayName} practice using original Academic Reading excerpts from the expanded library.`,
      strategyLessonId: lessonIdByQuestionType[questionType.id],
      refs: windowRefs(16 + questionTypeIndex + variant, questionIdsByType[questionType.id]),
    })),
  );
}

function skillDrillBlueprints(): DrillBlueprint[] {
  return READING_SKILLS.map((skill, index) => {
    const questionIds = skill.commonQuestionTypes.flatMap((questionType) => questionIdsByType[questionType]).slice(0, 5);

    return {
      drillId: `skill-${skill.slug}-drill-001`,
      title: `${skill.displayName} Drill 1`,
      practiceMode: "skill",
      skill: skill.id,
      skillFocus: [skill.id],
      difficulty: skill.difficulty,
      estimatedTimeMinutes: skill.estimatedTimeMinutes,
      description: `Focused Academic Reading practice for ${skill.displayName.toLowerCase()}.`,
      strategyLessonId: strategyLessonForSkill(skill.id),
      refs: windowRefs(3 + index * 2, questionIds.length ? questionIds : [1, 4, 8, 9, 17]),
    };
  });
}

const trapDrillSpecs: Array<{
  trapType: TrapType;
  title: string;
  skill: SkillTag;
  questionIds: number[];
  strategyLessonId: string;
  difficulty: DrillBlueprint["difficulty"];
}> = [
  {
    trapType: "Not Given trap",
    title: "Not Given Trap Drill 1",
    skill: "Distinguishing fact from claim",
    questionIds: [3],
    strategyLessonId: "strategy-tfng",
    difficulty: "Medium",
  },
  {
    trapType: "Extreme wording trap",
    title: "Extreme Wording Drill 1",
    skill: "Avoiding overgeneralisation",
    questionIds: [2, 11],
    strategyLessonId: "strategy-tfng",
    difficulty: "Medium",
  },
  {
    trapType: "Overgeneralisation trap",
    title: "Overgeneralisation Drill 1",
    skill: "Avoiding overgeneralisation",
    questionIds: [1],
    strategyLessonId: "strategy-tfng",
    difficulty: "Medium",
  },
  {
    trapType: "Partial match trap",
    title: "Partial Match Drill 1",
    skill: "Understanding main idea",
    questionIds: [5, 18],
    strategyLessonId: "strategy-main-idea",
    difficulty: "Medium",
  },
  {
    trapType: "Similar keyword trap",
    title: "Similar Keyword Drill 1",
    skill: "Locating explicit information",
    questionIds: [7, 12, 14, 19],
    strategyLessonId: "strategy-matching-information",
    difficulty: "Medium",
  },
  {
    trapType: "Wrong paragraph trap",
    title: "Wrong Paragraph Drill 1",
    skill: "Time-efficient scanning",
    questionIds: [9],
    strategyLessonId: "strategy-scanning",
    difficulty: "Medium",
  },
  {
    trapType: "Distractor detail trap",
    title: "Distractor Detail Drill 1",
    skill: "Recognising paraphrase",
    questionIds: [4, 17],
    strategyLessonId: "strategy-multiple-choice",
    difficulty: "Hard",
  },
  {
    trapType: "Grammar form trap",
    title: "Grammar Form Drill 1",
    skill: "Understanding vocabulary in context",
    questionIds: [6, 13, 14],
    strategyLessonId: "strategy-summary-completion",
    difficulty: "Medium",
  },
  {
    trapType: "Cause-effect confusion",
    title: "Cause and Effect Trap Drill 1",
    skill: "Recognising cause and effect",
    questionIds: [15, 16],
    strategyLessonId: "strategy-skill-recognising-cause-and-effect",
    difficulty: "Hard",
  },
  {
    trapType: "Synonym trap",
    title: "Synonym Trap Drill 1",
    skill: "Recognising paraphrase",
    questionIds: [8],
    strategyLessonId: "strategy-summary-completion",
    difficulty: "Medium",
  },
  {
    trapType: "Opposite meaning trap",
    title: "Opposite Meaning Drill 1",
    skill: "Recognising contrast",
    questionIds: [2, 11],
    strategyLessonId: "strategy-skill-recognising-contrast",
    difficulty: "Medium",
  },
  {
    trapType: "Chronology trap",
    title: "Chronology Trap Drill 1",
    skill: "Following reference words",
    questionIds: [15, 18],
    strategyLessonId: "strategy-skill-following-reference-words",
    difficulty: "Medium",
  },
  {
    trapType: "Comparison confusion",
    title: "Comparison Confusion Drill 1",
    skill: "Understanding comparison",
    questionIds: [14, 17],
    strategyLessonId: "strategy-skill-understanding-comparison",
    difficulty: "Medium",
  },
  {
    trapType: "Assumption trap",
    title: "Assumption Trap Drill 1",
    skill: "Making inference",
    questionIds: [16],
    strategyLessonId: "strategy-inference",
    difficulty: "Hard",
  },
];

function trapDrillBlueprints(): DrillBlueprint[] {
  return trapDrillSpecs.map((spec, index) => ({
    drillId: `trap-${slugifyLabel(spec.trapType)}-drill-001`,
    title: spec.title,
    practiceMode: "skill",
    skill: spec.skill,
    skillFocus: [spec.skill],
    difficulty: spec.difficulty,
    estimatedTimeMinutes: spec.difficulty === "Hard" ? 10 : 8,
    description: `Trap-focused practice for ${spec.trapType.toLowerCase()} using Academic Reading evidence checks.`,
    strategyLessonId: spec.strategyLessonId,
    refs: windowRefs(6 + index * 2, spec.questionIds),
    trapFocusOverride: [spec.trapType],
  }));
}

const challengeDrillSpecs: Array<{
  drillId: string;
  title: string;
  questionType?: QuestionType;
  skill?: SkillTag;
  questionIds: number[];
  strategyLessonId: string;
}> = [
  {
    drillId: "band9-challenge-inference-001",
    title: "Band 8-9 Challenge Drill 1: Inference Under Pressure",
    skill: "Making inference",
    questionIds: [16, 17],
    strategyLessonId: "strategy-inference",
  },
  {
    drillId: "band9-challenge-multiple-choice-001",
    title: "Band 8-9 Challenge Drill 2: Advanced Distractors",
    questionType: "multiple-choice",
    questionIds: [4, 17],
    strategyLessonId: "strategy-multiple-choice",
  },
  {
    drillId: "band9-challenge-headings-001",
    title: "Band 8-9 Challenge Drill 3: Dense Paragraph Functions",
    questionType: "matching-headings",
    questionIds: [5],
    strategyLessonId: "strategy-matching-headings",
  },
  {
    drillId: "band9-challenge-ynng-001",
    title: "Band 8-9 Challenge Drill 4: Writer View and Evidence",
    questionType: "yes-no-not-given",
    questionIds: [10, 20],
    strategyLessonId: "strategy-yes-no-not-given",
  },
  {
    drillId: "band9-challenge-summary-001",
    title: "Band 8-9 Challenge Drill 5: Compressed Academic Meaning",
    questionType: "summary-completion",
    questionIds: [8, 13],
    strategyLessonId: "strategy-summary-completion",
  },
  {
    drillId: "band9-challenge-scanning-001",
    title: "Band 8-9 Challenge Drill 6: Low-Overlap Scanning",
    skill: "Time-efficient scanning",
    questionIds: [9, 19],
    strategyLessonId: "strategy-scanning",
  },
];

function challengeDrillBlueprints(): DrillBlueprint[] {
  return challengeDrillSpecs.map((spec) => ({
    drillId: spec.drillId,
    title: spec.title,
    practiceMode: spec.questionType ? "question-type" : "skill",
    questionType: spec.questionType,
    skill: spec.skill,
    skillFocus: spec.skill ? [spec.skill] : spec.questionType ? primarySkillForQuestionType(spec.questionType) : ["Making inference"],
    difficulty: "Band 8-9 Challenge",
    estimatedTimeMinutes: 12,
    description: "Advanced Academic Reading practice with denser language, subtle paraphrase and less obvious evidence.",
    strategyLessonId: spec.strategyLessonId,
    refs: mixedRefs([10, 14, 26, 28, 30].map((testNumber, itemIndex) => [testId(testNumber), spec.questionIds[itemIndex % spec.questionIds.length]])),
  }));
}

const drillBlueprints: DrillBlueprint[] = [
  ...seedDrillBlueprints,
  ...questionTypeDrillBlueprints(),
  ...skillDrillBlueprints(),
  ...trapDrillBlueprints(),
  ...challengeDrillBlueprints(),
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
