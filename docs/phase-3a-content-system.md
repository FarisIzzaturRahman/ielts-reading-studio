# Phase 3A: Content Expansion System, Taxonomy Standardization, and Quality Pipeline

## Implementation Plan

1. Audit existing mini tests, drills, lessons, diagnosis labels, and recommendation links.
2. Create a centralized master taxonomy for question types, skills, traps, difficulty, topics, passage styles, cognitive levels, practice modes, drill categories, and recommendation types.
3. Extend shared TypeScript content types with structured metadata for passages, questions, drills, lessons, and tests.
4. Add metadata builders so existing generated content is enriched consistently at runtime.
5. Add a content relationship index that connects tests, drills, questions, lessons, topics, skills, traps, and question types.
6. Add validation utilities and a command-line content validation script.
7. Document content generation, difficulty calibration, QA workflow, expansion strategy, and future architecture.
8. Run lint, TypeScript, content validation, build, and route smoke checks.

## Current Content Architecture Audit

The platform already had stable user-facing features from Step 1 through Phase 2B:

- 15 Academic Reading mini tests in `src/data/tests.ts`.
- 10 focused launch drills in `src/data/drills.ts`.
- Strategy lessons in `src/data/strategy-lessons.ts`.
- Diagnosis, drill scoring, and LocalStorage progress utilities in `src/lib`.

Main gaps before Phase 3A:

- Taxonomy existed only partially and could drift across tests, drills, lessons, diagnosis, and recommendations.
- Passage, question, drill, and lesson metadata were useful but not formalized enough for future adaptive learning.
- No automated content QA pipeline existed.
- Content relationships were implicit in scattered fields rather than queryable.
- Difficulty labels existed, but the calibration meaning was not documented as a framework.

## Central Taxonomy System

Master taxonomy files now live in `src/data/taxonomy/`:

- `question-types.ts`
- `skills.ts`
- `trap-types.ts`
- `difficulty.ts`
- `topics.ts`
- `passage-styles.ts`
- `cognitive-levels.ts`
- `practice-modes.ts`
- `recommendation-types.ts`
- `index.ts`

`src/lib/taxonomy.ts` remains as a compatibility re-export for older imports.

Taxonomy entries include stable ids, slugs, display labels, descriptions, relationships, and strategy guidance where relevant. The official label should always come from taxonomy instead of being typed manually in UI or content code.

## Metadata Standards

Shared metadata contracts live in `src/data/types.ts`.

Passage metadata:

- `topic`
- `subtopic`
- `difficulty`
- `estimatedBand`
- `passageStyle`
- `wordCount`
- `paragraphCount`
- `lexicalDensity`
- `sentenceComplexity`
- `inferenceDensity`
- `paraphraseDensity`
- `estimatedReadingTime`
- `tags`

Question metadata:

- `questionType`
- `primarySkill`
- `secondarySkills`
- `trapType`
- `difficulty`
- `cognitiveLevel`
- `evidenceStrength`
- `evidenceParagraph`
- `evidenceText`
- `strategyTip`
- `estimatedDifficultyScore`
- `tags`

Drill metadata:

- `practiceMode`
- `questionTypeFocus`
- `skillFocus`
- `trapFocus`
- `difficulty`
- `targetBand`
- `estimatedTimeMinutes`
- `totalQuestions`
- `topicFocus`
- `recommendationCategory`
- `tags`

Lesson metadata:

- `relatedQuestionTypes`
- `relatedSkills`
- `relatedTraps`
- `targetLevel`
- `estimatedStudyTime`
- `tags`

Test metadata:

- `testType`
- `difficulty`
- `targetBand`
- `totalPassages`
- `totalQuestions`
- `estimatedTimeMinutes`
- `topicFocus`
- `tags`

## Difficulty Framework

Difficulty is calibrated across passage and question factors rather than assigned randomly.

Passage difficulty factors:

- Vocabulary complexity
- Sentence complexity
- Lexical density
- Abstractness
- Inference density
- Paraphrase density
- Conceptual complexity
- Information density
- Distractor density

Question difficulty factors:

- Directness of evidence
- Keyword visibility
- Paraphrase complexity
- Trap subtlety
- Number of distractors
- Inference level
- Distance between question wording and evidence
- Cognitive processing load

Difficulty taxonomy:

- Easy: target Band 5.0-6.0, direct wording, short sentences, clear evidence.
- Medium: target Band 6.0-7.0, standard IELTS-style academic wording and moderate paraphrase.
- Hard: target Band 7.0-8.0, dense language, subtle paraphrase, complex sentences, less direct evidence.
- Band 8-9 Challenge: target Band 8.0-9.0, high lexical density, heavy paraphrasing, subtle inference, difficult distractors.

## Content Generation Workflow

Future content should follow this workflow:

1. Topic Selection
2. Passage Blueprint
3. Passage Generation
4. Question Blueprint
5. Question Generation
6. Answer Validation
7. Evidence Extraction
8. Skill Assignment
9. Trap Assignment
10. Difficulty Calibration
11. Explanation Generation
12. QA Validation
13. Publish

Passage blueprint fields:

- topic
- subtopic
- target band
- difficulty
- word count range
- paragraph count
- passage style
- vocabulary complexity
- inference density
- paraphrase density

Question blueprint fields:

- question type
- target skill
- target trap
- difficulty
- evidence location
- inference requirement
- paraphrase intensity

## QA And Validation Workflow

Validation utilities live in `src/lib/validation/content.ts`.

Run:

```bash
npm run validate:content
```

The validator checks:

