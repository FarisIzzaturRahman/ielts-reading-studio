import { practiceDrills } from "./drills";
import { strategyLessons } from "./strategy-lessons";
import { readingTests } from "./tests";
import type { ContentLibrary } from "@/lib/content-relationships";
import { buildContentRelationshipIndex } from "@/lib/content-relationships";

export const contentLibrary = {
  tests: readingTests,
  drills: practiceDrills,
  lessons: strategyLessons,
} satisfies ContentLibrary;

export const contentRelationshipIndex = buildContentRelationshipIndex(contentLibrary);
