export * from "./cognitive-levels";
export * from "./difficulty";
export * from "./passage-styles";
export * from "./practice-modes";
export * from "./question-types";
export * from "./recommendation-types";
export * from "./skills";
export * from "./topics";
export * from "./trap-types";
export * from "./utils";

import { COGNITIVE_LEVELS } from "./cognitive-levels";
import { DIFFICULTY_LEVELS } from "./difficulty";
import { PASSAGE_STYLES } from "./passage-styles";
import { DRILL_CATEGORIES, PRACTICE_MODES } from "./practice-modes";
import { QUESTION_TYPES } from "./question-types";
import { RECOMMENDATION_TYPES } from "./recommendation-types";
import { READING_SKILLS } from "./skills";
import { TOPICS } from "./topics";
import { TRAP_TYPES } from "./trap-types";

export const MASTER_TAXONOMY = {
  questionTypes: QUESTION_TYPES,
  readingSkills: READING_SKILLS,
  trapTypes: TRAP_TYPES,
  difficultyLevels: DIFFICULTY_LEVELS,
  topics: TOPICS,
  passageStyles: PASSAGE_STYLES,
  cognitiveLevels: COGNITIVE_LEVELS,
  drillCategories: DRILL_CATEGORIES,
  practiceModes: PRACTICE_MODES,
  recommendationTypes: RECOMMENDATION_TYPES,
} as const;
