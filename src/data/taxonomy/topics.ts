import type { ReadingDifficulty } from "../types";
import { slugifyLabel } from "./utils";

export type TopicTaxonomyItem = {
  id: string;
  slug: string;
  displayName: string;
  description: string;
  relatedTopics: string[];
  recommendedDifficultyRange: ReadingDifficulty[];
};

export const TOPICS: TopicTaxonomyItem[] = [
  ["climate-change", "Climate Change", "Research on climate impacts, adaptation and mitigation."],
  ["urban-planning", "Urban Planning", "Academic texts about city systems, transport, housing and public space."],
  ["public-health", "Public Health", "Population-level health policy, communication and prevention."],
  ["medicine", "Medicine", "Clinical innovation, medical systems and health technology."],
  ["psychology", "Psychology", "Human cognition, behaviour, motivation and decision-making."],
  ["neuroscience", "Neuroscience", "Brain systems, memory, learning and biological cognition."],
  ["linguistics", "Linguistics", "Language structure, acquisition, change and communication."],
  ["artificial-intelligence", "Artificial Intelligence", "Machine learning, automation, algorithmic systems and society."],
  ["education", "Education", "Learning design, classroom systems and assessment."],
  ["archaeology", "Archaeology", "Material culture, excavation, survey and historical interpretation."],
  ["anthropology", "Anthropology", "Culture, social organisation and human adaptation."],
  ["marine-biology", "Marine Biology", "Marine ecosystems, species monitoring and ocean life."],
  ["renewable-energy", "Renewable Energy", "Energy transitions, grids, storage and clean power systems."],
  ["agriculture", "Agriculture", "Farming systems, crop science and rural production."],
  ["food-security", "Food Security", "Food supply, resilience, nutrition and access."],
  ["environmental-science", "Environmental Science", "Ecosystems, environmental monitoring and sustainability."],
  ["behavioural-economics", "Behavioural Economics", "Decision architecture, incentives and public policy."],
  ["sociology", "Sociology", "Institutions, groups, social change and inequality."],
  ["space-exploration", "Space Exploration", "Planetary science, mission design and exploration technology."],
  ["architecture", "Architecture", "Buildings, design history, materials and sustainable construction."],
  ["history-of-science", "History of Science", "Development of scientific ideas, tools and institutions."],
  ["animal-behaviour", "Animal Behaviour", "Animal cognition, ecology and behavioural adaptation."],
  ["technology-and-society", "Technology and Society", "How technical systems interact with people and institutions."],
  ["genetics", "Genetics", "Heredity, genomics, population data and biological variation."],
  ["astronomy", "Astronomy", "Stars, observation systems, planetary science and cosmic measurement."],
  ["robotics", "Robotics", "Autonomous machines, sensing systems and human-robot collaboration."],
  ["communication-systems", "Communication Systems", "Networks, signals, media infrastructure and information exchange."],
  ["smart-cities", "Smart Cities", "Digital urban infrastructure, sensors and public-service coordination."],
  ["epidemiology", "Epidemiology", "Disease patterns, population risk and public health evidence."],
  ["nutrition", "Nutrition", "Diet, metabolism, food behaviour and population health."],
  ["mental-health", "Mental Health", "Psychological wellbeing, interventions and social determinants of health."],
  ["ecology", "Ecology", "Interactions between organisms, habitats and environmental processes."],
  ["physics", "Physics", "Matter, energy, measurement and physical systems."],
  ["cultural-studies", "Cultural Studies", "Cultural memory, institutions, representation and social meaning."],
  ["biodiversity", "Biodiversity", "Species richness, conservation evidence and ecosystem variety."],
  ["conservation", "Conservation", "Protection of habitats, species and ecological resources."],
  ["sustainable-cities", "Sustainable Cities", "Urban sustainability, climate adaptation and low-impact infrastructure."],
].map(([id, displayName, description]) => ({
  id,
  slug: id,
  displayName,
  description,
  relatedTopics: [],
  recommendedDifficultyRange: ["Easy", "Medium", "Hard", "Band 8-9 Challenge"] as ReadingDifficulty[],
}));

const keywordTopicMap: Array<[RegExp, string]> = [
  [/genetic|genome|heredity|dna/i, "genetics"],
  [/astronomy|star|telescope|cosmic|planetary observation/i, "astronomy"],
  [/robot|robotics|autonomous machine/i, "robotics"],
  [/communication|network|signal|media infrastructure/i, "communication-systems"],
  [/smart city|sensor network|urban data/i, "smart-cities"],
  [/epidemiology|disease pattern|outbreak|population risk/i, "epidemiology"],
  [/nutrition|diet|metabolism|food behaviour/i, "nutrition"],
  [/mental health|wellbeing|stress|psychological wellbeing/i, "mental-health"],
  [/biodiversity|species richness/i, "biodiversity"],
  [/conservation|protected habitat|restoration/i, "conservation"],
  [/sustainable city|sustainable cities/i, "sustainable-cities"],
  [/ecology|ecological|habitat/i, "ecology"],
  [/physics|material|semiconductor|measurement/i, "physics"],
  [/cultural|museum|heritage memory/i, "cultural-studies"],
  [/climate|heat|carbon/i, "climate-change"],
  [/urban|city|transport|street|architecture|building/i, "urban-planning"],
  [/health|medicine|medical|clinical/i, "public-health"],
  [/psychology|decision|behaviour|behavior|choice/i, "psychology"],
  [/brain|memory|neuro/i, "neuroscience"],
  [/language|linguistic|writing|script/i, "linguistics"],
  [/artificial intelligence|algorithm|automation|ai/i, "artificial-intelligence"],
  [/education|learning|classroom|school/i, "education"],
  [/archaeology|ancient|settlement|soil/i, "archaeology"],
  [/marine|reef|ocean|biodiversity/i, "marine-biology"],
  [/energy|renewable|grid|solar|wind/i, "renewable-energy"],
  [/agriculture|crop|food/i, "agriculture"],
  [/environment|ecology|species/i, "environmental-science"],
  [/economics|nudge|default/i, "behavioural-economics"],
  [/sociology|social|labour|labor|institution/i, "sociology"],
  [/space|planet|lunar|martian|mission/i, "space-exploration"],
  [/technology|digital/i, "technology-and-society"],
  [/history|science/i, "history-of-science"],
];

export function getTopicById(id: string) {
  return TOPICS.find((item) => item.id === id || item.slug === id);
}

export function inferTopicId(value: string) {
  return keywordTopicMap.find(([pattern]) => pattern.test(value))?.[1] ?? slugifyLabel(value);
}
