# IELTS Reading Studio Product Plan

## 1. Executive Summary

IELTS Reading Studio is a focused IELTS Academic Reading simulator for self-study learners across beginner, intermediate, advanced and Band 8-9 levels. The MVP is a static Next.js app with 15 original mini reading tests, each with 2 passages, 20 questions, a 30-minute timer, local answer saving, automatic scoring, review, explanations and skill diagnosis. It is deliberately not a full IELTS clone: it reproduces the learning workflow and interface patterns while avoiding copied official or Cambridge content.

The first release is designed for GitHub and Vercel: no backend, no login, test content stored in local TypeScript/JSON-like data, and progress saved in `localStorage`.

## 2. Competitor and Reference Analysis

| Reference | Observed patterns | Strengths | Weaknesses | What to adapt | What to improve |
| --- | --- | --- | --- | --- | --- |
| Official IELTS Academic Reading format | 3 sections/passages, 40 questions, 60 minutes, answer transfer included, each correct answer earns 1 mark; task types include MCQ, TFNG, YNNG, matching, completion, diagram labels and short answer. | Authoritative format and scoring baseline. | Paper-focused descriptions do not provide a learner analytics experience. | Use official timing, task taxonomy and one-mark-per-question logic as the future full-test model. | Provide mini-test mode and richer post-test explanations. |
| Official IELTS sample questions | Offers official paper sample tasks and answer sheets for familiarisation. | Strongest exam-format reference. | Static PDFs are not ergonomic for browser practice and do not teach from mistakes. | Use question-type coverage and instruction style. | Add interactive answer entry, timer, auto-save and review. |
| British Council Academic Reading practice | Presents passage sections and answer-sheet style instructions. | Clear free practice entry point from a reputable source. | Fragmented page flow; limited progress tracking. | Preserve simple instructions and question-by-question clarity. | Consolidate passage, questions, progress and review in one workspace. |
| IELTS on computer familiarisation | Computer practice experience includes platform familiarisation; official notes mention timer/highlighting/notes may differ from live tests. | Useful benchmark for split-screen, timer, highlight and notes expectations. | Practice experience may not mark answers or provide answer supply. | Add timer, highlight and notes as learning tools. | Provide marked answers and explanations after submission. |
| IDP IELTS Reading practice hub | Organises practice by question type and provides answer keys; highlights timed practice, skimming/scanning and answer checking. | Good taxonomy and learner guidance. | Individual task pages are not full integrated simulations. | Use question-type filters/metadata in content model. | Combine question-type practice with full mini simulations. |
| Magoosh IELTS practice | Offers full/section tests, score prediction and strengths/weaknesses feedback. | Strong learning loop and progress motivation. | Requires account/email for full experience; broader than Reading-only. | Use skill breakdown and recommended next practice. | Keep MVP frictionless and Reading-specific. |
| Road to IELTS | Structured by skill and task type with online practice resources. | Strong curriculum orientation. | Access may depend on registration/market and may feel course-heavy. | Later add lessons and targeted task drills. | Keep first screen action-oriented: start a test quickly. |

Sources: IELTS Academic Reading format, IELTS scoring, IELTS sample questions, British Council practice/familiarisation, IDP practice, Magoosh practice, Road to IELTS. See source links at the end of this document.

## 3. Product Requirement Document

### Product Vision

Create a serious, accessible and repeatable IELTS Academic Reading practice environment that helps learners build timing discipline, evidence-location accuracy and post-test reflection.

### Target Users

- IELTS Academic candidates preparing for university or professional registration.
- Self-study learners who want realistic Academic Reading practice without an account.
- Beginner, intermediate, advanced and expert users aiming for stronger Reading scores.
- Students aiming for Band 7-9 in Reading.

### Core User Problems

- Learners often practise untimed PDFs and then struggle under exam pressure.
- They know whether an answer is wrong but not which reading skill failed.
- They lack enough legally usable practice content that can be repeated easily.
- They do not want login, payment or locked content before starting practice.

