import { buildLessonMetadata, inferLessonTraps } from "@/lib/content-metadata";
import { QUESTION_TYPES, type QuestionTypeTaxonomyItem } from "./taxonomy/question-types";
import { READING_SKILLS, type SkillTaxonomyItem } from "./taxonomy/skills";
import { slugifyLabel } from "./taxonomy/utils";
import type { QuestionType, ReadingDifficulty, SkillTag, StrategyLesson, TrapType } from "./types";

type StrategyLessonBlueprint = Omit<
  StrategyLesson,
  | "relatedQuestionTypes"
  | "relatedSkills"
  | "relatedTraps"
  | "targetLevel"
  | "estimatedStudyTime"
  | "tags"
  | "metadata"
>;

function inferTargetLevel(lesson: StrategyLessonBlueprint): ReadingDifficulty {
  if (lesson.questionType === "multiple-choice" || lesson.skill === "Making inference") return "Hard";
  if (lesson.skillFocus.includes("Time-efficient scanning")) return "Easy";
  return "Medium";
}

function enrichStrategyLesson(lesson: StrategyLessonBlueprint): StrategyLesson {
  const relatedQuestionTypes: QuestionType[] = lesson.questionType ? [lesson.questionType] : [];
  const relatedSkills: SkillTag[] = [...new Set([...(lesson.skill ? [lesson.skill] : []), ...lesson.skillFocus])];
  const relatedTraps: TrapType[] = inferLessonTraps(lesson.commonTraps);
  const targetLevel = inferTargetLevel(lesson);
  const estimatedStudyTime = Math.max(4, Math.min(8, Math.ceil((lesson.steps.length + lesson.commonTraps.length) / 2)));
  const tags = [
    "academic-reading",
    "strategy-lesson",
    ...relatedQuestionTypes.map(slugifyLabel),
    ...relatedSkills.map(slugifyLabel),
    ...relatedTraps.map(slugifyLabel),
  ];

  const lessonWithoutMetadata: Omit<StrategyLesson, "metadata"> = {
    ...lesson,
    relatedQuestionTypes,
    relatedSkills,
    relatedTraps,
    targetLevel,
    estimatedStudyTime,
    tags,
  };

  return {
    ...lessonWithoutMetadata,
    metadata: buildLessonMetadata(lessonWithoutMetadata),
  };
}

