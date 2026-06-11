"use client";

import { useState } from "react";

const VIEWS = [
  {
    label: "after parse",
    files: ["target/", "  manifest.json", "  partial_parse.msgpack", "  perf_info.json"],
    focus: "manifest.json",
    note: "The project map: nodes, tests, configs, dependencies and metadata. No compiled SQL is required.",
  },
  {
    label: "after compile",
    files: ["target/", "  compiled/", "    dbt_analytics/", "      models/.../*.sql", "  manifest.json"],
    focus: "compiled/.../*.sql",
    note: "Your model after Jinja and ref() have been resolved to executable SQL.",
  },
  {
    label: "after build",
    files: ["target/", "  compiled/", "  run/", "  manifest.json", "  run_results.json"],
    focus: "run_results.json",
    note: "The invocation record: status, timing and adapter response for every resource dbt executed.",
  },
] as const;

export function TargetExplorer() {
  const [active, setActive] = useState(0);
  const view = VIEWS[active];

  return (
    <figure className="my-6 overflow-hidden rounded-2xl border-2 border-ink bg-paper shadow-[5px_5px_0_0_var(--color-layer-raw)]">
      <div className="flex flex-wrap gap-1 border-b-2 border-ink bg-paper-warm p-2">
        {VIEWS.map((item, index) => (
          <button
            key={item.label}
            type="button"
            onClick={() => setActive(index)}
            aria-pressed={active === index}
            className={`rounded-lg px-3 py-1.5 font-mono text-[11px] transition ${active === index ? "bg-ink text-paper" : "text-ink-faint hover:bg-paper"}`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="grid sm:grid-cols-[0.9fr_1.1fr]">
        <pre className="overflow-x-auto border-b border-line bg-graphite-deep px-5 py-4 font-mono text-[12px] leading-6 text-white/70 sm:border-b-0 sm:border-r">
          {view.files.map((file) => (
            <span key={file} className={`block ${file.includes(view.focus.split("/").at(-1) ?? "") ? "text-[#7ee2c0]" : ""}`}>
              {file}
            </span>
          ))}
        </pre>
        <div className="p-5">
          <p className="!my-0 font-display text-xs font-extrabold uppercase tracking-[0.16em] text-flame">Look here</p>
          <code className="mt-2 block !whitespace-normal">{view.focus}</code>
          <p className="!mb-0 !mt-3 text-sm">{view.note}</p>
        </div>
      </div>
    </figure>
  );
}