### Value Proposition

Original IELTS-style reading simulations with timed practice, auto-scoring, explanations and skill diagnosis in a clean browser interface.

## 4. User Personas

| Persona | Need | Product response |
| --- | --- | --- |
| Band 6.5 learner aiming for 7.5 | Needs timing discipline and exact answer evidence. | Mini tests, timer warning, review explanations, skill diagnosis. |
| Band 8 aspirant | Needs harder inference and paraphrase practice. | Hard and Band 8-9 Challenge tests, skill tags and difficult question review. |
| New self-learner | Needs a low-friction way to begin practice. | Free no-login test library with saved local progress. |
| Casual visitor | Needs immediate access without login. | Static MVP with start-practice CTA and local progress only. |

## 5. User Journey

1. Visitor lands on Home and understands mini-test vs future full-test mode.
2. Visitor opens Test Library and chooses a test by topic/difficulty.
3. Instruction page sets expectations: passages, questions, time and scoring limits.
4. Reading Test page shows passage left, questions right, sticky timer, flags, notes and highlights.
5. Submit modal warns if questions are blank.
6. Result page shows raw score, approximate mini-band, time, skill diagnosis and next practice.
7. Review page shows passage, user answers, correct answers and explanations.

## 6. Site Map

- `/` Home
- `/tests` Test Library
- `/tests/[testId]/instructions` Test Instruction
- `/tests/[testId]/practice` Reading Test
- `/tests/[testId]/results` Result
- `/tests/[testId]/review` Review
- `/about` About and affiliation disclaimer

## 7. Page-by-Page Requirements

### Home

- Clear headline and Reading-only positioning.
- Start practice CTA.
- Preview of 3 tests.
- Band motivation section.
- Explanation of 20-question mini mode vs future 40-question full mode.

### Test Library

- List 15 tests.
- Show difficulty, topic, band target, passages, questions and time.
- Show local completion status and latest score where available.

### Test Instruction

- Test title, topic, difficulty, band target, passage count, question count and time.
- IELTS-style instructions.
- Start button.

### Reading Test

- Desktop split screen: passages left, questions/right controls.
- Sticky timer and submit button.
- Question navigator with answered/flagged status.
- Flag question feature.
- Auto-save answers locally.
- Highlight selected text and notes.
- Mobile/tablet fallback stacks passage and questions.

### Submit Modal

- Count unanswered questions.
- Allow return to test or final submission.
- Auto-submit when timer reaches zero.

### Result

- Raw score out of 20.
- Approximate mini-band.
- Correct/incorrect overview.
- Skill diagnosis: skimming, scanning, inference, vocabulary in context, matching information, TFNG, summary completion.
- Time used and recommended next practice.

### Review

- Passage and questions shown again.
- User answer, correct answer and explanation.
- Skill tag per question.

### About

- Reading simulator explanation.
- Not affiliated with IELTS, British Council, IDP or Cambridge.
- Original IELTS-style content notice.

## 8. Feature Requirements

MVP features:

- 15 accessible mini tests.
- 2 passages and 20 questions per test.
- Timer with warning state.
- Answer input for selection and text answers.
- Local auto-save.
- Question flags.
- Highlights and notes.
- Submit confirmation.
- Auto-scoring.
- Result, review and explanations.
- Skill diagnosis.

Non-MVP but planned:

- Accounts, deeper analytics, bookmarks, full 40-question mode, AI explanations, PDF export.

## 9. MVP Specification

Technical MVP:

- Next.js App Router.
- TypeScript.
- Tailwind CSS.
- Static data in `src/data/tests.ts`.
- `localStorage` for progress and results.
- No backend, no authentication, no payment, no copyrighted content.

Content MVP:

