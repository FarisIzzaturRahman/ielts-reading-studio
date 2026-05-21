import type { TrapType } from "../types";
import { slugifyLabel } from "./utils";

export type TrapTypeTaxonomyItem = {
  id: TrapType;
  slug: string;
  displayName: TrapType;
  explanation: string;
  examplePattern: string;
  preventionStrategy: string;
};

const trapExplanations: Record<TrapType, Omit<TrapTypeTaxonomyItem, "id" | "slug" | "displayName">> = {
  "Synonym trap": {
    explanation: "The passage uses equivalent meaning rather than the same words as the question.",
    examplePattern: "Question says improve; passage says produce clearer or more usable results.",
    preventionStrategy: "Compare phrase-level meaning instead of waiting for identical words.",
  },
  "Opposite meaning trap": {
    explanation: "The answer option reverses the relationship or contrast in the passage.",
    examplePattern: "Question says more common; passage says less common.",
    preventionStrategy: "Check contrast words and comparative direction before choosing.",
  },
  "Extreme wording trap": {
    explanation: "Absolute wording makes the statement stronger than the passage evidence.",
    examplePattern: "Question says all districts; passage says selected districts.",
    preventionStrategy: "Circle words such as all, every, only, always, never and completely.",
  },
  "Overgeneralisation trap": {
    explanation: "A limited finding or example is turned into a broad claim.",
    examplePattern: "A pilot result is treated as true for every setting.",
    preventionStrategy: "Check the scope, population, location and condition of the evidence.",
  },
  "Not Given trap": {
    explanation: "The topic is mentioned, but the exact information is missing.",
    examplePattern: "The passage discusses funding, but not the company that funded a pilot.",
    preventionStrategy: "Choose Not Given when evidence cannot confirm or contradict the statement.",
  },
  "Partial match trap": {
    explanation: "One detail matches, but the complete answer does not satisfy the question.",
    examplePattern: "A heading matches an example but misses the paragraph's main function.",
    preventionStrategy: "Confirm that the whole question, not only one word, is answered.",
  },
  "Similar keyword trap": {
    explanation: "Repeated words appear near a wrong answer location.",
    examplePattern: "The same technical noun appears in two paragraphs, but only one gives the answer.",
    preventionStrategy: "Use keywords to locate; use meaning to decide.",
  },
  "Wrong paragraph trap": {
    explanation: "A nearby or related paragraph discusses the topic but not the requested information.",
    examplePattern: "Paragraph B gives background; Paragraph D gives the actual limitation.",
    preventionStrategy: "Verify the exact information item before selecting a paragraph.",
  },
  "Distractor detail trap": {
    explanation: "A plausible detail is true in the passage but does not answer this question.",
    examplePattern: "An option names a real benefit, but the question asks for the writer's main view.",
    preventionStrategy: "Eliminate options that are true but irrelevant to the stem.",
  },
  "Chronology trap": {
    explanation: "Events, stages or evidence are placed in the wrong order.",
    examplePattern: "A result is chosen as if it happened before the method was applied.",
    preventionStrategy: "Track sequence markers such as before, after, first and later.",
  },
  "Cause-effect confusion": {
    explanation: "A cause, result, condition or consequence is reversed.",
    examplePattern: "Feedback causes lasting value; the answer treats lasting value as the cause.",
    preventionStrategy: "Ask what creates the result and what follows from it.",
  },
  "Comparison confusion": {
    explanation: "The answer changes the direction or object of a comparison.",
    examplePattern: "The passage says method A is less costly than method B; the answer reverses it.",
    preventionStrategy: "Identify both sides of the comparison and the comparison word.",
  },
  "Writer opinion confusion": {
    explanation: "A factual detail is mistaken for the writer's claim or judgement.",
    examplePattern: "The passage reports a finding; the question asks what the writer believes.",
    preventionStrategy: "Look for evaluative language and distinguish reported views from author stance.",
  },
  "Grammar form trap": {
    explanation: "The answer location is correct, but the word form does not fit the sentence.",
    examplePattern: "The gap needs a noun, but the chosen answer is an adjective.",
    preventionStrategy: "Check words before and after completion gaps.",
  },
  "Assumption trap": {
    explanation: "The answer relies on outside knowledge or a plausible assumption not supported by the passage.",
    examplePattern: "A technology sounds beneficial, so the learner chooses a benefit not stated.",
    preventionStrategy: "Ask whether the passage directly supports the answer.",
  },
  "No major trap": {
    explanation: "The question mainly tests careful reading without a deliberate trap.",
    examplePattern: "The answer is directly stated and distractors are minimal.",
    preventionStrategy: "Still verify the evidence sentence before answering.",
  },
};

export const TRAP_TYPES: TrapTypeTaxonomyItem[] = Object.entries(trapExplanations).map(([id, item]) => ({
  id: id as TrapType,
  slug: slugifyLabel(id),
  displayName: id as TrapType,
  ...item,
}));

export function getTrapTypeById(id: TrapType | string) {
  return TRAP_TYPES.find((item) => item.id === id);
}

export function trapTypeSlug(trapType: TrapType | string) {
  return getTrapTypeById(trapType)?.slug ?? slugifyLabel(trapType);
}
