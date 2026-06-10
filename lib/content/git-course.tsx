import type { Course } from "@/lib/course-types";
import { CodeBlock } from "@/components/CodeBlock";
import { Callout } from "@/components/Callout";

export const GIT_COURSE: Course = {
  slug: "git-essentials",
  title: "Git essentials",
  tagline: "Version control from zero — the foundation everything else stands on",
  audience: "Start here if you have never used git. No installation needed yet — this course is about the ideas and the handful of commands.",
  hours: "~45 min",
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
                Git solves this with one idea: keep <strong>one</strong> set of
                files, and record <strong>snapshots</strong> of them over time. Each
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
                <strong>GitHub</strong> (the shared copy everyone can see) and as a{" "}
                <strong>clone</strong> on each person&apos;s machine (your private
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
          },
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      slug: "branches-and-commits",
      title: "Branches and commits",
      blurb: "Working safely beside production, one snapshot at a time",
      minutes: 9,
      steps: [
        {
          id: "main",
          body: (
            <>
              <p>
                Every repo has a default line of history called{" "}
                <code>main</code>. In our project, <strong>main is production</strong>:
                what is on main is what builds in Snowflake every night. So main has
                to stay correct at all times — which means you never edit it
                directly. It is locked; even administrators cannot push straight to
                it.
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
              "This is the whole point of branches: your work-in-progress, however broken, exists only on your branch. Production only changes when a branch is deliberately merged into main.",
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
                Commit small and often — each commit should be one coherent step. A
                branch is usually a handful of commits; the history reads like a
                story of how the work happened.
              </p>
            </>
          ),
        },
        {
          id: "history",
          title: "Put together",
          body: (
            <>
              <p>The shape of all work in this project, every time:</p>
              <CodeBlock
                lang="text"
                code={`
main:    A───B───C───────────G   <- production, always correct
                  \\         /
your branch:       D───E───F     <- your commits, made safely
`}
              />
              <p>
                You branch off main (after C), commit your work (D, E, F), and
                eventually your branch is merged back (G) — through a process with
                safety checks, which is the next lesson.
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
          },
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      slug: "the-daily-commands",
      title: "The daily commands",
      blurb: "Five commands, introduced one at a time",
      minutes: 14,
      steps: [
        {
          id: "intro",
          body: (
            <>
              <p>
                Git has hundreds of commands. Daily work here uses{" "}
                <strong>five</strong>. This lesson introduces them one at a time, in
                the order you use them. Don&apos;t memorise — by the end you&apos;ll
                see the pattern, and there are tools that type these for you (last
                lesson).
              </p>
            </>
          ),
        },
        {
          id: "status",
          title: "1 · git status — where am I?",
          body: (
            <>
              <CodeBlock lang="bash" code={`git status`} />
              <p>
                Shows three things: which branch you are on, which files you have
                changed, and what git suggests doing next. It changes nothing — it
                only reports. <strong>When in doubt, run this.</strong> It is the
                command equivalent of looking before crossing.
              </p>
            </>
          ),
        },
        {
          id: "switch",
          title: "2 · git switch — change branch",
          body: (
            <>
              <CodeBlock
                lang="bash"
                code={`
git switch -c feat/my-change    # create a new branch and move onto it
git switch main                 # move back to main
`}
              />
              <p>
                <code>switch</code> moves you between branches; the <code>-c</code>{" "}
                flag (<em>create</em>) makes a new one as it moves. Your files change
                on disk to match whichever branch you are on — switching is how the
                same folder safely holds many lines of work.
              </p>
            </>
          ),
          check: {
            prompt: "What does git switch -c feat/new-model do?",
            options: [
              "Creates a branch called feat/new-model and moves you onto it",
              "Copies your files into a folder called feat/new-model",
              "Commits your changes to a branch called feat/new-model",
              "Switches to an existing branch called feat/new-model",
            ],
            answer: 0,
            explain:
              "-c is create. Without it, switch moves to a branch that already exists. Nothing is committed yet — you've just opened a fresh line to work on.",
          },
        },
        {
          id: "add",
          title: "3 · git add — choose what goes in the snapshot",
          body: (
            <>
              <p>
                This is the step that surprises newcomers. Editing a file does{" "}
                <strong>not</strong> put it in your next commit. You explicitly{" "}
                <em>stage</em> the files you want included:
              </p>
              <CodeBlock
                lang="bash"
                code={`
git add models/staging/stg_my_model.sql    # stage one file
git add -u                                 # stage every file you've modified
`}
              />
              <p>
                Why the extra step? Because you often change more than one thing at
                once — your model, plus a stray file you opened and accidentally
                touched. Staging lets you commit exactly what you mean and nothing
                else. <code>git status</code> shows staged files in green, unstaged
                in red.
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
              "The commit is exactly the staged set. The other two files keep their changes on disk, uncommitted — git status will keep showing them in red until you stage or discard them.",
          },
        },
        {
          id: "commit",
          title: "4 · git commit — take the snapshot",
          body: (
            <>
              <CodeBlock
                lang="bash"
                code={`git commit -m "feat: add opening hours staging model"`}
              />
              <p>
                Records the staged files as a snapshot on your branch, with your
                message attached. The message format here is{" "}
                <strong>conventional commits</strong> — a type prefix (
                <code>feat</code>, <code>fix</code>, <code>docs</code>,{" "}
                <code>chore</code>), a colon, then a short description of the change.
                A hook checks the format and tells you if it is off.
              </p>
              <p>
                Committing is local — nothing has left your machine yet.
              </p>
            </>
          ),
        },
        {
          id: "push",
          title: "5 · git push — share it",
          body: (
            <>
              <CodeBlock lang="bash" code={`git push`} />
              <p>
                Uploads your branch&apos;s commits to GitHub, where the team can see
                them and a pull request can be opened. Until you push, your work
                exists only on your machine — push is the moment it becomes shared.
              </p>
              <p>
                (The first push of a brand-new branch may ask you to set an
                “upstream” — git prints the exact command to run. Run it once; plain{" "}
                <code>git push</code> works from then on.)
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
git switch -c feat/my-change   # 1. start a branch
# ...edit files...
git status                     # 2. what did I change?
git add -u                     # 3. stage it
git commit -m "feat: ..."      # 4. snapshot it
git push                       # 5. share it
`}
              />
              <p>
                That is the entire daily vocabulary. Branch once per piece of work;
                status, add, commit as you go; push when you want it shared.
              </p>
            </>
          ),
          check: {
            prompt: "Right after git commit, where does your work exist?",
            options: [
              "On GitHub, visible to the team",
              "Only on your machine, on your branch",
              "On main, ready for tonight's build",
              "In the staging area, waiting to be pushed",
            ],
            answer: 1,
            explain:
              "Commit is local. The snapshot is safely recorded on your branch — but only push sends it to GitHub. (And nothing reaches main until a pull request is merged.)",
          },
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      slug: "pull-requests",
      title: "Pull requests",
      blurb: "How a branch becomes production — with two safety nets",
      minutes: 10,
      steps: [
        {
          id: "what",
          body: (
            <>
              <p>
                Your branch is pushed. To get it into <code>main</code> — into
                production — you open a <strong>pull request</strong> (PR): a
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
          id: "review",
          title: "Safety net one: a human review",
          body: (
            <>
              <p>
                A teammate reads your changes and comments — questions (“is this
                grain right?”), suggestions, approvals. You respond by replying and,
                where needed, pushing more commits to the same branch: the PR updates
                automatically.
              </p>
              <p>
                Review comments are about the code, not about you. They are how
                knowledge moves around the team — and within weeks, you will be the
                one asking the questions on someone else&apos;s PR.
              </p>
            </>
          ),
        },
        {
          id: "ci",
          title: "Safety net two: automated checks",
          body: (
            <>
              <p>
                The moment a PR opens, robots get to work — this is{" "}
                <strong>CI</strong> (continuous integration). In our project the
                checks compile every model, lint the code, verify ownership and
                descriptions, build your changed models against real data in a dev
                environment, and an automated reviewer (CodeRabbit) comments on the
                diff.
              </p>
              <p>
                Each check reports a green tick or a red cross on the PR. Merging
                requires green.
              </p>
            </>
          ),
          check: {
            prompt: "A CI check on your PR goes red. The right response is…",
            options: [
              "Fix the issue locally, commit, and push to the same branch — checks re-run",
              "Open a new PR so the checks start fresh",
              "Ask someone to merge it anyway — checks are advisory",
              "Delete the branch and start again",
            ],
            answer: 0,
            explain:
              "A red check is information: click Details, read the last 30 lines of the log, fix, commit, push. The same PR re-runs everything. Failing a check is a normal part of the loop, not a verdict.",
          },
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
                <code>git pull</code> is the counterpart of push — it downloads what
                changed on GitHub. Do this whenever you start something new, so your
                next branch starts from the latest main.
              </p>
            </>
          ),
          check: {
            prompt: "What is the only route by which code reaches main?",
            options: [
              "git push, once the branch is tested",
              "A reviewed, CI-green pull request being merged",
              "An administrator copying changes across",
              "The nightly build promotes approved branches",
            ],
            answer: 1,
            explain:
              "Main is protected: direct pushes are rejected for everyone. Review + green checks + merge is the single road, which is exactly why main can be trusted as production.",
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
                <li>the <strong>+</strong> next to a file stages it — <code>git add</code></li>
                <li>the message box and ✓ button — <code>git commit</code></li>
                <li><strong>Sync / Publish branch</strong> — <code>git push</code> and <code>pull</code></li>
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
          },
        },
        {
          id: "wrap",
          title: "You know git",
          body: (
            <>
              <p>
                Repo, branch, commit, push, PR, merge — that is the entire mental
                model this project requires, and you now have it. One thing was left
                out deliberately: this repo also requires commits to be{" "}
                <em>signed</em> (a one-off key setup proving commits are really
                yours). That is part of machine setup in the{" "}
                <strong>Your first PR</strong> course, which picks up exactly where
                this leaves off.
              </p>
            </>
          ),
        },
      ],
    },
  ],
};
