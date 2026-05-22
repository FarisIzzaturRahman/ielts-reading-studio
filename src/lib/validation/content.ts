import { DIFFICULTY_LEVELS } from "@/data/taxonomy/difficulty";
import { QUESTION_TYPES } from "@/data/taxonomy/question-types";
import { READING_SKILLS } from "@/data/taxonomy/skills";
import { TOPICS } from "@/data/taxonomy/topics";
import { TRAP_TYPES } from "@/data/taxonomy/trap-types";
import type {
  DrillSet,
  Passage,
  Question,
  ReadingDifficulty,
  ReadingTest,
  StrategyLesson,
} from "@/data/types";
import type { ContentLibrary } from "@/lib/content-relationships";
import { buildContentRelationshipIndex } from "@/lib/content-relationships";
import { analyzeContentLibrary } from "@/lib/content-quality";
import { countWords } from "@/lib/content-metadata";

export type ValidationSeverity = "error" | "warning";

export type ValidationIssue = {
  severity: ValidationSeverity;
  contentType: "taxonomy" | "test" | "passage" | "question" | "drill" | "lesson" | "metadata" | "relationship";
  contentId: string;
  field: string;
  message: string;
};

export type ValidationReport = {
  issues: ValidationIssue[];
  summary: {
    errors: number;
    warnings: number;
    checkedItems: number;
  };
};

const questionTypeIds = new Set(QUESTION_TYPES.map((item) => item.id));
const skillIds = new Set(READING_SKILLS.map((item) => item.id));
const trapTypeIds = new Set(TRAP_TYPES.map((item) => item.id));
const difficultyIds = new Set(DIFFICULTY_LEVELS.map((item) => item.id));
const topicIds = new Set(TOPICS.map((item) => item.id));
const contentStatuses = new Set([
  "generated",
  "realism-reviewed",
  "psychometric-reviewed",
  "finalized",
  "published",
  "draft",
  "reviewed",
  "validated",
]);

function issue(
  severity: ValidationSeverity,
  contentType: ValidationIssue["contentType"],
  contentId: string,
  field: string,
  message: string,
): ValidationIssue {
  return { severity, contentType, contentId, field, message };
}

function requireText(
  issues: ValidationIssue[],
  contentType: ValidationIssue["contentType"],
  contentId: string,
  field: string,
  value: string | undefined,
) {
  if (!value?.trim()) {
    issues.push(issue("error", contentType, contentId, field, "Required text is missing."));
  }
}

function validateUniqueTaxonomyIds(
  issues: ValidationIssue[],
  contentId: string,
  items: Array<{ id: string; slug: string }>,
) {
  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();

  for (const item of items) {
    if (seenIds.has(item.id)) {
      issues.push(issue("error", "taxonomy", contentId, "id", `Duplicate taxonomy id: ${item.id}`));
    }
    if (seenSlugs.has(item.slug)) {
      issues.push(issue("error", "taxonomy", contentId, "slug", `Duplicate taxonomy slug: ${item.slug}`));
    }
    seenIds.add(item.id);
    seenSlugs.add(item.slug);
  }
}

export function validateTaxonomyConsistency(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  validateUniqueTaxonomyIds(issues, "question-types", QUESTION_TYPES);
  validateUniqueTaxonomyIds(issues, "reading-skills", READING_SKILLS);
  validateUniqueTaxonomyIds(issues, "trap-types", TRAP_TYPES);
  validateUniqueTaxonomyIds(issues, "difficulty-levels", DIFFICULTY_LEVELS);
  validateUniqueTaxonomyIds(issues, "topics", TOPICS);

  for (const questionType of QUESTION_TYPES) {
    questionType.commonSkills.forEach((skill) => {
      if (!skillIds.has(skill)) {
        issues.push(issue("error", "taxonomy", questionType.id, "commonSkills", `Unknown skill: ${skill}`));
      }
    });
    questionType.commonTraps.forEach((trap) => {
      if (!trapTypeIds.has(trap)) {
        issues.push(issue("error", "taxonomy", questionType.id, "commonTraps", `Unknown trap type: ${trap}`));
      }
    });
  }

  for (const skill of READING_SKILLS) {
    skill.commonQuestionTypes.forEach((questionType) => {
      if (!questionTypeIds.has(questionType)) {
        issues.push(issue("error", "taxonomy", skill.id, "commonQuestionTypes", `Unknown question type: ${questionType}`));
      }
    });
    skill.commonTrapTypes.forEach((trap) => {
      if (!trapTypeIds.has(trap)) {
        issues.push(issue("error", "taxonomy", skill.id, "commonTrapTypes", `Unknown trap type: ${trap}`));
      }
    });
  }

  return issues;
}

