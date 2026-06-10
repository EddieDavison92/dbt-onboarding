import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/logos/dbt.svg" alt="" width={26} height={26} priority />
          <span className="font-display text-[17px] font-extrabold tracking-tight">
            dbt onboarding
          </span>
          <span className="hidden rounded-full border border-line bg-paper-warm px-2 py-0.5 font-mono text-[10px] text-ink-faint sm:inline">
            WNL Analytics
          </span>
        </Link>
        <span
          className="ml-auto hidden rounded-full border border-flame/30 bg-flame-soft px-2.5 py-0.5 font-mono text-[10px] text-flame-deep md:inline"
          title="A community onboarding guide. dbt is a trademark of dbt Labs, Inc."
        >
          not an official dbt Labs product
        </span>
        <a
          href="https://github.com/wnl-icb-analytics/dbt-analytics"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-line px-3 py-1.5 font-mono text-xs text-ink-soft transition hover:border-ink hover:text-ink"
        >
          dbt-analytics ↗
        </a>
      </div>
    </header>
  );
}
