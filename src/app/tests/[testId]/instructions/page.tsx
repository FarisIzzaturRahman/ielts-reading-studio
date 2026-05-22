import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { AttemptActions } from "@/components/AttemptActions";
import { getTestById, getTestRouteParams } from "@/data/tests";

export function generateStaticParams() {
  return getTestRouteParams();
}

export default async function TestInstructionsPage({
  params,
}: {
  params: Promise<{ testId: string }>;
}) {
  const { testId } = await params;
  const test = getTestById(testId);

  if (!test) {
    notFound();
  }

  return (
    <AppShell>
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="test-panel p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">IELTS Academic Reading</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{test.title}</h1>
          <dl className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-md bg-slate-50 p-4">
              <dt className="text-sm text-slate-500">Reading passage</dt>
              <dd className="mt-1 text-xl font-semibold">1</dd>
            </div>
            <div className="rounded-md bg-slate-50 p-4">
              <dt className="text-sm text-slate-500">Questions</dt>
              <dd className="mt-1 text-xl font-semibold">{test.questions.length}</dd>
            </div>
            <div className="rounded-md bg-slate-50 p-4">
              <dt className="text-sm text-slate-500">Time</dt>
              <dd className="mt-1 text-xl font-semibold">{test.timeLimitMinutes} min</dd>
            </div>
          </dl>
          <div className="mt-8 border-t border-slate-200 pt-6">
            <h2 className="text-xl font-semibold text-slate-950">Instructions</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
              <li>Read the passage and answer all 20 questions.</li>
              <li>Choose answers from the options or type short answers exactly as requested.</li>
              <li>You may flag questions, save short notes and highlight selected text.</li>
              <li>The timer will submit the test automatically when it reaches zero.</li>
              <li>This free simulator does not require login. Progress is saved only on this device and browser.</li>
              <li>The score is an approximate mini-test estimate, not an official IELTS result.</li>
            </ul>
          </div>
          <AttemptActions test={test} />
        </div>
      </section>
    </AppShell>
  );
}
