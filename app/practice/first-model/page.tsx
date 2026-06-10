import type { Metadata } from "next";
import { LessonShell } from "@/components/LessonShell";
import { CodeBlock } from "@/components/CodeBlock";
import { Callout } from "@/components/Callout";
import { Checklist } from "@/components/Checklist";

export const metadata: Metadata = { title: "Write a staging model" };

export default function Page() {
  return (
    <LessonShell
      section="practice"
      slug="first-model"
      kicker="Do · Step 3"
      title="Write a staging model"
      lede="One file, one SELECT, project conventions throughout. This is the smallest real contribution you can make — which is exactly why it's the first."
      minutes={10}
    >
      <h2>Create the file</h2>
      <p>
        Staging models live under <code>models/staging/&#123;domain&#125;/</code> and are
        named <code>stg_&#123;source&#125;_&#123;table&#125;.sql</code>. For our practice
        example:
      </p>
      <CodeBlock
        lang="bash"
        code={`models/staging/shared/stg_reference_opening_hours.sql`}
      />

      <h2>Write the SELECT</h2>
      <CodeBlock
        lang="sql"
        title="stg_reference_opening_hours.sql"
        code={`
select
    organisation_code,
    upper(trim(site_code)) as site_code,
    day_of_week,
    opens_at::time as opens_at,
    closes_at::time as closes_at,
    is_open_24h::boolean as is_open_24h
from {{ ref('raw_reference_opening_hours') }}
`}
      />
      <p>What makes this a good staging model:</p>
      <ul>
        <li>
          <strong>Refs the raw model</strong>, never <code>source()</code>, never a
          hardcoded table.
        </li>
        <li>
          <strong>Explicit columns</strong> — no <code>select *</code>. You are defining
          the interface downstream models rely on.
        </li>
        <li>
          <strong>Light cleaning only</strong>: trims, casts, renames to conventions
          (e.g. pseudo NHS number columns always become <code>sk_patient_id</code>).
        </li>
        <li>
          <strong>No joins, no filters with business meaning.</strong> If you are tempted
          to join — that is an <code>int_</code> model, next layer up.
        </li>
        <li>
          <strong>Lowercase keywords</strong> — SQLFluff in CI enforces it.
        </li>
      </ul>

      <Callout kind="smell" title="Three common staging-model mistakes">
        <p>
          1) <code>select *</code> (interface undefined), 2) a join “just to add the
          name column” (business logic in staging), 3) filtering out rows someone might
          need (“I removed closed sites” — downstream models decide that).
        </p>
      </Callout>

      <h2>Bigger models: use CTEs</h2>
      <p>
        Staging rarely needs them, but from the modelling layer up the house style is
        named CTEs that read like a pipeline:
      </p>
      <CodeBlock
        lang="sql"
        title="the shape of an int_ model"
        code={`
with most_recent_week as (
    select max(week_ending_date) as max_date
    from {{ ref('stg_wl_wl_openpathways_data') }}
),

current_snapshot as (
    select wl.*
    from {{ ref('stg_wl_wl_openpathways_data') }} wl
    inner join most_recent_week mrw
        on wl.week_ending_date = mrw.max_date
)

select
    week_ending_date,
    sk_patient_id,
    datediff(day, referral_request_received_date::date, week_ending_date::date)
        as days_on_waiting_list
from current_snapshot
`}
      />

      <h2>Preview as you go</h2>
      <CodeBlock
        lang="bash"
        code={`
dbt show -s stg_reference_opening_hours        # first 5 rows
dbt compile -s stg_reference_opening_hours     # see the rendered SQL
`}
      />
      <p>
        In VS Code the dbt extension gives you both on a click, plus live lineage of
        your new model sitting on top of its raw parent.
      </p>

      <Checklist
        id="first-model"
        items={[
          { key: "file", label: <>File created in the right folder with a <code>stg_</code> name</> },
          { key: "ref", label: <>Reads from <code>ref()</code>, explicit column list</> },
          { key: "show", label: <><code>dbt show</code> returns sensible rows</> },
        ]}
      />
    </LessonShell>
  );
}
