import type { Metadata } from "next";
import { LessonShell } from "@/components/LessonShell";
import { CodeBlock } from "@/components/CodeBlock";
import { Callout } from "@/components/Callout";
import { Checklist } from "@/components/Checklist";
import { GuidedCourseLink } from "@/components/GuidedCourseLink";

export const metadata: Metadata = { title: "Write a staging model" };

export default function Page() {
  return (
    <LessonShell
      section="practice"
      slug="first-model"
      kicker="Field guide · 3"
      title="Write a staging model"
      lede="The staging contract: an explicit SELECT that cleans one raw input without adding business logic."
      minutes={5}
    >
      <GuidedCourseLink href="/courses/first-pr/write-the-model" />

      <h2>Place and name it</h2>
      <p>
        Use <code>models/staging/&#123;domain&#125;/</code> and a{" "}
        <code>stg_&#123;source&#125;_&#123;table&#125;.sql</code> filename. Folder
        placement supplies project configuration, so check a neighbouring model before
        inventing a new path.
      </p>
      <CodeBlock
        lang="text"
        code={`models/staging/shared/stg_reference_opening_hours.sql`}
      />

      <h2>Use the staging contract</h2>
      <CodeBlock
        lang="sql"
        title="stg_reference_opening_hours.sql"
        code={`
select
    organisation_code,
    upper(trim(site_code)) as site_code,
    day_of_week,
    opens_at::time as opens_at,
    closes_at::time as closes_at
from {{ ref('raw_reference_opening_hours') }}
`}
      />
      <ul>
        <li>
          Read one raw model with <code>ref()</code>. Do not call{" "}
          <code>source()</code> or hardcode a database table.
        </li>
        <li>
          Select columns explicitly. Rename, trim and cast into project conventions.
        </li>
        <li>
          Keep every source row unless removing it is basic technical cleaning.
        </li>
        <li>
          Move joins, derived business rules and analytical filters into an{" "}
          <code>int_</code> model.
        </li>
      </ul>

      <Callout kind="smell" title="Stop if the model is doing two jobs">
        <p>
          A staging model should be easy to describe as “this source table, cleaned”.
          If the sentence needs “joined with”, “only active records” or “calculated
          eligibility”, the logic belongs in the modelling layer.
        </p>
      </Callout>

      <h2>Check as you write</h2>
      <CodeBlock
        lang="bash"
        code={`
dbt show -s stg_reference_opening_hours
dbt compile -s stg_reference_opening_hours
`}
      />
      <p>
        Read the sample rows, not just the green status. Check the grain, nulls, casing
        and type conversions against what you know about the source.
      </p>

      <Checklist
        id="first-model"
        items={[
          { key: "file", label: <>Correct folder and <code>stg_</code> name</> },
          { key: "ref", label: <>One raw <code>ref()</code> and explicit columns</> },
          { key: "scope", label: <>No joins or business filters</> },
          { key: "show", label: <><code>dbt show</code> returns sensible rows</> },
        ]}
      />
    </LessonShell>
  );
}
