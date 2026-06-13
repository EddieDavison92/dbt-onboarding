import type { Metadata } from "next";
import { LessonShell } from "@/components/LessonShell";
import { CodeBlock } from "@/components/CodeBlock";
import { Callout } from "@/components/Callout";
import { Checklist } from "@/components/Checklist";
import { GuidedCourseLink } from "@/components/GuidedCourseLink";

export const metadata: Metadata = { title: "Add the YAML" };

export default function Page() {
  return (
    <LessonShell
      section="practice"
      slug="yaml-and-tests"
      kicker="Field guide · 4"
      title="Add the YAML"
      lede="Generate the boilerplate, then add the ownership, meaning and assertions only you can supply."
      minutes={5}
    >
      <GuidedCourseLink href="/courses/first-pr/describe-and-test" />

      <h2>Generate the starting point</h2>
      <CodeBlock
        lang="bash"
        code={`
dbt run -s stg_reference_opening_hours
dbt run-operation generate_model_yaml --args '{"model_names": ["stg_reference_opening_hours"], "upstream_descriptions": true}'
`}
      />
      <p>
        Save the output beside the SQL as <code>stg_reference_opening_hours.yml</code>.
        The generator knows the columns; it does not know what they mean or what must be
        true about the data.
      </p>

      <Callout kind="info" title="Read the YAML shape">
        <p>
          A colon names a property, a dash starts an item in a list, and indentation says
          what belongs inside what. Use two spaces for each level and never tabs. Your
          descriptions do not need prescribed wording; dbt needs valid structure.
        </p>
      </Callout>

      <h2>Add the decisions</h2>
      <CodeBlock
        lang="yaml"
        title="the parts to review"
        code={`
models:
  - name: stg_reference_opening_hours
    description: Site opening hours, one row per site per weekday
    config:
      meta:
        owner:
          name: Your Name
    data_tests:
      - dbt_utils.unique_combination_of_columns:
          arguments:
            combination_of_columns: [site_code, day_of_week]
    columns:
      - name: site_code
        description: Standardised site identifier
        data_tests: [not_null]
`}
      />
      <ul>
        <li>
          Put the grain in the model description: <em>one row per what?</em>
        </li>
        <li>
          Test that grain with <code>unique</code>{" "}or{" "}
          <code>unique_combination_of_columns</code>.
        </li>
        <li>
          Add <code>not_null</code>{" "}only where null would break the model&apos;s
          contract.
        </li>
        <li>
          Describe units, codes, source quirks and what null means. Avoid repeating the
          column name in prose.
        </li>
      </ul>

      <Callout kind="warn" title="Use the current YAML shape">
        <p>
          Use <code>data_tests:</code>, with package test arguments nested under{" "}
          <code>arguments:</code>. The older <code>tests:</code>{" "}form has been migrated
          out of this project.
        </p>
      </Callout>

      <Checklist
        id="yaml"
        items={[
          { key: "owner", label: <>Owner names a real person</> },
          { key: "grain", label: <>Description states the grain and a test enforces it</> },
          { key: "nulls", label: <>Key null assumptions are tested</> },
          { key: "desc", label: <>Descriptions add meaning, units or source context</> },
        ]}
      />
    </LessonShell>
  );
}
