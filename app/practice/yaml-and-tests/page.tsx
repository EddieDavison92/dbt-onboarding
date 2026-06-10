import type { Metadata } from "next";
import { LessonShell } from "@/components/LessonShell";
import { CodeBlock } from "@/components/CodeBlock";
import { Callout } from "@/components/Callout";
import { Checklist } from "@/components/Checklist";

export const metadata: Metadata = { title: "Add the YAML" };

export default function Page() {
  return (
    <LessonShell
      section="practice"
      slug="yaml-and-tests"
      kicker="Do · Step 4"
      title="Add the YAML"
      lede="Owner, descriptions, tests. CI will not let a model in without them — and the generator writes most of it for you."
      minutes={8}
    >
      <h2>Scaffold it</h2>
      <p>Build your model first (the generator reads its columns from the warehouse):</p>
      <CodeBlock
        lang="bash"
        code={`
dbt run -s stg_reference_opening_hours
dbt run-operation generate_model_yaml --args '{"model_names": ["stg_reference_opening_hours"], "upstream_descriptions": true}'
`}
      />
      <p>
        Paste the output into <code>stg_reference_opening_hours.yml</code> next to your
        SQL file, then make it yours:
      </p>
      <CodeBlock
        lang="yaml"
        title="stg_reference_opening_hours.yml"
        code={`
models:
  - name: stg_reference_opening_hours
    description: Site opening hours reference, one row per site per day of week
    config:
      meta:
        owner:
          name: Your Name
    data_tests:
      - dbt_expectations.expect_table_row_count_to_be_between:
          arguments:
            min_value: 1
      - dbt_utils.unique_combination_of_columns:
          arguments:
            combination_of_columns:
              - site_code
              - day_of_week
    columns:
      - name: site_code
        description: Standardised site identifier
        data_tests:
          - not_null
      - name: day_of_week
        description: ISO day of week (1 = Monday)
        data_tests:
          - not_null
      - name: opens_at
        description: Opening time, local
`}
      />

      <h2>What to actually test</h2>
      <ol>
        <li>
          <strong>The grain</strong> — here, one row per site per weekday → a{" "}
          <code>unique_combination_of_columns</code> on both.
        </li>
        <li>
          <strong>Not-null on the keys</strong> the grain depends on.
        </li>
        <li>
          <strong>Row count &gt; 0</strong> — the cheapest possible “did the feed
          vanish?” alarm.
        </li>
      </ol>
      <p>
        Three tests is a perfectly good number for a staging model. Twenty assertions on
        a staging view is noise; the grain test is the one that earns its keep.
      </p>

      <Callout kind="warn" title="data_tests, not tests">
        <p>
          The YAML key is <code>data_tests:</code> — the old <code>tests:</code> key is
          deprecated and the repo has been migrated. Same for arguments: nest them under{" "}
          <code>arguments:</code> as shown above.
        </p>
      </Callout>

      <Callout kind="tip" title="Descriptions people thank you for">
        <p>
          Write what a stranger needs: units, source quirks, what null means. “ISO day
          of week (1 = Monday)” beats “the day of the week” forever.
        </p>
      </Callout>

      <Checklist
        id="yaml"
        items={[
          { key: "owner", label: <>Owner block has your name</> },
          { key: "grain", label: <>Grain is tested (unique or unique_combination_of_columns)</> },
          { key: "desc", label: <>Model + key columns have real descriptions</> },
        ]}
      />
    </LessonShell>
  );
}
