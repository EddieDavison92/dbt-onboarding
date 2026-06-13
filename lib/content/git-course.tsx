import type { Course } from "@/lib/course-types";
import { CodeBlock } from "@/components/CodeBlock";
import { BranchDiagram } from "@/components/BranchDiagram";
import { TryIt } from "@/components/TryIt";
import { Callout } from "@/components/Callout";

export const GIT_COURSE: Course = {
  slug: "git-essentials",
  title: "Git essentials",
  tagline: "Version control from zero — the foundation everything else stands on",
  audience: "Start here if you have never used git. No installation needed yet — this course is about the ideas and the handful of commands.",
  hours: "~1 hr",
  accent: "var(--layer-staging)",
  lessons: [
    // ------------------------------------------------------------------
    {
      slug: "what-version-control-is",
      title: "What version control is",
      blurb: "The problem with copies, and the idea that replaces them",
      minutes: 8,
      steps: [
        {
          id: "copies",
          body: (
            <>
              <p>
                You already do version control. It looks like this:
              </p>
              <CodeBlock
                lang="text"
                code={`
analysis.sql
analysis_v2.sql
analysis_v2_FINAL.sql
analysis_v2_FINAL_jw_comments.sql
`}
              />
              <p>
                Copies-as-versions work, briefly. Then you can&apos;t remember what
                changed between v2 and FINAL, two people edit different copies at
                once, and nobody is sure which file is the real one.
              </p>
            </>
          ),
        },
        {
          id: "snapshots",
          title: "Snapshots instead of copies",
          body: (
            <>
              <p>
                Git solves this with one idea: keep <strong>one</strong>{" "}set of
                files, and record <strong>snapshots</strong>{" "}of them over time. Each
                snapshot stores what every file looked like at that moment, who took
                it, when, and a one-line description of what changed.
              </p>
              <p>
                The full history is always there — you can look at any snapshot, see
                the exact difference between any two, and wind back if needed. But
                day to day you just work on the files, like normal.
              </p>
            </>
          ),
          check: {
            prompt:
              "You need last month's version of a query. With git, where is it?",
            options: [
              "In a backup folder, if someone kept one",
              "In the file's history — every snapshot is kept and viewable",
              "Gone — git only keeps the latest version",
              "In your email, attached to an old message",
            ],
            answer: 1,
            explain:
              "Every snapshot is permanently in the history. Viewing what a file looked like at any point — and exactly what changed since — is the core thing git does.",
            affirm: "every version lives in the history — no more _FINAL_v3 copies.",
          },
        },
        {
          id: "repo",
          title: "The repository",
          body: (
            <>
              <p>
                A folder managed by git is called a <strong>repository</strong>{" "}
                (“repo”). Our repo is <code>dbt-analytics</code>: every model, every
                test, every line of documentation, plus the entire history of all of
                it.
              </p>
              <p>
                The repo lives in two kinds of place at once: on{" "}
                <strong>GitHub</strong>{" "}(the shared copy everyone can see) and as a{" "}
                <strong>clone</strong>{" "}on each person&apos;s machine (your private
                working copy). You work locally; sharing happens when you choose to
                send your snapshots up.
              </p>
            </>
          ),
        },
        {
          id: "why-team",
          title: "Why this matters for a team",
          body: (
            <>
              <p>
                Because everyone clones the same repo, there is exactly one shared
                codebase. Everyone can read everyone else&apos;s work; every change
                says who made it and why; and two people editing at the same time is
                a normal, managed situation rather than a disaster involving email
                attachments.
              </p>
            </>
          ),
          check: {
            prompt: "A clone is…",
            options: [
              "A read-only view of the GitHub repo",
              "Your own full working copy of the repo, history included",
              "A backup that updates automatically",
              "A copy of just the files you plan to edit",
            ],
            answer: 1,
            explain:
              "A clone is the whole repo — every file and the full history — on your machine. It does not sync by itself: you choose when to pull changes down and push yours up.",
            affirm: "a clone is the full repo on your machine — it only syncs when you choose.",
          },
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      slug: "branches-and-commits",
      title: "Branches and commits",
      blurb: "Working safely beside production, one small change at a time",
      minutes: 12,
      steps: [
        {
          id: "main",
          body: (
            <>
              <p>
                Every repo has a default branch, but its name is configurable. Some
                repositories still call it <code>master</code>; many now use{" "}
                <code>main</code>. <strong>Our default branch is main</strong>, and in
                this project it is the production branch: what is on main is what
                builds in Snowflake every night. So main has to stay correct at all
                times — which means you never edit it directly. It is locked; even
                administrators cannot push straight to it.
              </p>
            </>
          ),
        },
        {
          id: "branch",
          title: "A branch is a safe parallel line",
          body: (
            <>
              <p>
                To change anything, you create a <strong>branch</strong>: a new line
                of history that starts from main&apos;s current state. On your branch
                you can edit, experiment and make mistakes freely — main is untouched,
                and so is everyone else&apos;s work.
              </p>
              <p>
                Branches are cheap and disposable. One branch per piece of work, named
                for what it does: <code>feat/opening-hours-staging</code>,{" "}
                <code>fix/age-band-boundary</code>.
              </p>
            </>
          ),
          check: {
            prompt:
              "You break something badly on your branch. What happened to production?",
            options: [
              "Nothing — the branch is a separate line; main is untouched",
              "Production is broken until you fix the branch",
              "Production reverts to last night's backup",
              "It depends how big the mistake was",
            ],
            answer: 0,
            explain:
              "This is the whole point of branches: your work-in-progress, however broken, exists only on your branch. Production code only changes when a branch is deliberately merged into main.",
            affirm: "nothing on your branch can touch production — that's the point of branches.",
          },
        },
        {
          id: "commit",
          title: "A commit is a labelled snapshot",
          body: (
            <>
              <p>
                As you work on your branch, you save your progress as{" "}
                <strong>commits</strong> — those snapshots from lesson one. Each
                commit has a message saying what it does:
              </p>
              <CodeBlock
                lang="text"
                code={`
feat: add opening hours staging model
fix: correct age band boundary
docs: describe waiting list snapshot logic
`}
              />
              <p>
                Each message should finish the sentence “this commit will…” so that
                someone reading the history can understand what changed.
              </p>
            </>
          ),
        },
        {
          id: "hygiene",
          title: "Branch and commit hygiene",
          body: (
            <>
              <p>
                Two habits keep Git work easy to understand: <strong>commit small,
                commit often; branch small, branch often.</strong>
              </p>
              <div className="my-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border-2 border-layer-staging bg-layer-staging/5 p-4 shadow-[4px_4px_0_0_var(--color-layer-staging)]">
                  <p className="!my-0 font-display text-[10px] font-extrabold uppercase tracking-[0.16em] !text-layer-staging">
                    Commit hygiene
                  </p>
                  <p className="!mb-2 !mt-2 font-display text-lg font-extrabold !text-ink">
                    Commit small, commit often
                  </p>
                  <div className="flex items-center gap-1.5" aria-hidden>
                    <span className="h-2 flex-1 rounded-full bg-layer-staging" />
                    <span className="h-2 flex-1 rounded-full bg-layer-staging" />
                    <span className="h-2 flex-1 rounded-full bg-layer-staging/30" />
                  </div>
                  <p className="!mb-0 !mt-3 text-sm !text-ink-soft">
                    Commit small and often. Each snapshot should do one thing and have
                    a message that says what it does.
                  </p>
                </div>
                <div className="rounded-2xl border-2 border-layer-modelling bg-layer-modelling/5 p-4 shadow-[4px_4px_0_0_var(--color-layer-modelling)]">
                  <p className="!my-0 font-display text-[10px] font-extrabold uppercase tracking-[0.16em] !text-layer-modelling">
                    Branch hygiene
                  </p>
                  <p className="!mb-2 !mt-2 font-display text-lg font-extrabold !text-ink">
                    Branch small, branch often
                  </p>
                  <div className="flex items-center gap-1" aria-hidden>
                    {[1, 2, 3, 4, 5].map((item) => (
                      <span
                        key={item}
                        className="h-2 flex-1 rounded-full bg-layer-modelling"
                      />
                    ))}
                  </div>
                  <p className="!mb-0 !mt-3 text-sm !text-ink-soft">
                    Keep one outcome on each branch. Finish and share it, then start
                    the next branch from fresh main.
                  </p>
                </div>
              </div>
              <p>
                They solve different problems. Small commits make the history easy to
                follow. Small, short-lived branches are easier to review and less
                likely to conflict with changes on <code>main</code>.
              </p>
              <Callout kind="info" title="What a merge conflict means">
                <p>
                  A merge conflict happens when your branch and <code>main</code> have
                  changed the same lines in the same file. Git cannot know which
                  version you intend to keep, so it stops and asks a person instead
                  of silently choosing one.
                </p>
              </Callout>
            </>
          ),
          check: {
            prompt: "When does Git need a person to resolve a merge conflict?",
            options: [
              "Whenever two branches change the same file",
              "When your branch and main change the same lines in the same file",
              "Whenever a branch contains more than one commit",
              "When two people create branches on the same day",
            ],
            answer: 1,
            explain:
              "Two branches can safely change different parts of the same file. Git stops when edits overlap on the same lines and it cannot infer which version should win.",
            affirm: "same file and same lines: Git stops rather than guessing.",
          },
        },
        {
          id: "history",
          title: "Put together",
          body: (
            <>
              <p>The shape of all work in this project, every time:</p>
              <BranchDiagram />
              <p>
                You branch off main (after C), commit your work (D, E, F), and
                eventually your branch is merged back (G) — through a process with
                safety checks, which we cover shortly.
              </p>
            </>
          ),
          check: {
            prompt: "Which statement is true?",
            options: [
              "A commit is a branch you have finished with",
              "A branch is a sequence of commits, parallel to main",
              "Commits only exist on main",
              "You need a new branch for every commit",
            ],
            answer: 1,
            explain:
              "Branch = the parallel line; commits = the snapshots along it. One branch per piece of work, several commits per branch.",
            affirm: "branch = the parallel line, commits = the snapshots along it.",
          },
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      slug: "public-repository-safety",
      title: "What belongs in the project",
      blurb: "How .gitignore keeps local clutter out, and why seeds are different",
      minutes: 9,
      steps: [
        {
          id: "project-boundary",
          body: (
            <>
              <p>
                A dbt project contains the <strong>instructions</strong>{" "}for turning
                warehouse data into useful datasets. You commit SQL models, YAML
                properties, tests, macros and documentation. The data itself stays in
                Snowflake; dbt sends queries to it rather than copying rows into your
                project folder.
              </p>
              <p>
                The code is public deliberately. Analytical definitions are more useful
                when other organisations can adopt or adapt them in their own projects,
                users can trace how a measure was produced, and people outside the
                immediate team can question and improve the logic. Open code also makes
                it possible to build tools that explain a result through its documented
                upstream lineage, rather than presenting a number without its reasoning.
              </p>
              <Callout kind="info" title="Open definitions, not open data">
                <p>
                  Anyone can inspect the transformation logic; access to the underlying
                  warehouse data remains controlled separately. <code>dbt-analytics</code>{" "}
                  is therefore a public codebase, not a workspace for extracts or
                  analysis outputs.
                </p>
              </Callout>
            </>
          ),
          check: {
            prompt: "When a dbt model runs, where do its result rows belong?",
            options: [
              "In a CSV beside the model",
              "In the data warehouse; the repository keeps the SQL that creates them",
              "In git history so reviewers can inspect them",
              "In the project's target folder",
            ],
            answer: 1,
            explain:
              "The project stores transformation instructions. dbt runs those instructions in Snowflake, where the resulting tables and views remain.",
            affirm: "git stores the instructions; the warehouse stores the data.",
          },
        },
        {
          id: "gitignore",
          title: ".gitignore handles the predictable clutter",
          body: (
            <>
              <p>
                The repository includes a file called <code>.gitignore</code>. It lists
                paths that Git should leave out of its normal file list. Here is a
                shortened version of the project&apos;s real rules:
              </p>
              <CodeBlock
                lang="text"
                code={`
# dbt-generated files
target/
logs/
dbt_packages/

# Local credentials and environments
.env
.env.*
.venv/

# Data-shaped files
*.csv
*.xlsx
*.parquet

# Deliberate exception
!seeds/*.csv
`}
              />
              <p>
                A trailing <code>/</code>{" "}matches a directory. <code>*</code>{" "}is a
                wildcard. A rule beginning with <code>!</code>{" "}makes an exception to
                an earlier rule. Because the file is committed, everyone who clones the
                project gets the same defaults.
              </p>
              <Callout kind="info" title="Ignored is not the same as forbidden">
                <p>
                  <code>.gitignore</code>{" "}only filters untracked files. It does not
                  inspect contents, and it does not remove a file that Git already tracks.
                  Treat it as a tidy set of guardrails, not as a security scanner.
                </p>
              </Callout>
            </>
          ),
          check: {
            prompt: "Why does `target/` not normally appear in `git status`?",
            options: [
              "dbt deletes it when each command finishes",
              "GitHub removes generated files after a push",
              "The project's `.gitignore` tells Git to ignore that generated directory",
              "Files inside directories cannot be committed",
            ],
            answer: 2,
            explain:
              "dbt writes compiled SQL and other generated artefacts to target/. The project ignores that directory because it can be recreated and does not belong in version control.",
            affirm: ".gitignore keeps reproducible local artefacts out of the file list.",
          },
        },
        {
          id: "seeds",
          title: "Seeds are the deliberate data exception",
          body: (
            <>
              <p>
                A dbt <strong>seed</strong>{" "}is a CSV that intentionally lives under
                <code>seeds/</code>. Running <code>dbt seed</code>{" "}loads it into
                Snowflake, and models can use <code>ref()</code>{" "}to depend on it.
                That is why the ignore file first ignores CSVs, then makes a narrow
                exception for seed files.
              </p>
              <p>
                Seeds should be small, static reference datasets that belong to the
                project&apos;s logic: mappings, categories, code lists or thresholds that
                change infrequently. They are reviewed and versioned like code. A query
                export, a sample of patient records or a large source dataset is not a
                seed, even if you place it in that folder.
              </p>
            </>
          ),
          check: {
            prompt: "Which CSV is a sensible dbt seed?",
            options: [
              "A daily export of appointments",
              "A sample of pseudonymised patient records",
              "A small team-owned mapping from status codes to reporting categories",
              "The output of a query used to debug a model",
            ],
            answer: 2,
            explain:
              "Seeds are for small, stable reference data that forms part of the project's logic. Extracts and record-level examples still belong outside the repository.",
            affirm: "a seed is reviewed reference data, not a convenient place for an extract.",
          },
        },
        {
          id: "final-check",
          title: "Treat the repository as a public record",
          body: (
            <>
              <p>
                Normal work in this project should leave you with a short, unsurprising
                list: SQL, YAML, macros, documentation and, occasionally, an intentional
                seed. Credentials stay in ignored environment files. Build artefacts stay
                in ignored dbt directories. Data extracts stay outside the project
                workspace altogether.
              </p>
              <p>
                Once pushed, the code, YAML, comments, filenames, commit authors and
                commit messages are visible to anyone, including earlier committed
                versions. Pull request descriptions and review conversations are public
                on GitHub too. Write them as a professional record that helps a future
                reader understand the work; never use them for data, credentials or
                private notes.
              </p>
              <p>
                Before committing, read <code>git status</code>{" "}and review the diff.
                If an unexpected file appears, stop and understand it before staging.
                If sensitive material is ever committed, tell the team immediately;
                deleting it later does not remove it from Git history, and a credential
                may need to be rotated.
              </p>
            </>
          ),
          check: {
            prompt: "Which statement about a pushed commit is true?",
            options: [
              "Only the latest version of each file is public",
              "The code is public, but its comments and commit message are private",
              "Its tracked files, authorship and message become part of the public history",
              "Its contents remain private until the pull request is merged",
            ],
            answer: 2,
            explain:
              "Pushing publishes the branch's committed history. That includes tracked file contents, comments inside those files, authorship and commit messages; GitHub also shows the public pull request discussion.",
            affirm: "open code creates shared understanding, so write every public part with care.",
          },
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      slug: "the-daily-commands",
      title: "The daily commands",
      blurb: "Six commands, introduced one at a time",
      minutes: 16,
      steps: [
        {
          id: "intro",
          body: (
            <>
              <p>
                Git has hundreds of commands. Daily work here uses{" "}
                <strong>six</strong>. This lesson introduces them one at a time —
                and you will <em>run</em>{" "}each one in a simulated terminal, so you
                see exactly what your real machine will say back. Nothing to
                install; type the command (or use “type it for me”) and press Enter.
              </p>
            </>
          ),
        },
        {
          id: "pull",
          title: "1 · git pull — start from fresh main",
          body: (
            <>
              <p>
                Before starting new work, return to <code>main</code>{" "}and update it
                from GitHub. Your new branch will begin from exactly that fresh
                version of the project:
              </p>
              <TryIt
                stages={[
                  {
                    cmd: "git switch main",
                    out: `Switched to branch 'main'
Your branch is up to date with 'origin/main'.`,
                    prompt: "first, return to the project's default branch",
                  },
                  {
                    cmd: "git pull",
                    out: `Updating a17c9b2..e43d0af
Fast-forward
 models/staging/shared/stg_specialties.sql | 8 +++++---
 1 file changed, 5 insertions(+), 3 deletions(-)`,
                    prompt: "download and apply anything merged since your last update",
                  },
                ]}
                done="Your local main now matches origin/main, so the next branch starts from the team's latest work."
              />
              <p>
                <code>origin/main</code>{" "}means the copy of <code>main</code>{" "}on
                GitHub. <code>git pull</code>{" "}brings commits from that remote branch
                into your local <code>main</code>. Do this before creating each new
                branch, not halfway through work on an existing one.
              </p>
            </>
          ),
          check: {
            prompt: "Why run `git pull` on `main` before creating a new branch?",
            options: [
              "So the branch starts from the team's latest merged work",
              "Because `git pull` creates the new branch for you",
              "So your uncommitted changes are uploaded to GitHub",
              "Because branches cannot be created from an older commit",
            ],
            answer: 0,
            explain:
              "A branch begins at your current commit. Updating local `main` first means the branch begins at the latest `origin/main` commit, reducing avoidable conflicts and duplicated work.",
            affirm: "fresh main first, then branch from the team's latest work.",
          },
        },
        {
          id: "switch",
          title: "2 · git switch — create the branch",
          body: (
            <>
              <p>
                Main is fresh. Now create the safe branch where the work will
                happen:
              </p>
              <TryIt
                stages={[
                  {
                    cmd: "git switch -c feat/opening-hours",
                    out: `Switched to a new branch 'feat/opening-hours'`,
                  },
                ]}
                done="One quiet line — you're now on a safe parallel line of history, edits intact."
              />
              <p>
                The <code>-c</code>{" "}flag (<em>create</em>) makes the branch as it
                moves you onto it. Without <code>-c</code>, switch moves between
                branches that already exist — <code>git switch main</code>{" "}takes you
                back.
              </p>
            </>
          ),
          check: {
            prompt: "What does `git switch -c feat/new-model` do?",
            options: [
              "Creates a branch called `feat/new-model` and moves you onto it",
              "Copies your files into a folder called `feat/new-model`",
              "Commits your changes to a branch called `feat/new-model`",
              "Switches to an existing branch called `feat/new-model`",
            ],
            answer: 0,
            explain:
              "`-c` is create. Without it, `git switch` moves to a branch that already exists. Nothing is committed yet — you've just opened a fresh line to work on.",
            affirm: "switch -c creates the branch and moves you onto it — nothing is committed yet.",
          },
        },
        {
          id: "status",
          title: "3 · git status — what changed?",
          body: (
            <>
              <p>
                Now imagine you have edited one model file and created its
                documentation file. Ask git where things stand:
              </p>
              <TryIt
                stages={[
                  {
                    cmd: "git status",
                    out: `On branch feat/opening-hours
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
        modified:   models/staging/shared/stg_opening_hours.sql

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        models/staging/shared/stg_opening_hours.yml`,
                  },
                ]}
                done="Branch, changed files, and a suggestion for what to do next — status changes nothing, it only reports."
              />
              <p>
                Read it top to bottom: you are safely on your feature branch, one
                file is modified, and one is brand new (“untracked”).{" "}
                <strong>When in doubt, run status.</strong>
              </p>
            </>
          ),
        },
        {
          id: "add",
          title: "4 · git add — choose what goes in the snapshot",
          body: (
            <>
              <p>
                The step that surprises newcomers: editing a file does{" "}
                <strong>not</strong>{" "}put it in your next commit. You explicitly{" "}
                <em>stage</em>{" "}what you want included. Stage both files, then check
                what changed:
              </p>
              <TryIt
                stages={[
                  {
                    cmd: "git add -u",
                    out: ``,
                    prompt: "stage every file you've modified (-u = updated)",
                  },
                  {
                    cmd: "git add models/staging/shared/stg_opening_hours.yml",
                    out: ``,
                    prompt: "the new file is untracked, so -u didn't catch it — add it by name",
                  },
                  {
                    cmd: "git status",
                    out: `On branch feat/opening-hours
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        modified:   models/staging/shared/stg_opening_hours.sql
        new file:   models/staging/shared/stg_opening_hours.yml`,
                  },
                ]}
                done="Silence is success for git add — and status confirms both files are staged, ready for the snapshot."
              />
              <p>
                Why the extra step? Because you often change more than you mean to
                share — staging lets you commit exactly what you intend and nothing
                else. Note that <code>git add</code>{" "}prints nothing when it works;
                status is how you confirm.
              </p>
            </>
          ),
          check: {
            prompt:
              "You edited three files but only staged one. What does the next commit contain?",
            options: [
              "All three files — committing saves everything",
              "Only the staged file",
              "Nothing — you must stage all changes first",
              "The staged file plus any file changed in the last hour",
            ],
            answer: 1,
            explain:
              "The commit is exactly the staged set. The other two files keep their changes on disk, uncommitted — git status will keep showing them until you stage or discard them.",
            affirm: "a commit contains exactly what you staged — nothing more.",
          },
        },
        {
          id: "commit",
          title: "5 · git commit — take the snapshot",
          body: (
            <>
              <p>
                Both files staged — record the snapshot, with a conventional-commits
                message (type prefix, colon, short description). Then check status
                to see what changed:
              </p>
              <TryIt
                stages={[
                  {
                    cmd: 'git commit -m "feat: add opening hours staging model"',
                    out: `[feat/opening-hours 3f2a1c9] feat: add opening hours staging model
 2 files changed, 34 insertions(+)`,
                  },
                  {
                    cmd: "git status",
                    out: `On branch feat/opening-hours
nothing to commit, working tree clean`,
                    prompt: "where did the staged files go? ask status",
                  },
                ]}
                done="The staged files are now a permanent snapshot in your branch's history — which is why status reports a clean working tree."
              />
              <p>What actually happened, decoded from that first output line:</p>
              <ul>
                <li>
                  Your two staged files became a <strong>permanent snapshot</strong>{" "}
                  in the branch&apos;s history — that is the whole event.
                </li>
                <li>
                  <code>3f2a1c9</code>{" "}is the snapshot&apos;s id: a short reference
                  you (or anyone) can use to look at exactly this version forever.
                </li>
                <li>
                  <code>2 files changed, 34 insertions(+)</code>{" "}summarises the
                  difference this snapshot records against the previous one.
                </li>
                <li>
                  The staging area is now empty — hence{" "}
                  <code>working tree clean</code>. Editing a file would start the
                  status → add → commit cycle again.
                </li>
              </ul>
              <p>
                A hook checks the message format (<code>feat</code>,{" "}
                <code>fix</code>, <code>docs</code>, <code>chore</code>…) and tells
                you if it is off. And note: committing is <strong>local</strong> —
                nothing has left your machine yet.
              </p>
            </>
          ),
        },
        {
          id: "push",
          title: "6 · git push — share it",
          body: (
            <>
              <TryIt
                stages={[
                  {
                    cmd: "git push",
                    out: `Enumerating objects: 9, done.
Writing objects: 100% (6/6), 1.21 KiB, done.
remote:
remote: Create a pull request for 'feat/opening-hours' on GitHub by visiting:
remote:   https://github.com/wnl-icb-analytics/dbt-analytics/pull/new/feat/opening-hours
remote:
To https://github.com/wnl-icb-analytics/dbt-analytics.git
 * [new branch]      feat/opening-hours -> feat/opening-hours`,
                  },
                ]}
                done="Your branch is on GitHub — and git even hands you the link to open the pull request."
              />
              <p>
                Until you push, your work exists only on your machine — push is the
                moment it becomes shared. (A brand-new branch may first ask you to
                set an “upstream”; git prints the exact command to run, once.)
              </p>
            </>
          ),
        },
        {
          id: "loop",
          title: "The whole loop",
          body: (
            <>
              <CodeBlock
                lang="bash"
                title="the daily rhythm"
                code={`
git switch main                 # 1. return to main
git pull                        # 2. update it from origin/main
git switch -c feat/my-change    # 3. branch from fresh main
# ...edit files...
git status                      # 4. what did I change?
git add -u                      # 5. stage it
git commit -m "feat: ..."       # 6. snapshot it
git push                        # share the branch
`}
              />
              <p>
                That is the daily rhythm. Freshen main, branch once per piece of
                work, then status, add and commit as you go; push when you want the
                branch shared.
              </p>
            </>
          ),
          check: {
            prompt: "Right after `git commit`, where does your work exist?",
            options: [
              "On GitHub, visible to the team",
              "Only on your machine, on your branch",
              "On `main`, ready for tonight's build",
              "In the staging area, waiting to be pushed",
            ],
            answer: 1,
            explain:
              "Commit is local. The snapshot is safely recorded on your branch — but only push sends it to GitHub. (And nothing reaches main until a pull request is merged.)",
            affirm: "commit saves locally — push is what shares it.",
          },
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      slug: "pull-requests",
      title: "Pull requests",
      blurb: "How automated checks and review get a branch into production",
      minutes: 9,
      steps: [
        {
          id: "what",
          body: (
            <>
              <p>
                Your branch is pushed. To get it into <code>main</code> — into
                production — you open a <strong>pull request</strong>{" "}(PR): a
                proposal, on GitHub, that says “merge this branch into main”. The PR
                shows every line you changed, side by side with what it replaces.
              </p>
              <p>
                Nothing reaches main any other way. Between proposal and merge sit
                two safety nets.
              </p>
            </>
          ),
        },
        {
          id: "ci",
          title: "Safety net one: automation",
          body: (
            <>
              <p>
                When a PR opens, <strong>CI</strong>{" "}(continuous integration) runs
                fast checks on the branch. dbt compiles the project against the dev
                catalogue, catching broken references, Jinja, YAML and SQL. Other
                checks make sure changed models have descriptions and tests, use
                <code>ref()</code>{" "}and <code>source()</code>{" "}properly, and do not
                skip the staging layer. Missing ownership is suggested in a comment.
              </p>
              <p>
                CodeRabbit reviews the diff once the PR is no longer a draft. It looks
                for risks such as suspicious joins, likely fan-out, missing tests and
                models in the wrong layer.
              </p>
              <p>
                When you request a human review, a slower validation builds and tests
                the changed models against real data in Snowflake DEV. Changes to a
                model&apos;s YAML include that model; changes to a macro include models
                that use it. This is the closest rehearsal of what will run in
                production.
              </p>
              <p>
                Failing checks show a red cross on the PR. Fix the issue, commit and
                push to the same branch; the relevant checks run again. All required
                checks must pass before the PR can merge.
              </p>
            </>
          ),
          check: {
            prompt: "A CI check on your PR goes red. The right response is…",
            options: [
              "Fix the issue locally, commit, and `git push` to the same branch — checks re-run",
              "Open a new PR so the checks start fresh",
              "Ask someone to merge it anyway — checks are advisory",
              "Delete the branch and start again",
            ],
            answer: 0,
            explain:
              "A red check is information: open its details, read the error, fix it, commit and push. The relevant checks run again on the same PR. Failing a check is a normal part of the loop, not a verdict.",
            affirm: "fix locally and push to the same branch — the checks run again.",
          },
        },
        {
          id: "review",
          title: "Safety net two: a human review",
          body: (
            <>
              <p>
                With the automated findings available, a teammate reads your changes
                and applies context that automation does not have. Is the model in the
                right layer, and is the logic reusable? Are the clinical definitions
                sound, with code lists broad enough for the intended population? Is
                the code straightforward to maintain, and is it clear what would need
                to change when the definition changes?
              </p>
              <p>
                CodeRabbit and CI can flag missing tests, suspicious joins and likely
                fan-out. Those are useful signals, but they cannot prove that the
                intended grain or clinical definition is correct. That judgement
                belongs to the team.
              </p>
              <p>
                Reviewers leave questions, suggestions and approvals. You respond by
                replying and, where needed, pushing more commits to the same branch;
                the PR updates automatically. Review comments are about the code, not
                about you. They are how knowledge moves around the team.
              </p>
              <p>
                You can open a <strong>draft PR</strong> before the branch is ready to
                merge. It makes the direction visible and lets teammates give early
                feedback while you keep working.
              </p>
            </>
          ),
        },
        {
          id: "merge",
          title: "Merge — and the loop closes",
          body: (
            <>
              <p>
                Approved and green, the PR merges: your commits land on main as one
                tidy squashed commit, the branch is deleted, and the deployment
                machinery takes over — your models build into production
                automatically. Back on your machine:
              </p>
              <CodeBlock
                lang="bash"
                code={`
git switch main
git pull          # bring main up to date, now including your work
`}
              />
              <p>
                <code>git pull</code>{" "}is the counterpart of push — it downloads what
                changed on GitHub. Do this whenever you start something new, so your
                next branch starts from the latest main.
              </p>
            </>
          ),
          check: {
            prompt: "What is the only route by which code reaches `main`?",
            options: [
              "`git push`, once the branch is tested",
              "A reviewed, CI-green pull request being merged",
              "An administrator copying changes across",
              "The nightly build promotes approved branches",
            ],
            answer: 1,
            explain:
              "Main is protected: direct pushes are rejected for everyone. Review + green checks + merge is the single road, which is exactly why main can be trusted as production.",
            affirm: "a reviewed, green pull request is the only road into main.",
          },
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      slug: "tools-do-the-typing",
      title: "Tools do the typing",
      blurb: "VS Code, AI assistants, and what stays your job",
      minutes: 6,
      steps: [
        {
          id: "vscode",
          body: (
            <>
              <p>
                Here is the good news after three lessons of commands: you will
                rarely type them. VS Code&apos;s <strong>Source Control panel</strong>{" "}
                (the branching icon in the left bar) is the same loop as buttons:
              </p>
              <ul>
                <li>changed files appear as a list — that is <code>git status</code></li>
                <li>the <strong>+</strong>{" "}next to a file stages it — <code>git add</code></li>
                <li>the message box and ✓ button — <code>git commit</code></li>
                <li><strong>Sync / Publish branch</strong> — <code>git push</code>{" "}and <code>pull</code></li>
                <li>the branch name in the status bar switches branches — <code>git switch</code></li>
              </ul>
            </>
          ),
        },
        {
          id: "agents",
          title: "AI assistants run the loop too",
          body: (
            <>
              <p>
                AI coding assistants will happily do the whole sequence from a plain
                instruction — “commit this as a fix and push it” — including writing
                a decent commit message. Use them freely. The reason this course
                taught you the commands anyway: <strong>you are accountable for what
                lands on the branch</strong>. Knowing what add, commit and push mean
                is how you check what a tool did on your behalf — and how you notice
                when it staged a file you never meant to share.
              </p>
            </>
          ),
          check: {
            prompt:
              "An AI assistant commits and pushes for you. What's your job before trusting it?",
            options: [
              "Nothing — the assistant validated it",
              "Check what was actually committed (the diff and the file list), because you are accountable for it",
              "Re-type the commands yourself to make it official",
              "Ask the assistant to confirm twice",
            ],
            answer: 1,
            explain:
              "Tools do mechanics; you own decisions and outcomes. A glance at the diff — in the PR or with git status before pushing — is how you keep that ownership while still letting the tools type.",
            affirm: "tools type the commands — the diff is still yours to own.",
          },
        },
        {
          id: "wrap",
          title: "You know git",
          body: (
            <>
              <p>
                Repo, branch, commit, push, PR, merge — that is the entire mental
                model this project requires, and you now have it. Next,{" "}
                <strong>How dbt thinks</strong>{" "}shows you what dbt is and why the
                project is shaped the way it is — all pictures and questions, nothing
                to install. After that, Your first PR puts both skills together on
                the real repository, including the one-off signed-commit setup.
              </p>
            </>
          ),
        },
      ],
    },
  ],
};
