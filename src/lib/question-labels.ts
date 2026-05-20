import type { QuestionType } from "@/data/types";

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  "true-false-not-given": "True / False / Not Given",
  "yes-no-not-given": "Yes / No / Not Given",
  "multiple-choice": "Multiple Choice",
  "matching-headings": "Matching Headings",
  "matching-information": "Matching Information",
  "matching-features": "Matching Features",
  "sentence-completion": "Sentence Completion",
  "summary-completion": "Summary Completion",
  "note-completion": "Note Completion",
  "table-completion": "Table Completion",
  "flow-chart-completion": "Flow-chart Completion",
  "short-answer": "Short Answer Questions",
  "diagram-label-completion": "Diagram Label Completion",
  "matching-sentence-endings": "Matching Sentence Endings",
};

export function formatPassageLabel(passageId: string) {
  const match = passageId.match(/p(\d+)$/i);
  return match ? match[1] : passageId;
}
