"use client";

import { useState } from "react";

export function ModelJourney() {
  const [built, setBuilt] = useState(false);

  return (
    <figure className="my-6 overflow-hidden rounded-2xl border-2 border-ink bg-paper shadow-[5px_5px_0_0_var(--color-layer-staging)]">
      <div className="grid gap-3 p-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <div className="rounded-xl bg-graphite-deep p-4 font-mono text-[12px] leading-6 text-[#e8eaf2]">
          <span className="text-white/40">models/staging/stg_people.sql</span>
          <div className="mt-2">
            <span className="text-[#ff9a82]">select</span> person_id, postcode
            <br />
            <span className="text-[#ff9a82]">from</span>{" "}
            <span className="text-[#7ee2c0]">{"{{ ref('raw_people') }}"}</span>
          </div>
        </div>

        <div className="text-center font-mono text-xl text-flame sm:rotate-0">→</div>

        <div
          className={`rounded-xl border-2 p-4 text-center transition-all duration-300 ${
            built
              ? "border-layer-staging bg-layer-staging/10 opacity-100"
              : "border-dashed border-line bg-paper-warm opacity-45"
          }`}
        >
          <span className="font-display text-[10px] font-extrabold uppercase tracking-[0.16em] text-ink-faint">
            Snowflake view
          </span>
          <code className="mt-2 block !whitespace-normal !border-0 !bg-transparent !p-0 text-[12px] text-ink">
            MODELLING.DBT_STAGING.STG_PEOPLE
          </code>
          <span className="mt-2 block text-xs text-ink-soft">
            {built ? "created from your SELECT" : "not built yet"}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t-2 border-ink bg-paper-warm px-4 py-3">
        <p className="!my-0 text-sm !text-ink-soft">
          {built ? "dbt supplied the CREATE VIEW and destination." : "Your file only describes the rows."}
        </p>
        <button
          type="button"
          onClick={() => setBuilt((value) => !value)}
          className="shrink-0 rounded-lg border-2 border-ink bg-ink px-3 py-1.5 font-display text-xs font-extrabold uppercase tracking-wider text-paper transition hover:border-flame hover:bg-flame"
        >
          {built ? "Reset" : "Build it"}
        </button>
      </div>
    </figure>
  );
}
