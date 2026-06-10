"use client";

import { useState } from "react";

const JOBS = [
  {
    id: "staging",
    label: "Clean one source table — renames, casts, no joins",
    layer: "staging",
    prefix: "stg_",
  },
  {
    id: "modelling",
    label: "Join or derive — a reusable building block",
    layer: "modelling",
    prefix: "int_",
  },
  {
    id: "reporting",
    label: "Assemble an analyst-facing dataset",
    layer: "reporting",
    prefix: "dim_ or fct_",
  },
  {
    id: "published",
    label: "Feed a dashboard or external consumer",
    layer: "published",
    prefix: "(domain name)",
  },
] as const;

const DOMAINS = [
  {
    id: "commissioning",
    label: "Secondary care / commissioning",
    detail: "SUS, waiting lists, eRS referrals, prescribing, community & mental health",
  },
  {
    id: "olids",
    label: "Primary care (OLIDS)",
    detail: "GP records: observations, diagnoses, appointments, registers",
  },
  {
    id: "shared",
    label: "Shared reference",
    detail: "Lookups used across domains: geography, deprivation, organisations",
  },
] as const;

export function FolderPicker() {
  const [job, setJob] = useState<(typeof JOBS)[number] | null>(null);
  const [domain, setDomain] = useState<(typeof DOMAINS)[number] | null>(null);

  const path =
    job && domain
      ? job.layer === "published"
        ? `models/published/{direct_care | secondary_use}/${domain.id}/`
        : `models/${job.layer}/${domain.id}/`
      : null;

  return (
    <div className="my-6 rounded-2xl border-2 border-ink bg-paper p-5 shadow-[4px_4px_0_0_var(--color-layer-modelling)]">
      <p className="!my-0 font-display text-[11px] font-extrabold uppercase tracking-[0.18em] text-layer-modelling">
        Where does my model go?
      </p>

      <p className="!mb-1.5 !mt-3 text-sm font-medium !text-ink">
        1 · What job is the model doing?
      </p>
      <div className="flex flex-col gap-1.5">
        {JOBS.map((j) => (
          <button
            key={j.id}
            type="button"
            onClick={() => setJob(j)}
            className={`rounded-lg border px-3.5 py-2 text-left text-sm transition ${
              job?.id === j.id
                ? "border-flame bg-flame-soft text-ink"
                : "border-line text-ink-soft hover:border-flame"
            }`}
          >
            {j.label}
          </button>
        ))}
      </div>

      <p className="!mb-1.5 !mt-4 text-sm font-medium !text-ink">
        2 · What data is it about?
      </p>
      <div className="flex flex-col gap-1.5">
        {DOMAINS.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setDomain(d)}
            className={`rounded-lg border px-3.5 py-2 text-left text-sm transition ${
              domain?.id === d.id
                ? "border-flame bg-flame-soft text-ink"
                : "border-line text-ink-soft hover:border-flame"
            }`}
          >
            <span className="block font-medium">{d.label}</span>
            <span className="text-xs text-ink-faint">{d.detail}</span>
          </button>
        ))}
      </div>

      {path && (
        <div className="rise mt-4 rounded-xl bg-graphite-deep px-4 py-3">
          <p className="!my-0 font-mono text-[11px] text-white/50">your model lives in</p>
          <p className="!my-0 break-all font-mono text-sm text-[#7ee2c0]">{path}</p>
          <p className="!mb-0 !mt-1.5 font-mono text-xs text-white/70">
            file name starts with <span className="text-[#ff9a82]">{job!.prefix}</span>
          </p>
          {domain!.id === "olids" && job!.layer !== "staging" && (
            <p className="!mb-0 !mt-1.5 text-xs text-white/60">
              OLIDS adds one more level: a topic subfolder (diagnoses, observations,
              programme…) — and that folder name becomes the Snowflake schema
              automatically.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
