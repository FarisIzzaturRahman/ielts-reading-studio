# IELTS Reading Studio

Free, no-login IELTS Academic Reading simulation for self-learners.

## Overview

IELTS Reading Studio is an independent IELTS Academic Reading simulator. Learners open the site, choose a numbered test, read one long passage, answer 20 timed questions, submit, receive a score, and review evidence-based explanations.

The current product direction is realism-first. Public test selection is intentionally simple: tests appear as `Test 1`, `Test 2`, `Test 3`, and so on. Topic titles, visible difficulty categories, and visible challenge labels are hidden from the learner-facing simulator so the experience feels closer to an exam environment than a categorized learning catalog.

The app does not include IELTS General Training, payment, subscriptions, accounts, teacher dashboards, live AI tutoring, community features, or locked content.

## Features

- Numbered IELTS Academic Reading simulations.
- One continuous reading passage per test.
- 20 questions per test.
- 30-minute timer for the current compact simulation format.
- Split-screen desktop interface with independently scrollable passage and question panels.
- Mobile fallback with Passage, Questions, and Review/navigation tabs.
- Answer inputs for common IELTS Academic Reading question types.
- Question navigation with answered, unanswered, active, and flagged states.
- Local auto-save for answers, flags, notes, highlights, timer deadline, and attempts.
- Removable text highlights and clear-all highlight support.
- Submit confirmation with answered, unanswered, and flagged counts.
- Automatic raw score, percentage, and approximate practice band estimate.
- Result page with performance diagnosis and recommendations.
- Review page with side-by-side passage access, user answer, correct answer, evidence, and explanation.
- Practice Hub and drill system from earlier phases.
- Central taxonomy, metadata, relationship, and validation systems kept internally for QA.
- Content validation command for taxonomy, metadata, evidence, relationships, answer distribution, repetition, and weak evidence patterns.

## IELTS Academic-Only Scope

This project focuses only on IELTS Academic Reading. Content should use academic topics, long-form adapted academic passages, and IELTS Academic-style question tasks. Do not add IELTS General Training, workplace letters, everyday notices, social survival reading, or non-academic task formats.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- lucide-react
- Local TypeScript content data
- LocalStorage for browser-only progress
- Vercel deployment target

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

If the local machine has an exhausted file-watch limit, use the production build instead:

```bash
npm run build
npm run start -- --port 3002
```

## Available Scripts

```bash
npm run lint
npm run validate:content
npm run build
npm run dev
npm run start
```

## Project Structure

```text
src/app/                         App Router pages
src/components/                  UI and simulator workflow components
src/components/practice/         Focused-practice UI components
src/data/content-library.ts      Central content registry and relationship index
src/data/drills.ts               Drill-native question-type and skill practice content
src/data/strategy-lessons.ts     Short practice strategy lessons
src/data/taxonomy/               Master taxonomy definitions
src/data/tests.ts                Human-reviewed Academic Reading tests
src/data/types.ts                Stabilized reading-test schema
src/lib/attempt.ts               Start, restart, status, and result helpers
src/lib/content-metadata.ts      Metadata builders
src/lib/content-relationships.ts Queryable content relationship index
src/lib/diagnosis.ts             Performance, mistake pattern, and recommendation logic
src/lib/drill-scoring.ts         Focused-practice scoring and feedback
src/lib/practice-storage.ts      Browser-only drill progress and result storage
src/lib/test-routing.ts          Route helpers for numbered test slugs
src/lib/validation/              Content QA and validation utilities
src/lib/scoring.ts               Answer normalization and scoring
src/lib/storage.ts               Safe LocalStorage helpers
src/lib/timer.ts                 Deadline-based timer helpers
scripts/validate-content.ts      Content validation script
docs/platform-documentation.md   Consolidated product, technical, content, and QA documentation
```

## Test Architecture

Public simulations use:

- `testId`: `test-1`, `test-2`, `test-3`
- `slug`: `test-1`, `test-2`, `test-3`
- `title`: `Test 1`, `Test 2`, `Test 3`
- one merged passage
- 20 questions

Older topic-based IDs and editorial IDs are retained only in `legacyIds` so old LocalStorage attempts and old links can be recovered where possible. They are not shown in the user interface.

Internal metadata still tracks difficulty calibration, topic, skill tags, trap tags, evidence strength, and QA status. That metadata supports scoring, diagnosis, recommendations, validation, and future content quality work, but it should not dominate the learner-facing simulator.

## Content Validation

Run the content QA pipeline before publishing new tests, drills, lessons, or taxonomy changes:

```bash
npm run validate:content
```

The validator checks taxonomy uniqueness, metadata consistency, Academic-only scope, one-passage published simulations, question counts, evidence references, drill lesson links, recommendation relationships, answer-position concentration, repeated question structures, repeated paragraph openings, and generic evidence text. Errors fail the command; warnings identify editorial items to review.

## Deployment

1. Push the repository to GitHub.
2. Import the repository in Vercel.
3. Use the detected Next.js framework preset.
4. Build command: `npm run build`.
5. No environment variables are required for the MVP.
6. Production deploys can use the `main` branch, with preview deploys for pull requests.

## Disclaimer

This website provides independent IELTS Academic Reading practice materials. It is not affiliated with, endorsed by, or approved by IELTS, Cambridge, British Council, IDP, or the British Council. All passages and questions are original IELTS-style practice materials.

## Content Originality

Do not copy official IELTS, Cambridge, British Council, IDP, or commercial test-book passages, questions, answer keys, diagrams, or explanations. Official resources may guide format, timing, and broad question taxonomy, but not content wording.

## Roadmap

- Step 1: Stabilize the simulator and compact test workflow.
- Phase 2A: Enhanced review, skill diagnosis, mistake patterns, and recommendations.
- Phase 2B: Question-type and skill-based focused practice.
- Phase 3A: Content taxonomy, metadata standards, relationship index, and validation pipeline.
- Phase 3A-REALISM: Rebuild content realism and validation guardrails.
- Human QA revision: remove visible test categories, simplify test naming, use one-passage simulations, and make the UI more exam-like.
- Next priority: run another live-user QA pass before continuing controlled content expansion.

## License Recommendation

Before publishing publicly, add a license. For code, MIT is simple. For practice content, consider a custom content license if you want to prevent commercial reuse of the generated passages and questions.