export function validateDifficulty(
  difficulty: ReadingDifficulty,
  contentType: ValidationIssue["contentType"],
  contentId: string,
) {
  return difficultyIds.has(difficulty)
    ? []
    : [issue("error", contentType, contentId, "difficulty", `Unknown difficulty level: ${difficulty}`)];
}

export function validateMetadata(content: Passage | Question | DrillSet | StrategyLesson | ReadingTest): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!("metadata" in content) || !content.metadata) {
    issues.push(issue("error", "metadata", "unknown", "metadata", "Metadata object is missing."));
    return issues;
  }

  if (!contentStatuses.has(content.metadata.status)) {
    issues.push(issue("error", "metadata", "unknown", "metadata.status", `Unknown publishing status: ${content.metadata.status}`));
  }
  if (!content.metadata.batchId?.trim()) {
    issues.push(issue("error", "metadata", "unknown", "metadata.batchId", "Content batch id is missing."));
  }

  if ("paragraphs" in content) {
    const passage = content as Passage;
    const id = passage.passageId;
    if (!topicIds.has(passage.metadata.topic)) {
      issues.push(issue("warning", "metadata", id, "metadata.topic", `Topic is not in the master taxonomy: ${passage.metadata.topic}`));
    }
    if (passage.metadata.paragraphCount !== passage.paragraphs.length) {
      issues.push(issue("error", "metadata", id, "metadata.paragraphCount", "Paragraph count does not match passage paragraphs."));
    }
  }

  if ("questionNumber" in content) {
    const id = `q${content.questionNumber}`;
    if (content.metadata.questionType !== content.type) {
      issues.push(issue("error", "metadata", id, "metadata.questionType", "Question type metadata does not match the question."));
    }
    if (content.metadata.primarySkill !== content.skill) {
      issues.push(issue("error", "metadata", id, "metadata.primarySkill", "Primary skill metadata does not match the question."));
    }
    if (content.metadata.trapType !== content.trapType) {
      issues.push(issue("error", "metadata", id, "metadata.trapType", "Trap type metadata does not match the question."));
    }
  }

  if ("drillId" in content) {
    if (content.metadata.totalQuestions !== content.questions.length || content.totalQuestions !== content.questions.length) {
      issues.push(issue("error", "metadata", content.drillId, "totalQuestions", "Drill question count metadata does not match questions."));
    }
  }

  if ("testId" in content) {
    if (content.metadata.testType !== "Academic" || content.testType !== "Academic") {
      issues.push(issue("error", "metadata", content.testId, "testType", "Only Academic Reading content is allowed."));
    }
    if (content.metadata.totalQuestions !== content.questions.length || content.totalQuestions !== content.questions.length) {
      issues.push(issue("error", "metadata", content.testId, "totalQuestions", "Test question count metadata does not match questions."));
    }
  }

  return issues;
}

