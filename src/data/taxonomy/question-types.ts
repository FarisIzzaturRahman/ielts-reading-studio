import type { QuestionType, ReadingDifficulty, SkillTag, TrapType } from "../types";

export type QuestionTypeTaxonomyItem = {
  id: QuestionType;
  slug: string;
  displayName: string;
  label: string;
  description: string;
  tests: string;
  commonSkills: SkillTag[];
  commonTraps: TrapType[];
  recommendedStrategies: string[];
  strategy: string[];
  estimatedTimeMinutes: number;
  difficulty: ReadingDifficulty;
};

export const QUESTION_TYPES: QuestionTypeTaxonomyItem[] = [
  {
    id: "true-false-not-given",
    slug: "true-false-not-given",
    displayName: "True / False / Not Given",
    label: "True / False / Not Given",
    description:
      "Compare the exact meaning of a statement with information in the passage, then decide whether it agrees, contradicts, or is not supported.",
    tests: "Exact meaning, evidence location, and the difference between contradiction and missing information.",
    commonSkills: ["Understanding detail", "Avoiding overgeneralisation", "Distinguishing fact from claim"],
    commonTraps: ["Not Given trap", "Extreme wording trap", "Similar keyword trap"],
    recommendedStrategies: [
      "Read the full statement before searching for keywords.",
      "Locate the closest evidence in the passage.",
      "Compare meaning, not just repeated words.",
      "Choose Not Given only when the passage does not provide enough evidence.",
    ],
    strategy: [
      "Read the full statement before searching for keywords.",
      "Locate the closest evidence in the passage.",
      "Compare meaning, not just repeated words.",
      "Choose Not Given only when the passage does not provide enough evidence.",
    ],
    estimatedTimeMinutes: 8,
    difficulty: "Medium",
  },
  {
    id: "yes-no-not-given",
    slug: "yes-no-not-given",
    displayName: "Yes / No / Not Given",
    label: "Yes / No / Not Given",
    description:
      "Decide whether a statement agrees with the writer's view, contradicts it, or is not stated clearly enough.",
    tests: "Writer opinion, exact meaning, and cautious use of evidence.",
    commonSkills: ["Identifying writer's opinion", "Distinguishing fact from claim", "Making inference"],
    commonTraps: ["Writer opinion confusion", "Assumption trap", "Not Given trap"],
    recommendedStrategies: [
      "Identify whether the statement is asking about a claim, view, or recommendation.",
      "Find the writer's language, not only factual details.",
      "Avoid using outside knowledge to fill gaps.",
    ],
    strategy: [
      "Identify whether the statement is asking about a claim, view, or recommendation.",
      "Find the writer's language, not only factual details.",
      "Avoid using outside knowledge to fill gaps.",
    ],
    estimatedTimeMinutes: 8,
    difficulty: "Medium",
  },
  {
    id: "matching-headings",
    slug: "matching-headings",
    displayName: "Matching Headings",
    label: "Matching Headings",
    description: "Choose the heading that best captures the main idea or function of a paragraph.",
    tests: "Main idea, paragraph function, and separating central ideas from supporting details.",
    commonSkills: ["Understanding main idea", "Identifying paragraph function"],
    commonTraps: ["Partial match trap", "Distractor detail trap", "Wrong paragraph trap"],
    recommendedStrategies: [
      "Read the whole paragraph before choosing a heading.",
      "Ask what the paragraph mainly does.",
      "Reject headings that match only one attractive detail.",
    ],
    strategy: [
      "Read the whole paragraph before choosing a heading.",
      "Ask what the paragraph mainly does.",
      "Reject headings that match only one attractive detail.",
    ],
    estimatedTimeMinutes: 8,
    difficulty: "Medium",
  },
  {
    id: "matching-information",
    slug: "matching-information",
    displayName: "Matching Information",
    label: "Matching Information",
    description: "Find the paragraph that contains a specific piece of information.",
    tests: "Scanning, paraphrase recognition, and precise paragraph location.",
    commonSkills: ["Locating explicit information", "Time-efficient scanning", "Recognising paraphrase"],
    commonTraps: ["Similar keyword trap", "Wrong paragraph trap", "Partial match trap"],
    recommendedStrategies: [
      "Scan for names, measures, dates, or unusual nouns first.",
      "Expect paraphrase rather than exact wording.",
      "Confirm the whole information item before selecting the paragraph.",
    ],
    strategy: [
      "Scan for names, measures, dates, or unusual nouns first.",
      "Expect paraphrase rather than exact wording.",
      "Confirm the whole information item before selecting the paragraph.",
    ],
    estimatedTimeMinutes: 8,
    difficulty: "Medium",
  },
  {
    id: "matching-features",
    slug: "matching-features",
    displayName: "Matching Features",
    label: "Matching Features",
    description: "Match people, groups, places, or features with their roles or claims in the passage.",
    tests: "Tracking who does what and avoiding similar-detail distractors.",
    commonSkills: ["Locating explicit information", "Understanding detail"],
    commonTraps: ["Distractor detail trap", "Wrong paragraph trap", "Similar keyword trap"],
    recommendedStrategies: [
      "Underline the feature names or roles.",
      "Track the exact action linked to each feature.",
      "Check that the selected feature performs the role in the question.",
    ],
    strategy: [
      "Underline the feature names or roles.",
      "Track the exact action linked to each feature.",
      "Check that the selected feature performs the role in the question.",
    ],
    estimatedTimeMinutes: 8,
    difficulty: "Medium",
  },
  {
    id: "matching-sentence-endings",
    slug: "matching-sentence-endings",
    displayName: "Matching Sentence Endings",
    label: "Matching Sentence Endings",
    description: "Complete a sentence using the ending that matches passage meaning and grammar.",
    tests: "Sentence logic, reference words, and paraphrase.",
    commonSkills: ["Understanding main idea", "Following reference words", "Recognising paraphrase"],
    commonTraps: ["Grammar form trap", "Partial match trap", "Cause-effect confusion"],
    recommendedStrategies: [
      "Read the sentence stem and predict the meaning needed.",
      "Check grammar before choosing an ending.",
      "Confirm the completed sentence matches passage evidence.",
    ],
    strategy: [
      "Read the sentence stem and predict the meaning needed.",
      "Check grammar before choosing an ending.",
      "Confirm the completed sentence matches passage evidence.",
    ],
    estimatedTimeMinutes: 8,
    difficulty: "Medium",
  },
  {
    id: "multiple-choice",
    slug: "multiple-choice",
    displayName: "Multiple Choice",
    label: "Multiple Choice",
    description: "Choose the option best supported by the passage.",
    tests: "Careful option comparison, inference, and distractor control.",
    commonSkills: ["Recognising paraphrase", "Making inference", "Understanding detail"],
    commonTraps: ["Distractor detail trap", "Assumption trap", "Partial match trap"],
    recommendedStrategies: [
      "Read the question stem carefully before the options.",
      "Eliminate options that are true in general but not supported here.",
      "Return to the passage before choosing between close options.",
    ],
    strategy: [
      "Read the question stem carefully before the options.",
      "Eliminate options that are true in general but not supported here.",
      "Return to the passage before choosing between close options.",
    ],
    estimatedTimeMinutes: 8,
    difficulty: "Medium",
  },
  {
    id: "sentence-completion",
    slug: "sentence-completion",
    displayName: "Sentence Completion",
    label: "Sentence Completion",
    description: "Complete a sentence with words from the passage or a precise short answer.",
    tests: "Detail location, grammar fit, and word-limit discipline.",
    commonSkills: ["Understanding detail", "Understanding vocabulary in context"],
    commonTraps: ["Grammar form trap", "Synonym trap", "Partial match trap"],
    recommendedStrategies: [
      "Locate the sentence meaning in the passage.",
      "Check the word limit before answering.",
      "Make sure the answer fits grammar and meaning.",
    ],
    strategy: [
      "Locate the sentence meaning in the passage.",
      "Check the word limit before answering.",
      "Make sure the answer fits grammar and meaning.",
    ],
    estimatedTimeMinutes: 7,
    difficulty: "Medium",
  },
  {
    id: "summary-completion",
    slug: "summary-completion",
    displayName: "Summary Completion",
    label: "Summary Completion",
    description: "Fill gaps in a summary using passage-supported words or ideas.",
    tests: "Paraphrase, grammar, and tracking a compressed version of the passage.",
    commonSkills: ["Recognising paraphrase", "Understanding detail"],
    commonTraps: ["Grammar form trap", "Synonym trap", "Partial match trap"],
    recommendedStrategies: [
      "Read the whole summary first.",
      "Use grammar before and after the gap to predict the answer type.",
      "Check that the answer matches the passage meaning exactly.",
    ],
    strategy: [
      "Read the whole summary first.",
      "Use grammar before and after the gap to predict the answer type.",
      "Check that the answer matches the passage meaning exactly.",
    ],
    estimatedTimeMinutes: 8,
    difficulty: "Medium",
  },
  {
    id: "note-completion",
    slug: "note-completion",
    displayName: "Note Completion",
    label: "Note Completion",
    description: "Complete concise notes using information from the passage.",
    tests: "Scanning, detail recognition, and concise answer control.",
    commonSkills: ["Understanding vocabulary in context", "Understanding detail"],
    commonTraps: ["Grammar form trap", "Similar keyword trap", "Partial match trap"],
    recommendedStrategies: [
      "Use headings and nearby words to locate the passage area.",
      "Predict the grammatical form of the answer.",
      "Keep the answer within the word limit.",
    ],
    strategy: [
      "Use headings and nearby words to locate the passage area.",
      "Predict the grammatical form of the answer.",
      "Keep the answer within the word limit.",
    ],
    estimatedTimeMinutes: 7,
    difficulty: "Easy",
  },
  {
    id: "table-completion",
    slug: "table-completion",
    displayName: "Table Completion",
    label: "Table Completion",
    description: "Complete a table by locating precise details and categories.",
    tests: "Scanning, comparison, and detail accuracy.",
    commonSkills: ["Locating explicit information", "Understanding comparison", "Time-efficient scanning"],
    commonTraps: ["Comparison confusion", "Similar keyword trap", "Grammar form trap"],
    recommendedStrategies: [
      "Use row and column labels to predict the answer type.",
      "Scan for the matching category before reading deeply.",
      "Check that the selected detail belongs in the correct table cell.",
    ],
    strategy: [
      "Use row and column labels to predict the answer type.",
      "Scan for the matching category before reading deeply.",
      "Check that the selected detail belongs in the correct table cell.",
    ],
    estimatedTimeMinutes: 7,
    difficulty: "Easy",
  },
  {
    id: "flow-chart-completion",
    slug: "flow-chart-completion",
    displayName: "Flow-chart Completion",
    label: "Flow-chart Completion",
    description: "Complete stages in a process or sequence.",
    tests: "Sequence tracking, cause-effect logic, and concise completion.",
    commonSkills: ["Recognising cause and effect", "Following reference words"],
    commonTraps: ["Chronology trap", "Cause-effect confusion", "Grammar form trap"],
    recommendedStrategies: [
      "Follow the arrows or stages before answering.",
      "Locate the relevant process in the passage.",
      "Check whether the answer is a step, result, or condition.",
    ],
    strategy: [
      "Follow the arrows or stages before answering.",
      "Locate the relevant process in the passage.",
      "Check whether the answer is a step, result, or condition.",
    ],
    estimatedTimeMinutes: 7,
    difficulty: "Medium",
  },
  {
    id: "short-answer",
    slug: "short-answer-questions",
    displayName: "Short Answer Questions",
    label: "Short Answer Questions",
    description: "Answer a direct question with a short passage-supported response.",
    tests: "Precise detail location, answer boundaries, and word-limit control.",
    commonSkills: ["Time-efficient scanning", "Locating explicit information"],
    commonTraps: ["Partial match trap", "Grammar form trap", "Distractor detail trap"],
    recommendedStrategies: [
      "Find the exact passage sentence that answers the question.",
      "Copy only the words needed for the answer.",
      "Check the word limit and spelling before moving on.",
    ],
    strategy: [
      "Find the exact passage sentence that answers the question.",
      "Copy only the words needed for the answer.",
      "Check the word limit and spelling before moving on.",
    ],
    estimatedTimeMinutes: 7,
    difficulty: "Medium",
  },
  {
    id: "diagram-label-completion",
    slug: "diagram-label-completion",
    displayName: "Diagram Label Completion",
    label: "Diagram Label Completion",
    description: "Label a diagram or simplified model using passage information.",
    tests: "Process understanding, spatial labels, and concise completion.",
    commonSkills: ["Making inference", "Recognising cause and effect"],
    commonTraps: ["Wrong paragraph trap", "Grammar form trap", "Partial match trap"],
    recommendedStrategies: [
      "Identify what the diagram represents.",
      "Use labels and arrows to predict the type of missing information.",
      "Confirm the answer fits both the passage and the diagram position.",
    ],
    strategy: [
      "Identify what the diagram represents.",
      "Use labels and arrows to predict the type of missing information.",
      "Confirm the answer fits both the passage and the diagram position.",
    ],
    estimatedTimeMinutes: 8,
    difficulty: "Medium",
  },
];

export const QUESTION_TYPE_IDS = QUESTION_TYPES.map((item) => item.id);

export function getQuestionTypeBySlug(slug: string) {
  return QUESTION_TYPES.find((item) => item.slug === slug);
}

export function getQuestionTypeById(id: QuestionType) {
  return QUESTION_TYPES.find((item) => item.id === id);
}

export function questionTypeSlug(questionType: QuestionType) {
  return getQuestionTypeById(questionType)?.slug ?? questionType;
}
