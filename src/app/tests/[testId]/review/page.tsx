import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { ReviewPageClient } from "@/components/ReviewPageClient";
import { getTestById, readingTests } from "@/data/tests";

export function generateStaticParams() {
  return readingTests.map((test) => ({ testId: test.testId }));
}

export default async function ReviewPage({
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
      <section className="mx-auto max-w-[1440px] px-4 py-4 sm:px-6 lg:px-8">
        <ReviewPageClient test={test} />
      </section>
    </AppShell>
  );
}
