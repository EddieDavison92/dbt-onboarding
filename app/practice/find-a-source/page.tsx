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
      lede="Every model you write starts from a raw model. Step one is finding it — or discovering it doesn't exist yet."
      minutes={5}
    >
      <h2>Search the raw layer first</h2>
      <p>
        Suppose you have been asked to stage a reference table of practice opening
        hours. Before writing anything, check whether the raw layer already exposes it.
        In VS Code, search <code>models/raw/</code> for a likely name:
      </p>
      <CodeBlock
        lang="bash"
        code={`
# VS Code: Ctrl+P then type the guess
raw_reference_opening
`}
      />
      <p>
        Raw models follow <code>raw_&#123;domain&#125;_&#123;table&#125;.sql</code>. If
        you find one, open it — the column list (with cleaned names) tells you exactly
        what you have to work with. You can also preview it instantly:
      </p>
      <CodeBlock lang="bash" code={`dbt show -s raw_reference_opening_hours`} />

      <h2>If the raw model doesn&apos;t exist</h2>
      <p>
        Raw models and source YAML are <strong>generated, not hand-written</strong>. If
        the table exists in the data lake but has no raw model, run the generation
        pipeline and it will introspect the schema and write both files:
      </p>
      <CodeBlock
        lang="bash"
        code={`
python scripts/sources/run_all_source_generation.py
`}
      />
      <Callout kind="warn" title="Never hand-edit generated files">
        <p>
          Anything under <code>models/raw/</code> or the auto-generated source YAML gets
          overwritten on the next generation run. If a column name looks wrong, fix the
          generator config — not the output. Ask in the team channel if unsure; adding a
          brand-new source feed is usually a job to pair on.
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
          <code>models/staging/</code> — duplicating one is a classic first-PR mistake.
        </li>
      </ol>

      <Checklist
        id="find-source"
        items={[
          { key: "found", label: <>Located the raw model (or generated it)</> },
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
