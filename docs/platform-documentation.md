# IELTS Reading Studio Platform Documentation

## Project Overview

IELTS Reading Studio is a free, no-login IELTS Academic Reading practice platform for self-learners. It provides timed mini tests, focused practice drills, automatic scoring, evidence-based answer review, skill diagnosis, trap diagnosis and local progress storage.

The platform is independent. It is not affiliated with, endorsed by or approved by IELTS, Cambridge, British Council, IDP or any official IELTS organisation. All reading passages, questions, answer keys and explanations are original IELTS-style practice materials.

## Product Vision

The product goal is to help IELTS Academic candidates practise in a serious reading environment and then understand what to improve. The platform should feel closer to a disciplined study tool than a casual quiz site: readable passages, realistic question types, fair traps, precise evidence, useful explanations and no unnecessary barriers.

The long-term content principle is:

1. Quality benchmark first.
2. Controlled scaling second.
3. Validation before publishing.

As of the latest human QA pass, content expansion is paused until the current simulator UX remains polished and comfortable in live use.

## Target Users

- IELTS Academic candidates practising independently.
- Beginner to advanced self-learners.
- Band 7-9 learners who need realistic trap and inference practice.
- Teachers or tutors who want free original practice materials to recommend informally.

No account is required, and the platform does not collect personal learning data.

## IELTS Academic-Only Scope

This project focuses only on IELTS Academic Reading. Content should use academic topics, long-form adapted academic passages and standard IELTS Academic Reading question types.

Do not add:

- IELTS General Training.
- Workplace letters.
- Everyday notices.
- Social survival reading.
- Payment, freemium locking or subscriptions.
- Teacher dashboard, community features or live AI tutoring.
- Official IELTS branding imitation.

## Key Features

- 15 human-reviewed IELTS Academic Reading mini tests.
- 20 questions per mini test.
- 30-minute mini-test timer.
- Split desktop test layout with independently scrollable passage and question panels.
- Mobile fallback tabs for Passage, Questions and Review/navigation.
- Auto-save for answers, flags, timer deadline, notes and removable highlights.
- Submit confirmation with unanswered and flagged counts.
- Raw score, percentage and approximate mini-band estimate.
- Result diagnosis by question type, reading skill and trap type.
- Evidence-based answer review with side-by-side passage access and why-correct/why-wrong explanations.
- Practice Hub with question-type and skill-based drills.
- 26 drill-native practice sets from earlier phases.
- LocalStorage-only progress and practice history.
- Central taxonomy and metadata system.
- Content validation pipeline for publishing gates.

## Test Simulator Flow

1. User opens the home page.
2. User browses the Academic Reading test library.
3. User opens a test instruction page.
4. Timer starts only after Start Test.
5. User reads passages and answers questions.
6. On desktop, the passage and question panels scroll independently so the reading text remains accessible while answering.
7. On mobile, the user switches between Passage, Questions and Review/navigation tabs.
8. Answers, flags, notes and highlights auto-save locally.
9. Highlights can be removed individually or cleared for the passage.
10. User submits manually or is submitted automatically when time expires.
11. Result page shows score, approximate band range and diagnosis.
12. Review page keeps the passage accessible while explanations scroll independently.
13. User can retake the test or return to the library.

## Review and Diagnosis System

Each completed mini test generates:

- Raw score.
- Percentage.
- Approximate mini-test band estimate.
- Correct, incorrect and unanswered counts.
- Performance by question type.
- Performance by reading skill.
- Trap pattern summary.
- Mistake pattern summary.
- Rule-based recommendations.

Question review items include:

- User answer.
- Correct answer.
- Status: Correct, Incorrect or Unanswered.
- Passage title and evidence paragraph.
- Exact evidence excerpt or close passage excerpt.
- Explanation.
- Why the correct answer works.
- Why the user's answer is wrong or tempting.
- Skill tag.
- Trap type.
- Difficulty.
- Strategy tip.

## Practice Mode Overview

Practice mode was implemented before the current test-only expansion. It remains available but was not expanded in Batch C or Batch D.

Current practice features:

- `/practice` Practice Hub.
- Practice by question type.
- Practice by reading skill.
- Drill session pages.
- Drill result and drill review pages.
- Drill-native passages and questions.
- LocalStorage-based drill history.

The drill library currently contains 26 drills. Do not add drills during test-only expansion phases unless a later phase explicitly changes scope.

## Human QA Revision Notes

The May 2026 human QA pass paused content expansion and addressed live MVP usability issues:

