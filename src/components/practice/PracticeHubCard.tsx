import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function PracticeHubCard({
  title,
  description,
  meta,
  href,
}: {
  title: string;
  description: string;
  meta: string[];
  href: string;
}) {
  return (
    <article className="rounded-md border border-slate-200 bg-white p-5">
      <h3 className="text-lg font-semibold tracking-tight text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {meta.map((item) => (
          <span key={item} className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
            {item}
          </span>
        ))}
      </div>
      <Link
        href={href}
        className="mt-5 inline-flex items-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
      >
        Start practice
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </article>
  );
}
