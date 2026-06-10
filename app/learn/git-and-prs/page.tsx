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
    cmd: "git checkout -b feat/diabetes-staging",
  },
  {
    name: "commit",
    desc: "Save a labelled snapshot of your changes",
    cmd: 'git commit -m "feat: add diabetes staging model"',
  },
  {
    name: "push",
    desc: "Upload your branch to GitHub",
    cmd: "git push -u origin feat/diabetes-staging",
  },
  {
    name: "pull request",
    desc: "Ask for review; CI starts checking automatically",
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
      minutes={9}
    >
      <h2>The mental model</h2>
      <p>
        <code>main</code> is the production branch — what runs every night. You never
        edit it directly (it is locked). Instead you take a <strong>branch</strong>: a
        parallel copy where you can work freely. When your work is ready, a{" "}
        <strong>pull request (PR)</strong> proposes merging your branch back into{" "}
        <code>main</code>. Between proposal and merge sit the two safety nets: a human
        review and automated CI checks.
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

      <h2>Project conventions</h2>
      <h3>Branch names</h3>
      <p>
        <code>feat/short-description</code> for new work, <code>fix/short-description</code>{" "}
        for bug fixes, <code>docs/short-description</code> for documentation. Lowercase,
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
        <strong>signed</strong> (your SSH key — set up once during machine setup, then
        forget about it).
      </p>

      <h2>What CI runs on your PR</h2>
      <p>
        The moment you open a PR, GitHub Actions starts a series of checks. Green ticks
        are required to merge:
      </p>
      <table>
        <thead>
          <tr>
            <th>Check</th>
            <th>What it verifies</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Compile</td>
            <td>Every model still compiles — catches broken refs and Jinja typos</td>
          </tr>
          <tr>
            <td>Code quality</td>
            <td>
              No hardcoded table references, source() only in the raw/staging path,
              every changed model has a description and at least one test — plus lint
            </td>
          </tr>
          <tr>
            <td>PR validation</td>
            <td>
              Builds your changed models in the Snowflake DEV environment — starts once
              a reviewer is assigned (or the snowflake-ci label is added)
            </td>
          </tr>
          <tr>
            <td>Model ownership</td>
            <td>
              Checks changed models have an owner in their YAML, suggesting additions
              inline
            </td>
          </tr>
          <tr>
            <td>CodeRabbit review</td>
            <td>
              An automated reviewer comments on every PR — conventions, likely bugs,
              missed project patterns
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

      <h2>The repo is public — keep data out of it</h2>
      <p>
        The dbt-analytics code is open on GitHub. Code, YAML and docs are meant to be
        public; <strong>data never is</strong>. Git history is forever — once pushed,
        a value is published even if you delete it in the next commit.
      </p>
      <ul>
        <li>
          <strong>No patient or person-level data, anywhere.</strong> Not in comments
          (“e.g. NHS number 943…”), not in test fixtures, not in seed CSVs, not in
          query results pasted to show your model works.
        </li>
        <li>
          <strong>No row-level outputs in PRs.</strong> Describe what you checked
          (“grain verified unique on site_code + day_of_week”) instead of attaching
          screenshots or extracts of results. Aggregate counts are fine; rows are not.
        </li>
        <li>
          <strong>No credentials.</strong> Tokens, passwords and account details live
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

      <h2>Review etiquette</h2>
      <ul>
        <li>
          <strong>Keep PRs small.</strong> One model (plus its YAML) reviews in minutes;
          ten models sit for a week.
        </li>
        <li>
          <strong>Write the description for a stranger.</strong> What changed, why, and
          how you checked the numbers.
        </li>
        <li>
          <strong>Review comments are about the code.</strong> “Could this join fan
          out?” is the reviewer doing their job — and soon it will be you asking.
        </li>
      </ul>

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
