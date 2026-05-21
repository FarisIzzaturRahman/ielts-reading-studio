import type { PracticeMode } from "../types";

export type PracticeModeTaxonomyItem = {
  id: PracticeMode;
  slug: PracticeMode;
  displayName: string;
  description: string;
};

export const PRACTICE_MODES: PracticeModeTaxonomyItem[] = [
  {
    id: "question-type",
    slug: "question-type",
    displayName: "Question Type Practice",
    description: "Focused practice for one IELTS Academic Reading task format.",
  },
  {
    id: "skill",
    slug: "skill",
    displayName: "Skill Practice",
    description: "Focused practice for one reading behaviour diagnosed from tests or drills.",
  },
];

export type DrillCategory =
  | "Exact Meaning"
  | "Main Ideas"
  | "Locating Details"
  | "Grammar and Meaning"
  | "Avoiding Distractors"
  | "Inference"
  | "Scanning";

export const DRILL_CATEGORIES: Array<{ id: DrillCategory; slug: string; displayName: DrillCategory }> = [
  { id: "Exact Meaning", slug: "exact-meaning", displayName: "Exact Meaning" },
  { id: "Main Ideas", slug: "main-ideas", displayName: "Main Ideas" },
  { id: "Locating Details", slug: "locating-details", displayName: "Locating Details" },
  { id: "Grammar and Meaning", slug: "grammar-and-meaning", displayName: "Grammar and Meaning" },
  { id: "Avoiding Distractors", slug: "avoiding-distractors", displayName: "Avoiding Distractors" },
  { id: "Inference", slug: "inference", displayName: "Inference" },
  { id: "Scanning", slug: "scanning", displayName: "Scanning" },
];
