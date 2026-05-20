import type { StrategyLesson as StrategyLessonType } from "@/data/types";

export function StrategyLesson({
  lesson,
  onStart,
}: {
  lesson: StrategyLessonType;
  onStart?: () => void;
}) {
  return (
    <section className="test-panel p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">Strategy lesson</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{lesson.title}</h1>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-md bg-slate-50 p-4">
          <h2 className="font-semibold text-slate-950">What this trains</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">{lesson.whatItTests}</p>
        </div>
        <div className="rounded-md bg-slate-50 p-4">
          <h2 className="font-semibold text-slate-950">Why it matters</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">{lesson.whyItMatters}</p>
        </div>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Steps</h2>
          <ol className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
            {lesson.steps.map((step, index) => (
              <li key={step} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-emerald-700 text-xs font-semibold text-white">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Common traps</h2>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
            {lesson.commonTraps.map((trap) => (
              <li key={trap} className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-amber-950">
                {trap}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-5 rounded-md border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-slate-950">Worked example</h2>
        <dl className="mt-3 grid gap-3 text-sm leading-6 text-slate-700">
          <div>
            <dt className="font-semibold text-slate-950">Statement</dt>
            <dd>{lesson.workedExample.statement}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-950">Passage evidence</dt>
            <dd>{lesson.workedExample.passageText}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-950">Answer</dt>
            <dd>{lesson.workedExample.answer}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-950">Why</dt>
            <dd>{lesson.workedExample.explanation}</dd>
          </div>
        </dl>
      </div>
      {onStart ? (
        <button
          type="button"
          onClick={onStart}
          className="mt-6 rounded-md bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          Start practice
        </button>
      ) : null}
    </section>
  );
}
