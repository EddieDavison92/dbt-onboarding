import type { Metadata } from "next";
import { LessonShell } from "@/components/LessonShell";
import { CodeBlock } from "@/components/CodeBlock";
import { Callout } from "@/components/Callout";
import { Quiz } from "@/components/Quiz";

export const metadata: Metadata = { title: "Semantic views" };

export default function Page() {
  return (
    <LessonShell
      section="advanced"
      slug="semantic-views"
      kicker="Going further 06"
      title="Semantic views"
      lede="The sixth layer: instead of producing rows, a semantic view declares what the data means — facts, dimensions, metrics and how tables relate — so query tools can't get the joins wrong."
      minutes={6}
    >
      <h2>Why declare meaning?</h2>
      <p>
        A reporting table answers questions if you already know how to query it: which
        column is the grain, which flags are QOF registers, how tables join. A{" "}
        <strong>Snowflake semantic view</strong> writes that knowledge down as part of
        the pipeline. Once defined, any consumer — BI tools, or the semantic layer chat
        interface the team is developing — can compose correct queries from named
        metrics instead of guessing at joins.
      </p>

      <h2>What one looks like</h2>
      <p>
        Semantic views live in <code>models/semantic/</code>, prefixed{" "}
        <code>sem_</code>, materialised as <code>semantic_view</code>. Instead of a
        SELECT, the body declares structure (abridged from{" "}
        <code>sem_olids_population</code>):
      </p>
      <CodeBlock
        lang="sql"
        title="models/semantic/sem_olids_population.sql (abridged)"
        code={`
{{
    config(
        materialized='semantic_view',
        schema='SEMANTIC'
    )
}}

TABLES(
    demographics AS {{ ref('dim_person_demographics') }}
        PRIMARY KEY (person_id),
    conditions AS {{ ref('dim_person_conditions') }}
        PRIMARY KEY (person_id)
)

RELATIONSHIPS(
    conditions (person_id) REFERENCES demographics
)

DIMENSIONS(
    demographics.gender AS gender COMMENT = 'Patient gender',
    demographics.age_band_nhs AS age_band_nhs COMMENT = 'NHS standard age bands',
    conditions.has_diabetes AS has_diabetes COMMENT = 'On diabetes register (QOF)'
)

METRICS(
    demographics.patient_count AS COUNT(DISTINCT demographics.person_id)
        COMMENT = 'Total patients',
    conditions.diabetes_count AS COUNT(DISTINCT CASE
        WHEN conditions.has_diabetes THEN conditions.person_id END)
        COMMENT = 'Patients with diabetes'
)
`}
      />
      <p>The pieces:</p>
      <ul>
        <li>
          <strong>TABLES</strong> — which reporting models participate, with primary
          keys. Note they are still <code>ref()</code>s: semantic views sit on top of
          the reporting layer in the same DAG.
        </li>
        <li>
          <strong>RELATIONSHIPS</strong> — how they join, declared once, correctly.
        </li>
        <li>
          <strong>DIMENSIONS</strong> — attributes to slice by, each with a comment
          explaining what it means.
        </li>
        <li>
          <strong>METRICS</strong> — named, agreed aggregations. “Diabetes count” is
          defined exactly once; every consumer gets the same number.
        </li>
      </ul>

      <Callout kind="info" title="Where this is heading">
        <p>
          These views are the foundation for an in-house semantic layer chat interface
          the team is building (not yet available) — ask a question in plain English,
          get an answer assembled from these declared metrics rather than improvised
          SQL. The better the comments and metric definitions, the better that works.
        </p>
      </Callout>

      <Callout kind="tip" title="Comments are the product">
        <p>
          In a normal model, a vague description is a documentation problem. In a
          semantic view, comments are read by tools deciding which metric answers a
          question — write them as if explaining the column to a careful colleague,
          because functionally that is what they are.
        </p>
      </Callout>

      <Quiz
        questions={[
          {
            prompt: "A semantic view differs from a reporting model because…",
            options: [
              "It runs faster",
              "It declares structure and meaning (joins, dimensions, metrics) rather than producing rows with a SELECT",
              "It is written in Python",
              "It bypasses the DAG",
            ],
            answer: 1,
            explain:
              "It is a declaration layered over reporting models via ref() — the DAG still applies, but the output is meaning, not rows.",
          },
          {
            prompt: "Why define metrics like diabetes_count in the semantic view?",
            options: [
              "Snowflake requires it",
              "So the definition exists once and every consumer computes the same number",
              "Metrics are cheaper than columns",
              "To avoid writing tests",
            ],
            answer: 1,
            explain:
              "One agreed definition beats five analysts writing five slightly different CASE expressions.",
          },
        ]}
      />
    </LessonShell>
  );
}
