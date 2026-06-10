"use client";

import { useRef, useState } from "react";

type Stage = {
  cmd: string;
  /** what the terminal prints back */
  out: string;
  /** shown above the prompt while this stage is active */
  prompt?: string;
};

/** Normalise a typed command for comparison: collapse whitespace, trim. */
function norm(s: string) {
  return s.replace(/\s+/g, " ").trim();
}

/**
 * A simulated terminal: the learner types each command themselves and sees
 * realistic output. "Do it for me" fills the command for anyone who'd rather
 * not type.
 */
export function TryIt({ stages, done = "That's the real output — exactly what you'll see on your machine." }: { stages: Stage[]; done?: string }) {
  const [history, setHistory] = useState<{ cmd: string; out: string }[]>([]);
  const [input, setInput] = useState("");
  const [nudge, setNudge] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const stage = stages[history.length];
  const finished = !stage;

  const run = (typed: string) => {
    if (!stage) return;
    if (norm(typed) === norm(stage.cmd)) {
      setHistory((h) => [...h, { cmd: stage.cmd, out: stage.out }]);
      setInput("");
      setNudge(false);
    } else {
      setNudge(true);
    }
  };

  const reset = () => {
    setHistory([]);
    setInput("");
    setNudge(false);
    inputRef.current?.focus();
  };

  return (
    <div className="my-5 overflow-hidden rounded-xl border border-graphite-deep bg-graphite-deep shadow-[0_8px_30px_-12px_rgb(27_30_41/0.5)]">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2">
        <span className="flex gap-1.5">
          <i className="size-2.5 rounded-full bg-white/15" />
          <i className="size-2.5 rounded-full bg-white/15" />
          <i className="size-2.5 rounded-full bg-flame/80" />
        </span>
        <span className="ml-1 font-mono text-xs text-white/50">
          try it — type the command
        </span>
        <span className="ml-auto flex items-center gap-2">
          {finished && (
            <span className="font-mono text-[11px] text-[#7ee2c0]">✓ done</span>
          )}
          {history.length > 0 && (
            <button
              type="button"
              onClick={reset}
              className="rounded-md border border-white/15 px-2 py-0.5 font-mono text-[11px] text-white/60 transition hover:border-flame hover:text-flame"
            >
              ↺ reset
            </button>
          )}
        </span>
      </div>

      <div
        className="cursor-text px-4 py-3.5 font-mono text-[13px] leading-relaxed"
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((h, i) => (
          <div key={i}>
            <p className="!my-0 text-[#e8eaf2]">
              <span className="text-[#7ee2c0]">$ </span>
              {h.cmd}
            </p>
            <pre className="!my-0 whitespace-pre-wrap text-white/70">{h.out}</pre>
          </div>
        ))}

        {!finished && (
          <>
            {stage.prompt && (
              <p className="!mb-1 !mt-2 text-[11px] text-white/40">{stage.prompt}</p>
            )}
            <div className="flex items-center">
              <span className="text-[#7ee2c0]">$ </span>
              <div className="relative ml-1 min-w-0 flex-1">
                {/* ghost suggestion: stays visible underneath as you type over it */}
                {stage.cmd.startsWith(input) && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 select-none whitespace-pre font-mono text-[13px] text-white/30"
                  >
                    {stage.cmd}
                  </span>
                )}
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    setNudge(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") run(input);
                    if (
                      (e.key === "Tab" || e.key === "ArrowRight") &&
                      input.length < stage.cmd.length &&
                      stage.cmd.startsWith(input)
                    ) {
                      e.preventDefault();
                      setInput(stage.cmd);
                    }
                  }}
                  spellCheck={false}
                  autoCapitalize="off"
                  autoComplete="off"
                  aria-label={`type the command ${stage.cmd}`}
                  className="relative w-full border-none bg-transparent font-mono text-[13px] text-[#e8eaf2] caret-flame outline-none"
                />
              </div>
            </div>
            <p className="!mb-0 !mt-1 text-[11px] text-white/30">
              {nudge ? (
                <span className="text-[#ff9a82]">
                  not quite — the command is shown in grey; Tab completes it
                </span>
              ) : (
                <>press <span className="text-white/50">Tab</span> to autocomplete · Enter to run</>
              )}
            </p>
          </>
        )}

        {finished && (
          <p className="!mb-0 !mt-2 text-[11px] text-[#7ee2c0]">{done}</p>
        )}
      </div>

      {!finished && (
        <div className="border-t border-white/10 px-4 py-2 text-right">
          <button
            type="button"
            onClick={() => {
              setInput(stage.cmd);
              inputRef.current?.focus();
            }}
            className="rounded-md border border-white/15 px-2 py-0.5 font-mono text-[11px] text-white/60 transition hover:border-flame hover:text-flame"
          >
            type it for me
          </button>
        </div>
      )}
    </div>
  );
}
