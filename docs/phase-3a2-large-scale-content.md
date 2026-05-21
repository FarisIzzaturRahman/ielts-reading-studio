# Phase 3A-2: Large-Scale Content Expansion System

## Implementation Plan

1. Expand the mini-test blueprint library from 15 to 30 IELTS Academic Reading mini tests.
2. Expand focused drills from the Phase 2B launch set to 50+ drills, while preserving taxonomy and metadata consistency.
3. Add challenge-level drills for Band 8-9 learners.
4. Add generated strategy lessons for uncovered question types and skills.
5. Add publishing metadata fields so content can move through draft, reviewed, validated and published states.
6. Add content quality analysis for scale, distribution, duplicate-pattern monitoring and coverage gaps.
7. Extend validation so Phase 3A-2 scale targets are checked automatically.
8. Document batch generation, topic diversification, difficulty balancing and QA workflows.

## Large-Scale Content Expansion Strategy

The library now scales through structured blueprints instead of random bulk generation.

Current launch scale after Phase 3A-2:

- 30 IELTS Academic Reading mini tests.
- 87 focused drills.
- 29 strategy lessons.
- 600 mini-test questions.
- 435 drill questions.

The content remains local TypeScript data for the MVP. When the library becomes harder to review in one file, the same schemas can move into per-test and per-drill files.

## Mini-Test Expansion Plan

The mini-test library now contains 30 tests, each with:

- 2 Academic Reading passages.
- 20 questions.
- Evidence-based explanations.
- Skill tags.
- Trap-type tags.
- Difficulty metadata.
- Topic metadata.
- Strategy tips.
- Original IELTS-style Academic Reading content.

New Phase 3A-2 topics include genetics, astronomy, robotics, epidemiology, nutrition, communication systems, cultural studies, animal behaviour, history of science, anthropology, conservation ecology, smart cities, materials physics, mental health and ethical AI.

Medium-term target:

- Expand from 30 to 50 mini tests through two reviewed batches.

Long-term target:

- Expand toward 100+ mini tests only after topic balance and editorial QA are automated enough to prevent repetition.

## Drill Expansion Plan

The drill library now includes:

- Launch drills from Phase 2B.
- Question-type drill expansions for every standard IELTS Academic Reading question type.
- Skill drills for every reading skill in the master taxonomy.
- Trap-focused drills for all major trap types.
- Band 8-9 challenge drills.

Current drill count:

- 87 focused drills.

Future target:

- 10-20 drills per question type.
- 10-20 drills per reading skill.
- 5-10 drills per major trap type.
- Dedicated Band 8-9 challenge library.

## Topic Diversification Strategy

Topic taxonomy is maintained in `src/data/taxonomy/topics.ts`.

The expanded library balances:

- Science: genetics, astronomy, materials physics, neuroscience, ecology.
- Technology: AI, robotics, communication systems, smart cities, medical technology.
- Health: epidemiology, nutrition, mental health, public health.
- Social science: sociology, psychology, behavioural economics, education.
- Humanities: archaeology, anthropology, cultural studies, history of science, architecture.
- Environment: climate change, marine biodiversity, conservation, agriculture, sustainable cities.

Future batches should avoid repeating the same passage frame too often. In particular, do not make every text a technology pilot, policy intervention or dashboard evaluation.

## Difficulty Balancing Implementation

Difficulty levels remain:

- Easy
- Medium
- Hard
- Band 8-9 Challenge

The 30-test target mix is close to the planned distribution:

- Easy: 8 tests
- Medium: 12 tests
- Hard: 7 tests
- Band 8-9 Challenge: 3 tests

This approximates the target 25 / 40 / 25 / 10 split.

Drills include easier foundation practice, medium standard practice, hard inference and distractor practice, and Band 8-9 challenge drills.

## Batch Generation Workflow

Use batches rather than uncontrolled generation:

1. Select topic and difficulty targets.
2. Create passage blueprints.
3. Generate original passages.
4. Create question blueprints.
5. Generate questions and answer keys.
6. Add evidence, explanations, skills, traps and strategy tips.
7. Assign metadata and publishing status.
8. Run `npm run validate:content`.
9. Review validation and quality summaries.
10. Publish only after errors are zero.

Current batch ids:

- `phase-2-seed-content`
- `phase-3a2-batch-1`
- `phase-3a2-challenge-and-diversity`
- `phase-3a2-mini-test-expansion`
- `phase-3a2-drill-expansion`
- `phase-3a2-lesson-expansion`

