import type { ReadingDifficulty } from "../types";
import { slugifyLabel } from "./utils";

export type DifficultyTaxonomyItem = {
  id: ReadingDifficulty;
  slug: string;
  displayName: ReadingDifficulty;
  targetBand: string;
  vocabularyComplexity: "Low" | "Moderate" | "High" | "Very high";
  sentenceComplexity: "Low" | "Moderate" | "High" | "Very high";
  inferenceDensity: "Low" | "Moderate" | "High" | "Very high";
  paraphraseDensity: "Low" | "Moderate" | "High" | "Very high";
  distractorSubtlety: "Low" | "Moderate" | "High" | "Very high";
  cognitiveDemand: "Low" | "Moderate" | "High" | "Very high";
  description: string;
};

export const DIFFICULTY_LEVELS: DifficultyTaxonomyItem[] = [
  {
    id: "Easy",
    slug: "easy",
    displayName: "Easy",
    targetBand: "5.0-6.0",
    vocabularyComplexity: "Low",
    sentenceComplexity: "Low",
    inferenceDensity: "Low",
    paraphraseDensity: "Low",
    distractorSubtlety: "Low",
    cognitiveDemand: "Low",
    description:
      "Best for learners building confidence with IELTS Academic Reading. These tests use clearer evidence, more direct paraphrasing and lighter cognitive load.",
  },
  {
    id: "Medium",
    slug: "medium",
    displayName: "Medium",
    targetBand: "6.0-7.0",
    vocabularyComplexity: "Moderate",
    sentenceComplexity: "Moderate",
    inferenceDensity: "Moderate",
    paraphraseDensity: "Moderate",
    distractorSubtlety: "Moderate",
    cognitiveDemand: "Moderate",
    description:
      "Best for regular IELTS practice. These tests include moderate paraphrasing, mixed question types and realistic IELTS-style traps.",
  },
  {
    id: "Hard",
    slug: "hard",
    displayName: "Hard",
    targetBand: "7.0-8.0",
    vocabularyComplexity: "High",
    sentenceComplexity: "High",
    inferenceDensity: "High",
    paraphraseDensity: "High",
    distractorSubtlety: "High",
    cognitiveDemand: "High",
    description:
      "Best for learners aiming for Band 7+. These tests use denser passages, subtler paraphrasing, stronger distractors and more inference-based questions.",
  },
  {
    id: "Band 8-9 Challenge",
    slug: "band-8-9-challenge",
    displayName: "Band 8-9 Challenge",
    targetBand: "8.0-9.0",
    vocabularyComplexity: "Very high",
    sentenceComplexity: "Very high",
    inferenceDensity: "Very high",
    paraphraseDensity: "Very high",
    distractorSubtlety: "Very high",
    cognitiveDemand: "Very high",
    description:
      "Best for advanced learners aiming for very high scores. These tests include dense academic passages, reduced keyword overlap, subtle inference and more cognitively demanding distractors.",
  },
];

export function getDifficultyById(id: ReadingDifficulty | string) {
  return DIFFICULTY_LEVELS.find((item) => item.id === id);
}

export function difficultySlug(difficulty: ReadingDifficulty | string) {
  return getDifficultyById(difficulty)?.slug ?? slugifyLabel(difficulty);
}
