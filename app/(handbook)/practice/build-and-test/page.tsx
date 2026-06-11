import type { Metadata } from "next";
import { LessonShell } from "@/components/LessonShell";
import { CodeBlock } from "@/components/CodeBlock";
import { Callout } from "@/components/Callout";
import { Checklist } from "@/components/Checklist";
import { GuidedCourseLink } from "@/components/GuidedCourseLink";

export const metadata: Metadata = { title: "Build & test locally" };

export default function Page() {
  return (
    <LessonShell
      section="practice"
      slug="build-and-test"
      kicker="Field guide · 5"
      title="Build & test locally"
      lede="Choose the smallest useful build, then treat failures as information about either the code or the data."
      minutes={5}
    >
      <GuidedCourseLink href="/courses/first-pr/build-and-test" />

      <h2>Daily selectors</h2>
      <table>
        <thead>
          <tr>
            <th>Command</th>
            <th>Use it when</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>dbt build -s my_model</code></td>
            <td>You changed one model and its tests.</td>
          </tr>
          <tr>
            <td><code>dbt build -s +my_model</code></td>
            <td>You also need its upstream dependencies built first.</td>
          </tr>
          <tr>
            <td><code>dbt build -s my_model+</code></td>
            <td>You changed an existing contract and need to test downstream impact.</td>
          </tr>
          <tr>
            <td><code>.\build_changed.ps1</code></td>
            <td>You want the project helper to select branch changes.</td>
          </tr>
        </tbody>
      </table>

      <h2>Triage a failure</h2>
      <ol>
        <li>Read the first failing node and the final error, not the whole log at once.</li>
        <li>Fix compilation and missing-reference errors before investigating tests.</li>
        <li>For a failed test, inspect the rows that break the assertion.</li>
        <li>Decide whether the code is wrong or the test exposed a real source condition.</li>
      </ol>
      <CodeBlock
        lang="bash"
        code={`
dbt show -s my_model --limit 20
dbt compile -s my_model
`}
      />

      <h2>Common first-model failures</h2>
      <ul>
        <li>
          <strong>Grain test:</strong> check whether the stated grain is wrong, the
          source contains duplicates, or a join multiplied rows.
        </li>
        <li>
          <strong>not_null:</strong> inspect the null rows before weakening the test.
          Null may be valid, or it may reveal a feed problem.
        </li>
        <li>
          <strong>Missing model:</strong> compare the name inside <code>ref()</code>{" "}
          with the actual filename.
        </li>
      </ul>
      <Callout kind="tip" title="Write down what the failure taught you">
        <p>
          If the data surprised you, capture that decision in a description, test or PR
          note. A green build without the reasoning is only half the work.
        </p>
      </Callout>

      <Checklist
        id="build"
        items={[
          { key: "green", label: <><code>dbt build -s your_model</code> is green</> },
          { key: "downstream", label: <>Existing contracts were checked downstream where needed</> },
          { key: "finding", label: <>Any unexpected data condition is documented</> },
        ]}
      />
    </LessonShell>
  );
}
