# IELTS Reading Studio

Free, no-login IELTS Academic Reading practice for self-learners.

## Overview

IELTS Reading Studio is an independent IELTS Academic Reading simulator. Learners can open the website, choose a mini Academic Reading test, answer timed questions, submit, view an approximate score, and review explanations without creating an account.

The current version is a stabilized MVP for exam simulation and reading practice. It does not include IELTS General Training, payment, subscriptions, accounts, teacher dashboards, AI tutoring, community features, or locked content.

## Features

- 15 original IELTS-style Academic Reading mini tests.
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
- Strategy lessons before drill attempts.
- Drill scoring, drill review, mistake summary, and local practice history.
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
npm run build
npm run dev
npm run start
```

## Project Structure

```text
src/app/                 App Router pages
src/components/          UI and simulator workflow components
src/components/practice/ Focused-practice UI components
src/data/drills.ts       Question-type and skill drill content
src/data/strategy-lessons.ts  Short practice strategy lessons
src/data/tests.ts        Original Academic Reading test seed content
src/data/types.ts        Stabilized reading-test schema
src/lib/attempt.ts       Start, restart, status, and result helpers
src/lib/diagnosis.ts     Performance, mistake pattern, and recommendation logic
src/lib/drill-scoring.ts Focused-practice scoring and feedback
src/lib/practice-storage.ts Browser-only drill progress and result storage
src/lib/taxonomy.ts      Question type and skill taxonomy
src/lib/scoring.ts       Answer normalization and scoring
src/lib/storage.ts       Safe LocalStorage helpers
src/lib/timer.ts         Deadline-based timer helpers
docs/product-plan.md     Product strategy and architecture
docs/stabilization-step-1.md  Step 1 audit, gaps, and QA checklist
docs/phase-2a-diagnosis.md    Phase 2A diagnosis plan and QA checklist
docs/phase-2b-practice-mode.md Phase 2B practice mode plan and QA checklist
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
- Phase 2C: Add richer drill coverage, local trend dashboard and mistake notebook.
- Step 3: Add optional learner progress dashboards without requiring login.
- Step 4: Add full 40-question Academic Reading simulations.

## License Recommendation

Before publishing publicly, add a license. For code, MIT is simple. For practice content, consider a custom content license if you want to prevent commercial reuse of the generated passages and questions.
