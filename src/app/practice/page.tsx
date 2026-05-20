import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { DrillCard } from "@/components/practice/DrillCard";
import { PracticeHubCard } from "@/components/practice/PracticeHubCard";
import { PracticeProgressSummary } from "@/components/practice/PracticeProgressSummary";
import { PracticeRecommendationsClient } from "@/components/practice/PracticeRecommendationsClient";
import { practiceDrills } from "@/data/drills";
import { QUESTION_TYPE_TAXONOMY, SKILL_TAXONOMY } from "@/lib/taxonomy";

export default function PracticeHubPage() {
  const questionTypeDrills = practiceDrills.filter((drill) => drill.practiceMode === "question-type");
  const skillDrills = practiceDrills.filter((drill) => drill.practiceMode === "skill");
  const progressDrills = practiceDrills.map((drill) => ({
    drillId: drill.drillId,
    practiceMode: drill.practiceMode,
    questionType: drill.questionType,
    skill: drill.skill,
  }));

  return (
    <AppShell>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">Focused practice</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950">
            IELTS Academic Reading Practice
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
            Choose a focused practice mode to improve specific IELTS Reading skills and question types. All drills
            are free, no-login, English-only, and based on original IELTS-style Academic Reading content.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/practice/question-types"
              className="rounded-md bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Practice by question type
            </Link>
            <Link
              href="/practice/skills"
              className="rounded-md border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Practice by skill
            </Link>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
        <PracticeProgressSummary drills={progressDrills} />
        <PracticeRecommendationsClient />
        <div className="grid gap-4 lg:grid-cols-2">
          <PracticeHubCard
            title="Practice by Question Type"
            description="Train a specific IELTS Academic Reading task format, such as True / False / Not Given, Matching Headings, Summary Completion or Multiple Choice."
            meta={[`${QUESTION_TYPE_TAXONOMY.length} question types`, `${questionTypeDrills.length} launch drills`, "5 questions each"]}
            href="/practice/question-types"
          />
          <PracticeHubCard
            title="Practice by Reading Skill"
            description="Target the reading behaviour behind mistakes, such as paraphrase recognition, main idea, inference or scanning."
            meta={[`${SKILL_TAXONOMY.length} skills`, `${skillDrills.length} launch drills`, "Strategy first"]}
            href="/practice/skills"
          />
        </div>
        <section className="test-panel p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-950">Launch drill sets</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                These focused drills are shorter than mini tests. Use them to practise a weakness before returning
                to timed simulation.
              </p>
            </div>
            <Link href="/tests" className="text-sm font-semibold text-emerald-800 hover:text-emerald-700">
              Take a mini test
            </Link>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {practiceDrills.slice(0, 4).map((drill) => (
              <DrillCard key={drill.drillId} drill={drill} />
            ))}
          </div>
        </section>
      </section>
    </AppShell>
  );
}
