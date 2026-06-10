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
        Open the cloned folder in VS Code and open a terminal —{" "}
        <code>start_dbt.ps1</code> runs automatically every time (it is wired into the
        workspace; you can also run it yourself). It is the project&apos;s bootstrap
        and does five things on each launch:
      </p>
      <ol>
        <li>
          <strong>Configures git hooks</strong> and checks your commit signing is set
          up, telling you if it is not.
        </li>
        <li>
          <strong>Installs or updates dbt Fusion</strong> — the engine dbt runs on
          here (a binary, not a Python package), pinned to the version the rest of the
          team and CI use.
        </li>
        <li>
          <strong>Syncs Python tooling</strong> used only by the helper scripts in{" "}
          <code>scripts/</code> (dbt itself does not need Python).
        </li>
        <li>
          <strong>Loads your <code>.env</code></strong> and shows which connection
          details are active.
        </li>
        <li>
          <strong>Installs dbt packages</strong> (<code>dbt deps</code>) when they are
          missing or out of date.
        </li>
      </ol>
      <p>
        On first run, with no <code>.env</code> present, it walks you through creating
        one interactively — prompting for your account identifier, username, role and
        warehouse (your team lead has these values), then asking how you want to
        authenticate:
      </p>
      <CodeBlock
        lang="text"
        title="first-run prompt"
        code={`
No .env found - let's set up your Snowflake connection.

Authentication method:
  1) Browser SSO (externalbrowser)   [default, recommended]
  2) Programmatic Access Token (PAT)
  3) Account password + MFA
`}
      />
      <p>
        It writes the answers to <code>.env</code> (which git ignores) and loads them
        into the session, so dbt works immediately. Browser SSO opens a browser window
        to authenticate each session; a PAT skips that prompt. Secrets are typed at a
        hidden prompt — never paste them into files inside the repo.
      </p>
      <Callout kind="tip" title="If the script flags actions">
        <p>
          The script ends with either “Ready!” or a short “To finish setup” list —
          commit signing not configured, placeholder values left in <code>.env</code>,
          and so on. Work through that list before continuing; each item points at the
          fix.
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
      <p>
        The script has already installed packages (<code>dbt deps</code>), so one
        command confirms everything works:
      </p>
      <CodeBlock
        lang="bash"
        code={`
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
          { key: "deps", label: <>The setup script finished with <strong>Ready!</strong> (no outstanding actions)</> },
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
