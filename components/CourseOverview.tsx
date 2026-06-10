"use client";

import { useState } from "react";
import Link from "next/link";
import { useProgress } from "@/lib/progress";

type LessonSummary = {
  slug: string;
  title: string;
  blurb: string;
  minutes: number;
  stepCount: number;
};

export function CourseOverview({
  slug,
  title,
  tagline,
  audience,
  hours,
  accent,
  lessons,
}: {
  slug: string;
  title: string;
  tagline: string;
  audience: string;
  hours: string;
  accent: string;
  lessons: LessonSummary[];
}) {
  const { ready, name, setName, isDone } = useProgress();
  const [draft, setDraft] = useState("");

  const doneCount = ready
    ? lessons.filter((l) => isDone(`course/${slug}/${l.slug}`)).length
    : 0;
  const allDone = doneCount === lessons.length;
  const firstIncomplete =
    lessons.find((l) => !isDone(`course/${slug}/${l.slug}`)) ?? lessons[0];
  const started = doneCount > 0;
  const hasName = ready && name.trim().length > 0;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <header className="border-b-2 border-ink pb-6">
        <p
          className="font-display text-xs font-extrabold uppercase tracking-[0.2em]"
          style={{ color: accent }}
        >
          Course · {hours}
        </p>
        <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-ink">
          {title}
        </h1>
        <p className="mt-2 text-lg leading-relaxed text-ink-soft">{tagline}</p>
        <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-ink-faint">
          {audience}
        </p>
      </header>

      {ready && !hasName && (
        <form
          className="mt-6 rounded-2xl border-2 border-ink bg-paper-warm p-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (draft.trim()) setName(draft.trim());
          }}
        >
          <label
            htmlFor="learner-name"
            className="font-display text-sm font-extrabold uppercase tracking-widest text-ink"
          >
            First, your name
          </label>
          <p className="mt-1 text-sm text-ink-soft">
            It appears on your certificate when you finish (stored only in this
            browser — nothing is sent anywhere).
          </p>
          <div className="mt-3 flex gap-2">
            <input
              id="learner-name"
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Your name"
              className="min-w-0 flex-1 rounded-xl border-2 border-ink bg-paper px-4 py-2.5 text-sm outline-none placeholder:text-ink-faint focus:border-flame"
            />
            <button
              type="submit"
              disabled={!draft.trim()}
              className="rounded-xl border-2 border-ink bg-ink px-5 py-2.5 font-display text-sm font-extrabold uppercase tracking-widest text-paper transition enabled:hover:border-flame enabled:hover:bg-flame disabled:opacity-40"
            >
              Save
            </button>
          </div>
        </form>
      )}

      {hasName && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-ink-soft">
            Learner: <strong className="text-ink">{name}</strong>
            <button
              type="button"
              onClick={() => {
                setDraft(name);
                setName("");
              }}
              className="ml-2 font-mono text-xs text-ink-faint underline-offset-2 hover:text-flame-deep hover:underline"
            >
              change
            </button>
            <span className="ml-3 font-mono text-xs text-ink-faint">
              {doneCount}/{lessons.length} lessons
            </span>
          </p>
          {allDone ? (
            <Link
              href={`/courses/${slug}/certificate`}
              className="rounded-xl border-2 border-layer-staging bg-layer-staging px-5 py-2.5 font-display text-sm font-extrabold uppercase tracking-widest text-white transition hover:opacity-90"
            >
              View your certificate →
            </Link>
          ) : (
            <Link
              href={`/courses/${slug}/${firstIncomplete.slug}`}
              className="rounded-xl border-2 border-ink bg-ink px-5 py-2.5 font-display text-sm font-extrabold uppercase tracking-widest text-paper transition hover:border-flame hover:bg-flame"
            >
              {started ? "Continue →" : "Start the course →"}
            </Link>
          )}
        </div>
      )}

      <ol className="mt-6 flex flex-col gap-2">
        {lessons.map((l, i) => {
          const done = ready && isDone(`course/${slug}/${l.slug}`);
          const locked = !hasName;
          return (
            <li key={l.slug}>
              <Link
                href={locked ? "#" : `/courses/${slug}/${l.slug}`}
                aria-disabled={locked}
                onClick={(e) => locked && e.preventDefault()}
                className={`flex items-start gap-4 rounded-xl border px-5 py-4 transition ${
                  locked
                    ? "cursor-not-allowed border-line opacity-60"
                    : "border-line hover:border-flame hover:shadow-[3px_3px_0_0_var(--color-flame)]"
                }`}
              >
                <span
                  className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border-2 font-display text-sm font-extrabold ${
                    done
                      ? "border-layer-staging bg-layer-staging text-white"
                      : "border-ink text-ink"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </span>
                <span className="min-w-0">
                  <span className="flex flex-wrap items-baseline gap-2">
                    <span className="font-display text-[15px] font-bold text-ink">
                      {l.title}
                    </span>
                    <span className="font-mono text-[11px] text-ink-faint">
                      {l.stepCount} steps · ~{l.minutes}m
                    </span>
                  </span>
                  <span className="block text-sm text-ink-soft">{l.blurb}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>

      <p className="mt-8 text-center">
        <Link
          href="/"
          className="font-mono text-xs text-ink-faint underline-offset-2 hover:text-ink hover:underline"
        >
          ← all courses
        </Link>
      </p>
    </div>
  );
}
