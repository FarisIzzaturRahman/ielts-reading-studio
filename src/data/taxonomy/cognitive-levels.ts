export type CognitiveLevel = "Recall" | "Locate" | "Understand" | "Analyse" | "Infer" | "Evaluate";

export type CognitiveLevelTaxonomyItem = {
  id: CognitiveLevel;
  slug: string;
  displayName: CognitiveLevel;
  description: string;
};

export const COGNITIVE_LEVELS: CognitiveLevelTaxonomyItem[] = [
  { id: "Recall", slug: "recall", displayName: "Recall", description: "Recognise directly stated information." },
  { id: "Locate", slug: "locate", displayName: "Locate", description: "Find the exact passage area efficiently." },
  { id: "Understand", slug: "understand", displayName: "Understand", description: "Comprehend detail, paraphrase or main idea." },
  { id: "Analyse", slug: "analyse", displayName: "Analyse", description: "Compare claims, scope, grammar or relationships." },
  { id: "Infer", slug: "infer", displayName: "Infer", description: "Draw a careful implication from evidence." },
  { id: "Evaluate", slug: "evaluate", displayName: "Evaluate", description: "Assess writer stance or competing interpretations." },
];
