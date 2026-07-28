"use client";

import { useMemo, useState } from "react";
import { useInteractionDone } from "@/lib/interaction";

/** Real model names from dbt-analytics, curated to make the searches interesting. */
const MODELS = [
  "raw_olids_observation",
  "stg_olids_observation",
  "stg_olids_patient",
  "stg_olids_appointment",
  "stg_olids_medication_order",
  "int_hba1c_all",
  "int_hba1c_latest",
  "int_blood_pressure_all",
  "int_blood_pressure_latest",
  "int_smoking_status_all",
  "int_smoking_status_latest",
  "int_bmi_all",
  "int_bmi_latest",
  "int_egfr_all",
  "int_egfr_latest",
  "int_cholesterol_all",
  "int_cholesterol_latest",
  "int_diabetes_diagnoses_all",
  "int_asthma_diagnoses_all",
  "int_statin_medications_all",
  "int_ace_inhibitor_medications_all",
  "int_antidepressant_medications_all",
  "dim_person",
  "dim_person_age",
  "dim_person_birth_death",
  "dim_person_care_home",
  "dim_person_conditions",
  "dim_person_current_practice",
  "dim_person_demographics",
  "dim_person_ethnicity",
  "dim_person_gender",
  "dim_person_housebound_status",
  "dim_person_is_carer",
  "dim_person_main_language",
  "dim_person_residence",
  "dim_practice",
  "dim_practice_neighbourhood",
  "dim_pcn",
  "dim_households",
  "fct_person_diabetes_register",
  "fct_person_asthma_register",
  "fct_person_copd_register",
  "fct_person_ckd_register",
  "fct_person_dementia_register",
  "fct_person_depression_register",
  "fct_person_hypertension_register",
  "fct_person_atrial_fibrillation_register",
  "fct_person_frailty_register",
  "fct_person_smi_register",
  "fct_bowel_screening_status",
  "fct_cervical_screening_status",
  "pit_diabetes_register",
  "pit_asthma_register",
  "dq_hba1c_issues",
];

type Task = {
  prompt: string;
  answer: string;
  /** targeted feedback for near-miss picks */
  near: Record<string, string>;
  /** shown once the right model is found */
  explain: string;
};

const TASKS: Task[] = [
  {
    prompt: "Your analysis needs each person's most recent HbA1c result.",
    answer: "int_hba1c_latest",
    near: {
      int_hba1c_all:
        "int_hba1c_all is every HbA1c ever recorded — one row per test, many per person. The suffix you want is _latest.",
      dq_hba1c_issues:
        "dq_ models list data-quality problems, not results. You want the modelling-layer block: int_hba1c_latest.",
    },
    explain:
      "_latest means one row per person; _all means one row per test. And you found it by typing the concept — nobody had to tell you it existed.",
  },
  {
    prompt:
      "You're starting a diabetes project. First question: does a diabetes register already exist?",
    answer: "fct_person_diabetes_register",
    near: {
      pit_diabetes_register:
        "pit_ is the point-in-time variant for retrospective reporting. The register itself is fct_person_diabetes_register.",
      int_diabetes_diagnoses_all:
        "Those are the raw diagnosis events the register is built from. Registers follow fct_person_{condition}_register.",
    },
    explain:
      "Every disease register is named fct_person_{condition}_register — type “register” and you can enumerate all forty-plus of them.",
  },
  {
    prompt: "You need each person's ethnicity.",
    answer: "dim_person_ethnicity",
    near: {
      dim_person_demographics:
        "That would work — ethnicity is one of its columns — but there's a dedicated block. Keep the search narrower.",
      dim_person:
        "That's the person spine. The attribute blocks hang off it: dim_person_<attribute>.",
    },
    explain:
      "Look at what typing dim_person listed: age, care home, language, housebound status… the person-level building blocks, enumerated by the naming convention.",
  },
];

const PREFIX_COLOR: [string, string][] = [
  ["raw_", "var(--layer-raw)"],
  ["stg_", "var(--layer-staging)"],
  ["int_", "var(--layer-modelling)"],
];

function colorFor(name: string): string {
  for (const [prefix, color] of PREFIX_COLOR) {
    if (name.startsWith(prefix)) return color;
  }
  return "var(--layer-reporting)";
}

