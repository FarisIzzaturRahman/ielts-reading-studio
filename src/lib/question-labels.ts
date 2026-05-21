import type { QuestionType } from "@/data/types";
import { QUESTION_TYPES } from "@/data/taxonomy/question-types";

export const QUESTION_TYPE_LABELS = Object.fromEntries(
  QUESTION_TYPES.map((item) => [item.id, item.displayName]),
) as Record<QuestionType, string>;

export function formatPassageLabel(passageId: string) {
  const match = passageId.match(/p(\d+)$/i);
  return match ? match[1] : passageId;
}
