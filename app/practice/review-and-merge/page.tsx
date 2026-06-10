import type { Metadata } from "next";
import { LessonShell } from "@/components/LessonShell";
import { CodeBlock } from "@/components/CodeBlock";
import { Callout } from "@/components/Callout";
import { Checklist } from "@/components/Checklist";

export const metadata: Metadata = { title: "Review & merge" };

export default function Page() {
  return (
    <LessonShell
      section="practice"
      slug="review-and-merge"
      kicker="Do · Step 7"
      title="Review & merge"
      lede="Feedback arrives, you respond with commits, and your model lands on main — running in production by tomorrow morning."
      minutes={5}
    >
      <h2>Responding to review</h2>
      <p>
        Review comments come in two kinds: questions (“is this grain right when a site
        closes mid-week?”) and requests (“rename to match the <code>sk_</code>{" "}
        convention”). For both, the loop is the same:
      </p>
      <CodeBlock
        lang="bash"
        code={`
# make the change locally, then:
git add -u
git commit -m "fix: rename site identifier to match conventions"
git push
`}
      />
      <p>
        The PR updates automatically; reply to the comment so the reviewer knows it is
        addressed. Disagree? Say why in the thread — “I kept X because…” is a perfectly
        good answer, and reviewers are often missing context you have.
      </p>

      <Callout kind="tip" title="Resolve conversations, don't just push">
        <p>
          A pushed fix without a reply leaves the reviewer re-reading your diff to work
          out what changed. One line — “done in abc1234” — saves them minutes and gets
          you re-approved faster.
        </p>
      </Callout>

      <h2>Merging</h2>
      <p>
        Approval + green checks = the merge button unlocks. We squash-merge: your
        branch&apos;s commits collapse into one tidy commit on <code>main</code>. After
        merging, delete the branch (GitHub offers a button) and pull main locally:
      </p>
      <CodeBlock
        lang="bash"
        code={`
git switch main
git pull
`}
      />

      <h2>What happens next</h2>
      <ul>
        <li>
          <strong>The deploy workflow</strong> (GitHub Actions) picks up the merge and
          builds your changed models, plus everything downstream of them, in production
          Snowflake.
        </li>
        <li>
          <strong>The nightly build</strong> now includes your model and runs your tests
          every day. If the feed changes in six months, your grain test will surface it.
        </li>
        <li>
          <strong>dbt docs</strong> and Snowflake column comments update with your
          descriptions.
        </li>
      </ul>

      <p>
        That is the full cycle. Every change from now on — a one-line fix or a new
        disease register — follows the same path: branch, model, YAML, build, PR,
        review, merge. That consistency is what lets the team trust every number the
        pipeline produces.
      </p>
      <p>
        It also gets fast. The first time through, this track is an afternoon; once
        the tools are familiar, a routine change — branch, edit, build, PR — is a
        loop measured in minutes, with most of the elapsed time being review rather
        than your effort. The process feels heavyweight exactly once.
      </p>

      <Checklist
        id="merge"
        items={[
          { key: "merged", label: <>PR approved and squash-merged</> },
          { key: "branch", label: <>Branch deleted, local main pulled</> },
          { key: "prod", label: <>Model visible in production after the deploy/nightly run</> },
        ]}
      />
    </LessonShell>
  );
}