const strategyLessonBlueprints: StrategyLessonBlueprint[] = [
  {
    lessonId: "strategy-tfng",
    title: "True / False / Not Given Strategy",
    questionType: "true-false-not-given",
    skillFocus: ["Understanding detail", "Avoiding overgeneralisation"],
    whatItTests:
      "This question type tests whether you can compare the exact meaning of a statement with information in the passage.",
    whyItMatters:
      "Many IELTS Reading mistakes happen when the topic is mentioned but the exact claim is not supported.",
    steps: [
      "Read the statement carefully and identify the exact claim.",
      "Locate the closest evidence in the passage.",
      "Choose True if the meaning agrees with the passage.",
      "Choose False if the meaning contradicts the passage.",
      "Choose Not Given if the passage does not provide enough evidence.",
    ],
    commonTraps: [
      "The same topic is mentioned, but the exact information is missing.",
      "An absolute word changes the meaning of the statement.",
      "Outside knowledge makes an unsupported statement sound reasonable.",
    ],
    workedExample: {
      statement: "The policy was applied in all city districts.",
      passageText: "The policy was introduced in selected districts where heat exposure was highest.",
      answer: "False",
      explanation: "All city districts contradicts selected districts, so the statement is false.",
    },
  },
  {
    lessonId: "strategy-matching-headings",
    title: "Matching Headings Strategy",
    questionType: "matching-headings",
    skillFocus: ["Understanding main idea", "Identifying paragraph function"],
    whatItTests: "This question type tests whether you can identify the main idea or function of a paragraph.",
    whyItMatters: "High-band readers avoid choosing headings that match only one detail.",
    steps: [
      "Read the whole paragraph before looking for the answer.",
      "Ask what the paragraph mainly does.",
      "Reduce the paragraph to one short idea.",
      "Compare that idea with the available headings.",
      "Reject headings that match only one example or phrase.",
    ],
    commonTraps: [
      "A heading repeats a keyword but misses the paragraph purpose.",
      "A heading describes a minor example rather than the central idea.",
      "Two headings look similar, but one is too broad or too narrow.",
    ],
    workedExample: {
      statement: "Choose a heading for a paragraph that explains why a repeated measure was selected.",
      passageText: "Researchers chose a measure that could be repeated across different districts and years.",
      answer: "A measure selected for repeated checking",
      explanation: "The heading captures the paragraph function, not only the topic of measurement.",
    },
  },
  {
    lessonId: "strategy-matching-information",
    title: "Matching Information Strategy",
    questionType: "matching-information",
    skillFocus: ["Locating explicit information", "Time-efficient scanning"],
    whatItTests: "This question type tests whether you can locate specific information in the correct paragraph.",
    whyItMatters: "IELTS often hides the answer through paraphrase rather than exact keyword repetition.",
    steps: [
      "Identify the most searchable part of the information item.",
      "Scan paragraph openings and distinctive nouns.",
      "Read around a likely match.",
      "Confirm the whole information item before selecting the paragraph.",
    ],
    commonTraps: [
      "A paragraph contains similar keywords but not the full information.",
      "The answer is paraphrased using different wording.",
      "A nearby paragraph discusses the same topic but not the requested detail.",
    ],
    workedExample: {
      statement: "Which paragraph mentions a limitation of the method?",
      passageText: "The method helped comparison, although it could not capture every local difference.",
      answer: "The paragraph containing the limitation",
      explanation: "The phrase could not capture every local difference signals the limitation.",
    },
  },
  {
    lessonId: "strategy-summary-completion",
    title: "Summary Completion Strategy",
    questionType: "summary-completion",
    skillFocus: ["Recognising paraphrase", "Understanding detail"],
    whatItTests: "This question type tests whether you can follow a compressed version of passage information.",
    whyItMatters: "The summary usually paraphrases the passage, so exact keyword matching is unreliable.",
    steps: [
      "Read the whole summary first.",
      "Predict whether each gap needs a noun, verb, adjective or phrase.",
      "Find the matching idea in the passage.",
      "Check grammar before and after the gap.",
      "Keep within the word limit.",
    ],
    commonTraps: [
      "The passage word fits the topic but not the grammar.",
      "The summary uses synonyms for the answer sentence.",
      "A nearby word is attractive but changes the meaning.",
    ],
    workedExample: {
      statement: "The programme improved ______ when local interpretation was careful.",
      passageText: "With careful local interpretation, the programme produced clearer public decisions.",
      answer: "clearer public decisions",
      explanation: "The answer completes the meaning and grammar of the summary.",
    },
  },
  {
    lessonId: "strategy-sentence-completion",
    title: "Sentence Completion Strategy",
    questionType: "sentence-completion",
    skillFocus: ["Understanding detail", "Recognising paraphrase"],
    whatItTests: "This question type tests whether you can complete a sentence with precise passage evidence.",
    whyItMatters: "A correct answer must fit both the passage meaning and the sentence grammar.",
    steps: [
      "Read the whole sentence and predict the missing word type.",
      "Locate the related evidence sentence.",
      "Choose only the words needed.",
      "Check the word limit and grammar.",
    ],
    commonTraps: [
      "The chosen words are too many for the word limit.",
      "The answer is near the evidence but does not fit the sentence.",
      "The answer changes singular and plural meaning.",
    ],
    workedExample: {
      statement: "The pilot compared locations by using ______.",
      passageText: "The pilot used seasonal comparison to compare locations and periods.",
      answer: "seasonal comparison",
      explanation: "The phrase directly completes the sentence and matches the passage.",
    },
  },
  {
    lessonId: "strategy-multiple-choice",
    title: "Multiple Choice Strategy",
    questionType: "multiple-choice",
    skillFocus: ["Making inference", "Distinguishing fact from claim"],
    whatItTests: "This question type tests whether you can choose the option best supported by passage evidence.",
    whyItMatters: "Wrong options are often partly true, too broad, or based on outside assumptions.",
    steps: [
      "Read the question stem carefully before checking options.",
      "Locate the relevant part of the passage.",
      "Eliminate options contradicted by the passage.",
      "Reject options that are plausible but unsupported.",
      "Choose the best supported option, not the most familiar one.",
    ],
    commonTraps: [
      "An option is true in general but not stated in the passage.",
      "An option uses similar language with a different meaning.",
      "An option exaggerates a cautious claim.",
    ],
    workedExample: {
      statement: "Which statement best reflects the writer's view?",
      passageText: "The future is likely to be modest rather than dramatic, based on better evidence loops.",
      answer: "Progress is likely to come from careful improvements rather than dramatic claims.",
      explanation: "This option preserves the writer's cautious contrast between modest progress and dramatic claims.",
    },
  },
  {
    lessonId: "strategy-paraphrase",
    title: "Recognising Paraphrase Strategy",
    skill: "Recognising paraphrase",
    skillFocus: ["Recognising paraphrase", "Understanding detail"],
    whatItTests: "This practice trains you to connect question wording with equivalent passage meaning.",
    whyItMatters: "In IELTS Academic Reading, the answer is often not written using the same words as the question.",
    steps: [
      "Identify the key meaning in the question.",
      "Predict possible synonyms or reworded ideas.",
      "Scan for meaning, not only identical words.",
      "Compare the full phrase before choosing.",
    ],
    commonTraps: [
      "A repeated keyword appears in the wrong paragraph.",
      "A synonym is correct but the surrounding claim is different.",
      "A phrase matches the topic but not the exact relationship.",
    ],
    workedExample: {
      statement: "Local interpretation was essential.",
      passageText: "The result was useful only when practitioners made careful local judgements.",
      answer: "Paraphrase match",
      explanation: "Careful local judgements paraphrases local interpretation.",
    },
  },
  {
    lessonId: "strategy-main-idea",
    title: "Understanding Main Idea Strategy",
    skill: "Understanding main idea",
    skillFocus: ["Understanding main idea", "Identifying paragraph function"],
    whatItTests: "This practice trains you to identify the central point of a paragraph or passage.",
    whyItMatters: "Main idea control supports Matching Headings, passage purpose, and difficult multiple choice questions.",
    steps: [
      "Read the first sentence for orientation.",
      "Read the final sentence for the paragraph's conclusion or shift.",
      "Ignore examples until you understand what they support.",
      "State the paragraph's purpose in one sentence.",
    ],
    commonTraps: [
      "A detail is memorable but not central.",
      "A heading is too broad for the paragraph.",
      "The paragraph changes direction after a contrast word.",
    ],
    workedExample: {
      statement: "A paragraph describes a pilot, then explains why its results must be interpreted cautiously.",
      passageText: "The pilot produced useful figures, but researchers warned that local conditions shaped the outcome.",
      answer: "Useful results with important limits",
      explanation: "The main idea includes both the result and the caution.",
    },
  },
  {
    lessonId: "strategy-inference",
    title: "Making Inference Strategy",
    skill: "Making inference",
    skillFocus: ["Making inference", "Distinguishing fact from claim"],
    whatItTests: "This practice trains you to identify what is implied by the passage without adding outside knowledge.",
    whyItMatters: "Band 7-9 questions often test cautious interpretation rather than direct copying.",
    steps: [
      "Find the evidence sentence first.",
      "Separate what the passage says from what it only suggests.",
      "Reject answers that need extra assumptions.",
      "Choose the option that follows most directly from the evidence.",
    ],
    commonTraps: [
      "The answer is plausible but not required by the passage.",
      "A cautious claim is treated as a strong conclusion.",
      "Outside knowledge fills a gap in the evidence.",
    ],
    workedExample: {
      statement: "A project helped only when users gave feedback regularly.",
      passageText: "Benefits lasted only where feedback from users was collected regularly.",
      answer: "Regular feedback was necessary for lasting value.",
      explanation: "The word only supports the inference that feedback was necessary.",
    },
  },
  {
    lessonId: "strategy-scanning",
    title: "Time-efficient Scanning Strategy",
    skill: "Time-efficient scanning",
    skillFocus: ["Time-efficient scanning", "Locating explicit information"],
    whatItTests: "This practice trains you to find likely answer locations quickly without abandoning evidence accuracy.",
    whyItMatters: "IELTS Academic Reading requires both speed and exact checking.",
    steps: [
      "Look for names, numbers, technical nouns and unusual phrases.",
      "Move quickly until a likely location appears.",
      "Slow down around the evidence sentence.",
      "Confirm meaning before answering.",
    ],
    commonTraps: [
      "Stopping at the first repeated keyword.",
      "Reading every sentence at the same slow speed.",
      "Moving on before confirming the full answer.",
    ],
    workedExample: {
      statement: "Find what transparency should be paired with.",
      passageText: "Transparency is most useful when paired with training.",
      answer: "training",
      explanation: "Scanning for transparency leads to the exact answer sentence.",
    },
  },
];

