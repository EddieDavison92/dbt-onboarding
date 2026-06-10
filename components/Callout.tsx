import type { ReactNode } from "react";

const STYLES = {
  tip: {
    label: "Tip",
    border: "border-l-layer-staging",
    badge: "bg-layer-staging/10 text-layer-staging",
  },
  warn: {
    label: "Watch out",
    border: "border-l-flame",
    badge: "bg-flame/10 text-flame-deep",
  },
  info: {
    label: "Good to know",
    border: "border-l-layer-modelling",
    badge: "bg-layer-modelling/10 text-layer-modelling",
  },
  smell: {
    label: "Code smell",
    border: "border-l-layer-published",
    badge: "bg-layer-published/10 text-layer-published",
  },
} as const;

export function Callout({
  kind = "info",
  title,
  children,
}: {
  kind?: keyof typeof STYLES;
  title?: string;
  children: ReactNode;
}) {
  const s = STYLES[kind];
  return (
    <aside
      className={`my-5 max-w-[72ch] rounded-r-xl border border-l-4 border-line bg-paper-warm/60 px-5 py-4 ${s.border}`}
    >
      <span
        className={`mb-1 inline-block rounded-full px-2.5 py-0.5 font-display text-[11px] font-bold uppercase tracking-wider ${s.badge}`}
      >
        {title ?? s.label}
      </span>
      <div className="text-[15px] leading-relaxed text-ink-soft [&>p]:my-1 [&_code]:whitespace-nowrap [&_code]:rounded [&_code]:border [&_code]:border-line [&_code]:bg-paper [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em]">
        {children}
      </div>
    </aside>
  );
}