- Difficulty categories now include IELTS-oriented explanations and a short "Which level should I choose?" helper on the test library page.
- Test cards show the difficulty meaning without claiming official IELTS scoring accuracy.
- Reading-test pages use independent desktop scrolling: the passage stays available while the questions panel scrolls.
- Review pages use the same side-by-side desktop pattern and a mobile Passage/Review toggle.
- Highlights can be removed by clicking highlighted text, removed from the saved-highlight list or cleared all at once.
- Restarting a test creates a fresh attempt with no old highlights.
- Inactive review CTAs were removed until a real mistake notebook or similar-practice feature is ready.
- User-facing routes now use clean slugs. Internal IDs follow `academic-reading-001` style, with legacy `realism-*` IDs retained only for route and LocalStorage compatibility.

## Content Architecture

Core data files:

- `src/data/tests.ts` contains published mini tests.
- `src/data/drills.ts` contains published drill-native practice sets.
- `src/data/strategy-lessons.ts` contains strategy lesson metadata and text.
- `src/data/content-library.ts` combines tests, drills and lessons.
- `src/data/taxonomy/` contains centralized taxonomy definitions.
- `src/data/types.ts` defines the shared content schema.

Core logic files:

- `src/lib/scoring.ts` answer normalization and scoring.
- `src/lib/diagnosis.ts` test diagnosis and recommendations.
- `src/lib/drill-scoring.ts` drill scoring and feedback.
- `src/lib/storage.ts` safe LocalStorage helpers.
- `src/lib/test-routing.ts` clean route helpers for user-facing test slugs.
- `src/lib/timer.ts` deadline-based timer helpers.
- `src/lib/content-metadata.ts` metadata builders.
- `src/lib/content-relationships.ts` relationship index.
- `src/lib/validation/content.ts` content validation utilities.
- `scripts/validate-content.ts` validation command.

## Taxonomy System

Use centralized taxonomy labels only. Do not invent duplicate labels.

Question types include:

- True / False / Not Given
- Yes / No / Not Given
- Matching Headings
- Matching Information
- Matching Features
- Matching Sentence Endings
- Multiple Choice
- Sentence Completion
- Summary Completion
- Note Completion
- Table Completion
- Flow-chart Completion
- Short Answer Questions
- Diagram Label Completion

Reading skill tags include:

- Locating explicit information
- Understanding main idea
- Identifying writer's opinion
- Recognising paraphrase
- Understanding detail
- Making inference
- Distinguishing fact from claim
- Following reference words
- Understanding vocabulary in context
- Identifying paragraph function
- Recognising contrast
- Recognising cause and effect
- Understanding comparison
- Avoiding overgeneralisation
- Time-efficient scanning

Trap types include:

- Synonym trap
- Opposite meaning trap
- Extreme wording trap
- Overgeneralisation trap
- Not Given trap
- Partial match trap
- Similar keyword trap
- Wrong paragraph trap
- Distractor detail trap
- Chronology trap
- Cause-effect confusion
- Comparison confusion
- Writer opinion confusion
- Grammar form trap
- Assumption trap
- No major trap

Difficulty categories are user-facing study guides, not official IELTS score predictions:

- Easy: confidence-building tests with clearer evidence, more direct paraphrasing and lighter cognitive load.
- Medium: regular practice with moderate paraphrasing, mixed question types and realistic traps.
- Hard: Band 7+ oriented tests with denser passages, subtler paraphrasing, stronger distractors and more inference.
- Band 8-9 Challenge: advanced practice with dense academic passages, reduced keyword overlap, subtle inference and demanding distractors.

## Metadata Standards

Every published test should include:

- `testId`
- `slug`
- `legacyIds` only when preserving older routes or LocalStorage keys
- `title`
- `description`
- `topic`
- `difficulty`
- `targetBand`
- `mode`
- `testType: "Academic"`
- `timeLimitMinutes`
- `estimatedTimeMinutes`
- `totalQuestions`
- `passages`
- `questions`
- generated `metadata`

Every passage should include:

- `passageId`
- `title`
- `topic`
- `sourceNote`
- `paragraphs`
- generated `metadata`

Every question should include:

- `type`
- `prompt`
- `options` where relevant
- `answer`
- `acceptedAnswers` where relevant
- `explanation`
- `evidenceParagraph`
- `evidenceText`
- `whyCorrect`
- `whyWrong`
- `skill`
- `secondarySkills`
- `trapType`
- `strategyTip`
- `difficulty`
- `paragraphRef` when relevant

