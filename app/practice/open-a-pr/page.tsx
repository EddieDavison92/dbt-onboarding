import type { Metadata } from "next";
import { LessonShell } from "@/components/LessonShell";
import { CodeBlock } from "@/components/CodeBlock";
import { Callout } from "@/components/Callout";
import { Checklist } from "@/components/Checklist";

export const metadata: Metadata = { title: "Open your pull request" };

export default function Page() {
  return (
    <LessonShell
      section="practice"
      slug="open-a-pr"
      kicker="Do · Step 6"
      title="Open your pull request"
      lede="Branch, commit, push, propose. From here the project's machinery takes over — and you watch your first CI run go green."
      minutes={10}
    >
      <h2>Branch first (if you haven&apos;t)</h2>
      <p>
        Ideally you branched before writing code. If you forgot and worked on{" "}
        <code>main</code> — no harm done locally, just branch now; your changes come with
        you:
      </p>
      <CodeBlock
        lang="bash"
        code={`
git checkout -b feat/opening-hours-staging
`}
      />

      <h2>Stage and commit</h2>
      <CodeBlock
        lang="bash"
        code={`
git status                       # see what changed — expect your .sql and .yml
git add models/staging/shared/stg_reference_opening_hours.sql
git add models/staging/shared/stg_reference_opening_hours.yml
git commit -m "feat: add opening hours staging model"
`}
      />
      <Callout kind="tip" title="git status is your friend">
        <p>
          Run it before every commit. If you see files you did not mean to touch (a
          stray <code>target/</code> artefact, an edited file you were only reading),
          do not <code>git add</code> them. Commit exactly what your PR is about.
        </p>
      </Callout>

      <Callout kind="warn" title="This repo is public — check your diff for data">
        <p>
          Before committing, read your diff once with one question in mind: does any
          line contain patient or person-level data, real identifiers in comments or
          examples, query result extracts, or credentials? None of those ever go in —
          and the same applies to the PR itself: no screenshots or attachments of
          row-level results. Describe checks in words and aggregates instead.
        </p>
      </Callout>

      <h2>Push and open the PR</h2>
      <CodeBlock
        lang="bash"
        code={`
git push -u origin feat/opening-hours-staging
gh pr create --title "feat: add opening hours staging model" --fill
`}
      />
      <p>
        (No <code>gh</code>? GitHub prints a “Create a pull request” link when you push —
        clicking it does the same thing.)
      </p>

      <h2>Write a description worth reading</h2>
      <CodeBlock
        lang="text"
        title="PR description template"
        code={`
## What
Adds stg_reference_opening_hours: one row per site per weekday.

## Why
Needed for the access dashboard; nothing currently stages this table.

## Checks
- dbt build -s stg_reference_opening_hours green locally
- Grain verified: unique on (site_code, day_of_week)
- Noticed ~40 rows with null closes_at where is_open_24h = true — kept them, flagged in column description
`}
      />

      <h2>Then: watch CI</h2>
      <p>
        Within a minute the checks appear at the bottom of your PR: compile, PR
        validation (builds your changed models), SQLFluff, ownership. The PR is also
        auto-assigned a reviewer. While checks run, review your own diff in the “Files
        changed” tab — you will catch something, everyone does.
      </p>

      <Callout kind="warn" title="If a check goes red">
        <p>
          Details → read the log from the bottom. Fix locally, commit, push to the same
          branch — the PR updates and CI re-runs. Do not open a new PR for a fix.
        </p>
      </Callout>

      <Checklist
        id="pr"
        items={[
          { key: "branch", label: <>Work is on a <code>feat/…</code> branch, not main</> },
          { key: "clean", label: <><code>git status</code> clean — only intended files committed</> },
          { key: "pr", label: <>PR open with a what/why/checks description</> },
          { key: "ci", label: <>All CI checks green (or you understand the red one)</> },
        ]}
      />
    </LessonShell>
  );
}
