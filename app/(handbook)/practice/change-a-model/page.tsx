import type { Metadata } from "next";
import Link from "next/link";
import { LessonShell } from "@/components/LessonShell";
import { CodeBlock } from "@/components/CodeBlock";
import { Callout } from "@/components/Callout";
import { Checklist } from "@/components/Checklist";

export const metadata: Metadata = { title: "Change an existing model" };

export default function Page() {
  return (
    <LessonShell
      section="practice"
      slug="change-a-model"
      kicker="Field guide · 8"
      title="Change an existing model"
      lede="Most work is not a new model — it is a change to one that other models already depend on. Look downstream before you edit, not after CI does."
      minutes={6}
    >
      <h2>Before you edit: measure the blast radius</h2>
      <CodeBlock
        lang="bash"
        code={`
dbt ls -s my_model+        # everything downstream of the model
dbt ls -s my_model+ | wc -l
`}
      />
      <ul>
        <li>
          A handful of downstream models: read them; you can probably verify the
          whole set yourself.
        </li>
        <li>
          Dozens: read the direct children, then rely on their tests — and say
          so in the PR.
        </li>
        <li>
          Check the YAML of affected models for <code>owner</code>{" "}names. A
          breaking change to someone else&apos;s model deserves a heads-up
          before the PR, not a surprise in review.
        </li>
      </ul>

      <h2>Classify the change</h2>
      <table>
        <thead>
          <tr>
            <th>Change</th>
            <th>Risk</th>
            <th>What it needs</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Add a column</td>
            <td>Low</td>
            <td>Document and test it; downstream models are unaffected.</td>
          </tr>
          <tr>
            <td>Rename or remove a column</td>
            <td>Breaking</td>
            <td>
              Find every usage and update it in the same PR. The{" "}
              <Link href="/advanced/dbt-extension">dbt extension</Link>{" "}renames a
              column across the project by lineage, not text-matching.
            </td>
          </tr>
          <tr>
            <td>Change a filter, join or derivation</td>
            <td>Silent</td>
            <td>
              The columns look identical but the numbers change. Say exactly what
              moves and why in the PR; downstream owners judge the impact.
            </td>
          </tr>
          <tr>
            <td>Change the grain</td>
            <td>Contract</td>
            <td>
              Every consumer&apos;s assumptions break. Talk to downstream owners
              first, update the grain test, and treat it as a coordinated change.
            </td>
          </tr>
        </tbody>
      </table>

      <h2>Prove it locally</h2>
      <CodeBlock
        lang="bash"
        code={`
dbt build -s my_model+     # rebuild the model AND everything downstream, tests included
`}
      />
      <p>
        Downstream tests are the point: a green build of just your model proves
        nothing about the models that read it. For a very wide selection, build the
        direct children at minimum and say in the PR how far you verified.
      </p>
      <Callout kind="warn" title="Incremental models remember the past">
        <p>
          If the model (or a downstream one) is incremental, a logic change only
          applies to new rows until someone runs a{" "}
          <code>--full-refresh</code>. That usually means a deliberate production
          run after merge — see{" "}
          <Link href="/advanced/materialisations">materialisations</Link>{" "}and
          flag it in the PR so it is planned, not discovered.
        </p>
      </Callout>

      <h2>In the PR</h2>
      <ul>
        <li>Name the models affected downstream and what changes for them.</li>
        <li>State how far you built and tested (<code>my_model+</code>, or which subset).</li>
        <li>
          For semantic changes, show before/after numbers for one example the
          reviewer can check.
        </li>
      </ul>

      <Checklist
        id="change-a-model"
        items={[
          { key: "ls", label: <><code>dbt ls -s my_model+</code>{" "}reviewed before editing</> },
          { key: "class", label: <>Change classified — additive, breaking, silent or contract</> },
          { key: "built", label: <>Downstream built and tested locally, or the limit stated in the PR</> },
          { key: "owners", label: <>Owners of affected models know about breaking or silent changes</> },
        ]}
      />
    </LessonShell>
  );
}
