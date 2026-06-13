import type { Metadata } from "next";
import { LessonShell } from "@/components/LessonShell";
import { CodeBlock } from "@/components/CodeBlock";
import { Callout } from "@/components/Callout";
import { Quiz } from "@/components/Quiz";

export const metadata: Metadata = { title: "Git & pull requests" };

const STEPS = [
  {
    name: "branch",
    desc: "Make a safe copy of main to work on",
    cmd: "git switch -c feat/diabetes-staging",
  },
  {
    name: "commit",
    desc: "Save a labelled snapshot of your changes",
    cmd: 'git commit -m "feat: add diabetes staging model"',
  },
  {
    name: "push",
    desc: "Upload your branch to GitHub",
    cmd: "git push",
  },
  {
    name: "pull request",
    desc: "Propose the change; checks run as their conditions are met",
    cmd: "gh pr create",
  },
  {
    name: "merge",
    desc: "Approved + green checks → lands on main → deploys to prod",
    cmd: "",
  },
];

export default function Page() {
  return (
    <LessonShell
      section="learn"
      slug="git-and-prs"
      kicker="Learn 05"
      title="Git & pull requests"
      lede="Git is version control for the whole project; a pull request is how your change gets a human review and automated checks before it reaches production."
      minutes={12}
    >
      <h2>The mental model</h2>
      <p>
        <code>main</code>{" "}is the production branch — what runs every night. You never
        edit it directly (it is locked). Instead you take a <strong>branch</strong>: a
        parallel copy where you can work freely. When your work is ready, a{" "}
        <strong>pull request (PR)</strong>{" "}proposes merging your changes into{" "}
        <code>main</code>. Between proposal and merge, automated checks supply evidence
        about the implementation and a human reviewer decides whether the design and
        definitions make sense.
      </p>

      <div className="my-6 flex max-w-[72ch] flex-col gap-0">
        {STEPS.map((s, i) => (
          <div key={s.name} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span className="grid size-8 shrink-0 place-items-center rounded-full border-2 border-ink bg-paper font-display text-sm font-extrabold">
                {i + 1}
              </span>
              {i < STEPS.length - 1 && <span className="w-0.5 flex-1 bg-line" />}
            </div>
            <div className="pb-5">
              <p className="!my-0 font-display text-sm font-extrabold uppercase tracking-wide text-ink">
                {s.name}
              </p>
              <p className="!my-0.5 text-sm">{s.desc}</p>
              {s.cmd && (
                <code className="font-mono text-xs text-flame-deep">{s.cmd}</code>
              )}
            </div>
          </div>
        ))}
      </div>

      <h2>The six commands you actually need</h2>
      <p>
        Git has hundreds of commands; daily work here uses about six. The one idea to
        understand is <strong>staging</strong>: a commit only includes what you have
        explicitly added to it. That is a feature — you choose exactly which files go
        into each snapshot, even if other files have changed.
      </p>
      <CodeBlock
        lang="bash"
        title="the whole daily loop"
        code={`
git switch main                   # return to the production branch
git pull                          # update it from origin/main
git switch -c feat/my-change      # branch from the latest main
git status                        # what have I changed?
git add models/staging/my_model.sql    # stage the files you mean to commit
git add models/staging/my_model.yml
git commit -m "feat: add my model"     # snapshot the staged files
git push                          # upload the branch to GitHub
`}
      />
      <p>
        Run the first three commands before starting each new piece of work. A branch
        begins from whichever commit you are currently on, so pull <code>main</code>{" "}
        first to avoid starting from an old version. Run <code>git status</code>{" "}
        whenever unsure — it shows what is changed, what is
        staged, and usually suggests the command you need next.
      </p>

      <Callout kind="tip" title="You don't have to live in the terminal">
        <p>
          VS Code&apos;s Source Control panel does all of this with clicks — staged
          files are a list, the commit message is a text box, push is a button. And AI
          coding assistants will happily run the whole loop for you from a plain
          instruction. Use whichever you like: the commands above matter because they
          are what is happening underneath, and knowing them is how you check what a
          tool — or an agent — actually did on your behalf.
        </p>
      </Callout>

      <h2>Project conventions</h2>
      <h3>Branch names</h3>
      <p>
        <code>feat/short-description</code>{" "}for new work, <code>fix/short-description</code>{" "}
        for bug fixes, <code>docs/short-description</code>{" "}for documentation. Lowercase,
        hyphens, no spaces.
      </p>
      <h3>Commit messages</h3>
      <p>
        We follow <strong>Conventional Commits</strong>: a type prefix, then a short
        imperative description.
      </p>
      <CodeBlock
        lang="bash"
        code={`
git commit -m "feat: add patient demographics staging model"
git commit -m "fix: correct age band boundary in dim_person_demographics"
git commit -m "docs: describe waiting list snapshot logic"
`}
      />
      <p>
        Pre-commit hooks validate the format locally, and commits must be{" "}
        <strong>signed</strong>{" "}(your SSH key — set up once during machine setup, then
        forget about it).
      </p>

      <h2>Keep commits and branches small</h2>
      <p>
        A useful rule is <strong>commit small, commit often; branch small, branch
        often</strong>. A commit should capture one understandable step. A branch should
        deliver one reviewable outcome. That makes the history easier to follow, gives
        reviewers less to hold in their heads, and gets changes merged before they drift
        too far from <code>main</code>.
      </p>
      <table>
        <thead>
          <tr>
            <th>Keep this small</th>
            <th>Why it helps</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Commit</td>
            <td>Each saved step has one purpose and is easier to understand or undo</td>
          </tr>
          <tr>
            <td>Branch / PR</td>
            <td>The change is quicker to review and less likely to conflict with other work</td>
          </tr>
        </tbody>
      </table>
      <Callout kind="info" title="What a merge conflict means">
        <p>
          A conflict happens when your branch and <code>main</code>{" "}have both changed
          the same lines in the same file and Git cannot safely choose between them.
          Short-lived branches reduce the time available for those overlapping changes
          to accumulate.
        </p>
      </Callout>

      <h2>What CI runs on your PR</h2>
      <p>
        The checks are independent: each starts only when its own condition is met. A
        new draft PR therefore has fast checks running while deeper review and warehouse
        validation are still waiting.
      </p>
      <table>
        <thead>
          <tr>
            <th>When</th>
            <th>What runs</th>
            <th>What it verifies</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>PR opens or changes</td>
            <td>Fusion compile and fast quality gates</td>
            <td>
              Refs, Jinja and project structure still compile; changed models have
              descriptions and tests; source and hardcoded-reference rules are followed
            </td>
          </tr>
          <tr>
            <td>PR leaves draft</td>
            <td>CodeRabbit review</td>
            <td>
              Likely bugs, fan-out risk, layer placement, missing tests and project
              conventions
            </td>
          </tr>
          <tr>
            <td>Review requested or <code>snowflake-ci</code>{" "}label added</td>
            <td>Snowflake DEV validation</td>
            <td>
              Builds and tests the changed models against real development data
            </td>
          </tr>
          <tr>
            <td>A changed model has no owner</td>
            <td>Ownership suggestion</td>
            <td>
              Posts the suggested YAML inline for the author; this is guidance rather
              than a failing gate
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        CodeRabbit&apos;s comments usually arrive before a human reviewer looks at the
        PR, and it is configured with this project&apos;s own conventions (for example,
        it checks that large person-level models set <code>cluster_by</code>). Treat its
        comments like any reviewer&apos;s: address the valid ones, reply to the rest —
        it is sometimes wrong, and saying why is a legitimate response. The human review
        still happens; CodeRabbit clears the routine findings first so your reviewer can
        focus on the logic.
      </p>

      <Callout kind="tip" title="Reading a failing check">
        <p>
          Click “Details” on the failing check and read the log from the bottom — the
          actual error is usually in the last 30 lines. Fix locally, commit, push: the
          PR re-runs automatically. A failed first CI run is normal and expected.
        </p>
      </Callout>

      <h2>Why the code is open</h2>
      <p>
        The dbt project is public deliberately. Open definitions let other organisations
        adopt and adapt useful work, let users inspect how a result was produced, and let
        people outside the immediate team question or improve the logic. It also enables
        tools to explain a result through the SQL and upstream lineage that produced it.
        The definitions are open; the data is not.
      </p>

      <h2>Keep data out of the public repo</h2>
      <p>
        The dbt-analytics code is open on GitHub. Code, YAML and docs are meant to be
        public; <strong>data never is</strong>. Git history is forever — once pushed,
        a value is published even if you delete it in the next commit.
      </p>
      <ul>
        <li>
          <strong>No patient or person-level data, anywhere.</strong>{" "}Not in comments
          (“e.g. NHS number 943…”), not in test fixtures, not in seed CSVs, not in
          query results pasted to show your model works.
        </li>
        <li>
          <strong>No row-level outputs in PRs.</strong>{" "}Describe what you checked
          (“grain verified unique on site_code + day_of_week”) instead of attaching
          screenshots or extracts of results. Aggregate counts are fine; rows are not.
        </li>
        <li>
          <strong>No credentials.</strong>{" "}Tokens, passwords and account details live
          in your local <code>.env</code>, which git ignores. If a secret ever lands in
          a commit, tell the team immediately so it can be rotated — do not quietly
          delete it.
        </li>
      </ul>

      <Callout kind="warn" title="If in doubt, leave it out">
        <p>
          Before every commit, skim your diff asking one question: “would I be happy
          for anyone on the internet to read this line?” If the answer involves a
          patient, a colleague&apos;s details or a credential, it does not belong in
          the repo. Accidentally publishing patient data is a reportable information
          governance incident.
        </p>
      </Callout>

      <h2>Write the proposal clearly</h2>
      <p>A useful PR description gives the reviewer four things:</p>
      <ul>
        <li>
          <strong>Why:</strong>{" "}the problem or need behind the change.
        </li>
        <li>
          <strong>What:</strong>{" "}each model&apos;s job and how the models fit together.
        </li>
        <li>
          <strong>Checked:</strong>{" "}the commands and sensible data checks already run.
        </li>
        <li>
          <strong>Review:</strong>{" "}the decision or area where human attention is most useful.
        </li>
      </ul>

      <h2>What human review is for</h2>
      <p>
        By the time a colleague reviews the PR, automation should have supplied much of
        the mechanical evidence. The reviewer&apos;s highest-value work is judging the
        choices that require context:
      </p>
      <ul>
        <li>
          <strong>Architecture:</strong>{" "}does each model have a clear job, and should
          reusable logic be separated so other models in the repo can reference it?
        </li>
        <li>
          <strong>Clinical correctness:</strong>{" "}do the definitions reflect the
          intended population, and are code lists and exclusions sufficiently broad?
        </li>
        <li>
          <strong>Maintenance:</strong>{" "}is the code straightforward to change, and is
          it clear what would need updating when the source or definition changes?
        </li>
      </ul>
      <p>
        A useful comment identifies the design concern, explains why it matters and asks
        a question that helps improve the change. The aim is not to rewrite the code in
        the reviewer&apos;s personal style.
      </p>

      <Quiz
        questions={[
          {
            prompt: "Why can't you commit directly to main?",
            options: [
              "You can, by convention it is reserved for small, low-risk fixes",
              "main is protected — every change arrives via a reviewed PR with passing checks",
              "Direct commits are allowed but skip CI, so they are discouraged",
              "Only repository administrators can push to main",
            ],
            answer: 1,
            explain:
              "It is enforced, not just discouraged — GitHub rejects direct pushes for everyone, admins included. The point is that main is always reviewed, tested and deployable.",
          },
          {
            prompt: "Your PR's validation check fails. What now?",
            options: [
              "Re-run the check — CI failures are usually transient",
              "Open a fresh PR so the checks start clean",
              "Read the failing log, fix locally, commit and push to the same branch",
              "Rebase onto main and force-push to reset the checks",
            ],
            answer: 2,
            explain:
              "Validation failures are nearly always real — read the log first. Pushing a fix to the same branch updates the PR and re-runs CI; a new PR or a force-push loses review history without fixing anything.",
          },
          {
            prompt: "Which is a valid commit message here?",
            options: [
              '"feat: add CKD register intermediate model"',
              '"Added CKD register intermediate model"',
              '"feat: Added the new CKD register model requested by the LTC team in March"',
              '"new-model: CKD register"',
            ],
            answer: 0,
            explain:
              "Conventional Commits: a known type prefix (feat, fix, docs…), then a short imperative description. Option b lacks the prefix; c is past tense and over-long; d invents a type.",
          },
        ]}
      />
    </LessonShell>
  );
}
