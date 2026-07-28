import type { Metadata } from "next";
import { LessonShell } from "@/components/LessonShell";
import { CodeBlock } from "@/components/CodeBlock";
import { Callout } from "@/components/Callout";

export const metadata: Metadata = { title: "When git goes wrong" };

export default function Page() {
  return (
    <LessonShell
      section="practice"
      slug="when-git-goes-wrong"
      kicker="Field guide · 9"
      title="When git goes wrong"
      lede="Almost nothing in git is lost, and most messes are one calm command from fixed. Find your situation, run the move."
      minutes={6}
    >
      <h2>First, always</h2>
      <CodeBlock lang="bash" code={`git status`} />
      <p>
        Read it slowly. It names the branch you are on, what changed, and usually
        prints the exact command that undoes what you did.
      </p>

      <h2>Find your situation</h2>
      <table>
        <thead>
          <tr>
            <th>Situation</th>
            <th>The move</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Edited files while still on <code>main</code></td>
            <td>
              <code>git switch -c feat/name</code> — uncommitted changes travel to
              the new branch with you.
            </td>
          </tr>
          <tr>
            <td>Committed on local <code>main</code></td>
            <td>
              <code>git switch -c feat/name</code>{" "}(the commit is now safe on a
              branch), then <code>git switch main</code>{" "}and{" "}
              <code>git reset --hard origin/main</code>{" "}to put main back to
              matching GitHub.
            </td>
          </tr>
          <tr>
            <td>Staged a file you didn&apos;t mean to</td>
            <td><code>git restore --staged path/to/file</code> — unstages, keeps the edits.</td>
          </tr>
          <tr>
            <td>Want to throw away edits to a file</td>
            <td>
              <code>git restore path/to/file</code> — gone for good; uncommitted
              edits are the one thing git cannot bring back.
            </td>
          </tr>
          <tr>
            <td>Undo the last commit but keep the work</td>
            <td>
              <code>git reset --soft HEAD~1</code>{" "}(only if you haven&apos;t
              pushed) — the commit unwinds, the files stay staged.
            </td>
          </tr>
          <tr>
            <td>Pushed a credential or data</td>
            <td>
              Tell the team immediately and rotate the credential. Deleting the
              file later does not remove it from history — cleaning that up is a
              team job, not a solo one.
            </td>
          </tr>
        </tbody>
      </table>

      <h2>Merge conflicts</h2>
      <p>
        A conflict happens when your branch and <code>main</code>{" "}changed the
        same lines — usually surfacing when the PR page says the branch has
        conflicts, or when you merge fresh main into your branch. Git stops and
        marks the disputed lines in the file:
      </p>
      <CodeBlock
        lang="text"
        code={`
<<<<<<< HEAD
    upper(trim(site_code)) as site_code,
=======
    site_code,
>>>>>>> main
`}
      />
      <p>
        Everything between <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>{" "}and{" "}
        <code>=======</code>{" "}is your branch&apos;s version; below it is
        main&apos;s. Nothing has been damaged — git is asking, not failing.
      </p>
      <ol>
        <li>
          Open each conflicted file. VS Code highlights the blocks and offers{" "}
          <strong>Accept Current</strong>{" "}(yours), <strong>Accept Incoming</strong>{" "}
          (main&apos;s) or <strong>Accept Both</strong> — or edit the lines by hand
          to the version that should be true.
        </li>
        <li>Delete every conflict marker; the file should read as normal SQL or YAML.</li>
        <li>
          Stage and commit the resolved files (<code>git add -u</code>, then{" "}
          <code>git commit</code>), and push.
        </li>
      </ol>
      <p>
        Standing in a half-resolved merge you regret? <code>git merge --abort</code>{" "}
        returns the branch to the state before the merge started.
      </p>
      <Callout kind="info" title="Conflicts are normal, not damage">
        <p>
          They are git refusing to guess between two valid versions. Small,
          short-lived branches make them rare and small; a conflict on a
          one-model branch is usually a two-minute fix.
        </p>
      </Callout>

      <h2>The golden rules</h2>
      <ul>
        <li>Anything committed is recoverable — commit early, worry less.</li>
        <li>
          Discarding <em>uncommitted</em>{" "}work (<code>git restore</code>,{" "}
          <code>reset --hard</code>) is permanent. Pause before those two.
        </li>
        <li>Never force-push a shared branch.</li>
        <li>
          Ask early. A teammate who knows git can fix almost any mess in minutes —
          the expensive messes are the ones people try to fix alone with commands
          they found in a panic.
        </li>
      </ul>
    </LessonShell>
  );
}