The current schema stores publishing status inside generated metadata as `status: "published"`. Draft or unvalidated content should not be included in the exported user-facing arrays.

## Test Naming and Routes

Tests use three naming layers:

- Internal ID: stable machine-safe ID such as `academic-reading-001`.
- Public slug: readable route segment such as `urban-heat-and-public-space`.
- Display title: learner-facing title such as `Green Roofs and Urban Heat`.

Do not expose old editorial labels such as `realism-easy-01` in the interface. Keep old IDs only in `legacyIds` when needed for backward-compatible routes and LocalStorage recovery.

## Editorial Status System

The supported content status values are:

- `generated`
- `realism-reviewed`
- `psychometric-reviewed`
- `finalized`
- `published`
- `draft`
- `reviewed`
- `validated`

Only published, validation-passing content should appear in the public library.

Recommended editorial path:

1. Draft content.
2. Realism review.
3. Psychometric review.
4. Metadata and taxonomy check.
5. Evidence check.
6. Answer-distribution check.
7. Validation command.
8. Publish.

## QA and Validation Pipeline

Run before publishing:

```bash
npm run validate:content
npx tsc --noEmit
npm run lint
npm run build
```

The content validator checks:

- Taxonomy uniqueness.
- Metadata consistency.
- Academic-only scope.
- Question counts.
- Evidence references.
- Drill lesson links.
- Recommendation relationships.
- Answer-position concentration.
- Repeated question-type sequences.
- Repeated paragraph openings.
- Generic or fake evidence wording.
- Coverage reporting.

Errors block publication. Warnings must be reviewed and resolved unless explicitly accepted for a documented reason.

## Human-Realism Standards

Passages should feel authored, not templated. They should have:

- Varied paragraph rhythm.
- Varied sentence length.
- Discipline-specific voice.
- Organic conceptual development.
- Plausible uncertainty.
- Non-mechanical transitions.
- Avoidance of repeated generic openings such as "In recent years".

Questions should feel fair under time pressure. They should have:

- Traceable evidence.
- Plausible traps.
- Tempting but wrong distractors.
- Real paraphrase.
- No cartoonishly false options.
- No answer-position bias.

Explanations should teach:

- The exact evidence relationship.
- The paraphrase or contrast.
- Why the correct answer works.
- Why a wrong answer is tempting.
- A reusable reading strategy.

## Psychometric Standards

The platform is not an official IELTS assessment, but practice items should still respect assessment quality:

- Every answer must be supported by passage evidence.
- Traps should test reading skill, not trick users unfairly.
- Difficulty labels must reflect actual cognitive demand.
- Band 8-9 content should require subtle inference, dense reasoning and reduced keyword overlap.
- Question sequencing should vary across tests.
- MCQ answer positions and matching answers should not show predictable bias.
- Not Given items must genuinely lack enough evidence, not merely be hard to find.

## Content Generation and Expansion Process

Controlled content expansion follows:

1. Choose topic and passage archetype.
2. Draft passage with human-style rhetorical shape.
3. Build a varied question blueprint.
4. Write questions with real evidence excerpts.
5. Write explanations, why-correct and why-wrong notes.
6. Assign taxonomy tags and difficulty.
7. Validate structure and metadata.
8. Review realism and psychometric quality.
9. Publish only after clean validation.

Avoid mass generation. A smaller validated batch is preferred over a large weak batch.

## Current Content Library Summary

As of Batch C + D combined:

- 15 published IELTS Academic Reading mini tests.
- 300 mini-test questions.
- 26 drill-native practice sets.
- 130 drill questions.
- 29 strategy lessons.

Published mini-test difficulty mix:

- Easy: 2 tests.
- Medium: 2 tests.
- Hard: 6 tests.
- Band 8-9 Challenge: 5 tests.

All standard IELTS Academic Reading question types are represented in the test library.

## Batch Expansion History

Step 1 stabilized the simulator, timer, answer input, scoring, review and LocalStorage flow.

Phase 2A added enhanced review, evidence-based explanations, skill diagnosis, trap diagnosis, mistake summaries and recommendations.

Phase 2B added the Practice Hub, question-type practice, skill practice, drill scoring and drill review.

Phase 3A added taxonomy, metadata, relationships and validation architecture.

Phase 3A-2 attempted large-scale content expansion, but the realism audit found repeated structure, weak distractors, fake evidence and poor psychometric realism. That generated scale was paused.

