import type { Metadata } from "next";
import { LessonShell } from "@/components/LessonShell";
import { CodeBlock } from "@/components/CodeBlock";
import { Callout } from "@/components/Callout";
import { Checklist } from "@/components/Checklist";
import { GuidedCourseLink } from "@/components/GuidedCourseLink";

export const metadata: Metadata = { title: "Set up your machine" };

export default function Page() {
  return (
    <LessonShell
      section="practice"
      slug="setup"
      kicker="Field guide · 1"
      title="Set up your machine"
      lede="The prerequisites, commands and checks for getting a working local dbt environment."
      minutes={5}
    >
      <GuidedCourseLink href="/courses/first-pr/set-up-your-machine" />

      <h2>Before you start</h2>
      <Checklist
        id="setup-tools"
        items={[
          { key: "github", label: <>GitHub account added to the organisation</> },
          { key: "snowflake", label: <>Snowflake access and your account, role and warehouse</> },
          { key: "git", label: <>Git for Windows v2.34 or later</> },
          { key: "vscode", label: <>VS Code with the workspace&apos;s recommended dbt extension</> },
        ]}
      />

      <h2>Clone and bootstrap</h2>
      <CodeBlock
        lang="bash"
        code={`
git clone https://github.com/wnl-icb-analytics/dbt-analytics.git
cd dbt-analytics
`}
      />
      <p>
        Open the folder in VS Code. The integrated terminal runs{" "}
        <code>start_dbt.ps1</code> automatically. On the first run it creates your
        ignored <code>.env</code> file, installs the pinned tooling and tells you about
        any setup still outstanding.
      </p>
      <Callout kind="warn" title="Keep credentials local">
        <p>
          The repository is public. Account details, tokens and passwords belong only
          in <code>.env</code>; never put them in SQL, YAML, screenshots or a pull
          request.
        </p>
      </Callout>

      <h2>Configure commit signing</h2>
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
        Add the public key in GitHub under <em>Settings → SSH and GPG keys</em>. Choose{" "}
        <strong>Signing Key</strong>, not the default Authentication Key.
      </p>

      <h2>Prove it works</h2>
      <CodeBlock
        lang="bash"
        code={`
dbt debug
dbt show -s stg_csds_bridging
`}
      />
      <p>
        <code>dbt debug</code> should end with <strong>All checks passed!</strong>. The
        second command is a useful final check that you can compile a project model and
        query the development environment.
      </p>

      <h2>If setup fails</h2>
      <ul>
        <li>
          <strong>Connection or role error:</strong> check <code>.env</code>, then open a
          fresh terminal so the values reload.
        </li>
        <li>
          <strong>Browser sign-in does not open:</strong> rerun <code>dbt debug</code>{" "}
          and choose browser SSO unless your team supplied a token.
        </li>
        <li>
          <strong>Access denied:</strong> this is usually an access request, not a local
          code fix. Send the exact account, role and error to your team lead.
        </li>
      </ul>

      <Checklist
        id="setup-verify"
        items={[
          { key: "ready", label: <>The setup script finishes with <strong>Ready!</strong></> },
          { key: "debug", label: <><code>dbt debug</code> passes</> },
          { key: "show", label: <><code>dbt show</code> returns rows</> },
        ]}
      />
    </LessonShell>
  );
}
