# IELTS Reading Studio Platform Documentation

## Project Overview

IELTS Reading Studio is a free, no-login IELTS Academic Reading simulation platform for self-learners. The current simulator presents numbered Academic Reading tests, each with one long passage, 20 questions, timed answering, automatic scoring, and evidence-based review.

The platform is independent. It is not affiliated with, endorsed by, or approved by IELTS, Cambridge, British Council, IDP, or any official IELTS organisation. All passages, questions, answer keys, and explanations are original IELTS-style practice materials.

## Product Vision

The product direction is now realism-first. The simulator should feel less like a categorized educational product and more like a calm IELTS Academic Reading test environment.

Learners should see a clean test list, choose a numbered test, read one continuous passage, answer questions under time pressure, submit, and review their work. Internal learning systems still exist, but visible categorization should not dominate the test experience.

Core principles:

1. Exam realism before educational packaging.
2. Simple user-facing test selection.
3. One-passage, 20-question compact simulations.
4. Hidden metadata for quality, diagnosis, and future recommendations.
5. Original IELTS-style content only.
6. Controlled expansion only after QA passes.

## Target Users

- IELTS Academic candidates practising independently.
- Self-learners who want a realistic reading-test environment.
- Higher-band learners who need strong evidence checking and paraphrase practice.
- Tutors who want free original practice material to recommend informally.

No account is required, and the platform does not collect personal learner data.

## IELTS Academic-Only Scope

This project focuses only on IELTS Academic Reading.

Do not add:

- IELTS General Training.
- Workplace letters.
- Everyday notices.
- Social survival reading.
- Payment, subscriptions, freemium locks, or monetization.
- Teacher dashboards, community features, live AI tutoring, or official IELTS branding imitation.

## User-Facing Test Experience

Public test selection is intentionally simple:

- `Test 1`
- `Test 2`
- `Test 3`
- and so on.

The test library should not show topic titles, visible difficulty categories, challenge labels, target-band labels, or educational segmentation. This avoids making the simulator feel like an artificial learning catalog.

Each published test should show only essential learner information:

- test number
- 20 questions
- time limit
- local attempt status
- last score if available

## Test Simulator Flow

1. User opens the home page.
2. User opens the Academic Reading simulation list.
3. User chooses a numbered test.
4. User reads short test instructions.
5. Timer starts only after Start Test.
6. User reads one long passage and answers 20 questions.
7. Desktop layout keeps passage and questions independently scrollable.
8. Mobile layout uses Passage, Questions, and Review/navigation tabs.
9. Answers, flags, notes, highlights, and timer deadline auto-save locally.
10. User submits manually or is auto-submitted when time expires.
11. Result page shows score and diagnosis.
12. Review page keeps the passage accessible while explanations scroll independently.
13. User can retake the test or return to the test list.

## Single-Passage Architecture

The public simulator now exports each test as a single long passage. Legacy multi-passage source material is merged into one continuous passage at the data layer:

- all paragraphs are relabelled sequentially
- all questions point to the merged passage
- paragraph references are remapped
- matching-information answer letters are remapped
- evidence excerpts remain actual passage text

This preserves the reviewed content while presenting a cleaner IELTS-like reading experience.

## Routing and Naming

Public routes use simple numbered slugs:

```text
/tests/test-1/instructions
/tests/test-1/practice
/tests/test-1/results
/tests/test-1/review
```

Public data values:

- `testId`: `test-1`
- `slug`: `test-1`
- `title`: `Test 1`

Older topic-based slugs and editorial IDs are retained only in `legacyIds` for minimal route and LocalStorage compatibility. They are not displayed in the interface.

## Review and Diagnosis System

The review page is now cleaner and less taxonomy-heavy. It keeps:

- question number
- prompt
- user answer
- correct answer
- correct, incorrect, or unanswered status
- evidence reference
- evidence excerpt
- explanation
- why the correct answer works
- why the selected answer is wrong or tempting

The review page no longer foregrounds passage titles, question-type labels, skill labels, trap labels, or difficulty labels. Those remain available in metadata and diagnosis logic.

The result page may still show learning diagnostics after submission:

- raw score
- percentage
- approximate practice band estimate
- performance by question type
- performance by reading skill
- trap pattern summary
- recommendations

These are post-test learning aids, not visible pre-test categorization.

