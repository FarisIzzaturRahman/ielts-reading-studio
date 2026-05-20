import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-700 font-semibold text-white">
            IR
          </span>
          <span>
            <span className="block text-base font-semibold text-slate-950">IELTS Reading Studio</span>
            <span className="block text-xs text-slate-500">Mini academic simulations</span>
          </span>
        </Link>
        <nav aria-label="Main navigation" className="flex items-center gap-1 text-sm font-medium">
          <Link className="rounded-md px-3 py-2 text-slate-700 hover:bg-slate-100" href="/tests">
            Tests
          </Link>
          <Link className="rounded-md px-3 py-2 text-slate-700 hover:bg-slate-100" href="/practice">
            Practice
          </Link>
          <Link className="rounded-md px-3 py-2 text-slate-700 hover:bg-slate-100" href="/about">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
