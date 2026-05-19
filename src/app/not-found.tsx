import Link from "next/link";
import { AppShell } from "@/components/AppShell";

export default function NotFound() {
  return (
    <AppShell>
      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="test-panel p-8">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Test page not found</h1>
          <p className="mt-4 leading-7 text-slate-600">
            The IELTS Academic Reading page you requested does not exist, or the test ID is invalid. Choose an
            available test from the library and start again.
          </p>
          <Link
            href="/tests"
            className="mt-6 inline-flex rounded-md bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Back to test library
          </Link>
        </div>
      </section>
    </AppShell>
  );
}