## Practice Mode Overview

Practice mode was implemented before the realism-first simulator revision. It remains available as a focused learning area:

- `/practice` Practice Hub
- question-type practice
- skill-based practice
- drill sessions
- drill result and review pages
- LocalStorage-based drill history

The current revision does not expand drills. Future work should decide whether practice mode should remain visibly educational while the test simulator stays exam-like.

## Hidden Metadata Philosophy

Internal metadata remains important. It supports validation, scoring, diagnosis, recommendation relationships, and future adaptive systems. It should not be overexposed in the core simulator UI.

Internal metadata may include:

- difficulty calibration
- topic and subtopic
- passage archetype
- question type
- primary and secondary skills
- trap type
- evidence strength
- cognitive level
- editorial status
- validation status
- batch history

## Content Architecture

Core data files:

- `src/data/tests.ts` contains published Academic Reading simulations.
- `src/data/drills.ts` contains focused practice sets.
- `src/data/strategy-lessons.ts` contains practice strategy lessons.
- `src/data/content-library.ts` combines tests, drills, and lessons.
- `src/data/taxonomy/` contains centralized taxonomy definitions.
- `src/data/types.ts` defines shared content schemas.

Core logic files:

- `src/lib/scoring.ts` answer normalization and scoring.
- `src/lib/diagnosis.ts` test diagnosis and recommendations.
- `src/lib/drill-scoring.ts` drill scoring and feedback.
- `src/lib/storage.ts` safe LocalStorage helpers.
- `src/lib/test-routing.ts` numbered-route helpers.
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

Difficulty values still exist internally for calibration and QA. They should not be shown as learner-facing test categories in the simulation library.

## Metadata Standards

Every published test should include:

- `testId`
- `slug`
- `legacyIds` only for compatibility
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

Every public simulation must contain:

- one passage
- 20 questions
- route slug in `test-N` format

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

The current schema stores publishing status inside generated metadata as `status: "published"`. Draft or unvalidated content should not be included in exported user-facing arrays.

## LocalStorage Strategy

Progress is saved only on the current device and browser.

Stored data includes:

- answers
- flagged questions
- notes
- highlights
- start time
- deadline
- remaining time
- submitted result
- diagnosis data

Current numbered test IDs are used for new attempts. Legacy IDs are checked only to recover older saved attempts safely.

## Editorial Status System

Supported content status values:

- `generated`
- `realism-reviewed`
- `psychometric-reviewed`
- `finalized`
- `published`
- `draft`
- `reviewed`
- `validated`

Only published, validation-passing content should appear in public libraries.

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

Run before publishing or deployment:

```bash
npm run validate:content
npx tsc --noEmit
npm run lint
npm run build
```

The content validator checks:

- taxonomy uniqueness
- metadata consistency
- Academic-only scope
- one-passage published simulations
- 20-question compact simulations
- evidence references
- drill lesson links
- recommendation relationships
- answer-position concentration
- repeated question-type sequences
- repeated paragraph openings
- generic or fake evidence wording
- route slug format

Errors block publication. Warnings must be reviewed and resolved unless explicitly accepted.

## Human-Realism Standards

Passages should feel authored, not templated. They should have:

- varied paragraph rhythm
- varied sentence length
- discipline-specific voice
- organic conceptual development
- plausible uncertainty
- non-mechanical transitions
- avoidance of repeated generic openings

Questions should feel fair under time pressure:

- traceable evidence
- plausible traps
- tempting but wrong distractors
- realistic paraphrase
- no cartoonishly false options
- no answer-position bias

Explanations should teach:

- the exact evidence relationship
- the paraphrase or contrast
- why the correct answer works
- why a wrong answer is tempting
- a reusable reading habit

## Psychometric Standards

The platform is not an official IELTS assessment, but practice items should respect assessment quality:

- every answer must be supported by passage evidence
- traps should test reading skill, not trick users unfairly
- internal difficulty must reflect actual cognitive demand
- advanced content should require subtle inference, dense reasoning, and reduced keyword overlap
- question sequencing should vary across tests
- MCQ answer positions and matching answers should not show predictable bias
- Not Given items must genuinely lack enough evidence

## Content Generation and Expansion Process

Controlled content expansion should follow:

