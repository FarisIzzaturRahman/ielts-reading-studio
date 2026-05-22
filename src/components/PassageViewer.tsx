"use client";

import type { Passage } from "@/data/types";
import { formatPassageLabel } from "@/lib/question-labels";

export function PassageViewer({
  passages,
  highlights,
  onAddHighlight,
  onRemoveHighlight,
  onClearHighlights,
  readOnly = false,
  className = "",
}: {
  passages: Passage[];
  highlights: string[];
  onAddHighlight?: (highlight: string) => void;
  onRemoveHighlight?: (highlight: string) => void;
  onClearHighlights?: () => void;
  readOnly?: boolean;
  className?: string;
}) {
  const uniqueHighlights = [...new Set(highlights.map((highlight) => highlight.trim()).filter(Boolean))];

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
    if (selectedText && onAddHighlight) {
      onAddHighlight(selectedText.slice(0, 220));
      window.getSelection()?.removeAllRanges();
    }
  }

  function renderTextWithHighlights(text: string, paragraphKey: string) {
    if (!uniqueHighlights.length) return text;

    const parts: Array<{ type: "text"; text: string } | { type: "highlight"; text: string }> = [];
    let cursor = 0;

    while (cursor < text.length) {
      let nextMatch: { index: number; highlight: string } | null = null;

      for (const highlight of uniqueHighlights) {
        const index = text.indexOf(highlight, cursor);
        if (index === -1) continue;

        if (
          !nextMatch ||
          index < nextMatch.index ||
          (index === nextMatch.index && highlight.length > nextMatch.highlight.length)
        ) {
          nextMatch = { index, highlight };
        }
      }

      if (!nextMatch) {
        parts.push({ type: "text", text: text.slice(cursor) });
        break;
      }

      if (nextMatch.index > cursor) {
        parts.push({ type: "text", text: text.slice(cursor, nextMatch.index) });
      }

      parts.push({ type: "highlight", text: nextMatch.highlight });
      cursor = nextMatch.index + nextMatch.highlight.length;
    }

    return parts.map((part, index) => {
      const key = `${paragraphKey}-${index}`;

      if (part.type === "text") {
        return <span key={key}>{part.text}</span>;
      }

      if (!onRemoveHighlight) {
        return (
          <mark key={key} className="rounded bg-amber-200/80 px-0.5 text-slate-950">
            {part.text}
          </mark>
        );
      }

      return (
        <button
          key={key}
          type="button"
          onClick={() => onRemoveHighlight(part.text)}
          className="rounded bg-amber-200/90 px-0.5 text-left text-slate-950 underline decoration-amber-700/40 underline-offset-2 hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
          aria-label={`Remove highlight: ${part.text}`}
          title="Remove highlight"
        >
          {part.text}
        </button>
      );
    });
  }

  return (
    <section className={`test-panel flex min-h-[70vh] flex-col overflow-hidden ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-600">Reading passages</h2>
        <div className="flex flex-wrap items-center gap-2">
          {readOnly ? <span className="text-sm text-slate-500">Review mode</span> : null}
          {uniqueHighlights.length > 0 && onClearHighlights ? (
            <button
              type="button"
              onClick={onClearHighlights}
              className="rounded-md border border-amber-300 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-950 hover:bg-amber-100"
            >
              Clear highlights
            </button>
          ) : null}
          {!readOnly ? (
            <button
              type="button"
              onClick={saveSelection}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Highlight selection
            </button>
          ) : null}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-6">
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
                  <strong>{paragraph.label}.</strong>{" "}
                  {renderTextWithHighlights(paragraph.text, `${passage.passageId}-${paragraph.label}`)}
                </p>
              ))}
            </div>
          </article>
        ))}
        {uniqueHighlights.length > 0 ? (
          <aside className="rounded-md border border-amber-200 bg-amber-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-amber-950">Saved highlights</h3>
              {onClearHighlights ? (
                <button
                  type="button"
                  onClick={onClearHighlights}
                  className="rounded-md border border-amber-300 bg-white px-2.5 py-1 text-xs font-semibold text-amber-950 hover:bg-amber-100"
                >
                  Clear all highlights
                </button>
              ) : null}
            </div>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-amber-950">
              {uniqueHighlights.map((highlight, index) => (
                <li key={`${highlight}-${index}`} className="flex items-start justify-between gap-3">
                  <span>&quot;{highlight}&quot;</span>
                  {onRemoveHighlight ? (
                    <button
                      type="button"
                      onClick={() => onRemoveHighlight(highlight)}
                      className="shrink-0 rounded-md border border-amber-300 bg-white px-2 py-1 text-xs font-semibold text-amber-950 hover:bg-amber-100"
                    >
                      Remove
                    </button>
                  ) : null}
                </li>
              ))}
            </ul>
          </aside>
        ) : null}
      </div>
    </section>
  );
}
