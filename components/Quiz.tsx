"use client";

import { useState } from "react";

export type QuizQuestion = {
  prompt: string;
  options: string[];
  answer: number;
  explain: string;
};

export function Quiz({ title = "Check yourself", questions }: { title?: string; questions: QuizQuestion[] }) {
  const [picked, setPicked] = useState<Record<number, number>>({});

  const answered = Object.keys(picked).length;
  const correct = questions.filter((q, i) => picked[i] === q.answer).length;

  return (
    <section className="my-8 max-w-[72ch] overflow-hidden rounded-2xl border-2 border-ink bg-paper shadow-[5px_5px_0_0_var(--color-flame)]">
      <header className="flex items-baseline justify-between border-b-2 border-ink bg-paper-warm px-5 py-3">
        <h3 className="font-display text-sm font-extrabold uppercase tracking-widest">
          {title}
        </h3>
        <span className="font-mono text-xs text-ink-faint">
          {answered === questions.length
            ? `${correct}/${questions.length} correct`
            : `${answered}/${questions.length} answered`}
        </span>
      </header>
      <ol className="divide-y divide-line">
        {questions.map((q, qi) => {
          const sel = picked[qi];
          return (
            <li key={qi} className="px-5 py-4">
              <p className="mb-2.5 text-[15px] font-medium text-ink">
                {q.prompt}
              </p>
              <div className="flex flex-col gap-1.5">
                {q.options.map((opt, oi) => {
                  const chosen = sel === oi;
                  const isAnswer = q.answer === oi;
                  const revealed = sel !== undefined;
                  return (
                    <button
                      key={oi}
                      type="button"
                      disabled={revealed}
                      onClick={() => setPicked((p) => ({ ...p, [qi]: oi }))}
                      className={`rounded-lg border px-3.5 py-2 text-left text-sm transition disabled:cursor-default ${
                        revealed && isAnswer
                          ? "border-layer-staging bg-layer-staging/10 text-ink"
                          : chosen
                            ? "border-flame bg-flame-soft text-ink"
                            : revealed
                              ? "border-line text-ink-faint"
                              : "border-line text-ink-soft hover:border-flame hover:bg-flame-soft/50"
                      }`}
                    >
                      <span className="mr-2 font-mono text-xs text-ink-faint">
                        {String.fromCharCode(97 + oi)}
                      </span>
                      {opt}
                      {revealed && isAnswer && <span className="ml-2">✓</span>}
                      {revealed && chosen && !isAnswer && <span className="ml-2">✗</span>}
                    </button>
                  );
                })}
              </div>
              {sel !== undefined && (
                <p
                  className={`mt-2.5 rounded-lg px-3.5 py-2 text-sm leading-relaxed ${
                    sel === q.answer
                      ? "bg-layer-staging/10 text-ink-soft"
                      : "bg-flame-soft text-ink-soft"
                  }`}
                >
                  <strong className="font-semibold text-ink">
                    {sel === q.answer ? "Right. " : "Not quite. "}
                  </strong>
                  {q.explain}
                </p>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
