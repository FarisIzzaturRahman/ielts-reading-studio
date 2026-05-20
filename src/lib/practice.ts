import { getDrillById, getDrillsByQuestionType, getDrillsBySkill, getRelatedDrills, practiceDrills } from "@/data/drills";
import type { QuestionType, SkillTag } from "@/data/types";

export { getDrillById, getDrillsByQuestionType, getDrillsBySkill, getRelatedDrills, practiceDrills };

export function hasQuestionTypePractice(questionType: QuestionType) {
  return getDrillsByQuestionType(questionType).length > 0;
}

export function hasSkillPractice(skill: SkillTag) {
  return getDrillsBySkill(skill).length > 0;
}
