"use client";

import { useState } from "react";
import { useInteractionDone } from "@/lib/interaction";

const STAGES = [
  {
    id: "branch",
    label: "1. Your branch",
    verb: "Edit the SQL",
    body: "You change a model file on a git branch. Nothing has run anywhere — it is just text on your machine.",
    touches: "Nothing",
    color: "var(--layer-raw)",
  },
  {
    id: "dev",
    label: "2. Your dev schema",
    verb: "Build and test it",
    body: "dbt build creates the model in a sandbox schema keyed to you. Break it, rebuild it, nobody else notices.",
    touches: "Only your sandbox",
    color: "var(--layer-staging)",
  },
  {
    id: "pr",
    label: "3. The pull request",
    verb: "Checks and review",
    body: "CI compiles the project, runs the tests, and a teammate reads the change before it can go anywhere.",
    touches: "A shared test environment",
    color: "var(--layer-modelling)",
  },
  {
    id: "prod",
    label: "4. Production",
    verb: "Merge, then every night",
    body: "Merging to main deploys the model. From then on the nightly build reruns it — and its tests — without you.",
    touches: "Production, at last",
    color: "var(--layer-reporting)",
  },
] as const;

/** the only path a change can take to production */
export function BranchToProd() {
  const interactionDone = useInteractionDone();
  const [active, setActive] = useState(0);
  const [viewed, setViewed] = useState<number[]>([0]);
  const stage = STAGES[active];

  const view = (i: number) => {
    setActive(i);
    const next = viewed.includes(i) ? viewed : [...viewed, i];
    setViewed(next);
    if (next.length === STAGES.length) interactionDone();
  };

  return (
    <figure className="my-6 overflow-hidden rounded-2xl border-2 border-ink bg-paper shadow-[5px_5px_0_0_var(--color-layer-reporting)]">
      <div className="grid grid-cols-2 sm:grid-cols-4">
        {STAGES.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => view(index)}
            aria-pressed={active === index}
            className={`relative border-b border-r border-line px-3 py-4 text-left transition sm:border-b-0 ${
              active === index ? "bg-ink text-paper" : "bg-paper hover:bg-paper-warm"
            }`}
          >
            <span
              className="block font-display text-[11px] font-extrabold uppercase tracking-[0.14em]"
              style={{ color: active === index ? item.color : "var(--ink-faint)" }}
            >
              {item.label}
            </span>
            <span className="mt-1 block text-sm font-semibold">{item.verb}</span>
            {index < STAGES.length - 1 && (
              <span className="absolute right-[-7px] top-1/2 z-10 hidden -translate-y-1/2 font-mono text-flame sm:block">
                →
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="border-t-2 border-ink px-5 py-4">
        <p className="!my-0 !text-ink">{stage.body}</p>
        <div className="mt-3 rounded-lg border border-line bg-paper-warm px-3 py-2 text-xs">
          <span className="font-display font-bold uppercase tracking-wider text-ink-faint">
            What it touches
          </span>
          <span className="mt-0.5 block text-ink">{stage.touches}</span>
        </div>
      </div>
      <figcaption className="border-t border-line px-4 py-2 text-center font-mono text-[11px] text-ink-faint">
        click a stage · production is only reachable through a merged PR
      </figcaption>
    </figure>
  );
}
