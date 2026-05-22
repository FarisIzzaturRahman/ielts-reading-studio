import type {
  Passage,
  Question,
  ReadingDifficulty,
  ReadingTest,
} from "./types";
import { buildPassageMetadata, buildQuestionMetadata, buildTestMetadata } from "@/lib/content-metadata";

type PassageSeed = Omit<Passage, "metadata">;
type QuestionSeed = Omit<Question, "id" | "questionNumber" | "tags" | "metadata">;

function tagSlug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function makePassage(
  passage: PassageSeed,
  context: {
    difficulty: ReadingDifficulty;
    estimatedBand: string;
    subtopic: string;
    batchId: string;
  },
): Passage {
  return {
    ...passage,
    metadata: buildPassageMetadata(passage, context),
  };
}

function makeQuestion(question: QuestionSeed, index: number, batchId: string): Question {
  const questionWithoutMetadata: Omit<Question, "metadata"> = {
    ...question,
    id: index + 1,
    questionNumber: index + 1,
    tags: [
      "academic-reading",
      "phase-3a-realism",
      batchId,
      question.type,
      tagSlug(question.skill),
      tagSlug(question.trapType),
      tagSlug(question.difficulty),
    ],
  };

  return {
    ...questionWithoutMetadata,
    metadata: buildQuestionMetadata(questionWithoutMetadata),
  };
}

function makeTest(input: {
  testId: string;
  slug: string;
  legacyIds?: string[];
  title: string;
  description: string;
  topic: string;
  difficulty: ReadingDifficulty;
  targetBand: string;
  timeLimitMinutes: number;
  subtopic: string;
  passages: PassageSeed[];
  questions: QuestionSeed[];
}): ReadingTest {
  const batchId = "phase-3a-realism-flagship";
  const passages = input.passages.map((passage) =>
    makePassage(passage, {
      difficulty: input.difficulty,
      estimatedBand: input.targetBand,
      subtopic: input.subtopic,
      batchId,
    }),
  );
  const questions = input.questions.map((question, index) => makeQuestion(question, index, batchId));
  const testWithoutMetadata: Omit<ReadingTest, "metadata"> = {
    testId: input.testId,
    slug: input.slug,
    legacyIds: input.legacyIds,
    title: input.title,
    description: input.description,
    topic: input.topic,
    difficulty: input.difficulty,
    targetBand: input.targetBand,
    mode: "mini",
    testType: "Academic",
    timeLimitMinutes: input.timeLimitMinutes,
    estimatedTimeMinutes: input.timeLimitMinutes,
    totalQuestions: questions.length,
    passages,
    questions,
  };

  return {
    ...testWithoutMetadata,
    metadata: buildTestMetadata(testWithoutMetadata),
  };
}

function q(input: QuestionSeed): QuestionSeed {
  return input;
}

const urbanHeatTest = makeTest({
  testId: "academic-reading-001",
  slug: "urban-heat-and-public-space",
  legacyIds: ["realism-easy-01"],
  title: "Green Roofs and Urban Heat",
  description:
    "A human-edited IELTS Academic Reading mini test on urban heat, public buildings and heat-map interpretation.",
  topic: "Urban Planning",
  difficulty: "Easy",
  targetBand: "Band 5.5-6.5",
  timeLimitMinutes: 30,
  subtopic: "Urban heat adaptation",
  passages: [
    {
      passageId: "p1",
      title: "A Garden Above the Street",
      topic: "Urban Planning",
      sourceNote: "Original IELTS-style practice passage created for this app.",
      paragraphs: [
        {
          label: "A",
          text:
            "On the flat roof of a public library in Northbridge, a thin layer of soil was once expected to do more than it reasonably could. City officials hoped the planted surface would cool the reading rooms below, slow rainwater runoff and give the building a more visible environmental purpose. The first summer was disappointing: several plant beds dried out, and the indoor temperature hardly changed.",
        },
        {
          label: "B",
          text:
            "The setback did not end the project. Instead, the maintenance team altered the roof in small ways: deeper soil was added near the western edge, irrigation was restricted to early morning, and reflective gravel was placed around equipment that had been radiating heat. These changes were less photogenic than the original launch, but they made the roof easier to manage during dry weeks.",
        },
        {
          label: "C",
          text:
            "A university group later compared the library roof with three nearby municipal buildings that still had dark waterproof membranes. The researchers did not claim that a planted roof could cool an entire neighbourhood. They measured the evaporative cooling index after sunset because evening heat was the period most strongly linked with complaints from elderly residents.",
        },
        {
          label: "D",
          text:
            "By the third year, the roof was producing modest but measurable benefits. On hot days, the library's upper rooms reached their peak temperature about forty minutes later than similar rooms in the comparison buildings. The delay mattered because staff could ventilate the rooms before the evening community classes began. However, the benefit disappeared during a month when drainage mats were blocked by leaf litter.",
        },
        {
          label: "E",
          text:
            "The Northbridge report therefore treated green roofs as a useful but limited tool. It recommended them first for public buildings that already needed roof repairs, rather than as a citywide cure for heat. The authors also warned that roof gardens should not be used as an excuse to postpone street trees, shaded bus stops or cooler materials at ground level.",
        },
      ],
    },
    {
      passageId: "p2",
      title: "Heat Maps With Blind Spots",
      topic: "Urban Planning",
      sourceNote: "Original IELTS-style practice passage created for this app.",
      paragraphs: [
        {
          label: "A",
          text:
            "Heat maps look authoritative because they convert a messy urban experience into colour. Yet the colours depend on what is measured. A satellite image may show the surface of a road or roof, while a person waiting at a crossing feels air temperature, humidity, reflected sunlight and the absence of shade at the same time.",
        },
        {
          label: "B",
          text:
            "To fill that gap, Northbridge placed small temperature sensors on buses and waste-collection vehicles. The moving sensors produced thousands of readings without requiring a large survey team. They also created a bias: streets served by frequent bus routes were recorded more often than quiet residential lanes, even when those lanes were used by older pedestrians.",
        },
        {
          label: "C",
          text:
            "A second source of evidence came from residents who kept short 'felt heat' diaries during two heat waves. Their notes were not as tidy as sensor data. Some people wrote about glare from shop windows; others complained about the walk from a clinic to the nearest shaded stop. The diaries nevertheless helped planners identify discomfort that a map of surfaces had missed.",
        },
        {
          label: "D",
          text:
            "One small intervention followed almost immediately. Temporary shade screens were installed near the clinic crossing, where diary entries and bus-sensor readings both suggested an afternoon problem. Pedestrian counts rose slightly after the screens were added, but the city did not claim that hospital visits had fallen. The evidence was too narrow for that conclusion.",
        },
        {
          label: "E",
          text:
            "The final report argued for cautious transparency. It advised publishing maps with notes about missing streets, sensor routes and diary coverage. Without those notes, a heat map may appear more complete than it is, encouraging expensive work in visible places while leaving quieter risks unchanged.",
        },
      ],
    },
  ],
  questions: [
    q({
      passageId: "p1",
      type: "matching-headings",
      groupTitle: "Choose the best heading for Paragraph B.",
      prompt: "Paragraph B",
      options: [
        "A new roof design without practical benefits",
        "Small maintenance changes after an early failure",
        "A comparison between libraries and private homes",
        "A citywide solution for summer heat",
      ],
      answer: "Small maintenance changes after an early failure",
      explanation:
        "Paragraph B explains how the team changed soil depth, irrigation timing and reflective materials after the first summer failed.",
      evidenceParagraph: "Paragraph B",
      evidenceText:
        "Instead, the maintenance team altered the roof in small ways: deeper soil was added near the western edge, irrigation was restricted to early morning, and reflective gravel was placed around equipment.",
      whyCorrect:
        "The heading captures the paragraph's function: practical adjustments after an unsuccessful launch.",
      whyWrong:
        "The tempting wrong choices either exaggerate the scale of the project or focus on comparisons that the paragraph does not make.",
      skill: "Understanding main idea",
      secondarySkills: ["Identifying paragraph function"],
      trapType: "Partial match trap",
      strategyTip:
        "For Matching Headings, identify what the whole paragraph does. Do not choose a heading just because it contains a related word.",
      difficulty: "Easy",
      paragraphRef: "B",
    }),
    q({
      passageId: "p1",
      type: "sentence-completion",
      prompt: "The university group compared the library roof with buildings that still had ______.",
      answer: "dark waterproof membranes",
      acceptedAnswers: ["dark waterproof membranes", "waterproof membranes"],
      explanation:
        "Paragraph C states that the comparison buildings still had dark waterproof membranes.",
      evidenceParagraph: "Paragraph C",
      evidenceText:
        "A university group later compared the library roof with three nearby municipal buildings that still had dark waterproof membranes.",
      whyCorrect:
        "The sentence asks what the comparison buildings had; the exact noun phrase is given in Paragraph C.",
      whyWrong:
        "A wrong answer may copy a nearby phrase such as public buildings without identifying the roof surface being compared.",
      skill: "Locating explicit information",
      secondarySkills: ["Understanding detail"],
      trapType: "Similar keyword trap",
      strategyTip:
        "In completion tasks, locate the sentence that contains the comparison and copy only the words needed for the gap.",
      difficulty: "Easy",
      maxWords: 3,
      paragraphRef: "C",
    }),
    q({
      passageId: "p1",
      type: "true-false-not-given",
      prompt: "The researchers said that one planted roof could reduce heat across the whole neighbourhood.",
      options: ["True", "False", "Not Given"],
      answer: "False",
      explanation:
        "Paragraph C says the researchers did not claim that a planted roof could cool an entire neighbourhood.",
      evidenceParagraph: "Paragraph C",
      evidenceText:
        "The researchers did not claim that a planted roof could cool an entire neighbourhood.",
      whyCorrect:
        "The statement says the researchers made a broad claim, but the passage explicitly says they did not.",
      whyWrong:
        "The topic of neighbourhood heat is present, so a keyword-based reader may miss the negative wording.",
      skill: "Understanding detail",
      secondarySkills: ["Avoiding overgeneralisation", "Recognising contrast"],
      trapType: "Overgeneralisation trap",
      strategyTip:
        "In True / False / Not Given, watch for broad claims such as whole or entire when the passage limits the scope.",
      difficulty: "Easy",
      paragraphRef: "C",
    }),
    q({
      passageId: "p1",
      type: "multiple-choice",
      prompt: "Why did the researchers measure the evaporative cooling index after sunset?",
      options: [
        "Because the roof plants could only be watered at night",
        "Because evening heat was closely connected with complaints from elderly residents",
        "Because satellite images were unavailable during the day",
        "Because indoor classes had already finished by then",
      ],
      answer: "Because evening heat was closely connected with complaints from elderly residents",
      explanation:
        "Paragraph C links the after-sunset measurement to the period most strongly associated with elderly residents' complaints.",
      evidenceParagraph: "Paragraph C",
      evidenceText:
        "They measured the evaporative cooling index after sunset because evening heat was the period most strongly linked with complaints from elderly residents.",
      whyCorrect:
        "The answer preserves the cause given in the passage: evening heat had a stronger relationship with complaints.",
      whyWrong:
        "The other options sound practical, but they introduce reasons that the passage never gives.",
      skill: "Recognising cause and effect",
      secondarySkills: ["Understanding detail"],
      trapType: "Cause-effect confusion",
      strategyTip:
        "For why questions, locate the because-clause or causal link before evaluating attractive practical explanations.",
      difficulty: "Easy",
      paragraphRef: "C",
    }),
    q({
      passageId: "p1",
      type: "matching-information",
      groupTitle: "Match the information to the paragraph.",
      prompt: "Which paragraph warns that green roofs should not replace street-level cooling measures?",
      options: ["A", "B", "C", "D", "E"],
      answer: "E",
      explanation:
        "Paragraph E says roof gardens should not be used to postpone street trees, shaded bus stops or cooler ground-level materials.",
      evidenceParagraph: "Paragraph E",
      evidenceText:
        "The authors also warned that roof gardens should not be used as an excuse to postpone street trees, shaded bus stops or cooler materials at ground level.",
      whyCorrect:
        "The paragraph explicitly contrasts roof gardens with ground-level measures and warns against substitution.",
      whyWrong:
        "Nearby paragraphs discuss roof performance, but only Paragraph E gives the policy warning.",
      skill: "Time-efficient scanning",
      secondarySkills: ["Locating explicit information"],
      trapType: "Wrong paragraph trap",
      strategyTip:
        "For Matching Information, scan for the full idea, not just a repeated topic such as green roofs or heat.",
      difficulty: "Easy",
      paragraphRef: "E",
    }),
    q({
      passageId: "p1",
      type: "summary-completion",
      prompt: "The roof delayed peak temperatures, but this advantage was lost when ______ were blocked.",
      answer: "drainage mats",
      acceptedAnswers: ["drainage mats", "the drainage mats"],
      explanation:
        "Paragraph D states that the benefit disappeared when drainage mats were blocked by leaf litter.",
      evidenceParagraph: "Paragraph D",
      evidenceText:
        "However, the benefit disappeared during a month when drainage mats were blocked by leaf litter.",
      whyCorrect:
        "The summary paraphrases disappeared as was lost, and the blocked item is drainage mats.",
      whyWrong:
        "A common error is to choose leaf litter, but leaf litter caused the blockage; it was not the item blocked.",
      skill: "Recognising paraphrase",
      secondarySkills: ["Understanding detail"],
      trapType: "Cause-effect confusion",
      strategyTip:
        "In summary completion, check whether the blank needs the affected item, the cause, or the result.",
      difficulty: "Easy",
      maxWords: 2,
      paragraphRef: "D",
    }),
    q({
      passageId: "p1",
      type: "short-answer",
      prompt: "Which type of buildings did the report recommend for green roofs first?",
      answer: "public buildings that already needed roof repairs",
      acceptedAnswers: [
        "public buildings",
        "public buildings that needed roof repairs",
        "public buildings that already needed roof repairs",
      ],
      explanation:
        "Paragraph E recommends green roofs first for public buildings that already needed roof repairs.",
      evidenceParagraph: "Paragraph E",
      evidenceText:
        "It recommended them first for public buildings that already needed roof repairs, rather than as a citywide cure for heat.",
      whyCorrect:
        "The answer identifies the priority group of buildings, not the general technology.",
      whyWrong:
        "A wrong answer may overgeneralise to all buildings or all roofs, but the passage gives a narrower priority.",
      skill: "Understanding detail",
      secondarySkills: ["Locating explicit information"],
      trapType: "Overgeneralisation trap",
      strategyTip:
        "For short answers, copy the limiting phrase if it is part of the answer's meaning.",
      difficulty: "Easy",
      maxWords: 7,
      paragraphRef: "E",
    }),
    q({
      passageId: "p1",
      type: "true-false-not-given",
      prompt: "The library roof produced no measurable benefit by the third year.",
      options: ["True", "False", "Not Given"],
      answer: "False",
      explanation:
        "Paragraph D says the roof was producing modest but measurable benefits by the third year.",
      evidenceParagraph: "Paragraph D",
      evidenceText: "By the third year, the roof was producing modest but measurable benefits.",
      whyCorrect:
        "The statement denies measurable benefit, while the passage directly states that benefits were measurable.",
      whyWrong:
        "The word modest may make the result seem weak, but weak is not the same as absent.",
      skill: "Understanding detail",
      secondarySkills: ["Recognising contrast"],
      trapType: "Opposite meaning trap",
      strategyTip:
        "Do not let cautious language such as modest cancel a positive finding unless the passage says there was no result.",
      difficulty: "Easy",
      paragraphRef: "D",
    }),
    q({
      passageId: "p1",
      type: "multiple-choice",
      prompt: "What is the writer's main view of green roofs in the Northbridge report?",
      options: [
        "They are visually attractive but technically useless.",
        "They should replace street trees in dense areas.",
        "They can help in specific circumstances but should not be treated as a complete solution.",
        "They work only when no maintenance is required.",
      ],
      answer: "They can help in specific circumstances but should not be treated as a complete solution.",
      explanation:
        "Paragraph E describes green roofs as useful but limited and warns against treating them as a citywide cure.",
      evidenceParagraph: "Paragraph E",
      evidenceText:
        "The Northbridge report therefore treated green roofs as a useful but limited tool.",
      whyCorrect:
        "The answer keeps both parts of the writer's view: usefulness and limitation.",
      whyWrong:
        "The distractors distort the passage by turning a limited recommendation into uselessness, replacement, or maintenance-free success.",
      skill: "Understanding main idea",
      secondarySkills: ["Recognising paraphrase"],
      trapType: "Partial match trap",
      strategyTip:
        "For main-view questions, choose the option that preserves the writer's balance rather than an extreme version.",
      difficulty: "Easy",
      paragraphRef: "E",
    }),
    q({
      passageId: "p1",
      type: "table-completion",
      prompt: "Problem during first summer | Plant beds ______.",
      answer: "dried out",
      acceptedAnswers: ["dried out"],
      explanation:
        "Paragraph A says several plant beds dried out during the disappointing first summer.",
      evidenceParagraph: "Paragraph A",
      evidenceText:
        "The first summer was disappointing: several plant beds dried out, and the indoor temperature hardly changed.",
      whyCorrect:
        "The table asks for the problem affecting plant beds, and the exact phrase is dried out.",
      whyWrong:
        "A nearby result, such as indoor temperature hardly changed, describes a different problem.",
      skill: "Locating explicit information",
      secondarySkills: ["Understanding detail"],
      trapType: "Similar keyword trap",
      strategyTip:
        "Use the row label to locate the exact detail, then check whether the answer describes the same item.",
      difficulty: "Easy",
      maxWords: 2,
      paragraphRef: "A",
    }),
    q({
      passageId: "p2",
      type: "yes-no-not-given",
      prompt: "The writer suggests that heat maps can appear more complete than they really are.",
      options: ["Yes", "No", "Not Given"],
      answer: "Yes",
      explanation:
        "Paragraph E states that, without notes, a heat map may appear more complete than it is.",
      evidenceParagraph: "Paragraph E",
      evidenceText:
        "Without those notes, a heat map may appear more complete than it is.",
      whyCorrect:
        "The statement accurately reflects the writer's caution about missing information in heat maps.",
      whyWrong:
        "A wrong answer may focus on the authority of maps in Paragraph A and miss the warning in Paragraph E.",
      skill: "Identifying writer's opinion",
      secondarySkills: ["Understanding detail"],
      trapType: "Writer opinion confusion",
      strategyTip:
        "For Yes / No / Not Given, separate the writer's judgement from background description.",
      difficulty: "Easy",
      paragraphRef: "E",
    }),
    q({
      passageId: "p2",
      type: "matching-information",
      groupTitle: "Match the information to the paragraph.",
      prompt: "Which paragraph explains a sampling bias caused by vehicle routes?",
      options: ["A", "B", "C", "D", "E"],
      answer: "B",
      explanation:
        "Paragraph B says bus and waste-collection sensors recorded some streets more often than quiet residential lanes.",
      evidenceParagraph: "Paragraph B",
      evidenceText:
        "They also created a bias: streets served by frequent bus routes were recorded more often than quiet residential lanes.",
      whyCorrect:
        "The bias comes from the sensor routes, so Paragraph B is the only paragraph that matches the whole idea.",
      whyWrong:
        "Paragraph C also describes a data source, but it is diary evidence, not vehicle-route sampling.",
      skill: "Time-efficient scanning",
      secondarySkills: ["Understanding detail"],
      trapType: "Wrong paragraph trap",
      strategyTip:
        "Use distinctive nouns such as buses, routes and residential lanes to confirm the exact paragraph.",
      difficulty: "Easy",
      paragraphRef: "B",
    }),
    q({
      passageId: "p2",
      type: "note-completion",
      prompt: "Resident diaries included comments about glare from ______.",
      answer: "shop windows",
      acceptedAnswers: ["shop windows", "shop window"],
      explanation:
        "Paragraph C says some residents wrote about glare from shop windows.",
      evidenceParagraph: "Paragraph C",
      evidenceText: "Some people wrote about glare from shop windows.",
      whyCorrect:
        "The missing noun phrase completes the source of glare mentioned in the diary notes.",
      whyWrong:
        "A wrong answer may choose clinic or shaded stop, but those relate to a different diary complaint.",
      skill: "Understanding vocabulary in context",
      secondarySkills: ["Locating explicit information"],
      trapType: "Similar keyword trap",
      strategyTip:
        "For notes, check the noun immediately after the preposition; here, from points to the source of glare.",
      difficulty: "Easy",
      maxWords: 2,
      paragraphRef: "C",
    }),
    q({
      passageId: "p2",
      type: "true-false-not-given",
      prompt: "The city claimed that the shade screens reduced hospital visits.",
      options: ["True", "False", "Not Given"],
      answer: "False",
      explanation:
        "Paragraph D states that the city did not claim hospital visits had fallen.",
      evidenceParagraph: "Paragraph D",
      evidenceText: "The city did not claim that hospital visits had fallen.",
      whyCorrect:
        "The statement says the city made a claim; the passage explicitly says it did not.",
      whyWrong:
        "Pedestrian counts rose slightly, but that result cannot be transferred to hospital visits.",
      skill: "Distinguishing fact from claim",
      secondarySkills: ["Understanding detail"],
      trapType: "Distractor detail trap",
      strategyTip:
        "Do not extend a small supported result into a larger health claim unless the passage does so.",
      difficulty: "Easy",
      paragraphRef: "D",
    }),
    q({
      passageId: "p2",
      type: "matching-features",
      groupTitle: "Match the source of evidence to its limitation.",
      prompt: "Which source overrepresented streets with frequent services?",
      options: [
        "satellite images",
        "moving vehicle sensors",
        "resident heat diaries",
        "clinic pedestrian counts",
      ],
      answer: "moving vehicle sensors",
      explanation:
        "Paragraph B explains that sensors on buses and waste-collection vehicles recorded serviced streets more often.",
      evidenceParagraph: "Paragraph B",
      evidenceText:
        "The moving sensors produced thousands of readings without requiring a large survey team. They also created a bias.",
      whyCorrect:
        "The feature is not just any sensor data; it is the moving vehicle sensors whose routes shaped the sample.",
      whyWrong:
        "The other evidence sources are mentioned, but their limitations are different.",
      skill: "Locating explicit information",
      secondarySkills: ["Understanding comparison"],
      trapType: "Similar keyword trap",
      strategyTip:
        "In Matching Features, match the entity to the exact limitation, not simply to a nearby data source.",
      difficulty: "Medium",
      paragraphRef: "B",
    }),
    q({
      passageId: "p2",
      type: "flow-chart-completion",
      prompt: "Diary entries and sensor readings identified a crossing problem -> temporary shade screens were added -> pedestrian counts ______.",
      answer: "rose slightly",
      acceptedAnswers: ["rose slightly", "increased slightly"],
      explanation:
        "Paragraph D says pedestrian counts rose slightly after the shade screens were added.",
      evidenceParagraph: "Paragraph D",
      evidenceText:
        "Pedestrian counts rose slightly after the screens were added, but the city did not claim that hospital visits had fallen.",
      whyCorrect:
        "The flow chart asks for the next observed result after the screens were installed.",
      whyWrong:
        "The hospital-visit detail is explicitly rejected as a claim, so it cannot complete the sequence.",
      skill: "Following reference words",
      secondarySkills: ["Recognising cause and effect"],
      trapType: "Cause-effect confusion",
      strategyTip:
        "In flow charts, follow the actual sequence of events and avoid adding a stronger result than the passage reports.",
      difficulty: "Medium",
      maxWords: 2,
      paragraphRef: "D",
    }),
    q({
      passageId: "p2",
      type: "short-answer",
      prompt: "What kind of streets were recorded less often by the moving sensors?",
      answer: "quiet residential lanes",
      acceptedAnswers: ["quiet residential lanes", "residential lanes"],
      explanation:
        "Paragraph B contrasts frequent bus routes with quiet residential lanes.",
      evidenceParagraph: "Paragraph B",
      evidenceText:
        "Streets served by frequent bus routes were recorded more often than quiet residential lanes.",
      whyCorrect:
        "The answer identifies the under-recorded street type in the comparison.",
      whyWrong:
        "A wrong answer may choose bus routes, which were actually recorded more often.",
      skill: "Understanding comparison",
      secondarySkills: ["Locating explicit information"],
      trapType: "Comparison confusion",
      strategyTip:
        "When a sentence compares two groups, check which side has more and which has less.",
      difficulty: "Easy",
      maxWords: 3,
      paragraphRef: "B",
    }),
    q({
      passageId: "p2",
      type: "multiple-choice",
      prompt: "Why were residents' heat diaries useful?",
      options: [
        "They proved satellite images were inaccurate in every district.",
        "They replaced the need for sensor measurements.",
        "They revealed discomfort that surface-temperature maps had missed.",
        "They showed that bus routes were evenly distributed.",
      ],
      answer: "They revealed discomfort that surface-temperature maps had missed.",
      explanation:
        "Paragraph C says the diaries helped planners identify discomfort missed by a map of surfaces.",
      evidenceParagraph: "Paragraph C",
      evidenceText:
        "The diaries nevertheless helped planners identify discomfort that a map of surfaces had missed.",
      whyCorrect:
        "The answer paraphrases identify discomfort as revealed discomfort and map of surfaces as surface-temperature maps.",
      whyWrong:
        "The distractors overstate the evidence by claiming replacement, universal inaccuracy or even distribution.",
      skill: "Recognising paraphrase",
      secondarySkills: ["Understanding detail"],
      trapType: "Overgeneralisation trap",
      strategyTip:
        "Choose the option that matches the limited claim, not the option that turns a useful source into a complete replacement.",
      difficulty: "Easy",
      paragraphRef: "C",
    }),
    q({
      passageId: "p2",
      type: "sentence-completion",
      prompt: "The final report advised that maps should include notes about sensor routes, diary coverage and ______.",
      answer: "missing streets",
      acceptedAnswers: ["missing streets"],
      explanation:
        "Paragraph E lists missing streets, sensor routes and diary coverage as notes to publish with maps.",
      evidenceParagraph: "Paragraph E",
      evidenceText:
        "It advised publishing maps with notes about missing streets, sensor routes and diary coverage.",
      whyCorrect:
        "The sentence asks for the remaining item in the list of notes.",
      whyWrong:
        "A wrong answer may choose visible places, which appears later as a consequence, not part of the list.",
      skill: "Locating explicit information",
      secondarySkills: ["Understanding detail"],
      trapType: "Similar keyword trap",
      strategyTip:
        "For list-based completion, check that the answer is grammatically parallel with the other listed items.",
      difficulty: "Easy",
      maxWords: 2,
      paragraphRef: "E",
    }),
    q({
      passageId: "p2",
      type: "yes-no-not-given",
      prompt: "The writer believes that sensor data is worthless unless residents also keep diaries.",
      options: ["Yes", "No", "Not Given"],
      answer: "No",
      explanation:
        "The passage says sensor data has limits, but it also produced thousands of readings and was used with diary evidence.",
      evidenceParagraph: "Paragraphs B-C",
      evidenceText:
        "The moving sensors produced thousands of readings without requiring a large survey team. The diaries nevertheless helped planners identify discomfort that a map of surfaces had missed.",
      whyCorrect:
        "The writer presents sensor data as useful but incomplete, not worthless.",
      whyWrong:
        "A reader may confuse criticism of bias with total rejection of the data source.",
      skill: "Identifying writer's opinion",
      secondarySkills: ["Distinguishing fact from claim"],
      trapType: "Extreme wording trap",
      strategyTip:
        "Extreme words such as worthless often make a statement stronger than the passage supports.",
      difficulty: "Medium",
    }),
  ],
});

const pigmentTest = makeTest({
  testId: "academic-reading-002",
  slug: "historical-textiles-and-trade-evidence",
  legacyIds: ["realism-hard-01"],
  title: "Traces of Colour in Historical Textiles",
  description:
    "A human-edited IELTS Academic Reading mini test on textile conservation, trade evidence and historical interpretation.",
  topic: "History of Science",
  difficulty: "Hard",
  targetBand: "Band 7.0-8.0",
  timeLimitMinutes: 30,
  subtopic: "Historical investigation and material evidence",
  passages: [
    {
      passageId: "p1",
      title: "The Colour That Would Not Stay Still",
      topic: "History of Science",
      sourceNote: "Original IELTS-style practice passage created for this app.",
      paragraphs: [
        {
          label: "A",
          text:
            "When conservators opened a drawer of eighteenth-century sample cloths in Bremen, the red pieces were the least impressive. Some had faded to a dry orange; others looked brown at the fold but pink where a thread had been protected from light. The uneven colour was easy to dismiss as damage, yet it became the clue that made the collection valuable.",
        },
        {
          label: "B",
          text:
            "The first laboratory tests searched for plant dyes associated with madder root. They found alizarin and purpurin, two compounds often used to identify the dye. The result seemed straightforward until the researchers compared several threads from the same cloth. Their chemical ratios differed enough to suggest not a single recipe but a workshop habit adjusted from batch to batch.",
        },
        {
          label: "C",
          text:
            "A second complication came from mordants, the metallic salts used to bind dye to fibre. Tin could brighten a red shade, while iron tended to darken it, but neither effect was automatic. The same mordant behaved differently when wool had been washed in mineral-rich water. For that reason, the team treated colour as an interaction among dye, fibre, water and workshop timing.",
        },
        {
          label: "D",
          text:
            "Written records did not settle the matter. Merchant invoices praised 'Turkey red' and 'fine scarlet' with the optimism expected of sales documents, but they rarely described the actual process. A phrase that sounded like a technical label might have been a marketing term, especially when cloth moved through several ports before reaching northern Europe.",
        },
        {
          label: "E",
          text:
            "The Bremen study changed the way the sample drawer was read. Instead of treating faded colour as a loss of information, the researchers used uneven fading, chemical variation and commercial language as three imperfect witnesses. None was decisive alone. Together, however, they suggested that historical colour was not a fixed formula but a negotiated practice.",
        },
      ],
    },
    {
      passageId: "p2",
      title: "Residues Along a Trade Route",
      topic: "History of Science",
      sourceNote: "Original IELTS-style practice passage created for this app.",
      paragraphs: [
        {
          label: "A",
          text:
            "A later project followed blue residues found on account books, packing paper and unfinished cloth from workshops around the Baltic. The researchers were not trying to prove that one port controlled the trade. Their question was narrower: could tiny residues reveal how materials moved when written records gave only prices and ship names?",
        },
        {
          label: "B",
          text:
            "The most useful evidence came from accidental stains on packing paper. Unlike finished cloth, packing paper was rarely cleaned for sale, so it sometimes preserved traces of powdered pigment. Several sheets contained Prussian blue mixed with chalk, a combination associated with cheaper decorative printing rather than luxury dyeing.",
        },
        {
          label: "C",
          text:
            "Interpreting the stains required caution. Prussian blue travelled widely by the late eighteenth century, and its presence did not identify a single workshop. What mattered was the repeated pairing of the pigment with chalk and a particular paper watermark. That combination appeared in documents linked to three ports but was absent from inland warehouses in the same archive.",
        },
        {
          label: "D",
          text:
            "Some historians objected that residues can be moved by careless storage. A stained invoice, for example, might have rested against a coloured sample decades after the shipment it described. The project team accepted this risk and excluded pages whose stains crossed modern repair tape, because those marks were likely to have formed after the documents entered the museum.",
        },
        {
          label: "E",
          text:
            "The final argument was therefore probabilistic rather than dramatic. The residues did not draw a complete trade map. They did, however, make one corridor more plausible: cheap printed cloth appears to have travelled through port warehouses before being sorted for inland markets. The evidence was modest, but it forced historians to treat packing materials as records in their own right.",
        },
      ],
    },
  ],
  questions: [
    q({
      passageId: "p1",
      type: "true-false-not-given",
      prompt: "All red pieces in the Bremen drawer had faded in the same way.",
      options: ["True", "False", "Not Given"],
      answer: "False",
      explanation:
        "Paragraph A describes different forms of fading across the red cloth samples.",
      evidenceParagraph: "Paragraph A",
      evidenceText:
        "Some had faded to a dry orange; others looked brown at the fold but pink where a thread had been protected from light.",
      whyCorrect:
        "The statement says all pieces changed alike, but the passage gives contrasting examples.",
      whyWrong:
        "A wrong answer may focus on the general idea of fading and miss the variation in how it appeared.",
      skill: "Understanding comparison",
      secondarySkills: ["Understanding detail"],
      trapType: "Overgeneralisation trap",
      strategyTip:
        "When a statement says all or same, look for examples that divide the group.",
      difficulty: "Hard",
      paragraphRef: "A",
    }),
    q({
      passageId: "p1",
      type: "multiple-choice",
      prompt: "What did the differing chemical ratios suggest?",
      options: [
        "The cloth had been stored in a completely dry room.",
        "The laboratory had used the wrong compounds for identification.",
        "The dyeing process may have varied between production batches.",
        "Madder root was not present in any of the textile samples.",
      ],
      answer: "The dyeing process may have varied between production batches.",
      explanation:
        "Paragraph B says the ratios suggested a workshop habit adjusted from batch to batch.",
      evidenceParagraph: "Paragraph B",
      evidenceText:
        "Their chemical ratios differed enough to suggest not a single recipe but a workshop habit adjusted from batch to batch.",
      whyCorrect:
        "The answer paraphrases not a single recipe as process variation between batches.",
      whyWrong:
        "The distractors use nearby ideas such as compounds and storage but are not supported by the evidence.",
      skill: "Recognising paraphrase",
      secondarySkills: ["Making inference"],
      trapType: "Distractor detail trap",
      strategyTip:
        "For multiple choice, reject options that mention real passage topics but change the conclusion.",
      difficulty: "Hard",
      paragraphRef: "B",
    }),
    q({
      passageId: "p1",
      type: "matching-headings",
      groupTitle: "Choose the best heading for Paragraph C.",
      prompt: "Paragraph C",
      options: [
        "How sales documents recorded colour names",
        "Why a chemical ingredient did not act alone",
        "The discovery of a single reliable dye recipe",
        "A method for cleaning damaged wool samples",
      ],
      answer: "Why a chemical ingredient did not act alone",
      explanation:
        "Paragraph C explains that mordants interacted with fibre, water and timing rather than producing automatic colour effects.",
      evidenceParagraph: "Paragraph C",
      evidenceText:
        "For that reason, the team treated colour as an interaction among dye, fibre, water and workshop timing.",
      whyCorrect:
        "The heading captures the paragraph's main idea: colour resulted from interaction, not one ingredient.",
      whyWrong:
        "Other headings pick up related conservation vocabulary but do not describe the paragraph's argument.",
      skill: "Understanding main idea",
      secondarySkills: ["Identifying paragraph function"],
      trapType: "Partial match trap",
      strategyTip:
        "A good heading often names the relationship between ideas, not just the topic word.",
      difficulty: "Hard",
      paragraphRef: "C",
    }),
    q({
      passageId: "p1",
      type: "summary-completion",
      prompt: "Merchant invoices may be unreliable because terms such as 'fine scarlet' could have been ______ rather than technical descriptions.",
      answer: "marketing term",
      acceptedAnswers: ["a marketing term", "marketing term", "marketing terms"],
      explanation:
        "Paragraph D warns that apparently technical labels may have been marketing terms.",
      evidenceParagraph: "Paragraph D",
      evidenceText:
        "A phrase that sounded like a technical label might have been a marketing term.",
      whyCorrect:
        "The gap contrasts technical description with promotional language.",
      whyWrong:
        "A wrong answer may choose sales documents, but that is the source, not the nature of the term.",
      skill: "Understanding vocabulary in context",
      secondarySkills: ["Distinguishing fact from claim"],
      trapType: "Writer opinion confusion",
      strategyTip:
        "Check whether a phrase is being treated as evidence, advertising, or technical terminology.",
      difficulty: "Hard",
      maxWords: 3,
      paragraphRef: "D",
    }),
    q({
      passageId: "p1",
      type: "yes-no-not-given",
      prompt: "The writer suggests that faded colour can sometimes provide useful historical evidence.",
      options: ["Yes", "No", "Not Given"],
      answer: "Yes",
      explanation:
        "Paragraph E says researchers used uneven fading as one imperfect witness.",
      evidenceParagraph: "Paragraph E",
      evidenceText:
        "Instead of treating faded colour as a loss of information, the researchers used uneven fading, chemical variation and commercial language as three imperfect witnesses.",
      whyCorrect:
        "The writer presents faded colour as evidence when read with other sources.",
      whyWrong:
        "A wrong answer may assume damage always destroys information, which is exactly what the passage challenges.",
      skill: "Identifying writer's opinion",
      secondarySkills: ["Making inference"],
      trapType: "Assumption trap",
      strategyTip:
        "In writer-view questions, look for evaluative verbs such as used, treated or suggested.",
      difficulty: "Hard",
      paragraphRef: "E",
    }),
    q({
      passageId: "p1",
      type: "short-answer",
      prompt: "Which two compounds were used to identify madder root dye?",
      answer: "alizarin and purpurin",
      acceptedAnswers: ["alizarin and purpurin", "purpurin and alizarin"],
      explanation:
        "Paragraph B names alizarin and purpurin as compounds associated with madder root.",
      evidenceParagraph: "Paragraph B",
      evidenceText:
        "They found alizarin and purpurin, two compounds often used to identify the dye.",
      whyCorrect:
        "The answer asks for the two compounds, and both are stated in the same sentence.",
      whyWrong:
        "Do not include madder root in the answer; it is the dye source, not one of the two compounds.",
      skill: "Locating explicit information",
      secondarySkills: ["Understanding detail"],
      trapType: "Similar keyword trap",
      strategyTip:
        "For short answer questions asking which two, include both items and no extra explanation.",
      difficulty: "Medium",
      maxWords: 3,
      paragraphRef: "B",
    }),
    q({
      passageId: "p1",
      type: "matching-information",
      groupTitle: "Match the information to the paragraph.",
      prompt: "Which paragraph explains why written sources could exaggerate technical certainty?",
      options: ["A", "B", "C", "D", "E"],
      answer: "D",
      explanation:
        "Paragraph D says invoices used optimistic sales language and rarely described the actual process.",
      evidenceParagraph: "Paragraph D",
      evidenceText:
        "Merchant invoices praised 'Turkey red' and 'fine scarlet' with the optimism expected of sales documents, but they rarely described the actual process.",
      whyCorrect:
        "This paragraph gives the reason commercial language cannot be read as exact technical evidence.",
      whyWrong:
        "Paragraph E evaluates evidence overall, but Paragraph D specifically discusses written sources.",
      skill: "Time-efficient scanning",
      secondarySkills: ["Understanding detail"],
      trapType: "Wrong paragraph trap",
      strategyTip:
        "For Matching Information, identify the source type in the question: here, written sources points to invoices.",
      difficulty: "Hard",
      paragraphRef: "D",
    }),
    q({
      passageId: "p1",
      type: "sentence-completion",
      prompt: "The team treated colour as an interaction among dye, fibre, water and ______.",
      answer: "workshop timing",
      acceptedAnswers: ["workshop timing"],
      explanation:
        "Paragraph C lists dye, fibre, water and workshop timing as interacting factors.",
      evidenceParagraph: "Paragraph C",
      evidenceText:
        "The team treated colour as an interaction among dye, fibre, water and workshop timing.",
      whyCorrect:
        "The missing item completes the list of interacting factors.",
      whyWrong:
        "A wrong answer such as mordants names a factor discussed earlier, but not the missing item in the list.",
      skill: "Understanding detail",
      secondarySkills: ["Following reference words"],
      trapType: "Similar keyword trap",
      strategyTip:
        "When completing a list, keep the answer parallel with the surrounding nouns.",
      difficulty: "Medium",
      maxWords: 2,
      paragraphRef: "C",
    }),
    q({
      passageId: "p1",
      type: "matching-sentence-endings",
      groupTitle: "Choose the correct ending.",
      prompt: "The researchers concluded that historical colour was",
      options: [
        "a fixed formula that could be reconstructed from invoices alone.",
        "mainly the result of modern museum repair.",
        "a negotiated practice shaped by several imperfect forms of evidence.",
        "irrelevant once chemical compounds had been identified.",
      ],
      answer: "a negotiated practice shaped by several imperfect forms of evidence.",
      explanation:
        "Paragraph E says colour was not a fixed formula but a negotiated practice, based on imperfect witnesses.",
      evidenceParagraph: "Paragraph E",
      evidenceText:
        "Together, however, they suggested that historical colour was not a fixed formula but a negotiated practice.",
      whyCorrect:
        "The ending preserves the contrast between fixed formula and negotiated practice.",
      whyWrong:
        "The other endings overstate one source of evidence or reverse the passage's conclusion.",
      skill: "Understanding main idea",
      secondarySkills: ["Recognising contrast"],
      trapType: "Opposite meaning trap",
      strategyTip:
        "For sentence endings, read the grammar and the argument direction before choosing.",
      difficulty: "Hard",
      paragraphRef: "E",
    }),
    q({
      passageId: "p1",
      type: "table-completion",
      prompt: "Mordant | Possible effect: iron tended to ______ a red shade.",
      answer: "darken",
      acceptedAnswers: ["darken"],
      explanation:
        "Paragraph C says iron tended to darken a red shade.",
      evidenceParagraph: "Paragraph C",
      evidenceText: "Tin could brighten a red shade, while iron tended to darken it.",
      whyCorrect:
        "The table asks for iron's possible effect, not tin's contrasting effect.",
      whyWrong:
        "Brighten is tempting because it is nearby, but it belongs to tin, not iron.",
      skill: "Understanding comparison",
      secondarySkills: ["Locating explicit information"],
      trapType: "Comparison confusion",
      strategyTip:
        "In tables, use the row label to avoid transferring a detail from the neighbouring comparison.",
      difficulty: "Medium",
      maxWords: 1,
      paragraphRef: "C",
    }),
    q({
      passageId: "p2",
      type: "multiple-choice",
      prompt: "What was the narrower aim of the later residue project?",
      options: [
        "To prove that one Baltic port controlled all pigment trade",
        "To test whether small material traces could clarify movement where records were limited",
        "To replace account books with laboratory evidence in every historical study",
        "To identify the artist who first used Prussian blue in northern Europe",
      ],
      answer: "To test whether small material traces could clarify movement where records were limited",
      explanation:
        "Paragraph A says the project asked whether tiny residues could reveal movement when written records gave only prices and ship names.",
      evidenceParagraph: "Paragraph A",
      evidenceText:
        "Their question was narrower: could tiny residues reveal how materials moved when written records gave only prices and ship names?",
      whyCorrect:
        "The answer paraphrases tiny residues as small material traces and written records as limited records.",
      whyWrong:
        "The first option is explicitly rejected; the other options invent aims not stated in the passage.",
      skill: "Recognising paraphrase",
      secondarySkills: ["Understanding detail"],
      trapType: "Distractor detail trap",
      strategyTip:
        "When a paragraph says the question was narrower, avoid options that make the aim larger or more dramatic.",
      difficulty: "Hard",
      paragraphRef: "A",
    }),
    q({
      passageId: "p2",
      type: "matching-features",
      groupTitle: "Match the material to its evidential value.",
      prompt: "Which material sometimes preserved traces because it was rarely cleaned for sale?",
      options: ["finished cloth", "packing paper", "account books", "modern repair tape"],
      answer: "packing paper",
      explanation:
        "Paragraph B says packing paper was rarely cleaned and sometimes preserved powdered pigment.",
      evidenceParagraph: "Paragraph B",
      evidenceText:
        "Unlike finished cloth, packing paper was rarely cleaned for sale, so it sometimes preserved traces of powdered pigment.",
      whyCorrect:
        "The feature belongs to packing paper, which is contrasted with finished cloth.",
      whyWrong:
        "Finished cloth is tempting because it is mentioned in the same sentence, but it is the contrast, not the answer.",
      skill: "Locating explicit information",
      secondarySkills: ["Understanding comparison"],
      trapType: "Comparison confusion",
      strategyTip:
        "In Matching Features, check the contrast words. Unlike often signals that the answer is not the nearby contrasting item.",
      difficulty: "Hard",
      paragraphRef: "B",
    }),
    q({
      passageId: "p2",
      type: "true-false-not-given",
      prompt: "Prussian blue alone was enough to identify a single workshop.",
      options: ["True", "False", "Not Given"],
      answer: "False",
      explanation:
        "Paragraph C says Prussian blue travelled widely and did not identify a single workshop.",
      evidenceParagraph: "Paragraph C",
      evidenceText:
        "Prussian blue travelled widely by the late eighteenth century, and its presence did not identify a single workshop.",
      whyCorrect:
        "The statement says the pigment alone was sufficient; the passage says it was not.",
      whyWrong:
        "A reader may see Prussian blue as a distinctive clue, but the passage limits what it can prove alone.",
      skill: "Distinguishing fact from claim",
      secondarySkills: ["Avoiding overgeneralisation"],
      trapType: "Extreme wording trap",
      strategyTip:
        "Words like alone and enough often test whether evidence is sufficient or merely suggestive.",
      difficulty: "Hard",
      paragraphRef: "C",
    }),
    q({
      passageId: "p2",
      type: "summary-completion",
      prompt: "The repeated pairing of pigment with chalk and a particular ______ made one trade pattern more convincing.",
      answer: "paper watermark",
      acceptedAnswers: ["paper watermark", "watermark"],
      explanation:
        "Paragraph C identifies the combination of pigment, chalk and a particular paper watermark.",
      evidenceParagraph: "Paragraph C",
      evidenceText:
        "What mattered was the repeated pairing of the pigment with chalk and a particular paper watermark.",
      whyCorrect:
        "The summary compresses combination appeared into made one trade pattern more convincing.",
      whyWrong:
        "A wrong answer may choose Prussian blue, but that is already included as pigment in the prompt.",
      skill: "Recognising paraphrase",
      secondarySkills: ["Understanding detail"],
      trapType: "Synonym trap",
      strategyTip:
        "If the prompt already contains one item from the evidence sentence, look for the remaining linked item.",
      difficulty: "Hard",
      maxWords: 2,
      paragraphRef: "C",
    }),
    q({
      passageId: "p2",
      type: "matching-information",
      groupTitle: "Match the information to the paragraph.",
      prompt: "Which paragraph describes a method for excluding likely modern stains?",
      options: ["A", "B", "C", "D", "E"],
      answer: "D",
      explanation:
        "Paragraph D says pages with stains crossing modern repair tape were excluded.",
      evidenceParagraph: "Paragraph D",
      evidenceText:
        "The project team accepted this risk and excluded pages whose stains crossed modern repair tape.",
      whyCorrect:
        "The paragraph gives a screening rule for marks likely to have formed after museum entry.",
      whyWrong:
        "Paragraph C discusses interpretation, but Paragraph D gives the exclusion method.",
      skill: "Time-efficient scanning",
      secondarySkills: ["Understanding detail"],
      trapType: "Wrong paragraph trap",
      strategyTip:
        "Scan for procedural verbs such as excluded when the question asks about a method.",
      difficulty: "Hard",
      paragraphRef: "D",
    }),
    q({
      passageId: "p2",
      type: "yes-no-not-given",
      prompt: "The writer suggests that residue evidence produced a complete map of the trade route.",
      options: ["Yes", "No", "Not Given"],
      answer: "No",
      explanation:
        "Paragraph E says the residues did not draw a complete trade map.",
      evidenceParagraph: "Paragraph E",
      evidenceText: "The residues did not draw a complete trade map.",
      whyCorrect:
        "The statement overstates what the evidence achieved; the passage directly rejects completeness.",
      whyWrong:
        "One corridor became more plausible, but that is much weaker than a complete map.",
      skill: "Identifying writer's opinion",
      secondarySkills: ["Avoiding overgeneralisation"],
      trapType: "Overgeneralisation trap",
      strategyTip:
        "Be careful when an option turns probabilistic evidence into a complete conclusion.",
      difficulty: "Hard",
      paragraphRef: "E",
    }),
    q({
      passageId: "p2",
      type: "flow-chart-completion",
      prompt: "Stains cross modern repair tape -> pages excluded -> marks probably formed after documents entered the ______.",
      answer: "museum",
      acceptedAnswers: ["museum", "the museum"],
      explanation:
        "Paragraph D says stains crossing modern repair tape were likely to have formed after the documents entered the museum.",
      evidenceParagraph: "Paragraph D",
      evidenceText:
        "Those marks were likely to have formed after the documents entered the museum.",
      whyCorrect:
        "The process links a visual sign to a decision and then to the likely timing of the stain.",
      whyWrong:
        "A wrong answer such as archive may be nearby, but the final location named in the evidence is the museum.",
      skill: "Following reference words",
      secondarySkills: ["Recognising cause and effect"],
      trapType: "Chronology trap",
      strategyTip:
        "In flow charts, track the timing words before and after; here, after is the key signal.",
      difficulty: "Hard",
      maxWords: 2,
      paragraphRef: "D",
    }),
    q({
      passageId: "p2",
      type: "short-answer",
      prompt: "What combination was associated with cheaper decorative printing?",
      answer: "Prussian blue mixed with chalk",
      acceptedAnswers: ["Prussian blue mixed with chalk", "Prussian blue and chalk", "pigment with chalk"],
      explanation:
        "Paragraph B says Prussian blue mixed with chalk was linked to cheaper decorative printing.",
      evidenceParagraph: "Paragraph B",
      evidenceText:
        "Several sheets contained Prussian blue mixed with chalk, a combination associated with cheaper decorative printing rather than luxury dyeing.",
      whyCorrect:
        "The answer asks for the material combination, not the type of printing.",
      whyWrong:
        "A wrong answer may choose cheaper decorative printing, which is the association, not the combination.",
      skill: "Locating explicit information",
      secondarySkills: ["Understanding detail"],
      trapType: "Grammar form trap",
      strategyTip:
        "Read the question noun carefully: combination asks for substances, not the activity they were associated with.",
      difficulty: "Medium",
      maxWords: 5,
      paragraphRef: "B",
    }),
    q({
      passageId: "p2",
      type: "multiple-choice",
      prompt: "Why was the final argument described as probabilistic?",
      options: [
        "It depended on several clues that made one route more likely without proving it completely.",
        "It was based entirely on mathematical shipping tables.",
        "It showed that all written records were intentionally false.",
        "It proved that residues were more reliable than every other source.",
      ],
      answer: "It depended on several clues that made one route more likely without proving it completely.",
      explanation:
        "Paragraph E says the evidence was modest and made one corridor more plausible, not complete.",
      evidenceParagraph: "Paragraph E",
      evidenceText:
        "The final argument was therefore probabilistic rather than dramatic. The residues did not draw a complete trade map. They did, however, make one corridor more plausible.",
      whyCorrect:
        "The answer explains probabilistic as increased plausibility rather than certainty.",
      whyWrong:
        "The other options are too absolute and introduce claims not made by the passage.",
      skill: "Making inference",
      secondarySkills: ["Distinguishing fact from claim"],
      trapType: "Extreme wording trap",
      strategyTip:
        "When an academic passage uses cautious words such as plausible or modest, avoid absolute options.",
      difficulty: "Hard",
      paragraphRef: "E",
    }),
    q({
      passageId: "p2",
      type: "note-completion",
      prompt: "Residue evidence made historians treat packing materials as ______.",
      answer: "records",
      acceptedAnswers: ["records", "records in their own right"],
      explanation:
        "Paragraph E says historians were forced to treat packing materials as records in their own right.",
      evidenceParagraph: "Paragraph E",
      evidenceText:
        "The evidence was modest, but it forced historians to treat packing materials as records in their own right.",
      whyCorrect:
        "The answer captures the new status given to packing materials.",
      whyWrong:
        "A wrong answer may choose trade map, but the passage says the residues did not create a complete map.",
      skill: "Understanding vocabulary in context",
      secondarySkills: ["Understanding main idea"],
      trapType: "Partial match trap",
      strategyTip:
        "For notes, decide whether the blank asks for a role, result or object.",
      difficulty: "Hard",
      maxWords: 4,
      paragraphRef: "E",
    }),
  ],
});

const algorithmsTest = makeTest({
  testId: "academic-reading-003",
  slug: "algorithms-as-scientific-instruments",
  legacyIds: ["realism-band9-01"],
  title: "When Algorithms Become Instruments",
  description:
    "A human-edited Band 8-9 IELTS Academic Reading mini test on scientific judgement, model explanations and accountability.",
  topic: "Artificial Intelligence",
  difficulty: "Band 8-9 Challenge",
  targetBand: "Band 8-9",
  timeLimitMinutes: 30,
  subtopic: "Technology ethics and philosophy of science",
  passages: [
    {
      passageId: "p1",
      title: "When Models Become Instruments",
      topic: "Artificial Intelligence",
      sourceNote: "Original IELTS-style practice passage created for this app.",
      paragraphs: [
        {
          label: "A",
          text:
            "Scientific instruments rarely arrive as neutral windows onto the world. A microscope changes what can be seen, but it also introduces conventions about preparation, lighting and acceptable distortion. Machine-learning models used in molecular research now occupy a similar position. They do not merely speed up calculations; they help decide which possible experiments appear worth imagining.",
        },
        {
          label: "B",
          text:
            "The attraction is obvious. A model can rank thousands of candidate molecules before a laboratory has ordered a single reagent. Yet the ranking is not an observation in the ordinary sense. It is a compressed judgement made from earlier data, modelling assumptions and design choices about what counts as a promising result. The danger begins when this compression is mistaken for discovery itself.",
        },
        {
          label: "C",
          text:
            "One pharmaceutical team tried to reduce that danger by separating model advice from experimental authority. The software produced a shortlist, but each item had to be defended by a researcher who had not helped train the model. The defence was deliberately awkward: it required the scientist to name the uncertainty, not only the predicted benefit. Several high-ranked candidates were delayed after this review because their training data came from unusually narrow chemical families.",
        },
        {
          label: "D",
          text:
            "Critics of such procedures argue that they slow research at precisely the stage where automation should create speed. That complaint is not trivial. Laboratories pay for idle equipment, and a delayed experiment can mean a lost funding opportunity. Still, speed is a poor measure of scientific judgement if it rewards teams for testing the easiest suggestions rather than the most informative ones.",
        },
        {
          label: "E",
          text:
            "The deeper issue is not whether models should be used, but how their recommendations enter the culture of evidence. A useful model makes some paths visible and others less visible. Responsible use therefore requires a record of what the model made attractive, what it made forgettable, and who decided that the forgotten options could safely remain untested.",
        },
      ],
    },
    {
      passageId: "p2",
      title: "The Cost of Transparent Systems",
      topic: "Artificial Intelligence",
      sourceNote: "Original IELTS-style practice passage created for this app.",
      paragraphs: [
        {
          label: "A",
          text:
            "Transparency is often proposed as the cure for algorithmic authority. If a system explains its recommendation, the argument goes, users can judge whether to trust it. But explanation is not the same as understanding. A tidy paragraph of reasons may reassure a busy scientist while leaving the model's most important limitation untouched.",
        },
        {
          label: "B",
          text:
            "Consider a model that recommends which soil samples should be analysed for traces of ancient cultivation. Its explanation might say that the selected samples have unusual mineral signatures. That sentence is helpful only if the archaeologist also knows whether the model was trained on soils from similar climates, similar excavation depths and similar storage conditions.",
        },
        {
          label: "C",
          text:
            "Some laboratories now add what they call friction to automated advice. A recommendation cannot be accepted until the user answers two or three uncomfortable questions: What evidence would make this ranking misleading? Which cases resemble the training data least? What result would cause the team to abandon the model's priority order? The aim is not to distrust the software, but to slow the moment at which convenience becomes obedience.",
        },
        {
          label: "D",
          text:
            "Friction has costs. Users may treat the questions as bureaucracy, copying phrases from earlier reports until the ritual becomes empty. Worse, teams with fewer staff may find the procedure harder to sustain than well-funded laboratories. A safeguard can therefore reproduce inequality if it is designed as though all research groups have the same spare attention.",
        },
        {
          label: "E",
          text:
            "A more convincing approach is to treat transparency as a social practice rather than a document. Explanations should travel with records of disagreement, failed checks and abandoned recommendations. Such records make a model less magical but more useful: they show not only why a suggestion was accepted, but also what kind of doubt the institution was willing to preserve.",
        },
      ],
    },
  ],
  questions: [
    q({
      passageId: "p1",
      type: "yes-no-not-given",
      prompt: "The writer implies that scientific instruments can influence the questions researchers consider possible.",
      options: ["Yes", "No", "Not Given"],
      answer: "Yes",
      explanation:
        "Paragraph A says models help decide which possible experiments appear worth imagining, after comparing them with instruments.",
      evidenceParagraph: "Paragraph A",
      evidenceText:
        "They do not merely speed up calculations; they help decide which possible experiments appear worth imagining.",
      whyCorrect:
        "The statement paraphrases help decide as influence and experiments appear worth imagining as questions researchers consider possible.",
      whyWrong:
        "A wrong answer may treat instruments as passive tools, but the passage explicitly gives them a shaping role.",
      skill: "Making inference",
      secondarySkills: ["Recognising paraphrase"],
      trapType: "Assumption trap",
      strategyTip:
        "For Band 8-9 inference, identify the conceptual relationship, not just repeated nouns.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "A",
    }),
    q({
      passageId: "p1",
      type: "multiple-choice",
      prompt: "What concern does the writer raise about model rankings in Paragraph B?",
      options: [
        "They may be treated as discoveries even though they are compressed judgements.",
        "They are slower than ordinary laboratory observation.",
        "They remove all earlier data from scientific decision-making.",
        "They are useful only after a reagent has been ordered.",
      ],
      answer: "They may be treated as discoveries even though they are compressed judgements.",
      explanation:
        "Paragraph B warns against mistaking a compressed judgement for discovery itself.",
      evidenceParagraph: "Paragraph B",
      evidenceText:
        "The danger begins when this compression is mistaken for discovery itself.",
      whyCorrect:
        "The correct option keeps the distinction between ranking as judgement and discovery as confirmed evidence.",
      whyWrong:
        "The distractors reverse timing, exaggerate the claim or contradict the paragraph's description of earlier data.",
      skill: "Distinguishing fact from claim",
      secondarySkills: ["Recognising paraphrase"],
      trapType: "Writer opinion confusion",
      strategyTip:
        "In dense conceptual passages, locate the writer's warning and preserve its exact contrast.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "B",
    }),
    q({
      passageId: "p1",
      type: "matching-headings",
      groupTitle: "Choose the best heading for Paragraph C.",
      prompt: "Paragraph C",
      options: [
        "A review process that makes model advice answerable",
        "A laboratory method for training models faster",
        "A rejection of ranked candidate molecules",
        "A funding problem caused by delayed equipment",
      ],
      answer: "A review process that makes model advice answerable",
      explanation:
        "Paragraph C describes a procedure requiring researchers to defend model-selected candidates and name uncertainty.",
      evidenceParagraph: "Paragraph C",
      evidenceText:
        "The software produced a shortlist, but each item had to be defended by a researcher who had not helped train the model.",
      whyCorrect:
        "The heading captures the paragraph's function: model advice is reviewed and justified before gaining authority.",
      whyWrong:
        "The wrong headings focus on nearby topics, but they miss the accountability procedure.",
      skill: "Identifying paragraph function",
      secondarySkills: ["Understanding main idea"],
      trapType: "Partial match trap",
      strategyTip:
        "For headings in difficult texts, ask what role the paragraph plays in the argument.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "C",
    }),
    q({
      passageId: "p1",
      type: "sentence-completion",
      prompt: "Some candidates were delayed because their training data came from unusually narrow ______.",
      answer: "chemical families",
      acceptedAnswers: ["chemical families"],
      explanation:
        "Paragraph C says high-ranked candidates were delayed because their training data came from unusually narrow chemical families.",
      evidenceParagraph: "Paragraph C",
      evidenceText:
        "Several high-ranked candidates were delayed after this review because their training data came from unusually narrow chemical families.",
      whyCorrect:
        "The answer completes the causal explanation for why some high-ranked candidates were delayed.",
      whyWrong:
        "A wrong answer may choose training data, but the prompt already contains that phrase.",
      skill: "Understanding detail",
      secondarySkills: ["Locating explicit information"],
      trapType: "Grammar form trap",
      strategyTip:
        "In completion items, avoid repeating words already present in the prompt; identify the missing complement.",
      difficulty: "Hard",
      maxWords: 2,
      paragraphRef: "C",
    }),
    q({
      passageId: "p1",
      type: "true-false-not-given",
      prompt: "The writer says that research speed is always a reliable sign of good scientific judgement.",
      options: ["True", "False", "Not Given"],
      answer: "False",
      explanation:
        "Paragraph D says speed is a poor measure of scientific judgement if it rewards easy suggestions.",
      evidenceParagraph: "Paragraph D",
      evidenceText:
        "Still, speed is a poor measure of scientific judgement if it rewards teams for testing the easiest suggestions rather than the most informative ones.",
      whyCorrect:
        "The statement uses always and reliable, while the passage explicitly limits the value of speed.",
      whyWrong:
        "The passage acknowledges that delay has costs, but it does not endorse speed as a reliable measure.",
      skill: "Avoiding overgeneralisation",
      secondarySkills: ["Recognising contrast"],
      trapType: "Extreme wording trap",
      strategyTip:
        "In hard TFNG items, pay attention to concessive shifts such as still and if.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "D",
    }),
    q({
      passageId: "p1",
      type: "matching-information",
      groupTitle: "Match the information to the paragraph.",
      prompt: "Which paragraph states that some options become less visible when a model is used?",
      options: ["A", "B", "C", "D", "E"],
      answer: "E",
      explanation:
        "Paragraph E says a useful model makes some paths visible and others less visible.",
      evidenceParagraph: "Paragraph E",
      evidenceText:
        "A useful model makes some paths visible and others less visible.",
      whyCorrect:
        "The paragraph moves from model recommendation to the cultural handling of forgotten options.",
      whyWrong:
        "Earlier paragraphs discuss ranking and review, but only Paragraph E states the visibility contrast directly.",
      skill: "Time-efficient scanning",
      secondarySkills: ["Recognising contrast"],
      trapType: "Wrong paragraph trap",
      strategyTip:
        "Scan for conceptual antonyms such as visible and less visible when the question asks about hidden options.",
      difficulty: "Hard",
      paragraphRef: "E",
    }),
    q({
      passageId: "p1",
      type: "summary-completion",
      prompt: "Responsible use requires keeping records not only of attractive model suggestions but also of options that became ______.",
      answer: "forgettable",
      acceptedAnswers: ["forgettable", "less visible"],
      explanation:
        "Paragraph E says responsible use requires a record of what the model made attractive and what it made forgettable.",
      evidenceParagraph: "Paragraph E",
      evidenceText:
        "Responsible use therefore requires a record of what the model made attractive, what it made forgettable, and who decided that the forgotten options could safely remain untested.",
      whyCorrect:
        "The summary contrasts attractive suggestions with options made forgettable.",
      whyWrong:
        "A wrong answer may choose untested, but the prompt asks what the model made the options become.",
      skill: "Recognising paraphrase",
      secondarySkills: ["Understanding detail"],
      trapType: "Synonym trap",
      strategyTip:
        "For advanced summary completion, track contrasts across paired phrases.",
      difficulty: "Band 8-9 Challenge",
      maxWords: 2,
      paragraphRef: "E",
    }),
    q({
      passageId: "p1",
      type: "matching-features",
      groupTitle: "Match the element to its role in the argument.",
      prompt: "Which element was used to force a researcher to discuss uncertainty?",
      options: [
        "the model shortlist",
        "the independent defence",
        "idle laboratory equipment",
        "the funding opportunity",
      ],
      answer: "the independent defence",
      explanation:
        "Paragraph C says each item had to be defended by a researcher, and that defence required naming uncertainty.",
      evidenceParagraph: "Paragraph C",
      evidenceText:
        "The defence was deliberately awkward: it required the scientist to name the uncertainty, not only the predicted benefit.",
      whyCorrect:
        "The independent defence is the mechanism that turns model advice into an accountable claim.",
      whyWrong:
        "The shortlist contains candidates, but the defence is what requires uncertainty to be named.",
      skill: "Understanding detail",
      secondarySkills: ["Locating explicit information"],
      trapType: "Partial match trap",
      strategyTip:
        "For Matching Features, identify the function of each element, not just where it appears.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "C",
    }),
    q({
      passageId: "p1",
      type: "short-answer",
      prompt: "What kind of suggestions might be rewarded if speed becomes a poor measure of judgement?",
      answer: "the easiest suggestions",
      acceptedAnswers: ["easiest suggestions", "the easiest suggestions"],
      explanation:
        "Paragraph D warns against rewarding teams for testing the easiest suggestions rather than the most informative ones.",
      evidenceParagraph: "Paragraph D",
      evidenceText:
        "Speed is a poor measure of scientific judgement if it rewards teams for testing the easiest suggestions rather than the most informative ones.",
      whyCorrect:
        "The answer identifies the kind of suggestions that speed may wrongly favour.",
      whyWrong:
        "Most informative ones is the contrast, not the problematic category.",
      skill: "Recognising contrast",
      secondarySkills: ["Locating explicit information"],
      trapType: "Opposite meaning trap",
      strategyTip:
        "When a sentence contrasts two options, check which one the question asks about.",
      difficulty: "Hard",
      maxWords: 3,
      paragraphRef: "D",
    }),
    q({
      passageId: "p1",
      type: "yes-no-not-given",
      prompt: "The passage states that the pharmaceutical team later abandoned machine-learning models entirely.",
      options: ["Yes", "No", "Not Given"],
      answer: "Not Given",
      explanation:
        "The passage describes a review procedure but does not say the team abandoned machine-learning models.",
      evidenceParagraph: "No specific paragraph",
      evidenceText:
        "The passage describes model advice, researcher defence and delayed candidates, but it gives no later decision to abandon models entirely.",
      whyCorrect:
        "There is not enough evidence to confirm or contradict the later outcome stated in the question.",
      whyWrong:
        "A reader may infer rejection from caution, but IELTS requires stated evidence for Yes or No.",
      skill: "Distinguishing fact from claim",
      secondarySkills: ["Avoiding overgeneralisation"],
      trapType: "Not Given trap",
      strategyTip:
        "Not Given often appears when the passage criticises a tool without reporting a final decision about it.",
      difficulty: "Band 8-9 Challenge",
    }),
    q({
      passageId: "p2",
      type: "multiple-choice",
      prompt: "What distinction does Paragraph A make about transparency?",
      options: [
        "Explanation may reassure users without producing real understanding.",
        "Transparency always prevents algorithmic authority.",
        "Scientists cannot understand explanations unless they wrote the model.",
        "A paragraph of reasons is unnecessary when a system is accurate.",
      ],
      answer: "Explanation may reassure users without producing real understanding.",
      explanation:
        "Paragraph A says explanation is not the same as understanding and may reassure a busy scientist while leaving a limitation untouched.",
      evidenceParagraph: "Paragraph A",
      evidenceText:
        "But explanation is not the same as understanding. A tidy paragraph of reasons may reassure a busy scientist while leaving the model's most important limitation untouched.",
      whyCorrect:
        "The answer preserves the contrast between reassurance and understanding.",
      whyWrong:
        "The distractors overstate the passage by using always, cannot or unnecessary.",
      skill: "Recognising contrast",
      secondarySkills: ["Understanding detail"],
      trapType: "Extreme wording trap",
      strategyTip:
        "In abstract passages, a short contrast sentence often carries the main answer.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "A",
    }),
    q({
      passageId: "p2",
      type: "matching-information",
      groupTitle: "Match the information to the paragraph.",
      prompt: "Which paragraph gives an archaeological example of explanation needing background knowledge?",
      options: ["A", "B", "C", "D", "E"],
      answer: "B",
      explanation:
        "Paragraph B uses soil samples and asks whether the model was trained on comparable conditions.",
      evidenceParagraph: "Paragraph B",
      evidenceText:
        "That sentence is helpful only if the archaeologist also knows whether the model was trained on soils from similar climates, similar excavation depths and similar storage conditions.",
      whyCorrect:
        "The paragraph shows that an explanation about unusual mineral signatures is insufficient without training-context knowledge.",
      whyWrong:
        "Other paragraphs discuss transparency generally, but only Paragraph B gives the archaeological soil-sample example.",
      skill: "Time-efficient scanning",
      secondarySkills: ["Understanding detail"],
      trapType: "Wrong paragraph trap",
      strategyTip:
        "Use field-specific nouns such as soil samples, archaeologist and excavation to locate examples quickly.",
      difficulty: "Hard",
      paragraphRef: "B",
    }),
    q({
      passageId: "p2",
      type: "flow-chart-completion",
      prompt: "Recommendation made -> user answers uncomfortable questions -> convenience is prevented from becoming ______.",
      answer: "obedience",
      acceptedAnswers: ["obedience"],
      explanation:
        "Paragraph C says the questions slow the moment at which convenience becomes obedience.",
      evidenceParagraph: "Paragraph C",
      evidenceText:
        "The aim is not to distrust the software, but to slow the moment at which convenience becomes obedience.",
      whyCorrect:
        "The flow chart compresses the purpose of adding friction to automated advice.",
      whyWrong:
        "A wrong answer may choose distrust, but the paragraph explicitly says distrust is not the aim.",
      skill: "Recognising cause and effect",
      secondarySkills: ["Following reference words"],
      trapType: "Cause-effect confusion",
      strategyTip:
        "In process questions, identify the intended effect and ignore phrases the author explicitly rejects.",
      difficulty: "Band 8-9 Challenge",
      maxWords: 1,
      paragraphRef: "C",
    }),
    q({
      passageId: "p2",
      type: "true-false-not-given",
      prompt: "The writer says that friction procedures are equally easy for all laboratories to maintain.",
      options: ["True", "False", "Not Given"],
      answer: "False",
      explanation:
        "Paragraph D says teams with fewer staff may find the procedure harder to sustain than well-funded laboratories.",
      evidenceParagraph: "Paragraph D",
      evidenceText:
        "Teams with fewer staff may find the procedure harder to sustain than well-funded laboratories.",
      whyCorrect:
        "The statement claims equality, while the passage points to unequal capacity.",
      whyWrong:
        "A wrong answer may focus on the general value of safeguards and miss the resource comparison.",
      skill: "Understanding comparison",
      secondarySkills: ["Distinguishing fact from claim"],
      trapType: "Comparison confusion",
      strategyTip:
        "Check comparative language carefully; equally easy is contradicted by harder to sustain.",
      difficulty: "Hard",
      paragraphRef: "D",
    }),
    q({
      passageId: "p2",
      type: "matching-headings",
      groupTitle: "Choose the best heading for Paragraph D.",
      prompt: "Paragraph D",
      options: [
        "How safeguards can create unequal burdens",
        "Why all users welcome extra review questions",
        "A technical explanation of soil signatures",
        "The complete removal of human judgement",
      ],
      answer: "How safeguards can create unequal burdens",
      explanation:
        "Paragraph D explains that friction can become empty bureaucracy and may be harder for under-resourced teams.",
      evidenceParagraph: "Paragraph D",
      evidenceText:
        "A safeguard can therefore reproduce inequality if it is designed as though all research groups have the same spare attention.",
      whyCorrect:
        "The heading captures the paragraph's warning about unequal burden.",
      whyWrong:
        "The other options either contradict the paragraph or refer to examples from other paragraphs.",
      skill: "Identifying paragraph function",
      secondarySkills: ["Understanding main idea"],
      trapType: "Partial match trap",
      strategyTip:
        "A paragraph heading should capture the author's evaluative turn, especially after words such as worse or therefore.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "D",
    }),
    q({
      passageId: "p2",
      type: "diagram-label-completion",
      prompt: "Transparency record diagram: accepted suggestion -> recorded disagreement -> failed checks -> ______.",
      answer: "abandoned recommendations",
      acceptedAnswers: ["abandoned recommendations", "abandoned recommendation"],
      explanation:
        "Paragraph E describes a transparency record that includes abandoned recommendations alongside disagreement and failed checks.",
      evidenceParagraph: "Paragraph E",
      evidenceText:
        "Explanations should travel with records of disagreement, failed checks and abandoned recommendations.",
      whyCorrect:
        "The diagram label asks for the final type of record in the sequence.",
      whyWrong:
        "A wrong answer such as accepted suggestion repeats the diagram's starting point rather than completing it.",
      skill: "Following reference words",
      secondarySkills: ["Understanding main idea"],
      trapType: "Chronology trap",
      strategyTip:
        "For diagram labels, match the position in the sequence, not just any phrase from the same sentence.",
      difficulty: "Band 8-9 Challenge",
      maxWords: 2,
      paragraphRef: "E",
    }),
    q({
      passageId: "p2",
      type: "yes-no-not-given",
      prompt: "The writer believes that transparency documents are useless unless they are connected to institutional memory.",
      options: ["Yes", "No", "Not Given"],
      answer: "Yes",
      explanation:
        "Paragraph E argues that transparency should be a social practice and that explanations should travel with records of doubt and decisions.",
      evidenceParagraph: "Paragraph E",
      evidenceText:
        "A more convincing approach is to treat transparency as a social practice rather than a document.",
      whyCorrect:
        "The statement paraphrases the writer's view that a document alone is insufficient without preserved records.",
      whyWrong:
        "The word useless is strong, but here the writer explicitly contrasts a mere document with a more convincing social practice.",
      skill: "Identifying writer's opinion",
      secondarySkills: ["Making inference"],
      trapType: "Writer opinion confusion",
      strategyTip:
        "For advanced Yes / No / Not Given, judge whether a strong statement is justified by the writer's evaluative contrast.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "E",
    }),
    q({
      passageId: "p2",
      type: "short-answer",
      prompt: "According to Paragraph B, what kind of signatures might lead the model to select soil samples?",
      answer: "unusual mineral signatures",
      acceptedAnswers: ["unusual mineral signatures", "mineral signatures"],
      explanation:
        "Paragraph B says the model's explanation might refer to unusual mineral signatures.",
      evidenceParagraph: "Paragraph B",
      evidenceText:
        "Its explanation might say that the selected samples have unusual mineral signatures.",
      whyCorrect:
        "The answer identifies the stated feature of the selected soil samples.",
      whyWrong:
        "Similar climates and excavation depths describe training relevance, not the stated sample feature.",
      skill: "Locating explicit information",
      secondarySkills: ["Understanding detail"],
      trapType: "Distractor detail trap",
      strategyTip:
        "In short answers, separate the model's reason for selection from the later conditions needed to judge it.",
      difficulty: "Hard",
      maxWords: 3,
      paragraphRef: "B",
    }),
    q({
      passageId: "p2",
      type: "multiple-choice",
      prompt: "Which statement best reflects the writer's final view?",
      options: [
        "Explanations are valuable only when they preserve the doubts and decisions surrounding model use.",
        "A transparent model no longer requires human disagreement.",
        "Failed checks should be removed from institutional records to avoid confusion.",
        "Transparency is mainly a matter of producing shorter documents.",
      ],
      answer: "Explanations are valuable only when they preserve the doubts and decisions surrounding model use.",
      explanation:
        "Paragraph E says records of disagreement, failed checks and abandoned recommendations make models less magical but more useful.",
      evidenceParagraph: "Paragraph E",
      evidenceText:
        "Such records make a model less magical but more useful: they show not only why a suggestion was accepted, but also what kind of doubt the institution was willing to preserve.",
      whyCorrect:
        "The answer captures the final emphasis on preserving doubt around accepted recommendations.",
      whyWrong:
        "The distractors remove disagreement, failed checks or social practice, which are central to the writer's conclusion.",
      skill: "Understanding main idea",
      secondarySkills: ["Making inference"],
      trapType: "Distractor detail trap",
      strategyTip:
        "For final-view questions, choose the option that keeps the author's most nuanced condition.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "E",
    }),
    q({
      passageId: "p2",
      type: "matching-sentence-endings",
      groupTitle: "Choose the correct ending.",
      prompt: "A safeguard can reproduce inequality when",
      options: [
        "users ask uncomfortable questions before accepting advice.",
        "all research groups are assumed to have the same spare attention.",
        "models explain recommendations with mineral signatures.",
        "records include both accepted and abandoned recommendations.",
      ],
      answer: "all research groups are assumed to have the same spare attention.",
      explanation:
        "Paragraph D says a safeguard can reproduce inequality if designed as though all groups have the same spare attention.",
      evidenceParagraph: "Paragraph D",
      evidenceText:
        "A safeguard can therefore reproduce inequality if it is designed as though all research groups have the same spare attention.",
      whyCorrect:
        "The ending completes the conditional relationship exactly.",
      whyWrong:
        "Other endings refer to real ideas from the passage but not the inequality condition.",
      skill: "Recognising cause and effect",
      secondarySkills: ["Understanding detail"],
      trapType: "Cause-effect confusion",
      strategyTip:
        "For sentence endings, track the if-clause or condition that completes the cause-effect relationship.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "D",
    }),
  ],
});

const reefSoundTest = makeTest({
  testId: "academic-reading-004",
  slug: "coral-reef-soundscapes",
  legacyIds: ["realism-medium-02"],
  title: "Listening to Coral Reefs",
  description:
    "A human-reviewed IELTS Academic Reading mini test on reef soundscapes, restoration monitoring and ecological evidence.",
  topic: "Marine Biology",
  difficulty: "Medium",
  targetBand: "Band 6.5-7.5",
  timeLimitMinutes: 30,
  subtopic: "Scientific process report and field monitoring",
  passages: [
    {
      passageId: "p1",
      title: "A Reef Before It Is Seen",
      topic: "Marine Biology",
      sourceNote: "Original IELTS-style practice passage created for this app.",
      paragraphs: [
        {
          label: "A",
          text:
            "Divers often describe a damaged reef by what is missing from view: fewer branching corals, fewer grazing fish, less colour. Marine acousticians begin with a different absence. A healthy reef is rarely quiet. Snapping shrimps, feeding fish and shifting rubble create a layered sound that can be recorded even when poor visibility prevents visual surveys.",
        },
        {
          label: "B",
          text:
            "At Koru Bay, a restoration team placed underwater recorders at four nursery sites and two unrestored slopes. The devices recorded for twelve minutes every hour, a schedule chosen to save battery power rather than to capture every possible sound. That compromise later mattered, because some fish calls occurred mostly in short bursts around dusk.",
        },
        {
          label: "C",
          text:
            "The first analysis counted acoustic complexity, a measure of how varied the sound was across frequencies. Complexity rose near two nursery sites after young corals were attached to frames, but the increase was not proof of recovery. Boat engines, rain and loose cables can also change acoustic readings, so field notes were checked beside the recordings.",
        },
        {
          label: "D",
          text:
            "A more persuasive sign came from repeated low-frequency pulses associated with grazing fish. These pulses appeared before divers saw a clear rise in fish numbers. The researchers argued that sound could therefore provide an early warning of biological activity, although they avoided calling it a substitute for visual census work.",
        },
        {
          label: "E",
          text:
            "The Koru Bay team eventually treated sound as a guide to where divers should look first. The recorders did not make restoration cheaper in the first year, because staff had to learn how to interpret noisy files. Over time, however, the method helped teams avoid visiting every site with equal frequency when only some sites were changing.",
        },
      ],
    },
    {
      passageId: "p2",
      title: "What a Reef Recorder Cannot Hear",
      topic: "Marine Biology",
      sourceNote: "Original IELTS-style practice passage created for this app.",
      paragraphs: [
        {
          label: "A",
          text:
            "Sound monitoring has a persuasive simplicity: place a recorder, collect files and compare patterns. In practice, the method depends on many small decisions. A recorder tied too close to a metal frame may capture the knock of its own rope; one placed in soft sediment may miss the sharper clicks produced in coral rubble.",
        },
        {
          label: "B",
          text:
            "Local fishers helped interpret several puzzling recordings. They recognised the engine rhythm of a tourist boat that passed the bay at irregular times, and they identified a seasonal current that made mooring lines hum. Their knowledge did not replace acoustic analysis, but it prevented the team from treating every unfamiliar sound as ecological change.",
        },
        {
          label: "C",
          text:
            "The method also raised a communication problem. Community volunteers liked the idea that reefs could be 'heard back to health', but this phrase made the evidence sound more complete than it was. A reef might grow louder because fish were returning, because storms had shifted rubble, or because human activity had increased nearby.",
        },
        {
          label: "D",
          text:
            "For public reports, the team began using paired indicators. A site was described as improving only when acoustic complexity rose and at least one visual measure changed in the same direction. Sites with sound changes alone were listed as priorities for inspection rather than successes.",
        },
        {
          label: "E",
          text:
            "This cautious language frustrated some sponsors, who preferred a simple restoration score. Yet the researchers argued that uncertainty was not a weakness of the method; it was the condition that made the method useful. Sound gave them a way to ask better questions before the reef looked different enough to convince the eye.",
        },
      ],
    },
  ],
  questions: [
    q({
      passageId: "p1",
      type: "matching-information",
      groupTitle: "Match the information to the paragraph.",
      prompt: "Which paragraph explains why the recording schedule missed some sound events?",
      options: ["A", "B", "C", "D", "E"],
      answer: "B",
      explanation:
        "Paragraph B says the recorders operated for twelve minutes every hour, while some fish calls occurred in short bursts around dusk.",
      evidenceParagraph: "Paragraph B",
      evidenceText:
        "The devices recorded for twelve minutes every hour... some fish calls occurred mostly in short bursts around dusk.",
      whyCorrect:
        "The paragraph links the sampling schedule to missed short-duration events.",
      whyWrong:
        "Other paragraphs discuss sound interpretation, but not the timing limitation of the recording schedule.",
      skill: "Time-efficient scanning",
      secondarySkills: ["Understanding detail"],
      trapType: "Wrong paragraph trap",
      strategyTip:
        "For Matching Information, scan for the specific limitation in the question, not just the broad topic of recorders.",
      difficulty: "Medium",
      paragraphRef: "B",
    }),
    q({
      passageId: "p1",
      type: "sentence-completion",
      prompt: "The recorders captured sound even when poor visibility prevented ______.",
      answer: "visual surveys",
      acceptedAnswers: ["visual surveys", "visual survey"],
      explanation:
        "Paragraph A says sound can be recorded even when poor visibility prevents visual surveys.",
      evidenceParagraph: "Paragraph A",
      evidenceText:
        "A layered sound that can be recorded even when poor visibility prevents visual surveys.",
      whyCorrect:
        "The missing phrase names the activity that poor visibility made difficult.",
      whyWrong:
        "A wrong answer may choose divers, but divers are people, not the survey activity blocked by poor visibility.",
      skill: "Locating explicit information",
      secondarySkills: ["Understanding detail"],
      trapType: "Similar keyword trap",
      strategyTip:
        "Check the grammar after prevents; it usually requires a noun phrase or activity.",
      difficulty: "Medium",
      maxWords: 2,
      paragraphRef: "A",
    }),
    q({
      passageId: "p1",
      type: "true-false-not-given",
      prompt: "The Koru Bay recorders were scheduled to capture every possible reef sound.",
      options: ["True", "False", "Not Given"],
      answer: "False",
      explanation:
        "Paragraph B says the schedule was chosen to save battery power rather than capture every possible sound.",
      evidenceParagraph: "Paragraph B",
      evidenceText:
        "A schedule chosen to save battery power rather than to capture every possible sound.",
      whyCorrect:
        "The statement says the opposite of the evidence.",
      whyWrong:
        "Because recorders collected many files, it is tempting to assume the coverage was complete.",
      skill: "Understanding detail",
      secondarySkills: ["Recognising contrast"],
      trapType: "Opposite meaning trap",
      strategyTip:
        "In TFNG, phrases such as rather than often mark the exact contradiction.",
      difficulty: "Medium",
      paragraphRef: "B",
    }),
    q({
      passageId: "p1",
      type: "multiple-choice",
      prompt: "Why was acoustic complexity not treated as proof of reef recovery?",
      options: [
        "Because complexity can be affected by non-biological noises.",
        "Because the recorders stopped working after young corals were attached.",
        "Because divers refused to compare nursery sites with unrestored slopes.",
        "Because grazing fish do not produce low-frequency pulses.",
      ],
      answer: "Because complexity can be affected by non-biological noises.",
      explanation:
        "Paragraph C says boat engines, rain and loose cables can also change acoustic readings.",
      evidenceParagraph: "Paragraph C",
      evidenceText:
        "Boat engines, rain and loose cables can also change acoustic readings, so field notes were checked beside the recordings.",
      whyCorrect:
        "The answer captures the reason complexity alone is insufficient: other sources can alter the measure.",
      whyWrong:
        "The other options contradict or invent details not supported by the passage.",
      skill: "Recognising cause and effect",
      secondarySkills: ["Understanding detail"],
      trapType: "Cause-effect confusion",
      strategyTip:
        "For why questions, separate the measured pattern from alternative causes of that pattern.",
      difficulty: "Medium",
      paragraphRef: "C",
    }),
    q({
      passageId: "p1",
      type: "summary-completion",
      prompt: "Repeated low-frequency pulses were linked with ______ and appeared before divers saw higher fish numbers.",
      answer: "grazing fish",
      acceptedAnswers: ["grazing fish"],
      explanation:
        "Paragraph D says repeated low-frequency pulses were associated with grazing fish.",
      evidenceParagraph: "Paragraph D",
      evidenceText:
        "A more persuasive sign came from repeated low-frequency pulses associated with grazing fish.",
      whyCorrect:
        "The summary paraphrases associated with as linked with.",
      whyWrong:
        "A wrong answer may choose divers or visual census, but those relate to later confirmation, not the source of the pulses.",
      skill: "Recognising paraphrase",
      secondarySkills: ["Locating explicit information"],
      trapType: "Synonym trap",
      strategyTip:
        "In summary completion, map relationship words such as associated with, linked with and connected to.",
      difficulty: "Medium",
      maxWords: 2,
      paragraphRef: "D",
    }),
    q({
      passageId: "p1",
      type: "short-answer",
      prompt: "What did staff have to learn to interpret?",
      answer: "noisy files",
      acceptedAnswers: ["noisy files"],
      explanation:
        "Paragraph E says staff had to learn how to interpret noisy files.",
      evidenceParagraph: "Paragraph E",
      evidenceText:
        "Staff had to learn how to interpret noisy files.",
      whyCorrect:
        "The answer identifies the object of interpretation.",
      whyWrong:
        "A wrong answer may choose recorders, but staff had to interpret the files produced by them.",
      skill: "Locating explicit information",
      secondarySkills: ["Understanding detail"],
      trapType: "Similar keyword trap",
      strategyTip:
        "For short answers, locate the verb from the question and copy its object precisely.",
      difficulty: "Medium",
      maxWords: 2,
      paragraphRef: "E",
    }),
    q({
      passageId: "p1",
      type: "yes-no-not-given",
      prompt: "The writer suggests that sound monitoring should completely replace visual census work.",
      options: ["Yes", "No", "Not Given"],
      answer: "No",
      explanation:
        "Paragraph D says the researchers avoided calling sound a substitute for visual census work.",
      evidenceParagraph: "Paragraph D",
      evidenceText:
        "They avoided calling it a substitute for visual census work.",
      whyCorrect:
        "The statement overstates the writer's view; sound is useful but not a complete replacement.",
      whyWrong:
        "A reader may focus on early warning and miss the explicit limitation.",
      skill: "Identifying writer's opinion",
      secondarySkills: ["Avoiding overgeneralisation"],
      trapType: "Extreme wording trap",
      strategyTip:
        "Words such as completely often make a writer-view statement too strong.",
      difficulty: "Medium",
      paragraphRef: "D",
    }),
    q({
      passageId: "p1",
      type: "matching-headings",
      groupTitle: "Choose the best heading for Paragraph E.",
      prompt: "Paragraph E",
      options: [
        "A method for choosing where to inspect first",
        "A complete replacement for field workers",
        "A cheaper restoration method in the first year",
        "A record of all reef sounds at every site",
      ],
      answer: "A method for choosing where to inspect first",
      explanation:
        "Paragraph E says sound was treated as a guide to where divers should look first.",
      evidenceParagraph: "Paragraph E",
      evidenceText:
        "The Koru Bay team eventually treated sound as a guide to where divers should look first.",
      whyCorrect:
        "The heading captures the paragraph's practical role for the method.",
      whyWrong:
        "The wrong headings overstate the cost, coverage or replacement value of acoustic monitoring.",
      skill: "Identifying paragraph function",
      secondarySkills: ["Understanding main idea"],
      trapType: "Partial match trap",
      strategyTip:
        "A heading should capture the paragraph's function, not an exaggerated version of one detail.",
      difficulty: "Medium",
      paragraphRef: "E",
    }),
    q({
      passageId: "p1",
      type: "table-completion",
      prompt: "Possible cause of misleading acoustic readings | loose ______",
      answer: "cables",
      acceptedAnswers: ["cables"],
      explanation:
        "Paragraph C lists loose cables among factors that can change acoustic readings.",
      evidenceParagraph: "Paragraph C",
      evidenceText:
        "Boat engines, rain and loose cables can also change acoustic readings.",
      whyCorrect:
        "The table asks for the noun completing the phrase loose cables.",
      whyWrong:
        "Boat engines and rain are other causes, but they do not complete the row phrase.",
      skill: "Locating explicit information",
      secondarySkills: ["Understanding detail"],
      trapType: "Grammar form trap",
      strategyTip:
        "In table completion, use the row wording to decide which item from a list fits the blank.",
      difficulty: "Easy",
      maxWords: 1,
      paragraphRef: "C",
    }),
    q({
      passageId: "p1",
      type: "matching-sentence-endings",
      groupTitle: "Choose the correct ending.",
      prompt: "The Koru Bay team used sound recordings to",
      options: [
        "prove that boat engines no longer affected the bay.",
        "avoid training staff in file interpretation.",
        "decide which sites deserved closer visual inspection.",
        "measure every fish call that occurred at dusk.",
      ],
      answer: "decide which sites deserved closer visual inspection.",
      explanation:
        "Paragraph E says sound guided where divers should look first and helped teams avoid visiting every site equally.",
      evidenceParagraph: "Paragraph E",
      evidenceText:
        "The method helped teams avoid visiting every site with equal frequency when only some sites were changing.",
      whyCorrect:
        "The ending preserves the limited management use of the recordings.",
      whyWrong:
        "The other endings contradict limitations described earlier in the passage.",
      skill: "Understanding main idea",
      secondarySkills: ["Recognising paraphrase"],
      trapType: "Partial match trap",
      strategyTip:
        "For sentence endings, check that the completed sentence matches the passage's scope.",
      difficulty: "Medium",
      paragraphRef: "E",
    }),
    q({
      passageId: "p2",
      type: "matching-features",
      groupTitle: "Match the source of knowledge to its role.",
      prompt: "Which group helped identify boat-engine rhythm and seasonal current noise?",
      options: ["local fishers", "tourist guides", "community volunteers", "public sponsors"],
      answer: "local fishers",
      explanation:
        "Paragraph B says local fishers recognised a tourist boat's engine rhythm and a seasonal current.",
      evidenceParagraph: "Paragraph B",
      evidenceText:
        "Local fishers helped interpret several puzzling recordings. They recognised the engine rhythm of a tourist boat... and identified a seasonal current.",
      whyCorrect:
        "The answer matches the group to the specific interpretive role.",
      whyWrong:
        "Volunteers and sponsors appear in nearby paragraphs, but they are not linked to identifying these sounds.",
      skill: "Locating explicit information",
      secondarySkills: ["Understanding detail"],
      trapType: "Similar keyword trap",
      strategyTip:
        "For Matching Features, connect each group to the exact action described.",
      difficulty: "Medium",
      paragraphRef: "B",
    }),
    q({
      passageId: "p2",
      type: "multiple-choice",
      prompt: "Why did the phrase 'heard back to health' create a problem?",
      options: [
        "It made the evidence sound more complete than it was.",
        "It suggested local fishers should replace recorders.",
        "It proved that storms had stopped affecting rubble.",
        "It discouraged volunteers from supporting restoration.",
      ],
      answer: "It made the evidence sound more complete than it was.",
      explanation:
        "Paragraph C says the phrase made the evidence sound more complete than it was.",
      evidenceParagraph: "Paragraph C",
      evidenceText:
        "This phrase made the evidence sound more complete than it was.",
      whyCorrect:
        "The option states the communication risk created by the phrase.",
      whyWrong:
        "The distractors mention real passage elements but attach unsupported effects to the phrase.",
      skill: "Understanding vocabulary in context",
      secondarySkills: ["Distinguishing fact from claim"],
      trapType: "Distractor detail trap",
      strategyTip:
        "When a phrase is discussed critically, ask what impression it creates, not what literal process it names.",
      difficulty: "Medium",
      paragraphRef: "C",
    }),
    q({
      passageId: "p2",
      type: "true-false-not-given",
      prompt: "A reef might become louder for reasons unrelated to fish returning.",
      options: ["True", "False", "Not Given"],
      answer: "True",
      explanation:
        "Paragraph C says storms shifting rubble or increased human activity can also make a reef louder.",
      evidenceParagraph: "Paragraph C",
      evidenceText:
        "A reef might grow louder because fish were returning, because storms had shifted rubble, or because human activity had increased nearby.",
      whyCorrect:
        "The statement accurately captures the alternative explanations given in the passage.",
      whyWrong:
        "A wrong answer may assume louder always means recovery, which the passage warns against.",
      skill: "Distinguishing fact from claim",
      secondarySkills: ["Understanding detail"],
      trapType: "Assumption trap",
      strategyTip:
        "Check whether the passage gives more than one possible cause for the same observation.",
      difficulty: "Medium",
      paragraphRef: "C",
    }),
    q({
      passageId: "p2",
      type: "flow-chart-completion",
      prompt: "Acoustic complexity rises + visual measure changes in same direction -> site described as ______.",
      answer: "improving",
      acceptedAnswers: ["improving"],
      explanation:
        "Paragraph D says a site was described as improving only when both paired indicators moved in the same direction.",
      evidenceParagraph: "Paragraph D",
      evidenceText:
        "A site was described as improving only when acoustic complexity rose and at least one visual measure changed in the same direction.",
      whyCorrect:
        "The flow chart asks for the label given after both conditions were met.",
      whyWrong:
        "A wrong answer may use successes, but the passage reserves success language for stronger evidence.",
      skill: "Recognising cause and effect",
      secondarySkills: ["Following reference words"],
      trapType: "Cause-effect confusion",
      strategyTip:
        "In flow charts, identify the condition and the label or result that follows it.",
      difficulty: "Medium",
      maxWords: 1,
      paragraphRef: "D",
    }),
    q({
      passageId: "p2",
      type: "summary-completion",
      prompt: "Sites with sound changes alone were treated as priorities for ______, not as successes.",
      answer: "inspection",
      acceptedAnswers: ["inspection"],
      explanation:
        "Paragraph D says sites with sound changes alone were listed as priorities for inspection.",
      evidenceParagraph: "Paragraph D",
      evidenceText:
        "Sites with sound changes alone were listed as priorities for inspection rather than successes.",
      whyCorrect:
        "The summary preserves the contrast between needing inspection and being counted as successful.",
      whyWrong:
        "A wrong answer may choose successes, but the passage explicitly contrasts inspection with success.",
      skill: "Recognising contrast",
      secondarySkills: ["Understanding detail"],
      trapType: "Opposite meaning trap",
      strategyTip:
        "When a sentence uses rather than, decide which side of the contrast the blank needs.",
      difficulty: "Medium",
      maxWords: 1,
      paragraphRef: "D",
    }),
    q({
      passageId: "p2",
      type: "yes-no-not-given",
      prompt: "The writer thinks uncertainty can make sound monitoring more useful rather than less useful.",
      options: ["Yes", "No", "Not Given"],
      answer: "Yes",
      explanation:
        "Paragraph E says uncertainty was the condition that made the method useful.",
      evidenceParagraph: "Paragraph E",
      evidenceText:
        "The researchers argued that uncertainty was not a weakness of the method; it was the condition that made the method useful.",
      whyCorrect:
        "The statement paraphrases the writer's positive view of uncertainty.",
      whyWrong:
        "A reader may assume uncertainty is always negative, but the passage explicitly challenges that assumption.",
      skill: "Identifying writer's opinion",
      secondarySkills: ["Making inference"],
      trapType: "Writer opinion confusion",
      strategyTip:
        "For writer-opinion questions, look for evaluative reframing: not a weakness, but a condition.",
      difficulty: "Hard",
      paragraphRef: "E",
    }),
    q({
      passageId: "p2",
      type: "short-answer",
      prompt: "What did some sponsors prefer instead of cautious language?",
      answer: "a simple restoration score",
      acceptedAnswers: ["simple restoration score", "a simple restoration score"],
      explanation:
        "Paragraph E says some sponsors preferred a simple restoration score.",
      evidenceParagraph: "Paragraph E",
      evidenceText:
        "This cautious language frustrated some sponsors, who preferred a simple restoration score.",
      whyCorrect:
        "The answer identifies the alternative preferred by sponsors.",
      whyWrong:
        "Cautious language is the thing they disliked, not what they preferred.",
      skill: "Locating explicit information",
      secondarySkills: ["Understanding detail"],
      trapType: "Similar keyword trap",
      strategyTip:
        "For short answers, check whether the question asks for the disliked item or the preferred alternative.",
      difficulty: "Medium",
      maxWords: 4,
      paragraphRef: "E",
    }),
    q({
      passageId: "p2",
      type: "multiple-choice",
      prompt: "What is the main purpose of Passage 2?",
      options: [
        "To argue that sound monitoring is simple enough for public reports without explanation",
        "To show why acoustic evidence needs local knowledge, paired indicators and cautious language",
        "To prove that community volunteers should control restoration funding",
        "To explain why visual measures are no longer necessary in reef science",
      ],
      answer:
        "To show why acoustic evidence needs local knowledge, paired indicators and cautious language",
      explanation:
        "The passage discusses placement problems, local interpretation, communication risk and paired indicators.",
      evidenceParagraph: "Passage-wide evidence",
      evidenceText:
        "Local fishers helped interpret several puzzling recordings... A site was described as improving only when acoustic complexity rose and at least one visual measure changed in the same direction.",
      whyCorrect:
        "The answer includes the passage's main controlling ideas without overstating them.",
      whyWrong:
        "The distractors either simplify the method too much or claim replacement and control that the passage does not support.",
      skill: "Understanding main idea",
      secondarySkills: ["Recognising paraphrase"],
      trapType: "Overgeneralisation trap",
      strategyTip:
        "For purpose questions, prefer the option that covers the whole passage's argument rather than one paragraph.",
      difficulty: "Hard",
    }),
    q({
      passageId: "p2",
      type: "diagram-label-completion",
      prompt: "Evidence check schematic: sound change -> local interpretation -> visual confirmation -> ______.",
      answer: "cautious reporting",
      acceptedAnswers: ["cautious reporting", "cautious language"],
      explanation:
        "The passage moves from sound interpretation to paired indicators and then to cautious public reporting.",
      evidenceParagraph: "Paragraphs B-D",
      evidenceText:
        "For public reports, the team began using paired indicators... Sites with sound changes alone were listed as priorities for inspection rather than successes.",
      whyCorrect:
        "The schematic summarises the evidence-control process before public reporting.",
      whyWrong:
        "A wrong answer such as simple restoration score reflects sponsors' preference, not the team's reporting approach.",
      skill: "Following reference words",
      secondarySkills: ["Understanding main idea"],
      trapType: "Chronology trap",
      strategyTip:
        "For text-based diagrams, follow the process direction and avoid jumping to a rejected alternative.",
      difficulty: "Hard",
      maxWords: 2,
    }),
    q({
      passageId: "p2",
      type: "note-completion",
      prompt: "A recorder tied too close to a metal frame may capture the knock of its own ______.",
      answer: "rope",
      acceptedAnswers: ["rope"],
      explanation:
        "Paragraph A says a recorder tied too close to a metal frame may capture the knock of its own rope.",
      evidenceParagraph: "Paragraph A",
      evidenceText:
        "A recorder tied too close to a metal frame may capture the knock of its own rope.",
      whyCorrect:
        "The note asks for the object producing the unwanted knocking sound.",
      whyWrong:
        "A wrong answer may choose metal frame, but that is what the recorder is tied near, not what knocks.",
      skill: "Locating explicit information",
      secondarySkills: ["Understanding detail"],
      trapType: "Similar keyword trap",
      strategyTip:
        "For note completion, use the grammar of the phrase its own to locate the exact noun.",
      difficulty: "Medium",
      maxWords: 1,
      paragraphRef: "A",
    }),
  ],
});

const defaultsTest = makeTest({
  testId: "academic-reading-005",
  slug: "defaults-choice-and-public-forms",
  legacyIds: ["realism-hard-02"],
  title: "Defaults, Choice and Public Forms",
  description:
    "A human-reviewed IELTS Academic Reading mini test on behavioural economics, public administration and evidence from form design.",
  topic: "Behavioural Economics",
  difficulty: "Hard",
  targetBand: "Band 7.0-8.0",
  timeLimitMinutes: 30,
  subtopic: "Policy controversy and behavioural research",
  passages: [
    {
      passageId: "p1",
      title: "The Checkbox That Changed a Queue",
      topic: "Behavioural Economics",
      sourceNote: "Original IELTS-style practice passage created for this app.",
      paragraphs: [
        {
          label: "A",
          text:
            "When the city of Merrow redesigned its housing-benefit form, the most controversial change was not a new rule. It was a pre-selected box allowing applicants to receive appointment reminders by text message. Administrators expected fewer missed interviews; advocates worried that a default might quietly pressure people who shared phones or changed numbers often.",
        },
        {
          label: "B",
          text:
            "The first evaluation compared missed appointments before and after the redesign. Missed interviews fell, but the result was uneven. Applicants under thirty responded strongly to text reminders, while older applicants showed almost no change. The pattern suggested that the default worked partly through phone habits rather than general attentiveness.",
        },
        {
          label: "C",
          text:
            "A second analysis examined opt-out behaviour. Few applicants unticked the text box, but interviews later revealed two different reasons. Some applicants actively wanted reminders; others had not noticed that consent had already been selected. Treating both groups as equally willing would have exaggerated the legitimacy of the default.",
        },
        {
          label: "D",
          text:
            "The form was revised again. The reminder question remained near the start, but the box was no longer pre-selected. Instead, applicants chose between text, phone call, letter or no reminder. Missed appointments rose slightly compared with the default version, though they remained lower than before any reminder system existed.",
        },
        {
          label: "E",
          text:
            "Merrow's case became a useful example because neither side could claim an easy victory. The default reduced administrative waste, but it also blurred consent. The final design accepted a smaller behavioural effect in exchange for a clearer expression of choice.",
        },
      ],
    },
    {
      passageId: "p2",
      title: "When Simpler Forms Hide Harder Choices",
      topic: "Behavioural Economics",
      sourceNote: "Original IELTS-style practice passage created for this app.",
      paragraphs: [
        {
          label: "A",
          text:
            "Simplification is usually treated as kindness in public administration. Shorter forms reduce fatigue and help applicants avoid errors. Yet a form can be simple in appearance while concealing a difficult decision. Removing explanation may make a page cleaner without making the choice more understandable.",
        },
        {
          label: "B",
          text:
            "In Merrow, the revised reminder question was tested with applicants reading aloud as they completed the form. This method slowed the process, but it revealed confusion that ordinary completion rates would have hidden. Several applicants understood the reminder options but did not know whether choosing text would affect the speed of their claim.",
        },
        {
          label: "C",
          text:
            "Designers added one sentence: 'Your reminder choice will not affect your eligibility or processing time.' The sentence made the form longer, but it reduced hesitation among applicants who feared that one option might be treated as more cooperative than another. The extra words therefore simplified the decision, even though they complicated the page.",
        },
        {
          label: "D",
          text:
            "This distinction matters because many digital reform projects measure success through speed. Faster completion can be useful, but it is not always evidence of better understanding. A person may move quickly because the page is clear, or because the consequences of a choice have been hidden from view.",
        },
        {
          label: "E",
          text:
            "The Merrow team eventually reported two measures side by side: completion time and decision confidence. The second measure was imperfect, relying on a short question after submission, but it changed the conversation. A form that took one minute longer could still be judged better if applicants understood the choice they had made.",
        },
      ],
    },
  ],
  questions: [
    q({
      passageId: "p1",
      type: "multiple-choice",
      prompt: "What made the original reminder change controversial?",
      options: [
        "It introduced a new legal rule for housing eligibility.",
        "It pre-selected consent for text reminders, raising concerns about pressure.",
        "It removed interviews from the application process.",
        "It required every applicant to own a private phone.",
      ],
      answer:
        "It pre-selected consent for text reminders, raising concerns about pressure.",
      explanation:
        "Paragraph A says the controversial change was a pre-selected text-reminder box and advocates worried about pressure.",
      evidenceParagraph: "Paragraph A",
      evidenceText:
        "It was a pre-selected box allowing applicants to receive appointment reminders by text message... advocates worried that a default might quietly pressure people.",
      whyCorrect:
        "The answer captures both the design change and the ethical concern.",
      whyWrong:
        "The other options turn the design issue into rules or requirements not stated in the passage.",
      skill: "Understanding detail",
      secondarySkills: ["Distinguishing fact from claim"],
      trapType: "Distractor detail trap",
      strategyTip:
        "For MCQ, match the cause of controversy, not just any administrative detail.",
      difficulty: "Hard",
      paragraphRef: "A",
    }),
    q({
      passageId: "p1",
      type: "true-false-not-given",
      prompt: "The text-message default affected younger and older applicants equally.",
      options: ["True", "False", "Not Given"],
      answer: "False",
      explanation:
        "Paragraph B says applicants under thirty responded strongly, while older applicants showed almost no change.",
      evidenceParagraph: "Paragraph B",
      evidenceText:
        "Applicants under thirty responded strongly to text reminders, while older applicants showed almost no change.",
      whyCorrect:
        "The statement claims equality, but the passage describes an uneven effect.",
      whyWrong:
        "A wrong answer may focus on the overall fall in missed interviews and ignore the age comparison.",
      skill: "Understanding comparison",
      secondarySkills: ["Understanding detail"],
      trapType: "Comparison confusion",
      strategyTip:
        "When a statement uses equally, look for comparison words such as while or whereas.",
      difficulty: "Hard",
      paragraphRef: "B",
    }),
    q({
      passageId: "p1",
      type: "matching-information",
      groupTitle: "Match the information to the paragraph.",
      prompt: "Which paragraph explains why low opt-out rates did not prove full consent?",
      options: ["A", "B", "C", "D", "E"],
      answer: "C",
      explanation:
        "Paragraph C distinguishes applicants who wanted reminders from those who did not notice the pre-selected consent.",
      evidenceParagraph: "Paragraph C",
      evidenceText:
        "Some applicants actively wanted reminders; others had not noticed that consent had already been selected.",
      whyCorrect:
        "The paragraph directly explains why the same behaviour could have different meanings.",
      whyWrong:
        "Paragraph A raises the concern, but Paragraph C gives the evidence about opt-out interpretation.",
      skill: "Time-efficient scanning",
      secondarySkills: ["Distinguishing fact from claim"],
      trapType: "Wrong paragraph trap",
      strategyTip:
        "When matching information, distinguish where an issue is introduced from where it is explained.",
      difficulty: "Hard",
      paragraphRef: "C",
    }),
    q({
      passageId: "p1",
      type: "summary-completion",
      prompt: "After the second revision, applicants chose between text, phone call, letter or ______.",
      answer: "no reminder",
      acceptedAnswers: ["no reminder", "no reminders"],
      explanation:
        "Paragraph D lists text, phone call, letter or no reminder.",
      evidenceParagraph: "Paragraph D",
      evidenceText:
        "Applicants chose between text, phone call, letter or no reminder.",
      whyCorrect:
        "The answer completes the list of reminder choices.",
      whyWrong:
        "A wrong answer may choose default, but the point of the revision was that no option was pre-selected.",
      skill: "Locating explicit information",
      secondarySkills: ["Understanding detail"],
      trapType: "Similar keyword trap",
      strategyTip:
        "For list completions, keep the answer parallel with the surrounding options.",
      difficulty: "Medium",
      maxWords: 2,
      paragraphRef: "D",
    }),
    q({
      passageId: "p1",
      type: "matching-headings",
      groupTitle: "Choose the best heading for Paragraph E.",
      prompt: "Paragraph E",
      options: [
        "A compromise between efficiency and explicit choice",
        "A complete rejection of behavioural design",
        "Evidence that reminders no longer affected appointments",
        "A new legal definition of consent",
      ],
      answer: "A compromise between efficiency and explicit choice",
      explanation:
        "Paragraph E says the final design accepted a smaller effect in exchange for clearer choice.",
      evidenceParagraph: "Paragraph E",
      evidenceText:
        "The final design accepted a smaller behavioural effect in exchange for a clearer expression of choice.",
      whyCorrect:
        "The heading captures the trade-off at the centre of the paragraph.",
      whyWrong:
        "The wrong headings either overstate rejection or introduce legal claims not made in the paragraph.",
      skill: "Understanding main idea",
      secondarySkills: ["Identifying paragraph function"],
      trapType: "Partial match trap",
      strategyTip:
        "For headings, identify the trade-off the paragraph resolves.",
      difficulty: "Hard",
      paragraphRef: "E",
    }),
    q({
      passageId: "p1",
      type: "yes-no-not-given",
      prompt: "The writer suggests that behavioural success and ethical clarity can point in different directions.",
      options: ["Yes", "No", "Not Given"],
      answer: "Yes",
      explanation:
        "Paragraph E contrasts reduced administrative waste with blurred consent, then describes a trade-off.",
      evidenceParagraph: "Paragraph E",
      evidenceText:
        "The default reduced administrative waste, but it also blurred consent.",
      whyCorrect:
        "The statement paraphrases the writer's view that a design can work behaviourally while creating consent problems.",
      whyWrong:
        "A wrong answer may assume successful outcomes always settle the ethical question.",
      skill: "Identifying writer's opinion",
      secondarySkills: ["Making inference"],
      trapType: "Writer opinion confusion",
      strategyTip:
        "For writer-view questions, look for but and in exchange for; they often signal a qualified judgement.",
      difficulty: "Hard",
      paragraphRef: "E",
    }),
    q({
      passageId: "p1",
      type: "short-answer",
      prompt: "Which group showed almost no change in response to text reminders?",
      answer: "older applicants",
      acceptedAnswers: ["older applicants"],
      explanation:
        "Paragraph B says older applicants showed almost no change.",
      evidenceParagraph: "Paragraph B",
      evidenceText:
        "Older applicants showed almost no change.",
      whyCorrect:
        "The answer identifies the group with little response.",
      whyWrong:
        "Applicants under thirty are the contrast group who responded strongly.",
      skill: "Understanding comparison",
      secondarySkills: ["Locating explicit information"],
      trapType: "Comparison confusion",
      strategyTip:
        "When two groups are contrasted, check which group the question asks about.",
      difficulty: "Medium",
      maxWords: 2,
      paragraphRef: "B",
    }),
    q({
      passageId: "p1",
      type: "table-completion",
      prompt: "Final design trade-off | smaller behavioural effect for clearer ______.",
      answer: "choice",
      acceptedAnswers: ["choice"],
      explanation:
        "Paragraph E says the final design accepted a smaller behavioural effect for a clearer expression of choice.",
      evidenceParagraph: "Paragraph E",
      evidenceText:
        "A smaller behavioural effect in exchange for a clearer expression of choice.",
      whyCorrect:
        "The table condenses the trade-off described in the final sentence.",
      whyWrong:
        "Consent is related, but the exact phrase completing the table is choice.",
      skill: "Understanding detail",
      secondarySkills: ["Recognising paraphrase"],
      trapType: "Synonym trap",
      strategyTip:
        "Use the table wording to identify the exact noun needed from a longer phrase.",
      difficulty: "Medium",
      maxWords: 1,
      paragraphRef: "E",
    }),
    q({
      passageId: "p1",
      type: "multiple-choice",
      prompt: "What did the first evaluation suggest about the default?",
      options: [
        "It worked partly through applicants' phone habits.",
        "It changed appointment behaviour equally for all age groups.",
        "It failed to reduce missed interviews.",
        "It made interviews unnecessary for younger applicants.",
      ],
      answer: "It worked partly through applicants' phone habits.",
      explanation:
        "Paragraph B says the uneven age pattern suggested the default worked partly through phone habits.",
      evidenceParagraph: "Paragraph B",
      evidenceText:
        "The pattern suggested that the default worked partly through phone habits rather than general attentiveness.",
      whyCorrect:
        "The answer preserves the explanation inferred from the age pattern.",
      whyWrong:
        "The distractors contradict the uneven result or exaggerate the effect.",
      skill: "Making inference",
      secondarySkills: ["Recognising paraphrase"],
      trapType: "Distractor detail trap",
      strategyTip:
        "For evaluation questions, distinguish the result from the interpretation of that result.",
      difficulty: "Hard",
      paragraphRef: "B",
    }),
    q({
      passageId: "p1",
      type: "matching-sentence-endings",
      groupTitle: "Choose the correct ending.",
      prompt: "Treating both groups as equally willing would have",
      options: [
        "proved that older applicants preferred letters.",
        "shown that text reminders had no administrative value.",
        "overstated the legitimacy of the default.",
        "removed the need for later interviews.",
      ],
      answer: "overstated the legitimacy of the default.",
      explanation:
        "Paragraph C says treating both groups as equally willing would have exaggerated the legitimacy of the default.",
      evidenceParagraph: "Paragraph C",
      evidenceText:
        "Treating both groups as equally willing would have exaggerated the legitimacy of the default.",
      whyCorrect:
        "The ending completes the consequence stated in the paragraph.",
      whyWrong:
        "Other endings mention plausible administrative topics but are not the stated consequence.",
      skill: "Recognising cause and effect",
      secondarySkills: ["Understanding detail"],
      trapType: "Cause-effect confusion",
      strategyTip:
        "For sentence endings, locate the exact consequence phrase before comparing options.",
      difficulty: "Hard",
      paragraphRef: "C",
    }),
    q({
      passageId: "p2",
      type: "true-false-not-given",
      prompt: "A form can look simple while still hiding a difficult decision.",
      options: ["True", "False", "Not Given"],
      answer: "True",
      explanation:
        "Paragraph A states that a form can be simple in appearance while concealing a difficult decision.",
      evidenceParagraph: "Paragraph A",
      evidenceText:
        "A form can be simple in appearance while concealing a difficult decision.",
      whyCorrect:
        "The statement closely paraphrases the passage.",
      whyWrong:
        "A wrong answer may assume visual simplicity and decision clarity are the same thing.",
      skill: "Recognising paraphrase",
      secondarySkills: ["Understanding detail"],
      trapType: "Synonym trap",
      strategyTip:
        "Match the underlying contrast: simple appearance does not always mean understandable choice.",
      difficulty: "Medium",
      paragraphRef: "A",
    }),
    q({
      passageId: "p2",
      type: "flow-chart-completion",
      prompt: "Applicants read aloud while completing the form -> hidden confusion identified -> explanatory sentence added -> hesitation ______.",
      answer: "reduced",
      acceptedAnswers: ["reduced", "fell", "decreased"],
      explanation:
        "Paragraph C says the added sentence reduced hesitation among applicants.",
      evidenceParagraph: "Paragraph C",
      evidenceText:
        "The sentence made the form longer, but it reduced hesitation among applicants.",
      whyCorrect:
        "The flow chart follows the testing process and its effect.",
      whyWrong:
        "A wrong answer may choose longer, but that describes the page, not applicant hesitation.",
      skill: "Recognising cause and effect",
      secondarySkills: ["Following reference words"],
      trapType: "Cause-effect confusion",
      strategyTip:
        "In flow charts, decide whether the blank asks for a design change or a user response.",
      difficulty: "Hard",
      maxWords: 1,
      paragraphRef: "C",
    }),
    q({
      passageId: "p2",
      type: "matching-information",
      groupTitle: "Match the information to the paragraph.",
      prompt: "Which paragraph criticises using speed alone as a measure of success?",
      options: ["A", "B", "C", "D", "E"],
      answer: "D",
      explanation:
        "Paragraph D says faster completion is not always evidence of better understanding.",
      evidenceParagraph: "Paragraph D",
      evidenceText:
        "Faster completion can be useful, but it is not always evidence of better understanding.",
      whyCorrect:
        "The paragraph directly challenges speed as a sufficient success measure.",
      whyWrong:
        "Paragraph E adds another measure, but Paragraph D states the criticism.",
      skill: "Time-efficient scanning",
      secondarySkills: ["Understanding main idea"],
      trapType: "Wrong paragraph trap",
      strategyTip:
        "Scan for the evaluative phrase in the question: speed alone points to faster completion.",
      difficulty: "Hard",
      paragraphRef: "D",
    }),
    q({
      passageId: "p2",
      type: "summary-completion",
      prompt: "The added sentence clarified that reminder choice would not affect eligibility or ______.",
      answer: "processing time",
      acceptedAnswers: ["processing time"],
      explanation:
        "Paragraph C quotes the sentence saying reminder choice would not affect eligibility or processing time.",
      evidenceParagraph: "Paragraph C",
      evidenceText:
        "Your reminder choice will not affect your eligibility or processing time.",
      whyCorrect:
        "The answer completes the paired phrase eligibility or processing time.",
      whyWrong:
        "Speed of claim is a paraphrase elsewhere, but the quoted phrase is processing time.",
      skill: "Locating explicit information",
      secondarySkills: ["Understanding detail"],
      trapType: "Similar keyword trap",
      strategyTip:
        "When the passage gives quoted wording, use the exact phrase if it fits the gap.",
      difficulty: "Medium",
      maxWords: 2,
      paragraphRef: "C",
    }),
    q({
      passageId: "p2",
      type: "multiple-choice",
      prompt: "Why did the read-aloud method matter?",
      options: [
        "It exposed confusion that completion rates alone would not show.",
        "It proved applicants preferred longer forms in every case.",
        "It removed the need to measure confidence after submission.",
        "It showed that reminder choices affected eligibility.",
      ],
      answer: "It exposed confusion that completion rates alone would not show.",
      explanation:
        "Paragraph B says reading aloud revealed confusion hidden by ordinary completion rates.",
      evidenceParagraph: "Paragraph B",
      evidenceText:
        "It revealed confusion that ordinary completion rates would have hidden.",
      whyCorrect:
        "The answer captures the methodological value of the read-aloud test.",
      whyWrong:
        "The distractors overstate the method or contradict the clarification added later.",
      skill: "Identifying paragraph function",
      secondarySkills: ["Recognising paraphrase"],
      trapType: "Distractor detail trap",
      strategyTip:
        "For method questions, ask what the method revealed that other measures missed.",
      difficulty: "Hard",
      paragraphRef: "B",
    }),
    q({
      passageId: "p2",
      type: "yes-no-not-given",
      prompt: "The writer believes that adding words can sometimes make a decision simpler.",
      options: ["Yes", "No", "Not Given"],
      answer: "Yes",
      explanation:
        "Paragraph C says the extra words simplified the decision even though they complicated the page.",
      evidenceParagraph: "Paragraph C",
      evidenceText:
        "The extra words therefore simplified the decision, even though they complicated the page.",
      whyCorrect:
        "The statement preserves the writer's distinction between page complexity and decision clarity.",
      whyWrong:
        "A wrong answer may assume shorter is always simpler, which the passage argues against.",
      skill: "Identifying writer's opinion",
      secondarySkills: ["Recognising contrast"],
      trapType: "Writer opinion confusion",
      strategyTip:
        "Writer-view questions often turn on a counterintuitive distinction; here, longer text can clarify choice.",
      difficulty: "Hard",
      paragraphRef: "C",
    }),
    q({
      passageId: "p2",
      type: "short-answer",
      prompt: "What second measure did the Merrow team report beside completion time?",
      answer: "decision confidence",
      acceptedAnswers: ["decision confidence"],
      explanation:
        "Paragraph E says the team reported completion time and decision confidence side by side.",
      evidenceParagraph: "Paragraph E",
      evidenceText:
        "The Merrow team eventually reported two measures side by side: completion time and decision confidence.",
      whyCorrect:
        "The answer identifies the second measure paired with completion time.",
      whyWrong:
        "A wrong answer may choose processing time, which appears earlier but is not the second measure in Paragraph E.",
      skill: "Locating explicit information",
      secondarySkills: ["Understanding detail"],
      trapType: "Similar keyword trap",
      strategyTip:
        "For paired measures, locate the list and identify which item the question has not already given.",
      difficulty: "Medium",
      maxWords: 2,
      paragraphRef: "E",
    }),
    q({
      passageId: "p2",
      type: "matching-features",
      groupTitle: "Match the measure to its limitation.",
      prompt: "Which measure relied on a short question after submission?",
      options: ["completion time", "decision confidence", "eligibility status", "processing time"],
      answer: "decision confidence",
      explanation:
        "Paragraph E says decision confidence was imperfect because it relied on a short question after submission.",
      evidenceParagraph: "Paragraph E",
      evidenceText:
        "The second measure was imperfect, relying on a short question after submission.",
      whyCorrect:
        "The second measure refers back to decision confidence.",
      whyWrong:
        "Completion time is the first measure, and eligibility/processing time belong to the explanatory sentence.",
      skill: "Following reference words",
      secondarySkills: ["Understanding detail"],
      trapType: "Partial match trap",
      strategyTip:
        "Track reference phrases such as the second measure back to the previous sentence.",
      difficulty: "Hard",
      paragraphRef: "E",
    }),
    q({
      passageId: "p2",
      type: "note-completion",
      prompt: "A page may be cleaner without making the choice more ______.",
      answer: "understandable",
      acceptedAnswers: ["understandable"],
      explanation:
        "Paragraph A says removing explanation may make a page cleaner without making the choice more understandable.",
      evidenceParagraph: "Paragraph A",
      evidenceText:
        "Removing explanation may make a page cleaner without making the choice more understandable.",
      whyCorrect:
        "The note asks for the adjective that contrasts visual cleanliness with decision clarity.",
      whyWrong:
        "A wrong answer may choose shorter or cleaner, but those describe the page, not the choice.",
      skill: "Understanding vocabulary in context",
      secondarySkills: ["Recognising contrast"],
      trapType: "Grammar form trap",
      strategyTip:
        "Use the adjective pattern after more to predict the word form.",
      difficulty: "Medium",
      maxWords: 1,
      paragraphRef: "A",
    }),
    q({
      passageId: "p2",
      type: "multiple-choice",
      prompt: "What is the main argument of Passage 2?",
      options: [
        "Public forms should always be shortened, even if explanation is removed.",
        "Form quality should consider understanding and confidence, not speed alone.",
        "Read-aloud testing is unnecessary when completion rates are high.",
        "Applicants prefer forms that avoid all explanation.",
      ],
      answer: "Form quality should consider understanding and confidence, not speed alone.",
      explanation:
        "Passage 2 repeatedly contrasts clean or fast completion with understanding, hesitation and decision confidence.",
      evidenceParagraph: "Passage-wide evidence",
      evidenceText:
        "Faster completion can be useful, but it is not always evidence of better understanding... A form that took one minute longer could still be judged better if applicants understood the choice they had made.",
      whyCorrect:
        "The option captures the passage's argument across the form-testing examples.",
      whyWrong:
        "The distractors make speed or shortness the only goal, which the passage rejects.",
      skill: "Understanding main idea",
      secondarySkills: ["Making inference"],
      trapType: "Overgeneralisation trap",
      strategyTip:
        "For main-argument questions, choose the answer that accounts for both the problem and the final evaluation criterion.",
      difficulty: "Hard",
    }),
  ],
});

const caveMineralsTest = makeTest({
  testId: "academic-reading-006",
  slug: "cave-minerals-and-climate-clues",
  legacyIds: ["realism-band9-02"],
  title: "Climate Clues in Cave Minerals",
  description:
    "A Band 8-9 IELTS Academic Reading mini test on proxy evidence, climate interpretation and scientific uncertainty.",
  topic: "Environmental Science",
  difficulty: "Band 8-9 Challenge",
  targetBand: "Band 8-9",
  timeLimitMinutes: 30,
  subtopic: "Environmental systems analysis and academic critique",
  passages: [
    {
      passageId: "p1",
      title: "The Calendar Inside a Stalagmite",
      topic: "Environmental Science",
      sourceNote: "Original IELTS-style practice passage created for this app.",
      paragraphs: [
        {
          label: "A",
          text:
            "A stalagmite is tempting because it seems to offer a natural archive with its own calendar. Layer by layer, minerals fall from dripping water and harden into a record that can be dated with unusual precision. The difficulty is that a date is not an interpretation. Knowing when a layer formed does not immediately reveal what the climate was doing outside the cave.",
        },
        {
          label: "B",
          text:
            "Many studies examine oxygen isotopes in calcite. In simplified accounts, heavier or lighter isotope values are treated as rainfall signals. Specialists are more cautious. The same isotope shift may reflect rainfall amount, moisture source, evaporation during transport or changes in the cave's internal ventilation.",
        },
        {
          label: "C",
          text:
            "A team working in the Lydian Hills tried to reduce this ambiguity by monitoring modern drip water for five years before interpreting older layers. The modern record showed that winter storms reached the cave quickly, while summer rain often evaporated before entering the fracture system. This seasonal filtering meant that the stalagmite was biased toward winter conditions.",
        },
        {
          label: "D",
          text:
            "The bias did not make the archive useless. It made it specific. If a layer showed a sharp isotopic change, the team could not call it a general rainfall collapse without other evidence. They could, however, ask whether winter storm tracks had shifted. Nearby pollen records and lake sediments were then used to test that narrower interpretation.",
        },
        {
          label: "E",
          text:
            "The resulting reconstruction was less dramatic than earlier narratives of abrupt drought. It suggested a sequence of winter weakening, vegetation stress and delayed lake-level decline. That sequence mattered because it changed the implied mechanism. A society living near the lakes may have experienced water stress years after atmospheric circulation had already begun to alter.",
        },
      ],
    },
    {
      passageId: "p2",
      title: "The Problem With a Perfect Curve",
      topic: "Environmental Science",
      sourceNote: "Original IELTS-style practice passage created for this app.",
      paragraphs: [
        {
          label: "A",
          text:
            "Climate graphs can acquire authority simply by looking smooth. A curve drawn through many measurements appears to tell a continuous story, even when each point contains laboratory error, dating uncertainty and local cave effects. The smoothness is a statistical decision, not a property of the past.",
        },
        {
          label: "B",
          text:
            "The Lydian team published two versions of its isotope record. The first used a narrow smoothing window and showed several abrupt swings. The second used a broader window and turned the same data into a slower trend. Neither graph was false, but each encouraged a different historical imagination.",
        },
        {
          label: "C",
          text:
            "Archaeologists responded uneasily. A graph with sharp climate swings seemed to fit stories of sudden migration, while a gradual curve suited arguments about adaptation and political strain. The danger was not that climate evidence entered historical explanation, but that the visual style of the graph began to choose the story before other evidence was heard.",
        },
        {
          label: "D",
          text:
            "To counter this risk, the final paper placed uncertainty bands behind the main curve and marked sections where the cave record was seasonally biased. It also separated claims about atmospheric circulation from claims about human response. This made the article less elegant, but it prevented a single line from carrying more meaning than it could bear.",
        },
        {
          label: "E",
          text:
            "The lesson is uncomfortable for readers who want ancient climate to settle historical arguments. Proxy records can sharpen questions, but they rarely close them. Their strength lies in forcing historians to state which environmental mechanism they mean, which season they are discussing and how quickly social consequences are expected to follow.",
        },
      ],
    },
  ],
  questions: [
    q({
      passageId: "p1",
      type: "yes-no-not-given",
      prompt: "The writer suggests that precise dating alone is insufficient for climate interpretation.",
      options: ["Yes", "No", "Not Given"],
      answer: "Yes",
      explanation:
        "Paragraph A says a date is not an interpretation and does not immediately reveal climate conditions outside the cave.",
      evidenceParagraph: "Paragraph A",
      evidenceText:
        "The difficulty is that a date is not an interpretation. Knowing when a layer formed does not immediately reveal what the climate was doing outside the cave.",
      whyCorrect:
        "The statement paraphrases the distinction between dating precision and climate meaning.",
      whyWrong:
        "A wrong answer may focus on unusual precision and miss the limitation that follows.",
      skill: "Making inference",
      secondarySkills: ["Recognising contrast"],
      trapType: "Writer opinion confusion",
      strategyTip:
        "In Band 8-9 questions, watch for sentences that limit the value of an apparently strong method.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "A",
    }),
    q({
      passageId: "p1",
      type: "matching-headings",
      groupTitle: "Choose the best heading for Paragraph B.",
      prompt: "Paragraph B",
      options: [
        "Why isotope values can have several climate meanings",
        "A direct measurement of ancient rainfall totals",
        "The discovery of ventilation-free cave conditions",
        "A method for dating calcite without uncertainty",
      ],
      answer: "Why isotope values can have several climate meanings",
      explanation:
        "Paragraph B explains that isotope shifts may reflect rainfall amount, moisture source, evaporation or cave ventilation.",
      evidenceParagraph: "Paragraph B",
      evidenceText:
        "The same isotope shift may reflect rainfall amount, moisture source, evaporation during transport or changes in the cave's internal ventilation.",
      whyCorrect:
        "The heading captures the paragraph's main point: one signal can have multiple causes.",
      whyWrong:
        "The wrong headings turn a cautious interpretation problem into a direct measurement or certain method.",
      skill: "Understanding main idea",
      secondarySkills: ["Identifying paragraph function"],
      trapType: "Partial match trap",
      strategyTip:
        "A heading for an advanced paragraph should capture the interpretive problem, not just the technical noun.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "B",
    }),
    q({
      passageId: "p1",
      type: "multiple-choice",
      prompt: "What did the five-year modern drip-water record show?",
      options: [
        "The stalagmite recorded all seasons equally.",
        "Winter storms were more likely than summer rain to enter the cave system quickly.",
        "Summer rain created the clearest signal in every older layer.",
        "The cave record was too contaminated to interpret at all.",
      ],
      answer:
        "Winter storms were more likely than summer rain to enter the cave system quickly.",
      explanation:
        "Paragraph C says winter storms reached the cave quickly, while summer rain often evaporated before entering the fracture system.",
      evidenceParagraph: "Paragraph C",
      evidenceText:
        "Winter storms reached the cave quickly, while summer rain often evaporated before entering the fracture system.",
      whyCorrect:
        "The answer preserves the seasonal contrast that creates the winter bias.",
      whyWrong:
        "The distractors either erase the bias or turn interpretive caution into impossibility.",
      skill: "Understanding comparison",
      secondarySkills: ["Recognising paraphrase"],
      trapType: "Comparison confusion",
      strategyTip:
        "When a passage contrasts seasons, keep the direction of the contrast clear.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "C",
    }),
    q({
      passageId: "p1",
      type: "true-false-not-given",
      prompt: "The seasonal bias made the stalagmite archive useless.",
      options: ["True", "False", "Not Given"],
      answer: "False",
      explanation:
        "Paragraph D says the bias did not make the archive useless; it made it specific.",
      evidenceParagraph: "Paragraph D",
      evidenceText:
        "The bias did not make the archive useless. It made it specific.",
      whyCorrect:
        "The statement directly contradicts the passage.",
      whyWrong:
        "A reader may treat bias as a fatal flaw, but the writer reframes it as a narrower use.",
      skill: "Recognising contrast",
      secondarySkills: ["Understanding detail"],
      trapType: "Opposite meaning trap",
      strategyTip:
        "Do not assume a limitation destroys evidence; check how the writer evaluates the limitation.",
      difficulty: "Hard",
      paragraphRef: "D",
    }),
    q({
      passageId: "p1",
      type: "summary-completion",
      prompt: "The team tested a narrower interpretation using pollen records and lake ______.",
      answer: "sediments",
      acceptedAnswers: ["sediments", "lake sediments"],
      explanation:
        "Paragraph D says nearby pollen records and lake sediments were used to test the narrower interpretation.",
      evidenceParagraph: "Paragraph D",
      evidenceText:
        "Nearby pollen records and lake sediments were then used to test that narrower interpretation.",
      whyCorrect:
        "The answer completes the pair of supporting records.",
      whyWrong:
        "A wrong answer may choose storm tracks, which were the hypothesis being tested, not the evidence used.",
      skill: "Locating explicit information",
      secondarySkills: ["Understanding detail"],
      trapType: "Similar keyword trap",
      strategyTip:
        "For completion questions, distinguish the interpretation from the evidence used to test it.",
      difficulty: "Hard",
      maxWords: 2,
      paragraphRef: "D",
    }),
    q({
      passageId: "p1",
      type: "matching-information",
      groupTitle: "Match the information to the paragraph.",
      prompt: "Which paragraph says social effects may appear after atmospheric changes have already begun?",
      options: ["A", "B", "C", "D", "E"],
      answer: "E",
      explanation:
        "Paragraph E says people may have experienced water stress years after atmospheric circulation began to alter.",
      evidenceParagraph: "Paragraph E",
      evidenceText:
        "A society living near the lakes may have experienced water stress years after atmospheric circulation had already begun to alter.",
      whyCorrect:
        "The paragraph explicitly separates climate mechanism from delayed human consequence.",
      whyWrong:
        "Earlier paragraphs discuss climate signals, but Paragraph E connects them to delayed social experience.",
      skill: "Time-efficient scanning",
      secondarySkills: ["Recognising cause and effect"],
      trapType: "Wrong paragraph trap",
      strategyTip:
        "Scan for temporal markers such as years after when the question asks about delay.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "E",
    }),
    q({
      passageId: "p1",
      type: "flow-chart-completion",
      prompt: "Winter weakening -> vegetation stress -> delayed lake-level decline -> changed implied ______.",
      answer: "mechanism",
      acceptedAnswers: ["mechanism"],
      explanation:
        "Paragraph E says the sequence mattered because it changed the implied mechanism.",
      evidenceParagraph: "Paragraph E",
      evidenceText:
        "That sequence mattered because it changed the implied mechanism.",
      whyCorrect:
        "The flow chart follows the sequence and asks what the sequence changed.",
      whyWrong:
        "A wrong answer may choose drought, but the passage says the new sequence replaced a simpler drought narrative.",
      skill: "Following reference words",
      secondarySkills: ["Recognising cause and effect"],
      trapType: "Chronology trap",
      strategyTip:
        "In flow-chart items, keep track of the conceptual result of the sequence, not only the events in it.",
      difficulty: "Band 8-9 Challenge",
      maxWords: 1,
      paragraphRef: "E",
    }),
    q({
      passageId: "p1",
      type: "short-answer",
      prompt: "Which season was the stalagmite biased toward?",
      answer: "winter",
      acceptedAnswers: ["winter", "winter conditions"],
      explanation:
        "Paragraph C says the seasonal filtering meant the stalagmite was biased toward winter conditions.",
      evidenceParagraph: "Paragraph C",
      evidenceText:
        "This seasonal filtering meant that the stalagmite was biased toward winter conditions.",
      whyCorrect:
        "The answer identifies the season privileged by the cave record.",
      whyWrong:
        "Summer is tempting because it is mentioned, but summer rain often evaporated before reaching the system.",
      skill: "Locating explicit information",
      secondarySkills: ["Understanding comparison"],
      trapType: "Comparison confusion",
      strategyTip:
        "When two seasons are contrasted, ask which one is connected to the final conclusion.",
      difficulty: "Hard",
      maxWords: 2,
      paragraphRef: "C",
    }),
    q({
      passageId: "p1",
      type: "yes-no-not-given",
      prompt: "The writer believes that a sharp isotopic change should automatically be called a general rainfall collapse.",
      options: ["Yes", "No", "Not Given"],
      answer: "No",
      explanation:
        "Paragraph D says the team could not call a sharp isotopic change a general rainfall collapse without other evidence.",
      evidenceParagraph: "Paragraph D",
      evidenceText:
        "The team could not call it a general rainfall collapse without other evidence.",
      whyCorrect:
        "The statement removes the writer's condition that other evidence is needed.",
      whyWrong:
        "A reader may focus on sharp change and assume a dramatic climate conclusion.",
      skill: "Identifying writer's opinion",
      secondarySkills: ["Avoiding overgeneralisation"],
      trapType: "Extreme wording trap",
      strategyTip:
        "In advanced writer-view questions, words such as automatically often overstate the passage.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "D",
    }),
    q({
      passageId: "p1",
      type: "matching-sentence-endings",
      groupTitle: "Choose the correct ending.",
      prompt: "Specialists are cautious about oxygen isotopes because",
      options: [
        "calcite layers cannot be dated with any precision.",
        "cave ventilation has no effect on mineral records.",
        "one isotope shift can be produced by several environmental processes.",
        "summer rain always reaches the fracture system first.",
      ],
      answer:
        "one isotope shift can be produced by several environmental processes.",
      explanation:
        "Paragraph B lists multiple possible causes of the same isotope shift.",
      evidenceParagraph: "Paragraph B",
      evidenceText:
        "The same isotope shift may reflect rainfall amount, moisture source, evaporation during transport or changes in the cave's internal ventilation.",
      whyCorrect:
        "The ending explains why the signal cannot be read in only one way.",
      whyWrong:
        "The wrong endings contradict the passage's precision, ventilation and seasonal filtering claims.",
      skill: "Understanding main idea",
      secondarySkills: ["Distinguishing fact from claim"],
      trapType: "Partial match trap",
      strategyTip:
        "For sentence endings, keep the causal relationship between caution and evidence ambiguity.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "B",
    }),
    q({
      passageId: "p2",
      type: "multiple-choice",
      prompt: "What warning does Paragraph A give about smooth climate curves?",
      options: [
        "Their smoothness may reflect a statistical choice rather than the continuous nature of the past.",
        "They are always more accurate than individual measurements.",
        "They remove laboratory error and dating uncertainty.",
        "They prove that local cave effects are irrelevant.",
      ],
      answer:
        "Their smoothness may reflect a statistical choice rather than the continuous nature of the past.",
      explanation:
        "Paragraph A says smoothness is a statistical decision, not a property of the past.",
      evidenceParagraph: "Paragraph A",
      evidenceText:
        "The smoothness is a statistical decision, not a property of the past.",
      whyCorrect:
        "The answer preserves the distinction between presentation and reality.",
      whyWrong:
        "The distractors incorrectly treat smoothness as removing uncertainty.",
      skill: "Distinguishing fact from claim",
      secondarySkills: ["Recognising contrast"],
      trapType: "Writer opinion confusion",
      strategyTip:
        "In conceptual MCQ, identify whether the writer is discussing data, presentation or interpretation.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "A",
    }),
    q({
      passageId: "p2",
      type: "matching-features",
      groupTitle: "Match the graph version to its effect.",
      prompt: "Which graph version showed several abrupt swings?",
      options: ["narrow smoothing window", "broader smoothing window", "uncertainty bands", "pollen comparison"],
      answer: "narrow smoothing window",
      explanation:
        "Paragraph B says the narrow smoothing window showed several abrupt swings.",
      evidenceParagraph: "Paragraph B",
      evidenceText:
        "The first used a narrow smoothing window and showed several abrupt swings.",
      whyCorrect:
        "The feature matches the graph version with its visual effect.",
      whyWrong:
        "The broader window produced a slower trend, making it a plausible but wrong contrast.",
      skill: "Understanding comparison",
      secondarySkills: ["Locating explicit information"],
      trapType: "Comparison confusion",
      strategyTip:
        "In Matching Features, keep paired contrasts straight: narrow versus broader, abrupt versus slower.",
      difficulty: "Hard",
      paragraphRef: "B",
    }),
    q({
      passageId: "p2",
      type: "true-false-not-given",
      prompt: "The two graph versions used different data sets.",
      options: ["True", "False", "Not Given"],
      answer: "False",
      explanation:
        "Paragraph B says the broader window turned the same data into a slower trend.",
      evidenceParagraph: "Paragraph B",
      evidenceText:
        "The second used a broader window and turned the same data into a slower trend.",
      whyCorrect:
        "The statement says the data differed, but the passage says the same data was smoothed differently.",
      whyWrong:
        "Different-looking graphs can tempt readers to assume different data sets.",
      skill: "Understanding detail",
      secondarySkills: ["Recognising contrast"],
      trapType: "Opposite meaning trap",
      strategyTip:
        "Check whether a visual difference comes from data or from the way data is processed.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "B",
    }),
    q({
      passageId: "p2",
      type: "matching-information",
      groupTitle: "Match the information to the paragraph.",
      prompt: "Which paragraph says a graph's visual style could steer historical interpretation prematurely?",
      options: ["A", "B", "C", "D", "E"],
      answer: "C",
      explanation:
        "Paragraph C says the danger was that the visual style of the graph began to choose the story before other evidence was heard.",
      evidenceParagraph: "Paragraph C",
      evidenceText:
        "The visual style of the graph began to choose the story before other evidence was heard.",
      whyCorrect:
        "The paragraph connects graph appearance to premature historical explanation.",
      whyWrong:
        "Paragraph B describes the graphs, but Paragraph C explains their interpretive danger.",
      skill: "Time-efficient scanning",
      secondarySkills: ["Making inference"],
      trapType: "Wrong paragraph trap",
      strategyTip:
        "When the question asks about interpretive danger, look beyond the technical description to the evaluative paragraph.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "C",
    }),
    q({
      passageId: "p2",
      type: "summary-completion",
      prompt: "The final paper marked sections where the cave record was seasonally ______.",
      answer: "biased",
      acceptedAnswers: ["biased"],
      explanation:
        "Paragraph D says the paper marked sections where the cave record was seasonally biased.",
      evidenceParagraph: "Paragraph D",
      evidenceText:
        "The final paper placed uncertainty bands behind the main curve and marked sections where the cave record was seasonally biased.",
      whyCorrect:
        "The answer completes the description of the record's limitation.",
      whyWrong:
        "Uncertainty bands are another feature of the paper, not the adjective completing seasonally.",
      skill: "Understanding detail",
      secondarySkills: ["Understanding vocabulary in context"],
      trapType: "Grammar form trap",
      strategyTip:
        "Use the adverb before the blank to predict the adjective form needed.",
      difficulty: "Hard",
      maxWords: 1,
      paragraphRef: "D",
    }),
    q({
      passageId: "p2",
      type: "yes-no-not-given",
      prompt: "The writer thinks proxy records usually settle historical arguments conclusively.",
      options: ["Yes", "No", "Not Given"],
      answer: "No",
      explanation:
        "Paragraph E says proxy records can sharpen questions but rarely close them.",
      evidenceParagraph: "Paragraph E",
      evidenceText:
        "Proxy records can sharpen questions, but they rarely close them.",
      whyCorrect:
        "The statement changes a cautious role into a conclusive one.",
      whyWrong:
        "A reader may overvalue the precision of dated records and miss the writer's limitation.",
      skill: "Identifying writer's opinion",
      secondarySkills: ["Avoiding overgeneralisation"],
      trapType: "Overgeneralisation trap",
      strategyTip:
        "For writer-view questions, contrast verbs like sharpen with stronger verbs like settle.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "E",
    }),
    q({
      passageId: "p2",
      type: "diagram-label-completion",
      prompt: "Interpretation chain: isotope curve -> uncertainty bands -> separated climate and human-response claims -> ______.",
      answer: "limited conclusion",
      acceptedAnswers: ["limited conclusion", "cautious interpretation"],
      explanation:
        "Paragraph D says these presentation choices prevented a single line from carrying more meaning than it could bear.",
      evidenceParagraph: "Paragraph D",
      evidenceText:
        "This made the article less elegant, but it prevented a single line from carrying more meaning than it could bear.",
      whyCorrect:
        "The schematic summarises how the paper constrained interpretation.",
      whyWrong:
        "A wrong answer may choose dramatic narrative, which the revised presentation was designed to resist.",
      skill: "Making inference",
      secondarySkills: ["Following reference words"],
      trapType: "Assumption trap",
      strategyTip:
        "For text-based diagrams, infer the function of the sequence rather than copying a nearby noun automatically.",
      difficulty: "Band 8-9 Challenge",
      maxWords: 2,
      paragraphRef: "D",
    }),
    q({
      passageId: "p2",
      type: "short-answer",
      prompt: "What did the broader smoothing window turn the same data into?",
      answer: "a slower trend",
      acceptedAnswers: ["a slower trend", "slower trend"],
      explanation:
        "Paragraph B says the broader window turned the same data into a slower trend.",
      evidenceParagraph: "Paragraph B",
      evidenceText:
        "The second used a broader window and turned the same data into a slower trend.",
      whyCorrect:
        "The answer identifies the visual effect of the broader smoothing window.",
      whyWrong:
        "Abrupt swings belongs to the narrow-window version, not the broader one.",
      skill: "Understanding comparison",
      secondarySkills: ["Locating explicit information"],
      trapType: "Comparison confusion",
      strategyTip:
        "When two versions are contrasted, pair each version with its specific effect.",
      difficulty: "Hard",
      maxWords: 3,
      paragraphRef: "B",
    }),
    q({
      passageId: "p2",
      type: "multiple-choice",
      prompt: "What is the writer's central claim in Passage 2?",
      options: [
        "Climate graphs should be read as interpretive presentations, not transparent copies of the past.",
        "Smooth graphs are always less reliable than jagged graphs.",
        "Archaeologists should exclude climate evidence from historical explanation.",
        "Uncertainty bands make climate records too confusing to use.",
      ],
      answer:
        "Climate graphs should be read as interpretive presentations, not transparent copies of the past.",
      explanation:
        "The passage argues that smoothing, visual style and uncertainty presentation shape interpretation.",
      evidenceParagraph: "Passage-wide evidence",
      evidenceText:
        "The smoothness is a statistical decision, not a property of the past... the visual style of the graph began to choose the story before other evidence was heard.",
      whyCorrect:
        "The answer captures the passage-wide argument about presentation and interpretation.",
      whyWrong:
        "The distractors turn a nuanced warning into a blanket rejection of smooth graphs, climate evidence or uncertainty.",
      skill: "Understanding main idea",
      secondarySkills: ["Making inference"],
      trapType: "Partial match trap",
      strategyTip:
        "For central-claim questions, choose the option that preserves nuance across multiple paragraphs.",
      difficulty: "Band 8-9 Challenge",
    }),
    q({
      passageId: "p2",
      type: "matching-sentence-endings",
      groupTitle: "Choose the correct ending.",
      prompt: "Proxy records are strongest when they force historians to specify",
      options: [
        "one smooth curve that closes all disagreement.",
        "which graph looks most dramatic to readers.",
        "why cave records should replace archaeological evidence.",
        "the mechanism, season and timing of expected social effects.",
      ],
      answer:
        "the mechanism, season and timing of expected social effects.",
      explanation:
        "Paragraph E says proxy records force historians to state mechanism, season and expected timing of social consequences.",
      evidenceParagraph: "Paragraph E",
      evidenceText:
        "Their strength lies in forcing historians to state which environmental mechanism they mean, which season they are discussing and how quickly social consequences are expected to follow.",
      whyCorrect:
        "The ending completes the writer's positive but limited view of proxy evidence.",
      whyWrong:
        "The wrong endings contradict the passage's caution against visual drama and conclusive settlement.",
      skill: "Understanding main idea",
      secondarySkills: ["Recognising cause and effect"],
      trapType: "Partial match trap",
      strategyTip:
        "In sentence endings, preserve the full list of conditions when the passage gives one.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "E",
    }),
  ],
});

const museumSeedsTest = makeTest({
  testId: "academic-reading-007",
  slug: "museum-seeds-and-catalogue-evidence",
  legacyIds: ["realism-easy-02"],
  title: "Seeds in Museum Drawers",
  description:
    "A controlled IELTS Academic Reading mini test on archaeological seed collections, museum labels and cautious interpretation.",
  topic: "Archaeology",
  difficulty: "Easy",
  targetBand: "Band 5.5-6.5",
  timeLimitMinutes: 30,
  subtopic: "Museum archives and archaeobotany",
  passages: [
    {
      passageId: "p1",
      title: "A Box That Had Not Been Opened",
      topic: "Archaeology",
      sourceNote: "Original IELTS-style practice passage created for this app.",
      paragraphs: [
        {
          label: "A",
          text:
            "The box was not displayed in the museum's main gallery. It sat on a metal shelf behind the education office, between spare lamp fittings and unused exhibition panels. On its lid, a faded label read 'Hill Farm, trench three, 1954'. Inside were small paper envelopes containing charred grains, fragments of nutshell and two handwritten notes from a volunteer excavator.",
        },
        {
          label: "B",
          text:
            "The collection looked ordinary, but it solved a small puzzle. Earlier reports from Hill Farm had described the site as a storage building for barley, mainly because several ceramic bins had been found near one wall. The envelopes showed that the bins were not the only source of plant remains. Lentils and hazelnut shells appeared in the same layer, suggesting meals had been prepared nearby rather than grain simply being kept for later use.",
        },
        {
          label: "C",
          text:
            "The museum team did not immediately send the grains for new radiocarbon dating. Dating would have required destroying a portion of the sample, and the team first wanted to check whether the labels could be trusted. The handwriting on the envelopes matched the volunteer's notes, and the soil marks on the packets were consistent with the colour of the Hill Farm trench photographs.",
        },
        {
          label: "D",
          text:
            "One problem remained. A dark stain on several envelopes may have been smoke damage from the original burning, but it may also have come from a coal heater used in the museum store during the 1960s. For that reason, the team avoided drawing conclusions from the stain itself. They treated the written location and the plant identifications as stronger evidence than the appearance of the paper.",
        },
        {
          label: "E",
          text:
            "The revised catalogue entry was modest. Hill Farm was no longer described simply as a barley store, yet the curators did not claim to have discovered a kitchen. They wrote that the room had evidence of storage and food preparation, a phrase less dramatic than a new headline but closer to what the surviving material could support.",
        },
      ],
    },
    {
      passageId: "p2",
      title: "When Labels Travel",
      topic: "Archaeology",
      sourceNote: "Original IELTS-style practice passage created for this app.",
      paragraphs: [
        {
          label: "A",
          text:
            "Museum labels often travel farther than the objects they describe. A clay figurine may remain in one drawer for decades while its record moves from a handwritten card to a spreadsheet and then to an online database. Each move seems simple, but small decisions about wording can change how later researchers search for the object.",
        },
        {
          label: "B",
          text:
            "At the Eastford Museum, one set of field cards used the phrase 'domestic shrine', whereas the later digital record used 'household object'. The second phrase was safer because the excavator had not proved that the figurines were used in ritual. However, researchers searching for evidence of household worship stopped finding the Eastford items unless they already knew the old phrase.",
        },
        {
          label: "C",
          text:
            "The cataloguing team therefore added a short note beside each revised term. The note did not restore the old label as fact. Instead, it explained that earlier records had used a more interpretive phrase and gave the reason for the change. This allowed cautious searching without pretending that the first description was certainly correct.",
        },
        {
          label: "D",
          text:
            "Another difficulty involved place names. Several objects were recorded as coming from 'Raven Marsh', a name that local maps stopped using after a drainage project in 1932. The new database includes both Raven Marsh and the modern district name, but it marks the old name as historical. That distinction matters when users try to connect museum objects with present-day land boundaries.",
        },
        {
          label: "E",
          text:
            "The Eastford case shows that cataloguing is not a neutral transfer of words. It is a form of interpretation with practical consequences. Good records do not remove uncertainty; they make uncertainty visible enough that the next reader can work with it.",
        },
      ],
    },
  ],
  questions: [
    q({
      passageId: "p1",
      type: "matching-headings",
      groupTitle: "Choose the best heading for Paragraph B.",
      prompt: "Paragraph B",
      options: [
        "Evidence that changed the interpretation of a room",
        "A new method for dating ancient plant remains",
        "A disagreement about museum storage conditions",
        "Proof that Hill Farm was built as a kitchen",
      ],
      answer: "Evidence that changed the interpretation of a room",
      explanation:
        "Paragraph B explains how the envelopes broadened the interpretation from barley storage to possible food preparation.",
      evidenceParagraph: "Paragraph B",
      evidenceText:
        "Lentils and hazelnut shells appeared in the same layer, suggesting meals had been prepared nearby rather than grain simply being kept for later use.",
      whyCorrect:
        "The heading reflects the whole paragraph: a small collection changed how the site was understood.",
      whyWrong:
        "The wrong headings focus on dating, storage conditions or an overconfident kitchen claim that the paragraph does not make.",
      skill: "Understanding main idea",
      secondarySkills: ["Identifying paragraph function"],
      trapType: "Overgeneralisation trap",
      strategyTip:
        "Choose headings that match the paragraph's overall function, not the most dramatic possible conclusion.",
      difficulty: "Easy",
      paragraphRef: "B",
    }),
    q({
      passageId: "p1",
      type: "true-false-not-given",
      prompt: "The seed box was part of the museum's main public display.",
      options: ["True", "False", "Not Given"],
      answer: "False",
      explanation:
        "Paragraph A says the box was not displayed in the main gallery and was stored behind the education office.",
      evidenceParagraph: "Paragraph A",
      evidenceText:
        "The box was not displayed in the museum's main gallery. It sat on a metal shelf behind the education office.",
      whyCorrect:
        "The statement contradicts the passage's description of where the box was kept.",
      whyWrong:
        "The mention of a museum may tempt a reader to imagine a public display, but the location is private storage.",
      skill: "Locating explicit information",
      secondarySkills: ["Understanding detail"],
      trapType: "Similar keyword trap",
      strategyTip:
        "Check whether the passage confirms the exact location, not just the general setting.",
      difficulty: "Easy",
      paragraphRef: "A",
    }),
    q({
      passageId: "p1",
      type: "sentence-completion",
      prompt: "The envelopes contained charred grains, nutshell fragments and two ______.",
      answer: "handwritten notes",
      acceptedAnswers: ["handwritten notes", "notes"],
      explanation:
        "Paragraph A lists the contents of the box, including two handwritten notes from a volunteer excavator.",
      evidenceParagraph: "Paragraph A",
      evidenceText:
        "Inside were small paper envelopes containing charred grains, fragments of nutshell and two handwritten notes from a volunteer excavator.",
      whyCorrect:
        "The missing words come directly after the list of plant remains.",
      whyWrong:
        "A wrong answer often copies a nearby noun such as envelopes or labels rather than completing the list.",
      skill: "Locating explicit information",
      secondarySkills: ["Understanding detail"],
      trapType: "Similar keyword trap",
      strategyTip:
        "For sentence completion, keep the grammar of the original list intact.",
      difficulty: "Easy",
      paragraphRef: "A",
    }),
    q({
      passageId: "p1",
      type: "multiple-choice",
      prompt: "Why did the team delay radiocarbon dating?",
      options: [
        "They first wanted to confirm whether the labels were reliable.",
        "The samples had already been dated in the 1950s.",
        "The method could not be used on charred grains.",
        "The museum refused to allow scientific testing of any object.",
      ],
      answer: "They first wanted to confirm whether the labels were reliable.",
      explanation:
        "Paragraph C says dating would destroy some material, so the team first checked whether the labels could be trusted.",
      evidenceParagraph: "Paragraph C",
      evidenceText:
        "Dating would have required destroying a portion of the sample, and the team first wanted to check whether the labels could be trusted.",
      whyCorrect:
        "The option preserves both the reason for caution and the immediate next step.",
      whyWrong:
        "The distractors are plausible archaeological concerns, but the passage does not mention previous dating, impossibility or a museum ban.",
      skill: "Understanding detail",
      secondarySkills: ["Recognising cause and effect"],
      trapType: "Distractor detail trap",
      strategyTip:
        "In MCQs, separate the real reason given in the passage from generally plausible reasons.",
      difficulty: "Easy",
      paragraphRef: "C",
    }),
    q({
      passageId: "p1",
      type: "matching-information",
      groupTitle: "Match the information to the paragraph.",
      prompt: "A possible source of contamination from the museum building",
      options: ["A", "B", "C", "D", "E"],
      answer: "D",
      explanation:
        "Paragraph D says a dark stain may have come from a coal heater in the museum store.",
      evidenceParagraph: "Paragraph D",
      evidenceText:
        "A dark stain on several envelopes may have been smoke damage from the original burning, but it may also have come from a coal heater used in the museum store during the 1960s.",
      whyCorrect:
        "The coal heater is a possible later source that could affect interpretation of the envelopes.",
      whyWrong:
        "Other paragraphs mention museum storage or evidence checking, but not this specific contamination possibility.",
      skill: "Time-efficient scanning",
      secondarySkills: ["Locating explicit information"],
      trapType: "Wrong paragraph trap",
      strategyTip:
        "Scan for the unique clue in the prompt, here the possible source from the museum building.",
      difficulty: "Easy",
      paragraphRef: "D",
    }),
    q({
      passageId: "p1",
      type: "summary-completion",
      prompt:
        "The revised catalogue did not describe the room only as a barley store; instead it referred to both storage and ______.",
      answer: "food preparation",
      acceptedAnswers: ["food preparation"],
      explanation:
        "Paragraph E says the curators used the phrase evidence of storage and food preparation.",
      evidenceParagraph: "Paragraph E",
      evidenceText:
        "They wrote that the room had evidence of storage and food preparation.",
      whyCorrect:
        "The phrase completes the revised interpretation without exaggerating it into a kitchen claim.",
      whyWrong:
        "A wrong answer such as kitchen would be too strong because the curators avoided that claim.",
      skill: "Recognising paraphrase",
      secondarySkills: ["Understanding detail"],
      trapType: "Overgeneralisation trap",
      strategyTip:
        "Use the cautious wording in the passage when the writer limits the conclusion.",
      difficulty: "Easy",
      paragraphRef: "E",
    }),
    q({
      passageId: "p1",
      type: "short-answer",
      prompt: "Which crop had earlier reports associated most strongly with Hill Farm?",
      answer: "barley",
      acceptedAnswers: ["barley"],
      explanation:
        "Paragraph B says earlier reports described the site as a storage building for barley.",
      evidenceParagraph: "Paragraph B",
      evidenceText:
        "Earlier reports from Hill Farm had described the site as a storage building for barley.",
      whyCorrect:
        "The answer is the crop named in the earlier interpretation.",
      whyWrong:
        "Lentils and hazelnuts are later evidence, not the crop in the earlier reports.",
      skill: "Locating explicit information",
      secondarySkills: ["Understanding detail"],
      trapType: "Chronology trap",
      strategyTip:
        "When the question asks about an earlier report, avoid using later evidence as the answer.",
      difficulty: "Easy",
      paragraphRef: "B",
    }),
    q({
      passageId: "p1",
      type: "table-completion",
      prompt: "Possible explanation for the dark stain: smoke damage or a ______ used in the store.",
      answer: "coal heater",
      acceptedAnswers: ["coal heater", "heater"],
      explanation:
        "Paragraph D gives a coal heater as the alternative source of the stain.",
      evidenceParagraph: "Paragraph D",
      evidenceText:
        "It may also have come from a coal heater used in the museum store during the 1960s.",
      whyCorrect:
        "The answer fits the table row about the alternative explanation for the stain.",
      whyWrong:
        "A general answer such as museum store names the place, not the object that may have caused the stain.",
      skill: "Understanding detail",
      secondarySkills: ["Locating explicit information"],
      trapType: "Partial match trap",
      strategyTip:
        "For tables, identify the category of the missing word before copying evidence.",
      difficulty: "Easy",
      paragraphRef: "D",
    }),
    q({
      passageId: "p1",
      type: "yes-no-not-given",
      prompt: "The writer thinks the revised catalogue wording was less exciting but more accurate.",
      options: ["Yes", "No", "Not Given"],
      answer: "Yes",
      explanation:
        "Paragraph E contrasts the less dramatic phrase with wording that was closer to the surviving material.",
      evidenceParagraph: "Paragraph E",
      evidenceText:
        "A phrase less dramatic than a new headline but closer to what the surviving material could support.",
      whyCorrect:
        "The writer approves of the cautious wording because it better matches the evidence.",
      whyWrong:
        "A reader may focus on 'less dramatic' and miss that the writer values accuracy over headline appeal.",
      skill: "Identifying writer's opinion",
      secondarySkills: ["Distinguishing fact from claim"],
      trapType: "Writer opinion confusion",
      strategyTip:
        "For Yes / No / Not Given, locate evaluative language such as 'closer to what... could support'.",
      difficulty: "Easy",
      paragraphRef: "E",
    }),
    q({
      passageId: "p1",
      type: "matching-sentence-endings",
      groupTitle: "Choose the correct ending.",
      prompt: "The museum team treated the written location as stronger evidence because",
      options: [
        "the stain on the envelopes could have more than one cause.",
        "the collection had already been placed in the main gallery.",
        "the volunteer notes had been thrown away after excavation.",
        "radiocarbon dating had proved the samples came from a kitchen.",
      ],
      answer: "the stain on the envelopes could have more than one cause.",
      explanation:
        "Paragraph D says the stain was uncertain, so the team relied more on written location and plant identifications.",
      evidenceParagraph: "Paragraph D",
      evidenceText:
        "For that reason, the team avoided drawing conclusions from the stain itself. They treated the written location and the plant identifications as stronger evidence.",
      whyCorrect:
        "The ending preserves the causal relationship: uncertain stain, stronger reliance on other evidence.",
      whyWrong:
        "The other endings add claims that are contradicted or absent.",
      skill: "Recognising cause and effect",
      secondarySkills: ["Understanding detail"],
      trapType: "Cause-effect confusion",
      strategyTip:
        "When completing an ending with because, check the sentence before the evidence for the reason.",
      difficulty: "Easy",
      paragraphRef: "D",
    }),
    q({
      passageId: "p2",
      type: "matching-information",
      groupTitle: "Match the information to the paragraph.",
      prompt: "An example of an old place name being retained with a warning about its age",
      options: ["A", "B", "C", "D", "E"],
      answer: "D",
      explanation:
        "Paragraph D explains that Raven Marsh is included but marked as historical.",
      evidenceParagraph: "Paragraph D",
      evidenceText:
        "The new database includes both Raven Marsh and the modern district name, but it marks the old name as historical.",
      whyCorrect:
        "This is the paragraph that discusses place names and how the database handles them.",
      whyWrong:
        "Paragraphs B and C discuss wording for object interpretation, not historical place names.",
      skill: "Time-efficient scanning",
      secondarySkills: ["Locating explicit information"],
      trapType: "Wrong paragraph trap",
      strategyTip:
        "Use proper nouns such as Raven Marsh as scanning anchors, then read around them for the function.",
      difficulty: "Easy",
      paragraphRef: "D",
    }),
    q({
      passageId: "p2",
      type: "multiple-choice",
      prompt: "Why was 'household object' considered safer than 'domestic shrine'?",
      options: [
        "It avoided claiming ritual use that had not been proved.",
        "It showed the figurines were made after the excavation.",
        "It matched the modern district name more accurately.",
        "It prevented researchers from using the online database.",
      ],
      answer: "It avoided claiming ritual use that had not been proved.",
      explanation:
        "Paragraph B says the phrase was safer because ritual use had not been proved.",
      evidenceParagraph: "Paragraph B",
      evidenceText:
        "The second phrase was safer because the excavator had not proved that the figurines were used in ritual.",
      whyCorrect:
        "The answer keeps the cautious interpretive reason.",
      whyWrong:
        "The distractors borrow ideas from other paragraphs or reverse the effect on database searching.",
      skill: "Distinguishing fact from claim",
      secondarySkills: ["Understanding detail"],
      trapType: "Distractor detail trap",
      strategyTip:
        "Watch for labels that are safer because they make fewer claims, not because they are more detailed.",
      difficulty: "Easy",
      paragraphRef: "B",
    }),
    q({
      passageId: "p2",
      type: "note-completion",
      prompt: "Old label: domestic shrine. Revised label: ______.",
      answer: "household object",
      acceptedAnswers: ["household object"],
      explanation:
        "Paragraph B contrasts the field card phrase domestic shrine with the later digital record phrase household object.",
      evidenceParagraph: "Paragraph B",
      evidenceText:
        "One set of field cards used the phrase 'domestic shrine', whereas the later digital record used 'household object'.",
      whyCorrect:
        "The answer is the exact revised label used in the digital record.",
      whyWrong:
        "A wrong answer may copy the old label rather than the revised one.",
      skill: "Understanding detail",
      secondarySkills: ["Locating explicit information"],
      trapType: "Opposite meaning trap",
      strategyTip:
        "In notes contrasting old and new terms, make sure you copy from the correct side of the contrast.",
      difficulty: "Easy",
      paragraphRef: "B",
    }),
    q({
      passageId: "p2",
      type: "true-false-not-given",
      prompt: "Researchers could miss the Eastford figurines if they searched only using the older ritual phrase.",
      options: ["True", "False", "Not Given"],
      answer: "False",
      explanation:
        "Paragraph B says researchers stopped finding the items unless they already knew the old phrase, so the older phrase helped rather than prevented discovery.",
      evidenceParagraph: "Paragraph B",
      evidenceText:
        "Researchers searching for evidence of household worship stopped finding the Eastford items unless they already knew the old phrase.",
      whyCorrect:
        "The statement reverses the search problem described in the passage.",
      whyWrong:
        "The old phrase is involved in the search problem, but it is not the phrase that causes the miss when used.",
      skill: "Understanding detail",
      secondarySkills: ["Recognising contrast"],
      trapType: "Opposite meaning trap",
      strategyTip:
        "Track whether a phrase is the cause of a problem or the hidden key that solves it.",
      difficulty: "Easy",
      paragraphRef: "B",
    }),
    q({
      passageId: "p2",
      type: "summary-completion",
      prompt:
        "The cataloguing note explained that earlier records had used a more ______ phrase.",
      answer: "interpretive",
      acceptedAnswers: ["interpretive"],
      explanation:
        "Paragraph C says the note explained that earlier records had used a more interpretive phrase.",
      evidenceParagraph: "Paragraph C",
      evidenceText:
        "It explained that earlier records had used a more interpretive phrase and gave the reason for the change.",
      whyCorrect:
        "The adjective identifies the quality of the earlier wording.",
      whyWrong:
        "A nearby word such as earlier or revised does not describe the phrase itself.",
      skill: "Understanding vocabulary in context",
      secondarySkills: ["Locating explicit information"],
      trapType: "Grammar form trap",
      strategyTip:
        "Check that the missing word grammatically modifies the noun after the gap.",
      difficulty: "Easy",
      paragraphRef: "C",
    }),
    q({
      passageId: "p2",
      type: "yes-no-not-given",
      prompt: "The writer believes good cataloguing should make uncertainty visible.",
      options: ["Yes", "No", "Not Given"],
      answer: "Yes",
      explanation:
        "Paragraph E states that good records make uncertainty visible enough for the next reader to use.",
      evidenceParagraph: "Paragraph E",
      evidenceText:
        "Good records do not remove uncertainty; they make uncertainty visible enough that the next reader can work with it.",
      whyCorrect:
        "The statement agrees with the writer's explicit view of good records.",
      whyWrong:
        "A wrong answer may assume records should remove uncertainty, but the writer rejects that idea.",
      skill: "Identifying writer's opinion",
      secondarySkills: ["Distinguishing fact from claim"],
      trapType: "Writer opinion confusion",
      strategyTip:
        "Writer-opinion questions often turn on verbs like should, good, useful and misleading.",
      difficulty: "Easy",
      paragraphRef: "E",
    }),
    q({
      passageId: "p2",
      type: "matching-features",
      groupTitle: "Match each feature with the correct label type.",
      prompt: "Used on the original field cards",
      options: ["domestic shrine", "household object", "Raven Marsh", "modern district name"],
      answer: "domestic shrine",
      explanation:
        "Paragraph B says the field cards used the phrase domestic shrine.",
      evidenceParagraph: "Paragraph B",
      evidenceText:
        "One set of field cards used the phrase 'domestic shrine'.",
      whyCorrect:
        "This option is tied to the original cards, not the later digital record.",
      whyWrong:
        "Household object is the revised label, while Raven Marsh and the district name concern place records.",
      skill: "Locating explicit information",
      secondarySkills: ["Understanding detail"],
      trapType: "Similar keyword trap",
      strategyTip:
        "For Matching Features, keep the entity and its time period together.",
      difficulty: "Easy",
      paragraphRef: "B",
    }),
    q({
      passageId: "p2",
      type: "flow-chart-completion",
      prompt: "Field card -> spreadsheet -> ______",
      answer: "online database",
      acceptedAnswers: ["online database", "database"],
      explanation:
        "Paragraph A gives the sequence from handwritten card to spreadsheet to online database.",
      evidenceParagraph: "Paragraph A",
      evidenceText:
        "Its record moves from a handwritten card to a spreadsheet and then to an online database.",
      whyCorrect:
        "The answer completes the final stage of the record's movement.",
      whyWrong:
        "A wrong answer may name an object rather than the next record format.",
      skill: "Recognising cause and effect",
      secondarySkills: ["Locating explicit information"],
      trapType: "Chronology trap",
      strategyTip:
        "For flow charts, follow the order of actions exactly as written.",
      difficulty: "Easy",
      paragraphRef: "A",
    }),
    q({
      passageId: "p2",
      type: "short-answer",
      prompt: "What old place name had disappeared from local maps after 1932?",
      answer: "Raven Marsh",
      acceptedAnswers: ["Raven Marsh", "Raven Marsh"],
      explanation:
        "Paragraph D says Raven Marsh was a name that local maps stopped using after a drainage project in 1932.",
      evidenceParagraph: "Paragraph D",
      evidenceText:
        "Several objects were recorded as coming from 'Raven Marsh', a name that local maps stopped using after a drainage project in 1932.",
      whyCorrect:
        "The answer is the historical place name named in the paragraph.",
      whyWrong:
        "The modern district name is mentioned but not given as the old map name.",
      skill: "Locating explicit information",
      secondarySkills: ["Understanding detail"],
      trapType: "Chronology trap",
      strategyTip:
        "For short answers, copy the exact named item that matches the time clue.",
      difficulty: "Easy",
      paragraphRef: "D",
    }),
    q({
      passageId: "p2",
      type: "multiple-choice",
      prompt: "What is the main point of Passage 2?",
      options: [
        "Changing catalogue wording can affect how future researchers interpret and find objects.",
        "Digital catalogues always make museum records less reliable than handwritten cards.",
        "Old labels should be restored as facts whenever researchers search for them.",
        "Place names are the only serious problem in archaeological cataloguing.",
      ],
      answer:
        "Changing catalogue wording can affect how future researchers interpret and find objects.",
      explanation:
        "The passage uses object labels and place names to show that cataloguing choices shape later research.",
      evidenceParagraph: "Passage-wide evidence",
      evidenceText:
        "Small decisions about wording can change how later researchers search for the object... cataloguing is not a neutral transfer of words.",
      whyCorrect:
        "The answer captures the passage-wide argument without overstating it.",
      whyWrong:
        "The distractors turn a nuanced claim into a blanket rejection of digital records, a call to restore old labels or a single-issue argument.",
      skill: "Understanding main idea",
      secondarySkills: ["Identifying paragraph function"],
      trapType: "Overgeneralisation trap",
      strategyTip:
        "For main-point MCQs, reject answers with extreme words such as always, only or whenever.",
      difficulty: "Easy",
    }),
  ],
});

const schoolTimetableTest = makeTest({
  testId: "academic-reading-008",
  slug: "school-start-times-and-sleep-evidence",
  legacyIds: ["realism-medium-03"],
  title: "Later Bells and Sleep Evidence",
  description:
    "A human-reviewed IELTS Academic Reading mini test on school start times, transport constraints and interpretation of student data.",
  topic: "Education",
  difficulty: "Medium",
  targetBand: "Band 6.5-7.5",
  timeLimitMinutes: 30,
  subtopic: "Adolescent sleep and school policy",
  passages: [
    {
      passageId: "p1",
      title: "A Timetable Trial With Uneven Mornings",
      topic: "Education",
      sourceNote: "Original IELTS-style practice passage created for this app.",
      paragraphs: [
        {
          label: "A",
          text:
            "Marlow District did not begin its timetable trial with a dramatic announcement. Three secondary schools shifted the first lesson from 8:10 to 8:45, while two nearby schools kept the old schedule because their buses were shared with primary routes. This uneven arrangement annoyed some parents, but it gave researchers a comparison group that had not been planned in the original proposal.",
        },
        {
          label: "B",
          text:
            "Students in the later-start schools reported sleeping about twenty-two minutes longer on school nights. The figure was less impressive than campaigners had hoped, partly because many students also went to bed slightly later. Attendance improved most among Year 10 students who had previously missed the first lesson at least twice a month.",
        },
        {
          label: "C",
          text:
            "Teachers noticed a different pattern. In the first six weeks, morning classes were calmer, but the effect faded after the winter break. Several teachers argued that the later start helped students arrive less rushed, while others suspected that novelty and extra staff attention explained part of the early improvement.",
        },
        {
          label: "D",
          text:
            "Transport remained the awkward part of the trial. The district saved money by keeping one bus contract, so some students reached school thirty minutes before the new first lesson. For them, the timetable had shifted on paper but not in practice. A small breakfast club helped, although it also made the trial more expensive than the headline budget suggested.",
        },
        {
          label: "E",
          text:
            "The evaluation did not recommend a universal later start. Instead, it advised schools to examine transport patterns, morning absence and after-school care before changing the bell. The researchers concluded that a later start can help, but only when the rest of the morning system moves with it.",
        },
      ],
    },
    {
      passageId: "p2",
      title: "Reading the Sleep Diaries",
      topic: "Education",
      sourceNote: "Original IELTS-style practice passage created for this app.",
      paragraphs: [
        {
          label: "A",
          text:
            "The most quoted data from the Marlow trial came from student sleep diaries. Each pupil wrote down the time they thought they fell asleep and the time they woke up. The diaries were cheap and easy to collect, but they depended on memory and honesty at the end of a busy day.",
        },
        {
          label: "B",
          text:
            "A smaller group wore wrist monitors for two weeks. These devices suggested that students often overestimated how quickly they fell asleep, especially on Sundays. Yet the monitors also missed context: they could not tell whether a student was lying still while worrying about homework or quietly reading a novel.",
        },
        {
          label: "C",
          text:
            "Researchers compared diary entries with monitor data rather than choosing one source as the truth. When both sources moved in the same direction, confidence increased. When they disagreed, the team looked for an explanation in interviews with students and parents.",
        },
        {
          label: "D",
          text:
            "One disagreement proved useful. Diaries from one school showed a large sleep gain, but monitors showed only a small change. Interviews revealed that a new homework app had reduced late-night checking of assignment details. Students felt calmer and recorded better sleep, even though their measured sleep duration changed little.",
        },
        {
          label: "E",
          text:
            "The Marlow team therefore treated sleep as more than a number of minutes. Duration mattered, but so did the predictability of mornings and the anxiety attached to unfinished work. That conclusion made the policy harder to summarize, but it gave schools a more realistic set of problems to address.",
        },
      ],
    },
  ],
  questions: [
    q({
      passageId: "p1",
      type: "matching-information",
      groupTitle: "Match the information to the paragraph.",
      prompt: "A reason why some schools accidentally became a comparison group",
      options: ["A", "B", "C", "D", "E"],
      answer: "A",
      explanation:
        "Paragraph A explains that two schools kept the old schedule because buses were shared with primary routes.",
      evidenceParagraph: "Paragraph A",
      evidenceText:
        "Two nearby schools kept the old schedule because their buses were shared with primary routes.",
      whyCorrect:
        "The old-schedule schools created a comparison group even though that had not been planned.",
      whyWrong:
        "Other paragraphs discuss results and transport problems, not why the comparison group emerged.",
      skill: "Time-efficient scanning",
      secondarySkills: ["Locating explicit information"],
      trapType: "Wrong paragraph trap",
      strategyTip:
        "For Matching Information, scan for the specific institutional reason before reading for detail.",
      difficulty: "Medium",
      paragraphRef: "A",
    }),
    q({
      passageId: "p1",
      type: "sentence-completion",
      prompt: "Students in later-start schools slept about ______ longer on school nights.",
      answer: "twenty-two minutes",
      acceptedAnswers: ["twenty-two minutes", "22 minutes"],
      explanation:
        "Paragraph B gives the sleep increase as about twenty-two minutes.",
      evidenceParagraph: "Paragraph B",
      evidenceText:
        "Students in the later-start schools reported sleeping about twenty-two minutes longer on school nights.",
      whyCorrect:
        "The answer is the reported average increase in sleep.",
      whyWrong:
        "Thirty minutes refers to early bus arrival, not extra sleep.",
      skill: "Locating explicit information",
      secondarySkills: ["Understanding detail"],
      trapType: "Distractor detail trap",
      strategyTip:
        "Keep numerical answers tied to the correct measure; IELTS passages often include several times.",
      difficulty: "Medium",
      paragraphRef: "B",
    }),
    q({
      passageId: "p1",
      type: "true-false-not-given",
      prompt: "The later start had its strongest attendance effect among Year 10 students with previous first-lesson absences.",
      options: ["True", "False", "Not Given"],
      answer: "True",
      explanation:
        "Paragraph B says attendance improved most for Year 10 students who had often missed first lesson.",
      evidenceParagraph: "Paragraph B",
      evidenceText:
        "Attendance improved most among Year 10 students who had previously missed the first lesson at least twice a month.",
      whyCorrect:
        "The statement matches the group and condition named in the passage.",
      whyWrong:
        "A wrong answer may generalise the improvement to all students equally.",
      skill: "Understanding detail",
      secondarySkills: ["Locating explicit information"],
      trapType: "No major trap",
      strategyTip:
        "When a statement includes a subgroup, check whether the passage names the same subgroup.",
      difficulty: "Medium",
      paragraphRef: "B",
    }),
    q({
      passageId: "p1",
      type: "multiple-choice",
      prompt: "What is suggested about the calmer morning classes?",
      options: [
        "They may have been partly caused by novelty and staff attention.",
        "They lasted throughout the entire school year without weakening.",
        "They were measured only in the schools that kept the old schedule.",
        "They proved that bus routes had no effect on student behaviour.",
      ],
      answer: "They may have been partly caused by novelty and staff attention.",
      explanation:
        "Paragraph C says some teachers suspected that novelty and extra staff attention explained part of the early improvement.",
      evidenceParagraph: "Paragraph C",
      evidenceText:
        "Others suspected that novelty and extra staff attention explained part of the early improvement.",
      whyCorrect:
        "The option preserves the tentative alternative explanation.",
      whyWrong:
        "The other options contradict the fading effect, misplace the measurement or overstate transport conclusions.",
      skill: "Making inference",
      secondarySkills: ["Distinguishing fact from claim"],
      trapType: "Cause-effect confusion",
      strategyTip:
        "When an effect fades, look for cautious alternative explanations rather than a single cause.",
      difficulty: "Medium",
      paragraphRef: "C",
    }),
    q({
      passageId: "p1",
      type: "summary-completion",
      prompt:
        "Because the district kept one bus contract, some students arrived ______ before the new first lesson.",
      answer: "thirty minutes",
      acceptedAnswers: ["thirty minutes", "30 minutes"],
      explanation:
        "Paragraph D says some students reached school thirty minutes before the new first lesson.",
      evidenceParagraph: "Paragraph D",
      evidenceText:
        "Some students reached school thirty minutes before the new first lesson.",
      whyCorrect:
        "The answer completes the consequence of keeping the same bus contract.",
      whyWrong:
        "Twenty-two minutes belongs to sleep gain, not early arrival.",
      skill: "Understanding detail",
      secondarySkills: ["Recognising cause and effect"],
      trapType: "Similar keyword trap",
      strategyTip:
        "Do not transfer numbers between different parts of the trial.",
      difficulty: "Medium",
      paragraphRef: "D",
    }),
    q({
      passageId: "p1",
      type: "yes-no-not-given",
      prompt: "The writer thinks a later start should be adopted by every school district.",
      options: ["Yes", "No", "Not Given"],
      answer: "No",
      explanation:
        "Paragraph E says the evaluation did not recommend a universal later start.",
      evidenceParagraph: "Paragraph E",
      evidenceText:
        "The evaluation did not recommend a universal later start.",
      whyCorrect:
        "The writer reports a cautious recommendation rather than a universal policy.",
      whyWrong:
        "The passage says later starts can help, but only under certain system conditions.",
      skill: "Identifying writer's opinion",
      secondarySkills: ["Avoiding overgeneralisation"],
      trapType: "Overgeneralisation trap",
      strategyTip:
        "Be careful when a question changes a conditional recommendation into a universal one.",
      difficulty: "Medium",
      paragraphRef: "E",
    }),
    q({
      passageId: "p1",
      type: "short-answer",
      prompt: "What service made the trial more expensive than the headline budget suggested?",
      answer: "breakfast club",
      acceptedAnswers: ["breakfast club", "a small breakfast club"],
      explanation:
        "Paragraph D says a small breakfast club helped but made the trial more expensive.",
      evidenceParagraph: "Paragraph D",
      evidenceText:
        "A small breakfast club helped, although it also made the trial more expensive than the headline budget suggested.",
      whyCorrect:
        "The answer is the service that added hidden cost.",
      whyWrong:
        "The bus contract is part of the transport constraint, but the passage names the breakfast club as the added cost.",
      skill: "Locating explicit information",
      secondarySkills: ["Understanding detail"],
      trapType: "Partial match trap",
      strategyTip:
        "For short-answer cost questions, identify the noun directly linked to expense.",
      difficulty: "Medium",
      paragraphRef: "D",
    }),
    q({
      passageId: "p1",
      type: "table-completion",
      prompt: "Policy factor to examine before changing bells: transport patterns, morning absence and ______.",
      answer: "after-school care",
      acceptedAnswers: ["after-school care", "after school care"],
      explanation:
        "Paragraph E lists after-school care as one factor schools should examine before changing the bell.",
      evidenceParagraph: "Paragraph E",
      evidenceText:
        "It advised schools to examine transport patterns, morning absence and after-school care before changing the bell.",
      whyCorrect:
        "The answer completes the list of factors in the recommendation.",
      whyWrong:
        "A wrong answer may copy a result such as sleep duration rather than a policy factor.",
      skill: "Understanding detail",
      secondarySkills: ["Locating explicit information"],
      trapType: "Grammar form trap",
      strategyTip:
        "For table completion, keep parallel list structure: noun phrase, noun phrase, noun phrase.",
      difficulty: "Medium",
      paragraphRef: "E",
    }),
    q({
      passageId: "p1",
      type: "matching-headings",
      groupTitle: "Choose the best heading for Paragraph D.",
      prompt: "Paragraph D",
      options: [
        "A transport arrangement that limited the practical effect of the policy",
        "A complete financial saving from changing school buses",
        "A student campaign against the breakfast programme",
        "A comparison of diary data and wrist-monitor data",
      ],
      answer: "A transport arrangement that limited the practical effect of the policy",
      explanation:
        "Paragraph D explains how bus arrangements meant some students still arrived early despite the later lesson.",
      evidenceParagraph: "Paragraph D",
      evidenceText:
        "For them, the timetable had shifted on paper but not in practice.",
      whyCorrect:
        "The heading captures the paragraph's main function: transport reduced the real policy change for some students.",
      whyWrong:
        "The wrong headings either overstate savings, invent a campaign or belong to the second passage.",
      skill: "Understanding main idea",
      secondarySkills: ["Identifying paragraph function"],
      trapType: "Partial match trap",
      strategyTip:
        "Choose the heading that explains the role of the paragraph in the argument.",
      difficulty: "Medium",
      paragraphRef: "D",
    }),
    q({
      passageId: "p1",
      type: "matching-sentence-endings",
      groupTitle: "Choose the correct ending.",
      prompt: "The researchers concluded that a later start works best when",
      options: [
        "the rest of the morning system changes with the bell time.",
        "schools ignore transport contracts during the trial.",
        "students agree to go to bed much earlier each evening.",
        "attendance is measured only after the winter break.",
      ],
      answer: "the rest of the morning system changes with the bell time.",
      explanation:
        "Paragraph E says a later start can help only when the rest of the morning system moves with it.",
      evidenceParagraph: "Paragraph E",
      evidenceText:
        "A later start can help, but only when the rest of the morning system moves with it.",
      whyCorrect:
        "The ending preserves the condition attached to the recommendation.",
      whyWrong:
        "The wrong endings add unsupported conditions or contradict the evidence.",
      skill: "Recognising cause and effect",
      secondarySkills: ["Understanding main idea"],
      trapType: "Partial match trap",
      strategyTip:
        "When a sentence ending follows 'when', preserve the condition exactly.",
      difficulty: "Medium",
      paragraphRef: "E",
    }),
    q({
      passageId: "p2",
      type: "multiple-choice",
      prompt: "What weakness of sleep diaries is mentioned in Paragraph A?",
      options: [
        "They depended on memory and honesty.",
        "They could not be collected cheaply.",
        "They measured movement but not emotion.",
        "They were used by only one student group.",
      ],
      answer: "They depended on memory and honesty.",
      explanation:
        "Paragraph A says diaries depended on memory and honesty at the end of a busy day.",
      evidenceParagraph: "Paragraph A",
      evidenceText:
        "They depended on memory and honesty at the end of a busy day.",
      whyCorrect:
        "The answer states the diary limitation given in the paragraph.",
      whyWrong:
        "The monitor limitation about emotion appears in Paragraph B, not Paragraph A.",
      skill: "Understanding detail",
      secondarySkills: ["Locating explicit information"],
      trapType: "Wrong paragraph trap",
      strategyTip:
        "When two methods are compared, keep each limitation attached to the right method.",
      difficulty: "Medium",
      paragraphRef: "A",
    }),
    q({
      passageId: "p2",
      type: "true-false-not-given",
      prompt: "Wrist monitors showed that students often underestimated how long it took them to fall asleep.",
      options: ["True", "False", "Not Given"],
      answer: "False",
      explanation:
        "Paragraph B says students overestimated how quickly they fell asleep, which means they thought it took less time than it did.",
      evidenceParagraph: "Paragraph B",
      evidenceText:
        "These devices suggested that students often overestimated how quickly they fell asleep.",
      whyCorrect:
        "The statement changes the direction of the error.",
      whyWrong:
        "The wording is tempting because both the statement and passage concern inaccurate sleep estimates.",
      skill: "Understanding comparison",
      secondarySkills: ["Recognising contrast"],
      trapType: "Opposite meaning trap",
      strategyTip:
        "Pay attention to the direction of comparison words such as overestimated and underestimated.",
      difficulty: "Medium",
      paragraphRef: "B",
    }),
    q({
      passageId: "p2",
      type: "note-completion",
      prompt: "Wrist monitors could not show whether a still student was worrying or ______.",
      answer: "quietly reading a novel",
      acceptedAnswers: ["quietly reading a novel", "reading a novel"],
      explanation:
        "Paragraph B says the monitors could not distinguish worrying about homework from quietly reading a novel.",
      evidenceParagraph: "Paragraph B",
      evidenceText:
        "They could not tell whether a student was lying still while worrying about homework or quietly reading a novel.",
      whyCorrect:
        "The answer completes the contrast between two still behaviours.",
      whyWrong:
        "A wrong answer may copy homework, but that is the first alternative, not the missing one.",
      skill: "Understanding detail",
      secondarySkills: ["Recognising contrast"],
      trapType: "Partial match trap",
      strategyTip:
        "Use the structure 'whether... or...' to locate the correct half of the contrast.",
      difficulty: "Medium",
      paragraphRef: "B",
    }),
    q({
      passageId: "p2",
      type: "matching-information",
      groupTitle: "Match the information to the paragraph.",
      prompt: "A case where students felt calmer although measured sleep duration changed little",
      options: ["A", "B", "C", "D", "E"],
      answer: "D",
      explanation:
        "Paragraph D describes the homework app and the difference between diary feelings and measured duration.",
      evidenceParagraph: "Paragraph D",
      evidenceText:
        "Students felt calmer and recorded better sleep, even though their measured sleep duration changed little.",
      whyCorrect:
        "This paragraph contains the specific contrast between perceived improvement and monitor data.",
      whyWrong:
        "Paragraph B discusses monitor limits generally, but not the homework-app case.",
      skill: "Time-efficient scanning",
      secondarySkills: ["Locating explicit information"],
      trapType: "Wrong paragraph trap",
      strategyTip:
        "Scan for the unusual combination of feeling calmer and little measured change.",
      difficulty: "Medium",
      paragraphRef: "D",
    }),
    q({
      passageId: "p2",
      type: "flow-chart-completion",
      prompt: "Diary and monitor data disagree -> team checks interviews with ______.",
      answer: "students and parents",
      acceptedAnswers: ["students and parents", "students, parents"],
      explanation:
        "Paragraph C says the team looked for explanations in interviews with students and parents.",
      evidenceParagraph: "Paragraph C",
      evidenceText:
        "When they disagreed, the team looked for an explanation in interviews with students and parents.",
      whyCorrect:
        "The answer completes the next step in the research process.",
      whyWrong:
        "Teachers are mentioned in Passage 1, but not as the interview source here.",
      skill: "Recognising cause and effect",
      secondarySkills: ["Locating explicit information"],
      trapType: "Chronology trap",
      strategyTip:
        "For flow charts, follow what happens after the arrow rather than choosing a familiar actor from another paragraph.",
      difficulty: "Medium",
      paragraphRef: "C",
    }),
    q({
      passageId: "p2",
      type: "yes-no-not-given",
      prompt: "The writer approves of comparing different kinds of sleep evidence rather than choosing one as automatically correct.",
      options: ["Yes", "No", "Not Given"],
      answer: "Yes",
      explanation:
        "Paragraph C describes the researchers comparing sources rather than choosing one as the truth, and the passage presents this as the basis for confidence.",
      evidenceParagraph: "Paragraph C",
      evidenceText:
        "Researchers compared diary entries with monitor data rather than choosing one source as the truth. When both sources moved in the same direction, confidence increased.",
      whyCorrect:
        "The writer presents triangulation as the careful approach.",
      whyWrong:
        "A wrong answer may assume monitors are automatically superior because they are devices, but the passage resists that simplification.",
      skill: "Identifying writer's opinion",
      secondarySkills: ["Distinguishing fact from claim"],
      trapType: "Writer opinion confusion",
      strategyTip:
        "Notice when a passage values agreement between evidence sources over one supposedly perfect method.",
      difficulty: "Medium",
      paragraphRef: "C",
    }),
    q({
      passageId: "p2",
      type: "summary-completion",
      prompt:
        "The homework app reduced late-night checking of assignment details, which made students feel ______.",
      answer: "calmer",
      acceptedAnswers: ["calmer"],
      explanation:
        "Paragraph D says students felt calmer after the homework app reduced late-night checking.",
      evidenceParagraph: "Paragraph D",
      evidenceText:
        "A new homework app had reduced late-night checking of assignment details. Students felt calmer and recorded better sleep.",
      whyCorrect:
        "The answer is the reported emotional effect, not a measured duration result.",
      whyWrong:
        "A wrong answer such as longer would confuse feeling better with sleeping longer.",
      skill: "Recognising cause and effect",
      secondarySkills: ["Understanding detail"],
      trapType: "Cause-effect confusion",
      strategyTip:
        "Separate emotional outcomes from measured sleep-duration outcomes.",
      difficulty: "Medium",
      paragraphRef: "D",
    }),
    q({
      passageId: "p2",
      type: "diagram-label-completion",
      groupTitle: "Text schematic: Evidence comparison",
      prompt: "Sleep diaries + wrist monitors + interviews -> [label 18]",
      answer: "more realistic problems",
      acceptedAnswers: ["more realistic problems", "a more realistic set of problems"],
      explanation:
        "The schematic summarizes the passage's move from multiple evidence sources to a more realistic set of school problems.",
      evidenceParagraph: "Paragraph E",
      evidenceText:
        "It gave schools a more realistic set of problems to address.",
      whyCorrect:
        "The label identifies the practical outcome of combining evidence sources.",
      whyWrong:
        "A wrong answer such as sleep duration alone ignores the passage's broader conclusion.",
      skill: "Making inference",
      secondarySkills: ["Understanding main idea"],
      trapType: "Partial match trap",
      strategyTip:
        "For schematic labels, ask what the whole evidence pathway leads to.",
      difficulty: "Medium",
      paragraphRef: "E",
    }),
    q({
      passageId: "p2",
      type: "short-answer",
      prompt: "On which day did students especially overestimate how quickly they fell asleep?",
      answer: "Sundays",
      acceptedAnswers: ["Sundays", "Sunday"],
      explanation:
        "Paragraph B says the overestimate was especially noticeable on Sundays.",
      evidenceParagraph: "Paragraph B",
      evidenceText:
        "Students often overestimated how quickly they fell asleep, especially on Sundays.",
      whyCorrect:
        "The answer is the day named in relation to the measurement error.",
      whyWrong:
        "School nights are the general context, but Sundays are the specific answer.",
      skill: "Locating explicit information",
      secondarySkills: ["Understanding detail"],
      trapType: "Similar keyword trap",
      strategyTip:
        "Use the specific qualifier after especially when the question asks for a day or group.",
      difficulty: "Medium",
      paragraphRef: "B",
    }),
    q({
      passageId: "p2",
      type: "multiple-choice",
      prompt: "What is the main argument of Passage 2?",
      options: [
        "Sleep evidence should combine reported experience, device data and interviews.",
        "Student diaries are too unreliable to be useful in school research.",
        "Wrist monitors provide a complete account of adolescent sleep quality.",
        "Homework apps are more important than school start times in all districts.",
      ],
      answer:
        "Sleep evidence should combine reported experience, device data and interviews.",
      explanation:
        "The passage argues for reading sleep through multiple evidence sources and treating sleep as more than minutes.",
      evidenceParagraph: "Passage-wide evidence",
      evidenceText:
        "Researchers compared diary entries with monitor data rather than choosing one source as the truth... The Marlow team therefore treated sleep as more than a number of minutes.",
      whyCorrect:
        "The answer captures the passage's argument for triangulation and broader interpretation.",
      whyWrong:
        "The distractors overvalue or dismiss one evidence source, which the passage avoids.",
      skill: "Understanding main idea",
      secondarySkills: ["Making inference"],
      trapType: "Overgeneralisation trap",
      strategyTip:
        "Main-argument answers should preserve the balance of the whole passage.",
      difficulty: "Medium",
    }),
  ],
});

const gestureGrammarTest = makeTest({
  testId: "academic-reading-009",
  slug: "gesture-grammar-and-shared-attention",
  legacyIds: ["realism-hard-03"],
  title: "Gesture, Grammar and Shared Attention",
  description:
    "A harder IELTS Academic Reading mini test on gesture research, linguistic interpretation and field observation.",
  topic: "Linguistics",
  difficulty: "Hard",
  targetBand: "Band 7.5-8.0",
  timeLimitMinutes: 30,
  subtopic: "Gesture and language research",
  passages: [
    {
      passageId: "p1",
      title: "The Grammar That Was Not in the Hands Alone",
      topic: "Linguistics",
      sourceNote: "Original IELTS-style practice passage created for this app.",
      paragraphs: [
        {
          label: "A",
          text:
            "Early laboratory studies of gesture often isolated the hands. Participants sat at a table, described a route on a map, and their movements were coded for direction, shape and timing. The method was tidy, and for some questions it remains useful. Yet it encouraged a narrow idea: that gesture could be read as a second language running beside speech.",
        },
        {
          label: "B",
          text:
            "Later work complicated that picture. A pointing movement might mark a place in an imagined diagram, but its meaning depended on eye gaze, spoken hesitation and the listener's previous knowledge. In one study, the same small circular motion meant 'repeat the process' when paired with a technical explanation, but meant 'return to this topic' in a planning meeting.",
        },
        {
          label: "C",
          text:
            "Some researchers proposed calling gesture a grammar of attention rather than a grammar of signs. The phrase was deliberately imperfect. Gestures do not have the stable categories of a spoken tense system, but they can organise what speakers and listeners treat as currently relevant. A hand movement may not name an idea; it may make the idea available for joint work.",
        },
        {
          label: "D",
          text:
            "The shift created a measurement problem. If gesture depends on shared context, a video clip stripped of conversation history can be misleading. Annotators may agree on the shape of a movement while disagreeing on what it did in the interaction. High agreement on visible form, therefore, does not guarantee agreement on communicative function.",
        },
        {
          label: "E",
          text:
            "The strongest recent studies combine close video analysis with interviews and repeated observation of the same group. This approach is slower than coding isolated gestures, and it produces fewer neat tables. Its advantage is that it treats gesture as part of an activity, not as a detachable object floating above speech.",
        },
      ],
    },
    {
      passageId: "p2",
      title: "Hands in the Repair Workshop",
      topic: "Linguistics",
      sourceNote: "Original IELTS-style practice passage created for this app.",
      paragraphs: [
        {
          label: "A",
          text:
            "The repair workshop was not designed as a language laboratory. Two mechanics, a trainee and a visiting engineer worked around a dismantled irrigation pump while customers came in to ask about unrelated machines. The researcher who filmed the workshop had expected to collect examples of technical vocabulary. Instead, she found that much of the instruction happened before any technical term was spoken.",
        },
        {
          label: "B",
          text:
            "When the senior mechanic tapped the edge of a metal seal, the trainee leaned closer before the word 'worn' appeared. The tap did not simply point to a part. It reduced the visual field, selecting one narrow edge from a crowded workbench. Only after the trainee's gaze arrived did the mechanic explain why the seal would leak under pressure.",
        },
        {
          label: "C",
          text:
            "The visiting engineer used gestures differently. He drew a rectangle in the air to represent the pump housing, then moved his finger through the imagined space to show water flow. These gestures were not tied to a visible object; they created a temporary diagram that others could correct. At one point, the mechanic interrupted the imagined route and turned the pump casing to show where the diagram failed.",
        },
        {
          label: "D",
          text:
            "The study did not claim that workshop gestures were universal. A gesture that was obvious to the mechanics sometimes confused customers, and the trainee misunderstood several movements until he had watched the repair sequence more than once. Meaning came from participation in the work, not from hand shape alone.",
        },
        {
          label: "E",
          text:
            "For language researchers, the workshop offered a useful warning. If gesture is studied only as a visible movement, its instructional role is likely to be underestimated. The hand matters, but so do the object, the timing of gaze and the shared memory of what has just gone wrong.",
        },
      ],
    },
  ],
  questions: [
    q({
      passageId: "p1",
      type: "yes-no-not-given",
      prompt: "The writer suggests that early laboratory methods were useful but encouraged an overly narrow view of gesture.",
      options: ["Yes", "No", "Not Given"],
      answer: "Yes",
      explanation:
        "Paragraph A calls the method tidy and still useful for some questions, but says it encouraged a narrow idea.",
      evidenceParagraph: "Paragraph A",
      evidenceText:
        "The method was tidy, and for some questions it remains useful. Yet it encouraged a narrow idea.",
      whyCorrect:
        "The statement matches the writer's balanced evaluation: useful in part, but conceptually limiting.",
      whyWrong:
        "A wrong answer may focus only on the criticism and miss the concession.",
      skill: "Identifying writer's opinion",
      secondarySkills: ["Recognising contrast"],
      trapType: "Writer opinion confusion",
      strategyTip:
        "In writer-opinion questions, keep concessions and criticisms together.",
      difficulty: "Hard",
      paragraphRef: "A",
    }),
    q({
      passageId: "p1",
      type: "multiple-choice",
      prompt: "What does the example of the small circular motion show?",
      options: [
        "The same movement can perform different functions in different contexts.",
        "Technical explanations always make gesture meanings clearer.",
        "Planning meetings use fewer gestures than laboratory tasks.",
        "Circular gestures have a fixed grammatical category.",
      ],
      answer:
        "The same movement can perform different functions in different contexts.",
      explanation:
        "Paragraph B says the same small circular motion had different meanings depending on the accompanying activity.",
      evidenceParagraph: "Paragraph B",
      evidenceText:
        "The same small circular motion meant 'repeat the process' when paired with a technical explanation, but meant 'return to this topic' in a planning meeting.",
      whyCorrect:
        "The example demonstrates context-dependent function.",
      whyWrong:
        "The distractors either overgeneralise or impose fixed categories that the paragraph questions.",
      skill: "Recognising contrast",
      secondarySkills: ["Understanding comparison"],
      trapType: "Comparison confusion",
      strategyTip:
        "When one gesture appears in two contexts, compare the function, not only the shape.",
      difficulty: "Hard",
      paragraphRef: "B",
    }),
    q({
      passageId: "p1",
      type: "matching-headings",
      groupTitle: "Choose the best heading for Paragraph C.",
      prompt: "Paragraph C",
      options: [
        "A deliberately limited metaphor for how gesture directs relevance",
        "A full replacement of spoken grammar by hand signs",
        "A debate about whether tense exists in all spoken languages",
        "A method for coding direction and shape in laboratory tasks",
      ],
      answer:
        "A deliberately limited metaphor for how gesture directs relevance",
      explanation:
        "Paragraph C explains the imperfect phrase 'grammar of attention' and how gestures organise relevance.",
      evidenceParagraph: "Paragraph C",
      evidenceText:
        "Some researchers proposed calling gesture a grammar of attention rather than a grammar of signs. The phrase was deliberately imperfect.",
      whyCorrect:
        "The heading captures both the metaphor and its limitation.",
      whyWrong:
        "The wrong headings overstate replacement, shift to spoken tense or return to Paragraph A's coding method.",
      skill: "Understanding main idea",
      secondarySkills: ["Identifying paragraph function"],
      trapType: "Partial match trap",
      strategyTip:
        "For headings, avoid options that exaggerate a cautious theoretical phrase.",
      difficulty: "Hard",
      paragraphRef: "C",
    }),
    q({
      passageId: "p1",
      type: "sentence-completion",
      prompt: "A video clip without conversation history can be ______.",
      answer: "misleading",
      acceptedAnswers: ["misleading"],
      explanation:
        "Paragraph D states that a clip stripped of conversation history can be misleading.",
      evidenceParagraph: "Paragraph D",
      evidenceText:
        "If gesture depends on shared context, a video clip stripped of conversation history can be misleading.",
      whyCorrect:
        "The answer completes the consequence of removing shared context.",
      whyWrong:
        "A wrong answer such as useful would ignore the conditional warning.",
      skill: "Understanding detail",
      secondarySkills: ["Recognising cause and effect"],
      trapType: "Cause-effect confusion",
      strategyTip:
        "Notice if clauses: they often introduce the reason for a later judgement.",
      difficulty: "Hard",
      paragraphRef: "D",
    }),
    q({
      passageId: "p1",
      type: "true-false-not-given",
      prompt: "Annotators may agree on a gesture's visible form while disagreeing about its communicative role.",
      options: ["True", "False", "Not Given"],
      answer: "True",
      explanation:
        "Paragraph D says annotators may agree on shape while disagreeing on what the movement did in the interaction.",
      evidenceParagraph: "Paragraph D",
      evidenceText:
        "Annotators may agree on the shape of a movement while disagreeing on what it did in the interaction.",
      whyCorrect:
        "Visible form and communicative function are distinguished in the same sentence.",
      whyWrong:
        "A wrong answer may assume agreement on form automatically means agreement on function.",
      skill: "Distinguishing fact from claim",
      secondarySkills: ["Recognising contrast"],
      trapType: "Assumption trap",
      strategyTip:
        "Do not infer functional agreement from agreement about visible form.",
      difficulty: "Hard",
      paragraphRef: "D",
    }),
    q({
      passageId: "p1",
      type: "matching-information",
      groupTitle: "Match the information to the paragraph.",
      prompt: "A warning that neat numerical output may be reduced by a richer method",
      options: ["A", "B", "C", "D", "E"],
      answer: "E",
      explanation:
        "Paragraph E says the strongest studies are slower and produce fewer neat tables.",
      evidenceParagraph: "Paragraph E",
      evidenceText:
        "This approach is slower than coding isolated gestures, and it produces fewer neat tables.",
      whyCorrect:
        "The paragraph identifies a trade-off between richer evidence and tidy output.",
      whyWrong:
        "Paragraph D discusses measurement disagreement, but not the loss of neat tables.",
      skill: "Time-efficient scanning",
      secondarySkills: ["Understanding detail"],
      trapType: "Wrong paragraph trap",
      strategyTip:
        "Scan for unusual phrases such as 'neat tables' when locating information.",
      difficulty: "Hard",
      paragraphRef: "E",
    }),
    q({
      passageId: "p1",
      type: "summary-completion",
      prompt:
        "The strongest studies treat gesture as part of an ______ rather than as a detachable object.",
      answer: "activity",
      acceptedAnswers: ["activity"],
      explanation:
        "Paragraph E contrasts gesture as part of an activity with a detachable object above speech.",
      evidenceParagraph: "Paragraph E",
      evidenceText:
        "It treats gesture as part of an activity, not as a detachable object floating above speech.",
      whyCorrect:
        "The noun activity captures the passage's context-based view.",
      whyWrong:
        "A wrong answer such as object reverses the contrast.",
      skill: "Recognising paraphrase",
      secondarySkills: ["Understanding main idea"],
      trapType: "Opposite meaning trap",
      strategyTip:
        "In summary completion, keep not-as contrasts in the right direction.",
      difficulty: "Hard",
      paragraphRef: "E",
    }),
    q({
      passageId: "p1",
      type: "flow-chart-completion",
      prompt: "Shared context removed -> annotators agree on shape but disagree on ______.",
      answer: "communicative function",
      acceptedAnswers: ["communicative function", "function"],
      explanation:
        "Paragraph D says visible form agreement does not guarantee agreement on communicative function.",
      evidenceParagraph: "Paragraph D",
      evidenceText:
        "High agreement on visible form, therefore, does not guarantee agreement on communicative function.",
      whyCorrect:
        "The answer completes the process consequence: agreement on form is not agreement on function.",
      whyWrong:
        "A wrong answer such as shape repeats the agreed part rather than the disputed part.",
      skill: "Recognising cause and effect",
      secondarySkills: ["Understanding comparison"],
      trapType: "Partial match trap",
      strategyTip:
        "In flow charts, identify what changes after therefore.",
      difficulty: "Hard",
      paragraphRef: "D",
    }),
    q({
      passageId: "p1",
      type: "matching-sentence-endings",
      groupTitle: "Choose the correct ending.",
      prompt: "A hand movement may make an idea available for joint work rather than",
      options: [
        "name the idea directly.",
        "remove the listener from the conversation.",
        "replace all spoken tense systems.",
        "prove that laboratory coding is useless.",
      ],
      answer: "name the idea directly.",
      explanation:
        "Paragraph C says a hand movement may not name an idea but may make it available for joint work.",
      evidenceParagraph: "Paragraph C",
      evidenceText:
        "A hand movement may not name an idea; it may make the idea available for joint work.",
      whyCorrect:
        "The ending preserves the contrast between naming and organising attention.",
      whyWrong:
        "The wrong endings exaggerate the theoretical claim.",
      skill: "Recognising contrast",
      secondarySkills: ["Understanding main idea"],
      trapType: "Overgeneralisation trap",
      strategyTip:
        "Complete contrasts using the exact opposition the writer gives.",
      difficulty: "Hard",
      paragraphRef: "C",
    }),
    q({
      passageId: "p1",
      type: "short-answer",
      prompt: "What previous knowledge, along with gaze and hesitation, could affect a pointing movement's meaning?",
      answer: "the listener's previous knowledge",
      acceptedAnswers: ["listener's previous knowledge", "the listener's previous knowledge", "previous knowledge"],
      explanation:
        "Paragraph B says meaning depended on eye gaze, spoken hesitation and the listener's previous knowledge.",
      evidenceParagraph: "Paragraph B",
      evidenceText:
        "Its meaning depended on eye gaze, spoken hesitation and the listener's previous knowledge.",
      whyCorrect:
        "The answer names the third contextual factor in the list.",
      whyWrong:
        "A wrong answer may give eye gaze or hesitation, but the question asks for the knowledge factor.",
      skill: "Locating explicit information",
      secondarySkills: ["Following reference words"],
      trapType: "Grammar form trap",
      strategyTip:
        "When a question asks for one item in a list, check which item is already named in the question.",
      difficulty: "Hard",
      paragraphRef: "B",
    }),
    q({
      passageId: "p2",
      type: "multiple-choice",
      prompt: "What surprised the researcher in the workshop?",
      options: [
        "Instruction often began before technical terms were spoken.",
        "Customers used more technical vocabulary than mechanics.",
        "The workshop had been designed as a formal language laboratory.",
        "No gestures occurred while the pump was being repaired.",
      ],
      answer: "Instruction often began before technical terms were spoken.",
      explanation:
        "Paragraph A says the researcher expected vocabulary examples but found instruction happened before technical terms appeared.",
      evidenceParagraph: "Paragraph A",
      evidenceText:
        "She found that much of the instruction happened before any technical term was spoken.",
      whyCorrect:
        "The answer captures the unexpected finding.",
      whyWrong:
        "The distractors contradict the setting or invent claims about customers and gesture absence.",
      skill: "Understanding detail",
      secondarySkills: ["Making inference"],
      trapType: "Distractor detail trap",
      strategyTip:
        "When a passage says 'instead', look for the contrast with the researcher's expectation.",
      difficulty: "Hard",
      paragraphRef: "A",
    }),
    q({
      passageId: "p2",
      type: "matching-features",
      groupTitle: "Match each action with the person.",
      prompt: "Drew a rectangle in the air to represent the pump housing",
      options: ["senior mechanic", "trainee", "visiting engineer", "customer"],
      answer: "visiting engineer",
      explanation:
        "Paragraph C says the visiting engineer drew a rectangle in the air to represent the pump housing.",
      evidenceParagraph: "Paragraph C",
      evidenceText:
        "The visiting engineer used gestures differently. He drew a rectangle in the air to represent the pump housing.",
      whyCorrect:
        "The action is explicitly associated with the visiting engineer.",
      whyWrong:
        "The senior mechanic tapped a seal, while the trainee responded to the mechanic's action.",
      skill: "Locating explicit information",
      secondarySkills: ["Understanding detail"],
      trapType: "Similar keyword trap",
      strategyTip:
        "For Matching Features, tie each action to the person introduced in the same sentence or paragraph.",
      difficulty: "Hard",
      paragraphRef: "C",
    }),
    q({
      passageId: "p2",
      type: "true-false-not-given",
      prompt: "The senior mechanic's tap selected one narrow edge from a crowded workbench.",
      options: ["True", "False", "Not Given"],
      answer: "True",
      explanation:
        "Paragraph B says the tap reduced the visual field by selecting one narrow edge.",
      evidenceParagraph: "Paragraph B",
      evidenceText:
        "It reduced the visual field, selecting one narrow edge from a crowded workbench.",
      whyCorrect:
        "The statement closely paraphrases the passage.",
      whyWrong:
        "A wrong answer may treat the tap as only pointing, but the passage gives it a more precise attentional role.",
      skill: "Recognising paraphrase",
      secondarySkills: ["Understanding detail"],
      trapType: "Synonym trap",
      strategyTip:
        "Recognise when a concrete action is explained by a more abstract phrase.",
      difficulty: "Hard",
      paragraphRef: "B",
    }),
    q({
      passageId: "p2",
      type: "note-completion",
      prompt: "The mechanic explained why the seal would leak under ______.",
      answer: "pressure",
      acceptedAnswers: ["pressure"],
      explanation:
        "Paragraph B says the mechanic explained why the seal would leak under pressure.",
      evidenceParagraph: "Paragraph B",
      evidenceText:
        "Only after the trainee's gaze arrived did the mechanic explain why the seal would leak under pressure.",
      whyCorrect:
        "The answer completes the technical condition named in the paragraph.",
      whyWrong:
        "A wrong answer such as gaze names the timing of the explanation, not the condition of leakage.",
      skill: "Locating explicit information",
      secondarySkills: ["Understanding detail"],
      trapType: "Similar keyword trap",
      strategyTip:
        "For note completion, identify whether the gap asks for a condition, cause or object.",
      difficulty: "Hard",
      paragraphRef: "B",
    }),
    q({
      passageId: "p2",
      type: "matching-information",
      groupTitle: "Match the information to the paragraph.",
      prompt: "A correction to an imagined diagram using the real object",
      options: ["A", "B", "C", "D", "E"],
      answer: "C",
      explanation:
        "Paragraph C describes the mechanic interrupting the imagined route and turning the pump casing to show where the diagram failed.",
      evidenceParagraph: "Paragraph C",
      evidenceText:
        "The mechanic interrupted the imagined route and turned the pump casing to show where the diagram failed.",
      whyCorrect:
        "This paragraph contains the contrast between the air-drawn diagram and the physical pump casing.",
      whyWrong:
        "Paragraph B concerns a visible seal, not correction of an imagined diagram.",
      skill: "Time-efficient scanning",
      secondarySkills: ["Understanding detail"],
      trapType: "Wrong paragraph trap",
      strategyTip:
        "Scan for the uncommon phrase in the prompt: imagined diagram.",
      difficulty: "Hard",
      paragraphRef: "C",
    }),
    q({
      passageId: "p2",
      type: "yes-no-not-given",
      prompt: "The writer believes workshop gestures can be understood fully from hand shape alone.",
      options: ["Yes", "No", "Not Given"],
      answer: "No",
      explanation:
        "Paragraph D says meaning came from participation in the work, not from hand shape alone.",
      evidenceParagraph: "Paragraph D",
      evidenceText:
        "Meaning came from participation in the work, not from hand shape alone.",
      whyCorrect:
        "The statement directly contradicts the writer's interpretation.",
      whyWrong:
        "The passage does study visible movement, but it explicitly rejects hand shape as sufficient.",
      skill: "Identifying writer's opinion",
      secondarySkills: ["Distinguishing fact from claim"],
      trapType: "Writer opinion confusion",
      strategyTip:
        "For writer stance, watch for 'not from... alone' because it limits an explanation.",
      difficulty: "Hard",
      paragraphRef: "D",
    }),
    q({
      passageId: "p2",
      type: "flow-chart-completion",
      prompt: "Senior mechanic taps seal -> trainee's gaze arrives -> mechanic explains likely ______.",
      answer: "leak",
      acceptedAnswers: ["leak", "leak under pressure"],
      explanation:
        "Paragraph B gives the sequence from tap to gaze to explanation of why the seal would leak under pressure.",
      evidenceParagraph: "Paragraph B",
      evidenceText:
        "Only after the trainee's gaze arrived did the mechanic explain why the seal would leak under pressure.",
      whyCorrect:
        "The answer completes the final explanatory step in the sequence.",
      whyWrong:
        "A wrong answer such as tap repeats the first step rather than the outcome being explained.",
      skill: "Recognising cause and effect",
      secondarySkills: ["Following reference words"],
      trapType: "Chronology trap",
      strategyTip:
        "Follow event order carefully when a process depends on gaze or attention.",
      difficulty: "Hard",
      paragraphRef: "B",
    }),
    q({
      passageId: "p2",
      type: "summary-completion",
      prompt:
        "Workshop meaning came from participation in the work, not from ______ alone.",
      answer: "hand shape",
      acceptedAnswers: ["hand shape"],
      explanation:
        "Paragraph D states that meaning came from participation, not from hand shape alone.",
      evidenceParagraph: "Paragraph D",
      evidenceText:
        "Meaning came from participation in the work, not from hand shape alone.",
      whyCorrect:
        "The answer completes the contrast between social participation and visible movement.",
      whyWrong:
        "A wrong answer such as vocabulary would shift the argument away from gesture interpretation.",
      skill: "Recognising contrast",
      secondarySkills: ["Understanding main idea"],
      trapType: "Opposite meaning trap",
      strategyTip:
        "When a summary uses 'not from', copy the rejected source, not the supported source.",
      difficulty: "Hard",
      paragraphRef: "D",
    }),
    q({
      passageId: "p2",
      type: "diagram-label-completion",
      groupTitle: "Text schematic: Gesture meaning in the workshop",
      prompt: "Hand movement + object + gaze timing + [label 18]",
      answer: "shared memory",
      acceptedAnswers: ["shared memory", "shared memory of what has just gone wrong"],
      explanation:
        "Paragraph E lists the factors that shape gesture's instructional role, including shared memory of what has just gone wrong.",
      evidenceParagraph: "Paragraph E",
      evidenceText:
        "The hand matters, but so do the object, the timing of gaze and the shared memory of what has just gone wrong.",
      whyCorrect:
        "The label completes the schematic list of factors beyond hand movement.",
      whyWrong:
        "A wrong answer such as hand matters repeats a factor already shown in the schematic.",
      skill: "Following reference words",
      secondarySkills: ["Making inference"],
      trapType: "Partial match trap",
      strategyTip:
        "For text schematics, map each listed component to the passage's full list.",
      difficulty: "Hard",
      paragraphRef: "E",
    }),
    q({
      passageId: "p2",
      type: "multiple-choice",
      prompt: "What warning does the workshop study offer language researchers?",
      options: [
        "Studying gesture only as movement can underestimate its instructional role.",
        "Technical vocabulary should be excluded from studies of repair work.",
        "Customer interruptions make workshop research impossible to interpret.",
        "Gestures are universal when they are connected to visible objects.",
      ],
      answer:
        "Studying gesture only as movement can underestimate its instructional role.",
      explanation:
        "Paragraph E warns that if gesture is studied only as visible movement, its instructional role is likely to be underestimated.",
      evidenceParagraph: "Paragraph E",
      evidenceText:
        "If gesture is studied only as a visible movement, its instructional role is likely to be underestimated.",
      whyCorrect:
        "The answer states the methodological warning in the final paragraph.",
      whyWrong:
        "The distractors either invent exclusions, overstate interruptions or contradict the passage's rejection of universality.",
      skill: "Understanding main idea",
      secondarySkills: ["Identifying paragraph function"],
      trapType: "Overgeneralisation trap",
      strategyTip:
        "Final-paragraph warnings often summarize the methodological lesson of the passage.",
      difficulty: "Hard",
      paragraphRef: "E",
    }),
  ],
});

const memoryReconstructionTest = makeTest({
  testId: "academic-reading-010",
  slug: "memory-reconstruction-and-evidence",
  legacyIds: ["realism-band9-03"],
  title: "The Memory Trace That Would Not Stay Put",
  description:
    "A Band 8-9 IELTS Academic Reading mini test on memory reconstruction, reconsolidation and courtroom interpretation.",
  topic: "Neuroscience",
  difficulty: "Band 8-9 Challenge",
  targetBand: "Band 8.0-9.0",
  timeLimitMinutes: 30,
  subtopic: "Memory reconstruction and evidence",
  passages: [
    {
      passageId: "p1",
      title: "After the Trace Is Opened",
      topic: "Neuroscience",
      sourceNote: "Original IELTS-style practice passage created for this app.",
      paragraphs: [
        {
          label: "A",
          text:
            "For much of the twentieth century, memory was often described as if an experience left a stable trace that later recall merely retrieved. The image was convenient, especially for laboratory tasks in which participants learned lists of syllables. Yet autobiographical memory never sat comfortably inside that picture. A remembered event returns with fragments of setting, emotion, inference and later knowledge already mixed together.",
        },
        {
          label: "B",
          text:
            "Research on reconsolidation made the old storage metaphor even harder to defend. In several experiments, a memory that had been reactivated became temporarily more open to alteration before it settled again. The point was not that every recollection becomes fiction. Rather, recall can be a moment of renewed construction, especially when new information is introduced while the memory is active.",
        },
        {
          label: "C",
          text:
            "One influential study asked volunteers to learn a set of object locations, then reminded them of the learning context before presenting a second, overlapping set. Some volunteers later blended locations from the two sets, but the effect appeared mainly when the reminder was close enough to reopen the first memory without making the two tasks look obviously separate.",
        },
        {
          label: "D",
          text:
            "The finding created a methodological discomfort. If reactivation can change later recall, then the very tests used to measure memory may also modify it. Researchers therefore began spacing recall tests more carefully and recording the prompts that preceded them. What looked like a neutral measurement had become part of the phenomenon being measured.",
        },
        {
          label: "E",
          text:
            "A cautious interpretation is now common. Memories are neither fixed recordings nor inventions produced afresh each time. They are durable enough to guide action, but flexible enough to absorb context. The difficulty for science is to specify the conditions under which flexibility becomes distortion rather than useful updating.",
        },
      ],
    },
    {
      passageId: "p2",
      title: "Remembering Under Question",
      topic: "Psychology",
      sourceNote: "Original IELTS-style practice passage created for this app.",
      paragraphs: [
        {
          label: "A",
          text:
            "Courtroom discussions of memory often borrow scientific language without carrying over its qualifications. A witness may be described as confident, consistent or contaminated, as if those labels map neatly onto truth and error. The psychology of remembering is less cooperative. Confidence can rise after repeated questioning, and consistency may reflect rehearsal as much as accuracy.",
        },
        {
          label: "B",
          text:
            "Some legal training now asks investigators to separate open prompts from confirmatory ones. An open prompt invites a witness to describe what happened in their own sequence. A confirmatory prompt suggests a detail and asks whether it belongs. The difference is subtle in conversation, but it matters because suggested details can become attached to a memory without feeling externally supplied.",
        },
        {
          label: "C",
          text:
            "The problem is not solved by banning all follow-up questions. Witnesses often need help returning to a time, place or sensory context. The danger lies in questions that import content: a colour, an object, a direction of movement. Once imported, the detail may later be recalled with the same subjective vividness as information actually perceived.",
        },
        {
          label: "D",
          text:
            "Expert witnesses therefore face a narrow task. They should not tell juries whether a particular witness is truthful. Instead, they can explain the conditions under which memory is likely to be strengthened, distorted or made overconfident. Their value is in clarifying risk, not replacing judgement.",
        },
        {
          label: "E",
          text:
            "This position frustrates both prosecutors and defence lawyers because it rarely gives either side a clean answer. It does, however, match the science more closely than the older contrast between faithful memory and false memory. The most difficult cases are usually those in which memory contains both genuine perception and later reconstruction.",
        },
      ],
    },
  ],
  questions: [
    q({
      passageId: "p1",
      type: "yes-no-not-given",
      prompt: "The writer suggests that the stable-trace model was easier to apply to laboratory tasks than to autobiographical memory.",
      options: ["Yes", "No", "Not Given"],
      answer: "Yes",
      explanation:
        "Paragraph A says the stable-trace image was convenient for laboratory syllable tasks, but autobiographical memory did not fit it comfortably.",
      evidenceParagraph: "Paragraph A",
      evidenceText:
        "The image was convenient, especially for laboratory tasks... Yet autobiographical memory never sat comfortably inside that picture.",
      whyCorrect:
        "The statement preserves the contrast between controlled laboratory tasks and richer personal memory.",
      whyWrong:
        "A wrong answer may ignore the concessive movement from convenient to uncomfortable.",
      skill: "Identifying writer's opinion",
      secondarySkills: ["Recognising contrast"],
      trapType: "Writer opinion confusion",
      strategyTip:
        "In advanced passages, writer stance often appears through contrast markers such as yet and rather.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "A",
    }),
    q({
      passageId: "p1",
      type: "multiple-choice",
      prompt: "What did reconsolidation research mainly challenge?",
      options: [
        "The idea that recall is only retrieval from an unchanged store",
        "The possibility that any memory can guide future behaviour",
        "The value of studying memory with experimental reminders",
        "The claim that new information can affect active memories",
      ],
      answer: "The idea that recall is only retrieval from an unchanged store",
      explanation:
        "Paragraph B says reactivated memories can become open to alteration, making the storage metaphor harder to defend.",
      evidenceParagraph: "Paragraph B",
      evidenceText:
        "A memory that had been reactivated became temporarily more open to alteration before it settled again.",
      whyCorrect:
        "The answer captures the conceptual shift from passive retrieval to renewed construction.",
      whyWrong:
        "The distractors either deny the passage's balanced view or reverse the very claim reconsolidation supports.",
      skill: "Making inference",
      secondarySkills: ["Recognising paraphrase"],
      trapType: "Opposite meaning trap",
      strategyTip:
        "For conceptual MCQs, identify which older assumption the evidence weakens.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "B",
    }),
    q({
      passageId: "p1",
      type: "matching-headings",
      groupTitle: "Choose the best heading for Paragraph C.",
      prompt: "Paragraph C",
      options: [
        "An experiment showing when overlap can reshape recall",
        "A legal test for judging witness confidence",
        "A theory that all remembered locations are fictional",
        "A method for removing reminders from memory research",
      ],
      answer: "An experiment showing when overlap can reshape recall",
      explanation:
        "Paragraph C describes an object-location experiment where a reminder and overlapping second set led some volunteers to blend locations.",
      evidenceParagraph: "Paragraph C",
      evidenceText:
        "Some volunteers later blended locations from the two sets, but the effect appeared mainly when the reminder was close enough to reopen the first memory.",
      whyCorrect:
        "The heading captures the paragraph's experimental function and the condition on the effect.",
      whyWrong:
        "The wrong headings either belong to Passage 2 or exaggerate the finding into universal fiction.",
      skill: "Understanding main idea",
      secondarySkills: ["Identifying paragraph function"],
      trapType: "Partial match trap",
      strategyTip:
        "Matching Headings answers should match the whole paragraph's purpose, not just one familiar term.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "C",
    }),
    q({
      passageId: "p1",
      type: "sentence-completion",
      prompt: "The memory effect appeared mainly when the reminder could reopen the first memory without making the two tasks look ______.",
      answer: "obviously separate",
      acceptedAnswers: ["obviously separate", "separate"],
      explanation:
        "Paragraph C says the effect appeared when the reminder reopened the first memory without making the tasks look obviously separate.",
      evidenceParagraph: "Paragraph C",
      evidenceText:
        "Without making the two tasks look obviously separate.",
      whyCorrect:
        "The phrase completes the methodological condition.",
      whyWrong:
        "A wrong answer such as active names the memory state, not the contrast between tasks.",
      skill: "Understanding detail",
      secondarySkills: ["Recognising contrast"],
      trapType: "Grammar form trap",
      strategyTip:
        "In sentence completion, preserve the grammatical role of the phrase after look.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "C",
    }),
    q({
      passageId: "p1",
      type: "true-false-not-given",
      prompt: "The passage claims that every act of recall turns a memory into fiction.",
      options: ["True", "False", "Not Given"],
      answer: "False",
      explanation:
        "Paragraph B explicitly says the point is not that every recollection becomes fiction.",
      evidenceParagraph: "Paragraph B",
      evidenceText:
        "The point was not that every recollection becomes fiction.",
      whyCorrect:
        "The statement turns a limited claim about flexibility into an extreme claim.",
      whyWrong:
        "The phrase open to alteration may tempt overgeneralisation, but the passage rejects the extreme version.",
      skill: "Avoiding overgeneralisation",
      secondarySkills: ["Understanding detail"],
      trapType: "Extreme wording trap",
      strategyTip:
        "Extreme words such as every usually need exact support.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "B",
    }),
    q({
      passageId: "p1",
      type: "matching-information",
      groupTitle: "Match the information to the paragraph.",
      prompt: "A warning that a measurement can become part of what it measures",
      options: ["A", "B", "C", "D", "E"],
      answer: "D",
      explanation:
        "Paragraph D says recall tests used to measure memory may also modify it.",
      evidenceParagraph: "Paragraph D",
      evidenceText:
        "The very tests used to measure memory may also modify it.",
      whyCorrect:
        "The paragraph identifies the methodological discomfort caused by reactivation.",
      whyWrong:
        "Paragraph B introduces alteration, but Paragraph D names the measurement problem.",
      skill: "Time-efficient scanning",
      secondarySkills: ["Recognising paraphrase"],
      trapType: "Wrong paragraph trap",
      strategyTip:
        "For Matching Information, confirm the exact information item, not only the general topic.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "D",
    }),
    q({
      passageId: "p1",
      type: "summary-completion",
      prompt:
        "A cautious view treats memories as durable enough to guide action but flexible enough to absorb ______.",
      answer: "context",
      acceptedAnswers: ["context"],
      explanation:
        "Paragraph E says memories are flexible enough to absorb context.",
      evidenceParagraph: "Paragraph E",
      evidenceText:
        "They are durable enough to guide action, but flexible enough to absorb context.",
      whyCorrect:
        "The answer preserves the balanced durability-flexibility contrast.",
      whyWrong:
        "A wrong answer such as distortion names a possible outcome, not what memories absorb.",
      skill: "Recognising paraphrase",
      secondarySkills: ["Understanding main idea"],
      trapType: "Partial match trap",
      strategyTip:
        "When a summary compresses a balanced sentence, keep both sides of the balance intact.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "E",
    }),
    q({
      passageId: "p1",
      type: "flow-chart-completion",
      prompt: "Memory reactivated -> new information introduced -> later recall may show ______.",
      answer: "alteration",
      acceptedAnswers: ["alteration", "renewed construction", "distortion"],
      explanation:
        "Paragraph B says reactivated memory can become open to alteration when new information is introduced while it is active.",
      evidenceParagraph: "Paragraph B",
      evidenceText:
        "Recall can be a moment of renewed construction, especially when new information is introduced while the memory is active.",
      whyCorrect:
        "The answer completes the process by naming the possible change in later recall.",
      whyWrong:
        "A wrong answer such as stable trace would reverse the process described.",
      skill: "Recognising cause and effect",
      secondarySkills: ["Making inference"],
      trapType: "Cause-effect confusion",
      strategyTip:
        "For flow charts, follow the mechanism from activation to possible consequence.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "B",
    }),
    q({
      passageId: "p1",
      type: "matching-sentence-endings",
      groupTitle: "Choose the correct ending.",
      prompt: "Researchers began recording prompts before recall tests because",
      options: [
        "prompts could influence the memory being measured.",
        "participants could no longer learn object locations.",
        "autobiographical memory had become irrelevant to the field.",
        "all laboratory memories were assumed to be invented.",
      ],
      answer: "prompts could influence the memory being measured.",
      explanation:
        "Paragraph D says researchers recorded prompts because recall tests may modify memory.",
      evidenceParagraph: "Paragraph D",
      evidenceText:
        "Researchers therefore began spacing recall tests more carefully and recording the prompts that preceded them.",
      whyCorrect:
        "The ending connects the methodological response to the concern that testing can alter memory.",
      whyWrong:
        "The other endings overstate or invent consequences not found in the passage.",
      skill: "Recognising cause and effect",
      secondarySkills: ["Understanding detail"],
      trapType: "Assumption trap",
      strategyTip:
        "When a sentence uses therefore, read the previous sentence to find the reason.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "D",
    }),
    q({
      passageId: "p1",
      type: "short-answer",
      prompt: "What older metaphor became harder to defend after reconsolidation research?",
      answer: "storage metaphor",
      acceptedAnswers: ["storage metaphor", "the storage metaphor"],
      explanation:
        "Paragraph B states that reconsolidation made the old storage metaphor harder to defend.",
      evidenceParagraph: "Paragraph B",
      evidenceText:
        "Research on reconsolidation made the old storage metaphor even harder to defend.",
      whyCorrect:
        "The answer names the metaphor directly challenged by the research.",
      whyWrong:
        "Stable trace is related, but the paragraph specifically names the storage metaphor.",
      skill: "Locating explicit information",
      secondarySkills: ["Understanding vocabulary in context"],
      trapType: "Similar keyword trap",
      strategyTip:
        "Copy the named concept when a short-answer question asks which metaphor or model.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "B",
    }),
    q({
      passageId: "p2",
      type: "multiple-choice",
      prompt: "What problem does the writer identify with labels such as confident and consistent?",
      options: [
        "They can be treated as if they map neatly onto truth and error.",
        "They are never used in courtroom discussions of memory.",
        "They prove that repeated questioning improves accuracy.",
        "They prevent witnesses from rehearsing their accounts.",
      ],
      answer:
        "They can be treated as if they map neatly onto truth and error.",
      explanation:
        "Paragraph A warns that courtroom labels may be treated as if they correspond neatly to truth and error.",
      evidenceParagraph: "Paragraph A",
      evidenceText:
        "A witness may be described as confident, consistent or contaminated, as if those labels map neatly onto truth and error.",
      whyCorrect:
        "The answer captures the writer's concern about oversimplified interpretation.",
      whyWrong:
        "The distractors either contradict the paragraph or convert possible rehearsal into improved accuracy.",
      skill: "Identifying writer's opinion",
      secondarySkills: ["Distinguishing fact from claim"],
      trapType: "Writer opinion confusion",
      strategyTip:
        "Treat phrases like 'as if' as signals that the writer is questioning an assumption.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "A",
    }),
    q({
      passageId: "p2",
      type: "matching-features",
      groupTitle: "Match the prompt type with its description.",
      prompt: "Suggests a detail and asks whether it belongs",
      options: ["open prompt", "confirmatory prompt", "expert testimony", "rehearsal"],
      answer: "confirmatory prompt",
      explanation:
        "Paragraph B defines a confirmatory prompt as one that suggests a detail and asks whether it belongs.",
      evidenceParagraph: "Paragraph B",
      evidenceText:
        "A confirmatory prompt suggests a detail and asks whether it belongs.",
      whyCorrect:
        "The feature is explicitly attached to confirmatory prompts.",
      whyWrong:
        "An open prompt lets the witness describe events in their own sequence, which is the opposite interactional shape.",
      skill: "Locating explicit information",
      secondarySkills: ["Understanding detail"],
      trapType: "Opposite meaning trap",
      strategyTip:
        "For Matching Features, tie each definition to the exact named category.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "B",
    }),
    q({
      passageId: "p2",
      type: "true-false-not-given",
      prompt: "The passage argues that all follow-up questions should be banned.",
      options: ["True", "False", "Not Given"],
      answer: "False",
      explanation:
        "Paragraph C says the problem is not solved by banning all follow-up questions.",
      evidenceParagraph: "Paragraph C",
      evidenceText:
        "The problem is not solved by banning all follow-up questions.",
      whyCorrect:
        "The statement contradicts the passage's explicit rejection of a total ban.",
      whyWrong:
        "The passage criticises content-importing questions, but that is not the same as banning all follow-up.",
      skill: "Avoiding overgeneralisation",
      secondarySkills: ["Understanding detail"],
      trapType: "Extreme wording trap",
      strategyTip:
        "Do not turn a targeted caution into an absolute rule.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "C",
    }),
    q({
      passageId: "p2",
      type: "note-completion",
      prompt: "Dangerous imported content can include a colour, an object or a direction of ______.",
      answer: "movement",
      acceptedAnswers: ["movement"],
      explanation:
        "Paragraph C lists colour, object and direction of movement as imported content.",
      evidenceParagraph: "Paragraph C",
      evidenceText:
        "Questions that import content: a colour, an object, a direction of movement.",
      whyCorrect:
        "The answer completes the final item in the list.",
      whyWrong:
        "A wrong answer such as context names what witnesses may need help returning to, not an imported detail.",
      skill: "Understanding detail",
      secondarySkills: ["Locating explicit information"],
      trapType: "Grammar form trap",
      strategyTip:
        "Use list structure to identify the exact noun after a preposition.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "C",
    }),
    q({
      passageId: "p2",
      type: "matching-information",
      groupTitle: "Match the information to the paragraph.",
      prompt: "A limit on what expert witnesses should tell juries",
      options: ["A", "B", "C", "D", "E"],
      answer: "D",
      explanation:
        "Paragraph D says expert witnesses should not tell juries whether a particular witness is truthful.",
      evidenceParagraph: "Paragraph D",
      evidenceText:
        "They should not tell juries whether a particular witness is truthful.",
      whyCorrect:
        "The paragraph defines the expert's narrow role.",
      whyWrong:
        "Other paragraphs discuss prompts and imported details, not the role of expert witnesses.",
      skill: "Time-efficient scanning",
      secondarySkills: ["Understanding detail"],
      trapType: "Wrong paragraph trap",
      strategyTip:
        "Scan for the actor named in the question, here expert witnesses.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "D",
    }),
    q({
      passageId: "p2",
      type: "yes-no-not-given",
      prompt: "The writer thinks expert witnesses are most useful when they replace jury judgement.",
      options: ["Yes", "No", "Not Given"],
      answer: "No",
      explanation:
        "Paragraph D says experts clarify risk, not replace judgement.",
      evidenceParagraph: "Paragraph D",
      evidenceText:
        "Their value is in clarifying risk, not replacing judgement.",
      whyCorrect:
        "The statement reverses the writer's view of expert value.",
      whyWrong:
        "A reader may see that experts are useful and overextend that usefulness into decision replacement.",
      skill: "Identifying writer's opinion",
      secondarySkills: ["Recognising contrast"],
      trapType: "Writer opinion confusion",
      strategyTip:
        "When the writer uses 'not', keep the rejected role separate from the approved role.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "D",
    }),
    q({
      passageId: "p2",
      type: "diagram-label-completion",
      groupTitle: "Text schematic: Prompt risk pathway",
      prompt: "Confirmatory prompt -> suggested detail -> later recall with subjective ______",
      answer: "vividness",
      acceptedAnswers: ["vividness", "subjective vividness"],
      explanation:
        "Paragraph C says imported details may later be recalled with the same subjective vividness as perceived information.",
      evidenceParagraph: "Paragraph C",
      evidenceText:
        "The detail may later be recalled with the same subjective vividness as information actually perceived.",
      whyCorrect:
        "The label completes the risk pathway from suggestion to later recall.",
      whyWrong:
        "A wrong answer such as confidence is related to Paragraph A but not the final word in this pathway.",
      skill: "Making inference",
      secondarySkills: ["Following reference words"],
      trapType: "Similar keyword trap",
      strategyTip:
        "For schematic labels, follow the chain of process words rather than choosing a general topic word.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "C",
    }),
    q({
      passageId: "p2",
      type: "summary-completion",
      prompt:
        "The science fits a view in which difficult cases contain genuine perception and later ______.",
      answer: "reconstruction",
      acceptedAnswers: ["reconstruction", "later reconstruction"],
      explanation:
        "Paragraph E says the most difficult cases contain both genuine perception and later reconstruction.",
      evidenceParagraph: "Paragraph E",
      evidenceText:
        "The most difficult cases are usually those in which memory contains both genuine perception and later reconstruction.",
      whyCorrect:
        "The answer completes the passage's final balanced account of memory.",
      whyWrong:
        "A wrong answer such as false memory would restore the older binary the writer rejects.",
      skill: "Recognising paraphrase",
      secondarySkills: ["Understanding main idea"],
      trapType: "Partial match trap",
      strategyTip:
        "Look for paired concepts when a summary says both X and Y.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "E",
    }),
    q({
      passageId: "p2",
      type: "short-answer",
      prompt: "What can repeated questioning increase, according to Paragraph A?",
      answer: "confidence",
      acceptedAnswers: ["confidence"],
      explanation:
        "Paragraph A says confidence can rise after repeated questioning.",
      evidenceParagraph: "Paragraph A",
      evidenceText:
        "Confidence can rise after repeated questioning.",
      whyCorrect:
        "The answer names the psychological state that may increase.",
      whyWrong:
        "Consistency is also discussed, but the sentence links repeated questioning to confidence.",
      skill: "Locating explicit information",
      secondarySkills: ["Understanding detail"],
      trapType: "Similar keyword trap",
      strategyTip:
        "When two labels appear together, check which one is attached to the action in the question.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "A",
    }),
    q({
      passageId: "p2",
      type: "multiple-choice",
      prompt: "What is the central claim of Passage 2?",
      options: [
        "Memory evidence should be interpreted through risk conditions rather than simple truth labels.",
        "Witness confidence is always a reliable indicator of accurate perception.",
        "Scientific experts should decide whether each witness is truthful.",
        "Legal systems should reject all witness memory as later reconstruction.",
      ],
      answer:
        "Memory evidence should be interpreted through risk conditions rather than simple truth labels.",
      explanation:
        "The passage argues that courtroom memory should be explained through conditions that strengthen, distort or overinflate memory, not through neat labels.",
      evidenceParagraph: "Passage-wide evidence",
      evidenceText:
        "Their value is in clarifying risk, not replacing judgement... The most difficult cases are usually those in which memory contains both genuine perception and later reconstruction.",
      whyCorrect:
        "The answer captures the nuanced passage-wide argument.",
      whyWrong:
        "The distractors choose one extreme: confidence as truth, expert replacement or total rejection of memory.",
      skill: "Understanding main idea",
      secondarySkills: ["Making inference"],
      trapType: "Overgeneralisation trap",
      strategyTip:
        "For Band 8-9 central claims, choose the option that preserves nuance rather than the cleanest extreme.",
      difficulty: "Band 8-9 Challenge",
    }),
  ],
});

const modelUncertaintyTest = makeTest({
  testId: "academic-reading-011",
  slug: "model-uncertainty-and-public-decisions",
  legacyIds: ["realism-band9-04"],
  title: "When Models Become Public Instruments",
  description:
    "A Band 8-9 IELTS Academic Reading mini test on model uncertainty, public decisions and philosophy of science.",
  topic: "History of Science",
  difficulty: "Band 8-9 Challenge",
  targetBand: "Band 8.0-9.0",
  timeLimitMinutes: 30,
  subtopic: "Model uncertainty and public reasoning",
  passages: [
    {
      passageId: "p1",
      title: "A Forecast Is Not a Photograph",
      topic: "History of Science",
      sourceNote: "Original IELTS-style practice passage created for this app.",
      paragraphs: [
        {
          label: "A",
          text:
            "When a scientific model enters public debate, it often loses the modesty with which it was built. A projection that began as one conditional exploration may be quoted as if it were a photograph of the future. The error is not simply made by journalists; technical teams sometimes encourage it by presenting a single polished curve after many less tidy runs have been discarded.",
        },
        {
          label: "B",
          text:
            "Philosophers of science distinguish uncertainty inside a model from uncertainty about the model's framing. The first may be expressed as a range around a line. The second is harder to display, because it concerns which variables were excluded, which social behaviour was assumed and which boundary of the system was treated as fixed.",
        },
        {
          label: "C",
          text:
            "In flood planning, for example, a model may estimate river height under different rainfall scenarios while holding land-use patterns constant. That choice is defensible if the question is about emergency barriers next winter. It is less defensible if the same model is used to justify thirty years of housing policy on the floodplain.",
        },
        {
          label: "D",
          text:
            "Some agencies now publish model ensembles rather than one preferred run. Ensembles can reveal how assumptions move the answer, but they can also give a false sense of completeness. A dozen curves may still share the same blind spot if they were generated from the same institutional imagination.",
        },
        {
          label: "E",
          text:
            "A mature public use of models therefore requires two kinds of literacy. Citizens need to understand uncertainty bands, but officials also need to explain why the model was framed in one way rather than another. The second task is less graphic and more political, which is why it is often avoided.",
        },
      ],
    },
    {
      passageId: "p2",
      title: "The Budget Office and the Hidden Assumption",
      topic: "Behavioural Economics",
      sourceNote: "Original IELTS-style practice passage created for this app.",
      paragraphs: [
        {
          label: "A",
          text:
            "A national budget office once released a model of household energy subsidies that appeared reassuringly precise. The headline figure predicted a small fall in winter fuel poverty. Buried in the appendix was an assumption that landlords would pass most efficiency savings to tenants rather than retaining them through higher rents.",
        },
        {
          label: "B",
          text:
            "Economists inside the office knew the assumption was uncertain. They had used it because national rent data were too slow to capture recent regional pressure. In internal notes, they called it a placeholder, not a finding. In the public summary, however, the assumption became almost invisible.",
        },
        {
          label: "C",
          text:
            "Critics accused the office of manipulating the result. That accusation missed the more interesting failure. The numbers had not been invented, and the sensitivity tests were competently run. What failed was the communication of dependency: readers were not shown which conclusion would weaken if the landlord assumption changed.",
        },
        {
          label: "D",
          text:
            "A later version of the report used a dependency table. Instead of listing every technical parameter, the table named five assumptions that mattered most to the policy conclusion. Next to each, it showed the direction in which the headline estimate would move if the assumption proved too optimistic.",
        },
        {
          label: "E",
          text:
            "The table did not remove disagreement, but it changed its location. Debate shifted from whether the model was trustworthy in general to whether particular assumptions deserved confidence. That shift is small but important: it turns model criticism from suspicion into an argument about evidence.",
        },
      ],
    },
  ],
  questions: [
    q({
      passageId: "p1",
      type: "matching-headings",
      groupTitle: "Choose the best heading for Paragraph B.",
      prompt: "Paragraph B",
      options: [
        "Two forms of uncertainty with different visibility",
        "A defence of polished curves in public summaries",
        "A method for photographing future events",
        "A rejection of social behaviour in scientific models",
      ],
      answer: "Two forms of uncertainty with different visibility",
      explanation:
        "Paragraph B contrasts uncertainty inside a model with uncertainty about model framing, noting that the second is harder to display.",
      evidenceParagraph: "Paragraph B",
      evidenceText:
        "The first may be expressed as a range around a line. The second is harder to display.",
      whyCorrect:
        "The heading captures the paragraph's contrast between visible and less visible uncertainty.",
      whyWrong:
        "The distractors focus on details or distort the paragraph's philosophical distinction.",
      skill: "Understanding main idea",
      secondarySkills: ["Identifying paragraph function"],
      trapType: "Partial match trap",
      strategyTip:
        "In Matching Headings, prefer a heading that captures the contrast governing the whole paragraph.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "B",
    }),
    q({
      passageId: "p1",
      type: "multiple-choice",
      prompt: "Why can a single polished curve be misleading in public debate?",
      options: [
        "It can hide the discarded, less tidy model runs behind it.",
        "It always proves that journalists have changed the data.",
        "It prevents technical teams from using conditional exploration.",
        "It displays framing uncertainty more clearly than ensembles.",
      ],
      answer: "It can hide the discarded, less tidy model runs behind it.",
      explanation:
        "Paragraph A says teams may present a polished curve after many less tidy runs have been discarded.",
      evidenceParagraph: "Paragraph A",
      evidenceText:
        "Presenting a single polished curve after many less tidy runs have been discarded.",
      whyCorrect:
        "The option identifies the representational narrowing that makes the curve look more certain.",
      whyWrong:
        "The wrong options either overblame journalists or reverse the passage's argument about uncertainty.",
      skill: "Making inference",
      secondarySkills: ["Recognising paraphrase"],
      trapType: "Overgeneralisation trap",
      strategyTip:
        "Ask what has been hidden or simplified when a visual appears unusually clean.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "A",
    }),
    q({
      passageId: "p1",
      type: "yes-no-not-given",
      prompt: "The writer thinks an emergency-barrier model can become less defensible when used for long-term housing policy.",
      options: ["Yes", "No", "Not Given"],
      answer: "Yes",
      explanation:
        "Paragraph C says holding land use constant is defensible for next-winter barriers but less defensible for thirty years of floodplain housing policy.",
      evidenceParagraph: "Paragraph C",
      evidenceText:
        "That choice is defensible if the question is about emergency barriers next winter. It is less defensible if the same model is used to justify thirty years of housing policy.",
      whyCorrect:
        "The statement preserves the writer's conditional evaluation.",
      whyWrong:
        "A wrong answer may treat the model as either valid or invalid in all contexts.",
      skill: "Identifying writer's opinion",
      secondarySkills: ["Understanding comparison"],
      trapType: "Comparison confusion",
      strategyTip:
        "Track whether the writer's judgement changes with the intended use of the model.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "C",
    }),
    q({
      passageId: "p1",
      type: "sentence-completion",
      prompt: "Framing uncertainty includes decisions about excluded variables, assumed social behaviour and fixed system ______.",
      answer: "boundary",
      acceptedAnswers: ["boundary", "boundaries"],
      explanation:
        "Paragraph B says framing uncertainty concerns which boundary of the system was treated as fixed.",
      evidenceParagraph: "Paragraph B",
      evidenceText:
        "Which boundary of the system was treated as fixed.",
      whyCorrect:
        "The answer completes the third element of the framing-uncertainty list.",
      whyWrong:
        "A wrong answer such as range belongs to uncertainty inside a model, not framing uncertainty.",
      skill: "Understanding detail",
      secondarySkills: ["Following reference words"],
      trapType: "Similar keyword trap",
      strategyTip:
        "Use list structure to avoid mixing the two categories of uncertainty.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "B",
    }),
    q({
      passageId: "p1",
      type: "matching-information",
      groupTitle: "Match the information to the paragraph.",
      prompt: "A warning that several model runs may still share one blind spot",
      options: ["A", "B", "C", "D", "E"],
      answer: "D",
      explanation:
        "Paragraph D says a dozen curves may share the same blind spot if they come from the same institutional imagination.",
      evidenceParagraph: "Paragraph D",
      evidenceText:
        "A dozen curves may still share the same blind spot if they were generated from the same institutional imagination.",
      whyCorrect:
        "This paragraph discusses ensembles and their limits.",
      whyWrong:
        "Paragraph A discusses one curve; Paragraph D is the one about multiple curves sharing assumptions.",
      skill: "Time-efficient scanning",
      secondarySkills: ["Recognising paraphrase"],
      trapType: "Wrong paragraph trap",
      strategyTip:
        "For Matching Information, scan for the distinctive idea, here several outputs with a common blind spot.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "D",
    }),
    q({
      passageId: "p1",
      type: "true-false-not-given",
      prompt: "The passage says ensembles always remove the risk of incomplete modelling.",
      options: ["True", "False", "Not Given"],
      answer: "False",
      explanation:
        "Paragraph D says ensembles can reveal assumption effects but can also give a false sense of completeness.",
      evidenceParagraph: "Paragraph D",
      evidenceText:
        "Ensembles can reveal how assumptions move the answer, but they can also give a false sense of completeness.",
      whyCorrect:
        "The statement exaggerates the value of ensembles beyond the passage's qualified claim.",
      whyWrong:
        "The positive phrase can reveal may tempt a True answer, but the sentence immediately limits it.",
      skill: "Avoiding overgeneralisation",
      secondarySkills: ["Recognising contrast"],
      trapType: "Extreme wording trap",
      strategyTip:
        "Words like always usually fail when the passage contains a but-clause.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "D",
    }),
    q({
      passageId: "p1",
      type: "summary-completion",
      prompt:
        "A mature public use of models requires literacy about uncertainty bands and explanation of model ______.",
      answer: "framing",
      acceptedAnswers: ["framing", "model framing"],
      explanation:
        "Paragraph E says officials need to explain why the model was framed in one way rather than another.",
      evidenceParagraph: "Paragraph E",
      evidenceText:
        "Officials also need to explain why the model was framed in one way rather than another.",
      whyCorrect:
        "The answer names the second, less graphic task of public model literacy.",
      whyWrong:
        "Uncertainty bands are the first kind of literacy, not the missing second one.",
      skill: "Understanding main idea",
      secondarySkills: ["Recognising paraphrase"],
      trapType: "Partial match trap",
      strategyTip:
        "When a summary says and, check that the missing item is the second part of the pair.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "E",
    }),
    q({
      passageId: "p1",
      type: "flow-chart-completion",
      prompt: "Model built conditionally -> single curve publicised -> projection treated as a ______ of the future.",
      answer: "photograph",
      acceptedAnswers: ["photograph", "photograph of the future"],
      explanation:
        "Paragraph A says a projection may be quoted as if it were a photograph of the future.",
      evidenceParagraph: "Paragraph A",
      evidenceText:
        "A projection that began as one conditional exploration may be quoted as if it were a photograph of the future.",
      whyCorrect:
        "The answer completes the process by naming the misleading public interpretation.",
      whyWrong:
        "A wrong answer such as model repeats the starting point, not the distorted public reading.",
      skill: "Recognising cause and effect",
      secondarySkills: ["Understanding vocabulary in context"],
      trapType: "Partial match trap",
      strategyTip:
        "When a metaphor appears in a title and paragraph, ask what comparison it is criticising.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "A",
    }),
    q({
      passageId: "p1",
      type: "short-answer",
      prompt: "What task is described as less graphic and more political?",
      answer: "explaining model framing",
      acceptedAnswers: ["explaining model framing", "explain why the model was framed", "explaining why the model was framed"],
      explanation:
        "Paragraph E says explaining why the model was framed one way rather than another is less graphic and more political.",
      evidenceParagraph: "Paragraph E",
      evidenceText:
        "Officials also need to explain why the model was framed in one way rather than another. The second task is less graphic and more political.",
      whyCorrect:
        "The answer identifies the second task referenced by the sentence.",
      whyWrong:
        "Understanding uncertainty bands is the first task, not the less graphic second task.",
      skill: "Following reference words",
      secondarySkills: ["Understanding main idea"],
      trapType: "Partial match trap",
      strategyTip:
        "Resolve reference phrases such as the second task before answering.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "E",
    }),
    q({
      passageId: "p1",
      type: "matching-sentence-endings",
      groupTitle: "Choose the correct ending.",
      prompt: "Holding land-use patterns constant may be reasonable when the model is used for",
      options: [
        "a short-term question about emergency barriers.",
        "all housing decisions on a floodplain for thirty years.",
        "removing social behaviour from public debate.",
        "making uncertainty bands unnecessary.",
      ],
      answer: "a short-term question about emergency barriers.",
      explanation:
        "Paragraph C says the choice is defensible if the question concerns emergency barriers next winter.",
      evidenceParagraph: "Paragraph C",
      evidenceText:
        "That choice is defensible if the question is about emergency barriers next winter.",
      whyCorrect:
        "The ending preserves the narrow context in which the modelling choice is acceptable.",
      whyWrong:
        "The long-term housing option is the use that the writer calls less defensible.",
      skill: "Understanding comparison",
      secondarySkills: ["Making inference"],
      trapType: "Comparison confusion",
      strategyTip:
        "When a passage compares two uses, attach the judgement to the correct use.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "C",
    }),
    q({
      passageId: "p2",
      type: "multiple-choice",
      prompt: "What was hidden in the budget model's appendix?",
      options: [
        "An assumption about landlords passing savings to tenants",
        "A proof that winter fuel poverty would disappear",
        "A ban on using regional rent data",
        "A table showing no assumptions mattered to the conclusion",
      ],
      answer: "An assumption about landlords passing savings to tenants",
      explanation:
        "Paragraph A says the appendix contained an assumption that landlords would pass most efficiency savings to tenants.",
      evidenceParagraph: "Paragraph A",
      evidenceText:
        "Buried in the appendix was an assumption that landlords would pass most efficiency savings to tenants.",
      whyCorrect:
        "The answer identifies the dependency concealed behind the precise headline.",
      whyWrong:
        "The distractors exaggerate the policy result or invent positions not in the passage.",
      skill: "Locating explicit information",
      secondarySkills: ["Understanding detail"],
      trapType: "Distractor detail trap",
      strategyTip:
        "When a passage says buried, look for the assumption or qualification that was not visible in the headline.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "A",
    }),
    q({
      passageId: "p2",
      type: "yes-no-not-given",
      prompt: "The writer thinks the budget office invented its numbers.",
      options: ["Yes", "No", "Not Given"],
      answer: "No",
      explanation:
        "Paragraph C says the numbers had not been invented and the sensitivity tests were competently run.",
      evidenceParagraph: "Paragraph C",
      evidenceText:
        "The numbers had not been invented, and the sensitivity tests were competently run.",
      whyCorrect:
        "The writer rejects the accusation of manipulation and identifies a different failure.",
      whyWrong:
        "A reader may assume hidden assumptions mean invented results, but the passage distinguishes those issues.",
      skill: "Identifying writer's opinion",
      secondarySkills: ["Distinguishing fact from claim"],
      trapType: "Assumption trap",
      strategyTip:
        "Separate a communication failure from data fabrication unless the passage links them.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "C",
    }),
    q({
      passageId: "p2",
      type: "matching-features",
      groupTitle: "Match each item with its role.",
      prompt: "Described internally as a placeholder, not a finding",
      options: ["landlord assumption", "dependency table", "headline estimate", "sensitivity test"],
      answer: "landlord assumption",
      explanation:
        "Paragraph B says economists called the landlord assumption a placeholder, not a finding.",
      evidenceParagraph: "Paragraph B",
      evidenceText:
        "In internal notes, they called it a placeholder, not a finding.",
      whyCorrect:
        "The role belongs to the assumption about savings being passed to tenants.",
      whyWrong:
        "The dependency table appears later as a communication tool, not the placeholder.",
      skill: "Locating explicit information",
      secondarySkills: ["Following reference words"],
      trapType: "Similar keyword trap",
      strategyTip:
        "Resolve pronouns such as it by reading the preceding sentence.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "B",
    }),
    q({
      passageId: "p2",
      type: "matching-information",
      groupTitle: "Match the information to the paragraph.",
      prompt: "A claim that the real failure was not fabrication but hidden dependency",
      options: ["A", "B", "C", "D", "E"],
      answer: "C",
      explanation:
        "Paragraph C says the accusation of manipulation missed the more interesting failure: communication of dependency.",
      evidenceParagraph: "Paragraph C",
      evidenceText:
        "That accusation missed the more interesting failure... What failed was the communication of dependency.",
      whyCorrect:
        "The paragraph reframes the criticism from manipulation to dependency communication.",
      whyWrong:
        "Paragraph A contains the hidden assumption, but Paragraph C explains the nature of the failure.",
      skill: "Time-efficient scanning",
      secondarySkills: ["Recognising paraphrase"],
      trapType: "Wrong paragraph trap",
      strategyTip:
        "When locating an evaluation, scan for judgement words such as failure or missed.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "C",
    }),
    q({
      passageId: "p2",
      type: "summary-completion",
      prompt:
        "The later report named five assumptions that mattered most to the policy ______.",
      answer: "conclusion",
      acceptedAnswers: ["conclusion"],
      explanation:
        "Paragraph D says the table named five assumptions that mattered most to the policy conclusion.",
      evidenceParagraph: "Paragraph D",
      evidenceText:
        "The table named five assumptions that mattered most to the policy conclusion.",
      whyCorrect:
        "The answer completes the phrase describing why those assumptions were selected.",
      whyWrong:
        "Estimate is nearby but refers to the headline number, not the policy conclusion.",
      skill: "Understanding detail",
      secondarySkills: ["Locating explicit information"],
      trapType: "Similar keyword trap",
      strategyTip:
        "Use the noun phrase after the adjective policy to avoid copying a nearby technical noun.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "D",
    }),
    q({
      passageId: "p2",
      type: "flow-chart-completion",
      prompt: "Assumption proves too optimistic -> dependency table shows direction of movement in the headline ______.",
      answer: "estimate",
      acceptedAnswers: ["estimate", "headline estimate"],
      explanation:
        "Paragraph D says the table showed the direction in which the headline estimate would move.",
      evidenceParagraph: "Paragraph D",
      evidenceText:
        "It showed the direction in which the headline estimate would move if the assumption proved too optimistic.",
      whyCorrect:
        "The answer names the result affected by the assumption.",
      whyWrong:
        "A wrong answer such as appendix names the old location of the hidden assumption, not the moving result.",
      skill: "Recognising cause and effect",
      secondarySkills: ["Understanding detail"],
      trapType: "Cause-effect confusion",
      strategyTip:
        "In flow charts, identify what changes as a consequence of the condition.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "D",
    }),
    q({
      passageId: "p2",
      type: "true-false-not-given",
      prompt: "The dependency table ended disagreement about the model.",
      options: ["True", "False", "Not Given"],
      answer: "False",
      explanation:
        "Paragraph E says the table did not remove disagreement; it changed its location.",
      evidenceParagraph: "Paragraph E",
      evidenceText:
        "The table did not remove disagreement, but it changed its location.",
      whyCorrect:
        "The statement contradicts the passage by saying disagreement ended.",
      whyWrong:
        "A reader may confuse changing the form of debate with eliminating debate.",
      skill: "Understanding detail",
      secondarySkills: ["Recognising contrast"],
      trapType: "Opposite meaning trap",
      strategyTip:
        "When a sentence says did not remove, avoid answers that claim elimination.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "E",
    }),
    q({
      passageId: "p2",
      type: "note-completion",
      prompt: "Public summary problem: the assumption became almost ______.",
      answer: "invisible",
      acceptedAnswers: ["invisible"],
      explanation:
        "Paragraph B says the assumption became almost invisible in the public summary.",
      evidenceParagraph: "Paragraph B",
      evidenceText:
        "In the public summary, however, the assumption became almost invisible.",
      whyCorrect:
        "The answer describes how the assumption appeared to readers.",
      whyWrong:
        "A wrong answer such as uncertain describes the economists' private view, not its public visibility.",
      skill: "Understanding vocabulary in context",
      secondarySkills: ["Recognising contrast"],
      trapType: "Partial match trap",
      strategyTip:
        "Track contrast between internal notes and public summaries.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "B",
    }),
    q({
      passageId: "p2",
      type: "short-answer",
      prompt: "What kind of table did the later report use?",
      answer: "dependency table",
      acceptedAnswers: ["dependency table", "a dependency table"],
      explanation:
        "Paragraph D says a later version of the report used a dependency table.",
      evidenceParagraph: "Paragraph D",
      evidenceText:
        "A later version of the report used a dependency table.",
      whyCorrect:
        "The answer names the report feature introduced to improve communication.",
      whyWrong:
        "Sensitivity tests were already run; the new public tool was the dependency table.",
      skill: "Locating explicit information",
      secondarySkills: ["Understanding detail"],
      trapType: "Chronology trap",
      strategyTip:
        "Check whether the question asks about the original model or the later report.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "D",
    }),
    q({
      passageId: "p2",
      type: "multiple-choice",
      prompt: "What change did the dependency table produce in public debate?",
      options: [
        "It shifted debate toward the credibility of particular assumptions.",
        "It persuaded critics to accept the model without further discussion.",
        "It proved that regional rent data were no longer necessary.",
        "It made the headline figure independent of landlord behaviour.",
      ],
      answer:
        "It shifted debate toward the credibility of particular assumptions.",
      explanation:
        "Paragraph E says debate shifted from general trustworthiness to whether particular assumptions deserved confidence.",
      evidenceParagraph: "Paragraph E",
      evidenceText:
        "Debate shifted from whether the model was trustworthy in general to whether particular assumptions deserved confidence.",
      whyCorrect:
        "The option preserves the more precise location of disagreement.",
      whyWrong:
        "The distractors either eliminate disagreement or make unsupported claims about data and independence.",
      skill: "Making inference",
      secondarySkills: ["Understanding main idea"],
      trapType: "Overgeneralisation trap",
      strategyTip:
        "Look for what changed in the discussion, not whether the model became universally accepted.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "E",
    }),
  ],
});

const conservationTradeoffsTest = makeTest({
  testId: "academic-reading-012",
  slug: "conservation-corridors-and-risk",
  legacyIds: ["realism-band9-05"],
  title: "Corridors, Refuges and Conservation Risk",
  description:
    "A Band 8-9 IELTS Academic Reading mini test on ecological connectivity, managed relocation and conservation trade-offs.",
  topic: "Ecology",
  difficulty: "Band 8-9 Challenge",
  targetBand: "Band 8.0-9.0",
  timeLimitMinutes: 30,
  subtopic: "Ecological complexity and conservation decisions",
  passages: [
    {
      passageId: "p1",
      title: "Corridors That Also Carry Risk",
      topic: "Ecology",
      sourceNote: "Original IELTS-style practice passage created for this app.",
      paragraphs: [
        {
          label: "A",
          text:
            "Habitat corridors are often described as ecological bridges, a metaphor that hides as much as it reveals. A bridge has a clear direction and a predictable user. A corridor through a fragmented forest may be used by seed-dispersing birds, invasive shrubs, fire, predators and illegal hunters, sometimes in the same season.",
        },
        {
          label: "B",
          text:
            "In the Valea reserve, a narrow strip of restored woodland joined two older forest patches. Camera traps showed that pine marten crossings increased within a year. So did the movement of feral cats from nearby farms. The corridor had improved connectivity, but connectivity was not automatically conservation success.",
        },
        {
          label: "C",
          text:
            "The research team resisted a simple before-and-after comparison. The corridor coincided with a wet spring, a fall in sheep grazing and a new ban on night driving. Any one of these could have affected animal movement. Rather than claiming a single cause, the team treated the corridor as one intervention inside a changing landscape.",
        },
        {
          label: "D",
          text:
            "Local managers still valued the corridor because it changed where monitoring could occur. Tracks and droppings concentrated along the restored strip, making some species easier to detect. Yet this also distorted perception: animals that avoided the corridor became less visible to managers, not necessarily less present in the reserve.",
        },
        {
          label: "E",
          text:
            "The Valea study suggests that conservation connectivity should be judged by consequences, not by movement alone. A corridor that moves genes, disease and disturbance is not simply good or bad. It is an ecological bargain whose value depends on which movements matter most for the threatened species in question.",
        },
      ],
    },
    {
      passageId: "p2",
      title: "When a Refuge Is Moved",
      topic: "Conservation",
      sourceNote: "Original IELTS-style practice passage created for this app.",
      paragraphs: [
        {
          label: "A",
          text:
            "As mountain temperatures rise, some conservation plans propose moving small populations uphill before the original habitat becomes unsuitable. The proposal is sometimes called assisted migration, though critics prefer the less comforting phrase managed displacement. Both terms describe the same action; neither settles whether it is wise.",
        },
        {
          label: "B",
          text:
            "A trial involving the silver-edged alpine snail illustrates the difficulty. Biologists moved two hundred individuals to a cooler slope where the host moss already grew. Survival after the first winter was high, but reproduction was low because the moss dried earlier on the new slope than temperature records had predicted.",
        },
        {
          label: "C",
          text:
            "Opponents of relocation argued that the trial showed the danger of acting on climate averages while neglecting microhabitat timing. Supporters replied that doing nothing was also an intervention, since the original slope was warming and grazing pressure had increased after a nearby pasture fence was removed.",
        },
        {
          label: "D",
          text:
            "The monitoring report avoided declaring the trial a success or failure. It recommended a second release only if moss moisture, not just air temperature, could be tracked through the breeding period. The report also proposed leaving a marked group on the original slope, so decline there would not be hidden by attention to the new site.",
        },
        {
          label: "E",
          text:
            "The ethical issue is therefore practical rather than abstract. Conservationists are not choosing between intervention and non-intervention, but between different ways of accepting responsibility for change. The hardest question is how much uncertainty is tolerable when delay has its own ecological cost.",
        },
      ],
    },
  ],
  questions: [
    q({
      passageId: "p1",
      type: "matching-headings",
      groupTitle: "Choose the best heading for Paragraph A.",
      prompt: "Paragraph A",
      options: [
        "A metaphor that oversimplifies ecological movement",
        "A bridge designed for illegal hunting",
        "A predictable route used by one forest species",
        "A method for stopping invasive shrubs",
      ],
      answer: "A metaphor that oversimplifies ecological movement",
      explanation:
        "Paragraph A argues that the bridge metaphor hides the many different things that can move through a corridor.",
      evidenceParagraph: "Paragraph A",
      evidenceText:
        "Habitat corridors are often described as ecological bridges, a metaphor that hides as much as it reveals.",
      whyCorrect:
        "The heading captures the paragraph's main critique of the metaphor.",
      whyWrong:
        "The wrong headings pick isolated details from the list or invent a single predictable user.",
      skill: "Understanding main idea",
      secondarySkills: ["Identifying paragraph function"],
      trapType: "Distractor detail trap",
      strategyTip:
        "In Matching Headings, ask what the paragraph is doing with its examples.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "A",
    }),
    q({
      passageId: "p1",
      type: "multiple-choice",
      prompt: "What did the Valea camera traps show?",
      options: [
        "Both pine marten crossings and feral cat movement increased.",
        "Only threatened species used the restored corridor.",
        "The corridor reduced all farm-related animal movement.",
        "Connectivity had no measurable effect on monitoring.",
      ],
      answer: "Both pine marten crossings and feral cat movement increased.",
      explanation:
        "Paragraph B says pine marten crossings increased and so did feral cat movement.",
      evidenceParagraph: "Paragraph B",
      evidenceText:
        "Pine marten crossings increased within a year. So did the movement of feral cats from nearby farms.",
      whyCorrect:
        "The answer preserves the mixed result: desired and undesired movement both rose.",
      whyWrong:
        "The distractors convert a mixed outcome into a purely positive, negative or irrelevant one.",
      skill: "Understanding detail",
      secondarySkills: ["Recognising contrast"],
      trapType: "Partial match trap",
      strategyTip:
        "When an IELTS option sounds neat, check whether the passage actually gives a mixed result.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "B",
    }),
    q({
      passageId: "p1",
      type: "yes-no-not-given",
      prompt: "The writer agrees that improved connectivity is automatically equivalent to conservation success.",
      options: ["Yes", "No", "Not Given"],
      answer: "No",
      explanation:
        "Paragraph B explicitly says connectivity was not automatically conservation success.",
      evidenceParagraph: "Paragraph B",
      evidenceText:
        "The corridor had improved connectivity, but connectivity was not automatically conservation success.",
      whyCorrect:
        "The statement contradicts the writer's caution.",
      whyWrong:
        "A reader may equate connectivity with benefit, but the passage refuses that shortcut.",
      skill: "Identifying writer's opinion",
      secondarySkills: ["Avoiding overgeneralisation"],
      trapType: "Overgeneralisation trap",
      strategyTip:
        "Watch for automatically; it often turns a conditional idea into an overclaim.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "B",
    }),
    q({
      passageId: "p1",
      type: "sentence-completion",
      prompt: "The research team treated the corridor as one intervention inside a changing ______.",
      answer: "landscape",
      acceptedAnswers: ["landscape"],
      explanation:
        "Paragraph C says the team treated the corridor as one intervention inside a changing landscape.",
      evidenceParagraph: "Paragraph C",
      evidenceText:
        "The team treated the corridor as one intervention inside a changing landscape.",
      whyCorrect:
        "The answer completes the methodological caution.",
      whyWrong:
        "A wrong answer such as corridor repeats the intervention, not the wider setting.",
      skill: "Recognising paraphrase",
      secondarySkills: ["Understanding main idea"],
      trapType: "Partial match trap",
      strategyTip:
        "In completion tasks, check whether the missing word names the intervention or its context.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "C",
    }),
    q({
      passageId: "p1",
      type: "matching-information",
      groupTitle: "Match the information to the paragraph.",
      prompt: "A monitoring advantage that also created a perception problem",
      options: ["A", "B", "C", "D", "E"],
      answer: "D",
      explanation:
        "Paragraph D says the corridor made some species easier to detect but made animals avoiding the corridor less visible.",
      evidenceParagraph: "Paragraph D",
      evidenceText:
        "Tracks and droppings concentrated along the restored strip... animals that avoided the corridor became less visible to managers.",
      whyCorrect:
        "The paragraph contains both the monitoring benefit and the distortion.",
      whyWrong:
        "Paragraph B discusses movement outcomes, but not the monitoring-perception trade-off.",
      skill: "Time-efficient scanning",
      secondarySkills: ["Recognising contrast"],
      trapType: "Wrong paragraph trap",
      strategyTip:
        "For Matching Information, find the paragraph that contains both halves of the information item.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "D",
    }),
    q({
      passageId: "p1",
      type: "true-false-not-given",
      prompt: "The research team claimed that the corridor alone caused the change in animal movement.",
      options: ["True", "False", "Not Given"],
      answer: "False",
      explanation:
        "Paragraph C says the team resisted a simple before-and-after comparison and did not claim a single cause.",
      evidenceParagraph: "Paragraph C",
      evidenceText:
        "Rather than claiming a single cause, the team treated the corridor as one intervention inside a changing landscape.",
      whyCorrect:
        "The statement contradicts the team's cautious interpretation.",
      whyWrong:
        "The corridor was important, but the passage lists other simultaneous changes.",
      skill: "Distinguishing fact from claim",
      secondarySkills: ["Recognising cause and effect"],
      trapType: "Cause-effect confusion",
      strategyTip:
        "Do not turn one intervention into the sole cause when several conditions changed.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "C",
    }),
    q({
      passageId: "p1",
      type: "summary-completion",
      prompt:
        "The Valea study suggests that corridors should be evaluated by consequences rather than movement ______.",
      answer: "alone",
      acceptedAnswers: ["alone"],
      explanation:
        "Paragraph E says connectivity should be judged by consequences, not by movement alone.",
      evidenceParagraph: "Paragraph E",
      evidenceText:
        "Conservation connectivity should be judged by consequences, not by movement alone.",
      whyCorrect:
        "The answer completes the contrast between movement and its consequences.",
      whyWrong:
        "A wrong answer such as genes names one movement, not the limiting word in the contrast.",
      skill: "Understanding main idea",
      secondarySkills: ["Recognising contrast"],
      trapType: "Partial match trap",
      strategyTip:
        "When a summary uses rather than, identify the rejected standard of judgement.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "E",
    }),
    q({
      passageId: "p1",
      type: "flow-chart-completion",
      prompt: "Restored strip concentrates tracks -> managers detect some species more easily -> animals avoiding corridor become less ______.",
      answer: "visible",
      acceptedAnswers: ["visible"],
      explanation:
        "Paragraph D says animals that avoided the corridor became less visible to managers.",
      evidenceParagraph: "Paragraph D",
      evidenceText:
        "Animals that avoided the corridor became less visible to managers.",
      whyCorrect:
        "The flow chart follows the monitoring effect from concentration of signs to reduced visibility of avoiders.",
      whyWrong:
        "A wrong answer such as present would misread visibility as actual abundance.",
      skill: "Recognising cause and effect",
      secondarySkills: ["Understanding detail"],
      trapType: "Assumption trap",
      strategyTip:
        "Distinguish detectability from actual presence.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "D",
    }),
    q({
      passageId: "p1",
      type: "matching-sentence-endings",
      groupTitle: "Choose the correct ending.",
      prompt: "A corridor is described as an ecological bargain because",
      options: [
        "its value depends on which movements matter most.",
        "it always benefits every threatened species equally.",
        "it prevents disease and disturbance from moving.",
        "it removes the need for species-specific evidence.",
      ],
      answer: "its value depends on which movements matter most.",
      explanation:
        "Paragraph E says a corridor's value depends on which movements matter most for the threatened species.",
      evidenceParagraph: "Paragraph E",
      evidenceText:
        "Its value depends on which movements matter most for the threatened species in question.",
      whyCorrect:
        "The ending preserves the conditional and species-specific judgement.",
      whyWrong:
        "The wrong endings turn a bargain into an automatic benefit or deny the listed risks.",
      skill: "Making inference",
      secondarySkills: ["Understanding main idea"],
      trapType: "Overgeneralisation trap",
      strategyTip:
        "For advanced sentence endings, preserve conditional language such as depends on.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "E",
    }),
    q({
      passageId: "p1",
      type: "short-answer",
      prompt: "Which farm animal's grazing fell during the corridor study?",
      answer: "sheep",
      acceptedAnswers: ["sheep"],
      explanation:
        "Paragraph C lists a fall in sheep grazing among the simultaneous changes.",
      evidenceParagraph: "Paragraph C",
      evidenceText:
        "The corridor coincided with a wet spring, a fall in sheep grazing and a new ban on night driving.",
      whyCorrect:
        "The answer names the grazing animal.",
      whyWrong:
        "Pine martens and feral cats are movement outcomes, not grazing animals.",
      skill: "Locating explicit information",
      secondarySkills: ["Understanding detail"],
      trapType: "Similar keyword trap",
      strategyTip:
        "For short answers, copy the exact noun linked to the question's verb.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "C",
    }),
    q({
      passageId: "p2",
      type: "multiple-choice",
      prompt: "Why does the writer mention two names for moving populations uphill?",
      options: [
        "To show that terminology can frame the same action differently",
        "To prove that critics and supporters studied different species",
        "To argue that assisted migration has already become universally accepted",
        "To distinguish relocation from any form of managed conservation",
      ],
      answer: "To show that terminology can frame the same action differently",
      explanation:
        "Paragraph A says assisted migration and managed displacement describe the same action, but neither settles whether it is wise.",
      evidenceParagraph: "Paragraph A",
      evidenceText:
        "Both terms describe the same action; neither settles whether it is wise.",
      whyCorrect:
        "The names reveal framing without resolving the judgement.",
      whyWrong:
        "The distractors invent different species, universal acceptance or a false distinction.",
      skill: "Understanding vocabulary in context",
      secondarySkills: ["Identifying writer's opinion"],
      trapType: "Writer opinion confusion",
      strategyTip:
        "Notice when the writer compares labels to expose framing rather than define separate actions.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "A",
    }),
    q({
      passageId: "p2",
      type: "matching-features",
      groupTitle: "Match each view with the group.",
      prompt: "The trial shows the risk of relying on climate averages while missing microhabitat timing",
      options: ["opponents of relocation", "supporters of relocation", "monitoring report", "local managers"],
      answer: "opponents of relocation",
      explanation:
        "Paragraph C says opponents argued that the trial showed the danger of acting on climate averages while neglecting microhabitat timing.",
      evidenceParagraph: "Paragraph C",
      evidenceText:
        "Opponents of relocation argued that the trial showed the danger of acting on climate averages while neglecting microhabitat timing.",
      whyCorrect:
        "The view is explicitly attributed to opponents.",
      whyWrong:
        "Supporters replied with a different argument about doing nothing also being an intervention.",
      skill: "Locating explicit information",
      secondarySkills: ["Understanding detail"],
      trapType: "Similar keyword trap",
      strategyTip:
        "For Matching Features, keep the argument attached to the group that makes it.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "C",
    }),
    q({
      passageId: "p2",
      type: "yes-no-not-given",
      prompt: "The writer suggests that doing nothing can itself be understood as an intervention.",
      options: ["Yes", "No", "Not Given"],
      answer: "Yes",
      explanation:
        "Paragraph C reports supporters saying doing nothing was also an intervention, and Paragraph E frames choices as different responsibilities for change.",
      evidenceParagraph: "Paragraph C",
      evidenceText:
        "Supporters replied that doing nothing was also an intervention.",
      whyCorrect:
        "The statement agrees with a view the passage takes seriously in its ethical framing.",
      whyWrong:
        "A wrong answer may assume intervention only means physical relocation.",
      skill: "Making inference",
      secondarySkills: ["Identifying writer's opinion"],
      trapType: "Assumption trap",
      strategyTip:
        "Advanced YNNG questions may require connecting a reported view with the writer's later framing.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "C",
    }),
    q({
      passageId: "p2",
      type: "true-false-not-given",
      prompt: "The snail trial showed high first-winter survival but low reproduction.",
      options: ["True", "False", "Not Given"],
      answer: "True",
      explanation:
        "Paragraph B says survival after the first winter was high, but reproduction was low.",
      evidenceParagraph: "Paragraph B",
      evidenceText:
        "Survival after the first winter was high, but reproduction was low.",
      whyCorrect:
        "The statement matches the mixed outcome in the passage.",
      whyWrong:
        "A wrong answer may expect high survival to imply high reproduction, but the passage separates them.",
      skill: "Understanding comparison",
      secondarySkills: ["Recognising contrast"],
      trapType: "Comparison confusion",
      strategyTip:
        "Keep two outcome measures separate, especially when joined by but.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "B",
    }),
    q({
      passageId: "p2",
      type: "note-completion",
      prompt: "Relocated species: silver-edged alpine ______.",
      answer: "snail",
      acceptedAnswers: ["snail"],
      explanation:
        "Paragraph B identifies the species as the silver-edged alpine snail.",
      evidenceParagraph: "Paragraph B",
      evidenceText:
        "A trial involving the silver-edged alpine snail illustrates the difficulty.",
      whyCorrect:
        "The answer completes the species name.",
      whyWrong:
        "Moss is the host plant, not the relocated species.",
      skill: "Locating explicit information",
      secondarySkills: ["Understanding detail"],
      trapType: "Similar keyword trap",
      strategyTip:
        "For note completion, check whether the gap is part of a species name or habitat description.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "B",
    }),
    q({
      passageId: "p2",
      type: "matching-information",
      groupTitle: "Match the information to the paragraph.",
      prompt: "A recommendation to monitor moisture through the breeding period",
      options: ["A", "B", "C", "D", "E"],
      answer: "D",
      explanation:
        "Paragraph D recommends a second release only if moss moisture can be tracked through the breeding period.",
      evidenceParagraph: "Paragraph D",
      evidenceText:
        "It recommended a second release only if moss moisture, not just air temperature, could be tracked through the breeding period.",
      whyCorrect:
        "This paragraph gives the condition for any second release.",
      whyWrong:
        "Paragraph B reports the first trial outcome; Paragraph D gives the monitoring recommendation.",
      skill: "Time-efficient scanning",
      secondarySkills: ["Understanding detail"],
      trapType: "Wrong paragraph trap",
      strategyTip:
        "Scan for technical phrases such as breeding period when matching information.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "D",
    }),
    q({
      passageId: "p2",
      type: "summary-completion",
      prompt:
        "The monitoring report proposed leaving a marked group on the ______ slope.",
      answer: "original",
      acceptedAnswers: ["original"],
      explanation:
        "Paragraph D says the report proposed leaving a marked group on the original slope.",
      evidenceParagraph: "Paragraph D",
      evidenceText:
        "The report also proposed leaving a marked group on the original slope.",
      whyCorrect:
        "The answer identifies the comparison location that should remain monitored.",
      whyWrong:
        "A wrong answer such as new would reverse the comparison and hide decline at the old site.",
      skill: "Understanding detail",
      secondarySkills: ["Understanding comparison"],
      trapType: "Opposite meaning trap",
      strategyTip:
        "In relocation passages, keep original and new sites distinct.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "D",
    }),
    q({
      passageId: "p2",
      type: "flow-chart-completion",
      prompt: "Snails moved uphill -> host moss present -> moss dries earlier -> reproduction remains ______.",
      answer: "low",
      acceptedAnswers: ["low"],
      explanation:
        "Paragraph B links early moss drying on the new slope with low reproduction.",
      evidenceParagraph: "Paragraph B",
      evidenceText:
        "Reproduction was low because the moss dried earlier on the new slope than temperature records had predicted.",
      whyCorrect:
        "The answer completes the causal chain from microhabitat timing to reproductive outcome.",
      whyWrong:
        "High belongs to first-winter survival, not reproduction.",
      skill: "Recognising cause and effect",
      secondarySkills: ["Recognising contrast"],
      trapType: "Cause-effect confusion",
      strategyTip:
        "Do not transfer the adjective from one outcome measure to another.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "B",
    }),
    q({
      passageId: "p2",
      type: "diagram-label-completion",
      groupTitle: "Text schematic: Relocation decision",
      prompt: "Air temperature + moss moisture + original-slope group -> [label 19]",
      answer: "second release decision",
      acceptedAnswers: ["second release decision", "second release"],
      explanation:
        "Paragraph D says a second release should depend on moss moisture tracking and continued monitoring of the original slope.",
      evidenceParagraph: "Paragraph D",
      evidenceText:
        "It recommended a second release only if moss moisture... could be tracked... The report also proposed leaving a marked group on the original slope.",
      whyCorrect:
        "The schematic combines the decision condition and comparison group.",
      whyWrong:
        "A wrong answer such as first winter survival uses an observed outcome rather than the future decision.",
      skill: "Making inference",
      secondarySkills: ["Following reference words"],
      trapType: "Partial match trap",
      strategyTip:
        "For text schematics, infer what the listed evidence sources are meant to support.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "D",
    }),
    q({
      passageId: "p2",
      type: "multiple-choice",
      prompt: "What is the final ethical point of Passage 2?",
      options: [
        "Conservation choices involve different responsibilities under uncertainty.",
        "Non-intervention avoids responsibility for ecological change.",
        "Managed displacement is always wiser than assisted migration.",
        "Temperature records alone can settle relocation decisions.",
      ],
      answer:
        "Conservation choices involve different responsibilities under uncertainty.",
      explanation:
        "Paragraph E says conservationists choose between different ways of accepting responsibility for change and must judge tolerable uncertainty.",
      evidenceParagraph: "Paragraph E",
      evidenceText:
        "Conservationists are not choosing between intervention and non-intervention, but between different ways of accepting responsibility for change.",
      whyCorrect:
        "The option captures the abstract ethical conclusion without reducing it to one policy answer.",
      whyWrong:
        "The distractors choose one side or one measurement and ignore the passage's uncertainty framing.",
      skill: "Understanding main idea",
      secondarySkills: ["Making inference"],
      trapType: "Overgeneralisation trap",
      strategyTip:
        "For final-position MCQs, avoid options that settle a debate the passage deliberately leaves conditional.",
      difficulty: "Band 8-9 Challenge",
      paragraphRef: "E",
    }),
  ],
});

const portArchiveRepairTest = makeTest({
  testId: "academic-reading-013",
  slug: "port-labour-and-hidden-records",
  legacyIds: ["realism-repair-01"],
  title: "Mapping a Port's Hidden Work",
  description:
    "A weak-question-type repair mini test focused on Matching Headings, Matching Information and Matching Features inside a full Academic Reading test.",
  topic: "Sociology",
  difficulty: "Hard",
  targetBand: "Band 7.0-8.0",
  timeLimitMinutes: 30,
  subtopic: "Labour history and port records",
  passages: [
    {
      passageId: "p1",
      title: "The Ledger Behind the Harbour Map",
      topic: "Sociology",
      sourceNote: "Original IELTS-style practice passage created for this app.",
      paragraphs: [
        { label: "A", text: "The harbour map of Elwick shows cranes, warehouses and rail sidings, but not the temporary labour office that made the system work. Each morning, casual workers waited beside a brick arch while clerks copied names into a narrow ledger. The map presents infrastructure; the ledger records dependence." },
        { label: "B", text: "For years, historians treated the ledger as a poor source because the spelling of names shifted and many entries lacked addresses. A newer reading treats those irregularities as evidence. Repeated misspellings show which workers were known by sight rather than by written identity." },
        { label: "C", text: "The ledger also complicates the image of a purely male dock workforce. Women's names appear less often, but they cluster around tasks such as rope repair, food stalls and the cleaning of customs sheds. These entries are brief, yet they show that port labour extended beyond the loading line." },
        { label: "D", text: "A second archive changes the picture again. Injury claims filed by workers' families describe night shifts, informal substitutions and unpaid waiting time. The claims were written to obtain compensation, so they cannot be read as neutral diaries. Still, they reveal costs that the harbour map cannot show." },
        { label: "E", text: "The most persuasive account of Elwick now combines map, ledger and claim file. No single document captures the port's social organisation. Together, however, they show how a visible machine of trade rested on unstable, often invisible work." },
      ],
    },
    {
      passageId: "p2",
      title: "Tokens, Gates and Informal Authority",
      topic: "Sociology",
      sourceNote: "Original IELTS-style practice passage created for this app.",
      paragraphs: [
        { label: "A", text: "Entry tokens were introduced at Elwick in 1912 to reduce arguments at the labour office. In theory, each token gave one worker access to a shift. In practice, tokens circulated through families, boarding houses and favoured drinking rooms before dawn." },
        { label: "B", text: "The harbour company described the system as fair because tokens were numbered. Workers described it as fair only when the foreman distributed tokens in public. The difference matters: one definition of fairness depended on procedure, the other on visibility." },
        { label: "C", text: "Foremen gained influence from the gap between rule and practice. They could refuse a token that looked damaged, accept a substitute worker or delay a group until a ship's schedule became clearer. None of these actions broke the written rule, but each affected who earned money that day." },
        { label: "D", text: "A reform committee later proposed metal identity badges to replace tokens. The badge scheme reduced resale, but it also excluded migrants whose papers had not yet been regularised. Reform removed one unfairness while hardening another." },
        { label: "E", text: "The Elwick records therefore resist a simple story of progress from disorder to order. Administrative devices made labour easier to count, but not necessarily easier to treat justly. Their effects depended on who controlled the gate and who could prove they belonged there." },
      ],
    },
  ],
  questions: [
    ...[
      ["p1", "A", "A visible map and an invisible labour system", "The map presents infrastructure; the ledger records dependence."],
      ["p1", "B", "Errors that become historical evidence", "Repeated misspellings show which workers were known by sight rather than by written identity."],
      ["p1", "C", "Evidence that port work extended beyond loading", "Port labour extended beyond the loading line."],
      ["p2", "B", "Two competing definitions of fairness", "One definition of fairness depended on procedure, the other on visibility."],
      ["p2", "E", "Why administrative order did not guarantee justice", "Administrative devices made labour easier to count, but not necessarily easier to treat justly."],
    ].map(([passageId, paragraphRef, answer, evidenceText]) =>
      q({
        passageId,
        type: "matching-headings",
        groupTitle: "Choose the best heading for the paragraph.",
        prompt: `Paragraph ${paragraphRef}`,
        options: [
          "A visible map and an invisible labour system",
          "Errors that become historical evidence",
          "Evidence that port work extended beyond loading",
          "Two competing definitions of fairness",
          "Why administrative order did not guarantee justice",
          "A complete replacement of informal authority",
          "The disappearance of all casual port work",
        ],
        answer,
        explanation:
          "The correct heading captures the paragraph's main function rather than a single attractive detail.",
        evidenceParagraph: `Paragraph ${paragraphRef}`,
        evidenceText,
        whyCorrect:
          "The heading matches the paragraph-wide argument and preserves its qualification.",
        whyWrong:
          "Wrong headings borrow details from nearby paragraphs or overstate a limited claim into a total change.",
        skill: "Understanding main idea",
        secondarySkills: ["Identifying paragraph function"],
        trapType: "Distractor detail trap",
        strategyTip:
          "Read the full paragraph before matching; headings should describe the whole move of the paragraph.",
        difficulty: "Hard",
        paragraphRef,
      }),
    ),
    ...[
      ["p1", "B", "Evidence that unstable spelling may itself be historically meaningful", "Repeated misspellings show which workers were known by sight rather than by written identity."],
      ["p1", "D", "A source written for compensation rather than neutral description", "The claims were written to obtain compensation, so they cannot be read as neutral diaries."],
      ["p2", "A", "A formal object that circulated informally before shifts began", "Tokens circulated through families, boarding houses and favoured drinking rooms before dawn."],
      ["p2", "C", "Discretionary actions that shaped access without breaking the rule", "None of these actions broke the written rule, but each affected who earned money that day."],
      ["p2", "D", "A reform that reduced resale while excluding some migrants", "The badge scheme reduced resale, but it also excluded migrants whose papers had not yet been regularised."],
    ].map(([passageId, paragraphRef, prompt, evidenceText]) =>
      q({
        passageId,
        type: "matching-information",
        groupTitle: "Match the information to the paragraph.",
        prompt,
        options: ["A", "B", "C", "D", "E"],
        answer: paragraphRef,
        explanation:
          "The answer is the paragraph that contains the full information item, not only a related keyword.",
        evidenceParagraph: `Paragraph ${paragraphRef}`,
        evidenceText,
        whyCorrect:
          "This paragraph contains the exact relationship described in the question.",
        whyWrong:
          "Other paragraphs share the port-labour topic but do not contain the full information item.",
        skill: "Time-efficient scanning",
        secondarySkills: ["Recognising paraphrase"],
        trapType: "Wrong paragraph trap",
        strategyTip:
          "For Matching Information, confirm the whole information item before choosing a paragraph.",
        difficulty: "Hard",
        paragraphRef,
      }),
    ),
    ...[
      ["p1", "Filed injury claims describing informal substitutions", "workers' families", "Injury claims filed by workers' families describe night shifts, informal substitutions and unpaid waiting time."],
      ["p2", "Could refuse damaged tokens or accept substitute workers", "foremen", "They could refuse a token that looked damaged, accept a substitute worker or delay a group."],
      ["p2", "Proposed identity badges to replace tokens", "reform committee", "A reform committee later proposed metal identity badges to replace tokens."],
      ["p2", "Defined fairness through public distribution", "workers", "Workers described it as fair only when the foreman distributed tokens in public."],
    ].map(([passageId, prompt, answer, evidenceText]) =>
      q({
        passageId,
        type: "matching-features",
        groupTitle: "Match each action or view with the correct group.",
        prompt,
        options: ["clerks", "workers", "workers' families", "foremen", "reform committee", "harbour company"],
        answer,
        explanation:
          "The correct feature is the actor explicitly connected to the action or view in the passage.",
        evidenceParagraph: passageId === "p1" ? "Paragraph D" : answer === "reform committee" ? "Paragraph D" : answer === "workers" ? "Paragraph B" : "Paragraph C",
        evidenceText,
        whyCorrect:
          "The action is attached to this group in the evidence sentence.",
        whyWrong:
          "Wrong features are plausible port actors but are linked to different roles.",
        skill: "Locating explicit information",
        secondarySkills: ["Understanding detail"],
        trapType: "Similar keyword trap",
        strategyTip:
          "For Matching Features, track actor-action links, not just the general topic.",
        difficulty: "Hard",
      }),
    ),
    ...[
      ["What did the harbour map fail to show?", "temporary labour office", "The harbour map of Elwick shows cranes, warehouses and rail sidings, but not the temporary labour office."],
      ["What scheme reduced resale?", "badge scheme", "The badge scheme reduced resale, but it also excluded migrants."],
    ].map(([prompt, answer, evidenceText]) =>
      q({
        passageId: prompt.includes("scheme") ? "p2" : "p1",
        type: "short-answer",
        prompt,
        answer,
        acceptedAnswers: [answer],
        explanation:
          "The answer is a precise noun phrase directly named in the evidence.",
        evidenceParagraph: prompt.includes("scheme") ? "Paragraph D" : "Paragraph A",
        evidenceText,
        whyCorrect:
          "The answer matches the object or scheme named by the passage.",
        whyWrong:
          "A wrong answer usually copies a nearby institution rather than the requested object.",
        skill: "Locating explicit information",
        secondarySkills: ["Understanding detail"],
        trapType: "Similar keyword trap",
        strategyTip:
          "For short answers, identify the exact noun phrase requested by the question.",
        difficulty: "Hard",
      }),
    ),
    q({
      passageId: "p2",
      type: "flow-chart-completion",
      prompt: "Tokens introduced -> tokens circulate informally -> foremen control damaged or substitute tokens -> access remains partly ______.",
      answer: "discretionary",
      acceptedAnswers: ["discretionary", "informal"],
      explanation:
        "The flow chart summarises how formal tokens still left room for foremen's discretionary control.",
      evidenceParagraph: "Paragraph C",
      evidenceText:
        "Foremen gained influence from the gap between rule and practice.",
      whyCorrect:
        "The answer captures the remaining informal control inside the formal system.",
      whyWrong:
        "A wrong answer such as numbered describes the formal token system, not the access outcome.",
      skill: "Recognising cause and effect",
      secondarySkills: ["Making inference"],
      trapType: "Cause-effect confusion",
      strategyTip:
        "For flow charts, infer the state produced by the sequence rather than repeating the first step.",
      difficulty: "Hard",
      paragraphRef: "C",
    }),
    q({
      passageId: "p2",
      type: "diagram-label-completion",
      groupTitle: "Text schematic: Gate authority",
      prompt: "Written token rule + foreman's public distribution + proof of identity -> [label 18]",
      answer: "access to work",
      acceptedAnswers: ["access to work", "work access"],
      explanation:
        "The schematic combines the formal rule, public visibility and proof of belonging that determined who could work.",
      evidenceParagraph: "Paragraph E",
      evidenceText:
        "Their effects depended on who controlled the gate and who could prove they belonged there.",
      whyCorrect:
        "The label names the practical outcome controlled by these conditions.",
      whyWrong:
        "A wrong answer such as resale focuses on one problem rather than the broader gate outcome.",
      skill: "Making inference",
      secondarySkills: ["Following reference words"],
      trapType: "Partial match trap",
      strategyTip:
        "For text schematics, ask what the combined factors control.",
      difficulty: "Hard",
      paragraphRef: "E",
    }),
    ...[
      ["What is the main argument of Passage 1?", "The port's social organisation is best understood by combining different imperfect records.", "The most persuasive account of Elwick now combines map, ledger and claim file."],
      ["Why is the badge reform presented as ambiguous?", "It reduced one unfairness while making another exclusion stronger.", "Reform removed one unfairness while hardening another."],
    ].map(([prompt, answer, evidenceText], index) =>
      q({
        passageId: index === 0 ? "p1" : "p2",
        type: "multiple-choice",
        prompt,
        options: [
          answer,
          "Administrative records always provide a complete and neutral account.",
          "Informal labour systems disappeared as soon as written rules were introduced.",
          "Maps are more reliable than all written records of labour.",
        ],
        answer,
        explanation:
          "The correct option preserves the passage's qualified argument; the distractors turn partial evidence into simplistic certainty.",
        evidenceParagraph: index === 0 ? "Paragraph E" : "Paragraph D",
        evidenceText,
        whyCorrect:
          "The option reflects the passage-wide conclusion without overstating it.",
        whyWrong:
          "The wrong options sound administratively plausible but contradict the text's emphasis on partial records and mixed reforms.",
        skill: "Understanding main idea",
        secondarySkills: ["Making inference"],
        trapType: "Overgeneralisation trap",
        strategyTip:
          "Reject MCQ options that erase the passage's ambiguity.",
        difficulty: "Hard",
      }),
    ),
  ],
});

const floodGateRepairTest = makeTest({
  testId: "academic-reading-014",
  slug: "flood-gates-and-warning-systems",
  legacyIds: ["realism-repair-02"],
  title: "From Sensors to Flood Gates",
  description:
    "A weak-question-type repair mini test focused on Flow-chart Completion, Diagram Label Completion and plausible MCQ distractors.",
  topic: "Smart Cities",
  difficulty: "Hard",
  targetBand: "Band 7.0-8.0",
  timeLimitMinutes: 30,
  subtopic: "Urban flood sensing and public infrastructure",
  passages: [
    {
      passageId: "p1",
      title: "The Gate That Waited",
      topic: "Smart Cities",
      sourceNote: "Original IELTS-style practice passage created for this app.",
      paragraphs: [
        { label: "A", text: "The eastern flood gate in Morven is not opened whenever rain begins. Sensors first compare canal level, tide height and predicted runoff from two steep streets. If the tide is already high, opening the gate can push water back through basement drains." },
        { label: "B", text: "The first version of the control system responded too quickly. It opened the gate after short bursts of rain, then closed it again when the tide rose. Residents saw movement but not protection, and several assumed the gate was faulty." },
        { label: "C", text: "Engineers revised the sequence. The system now waits for a ten-minute trend, checks whether tide height is still rising, and sends an alert to a human operator before moving the gate. The delay is deliberate, not a sign of indecision." },
        { label: "D", text: "A public display beside the canal shows only three colours: watch, hold and release. It does not show the full calculation because officials feared that too much technical detail would reduce trust rather than increase it." },
        { label: "E", text: "The Morven gate illustrates a broader problem in smart-city design. A system may be technically responsive while appearing hesitant to the public. Designers therefore need to explain not only what the system does, but why waiting can sometimes be the safer action." },
      ],
    },
    {
      passageId: "p2",
      title: "Who Reads the Warning?",
      topic: "Public Health",
      sourceNote: "Original IELTS-style practice passage created for this app.",
      paragraphs: [
        { label: "A", text: "Flood warnings in Morven are sent by phone alert, radio bulletin and signs at three bus stops. The bus-stop signs were added after interviews showed that older residents often checked the street before checking their phones." },
        { label: "B", text: "The alert wording was also changed. The original message said 'gate release possible', a phrase engineers understood but residents found vague. The revised message said 'avoid canal-side basements for the next hour'." },
        { label: "C", text: "Not every group received the warning equally. Delivery drivers often entered the canal district from a road without signs. The city later placed a portable display at the freight entrance, but only during months when tide levels were historically highest." },
        { label: "D", text: "Officials measured warning success by the number of people who changed route, not by the number who received the message. This was controversial: a widely received warning that changes no behaviour may be less useful than a narrower warning that reaches people at the right decision point." },
        { label: "E", text: "The evaluation concluded that flood communication is part of the infrastructure. Gates and sensors reduce risk only when people understand which action is being asked of them at the moment when that action still matters." },
      ],
    },
  ],
  questions: [
    ...[
      ["p1", "Rain starts -> sensors compare canal level, tide height and ______.", "predicted runoff", "Sensors first compare canal level, tide height and predicted runoff from two steep streets.", "A"],
      ["p1", "Short rain burst -> old system opens gate -> rising tide forces gate to ______ again.", "close", "It opened the gate after short bursts of rain, then closed it again when the tide rose.", "B"],
      ["p1", "New system waits for ten-minute trend -> checks tide direction -> alerts human operator -> gate ______.", "moves", "Sends an alert to a human operator before moving the gate.", "C"],
      ["p2", "Phone alert + radio bulletin + bus-stop signs -> warning reaches residents before they choose a ______.", "route", "Officials measured warning success by the number of people who changed route.", "D"],
    ].map(([passageId, prompt, answer, evidenceText, paragraphRef]) =>
      q({
        passageId,
        type: "flow-chart-completion",
        prompt,
        answer,
        acceptedAnswers: [answer],
        explanation:
          "The flow-chart answer follows the actual sequence described in the passage.",
        evidenceParagraph: `Paragraph ${paragraphRef}`,
        evidenceText,
        whyCorrect:
          "The answer completes the next step or outcome in the process.",
        whyWrong:
          "A wrong answer usually repeats an earlier step or chooses a technically related but wrongly sequenced detail.",
        skill: "Recognising cause and effect",
        secondarySkills: ["Understanding detail"],
        trapType: "Chronology trap",
        strategyTip:
          "For flow-chart completion, follow the sequence rather than scanning for any related technical word.",
        difficulty: "Hard",
        paragraphRef,
      }),
    ),
    ...[
      ["p1", "Text schematic: Gate decision", "Canal level + tide height + predicted runoff + human alert -> [label 5]", "gate movement", "Sends an alert to a human operator before moving the gate.", "C"],
      ["p1", "Text schematic: Public display", "watch / hold / release -> [label 6]", "simplified status", "A public display beside the canal shows only three colours: watch, hold and release.", "D"],
      ["p2", "Text schematic: Warning channels", "phone + radio + bus-stop signs -> [label 7]", "flood warnings", "Flood warnings in Morven are sent by phone alert, radio bulletin and signs at three bus stops.", "A"],
    ].map(([passageId, groupTitle, prompt, answer, evidenceText, paragraphRef]) =>
      q({
        passageId,
        type: "diagram-label-completion",
        groupTitle,
        prompt,
        answer,
        acceptedAnswers: [answer],
        explanation:
          "The text schematic condenses the process or display described in the evidence.",
        evidenceParagraph: `Paragraph ${paragraphRef}`,
        evidenceText,
        whyCorrect:
          "The label names the function of the connected elements.",
        whyWrong:
          "Wrong labels focus on one component rather than the relationship shown in the schematic.",
        skill: "Making inference",
        secondarySkills: ["Following reference words"],
        trapType: "Partial match trap",
        strategyTip:
          "Read a text schematic as a relationship between parts, not as a list of isolated nouns.",
        difficulty: "Hard",
        paragraphRef,
      }),
    ),
    ...[
      ["Why can opening the gate during high tide be dangerous?", "It can push water back through basement drains.", "If the tide is already high, opening the gate can push water back through basement drains.", "p1", "A"],
      ["Why did residents think the first control system was faulty?", "They saw the gate move without seeing protection.", "Residents saw movement but not protection, and several assumed the gate was faulty.", "p1", "B"],
      ["Why did officials avoid showing the full calculation?", "They feared too much technical detail would reduce trust.", "Officials feared that too much technical detail would reduce trust rather than increase it.", "p1", "D"],
      ["Why were bus-stop signs added?", "Older residents often checked the street before checking their phones.", "Older residents often checked the street before checking their phones.", "p2", "A"],
      ["Why was the original alert wording replaced?", "Residents found the phrase vague.", "The original message said 'gate release possible', a phrase engineers understood but residents found vague.", "p2", "B"],
    ].map(([prompt, answer, evidenceText, passageId, paragraphRef], index) =>
      q({
        passageId,
        type: "multiple-choice",
        prompt,
        options: [
          index % 4 === 0 ? answer : "The gate was designed to ignore tide levels.",
          index % 4 === 1 ? answer : "Officials wanted to remove all human operators.",
          index % 4 === 2 ? answer : "Residents had already stopped using phones.",
          index % 4 === 3 ? answer : "The system had no public display at all.",
        ],
        answer,
        explanation:
          "The correct option gives the passage's specific causal reason; the distractors are plausible civic-design concerns but unsupported here.",
        evidenceParagraph: `Paragraph ${paragraphRef}`,
        evidenceText,
        whyCorrect:
          "The answer preserves the reason given in the passage.",
        whyWrong:
          "The wrong answers distort the cause or import an unsupported policy intention.",
        skill: "Recognising cause and effect",
        secondarySkills: ["Understanding detail"],
        trapType: "Cause-effect confusion",
        strategyTip:
          "For MCQs asking why, choose the reason stated or implied by the passage, not a generally plausible reason.",
        difficulty: "Hard",
        paragraphRef,
      }),
    ),
    ...[
      ["p1", "D", "A simplified display that hides the full calculation", "It does not show the full calculation."],
      ["p2", "C", "A group entering through a route without warning signs", "Delivery drivers often entered the canal district from a road without signs."],
      ["p2", "D", "A controversial measure of warning success", "Officials measured warning success by the number of people who changed route, not by the number who received the message."],
    ].map(([passageId, paragraphRef, prompt, evidenceText]) =>
      q({
        passageId,
        type: "matching-information",
        groupTitle: "Match the information to the paragraph.",
        prompt,
        options: ["A", "B", "C", "D", "E"],
        answer: paragraphRef,
        explanation:
          "The answer is the paragraph containing the full paraphrased information.",
        evidenceParagraph: `Paragraph ${paragraphRef}`,
        evidenceText,
        whyCorrect:
          "The paragraph contains the precise issue named in the question.",
        whyWrong:
          "Other paragraphs are about the same flood system but not this specific issue.",
        skill: "Time-efficient scanning",
        secondarySkills: ["Recognising paraphrase"],
        trapType: "Wrong paragraph trap",
        strategyTip:
          "Scan for distinctive terms, then confirm the whole information item.",
        difficulty: "Hard",
        paragraphRef,
      }),
    ),
    ...[
      ["The revised warning asked residents to avoid canal-side basements for the next hour.", "True", "The revised message said 'avoid canal-side basements for the next hour'.", "p2", "B"],
      ["The city used portable displays at the freight entrance throughout the entire year.", "False", "The city later placed a portable display at the freight entrance, but only during months when tide levels were historically highest.", "p2", "C"],
      ["The gate opens automatically whenever rain begins.", "False", "The eastern flood gate in Morven is not opened whenever rain begins.", "p1", "A"],
      ["The passage gives the exact cost of installing the bus-stop signs.", "Not Given", "The passage explains why bus-stop signs were added, but does not state their cost.", "p2", "A"],
    ].map(([prompt, answer, evidenceText, passageId, paragraphRef]) =>
      q({
        passageId,
        type: "true-false-not-given",
        prompt,
        options: ["True", "False", "Not Given"],
        answer,
        explanation:
          "The answer depends on comparing the exact claim with the evidence, including limits such as only and whenever.",
        evidenceParagraph: answer === "Not Given" ? "No confirming evidence" : `Paragraph ${paragraphRef}`,
        evidenceText,
        whyCorrect:
          "The statement either matches, contradicts, or lacks support in the passage.",
        whyWrong:
          "Wrong choices usually come from treating a limited claim as universal or inferring a detail not supplied.",
        skill: "Understanding detail",
        secondarySkills: ["Avoiding overgeneralisation"],
        trapType: answer === "Not Given" ? "Not Given trap" : "Extreme wording trap",
        strategyTip:
          "Check limiting words before choosing True, False or Not Given.",
        difficulty: "Hard",
        paragraphRef: answer === "Not Given" ? undefined : paragraphRef,
      }),
    ),
    q({
      passageId: "p2",
      type: "summary-completion",
      prompt: "The evaluation treated flood communication as part of the ______.",
      answer: "infrastructure",
      acceptedAnswers: ["infrastructure"],
      explanation:
        "Paragraph E states that flood communication is part of the infrastructure.",
      evidenceParagraph: "Paragraph E",
      evidenceText:
        "The evaluation concluded that flood communication is part of the infrastructure.",
      whyCorrect:
        "The answer names the broader system that communication belongs to.",
      whyWrong:
        "A wrong answer such as warning is too narrow; the passage makes communication infrastructural.",
      skill: "Understanding main idea",
      secondarySkills: ["Recognising paraphrase"],
      trapType: "Partial match trap",
      strategyTip:
        "Look for the noun after 'part of' when a summary asks for a category.",
      difficulty: "Hard",
      paragraphRef: "E",
    }),
  ],
});

const manuscriptMarginsRepairTest = makeTest({
  testId: "academic-reading-015",
  slug: "manuscript-margins-and-language-change",
  legacyIds: ["realism-repair-03"],
  title: "The Manuscript's Moving Margins",
  description:
    "A weak-question-type repair mini test using strong Matching Headings, Matching Features, Matching Information and plausible MCQ options.",
  topic: "Linguistics",
  difficulty: "Hard",
  targetBand: "Band 7.0-8.0",
  timeLimitMinutes: 30,
  subtopic: "Manuscript annotation and language change",
  passages: [
    {
      passageId: "p1",
      title: "Notes That Became Text",
      topic: "Linguistics",
      sourceNote: "Original IELTS-style practice passage created for this app.",
      paragraphs: [
        { label: "A", text: "A coastal grammar manuscript from 1734 contains two kinds of writing: a neat central text and rougher notes in the margin. Earlier editors ignored the margin, assuming it was a teacher's private reminder. A recent edition argues that some marginal notes record spoken alternatives that later entered the dialect." },
        { label: "B", text: "The strongest evidence is not the notes alone but their position. Several are placed beside rules that the central text presents as settled. The margin does not merely add examples; it questions whether the rule was already changing in everyday speech." },
        { label: "C", text: "One note replaces a formal plural ending with a shorter spoken form. The change appears minor until it is compared with sailors' letters from the same port, where the shorter form appears in hurried descriptions of cargo and weather." },
        { label: "D", text: "A second note is more ambiguous. It may record a child's error, a regional form or a copyist's experiment. The editor keeps it in the edition but refuses to count it as evidence of language change without supporting examples." },
        { label: "E", text: "The manuscript therefore matters because it catches uncertainty in motion. It is not a clean record of a completed shift. It shows formal grammar, spoken practice and editorial hesitation occupying the same page." },
      ],
    },
    {
      passageId: "p2",
      title: "Who Changed the Spelling?",
      topic: "History of Science",
      sourceNote: "Original IELTS-style practice passage created for this app.",
      paragraphs: [
        { label: "A", text: "The same manuscript passed through at least three hands. The schoolmaster wrote the central grammar, a pupil added examples in brown ink, and a later collector added shelf marks in pencil. Confusing these hands can turn a cataloguing note into false linguistic evidence." },
        { label: "B", text: "Ink analysis helped separate the layers. The brown ink contained more iron than the schoolmaster's ink, while the pencil marks sat above later dust stains. The test did not date the words precisely, but it prevented all annotations from being treated as one event." },
        { label: "C", text: "The pupil's examples are valuable because they are inconsistent. Sometimes they copy the central rule; sometimes they write the shorter spoken form. That inconsistency suggests learning in progress rather than careless copying." },
        { label: "D", text: "The collector's shelf marks are linguistically useless but historically useful. They show when the manuscript entered a private library and why one page was repaired with stiff paper. That repair accidentally covered two marginal notes until conservation work lifted the edge." },
        { label: "E", text: "The revised catalogue now separates grammatical evidence, ownership evidence and conservation evidence. The categories overlap on the page, but they should not be collapsed in interpretation. A manuscript can be one object and several kinds of evidence at once." },
      ],
    },
  ],
  questions: [
    ...[
      ["p1", "A", "A neglected margin reconsidered as linguistic evidence", "A recent edition argues that some marginal notes record spoken alternatives that later entered the dialect."],
      ["p1", "B", "Why the placement of notes changes their significance", "The strongest evidence is not the notes alone but their position."],
      ["p1", "D", "An ambiguous note kept out of the main evidence count", "The editor keeps it in the edition but refuses to count it as evidence of language change without supporting examples."],
      ["p1", "E", "A page showing grammar change before it is settled", "It shows formal grammar, spoken practice and editorial hesitation occupying the same page."],
      ["p2", "E", "Separate evidence categories within one object", "A manuscript can be one object and several kinds of evidence at once."],
    ].map(([passageId, paragraphRef, answer, evidenceText]) =>
      q({
        passageId,
        type: "matching-headings",
        groupTitle: "Choose the best heading for the paragraph.",
        prompt: `Paragraph ${paragraphRef}`,
        options: [
          "A neglected margin reconsidered as linguistic evidence",
          "Why the placement of notes changes their significance",
          "An ambiguous note kept out of the main evidence count",
          "A page showing grammar change before it is settled",
          "Separate evidence categories within one object",
          "A final proof that all marginal notes are spoken forms",
          "A collector's attempt to rewrite the central grammar",
        ],
        answer,
        explanation:
          "The heading reflects the paragraph's role in the argument, not merely a term that appears there.",
        evidenceParagraph: `Paragraph ${paragraphRef}`,
        evidenceText,
        whyCorrect:
          "The heading captures the main interpretive move of the paragraph.",
        whyWrong:
          "Wrong headings exaggerate the evidence or attach a role to the wrong hand.",
        skill: "Understanding main idea",
        secondarySkills: ["Identifying paragraph function"],
        trapType: "Partial match trap",
        strategyTip:
          "For Matching Headings, choose the option that explains what the paragraph contributes.",
        difficulty: "Hard",
        paragraphRef,
      }),
    ),
    ...[
      ["p2", "Wrote the central grammar", "schoolmaster", "The schoolmaster wrote the central grammar."],
      ["p2", "Added examples in brown ink", "pupil", "A pupil added examples in brown ink."],
      ["p2", "Added shelf marks in pencil", "later collector", "A later collector added shelf marks in pencil."],
      ["p1", "Refuses to count one note as evidence without support", "editor", "The editor keeps it in the edition but refuses to count it as evidence of language change without supporting examples."],
    ].map(([passageId, prompt, answer, evidenceText]) =>
      q({
        passageId,
        type: "matching-features",
        groupTitle: "Match each action with the correct person.",
        prompt,
        options: ["schoolmaster", "pupil", "later collector", "editor", "sailors"],
        answer,
        explanation:
          "The correct option is the person explicitly linked to the action in the passage.",
        evidenceParagraph: passageId === "p1" ? "Paragraph D" : "Paragraph A",
        evidenceText,
        whyCorrect:
          "The actor-action link is stated directly.",
        whyWrong:
          "The other people are real within the passage but perform different roles.",
        skill: "Locating explicit information",
        secondarySkills: ["Understanding detail"],
        trapType: "Similar keyword trap",
        strategyTip:
          "For Matching Features, keep each hand or person separate.",
        difficulty: "Hard",
      }),
    ),
    ...[
      ["p1", "A comparison source where shorter forms appear in hurried writing", "Sailors' letters from the same port, where the shorter form appears in hurried descriptions of cargo and weather.", "C"],
      ["p2", "A test that separated annotation layers without dating words precisely", "Ink analysis helped separate the layers... The test did not date the words precisely.", "B"],
      ["p2", "A repair that hid marginal notes until conservation work", "One page was repaired with stiff paper. That repair accidentally covered two marginal notes.", "D"],
    ].map(([passageId, prompt, evidenceText, paragraphRef]) =>
      q({
        passageId,
        type: "matching-information",
        groupTitle: "Match the information to the paragraph.",
        prompt,
        options: ["A", "B", "C", "D", "E"],
        answer: paragraphRef,
        explanation:
          "The paragraph contains the complete paraphrased information, not just a related manuscript term.",
        evidenceParagraph: `Paragraph ${paragraphRef}`,
        evidenceText,
        whyCorrect:
          "The evidence sentence supplies the key source or method described.",
        whyWrong:
          "Other paragraphs mention annotation, but not the same source-method relationship.",
        skill: "Time-efficient scanning",
        secondarySkills: ["Recognising paraphrase"],
        trapType: "Wrong paragraph trap",
        strategyTip:
          "Use distinctive nouns such as sailors, ink analysis or stiff paper as scanning anchors.",
        difficulty: "Hard",
        paragraphRef,
      }),
    ),
    ...[
      ["The manuscript from 1734 contains a neat central text and rougher notes in the margin.", "True", "A coastal grammar manuscript from 1734 contains two kinds of writing: a neat central text and rougher notes in the margin.", "p1", "A"],
      ["Ink analysis precisely dated every word in the manuscript.", "False", "The test did not date the words precisely.", "p2", "B"],
      ["The passage states the exact name of the private collector.", "Not Given", "The passage mentions a later collector but does not give the person's name.", "p2", "A"],
    ].map(([prompt, answer, evidenceText, passageId, paragraphRef]) =>
      q({
        passageId,
        type: "true-false-not-given",
        prompt,
        options: ["True", "False", "Not Given"],
        answer,
        explanation:
          "The answer depends on exact comparison with the passage, especially whether a detail is supplied or merely implied.",
        evidenceParagraph: answer === "Not Given" ? "No confirming evidence" : `Paragraph ${paragraphRef}`,
        evidenceText,
        whyCorrect:
          "The statement is either supported, contradicted or not supplied by the text.",
        whyWrong:
          "Wrong choices usually come from adding precision that the passage does not provide.",
        skill: "Understanding detail",
        secondarySkills: ["Distinguishing fact from claim"],
        trapType: answer === "Not Given" ? "Not Given trap" : "Extreme wording trap",
        strategyTip:
          "For TFNG, do not infer exact names or dates beyond the passage.",
        difficulty: "Hard",
        paragraphRef: answer === "Not Given" ? undefined : paragraphRef,
      }),
    ),
    ...[
      ["Why is the position of marginal notes important?", "It shows they may question settled rules rather than simply add examples.", "The margin does not merely add examples; it questions whether the rule was already changing in everyday speech.", "p1", "B"],
      ["Why are the pupil's examples described as valuable?", "Their inconsistency suggests learning in progress.", "That inconsistency suggests learning in progress rather than careless copying.", "p2", "C"],
      ["What is the main claim of Passage 2?", "Different layers of the manuscript must be separated before interpretation.", "The categories overlap on the page, but they should not be collapsed in interpretation.", "p2", "E"],
    ].map(([prompt, answer, evidenceText, passageId, paragraphRef], index) =>
      q({
        passageId,
        type: "multiple-choice",
        prompt,
        options: [
          index === 0 ? answer : "Every marginal note is reliable proof of dialect change.",
          index === 1 ? answer : "The collector's pencil marks are the main grammatical evidence.",
          index === 2 ? answer : "The manuscript should be interpreted as one undifferentiated event.",
          "Sailors' letters make manuscript evidence unnecessary.",
        ],
        answer,
        explanation:
          "The correct option keeps the passage's evidential caution; the distractors flatten layers or exaggerate one source.",
        evidenceParagraph: `Paragraph ${paragraphRef}`,
        evidenceText,
        whyCorrect:
          "The answer matches the interpretive reason given in the passage.",
        whyWrong:
          "The wrong options are tempting because they use real terms but ignore the passage's limits.",
        skill: "Making inference",
        secondarySkills: ["Understanding main idea"],
        trapType: "Overgeneralisation trap",
        strategyTip:
          "In evidence-history passages, avoid options that collapse distinct layers into one simple conclusion.",
        difficulty: "Hard",
        paragraphRef,
      }),
    ),
    q({
      passageId: "p2",
      type: "flow-chart-completion",
      prompt: "Ink analysis separates layers -> annotations are not treated as one ______.",
      answer: "event",
      acceptedAnswers: ["event", "one event"],
      explanation:
        "Paragraph B says ink analysis prevented all annotations from being treated as one event.",
      evidenceParagraph: "Paragraph B",
      evidenceText:
        "It prevented all annotations from being treated as one event.",
      whyCorrect:
        "The answer completes the methodological outcome of separating layers.",
      whyWrong:
        "A wrong answer such as word refers to dating precision, not the interpretive grouping.",
      skill: "Recognising cause and effect",
      secondarySkills: ["Understanding detail"],
      trapType: "Cause-effect confusion",
      strategyTip:
        "For flow charts, identify what the method prevents or enables.",
      difficulty: "Hard",
      paragraphRef: "B",
    }),
    q({
      passageId: "p2",
      type: "diagram-label-completion",
      groupTitle: "Text schematic: Manuscript evidence layers",
      prompt: "central grammar + pupil examples + collector marks + conservation repair -> [label 20]",
      answer: "several kinds of evidence",
      acceptedAnswers: ["several kinds of evidence", "different evidence categories"],
      explanation:
        "The schematic compresses Paragraph E's claim that one manuscript can contain several evidence categories.",
      evidenceParagraph: "Paragraph E",
      evidenceText:
        "A manuscript can be one object and several kinds of evidence at once.",
      whyCorrect:
        "The label names the interpretive result of separating the layers.",
      whyWrong:
        "A wrong answer such as one event contradicts the passage's warning.",
      skill: "Making inference",
      secondarySkills: ["Following reference words"],
      trapType: "Partial match trap",
      strategyTip:
        "For diagram labels, ask what the combined parts represent in the argument.",
      difficulty: "Hard",
      paragraphRef: "E",
    }),
  ],
});

export const readingTests: ReadingTest[] = [
  urbanHeatTest,
  pigmentTest,
  algorithmsTest,
  reefSoundTest,
  defaultsTest,
  caveMineralsTest,
  museumSeedsTest,
  schoolTimetableTest,
  gestureGrammarTest,
  memoryReconstructionTest,
  modelUncertaintyTest,
  conservationTradeoffsTest,
  portArchiveRepairTest,
  floodGateRepairTest,
  manuscriptMarginsRepairTest,
];

export function getTestRouteParams() {
  const params = new Set<string>();

  for (const test of readingTests) {
    params.add(test.slug);
    params.add(test.testId);
    test.legacyIds?.forEach((legacyId) => params.add(legacyId));
  }

  return [...params].map((testId) => ({ testId }));
}

export function getTestById(testId: string): ReadingTest | undefined {
  return readingTests.find(
    (test) => test.testId === testId || test.slug === testId || test.legacyIds?.includes(testId),
  );
}

export function getRecommendedNextTest(currentTestId: string, score: number) {
  const currentTest = getTestById(currentTestId);
  const currentIndex = readingTests.findIndex((test) => test.testId === currentTest?.testId);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;

  if (score >= 16) {
    return readingTests[Math.min(safeIndex + 1, readingTests.length - 1)];
  }
  if (score >= 12) {
    return readingTests[Math.min(safeIndex + 1, readingTests.length - 1)];
  }
  return readingTests[Math.max(safeIndex - 1, 0)];
}