export function validatePassage(passage: Passage, parentId = "standalone"): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const contentId = `${parentId}:${passage.passageId}`;

  requireText(issues, "passage", contentId, "title", passage.title);
  requireText(issues, "passage", contentId, "topic", passage.topic);

  if (!passage.sourceNote.toLowerCase().includes("original")) {
    issues.push(issue("warning", "passage", contentId, "sourceNote", "Source note should state that the content is original."));
  }

  if (!passage.paragraphs.length) {
    issues.push(issue("error", "passage", contentId, "paragraphs", "At least one paragraph is required."));
  }

  passage.paragraphs.forEach((paragraph, index) => {
    requireText(issues, "passage", contentId, `paragraphs.${index}.label`, paragraph.label);
    requireText(issues, "passage", contentId, `paragraphs.${index}.text`, paragraph.text);
  });

  const actualWordCount = countWords(passage.paragraphs.map((paragraph) => paragraph.text).join(" "));
  if (Math.abs(actualWordCount - passage.metadata.wordCount) > 5) {
    issues.push(issue("warning", "passage", contentId, "metadata.wordCount", "Word count metadata differs from computed passage length."));
  }

  issues.push(...validateDifficulty(passage.metadata.difficulty, "passage", contentId));
  issues.push(...validateMetadata(passage));

  return issues;
}

export function validateEvidence(question: Question, passages: Passage[], parentId = "standalone"): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const contentId = `${parentId}:q${question.questionNumber}`;
  const passage = passages.find((item) => item.passageId === question.passageId);

  if (!passage) {
    issues.push(issue("error", "question", contentId, "passageId", `Question references missing passage: ${question.passageId}`));
    return issues;
  }

  if (question.paragraphRef && !passage.paragraphs.some((paragraph) => paragraph.label === question.paragraphRef)) {
    issues.push(issue("error", "question", contentId, "paragraphRef", `Paragraph reference does not exist: ${question.paragraphRef}`));
  }

  if (question.answer !== "Not Given") {
    requireText(issues, "question", contentId, "evidenceText", question.evidenceText);
  }

  if (!question.evidenceParagraph && question.answer !== "Not Given") {
    issues.push(issue("warning", "question", contentId, "evidenceParagraph", "Evidence paragraph is missing."));
  }

  return issues;
}

export function validateQuestion(question: Question, passages: Passage[], parentId = "standalone"): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const contentId = `${parentId}:q${question.questionNumber}`;

  requireText(issues, "question", contentId, "prompt", question.prompt);
  requireText(issues, "question", contentId, "answer", question.answer);
  requireText(issues, "question", contentId, "explanation", question.explanation);
  requireText(issues, "question", contentId, "whyCorrect", question.whyCorrect);
  requireText(issues, "question", contentId, "strategyTip", question.strategyTip);

  if (!questionTypeIds.has(question.type)) {
    issues.push(issue("error", "question", contentId, "type", `Unknown question type: ${question.type}`));
  }
  if (!skillIds.has(question.skill)) {
    issues.push(issue("error", "question", contentId, "skill", `Unknown skill: ${question.skill}`));
  }
  question.secondarySkills?.forEach((skill) => {
    if (!skillIds.has(skill)) {
      issues.push(issue("error", "question", contentId, "secondarySkills", `Unknown secondary skill: ${skill}`));
    }
  });
  if (!trapTypeIds.has(question.trapType)) {
    issues.push(issue("error", "question", contentId, "trapType", `Unknown trap type: ${question.trapType}`));
  }

  if (question.options?.length && !question.options.includes(question.answer) && !question.acceptedAnswers?.includes(question.answer)) {
    issues.push(issue("warning", "question", contentId, "answer", "Answer is not listed in options or accepted answers."));
  }

  issues.push(...validateDifficulty(question.difficulty, "question", contentId));
  issues.push(...validateEvidence(question, passages, parentId));
  issues.push(...validateMetadata(question));

  return issues;
}

