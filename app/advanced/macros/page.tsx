import type { Metadata } from "next";
import { LessonShell } from "@/components/LessonShell";
import { CodeBlock } from "@/components/CodeBlock";
import { Callout } from "@/components/Callout";
import { Quiz } from "@/components/Quiz";

export const metadata: Metadata = { title: "Macros" };

export default function Page() {
  return (
    <LessonShell
      section="advanced"
      slug="macros"
      kicker="Going further 01"
      title="Macros"
      lede="The 40-line age-band CASE statement already exists, is already tested, and already agrees with everyone else's age bands. Call it instead of writing it."
      minutes={5}
    >
      <h2>SQL functions, written in Jinja</h2>
      <p>
        A macro is a reusable snippet of SQL with parameters. Anything between{" "}
        <code>{"{% … %}"}</code> or <code>{"{{ … }}"}</code> in a model is Jinja — dbt
        renders it to plain SQL before Snowflake ever sees it. You have been using macros
        all along: <code>ref()</code> and <code>source()</code> are macros.
      </p>
      <p>
        The project keeps shared ones in <code>macros/</code>. The flagship example —
        instead of hand-writing age bands:
      </p>
      <CodeBlock
        lang="sql"
        title="any model that needs age attributes"
        code={`
select
    person_id,
    {{ calculate_age_attributes('birth_date', 'current_date()') }}
from {{ ref('stg_olids_patient') }}
`}
      />
      <p>
        That single call expands into <code>age</code>, <code>age_band_5y</code>,{" "}
        <code>age_band_10y</code>, <code>age_band_nhs</code>, <code>age_band_ons</code>,{" "}
        <code>life_stage</code> and school-age flags — consistent across every model that
        uses it. When the definition of a band changes, it changes once.
      </p>

      <h2>The ones you will reach for</h2>
      <table>
        <thead>
          <tr>
            <th>Macro</th>
            <th>What it does</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>calculate_age_attributes()</code>
            </td>
            <td>Age plus every standard age band and life stage</td>
          </tr>
          <tr>
            <td>
              <code>deduplicate_table()</code>
            </td>
            <td>Removes duplicate rows by key + ordering rule</td>
          </tr>
          <tr>
            <td>
              <code>join_concept_display()</code>
            </td>
            <td>Joins clinical concept codes to display terms</td>
          </tr>
          <tr>
            <td>
              <code>clean_icd10_code()</code> / <code>clean_organisation_id()</code>
            </td>
            <td>Standardise messy identifiers</td>
          </tr>
          <tr>
            <td>
              <code>temporal_join()</code>
            </td>
            <td>“What was true at the time” joins against effective-dated tables</td>
          </tr>
          <tr>
            <td>
              <code>qof_reference_date()</code>
            </td>
            <td>The current QOF reference date, overridable with --vars</td>
          </tr>
        </tbody>
      </table>

      <Callout kind="tip" title="The rule of three">
        <p>
          Pasted the same logic into a second model? Fine. A third? Stop — it wants to be
          a macro (or an <code>int_</code> model, if it is more data than logic). Ask in
          review if unsure; promoting logic later is much harder than starting it in the
          right place.
        </p>
      </Callout>

      <Callout kind="warn">
        <p>
          Macros are rendered <em>before</em> the SQL runs — they cannot react to data,
          only to arguments and project config. If your logic needs to read rows to make
          decisions, it belongs in a model, not a macro.
        </p>
      </Callout>

      <Quiz
        questions={[
          {
            prompt: "When does macro Jinja get evaluated?",
            options: [
              "At query time, inside Snowflake",
              "At compile time, before the SQL is sent to Snowflake",
              "Nightly, by the scheduler",
              "Only during dbt test",
            ],
            answer: 1,
            explain:
              "dbt renders Jinja to plain SQL first. dbt compile shows you exactly what Snowflake will receive — useful for debugging.",
          },
        ]}
      />
    </LessonShell>
  );
}