Phase 3A-REALISM reduced the public content to a smaller benchmark library and rebuilt validation guardrails.

Phase 3A-REALISM-EXPANSION Batch A added 3 tests and 8 drills under controlled validation.

Batch B added 3 tests and 8 drills, closing drill coverage gaps for question types, skills and major traps.

Batch C + D combined was test-only. It added 6 mini tests:

Band 8-9 challenge tests:

- `academic-reading-010` (`memory-reconstruction-and-evidence`) - The Memory Trace That Would Not Stay Put.
- `academic-reading-011` (`model-uncertainty-and-public-decisions`) - When Models Become Public Instruments.
- `academic-reading-012` (`conservation-corridors-and-risk`) - Corridors, Refuges and Conservation Risk.

Weak-question-type repair tests:

- `academic-reading-013` (`port-labour-and-hidden-records`) - Mapping a Port's Hidden Work.
- `academic-reading-014` (`flood-gates-and-warning-systems`) - From Sensors to Flood Gates.
- `academic-reading-015` (`manuscript-margins-and-language-change`) - The Manuscript's Moving Margins.

No drills were added in Batch C + D.

Legacy `realism-*` route parameters are still recognized for users who saved older links or local attempts, but they are no longer shown as public-facing test identifiers.

## Technical Stack

- Next.js App Router.
- React.
- TypeScript.
- Tailwind CSS.
- lucide-react.
- Local TypeScript content files.
- LocalStorage for browser-only progress.
- Vercel deployment target.

## Folder Structure

```text
src/app/                     App Router pages
src/components/              Simulator, result, review and shared UI components
src/components/practice/     Focused-practice UI components
src/data/tests.ts            Published Academic Reading mini tests
src/data/drills.ts           Published drill-native practice content
src/data/strategy-lessons.ts Strategy lessons
src/data/taxonomy/           Master taxonomy definitions
src/data/types.ts            Shared content and app types
src/lib/                     Scoring, diagnosis, storage, timer, metadata and validation logic
scripts/validate-content.ts  Content QA command
docs/platform-documentation.md Single consolidated documentation file
```

## Local Development Setup

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

If file watching is unreliable on the machine, use a production build locally:

```bash
npm run build
npm run start -- --port 3002
```

## Build and Deployment

Main commands:

```bash
npm run validate:content
npx tsc --noEmit
npm run lint
npm run build
```

Vercel deployment:

1. Push the repository to GitHub.
2. Import it into Vercel.
3. Use the detected Next.js framework preset.
4. Build command: `npm run build`.
5. No environment variables are required.
6. Use preview deployments for pull requests and production deployments from the main branch.

## Content Contribution Guidelines

When adding tests:

- Keep IELTS Academic-only scope.
- Use original content only.
- Do not copy official IELTS, Cambridge, British Council, IDP or commercial materials.
- Use real evidence excerpts from the passage.
- Avoid fake evidence summaries.
- Vary passage archetypes and question blueprints.
- Include plausible distractors.
- Validate before publishing.

When adding drills:

- Confirm the phase allows drill expansion.
- Use drill-native content where possible.
- Keep strategy links valid.
- Maintain taxonomy consistency.

When editing taxonomy:

- Add labels centrally.
- Update inference rules where needed.
- Run validation and build.

## Copyright and Originality Policy

All passages and questions must be original IELTS-style practice material. Official IELTS resources may guide format, timing and broad question taxonomy, but not wording, passages, answer keys, explanations or diagrams.

Do not copy:

- Official IELTS materials.
- Cambridge IELTS books.
- British Council or IDP sample passages/questions.
- Commercial practice-book content.
- Third-party copyrighted passages.

## Disclaimer

This website provides independent IELTS Academic Reading practice materials. It is not affiliated with, endorsed by or approved by IELTS, Cambridge, British Council, IDP or the British Council. IELTS is a trademark of its respective owners.

## Future Roadmap

Near-term:

- Continue controlled test expansion only after editorial review.
- Add more Medium and Easy tests to rebalance the current hard-heavy library.
- Rewrite strategy lessons in a more human, less generic style.
- Improve visual support for Diagram Label Completion.

Medium-term:

- Add full 40-question, 60-minute Academic Reading simulations.
- Add local trend dashboards and mistake notebook without login.
- Add richer filtering by topic, difficulty and question type.

Long-term:

- Add adaptive recommendations if the content library remains high quality.
- Add vocabulary and paraphrase systems.
- Consider optional accounts only if there is a clear learner benefit, while preserving free no-login access.
