import type { Metadata } from "next";
import { LessonShell } from "@/components/LessonShell";
import { CodeBlock } from "@/components/CodeBlock";
import { Callout } from "@/components/Callout";
import { Quiz } from "@/components/Quiz";

export const metadata: Metadata = { title: "Why dbt?" };

export default function Page() {
  return (
    <LessonShell
      section="learn"
      slug="why-dbt"
      kicker="Learn 01"
      title="Why dbt?"
      lede="You already write good SQL. dbt takes that SQL and gives it the things scripts in folders never have: order, tests, history and review."
      minutes={6}
    >
      <h2>The problem dbt solves</h2>
      <p>
        Every analytics team accumulates SQL: a view someone built in 2022, a script
        that has to run before another script, a “FINAL_v3” table nobody is sure is
        safe to drop. The SQL itself is usually fine — the problems sit around it:
      </p>
      <ul>
        <li>
          <strong>Nobody knows what depends on what.</strong> Renaming a column means
          guessing what might break.
        </li>
        <li>
          <strong>Nothing is tested.</strong> A duplicate patient row appears, and the first
          you hear is a dashboard looking wrong.
        </li>
        <li>
          <strong>There is no history.</strong> The logic changed last month. Who changed it,
          and why?
        </li>
        <li>
          <strong>Everyone rebuilds the same thing.</strong> Five people have five slightly
          different definitions of “current registration”.
        </li>
      </ul>
      <p>
        dbt (data build tool) fixes this with one idea: <strong>every transformation is a
        SELECT statement in a file, in a git repository</strong>. dbt works out the order to
        run them, builds them as tables or views in Snowflake, tests the results and
        documents the whole chain.
      </p>

      <h2>What a dbt model looks like</h2>
      <p>
        A <em>model</em> is one <code>.sql</code> file containing one SELECT. This is a real
        (small) model from our project:
      </p>
      <CodeBlock
        lang="sql"
        title="models/staging/commissioning/stg_csds_bridging.sql"
        code={`
select
    person_id,
    pseudo_nhs_number as sk_patient_id
from {{ ref('raw_csds_bridging') }}
`}
      />
      <p>
        No CREATE TABLE, no DROP, no schema names. You write the SELECT;{" "}
        <code>dbt run</code> wraps it in the right DDL and builds it in the right database
        for your environment — your dev schema while you develop, production after your
        change is merged.
      </p>
      <p>
        The <code>{"{{ ref('…') }}"}</code> call is the key mechanism: instead of
        hardcoding a table, you point at another model. From those references dbt
        assembles the full dependency graph (the <strong>DAG</strong>) and always builds
        upstream models first.
      </p>

      <h2>Where dbt sits in the workflow</h2>
      <p>In this team the pipeline looks like:</p>
      <ol>
        <li>
          <strong>Source data lands in Snowflake</strong> (<code>DATA_LAKE__NCL</code>) —
          SUS, CSDS, OLIDS GP data, reference files.
        </li>
        <li>
          <strong>dbt transforms it</strong> through five layers (next lesson) into
          analytics-ready and published datasets.
        </li>
        <li>
          <strong>Everything downstream consumes dbt outputs</strong> — dashboards,
          ad-hoc analysis, semantic views for AI tools.
        </li>
      </ol>
      <p>
        Your day-to-day barely changes: it is still writing SELECT statements against
        Snowflake. What changes is that your SQL now lives in a repo where it is ordered,
        tested, reviewed and rerun automatically every day.
      </p>

      <Callout kind="info" title="What dbt is not">
        <p>
          dbt does not extract or load data — it only transforms what is already in
          Snowflake (the “T” in ELT). It is also not a scheduler by itself: our nightly
          build runs via GitHub Actions.
        </p>
      </Callout>

      <h2>The trade</h2>
      <p>
        You give up some freedom — naming conventions, a review step, tests before
        merge. In exchange, your work runs every night without you, failures surface
        immediately rather than silently, and nobody has to reverse-engineer your logic
        from a Snowflake worksheet.
      </p>

      <Quiz
        questions={[
          {
            prompt: "A dbt model is…",
            options: [
              "A YAML file describing a table",
              "A single SELECT statement in a .sql file",
              "A stored procedure dbt deploys to Snowflake",
              "A diagram of table relationships",
            ],
            answer: 1,
            explain:
              "One model = one .sql file = one SELECT. dbt wraps it in CREATE TABLE/VIEW and runs it in dependency order.",
          },
          {
            prompt: "How does dbt know which order to build models in?",
            options: [
              "You number the files",
              "You maintain a run-order config",
              "It reads the ref() calls and builds the dependency graph",
              "Alphabetically",
            ],
            answer: 2,
            explain:
              "ref() is both a pointer and a declaration of dependency. The DAG is derived entirely from your SQL.",
          },
        ]}
      />
    </LessonShell>
  );
}
