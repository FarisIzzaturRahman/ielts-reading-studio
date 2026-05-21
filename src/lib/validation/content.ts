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
const contentStatuses = new Set(["draft", "reviewed", "validated", "published"]);

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
  requireText(issues, "test", test.testId, "description", test.description);

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

function validateScaleReadiness(library: ContentLibrary): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const quality = analyzeContentLibrary(library);

  if (library.tests.length < 30) {
    issues.push(issue("error", "metadata", "content-library", "tests", "Phase 3A-2 requires at least 30 Academic mini tests."));
  }
  if (library.drills.length < 50) {
    issues.push(issue("error", "metadata", "content-library", "drills", "Phase 3A-2 requires at least 50 focused drills."));
  }

  for (const questionType of quality.coverageGaps.questionTypesWithoutDrills) {
    issues.push(issue("warning", "relationship", questionType, "questionType", "No focused drill currently targets this question type."));
  }
  for (const skill of quality.coverageGaps.skillsWithoutDrills) {
    issues.push(issue("warning", "relationship", skill, "skill", "No focused drill currently targets this skill."));
  }

  const missingDifficulty = DIFFICULTY_LEVELS.filter(
    (difficulty) => !quality.difficultyDistribution.some((entry) => entry.id === difficulty.id && entry.count > 0),
  );
  for (const difficulty of missingDifficulty) {
    issues.push(issue("warning", "metadata", difficulty.id, "difficulty", "No content currently uses this difficulty level."));
  }

  if (quality.duplicateQuestionPrompts.some((entry) => entry.count > 100)) {
    issues.push(issue("warning", "question", "content-library", "prompt", "Some generated prompt templates are heavily reused and should be diversified in editorial batches."));
  }

  return issues;
}

export function validateContentLibrary(library: ContentLibrary): ValidationReport {
  const lessonIds = new Set(library.lessons.map((lesson) => lesson.lessonId));
  const issues = [
    ...validateTaxonomyConsistency(),
    ...library.tests.flatMap(validateTest),
    ...library.drills.flatMap((drill) => validateDrill(drill, lessonIds)),
    ...library.lessons.flatMap(validateLesson),
    ...validateRecommendationRelationships(library),
    ...validateScaleReadiness(library),
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