## QA At Scale Workflow

Run these checks before publishing a content batch:

```bash
npm run validate:content
npm run lint
npm run build
```

For rendered route confidence, start the production server and run a Playwright smoke test against:

- `/tests`
- one newly added test instruction page
- `/practice`
- one new drill page
- one drill result flow
- mobile `/practice`

## Metadata Validation Workflow

Metadata now includes publishing fields:

- `status`
- `batchId`

Status values:

- `draft`
- `reviewed`
- `validated`
- `published`

Validation checks:

- Academic-only test type.
- Required metadata fields.
- Taxonomy validity.
- Evidence references.
- Question count consistency.
- Drill lesson links.
- Scale targets for 30 tests and 50+ drills.
- Coverage across question types, skills and difficulty levels.

## Duplicate Detection Strategy

`src/lib/content-quality.ts` provides content quality analysis:

- Difficulty distribution.
- Topic distribution.
- Question type distribution.
- Skill distribution.
- Trap distribution.
- Duplicate question prompt pattern detection.
- Coverage gaps for question types, skills and traps.

The current generated test family intentionally reuses some question structures to maintain simulator consistency. Future editorial batches should diversify repeated stems and explanation phrasing, especially before expanding beyond 50 tests.

## Challenge-Level Content Strategy

Band 8-9 content should use:

- Denser academic phrasing.
- Lower keyword overlap.
- More abstract topics.
- Subtler distractors.
- Evidence chains that require careful interpretation.
- More inference and writer-view questions.

Current challenge content includes:

- Space exploration.
- Decision-making psychology.
- Ethical AI and scientific judgement.
- Advanced inference drills.
- Advanced multiple-choice distractor drills.
- Dense paragraph-function drills.

## Content Publishing Workflow

Every content item should move through:

Generate -> Review -> Validate -> Publish

In code, published content carries:

- `metadata.status = "published"`
- `metadata.batchId`

Do not publish content that has validation errors. Warnings should be reviewed and either fixed or explicitly accepted in documentation.

## Structured File Organization

Current pragmatic structure:

```text
src/data/tests.ts
src/data/drills.ts
src/data/strategy-lessons.ts
src/data/content-library.ts
src/data/taxonomy/
src/lib/content-quality.ts
src/lib/validation/content.ts
```

Future split when the library grows:

```text
src/data/
  mini-tests/
    academic-mini-001.ts
    academic-mini-002.ts
  drills/
    question-types/
    skills/
    traps/
    challenge/
  lessons/
  taxonomy/
  vocabulary/
  metadata/
```

## Future-Ready Scaling Recommendations

Next content-system steps:

- Add per-file content modules when review conflicts appear.
- Add blueprint templates for passages and questions.
- Add topic-balance reports to CI.
- Add unit tests for `content-quality` and validation.
- Add editorial fields for reviewer notes.
- Add vocabulary and paraphrase metadata later.
- Add adaptive recommendations later using the existing relationship index.

## QA Checklist Results

| Check | Result |
| --- | --- |
| New mini tests load correctly | Pass via build/static params |
| New drills load correctly | Pass via build/static params |
| Metadata is consistent | Pass |
| Taxonomy labels are correct | Pass |
| Difficulty distribution is balanced | Pass |
| Topic diversity is maintained | Pass |
| Explanations remain evidence-based | Pass by validation schema |
| Evidence references are present | Pass |
| Recommendation relationships still work | Pass |
| Existing features remain stable | Pass by lint/type/build/smoke |
| Duplicate pattern monitoring exists | Pass |
| Mobile layout remains usable | Pass by smoke test |
| Desktop layout remains usable | Pass by smoke test |
| TypeScript errors | Pass |
| Console errors | Pass, ignoring local Vercel analytics script 404s |
| Build passes successfully | Pass |
| Vercel deployment readiness | Build-ready; live deployment not run locally |

## Remaining Issues For Future Phases

- Manually diversify repeated generated question stems before growing to 50+ tests.
- Add more passage-style variety beyond the current two-passage blueprint family.
- Add editorial review notes and reviewer initials when content is reviewed by a human.
- Add richer evidence text excerpts for diagram and passage-wide questions.
- Add unit tests for scale analysis and validation utilities.
- Add UI filters by topic and difficulty if the larger library becomes hard to browse.

## Content Originality Warning

All content must remain original IELTS-style Academic Reading practice material. Do not copy IELTS, Cambridge, British Council, IDP, commercial test-book passages, questions, answer keys, diagrams, explanations or wording.
