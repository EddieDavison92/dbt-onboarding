import type { Metadata } from "next";
import { LessonShell } from "@/components/LessonShell";
import { CodeBlock } from "@/components/CodeBlock";
import { Callout } from "@/components/Callout";
import { Checklist } from "@/components/Checklist";

export const metadata: Metadata = { title: "Build & test locally" };

export default function Page() {
  return (
    <LessonShell
      section="practice"
      slug="build-and-test"
      kicker="Do · Step 5"
      title="Build & test locally"
      lede="One command builds your model and runs its tests in your dev schema. A clean local build means CI should pass first time."
      minutes={8}
    >
      <h2>dbt build</h2>
      <CodeBlock
        lang="bash"
        code={`
dbt build -s stg_reference_opening_hours
`}
      />
      <p>
        <code>build</code> = run the model <em>and</em> its tests, in order. Output you
        want to see:
      </p>
      <CodeBlock
        lang="text"
        code={`
1 of 4 OK created sql view model DBT_STAGING.stg_reference_opening_hours  [SUCCESS]
2 of 4 PASS not_null_stg_reference_opening_hours_site_code                [PASS]
3 of 4 PASS dbt_utils_unique_combination_of_columns_...                   [PASS]
4 of 4 PASS expect_table_row_count_to_be_between_...                      [PASS]
Completed successfully
`}
      />

      <h2>Selection syntax you&apos;ll use daily</h2>
      <table>
        <thead>
          <tr>
            <th>Command</th>
            <th>Builds</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>dbt build -s my_model</code>
            </td>
            <td>Just your model + its tests</td>
          </tr>
          <tr>
            <td>
              <code>dbt build -s +my_model</code>
            </td>
            <td>Everything upstream first, then your model</td>
          </tr>
          <tr>
            <td>
              <code>dbt build -s my_model+</code>
            </td>
            <td>Your model, then everything downstream of it</td>
          </tr>
          <tr>
            <td>
              <code>.\build_changed.ps1</code>
            </td>
            <td>Only what you changed on your branch (project helper)</td>
          </tr>
        </tbody>
      </table>

      <h2>When a test fails</h2>
      <p>
        A failure prints the test name and a count. To see the offending rows, compile
        the test and run its SQL — or quicker, ask dbt to show you:
      </p>
      <CodeBlock
        lang="bash"
        code={`
# the compiled test query lives here after a build:
target/compiled/wnl_analytics/models/.../stg_reference_opening_hours.yml/...

# run it in Snowflake, or preview the model and eyeball the duplicates:
dbt show -s stg_reference_opening_hours --limit 20
`}
      />
      <p>Typical first-model failures, in order of likelihood:</p>
      <ul>
        <li>
          <strong>Grain test fails</strong> — the source has duplicates you did not
          expect. Decide: is the grain wrong, or does the source need deduplication
          (and is that a conversation)?
        </li>
        <li>
          <strong>not_null fails</strong> — nulls are real in the feed. Either the column
          is not as mandatory as you assumed, or the rows are junk worth flagging.
        </li>
        <li>
          <strong>Compilation error</strong> — a typo in a <code>ref()</code> name. The
          error message names the missing model.
        </li>
      </ul>

      <Callout kind="tip" title="Failing tests are findings">
        <p>
          Your test failing on real data is the system working — you just learned
          something about the feed nobody had written down. Mention it in your PR
          description; that observation is half the value of the change.
        </p>
      </Callout>

      <Checklist
        id="build"
        items={[
          { key: "green", label: <><code>dbt build -s your_model</code> is fully green</> },
          { key: "downstream", label: <>If you changed an existing model: <code>dbt build -s your_model+</code> still green</> },
        ]}
      />
    </LessonShell>
  );
}
