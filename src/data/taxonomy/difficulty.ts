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
    description: "More direct wording, shorter sentences, simpler vocabulary and clearer evidence.",
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
    description: "Standard IELTS-style academic wording with moderate paraphrase and fair distractors.",
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
    description: "Denser academic language, subtler paraphrases, complex sentences and less direct evidence.",
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
    description: "High lexical density, heavy paraphrasing, subtle inference and difficult distractors.",
  },
];

export function getDifficultyById(id: ReadingDifficulty | string) {
  return DIFFICULTY_LEVELS.find((item) => item.id === id);
}

export function difficultySlug(difficulty: ReadingDifficulty | string) {
  return getDifficultyById(difficulty)?.slug ?? slugifyLabel(difficulty);
}
