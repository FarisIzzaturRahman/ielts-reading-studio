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
