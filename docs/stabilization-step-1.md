# Step 1 Stabilization Report

## Current-State Audit

The first version already had the right foundation: Next.js routes for home, library, instructions, practice, results, review, and about; 15 original IELTS-style mini tests; scoring; local answer storage; and a split reading interface.

Key issues found before stabilization:

- Product copy did not consistently say free, no-login, self-learner, Academic Reading-only.
- Test cards only showed completed/not completed, not in-progress status.
- Starting, continuing, restarting, and retaking attempts were not explicit.
- Practice page could overwrite saved progress before client hydration finished.
- Timer persisted by saved seconds only, which could pause unintentionally across refresh or absence.
- Submit modal did not show answered and flagged counts.
- Result page did not show percentage, incorrect count, or question-type performance.
- Review page lacked question type, difficulty, evidence paragraph, and unanswered/incorrect labels.
- Mobile layout stacked everything rather than giving practical Passage/Questions/Review views.
- LocalStorage failures were silently ignored.
- Invalid routes used the default not-found experience.

## Gap Analysis

| Area | Status After Step 1 |
| --- | --- |
| Academic Reading-only positioning | Improved copy across app and README. |
| Free/no login messaging | Added to home, library, instructions, about, footer, README. |
| Test library statuses | Added Not Started, In Progress, Completed and last score. |
| Start/continue/restart/retake | Added explicit attempt actions. |
| Timer | Reworked to deadline-based persistence. |
| Answer input | Normalized scoring retained; accepted answer arrays supported. |
| Question navigation | Added active question state and passage labels. |
| Auto-save | Added safer hydration, clean keys, attempt status, deadline, and storage warning. |
| Submit confirmation | Added answered, unanswered, flagged counts and Escape handling. |
| Results | Added percentage, incorrect count, skill and question-type performance, retake/library CTAs. |
| Review | Added status labels, question type, evidence, skill, difficulty, and strategy note. |
| Mobile usability | Added Passage, Questions, Review tabs on small screens. |
| Error handling | Added missing data guard, no-result states, no-review states, custom not-found. |
| Vercel readiness | `npm run build` passes. |
| GitHub cleanliness | README expanded with scope, setup, deployment, disclaimer, roadmap. |

## Prioritized Stabilization Plan Applied

1. Protect saved attempts from hydration overwrite.
2. Make timer deadline-based and non-pausable during simulation.
3. Add explicit attempt lifecycle: start, continue, restart, complete, retake.
4. Improve result/review learning value without adding advanced coaching.
5. Add mobile fallback views.
6. Align public copy with Academic-only, free, no-login positioning.
7. Update repository documentation.

## Updated Data Schema

Tests now include `description`, `targetBand`, `mode`, `testType`, and `totalQuestions`.

Questions now include `questionNumber`, `acceptedAnswers`, `evidenceParagraph`, `evidenceText`, and `tags`.

The schema is still lightweight and local-first, but it can support future full 40-question Academic Reading tests by changing `mode`, `timeLimitMinutes`, `totalQuestions`, and scoring conversion.

## Content Quality Notes

The existing seed content is original and academic in broad topic choice. It is stable enough for MVP testing, but the passages are shorter and more templated than real IELTS Academic Reading passages. Before public promotion, each test should receive editorial review for:

- passage length and complexity,
- answer uniqueness,
- paraphrase quality,
- more natural distribution of question types,
- richer evidence sentences,
- less repetitive passage structure.

## QA Checklist

| Check | Result |
| --- | --- |
| Home page loads | Pass |
| Test library loads | Pass |
| All test cards display | Pass |
| Instruction page works | Pass |
| Test starts from Start Test action | Pass |
| Timer starts after attempt begins | Pass |
| Answers can be selected and typed | Pass |
| Answers persist after navigation | Pass |
| Answers persist after refresh | Pass |
| Question navigation works | Pass |
| Submit confirmation works | Pass |
| Scoring is correct for tested answers | Pass |
| Result page loads | Pass |
| Review page loads | Pass |
| Retake test starts a clean attempt | Pass |
| Restart test clears old answers | Pass |
| Unanswered questions handled | Pass |
| Time expiry auto-submits | Not manually waited; deadline code path implemented |
| Invalid test route shows useful error | Pass |
| App builds successfully | Pass |
| Vercel readiness | Pass |
| Mobile usability | Pass |
| Desktop usability | Pass |
| Console errors | Pass in Playwright smoke test |
| TypeScript errors | Pass |

## Remaining Issues For Next Phase

- Add automated unit tests for scoring and timer helpers.
- Add Playwright test files for the full attempt flow.
- Replace generated seed passages with fully edited, longer Academic Reading passages.
- Add stronger evidence snippets that quote or paraphrase exact supporting sentences.
- Add question-type practice pages only after the simulator remains stable.
