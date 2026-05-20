import Link from "next/link";
import type { DrillSet } from "@/data/types";

export function DrillCard({ drill }: { drill: DrillSet }) {
  return (
    <article className="rounded-md border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-slate-950">{drill.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{drill.description}</p>
        </div>
        <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
          {drill.difficulty}
        </span>
      </div>
      <dl className="mt-4 grid grid-cols-3 gap-2 text-sm">
        <div className="rounded-md bg-slate-50 p-3">
          <dt className="text-slate-500">Questions</dt>
          <dd className="mt-1 font-semibold text-slate-950">{drill.questions.length}</dd>
        </div>
        <div className="rounded-md bg-slate-50 p-3">
          <dt className="text-slate-500">Time</dt>
          <dd className="mt-1 font-semibold text-slate-950">{drill.estimatedTimeMinutes} min</dd>
        </div>
        <div className="rounded-md bg-slate-50 p-3">
          <dt className="text-slate-500">Mode</dt>
          <dd className="mt-1 font-semibold text-slate-950">
            {drill.practiceMode === "question-type" ? "Type" : "Skill"}
          </dd>
        </div>
      </dl>
      <Link
        href={`/practice/drills/${drill.drillId}`}
        className="mt-5 inline-flex rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
      >
        Start drill
      </Link>
    </article>
  );
}
