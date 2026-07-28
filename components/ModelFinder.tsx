"use client";

import { useMemo, useState } from "react";
import { useInteractionDone } from "@/lib/interaction";
import { MODEL_NAMES } from "@/lib/model-names";

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
    prompt: "Your analysis needs each person's most recent blood pressure reading.",
    answer: "int_blood_pressure_latest",
    near: {
      int_blood_pressure_all:
        "That's every reading ever recorded — one row per measurement, many per person. The suffix you want is _latest.",
      dq_blood_pressure_issues:
        "dq_ models list data-quality problems, not readings. You want the modelling-layer block: int_blood_pressure_latest.",
      int_blood_pressure_observations_base:
        "_base is an internal building step other int_ models assemble from. For one row per person, the suffix is _latest.",
    },
    explain:
      "The _all / _latest pattern you just learned works for every measure, not just the example — and you found this one by typing the concept, not by asking anyone.",
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
      dim_person_ethnicity_combi:
        "The _combi variant blends ethnicity sources — the standard block is dim_person_ethnicity.",
    },
    explain:
      "Look at what typing dim_person listed: age, care home, language, housebound status… the person-level building blocks, enumerated by the naming convention.",
  },
  {
    prompt: "A prescribing question: every statin ever issued, one row per order.",
    answer: "int_statin_medications_all",
    near: {
      int_ace_inhibitor_medications_all:
        "Right family, wrong drug class — swap the middle word.",
      int_antidepressant_medications_all:
        "Right family, wrong drug class — swap the middle word.",
    },
    explain:
      "Medication events follow int_{drug class}_medications_all — one pattern, a whole formulary: statins, ACE inhibitors, antidepressants, anticoagulants…",
  },
  {
    prompt: "Which neighbourhood does each GP practice belong to?",
    answer: "dim_practice_neighbourhood",
    near: {
      dim_practice:
        "Close — that's the practice spine. Its attribute blocks follow the same pattern as dim_person_*.",
      dim_pcn:
        "That's the PCN dimension itself. You want the practice-level block that maps practices to neighbourhoods.",
    },
    explain:
      "The entity-first pattern isn't just for people: dim_practice_* enumerates practice-level blocks exactly the way dim_person_* does. Learn the grammar once, read the whole project.",
  },
];

/** revealed once all tasks are solved — each task exercised one of these */
const FAMILIES: [string, string][] = [
  ["dim_person_*", "35+ person-level attribute blocks — age, ethnicity, care home, language…"],
  ["fct_person_{condition}_register", "40+ disease registers, one per condition"],
  ["int_{measure}_all / _latest", "every recorded event, or the most recent per person"],
  ["int_{drug class}_medications_all", "prescribing events for a whole drug class"],
  ["dim_practice_*", "practice-level blocks, same pattern as dim_person_*"],
];

const PREFIX_COLOR: [string, string][] = [
  ["raw_", "var(--layer-raw)"],
  ["stg_", "var(--layer-staging)"],
  ["int_", "var(--layer-modelling)"],
  ["dim_", "var(--layer-reporting)"],
  ["fct_", "var(--layer-reporting)"],
  ["pit_", "var(--layer-reporting)"],
  ["dq_", "var(--layer-reporting)"],
];

/** split a model name so the layer prefix can carry its layer colour */
function splitName(name: string): { prefix: string; rest: string; color: string } {
  for (const [prefix, color] of PREFIX_COLOR) {
    if (name.startsWith(prefix)) {
      return { prefix, rest: name.slice(prefix.length), color };
    }
  }
  return { prefix: "", rest: name, color: "var(--ink)" };
}

export function ModelFinder() {
  const done = useInteractionDone();
  const [task, setTask] = useState(0);
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<string | null>(null);
  const [solved, setSolved] = useState(false);
  const [finished, setFinished] = useState(false);

  const current = TASKS[task];

  const { results, overflow } = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { results: [] as string[], overflow: 0 };
    const all = MODEL_NAMES.filter((m) => m.includes(q));
    return { results: all.slice(0, 12), overflow: Math.max(0, all.length - 12) };
  }, [query]);

  const pick = (name: string) => {
    if (solved) return; // solved: the box stays open for exploring
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
          placeholder="type part of a model name — VS Code file search, Snowsight search, same idea…"
          aria-label="search model names"
          className="w-full rounded-xl border-2 border-line bg-paper px-4 py-2.5 font-mono text-[13px] text-ink outline-none transition placeholder:text-ink-faint focus:border-flame"
        />

        {results.length > 0 && (
          <ul className="!mb-0 !mt-2 flex !max-w-none flex-col gap-1 !pl-0">
            {results.map((name) => {
              const isPicked = picked === name;
              const isAnswer = solved && name === current.answer;
              const { prefix, rest, color } = splitName(name);
              return (
                <li key={name} className="!my-0 !pl-0 list-none">
                  <button
                    type="button"
                    onClick={() => pick(name)}
                    className={`flex w-full items-center rounded-lg border px-3 py-1.5 text-left font-mono text-[12.5px] transition ${
                      isAnswer
                        ? "border-layer-staging bg-layer-staging/10 text-ink"
                        : isPicked
                          ? "border-flame bg-flame-soft text-ink"
                          : "border-transparent text-ink-soft hover:border-line hover:bg-paper-warm"
                    }`}
                  >
                    <span>
                      <span className="font-bold" style={{ color }}>
                        {prefix}
                      </span>
                      {rest}
                    </span>
                    {isAnswer && <span className="ml-auto pl-2">✓</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        {overflow > 0 && (
          <p className="!mb-0 !mt-2 w-full !max-w-none text-center font-mono text-[11px] !text-ink-faint">
            + {overflow} more match{overflow === 1 ? "" : "es"} — keep typing to narrow it
          </p>
        )}
        {query.trim() !== "" && results.length === 0 && (
          <p className="!mb-0 !mt-3 w-full !max-w-none text-center font-mono text-xs !text-ink-faint">
            no matches — try fewer letters
          </p>
        )}
        {query.trim() === "" && (
          <p className="!mb-0 !mt-3 w-full !max-w-none text-center font-mono text-xs !text-ink-faint">
            {MODEL_NAMES.length} real models from the project · prefix colour = layer
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
            <div className="w-full bg-paper-warm px-5 py-4">
              <p className="!my-0 w-full !max-w-none text-sm font-medium !text-ink">
                Each search you just did used a <strong>family</strong> — one
                pattern that names a whole shelf of models:
              </p>
              <div className="mt-2.5 flex flex-col gap-1.5">
                {FAMILIES.map(([pattern, gloss]) => (
                  <div
                    key={pattern}
                    className="flex flex-col gap-0.5 rounded-xl border border-line bg-paper px-3.5 py-2 sm:flex-row sm:items-baseline sm:gap-3"
                  >
                    <code className="shrink-0 !whitespace-normal text-[12px] font-bold">{pattern}</code>
                    <span className="text-[13px] text-ink-soft">{gloss}</span>
                  </div>
                ))}
              </div>
              <p className="!mb-0 !mt-3 w-full !max-w-none text-center font-mono text-[11px] !text-ink-faint">
                that reflex — type the concept before building anything — is the whole lesson
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
