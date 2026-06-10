import type { Metadata } from "next";
import { LessonShell } from "@/components/LessonShell";
import { CodeBlock } from "@/components/CodeBlock";
import { Callout } from "@/components/Callout";
import { Quiz } from "@/components/Quiz";

export const metadata: Metadata = { title: "Tests & documentation" };

export default function Page() {
  return (
    <LessonShell
      section="learn"
      slug="tests-and-docs"
      kicker="Learn 04"
      title="Tests & documentation"
      lede="Every model travels with a YAML file: who owns it, what each column means, and the assertions that must hold every single night."
      minutes={7}
    >
      <h2>The YAML next to your SQL</h2>
      <p>
        Beside <code>stg_csds_bridging.sql</code> sits{" "}
        <code>stg_csds_bridging.yml</code>. This one file does three jobs at once —
        ownership, documentation and testing:
      </p>
      <CodeBlock
        lang="yaml"
        title="models/staging/commissioning/stg_csds_bridging.yml"
        code={`
models:
  - name: stg_csds_bridging
    description: Bridging table linking CSDS person identifiers to pseudonymised NHS numbers
    config:
      meta:
        owner:
          name: Your Name
    data_tests:
      - dbt_expectations.expect_table_row_count_to_be_between:
          arguments:
            min_value: 1
    columns:
      - name: person_id
        description: CSDS person identifier
        data_tests:
          - unique
          - not_null
      - name: sk_patient_id
        description: Pseudonymised NHS number (surrogate key for patient)
`}
      />

      <h2>How tests work</h2>
      <p>
        Each entry under <code>data_tests:</code> compiles to a SQL query that searches
        for <strong>rows that break the rule</strong>. Zero rows back = pass.{" "}
        <code>unique</code> on <code>person_id</code> literally runs “group by person_id
        having count(*) &gt; 1”. Tests run when you <code>dbt build</code>, in CI on your
        pull request, and in the nightly production build — so a problem in a feed is
        caught by the pipeline rather than discovered by a dashboard user.
      </p>
      <p>The tests you will use constantly:</p>
      <table>
        <thead>
          <tr>
            <th>Test</th>
            <th>Use it for</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>not_null</code>
            </td>
            <td>Primary keys and columns the model cannot function without</td>
          </tr>
          <tr>
            <td>
              <code>unique</code>
            </td>
            <td>Identifiers that define the grain (one row per person, per spell…)</td>
          </tr>
          <tr>
            <td>
              <code>dbt_utils.unique_combination_of_columns</code>
            </td>
            <td>Composite grains, e.g. person + referral + snapshot week</td>
          </tr>
          <tr>
            <td>
              <code>dbt_expectations.expect_table_row_count_to_be_between</code>
            </td>
            <td>“This table should never be empty” sanity checks</td>
          </tr>
        </tbody>
      </table>

      <Callout kind="tip" title="Test the grain, always">
        <p>
          The single most valuable test is the one that asserts your model&apos;s grain.
          If <code>int_wl_current</code> is “one row per patient per pathway per week”,
          a <code>unique_combination_of_columns</code> on those columns catches the
          classic silent failure: a join that fans out and doubles your counts.
        </p>
      </Callout>

      <h2>Documentation is not optional here</h2>
      <p>
        Column <code>description:</code> fields end up in three places: the dbt docs
        site, Snowflake column comments (we persist docs to the warehouse), and in front
        of the next analyst deciding whether they can trust your column. The{" "}
        <code>owner</code> block is enforced by CI — every model must name a human.
      </p>

      <h2>Don&apos;t write YAML by hand</h2>
      <p>The project ships a generator that scaffolds it from the built model:</p>
      <CodeBlock
        lang="bash"
        code={`
dbt run-operation generate_model_yaml --args '{"model_names": ["stg_your_model"], "upstream_descriptions": true}'
`}
      />
      <p>
        It emits the model and column skeleton with descriptions inherited from upstream
        where they exist. You fill in the gaps and add tests.
      </p>

      <Quiz
        questions={[
          {
            prompt: "A dbt test passes when its compiled query returns…",
            options: [
              "All the rows that satisfy the rule",
              "A single row containing true",
              "Zero rows",
              "A row count matching the model's row count",
            ],
            answer: 2,
            explain:
              "Tests select violations, not successes. unique compiles to a query for duplicated keys; an empty result means no duplicates, so the test passes.",
          },
          {
            prompt:
              "int_wl_current has one row per patient pathway per snapshot week. The best protection against a fanning join is…",
            options: [
              "unique on each of the three grain columns separately",
              "unique_combination_of_columns across the three grain columns together",
              "not_null on the three grain columns",
              "expect_table_row_count_to_be_between with a generous range",
            ],
            answer: 1,
            explain:
              "Separate unique tests would fail immediately — each column legitimately repeats. Only the combination is unique, so only the combination test detects a fan-out. not_null and row counts pass even when rows double.",
          },
        ]}
      />
    </LessonShell>
  );
}
