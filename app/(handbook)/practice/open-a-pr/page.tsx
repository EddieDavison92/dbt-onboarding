import type { Metadata } from "next";
import { LessonShell } from "@/components/LessonShell";
import { CodeBlock } from "@/components/CodeBlock";
import { Callout } from "@/components/Callout";
import { Checklist } from "@/components/Checklist";
import { GuidedCourseLink } from "@/components/GuidedCourseLink";

export const metadata: Metadata = { title: "Open your pull request" };

export default function Page() {
  return (
    <LessonShell
      section="practice"
      slug="open-a-pr"
      kicker="Field guide · 6"
      title="Open your pull request"
      lede="The repeatable branch-to-PR sequence, plus the checks worth making before code leaves your machine."
      minutes={5}
    >
      <GuidedCourseLink href="/courses/first-pr/open-the-pr" />

      <h2>The command sequence</h2>
      <CodeBlock
        lang="bash"
        code={`
git switch main
git pull
git switch -c feat/short-description
git status
git add path/to/model.sql path/to/model.yml
git diff --staged
git commit -m "feat: add short description"
git push
gh pr create --fill
`}
      />
      <p>
        Normally, update <code>main</code>{" "}before creating the branch so your work
        starts from the latest <code>origin/main</code>. If you already edited files
        on <code>main</code>, do not pull over them: create the branch immediately;
        your uncommitted changes move with you. On the first push, run the upstream
        command Git prints if needed.
      </p>

      <Callout kind="warn" title="The repository and PR are public">
        <p>
          Check the staged diff for credentials, identifiers, row-level outputs and
          screenshots of real data. Describe validation with aggregate counts or words;
          never attach patient or person-level results.
        </p>
      </Callout>

      <h2>Use a useful description</h2>
      <CodeBlock
        lang="text"
        title="PR description"
        code={`
## What
Adds stg_reference_opening_hours: one row per site per weekday.

## Why
Needed for the access dashboard; no staging model exists today.

## Checks
- dbt build -s stg_reference_opening_hours green locally
- Grain verified on (site_code, day_of_week)
- Null closes_at retained where is_open_24h is true
`}
      />

      <h2>If CI goes red</h2>
      <ol>
        <li>Open the failed check and read the log from the bottom.</li>
        <li>Reproduce the failure locally where possible.</li>
        <li>Fix, commit and push to the same branch.</li>
        <li>Keep the same PR; the checks rerun and the review history stays intact.</li>
      </ol>

      <Checklist
        id="pr"
        items={[
          { key: "branch", label: <>Work is on a named branch, not <code>main</code></> },
          { key: "diff", label: <>Staged diff contains only intended, non-sensitive changes</> },
          { key: "build", label: <>Relevant local build is green</> },
          { key: "pr", label: <>PR explains what changed, why, and how it was checked</> },
        ]}
      />
    </LessonShell>
  );
}
