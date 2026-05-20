import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { DrillReviewClient } from "@/components/practice/DrillReviewClient";
import { getDrillById, getRelatedDrills, practiceDrills } from "@/data/drills";

export function generateStaticParams() {
  return practiceDrills.map((drill) => ({ drillId: drill.drillId }));
}

export default async function DrillReviewPage({
  params,
}: {
  params: Promise<{ drillId: string }>;
}) {
  const { drillId } = await params;
  const drill = getDrillById(drillId);

  if (!drill) {
    return (
      <AppShell>
        <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="test-panel p-6">
            <h1 className="text-2xl font-semibold text-slate-950">Practice drill not found</h1>
            <p className="mt-3 text-slate-600">Choose another focused IELTS Academic Reading drill.</p>
            <Link href="/practice" className="mt-5 inline-flex rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
              Back to Practice Hub
            </Link>
          </div>
        </section>
      </AppShell>
    );
  }

  const relatedDrill = getRelatedDrills(drill, 1)[0];

  return (
    <AppShell>
      <section className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
        <DrillReviewClient
          drill={drill}
          relatedDrill={relatedDrill ? { drillId: relatedDrill.drillId, title: relatedDrill.title } : undefined}
        />
      </section>
    </AppShell>
  );
}
