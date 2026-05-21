export {
  MASTER_TAXONOMY,
  QUESTION_TYPES as QUESTION_TYPE_TAXONOMY,
  READING_SKILLS as SKILL_TAXONOMY,
  getQuestionTypeById,
  getQuestionTypeBySlug,
  getSkillById,
  getSkillBySlug,
  questionTypeSlug,
  skillSlug,
  slugifyLabel,
  trapTypeSlug,
} from "@/data/taxonomy";

export type {
  QuestionTypeTaxonomyItem,
  SkillTaxonomyItem,
  TrapTypeTaxonomyItem,
  DifficultyTaxonomyItem,
  TopicTaxonomyItem,
  RecommendationType,
} from "@/data/taxonomy";
