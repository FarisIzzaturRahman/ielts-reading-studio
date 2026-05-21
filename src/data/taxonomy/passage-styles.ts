export type PassageStyle = "Expository" | "Analytical" | "Argumentative" | "Historical" | "Process-based" | "Comparative";

export type PassageStyleTaxonomyItem = {
  id: PassageStyle;
  slug: string;
  displayName: PassageStyle;
  description: string;
};

export const PASSAGE_STYLES: PassageStyleTaxonomyItem[] = [
  {
    id: "Expository",
    slug: "expository",
    displayName: "Expository",
    description: "Explains a topic, system or research area with mostly direct information.",
  },
  {
    id: "Analytical",
    slug: "analytical",
    displayName: "Analytical",
    description: "Explains evidence, methods, limits and implications.",
  },
  {
    id: "Argumentative",
    slug: "argumentative",
    displayName: "Argumentative",
    description: "Develops a claim or evaluates competing views.",
  },
  {
    id: "Historical",
    slug: "historical",
    displayName: "Historical",
    description: "Traces development over time, often with chronology and interpretation.",
  },
  {
    id: "Process-based",
    slug: "process-based",
    displayName: "Process-based",
    description: "Explains stages, cycles, mechanisms or cause-effect sequences.",
  },
  {
    id: "Comparative",
    slug: "comparative",
    displayName: "Comparative",
    description: "Compares methods, groups, theories, periods or outcomes.",
  },
];