export function ModelFinder() {
  const done = useInteractionDone();
  const [task, setTask] = useState(0);
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<string | null>(null);
  const [solved, setSolved] = useState(false);
  const [finished, setFinished] = useState(false);

  const current = TASKS[task];

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return MODELS.filter((m) => m.includes(q)).slice(0, 9);
  }, [query]);

  const pick = (name: string) => {
    setPicked(name);
    if (name === current.answer) {
      setSolved(true);
      if (task === TASKS.length - 1) {
        setFinished(true);
        done();
      }
    }
  };

  const next = () => {
    setTask((t) => t + 1);
    setQuery("");
    setPicked(null);
    setSolved(false);
  };

  const feedback =
    picked && !solved
      ? (current.near[picked] ??
        "Not that one — read the prefix and suffix again. What layer, what subject, what shape?")
      : null;

  return (
    <section className="my-6 overflow-hidden rounded-2xl border-2 border-ink bg-paper shadow-[5px_5px_0_0_var(--color-flame)]">
      <header className="border-b-2 border-ink bg-paper-warm px-5 py-3">
        <p className="!my-0 font-display text-[10px] font-extrabold uppercase tracking-[0.18em] !text-flame">
          Find the model · {task + 1}/{TASKS.length}
        </p>
        <p className="!mb-0 !mt-1 text-[15px] font-medium !text-ink">{current.prompt}</p>
      </header>

      <div className="p-4">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!solved) setPicked(null);
          }}
          disabled={solved}
          placeholder="type part of a model name, like you would in Ctrl+P…"
          aria-label="search model names"
          className="w-full rounded-xl border-2 border-line bg-paper px-4 py-2.5 font-mono text-[13px] text-ink outline-none transition placeholder:text-ink-faint focus:border-flame disabled:opacity-60"
        />

        {results.length > 0 && (
          <ul className="!mb-0 !mt-2 flex flex-col gap-1 !pl-0">
            {results.map((name) => {
              const isPicked = picked === name;
              const isAnswer = solved && name === current.answer;
              return (
                <li key={name} className="!my-0 list-none">
                  <button
                    type="button"
                    disabled={solved}
                    onClick={() => pick(name)}
                    className={`flex w-full items-center gap-2.5 rounded-lg border px-3 py-1.5 text-left font-mono text-[12.5px] transition disabled:cursor-default ${
                      isAnswer
                        ? "border-layer-staging bg-layer-staging/10 text-ink"
                        : isPicked
                          ? "border-flame bg-flame-soft text-ink"
                          : "border-transparent text-ink-soft hover:border-line hover:bg-paper-warm"
                    }`}
                  >
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: colorFor(name) }}
                      aria-hidden
                    />
                    {name}
                    {isAnswer && <span className="ml-auto">✓</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        {query.trim() !== "" && results.length === 0 && (
          <p className="!mb-0 !mt-3 text-center font-mono text-xs !text-ink-faint">
            no matches — try fewer letters
          </p>
        )}
        {query.trim() === "" && (
          <p className="!mb-0 !mt-3 text-center font-mono text-xs !text-ink-faint">
            a slice of the real project: 55 of 1,500+ models
          </p>
        )}
      </div>

      {feedback && (
        <div className="border-t-2 border-ink bg-flame-soft px-5 py-3 text-sm !text-ink-soft">
          <strong className="text-ink">Not quite.</strong> {feedback}
        </div>
      )}

      {solved && (
        <div className="border-t-2 border-ink">
          <div className="bg-layer-staging/10 px-5 py-3 text-sm !text-ink-soft">
            <strong className="text-ink">Found it.</strong> {current.explain}
          </div>
          {!finished && (
            <div className="flex justify-end bg-paper-warm p-3">
              <button
                type="button"
                onClick={next}
                className="rounded-lg border-2 border-ink bg-ink px-3 py-1.5 font-display text-xs font-extrabold uppercase tracking-wider text-paper hover:border-flame hover:bg-flame"
              >
                Next search →
              </button>
            </div>
          )}
          {finished && (
            <p className="!my-0 bg-paper-warm px-5 py-3 text-center font-mono text-[11px] !text-ink-faint">
              that reflex — type the concept before building anything — is the whole lesson
            </p>
          )}
        </div>
      )}
    </section>
  );
}
