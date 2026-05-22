import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { ResultPageClient } from "@/components/ResultPageClient";
import { getTestById, getTestRouteParams } from "@/data/tests";

export function generateStaticParams() {
  return getTestRouteParams();
}

export default async function ResultsPage({
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
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <ResultPageClient test={test} />
      </section>
    </AppShell>
  );
}
