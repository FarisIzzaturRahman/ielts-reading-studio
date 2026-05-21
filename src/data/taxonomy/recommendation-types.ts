export type RecommendationType =
  | "question-type-strategy"
  | "skill-practice"
  | "trap-repair"
  | "time-management"
  | "foundation-review"
  | "challenge-test"
  | "review-incorrect"
  | "next-mini-test";

export type RecommendationTypeTaxonomyItem = {
  id: RecommendationType;
  slug: string;
  displayName: string;
  description: string;
};

export const RECOMMENDATION_TYPES: RecommendationTypeTaxonomyItem[] = [
  {
    id: "question-type-strategy",
    slug: "question-type-strategy",
    displayName: "Question Type Strategy",
    description: "Send the learner to a page or drill for a weak IELTS question type.",
  },
  {
    id: "skill-practice",
    slug: "skill-practice",
    displayName: "Skill Practice",
    description: "Send the learner to drills targeting a weak reading skill.",
  },
  {
    id: "trap-repair",
    slug: "trap-repair",
    displayName: "Trap Repair",
    description: "Send the learner to practice designed around a repeated trap type.",
  },
  {
    id: "time-management",
    slug: "time-management",
    displayName: "Time Management",
    description: "Recommend scanning or shorter drills when unanswered rate is high.",
  },
  {
    id: "foundation-review",
    slug: "foundation-review",
    displayName: "Foundation Review",
    description: "Recommend easier practice when accuracy is low.",
  },
  {
    id: "challenge-test",
    slug: "challenge-test",
    displayName: "Challenge Test",
    description: "Recommend harder content when accuracy is strong.",
  },
  {
    id: "review-incorrect",
    slug: "review-incorrect",
    displayName: "Review Incorrect Answers",
    description: "Recommend evidence review before retaking or moving on.",
  },
  {
    id: "next-mini-test",
    slug: "next-mini-test",
    displayName: "Next Mini Test",
    description: "Recommend another timed mini test to check transfer.",
  },
];
