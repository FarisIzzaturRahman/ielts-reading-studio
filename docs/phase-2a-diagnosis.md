# Phase 2A: Enhanced Review, Skill Diagnosis, and Basic Recommendation

## Implementation Plan

1. Extend question metadata with evidence, why-correct, why-wrong, skill, secondary skills, trap type and strategy tip.
2. Add reusable diagnosis utilities outside UI components.
3. Save generated diagnosis data with completed attempts in LocalStorage.
4. Upgrade the result page with question-type, skill and trap-type performance.
5. Add a mistake pattern summary and rule-based recommendations.
6. Upgrade the review page so each item reads like tutor feedback.
7. Validate the full mini-test flow on desktop and mobile.

## Current Gap Analysis

Before Phase 2A, the simulator could score and review answers, but the learning layer was still basic:

- Explanations were short and often generic.
- Skill tags were broad and inconsistent with IELTS learning needs.
- Trap types were not represented.
- Result diagnostics showed some skill/type performance but not mistake patterns.
- Recommendations were limited to a next-test link.
- Diagnosis data was not saved separately for future history use.

## Updated Data Schema

Each question now supports:

- `evidenceParagraph`
- `evidenceText`
- `whyCorrect`
- `whyWrong`
- `skill`
- `secondarySkills`
- `trapType`
- `strategyTip`
- `difficulty`
- `tags`

The primary skill vocabulary has been standardized around IELTS Academic Reading skills such as recognising paraphrase, making inference, understanding main idea, avoiding overgeneralisation and time-efficient scanning.

## Diagnosis Logic

Reusable logic lives in `src/lib/diagnosis.ts`:

- `calculateQuestionTypePerformance()`
- `calculateSkillPerformance()`
- `calculateTrapTypePerformance()`
- `identifyStrongestQuestionType()`
- `identifyWeakestQuestionType()`
- `identifyStrongestSkill()`
- `identifyWeakestSkill()`
- `identifyMostCommonTrap()`
- `generateMistakeSummary()`
- `generateRecommendations()`
- `generateDiagnosis()`

## Updated Result Page Design

The result page now includes:

- Overall result summary.
- Raw score, percentage, estimated mini-band and completion time.
- Performance interpretation.
- Performance by question type.
- Performance by reading skill.
- Trap type pattern.
- Mistake pattern summary.
- Recommended next practice.
- Review, retake and library CTAs.

## Updated Review Page Design

Each review item now includes:

- Question number.
- Question type.
- Passage title.
- User answer.
- Correct answer.
- Correct / Incorrect / Unanswered status.
- Evidence paragraph and evidence text.
- Why the correct answer is correct.
- Why the user answer was incorrect when relevant.
- Primary skill.
- Secondary skills.
- Trap type.
- Strategy tip.
- Difficulty level.

## LocalStorage Strategy

Progress and result storage remain browser-only and versioned under `ielts-reading:v1`.

Phase 2A adds:

- `ielts-reading:v1:diagnosis:${testId}`
- `ielts-reading:v1:diagnosis-history`

Completed result objects also include `diagnosis` directly. If an older saved result has no diagnosis, the result page regenerates it from the saved answers and current question metadata.

## Content Metadata Update

The current 15 AI-generated mini tests are enhanced programmatically from their existing original content. This keeps the MVP maintainable while ensuring every question has the metadata needed for Phase 2A learning feedback.

Editorial note: the content is original and academically themed, but still seed-level. Future Phase 2B content work should make passages longer, less templated and more IELTS-like in paraphrase density.

## QA Checklist Result

| Check | Result |
| --- | --- |
| Complete one test and submit | Pass |
| Result page shows raw score correctly | Pass |
| Result page shows estimated band correctly | Pass |
| Question type performance is calculated correctly | Pass |
| Skill performance is calculated correctly | Pass |
| Trap type summary is calculated correctly | Pass |
| Mistake pattern summary matches actual mistakes | Pass |
| Recommendations match weak areas | Pass |
| Review page shows evidence for each question | Pass |
| Review page shows correct user answer and correct answer | Pass |
| Unanswered questions are handled correctly | Pass |
| Correct answers are not shown as mistakes | Pass |
| Incorrect answers show useful explanation | Pass |
| LocalStorage saves diagnosis data | Pass |
| Retaking a test updates result data correctly | Pass |
| Restarting a test does not corrupt previous completed results unless intentionally reset | Pass |
| Mobile layout remains usable | Pass |
| Desktop layout remains comfortable | Pass |
| Invalid or missing metadata does not crash the app | Pass |
| Build passes without TypeScript errors | Pass |
| Vercel deployment works | Build-ready; live Vercel deployment not run from this local session |

## Remaining Issues For Phase 2B

- Add dedicated question-type practice pages for recommendation links.
- Add manual editorial review for all generated passages and questions.
- Add automated tests for diagnosis utilities.
- Add richer exact evidence sentences rather than generated evidence summaries.
- Add optional local score-history views.
