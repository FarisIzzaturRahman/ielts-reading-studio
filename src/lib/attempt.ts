import type { ReadingTest } from "@/data/types";
import { estimateMiniBand } from "./scoring";
import {
  loadJson,
  progressKey,
  removeSavedItem,
  resultKey,
  saveJson,
  type SavedProgress,
  type SavedResult,
} from "./storage";
import { createDeadline } from "./timer";

export function createInitialProgress(test: ReadingTest): SavedProgress {
  const now = new Date().toISOString();

  return {
    version: 1,
    testId: test.testId,
    status: "in-progress",
    answers: {},
    flagged: {},
    notes: "",
    highlights: [],
    startedAt: now,
    deadlineAt: createDeadline(test.timeLimitMinutes),
    timeRemainingSeconds: test.timeLimitMinutes * 60,
    updatedAt: now,
  };
}

export function startNewAttempt(test: ReadingTest) {
  const progress = createInitialProgress(test);
  removeSavedItem(resultKey(test.testId));
  removeSavedItem(progressKey(test.testId));
  return {
    progress,
    saved: saveJson(progressKey(test.testId), progress),
  };
}

export function clearAttempt(testId: string) {
  const progressCleared = removeSavedItem(progressKey(testId));
  const resultCleared = removeSavedItem(resultKey(testId));
  return progressCleared && resultCleared;
}

export function getSavedProgress(testId: string) {
  return loadJson<SavedProgress>(progressKey(testId));
}

export function getSavedResult(testId: string) {
  return loadJson<SavedResult>(resultKey(testId));
}

export function getAttemptStatus(test: ReadingTest) {
  const result = getSavedResult(test.testId);
  const progress = getSavedProgress(test.testId);

  if (result) {
    return {
      status: "Completed" as const,
      result,
      progress,
    };
  }

  if (progress?.status === "in-progress") {
    return {
      status: "In Progress" as const,
      result: null,
      progress,
    };
  }

  return {
    status: "Not Started" as const,
    result: null,
    progress: null,
  };
}

export function buildResult(
  test: ReadingTest,
  progress: SavedProgress,
  rawScore: number,
  elapsedSeconds: number,
): SavedResult {
  const totalQuestions = test.questions.length;
  const percentage = totalQuestions ? Math.round((rawScore / totalQuestions) * 100) : 0;

  return {
    ...progress,
    status: "completed",
    timeRemainingSeconds: Math.max(0, progress.timeRemainingSeconds),
    updatedAt: new Date().toISOString(),
    submittedAt: new Date().toISOString(),
    elapsedSeconds,
    rawScore,
    totalQuestions,
    percentage,
    estimatedBand: estimateMiniBand(rawScore, totalQuestions),
  };
}
