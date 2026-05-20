import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { DrillCard } from "@/components/practice/DrillCard";
import { getDrillsByQuestionType } from "@/data/drills";
import { getQuestionTypeBySlug, QUESTION_TYPE_TAXONOMY } from "@/lib/taxonomy";

export function generateStaticParams() {
  return QUESTION_TYPE_TAXONOMY.map((item) => ({ questionTypeSlug: item.slug }));
}

export default async function QuestionTypeDetailPage({
  params,
}: {
  params: Promise<{ questionTypeSlug: string }>;
}) {
  const { questionTypeSlug } = await params;
  const item = getQuestionTypeBySlug(questionTypeSlug);

  if (!item) {
    return (
      <AppShell>
        <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="test-panel p-6">
            <h1 className="text-2xl font-semibold text-slate-950">Question type not found</h1>
            <p className="mt-3 text-slate-600">
              This practice category is not available. Choose another IELTS Academic Reading practice mode.
            </p>
            <Link href="/practice/question-types" className="mt-5 inline-flex rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
              Back to question types
            </Link>
          </div>
        </section>
      </AppShell>
    );
  }

  const drills = getDrillsByQuestionType(item.id);

  return (
    <AppShell>
      <section className="mx-auto max-w-7xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
        <Link href="/practice/question-types" className="text-sm font-semibold text-emerald-800 hover:text-emerald-700">
          Back to question types
        </Link>
        <section className="test-panel p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">Question type practice</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{item.label} Practice</h1>
          <p className="mt-3 max-w-3xl leading-7 text-slate-600">{item.description}</p>
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            <div className="rounded-md bg-slate-50 p-4">
              <h2 className="font-semibold text-slate-950">What this tests</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">{item.tests}</p>
            </div>
            <div className="rounded-md bg-slate-50 p-4">
              <h2 className="font-semibold text-slate-950">Estimated time</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">{item.estimatedTimeMinutes} minutes per launch drill</p>
            </div>
            <div className="rounded-md bg-slate-50 p-4">
              <h2 className="font-semibold text-slate-950">Difficulty</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">{item.difficulty}</p>
            </div>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <div className="test-panel p-6">
            <h2 className="text-xl font-semibold tracking-tight text-slate-950">Step-by-step strategy</h2>
            <ol className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
              {item.strategy.map((step, index) => (
                <li key={step} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-emerald-700 text-xs font-semibold text-white">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="test-panel p-6">
            <h2 className="text-xl font-semibold tracking-tight text-slate-950">Common traps</h2>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
              {item.commonTraps.map((trap) => (
                <li key={trap} className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-amber-950">
                  {trap}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="test-panel p-6">
          <h2 className="text-xl font-semibold tracking-tight text-slate-950">Available drill sets</h2>
          {drills.length ? (
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {drills.map((drill) => (
                <DrillCard key={drill.drillId} drill={drill} />
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-md border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm leading-6 text-slate-700">
                This question type page is ready, but a focused drill has not been added yet. Try a related launch
                drill or take a mini test.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href="/practice" className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700">
                  Back to Practice Hub
                </Link>
                <Link href="/tests" className="rounded-md bg-emerald-700 px-3 py-2 text-sm font-semibold text-white">
                  Take a mini test
                </Link>
              </div>
            </div>
          )}
        </section>
      </section>
    </AppShell>
  );
}
