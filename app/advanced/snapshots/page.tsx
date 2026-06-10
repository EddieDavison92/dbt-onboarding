import type { Metadata } from "next";
import { LessonShell } from "@/components/LessonShell";
import { CodeBlock } from "@/components/CodeBlock";
import { Callout } from "@/components/Callout";
import { Quiz } from "@/components/Quiz";

export const metadata: Metadata = { title: "Snapshots" };

export default function Page() {
  return (
    <LessonShell
      section="advanced"
      slug="snapshots"
      kicker="Going further 05"
      title="Snapshots"
      lede="Some sources only keep the present: a patient's practice today, an address today. Snapshots record every change so you can ask what was true at any point in time."
      minutes={6}
    >
      <h2>The problem: sources that overwrite</h2>
      <p>
        When a patient moves practice, many feeds simply update the row — the old
        practice is gone. Next month someone asks “how many patients did practice X
        have in January?” and the source can no longer answer. A{" "}
        <strong>snapshot</strong> solves this by checking the source on every run and
        recording each change as a new row, building history the source never kept.
      </p>

      <h2>How it looks</h2>
      <p>
        Snapshots live in <code>snapshots/</code> and use the same SELECT-plus-config
        shape as models. dbt adds bookkeeping columns; a row is “current” while{" "}
        <code>dbt_valid_to</code> is null:
      </p>
      <CodeBlock
        lang="text"
        title="snapshot output — one patient over time"
        code={`
sk_patient_id  practice_code  dbt_valid_from  dbt_valid_to
1234           A81001         2024-03-01      2025-06-12
1234           A81002         2025-06-12      null          <- current row
`}
      />
      <p>
        This is the classic <strong>slowly changing dimension (type 2)</strong> pattern.
        The project uses it where history matters — for example{" "}
        <code>dim_snapshot_person_pds_demographics</code> tracks demographic changes
        from the PDS feed.
      </p>

      <h2>Querying a snapshot</h2>
      <CodeBlock
        lang="sql"
        code={`
-- current state
select * from {{ ref('my_snapshot') }}
where dbt_valid_to is null

-- as of a specific date
select * from {{ ref('my_snapshot') }}
where '2025-01-15' >= dbt_valid_from
  and ('2025-01-15' < dbt_valid_to or dbt_valid_to is null)
`}
      />
      <p>
        That “as of” pattern is common enough that the project wraps it in the{" "}
        <code>temporal_join()</code> macro — reach for that before writing your own.
      </p>

      <Callout kind="warn" title="Snapshots only record what they observe">
        <p>
          A snapshot captures changes from the day it starts running — it cannot
          reconstruct history before that, and if a run is skipped, changes that
          happened and reverted in between are not recorded. For the same reason,
          never drop or full-refresh a snapshot table without team agreement: the
          history cannot be regenerated.
        </p>
      </Callout>

      <Quiz
        questions={[
          {
            prompt: "How do you select only the current rows from a snapshot?",
            options: [
              "where is_current = true",
              "where dbt_valid_to is null",
              "order by dbt_valid_from desc limit 1",
              "where dbt_valid_from = current_date",
            ],
            answer: 1,
            explain:
              "An open-ended validity window (null dbt_valid_to) marks the current version of each record.",
          },
          {
            prompt: "Why is dropping a snapshot table worse than dropping a model?",
            options: [
              "Snapshots are bigger",
              "dbt cannot rebuild snapshots from source — the recorded history is gone for good",
              "It breaks the DAG",
              "It is not worse, dbt rebuilds it",
            ],
            answer: 1,
            explain:
              "Models are derivable from their sources; a snapshot's history exists only in the snapshot. Rebuilding starts history from today.",
          },
        ]}
      />
    </LessonShell>
  );
}