1. Choose topic and passage archetype internally.
2. Draft one long passage with human-style rhetorical shape.
3. Build a varied 20-question blueprint.
4. Write questions with real evidence excerpts.
5. Write explanations, why-correct, and why-wrong notes.
6. Assign taxonomy tags and hidden calibration metadata.
7. Validate structure and metadata.
8. Review realism and psychometric quality.
9. Publish only after clean validation.

Avoid mass generation. A smaller validated batch is preferred over a large weak batch.

## Current Content Library Summary

Current published simulator library:

- 15 IELTS Academic Reading simulations.
- 1 public passage per test.
- 20 questions per test.
- 300 test questions.
- 26 drill-native practice sets from earlier phases.
- 130 drill questions.
- 29 strategy lessons.

All standard IELTS Academic Reading question types are represented in the content library. Internal calibration metadata remains available but is not shown as pre-test categorization.

## Batch and Product History

Step 1 stabilized the simulator, timer, answer input, scoring, review, and LocalStorage flow.

Phase 2A added enhanced review, evidence-based explanations, skill diagnosis, trap diagnosis, mistake summaries, and recommendations.

Phase 2B added the Practice Hub, question-type practice, skill practice, drill scoring, and drill review.

Phase 3A added taxonomy, metadata, relationships, and validation architecture.

Phase 3A-2 attempted large-scale content expansion, but the realism audit found repeated structure, weak distractors, fake evidence, and poor psychometric realism. That generated scale was paused.

Phase 3A-REALISM reduced the public content to a smaller benchmark library and rebuilt validation guardrails.

Phase 3A-REALISM-EXPANSION rebuilt content in controlled batches.

Human QA Revision changed the simulator direction:

- removed visible difficulty categories from the test library
- hid topic-based titles from the user-facing test flow
- converted public tests to numbered `Test N` presentation
- simplified slugs to `test-N`
- merged public test presentation into one continuous passage
- preserved hidden metadata and validation systems

## Technical Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- lucide-react
- Local TypeScript content files
- LocalStorage for browser-only progress
- Vercel deployment target

## Folder Structure

```text
src/app/                     App Router pages
src/components/              Simulator, result, review, and shared UI components
src/components/practice/     Focused-practice UI components
src/data/tests.ts            Published Academic Reading simulations
src/data/drills.ts           Published drill-native practice content
src/data/strategy-lessons.ts Strategy lessons
src/data/taxonomy/           Master taxonomy definitions
src/data/types.ts            Shared content and app types
src/lib/                     Scoring, diagnosis, storage, timer, metadata, routing, and validation logic
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

- keep IELTS Academic-only scope
- use original content only
- do not copy official IELTS, Cambridge, British Council, IDP, or commercial materials
- write one long passage per compact simulation
- use real evidence excerpts from the passage
- avoid fake evidence summaries
- vary passage archetypes and question blueprints internally
- include plausible distractors
- keep public naming as `Test N`
- validate before publishing

When adding drills:

- confirm the phase allows drill expansion
- use drill-native content where possible
- keep strategy links valid
- maintain taxonomy consistency

When editing taxonomy:

- add labels centrally
- update inference rules where needed
- run validation and build

## Copyright and Originality Policy

All passages and questions must be original IELTS-style practice material. Official IELTS resources may guide format, timing, and broad question taxonomy, but not wording, passages, answer keys, explanations, or diagrams.

Do not copy:

- official IELTS materials
- Cambridge IELTS books
- British Council or IDP sample passages/questions
- commercial practice-book content
- third-party copyrighted passages

## Disclaimer

This website provides independent IELTS Academic Reading practice materials. It is not affiliated with, endorsed by, or approved by IELTS, Cambridge, British Council, IDP, or the British Council. IELTS is a trademark of its respective owners.

## Future Roadmap

Near-term:

- run another live-user QA pass on the simplified simulator
- check whether public result diagnostics feel helpful or overly educational
- continue improving one-passage content realism
- decide how practice mode should coexist with the exam-like simulator

Medium-term:

- resume controlled test expansion only after QA
- add full 40-question, 60-minute Academic Reading simulations
- improve visual support for Diagram Label Completion
- add optional local trend dashboards and mistake notebook without login

Long-term:

- add adaptive recommendations if the content library remains high quality
- add vocabulary and paraphrase systems
- consider optional accounts only if there is a clear learner benefit while preserving free no-login access
