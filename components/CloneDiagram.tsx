"use client";

/** One shared repo on GitHub, full clones on each machine, sync only on push/pull. */
export function CloneDiagram() {
  const clones = [
    { x: 60, label: "your clone", mine: true },
    { x: 275, label: "a teammate's clone", mine: false },
    { x: 490, label: "another teammate's", mine: false },
  ];
  const hub = { x: 230, y: 36, w: 240, h: 64 };
  const hubBottom = hub.y + hub.h;
  const cloneY = 180;
  const anchors = [290, 350, 410];

  return (
    <figure className="my-5 overflow-hidden rounded-2xl border border-line bg-paper-warm/50">
      <svg
        viewBox="0 0 700 260"
        className="w-full"
        role="img"
        aria-label="The dbt-analytics repository on GitHub, with full clones on three machines. Push sends your commits up; pull brings the team's down. Nothing syncs on its own."
      >
        {/* connections, fanned from the hub's bottom edge */}
        {clones.map((c, i) => (
          <line
            key={c.label}
            x1={anchors[i]}
            y1={hubBottom}
            x2={c.x + 75}
            y2={cloneY}
            stroke={c.mine ? "var(--flame)" : "var(--ink-faint)"}
            strokeWidth={c.mine ? 2.5 : 1.5}
            strokeDasharray={c.mine ? undefined : "5 4"}
          />
        ))}

        {/* push / pull pill sitting on your connection */}
        <g>
          <rect
            x={150}
            y={126}
            width={126}
            height={26}
            rx={13}
            fill="var(--paper)"
            stroke="var(--flame)"
            strokeWidth="1.5"
          />
          <text
            x={213}
            y={143}
            textAnchor="middle"
            fontFamily="var(--font-mono-jb), monospace"
            fontSize="11"
            fontWeight="700"
            fill="var(--flame-deep)"
          >
            ↑ push · ↓ pull
          </text>
        </g>

        {/* GitHub hub */}
        <rect
          x={hub.x}
          y={hub.y}
          width={hub.w}
          height={hub.h}
          rx={16}
          fill="var(--paper)"
          stroke="var(--ink)"
          strokeWidth="2.5"
        />
        <text
          x={350}
          y={hub.y + 28}
          textAnchor="middle"
          fontFamily="var(--font-display), sans-serif"
          fontSize="14"
          fontWeight="800"
          fill="var(--ink)"
        >
          GitHub · dbt-analytics
        </text>
        <text
          x={350}
          y={hub.y + 48}
          textAnchor="middle"
          fontFamily="var(--font-mono-jb), monospace"
          fontSize="10.5"
          fill="var(--ink-faint)"
        >
          the shared copy everyone sees
        </text>

        {/* clones */}
        {clones.map((c) => (
          <g key={c.label}>
            <rect
              x={c.x}
              y={cloneY}
              width={150}
              height={52}
              rx={12}
              fill={c.mine ? "var(--flame-soft)" : "var(--paper)"}
              stroke={c.mine ? "var(--flame)" : "var(--ink-faint)"}
              strokeWidth={c.mine ? 2.5 : 1.5}
              strokeDasharray={c.mine ? undefined : "5 4"}
            />
            <text
              x={c.x + 75}
              y={cloneY + 23}
              textAnchor="middle"
              fontFamily="var(--font-display), sans-serif"
              fontSize="12"
              fontWeight="800"
              fill={c.mine ? "var(--flame-deep)" : "var(--ink-soft)"}
            >
              {c.label}
            </text>
            <text
              x={c.x + 75}
              y={cloneY + 41}
              textAnchor="middle"
              fontFamily="var(--font-mono-jb), monospace"
              fontSize="9.5"
              fill="var(--ink-faint)"
            >
              full repo + full history
            </text>
          </g>
        ))}
      </svg>
      <figcaption className="border-t border-line px-4 py-2 text-center font-mono text-[11px] text-ink-faint">
        every clone is complete · nothing syncs until someone chooses to push or pull
      </figcaption>
    </figure>
  );
}
