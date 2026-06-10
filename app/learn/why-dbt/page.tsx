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
          <strong>Order of operations is manual.</strong> The summary table is only
          right if the reference data refreshed first, which is only right if the feed
          loaded — and the person who knows the sequence runs it by hand. One step out
          of order and the numbers are wrong, with nothing to say so.
        </li>
        <li>
          <strong>Nobody knows what depends on what.</strong> Renaming a column means
          guessing what might break.
        </li>
        <li>
          <strong>Nothing is tested.</strong> A duplicate patient row appears, and the first
          you hear is a dashboard looking wrong.
        </li>
        <li>
          <strong>Everyone works alone.</strong> Logic lives in personal worksheets and
          scripts, so five people hold five slightly different definitions of “current
          registration”, there is no history of who changed what, and work leaves when
          its author does.
        </li>
      </ul>
      <p>
        dbt (data build tool) addresses this with two ideas working together. First,{" "}
        <strong>a shared codebase</strong>: every transformation lives in one git
        repository, so there is one definition of each concept, full history of every
        change, and a review step before anything ships. Second,{" "}
        <strong>every transformation is a SELECT statement</strong> whose dependencies
        dbt can read — so the order of operations is derived from the code itself,
        computed fresh on every run, and never something a person has to remember.
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
          <strong>Source data lands in Snowflake</strong> — in the{" "}
          <code>DATA_LAKE</code> database (the main source) and{" "}
          <code>DATA_LAKE__NCL</code>: SUS, CSDS, OLIDS GP data, reference files.
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

      <h2>The bigger picture: the analytics development lifecycle</h2>
      <p>
        The deeper idea — the one dbt was built around — is that analytics work follows
        the same lifecycle as software, often called the{" "}
        <strong>analytics development lifecycle (ADLC)</strong>: plan → develop → test →
        deploy → operate → observe → discover → analyse, then around again. Each stage
        has a counterpart in how this team works:
      </p>
      <table>
        <thead>
          <tr>
            <th>Stage</th>
            <th>Here, that means</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Plan</td>
            <td>Agreeing the requirement and definitions before writing SQL</td>
          </tr>
          <tr>
            <td>Develop</td>
            <td>Models on a branch, in your own dev schema</td>
          </tr>
          <tr>
            <td>Test</td>
            <td>data_tests locally and in CI, before anything merges</td>
          </tr>
          <tr>
            <td>Deploy</td>
            <td>Merge to main → automated deployment to production</td>
          </tr>
          <tr>
            <td>Operate &amp; observe</td>
            <td>The nightly build, test results and run monitoring</td>
          </tr>
          <tr>
            <td>Discover &amp; analyse</td>
            <td>dbt docs, dashboards and the semantic layer consuming the outputs</td>
          </tr>
        </tbody>
      </table>
      <p>
        Most analyst work before dbt lives entirely in “develop” — everything else is
        manual or missing. The rest of this course walks the develop → test → deploy
        stretch in detail; operate, observe and discover come with the pipeline.
      </p>

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
              "A .sql file containing a single SELECT statement",
              "A .sql file containing the CREATE TABLE and INSERT statements for a table",
              "The YAML file that defines a table's columns and tests",
              "Any SQL file in the repo, including helper scripts",
            ],
            answer: 0,
            explain:
              "A model is one SELECT — dbt generates the surrounding DDL itself. The YAML alongside it documents and tests the model but is not the model.",
          },
          {
            prompt: "How does dbt know which order to build models in?",
            options: [
              "The order models are listed in dbt_project.yml",
              "It reads the ref() calls in each model and derives the dependency graph",
              "Folder order: raw, then staging, then modelling, and so on",
              "A run-order file maintained alongside the models",
            ],
            answer: 1,
            explain:
              "Order is derived entirely from ref() — there is no run-order config anywhere. Folders organise the code for humans; the DAG comes from the SQL.",
          },
        ]}
      />
    </LessonShell>
  );
}
