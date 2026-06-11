"use client";

import { useState } from "react";

const COMMANDS = [
  {
    command: "dbt run -s int_waiting_list",
    label: "run",
    selects: "Models",
    does: "Materialises selected models in DAG order.",
    doesNot: "Does not run their data tests.",
    color: "var(--layer-staging)",
  },
  {
    command: "dbt test -s int_waiting_list",
    label: "test",
    selects: "Data and unit tests",
    does: "Executes tests associated with the selection.",
    doesNot: "Expects the model or source relation to exist already.",
    color: "var(--layer-published)",
  },
  {
    command: "dbt build -s int_waiting_list",
    label: "build",
    selects: "Models plus attached tests",
    does: "Builds and tests selected resources in DAG order.",
    doesNot: "A failing upstream test can skip downstream nodes.",
    color: "var(--flame)",
  },
  {
    command: "dbt show -s int_waiting_list",
    label: "show",
    selects: "One node",
    does: "Compiles it, runs its query and previews rows.",
    doesNot: "Does not materialise the model as a table or view.",
    color: "var(--layer-modelling)",
  },
] as const;

export function CommandChooser() {
  const [active, setActive] = useState(2);
  const item = COMMANDS[active];

  return (
    <figure className="my-6 overflow-hidden rounded-2xl border border-line bg-paper-warm/50">
      <div className="flex flex-wrap gap-2 border-b border-line p-3">
        {COMMANDS.map((command, index) => (
          <button
            key={command.label}
            type="button"
            onClick={() => setActive(index)}
            aria-pressed={active === index}
            className={`rounded-full border-2 px-3 py-1 font-mono text-xs transition ${
              active === index ? "border-ink bg-ink text-paper" : "border-line bg-paper text-ink-soft hover:border-flame"
            }`}
          >
            dbt {command.label}
          </button>
        ))}
      </div>
      <div className="grid gap-4 p-5 sm:grid-cols-[1.1fr_1fr]">
        <div className="rounded-xl bg-graphite-deep p-4 font-mono text-[13px] text-[#e8eaf2]">
          <span className="text-[#7ee2c0]">$ </span>{item.command}
          <div className="mt-4 border-t border-white/10 pt-3 text-xs text-white/60">
            resource scope
            <strong className="mt-1 block text-sm font-normal text-white">{item.selects}</strong>
          </div>
        </div>
        <div>
          <p className="!my-0 text-sm !text-ink-soft"><strong>It does:</strong> {item.does}</p>
          <p className="!mb-0 !mt-3 text-sm !text-ink-soft"><strong>Boundary:</strong> {item.doesNot}</p>
          <div className="mt-4 h-1.5 rounded-full" style={{ background: item.color }} />
        </div>
      </div>
      <figcaption className="border-t border-line px-4 py-2 text-center font-mono text-[11px] text-ink-faint">
        same selector, different verb, different work
      </figcaption>
    </figure>
  );
}
