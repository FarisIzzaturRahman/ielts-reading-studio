"use client";

import Link from "next/link";
import type { Recommendation } from "@/lib/diagnosis";

export function Recommendations({ recommendations }: { recommendations: Recommendation[] }) {
  return (
    <section className="test-panel p-6">
      <h2 className="text-xl font-semibold tracking-tight text-slate-950">Recommended next practice</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
        These rule-based recommendations are generated from your weakest question type, weakest skill, trap
        pattern, score and unanswered questions.
      </p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {recommendations.map((recommendation, index) => (
          <article key={recommendation.id} className="rounded-md border border-slate-200 p-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold text-slate-950">
                {index + 1}. {recommendation.title}
              </h3>
              <span
                className={`rounded-md px-2 py-1 text-xs font-semibold ${
                  recommendation.priority === "high"
                    ? "bg-rose-50 text-rose-800"
                    : recommendation.priority === "medium"
                      ? "bg-amber-50 text-amber-800"
                      : "bg-slate-100 text-slate-700"
                }`}
              >
                {recommendation.priority}
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-700">{recommendation.description}</p>
            <p className="mt-3 text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
              Reason: {recommendation.reason}
            </p>
            <Link
              href={recommendation.href}
              className="mt-4 inline-flex rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Try recommended practice
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
