"use client";

import { useState } from "react";
import { useInteractionDone } from "@/lib/interaction";

const INDENT_START = `version: 2
models:
- name: stg_people
description: One row per person
columns:
- name: person_id
description: Stable person identifier
data_tests:
- not_null
- unique`;

const INDENT_ANSWER = `version: 2
models:
  - name: stg_people
    description: One row per person
    columns:
      - name: person_id
        description: Stable person identifier
        data_tests:
          - not_null
          - unique`;

const SIBLING_START = `${INDENT_ANSWER}
      # Add postcode here`;

const SIBLING_ANSWER = `${INDENT_ANSWER}
      - name: postcode
        description: Latest known postcode`;

const ROUNDS = [
  {
    id: "indent",
    label: "1 · Repair the structure",
    prompt:
      "The words are right, but every nested line has fallen left. Add spaces so each property belongs to the object above it.",
    start: INDENT_START,
    answer: INDENT_ANSWER,
    done: "The indentation now says: one model, containing one column, containing two tests.",
  },
  {
    id: "sibling",
    label: "2 · Add a sibling column",
    prompt:
      "Replace the comment with a postcode column. It belongs beside person_id, with the description nested beneath it.",
    start: SIBLING_START,
    answer: SIBLING_ANSWER,
    done: "postcode is a second item in the columns list, not a child of person_id.",
  },
] as const;

function clean(value: string) {
  return value.replace(/\r\n/g, "\n").replace(/[ \t]+$/gm, "").trim();
}

function leadingSpaces(line: string) {
  return line.length - line.trimStart().length;
}

function feedbackFor(value: string, answer: string) {
  if (value.includes("\t")) {
    return "A tab has slipped in. YAML indentation must use spaces; replace the tab before checking again.";
  }

  const actual = clean(value).split("\n");
  const expected = clean(answer).split("\n");
  const max = Math.max(actual.length, expected.length);

  for (let index = 0; index < max; index += 1) {
    const got = actual[index];
    const wanted = expected[index];
    if (got === wanted) continue;

    if (got === undefined) {
      return `Line ${index + 1} is missing. Add: ${wanted.trim()}`;
    }
    if (wanted === undefined) {
      return `Line ${index + 1} is extra. Remove it, then check again.`;
    }
    if (got.trim() === wanted.trim()) {
      const spaces = leadingSpaces(wanted);
      return `Line ${index + 1} has the right words. It needs ${spaces} leading ${spaces === 1 ? "space" : "spaces"}.`;
    }

    return `Line ${index + 1} should read: ${wanted.trim()}`;
  }

  return "Something still differs from the target structure. Check the spacing and punctuation.";
}

