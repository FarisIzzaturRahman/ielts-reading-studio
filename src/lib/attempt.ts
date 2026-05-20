import type { ReadingTest } from "@/data/types";
import { generateDiagnosis } from "./diagnosis";
import type { ScoreResult } from "./scoring";
import {
  diagnosisHistoryKey,
  diagnosisKey,
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

  if (progress?.status === "in-progress") {
    return {
      status: "In Progress" as const,
      result,
      progress,
    };
  }

  if (result) {
    return {
      status: "Completed" as const,
      result,
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
  score: ScoreResult,
  elapsedSeconds: number,
): SavedResult {
  const completedAt = new Date().toISOString();
  const diagnosis = generateDiagnosis(test.testId, score, completedAt);

  return {
    ...progress,
    status: "completed",
    timeRemainingSeconds: Math.max(0, progress.timeRemainingSeconds),
    updatedAt: completedAt,
    submittedAt: completedAt,
    elapsedSeconds,
    rawScore: score.correct,
    totalQuestions: score.total,
    percentage: score.percentage,
    estimatedBand: score.estimatedBand,
    diagnosis,
  };
}

export function saveDiagnosisResult(result: SavedResult) {
  if (result.diagnosis) {
    saveJson(diagnosisKey(result.testId), result.diagnosis);

    const history = loadJson<Record<string, SavedResult["diagnosis"]>>(diagnosisHistoryKey()) ?? {};
    saveJson(diagnosisHistoryKey(), {
      ...history,
      [result.testId]: result.diagnosis,
    });
  }
}
