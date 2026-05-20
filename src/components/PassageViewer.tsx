"use client";

import type { Passage } from "@/data/types";
import { formatPassageLabel } from "@/lib/question-labels";

export function PassageViewer({
  passages,
  highlights,
  onAddHighlight,
  readOnly = false,
}: {
  passages: Passage[];
  highlights: string[];
  onAddHighlight: (highlight: string) => void;
  readOnly?: boolean;
}) {
  if (!passages.length) {
    return (
      <section className="test-panel p-6">
        <h2 className="text-xl font-semibold text-slate-950">Passage unavailable</h2>
        <p className="mt-3 text-slate-600">This test is missing passage data. Please return to the test library.</p>
      </section>
    );
  }

  function saveSelection() {
    const selectedText = window.getSelection()?.toString().trim();
    if (selectedText) {
      onAddHighlight(selectedText.slice(0, 220));
      window.getSelection()?.removeAllRanges();
    }
  }

  return (
    <section className="test-panel min-h-[calc(100vh-10rem)] overflow-hidden">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-600">Reading passages</h2>
        {readOnly ? (
          <span className="text-sm text-slate-500">Review mode</span>
        ) : (
          <button
            type="button"
            onClick={saveSelection}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Highlight selection
          </button>
        )}
      </div>
      <div className="max-h-[calc(100vh-13.5rem)] overflow-y-auto px-5 py-6">
        {passages.map((passage) => (
          <article key={passage.passageId} className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
              Passage {formatPassageLabel(passage.passageId)}
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{passage.title}</h3>
            <p className="mt-1 text-xs text-slate-500">{passage.sourceNote}</p>
            <div className="reading-prose mt-5 space-y-5 text-slate-800">
              {passage.paragraphs.map((paragraph) => (
                <p key={paragraph.label}>
                  <strong>{paragraph.label}.</strong> {paragraph.text}
                </p>
              ))}
            </div>
          </article>
        ))}
        {highlights.length > 0 ? (
          <aside className="rounded-md border border-amber-200 bg-amber-50 p-4">
            <h3 className="text-sm font-semibold text-amber-950">Saved highlights</h3>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-amber-950">
              {highlights.map((highlight, index) => (
                <li key={`${highlight}-${index}`}>&quot;{highlight}&quot;</li>
              ))}
            </ul>
          </aside>
        ) : null}
      </div>
    </section>
  );
}
