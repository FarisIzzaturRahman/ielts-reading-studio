import { Clock } from "lucide-react";
import { formatDuration } from "@/lib/scoring";

export function Timer({ seconds }: { seconds: number }) {
  const isOneMinuteWarning = seconds <= 60;
  const isWarning = seconds <= 300;
  const label = isOneMinuteWarning ? "1 minute remaining" : isWarning ? "5 minutes remaining" : "Time remaining";

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold ${
        isOneMinuteWarning
          ? "border-rose-300 bg-rose-50 text-rose-900"
          : isWarning
          ? "border-amber-300 bg-amber-50 text-amber-900"
          : "border-slate-200 bg-white text-slate-800"
      }`}
      aria-live={isWarning ? "polite" : "off"}
    >
      <Clock aria-hidden="true" className="h-4 w-4" />
      <span className="sr-only">{label}: </span>
      <span>{formatDuration(seconds)}</span>
      {isWarning ? <span className="text-xs font-medium">{isOneMinuteWarning ? "1 min left" : "5 min left"}</span> : null}
    </div>
  );
}