function createQuestionTypeLesson(questionType: QuestionTypeTaxonomyItem): StrategyLessonBlueprint {
  return {
    lessonId: `strategy-${questionType.slug}`,
    title: `${questionType.displayName} Strategy`,
    questionType: questionType.id,
    skillFocus: questionType.commonSkills.length ? questionType.commonSkills.slice(0, 2) : ["Understanding detail"],
    whatItTests: questionType.tests,
    whyItMatters: `${questionType.displayName} questions reward careful evidence checking rather than keyword matching alone.`,
    steps: questionType.recommendedStrategies,
    commonTraps: questionType.commonTraps.map((trap) => `${trap}: the passage may mention related information while changing the exact meaning.`),
    workedExample: {
      statement: `A ${questionType.displayName} item asks about the exact meaning of a short academic claim.`,
      passageText: "The passage supports a narrower version of the claim and includes a limiting phrase.",
      answer: "Choose the option that matches the supported meaning only.",
      explanation: "The correct response must preserve the passage's scope, evidence and grammar.",
    },
  };
}

function createSkillLesson(skill: SkillTaxonomyItem): StrategyLessonBlueprint {
  return {
    lessonId: `strategy-skill-${skill.slug}`,
    title: `${skill.displayName} Strategy`,
    skill: skill.id,
    skillFocus: [skill.id],
    whatItTests: skill.description,
    whyItMatters: skill.whyItMatters,
    steps: skill.strategy,
    commonTraps: skill.commonTrapTypes.map((trap) => `${trap}: ${skill.commonMistakes[0] ?? "the question may attract a quick but unsupported answer."}`),
    workedExample: {
      statement: `Practise ${skill.displayName.toLowerCase()} with a short evidence-based item.`,
      passageText: "The passage gives enough evidence, but the wording is not identical to the question.",
      answer: "Use the evidence, not outside knowledge.",
      explanation: "This skill improves when you compare the full meaning of the question with the passage.",
    },
  };
}

const authoredQuestionTypeIds = new Set(strategyLessonBlueprints.flatMap((lesson) => (lesson.questionType ? [lesson.questionType] : [])));
const authoredSkillIds = new Set(strategyLessonBlueprints.flatMap((lesson) => (lesson.skill ? [lesson.skill] : [])));

const supplementaryLessonBlueprints: StrategyLessonBlueprint[] = [
  ...QUESTION_TYPES.filter((questionType) => !authoredQuestionTypeIds.has(questionType.id)).map(createQuestionTypeLesson),
  ...READING_SKILLS.filter((skill) => !authoredSkillIds.has(skill.id)).map(createSkillLesson),
];

export const strategyLessons: StrategyLesson[] = [...strategyLessonBlueprints, ...supplementaryLessonBlueprints].map(enrichStrategyLesson);

export function getStrategyLesson(lessonId: string) {
  return strategyLessons.find((lesson) => lesson.lessonId === lessonId);
}