- 15 original mini tests.
- Mixed IELTS-style question types.
- Topic coverage: climate, neuroscience, writing systems, AI education, marine biodiversity, public health, renewable energy, archaeology, behavioral economics, space, language learning, sustainable architecture, food security, decision psychology and medical technology.

## 10. UI/UX Specification

Design tone: clean, focused, academic and serious.

Interaction principles:

- Passage text uses generous line-height and readable measure.
- Test UI avoids marketing decoration during practice.
- Desktop-first split screen.
- Mobile uses stacked panels because narrow split-screen reading is poor.
- Timer changes color under 5 minutes.
- Question navigator supports fast movement.
- Review mode is calm and evidence-oriented.
- Avoid game-like styling.

Accessibility:

- Semantic headings and landmark regions.
- Keyboard-accessible links, inputs and modal actions.
- Visible focus rings through browser/Tailwind defaults.
- High contrast text.
- `aria-live` for warning timer state.
- Avoid color-only status by using text and labels.

## 11. Technical Architecture

Recommended stack:

- Next.js 16 App Router.
- React 19.
- TypeScript.
- Tailwind CSS v4.
- `lucide-react` for icons.
- Static TypeScript data now; JSON/MDX import possible later.
- Vercel deployment.

Routing:

- Server-render static pages load test data.
- Client components manage answer state, timer, localStorage and result review.

State:

- Test attempt state is local client state.
- Progress saved to `ielts-reading:v1:progress:${testId}`.
- Submitted result saved to `ielts-reading:v1:result:${testId}`.

Scoring:

- One point per correct answer.
- Text answers normalized for case, punctuation and spacing.
- Acceptable alternate answers supported.

Timer:

- Countdown initialized from `timeLimitMinutes`.
- Saved with progress.
- Auto-submits at zero.

## 12. Folder Structure

```text
src/
  app/
    page.tsx
    about/page.tsx
    tests/page.tsx
    tests/[testId]/instructions/page.tsx
    tests/[testId]/practice/page.tsx
    tests/[testId]/results/page.tsx
    tests/[testId]/review/page.tsx
  components/
    AppShell.tsx
    Header.tsx
    Footer.tsx
    TestCard.tsx
    Timer.tsx
    PassageViewer.tsx
    QuestionRenderer.tsx
    QuestionNavigator.tsx
    SubmitModal.tsx
    ResultSummary.tsx
    ReviewQuestion.tsx
    SkillDiagnosis.tsx
  data/
    tests.ts
    types.ts
  lib/
    scoring.ts
    storage.ts
docs/
  product-plan.md
```

## 13. JSON Data Schema

```json
{
  "testId": "test-01",
  "title": "Urban Climate Adaptation",
  "topic": "Climate change and urban planning",
  "difficulty": "Medium",
  "bandTarget": "Band 6.5-7.5",
  "timeLimitMinutes": 30,
  "estimatedTimeMinutes": 30,
  "passages": [
    {
      "passageId": "p1",
      "title": "The Future of Climate-Resilient Cities",
      "sourceNote": "Original IELTS-style practice passage created for this app.",
      "paragraphs": [
        {
          "label": "A",
          "text": "Original paragraph text..."
        }
      ]
    }
  ],
  "questions": [
    {
      "id": 1,
      "passageId": "p1",
      "type": "true-false-not-given",
      "prompt": "The first passage says...",
      "options": ["True", "False", "Not Given"],
      "answer": "True",
      "acceptableAnswers": ["True"],
      "explanation": "Paragraph A states this directly.",
      "skill": "True/False/Not Given",
      "difficulty": "Medium",
      "paragraphRef": "A",
      "maxWords": 3
    }
  ]
}
```

## 14. Sample Test Data Structure

The implementation uses `src/data/tests.ts`, which currently generates 15 original tests from topic blueprints. Each generated test has:

- 2 passages.
- 10 paragraphs total.
- 20 questions.
- Original explanations.
- Skill tags.
- Difficulty tags.
- Acceptable answer support for text questions.

