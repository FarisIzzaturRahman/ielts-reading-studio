import type { Question, QuestionType, SkillTag, TrapType } from "@/data/types";

export function skillForQuestion(type: QuestionType, answer: string): SkillTag {
  if (answer === "Not Given") return "Distinguishing fact from claim";

  const skillMap: Record<QuestionType, SkillTag> = {
    "true-false-not-given": "Understanding detail",
    "yes-no-not-given": "Identifying writer's opinion",
    "multiple-choice": "Recognising paraphrase",
    "matching-headings": "Understanding main idea",
    "matching-information": "Time-efficient scanning",
    "matching-features": "Locating explicit information",
    "sentence-completion": "Understanding detail",
    "summary-completion": "Recognising paraphrase",
    "note-completion": "Understanding vocabulary in context",
    "table-completion": "Locating explicit information",
    "flow-chart-completion": "Recognising cause and effect",
    "short-answer": "Time-efficient scanning",
    "diagram-label-completion": "Making inference",
    "matching-sentence-endings": "Understanding main idea",
  };

  return skillMap[type];
}

export function secondarySkillsForQuestion(type: QuestionType, answer: string): SkillTag[] {
  if (answer === "Not Given") {
    return ["Avoiding overgeneralisation", "Locating explicit information"];
  }

  const secondaryMap: Record<QuestionType, SkillTag[]> = {
    "true-false-not-given": ["Avoiding overgeneralisation", "Recognising contrast"],
    "yes-no-not-given": ["Making inference", "Distinguishing fact from claim"],
    "multiple-choice": ["Understanding detail", "Locating explicit information"],
    "matching-headings": ["Identifying paragraph function"],
    "matching-information": ["Recognising paraphrase"],
    "matching-features": ["Understanding detail"],
    "sentence-completion": ["Understanding vocabulary in context"],
    "summary-completion": ["Understanding detail"],
    "note-completion": ["Understanding detail"],
    "table-completion": ["Time-efficient scanning"],
    "flow-chart-completion": ["Following reference words"],
    "short-answer": ["Locating explicit information"],
    "diagram-label-completion": ["Recognising cause and effect"],
    "matching-sentence-endings": ["Recognising paraphrase"],
  };

  return secondaryMap[type];
}

export function trapForQuestion(type: QuestionType, answer: string, prompt: string): TrapType {
  const lowerPrompt = prompt.toLowerCase();

  if (answer === "Not Given") return "Not Given trap";
  if (/\b(all|always|never|only|every|completely|entire|any)\b/.test(lowerPrompt)) {
    return "Extreme wording trap";
  }

  const trapMap: Record<QuestionType, TrapType> = {
    "true-false-not-given": "Overgeneralisation trap",
    "yes-no-not-given": "Writer opinion confusion",
    "multiple-choice": "Distractor detail trap",
    "matching-headings": "Partial match trap",
    "matching-information": "Wrong paragraph trap",
    "matching-features": "Similar keyword trap",
    "sentence-completion": "Grammar form trap",
    "summary-completion": "Synonym trap",
    "note-completion": "Grammar form trap",
    "table-completion": "Similar keyword trap",
    "flow-chart-completion": "Cause-effect confusion",
    "short-answer": "Similar keyword trap",
    "diagram-label-completion": "Assumption trap",
    "matching-sentence-endings": "Partial match trap",
  };

  return trapMap[type];
}

export function strategyTipForQuestion(type: QuestionType, trapType: TrapType): string {
  if (trapType === "Not Given trap") {
    return "Choose Not Given only when the passage does not provide enough evidence to confirm or contradict the statement.";
  }
  if (trapType === "Extreme wording trap" || trapType === "Overgeneralisation trap") {
    return "Check absolute words such as all, always, never, only, every and completely against the exact wording in the passage.";
  }

  const strategyMap: Record<QuestionType, string> = {
    "true-false-not-given":
      "Compare the whole statement with the passage. One changed detail can turn True into False.",
    "yes-no-not-given":
      "Separate the writer's view from factual background information before choosing Yes, No or Not Given.",
    "multiple-choice":
      "Eliminate options that sound plausible but are not directly supported by the evidence sentence.",
    "matching-headings":
      "Read the whole paragraph before choosing. A heading should capture the main idea, not one attractive detail.",
    "matching-information":
      "Do not rely only on repeated keywords. Search for paraphrased meaning across the passage.",
    "matching-features":
      "Match the role or person to the exact action described, not to a nearby keyword.",
    "sentence-completion":
      "Check both meaning and grammar around the gap before copying the answer.",
    "summary-completion":
      "Use the summary grammar to predict the missing word type, then confirm it with passage evidence.",
    "note-completion":
      "Keep answers short and copy the exact noun or phrase supported by the passage.",
    "table-completion":
      "Scan for the row or column idea first, then check the exact detail needed for the cell.",
    "flow-chart-completion":
      "Follow the sequence carefully; a correct word in the wrong step is still incorrect.",
    "short-answer":
      "Locate the answer sentence before writing. Do not add extra explanation beyond the word limit.",
    "diagram-label-completion":
      "Use labels and arrows as clues, but confirm the answer from passage evidence.",
    "matching-sentence-endings":
      "Choose the ending that completes the meaning of the original sentence, not just a grammatically possible ending.",
  };

  return strategyMap[type];
}

export function whyCorrectForQuestion(question: Pick<Question, "answer" | "evidenceText" | "type">) {
  const evidence = question.evidenceText || "The evidence in the passage supports the accepted answer.";
  return `The correct answer is ${question.answer} because the relevant passage evidence supports this meaning: ${evidence}`;
}

export function whyWrongForQuestion(question: Pick<Question, "answer" | "trapType" | "type">) {
  if (question.answer === "Not Given") {
    return "A common mistake is treating a mentioned topic as confirmed information. IELTS Reading requires enough evidence to prove the statement true or false.";
  }
  if (question.trapType === "Extreme wording trap" || question.trapType === "Overgeneralisation trap") {
    return "A common wrong answer comes from accepting a broad or absolute statement even though the passage supports a narrower claim.";
  }
  if (question.trapType === "Distractor detail trap" || question.trapType === "Partial match trap") {
    return "A common wrong answer matches one detail or keyword but misses the main meaning required by the question.";
  }
  if (question.trapType === "Grammar form trap") {
    return "A common wrong answer may locate the right area but use a word form that does not fit the sentence grammar.";
  }
  return "A common wrong answer comes from using general impression or keyword matching instead of checking the exact evidence.";
}
