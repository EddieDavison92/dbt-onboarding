"use client";

import { useState } from "react";
import { useInteractionDone } from "@/lib/interaction";

/** Steppable: what a nightly test failure does — and does not do — to the DAG. */

const PHASES = [
  {
    label: "2 am — the nightly build begins",
    caption:
      "The feed started sending duplicate rows this evening. Nobody knows yet. The build reaches stg_people.",
  },
  {
    label: "stg_people rebuilds",
    caption:
      "Build first: the table is recreated from tonight's feed — duplicates included. The bad rows are now in stg_people.",
  },
  {
    label: "…then its test runs — FAIL",
    caption:
      "The grain test hunts for duplicates and finds 14. The model stays as built; dbt does not roll it back.",
  },
  {
    label: "dbt stops the spread",
    caption:
      "dim_people is skipped, so it keeps yesterday's good version. The dashboard shows stale — not wrong — numbers, and the team wakes up to a red build naming the exact test.",
  },
] as const;

export function TestFailFlow() {
  const done = useInteractionDone();
  const [phase, setPhase] = useState(0);
  const last = phase === PHASES.length - 1;

  const advance = () => {
    if (last) {
      setPhase(0);
      return;
    }
    const next = phase + 1;
    setPhase(next);
    if (next === PHASES.length - 1) done();
  };

  const stgBuilt = phase >= 1;
  const testFailed = phase >= 2;
  const spread = phase >= 3;

  return (
    <figure className="my-6 overflow-hidden rounded-2xl border-2 border-ink bg-paper shadow-[5px_5px_0_0_var(--color-layer-modelling)]">
      <header className="flex items-center justify-between gap-3 border-b-2 border-ink bg-paper-warm px-4 py-3">
        <p className="!my-0 font-display text-[10px] font-extrabold uppercase tracking-[0.18em] !text-flame">
          One bad night · {phase + 1}/{PHASES.length}
        </p>
        <button
          type="button"
          onClick={advance}
          className="rounded-lg border-2 border-ink bg-ink px-3 py-1.5 font-display text-xs font-extrabold uppercase tracking-wider text-paper transition hover:border-flame hover:bg-flame"
        >
          {last ? "↺ Replay" : "Next →"}
        </button>
      </header>

      <div className="p-4 sm:p-5">
        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-1">
          {/* stg_people + its test */}
          <div className="min-w-0 sm:flex-1">
            <div
              className={`rounded-xl border-2 p-3 text-center transition-all duration-300 ${
                stgBuilt
                  ? testFailed
                    ? "border-flame bg-flame-soft"
                    : "border-layer-staging bg-layer-staging/10"
                  : "border-line bg-paper"
              }`}
            >
              <code className="block !whitespace-normal !border-0 !bg-transparent !p-0 text-[11px] font-bold">
                stg_people
              </code>
              <span className="mt-1 block font-display text-[9px] font-bold uppercase tracking-wider text-ink-soft">
                {testFailed
                  ? "updated · contains the bad rows"
                  : stgBuilt
                    ? "rebuilt from tonight's feed"
                    : "waiting"}
              </span>
            </div>
            <div className="mx-auto h-3 w-px bg-line" />
            <div
              className={`rounded-lg border px-2 py-1.5 text-center text-[10px] transition-all duration-300 ${
                testFailed
                  ? "border-flame bg-flame-soft text-flame-deep"
                  : "border-dashed border-line text-ink-faint"
              }`}
            >
              <span className="font-mono">unique person_id</span>
              <span className="ml-1 font-display font-bold uppercase tracking-wide">
                · {testFailed ? "FAIL — 14 rows" : "waiting"}
              </span>
            </div>
          </div>

          <span
            className={`mx-auto my-1 h-5 border-l-2 sm:mx-1.5 sm:my-0 sm:h-0 sm:w-5 sm:border-l-0 sm:border-t-2 ${
              spread ? "border-dashed border-line" : "border-line"
            }`}
            aria-hidden
          />

          {/* dim_people */}
          <div
            className={`min-w-0 rounded-xl border-2 p-3 text-center transition-all duration-300 sm:flex-1 ${
              spread ? "border-line bg-paper-warm opacity-60" : "border-line bg-paper"
            }`}
          >
            <code className="block !whitespace-normal !border-0 !bg-transparent !p-0 text-[11px] font-bold">
              dim_people
            </code>
            <span className="mt-1 block font-display text-[9px] font-bold uppercase tracking-wider text-ink-soft">
              {spread ? "skipped · keeps yesterday's version" : "waiting"}
            </span>
          </div>

          <span
            className={`mx-auto my-1 h-5 border-l-2 sm:mx-1.5 sm:my-0 sm:h-0 sm:w-5 sm:border-l-0 sm:border-t-2 ${
              spread ? "border-dashed border-line" : "border-line"
            }`}
            aria-hidden
          />

          {/* the consumer */}
          <div
            className={`min-w-0 rounded-full border-2 px-3 py-2.5 text-center transition-all duration-300 sm:flex-1 ${
              spread ? "border-layer-staging bg-layer-staging/10" : "border-dashed border-line"
            }`}
          >
            <span className="block font-display text-[11px] font-extrabold text-ink">
              dashboard
            </span>
            <span className="mt-0.5 block font-display text-[9px] font-bold uppercase tracking-wider text-ink-soft">
              {spread ? "stale, but never wrong" : "reads dim_people"}
            </span>
          </div>
        </div>
      </div>

      <figcaption className="border-t-2 border-ink bg-paper-warm px-4 py-3 text-sm text-ink-soft">
        <strong className="text-ink">{PHASES[phase].label}.</strong>{" "}
        {PHASES[phase].caption}
      </figcaption>
    </figure>
  );
}