export function validateDrill(drill: DrillSet, lessonIds: Set<string>): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  requireText(issues, "drill", drill.drillId, "title", drill.title);
  requireText(issues, "drill", drill.drillId, "description", drill.description);

  if (drill.questions.length < 5) {
    issues.push(issue("warning", "drill", drill.drillId, "questions", "Phase 2B launch drills should contain at least five questions."));
  }
  if (!lessonIds.has(drill.strategyLessonId)) {
    issues.push(issue("error", "drill", drill.drillId, "strategyLessonId", `Missing strategy lesson: ${drill.strategyLessonId}`));
  }
  if (drill.questionType && !questionTypeIds.has(drill.questionType)) {
    issues.push(issue("error", "drill", drill.drillId, "questionType", `Unknown question type: ${drill.questionType}`));
  }
  if (drill.skill && !skillIds.has(drill.skill)) {
    issues.push(issue("error", "drill", drill.drillId, "skill", `Unknown skill: ${drill.skill}`));
  }
  drill.skillFocus.forEach((skill) => {
    if (!skillIds.has(skill)) {
      issues.push(issue("error", "drill", drill.drillId, "skillFocus", `Unknown skill: ${skill}`));
    }
  });
  drill.trapFocus.forEach((trap) => {
    if (!trapTypeIds.has(trap)) {
      issues.push(issue("error", "drill", drill.drillId, "trapFocus", `Unknown trap type: ${trap}`));
    }
  });

  issues.push(...validateDifficulty(drill.difficulty, "drill", drill.drillId));
  issues.push(...validateMetadata(drill));
  drill.passages.forEach((passage) => issues.push(...validatePassage(passage, drill.drillId)));
  drill.questions.forEach((question) => issues.push(...validateQuestion(question, drill.passages, drill.drillId)));

  if (!drill.relationships.some((relationship) => relationship.relationship === "uses-lesson")) {
    issues.push(issue("warning", "relationship", drill.drillId, "relationships", "Drill does not declare a lesson relationship."));
  }

  return issues;
}

export function validateLesson(lesson: StrategyLesson): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  requireText(issues, "lesson", lesson.lessonId, "title", lesson.title);
  requireText(issues, "lesson", lesson.lessonId, "whatItTests", lesson.whatItTests);
  requireText(issues, "lesson", lesson.lessonId, "whyItMatters", lesson.whyItMatters);

  lesson.relatedQuestionTypes.forEach((questionType) => {
    if (!questionTypeIds.has(questionType)) {
      issues.push(issue("error", "lesson", lesson.lessonId, "relatedQuestionTypes", `Unknown question type: ${questionType}`));
    }
  });
  lesson.relatedSkills.forEach((skill) => {
    if (!skillIds.has(skill)) {
      issues.push(issue("error", "lesson", lesson.lessonId, "relatedSkills", `Unknown skill: ${skill}`));
    }
  });
  lesson.relatedTraps.forEach((trap) => {
    if (!trapTypeIds.has(trap)) {
      issues.push(issue("error", "lesson", lesson.lessonId, "relatedTraps", `Unknown trap type: ${trap}`));
    }
  });

  issues.push(...validateDifficulty(lesson.targetLevel, "lesson", lesson.lessonId));
  issues.push(...validateMetadata(lesson));

  return issues;
}

function validateTest(test: ReadingTest): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  requireText(issues, "test", test.testId, "title", test.title);
  requireText(issues, "test", test.testId, "slug", test.slug);
  requireText(issues, "test", test.testId, "description", test.description);
  if (test.slug.includes("realism")) {
    issues.push(issue("warning", "test", test.testId, "slug", "User-facing test slugs should avoid internal editorial labels."));
  }

  if (test.testType !== "Academic") {
    issues.push(issue("error", "test", test.testId, "testType", "Only IELTS Academic Reading content is allowed."));
  }
  if (test.questions.length !== test.totalQuestions) {
    issues.push(issue("error", "test", test.testId, "totalQuestions", "Declared total questions does not match content."));
  }
  if (test.questions.length !== 20 && test.mode === "mini") {
    issues.push(issue("warning", "test", test.testId, "totalQuestions", "Mini tests are expected to contain 20 questions."));
  }

  issues.push(...validateDifficulty(test.difficulty, "test", test.testId));
  issues.push(...validateMetadata(test));
  test.passages.forEach((passage) => issues.push(...validatePassage(passage, test.testId)));
  test.questions.forEach((question) => issues.push(...validateQuestion(question, test.passages, test.testId)));

  return issues;
}

