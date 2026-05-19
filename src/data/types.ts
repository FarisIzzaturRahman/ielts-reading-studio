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
  | "Skimming"
  | "Scanning"
  | "Inference"
  | "Vocabulary in context"
  | "Matching information"
  | "True/False/Not Given"
  | "Summary completion";

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
  skill: SkillTag;
  difficulty: ReadingDifficulty;
  groupTitle?: string;
  maxWords?: number;
  paragraphRef?: string;
  tags: string[];
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
};

export type UserAnswers = Record<number, string>;

export type FlaggedQuestions = Record<number, boolean>;
