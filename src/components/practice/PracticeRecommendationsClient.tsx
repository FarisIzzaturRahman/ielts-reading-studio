"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { DiagnosisResult, Recommendation } from "@/lib/diagnosis";
import { diagnosisHistoryKey, loadJson } from "@/lib/storage";

function latestDiagnosis(history: Record<string, DiagnosisResult | undefined>) {
  return Object.values(history)
    .filter((item): item is DiagnosisResult => Boolean(item))
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())[0];
}

export function PracticeRecommendationsClient() {
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);

  useEffect(() => {
    let isMounted = true;
    queueMicrotask(() => {
      if (!isMounted) return;

      const history = loadJson<Record<string, DiagnosisResult | undefined>>(diagnosisHistoryKey()) ?? {};
      setDiagnosis(latestDiagnosis(history) ?? null);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const recommendations = useMemo<Recommendation[]>(() => {
    return diagnosis?.recommendations.filter((item) => item.href.startsWith("/practice")) ?? [];
  }, [diagnosis]);

  return (
    <section className="test-panel p-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-950">Recommended Practice</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Recommendations use your latest completed mini-test diagnosis stored in this browser.
          </p>
        </div>
        <Link
          href="/tests"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Take a mini test
        </Link>
      </div>
      {recommendations.length ? (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {recommendations.slice(0, 4).map((recommendation) => (
            <article key={recommendation.id} className="rounded-md border border-slate-200 p-4">
              <h3 className="font-semibold text-slate-950">{recommendation.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">{recommendation.description}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Reason: {recommendation.reason}
              </p>
              <Link
                href={recommendation.href}
                className="mt-4 inline-flex rounded-md bg-emerald-700 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
              >
                Open practice
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-md border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm leading-6 text-slate-700">
            Complete a mini test first to receive personalized recommendations, or choose any practice mode below.
          </p>
        </div>
      )}
    </section>
  );
}
