import type {
  DrillSet,
  Passage,
  PracticeMode,
  Question,
  QuestionType,
  ReadingDifficulty,
  SkillTag,
  TrapType,
} from "./types";
import {
  buildDrillMetadata,
  buildDrillRelationships,
  buildPassageMetadata,
  buildQuestionMetadata,
  inferTargetBand,
  inferTopicFocus,
  recommendationCategoryForDrill,
} from "@/lib/content-metadata";

type PassageSeed = Omit<Passage, "metadata">;
type QuestionSeed = Omit<Question, "id" | "questionNumber" | "tags" | "metadata">;

type DrillSeed = {
  drillId: string;
  title: string;
  practiceMode: PracticeMode;
  questionType?: QuestionType;
  skill?: SkillTag;
  skillFocus: SkillTag[];
  trapFocus: TrapType[];
  difficulty: ReadingDifficulty;
  estimatedTimeMinutes: number;
  description: string;
  strategyLessonId: string;
  passages: PassageSeed[];
  questions: QuestionSeed[];
};

function tagSlug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function makePassage(passage: PassageSeed, difficulty: ReadingDifficulty, batchId: string): Passage {
  return {
    ...passage,
    metadata: buildPassageMetadata(passage, {
      difficulty,
      estimatedBand: inferTargetBand(difficulty),
      subtopic: passage.topic,
      batchId,
    }),
  };
}

