import type { QuestionType, ReadingDifficulty, SkillTag } from "@/data/types";
import { QUESTION_TYPE_LABELS } from "./question-labels";

export type QuestionTypeTaxonomyItem = {
  id: QuestionType;
  label: string;
  slug: string;
  description: string;
  tests: string;
  commonTraps: string[];
  strategy: string[];
  estimatedTimeMinutes: number;
  difficulty: ReadingDifficulty;
};

export type SkillTaxonomyItem = {
  id: SkillTag;
  label: SkillTag;
  slug: string;
  description: string;
  whyItMatters: string;
  commonMistakes: string[];
  strategy: string[];
  estimatedTimeMinutes: number;
  difficulty: ReadingDifficulty;
};

export function slugifyLabel(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const QUESTION_TYPE_TAXONOMY: QuestionTypeTaxonomyItem[] = [
  {
    id: "true-false-not-given",
    label: QUESTION_TYPE_LABELS["true-false-not-given"],
    slug: "true-false-not-given",
    description:
      "Compare the exact meaning of a statement with information in the passage, then decide whether it agrees, contradicts, or is not supported.",
    tests: "Exact meaning, evidence location, and the difference between contradiction and missing information.",
    commonTraps: ["Not Given trap", "Extreme wording trap", "Similar keyword trap"],
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
    label: QUESTION_TYPE_LABELS["yes-no-not-given"],
    slug: "yes-no-not-given",
    description:
      "Decide whether a statement agrees with the writer's view, contradicts it, or is not stated clearly enough.",
    tests: "Writer opinion, exact meaning, and cautious use of evidence.",
    commonTraps: ["Writer opinion confusion", "Assumption trap", "Not Given trap"],
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
    label: QUESTION_TYPE_LABELS["matching-headings"],
    slug: "matching-headings",
    description: "Choose the heading that best captures the main idea or function of a paragraph.",
    tests: "Main idea, paragraph function, and separating central ideas from supporting details.",
    commonTraps: ["Partial match trap", "Distractor detail trap", "Wrong paragraph trap"],
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
    label: QUESTION_TYPE_LABELS["matching-information"],
    slug: "matching-information",
    description: "Find the paragraph that contains a specific piece of information.",
    tests: "Scanning, paraphrase recognition, and precise paragraph location.",
    commonTraps: ["Similar keyword trap", "Wrong paragraph trap", "Partial match trap"],
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
    label: QUESTION_TYPE_LABELS["matching-features"],
    slug: "matching-features",
    description: "Match people, groups, places, or features with their roles or claims in the passage.",
    tests: "Tracking who does what and avoiding similar-detail distractors.",
    commonTraps: ["Distractor detail trap", "Wrong paragraph trap", "Similar keyword trap"],
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
    label: QUESTION_TYPE_LABELS["matching-sentence-endings"],
    slug: "matching-sentence-endings",
    description: "Complete a sentence using the ending that matches passage meaning and grammar.",
    tests: "Sentence logic, reference words, and paraphrase.",
    commonTraps: ["Grammar form trap", "Partial match trap", "Cause-effect confusion"],
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
    label: QUESTION_TYPE_LABELS["multiple-choice"],
    slug: "multiple-choice",
    description: "Choose the option best supported by the passage.",
    tests: "Careful option comparison, inference, and distractor control.",
    commonTraps: ["Distractor detail trap", "Assumption trap", "Partial match trap"],
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
    label: QUESTION_TYPE_LABELS["sentence-completion"],
    slug: "sentence-completion",
    description: "Complete a sentence with words from the passage or a precise short answer.",
    tests: "Detail location, grammar fit, and word-limit discipline.",
    commonTraps: ["Grammar form trap", "Synonym trap", "Partial match trap"],
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
    label: QUESTION_TYPE_LABELS["summary-completion"],
    slug: "summary-completion",
    description: "Fill gaps in a summary using passage-supported words or ideas.",
    tests: "Paraphrase, grammar, and tracking a compressed version of the passage.",
    commonTraps: ["Grammar form trap", "Synonym trap", "Partial match trap"],
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
    label: QUESTION_TYPE_LABELS["note-completion"],
    slug: "note-completion",
    description: "Complete concise notes using information from the passage.",
    tests: "Scanning, detail recognition, and concise answer control.",
    commonTraps: ["Grammar form trap", "Similar keyword trap", "Partial match trap"],
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
    label: QUESTION_TYPE_LABELS["table-completion"],
    slug: "table-completion",
    description: "Complete a table by locating precise details and categories.",
    tests: "Scanning, comparison, and detail accuracy.",
    commonTraps: ["Comparison confusion", "Similar keyword trap", "Grammar form trap"],
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
    label: QUESTION_TYPE_LABELS["flow-chart-completion"],
    slug: "flow-chart-completion",
    description: "Complete stages in a process or sequence.",
    tests: "Sequence tracking, cause-effect logic, and concise completion.",
    commonTraps: ["Chronology trap", "Cause-effect confusion", "Grammar form trap"],
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
    label: QUESTION_TYPE_LABELS["short-answer"],
    slug: "short-answer-questions",
    description: "Answer a direct question with a short passage-supported response.",
    tests: "Precise detail location, answer boundaries, and word-limit control.",
    commonTraps: ["Partial match trap", "Grammar form trap", "Distractor detail trap"],
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
    label: QUESTION_TYPE_LABELS["diagram-label-completion"],
    slug: "diagram-label-completion",
    description: "Label a diagram or simplified model using passage information.",
    tests: "Process understanding, spatial labels, and concise completion.",
    commonTraps: ["Wrong paragraph trap", "Grammar form trap", "Partial match trap"],
    strategy: [
      "Identify what the diagram represents.",
      "Use labels and arrows to predict the type of missing information.",
      "Confirm the answer fits both the passage and the diagram position.",
    ],
    estimatedTimeMinutes: 8,
    difficulty: "Medium",
  },
];

export const SKILL_TAXONOMY: SkillTaxonomyItem[] = [
  {
    id: "Locating explicit information",
    label: "Locating explicit information",
    slug: "locating-explicit-information",
    description: "Find directly stated information without being distracted by similar wording elsewhere.",
    whyItMatters: "Many IELTS Academic Reading answers depend on quickly locating the exact sentence or paragraph.",
    commonMistakes: ["Reading too widely after finding a keyword", "Choosing a nearby but incomplete detail"],
    strategy: ["Scan for names, measures and unusual nouns.", "Read the full sentence around the match."],
    estimatedTimeMinutes: 8,
    difficulty: "Easy",
  },
  {
    id: "Understanding main idea",
    label: "Understanding main idea",
    slug: "understanding-main-idea",
    description: "Identify the central purpose of a paragraph or passage rather than one supporting detail.",
    whyItMatters: "Matching Headings and purpose questions often reward paragraph-level understanding.",
    commonMistakes: ["Choosing a heading because it repeats a single word", "Ignoring the paragraph conclusion"],
    strategy: ["Read the first and last sentence carefully.", "Ask what the paragraph mainly contributes."],
    estimatedTimeMinutes: 8,
    difficulty: "Medium",
  },
  {
    id: "Identifying writer's opinion",
    label: "Identifying writer's opinion",
    slug: "identifying-writers-opinion",
    description: "Recognise claims, judgements and cautious conclusions made by the writer.",
    whyItMatters: "Yes / No / Not Given and multiple choice questions often ask about the writer's view.",
    commonMistakes: ["Treating background facts as the writer's opinion", "Adding outside assumptions"],
    strategy: ["Look for evaluative verbs and cautious language.", "Separate reported facts from the writer's claim."],
    estimatedTimeMinutes: 8,
    difficulty: "Medium",
  },
  {
    id: "Recognising paraphrase",
    label: "Recognising paraphrase",
    slug: "recognising-paraphrase",
    description: "Connect different wording in a question and passage that carries the same meaning.",
    whyItMatters: "IELTS rarely repeats the exact words from the question in the answer sentence.",
    commonMistakes: ["Following repeated keywords only", "Missing synonyms and rephrased cause-effect language"],
    strategy: ["Predict synonyms before scanning.", "Compare meaning at phrase level, not word by word."],
    estimatedTimeMinutes: 8,
    difficulty: "Medium",
  },
  {
    id: "Understanding detail",
    label: "Understanding detail",
    slug: "understanding-detail",
    description: "Read a specific sentence or small section accurately.",
    whyItMatters: "A single quantifier, comparison or condition can change the correct answer.",
    commonMistakes: ["Ignoring limiting words", "Treating selected examples as universal claims"],
    strategy: ["Check modifiers such as some, selected, mainly and only.", "Compare the complete statement."],
    estimatedTimeMinutes: 8,
    difficulty: "Medium",
  },
  {
    id: "Making inference",
    label: "Making inference",
    slug: "making-inference",
    description: "Understand what the passage implies without adding unsupported outside knowledge.",
    whyItMatters: "Higher-band questions often require careful interpretation of implied meaning.",
    commonMistakes: ["Choosing a plausible idea that is not supported", "Over-reading a cautious conclusion"],
    strategy: ["Identify the evidence first.", "Ask what must follow from that evidence and what is only possible."],
    estimatedTimeMinutes: 9,
    difficulty: "Hard",
  },
  {
    id: "Distinguishing fact from claim",
    label: "Distinguishing fact from claim",
    slug: "distinguishing-fact-from-claim",
    description: "Separate data, reported views, and the author's own claim.",
    whyItMatters: "Academic passages often present evidence and interpretation side by side.",
    commonMistakes: ["Treating one researcher's view as established fact", "Missing hedging language"],
    strategy: ["Watch reporting verbs.", "Check whether the passage says proves, suggests, argues or claims."],
    estimatedTimeMinutes: 8,
    difficulty: "Medium",
  },
  {
    id: "Following reference words",
    label: "Following reference words",
    slug: "following-reference-words",
    description: "Track pronouns and linking words such as this, these, such and however.",
    whyItMatters: "Reference words often connect answer evidence to earlier ideas.",
    commonMistakes: ["Attaching this to the wrong noun", "Ignoring contrast markers"],
    strategy: ["Look backwards for the nearest logical noun phrase.", "Check whether the reference changes the sentence meaning."],
    estimatedTimeMinutes: 8,
    difficulty: "Medium",
  },
  {
    id: "Understanding vocabulary in context",
    label: "Understanding vocabulary in context",
    slug: "understanding-vocabulary-in-context",
    description: "Infer the meaning or role of a word from the surrounding sentence and paragraph.",
    whyItMatters: "Academic Reading often uses unfamiliar words that can still be understood from context.",
    commonMistakes: ["Using only a memorised dictionary meaning", "Ignoring contrast or example clues"],
    strategy: ["Use the sentence before and after the word.", "Look for examples, contrasts and definitions."],
    estimatedTimeMinutes: 8,
    difficulty: "Medium",
  },
  {
    id: "Identifying paragraph function",
    label: "Identifying paragraph function",
    slug: "identifying-paragraph-function",
    description: "Understand whether a paragraph introduces a problem, gives evidence, explains a method, or evaluates a result.",
    whyItMatters: "This is essential for Matching Headings and main purpose questions.",
    commonMistakes: ["Naming the topic but not the paragraph role", "Choosing a heading based on one example"],
    strategy: ["Summarise the paragraph in one short sentence.", "Look at how it connects to the previous paragraph."],
    estimatedTimeMinutes: 8,
    difficulty: "Medium",
  },
  {
    id: "Recognising contrast",
    label: "Recognising contrast",
    slug: "recognising-contrast",
    description: "Notice when the passage changes direction using contrast language.",
    whyItMatters: "Contrasts often explain why an attractive answer is wrong.",
    commonMistakes: ["Reading only the first half of a sentence", "Missing however, although and whereas"],
    strategy: ["Mark contrast words.", "Read both sides of the contrast before deciding."],
    estimatedTimeMinutes: 8,
    difficulty: "Medium",
  },
  {
    id: "Recognising cause and effect",
    label: "Recognising cause and effect",
    slug: "recognising-cause-and-effect",
    description: "Identify causes, results, conditions and consequences accurately.",
    whyItMatters: "Completion and multiple choice questions often reverse cause and effect.",
    commonMistakes: ["Confusing a condition with a result", "Choosing an effect as the cause"],
    strategy: ["Underline cause-effect connectors.", "Ask what happened first and what followed."],
    estimatedTimeMinutes: 8,
    difficulty: "Medium",
  },
  {
    id: "Understanding comparison",
    label: "Understanding comparison",
    slug: "understanding-comparison",
    description: "Read comparative relationships such as more, less, similar, unlike and rather than.",
    whyItMatters: "Small comparison words often decide whether a statement is true or false.",
    commonMistakes: ["Ignoring the direction of comparison", "Treating similarity as identity"],
    strategy: ["Identify both items being compared.", "Check whether the question changes the comparison."],
    estimatedTimeMinutes: 8,
    difficulty: "Medium",
  },
  {
    id: "Avoiding overgeneralisation",
    label: "Avoiding overgeneralisation",
    slug: "avoiding-overgeneralisation",
    description: "Avoid turning limited evidence into a broad claim.",
    whyItMatters: "IELTS statements often use all, every or always where the passage is more limited.",
    commonMistakes: ["Choosing True because the topic is mentioned", "Missing selected, some, may and often"],
    strategy: ["Circle absolute words in the question.", "Compare scope carefully with the passage."],
    estimatedTimeMinutes: 8,
    difficulty: "Medium",
  },
  {
    id: "Time-efficient scanning",
    label: "Time-efficient scanning",
    slug: "time-efficient-scanning",
    description: "Find likely answer locations quickly while preserving accuracy.",
    whyItMatters: "A strong IELTS Reading score requires speed and evidence control under time pressure.",
    commonMistakes: ["Reading every sentence too slowly", "Moving on without confirming the exact answer"],
    strategy: ["Scan for unique words first.", "Slow down only around the likely evidence sentence."],
    estimatedTimeMinutes: 7,
    difficulty: "Easy",
  },
];

export function getQuestionTypeBySlug(slug: string) {
  return QUESTION_TYPE_TAXONOMY.find((item) => item.slug === slug);
}

export function getSkillBySlug(slug: string) {
  return SKILL_TAXONOMY.find((item) => item.slug === slug);
}

export function questionTypeSlug(questionType: QuestionType) {
  return QUESTION_TYPE_TAXONOMY.find((item) => item.id === questionType)?.slug ?? slugifyLabel(questionType);
}

export function skillSlug(skill: SkillTag | string) {
  return SKILL_TAXONOMY.find((item) => item.id === skill)?.slug ?? slugifyLabel(skill);
}
