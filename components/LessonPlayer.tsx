"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProgress } from "@/lib/progress";
import type { Checkpoint, Step } from "@/lib/course-types";

function CheckpointBlock({
  check,
  onAnswered,
}: {
  check: Checkpoint;
  onAnswered: () => void;
}) {
  const [picked, setPicked] = useState<number | null>(null);

  return (
    <div className="my-5 rounded-2xl border-2 border-ink bg-paper p-5 shadow-[4px_4px_0_0_var(--color-flame)]">
      <p className="!my-0 font-display text-[11px] font-extrabold uppercase tracking-[0.18em] text-flame">
        Check your understanding
      </p>
      <p className="!mb-3 !mt-1.5 text-[15px] font-medium !text-ink">{check.prompt}</p>
      <div className="flex flex-col gap-1.5">
        {check.options.map((opt, oi) => {
          const chosen = picked === oi;
          const isAnswer = check.answer === oi;
          const revealed = picked !== null;
          return (
            <button
              key={oi}
              type="button"
              disabled={revealed}
              onClick={() => {
                setPicked(oi);
                onAnswered();
              }}
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
      {picked !== null && (
        <p
          className={`!mb-0 !mt-2.5 rounded-lg px-3.5 py-2 text-sm leading-relaxed ${
            picked === check.answer
              ? "bg-layer-staging/10 text-ink-soft"
              : "bg-flame-soft text-ink-soft"
          }`}
        >
          <strong className="font-semibold text-ink">
            {picked === check.answer ? "Right. " : "Not quite. "}
          </strong>
          {check.explain}
        </p>
      )}
    </div>
  );
}

export function LessonPlayer({
  courseSlug,
  courseTitle,
  lessonSlug,
  lessonTitle,
  lessonIndex,
  lessonCount,
  steps,
  nextHref,
  nextLabel,
}: {
  courseSlug: string;
  courseTitle: string;
  lessonSlug: string;
  lessonTitle: string;
  lessonIndex: number;
  lessonCount: number;
  steps: Step[];
  nextHref: string;
  nextLabel: string;
}) {
  const lessonId = `${courseSlug}/${lessonSlug}`;
  const { ready, getStep, setStep, markDone, isDone } = useProgress();
  const router = useRouter();

  // current step shown (1-based)
  const [pos, setPos] = useState(1);
  // checkpoints answered (this visit, or restored from a previous one)
  const [answered, setAnswered] = useState<Record<number, boolean>>({});
  const [restored, setRestored] = useState(false);

  // resume at the furthest step reached previously
  useEffect(() => {
    if (ready && !restored) {
      const saved = getStep(lessonId);
      if (saved > 1) {
        const upTo = Math.min(saved, steps.length);
        setPos(upTo);
        const pre: Record<number, boolean> = {};
        for (let i = 0; i < upTo - 1; i++) pre[i] = true;
        setAnswered(pre);
      }
      setRestored(true);
    }
  }, [ready, restored, getStep, lessonId, steps.length]);

  // persist the furthest position reached
  useEffect(() => {
    if (restored) setStep(lessonId, pos);
  }, [pos, restored, setStep, lessonId]);

  const i = pos - 1;
  const step = steps[i];
  const blocked = !!step.check && !answered[i];
  const atEnd = pos >= steps.length;
  const finished = ready && isDone(`course/${lessonId}`);

  const goBack = () => {
    if (pos > 1) {
      setPos((p) => p - 1);
      window.scrollTo({ top: 0 });
    }
  };

  const advance = () => {
    if (blocked) return;
    if (!atEnd) {
      setPos((p) => p + 1);
      window.scrollTo({ top: 0 });
    } else {
      markDone(`course/${lessonId}`);
      router.push(nextHref);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <header className="mb-8 border-b-2 border-ink pb-5">
        <p className="flex items-baseline justify-between font-mono text-xs text-ink-faint">
          <Link
            href={`/courses/${courseSlug}`}
            className="font-display font-extrabold uppercase tracking-[0.18em] text-flame hover:text-flame-deep"
          >
            ← {courseTitle}
          </Link>
          <span>
            lesson {lessonIndex + 1} of {lessonCount}
          </span>
        </p>
        <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink">
          {lessonTitle}
        </h1>
        <div className="mt-4 flex gap-1" aria-label={`step ${pos} of ${steps.length}`}>
          {steps.map((s, si) => (
            <button
              key={s.id}
              type="button"
              aria-label={`step ${si + 1}`}
              disabled={si + 1 > Math.max(pos, ready ? getStep(lessonId) : 1)}
              onClick={() => {
                setPos(si + 1);
                window.scrollTo({ top: 0 });
              }}
              className={`h-1.5 flex-1 rounded-full transition-colors disabled:cursor-default ${
                si + 1 === pos
                  ? "bg-flame"
                  : si + 1 < pos || answered[si]
                    ? "bg-flame/40 hover:bg-flame/70"
                    : "bg-line"
              }`}
            />
          ))}
        </div>
      </header>

      <div key={step.id} className="lesson rise">
        {step.title && (
          <h2 className="!mt-0 font-display text-xl font-extrabold tracking-tight text-ink">
            {step.title}
          </h2>
        )}
        <div>{step.body}</div>
        {step.check &&
          (answered[i] ? (
            <p className="!my-3 rounded-lg bg-paper-warm px-3.5 py-2 font-mono text-xs text-ink-faint">
              ✓ checkpoint answered — continue when ready
            </p>
          ) : (
            <CheckpointBlock
              check={step.check}
              onAnswered={() => setAnswered((a) => ({ ...a, [i]: true }))}
            />
          ))}
      </div>

      <div className="mt-10 flex items-center gap-3">
        <button
          type="button"
          onClick={goBack}
          disabled={pos <= 1}
          className="rounded-xl border-2 border-line px-5 py-3.5 font-display text-sm font-extrabold uppercase tracking-widest text-ink-soft transition enabled:hover:border-ink enabled:hover:text-ink disabled:opacity-40"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={advance}
          disabled={blocked}
          className={`flex-1 rounded-xl border-2 px-5 py-3.5 font-display text-sm font-extrabold uppercase tracking-widest transition ${
            blocked
              ? "cursor-not-allowed border-line bg-paper-warm text-ink-faint"
              : "border-ink bg-ink text-paper hover:border-flame hover:bg-flame"
          }`}
        >
          {blocked
            ? "Answer the question to continue"
            : atEnd
              ? finished
                ? `Next: ${nextLabel} →`
                : `Finish lesson · ${nextLabel} →`
              : "Continue"}
        </button>
      </div>
      <p className="mt-2 text-center font-mono text-[11px] text-ink-faint">
        step {pos} of {steps.length}
      </p>
    </div>
  );
}