For production content, migrate from generated blueprints to reviewed per-test JSON files:

```text
content/tests/test-01.json
content/tests/test-02.json
...
```

## 15. Scoring Algorithm

Mini-test conversion:

- 18-20: Band 8.5-9
- 16-17: Band 8
- 14-15: Band 7-7.5
- 12-13: Band 6.5
- 10-11: Band 6
- 8-9: Band 5.5
- 6-7: Band 5
- Below 6: Below Band 5

Future 40-question support:

- Add `mode: "mini" | "full"`.
- Add `scoreScale` per mode.
- Use official-style raw-score-to-band approximations with clear disclaimer.
- Keep one mark per correct answer.

## 16. Component Breakdown

- `AppShell`: shared header/footer shell.
- `TestCard`: library card with local score history.
- `Timer`: warning countdown display.
- `PassageViewer`: reading passage display, selection highlight capture.
- `QuestionRenderer`: renders text/select answer controls for all question types.
- `QuestionNavigator`: answered and flagged navigation grid.
- `SubmitModal`: unanswered warning and final submission.
- `ResultSummary`: raw score, mini-band, time and next test.
- `SkillDiagnosis`: skill-level correct/total bars.
- `ReviewQuestion`: user answer, correct answer and explanation.

## 17. Development Roadmap

### Phase 1: MVP

- Static website.
- 15 mini tests.
- Timer.
- Answer input.
- Auto scoring.
- Review page.
- LocalStorage progress.
- Vercel deployment.

### Phase 2: Better Learning Features

- Optional local score history.
- Weakness tracking.
- Personalized recommendations.
- Band target dashboard.
- Bookmark difficult questions.
- Reading strategy lessons.

### Phase 3: Deferred Classroom Mode

- Teacher and classroom features are intentionally out of scope for the current product direction.

### Phase 4: AI-Powered Features

- AI explanation.
- AI band diagnosis.
- AI-generated additional practice questions.
- Personalized study plan.
- Vocabulary extraction.
- Mistake pattern analysis.

### Phase 5: Full IELTS Mode

- 3 passages.
- 40 questions.
- 60-minute timer.
- More precise band conversion.
- Exam-like answer sheet.
- Printable PDF mode.

## 18. GitHub Setup Guide

1. Create a repository, for example `ielts-reading-studio`.
2. Initialize Git in this project root if needed.
3. Commit source files, `package.json` and `package-lock.json`.
4. Keep `node_modules`, `.next` and local environment files out of Git.
5. Use branch workflow:
   - `main` for production.
   - `dev` or feature branches for new content/features.
6. Add GitHub issue labels: `content`, `ux`, `bug`, `accessibility`, `deployment`, `academic-reading`.
7. Protect `main` once collaborators join.

## 19. Vercel Deployment Guide

1. Push the repo to GitHub.
2. In Vercel, import the GitHub repository.
3. Framework preset should auto-detect Next.js.
4. Build command: `npm run build`.
5. Output directory: Vercel default for Next.js.
6. No environment variables are required for MVP.
7. Each pull request should create a preview deployment.
8. Production deploys should come from `main`.

## 20. Testing Plan

Automated:

- `npm run lint`
- `npm run build`
- Add unit tests later for scoring and storage normalization.
- Add Playwright later for full test journey.

Manual:

- Start a test, answer a mix of questions and submit.
- Confirm unanswered modal warning.
- Confirm timer warning under 5 minutes.
- Reload mid-test and confirm progress persists.
- Confirm result and review pages load from localStorage.
- Check desktop, tablet and mobile widths.
- Keyboard test answer inputs and submit modal.

## 21. SEO Considerations

- Target title: IELTS Reading Studio - Mini IELTS Academic Reading Practice.
- Meta description emphasizes original practice, timer, scoring and review.
- Add structured FAQ later for mini-test/full-test distinction.
- Create topic landing pages later only after content quality review.
- Avoid implying official affiliation.

