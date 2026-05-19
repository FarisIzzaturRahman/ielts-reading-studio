import { notFound } from "next/navigation";
import { TestRunner } from "@/components/TestRunner";
import { getTestById, readingTests } from "@/data/tests";

export function generateStaticParams() {
  return readingTests.map((test) => ({ testId: test.testId }));
}

export default async function PracticePage({
  params,
}: {
  params: Promise<{ testId: string }>;
}) {
  const { testId } = await params;
  const test = getTestById(testId);

  if (!test) {
    notFound();
  }

  return <TestRunner test={test} />;
}
