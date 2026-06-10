import Link from "next/link";
import Image from "next/image";
import { ADVANCED, LEARN, PRACTICE } from "@/lib/curriculum";

const PILLARS = [
  {
    title: "Reused",
    body: "Hundreds of tested models already exist. Most analyses start from another model, not a blank worksheet.",
    color: "var(--layer-reporting)",
  },
  {
    title: "Ordered",
    body: "dbt reads your SQL and builds a dependency graph. Upstream always runs first — nobody schedules anything by hand.",
    color: "var(--layer-staging)",
  },
  {
    title: "Tested",
    body: "Grain, nulls, row counts: assertions run nightly. Bad data is caught by the pipeline, not discovered on a dashboard.",
    color: "var(--layer-modelling)",
  },
  {
    title: "Versioned",
    body: "Every change is a reviewed pull request with history. “Who changed this and why” is always one click away.",
    color: "var(--layer-published)",
  },
];

function TrackCard({
  index,
  href,
  title,
  blurb,
  minutes,
}: {
  index: number;
  href: string;
  title: string;
  blurb: string;
  minutes: number;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-4 rounded-xl border border-line bg-paper px-5 py-4 transition hover:-translate-y-0.5 hover:border-flame hover:shadow-[4px_4px_0_0_var(--color-flame)]"
    >
      <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border-2 border-ink font-display text-sm font-extrabold transition group-hover:border-flame group-hover:bg-flame group-hover:text-white">
        {index}
      </span>
      <span className="min-w-0">
        <span className="flex items-baseline gap-2">
          <span className="font-display text-[15px] font-bold text-ink">{title}</span>
          <span className="font-mono text-[11px] text-ink-faint">~{minutes}m</span>
        </span>
        <span className="block text-sm text-ink-soft">{blurb}</span>
      </span>
    </Link>
  );
}

export default function Home() {
  return (
    <div className="px-4 py-12 sm:px-8">
      {/* hero */}
      <section className="relative mx-auto max-w-4xl">
        <p className="rise font-mono text-xs tracking-wide text-ink-faint">
          WNL Analytics · for SQL analysts new to dbt
        </p>
        <h1 className="rise rise-1 mt-4 max-w-[16ch] font-display text-5xl font-black leading-[1.02] tracking-tighter text-ink sm:text-7xl">
          You already write the{" "}
          <span className="relative whitespace-nowrap text-flame">
            SELECT
            <svg
              viewBox="0 0 220 12"
              className="absolute -bottom-1.5 left-0 w-full"
              aria-hidden
            >
              <path
                d="M3 9 C 60 2, 160 2, 217 7"
                fill="none"
                stroke="var(--flame)"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </span>
          .
        </h1>
        <h2 className="rise rise-2 mt-3 font-display text-2xl font-bold tracking-tight text-ink-soft sm:text-3xl">
          dbt handles everything around it.
        </h2>
        <p className="rise rise-3 mt-6 max-w-[58ch] text-lg leading-relaxed text-ink-soft">
          This is a hands-on course for analysts joining the{" "}
          <a
            href="https://github.com/wnl-icb-analytics/dbt-analytics"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-flame-deep underline decoration-flame/40 underline-offset-2 hover:decoration-flame"
          >
            dbt-analytics
          </a>{" "}
          project. Six short lessons on the ideas, then a guided walkthrough to your
          first merged pull request — real conventions, real commands, real CI.
        </p>
        <div className="rise rise-4 mt-8 flex flex-wrap items-center gap-3">
          <Link
            href={`/learn/${LEARN[0].slug}`}
            className="rounded-xl border-2 border-ink bg-ink px-6 py-3 font-display text-sm font-extrabold uppercase tracking-widest text-paper transition hover:border-flame hover:bg-flame"
          >
            Start lesson one →
          </Link>
          <Link
            href={`/practice/${PRACTICE[0].slug}`}
            className="rounded-xl border-2 border-ink px-6 py-3 font-display text-sm font-extrabold uppercase tracking-widest text-ink transition hover:border-flame hover:text-flame"
          >
            Skip to setup
          </Link>
        </div>
        <Image
          src="/logos/dbt.svg"
          alt=""
          width={340}
          height={340}
          className="pointer-events-none absolute -right-20 -top-10 -z-10 hidden opacity-[0.06] lg:block"
          priority
        />
      </section>

      {/* the case */}
      <section className="mx-auto mt-20 max-w-4xl">
        <h2 className="font-display text-xs font-extrabold uppercase tracking-[0.2em] text-ink-faint">
          Why dbt
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border-2 bg-paper p-5"
              style={{ borderColor: p.color }}
            >
              <h3
                className="font-display text-lg font-extrabold tracking-tight"
                style={{ color: p.color }}
              >
                {p.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{p.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-5 max-w-[64ch] text-[15px] leading-relaxed text-ink-soft">
          The day-to-day barely changes — it is still SQL against Snowflake. What
          changes is the starting point: instead of rebuilding demographics, registers
          and lookups for every piece of work, you join models that already exist, are
          already tested, and refresh themselves every night. The setup in this course
          is a one-off; the everyday loop — edit, build, PR — takes minutes.
        </p>
      </section>

      {/* journey */}
      <section className="mx-auto mt-20 max-w-4xl">
        <h2 className="font-display text-xs font-extrabold uppercase tracking-[0.2em] text-ink-faint">
          Part one · Learn the ideas
        </h2>
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {LEARN.map((l, i) => (
            <TrackCard
              key={l.slug}
              index={i + 1}
              href={`/learn/${l.slug}`}
              title={l.title}
              blurb={l.blurb}
              minutes={l.minutes}
            />
          ))}
        </div>

        <h2 className="mt-12 font-display text-xs font-extrabold uppercase tracking-[0.2em] text-ink-faint">
          Part two · Ship your first PR
        </h2>
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {PRACTICE.map((p, i) => (
            <TrackCard
              key={p.slug}
              index={i + 1}
              href={`/practice/${p.slug}`}
              title={p.title}
              blurb={p.blurb}
              minutes={p.minutes}
            />
          ))}
        </div>

        <h2 className="mt-12 font-display text-xs font-extrabold uppercase tracking-[0.2em] text-ink-faint">
          Part three · Going further
        </h2>
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {ADVANCED.map((a, i) => (
            <TrackCard
              key={a.slug}
              index={i + 1}
              href={`/advanced/${a.slug}`}
              title={a.title}
              blurb={a.blurb}
              minutes={a.minutes}
            />
          ))}
        </div>

        <div className="mt-12 rounded-2xl border-2 border-ink bg-paper-warm p-6 shadow-[5px_5px_0_0_var(--color-ink)]">
          <h2 className="font-display text-lg font-extrabold tracking-tight text-ink">
            Keep handy: the command reference
          </h2>
          <p className="mt-1 max-w-[56ch] text-sm text-ink-soft">
            Every dbt, git and project-helper command from the course in one searchable,
            copy-paste page.
          </p>
          <Link
            href="/reference"
            className="mt-3 inline-block font-display text-sm font-extrabold uppercase tracking-widest text-flame-deep hover:text-flame"
          >
            Open the reference →
          </Link>
        </div>
      </section>
    </div>
  );
}
