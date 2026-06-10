import type { Metadata } from "next";
import { LessonShell } from "@/components/LessonShell";
import { CodeBlock } from "@/components/CodeBlock";
import { Callout } from "@/components/Callout";
import { Quiz } from "@/components/Quiz";

export const metadata: Metadata = { title: "Clustering" };

export default function Page() {
  return (
    <LessonShell
      section="advanced"
      slug="clustering"
      kicker="Going further 03"
      title="Clustering"
      lede="Snowflake stores tables in micro-partitions and skips those a query cannot match. cluster_by orders the data so that pruning is effective."
      minutes={5}
    >
      <h2>How Snowflake stores data</h2>
      <p>
        Every table is split into <strong>micro-partitions</strong> — compressed chunks
        of rows. For each chunk Snowflake records the min and max of every column. When
        a query filters on <code>person_id = 123</code>, chunks whose person_id range
        cannot contain 123 are never read at all. This is{" "}
        <strong>partition pruning</strong>. It happens automatically, but it is only
        effective when similar values are stored together: in a table loaded in random
        order, every chunk spans the whole range of person_ids and nothing can be
        skipped.
      </p>
      <p>
        <code>cluster_by</code> tells dbt to sort the data as it builds the table, so
        values that are queried together are stored together.
      </p>

      <h2>The project pattern</h2>
      <p>
        You will see this constantly in reporting and published models — it is one line
        in the same <code>config()</code> block you already know:
      </p>
      <CodeBlock
        lang="sql"
        title="models/reporting/olids/disease_registers/fct_person_adhd_register.sql"
        code={`
{{
    config(
        cluster_by=['person_id'])
}}

select ...
`}
      />
      <p>The project conventions:</p>
      <ul>
        <li>
          <strong>Person-level models cluster on <code>person_id</code></strong> —
          disease registers, vaccination status, dimensions. Most queries against them
          filter or join on person, so that is the column pruning must work for.
        </li>
        <li>
          <strong>Dashboard bases cluster on their filter columns</strong> — for
          example the covid/flu dashboard base uses{" "}
          <code>cluster_by=[&apos;programme_type&apos;, &apos;campaign_id&apos;,
          &apos;practice_code&apos;, &apos;person_id&apos;]</code>, matching the order
          users slice the dashboard.
        </li>
        <li>
          <strong>Event-style tables add the date</strong> —{" "}
          <code>cluster_by=[&apos;person_id&apos;, &apos;effective_date&apos;]</code>.
        </li>
      </ul>

      <h2>Choosing columns</h2>
      <ol>
        <li>
          <strong>Cluster by what downstream queries filter and join on</strong>, not by
          what the model groups by internally.
        </li>
        <li>
          <strong>Order matters</strong>: put the coarser, most-filtered column first.
          A handful of columns is the ceiling — more dilutes the benefit.
        </li>
        <li>
          <strong>Small tables don&apos;t need it.</strong> A 50,000-row lookup fits in
          a few micro-partitions; there is nothing to prune. Clustering pays off on
          large person-level and event tables.
        </li>
      </ol>

      <Callout kind="tip" title="The review heuristic">
        <p>
          Building a sizeable person-level model and not clustering on{" "}
          <code>person_id</code>? Expect a review comment — it is one of the standard
          checks on this project. The inverse also applies: clustering a tiny reference
          table is noise.
        </p>
      </Callout>

      <Quiz
        questions={[
          {
            prompt: "What does cluster_by actually change?",
            options: [
              "It creates an index on the chosen columns",
              "The physical ordering of rows, so partition min/max ranges become narrow and prunable",
              "It splits the table into one micro-partition per distinct value",
              "It tells the optimiser which columns queries will filter on",
            ],
            answer: 1,
            explain:
              "Snowflake has no indexes and takes no hints — the only mechanism is micro-partition pruning on min/max statistics, and clustering works by physically ordering rows so those ranges become tight.",
          },
          {
            prompt: "Which model benefits most from cluster_by?",
            options: [
              "A 2,000-row specialty lookup joined by almost every model",
              "A 100M-row person-level fact that dashboards filter by practice and person",
              "A 5M-row extract table that consumers always read in full",
              "A large staging view over an event feed",
            ],
            answer: 1,
            explain:
              "Pruning needs both scale and selective filters. The busy lookup is too small to prune; the full-read extract has no filter to prune on; the staging view stores no data at all.",
          },
        ]}
      />
    </LessonShell>
  );
}
