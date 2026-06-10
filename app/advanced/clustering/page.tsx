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

      <h2>What makes a good clustering key</h2>
      <p>
        The objective in one sentence:{" "}
        <strong>
          cluster by the columns the next consumer will filter or join on
        </strong>
        . Not what the model groups by internally, not its primary key for its own
        sake — what the queries reading it will put in their <code>where</code> and{" "}
        <code>on</code> clauses. That means the right key can change as the same data
        moves down the pipeline, because the consumer changes.
      </p>
      <p>The OLIDS observation pipeline is a worked example:</p>
      <ul>
        <li>
          <strong>Upstream, cluster by clinical code.</strong> The concept-mapped
          observation data is clustered by SNOMED concept (for example{" "}
          <code>stg_olids_concept_map</code> uses{" "}
          <code>cluster_by=[&apos;source_concept_id&apos;]</code>), because the next
          step — building <code>int_</code> models — filters to specific types of
          observation: blood pressure readings, HbA1c results, diagnosis codes. Those
          code filters prune well against code-ordered data.
        </li>
        <li>
          <strong>Downstream, cluster by person.</strong> Once an <code>int_</code>{" "}
          model has extracted its observations, its consumers stop filtering by code —
          registers and demographics join and filter by patient. So the{" "}
          <code>int_</code> outputs switch to{" "}
          <code>cluster_by=[&apos;person_id&apos;, &apos;clinical_effective_date&apos;]</code>,
          and everything built on them joins efficiently.
        </li>
      </ul>
      <p>
        Same data, two different keys — each chosen for the queries that come next.
        Three practical rules follow:
      </p>
      <ol>
        <li>
          <strong>Ask who reads this model and what they filter or join on.</strong> If
          you cannot answer, you are not ready to choose a key.
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
        <li>
          <strong>Cardinality matters at both extremes.</strong> A two-value flag
          barely narrows anything; a unique timestamp scatters grouping. Mid-cardinality
          columns — person, code, practice, date — sit in the useful range.
        </li>
      </ol>
      <p>
        Because our tables are rebuilt by dbt rather than continuously loaded,{" "}
        <code>cluster_by</code> mostly costs nothing extra: dbt sorts the data as it
        builds the table, so each nightly rebuild comes out freshly clustered.
      </p>

      <Callout kind="info" title="Going deeper">
        <p>
          SELECT.dev&apos;s{" "}
          <a
            href="https://select.dev/posts/introduction-to-snowflake-clustering"
            target="_blank"
            rel="noopener noreferrer"
          >
            Effective Clustering in Snowflake
          </a>{" "}
          is the best practical guide to this topic — including natural clustering
          (data loaded in date order is often already well clustered for free) and why
          they find clustering worthwhile from hundreds of megabytes, well below
          Snowflake&apos;s official multi-terabyte guidance.
        </p>
      </Callout>

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
