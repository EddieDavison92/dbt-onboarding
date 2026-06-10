import type { Metadata } from "next";
import { LessonShell } from "@/components/LessonShell";
import { CodeBlock } from "@/components/CodeBlock";
import { Callout } from "@/components/Callout";
import { Quiz } from "@/components/Quiz";

export const metadata: Metadata = { title: "Materialisations" };

export default function Page() {
  return (
    <LessonShell
      section="advanced"
      slug="materialisations"
      kicker="Going further 02"
      title="Materialisations"
      lede="The same SELECT can become a view, a table, or an incremental table that only processes new rows. Choosing well is the difference between a 2-second build and a 2-hour one."
      minutes={7}
    >
      <h2>What a materialisation is</h2>
      <p>
        Your model is a SELECT; the materialisation decides what dbt turns it into in
        Snowflake. You rarely need to choose — the project sets sensible defaults by
        layer — but knowing the options explains why builds behave the way they do.
      </p>
      <table>
        <thead>
          <tr>
            <th>Materialisation</th>
            <th>What it builds</th>
            <th>Default for</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>view</code>
            </td>
            <td>A view — no data stored, query runs at read time</td>
            <td>Raw and staging layers</td>
          </tr>
          <tr>
            <td>
              <code>table</code>
            </td>
            <td>A table, rebuilt from scratch every run</td>
            <td>Modelling, reporting, published</td>
          </tr>
          <tr>
            <td>
              <code>incremental</code>
            </td>
            <td>A table that only processes new/changed rows after the first build</td>
            <td>Opt-in, for very large data</td>
          </tr>
          <tr>
            <td>
              <code>ephemeral</code>
            </td>
            <td>Nothing — inlined as a CTE into downstream models</td>
            <td>Rare; small shared snippets</td>
          </tr>
        </tbody>
      </table>
      <p>
        The logic of the defaults: staging is cheap renaming, so views keep it always
        fresh for free. Modelling and reporting do real computation, so tables pay the
        cost once per night instead of on every query.
      </p>

      <h2>Overriding per model</h2>
      <p>
        A <code>config()</code> block at the top of the model wins over the project
        default:
      </p>
      <CodeBlock
        lang="sql"
        code={`
{{
    config(
        materialized='view'
    )
}}

select ...
`}
      />

      <h2>Incremental models</h2>
      <p>
        A full rebuild of a multi-billion-row activity table every night is wasteful
        when yesterday is the only new data. An incremental model builds the full table
        once, then on later runs only processes rows matching the{" "}
        <code>is_incremental()</code> filter and merges them in:
      </p>
      <CodeBlock
        lang="sql"
        title="the incremental pattern"
        code={`
{{
    config(
        materialized='incremental',
        unique_key='event_id'
    )
}}

select
    event_id,
    sk_patient_id,
    event_date,
    ...
from {{ ref('stg_big_event_feed') }}

{% if is_incremental() %}
  -- only rows newer than what's already in this table
  where event_date > (select max(event_date) from {{ this }})
{% endif %}
`}
      />
      <ul>
        <li>
          <code>{"{{ this }}"}</code> refers to the already-built table itself.
        </li>
        <li>
          <code>unique_key</code> lets dbt update changed rows rather than duplicate
          them.
        </li>
        <li>
          <code>dbt build --full-refresh -s my_model</code> drops and rebuilds from
          scratch — your reset button after logic changes.
        </li>
      </ul>

      <Callout kind="warn" title="Incremental is a performance tool, not a default">
        <p>
          Incremental models add real complexity: late-arriving data, schema changes and
          logic edits all need thought, and a model that silently misses updates is worse
          than a slow one. Reach for it when a table rebuild is measurably painful —
          and expect the review to probe your <code>is_incremental()</code> filter.
        </p>
      </Callout>

      <Quiz
        questions={[
          {
            prompt: "Staging models are views because…",
            options: [
              "Views are more secure",
              "They do trivial work, so storing nothing and staying always-fresh is free",
              "Snowflake charges less for views",
              "dbt cannot build tables from staging",
            ],
            answer: 1,
            explain:
              "A rename-and-cast SELECT costs almost nothing at query time. Tables earn their storage where real computation happens.",
          },
          {
            prompt: "You changed the logic of an incremental model. What must you remember?",
            options: [
              "Nothing — dbt detects logic changes",
              "Run with --full-refresh so history is rebuilt under the new logic",
              "Delete the model file and recreate it",
              "Change the unique_key",
            ],
            answer: 1,
            explain:
              "Incremental runs only touch new rows; existing rows keep the old logic until a full refresh rebuilds them.",
          },
        ]}
      />
    </LessonShell>
  );
}
