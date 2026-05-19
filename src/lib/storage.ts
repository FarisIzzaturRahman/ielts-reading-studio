import type { FlaggedQuestions, UserAnswers } from "@/data/types";

export type AttemptStatus = "in-progress" | "completed";

export type SavedProgress = {
  version: 1;
  testId: string;
  status: AttemptStatus;
  answers: UserAnswers;
  flagged: FlaggedQuestions;
  notes: string;
  highlights: string[];
  startedAt: string;
  deadlineAt: string;
  timeRemainingSeconds: number;
  updatedAt: string;
};

export type SavedResult = SavedProgress & {
  status: "completed";
  submittedAt: string;
  elapsedSeconds: number;
  rawScore: number;
  totalQuestions: number;
  percentage: number;
  estimatedBand: string;
};

const APP_PREFIX = "ielts-reading:v1";

export function progressKey(testId: string) {
  return `${APP_PREFIX}:progress:${testId}`;
}

export function resultKey(testId: string) {
  return `${APP_PREFIX}:result:${testId}`;
}

export function loadJson<T>(key: string): T | null {
  if (typeof window === "undefined") return null;

  try {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : null;
  } catch {
    return null;
  }
}

export function saveJson<T>(key: string, value: T) {
  if (typeof window === "undefined") return false;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeSavedItem(key: string) {
  if (typeof window === "undefined") return false;

  try {
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function isStorageAvailable() {
  if (typeof window === "undefined") return false;

  try {
    const key = `${APP_PREFIX}:storage-check`;
    window.localStorage.setItem(key, "1");
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}
