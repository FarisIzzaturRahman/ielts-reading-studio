import Link from "next/link";
import { ArrowRight, BarChart3, BookOpenCheck, TimerReset } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { TestCard } from "@/components/TestCard";
import { readingTests } from "@/data/tests";

export default function Home() {
  return (
    <AppShell>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_0.85fr] lg:px-8 lg:py-20">
          <div className="flex flex-col justify-center">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Practice IELTS Academic Reading in a focused exam-like workspace.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Free, no-login IELTS Academic Reading practice for self-learners at every level. Start with{" "}
              {readingTests.length} realism-reviewed mini simulations: two passages, twenty questions, timed
              practice, scoring and review.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/tests"
                className="inline-flex items-center gap-2 rounded-md bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
              >
                Start mini test
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/practice"
                className="inline-flex items-center rounded-md border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Focused practice
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center rounded-md border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Read content policy
              </Link>
            </div>
          </div>
          <div className="test-panel p-6">
            <h2 className="text-xl font-semibold tracking-tight text-slate-950">Mini-test mode</h2>
            <div className="mt-5 grid gap-4">
              {[
                ["20 questions", "A shorter Academic Reading format built for daily repetition."],
                ["30 minutes", "Half-length timing that creates realistic exam pressure."],
                ["Full IELTS path", "Designed to expand into 40 questions and 60 minutes."],
              ].map(([title, body]) => (
                <div key={title} className="rounded-md bg-slate-50 p-4">
                  <p className="font-semibold text-slate-950">{title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            [TimerReset, "Timed realism", "A sticky timer, unanswered warnings and exam-style submission flow."],
            [
              BookOpenCheck,
              "Academic Reading tasks",
              "True / False / Not Given, matching, completion, short-answer and inference practice.",
            ],
            [BarChart3, "Learning feedback", "Scores, explanations, skill diagnosis and focused practice routes."],
          ].map(([Icon, title, body]) => (
            <div key={title as string} className="test-panel p-5">
              <Icon className="h-5 w-5 text-emerald-700" aria-hidden="true" />
              <h2 className="mt-4 text-lg font-semibold text-slate-950">{title as string}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{body as string}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Test list preview</h2>
              <p className="mt-2 max-w-2xl text-slate-600">
                Start with the realism-reviewed library as controlled batches add more Academic Reading content.
              </p>
            </div>
            <Link href="/tests" className="text-sm font-semibold text-emerald-800 hover:text-emerald-700">
              View all tests
            </Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {readingTests.slice(0, 3).map((test) => (
              <TestCard key={test.testId} test={test} />
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="test-panel p-6">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Band score motivation</h2>
          <p className="mt-3 max-w-3xl leading-7 text-slate-600">
            High-band Academic Reading performance is built from exact evidence location, paraphrase recognition
            and disciplined time control. This mini-test conversion helps self-learners track momentum while
            remembering that the official IELTS Academic Reading test uses 40 questions.
          </p>
        </div>
      </section>
    </AppShell>
  );
}
