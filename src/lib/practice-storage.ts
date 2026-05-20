import type { DrillSet, UserAnswers } from "@/data/types";
import type { DrillScoreResult } from "./drill-scoring";
import { loadJson, removeSavedItem, saveJson } from "./storage";

export type SavedDrillProgress = {
  version: 1;
  drillId: string;
  answers: UserAnswers;
  startedAt: string;
  updatedAt: string;
};

export type SavedDrillResult = {
  version: 1;
  drillId: string;
  completedAt: string;
  answers: UserAnswers;
  score: DrillScoreResult;
};

export type PracticeProgressSummary = {
  version: 1;
  completedDrillIds: string[];
  lastCompletedDrillId?: string;
  history: Array<{
    drillId: string;
    completedAt: string;
    rawScore: number;
    totalQuestions: number;
    percentage: number;
    practiceMode: DrillSet["practiceMode"];
    questionType?: DrillSet["questionType"];
    skill?: DrillSet["skill"];
  }>;
  accuracyByQuestionType: Record<string, { correct: number; total: number; accuracy: number }>;
  accuracyBySkill: Record<string, { correct: number; total: number; accuracy: number }>;
};

export type PracticeDrillStorageMeta = Pick<DrillSet, "drillId" | "practiceMode" | "questionType" | "skill">;

const progressRootKey = "ielts-reading-practice-progress-v1";
const resultRootKey = "ielts-reading-drill-results-v1";

export function drillProgressKey(drillId: string) {
  return `${progressRootKey}:${drillId}`;
}

export function drillResultKey(drillId: string) {
  return `${resultRootKey}:${drillId}`;
}

export function getSavedDrillProgress(drillId: string) {
  const progress = loadJson<SavedDrillProgress>(drillProgressKey(drillId));
  return progress?.version === 1 ? progress : null;
}

export function saveDrillProgress(progress: SavedDrillProgress) {
  return saveJson(drillProgressKey(progress.drillId), progress);
}

export function clearDrillProgress(drillId: string) {
  removeSavedItem(drillProgressKey(drillId));
}

export function getSavedDrillResult(drillId: string) {
  const result = loadJson<SavedDrillResult>(drillResultKey(drillId));
  return result?.version === 1 ? result : null;
}

export function getAllDrillResults() {
  return loadJson<SavedDrillResult[]>(resultRootKey) ?? [];
}

function upsertDrillResult(result: SavedDrillResult) {
  const results = getAllDrillResults().filter((item) => item.drillId !== result.drillId);
  results.push(result);
  results.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
  return saveJson(resultRootKey, results.slice(0, 50));
}

export function saveDrillResult(result: SavedDrillResult) {
  const savedSingle = saveJson(drillResultKey(result.drillId), result);
  const savedList = upsertDrillResult(result);
  clearDrillProgress(result.drillId);
  return savedSingle && savedList;
}

function addAggregate(
  target: Record<string, { correct: number; total: number; accuracy: number }>,
  key: string,
  correct: number,
  total: number,
) {
  const existing = target[key] ?? { correct: 0, total: 0, accuracy: 0 };
  existing.correct += correct;
  existing.total += total;
  existing.accuracy = existing.total ? Math.round((existing.correct / existing.total) * 100) : 0;
  target[key] = existing;
}

export function getPracticeProgress(drills: PracticeDrillStorageMeta[]): PracticeProgressSummary {
  const results = getAllDrillResults();
  const byDrillId = new Map(drills.map((drill) => [drill.drillId, drill]));
  const summary: PracticeProgressSummary = {
    version: 1,
    completedDrillIds: results.map((result) => result.drillId),
    lastCompletedDrillId: results[0]?.drillId,
    history: [],
    accuracyByQuestionType: {},
    accuracyBySkill: {},
  };

  for (const result of results) {
    const drill = byDrillId.get(result.drillId);
    summary.history.push({
      drillId: result.drillId,
      completedAt: result.completedAt,
      rawScore: result.score.rawScore,
      totalQuestions: result.score.totalQuestions,
      percentage: result.score.percentage,
      practiceMode: drill?.practiceMode ?? "question-type",
      questionType: drill?.questionType,
      skill: drill?.skill,
    });

    for (const entry of result.score.questionTypePerformance) {
      addAggregate(summary.accuracyByQuestionType, entry.label, entry.correct, entry.total);
    }

    for (const entry of result.score.skillPerformance) {
      addAggregate(summary.accuracyBySkill, entry.label, entry.correct, entry.total);
    }
  }

  return summary;
}