## 22. Performance Requirements

- Static pre-rendered routes.
- No backend requests in MVP.
- Avoid heavy client libraries.
- Keep content modular so future JSON imports can be code-split by test.
- Target Lighthouse performance above 90 on Vercel.

## 23. Security and Privacy Considerations

- No personal data required in MVP.
- All progress stored locally in the user browser.
- Add a privacy note explaining localStorage.
- If optional sync is ever added, use secure authentication and keep no-login practice available.
- Never collect sensitive immigration, passport or official IELTS details.

## 24. Analytics Recommendation

MVP:

- Optional Vercel Analytics or privacy-friendly analytics.
- Track anonymous page views and test starts/submissions.

Later:

- Track question type accuracy.
- Track average time per test.
- Track drop-off before submission.
- For logged-in users, request clear consent and provide deletion controls.

## 25. Maintenance Plan

- Review and improve one test per week until all passages feel publication-ready.
- Keep a content review checklist: originality, IELTS style, answer uniqueness, explanation quality, difficulty, spelling.
- Run lint/build before every deployment.
- Periodically review official IELTS pages for format/scoring changes.
- Keep disclaimers visible.

## 26. Risks and Mitigation

| Risk | Mitigation |
| --- | --- |
| Content accidentally resembles official material | Use fully original writing, source-review checklist and no copying from official/Cambridge passages. |
| Band estimates are misunderstood as official | Label all mini-band conversions as approximate. |
| Generated seed content feels repetitive | Treat current 15 tests as seed scaffolding; replace with editorially reviewed JSON tests. |
| LocalStorage loss | Be explicit that MVP saves only in the current browser; future sync should stay optional. |
| Mobile reading is uncomfortable | Desktop-first design with usable mobile fallback; recommend larger screens. |

## 27. Copyright and Content Originality Warning

Do not copy official IELTS, British Council, IDP, Cambridge or commercial test-book passages, questions, answer keys, diagrams or explanations. This app should use only original IELTS-style material. Official sources may guide format, timing and question taxonomy, but not content wording.

## 28. Clear Next Steps

1. Replace generated seed passages with editorially reviewed full-length original passages.
2. Add a scoring unit test suite.
3. Add Playwright tests for start-test-submit-review.
4. Add a content validation script that asserts each test has 20 questions and supported types.
5. Deploy to Vercel preview.
6. Collect learner feedback on readability, timer pressure and review usefulness.

## Sources

- Official IELTS Academic Reading format: https://ielts.org/take-a-test/test-types/ielts-academic-test/ielts-academic-format-reading
- Official IELTS scoring in detail: https://ielts.org/take-a-test/your-results/ielts-scoring-in-detail
- Official IELTS Academic sample questions: https://ielts.org/take-a-test/preparation-resources/sample-test-questions/academic-test
- British Council Academic Reading practice: https://takeielts.britishcouncil.org/take-ielts/prepare/free-ielts-practice-tests/reading/academic
- British Council IELTS on computer familiarisation: https://takeielts.britishcouncil.org/take-ielts/prepare/ielts-on-computer/familiarisation-test
- IDP IELTS Academic Reading practice hub: https://ielts.idp.com/prepare/academic-and-ukvi/reading/practice-test
- IDP Academic Reading overview and practice: https://ielts.idp.com/bangladesh/prepare/academic-reading
- IELTS Online computer note on timer/highlighting/notes: https://ielts.org/take-a-test/test-types/ielts-academic-test/ielts-online
- Magoosh IELTS free practice test: https://ielts.magoosh.com/practice_tests/free
- Road to IELTS reference: https://www.ieltsasia.org/sg/prepare/road-to-ielts
- Vercel Git deployments: https://vercel.com/docs/deployments/git
- Vercel deployment methods: https://vercel.com/docs/deployments/deployment-methods
