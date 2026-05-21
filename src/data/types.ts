import type { CognitiveLevel } from "./taxonomy/cognitive-levels";
import type { PassageStyle } from "./taxonomy/passage-styles";
import type { RecommendationType } from "./taxonomy/recommendation-types";

export type ReadingDifficulty =
  | "Easy"
  | "Medium"
  | "Hard"
  | "Band 8-9 Challenge";

export type QuestionType =
  | "true-false-not-given"
  | "yes-no-not-given"
  | "multiple-choice"
  | "matching-headings"
  | "matching-information"
  | "matching-features"
  | "sentence-completion"
  | "summary-completion"
  | "note-completion"
  | "table-completion"
  | "flow-chart-completion"
  | "short-answer"
  | "diagram-label-completion"
  | "matching-sentence-endings";

export type SkillTag =
  | "Locating explicit information"
  | "Understanding main idea"
  | "Identifying writer's opinion"
  | "Recognising paraphrase"
  | "Understanding detail"
  | "Making inference"
  | "Distinguishing fact from claim"
  | "Following reference words"
  | "Understanding vocabulary in context"
  | "Identifying paragraph function"
  | "Recognising contrast"
  | "Recognising cause and effect"
  | "Understanding comparison"
  | "Avoiding overgeneralisation"
  | "Time-efficient scanning";

export type TrapType =
  | "Synonym trap"
  | "Opposite meaning trap"
  | "Extreme wording trap"
  | "Overgeneralisation trap"
  | "Not Given trap"
  | "Partial match trap"
  | "Similar keyword trap"
  | "Wrong paragraph trap"
  | "Distractor detail trap"
  | "Chronology trap"
  | "Cause-effect confusion"
  | "Comparison confusion"
  | "Writer opinion confusion"
  | "Grammar form trap"
  | "Assumption trap"
  | "No major trap";

export type DensityLevel = "Low" | "Moderate" | "High" | "Very high";

export type SentenceComplexity = "Low" | "Moderate" | "High" | "Very high";

export type EvidenceStrength = "Direct" | "Paraphrased" | "Inferred" | "Distributed" | "Missing";

export type ContentStatus =
  | "generated"
  | "realism-reviewed"
  | "psychometric-reviewed"
  | "finalized"
  | "published"
  | "draft"
  | "reviewed"
  | "validated";

export type ContentRelationship = {
  contentType: "test" | "passage" | "question" | "drill" | "lesson" | "recommendation";
  contentId: string;
  relationship:
    | "belongs-to-topic"
    | "targets-question-type"
    | "targets-skill"
    | "targets-trap"
    | "uses-lesson"
    | "contains-question"
    | "contains-passage"
    | "recommended-after";
  targetId: string;
};

export type PassageMetadata = {
  status: ContentStatus;
  batchId: string;
  topic: string;
  subtopic: string;
  difficulty: ReadingDifficulty;
  estimatedBand: string;
  passageStyle: PassageStyle;
  wordCount: number;
  paragraphCount: number;
  lexicalDensity: DensityLevel;
  sentenceComplexity: SentenceComplexity;
  inferenceDensity: DensityLevel;
  paraphraseDensity: DensityLevel;
  estimatedReadingTime: number;
  tags: string[];
};

export type QuestionMetadata = {
  status: ContentStatus;
  batchId: string;
  questionType: QuestionType;
  primarySkill: SkillTag;
  secondarySkills: SkillTag[];
  trapType: TrapType;
  difficulty: ReadingDifficulty;
  cognitiveLevel: CognitiveLevel;
  evidenceStrength: EvidenceStrength;
  evidenceParagraph?: string;
  evidenceText?: string;
  strategyTip: string;
  estimatedDifficultyScore: number;
  tags: string[];
};

export type DrillMetadata = {
  status: ContentStatus;
  batchId: string;
  practiceMode: PracticeMode;
  questionTypeFocus?: QuestionType;
  skillFocus: SkillTag[];
  trapFocus: TrapType[];
  difficulty: ReadingDifficulty;
  targetBand: string;
  estimatedTimeMinutes: number;
  totalQuestions: number;
  topicFocus: string[];
  recommendationCategory: RecommendationType;
  tags: string[];
};

export type LessonMetadata = {
  status: ContentStatus;
  batchId: string;
  relatedQuestionTypes: QuestionType[];
  relatedSkills: SkillTag[];
  relatedTraps: TrapType[];
  targetLevel: ReadingDifficulty;
  estimatedStudyTime: number;
  tags: string[];
};

export type TestMetadata = {
  status: ContentStatus;
  batchId: string;
  testType: "Academic";
  difficulty: ReadingDifficulty;
  targetBand: string;
  totalPassages: number;
  totalQuestions: number;
  estimatedTimeMinutes: number;
  topicFocus: string[];
  tags: string[];
};

export type PassageParagraph = {
  label: string;
  text: string;
};

export type Passage = {
  passageId: string;
  title: string;
  topic: string;
  sourceNote: string;
  paragraphs: PassageParagraph[];
  metadata: PassageMetadata;
};

export type Question = {
  id: number;
  questionNumber: number;
  passageId: string;
  type: QuestionType;
  prompt: string;
  options?: string[];
  answer: string;
  acceptedAnswers?: string[];
  explanation: string;
  evidenceParagraph?: string;
  evidenceText?: string;
  whyCorrect: string;
  whyWrong: string;
  skill: SkillTag;
  secondarySkills?: SkillTag[];
  trapType: TrapType;
  strategyTip: string;
  difficulty: ReadingDifficulty;
  groupTitle?: string;
  maxWords?: number;
  paragraphRef?: string;
  tags: string[];
  metadata: QuestionMetadata;
};

export type ReadingTest = {
  testId: string;
  title: string;
  description: string;
  topic: string;
  difficulty: ReadingDifficulty;
  targetBand: string;
  mode: "mini" | "full";
  testType: "Academic";
  timeLimitMinutes: number;
  estimatedTimeMinutes: number;
  totalQuestions: number;
  passages: Passage[];
  questions: Question[];
  metadata: TestMetadata;
};

export type UserAnswers = Record<number, string>;

export type FlaggedQuestions = Record<number, boolean>;

export type PracticeMode = "question-type" | "skill";

export type WorkedExample = {
  statement: string;
  passageText: string;
  answer: string;
  explanation: string;
};

export type StrategyLesson = {
  lessonId: string;
  title: string;
  questionType?: QuestionType;
  skill?: SkillTag;
  skillFocus: SkillTag[];
  relatedQuestionTypes: QuestionType[];
  relatedSkills: SkillTag[];
  relatedTraps: TrapType[];
  targetLevel: ReadingDifficulty;
  estimatedStudyTime: number;
  whatItTests: string;
  whyItMatters: string;
  steps: string[];
  commonTraps: string[];
  workedExample: WorkedExample;
  tags: string[];
  metadata: LessonMetadata;
};

export type DrillSet = {
  drillId: string;
  title: string;
  practiceMode: PracticeMode;
  questionType?: QuestionType;
  skill?: SkillTag;
  skillFocus: SkillTag[];
  trapFocus: TrapType[];
  difficulty: ReadingDifficulty;
  targetBand: string;
  estimatedTimeMinutes: number;
  totalQuestions: number;
  topicFocus: string[];
  recommendationCategory: RecommendationType;
  description: string;
  strategyLessonId: string;
  passages: Passage[];
  questions: Question[];
  tags: string[];
  relationships: ContentRelationship[];
  metadata: DrillMetadata;
};
