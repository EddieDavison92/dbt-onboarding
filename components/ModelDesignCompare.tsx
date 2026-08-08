"use client";

import { useState } from "react";
import { useInteractionDone } from "@/lib/interaction";

type View = "combined" | "composed";

const CONCEPTS = [
  { name: "diabetes register", colour: "border-layer-staging text-layer-staging" },
  { name: "latest HbA1c", colour: "border-layer-modelling text-layer-modelling" },
  { name: "latest blood pressure", colour: "border-layer-reporting text-layer-reporting" },
  { name: "latest urine ACR", colour: "border-layer-semantic text-layer-semantic" },
  { name: "foot examination", colour: "border-layer-published text-layer-published" },
] as const;

export function ModelDesignCompare() {
  const interactionDone = useInteractionDone();
  const [view, setView] = useState<View>("combined");

  const select = (next: View) => {
    setView(next);
    if (next === "composed") interactionDone();
  };

  return (
    <figure className="my-6 overflow-hidden rounded-2xl border-2 border-ink bg-paper shadow-[5px_5px_0_0_var(--color-layer-modelling)]">
      <header className="border-b-2 border-ink bg-paper-warm px-5 py-3">
        <p className="!my-0 font-display text-[10px] font-extrabold uppercase tracking-[0.18em] !text-layer-modelling">
          Definition and delivery
        </p>
        <p className="!mb-0 !mt-1 text-[15px] font-medium !text-ink">
          The analyst receives the same wide row in both designs. What changes is
          where its definitions are owned.
        </p>
      </header>

      <div className="grid grid-cols-2 border-b-2 border-ink">
        <button
          type="button"
          aria-pressed={view === "combined"}
          onClick={() => select("combined")}
          className={`border-r border-line px-3 py-2.5 text-left font-display text-[11px] font-extrabold uppercase tracking-[0.12em] transition ${
            view === "combined"
              ? "bg-ink text-paper"
              : "bg-paper text-ink-soft hover:bg-paper-warm"
          }`}
        >
          1. Define everything here
        </button>
        <button
          type="button"
          aria-pressed={view === "composed"}
          onClick={() => select("composed")}
          className={`px-3 py-2.5 text-left font-display text-[11px] font-extrabold uppercase tracking-[0.12em] transition ${
            view === "composed"
              ? "bg-ink text-paper"
              : "bg-paper text-ink-soft hover:bg-paper-warm"
          }`}
        >
          2. Compose owned definitions
        </button>
      </div>

      <div className="min-h-[270px] bg-graphite-deep p-5 sm:p-6">
        {view === "combined" ? (
          <div className="rise mx-auto max-w-lg rounded-xl border-2 border-layer-reporting bg-white/[0.04] p-5">
            <p className="!my-0 font-mono text-[11px] uppercase tracking-wider !text-white/45">
              hypothetical · one model defines and delivers
            </p>
            <p className="!mb-0 !mt-1 font-mono text-sm !text-white">
              fct_diabetes_dashboard
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {CONCEPTS.map((concept) => (
                <span
                  key={concept.name}
                  className={`rounded-full border bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] ${concept.colour}`}
                >
                  defines {concept.name}
                </span>
              ))}
            </div>
            <div className="mt-5 border-t border-white/10 pt-3 font-mono text-[11px] leading-relaxed text-[#ffb3a3]">
              A change to any definition means reopening and retesting the same
              transformation.
            </div>
          </div>
        ) : (
          <div className="rise grid items-center gap-5 md:grid-cols-[1fr_auto_1.15fr]">
            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-1">
              {CONCEPTS.map((concept, index) => (
                <div
                  key={concept.name}
                  className={`rounded-lg border bg-white/[0.03] px-3 py-2 ${concept.colour}`}
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <p className="!my-0 font-mono text-[10px] uppercase tracking-wider !text-white/35">
                    defined and tested
                  </p>
                  <p className="!my-0 font-mono text-[12px] !text-white">
                    {concept.name}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center font-display text-2xl font-black text-flame md:rotate-0">
              <span className="md:hidden">↓</span>
              <span className="hidden md:inline">→</span>
            </div>

            <div className="rounded-xl border-2 border-layer-reporting bg-white/[0.05] p-5">
              <p className="!my-0 font-mono text-[11px] uppercase tracking-wider !text-white/45">
                one model composes and delivers
              </p>
              <p className="!mb-0 !mt-1 font-mono text-sm !text-white">
                fct_person_diabetes_8_care_processes
              </p>
              <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 font-mono text-[11px] leading-relaxed text-[#7ee2c0]">
                Same convenient row for analysts; clearer ownership for developers.
              </div>
            </div>
          </div>
        )}
      </div>

      <figcaption className="border-t-2 border-ink bg-paper px-5 py-3 text-sm text-ink-soft">
        {view === "combined" ? (
          <>
            The width is not the problem. The model is also the only home of several
            independently changing definitions. Select the second design to separate
            ownership from delivery.
          </>
        ) : (
          <>
            Definitions have clear homes, but consumers still receive a wide,
            denormalised analytical model. <strong className="text-ink">Separation in the
            DAG does not require inconvenience at the point of use.</strong>
          </>
        )}
      </figcaption>
    </figure>
  );
}
