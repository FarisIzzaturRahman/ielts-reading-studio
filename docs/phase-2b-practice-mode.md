# Phase 2B: Question-Type and Skill-Based Practice Mode

## Implementation Plan

1. Add a central Practice Hub at `/practice`.
2. Add question-type practice pages and skill practice pages.
3. Add reusable drill and strategy lesson schemas.
4. Create launch content: 6 question-type drills and 4 skill drills.
5. Build a focused drill session with local answer saving.
6. Add drill scoring, feedback, mistake summary and recommendations.
7. Reuse enhanced evidence-based review for drill review pages.
8. Connect Phase 2A recommendations to real practice routes.
9. Save local practice progress and drill results.
10. Validate build, desktop flow and mobile usability.

## Current Gap Analysis

Before Phase 2B, learners could understand weaknesses after a mini test, but they could not practise that weakness directly. Recommendations pointed to generic test-library filters rather than dedicated practice pages. There was no shorter drill mode, no strategy-before-practice flow, and no local practice history for drill attempts.

## Updated Product Structure

- `/practice` Practice Hub.
- `/practice/question-types` Question type index.
- `/practice/question-types/[questionTypeSlug]` Strategy and drills for a specific IELTS Reading question type.
- `/practice/skills` Reading skill index.
- `/practice/skills/[skillSlug]` Strategy and drills for a specific reading skill.
- `/practice/drills/[drillId]` Strategy lesson and drill session.
- `/practice/drills/[drillId]/result` Drill score, mistake pattern and recommendations.
- `/practice/drills/[drillId]/review` Evidence-based drill review.

## Drill Data Schema

Drills use `DrillSet` in `src/data/types.ts`:

- `drillId`
- `title`
- `practiceMode`
- `questionType`
- `skill`
- `skillFocus`
- `difficulty`
- `estimatedTimeMinutes`
- `description`
- `strategyLessonId`
- `passages`
- `questions`

The launch drills are generated from the app's existing original IELTS-style Academic Reading content, with excerpted passages and preserved evidence metadata.

## Strategy Lesson Schema

Strategy lessons use `StrategyLesson`:

- `lessonId`
- `title`
- `questionType` or `skill`
- `skillFocus`
- `whatItTests`
- `whyItMatters`
- `steps`
- `commonTraps`
- `workedExample`

## Minimum Drill Content For Launch

Question-type drills:

- True / False / Not Given Drill 1
- Matching Headings Drill 1
- Matching Information Drill 1
- Summary Completion Drill 1
- Sentence Completion Drill 1
- Multiple Choice Drill 1

Skill drills:

- Recognising Paraphrase Drill 1
- Main Idea Drill 1
- Inference Practice Drill 1
- Time-efficient Scanning Drill 1

## Practice Result Logic

Reusable logic lives in `src/lib/drill-scoring.ts`:

- `scoreDrillAttempt()`
- `calculateDrillAccuracy()`
- `summarizeDrillMistakes()`
- `generateDrillFeedback()`
- `generateNextDrillRecommendations()`

Short drills show raw score, percentage, incorrect count, unanswered count, skill performance, trap pattern and next practice recommendations. They do not show IELTS band estimates.

## LocalStorage Strategy

Practice data remains browser-only:

- `ielts-reading-practice-progress-v1:${drillId}`
- `ielts-reading-drill-results-v1:${drillId}`
- `ielts-reading-drill-results-v1`

Saved data includes in-progress drill answers, completed drill IDs, scores, history, accuracy by question type and accuracy by skill.

## Recommendation Linking

Phase 2A recommendations now link to Phase 2B pages:

- Matching Headings weakness -> `/practice/question-types/matching-headings`
- True / False / Not Given weakness -> `/practice/question-types/true-false-not-given`
- Inference weakness -> `/practice/skills/making-inference`
- Not Given traps -> `/practice/drills/tfng-drill-001`
- Timed scanning -> `/practice/skills/time-efficient-scanning`
- General foundations -> `/practice`

## QA Checklist Result

| Check | Result |
| --- | --- |
| Practice Hub loads correctly | Pass |
| Question Type Practice page loads correctly | Pass |
| Skill Practice page loads correctly | Pass |
| Each question type card links correctly | Pass |
| Each skill card links correctly | Pass |
| Drill list displays available drills | Pass |
| Strategy lesson appears before practice | Pass |
| Drill session starts correctly | Pass |
| Users can answer all drill questions | Pass |
| Answers are saved during the drill | Pass |
| Users can submit a drill | Pass |
| Drill result page shows correct score | Pass |
| Drill review page shows explanations and evidence | Pass |
| Retry drill works | Pass |
| Similar drill recommendation works | Pass |
| Phase 2A recommendations link to practice pages | Pass |
| Missing drill pages show helpful error | Pass |
| LocalStorage saves drill results | Pass |
| Practice progress updates correctly | Pass |
| Mobile layout is usable | Pass |
| Desktop layout is comfortable | Pass |
| No TypeScript errors | Pass |
| No console errors | Pass |
| App builds successfully | Pass |
| Vercel deployment works | Build-ready; live Vercel deployment not run from this local session |
| Existing simulator features still work | Build and route smoke checks pass |

## Remaining Issues For Phase 2C

- Add more manually edited drills for every question type and skill.
- Add a local progress dashboard with trends over time.
- Add a mistake notebook for saved incorrect items.
- Add confidence rating before answer submission.
- Add richer, manually written evidence sentences for all generated seed content.
- Add automated unit tests for practice scoring and storage migrations.

## Content Originality Note

All Phase 2B launch drills use original IELTS-style Academic Reading material generated for this app. Do not copy official IELTS, Cambridge, British Council, IDP, commercial test-book passages, diagrams, questions, answer keys or explanations.
