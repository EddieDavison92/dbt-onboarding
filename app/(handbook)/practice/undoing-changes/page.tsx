import type { Metadata } from "next";
import { LessonShell } from "@/components/LessonShell";
import { CodeBlock } from "@/components/CodeBlock";
import { Callout } from "@/components/Callout";

export const metadata: Metadata = { title: "How undo works in git" };

export default function Page() {
  return (
    <LessonShell
      section="practice"
      slug="undoing-changes"
      kicker="Field guide · 9"
      title="How undo works in git"
      lede="Recovery makes little sense as a list of commands and a lot of sense as a small model: commits that never change, branches that are only pointers, and three places work can live. This page builds the model, then reads the common situations through it."
      minutes={10}
    >
      <h2>Nothing in git edits the past</h2>
      <p>
        A commit is a complete snapshot of the project, and once made it never
        changes. No command edits a commit and almost none deletes one.
        Everything that sounds like changing history, including{" "}
        <code>reset --hard</code>, is really something else: moving a label
        from one snapshot to another.
      </p>
      <p>
        A branch is exactly that label: a name pointing at one commit.{" "}
        <code>main</code>{" "}is a pointer. A feature branch is a pointer.
        Creating a branch plants a new pointer; deleting a branch removes a
        pointer. In both cases every snapshot stays where it was.
      </p>
      <p>
        This is why git mistakes are so survivable. When work looks lost, the
        snapshots are almost always still in the graph and a pointer is aimed
        at the wrong one. Most recovery is pointer work, not restoration.
      </p>

      <h2>The three places work lives</h2>
      <p>
        Before a snapshot exists, work passes through three places. Knowing
        which place holds the mistake tells you how much danger it is in.
      </p>
      <table>
        <thead>
          <tr>
            <th>Place</th>
            <th>What it holds</th>
            <th>If lost</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Working tree</td>
            <td>Your edits, on disk, recorded nowhere</td>
            <td>Gone for good</td>
          </tr>
          <tr>
            <td>Staging area</td>
            <td>The selection for the next commit</td>
            <td>Nothing — unstaging keeps the edits</td>
          </tr>
          <tr>
            <td>Commit graph</td>
            <td>Every snapshot ever made</td>
            <td>Recoverable, even when it looks otherwise</td>
          </tr>
        </tbody>
      </table>
      <p>
        Pushing adds a fourth consideration. A pushed commit exists in other
        people&apos;s clones, so its pointers can no longer be quietly moved:
        undoing something public means adding a correction, not rewriting.
      </p>
      <p>
        <code>git status</code>{" "}reports all three places: the current branch
        at the top, then staged, unstaged and untracked files. The bracketed
        hints beneath each group are the undo commands for that group.
      </p>

      <h2>What each undo command moves</h2>
      <p>
        The undo commands stop being confusable once each is tied to the thing
        it moves.
      </p>
      <ul>
        <li>
          <code>git restore file</code>{" "}copies the committed version of a
          file over the working tree. It is the only command here that touches
          unrecorded work, which makes it the only genuinely destructive one.
        </li>
        <li>
          <code>git restore --staged file</code>{" "}changes only the selection:
          the file leaves the next commit, the edits stay on disk.
        </li>
        <li>
          <code>git switch</code>{" "}moves you between pointers;{" "}
          <code>switch -c</code>{" "}plants a new pointer where you stand.
          Uncommitted edits stay in the working tree and come along.
        </li>
        <li>
          <code>git reset</code>{" "}moves the current branch&apos;s pointer to
          another commit. <code>--soft</code>{" "}moves only the pointer;{" "}
          <code>--hard</code>{" "}also rebuilds the staging area and working
          tree to match, which destroys any uncommitted edits in the way.
        </li>
        <li>
          <code>git revert</code>{" "}moves nothing: it adds a new commit
          applying the inverse of an earlier one. Because it only adds, it is
          the undo that works on pushed history.
        </li>
      </ul>
      <p>
        Behind all of them, git keeps a journal of every position each pointer
        has held (<code>git reflog</code>). A commit orphaned by a mistaken
        reset is still in the graph and can be found there — a recovery worth
        doing alongside someone who has used it before.
      </p>

      <h2>Reading the common situations</h2>

      <h3>Edits made while on main</h3>
      <p>
        Uncommitted edits live in the working tree and belong to no branch, so
        nothing has gone wrong yet: being “on main” only matters at the moment
        of commit. <code>git switch -c feat/my-change</code>{" "}plants the
        branch pointer; the edits never move, and work continues as if the
        branch had existed all along.
      </p>

      <h3>A commit made on local main</h3>
      <p>
        The snapshot is fine; the label under it is wrong. GitHub&apos;s main
        also rejects the push, so nothing shared has changed:
      </p>
      <CodeBlock
        lang="text"
        code={`
remote: error: GH006: Protected branch update failed for refs/heads/main.
! [remote rejected] main -> main (protected branch hook declined)
`}
      />
      <p>The fix is pure pointer work:</p>
      <CodeBlock
        lang="bash"
        code={`
git switch -c feat/my-change      # plant a branch pointer at the commit
git switch main
git reset --hard origin/main      # move the main pointer back to GitHub's position
`}
      />
      <p>
        The reset is safe because the new branch still points at the snapshot.
        The same command without the branch first would leave the snapshot
        unlabelled — findable through the reflog, but there is no reason to put
        yourself there. The order is the whole trick.
      </p>

      <h3>The wrong file staged</h3>
      <p>
        Staging is only a selection, so this is the mildest situation there
        is: <code>git restore --staged path</code>{" "}removes the file from the
        next commit and changes nothing else. One caution: if the file is a
        data extract or credential, its presence in the project folder is the
        real problem — the repository is public, so move it out of the
        workspace, not just out of the commit.
      </p>

      <h3>Discarding edits</h3>
      <p>
        <code>git restore path</code>{" "}is the deliberate use of the one
        destructive command: it overwrites working-tree edits with the
        committed version, and there is no journal for the working tree.
        Reading <code>git diff path</code>{" "}first is how you make the
        deletion informed rather than hopeful. If part of the work is worth
        keeping, commit it first: commits are free, private until pushed, and
        turn the one unrecoverable place into the most recoverable one.
      </p>

      <h3>Undoing the last commit</h3>
      <p>
        <code>git reset --soft HEAD~1</code>{" "}moves the branch pointer back
        one commit and touches nothing else: files and staging area are exactly
        as they were the moment before you committed, ready to be recommitted
        properly. This is for commits that have not been pushed. A pushed
        commit is in other clones, so the model says add rather than move:
        correct it with a follow-up commit, or <code>git revert</code>{" "}for a
        clean inverse. Squash merge flattens the branch history anyway, so
        extra commits on a PR branch cost nothing.
      </p>

      <h3>A pushed mistake</h3>
      <p>
        For wrong code, <code>git revert sha</code>{" "}records the inverse
        change as new history; the mistake and its correction both remain on
        the record, which is what shared history requires.
      </p>
      <p>
        A pushed credential or patient-level data is not a git problem. Reverting
        removes nothing: the earlier commit stays publicly readable and may
        already be cloned. The credential must be rotated whatever else
        happens, and any history rewriting is a coordinated team operation.
        Tell the team immediately; that is the whole of the right response.
      </p>

      <h2>Merge conflicts are a question, not an error</h2>
      <p>
        A merge creates a commit with two parents: your branch and, usually,{" "}
        <code>origin/main</code>. Where the two histories changed different
        files or different lines, git combines them by itself. Where both
        changed the same lines, no rule can say which version is correct —
        that depends on what the two changes meant. So git writes both
        versions into the file, marks the region, and pauses. The paused state
        is git handing you the pen: the content of the merge commit is yours
        to decide.
      </p>
      <CodeBlock
        lang="text"
        code={`
select
    organisation_code,
<<<<<<< HEAD
    upper(trim(site_code)) as site_code,
=======
    site_code,
>>>>>>> origin/main
    day_of_week,
`}
      />
      <p>
        Between <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</code>{" "}and{" "}
        <code>=======</code>{" "}is your branch&apos;s version of the lines;
        below is main&apos;s. Everything outside the markers merged cleanly.
        Deciding means asking what each side was trying to do. Here, main
        renamed the column while your branch added cleaning; neither version
        alone is right, and the resolution applies your{" "}
        <code>upper(trim(...))</code>{" "}to the renamed column. Edit the region
        to the line that should be true, delete the three marker lines, then
        stage, commit and push — VS Code highlights each region and offers
        accept-current, accept-incoming and accept-both shortcuts, though
        editing by hand is often clearer when the answer combines both sides.
      </p>
      <p>
        Two consequences of the model are easy to miss. A paused merge has not
        committed anything, so <code>git merge --abort</code>{" "}returns you
        cleanly to the pre-merge state. And resolving the text does not prove
        the SQL: a model whose logic was in dispute deserves a{" "}
        <code>dbt build -s the_model</code>{" "}before the push.
      </p>
      <Callout kind="info" title="Conflicts are routine">
        <p>
          A conflict means two people changed the same code, which is the
          normal condition of a shared project. Small, short-lived branches
          keep them rare and small. For a conflict that is large or sits in
          logic you do not own, resolve it with the other author.
        </p>
      </Callout>

      <h2>What the model gives you</h2>
      <p>
        Commit before experiments, because commits turn the one unrecoverable
        place into the safest one. Read <code>git status</code>{" "}before
        acting, and the branch name before anything. Read the diff before the
        two commands that touch the working tree. And the test for whether to
        run a recovery command you found somewhere: can you say which pointer
        it moves and what it does to your working tree? If not, that is the
        moment to ask a colleague — with an accurate picture of the state,
        most recoveries take minutes.
      </p>
    </LessonShell>
  );
}