function makeQuestion(question: QuestionSeed, index: number, drillId: string): Question {
  const questionWithoutMetadata: Omit<Question, "metadata"> = {
    ...question,
    id: index + 1,
    questionNumber: index + 1,
    tags: [
      "academic-reading",
      "phase-3a-realism",
      "drill-native",
      drillId,
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

function makeDrill(seed: DrillSeed): DrillSet {
  const passages = seed.passages.map((passage) => makePassage(passage, seed.difficulty, "phase-3a-realism-drills"));
  const questions = seed.questions.map((question, index) => makeQuestion(question, index, seed.drillId));
  const drillWithoutMetadata: Omit<DrillSet, "metadata"> = {
    drillId: seed.drillId,
    title: seed.title,
    practiceMode: seed.practiceMode,
    questionType: seed.questionType,
    skill: seed.skill,
    skillFocus: seed.skillFocus,
    trapFocus: seed.trapFocus,
    difficulty: seed.difficulty,
    targetBand: inferTargetBand(seed.difficulty),
    estimatedTimeMinutes: seed.estimatedTimeMinutes,
    totalQuestions: questions.length,
    topicFocus: inferTopicFocus(passages),
    recommendationCategory: recommendationCategoryForDrill(seed),
    description: seed.description,
    strategyLessonId: seed.strategyLessonId,
    passages,
    questions,
    tags: [
      "academic-reading",
      "focused-drill",
      "phase-3a-realism",
      "drill-native",
      seed.practiceMode,
      seed.questionType ?? "skill-practice",
      seed.skill ?? "question-type-practice",
      tagSlug(seed.difficulty),
    ],
    relationships: [],
  };

  return {
    ...drillWithoutMetadata,
    relationships: buildDrillRelationships(drillWithoutMetadata),
    metadata: buildDrillMetadata(drillWithoutMetadata),
  };
}

function q(input: QuestionSeed): QuestionSeed {
  return input;
}

const drillSeeds: DrillSeed[] = [
  {
    drillId: "tfng-drill-001",
    title: "True / False / Not Given Drill: Exact Scope",
    practiceMode: "question-type",
    questionType: "true-false-not-given",
    skillFocus: ["Understanding detail", "Avoiding overgeneralisation"],
    trapFocus: ["Extreme wording trap", "Not Given trap", "Overgeneralisation trap"],
    difficulty: "Medium",
    estimatedTimeMinutes: 8,
    description: "Practise checking exact scope in statements about community noise and sleep.",
    strategyLessonId: "strategy-tfng",
    passages: [
      {
        passageId: "p1",
        title: "Night Noise and Sleep Windows",
        topic: "Public Health",
        sourceNote: "Original IELTS-style practice passage created for this app.",
        paragraphs: [
          {
            label: "A",
            text:
              "A city health team studied night noise in apartments near an elevated railway. Instead of measuring the loudest single event, they focused on quiet windows: stretches of at least ninety minutes in which residents were unlikely to be woken by passing trains. The measure was chosen after interviews suggested that repeated mild interruptions were more harmful than one dramatic sound.",
          },
          {
            label: "B",
            text:
              "The team installed monitors in forty apartments, but only twenty-eight produced complete data for the full month. Several residents switched off the monitors during family visits, and two apartments were excluded because renovation work inside the building made the railway data impossible to interpret.",
          },
          {
            label: "C",
            text:
              "The final report recommended rubber pads under a short section of track. It did not recommend closing the line at night. Engineers predicted that the pads would reduce vibration more than airborne noise, so the health team described the proposal as a partial intervention rather than a complete sleep policy.",
          },
        ],
      },
    ],
    questions: [
      q({
        passageId: "p1",
        type: "true-false-not-given",
        prompt: "The study measured the loudest single train noise as its main indicator.",
        options: ["True", "False", "Not Given"],
        answer: "False",
        explanation:
          "Paragraph A says the team focused on quiet windows instead of the loudest single event.",
        evidenceParagraph: "Paragraph A",
        evidenceText:
          "Instead of measuring the loudest single event, they focused on quiet windows.",
        whyCorrect:
          "The statement reverses the measure used in the study.",
        whyWrong:
          "A reader may notice noise measurement and assume the loudest sound was the focus.",
        skill: "Understanding detail",
        secondarySkills: ["Recognising contrast"],
        trapType: "Opposite meaning trap",
        strategyTip:
          "In TFNG, contrast markers such as instead of often decide whether a statement is false.",
        difficulty: "Medium",
        paragraphRef: "A",
      }),
      q({
        passageId: "p1",
        type: "true-false-not-given",
        prompt: "All forty apartments produced complete data for the whole month.",
        options: ["True", "False", "Not Given"],
        answer: "False",
        explanation:
          "Paragraph B says only twenty-eight apartments produced complete data.",
        evidenceParagraph: "Paragraph B",
        evidenceText:
          "The team installed monitors in forty apartments, but only twenty-eight produced complete data for the full month.",
        whyCorrect:
          "All forty contradicts only twenty-eight.",
        whyWrong:
          "The number forty is mentioned, but it refers to installation, not complete data.",
        skill: "Avoiding overgeneralisation",
        secondarySkills: ["Understanding comparison"],
        trapType: "Extreme wording trap",
        strategyTip:
          "Check universal claims against limiting words such as only, several and excluded.",
        difficulty: "Medium",
        paragraphRef: "B",
      }),
      q({
        passageId: "p1",
        type: "true-false-not-given",
        prompt: "The report gave the exact cost of installing rubber pads.",
        options: ["True", "False", "Not Given"],
        answer: "Not Given",
        explanation:
          "Paragraph C recommends rubber pads but gives no cost information.",
        evidenceParagraph: "No specific paragraph",
        evidenceText:
          "The passage mentions rubber pads but does not state how much they would cost.",
        whyCorrect:
          "The topic appears, but the specific cost is not provided.",
        whyWrong:
          "A common error is choosing True because the object is mentioned, even though the requested detail is absent.",
        skill: "Distinguishing fact from claim",
        secondarySkills: ["Locating explicit information"],
        trapType: "Not Given trap",
        strategyTip:
          "Choose Not Given when the passage mentions the topic but not the exact claim.",
        difficulty: "Medium",
      }),
      q({
        passageId: "p1",
        type: "true-false-not-given",
        prompt: "The health team described the rubber-pad proposal as a complete sleep policy.",
        options: ["True", "False", "Not Given"],
        answer: "False",
        explanation:
          "Paragraph C says the proposal was described as a partial intervention, not a complete sleep policy.",
        evidenceParagraph: "Paragraph C",
        evidenceText:
          "The health team described the proposal as a partial intervention rather than a complete sleep policy.",
        whyCorrect:
          "The statement directly contradicts the passage's partial rather than complete distinction.",
        whyWrong:
          "The word policy appears in the evidence, but the passage rejects that label for the proposal.",
        skill: "Understanding detail",
        secondarySkills: ["Recognising contrast"],
        trapType: "Opposite meaning trap",
        strategyTip:
          "Do not stop at a repeated phrase; check whether the sentence accepts or rejects it.",
        difficulty: "Medium",
        paragraphRef: "C",
      }),
      q({
        passageId: "p1",
        type: "true-false-not-given",
        prompt: "Residents' interviews suggested that repeated mild interruptions were more harmful than one dramatic sound.",
        options: ["True", "False", "Not Given"],
        answer: "True",
        explanation:
          "Paragraph A says interviews suggested that repeated mild interruptions were more harmful than one dramatic sound.",
        evidenceParagraph: "Paragraph A",
        evidenceText:
          "Interviews suggested that repeated mild interruptions were more harmful than one dramatic sound.",
        whyCorrect:
          "The statement preserves the comparison made in the passage.",
        whyWrong:
          "Both types of noise are mentioned, so the direction of comparison is the key.",
        skill: "Understanding comparison",
        secondarySkills: ["Understanding detail"],
        trapType: "Comparison confusion",
        strategyTip:
          "When a statement compares two things, verify which one the passage says is greater or more important.",
        difficulty: "Medium",
        paragraphRef: "A",
      }),
    ],
  },
  {
    drillId: "matching-headings-drill-001",
    title: "Matching Headings Drill: Paragraph Function",
    practiceMode: "question-type",
    questionType: "matching-headings",
    skillFocus: ["Understanding main idea", "Identifying paragraph function"],
    trapFocus: ["Partial match trap", "Similar keyword trap"],
    difficulty: "Medium",
    estimatedTimeMinutes: 8,
    description: "Practise choosing headings that capture paragraph purpose, not isolated details.",
    strategyLessonId: "strategy-matching-headings",
    passages: [
      {
        passageId: "p1",
        title: "The Unfinished Archive of Birdsong",
        topic: "Environmental Science",
        sourceNote: "Original IELTS-style practice passage created for this app.",
        paragraphs: [
          {
            label: "A",
            text:
              "Early recordings of wetland birds were made with heavy equipment and uneven patience. Some recordists captured entire dawn choruses; others switched on the machine only after a rare call had already begun. The archive is therefore valuable, but it is not a simple record of what birds sounded like in the past.",
          },
          {
            label: "B",
            text:
              "A recent project began by digitising the tapes, but its harder task was descriptive. Staff had to note weather, time of day and the recordist's position when that information was available. Without those details, a quiet tape might indicate fewer birds, a distant microphone or a windy morning.",
          },
          {
            label: "C",
            text:
              "The project also invited local birdwatchers to identify calls that software labelled uncertain. Their knowledge improved several records, particularly for species with regional call variations. However, the team kept the uncertain label whenever volunteers disagreed, rather than forcing agreement for the sake of a tidy database.",
          },
          {
            label: "D",
            text:
              "Conservation planners were most interested in absences. If a species had once been common in a marsh and later disappeared from the recordings, the site became a candidate for habitat review. The planners treated this as a clue, not proof, because recording habits had changed over time.",
          },
          {
            label: "E",
            text:
              "The archive's main lesson is methodological humility. Old sounds can guide present decisions, but only when their gaps are preserved rather than hidden. A perfect-looking database would be less honest than one that shows where listening was partial.",
          },
        ],
      },
    ],
    questions: ["A", "B", "C", "D", "E"].map((paragraph, index) =>
      q({
        passageId: "p1",
        type: "matching-headings",
        groupTitle: "Choose the best heading for each paragraph.",
        prompt: `Paragraph ${paragraph}`,
        options: [
          "Using absence as a cautious planning clue",
          "Why contextual details matter in sound records",
          "A warning against hiding archival gaps",
          "The uneven origins of a valuable archive",
          "Expert help without forced certainty",
        ],
        answer: [
          "The uneven origins of a valuable archive",
          "Why contextual details matter in sound records",
          "Expert help without forced certainty",
          "Using absence as a cautious planning clue",
          "A warning against hiding archival gaps",
        ][index],
        explanation: [
          "Paragraph A explains why the archive is valuable but uneven because early recording practices varied.",
          "Paragraph B focuses on the need for weather, time and position details to interpret recordings.",
          "Paragraph C describes volunteer expertise while preserving uncertainty when volunteers disagreed.",
          "Paragraph D explains how missing species records can guide habitat review cautiously.",
          "Paragraph E states the broader lesson: preserve gaps rather than hiding them.",
        ][index],
        evidenceParagraph: `Paragraph ${paragraph}`,
        evidenceText: [
          "The archive is therefore valuable, but it is not a simple record of what birds sounded like in the past.",
          "Without those details, a quiet tape might indicate fewer birds, a distant microphone or a windy morning.",
          "The team kept the uncertain label whenever volunteers disagreed, rather than forcing agreement for the sake of a tidy database.",
          "The planners treated this as a clue, not proof, because recording habits had changed over time.",
          "Old sounds can guide present decisions, but only when their gaps are preserved rather than hidden.",
        ][index],
        whyCorrect: [
          "The heading captures the origin and limitation of the archive.",
          "The heading captures the paragraph's function: context changes interpretation.",
          "The heading captures both volunteer expertise and retained uncertainty.",
          "The heading captures the use of absence as evidence with caution.",
          "The heading captures the concluding warning about honest gaps.",
        ][index],
        whyWrong:
          "A tempting wrong heading may repeat a detail from the paragraph while missing its overall function.",
        skill: "Understanding main idea",
        secondarySkills: ["Identifying paragraph function"],
        trapType: "Partial match trap",
        strategyTip:
          "Reduce the paragraph to one sentence before comparing headings.",
        difficulty: "Medium",
        paragraphRef: paragraph,
      }),
    ),
  },
  {
    drillId: "matching-information-drill-001",
    title: "Matching Information Drill: Scanning Across Similar Details",
    practiceMode: "question-type",
    questionType: "matching-information",
    skillFocus: ["Locating explicit information", "Time-efficient scanning"],
    trapFocus: ["Wrong paragraph trap", "Similar keyword trap"],
    difficulty: "Medium",
    estimatedTimeMinutes: 8,
    description: "Practise locating precise information in paragraphs with related terminology.",
    strategyLessonId: "strategy-matching-information",
    passages: [
      {
        passageId: "p1",
        title: "Mapping Underground Water",
        topic: "Environmental Science",
        sourceNote: "Original IELTS-style practice passage created for this app.",
        paragraphs: [
          { label: "A", text: "A farming district began mapping underground water after wells near the coast turned slightly salty. The first map used old drilling records, which were detailed in some villages and almost absent in others." },
          { label: "B", text: "Engineers then added electrical-resistance surveys. These surveys were quick, but clay soils sometimes produced signals that looked like deeper water, so the results needed field checks." },
          { label: "C", text: "Farmers contributed notebooks showing when pumps failed during dry months. The notebooks did not measure water depth, yet they showed where shortages affected daily work before instruments arrived." },
          { label: "D", text: "A trial recharge basin was built beside an abandoned canal. Rainwater collected there moved underground slowly, and monitoring showed a small improvement in two inland wells after six months." },
          { label: "E", text: "The final map used shading to show uncertainty. Officials avoided publishing a single sharp boundary because the groundwater edge shifted with rainfall and pumping pressure." },
        ],
      },
    ],
    questions: [
      ["Which paragraph mentions farmer notebooks as evidence?", "C", "Farmers contributed notebooks showing when pumps failed during dry months."],
      ["Which paragraph explains why a clear boundary was not published?", "E", "Officials avoided publishing a single sharp boundary because the groundwater edge shifted with rainfall and pumping pressure."],
      ["Which paragraph describes a method that could be confused by clay soils?", "B", "Clay soils sometimes produced signals that looked like deeper water."],
      ["Which paragraph reports improvement after a recharge basin was tested?", "D", "Monitoring showed a small improvement in two inland wells after six months."],
      ["Which paragraph refers to unequal availability of old records?", "A", "The first map used old drilling records, which were detailed in some villages and almost absent in others."],
    ].map(([prompt, answer, evidence]) =>
      q({
        passageId: "p1",
        type: "matching-information",
        groupTitle: "Match the information to the paragraph.",
        prompt,
        options: ["A", "B", "C", "D", "E"],
        answer,
        explanation: `Paragraph ${answer} contains the requested information.`,
        evidenceParagraph: `Paragraph ${answer}`,
        evidenceText: evidence,
        whyCorrect:
          "The correct paragraph contains the whole requested idea, not only a related water-management word.",
        whyWrong:
          "Wrong choices are likely if you stop at a related term before confirming the full detail.",
        skill: "Time-efficient scanning",
        secondarySkills: ["Locating explicit information"],
        trapType: "Wrong paragraph trap",
        strategyTip:
          "Scan for distinctive nouns first, then read the full sentence before selecting the paragraph.",
        difficulty: "Medium",
        paragraphRef: answer,
      }),
    ),
  },
  {
    drillId: "summary-completion-drill-001",
    title: "Summary Completion Drill: Grammar and Meaning",
    practiceMode: "question-type",
    questionType: "summary-completion",
    skillFocus: ["Recognising paraphrase", "Understanding detail"],
    trapFocus: ["Synonym trap", "Grammar form trap"],
    difficulty: "Medium",
    estimatedTimeMinutes: 8,
    description: "Practise completing a summary with words that fit both passage meaning and sentence grammar.",
    strategyLessonId: "strategy-summary-completion",
    passages: [
      {
        passageId: "p1",
        title: "Bamboo in Engineered Materials",
        topic: "Technology and Society",
        sourceNote: "Original IELTS-style practice passage created for this app.",
        paragraphs: [
          { label: "A", text: "Bamboo is often praised as a sustainable material, but engineers are more cautious than advertisers. Untreated bamboo absorbs moisture unevenly, and its strength changes along the length of a single stem." },
          { label: "B", text: "A materials laboratory tested laminated bamboo panels made from thin strips. The panels performed best when the strips were rotated before pressing, because this reduced weakness along natural fibre lines." },
          { label: "C", text: "The team also found that heat treatment improved dimensional stability. However, excessive heating made the material brittle, so the process had to balance stability with toughness." },
          { label: "D", text: "The researchers concluded that bamboo could be reliable in modular housing if factories controlled moisture, strip orientation and heating time. They did not recommend using raw stems as structural beams." },
        ],
      },
    ],
    questions: [
      ["Engineers are cautious because untreated bamboo absorbs ______ unevenly.", "moisture", "Untreated bamboo absorbs moisture unevenly."],
      ["Laminated panels used thin ______ of bamboo.", "strips", "A materials laboratory tested laminated bamboo panels made from thin strips."],
      ["Rotating the strips reduced weakness along natural ______ lines.", "fibre", "This reduced weakness along natural fibre lines."],
      ["Too much heating made the material ______.", "brittle", "Excessive heating made the material brittle."],
      ["The study supported controlled modular housing, not raw stems used as structural ______.", "beams", "They did not recommend using raw stems as structural beams."],
    ].map(([prompt, answer, evidence]) =>
      q({
        passageId: "p1",
        type: "summary-completion",
        prompt,
        answer,
        acceptedAnswers: [answer],
        explanation: `The missing word is ${answer}; it fits both the passage evidence and the grammar of the summary.`,
        evidenceParagraph: "Passage evidence",
        evidenceText: evidence,
        whyCorrect:
          "The summary paraphrases the passage but preserves the same technical relationship.",
        whyWrong:
          "A wrong word may come from the same paragraph but fail to fit the grammar or the exact meaning of the gap.",
        skill: "Recognising paraphrase",
        secondarySkills: ["Understanding detail"],
        trapType: "Grammar form trap",
        strategyTip:
          "Predict the word form before searching the passage; then confirm the exact evidence.",
        difficulty: "Medium",
        maxWords: 1,
      }),
    ),
  },
  {
    drillId: "sentence-completion-drill-001",
    title: "Sentence Completion Drill: Exact Technical Details",
    practiceMode: "question-type",
    questionType: "sentence-completion",
    skillFocus: ["Understanding detail", "Understanding vocabulary in context"],
    trapFocus: ["Grammar form trap", "Similar keyword trap"],
    difficulty: "Medium",
    estimatedTimeMinutes: 7,
    description: "Practise completing sentences with concise technical details from the passage.",
    strategyLessonId: "strategy-sentence-completion",
    passages: [
      {
        passageId: "p1",
        title: "Reading Rivers Through Sediment",
        topic: "Environmental Science",
        sourceNote: "Original IELTS-style practice passage created for this app.",
        paragraphs: [
          { label: "A", text: "River scientists sometimes read floods through sediment rather than water. After a flood, heavier grains settle quickly near bends, while fine silt can travel into fields and drainage channels." },
          { label: "B", text: "A recent study used sediment cores from a floodplain to compare older flood layers. The darkest layers contained charcoal fragments, suggesting that fires upstream had changed the material washed into the river." },
          { label: "C", text: "The study did not date floods by memory or local stories alone. Researchers used pollen changes and radiocarbon samples to estimate when the largest deposits had formed." },
        ],
      },
    ],
    questions: [
      ["Heavier grains settle quickly near ______.", "bends", "Heavier grains settle quickly near bends."],
      ["Fine silt can travel into fields and ______.", "drainage channels", "Fine silt can travel into fields and drainage channels."],
      ["The study compared older flood layers by using sediment ______.", "cores", "A recent study used sediment cores from a floodplain to compare older flood layers."],
      ["The darkest layers contained ______ fragments.", "charcoal", "The darkest layers contained charcoal fragments."],
      ["Researchers used pollen changes and ______ samples to estimate dates.", "radiocarbon", "Researchers used pollen changes and radiocarbon samples to estimate when the largest deposits had formed."],
    ].map(([prompt, answer, evidence]) =>
      q({
        passageId: "p1",
        type: "sentence-completion",
        prompt,
        answer,
        acceptedAnswers: [answer],
        explanation: `The answer is ${answer}, which completes the sentence with the exact passage detail.`,
        evidenceParagraph: "Passage evidence",
        evidenceText: evidence,
        whyCorrect:
          "The answer fits the grammar after the blank and matches the named detail in the passage.",
        whyWrong:
          "A wrong answer may be a nearby technical noun that does not complete the sentence accurately.",
        skill: "Understanding detail",
        secondarySkills: ["Locating explicit information"],
        trapType: "Similar keyword trap",
        strategyTip:
          "Check the words immediately before and after the blank before copying from the passage.",
        difficulty: "Medium",
        maxWords: answer.includes(" ") ? 2 : 1,
      }),
    ),
  },
  {
    drillId: "multiple-choice-drill-001",
    title: "Multiple Choice Drill: Plausible Distractors",
    practiceMode: "question-type",
    questionType: "multiple-choice",
    skillFocus: ["Recognising paraphrase", "Making inference"],
    trapFocus: ["Distractor detail trap", "Overgeneralisation trap"],
    difficulty: "Hard",
    estimatedTimeMinutes: 9,
    description: "Practise eliminating plausible but unsupported interpretations.",
    strategyLessonId: "strategy-multiple-choice",
    passages: [
      {
        passageId: "p1",
        title: "Volunteer Data in Astronomy",
        topic: "Astronomy",
        sourceNote: "Original IELTS-style practice passage created for this app.",
        paragraphs: [
          { label: "A", text: "Small observatories often collect more sky images than professional teams can inspect. Volunteer classifiers help by marking possible variable stars, but their markings are not treated as final discoveries." },
          { label: "B", text: "The strongest volunteer contribution is not speed alone. When many observers mark the same faint change independently, researchers gain a reason to examine the star with calibrated instruments." },
          { label: "C", text: "The system has limits. Volunteers tend to notice dramatic brightness changes more readily than gradual ones, so the database can overrepresent sudden events unless researchers correct for that bias." },
          { label: "D", text: "For this reason, the project publishes uncertainty scores beside each candidate. The scores do not discourage volunteers; instead, they show which objects need professional follow-up before any claim is made." },
        ],
      },
    ],
    questions: [
      q({
        passageId: "p1",
        type: "multiple-choice",
        prompt: "How are volunteer markings treated in the project?",
        options: [
          "As useful signals that require later professional checking",
          "As final discoveries once a single volunteer submits them",
          "As unreliable data that professional teams ignore",
          "As replacements for calibrated instruments",
        ],
        answer: "As useful signals that require later professional checking",
        explanation:
          "Paragraphs A and D show that volunteer markings are useful but need follow-up before claims are made.",
        evidenceParagraph: "Paragraphs A and D",
        evidenceText:
          "Their markings are not treated as final discoveries. The scores show which objects need professional follow-up before any claim is made.",
        whyCorrect:
          "The option preserves both usefulness and the need for verification.",
        whyWrong:
          "The distractors either overstate volunteer authority or dismiss it completely.",
        skill: "Distinguishing fact from claim",
        secondarySkills: ["Recognising paraphrase"],
        trapType: "Distractor detail trap",
        strategyTip:
          "Choose the option that keeps the passage's qualification, not the most dramatic version.",
        difficulty: "Hard",
      }),
      q({
        passageId: "p1",
        type: "multiple-choice",
        prompt: "Why can the database overrepresent sudden events?",
        options: [
          "Professional teams remove gradual changes from the archive.",
          "Volunteers notice dramatic brightness changes more easily.",
          "Calibrated instruments cannot detect faint stars.",
          "Uncertainty scores are hidden from researchers.",
        ],
        answer: "Volunteers notice dramatic brightness changes more easily.",
        explanation:
          "Paragraph C states that volunteers tend to notice dramatic changes more readily than gradual ones.",
        evidenceParagraph: "Paragraph C",
        evidenceText:
          "Volunteers tend to notice dramatic brightness changes more readily than gradual ones.",
        whyCorrect:
          "The answer identifies the bias in human attention.",
        whyWrong:
          "Other options invent causes that the passage does not mention.",
        skill: "Recognising cause and effect",
        secondarySkills: ["Understanding detail"],
        trapType: "Cause-effect confusion",
        strategyTip:
          "For why questions, find the causal sentence before checking options.",
        difficulty: "Medium",
        paragraphRef: "C",
      }),
      q({
        passageId: "p1",
        type: "multiple-choice",
        prompt: "What does agreement among many observers provide?",
        options: [
          "A reason for researchers to examine the star with calibrated instruments",
          "Proof that the star is already a confirmed discovery",
          "A way to avoid uncertainty scores",
          "Evidence that gradual changes are easier to detect",
        ],
        answer: "A reason for researchers to examine the star with calibrated instruments",
        explanation:
          "Paragraph B says independent agreement gives researchers a reason to examine the star with calibrated instruments.",
        evidenceParagraph: "Paragraph B",
        evidenceText:
          "When many observers mark the same faint change independently, researchers gain a reason to examine the star with calibrated instruments.",
        whyCorrect:
          "The answer keeps the modest strength of the evidence: a reason for follow-up, not proof.",
        whyWrong:
          "The strongest trap is treating a reason to examine as a confirmed discovery.",
        skill: "Making inference",
        secondarySkills: ["Avoiding overgeneralisation"],
        trapType: "Overgeneralisation trap",
        strategyTip:
          "Do not turn preliminary evidence into proof unless the passage does.",
        difficulty: "Hard",
        paragraphRef: "B",
      }),
      q({
        passageId: "p1",
        type: "multiple-choice",
        prompt: "What is the function of uncertainty scores?",
        options: [
          "To rank volunteers according to their speed",
          "To hide weak candidates from public view",
          "To identify objects needing professional follow-up",
          "To prevent volunteers from marking faint changes",
        ],
        answer: "To identify objects needing professional follow-up",
        explanation:
          "Paragraph D says uncertainty scores show which objects need professional follow-up.",
        evidenceParagraph: "Paragraph D",
        evidenceText:
          "They show which objects need professional follow-up before any claim is made.",
        whyCorrect:
          "The option accurately states the practical function of the scores.",
        whyWrong:
          "The wrong options attach the scores to volunteer management or concealment, which the passage does not support.",
        skill: "Understanding detail",
        secondarySkills: ["Locating explicit information"],
        trapType: "Distractor detail trap",
        strategyTip:
          "When an option names the function of a tool, check the verb phrase in the evidence sentence.",
        difficulty: "Medium",
        paragraphRef: "D",
      }),
      q({
        passageId: "p1",
        type: "multiple-choice",
        prompt: "What is the writer's overall view of volunteer classification?",
        options: [
          "It is valuable when combined with correction, uncertainty and professional verification.",
          "It has made professional astronomy unnecessary for routine discoveries.",
          "It is too biased to contribute to astronomical research.",
          "It works only for gradual changes in faint stars.",
        ],
        answer: "It is valuable when combined with correction, uncertainty and professional verification.",
        explanation:
          "The passage presents volunteer classification as useful but limited by bias and requiring follow-up.",
        evidenceParagraph: "Passage-wide evidence",
        evidenceText:
          "Volunteer classifiers help; the database can overrepresent sudden events unless researchers correct for that bias; objects need professional follow-up before any claim is made.",
        whyCorrect:
          "The answer preserves the balanced argument across the passage.",
        whyWrong:
          "The distractors exaggerate either the strength or weakness of volunteer work.",
        skill: "Understanding main idea",
        secondarySkills: ["Recognising paraphrase"],
        trapType: "Partial match trap",
        strategyTip:
          "For overall-view questions, choose the option that includes both value and limitation.",
        difficulty: "Hard",
      }),
    ],
  },
  {
    drillId: "recognising-paraphrase-drill-001",
    title: "Recognising Paraphrase Drill: Meaning Without Shared Keywords",
    practiceMode: "skill",
    skill: "Recognising paraphrase",
    skillFocus: ["Recognising paraphrase", "Understanding detail"],
    trapFocus: ["Synonym trap", "Similar keyword trap"],
    difficulty: "Medium",
    estimatedTimeMinutes: 8,
    description: "Practise matching question meaning to passage wording with low keyword overlap.",
    strategyLessonId: "strategy-paraphrase",
    passages: [
      {
        passageId: "p1",
        title: "Changing School Start Times",
        topic: "Education",
        sourceNote: "Original IELTS-style practice passage created for this app.",
        paragraphs: [
          { label: "A", text: "A district delayed secondary-school start times by thirty-five minutes. Attendance improved only slightly, but late-morning concentration rose in classes that had previously shown the steepest drop in attention." },
          { label: "B", text: "The change was hardest for students who cared for younger siblings after school. Some families had to rearrange informal childcare, so the district added supervised study rooms before sports practices began." },
          { label: "C", text: "Teachers reported fewer first-period quizzes left blank. They did not claim that grades rose immediately; instead, they described students as more able to begin difficult tasks without extended prompting." },
        ],
      },
    ],
    questions: [
      ["The timetable shift produced a large rise in attendance.", "False", "Attendance improved only slightly."],
      ["Students showed better focus later in the morning.", "True", "Late-morning concentration rose."],
      ["Some families needed to change childcare arrangements.", "True", "Some families had to rearrange informal childcare."],
      ["Teachers said examination grades improved at once.", "False", "They did not claim that grades rose immediately."],
      ["Students needed less prompting before starting demanding work.", "True", "Students were more able to begin difficult tasks without extended prompting."],
    ].map(([prompt, answer, evidence]) =>
      q({
        passageId: "p1",
        type: "true-false-not-given",
        prompt,
        options: ["True", "False", "Not Given"],
        answer,
        explanation:
          answer === "True"
            ? "The statement paraphrases the passage accurately."
            : "The statement changes the strength or direction of the passage evidence.",
        evidenceParagraph: "Passage evidence",
        evidenceText: evidence,
        whyCorrect:
          "The correct answer depends on matching meaning, not identical vocabulary.",
        whyWrong:
          "A wrong answer is likely if you match a general topic but miss the strength of the claim.",
        skill: "Recognising paraphrase",
        secondarySkills: ["Understanding detail"],
        trapType: answer === "False" ? "Overgeneralisation trap" : "Synonym trap",
        strategyTip:
          "Translate both the question and evidence into simpler meaning before deciding.",
        difficulty: "Medium",
      }),
    ),
  },
  {
    drillId: "main-idea-drill-001",
    title: "Main Idea Drill: Dense Paragraph Purpose",
    practiceMode: "skill",
    skill: "Understanding main idea",
    skillFocus: ["Understanding main idea", "Identifying paragraph function"],
    trapFocus: ["Partial match trap", "Similar keyword trap"],
    difficulty: "Medium",
    estimatedTimeMinutes: 8,
    description: "Practise identifying the controlling idea of paragraphs with several attractive details.",
    strategyLessonId: "strategy-main-idea",
    passages: [
      {
        passageId: "p1",
        title: "Urban Commons and Shared Responsibility",
        topic: "Sociology",
        sourceNote: "Original IELTS-style practice passage created for this app.",
        paragraphs: [
          { label: "A", text: "A community garden is often described as open space, but openness is never automatic. Someone has to unlock the gate, settle disputes about plots and decide whether visitors may pick herbs without joining the waiting list." },
          { label: "B", text: "Digital booking systems can make shared rooms easier to reserve, yet they can also favour residents with reliable internet access. A fair system may therefore need both online tools and noticeboards in places people already visit." },
          { label: "C", text: "Some housing cooperatives rotate maintenance tasks to prevent a small group from carrying the work. The rotation improves fairness, although it may slow repairs when new volunteers need guidance." },
          { label: "D", text: "The most successful commons are not those without rules. They are spaces where rules remain visible, revisable and connected to the people affected by them." },
          { label: "E", text: "Urban commons fail when they are romanticised as naturally cooperative. Their value depends less on goodwill alone than on the quiet administrative labour that keeps access possible." },
        ],
      },
    ],
    questions: ["A", "B", "C", "D", "E"].map((paragraph, index) =>
      q({
        passageId: "p1",
        type: "matching-headings",
        groupTitle: "Choose the best heading for each paragraph.",
        prompt: `Paragraph ${paragraph}`,
        options: [
          "Rules as a condition of successful shared space",
          "The hidden work behind apparent openness",
          "A warning against idealising cooperation",
          "Fairness and delay in rotating duties",
          "Access problems in digital booking",
        ],
        answer: [
          "The hidden work behind apparent openness",
          "Access problems in digital booking",
          "Fairness and delay in rotating duties",
          "Rules as a condition of successful shared space",
          "A warning against idealising cooperation",
        ][index],
        explanation:
          "The correct heading captures the paragraph's main purpose rather than one example.",
        evidenceParagraph: `Paragraph ${paragraph}`,
        evidenceText: [
          "Openness is never automatic. Someone has to unlock the gate, settle disputes about plots and decide whether visitors may pick herbs.",
          "Digital booking systems can make shared rooms easier to reserve, yet they can also favour residents with reliable internet access.",
          "The rotation improves fairness, although it may slow repairs when new volunteers need guidance.",
          "The most successful commons are not those without rules.",
          "Urban commons fail when they are romanticised as naturally cooperative.",
        ][index],
        whyCorrect:
          "The answer names the controlling idea of the paragraph.",
        whyWrong:
          "A wrong heading may repeat a noun from the paragraph but miss the author's point.",
        skill: "Understanding main idea",
        secondarySkills: ["Identifying paragraph function"],
        trapType: "Partial match trap",
        strategyTip:
          "Ask what the paragraph is arguing, not just what object it mentions.",
        difficulty: "Medium",
        paragraphRef: paragraph,
      }),
    ),
  },
  {
    drillId: "inference-drill-001",
    title: "Inference Drill: Cautious Conclusions",
    practiceMode: "skill",
    skill: "Making inference",
    skillFocus: ["Making inference", "Distinguishing fact from claim"],
    trapFocus: ["Assumption trap", "Overgeneralisation trap"],
    difficulty: "Hard",
    estimatedTimeMinutes: 9,
    description: "Practise drawing supported conclusions without adding outside assumptions.",
    strategyLessonId: "strategy-inference",
    passages: [
      {
        passageId: "p1",
        title: "Silent Failures in Medical Sensors",
        topic: "Medical Technology",
        sourceNote: "Original IELTS-style practice passage created for this app.",
        paragraphs: [
          { label: "A", text: "Wearable sensors are often judged by whether they detect abnormal readings. A quieter problem is non-detection: the device continues to display ordinary values while the patient's condition is beginning to change." },
          { label: "B", text: "One hospital reviewed cases in which nurses had requested checks despite normal sensor readings. Many requests came after small behavioural changes, such as a patient answering more slowly or refusing food." },
          { label: "C", text: "The review did not prove that nurses were always right. It did show that sensor dashboards should leave room for clinical unease, especially when a normal number conflicts with a changing bedside impression." },
        ],
      },
    ],
    questions: [
      ["What can be inferred about non-detection?", "It may hide early signs of deterioration.", "The device continues to display ordinary values while the patient's condition is beginning to change."],
      ["Why were nurse requests important in the review?", "They showed that bedside observations could challenge normal sensor readings.", "Nurses had requested checks despite normal sensor readings."],
      ["What does the writer imply about dashboards?", "They should not make clinical judgement appear unnecessary.", "Sensor dashboards should leave room for clinical unease."],
      ["The review proved that nurses were always more accurate than sensors.", "No", "The review did not prove that nurses were always right."],
      ["A patient's slower answers could be treated as a relevant bedside sign.", "Yes", "Many requests came after small behavioural changes, such as a patient answering more slowly."],
    ].map(([prompt, answer, evidence], index) =>
      q({
        passageId: "p1",
        type: index >= 3 ? "yes-no-not-given" : "multiple-choice",
        prompt,
        options:
          index >= 3
            ? ["Yes", "No", "Not Given"]
            : [
                answer,
                "It proves that all wearable sensors should be removed.",
                "It shows that nurses should ignore sensor data.",
                "It confirms that food refusal is never clinically relevant.",
              ],
        answer,
        explanation:
          "The answer follows from the passage evidence without adding a stronger conclusion.",
        evidenceParagraph: "Passage evidence",
        evidenceText: evidence,
        whyCorrect:
          "The correct answer is the cautious conclusion supported by the evidence.",
        whyWrong:
          "A wrong answer usually overstates the evidence or adds a claim the passage does not make.",
        skill: "Making inference",
        secondarySkills: ["Distinguishing fact from claim"],
        trapType: "Assumption trap",
        strategyTip:
          "Inference answers should be necessary or strongly supported, not merely possible.",
        difficulty: "Hard",
      }),
    ),
  },
  {
    drillId: "scanning-drill-001",
    title: "Time-efficient Scanning Drill: Field Station Details",
    practiceMode: "skill",
    skill: "Time-efficient scanning",
    skillFocus: ["Time-efficient scanning", "Locating explicit information"],
    trapFocus: ["Wrong paragraph trap", "Similar keyword trap"],
    difficulty: "Easy",
    estimatedTimeMinutes: 7,
    description: "Practise locating specific facts quickly while confirming exact meaning.",
    strategyLessonId: "strategy-scanning",
    passages: [
      {
        passageId: "p1",
        title: "A Coastal Field Station",
        topic: "Marine Biology",
        sourceNote: "Original IELTS-style practice passage created for this app.",
        paragraphs: [
          { label: "A", text: "The field station opened in 1984 beside a sheltered bay. Its first work focused on seagrass beds because they were close enough for students to sample at low tide." },
          { label: "B", text: "The station's small boat was replaced in 2006 after repeated engine failures. The new boat allowed researchers to reach offshore kelp sites during calm mornings." },
          { label: "C", text: "A public aquarium was added later, but it was designed for outreach rather than research. School visits now provide a modest income during winter." },
          { label: "D", text: "The station stores long-term temperature records in a fireproof cabinet and in a separate digital archive. The paper records remain useful because some early sensors used non-standard formats." },
          { label: "E", text: "Each summer, visiting students must complete safety training before joining night surveys of shore crabs. The surveys are cancelled if wind speeds exceed the station limit." },
        ],
      },
    ],
    questions: [
      ["When did the field station open?", "1984", "The field station opened in 1984 beside a sheltered bay.", "A"],
      ["Which paragraph mentions the replacement of a boat?", "B", "The station's small boat was replaced in 2006 after repeated engine failures.", "B"],
      ["What was the public aquarium designed for?", "outreach", "A public aquarium was added later, but it was designed for outreach rather than research.", "C"],
      ["Where are paper temperature records stored?", "fireproof cabinet", "The station stores long-term temperature records in a fireproof cabinet and in a separate digital archive.", "D"],
      ["What training must students complete before night surveys?", "safety training", "Visiting students must complete safety training before joining night surveys of shore crabs.", "E"],
    ].map(([prompt, answer, evidence, paragraph], index) =>
      q({
        passageId: "p1",
        type: index === 1 ? "matching-information" : "short-answer",
        prompt,
        options: index === 1 ? ["A", "B", "C", "D", "E"] : undefined,
        answer,
        acceptedAnswers: [answer],
        explanation:
          "The answer is found by scanning for a distinctive date, object or activity and then checking the sentence.",
        evidenceParagraph: `Paragraph ${paragraph}`,
        evidenceText: evidence,
        whyCorrect:
          "The evidence sentence gives the requested detail directly.",
        whyWrong:
          "A wrong answer may come from a nearby paragraph with a related station activity.",
        skill: "Time-efficient scanning",
        secondarySkills: ["Locating explicit information"],
        trapType: "Similar keyword trap",
        strategyTip:
          "Scan for distinctive nouns or dates first, then slow down to verify the exact answer.",
        difficulty: "Easy",
        maxWords: index === 1 ? undefined : 2,
        paragraphRef: paragraph,
      }),
    ),
  },
  {
    drillId: "matching-features-drill-001",
    title: "Matching Features Drill: People, Methods and Claims",
    practiceMode: "question-type",
    questionType: "matching-features",
    skillFocus: ["Locating explicit information", "Understanding detail"],
    trapFocus: ["Similar keyword trap", "Partial match trap"],
    difficulty: "Medium",
    estimatedTimeMinutes: 8,
    description: "Practise linking named groups to the exact claim, method or concern they are associated with.",
    strategyLessonId: "strategy-matching-features",
    passages: [
      {
        passageId: "p1",
        title: "Three Views of a City Tree Survey",
        topic: "Urban Planning",
        sourceNote: "Original IELTS-style practice passage created for this app.",
        paragraphs: [
          { label: "A", text: "City arborists wanted the survey to record trunk damage and canopy spread because these details helped them schedule maintenance." },
          { label: "B", text: "Public-health researchers argued for shade measurements near bus stops, where heat exposure affected older residents waiting in the afternoon." },
          { label: "C", text: "Community gardeners asked the team to include fruiting trees, which were absent from the official tree inventory but important in informal food sharing." },
          { label: "D", text: "Insurance officers were less interested in shade or food. They wanted clearer records of roots that had lifted pavements near commercial buildings." },
          { label: "E", text: "School volunteers contributed photographs, but their images were used only to confirm location, not to assess tree health." },
        ],
      },
    ],
    questions: [
      ["Which group focused on bus-stop shade?", "public-health researchers", "Public-health researchers argued for shade measurements near bus stops.", "B"],
      ["Which group wanted pavement damage from roots recorded?", "insurance officers", "Insurance officers... wanted clearer records of roots that had lifted pavements.", "D"],
      ["Which group asked for fruiting trees to be included?", "community gardeners", "Community gardeners asked the team to include fruiting trees.", "C"],
      ["Which group used trunk damage and canopy spread for scheduling?", "city arborists", "City arborists wanted the survey to record trunk damage and canopy spread.", "A"],
      ["Which group supplied photographs used only for location checking?", "school volunteers", "School volunteers contributed photographs, but their images were used only to confirm location.", "E"],
    ].map(([prompt, answer, evidence, paragraph]) =>
      q({
        passageId: "p1",
        type: "matching-features",
        groupTitle: "Match each feature to the correct group.",
        prompt,
        options: [
          "city arborists",
          "public-health researchers",
          "community gardeners",
          "insurance officers",
          "school volunteers",
        ],
        answer,
        explanation:
          "The correct group is the one directly linked to the feature in the passage.",
        evidenceParagraph: `Paragraph ${paragraph}`,
        evidenceText: evidence,
        whyCorrect:
          "The answer matches the group to its specific purpose, not merely to the shared topic of trees.",
        whyWrong:
          "A wrong option may be another group from the same survey but linked to a different concern.",
        skill: "Locating explicit information",
        secondarySkills: ["Understanding detail"],
        trapType: "Similar keyword trap",
        strategyTip:
          "For Matching Features, write a quick group-to-action note before choosing.",
        difficulty: "Medium",
        paragraphRef: paragraph,
      }),
    ),
  },
  {
    drillId: "flow-chart-completion-drill-001",
    title: "Flow-chart Completion Drill: Process Sequence",
    practiceMode: "question-type",
    questionType: "flow-chart-completion",
    skillFocus: ["Recognising cause and effect", "Following reference words"],
    trapFocus: ["Chronology trap", "Cause-effect confusion"],
    difficulty: "Medium",
    estimatedTimeMinutes: 8,
    description: "Practise following a real process sequence rather than filling isolated sentences.",
    strategyLessonId: "strategy-flow-chart-completion",
    passages: [
      {
        passageId: "p1",
        title: "Testing a Museum Display Case",
        topic: "History of Science",
        sourceNote: "Original IELTS-style practice passage created for this app.",
        paragraphs: [
          { label: "A", text: "Conservators first placed humidity sensors inside an empty display case for two weeks. When readings proved stable, they added a cloth sample dyed with a modern replica pigment." },
          { label: "B", text: "The sample faded near the lamp, so the team lowered the light level and repeated the trial. Fading slowed, but the lower light made label reading difficult for visitors." },
          { label: "C", text: "A final trial used angled lighting and a shorter daily exposure period. This arrangement preserved colour more effectively while keeping the label readable." },
        ],
      },
    ],
    questions: [
      ["Empty case monitored -> readings stable -> cloth sample ______.", "added", "When readings proved stable, they added a cloth sample.", "A"],
      ["Sample faded near lamp -> light level ______ -> trial repeated.", "lowered", "The sample faded near the lamp, so the team lowered the light level.", "B"],
      ["Lower light reduced fading -> visitors struggled with label ______.", "reading", "The lower light made label reading difficult for visitors.", "B"],
      ["Final trial used angled lighting + shorter exposure -> colour better ______.", "preserved", "This arrangement preserved colour more effectively.", "C"],
      ["Angled lighting and shorter exposure -> label remained ______.", "readable", "This arrangement... kept the label readable.", "C"],
    ].map(([prompt, answer, evidence, paragraph]) =>
      q({
        passageId: "p1",
        type: "flow-chart-completion",
        prompt,
        answer,
        acceptedAnswers: [answer],
        explanation:
          "The answer completes the next step or result in the conservation trial sequence.",
        evidenceParagraph: `Paragraph ${paragraph}`,
        evidenceText: evidence,
        whyCorrect:
          "The flow-chart position matches the chronological order in the passage.",
        whyWrong:
          "A wrong answer may describe a nearby step but not the step required at this point in the sequence.",
        skill: "Following reference words",
        secondarySkills: ["Recognising cause and effect"],
        trapType: "Chronology trap",
        strategyTip:
          "Follow the arrows as time order; do not choose a word from an earlier or later step.",
        difficulty: "Medium",
        maxWords: 1,
        paragraphRef: paragraph,
      }),
    ),
  },
  {
    drillId: "diagram-label-completion-drill-001",
    title: "Diagram Label Completion Drill: Text Schematic",
    practiceMode: "question-type",
    questionType: "diagram-label-completion",
    skillFocus: ["Following reference words", "Making inference"],
    trapFocus: ["Assumption trap", "Chronology trap"],
    difficulty: "Hard",
    estimatedTimeMinutes: 9,
    description: "Practise completing a text-based schematic until visual diagram support is added.",
    strategyLessonId: "strategy-diagram-label-completion",
    passages: [
      {
        passageId: "p1",
        title: "A Sensor Network in a Wetland",
        topic: "Environmental Science",
        sourceNote: "Original IELTS-style practice passage created for this app.",
        paragraphs: [
          { label: "A", text: "Water-level sensors sent readings to a solar-powered relay on the boardwalk. The relay compressed the data and forwarded a daily packet to the research office." },
          { label: "B", text: "If the relay battery fell below its reserve level, the system stored readings locally instead of transmitting them. This prevented data loss, although it delayed analysis." },
          { label: "C", text: "Researchers added a manual staff gauge beside the central pool. Its purpose was not to replace the sensors but to provide a simple comparison when electronic readings looked unusual." },
        ],
      },
    ],
    questions: [
      ["Schematic: sensors -> solar-powered ______ -> research office", "relay", "Water-level sensors sent readings to a solar-powered relay.", "A"],
      ["Schematic: relay compresses data -> sends daily ______", "packet", "The relay compressed the data and forwarded a daily packet.", "A"],
      ["Schematic: low battery -> readings stored ______", "locally", "The system stored readings locally instead of transmitting them.", "B"],
      ["Schematic: local storage -> data preserved but analysis ______", "delayed", "This prevented data loss, although it delayed analysis.", "B"],
      ["Schematic: manual staff gauge -> comparison for unusual electronic ______", "readings", "Provide a simple comparison when electronic readings looked unusual.", "C"],
    ].map(([prompt, answer, evidence, paragraph]) =>
      q({
        passageId: "p1",
        type: "diagram-label-completion",
        prompt,
        answer,
        acceptedAnswers: [answer],
        explanation:
          "The label completes the schematic relationship described in the passage.",
        evidenceParagraph: `Paragraph ${paragraph}`,
        evidenceText: evidence,
        whyCorrect:
          "The answer fits the labelled position in the text-based diagram.",
        whyWrong:
          "A wrong answer may come from the same system but belong to a different part of the schematic.",
        skill: "Following reference words",
        secondarySkills: ["Making inference"],
        trapType: "Chronology trap",
        strategyTip:
          "Use the arrows to identify whether the blank asks for a device, action or result.",
        difficulty: "Hard",
        maxWords: 1,
        paragraphRef: paragraph,
      }),
    ),
  },
  {
    drillId: "not-given-trap-drill-001",
    title: "Not Given Trap Drill: Mentioned Is Not Proven",
    practiceMode: "skill",
    skill: "Distinguishing fact from claim",
    skillFocus: ["Distinguishing fact from claim", "Avoiding overgeneralisation"],
    trapFocus: ["Not Given trap"],
    difficulty: "Medium",
    estimatedTimeMinutes: 8,
    description: "Practise separating stated evidence from plausible but unstated claims.",
    strategyLessonId: "strategy-tfng",
    passages: [
      {
        passageId: "p1",
        title: "A Trial of Reusable Food Containers",
        topic: "Public Health",
        sourceNote: "Original IELTS-style practice passage created for this app.",
        paragraphs: [
          { label: "A", text: "A university cafeteria tested reusable containers for takeaway meals. Students paid a small deposit and returned the container to machines near the library and sports centre." },
          { label: "B", text: "Return rates were highest near the library, where students often stayed after lunch. The project team did not measure whether students bought fewer disposable cups during the same period." },
          { label: "C", text: "Cleaning costs were higher than expected in the first month because food residue dried inside containers returned late in the evening." },
        ],
      },
    ],
    questions: [
      ["Students paid a deposit to use the containers.", "True", "Students paid a small deposit.", "A", "Synonym trap"],
      ["The cafeteria measured a reduction in disposable cup purchases.", "Not Given", "The project team did not measure whether students bought fewer disposable cups.", "B", "Not Given trap"],
      ["The best return rate was recorded near the library.", "True", "Return rates were highest near the library.", "B", "Synonym trap"],
      ["Cleaning costs were lower than expected in the first month.", "False", "Cleaning costs were higher than expected in the first month.", "C", "Opposite meaning trap"],
      ["The sports centre machine was removed after the trial.", "Not Given", "The passage mentions a sports centre machine but does not say it was removed.", "A", "Not Given trap"],
    ].map(([prompt, answer, evidence, paragraph, trapType]) =>
      q({
        passageId: "p1",
        type: "true-false-not-given",
        prompt,
        options: ["True", "False", "Not Given"],
        answer,
        explanation:
          answer === "Not Given"
            ? "The topic appears, but the exact claim is not supported by the passage."
            : "The statement can be checked against a specific sentence in the passage.",
        evidenceParagraph: answer === "Not Given" ? "No specific paragraph" : `Paragraph ${paragraph}`,
        evidenceText: evidence,
        whyCorrect:
          "The correct answer depends on whether the exact claim is stated, contradicted or absent.",
        whyWrong:
          "A common mistake is treating a mentioned topic as proof of a more specific claim.",
        skill: answer === "Not Given" ? "Distinguishing fact from claim" : "Understanding detail",
        secondarySkills: ["Avoiding overgeneralisation"],
        trapType: trapType as TrapType,
        strategyTip:
          "For Not Given, ask whether the passage gives enough evidence for the exact statement, not just the topic.",
        difficulty: "Medium",
        paragraphRef: answer === "Not Given" ? undefined : paragraph,
      }),
    ),
  },
  {
    drillId: "vocabulary-context-drill-001",
    title: "Vocabulary in Context Drill: Academic Meaning",
    practiceMode: "skill",
    skill: "Understanding vocabulary in context",
    skillFocus: ["Understanding vocabulary in context", "Recognising paraphrase"],
    trapFocus: ["Synonym trap", "Similar keyword trap"],
    difficulty: "Medium",
    estimatedTimeMinutes: 8,
    description: "Practise interpreting academic words from sentence context rather than dictionary memory.",
    strategyLessonId: "strategy-skill-understanding-vocabulary-in-context",
    passages: [
      {
        passageId: "p1",
        title: "Terms in a River Report",
        topic: "Environmental Science",
        sourceNote: "Original IELTS-style practice passage created for this app.",
        paragraphs: [
          { label: "A", text: "The report called the new flood wall 'provisional' because engineers expected to alter its height after two rainy seasons of monitoring." },
          { label: "B", text: "It described one neighbourhood as 'vulnerable', not because flooding was constant, but because evacuation routes were narrow and poorly lit." },
          { label: "C", text: "A storage pond was labelled 'redundant' after two upstream wetlands were restored and could hold stormwater more effectively." },
        ],
      },
    ],
    questions: [
      ["In Paragraph A, 'provisional' means", "temporary and open to change", "expected to alter its height after two rainy seasons", "A"],
      ["In Paragraph B, 'vulnerable' mainly refers to", "difficulty responding safely to flooding", "evacuation routes were narrow and poorly lit", "B"],
      ["In Paragraph C, 'redundant' means", "no longer needed for the same purpose", "wetlands were restored and could hold stormwater more effectively", "C"],
      ["The word 'constant' in Paragraph B is closest in meaning to", "continuous", "not because flooding was constant", "B"],
      ["The phrase 'hold stormwater' in Paragraph C means", "retain excess rainwater", "could hold stormwater more effectively", "C"],
    ].map(([prompt, answer, evidence, paragraph]) =>
      q({
        passageId: "p1",
        type: "multiple-choice",
        prompt,
        options: [
          answer,
          "visually attractive but unrelated",
          "approved without conditions",
          "too technical to describe",
        ],
        answer,
        explanation:
          "The correct meaning is determined by the surrounding explanation in the same paragraph.",
        evidenceParagraph: `Paragraph ${paragraph}`,
        evidenceText: evidence,
        whyCorrect:
          "The answer matches how the word functions in this specific sentence.",
        whyWrong:
          "A wrong option may sound academic but does not fit the local context.",
        skill: "Understanding vocabulary in context",
        secondarySkills: ["Recognising paraphrase"],
        trapType: "Synonym trap",
        strategyTip:
          "Use the clause after because, not your first dictionary association, to infer meaning.",
        difficulty: "Medium",
        paragraphRef: paragraph,
      }),
    ),
  },
  {
    drillId: "band9-challenge-inference-001",
    title: "Band 8-9 Challenge Drill: Inference and Caution",
    practiceMode: "skill",
    skill: "Making inference",
    skillFocus: ["Making inference", "Distinguishing fact from claim"],
    trapFocus: ["Assumption trap", "Overgeneralisation trap"],
    difficulty: "Band 8-9 Challenge",
    estimatedTimeMinutes: 12,
    description: "Advanced practice in drawing only the inference the evidence can carry.",
    strategyLessonId: "strategy-inference",
    passages: [
      {
        passageId: "p1",
        title: "A Model That Ranked Manuscripts",
        topic: "Artificial Intelligence",
        sourceNote: "Original IELTS-style practice passage created for this app.",
        paragraphs: [
          { label: "A", text: "A library model ranked uncatalogued manuscripts by likely historical value. Its strongest predictions came from documents resembling items already studied by specialists." },
          { label: "B", text: "Curators found the ranking useful but uneasy. A low-ranked item might be ordinary, or it might belong to a category that previous scholarship had neglected." },
          { label: "C", text: "The library therefore sampled some low-ranked manuscripts deliberately. The aim was not to disprove the model but to discover where its confidence reflected the limits of the archive it had learned from." },
        ],
      },
    ],
    questions: [
      ["What can be inferred about high-ranked manuscripts?", "They resembled previously studied materials.", "Its strongest predictions came from documents resembling items already studied by specialists."],
      ["Why might a low-ranked item still matter?", "It could belong to an under-studied category.", "It might belong to a category that previous scholarship had neglected."],
      ["What was the purpose of sampling low-ranked manuscripts?", "To test the boundaries of the model's learned archive.", "To discover where its confidence reflected the limits of the archive it had learned from."],
      ["The curators believed the model was useless.", "No", "Curators found the ranking useful but uneasy."],
      ["The model was trained on every manuscript in the library.", "Not Given", "The passage does not state that every manuscript was used for training."],
    ].map(([prompt, answer, evidence], index) =>
      q({
        passageId: "p1",
        type: index >= 3 ? "yes-no-not-given" : "multiple-choice",
        prompt,
        options:
          index >= 3
            ? ["Yes", "No", "Not Given"]
            : [
                "It proved the model should replace curators.",
                answer,
                "It showed neglected categories had no value.",
                "It eliminated the need for sampling.",
              ],
        answer,
        explanation:
          "The answer keeps the inference within the limits of the evidence.",
        evidenceParagraph: "Passage evidence",
        evidenceText: evidence,
        whyCorrect:
          "The passage supports this cautious inference without requiring extra assumptions.",
        whyWrong:
          "A tempting wrong answer usually turns usefulness into authority or uncertainty into rejection.",
        skill: "Making inference",
        secondarySkills: ["Distinguishing fact from claim"],
        trapType: index === 4 ? "Not Given trap" : "Assumption trap",
        strategyTip:
          "Band 8-9 inference often asks what follows from limitation, not what sounds generally plausible.",
        difficulty: "Band 8-9 Challenge",
      }),
    ),
  },
  {
    drillId: "band9-challenge-multiple-choice-001",
    title: "Band 8-9 Challenge Drill: Dense Multiple Choice",
    practiceMode: "question-type",
    questionType: "multiple-choice",
    skillFocus: ["Recognising paraphrase", "Making inference"],
    trapFocus: ["Distractor detail trap", "Writer opinion confusion"],
    difficulty: "Band 8-9 Challenge",
    estimatedTimeMinutes: 12,
    description: "Advanced multiple-choice practice with plausible academic distractors.",
    strategyLessonId: "strategy-multiple-choice",
    passages: [
      {
        passageId: "p1",
        title: "The Problem of Replication in Field Ecology",
        topic: "Environmental Science",
        sourceNote: "Original IELTS-style practice passage created for this app.",
        paragraphs: [
          { label: "A", text: "Field ecologists rarely repeat an experiment in identical conditions because the field refuses to stay still. Rainfall, grazing pressure and neighbouring land use change before a second trial can begin." },
          { label: "B", text: "One response is to replicate the logic of an experiment rather than its surface details. A wetland study may test the same causal claim in a different valley, using different species as indicators." },
          { label: "C", text: "This approach frustrates readers who want exact repetition, but it can make an argument stronger. If the same mechanism appears under different local conditions, the claim becomes less dependent on one unusual site." },
        ],
      },
    ],
    questions: [
      q({
        passageId: "p1",
        type: "multiple-choice",
        prompt: "Why is exact repetition difficult in field ecology?",
        options: [
          "Because local conditions change before a second trial can begin",
          "Because ecologists refuse to compare different sites",
          "Because field experiments do not contain causal claims",
          "Because indicator species always remain unchanged",
        ],
        answer: "Because local conditions change before a second trial can begin",
        explanation:
          "Paragraph A says rainfall, grazing pressure and neighbouring land use change before a second trial can begin.",
        evidenceParagraph: "Paragraph A",
        evidenceText:
          "Rainfall, grazing pressure and neighbouring land use change before a second trial can begin.",
        whyCorrect:
          "The answer identifies the practical reason identical repetition is hard.",
        whyWrong:
          "The distractors distort the passage by denying comparison, causality or change.",
        skill: "Understanding detail",
        secondarySkills: ["Recognising paraphrase"],
        trapType: "Distractor detail trap",
        strategyTip:
          "In dense MCQ, choose the option that states the passage's reason without adding a stronger claim.",
        difficulty: "Band 8-9 Challenge",
        paragraphRef: "A",
      }),
      q({
        passageId: "p1",
        type: "multiple-choice",
        prompt: "What does it mean to replicate the logic of an experiment?",
        options: [
          "To copy every surface detail of the original trial",
          "To test the same causal claim under different local conditions",
          "To avoid using species as indicators",
          "To abandon comparison between valleys",
        ],
        answer: "To test the same causal claim under different local conditions",
        explanation:
          "Paragraph B describes testing the same causal claim in a different valley with different indicators.",
        evidenceParagraph: "Paragraph B",
        evidenceText:
          "A wetland study may test the same causal claim in a different valley, using different species as indicators.",
        whyCorrect:
          "The answer paraphrases replication of logic as preserving the causal claim while changing context.",
        whyWrong:
          "The first option is tempting but is exactly what the passage says is often impossible.",
        skill: "Recognising paraphrase",
        secondarySkills: ["Making inference"],
        trapType: "Partial match trap",
        strategyTip:
          "Look for what stays the same and what changes in the author's definition.",
        difficulty: "Band 8-9 Challenge",
        paragraphRef: "B",
      }),
      q({
        passageId: "p1",
        type: "multiple-choice",
        prompt: "Why can non-identical replication strengthen an argument?",
        options: [
          "It proves that local details are never important.",
          "It makes the claim less dependent on one unusual site.",
          "It removes the need to identify a mechanism.",
          "It satisfies readers who want exact repetition.",
        ],
        answer: "It makes the claim less dependent on one unusual site.",
        explanation:
          "Paragraph C says the claim becomes less dependent on one unusual site if the same mechanism appears under different conditions.",
        evidenceParagraph: "Paragraph C",
        evidenceText:
          "If the same mechanism appears under different local conditions, the claim becomes less dependent on one unusual site.",
        whyCorrect:
          "The answer keeps the author's conditional logic.",
        whyWrong:
          "The distractors overstate the claim or contradict the reader frustration described in the passage.",
        skill: "Making inference",
        secondarySkills: ["Recognising cause and effect"],
        trapType: "Cause-effect confusion",
        strategyTip:
          "In advanced MCQ, preserve conditional wording such as if; it often limits the conclusion.",
        difficulty: "Band 8-9 Challenge",
        paragraphRef: "C",
      }),
      q({
        passageId: "p1",
        type: "multiple-choice",
        prompt: "What is the writer's attitude toward exact repetition?",
        options: [
          "It is desirable for readers but often unrealistic in changing field conditions.",
          "It is always unnecessary in ecological research.",
          "It is easy whenever indicator species are changed.",
          "It weakens every causal explanation.",
        ],
        answer:
          "It is desirable for readers but often unrealistic in changing field conditions.",
        explanation:
          "The passage acknowledges readers want exact repetition but explains why the field makes it difficult.",
        evidenceParagraph: "Paragraphs A-C",
        evidenceText:
          "Field ecologists rarely repeat an experiment in identical conditions... This approach frustrates readers who want exact repetition.",
        whyCorrect:
          "The answer captures the writer's balanced position.",
        whyWrong:
          "The distractors turn a nuanced limitation into an absolute rejection or false ease.",
        skill: "Identifying writer's opinion",
        secondarySkills: ["Understanding main idea"],
        trapType: "Writer opinion confusion",
        strategyTip:
          "For attitude questions, avoid options that erase the concession.",
        difficulty: "Band 8-9 Challenge",
      }),
      q({
        passageId: "p1",
        type: "multiple-choice",
        prompt: "Which option best summarises the passage?",
        options: [
          "Field ecology can preserve causal testing even when exact repetition is impossible.",
          "Field ecology should stop using experiments because sites change.",
          "A different valley always produces a stronger result.",
          "Readers prefer surface details because causal logic is irrelevant.",
        ],
        answer:
          "Field ecology can preserve causal testing even when exact repetition is impossible.",
        explanation:
          "The passage argues for replicating experimental logic when identical conditions cannot be repeated.",
        evidenceParagraph: "Passage-wide evidence",
        evidenceText:
          "One response is to replicate the logic of an experiment rather than its surface details.",
        whyCorrect:
          "The answer captures the passage's central contrast between exact repetition and causal logic.",
        whyWrong:
          "The wrong options exaggerate impossibility, guarantee success or dismiss causal logic.",
        skill: "Understanding main idea",
        secondarySkills: ["Making inference"],
        trapType: "Overgeneralisation trap",
        strategyTip:
          "For summary MCQ, choose the option that keeps both halves of the argument.",
        difficulty: "Band 8-9 Challenge",
      }),
    ],
  },
  {
    drillId: "comparison-contrast-drill-001",
    title: "Comparison and Contrast Drill: Direction Matters",
    practiceMode: "skill",
    skill: "Understanding comparison",
    skillFocus: ["Understanding comparison", "Recognising contrast"],
    trapFocus: ["Comparison confusion", "Opposite meaning trap"],
    difficulty: "Medium",
    estimatedTimeMinutes: 8,
    description: "Practise keeping the direction of comparisons clear under time pressure.",
    strategyLessonId: "strategy-skill-understanding-comparison",
    passages: [
      {
        passageId: "p1",
        title: "Comparing Two Library Renovations",
        topic: "Architecture",
        sourceNote: "Original IELTS-style practice passage created for this app.",
        paragraphs: [
          { label: "A", text: "The east library renovation cost less than the west library project, partly because its original roof was retained. The west library, however, achieved a larger reduction in winter heating demand." },
          { label: "B", text: "Visitors rated the east library's reading rooms as brighter, while staff preferred the west library because storage and delivery routes were easier to manage." },
          { label: "C", text: "Neither project was judged superior overall. The report argued that each solved a different problem: the east library improved public comfort, whereas the west library improved operational efficiency." },
        ],
      },
    ],
    questions: [
      ["The east library renovation was more expensive than the west library project.", "False", "The east library renovation cost less than the west library project.", "A"],
      ["The west library achieved the larger reduction in winter heating demand.", "True", "The west library... achieved a larger reduction in winter heating demand.", "A"],
      ["Visitors rated the west library's reading rooms as brighter.", "False", "Visitors rated the east library's reading rooms as brighter.", "B"],
      ["Staff preferred the west library for storage and delivery reasons.", "True", "Staff preferred the west library because storage and delivery routes were easier to manage.", "B"],
      ["The report claimed that one project was superior in every respect.", "False", "Neither project was judged superior overall.", "C"],
    ].map(([prompt, answer, evidence, paragraph]) =>
      q({
        passageId: "p1",
        type: "true-false-not-given",
        prompt,
        options: ["True", "False", "Not Given"],
        answer,
        explanation:
          "The answer depends on preserving the direction and scope of the comparison.",
        evidenceParagraph: `Paragraph ${paragraph}`,
        evidenceText: evidence,
        whyCorrect:
          "The statement either matches or reverses the comparison in the evidence sentence.",
        whyWrong:
          "A wrong answer usually transfers a feature from one library to the other or changes a limited comparison into an overall judgement.",
        skill: "Understanding comparison",
        secondarySkills: ["Recognising contrast"],
        trapType: answer === "False" ? "Comparison confusion" : "No major trap",
        strategyTip:
          "Underline the two compared items and the comparative word before deciding.",
        difficulty: "Medium",
        paragraphRef: paragraph,
      }),
    ),
  },
  {
    drillId: "yes-no-not-given-drill-001",
    title: "Yes / No / Not Given Drill: Writer Stance",
    practiceMode: "question-type",
    questionType: "yes-no-not-given",
    skillFocus: ["Identifying writer's opinion", "Distinguishing fact from claim"],
    trapFocus: ["Writer opinion confusion", "Not Given trap", "Assumption trap"],
    difficulty: "Medium",
    estimatedTimeMinutes: 8,
    description: "Practise deciding whether a statement matches the writer's claim rather than a topic mentioned in the passage.",
    strategyLessonId: "strategy-yes-no-not-given",
    passages: [
      {
        passageId: "p1",
        title: "Labels on Preprint Reviews",
        topic: "Education",
        sourceNote: "Original IELTS-style practice passage created for this app.",
        paragraphs: [
          {
            label: "A",
            text:
              "Several journals now attach short public labels to reviews of preprint articles. A label may say that the statistical method is sound, that the sample is too narrow, or that the claim is interesting but premature. The labels are meant to help non-specialist readers, but they are not replacements for the review itself.",
          },
          {
            label: "B",
            text:
              "Supporters argue that labels reduce the false impression that every preprint has the same level of reliability. Critics worry that a brief label can make a complex review look simpler than it is. The strongest argument is not that labels are perfect, but that silence is worse when weak studies spread quickly.",
          },
          {
            label: "C",
            text:
              "The pilot scheme did not ask reviewers to predict whether an article would later be accepted by a journal. It asked them to identify the present strength of the evidence. That difference matters: a careful early paper may still change, while a polished paper may rest on fragile data.",
          },
        ],
      },
    ],
    questions: [
      q({
        passageId: "p1",
        type: "yes-no-not-given",
        prompt: "The writer thinks review labels can be useful but should not replace full reviews.",
        options: ["Yes", "No", "Not Given"],
        answer: "Yes",
        explanation:
          "Paragraph A says labels help non-specialist readers but are not replacements for the review itself.",
        evidenceParagraph: "Paragraph A",
        evidenceText:
          "The labels are meant to help non-specialist readers, but they are not replacements for the review itself.",
        whyCorrect:
          "The statement matches the writer's balanced position.",
        whyWrong:
          "A wrong answer may focus only on usefulness or only on limitation, rather than both.",
        skill: "Identifying writer's opinion",
        secondarySkills: ["Recognising contrast"],
        trapType: "Writer opinion confusion",
        strategyTip:
          "For Yes / No / Not Given, keep concessions such as 'but' attached to the writer's view.",
        difficulty: "Medium",
        paragraphRef: "A",
      }),
      q({
        passageId: "p1",
        type: "yes-no-not-given",
        prompt: "The writer believes public labels make complex reviews perfectly simple.",
        options: ["Yes", "No", "Not Given"],
        answer: "No",
        explanation:
          "Paragraph B presents simplification as a criticism, not as the writer's belief.",
        evidenceParagraph: "Paragraph B",
        evidenceText:
          "Critics worry that a brief label can make a complex review look simpler than it is.",
        whyCorrect:
          "The statement overstates a concern and attributes it incorrectly as approval.",
        whyWrong:
          "The topic of simplification is mentioned, but the writer does not endorse perfect simplicity.",
        skill: "Identifying writer's opinion",
        secondarySkills: ["Avoiding overgeneralisation"],
        trapType: "Extreme wording trap",
        strategyTip:
          "Extreme phrases such as perfectly simple are usually too strong unless directly supported.",
        difficulty: "Medium",
        paragraphRef: "B",
      }),
      q({
        passageId: "p1",
        type: "yes-no-not-given",
        prompt: "The writer believes most readers ignore review labels after the first week.",
        options: ["Yes", "No", "Not Given"],
        answer: "Not Given",
        explanation:
          "The passage discusses the purpose and criticism of labels, but gives no claim about how long readers pay attention to them.",
        evidenceParagraph: "No confirming evidence",
        evidenceText:
          "The passage mentions labels helping non-specialist readers, but it does not discuss reader attention over time.",
        whyCorrect:
          "The statement cannot be confirmed or contradicted from the passage.",
        whyWrong:
          "A reader may infer behaviour from the spread of weak studies, but the time period is not stated.",
        skill: "Distinguishing fact from claim",
        secondarySkills: ["Identifying writer's opinion"],
        trapType: "Not Given trap",
        strategyTip:
          "Do not turn a general discussion of readers into a specific claim about reader behaviour.",
        difficulty: "Medium",
      }),
      q({
        passageId: "p1",
        type: "yes-no-not-given",
        prompt: "The writer sees the absence of guidance as risky when weak studies circulate quickly.",
        options: ["Yes", "No", "Not Given"],
        answer: "Yes",
        explanation:
          "Paragraph B says the strongest argument is that silence is worse when weak studies spread quickly.",
        evidenceParagraph: "Paragraph B",
        evidenceText:
          "The strongest argument is not that labels are perfect, but that silence is worse when weak studies spread quickly.",
        whyCorrect:
          "Silence refers to a lack of guidance, and the writer presents it as worse in fast circulation.",
        whyWrong:
          "A wrong answer may assume criticism of labels means rejection of all labels.",
        skill: "Recognising paraphrase",
        secondarySkills: ["Identifying writer's opinion"],
        trapType: "Synonym trap",
        strategyTip:
          "Map paraphrases such as absence of guidance to silence before deciding.",
        difficulty: "Medium",
        paragraphRef: "B",
      }),
      q({
        passageId: "p1",
        type: "yes-no-not-given",
        prompt: "The writer says reviewers in the pilot predicted whether papers would later be accepted.",
        options: ["Yes", "No", "Not Given"],
        answer: "No",
        explanation:
          "Paragraph C explicitly says the pilot did not ask reviewers to make acceptance predictions.",
        evidenceParagraph: "Paragraph C",
        evidenceText:
          "The pilot scheme did not ask reviewers to predict whether an article would later be accepted by a journal.",
        whyCorrect:
          "The statement directly contradicts the passage.",
        whyWrong:
          "Reviewers judged evidence strength, which is related to quality but not the same as predicting acceptance.",
        skill: "Understanding detail",
        secondarySkills: ["Identifying writer's opinion"],
        trapType: "Opposite meaning trap",
        strategyTip:
          "Notice negatives such as 'did not ask' before deciding Yes or No.",
        difficulty: "Medium",
        paragraphRef: "C",
      }),
    ],
  },
  {
    drillId: "matching-sentence-endings-drill-001",
    title: "Matching Sentence Endings Drill: Keep the Logic",
    practiceMode: "question-type",
    questionType: "matching-sentence-endings",
    skillFocus: ["Recognising cause and effect", "Understanding comparison"],
    trapFocus: ["Partial match trap", "Cause-effect confusion", "Chronology trap"],
    difficulty: "Medium",
    estimatedTimeMinutes: 8,
    description: "Practise completing sentence endings without breaking cause, contrast or sequence.",
    strategyLessonId: "strategy-matching-sentence-endings",
    passages: [
      {
        passageId: "p1",
        title: "Tree Rings After a Dry Spring",
        topic: "Environmental Science",
        sourceNote: "Original IELTS-style practice passage created for this app.",
        paragraphs: [
          {
            label: "A",
            text:
              "A narrow tree ring does not always mean the whole year was dry. In the upland pine study, several narrow rings followed springs with little rainfall, even when late summer storms were heavy. The trees had already set much of their annual growth before the storms arrived.",
          },
          {
            label: "B",
            text:
              "The researchers compared ring width with resin samples and local weather diaries. Resin chemistry helped distinguish drought stress from insect damage, while the diaries recorded unusual frosts that weather stations in the valley had missed.",
          },
          {
            label: "C",
            text:
              "The team argued that tree rings are most useful when treated as seasonal clues rather than simple yearly summaries. A ring can point to a difficult spring, but it cannot by itself explain whether people nearby experienced food shortage or economic stress.",
          },
        ],
      },
    ],
    questions: [
      q({
        passageId: "p1",
        type: "matching-sentence-endings",
        prompt: "Several narrow rings appeared even when late summer storms were heavy because",
        options: [
          "the trees had set much of their growth before the storms.",
          "the valley weather stations recorded every frost.",
          "insect damage was always the main cause.",
          "food shortages were measured in nearby villages.",
        ],
        answer: "the trees had set much of their growth before the storms.",
        explanation:
          "Paragraph A explains that late storms arrived after much annual growth had already been set.",
        evidenceParagraph: "Paragraph A",
        evidenceText:
          "The trees had already set much of their annual growth before the storms arrived.",
        whyCorrect:
          "The ending preserves the timing relationship.",
        whyWrong:
          "The distractors borrow other topics but do not explain the narrow rings.",
        skill: "Recognising cause and effect",
        secondarySkills: ["Understanding detail"],
        trapType: "Chronology trap",
        strategyTip:
          "For sentence endings with because, locate the cause and keep the time order intact.",
        difficulty: "Medium",
        paragraphRef: "A",
      }),
      q({
        passageId: "p1",
        type: "matching-sentence-endings",
        prompt: "Resin chemistry was useful because it helped researchers",
        options: [
          "replace weather diaries completely.",
          "distinguish drought stress from insect damage.",
          "prove that all narrow rings meant annual drought.",
          "date the oldest pine trees in the valley.",
        ],
        answer: "distinguish drought stress from insect damage.",
        explanation:
          "Paragraph B says resin chemistry helped separate drought stress from insect damage.",
        evidenceParagraph: "Paragraph B",
        evidenceText:
          "Resin chemistry helped distinguish drought stress from insect damage.",
        whyCorrect:
          "The ending gives the exact function of resin chemistry.",
        whyWrong:
          "The wrong endings exaggerate or invent functions not mentioned in the passage.",
        skill: "Understanding detail",
        secondarySkills: ["Locating explicit information"],
        trapType: "Distractor detail trap",
        strategyTip:
          "Match a method to its stated purpose, not to a generally plausible scientific purpose.",
        difficulty: "Medium",
        paragraphRef: "B",
      }),
      q({
        passageId: "p1",
        type: "matching-sentence-endings",
        prompt: "The weather diaries mattered because they recorded frosts",
        options: [
          "that caused insect damage in every sampled tree.",
          "after the trees had stopped growing forever.",
          "that valley weather stations had missed.",
          "near villages where food shortages were already known.",
        ],
        answer: "that valley weather stations had missed.",
        explanation:
          "Paragraph B says the diaries recorded unusual frosts missed by valley weather stations.",
        evidenceParagraph: "Paragraph B",
        evidenceText:
          "The diaries recorded unusual frosts that weather stations in the valley had missed.",
        whyCorrect:
          "The ending explains the added value of the diaries.",
        whyWrong:
          "The distractors attach the frosts to unsupported consequences.",
        skill: "Locating explicit information",
        secondarySkills: ["Understanding detail"],
        trapType: "Partial match trap",
        strategyTip:
          "If an ending begins with 'that', check which noun it modifies in the passage.",
        difficulty: "Medium",
        paragraphRef: "B",
      }),
      q({
        passageId: "p1",
        type: "matching-sentence-endings",
        prompt: "The team preferred to treat tree rings as seasonal clues rather than",
        options: [
          "records that contain no environmental information.",
          "objects that can only be studied with insect samples.",
          "simple summaries of an entire year.",
          "diaries written by local observers.",
        ],
        answer: "simple summaries of an entire year.",
        explanation:
          "Paragraph C contrasts seasonal clues with simple yearly summaries.",
        evidenceParagraph: "Paragraph C",
        evidenceText:
          "Tree rings are most useful when treated as seasonal clues rather than simple yearly summaries.",
        whyCorrect:
          "The ending preserves the contrast in the writer's interpretation.",
        whyWrong:
          "The wrong endings distort the contrast or confuse tree rings with diaries.",
        skill: "Recognising contrast",
        secondarySkills: ["Understanding main idea"],
        trapType: "Opposite meaning trap",
        strategyTip:
          "Complete 'rather than' sentences with the rejected interpretation.",
        difficulty: "Medium",
        paragraphRef: "C",
      }),
      q({
        passageId: "p1",
        type: "matching-sentence-endings",
        prompt: "A tree ring alone cannot show whether nearby people",
        options: [
          "used resin samples to measure insects.",
          "received heavy storms in late summer.",
          "kept written diaries about frost.",
          "experienced food shortage or economic stress.",
        ],
        answer: "experienced food shortage or economic stress.",
        explanation:
          "Paragraph C says a ring cannot by itself explain whether people nearby experienced food shortage or economic stress.",
        evidenceParagraph: "Paragraph C",
        evidenceText:
          "It cannot by itself explain whether people nearby experienced food shortage or economic stress.",
        whyCorrect:
          "The ending states the social consequences the evidence cannot prove alone.",
        whyWrong:
          "The distractors refer to research methods or weather, not the human consequences named in the passage.",
        skill: "Making inference",
        secondarySkills: ["Distinguishing fact from claim"],
        trapType: "Assumption trap",
        strategyTip:
          "For limitations, identify exactly what the evidence cannot establish.",
        difficulty: "Medium",
        paragraphRef: "C",
      }),
    ],
  },
  {
    drillId: "note-completion-drill-001",
    title: "Note Completion Drill: Grammar and Meaning",
    practiceMode: "question-type",
    questionType: "note-completion",
    skillFocus: ["Understanding detail", "Understanding vocabulary in context"],
    trapFocus: ["Grammar form trap", "Similar keyword trap"],
    difficulty: "Easy",
    estimatedTimeMinutes: 7,
    description: "Practise filling notes with words that fit both the passage meaning and the note grammar.",
    strategyLessonId: "strategy-note-completion",
    passages: [
      {
        passageId: "p1",
        title: "Portable Air Monitors in Classrooms",
        topic: "Public Health",
        sourceNote: "Original IELTS-style practice passage created for this app.",
        paragraphs: [
          {
            label: "A",
            text:
              "A public health team placed portable carbon-dioxide monitors in twelve classrooms. The monitors did not measure disease directly. They indicated how quickly indoor air was being replaced, which helped teachers decide when to open windows or move a lesson outdoors.",
          },
          {
            label: "B",
            text:
              "The monitors were most useful when paired with a simple wall chart. Green meant normal ventilation, amber meant that windows should be opened soon, and red meant that the class should take a short outdoor break if weather allowed.",
          },
        ],
      },
    ],
    questions: [
      q({
        passageId: "p1",
        type: "note-completion",
        prompt: "Monitors used in the study: portable ______ monitors.",
        answer: "carbon-dioxide",
        acceptedAnswers: ["carbon-dioxide", "carbon dioxide"],
        explanation:
          "Paragraph A identifies the devices as portable carbon-dioxide monitors.",
        evidenceParagraph: "Paragraph A",
        evidenceText:
          "A public health team placed portable carbon-dioxide monitors in twelve classrooms.",
        whyCorrect:
          "The adjective completes the type of monitor.",
        whyWrong:
          "A wrong answer such as disease copies the topic but not the device type.",
        skill: "Locating explicit information",
        secondarySkills: ["Understanding detail"],
        trapType: "Similar keyword trap",
        strategyTip:
          "Check the noun after the gap to decide whether the missing word is an adjective or noun.",
        difficulty: "Easy",
        paragraphRef: "A",
      }),
      q({
        passageId: "p1",
        type: "note-completion",
        prompt: "The devices did not measure ______ directly.",
        answer: "disease",
        acceptedAnswers: ["disease"],
        explanation:
          "Paragraph A says the monitors did not measure disease directly.",
        evidenceParagraph: "Paragraph A",
        evidenceText:
          "The monitors did not measure disease directly.",
        whyCorrect:
          "The answer completes the limitation of the monitors.",
        whyWrong:
          "Carbon dioxide is what the device monitored; disease is what it did not measure directly.",
        skill: "Understanding detail",
        secondarySkills: ["Recognising contrast"],
        trapType: "Opposite meaning trap",
        strategyTip:
          "Notice negative statements before copying a nearby technical term.",
        difficulty: "Easy",
        paragraphRef: "A",
      }),
      q({
        passageId: "p1",
        type: "note-completion",
        prompt: "High readings helped teachers decide when to open ______.",
        answer: "windows",
        acceptedAnswers: ["windows"],
        explanation:
          "Paragraph A says the monitors helped teachers decide when to open windows.",
        evidenceParagraph: "Paragraph A",
        evidenceText:
          "Which helped teachers decide when to open windows or move a lesson outdoors.",
        whyCorrect:
          "The answer is the first classroom action named in the passage.",
        whyWrong:
          "Outdoor lessons are the alternative action, not the object after open.",
        skill: "Understanding detail",
        secondarySkills: ["Locating explicit information"],
        trapType: "Grammar form trap",
        strategyTip:
          "Use the verb before the gap; 'open' requires an object such as windows.",
        difficulty: "Easy",
        paragraphRef: "A",
      }),
      q({
        passageId: "p1",
        type: "note-completion",
        prompt: "Amber signal: windows should be opened ______.",
        answer: "soon",
        acceptedAnswers: ["soon"],
        explanation:
          "Paragraph B says amber meant windows should be opened soon.",
        evidenceParagraph: "Paragraph B",
        evidenceText:
          "Amber meant that windows should be opened soon.",
        whyCorrect:
          "The adverb completes the action linked to the amber signal.",
        whyWrong:
          "Normal belongs to the green signal, not amber.",
        skill: "Understanding detail",
        secondarySkills: ["Understanding vocabulary in context"],
        trapType: "Similar keyword trap",
        strategyTip:
          "Keep colour labels matched to their specific instructions.",
        difficulty: "Easy",
        paragraphRef: "B",
      }),
      q({
        passageId: "p1",
        type: "note-completion",
        prompt: "Red signal: class may take a short ______ break.",
        answer: "outdoor",
        acceptedAnswers: ["outdoor"],
        explanation:
          "Paragraph B says red meant the class should take a short outdoor break if weather allowed.",
        evidenceParagraph: "Paragraph B",
        evidenceText:
          "Red meant that the class should take a short outdoor break if weather allowed.",
        whyCorrect:
          "The adjective outdoor completes the type of break.",
        whyWrong:
          "Weather allowed is a condition, not the missing descriptor.",
        skill: "Understanding detail",
        secondarySkills: ["Locating explicit information"],
        trapType: "Grammar form trap",
        strategyTip:
          "Check whether the missing word describes the noun after the gap.",
        difficulty: "Easy",
        paragraphRef: "B",
      }),
    ],
  },
  {
    drillId: "table-completion-drill-001",
    title: "Table Completion Drill: Keep Categories Straight",
    practiceMode: "question-type",
    questionType: "table-completion",
    skillFocus: ["Understanding detail", "Locating explicit information"],
    trapFocus: ["Similar keyword trap", "Grammar form trap", "Partial match trap"],
    difficulty: "Easy",
    estimatedTimeMinutes: 7,
    description: "Practise completing table cells with the correct category of information.",
    strategyLessonId: "strategy-table-completion",
    passages: [
      {
        passageId: "p1",
        title: "A Wheat Trial With Two Kinds of Water Stress",
        topic: "Agriculture",
        sourceNote: "Original IELTS-style practice passage created for this app.",
        paragraphs: [
          {
            label: "A",
            text:
              "A wheat trial compared three plots. Plot A received normal irrigation. Plot B received less water early in the season, when roots were developing. Plot C received less water after flowering, when grain weight was being set.",
          },
          {
            label: "B",
            text:
              "The early-stress plants grew deeper roots but produced fewer stems. The late-stress plants looked healthy at first, then produced lighter grains. The normal-irrigation plot produced the highest yield, although its roots were shallower than those in Plot B.",
          },
        ],
      },
    ],
    questions: [
      q({
        passageId: "p1",
        type: "table-completion",
        prompt: "Plot A water treatment: ______ irrigation.",
        answer: "normal",
        acceptedAnswers: ["normal"],
        explanation:
          "Paragraph A says Plot A received normal irrigation.",
        evidenceParagraph: "Paragraph A",
        evidenceText:
          "Plot A received normal irrigation.",
        whyCorrect:
          "The answer gives the water treatment, not a plant response.",
        whyWrong:
          "A wrong answer such as highest yield comes from the result column, not the treatment column.",
        skill: "Locating explicit information",
        secondarySkills: ["Understanding detail"],
        trapType: "Grammar form trap",
        strategyTip:
          "Use the table heading to decide whether you need a treatment, result or timing phrase.",
        difficulty: "Easy",
        paragraphRef: "A",
      }),
      q({
        passageId: "p1",
        type: "table-completion",
        prompt: "Plot B timing of stress: early in the season, when ______ were developing.",
        answer: "roots",
        acceptedAnswers: ["roots"],
        explanation:
          "Paragraph A says Plot B received less water when roots were developing.",
        evidenceParagraph: "Paragraph A",
        evidenceText:
          "Plot B received less water early in the season, when roots were developing.",
        whyCorrect:
          "The answer identifies what was developing during early stress.",
        whyWrong:
          "Stems are a later response, not the development stage named here.",
        skill: "Understanding detail",
        secondarySkills: ["Locating explicit information"],
        trapType: "Similar keyword trap",
        strategyTip:
          "Do not confuse the timing condition with the later plant response.",
        difficulty: "Easy",
        paragraphRef: "A",
      }),
      q({
        passageId: "p1",
        type: "table-completion",
        prompt: "Plot C timing of stress: after ______.",
        answer: "flowering",
        acceptedAnswers: ["flowering"],
        explanation:
          "Paragraph A says Plot C received less water after flowering.",
        evidenceParagraph: "Paragraph A",
        evidenceText:
          "Plot C received less water after flowering, when grain weight was being set.",
        whyCorrect:
          "The answer completes the timing phrase for Plot C.",
        whyWrong:
          "Grain weight is what was being set after flowering, not the word after the preposition.",
        skill: "Locating explicit information",
        secondarySkills: ["Understanding detail"],
        trapType: "Grammar form trap",
        strategyTip:
          "A preposition such as after often requires an event noun.",
        difficulty: "Easy",
        paragraphRef: "A",
      }),
      q({
        passageId: "p1",
        type: "table-completion",
        prompt: "Early-stress plants: deeper roots but fewer ______.",
        answer: "stems",
        acceptedAnswers: ["stems"],
        explanation:
          "Paragraph B says early-stress plants grew deeper roots but produced fewer stems.",
        evidenceParagraph: "Paragraph B",
        evidenceText:
          "The early-stress plants grew deeper roots but produced fewer stems.",
        whyCorrect:
          "The answer completes the contrast in the early-stress result.",
        whyWrong:
          "Grains belong to the late-stress result, not the early-stress row.",
        skill: "Understanding comparison",
        secondarySkills: ["Recognising contrast"],
        trapType: "Comparison confusion",
        strategyTip:
          "When a table compares rows, keep each result attached to the right plot.",
        difficulty: "Easy",
        paragraphRef: "B",
      }),
      q({
        passageId: "p1",
        type: "table-completion",
        prompt: "Late-stress plants: produced lighter ______.",
        answer: "grains",
        acceptedAnswers: ["grains"],
        explanation:
          "Paragraph B says late-stress plants produced lighter grains.",
        evidenceParagraph: "Paragraph B",
        evidenceText:
          "The late-stress plants looked healthy at first, then produced lighter grains.",
        whyCorrect:
          "The answer gives the result of late water stress.",
        whyWrong:
          "Roots and stems belong to other rows of the comparison.",
        skill: "Understanding detail",
        secondarySkills: ["Understanding comparison"],
        trapType: "Similar keyword trap",
        strategyTip:
          "Check the row label before copying a nearby plant part.",
        difficulty: "Easy",
        paragraphRef: "B",
      }),
    ],
  },
  {
    drillId: "short-answer-drill-001",
    title: "Short Answer Drill: Copy the Precise Noun",
    practiceMode: "question-type",
    questionType: "short-answer",
    skillFocus: ["Locating explicit information", "Understanding detail"],
    trapFocus: ["Similar keyword trap", "Chronology trap", "Partial match trap"],
    difficulty: "Easy",
    estimatedTimeMinutes: 7,
    description: "Practise finding concise answers without copying the wrong nearby noun.",
    strategyLessonId: "strategy-short-answer-questions",
    passages: [
      {
        passageId: "p1",
        title: "Old Maps and Flood Channels",
        topic: "Urban Planning",
        sourceNote: "Original IELTS-style practice passage created for this app.",
        paragraphs: [
          {
            label: "A",
            text:
              "Engineers studying a riverside district compared modern drainage plans with a map drawn in 1898. The old map showed a narrow flood channel that had later been filled with building rubble. Residents still called the lane beside it 'Brook Cut', although no stream was visible.",
          },
          {
            label: "B",
            text:
              "During heavy rain, water repeatedly gathered near Brook Cut. A ground survey found that the filled channel sat lower than the surrounding streets. The engineers recommended a shallow rain garden rather than a deep concrete drain, because the site was close to gas pipes.",
          },
        ],
      },
    ],
    questions: [
      q({
        passageId: "p1",
        type: "short-answer",
        prompt: "In what year was the old map drawn?",
        answer: "1898",
        acceptedAnswers: ["1898"],
        explanation:
          "Paragraph A identifies the old map as one drawn in 1898.",
        evidenceParagraph: "Paragraph A",
        evidenceText:
          "A map drawn in 1898.",
        whyCorrect:
          "The answer is the date attached to the map.",
        whyWrong:
          "A wrong answer may copy no stream was visible, but the question asks for a year.",
        skill: "Locating explicit information",
        secondarySkills: ["Understanding detail"],
        trapType: "No major trap",
        strategyTip:
          "For short-answer date questions, copy only the date unless the question asks for a phrase.",
        difficulty: "Easy",
        paragraphRef: "A",
      }),
      q({
        passageId: "p1",
        type: "short-answer",
        prompt: "What material had been used to fill the old flood channel?",
        answer: "building rubble",
        acceptedAnswers: ["building rubble", "rubble"],
        explanation:
          "Paragraph A says the flood channel had later been filled with building rubble.",
        evidenceParagraph: "Paragraph A",
        evidenceText:
          "A narrow flood channel that had later been filled with building rubble.",
        whyCorrect:
          "The answer names the filling material.",
        whyWrong:
          "Concrete drain is a rejected modern intervention, not the historical fill.",
        skill: "Locating explicit information",
        secondarySkills: ["Understanding detail"],
        trapType: "Chronology trap",
        strategyTip:
          "Separate past site changes from later engineering recommendations.",
        difficulty: "Easy",
        paragraphRef: "A",
      }),
      q({
        passageId: "p1",
        type: "short-answer",
        prompt: "What name did residents still use for the lane?",
        answer: "Brook Cut",
        acceptedAnswers: ["Brook Cut", "Brook Cut lane"],
        explanation:
          "Paragraph A says residents still called the lane Brook Cut.",
        evidenceParagraph: "Paragraph A",
        evidenceText:
          "Residents still called the lane beside it 'Brook Cut'.",
        whyCorrect:
          "The answer is the local lane name.",
        whyWrong:
          "Flood channel describes the feature, not the resident name.",
        skill: "Locating explicit information",
        secondarySkills: ["Understanding detail"],
        trapType: "Similar keyword trap",
        strategyTip:
          "When asked for a name, copy the proper noun exactly.",
        difficulty: "Easy",
        paragraphRef: "A",
      }),
      q({
        passageId: "p1",
        type: "short-answer",
        prompt: "What kind of survey found that the filled channel was lower than surrounding streets?",
        answer: "ground survey",
        acceptedAnswers: ["ground survey", "a ground survey"],
        explanation:
          "Paragraph B says a ground survey found the filled channel sat lower.",
        evidenceParagraph: "Paragraph B",
        evidenceText:
          "A ground survey found that the filled channel sat lower than the surrounding streets.",
        whyCorrect:
          "The answer names the survey type.",
        whyWrong:
          "Modern drainage plans and the old map were compared earlier, but the ground survey found the height difference.",
        skill: "Locating explicit information",
        secondarySkills: ["Understanding comparison"],
        trapType: "Similar keyword trap",
        strategyTip:
          "Find the verb in the question and locate the source that performed that action.",
        difficulty: "Easy",
        paragraphRef: "B",
      }),
      q({
        passageId: "p1",
        type: "short-answer",
        prompt: "What infrastructure made a deep concrete drain unsuitable?",
        answer: "gas pipes",
        acceptedAnswers: ["gas pipes"],
        explanation:
          "Paragraph B says the rain garden was recommended because the site was close to gas pipes.",
        evidenceParagraph: "Paragraph B",
        evidenceText:
          "The engineers recommended a shallow rain garden rather than a deep concrete drain, because the site was close to gas pipes.",
        whyCorrect:
          "The answer identifies the infrastructure that limited the engineering option.",
        whyWrong:
          "Building rubble explains the old filled channel, not the reason for avoiding a deep drain.",
        skill: "Recognising cause and effect",
        secondarySkills: ["Locating explicit information"],
        trapType: "Cause-effect confusion",
        strategyTip:
          "When a question asks why an option was unsuitable, look for because near the recommendation.",
        difficulty: "Easy",
        paragraphRef: "B",
      }),
    ],
  },
  {
    drillId: "locating-explicit-information-drill-001",
    title: "Locating Information Drill: Small Details, Right Paragraph",
    practiceMode: "skill",
    skill: "Locating explicit information",
    skillFocus: ["Locating explicit information", "Time-efficient scanning"],
    trapFocus: ["Wrong paragraph trap", "Similar keyword trap"],
    difficulty: "Easy",
    estimatedTimeMinutes: 7,
    description: "Practise finding exact details quickly without being pulled into the wrong paragraph.",
    strategyLessonId: "strategy-skill-locating-explicit-information",
    passages: [
      {
        passageId: "p1",
        title: "Lighting Trials in a Reading Room",
        topic: "Architecture",
        sourceNote: "Original IELTS-style practice passage created for this app.",
        paragraphs: [
          { label: "A", text: "A university library tested three desk-lamp settings in one reading room. The first setting used a cool blue-white light. The second used a warmer light with lower brightness. The third adjusted brightness automatically when daylight entered through the east windows." },
          { label: "B", text: "Students preferred the warmer light for long reading sessions, but the automatic setting reduced complaints about glare in the morning. Library staff chose to install automatic lamps only along the east wall, where sunlight changed most quickly." },
          { label: "C", text: "The trial did not measure exam performance. It recorded seat choice, complaint forms and the number of times students moved to another desk. These measures were simpler to collect and less intrusive than academic results." },
        ],
      },
    ],
    questions: [
      ["Which lamp setting used a cool blue-white light?", "first setting", "The first setting used a cool blue-white light.", "A"],
      ["Which setting changed brightness when daylight entered?", "third", "The third adjusted brightness automatically when daylight entered through the east windows.", "A"],
      ["Which light did students prefer for long reading sessions?", "warmer light", "Students preferred the warmer light for long reading sessions.", "B"],
      ["Where did staff install automatic lamps?", "along the east wall", "Library staff chose to install automatic lamps only along the east wall.", "B"],
      ["What did the trial not measure?", "exam performance", "The trial did not measure exam performance.", "C"],
    ].map(([prompt, answer, evidence, paragraph]) =>
      q({
        passageId: "p1",
        type: "short-answer",
        prompt,
        answer,
        acceptedAnswers: [answer],
        explanation:
          "The answer is stated directly, but nearby details make it easy to copy the wrong noun phrase.",
        evidenceParagraph: `Paragraph ${paragraph}`,
        evidenceText: evidence,
        whyCorrect:
          "The answer matches the exact detail requested in the question.",
        whyWrong:
          "A wrong answer usually comes from a neighbouring sentence or from the wrong measurement category.",
        skill: "Locating explicit information",
        secondarySkills: ["Time-efficient scanning"],
        trapType: "Similar keyword trap",
        strategyTip:
          "Scan for the unique noun in the question, then read the full sentence before copying.",
        difficulty: "Easy",
        paragraphRef: paragraph,
      }),
    ),
  },
  {
    drillId: "writer-opinion-drill-001",
    title: "Writer Opinion Drill: Cautious Claims",
    practiceMode: "skill",
    skill: "Identifying writer's opinion",
    skillFocus: ["Identifying writer's opinion", "Distinguishing fact from claim"],
    trapFocus: ["Writer opinion confusion", "Assumption trap", "Overgeneralisation trap"],
    difficulty: "Medium",
    estimatedTimeMinutes: 8,
    description: "Practise separating the writer's evaluation from facts and reported opinions.",
    strategyLessonId: "strategy-skill-identifying-writers-opinion",
    passages: [
      {
        passageId: "p1",
        title: "Citizen Photographs in Wildlife Surveys",
        topic: "Environmental Science",
        sourceNote: "Original IELTS-style practice passage created for this app.",
        paragraphs: [
          {
            label: "A",
            text:
              "Wildlife surveys increasingly invite visitors to upload animal photographs. The method is not a substitute for trained fieldwork, but it can reveal patterns that professional teams miss, especially in parks where visitors arrive at different times of day.",
          },
          {
            label: "B",
            text:
              "The main weakness is not that visitors are careless. Many photographs are sharp and carefully labelled. The difficulty is uneven attention: rare animals attract repeated uploads, while common species may be ignored because they seem too ordinary to record.",
          },
          {
            label: "C",
            text:
              "The best projects therefore treat citizen photographs as a clue, not a final count. Used carefully, they widen the field of observation. Used lazily, they create a colourful archive that looks more representative than it is.",
          },
        ],
      },
    ],
    questions: [
      q({
        passageId: "p1",
        type: "yes-no-not-given",
        prompt: "The writer believes visitor photographs can add value to wildlife surveys.",
        options: ["Yes", "No", "Not Given"],
        answer: "Yes",
        explanation:
          "Paragraph A says photographs can reveal patterns that professional teams miss.",
        evidenceParagraph: "Paragraph A",
        evidenceText:
          "It can reveal patterns that professional teams miss.",
        whyCorrect:
          "The writer sees a real benefit while still limiting the method.",
        whyWrong:
          "A wrong answer may focus only on the warning that the method is not a substitute.",
        skill: "Identifying writer's opinion",
        secondarySkills: ["Recognising contrast"],
        trapType: "Writer opinion confusion",
        strategyTip:
          "Look for balanced evaluations: a method can be limited and useful at the same time.",
        difficulty: "Medium",
        paragraphRef: "A",
      }),
      q({
        passageId: "p1",
        type: "yes-no-not-given",
        prompt: "The writer thinks visitor photographs should replace trained fieldwork.",
        options: ["Yes", "No", "Not Given"],
        answer: "No",
        explanation:
          "Paragraph A explicitly says the method is not a substitute for trained fieldwork.",
        evidenceParagraph: "Paragraph A",
        evidenceText:
          "The method is not a substitute for trained fieldwork.",
        whyCorrect:
          "The statement contradicts the writer's limitation.",
        whyWrong:
          "The writer's positive view of added value does not mean replacement.",
        skill: "Identifying writer's opinion",
        secondarySkills: ["Avoiding overgeneralisation"],
        trapType: "Overgeneralisation trap",
        strategyTip:
          "Do not convert support for a supplementary method into support for replacement.",
        difficulty: "Medium",
        paragraphRef: "A",
      }),
      q({
        passageId: "p1",
        type: "yes-no-not-given",
        prompt: "The writer says visitors usually upload photographs only after sunset.",
        options: ["Yes", "No", "Not Given"],
        answer: "Not Given",
        explanation:
          "The passage mentions visitors arriving at different times of day, but gives no claim about uploads only after sunset.",
        evidenceParagraph: "No confirming evidence",
        evidenceText:
          "Visitors arrive at different times of day, but the passage does not specify upload timing after sunset.",
        whyCorrect:
          "The specific time claim is not supported or contradicted.",
        whyWrong:
          "Different times of day is not enough evidence for an after-sunset claim.",
        skill: "Distinguishing fact from claim",
        secondarySkills: ["Identifying writer's opinion"],
        trapType: "Not Given trap",
        strategyTip:
          "Do not make a specific time statement from a general reference to varied timing.",
        difficulty: "Medium",
      }),
      q({
        passageId: "p1",
        type: "yes-no-not-given",
        prompt: "The writer believes uneven attention is a bigger issue than poor photograph quality.",
        options: ["Yes", "No", "Not Given"],
        answer: "Yes",
        explanation:
          "Paragraph B says the main weakness is not carelessness, since many photographs are sharp; the difficulty is uneven attention.",
        evidenceParagraph: "Paragraph B",
        evidenceText:
          "The main weakness is not that visitors are careless... The difficulty is uneven attention.",
        whyCorrect:
          "The writer explicitly ranks uneven attention as the main problem.",
        whyWrong:
          "A reader may assume amateur photographs are low quality, but the passage pushes against that assumption.",
        skill: "Identifying writer's opinion",
        secondarySkills: ["Recognising contrast"],
        trapType: "Assumption trap",
        strategyTip:
          "When the writer says 'not X... the difficulty is Y', identify Y as the real concern.",
        difficulty: "Medium",
        paragraphRef: "B",
      }),
      q({
        passageId: "p1",
        type: "yes-no-not-given",
        prompt: "The writer thinks citizen photographs are safest when treated as clues rather than final counts.",
        options: ["Yes", "No", "Not Given"],
        answer: "Yes",
        explanation:
          "Paragraph C states that the best projects treat citizen photographs as a clue, not a final count.",
        evidenceParagraph: "Paragraph C",
        evidenceText:
          "The best projects therefore treat citizen photographs as a clue, not a final count.",
        whyCorrect:
          "The statement paraphrases the writer's recommendation.",
        whyWrong:
          "A wrong answer may focus on the colourful archive warning and miss the recommended use.",
        skill: "Identifying writer's opinion",
        secondarySkills: ["Recognising paraphrase"],
        trapType: "Synonym trap",
        strategyTip:
          "Words like best signal the writer's preferred practice.",
        difficulty: "Medium",
        paragraphRef: "C",
      }),
    ],
  },
  {
    drillId: "cause-effect-drill-001",
    title: "Cause and Effect Drill: Do Not Reverse the Chain",
    practiceMode: "skill",
    skill: "Recognising cause and effect",
    skillFocus: ["Recognising cause and effect", "Understanding detail"],
    trapFocus: ["Cause-effect confusion", "Chronology trap", "Partial match trap"],
    difficulty: "Medium",
    estimatedTimeMinutes: 8,
    description: "Practise identifying what caused what in short academic explanations.",
    strategyLessonId: "strategy-skill-recognising-cause-and-effect",
    passages: [
      {
        passageId: "p1",
        title: "Wetland Channels and Mosquito Counts",
        topic: "Environmental Science",
        sourceNote: "Original IELTS-style practice passage created for this app.",
        paragraphs: [
          {
            label: "A",
            text:
              "A restored wetland initially produced more mosquito larvae than expected. The problem was not the extra water itself, but shallow pools that formed when newly dug channels became blocked by reed cuttings.",
          },
          {
            label: "B",
            text:
              "After volunteers cleared the channels, small fish moved into the pools and fed on larvae. Mosquito counts fell within three weeks. The project team therefore changed its maintenance schedule, clearing cuttings after planting rather than waiting until the end of the season.",
          },
        ],
      },
    ],
    questions: [
      q({
        passageId: "p1",
        type: "multiple-choice",
        prompt: "What caused the shallow pools to form?",
        options: [
          "Reed cuttings blocked the newly dug channels.",
          "Small fish fed on mosquito larvae.",
          "Volunteers cleared the channels too frequently.",
          "Mosquito counts fell within three weeks.",
        ],
        answer: "Reed cuttings blocked the newly dug channels.",
        explanation:
          "Paragraph A says shallow pools formed when newly dug channels became blocked by reed cuttings.",
        evidenceParagraph: "Paragraph A",
        evidenceText:
          "Shallow pools that formed when newly dug channels became blocked by reed cuttings.",
        whyCorrect:
          "The option identifies the immediate cause of the pools.",
        whyWrong:
          "The other options occur later in the chain or describe the outcome.",
        skill: "Recognising cause and effect",
        secondarySkills: ["Understanding detail"],
        trapType: "Cause-effect confusion",
        strategyTip:
          "Draw the chain in order: blockage -> pools -> larvae -> clearing -> fish -> lower counts.",
        difficulty: "Medium",
        paragraphRef: "A",
      }),
      q({
        passageId: "p1",
        type: "true-false-not-given",
        prompt: "The passage says extra water alone was responsible for the mosquito problem.",
        options: ["True", "False", "Not Given"],
        answer: "False",
        explanation:
          "Paragraph A says the problem was not the extra water itself but shallow pools from blocked channels.",
        evidenceParagraph: "Paragraph A",
        evidenceText:
          "The problem was not the extra water itself, but shallow pools.",
        whyCorrect:
          "The statement ignores the passage's contrast between extra water and blocked-channel pools.",
        whyWrong:
          "A reader may connect wetlands with water and mosquitoes, but the passage gives a more specific cause.",
        skill: "Recognising contrast",
        secondarySkills: ["Recognising cause and effect"],
        trapType: "Cause-effect confusion",
        strategyTip:
          "When the passage says 'not X, but Y', use Y as the cause.",
        difficulty: "Medium",
        paragraphRef: "A",
      }),
      q({
        passageId: "p1",
        type: "flow-chart-completion",
        prompt: "Channels cleared -> fish entered pools -> larvae were eaten -> mosquito counts ______.",
        answer: "fell",
        acceptedAnswers: ["fell", "decreased", "dropped"],
        explanation:
          "Paragraph B says mosquito counts fell within three weeks after fish fed on larvae.",
        evidenceParagraph: "Paragraph B",
        evidenceText:
          "Small fish moved into the pools and fed on larvae. Mosquito counts fell within three weeks.",
        whyCorrect:
          "The answer completes the outcome of the biological control chain.",
        whyWrong:
          "A wrong answer such as rose would reverse the described effect.",
        skill: "Recognising cause and effect",
        secondarySkills: ["Understanding detail"],
        trapType: "Chronology trap",
        strategyTip:
          "For flow charts, keep the final outcome separate from the initial problem.",
        difficulty: "Medium",
        paragraphRef: "B",
      }),
      q({
        passageId: "p1",
        type: "sentence-completion",
        prompt: "The maintenance schedule changed so cuttings were cleared after ______.",
        answer: "planting",
        acceptedAnswers: ["planting"],
        explanation:
          "Paragraph B says the team changed the schedule to clear cuttings after planting.",
        evidenceParagraph: "Paragraph B",
        evidenceText:
          "Clearing cuttings after planting rather than waiting until the end of the season.",
        whyCorrect:
          "The answer names the earlier point in the new maintenance schedule.",
        whyWrong:
          "The end of the season is the old timing that the new schedule replaced.",
        skill: "Recognising contrast",
        secondarySkills: ["Recognising cause and effect"],
        trapType: "Opposite meaning trap",
        strategyTip:
          "In 'rather than' sentences, identify which timing belongs to the new action.",
        difficulty: "Medium",
        paragraphRef: "B",
      }),
      q({
        passageId: "p1",
        type: "matching-sentence-endings",
        prompt: "Mosquito counts fell after volunteers cleared the channels because",
        options: [
          "reed cuttings became more numerous.",
          "the wetland stopped holding water.",
          "small fish were able to feed on larvae.",
          "planting was delayed until the next season.",
        ],
        answer: "small fish were able to feed on larvae.",
        explanation:
          "Paragraph B links channel clearing with fish entering pools and feeding on larvae.",
        evidenceParagraph: "Paragraph B",
        evidenceText:
          "After volunteers cleared the channels, small fish moved into the pools and fed on larvae. Mosquito counts fell within three weeks.",
        whyCorrect:
          "The ending preserves the biological mechanism behind the lower counts.",
        whyWrong:
          "The wrong endings contradict or distort the maintenance chain.",
        skill: "Recognising cause and effect",
        secondarySkills: ["Making inference"],
        trapType: "Cause-effect confusion",
        strategyTip:
          "Look for the mechanism between an action and an outcome.",
        difficulty: "Medium",
        paragraphRef: "B",
      }),
    ],
  },
];

export const practiceDrills: DrillSet[] = drillSeeds.map(makeDrill);

export function getDrillById(drillId: string) {
  return practiceDrills.find((drill) => drill.drillId === drillId);
}

export function getDrillsByQuestionType(questionType: QuestionType) {
  return practiceDrills.filter((drill) => drill.questionType === questionType);
}

export function getDrillsBySkill(skill: SkillTag) {
  return practiceDrills.filter((drill) => drill.skill === skill || drill.skillFocus.includes(skill));
}

export function getRelatedDrills(drill: DrillSet, limit = 3) {
  const related = practiceDrills.filter((item) => {
    if (item.drillId === drill.drillId) return false;
    if (drill.questionType && item.questionType === drill.questionType) return true;
    if (drill.skill && (item.skill === drill.skill || item.skillFocus.includes(drill.skill))) return true;
    return item.skillFocus.some((skill) => drill.skillFocus.includes(skill));
  });

  return related.slice(0, limit);
}