- Unique taxonomy ids and slugs.
- Taxonomy references inside question types and skills.
- Passage metadata, paragraph count, source note, word count, and difficulty.
- Question type, skill, trap type, evidence, explanation, accepted answers, and metadata consistency.
- Drill strategy lesson links, question counts, passage references, relationship declarations, and metadata consistency.
- Lesson related question types, skills, traps, target level, and metadata.
- Academic-only test type and test question counts.
- Recommendation readiness for skills and practice links.

Validation exits with failure only for errors. Warnings identify expansion gaps or lower-risk content QA issues.

## Content Relationship Model

Relationship utilities live in `src/lib/content-relationships.ts`.

The central library lives in `src/data/content-library.ts`:

- `contentLibrary`
- `contentRelationshipIndex`

Relationship index maps include:

- `drillsByQuestionType`
- `drillsBySkill`
- `drillsByTrap`
- `drillsByTopic`
- `lessonsByQuestionType`
- `lessonsBySkill`
- `lessonsByTrap`
- `questionsByQuestionType`
- `questionsBySkill`
- `questionsByTrap`
- `testsByTopic`

Use `getPracticeTargets()` when a recommendation needs available drills, lessons, or tests for a question type, skill, trap, or topic.

## Structured Directory Architecture

Current implemented structure:

```text
src/data/
  content-library.ts
  drills.ts
  strategy-lessons.ts
  tests.ts
  types.ts
  taxonomy/
    cognitive-levels.ts
    difficulty.ts
    index.ts
    passage-styles.ts
    practice-modes.ts
    question-types.ts
    recommendation-types.ts
    skills.ts
    topics.ts
    trap-types.ts
    utils.ts
src/lib/
  content-metadata.ts
  content-relationships.ts
  validation/
    content.ts
scripts/
  validate-content.ts
```

Future split when content volume grows:

```text
src/data/
  mini-tests/
  drills/
    question-types/
    skills/
  lessons/
  taxonomy/
  topics/
  metadata/
```

The current single-file test and drill modules are acceptable while the library is small. Move to per-content files when review and merge conflicts become difficult.

## Recommendation Relationship System

Recommendations should avoid hardcoded assumptions where possible.

Example use cases:

- Matching Headings weakness -> query `questionType: "matching-headings"` for drills and lessons.
- Main idea weakness -> query `skill: "Understanding main idea"`.
- Not Given trap weakness -> query `trapType: "Not Given trap"`.
- Topic-specific expansion -> query `topic: "climate-change"` or another taxonomy topic id.

This prepares Phase 3B or later adaptive recommendations without adding accounts, AI tutoring, or backend systems.

## Content Expansion Strategy

Medium-term targets:

- 30 to 50 Academic Reading mini tests.
- 10 or more drills per question type.
- 10 or more drills per skill.
- Dedicated Band 8-9 challenge content.
- More manually edited evidence sentences for generated seed content.

Expansion priority:

1. Fill missing skill coverage from the validation warnings.
2. Add harder inference, writer opinion, and comparison content.
3. Add more non-science humanities and social science passages.
4. Add Band 8-9 challenge drills after baseline coverage is balanced.
5. Add full 40-question Academic Reading simulations later.

## Topic Diversification Strategy

Use `src/data/taxonomy/topics.ts` as the source of truth.

Balance future content across:

- Science
- Humanities
- Social science
- Technology
- Health
- Environment

Avoid repeatedly using the same framing, such as every passage being a policy pilot or technology evaluation. Keep all content Academic Reading in tone and avoid General Training contexts.

## Future-Ready Architecture Recommendations

Prepared but not implemented in Phase 3A:

- Vocabulary and paraphrase mapping.
- Adaptive drill selection.
- Confidence tracking.
- Mistake notebook.
- Local trend dashboard.
- AI-assisted content QA.
- Full 40-question Academic Reading tests.
- Optional account sync if the product direction changes later.

## QA Checklist Result

| Check | Result |
| --- | --- |
| Taxonomy consistency | Pass |
| Metadata consistency | Pass |
| Difficulty consistency | Pass |
| Passage QA validation utility | Pass |
| Question QA validation utility | Pass |
| Explanation and evidence validation | Pass |
| Recommendation relationship integrity | Pass with 5 expansion warnings |
| Structured directory organization | Pass |
| No broken references | Pass |
| No inconsistent labels causing validation errors | Pass |
| Existing tests still work | Build and smoke-ready |
| Existing drills still work | Build and smoke-ready |
| Existing recommendation links still work | Build and smoke-ready |
| TypeScript errors | Pass |
| Lint errors | Pass |
| Vercel readiness | Build-ready; live Vercel deployment not run locally |

Historical Phase 3A-2 update, now superseded by the realism reset:

- The generated scale experiment reached 30 mini tests, 87 drills and 29 strategy lessons.
- That scale was later reduced after the realism audit found the content too templated.
- Current published scale is tracked in `docs/phase-3a-realism-expansion.md`.

See `docs/phase-3a2-large-scale-content.md` for the large-scale expansion strategy and QA results.

## Remaining Issues For Future Phases

- Split large content files into per-test and per-drill modules when content volume grows.
- Add manual editorial review for every AI-generated passage before major public promotion.
- Add unit tests for validation utilities and relationship queries.
- Create blueprint templates for passage and question generation.
- Add more drills for under-covered skills and traps.
- Add richer topic balance reporting once the content library is larger.

## Content Originality Warning

All content must remain original IELTS-style Academic Reading practice material. Do not copy passages, questions, answer keys, diagrams, explanations, or wording from IELTS, Cambridge, British Council, IDP, commercial books, or other copyrighted sources.
