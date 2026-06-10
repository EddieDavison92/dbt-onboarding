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
          role or higher, and the account details from your team lead. Credentials never go in the
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
                <strong>VS Code</strong> — the team standard. The workspace will prompt
                you to install the official <strong>dbt extension</strong>, covered
                below.
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

      <h2>The dbt VS Code extension</h2>
      <p>
        The project runs on <strong>dbt Fusion</strong> — a Rust rewrite of dbt with a
        full SQL compiler — and the same engine powers the official VS Code extension.
        Because it genuinely understands dbt SQL (refs, sources, macros, your actual
        column types from Snowflake), it behaves like a proper IDE rather than a syntax
        highlighter. The workspace recommends it automatically when you open the
        project; if you missed the prompt, install <strong>dbt</strong> by dbt Labs (
        <code>dbtLabsInc.dbt</code>) from the Extensions panel.
      </p>
      <p>The features you will use daily:</p>
      <ul>
        <li>
          <strong>Live error detection.</strong> Invalid column references, broken
          refs, missing GROUP BY columns and syntax errors are underlined as you type —
          without querying Snowflake. Most mistakes never survive long enough to reach{" "}
          <code>dbt build</code>.
        </li>
        <li>
          <strong>Rename symbol (F2).</strong> Rename a column and the extension
          updates every downstream model that references it, with a preview of each
          change before you confirm. Renaming a model file updates all{" "}
          <code>ref()</code> calls project-wide the same way.
        </li>
        <li>
          <strong>Autocomplete.</strong> <code>ref(&apos;</code> suggests every model,{" "}
          <code>source(&apos;</code> every source, and table aliases suggest their real
          columns.
        </li>
        <li>
          <strong>Go-to-definition.</strong> Right-click any <code>ref()</code>,
          source, macro, column or CTE name to jump to where it is defined — navigating
          the DAG without searching.
        </li>
        <li>
          <strong>Column-level lineage.</strong> Trace a single column upstream and
          downstream before changing it — impact analysis in one panel.
        </li>
        <li>
          <strong>Compiled SQL view and CTE previews.</strong> See the rendered SQL
          side-by-side as you save, and run any CTE in place with{" "}
          <code>Ctrl+Enter</code> (this one needs your Snowflake connection).
        </li>
      </ul>
      <Callout kind="info" title="Some advertised features need dbt Cloud">
        <p>
          The extension also offers features that depend on a dbt Cloud account — such
          as Compare, which diffs model results between environments. This project does
          not use dbt Cloud, so if a feature prompts you to sign in to it, that is the
          line: everything above works without it.
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
        Then add the public key at{" "}
        <a
          href="https://github.com/settings/keys"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub Settings → SSH and GPG keys
        </a>{" "}
        → <em>New SSH key</em>. The key-type dropdown defaults to{" "}
        <em>Authentication Key</em> — change it to <strong>Signing Key</strong>, or
        commits will still show as unsigned.
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
