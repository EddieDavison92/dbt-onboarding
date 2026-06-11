import type { Metadata } from "next";
import { LessonShell } from "@/components/LessonShell";
import { CodeBlock } from "@/components/CodeBlock";
import { Callout } from "@/components/Callout";
import { Checklist } from "@/components/Checklist";
import { GuidedCourseLink } from "@/components/GuidedCourseLink";

export const metadata: Metadata = { title: "Find your source" };

export default function Page() {
  return (
    <LessonShell
      section="practice"
      slug="find-a-source"
      kicker="Field guide · 2"
      title="Find your source"
      lede="Search before creating anything, then follow the source route the project already uses."
      minutes={5}
    >
      <GuidedCourseLink href="/courses/first-pr/find-or-add-the-source" />

      <h2>Search in this order</h2>
      <ol>
        <li>
          Search <code>models/staging/</code>. If the table already has a staging model,
          use it rather than creating a second one.
        </li>
        <li>
          Search <code>models/raw/</code> for a likely{" "}
          <code>raw_&#123;domain&#125;_&#123;table&#125;.sql</code> name.
        </li>
        <li>
          Open the raw model and use its cleaned column names. Preview it before writing
          downstream SQL.
        </li>
      </ol>
      <CodeBlock lang="bash" code={`dbt show -s raw_reference_opening_hours`} />

      <h2>If the raw model is missing</h2>
      <ul>
        <li>
          <strong>Auto-mapped schema:</strong> run the source-generation pipeline. It
          discovers the table and writes the source YAML and raw model.
        </li>
        <li>
          <strong>Manual schema:</strong> add the table to the relevant{" "}
          <code>manual_*.yml</code>, then run the pipeline.
        </li>
        <li>
          <strong>New source or uncertain mapping:</strong> pair with someone. Changes to{" "}
          <code>source_mappings.yml</code> affect more than one model.
        </li>
      </ul>
      <CodeBlock
        lang="bash"
        code={`python scripts/sources/run_all_source_generation.py`}
      />
      <Callout kind="warn" title="Generated means replaceable">
        <p>
          Never hand-edit files under <code>models/raw/</code> or an{" "}
          <code>auto_*.yml</code>. The next generation run overwrites them. Fix the
          mapping, manual YAML or generator instead.
        </p>
      </Callout>

      <h2>When the input is a seed</h2>
      <p>
        Small, team-owned reference data can live as a CSV under <code>seeds/</code>.
        Load it with <code>dbt seed</code> and reference it with <code>ref()</code>. Seeds
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
