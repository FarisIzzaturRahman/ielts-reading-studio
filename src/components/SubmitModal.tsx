"use client";

import { useEffect, useRef } from "react";

export function SubmitModal({
  answered,
  unanswered,
  flagged,
  onCancel,
  onConfirm,
  title = "Submit this test?",
  completeMessage = "All questions have an answer. Submit now to see your score and explanations.",
  incompleteMessage,
  warning = "Submission is final for this attempt. You can retake the test later from the instructions page.",
  cancelLabel = "Return to test",
  confirmLabel = "Final submission",
}: {
  answered: number;
  unanswered: number;
  flagged: number;
  onCancel: () => void;
  onConfirm: () => void;
  title?: string;
  completeMessage?: string;
  incompleteMessage?: string;
  warning?: string;
  cancelLabel?: string;
  confirmLabel?: string;
}) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelButtonRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onCancel();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="submit-modal-title"
      aria-describedby="submit-modal-description"
    >
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 id="submit-modal-title" className="text-xl font-semibold tracking-tight text-slate-950">
          {title}
        </h2>
        <p id="submit-modal-description" className="mt-3 text-sm leading-6 text-slate-600">
          {unanswered > 0
            ? incompleteMessage ??
              `You still have ${unanswered} unanswered question${unanswered === 1 ? "" : "s"}. You can return and continue, or submit now for scoring.`
            : completeMessage}
        </p>
        <dl className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
          <div className="rounded-md bg-slate-50 p-3">
            <dt className="text-slate-500">Answered</dt>
            <dd className="mt-1 font-semibold text-slate-950">{answered}</dd>
          </div>
          <div className="rounded-md bg-slate-50 p-3">
            <dt className="text-slate-500">Unanswered</dt>
            <dd className="mt-1 font-semibold text-slate-950">{unanswered}</dd>
          </div>
          <div className="rounded-md bg-slate-50 p-3">
            <dt className="text-slate-500">Flagged</dt>
            <dd className="mt-1 font-semibold text-slate-950">{flagged}</dd>
          </div>
        </dl>
        <p className="mt-4 rounded-md bg-amber-50 px-3 py-2 text-sm font-medium text-amber-900">
          {warning}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            ref={cancelButtonRef}
            onClick={onCancel}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
