"use client";

import { useState } from "react";

type NodeId = "source" | "raw" | "stg" | "int" | "fct" | "dash";

const NODES: { id: NodeId; label: string; sub: string }[] = [
  { id: "source", label: "source:wl.open", sub: "source" },
  { id: "raw", label: "raw_wl_open", sub: "raw" },
  { id: "stg", label: "stg_wl_open", sub: "staging" },
  { id: "int", label: "int_current_waits", sub: "modelling" },
  { id: "fct", label: "fct_waiting_list", sub: "reporting" },
  { id: "dash", label: "weekly_waits", sub: "exposure" },
];

const EXAMPLES: { selector: string; title: string; selected: NodeId[]; note: string }[] = [
  { selector: "int_current_waits", title: "the node only", selected: ["int"], note: "A plain name selects the matching resource." },
  { selector: "+int_current_waits", title: "ancestors", selected: ["source", "raw", "stg", "int"], note: "+ before the name walks upstream." },
  { selector: "int_current_waits+", title: "descendants", selected: ["int", "fct", "dash"], note: "+ after the name walks downstream." },
  { selector: "+int_current_waits+", title: "both directions", selected: ["source", "raw", "stg", "int", "fct", "dash"], note: "+ on both sides selects the connected slice." },
];

export function SelectorPlayground() {
  const [active, setActive] = useState(1);
  const example = EXAMPLES[active];
  const selected = new Set(example.selected);

  return (
    <figure className="my-6 overflow-hidden rounded-2xl border-2 border-ink bg-paper shadow-[5px_5px_0_0_var(--color-flame)]">
      <div className="border-b-2 border-ink bg-paper-warm p-3">
        <p className="!my-0 font-display text-[11px] font-extrabold uppercase tracking-[0.18em] !text-ink-faint">Try a selector</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {EXAMPLES.map((item, index) => (
            <button
              key={item.selector}
              type="button"
              onClick={() => setActive(index)}
              aria-pressed={active === index}
              className={`rounded-lg border px-2.5 py-1 font-mono text-[11px] transition ${active === index ? "border-ink bg-ink text-paper" : "border-line bg-paper text-ink-soft hover:border-flame"}`}
            >
              {item.selector}
            </button>
          ))}
        </div>
      </div>
      <div className="p-5">
        <div className="flex flex-col items-center sm:min-w-[610px] sm:flex-row">
          {NODES.map((node, index) => (
            <div key={node.id} className="flex flex-col items-center sm:flex-1 sm:flex-row sm:last:flex-none">
              <div
                className={`w-[90px] rounded-xl border-2 px-2 py-2 text-center transition ${selected.has(node.id) ? "border-flame bg-flame-soft" : "border-line bg-paper opacity-35"}`}
              >
                <span className="block break-words font-mono text-[10px] leading-tight text-ink">{node.label}</span>
                <span className="mt-1 block font-display text-[9px] font-bold uppercase tracking-wider text-ink-faint">{node.sub}</span>
              </div>
              {index < NODES.length - 1 && (
                <span className={`my-1 h-5 border-l-2 sm:mx-1 sm:my-0 sm:h-0 sm:flex-1 sm:border-l-0 sm:border-t-2 ${selected.has(node.id) && selected.has(NODES[index + 1].id) ? "border-flame" : "border-line"}`} />
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="grid border-t border-line sm:grid-cols-[1fr_1.2fr]">
        <div className="bg-graphite-deep px-4 py-3 font-mono text-[12px] text-[#e8eaf2]">
          <span className="text-[#7ee2c0]">$ </span>dbt ls -s &quot;{example.selector}&quot;
          <div className="mt-2 text-white/55">{example.selected.map((id) => NODES.find((node) => node.id === id)?.label).join("\n")}</div>
        </div>
        <div className="px-4 py-3">
          <strong className="font-display text-sm text-ink">{example.title}</strong>
          <p className="!mb-0 !mt-1 text-sm">{example.note}</p>
        </div>
      </div>
      <figcaption className="border-t border-line px-4 py-2 text-center font-mono text-[11px] text-ink-faint">
        selection decides the nodes; the command decides what happens to them
      </figcaption>
    </figure>
  );
}
