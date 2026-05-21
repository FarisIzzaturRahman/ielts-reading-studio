# IELTS Reading Studio

Free, no-login IELTS Academic Reading practice for self-learners.

## Overview

IELTS Reading Studio is an independent IELTS Academic Reading simulator. Learners can open the website, choose a mini Academic Reading test, answer timed questions, submit, view an approximate score, and review explanations without creating an account.

The current version is a stabilized MVP for exam simulation and reading practice. It does not include IELTS General Training, payment, subscriptions, accounts, teacher dashboards, AI tutoring, community features, or locked content.

## Features

- 30 original IELTS-style Academic Reading mini tests.
- 2 passages and 20 questions per mini test.
- 30-minute timer for 20-question tests.
- Split-screen desktop test interface.
- Mobile fallback with Passage, Questions, and Review tabs.
- Answer inputs for common IELTS Academic Reading question types.
- Question navigation with answered, unanswered, active, and flagged states.
- Local auto-save for answers, flags, notes, highlights, timer deadline, and attempts.
- Submit confirmation with answered, unanswered, and flagged counts.
- Automatic raw score, percentage, and approximate mini-band estimate.
- Result page with performance by skill and question type.
- Result page with mistake pattern summary, trap type pattern, and rule-based recommendations.
- Review page with user answer, correct answer, explanation, evidence reference, why-correct/why-wrong notes, trap type, strategy tip, skill, and difficulty.
- Practice Hub for focused IELTS Academic Reading drills.
- Practice by question type and by reading skill.
- 87 focused drills across question types, skills, traps, and Band 8-9 challenge practice.
- Strategy lessons before drill attempts.
- Drill scoring, drill review, mistake summary, and local practice history.
- Centralized content taxonomy for question types, reading skills, traps, topics, difficulty, and recommendations.
- Structured metadata for tests, passages, questions, drills, and lessons.
- Content relationship index for future recommendation and adaptive-practice features.
- Content validation command for taxonomy, metadata, evidence, and relationship checks.
- Retake/restart support.

## IELTS Academic-Only Scope

This project focuses only on IELTS Academic Reading. Content should use academic topics, long-form reading passages, and IELTS Academic-style question tasks. Do not add IELTS General Training, workplace letters, everyday notices, social survival reading, or non-academic task formats.

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
src/app/                 App Router pages
src/components/          UI and simulator workflow components
src/components/practice/ Focused-practice UI components
src/data/content-library.ts  Central content registry and relationship index
src/data/drills.ts       Question-type and skill drill content
src/data/strategy-lessons.ts  Short practice strategy lessons
src/data/taxonomy/       Master taxonomy definitions
src/data/tests.ts        Original Academic Reading test seed content
src/data/types.ts        Stabilized reading-test schema
src/lib/attempt.ts       Start, restart, status, and result helpers
src/lib/content-metadata.ts Metadata builders for generated content
src/lib/content-relationships.ts Queryable content relationship index
src/lib/diagnosis.ts     Performance, mistake pattern, and recommendation logic
src/lib/drill-scoring.ts Focused-practice scoring and feedback
src/lib/practice-storage.ts Browser-only drill progress and result storage
src/lib/taxonomy.ts      Compatibility re-export for taxonomy helpers
src/lib/validation/      Content QA and validation utilities
src/lib/scoring.ts       Answer normalization and scoring
src/lib/storage.ts       Safe LocalStorage helpers
src/lib/timer.ts         Deadline-based timer helpers
scripts/validate-content.ts Content validation script
docs/product-plan.md     Product strategy and architecture
docs/stabilization-step-1.md  Step 1 audit, gaps, and QA checklist
docs/phase-2a-diagnosis.md    Phase 2A diagnosis plan and QA checklist
docs/phase-2b-practice-mode.md Phase 2B practice mode plan and QA checklist
docs/phase-3a-content-system.md Phase 3A taxonomy, metadata and QA pipeline
docs/phase-3a2-large-scale-content.md Phase 3A-2 large-scale content expansion
```

## Content Format

Each test includes:

- `testId`
- `title`
- `description`
- `difficulty`
- `targetBand`
- `mode`
- `testType: "Academic"`
- `timeLimitMinutes`
- `totalQuestions`
- `passages`
- `questions`

Each question includes:

- `questionNumber`
- `type`
- `prompt`
- `answer`
- `acceptedAnswers`
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
- `tags`

Each focused drill includes:

- `drillId`
- `title`
- `practiceMode`
- `questionType` or `skill`
- `skillFocus`
- `difficulty`
- `estimatedTimeMinutes`
- `description`
- `strategyLessonId`
- `passages`
- `questions`
- `trapFocus`
- `targetBand`
- `totalQuestions`
- `topicFocus`
- `recommendationCategory`
- `relationships`
- `metadata`

The master taxonomy lives in `src/data/taxonomy/`. Use those definitions instead of typing display labels manually.

## Content Validation

Run the content QA pipeline before publishing new tests, drills, lessons, or taxonomy changes:

```bash
npm run validate:content
```

The validator checks taxonomy uniqueness, metadata consistency, evidence references, Academic-only scope, drill lesson links, question counts, and recommendation relationships. Errors fail the command; warnings identify content expansion gaps or editorial items to review.

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

Do not copy official IELTS, Cambridge, British Council, IDP, or commercial test-book passages, questions, answer keys, diagrams, or explanations. Official resources may guide format, timing, and question taxonomy, but not content wording.

## Roadmap

- Step 1: Stabilize the simulator and mini-test workflow.
- Phase 2A: Enhanced review, skill diagnosis, mistake patterns, and basic recommendations.
- Phase 2B: Question-type and skill-based focused practice.
- Phase 3A: Content taxonomy, metadata standards, relationship index and validation pipeline.
- Phase 3A-2: Expand to 30 mini tests and 50+ drills with scale validation.
- Phase 3B: Add blueprint templates, topic balance reports, UI filters and editorial QA workflow.
- Phase 4: Add optional local trend dashboards and mistake notebook without requiring login.
- Step 4: Add full 40-question Academic Reading simulations.

## License Recommendation

Before publishing publicly, add a license. For code, MIT is simple. For practice content, consider a custom content license if you want to prevent commercial reuse of the generated passages and questions.
