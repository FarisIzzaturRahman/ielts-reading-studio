import { AppShell } from "@/components/AppShell";

export default function AboutPage() {
  return (
    <AppShell>
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="test-panel p-8">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">About IELTS Reading Studio</h1>
          <div className="mt-6 space-y-5 leading-7 text-slate-700">
            <p>
              IELTS Reading Studio is a focused practice simulator for the IELTS Academic Reading section.
              It is designed for self-learners who want free exam-style timing, structured answer entry,
              automatic scoring and explanations without creating an account.
            </p>
            <p>
              This website provides independent IELTS Academic Reading practice materials. It is not affiliated
              with, endorsed by, or approved by IELTS, Cambridge, British Council, IDP, or the British Council.
            </p>
            <p>
              All passages and questions are original IELTS-style practice materials. They are not copied from
              official IELTS, Cambridge, British Council, IDP or commercial test books.
            </p>
            <p>
              The mini-test band estimate is a learning guide only. The real IELTS Academic Reading test uses
              40 questions, 3 passages and 60 minutes, with official band scoring determined by the test owners.
            </p>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
