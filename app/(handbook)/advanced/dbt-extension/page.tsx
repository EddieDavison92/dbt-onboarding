import type { Metadata } from "next";
import { LessonShell } from "@/components/LessonShell";
import { Callout } from "@/components/Callout";
import { Quiz } from "@/components/Quiz";

export const metadata: Metadata = { title: "The dbt extension" };

/** small tier pill, reused through the page */
function Tier({ level }: { level: "free" | "account" | "platform" }) {
  const map = {
    free: ["Free", "bg-layer-staging/15 text-layer-staging"],
    account: ["Free dbt account", "bg-layer-modelling/15 text-layer-modelling"],
    platform: ["dbt platform", "bg-ink/10 text-ink-soft"],
  } as const;
  const [label, cls] = map[level];
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 align-middle font-display text-[10px] font-extrabold uppercase tracking-wider ${cls}`}
    >
      {label}
    </span>
  );
}

export default function Page() {
  return (
    <LessonShell
      section="advanced"
      slug="dbt-extension"
      kicker="Going further 01"
      title="The dbt extension"
      lede="The same Fusion engine the project pins also powers a VS Code extension that understands your SQL as you type — catching errors before a build, renaming a column across the whole project, and tracing lineage without leaving the file."
      minutes={8}
    >
      <h2>What it is</h2>
      <p>
        The <strong>dbt VS Code extension</strong>{" "}is the official extension from dbt
        Labs. It runs a language server on your machine, backed by the dbt{" "}
        <strong>Fusion engine</strong> — the same engine this project already pins for
        setup, <code>dbt compile</code>{" "}and <code>dbt build</code>. Because Fusion
        actually parses and type-checks your SQL rather than treating it as text, the
        editor knows your models, your columns and their types, and can act on that
        knowledge while you work.
      </p>
      <p>
        The headline difference from a Snowflake worksheet: feedback arrives{" "}
        <em>as you type</em>, and edits understand the whole project, not just the open
        file. That is what makes the features below worth turning on.
      </p>

      <Callout kind="info" title="Fusion only — not dbt Core">
        <p>
          The extension is only compatible with the dbt Fusion engine, which is exactly
          what the project uses, so you are already set up for it. It does not work with
          classic dbt Core.
        </p>
      </Callout>

      <h2>Free, free account, or platform</h2>
      <p>
        One thing to get straight up front, because it is easy to assume the good
        features cost money. There are three tiers, and a <strong>paid dbt Cloud
        subscription is only needed for the last one</strong>:
      </p>
      <div className="my-6 grid gap-3 sm:grid-cols-3">
        {[
          {
            tier: "free" as const,
            heading: "Free, always",
            body: "Runs locally on Fusion with no account. Syntax error detection, model rename, go-to-definition, table lineage, compiled view and preview.",
            accent: "var(--color-layer-staging)",
          },
          {
            tier: "account" as const,
            heading: "Free dbt account",
            body: "After a 14-day trial, the deepest features ask you to sign in. A free dbt account unlocks them — column rename, column lineage, type-aware errors, hover types.",
            accent: "var(--color-layer-modelling)",
          },
          {
            tier: "platform" as const,
            heading: "dbt platform",
            body: "A couple of features lean on a hosted dbt platform account: the Catalog tab and Compare changes. Out of scope unless that ever changes.",
            accent: "var(--color-ink)",
          },
        ].map((card) => (
          <div
            key={card.heading}
            className="rounded-2xl border-2 border-ink bg-paper p-4"
            style={{ boxShadow: `4px 4px 0 0 ${card.accent}` }}
          >
            <Tier level={card.tier} />
            <p className="!mb-1 !mt-3 font-display text-base font-extrabold !text-ink">
              {card.heading}
            </p>
            <p className="!mb-0 text-sm leading-relaxed !text-ink-soft">{card.body}</p>
          </div>
        ))}
      </div>
      <p>
        The good news for a team that does not use dbt Cloud: almost everything here is
        either free forever or unlocked by a <em>free</em>{" "}account. Only the last,
        smallest tier needs the paid platform.
      </p>

      <h2>Live error detection <Tier level="free" /> <Tier level="account" /></h2>
      <p>
        As you type, the extension underlines problems in red and lists them in the{" "}
        <strong>Problems</strong>{" "}panel — without running anything against Snowflake.
        Hover a red squiggle to read the message. There are two depths:
      </p>
      <ul>
        <li>
          <strong>Syntax</strong> <Tier level="free" /> — missing commas, misspelled
          keywords, broken Jinja. Catches the typos that would otherwise fail a build
          minutes later.
        </li>
        <li>
          <strong>SQL comprehension</strong> <Tier level="account" /> — unknown column
          names, a missing <code>group by</code>, an unaggregated column, the wrong
          number of function arguments, type and schema errors. This is Fusion checking
          your SQL against the project&apos;s real schemas.
        </li>
      </ul>
      <figure className="my-6 overflow-hidden rounded-2xl border-2 border-ink bg-graphite-deep shadow-[5px_5px_0_0_var(--color-flame)]">
        <div className="border-b border-white/10 px-5 py-2.5">
          <span className="font-display text-[11px] font-extrabold uppercase tracking-[0.14em] text-white">
            stg_reference_opening_hours.sql
          </span>
        </div>
        <div className="p-5 font-mono text-[12.5px] leading-7 text-white/85">
          <p className="!my-0">select</p>
          <p className="!my-0 pl-4">
            site_code,
          </p>
          <p className="!my-0 pl-4">
            <span className="text-[#ff8c6b] underline decoration-wavy decoration-[#ff5a36] underline-offset-4">
              day_of_wek
            </span>
          </p>
          <p className="!my-0">from {"{{ ref('raw_reference_opening_hours') }}"}</p>
        </div>
        <figcaption className="border-t border-white/10 px-5 py-2.5 font-mono text-[11px] text-[#ff8c6b]">
          ✶ Unknown column &quot;day_of_wek&quot; — did you mean &quot;day_of_week&quot;?
        </figcaption>
      </figure>
      <p>
        The point is the timing. A worksheet finds that typo when the query fails; here
        it is underlined the moment you write it, before you have built anything.
      </p>

      <h2>Rename a symbol everywhere <Tier level="free" /> <Tier level="account" /></h2>
      <p>
        This is the feature that changes how it feels to work in a project with 1,500+
        models. Instead of find-and-replace across the repo and hoping you caught every
        reference, you rename once and the extension updates every dependant.
      </p>
      <ul>
        <li>
          <strong>Rename a model</strong> <Tier level="free" /> — right-click the file
          in the tree and choose <strong>Rename</strong>. Every <code>ref()</code>{" "}to
          it across the project is rewritten. You can preview the changes before
          applying them.
        </li>
        <li>
          <strong>Rename a column</strong> <Tier level="account" /> — put the cursor on
          a column alias and press <strong>Rename Symbol</strong>{" "}(<code>F2</code>).
          Downstream references to that column are updated project-wide, because Fusion
          tracks the column through the lineage — not by matching text.
        </li>
      </ul>
      <figure className="my-6 rounded-2xl border-2 border-ink bg-paper p-5 shadow-[5px_5px_0_0_var(--color-layer-modelling)]">
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <div className="rounded-xl border-2 border-flame bg-flame-soft p-3 sm:w-2/5">
            <p className="!my-0 font-display text-[10px] font-extrabold uppercase tracking-wider !text-flame-deep">
              You rename, once
            </p>
            <p className="!mb-0 !mt-1.5 font-mono text-[12px] !text-ink">
              stg_…opening_hours.sql
            </p>
            <p className="!mb-0 !mt-1 font-mono text-[12px] !text-ink-soft">
              site_code → <span className="font-bold !text-flame-deep">location_code</span>
            </p>
          </div>
          <span className="self-center font-mono text-ink-faint sm:rotate-0" aria-hidden>
            →
          </span>
          <div className="rounded-xl border-2 border-layer-modelling bg-layer-modelling/5 p-3 sm:flex-1">
            <p className="!my-0 font-display text-[10px] font-extrabold uppercase tracking-wider !text-layer-modelling">
              Every dependant updates automatically
            </p>
            <ul className="!mb-0 !mt-1.5 space-y-1 !pl-0">
              {["int_site_capacity.sql", "fct_access_hours.sql", "obt_site_summary.sql"].map(
                (f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 font-mono text-[12px] !text-ink-soft"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-layer-modelling" aria-hidden />
                    {f}
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </figure>
      <Callout kind="warn" title="What rename does not cover yet">
        <p>
          Column rename relies on strict static analysis, so it is not yet supported for
          snapshots or for columns declared in <code>.yml</code>{" "}files. After a rename,
          a quick <code>dbt compile</code>{" "}is still the honest confirmation that the
          project renders cleanly.
        </p>
      </Callout>

      <h2>Lineage and navigation in context</h2>
      <p>
        Two everyday questions — &quot;where does this come from?&quot; and &quot;what
        breaks if I change it?&quot; — get answered without leaving the editor.
      </p>
      <ul>
        <li>
          <strong>Go to definition</strong> <Tier level="free" /> — <code>Cmd</code>/
          <code>Ctrl</code>-click a <code>ref()</code>, <code>source()</code>{" "}or macro
          to jump straight to the file that defines it. Column and CTE definitions are
          included <Tier level="account" />.
        </li>
        <li>
          <strong>Lineage tab</strong> <Tier level="free" /> — opens a DAG focused on the
          file you are in; double-click a node to open that model. Switch it to{" "}
          <strong>column-level lineage</strong> <Tier level="account" />{" "}to trace a
          single column up and down the graph.
        </li>
      </ul>

      <h2>Rounding out the toolkit</h2>
      <table>
        <thead>
          <tr>
            <th>Feature</th>
            <th>How it works</th>
            <th>Tier</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>View compiled code</td>
            <td>
              The code icon toggles a side-by-side view of the SQL Fusion will actually
              send to Snowflake; it updates as you save.
            </td>
            <td><Tier level="free" /></td>
          </tr>
          <tr>
            <td>Live preview</td>
            <td>
              The table icon (or <code>Cmd</code>/<code>Ctrl+Enter</code>) runs the
              model&apos;s SELECT and shows rows in a Query Results tab.
            </td>
            <td><Tier level="free" /></td>
          </tr>
          <tr>
            <td>Preview a CTE</td>
            <td>A codelens above each CTE previews just that step&apos;s output.</td>
            <td><Tier level="account" /></td>
          </tr>
          <tr>
            <td>IntelliSense</td>
            <td>
              Autocomplete for <code>ref()</code>{" "}and <code>source()</code>{" "}names and
              dialect-aware SQL functions.
            </td>
            <td><Tier level="free" /></td>
          </tr>
          <tr>
            <td>Hover insights</td>
            <td>
              Hover <code>*</code>{" "}to see the columns it expands to; hover a column to
              see its data type.
            </td>
            <td><Tier level="account" /></td>
          </tr>
          <tr>
            <td>Build with selectors</td>
            <td>
              <code>Cmd</code>/<code>Ctrl+Shift+Enter</code>{" "}opens a quickpick to build
              a selection from the command palette.
            </td>
            <td><Tier level="free" /></td>
          </tr>
        </tbody>
      </table>

      <h2>What needs the dbt platform</h2>
      <p>
        Two features are genuinely tied to a hosted dbt platform account and are out of
        scope while the team does not use one: the <strong>Catalog</strong>{" "}tab (build
        status, last run time, descriptions and test results pulled from the platform)
        and <strong>Compare changes</strong>{" "}against a stored manifest. Everything
        described above this point does not need them.
      </p>

      <Callout kind="tip" title="Before you lean on the account-gated features">
        <p>
          The extension is free for organisations of up to 15 users under dbt&apos;s
          acceptable use policy, and the deeper features sign you in to a{" "}
          <em>free</em>{" "}dbt account rather than a paid Cloud plan. Both of those are
          worth confirming against the team&apos;s own account and seat setup before
          building a workflow around column rename or column lineage — but neither is a
          reason to avoid the free-forever tier, which already covers most of a normal
          day.
        </p>
      </Callout>

      <Quiz
        questions={[
          {
            prompt:
              "Which of these works with no dbt account at all, just the local Fusion engine?",
            options: [
              "Renaming a column alias and having downstream column references update",
              "Cmd-clicking a `ref()` to jump to the model that defines it",
              "Column-level lineage in the Lineage tab",
              "Hovering `*` to see the columns and types it expands to",
            ],
            answer: 1,
            explain:
              "Go-to-definition for refs, sources and macros, model rename, table-level lineage and compiled-SQL view are all free with no account. Column rename, column lineage and hover types are the deeper features a free dbt account unlocks after the trial.",
          },
          {
            prompt:
              "You use Rename Symbol on a column. How does the extension update downstream models so reliably?",
            options: [
              "It runs a query against Snowflake to find every dependant table",
              "Fusion statically analyses the project's SQL and follows the column through lineage",
              "It does a text find-and-replace for the old column name across the repo",
              "It only renames inside the file you have open",
            ],
            answer: 1,
            explain:
              "A text replace would hit false matches (a different table's column of the same name) and miss aliased ones. Because Fusion parses and type-checks the SQL, it knows which references are actually the same column and updates only those.",
          },
        ]}
      />
    </LessonShell>
  );
}
