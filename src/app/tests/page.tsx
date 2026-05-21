import { AppShell } from "@/components/AppShell";
import { TestCard } from "@/components/TestCard";
import { readingTests } from "@/data/tests";

export default function TestLibraryPage() {
  return (
    <AppShell>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              IELTS Academic Reading test library
            </h1>
            <p className="mt-3 max-w-3xl leading-7 text-slate-600">
              {readingTests.length} free, original mini simulations for self-learners. Choose an Academic Reading
              topic, continue an unfinished attempt, or retake a completed test without creating an account.
            </p>
          </div>
          <div className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
            Progress is saved only on this device and browser.
          </div>
        </div>
        {readingTests.length ? (
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {readingTests.map((test) => (
              <TestCard key={test.testId} test={test} />
            ))}
          </div>
        ) : (
          <div className="test-panel mt-8 p-8 text-center">
            <h2 className="text-2xl font-semibold text-slate-950">No tests available</h2>
            <p className="mt-3 text-slate-600">Please check back after new Academic Reading tests are added.</p>
          </div>
        )}
      </section>
    </AppShell>
  );
}
