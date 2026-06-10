import type { Metadata } from "next";
import { LessonShell } from "@/components/LessonShell";
import { CodeBlock } from "@/components/CodeBlock";
import { Callout } from "@/components/Callout";
import { Dag } from "@/components/Dag";
import { Quiz } from "@/components/Quiz";

export const metadata: Metadata = { title: "ref() and source()" };

export default function Page() {
  return (
    <LessonShell
      section="learn"
      slug="refs-and-sources"
      kicker="Learn 03"
      title="ref() and source()"
      lede="Two small functions replace every hardcoded table name in the project — and give dbt the map it needs to build everything in the right order."
      minutes={6}
    >
      <h2>Never hardcode a table</h2>
      <p>
        In a Snowflake worksheet you would write{" "}
        <code>from MODELLING.DBT_STAGING.STG_CSDS_BRIDGING</code>. In dbt you write:
      </p>
      <CodeBlock
        lang="sql"
        code={`
from {{ ref('stg_csds_bridging') }}
`}
      />
      <p>Two things happen:</p>
      <ul>
        <li>
          <strong>dbt resolves the location for you.</strong> In your dev environment it
          points at your dev schema; in production, the production one. Same SQL, every
          environment.
        </li>
        <li>
          <strong>dbt records the dependency.</strong> Your model now officially sits
          downstream of <code>stg_csds_bridging</code> — it appears in lineage, builds in
          the right order, and anyone changing that staging model can see you depend on
          it.
        </li>
      </ul>

      <h2>source() — the entry point</h2>
      <p>
        Tables we do not build — the feeds landing in the data lake databases (
        <code>DATA_LAKE</code>, plus <code>DATA_LAKE__NCL</code>) — are declared once in
        YAML under <code>models/sources/</code>, then referenced with{" "}
        <code>source()</code>:
      </p>
      <CodeBlock
        lang="sql"
        code={`
from {{ source('csds', 'ActiveSubmission') }}
`}
      />
      <p>
        In this project, <strong>only generated raw models call source()</strong>.
        Everything you write uses <code>ref()</code>. That keeps a single, stable
        interface to the outside world: if a feed changes, only the raw layer moves.
        Source declarations themselves are produced by a mapping pipeline — covered in
        the “Find your source” practice step — so you rarely write them by hand either.
      </p>

      <h2>The DAG</h2>
      <p>
        From every <code>ref()</code> and <code>source()</code> call, dbt assembles the
        whole project into a directed acyclic graph. This is a real slice of ours:
      </p>
      <Dag />
      <p>
        The DAG is what makes <code>dbt build -s +my_model</code> possible: the{" "}
        <code>+</code> means “and everything upstream”, and dbt knows exactly what that
        is. It is also why circular references are impossible — dbt refuses to compile
        them.
      </p>

      <Callout kind="smell" title="Spot the smell">
        <p>
          A hardcoded <code>DATABASE.SCHEMA.TABLE</code> in a model, or a{" "}
          <code>source()</code> call outside the raw layer, will draw a review comment.
          The fix is always the same: point at a model with <code>ref()</code> — and if
          no model exists yet, that missing model is the real gap to fill.
        </p>
      </Callout>

      <Quiz
        questions={[
          {
            prompt: "Why is hardcoding MODELLING.DBT_STAGING.STG_X a problem?",
            options: [
              "It is slower to query",
              "It breaks dev/prod separation and hides the dependency from the DAG",
              "Snowflake does not allow cross-schema queries",
              "It is fine, just verbose",
            ],
            answer: 1,
            explain:
              "Your dev build would read prod objects, and dbt would not know the dependency exists — wrong build order, invisible lineage.",
          },
          {
            prompt: "Where are you allowed to use source()?",
            options: [
              "Anywhere, as long as the source is declared",
              "Staging models only",
              "Only in auto-generated raw models",
              "Published models, for performance",
            ],
            answer: 2,
            explain:
              "Project convention: raw models are the only consumers of source(). Your models always ref() a raw or later model.",
          },
          {
            prompt: "What does the + in dbt build -s +int_wl_current select?",
            options: [
              "The model plus everything upstream of it",
              "The model plus everything downstream of it",
              "The model plus its tests",
              "All models changed since the last run",
            ],
            answer: 0,
            explain:
              "+model = upstream parents included; model+ = downstream children. You can combine both: +model+.",
          },
        ]}
      />
    </LessonShell>
  );
}
