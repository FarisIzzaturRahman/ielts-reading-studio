import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { getDrillsByQuestionType } from "@/data/drills";
import { QUESTION_TYPE_TAXONOMY } from "@/lib/taxonomy";

export default function QuestionTypePracticePage() {
  return (
    <AppShell>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link href="/practice" className="text-sm font-semibold text-emerald-800 hover:text-emerald-700">
          Back to Practice Hub
        </Link>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Practice by Question Type</h1>
        <p className="mt-3 max-w-3xl leading-7 text-slate-600">
          Choose one IELTS Academic Reading question type, review a short strategy, then complete a focused drill.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {QUESTION_TYPE_TAXONOMY.map((item) => {
            const drills = getDrillsByQuestionType(item.id);

            return (
              <article key={item.id} className="rounded-md border border-slate-200 bg-white p-5">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-semibold tracking-tight text-slate-950">{item.label}</h2>
                  <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                    {drills.length ? `${drills.length} drill` : "Coming soon"}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Tests: {item.tests}
                </p>
                {drills.length ? (
                  <Link
                    href={`/practice/question-types/${item.slug}`}
                    className="mt-5 inline-flex rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Open practice
                  </Link>
                ) : (
                  <p className="mt-5 text-sm font-medium text-slate-500">Practice set not published yet.</p>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </AppShell>
  );
}
