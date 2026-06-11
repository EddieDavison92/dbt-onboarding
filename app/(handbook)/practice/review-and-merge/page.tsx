import type { Metadata } from "next";
import { LessonShell } from "@/components/LessonShell";
import { CodeBlock } from "@/components/CodeBlock";
import { Callout } from "@/components/Callout";
import { Checklist } from "@/components/Checklist";
import { GuidedCourseLink } from "@/components/GuidedCourseLink";

export const metadata: Metadata = { title: "Review & merge" };

export default function Page() {
  return (
    <LessonShell
      section="practice"
      slug="review-and-merge"
      kicker="Field guide · 7"
      title="Review & merge"
      lede="Respond in the existing PR, merge when review and checks agree, then bring your local checkout up to date."
      minutes={4}
    >
      <GuidedCourseLink href="/courses/first-pr/merge-and-after" />

      <h2>Respond to review</h2>
      <CodeBlock
        lang="bash"
        code={`
# make the requested change, then
git add -u
git commit -m "fix: address review feedback"
git push
`}
      />
      <p>
        Reply in the review thread with what changed. If you disagree, explain the data
        or design reason there; a review comment is a discussion, not an instruction
        that must be accepted silently.
      </p>
      <Callout kind="tip" title="Close the loop in the thread">
        <p>
          A short reply such as “done in abc1234” tells the reviewer where to look and
          preserves the reasoning for the next person reading the PR.
        </p>
      </Callout>

      <h2>Merge and sync</h2>
      <p>
        Merge once approvals are present and every required check is green. The project
        uses squash merge, so the branch lands on <code>main</code> as one tidy commit.
      </p>
      <CodeBlock
        lang="bash"
        code={`
git switch main
git pull
git branch -d feat/short-description
`}
      />

      <h2>After the merge</h2>
      <ul>
        <li>The deploy workflow builds the selected production models.</li>
        <li>The nightly build continues running the model and its tests.</li>
        <li>dbt docs and Snowflake comments pick up the merged descriptions.</li>
      </ul>
      <p>
        If production fails, keep the PR link and failing job together when asking for
        help. The useful question is not only “what failed?” but “did this also fail in
        the PR environment, or is production different?”
      </p>

      <Checklist
        id="merge"
        items={[
          { key: "review", label: <>Review threads answered and required checks green</> },
          { key: "merged", label: <>PR squash-merged and remote branch deleted</> },
          { key: "local", label: <>Local <code>main</code> pulled and feature branch removed</> },
          { key: "prod", label: <>Production result checked after deployment</> },
        ]}
      />
    </LessonShell>
  );
}