function validateTestRouting(tests: ReadingTest[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const seenSlugs = new Map<string, string>();

  for (const test of tests) {
    const existing = seenSlugs.get(test.slug);
    if (existing) {
      issues.push(issue("error", "test", test.testId, "slug", `Slug duplicates ${existing}.`));
    }
    seenSlugs.set(test.slug, test.testId);
  }

  return issues;
}

function validateRecommendationRelationships(library: ContentLibrary): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const index = buildContentRelationshipIndex(library);

  for (const skill of READING_SKILLS) {
    if (skill.recommendedPractice.some((practiceId) => !library.drills.some((drill) => drill.drillId === practiceId))) {
      issues.push(issue("warning", "relationship", skill.id, "recommendedPractice", "A recommended practice id does not map to an available drill."));
    }
    if (!index.drillsBySkill[skill.id]?.length && !index.lessonsBySkill[skill.id]?.length) {
      issues.push(issue("warning", "relationship", skill.id, "skill", "No lesson or drill currently targets this skill."));
    }
  }

  return issues;
}

function firstSentence(text: string) {
  return text.split(/[.!?]/)[0]?.trim().toLowerCase() ?? "";
}

function optionAnswerIndex(question: Question) {
  if (!question.options?.length) return undefined;
  return question.options.findIndex((option) => option === question.answer);
}

function validateAnswerDistribution(library: ContentLibrary): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const optionQuestions = [
    ...library.tests.flatMap((test) =>
      test.questions.map((question) => ({
        contentId: `${test.testId}:q${question.questionNumber}`,
        question,
      })),
    ),
    ...library.drills.flatMap((drill) =>
      drill.questions.map((question) => ({
        contentId: `${drill.drillId}:q${question.questionNumber}`,
        question,
      })),
    ),
  ].filter((item) => item.question.options?.length);
  const byType = new Map<string, number[]>();

  for (const item of optionQuestions) {
    const index = optionAnswerIndex(item.question);
    if (index === undefined || index < 0) continue;
    const indexes = byType.get(item.question.type) ?? [];
    indexes.push(index);
    byType.set(item.question.type, indexes);
  }

  for (const [questionType, indexes] of byType.entries()) {
    if (indexes.length < 5) continue;
    const counts = indexes.reduce(
      (acc, index) => {
        acc[index] = (acc[index] ?? 0) + 1;
        return acc;
      },
      {} as Record<number, number>,
    );
    const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    const dominantShare = dominant ? dominant[1] / indexes.length : 0;

    if (dominantShare >= 0.75) {
      issues.push(
        issue(
          "warning",
          "question",
          questionType,
          "answerDistribution",
          `Correct answers for ${questionType} are concentrated in option position ${Number(dominant[0]) + 1}.`,
        ),
      );
    }
  }

  return issues;
}

function validateStructuralRepetition(library: ContentLibrary): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const testSequences = new Map<string, string[]>();
  const paragraphOpeners = new Map<string, string[]>();

  for (const test of library.tests) {
    const sequence = test.questions.map((question) => question.type).join("|");
    testSequences.set(sequence, [...(testSequences.get(sequence) ?? []), test.testId]);

    for (const passage of test.passages) {
      for (const paragraph of passage.paragraphs) {
        const opener = firstSentence(paragraph.text);
        if (!opener) continue;
        paragraphOpeners.set(opener, [
          ...(paragraphOpeners.get(opener) ?? []),
          `${test.testId}:${passage.passageId}:${paragraph.label}`,
        ]);
      }
    }
  }

  for (const [sequence, testIds] of testSequences.entries()) {
    if (library.tests.length > 2 && testIds.length >= Math.ceil(library.tests.length * 0.75)) {
      issues.push(
        issue(
          "warning",
          "test",
          testIds.join(","),
          "questionSequence",
          `Most tests share the same question-type sequence: ${sequence}.`,
        ),
      );
    }
  }

  for (const [opener, locations] of paragraphOpeners.entries()) {
    if (locations.length >= 3) {
      issues.push(
        issue(
          "warning",
          "passage",
          locations.slice(0, 5).join(","),
          "paragraphOpening",
          `Repeated paragraph opening detected: "${opener}".`,
        ),
      );
    }
  }

  return issues;
}

