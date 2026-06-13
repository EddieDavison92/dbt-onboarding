import type { Metadata } from "next";
import { LessonShell } from "@/components/LessonShell";
import { CodeBlock } from "@/components/CodeBlock";
import { Callout } from "@/components/Callout";
import { Checklist } from "@/components/Checklist";
import { GuidedCourseLink } from "@/components/GuidedCourseLink";
import { SourceSetupFlow } from "@/components/SourceSetupFlow";

export const metadata: Metadata = { title: "Find your source" };

export default function Page() {
  return (
    <LessonShell
      section="practice"
      slug="find-a-source"
      kicker="Field guide · 2"
      title="Find your source"
      lede="Find the raw model your staging model will build on — and, when one does not exist yet, add the source that generates it."
      minutes={10}
    >
      <GuidedCourseLink href="/courses/first-pr/find-or-add-the-source" />

      <Callout kind="info" title="Two jobs, very different sizes">
        <p>
          Most models — especially a first one — start from a raw model that{" "}
          <strong>already exists</strong>: that is steps 1–2, and usually all you need.
          Steps 3 onward cover <strong>adding a new source</strong>, a larger,
          project-specific task — editing the source registry, choosing a manual or
          automatic schema, and running the generation pipeline. Reach for it once
          you are comfortable with the dbt basics, and lean on it whenever you genuinely
          need a table the project has never staged.
        </p>
      </Callout>

      <SourceSetupFlow />

      <h2>1 · Write down the table address</h2>
      <p>
        Start with the exact <code>DATABASE.SCHEMA.TABLE</code>{" "}from Snowflake. You
        need the database and schema to choose the route; a table name alone is not enough.
      </p>
      <CodeBlock
        lang="text"
        code={`DATA_LAKE__NCL.ANALYST_MANAGED.OPENING_HOURS`}
      />

      <h2>2 · Search before creating anything</h2>
      <ol>
        <li>
          Press <code>Ctrl+P</code>{" "}and search for the likely staging name, such as
          <code>stg_reference_opening_hours</code>. Reuse it if it exists.
        </li>
        <li>
          Search for the likely raw name, such as
          <code>raw_reference_opening_hours</code>.
        </li>
        <li>
          Search the exact Snowflake table name across the repo in case the project uses
          a source prefix you did not guess.
        </li>
      </ol>
      <CodeBlock lang="bash" code={`dbt show -s raw_reference_opening_hours`} />

      <h2>3 · If raw is missing, inspect the registry</h2>
      <p>
        Open <code>scripts/sources/source_mappings.yml</code>. Search for the schema and
        confirm the database in the same block.
      </p>
      <table>
        <thead>
          <tr>
            <th>What the registry says</th>
            <th>Your next move</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Database/schema found; no <code>manual: true</code></td>
            <td>Do not edit YAML. Run the pipeline.</td>
          </tr>
          <tr>
            <td>Database/schema found with <code>manual: true</code></td>
            <td>Add the table to that source&apos;s <code>manual_*.yml</code>, then run.</td>
          </tr>
          <tr>
            <td>No matching database/schema</td>
            <td>Pair with the team before adding a new mapping.</td>
          </tr>
        </tbody>
      </table>

      <h2>4 · For a manual schema, add one table block</h2>
      <p>
        Open the matching file under <code>models/sources/manual_*.yml</code>. Find the
        existing source and add the table inside its <code>tables:</code>{" "}list. Copy a
        neighbouring block to preserve indentation.
      </p>
      <CodeBlock
        lang="yaml"
        title="models/sources/manual_analyst_managed.yml"
        code={`- name: OPENING_HOURS
  identifier: '"OPENING_HOURS"'
  columns:
  - name: SITE_CODE
    data_type: TEXT
  - name: DAY_OF_WEEK
    data_type: NUMBER(2,0)`}
      />

      <h2>5 · Run generation from the repo root</h2>
      <CodeBlock
        lang="bash"
        code={`python scripts/sources/run_all_source_generation.py`}
      />
      <p>
        Complete the Snowflake browser sign-in. Wait for all four stages to finish:
        metadata query, metadata extract, source YAML, then raw models.
      </p>

      <h2>6 · Inspect and verify the result</h2>
      <CodeBlock
        lang="bash"
        code={`git status --short
git diff -- models/sources models/raw
dbt parse
dbt show -s raw_reference_opening_hours`}
      />
      <p>
        Confirm the expected source YAML changed, the raw model appeared in the mapped
        domain, dbt parses, and the preview shows cleaned snake_case columns. Review any
        unrelated drift with the team before including it in your PR.
      </p>

      <Callout kind="warn" title="Generated means replaceable">
        <p>
          Never hand-edit files under <code>models/raw/</code>{" "}or an{" "}
          <code>auto_*.yml</code>. The next generation run overwrites them. Fix the
          mapping, manual YAML or generator instead.
        </p>
      </Callout>

      <h2>When the input is a seed</h2>
      <p>
        Small, team-owned reference data can live as a CSV under <code>seeds/</code>.
        Load it with <code>dbt seed</code>{" "}and reference it with <code>ref()</code>. Seeds
        are version-controlled reference data, not a home for feeds or patient-level
        records.
      </p>

      <h2>Before writing the model</h2>
      <Checklist
        id="find-source"
        items={[
          { key: "found", label: <>Located or generated the raw model</> },
          { key: "columns", label: <>Reviewed its cleaned columns and sample rows</> },
          { key: "grain", label: <>Can state the source grain in one sentence</> },
          { key: "nodupe", label: <>Confirmed no staging model already exists</> },
        ]}
      />
    </LessonShell>
  );
}
