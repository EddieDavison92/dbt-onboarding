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

      <h2>How a snapshot is defined</h2>
      <p>
        Snapshot files look like models with extra configuration: a unique key, and a{" "}
        <strong>strategy</strong> for detecting that a row has changed:
      </p>
      <CodeBlock
        lang="sql"
        title="snapshots/snapshot_patient_registration.sql (illustrative)"
        code={`
{% snapshot snapshot_patient_registration %}

{{
    config(
        unique_key='person_id',
        strategy='timestamp',
        updated_at='updated_at'
    )
}}

select person_id, practice_code, registration_status, updated_at
from {{ ref('stg_pds_registration') }}

{% endsnapshot %}
`}
      />
      <ul>
        <li>
          <strong><code>timestamp</code> strategy</strong> — dbt compares an{" "}
          <code>updated_at</code> column and processes only rows whose timestamp moved.
          Fast; use it whenever the source has a reliable last-updated column.
        </li>
        <li>
          <strong><code>check</code> strategy</strong> — dbt compares the values of a
          configured column list. Slower, but the only option when the source has no
          trustworthy timestamp.
        </li>
      </ul>
      <Callout kind="info" title="Snapshots have their own command">
        <p>
          <code>dbt build</code> and <code>dbt run</code> do not execute snapshots —
          they run via <code>dbt snapshot</code>, scheduled before the main nightly
          build so downstream models always read the latest history.
        </p>
      </Callout>

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
              "where dbt_valid_to > current_date",
              "where dbt_valid_from = (select max(dbt_valid_from) from the snapshot)",
            ],
            answer: 1,
            explain:
              "Current rows have an open-ended window: dbt_valid_to is null, and null fails a > comparison, so option c returns nothing. There is no is_current column, and max(dbt_valid_from) is one global date, not per record.",
          },
          {
            prompt: "Why is dropping a snapshot table worse than dropping a model?",
            options: [
              "Snapshots usually have more downstream dependencies",
              "dbt cannot rebuild snapshots from source — the recorded history is gone for good",
              "Snapshot tables are larger, so the rebuild takes longer",
              "It is not worse — the next snapshot run restores it",
            ],
            answer: 1,
            explain:
              "The next run does recreate the table — but only with today's state. A model's contents are derivable from its sources; a snapshot's history exists nowhere else.",
          },
        ]}
      />
    </LessonShell>
  );
}
