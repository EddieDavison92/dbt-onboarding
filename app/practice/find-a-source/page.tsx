import type { Metadata } from "next";
import { LessonShell } from "@/components/LessonShell";
import { CodeBlock } from "@/components/CodeBlock";
import { Callout } from "@/components/Callout";
import { Checklist } from "@/components/Checklist";

export const metadata: Metadata = { title: "Find your source" };

export default function Page() {
  return (
    <LessonShell
      section="practice"
      slug="find-a-source"
      kicker="Do · Step 2"
      title="Find your source"
      lede="Your machine is ready. Now pick something to build — ideally from data you already know well."
      minutes={8}
    >
      <h2>Start with data you already know</h2>
      <p>
        The best first model is built on a table you have already worked with — a
        reference dataset you maintain, a feed you have queried for reports, anything
        where you could glance at the output and say “that looks right” or “that row
        count is suspicious”. You will be learning dbt&apos;s mechanics; do not make
        yourself learn an unfamiliar dataset at the same time. The judgement you
        already have about the data is what tells you whether the dbt part worked.
      </p>
      <p>
        Whatever you choose, the route is the same: every model starts from a raw
        model, so step one is finding it — and understanding how it got there. (The
        rest of this walkthrough uses a practice-opening-hours reference table as its
        example; substitute your own.)
      </p>

      <h2>Why a generation pipeline exists at all</h2>
      <p>
        Feeds arrive in the data lake (<code>DATA_LAKE</code> is the main source
        database, alongside <code>DATA_LAKE__NCL</code>) with column names exactly as
        the supplier sent them: <code>&quot;UNIQUE SUBMISSION ID&quot;</code> with
        spaces, CamelCase like <code>GPPracticeCode</code>, symbols such as{" "}
        <code>%</code> and <code>&amp;</code>, inconsistent casing throughout. Querying
        those names means double-quoting every identifier and matching case exactly —
        something we never want analysts dealing with downstream.
      </p>
      <p>
        So the project handles it once. A Python pipeline reads{" "}
        <code>source_mappings.yml</code>, inspects the live Snowflake schemas, and
        generates two things for every source table:
      </p>
      <ul>
        <li>
          <strong>A source declaration</strong> in <code>models/sources/</code> — the
          YAML that makes <code>source()</code> work.
        </li>
        <li>
          <strong>A raw model</strong> in <code>models/raw/&lt;domain&gt;/</code> — the
          1:1 view that renames every column to clean snake_case:{" "}
          <code>&quot;UNIQUE SUBMISSION ID&quot;</code> →{" "}
          <code>unique_submission_id</code>, <code>GPPracticeCode</code> →{" "}
          <code>gp_practice_code</code>, <code>%</code> → <code>percent</code>,{" "}
          <code>&amp;</code> → <code>and</code>.
        </li>
      </ul>
      <p>
        Everything you build starts from the raw model, so the messy names exist in
        exactly one (generated) place.
      </p>

      <h2>Auto-mapped vs manual sources</h2>
      <p>Source YAML comes in two kinds, and the file name tells you which:</p>
      <table>
        <thead>
          <tr>
            <th>Kind</th>
            <th>File</th>
            <th>Used for</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Auto-mapped</td>
            <td>
              <code>auto_*.yml</code> (generated, never edited)
            </td>
            <td>
              Stable schemas. The pipeline introspects Snowflake and declares every
              table it finds — new tables appear on the next run.
            </td>
          </tr>
          <tr>
            <td>Manual</td>
            <td>
              <code>manual_*.yml</code> (hand-written)
            </td>
            <td>
              Volatile schemas, such as analyst-managed uploads. The YAML pins a curated
              list of tables, so a stray upload cannot silently become a source.
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        A manual source is flagged with <code>manual: true</code> in{" "}
        <code>source_mappings.yml</code>. The pipeline still checks it against the live
        schema on every run and prints <strong>drift warnings</strong> when they
        disagree — a column renamed upstream, a table dropped — so manual YAML cannot
        quietly rot. Column types are synced automatically; structural changes are
        flagged for a human to review.
      </p>

      <Callout kind="info" title="Why the split?">
        <p>
          Auto-mapping removes toil where the schema is trustworthy; manual curation
          adds intent where it is not. Both end up as identical raw models — the
          difference is only who decides which tables count: Snowflake&apos;s metadata,
          or a person.
        </p>
      </Callout>

      <h2>Find the raw model</h2>
      <p>
        Suppose you have been asked to stage a reference table of practice opening
        hours. Before writing anything, check whether the raw layer already exposes it.
        Raw models follow{" "}
        <code>raw_&#123;domain&#125;_&#123;table&#125;.sql</code> — in VS Code,
        search for a likely name:
      </p>
      <CodeBlock
        lang="bash"
        code={`
# VS Code: Ctrl+P then type the guess
raw_reference_opening
`}
      />
      <p>
        If you find one, open it — the column list (with cleaned names) tells you
        exactly what you have to work with. Preview it directly:
      </p>
      <CodeBlock lang="bash" code={`dbt show -s raw_reference_opening_hours`} />

      <h2>If the raw model doesn&apos;t exist</h2>
      <p>
        If the table exists in the data lake but has no raw model, run the generation
        pipeline — it will introspect the schema and write both the source YAML and the
        raw model:
      </p>
      <CodeBlock
        lang="bash"
        code={`
python scripts/sources/run_all_source_generation.py
`}
      />
      <p>
        For a table in a volatile schema, add it to the relevant{" "}
        <code>manual_*.yml</code> first (and the mapping to{" "}
        <code>source_mappings.yml</code> with <code>manual: true</code> if the source is
        new), then run the pipeline.
      </p>
      <Callout kind="warn" title="Never hand-edit generated files">
        <p>
          Anything under <code>models/raw/</code> or in an <code>auto_*.yml</code> is
          regenerated on every pipeline run — hand edits are overwritten. If a column
          name looks wrong, the fix belongs in the generator or the manual YAML, not the
          output. Adding a brand-new source feed is usually worth pairing on; ask in the
          team channel.
        </p>
      </Callout>

      <h2>Understand what you found</h2>
      <p>Three questions to answer before you write your staging model:</p>
      <ol>
        <li>
          <strong>What is the grain?</strong> One row per what? Check with a quick{" "}
          <code>dbt show</code> or a count query in Snowflake.
        </li>
        <li>
          <strong>Which columns matter?</strong> Stage what downstream needs, not all 90
          columns because they were there.
        </li>
        <li>
          <strong>Is there an existing staging model already?</strong> Search{" "}
          <code>models/staging/</code> — duplicating one is a common first-PR mistake.
        </li>
      </ol>

      <Checklist
        id="find-source"
        items={[
          { key: "found", label: <>Located the raw model (or generated it)</> },
          {
            key: "kind",
            label: <>Know whether its source is auto-mapped or manual</>,
          },
          { key: "grain", label: <>Can state the grain in one sentence</> },
          {
            key: "nodupe",
            label: <>Checked no staging model for this table already exists</>,
          },
        ]}
      />
    </LessonShell>
  );
}