function validateEvidenceRealism(library: ContentLibrary): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const weakEvidencePatterns = [
    "paragraph a states",
    "paragraph b states",
    "paragraph c states",
    "paragraph d states",
    "paragraph e states",
    "the answer is stated",
    "the limitation is named",
    "the passage repeatedly connects",
    "the evidence in the excerpt supports",
  ];

  const allQuestions = [
    ...library.tests.flatMap((test) =>
      test.questions.map((question) => ({
        contentId: `${test.testId}:q${question.questionNumber}`,
        question,
      })),
    ),
    ...library.drills.flatMap((drill) =>
      drill.questions.map((question) => ({
        contentId: `${drill.drillId}:q${question.questionNumber}`,
        question,
      })),
    ),
  ];

  for (const { contentId, question } of allQuestions) {
    const evidence = question.evidenceText?.toLowerCase() ?? "";
    if (question.answer !== "Not Given" && weakEvidencePatterns.some((pattern) => evidence.includes(pattern))) {
      issues.push(
        issue(
          "warning",
          "question",
          contentId,
          "evidenceText",
          "Evidence should quote or closely reproduce passage wording, not describe the evidence generically.",
        ),
      );
    }
  }

  return issues;
}

function validateRealismReadiness(library: ContentLibrary): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const quality = analyzeContentLibrary(library);

  if (library.tests.length < 3) {
    issues.push(issue("error", "metadata", "content-library", "tests", "Phase 3A-REALISM requires at least three flagship Academic mini tests."));
  }
  if (library.drills.length < 8) {
    issues.push(issue("error", "metadata", "content-library", "drills", "Phase 3A-REALISM requires a small drill-native practice set before scaling resumes."));
  }

  const missingDifficulty = DIFFICULTY_LEVELS.filter(
    (difficulty) => !quality.difficultyDistribution.some((entry) => entry.id === difficulty.id && entry.count > 0),
  );
  for (const difficulty of missingDifficulty) {
    issues.push(issue("warning", "metadata", difficulty.id, "difficulty", "No content currently uses this difficulty level."));
  }

  if (quality.duplicateQuestionPrompts.some((entry) => entry.count > 12)) {
    issues.push(issue("warning", "question", "content-library", "prompt", "Some prompt templates are heavily reused and should be diversified before publishing more content."));
  }

  return [
    ...issues,
    ...validateAnswerDistribution(library),
    ...validateStructuralRepetition(library),
    ...validateEvidenceRealism(library),
  ];
}

export function validateContentLibrary(library: ContentLibrary): ValidationReport {
  const lessonIds = new Set(library.lessons.map((lesson) => lesson.lessonId));
  const issues = [
    ...validateTaxonomyConsistency(),
    ...validateTestRouting(library.tests),
    ...library.tests.flatMap(validateTest),
    ...library.drills.flatMap((drill) => validateDrill(drill, lessonIds)),
    ...library.lessons.flatMap(validateLesson),
    ...validateRecommendationRelationships(library),
    ...validateRealismReadiness(library),
  ];

  return {
    issues,
    summary: {
      errors: issues.filter((item) => item.severity === "error").length,
      warnings: issues.filter((item) => item.severity === "warning").length,
      checkedItems:
        library.tests.length +
        library.drills.length +
        library.lessons.length +
        library.tests.reduce((sum, test) => sum + test.passages.length + test.questions.length, 0) +
        library.drills.reduce((sum, drill) => sum + drill.passages.length + drill.questions.length, 0),
    },
  };
}