export function YamlWorkshop() {
  const interactionDone = useInteractionDone();
  const [round, setRound] = useState(0);
  const [values, setValues] = useState<string[]>([ROUNDS[0].start, ROUNDS[1].start]);
  const [checked, setChecked] = useState(false);
  const [solved, setSolved] = useState<boolean[]>([false, false]);
  const current = ROUNDS[round];
  const value = values[round];
  const correct = clean(value) === clean(current.answer);

  const update = (next: string) => {
    setValues((all) => all.map((item, index) => (index === round ? next : item)));
    setChecked(false);
  };

  const check = () => {
    setChecked(true);
    if (!correct) return;

    const next = solved.map((item, index) => (index === round ? true : item));
    setSolved(next);
    if (next.every(Boolean)) interactionDone();
  };

  const openRound = (index: number) => {
    setRound(index);
    setChecked(solved[index]);
  };

  return (
    <section className="my-6 overflow-hidden rounded-2xl border-2 border-ink bg-paper shadow-[5px_5px_0_0_var(--color-layer-modelling)]">
      <header className="border-b-2 border-ink bg-paper-warm p-4">
        <p className="!my-0 font-display text-[10px] font-extrabold uppercase tracking-[0.18em] !text-flame">
          YAML workshop
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {ROUNDS.map((item, index) => (
            <button
              key={item.id}
              type="button"
              disabled={index === 1 && !solved[0]}
              aria-pressed={round === index}
              onClick={() => openRound(index)}
              className={`rounded-lg border-2 px-3 py-2 text-left font-display text-[11px] font-extrabold uppercase tracking-wider transition disabled:cursor-not-allowed disabled:opacity-45 ${
                round === index
                  ? "border-ink bg-ink text-paper"
                  : solved[index]
                    ? "border-layer-staging bg-layer-staging/10 text-layer-staging"
                    : "border-line bg-paper text-ink-soft hover:border-flame"
              }`}
            >
              {solved[index] ? "✓ " : ""}{item.label}
            </button>
          ))}
        </div>
        <p className="!mb-0 !mt-3 text-sm">{current.prompt}</p>
      </header>

      <div className="grid gap-0 md:grid-cols-[minmax(0,1fr)_210px]">
        <div className="min-w-0 bg-graphite-deep">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 font-mono text-[10px] text-white/40">
            <span>models/stg_people.yml</span>
            <span>spaces: 2</span>
          </div>
          <div className="relative">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-4 flex gap-[15px] opacity-20"
            >
              {[0, 1, 2, 3, 4, 5].map((rail) => (
                <span key={rail} className="h-full border-l border-dashed border-white/40" />
              ))}
            </div>
            <textarea
              value={value}
              onChange={(event) => update(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Tab") {
                  event.preventDefault();
                  const target = event.currentTarget;
                  const start = target.selectionStart;
                  const end = target.selectionEnd;
                  const next = `${value.slice(0, start)}  ${value.slice(end)}`;
                  update(next);
                  requestAnimationFrame(() => {
                    target.selectionStart = start + 2;
                    target.selectionEnd = start + 2;
                  });
                }
              }}
              spellCheck={false}
              aria-label={`YAML editor: ${current.label}`}
              className="relative z-10 min-h-[318px] w-full resize-y bg-transparent px-4 py-4 font-mono text-[12px] leading-7 text-[#e8eaf2] caret-flame outline-none [tab-size:2]"
            />
          </div>
        </div>

        <aside className="border-t-2 border-ink bg-paper p-4 md:border-l-2 md:border-t-0">
          <p className="!my-0 font-display text-[10px] font-extrabold uppercase tracking-[0.16em] !text-layer-modelling">
            Shape to express
          </p>
          <div className="mt-3 font-mono text-[11px] leading-6 text-ink-soft">
            <p className="!my-0 !text-ink">models</p>
            <p className="!my-0 pl-3">└ model: stg_people</p>
            <p className="!my-0 pl-6">├ description</p>
            <p className="!my-0 pl-6">└ columns</p>
            <p className="!my-0 pl-9">├ column: person_id</p>
            {round === 0 && (
              <>
                <p className="!my-0 pl-12">├ description</p>
                <p className="!my-0 pl-12">└ data_tests</p>
              </>
            )}
            {round === 1 && <p className="!my-0 pl-9 !text-flame-deep">└ column: postcode</p>}
          </div>
          <div className="mt-4 rounded-lg border border-line bg-paper-warm px-3 py-2 text-xs text-ink-soft">
            <strong className="text-ink">Remember:</strong>{" "}a colon names a property;
            a dash starts an item in a list; indentation says what belongs inside what.
          </div>
        </aside>
      </div>

      {checked && (
        <div
          className={`rise border-t-2 border-ink px-4 py-3 text-sm ${
            correct ? "bg-layer-staging/10" : "bg-flame-soft"
          }`}
        >
          <strong className="text-ink">{correct ? "Valid structure. " : "Not yet. "}</strong>
          <span className="text-ink-soft">
            {correct ? current.done : feedbackFor(value, current.answer)}
          </span>
        </div>
      )}

      <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-line bg-paper-warm p-3">
        <button
          type="button"
          onClick={() => update(current.start)}
          className="rounded-lg border-2 border-line px-3 py-1.5 font-display text-xs font-extrabold uppercase tracking-wider text-ink-soft transition hover:border-ink"
        >
          Reset
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => update(current.answer)}
            className="rounded-lg border-2 border-line px-3 py-1.5 font-display text-xs font-extrabold uppercase tracking-wider text-ink-soft transition hover:border-flame hover:text-flame-deep"
          >
            Fill answer
          </button>
          {solved[round] && round === 0 ? (
            <button
              type="button"
              onClick={() => openRound(1)}
              className="rounded-lg border-2 border-ink bg-ink px-3 py-1.5 font-display text-xs font-extrabold uppercase tracking-wider text-paper transition hover:border-flame hover:bg-flame"
            >
              Next round →
            </button>
          ) : (
            <button
              type="button"
              onClick={check}
              className="rounded-lg border-2 border-ink bg-ink px-3 py-1.5 font-display text-xs font-extrabold uppercase tracking-wider text-paper transition hover:border-flame hover:bg-flame"
            >
              Check YAML
            </button>
          )}
        </div>
      </footer>
    </section>
  );
}
