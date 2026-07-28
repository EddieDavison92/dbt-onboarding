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
      lede="Almost nothing in git is lost, and every mess here has a calm, tested way out. Find your situation, read the whole section, then run the fix."
      minutes={12}
    >
      <Callout kind="info" title="Before anything else, three facts">
        <p>
          Anything you have <strong>committed</strong>{" "}is recoverable, even
          after mistakes that look dramatic. Git almost never deletes work — it
          mostly just points at the wrong thing. And nothing you do locally can
          damage production: <code>main</code>{" "}is protected, and dashboards
          read only from production tables. You have time to read this page.
        </p>
      </Callout>

      <h2>Start by reading the situation</h2>
      <p>Two commands tell you where you are; neither changes anything.</p>
      <CodeBlock
        lang="bash"
        code={`
git status            # which branch, what changed, what's staged
git log --oneline -5  # the last five commits on this branch
`}
      />
      <p>
        Read <code>git status</code>{" "}top to bottom. The first line names your
        branch — half of all git surprises are just “I&apos;m not on the branch
        I thought”. Below that, files appear in up to three groups:{" "}
        <em>staged</em>{" "}(going into the next commit), <em>not staged</em>{" "}
        (edited but not staged), and <em>untracked</em>{" "}(new files git
        isn&apos;t watching yet). Under each group, git prints the exact
        command that undoes it — the hints in brackets are real advice, not
        decoration.
      </p>
      <p>
        Recovery is easier when you know which of the four places the mistake
        lives in, because each place has its own undo:
      </p>
      <table>
        <thead>
          <tr>
            <th>Where the mistake is</th>
            <th>How serious</th>
            <th>The undo family</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Edits on disk, not staged</td>
            <td>Lowest — nothing is recorded yet</td>
            <td><code>git restore</code>{" "}(discard) or just keep editing</td>
          </tr>
          <tr>
            <td>Staged, not committed</td>
            <td>Low</td>
            <td><code>git restore --staged</code>{" "}to unstage</td>
          </tr>
          <tr>
            <td>Committed, not pushed</td>
            <td>Low — private to your machine</td>
            <td><code>git reset</code>{" "}moves; branches keep it safe</td>
          </tr>
          <tr>
            <td>Pushed to GitHub</td>
            <td>Public — fix forwards, don&apos;t rewrite</td>
            <td><code>git revert</code>, or the team for secrets</td>
          </tr>
        </tbody>
      </table>

      <h2>1 · You edited files while still on main</h2>
      <p>
        <strong>What you see:</strong>{" "}you&apos;ve been working for a while,
        run <code>git status</code>, and the first line says{" "}
        <code>On branch main</code>{" "}with your edits listed below it.
      </p>
      <p>
        <strong>Why it&apos;s fine:</strong>{" "}nothing has happened yet.
        Uncommitted edits don&apos;t belong to any branch — they are just files
        on your disk. Being “on main” only matters at the moment you commit,
        and you haven&apos;t.
      </p>
      <CodeBlock lang="bash" code={`git switch -c feat/my-change`} />
      <p>
        <strong>Why it works:</strong>{" "}<code>switch -c</code>{" "}creates the
        branch and moves you onto it, and your uncommitted edits travel with
        you — git only touches files it would otherwise overwrite, which a
        brand-new branch never does. Carry on exactly as if you had branched
        first.
      </p>
      <p>
        <strong>Verify:</strong>{" "}<code>git status</code>{" "}now opens with{" "}
        <code>On branch feat/my-change</code>, edits intact.
      </p>

      <h2>2 · You committed to main by accident</h2>
      <p>
        <strong>What you see:</strong>{" "}either you notice the branch name in
        the commit output, or you try to push and GitHub refuses:
      </p>
      <CodeBlock
        lang="text"
        code={`
remote: error: GH006: Protected branch update failed for refs/heads/main.
! [remote rejected] main -> main (protected branch hook declined)
`}
      />
      <p>
        <strong>Why it&apos;s fine:</strong>{" "}that rejection is the guard rail
        doing its job. Your commit exists only on your machine; the shared{" "}
        <code>main</code>{" "}on GitHub never saw it. The fix is to move the
        commit onto a proper branch, then put your local main back the way it
        was. Three commands, in order:
      </p>
      <CodeBlock
        lang="bash"
        code={`
git switch -c feat/my-change      # 1. a new branch, pointing at your commit
git switch main                   # 2. back to main
git reset --hard origin/main      # 3. local main forgets the commit, matching GitHub
`}
      />
      <p>
        <strong>Why it works:</strong>{" "}step 1 creates a branch at your
        current position — the commit is now safely reachable from{" "}
        <code>feat/my-change</code>. Step 3 then moves your local main back to
        match <code>origin/main</code>{" "}(GitHub&apos;s copy). The commit is
        not destroyed: a commit is only lost when <em>no</em>{" "}branch points
        to it, and yours now has one. This is the one routine use of{" "}
        <code>reset --hard</code>{" "}that is genuinely safe — because you
        parked the work on a branch first. Never run step 3 without step 1.
      </p>
      <p>
        <strong>Verify:</strong>{" "}<code>git log --oneline -3</code>{" "}on main
        shows the commit gone; the same command on your new branch shows it at
        the top. Push the branch and open the PR as normal.
      </p>

      <h2>3 · You staged a file you didn&apos;t mean to</h2>
      <p>
        <strong>What you see:</strong>{" "}<code>git status</code>{" "}lists
        something under “Changes to be committed” that shouldn&apos;t go in —
        a scratch query, an unrelated edit, a file you don&apos;t recognise.
      </p>
      <CodeBlock lang="bash" code={`git restore --staged path/to/file`} />
      <p>
        <strong>Why it works:</strong>{" "}staging is just a shortlist for the
        next commit. <code>restore --staged</code>{" "}takes the file off the
        shortlist and nothing else — your edits to it are untouched, it simply
        moves back to the “not staged” group. Commit as normal; the file stays
        behind.
      </p>
      <Callout kind="warn" title="A file you don't recognise?">
        <p>
          Stop before unstaging and look at it. If it is a data file, an
          extract or credentials, work out how it got into the project folder —
          the fix is moving it out of the workspace, not just out of the
          commit. The repository is public.
        </p>
      </Callout>

      <h2>4 · You want to throw away edits to a file</h2>
      <p>
        <strong>What you see:</strong>{" "}an experiment didn&apos;t work and you
        want the file back the way the last commit left it.
      </p>
      <CodeBlock
        lang="bash"
        code={`
git diff path/to/file       # look at what you'd be deleting, first
git restore path/to/file    # then discard it
`}
      />
      <p>
        <strong>The warning that matters:</strong>{" "}uncommitted edits are the
        one thing git cannot bring back. <code>restore</code>{" "}overwrites the
        file with the committed version and your edits are gone — there is no
        undo for the undo. That is why the <code>diff</code>{" "}comes first:
        read what you are about to lose. If any of it is worth keeping, commit
        it (commits are free and private until pushed) and <em>then</em>{" "}tidy
        up.
      </p>
      <p>
        <code>git restore .</code>{" "}discards every unstaged edit in the
        project at once. Same rule, multiplied: diff first, restore second.
      </p>

      <h2>5 · You want to undo the last commit but keep the work</h2>
      <p>
        <strong>What you see:</strong>{" "}you committed too early, with the
        wrong files, or with a message the hook rejected in spirit — and you
        haven&apos;t pushed yet.
      </p>
      <CodeBlock lang="bash" code={`git reset --soft HEAD~1`} />
      <p>
        <strong>Why it works:</strong>{" "}<code>HEAD~1</code>{" "}means “one
        commit before where I am now”. <code>--soft</code>{" "}moves the branch
        back one step but leaves both your files and the staging area exactly
        as they were the moment before you committed. Nothing about your work
        changes — the snapshot is simply unwound so you can restage and commit
        it properly.
      </p>
      <p>
        <strong>Already pushed?</strong>{" "}Then the commit is shared and you
        fix forwards instead: make the correcting change as a new commit and
        push it. On a PR branch nobody expects a tidy history — the squash
        merge flattens it anyway. Rewriting pushed history (<code>--force</code>)
        is not part of normal work here.
      </p>

      <h2>6 · You pushed something that shouldn&apos;t be public</h2>
      <p>
        Two different problems, two different responses.
      </p>
      <p>
        <strong>Wrong code:</strong>{" "}a bad change, a broken model, a file
        that belongs elsewhere. No drama — the public, safe undo is:
      </p>
      <CodeBlock lang="bash" code={`git revert <commit-sha>`} />
      <p>
        <code>revert</code>{" "}creates a <em>new</em>{" "}commit that applies the
        opposite change. History stays intact and truthful; the mistake and its
        correction are both on record. This is the only undo you should reach
        for on anything already pushed.
      </p>
      <p>
        <strong>A secret or data:</strong>{" "}a credential, a patient-level
        extract, anything sensitive. Tell the team <em>immediately</em> — this
        is a rotate-the-credential problem, not a delete-the-file problem.
        Deleting in a later commit removes nothing: the earlier commit still
        contains it, publicly, forever, and it may already be cached or cloned.
        Scrubbing history is a coordinated team job; a credential must be
        assumed compromised and rotated regardless. Speed of reporting matters
        far more than tidiness.
      </p>

      <h2>7 · Your branch has fallen behind main</h2>
      <p>
        <strong>What you see:</strong>{" "}the PR page says the branch is out of
        date, or has conflicts with main. Days passed, teammates merged, and
        main moved on while your branch stood still.
      </p>
      <CodeBlock
        lang="bash"
        code={`
git fetch origin            # update your picture of GitHub, changes nothing local
git merge origin/main       # bring main's new commits into your branch
`}
      />
      <p>
        Most of the time the merge completes on its own and you just push.
        When both histories changed the same lines, git stops and asks — which
        is the next section, not a failure. (GitHub&apos;s “Update branch”
        button on the PR does the same merge server-side.)
      </p>

      <h2>Merge conflicts, slowly</h2>
      <p>
        A conflict is git being honest. Your branch says a line should read one
        way; main now says it should read another; git refuses to guess which
        version is true. It is not an error state and nothing is damaged — the
        merge is simply paused, waiting for a human decision.
      </p>
      <p>
        <code>git status</code>{" "}during a paused merge lists the disputed
        files under “Unmerged paths”. Open one and you find the disputed
        region fenced with markers:
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
      <p>Read the fence line by line:</p>
      <ul>
        <li>
          <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</code>{" "}opens{" "}
          <strong>your</strong>{" "}version — HEAD means “where you are”, your
          branch.
        </li>
        <li><code>=======</code>{" "}is the divider.</li>
        <li>
          <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt; origin/main</code>{" "}closes{" "}
          <strong>their</strong>{" "}version — what main now says.
        </li>
        <li>
          Everything outside the fence merged cleanly and needs nothing from
          you.
        </li>
      </ul>
      <p>
        Your job is to make the file read the way it <em>should</em>, then
        delete the three marker lines. Three outcomes are possible, and all
        three are legitimate: keep yours, keep theirs, or write a line that
        combines both. In the example above, if main renamed the column while
        you added cleaning, the right answer is probably the combination —
        your <code>upper(trim(...))</code>{" "}around their column name.
      </p>
      <p>In VS Code the mechanics are:</p>
      <ol>
        <li>
          Open the Source Control panel — conflicted files sit in their own
          “Merge Changes” group.
        </li>
        <li>
          Open each file. VS Code highlights every fence and offers{" "}
          <strong>Accept Current Change</strong>{" "}(yours),{" "}
          <strong>Accept Incoming Change</strong>{" "}(main&apos;s),{" "}
          <strong>Accept Both</strong>, or you simply edit the lines by hand.
          For anything non-trivial, editing by hand is clearer than the
          buttons.
        </li>
        <li>
          Check the whole file reads as valid SQL or YAML with no{" "}
          <code>&lt;&lt;&lt;</code>{" "}left anywhere — search the file for{" "}
          <code>&lt;&lt;&lt;&lt;</code>{" "}to be sure.
        </li>
        <li>
          Stage, commit, push:{" "}
          <code>git add -u && git commit && git push</code>. The commit message
          is pre-filled with “Merge…” — keeping it is fine.
        </li>
        <li>
          If the model logic was disputed, rebuild it:{" "}
          <code>dbt build -s the_model</code>{" "}— resolving text is not the
          same as proving the SQL still works.
        </li>
      </ol>
      <p>
        Mid-merge and regretting it? Stand back up exactly where you started:
      </p>
      <CodeBlock lang="bash" code={`git merge --abort`} />
      <Callout kind="info" title="Conflicts are normal, not damage">
        <p>
          They are the cost of two people improving the same code, and small
          short-lived branches keep them rare and small. A conflict on a
          one-model branch is usually a two-minute fix. If a conflict is big,
          confusing, or touches logic you don&apos;t own, resolving it{" "}
          <em>with</em>{" "}the other author on a call is the fast path, not the
          embarrassing one.
        </p>
      </Callout>

      <h2>The two commands that actually destroy work</h2>
      <p>
        Everything above is recoverable except two moves, and both only ever
        destroy <em>uncommitted</em>{" "}work:{" "}
        <code>git restore</code>{" "}(discarding edits) and{" "}
        <code>git reset --hard</code>{" "}(discarding edits while moving the
        branch). Treat both as deliberate deletions: diff first, be sure, then
        run. Everything committed has a safety net — even commits that look
        lost after a bad reset can usually be recovered from git&apos;s
        journal (<code>git reflog</code>), which is exactly the kind of rescue
        a teammate can do with you in minutes.
      </p>

      <h2>When to stop and ask</h2>
      <ul>
        <li>
          You are about to run a command with <code>--force</code>{" "}or{" "}
          <code>--hard</code>{" "}that you found online and don&apos;t fully
          understand.
        </li>
        <li>The fix seems to involve rewriting history that is already pushed.</li>
        <li>
          You&apos;ve run two fixes already and status looks stranger each
          time.
        </li>
      </ul>
      <p>
        Asking at that point is the experienced move. Every analyst on the team
        has been in the same spot, the mess is almost always minutes from
        fixed, and the truly expensive messes are the ones people compound
        alone with commands they found in a panic.
      </p>
    </LessonShell>
  );
}
