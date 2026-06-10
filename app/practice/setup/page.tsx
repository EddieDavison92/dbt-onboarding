import type { Metadata } from "next";
import { LessonShell } from "@/components/LessonShell";
import { CodeBlock } from "@/components/CodeBlock";
import { Callout } from "@/components/Callout";
import { Checklist } from "@/components/Checklist";

export const metadata: Metadata = { title: "Set up your machine" };

export default function Page() {
  return (
    <LessonShell
      section="practice"
      slug="setup"
      kicker="Do · Step 1"
      title="Set up your machine"
      lede="One-time setup: tools, credentials, and a successful dbt debug. Allow about fifteen minutes."
      minutes={15}
    >
      <Callout kind="info" title="Before you start">
        <p>
          You need a GitHub account added to the org, Snowflake access with the analyst
          role, and the account details from your team lead. Credentials never go in the
          repo — they live in a local <code>.env</code> file that git ignores.
        </p>
      </Callout>

      <h2>Install the tools</h2>
      <Checklist
        id="setup-tools"
        items={[
          {
            key: "git",
            label: (
              <>
                <strong>Git for Windows</strong> (v2.34+) — from git-scm.com. Needed for
                version control and SSH commit signing.
              </>
            ),
          },
          {
            key: "vscode",
            label: (
              <>
                <strong>VS Code</strong> — the team standard. Install the official{" "}
                <strong>dbt extension</strong> for lineage, autocomplete and
                click-to-compile.
              </>
            ),
          },
          {
            key: "clone",
            label: (
              <>
                Clone the repo:{" "}
                <code>git clone https://github.com/wnl-icb-analytics/dbt-analytics.git</code>
              </>
            ),
          },
        ]}
      />

      <h2>Run the setup script</h2>
      <p>
        Open the cloned folder in VS Code and open a terminal — the project&apos;s
        PowerShell script runs automatically (or run it yourself):
      </p>
      <CodeBlock lang="bash" code={`.\\start_dbt.ps1`} />
      <p>It installs dbt Fusion (the dbt engine we use), configures git hooks, and loads your environment. First run, it will walk you through creating your <code>.env</code>:</p>
      <CodeBlock
        lang="bash"
        title=".env (local only — never committed)"
        code={`
SNOWFLAKE_ACCOUNT=<ask-your-team-lead>
SNOWFLAKE_USER=<your-snowflake-username>
SNOWFLAKE_WAREHOUSE=<team-warehouse>
SNOWFLAKE_ROLE=<analyst-role>
`}
      />
      <Callout kind="warn" title="Authentication">
        <p>
          With no password set, dbt opens your browser for SSO each session. If you have
          a programmatic access token, set <code>SNOWFLAKE_PAT</code> to authenticate
          without the browser prompt. Never paste tokens into files inside the repo.
        </p>
      </Callout>

      <h2>Set up commit signing (one-off)</h2>
      <CodeBlock
        lang="bash"
        code={`
ssh-keygen -t ed25519 -C "you@example.nhs.uk"
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub
git config --global commit.gpgsign true
`}
      />
      <p>
        Then add the public key to GitHub (Settings → SSH and GPG keys →{" "}
        <em>New signing key</em>).
      </p>

      <h2>Verify the connection</h2>
      <CodeBlock
        lang="bash"
        code={`
dbt deps     # install package dependencies
dbt debug    # check connection + config
`}
      />
      <p>
        <code>dbt debug</code> should end with{" "}
        <strong>“All checks passed!”</strong>. If it cannot connect, it is almost always
        the <code>.env</code> — a typo in the account or a role you do not have yet.
      </p>

      <Checklist
        id="setup-verify"
        items={[
          { key: "deps", label: <>Ran <code>dbt deps</code> without errors</> },
          { key: "debug", label: <>Saw <strong>All checks passed!</strong> from <code>dbt debug</code></> },
          {
            key: "show",
            label: (
              <>
                Bonus: previewed real data with{" "}
                <code>dbt show -s stg_csds_bridging</code>
              </>
            ),
          },
        ]}
      />
    </LessonShell>
  );
}
