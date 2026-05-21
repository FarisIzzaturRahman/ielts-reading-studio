# Phase 3A-REALISM: Editorial Realism and Psychometric Overhaul

> Status update: this document records the realism reset that reduced the library to a benchmark set of 3 tests and 10 drills. Controlled expansion has now resumed in `docs/phase-3a-realism-expansion.md`.

## Why Scaling Is Paused

The Phase 3A-2 library proved that the platform architecture could scale, but the content audit showed that scale had outpaced realism. The previous generated library had repeated passage structures, predictable answer positions, weak distractors, generic evidence, and insufficient Band 8-9 difficulty calibration.

The published library is now intentionally smaller. The goal of this phase is to establish quality benchmarks before expanding again.

## Implementation Summary

- Replaced the 30 blueprint-generated mini tests with 3 human-edited flagship mini tests.
- Replaced generated drill expansion with 10 drill-native focused practice sets.
- Preserved the simulator, scoring, review, diagnosis, recommendation and LocalStorage architecture.
- Added validation checks for answer-position concentration, repeated question structures, repeated paragraph openings and generic evidence text.
- Updated public copy and README to explain the flagship realism set.

## Flagship Tests

Current flagship tests:

1. `realism-easy-01` - Green Roofs and Urban Heat
   - Archetype: urban planning case study plus applied evidence critique.
   - Difficulty: Easy.
   - Focus: direct evidence, scope control, practical interpretation.

2. `realism-hard-01` - Traces of Colour in Historical Textiles
   - Archetype: historical investigation plus material-evidence interpretation.
   - Difficulty: Hard.
   - Focus: source reliability, cautious inference, commercial language, residue evidence.

3. `realism-band9-01` - When Algorithms Become Instruments
   - Archetype: conceptual review plus technology ethics discussion.
   - Difficulty: Band 8-9 Challenge.
   - Focus: abstract reasoning, low keyword overlap, writer stance, multi-step inference.

Each mini test contains:

- 2 passages.
- 20 questions.
- Real evidence excerpts.
- Human-written explanations.
- Plausible distractors.
- Balanced answer positions.
- Varied question sequencing.

## Passage Archetype Redesign

The old content used one repeated pattern: data problem, pilot, stakeholder, limitation, future step. The new flagship tests use distinct rhetorical structures:

- Urban case study: concrete intervention, maintenance reality, measurement, policy caution.
- Historical investigation: damaged object, laboratory evidence, source criticism, interpretive conclusion.
- Conceptual technology argument: analogy, epistemic risk, review mechanism, institutional accountability.

Future batches should add:

- Scientific process report.
- Competing theory debate.
- Longitudinal field study.
- Environmental systems analysis.
- Experimental failure analysis.
- Anthropological observation.
- Comparative historical interpretation.

## Test Blueprint Redesign

Question sequencing now varies by test. The validator detects dominant repeated sequences across tests, so future content cannot return to one universal 20-question template without a warning.

Future blueprints should vary:

- Passage-question grouping.
- Question-type order.
- Evidence distance.
- Cognitive pacing.
- Answer-key distribution.
- Passage-level task density.

## Real Evidence System

Questions now store evidence as real passage text or close passage excerpts. Generic evidence such as `Paragraph C states this directly` is now treated as a validation warning.

Each question should include:

- `evidenceParagraph`
- `evidenceText`
- `whyCorrect`
- `whyWrong`
- trap explanation
- strategy tip

## Distractor Reconstruction Strategy

Distractors should be plausible but wrong. They should exploit:

- partial truth
- scope distortion
- chronology confusion
- cause-effect confusion
- similar keywords
- writer-opinion confusion
- overgeneralisation

Avoid absurd options that no serious learner would choose.

## Drill Reconstruction Strategy

Drills are now drill-native. They no longer materialize questions from the mini-test library.

Current drill-native set:

- `tfng-drill-001`
- `matching-headings-drill-001`
- `matching-information-drill-001`
- `summary-completion-drill-001`
- `sentence-completion-drill-001`
- `multiple-choice-drill-001`
- `recognising-paraphrase-drill-001`
- `main-idea-drill-001`
- `inference-drill-001`
- `scanning-drill-001`

## Editorial Workflow

Content statuses supported by the schema:

- `generated`
- `realism-reviewed`
- `psychometric-reviewed`
- `finalized`
- `published`

The recommended editorial path is:

Generate draft -> realism review -> psychometric review -> final edit -> publish.

## Human Realism QA Checklist

Before publishing content, review:

- Does the passage have a distinct rhetorical shape?
- Do paragraph lengths and sentence rhythms vary naturally?
- Does the passage avoid generic AI academic framing?
- Does each item require reading rather than pattern recognition?
- Are distractors plausible but fair?
- Is the evidence a real text excerpt?
- Does the explanation teach the exact meaning difference?
- Are answer positions balanced?
- Does the difficulty label match the actual cognitive load?
- Would an experienced IELTS teacher trust the item?

## Validation Guardrails

Run:

```bash
npm run validate:content
npm run lint
npm run build
```

The validator now checks:

- taxonomy consistency
- metadata consistency
- Academic-only scope
- question counts
- lesson relationships
- recommendation relationships
- answer-position concentration
- repeated question-type sequences
- repeated paragraph openings
- generic evidence wording

## Remaining Weaknesses

- The realism-reviewed library is smaller than the previous generated library.
- Some question types are not yet represented in drill-native practice.
- Strategy lessons still contain some generic generated material and should be rewritten in later editorial batches.
- Diagram-label completion remains text-based until the UI supports visual diagrams.
- More flagship tests are needed before large-scale expansion resumes.
