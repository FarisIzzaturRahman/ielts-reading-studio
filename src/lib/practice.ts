import { getDrillById, getDrillsByQuestionType, getDrillsBySkill, getRelatedDrills, practiceDrills } from "@/data/drills";
import { contentRelationshipIndex } from "@/data/content-library";
import type { QuestionType, SkillTag } from "@/data/types";
import { getPracticeTargets } from "@/lib/content-relationships";

export { getDrillById, getDrillsByQuestionType, getDrillsBySkill, getRelatedDrills, practiceDrills };
export { contentRelationshipIndex, getPracticeTargets };

export function hasQuestionTypePractice(questionType: QuestionType) {
  return getDrillsByQuestionType(questionType).length > 0;
}

export function hasSkillPractice(skill: SkillTag) {
  return getDrillsBySkill(skill).length > 0;
}
