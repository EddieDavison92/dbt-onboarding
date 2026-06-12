"use client";

import { useState } from "react";
import { CodeBlock } from "@/components/CodeBlock";

const ROUTES = {
  windows: "Managed Windows laptop",
  mac: "macOS",
  codespaces: "GitHub Codespaces",
} as const;

type Route = keyof typeof ROUTES;

function powerShellLiteral(value: string) {
  return `'${value.replaceAll("'", "''")}'`;
}

function shellLiteral(value: string) {
  return `'${value.replaceAll("'", `'"'"'`)}'`;
}

export function CommitSigningGuide() {
  const [route, setRoute] = useState<Route>("windows");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const detailsReady = name.trim().length > 0 && email.trim().length > 0;

  const windowsScript = `
$Name = ${powerShellLiteral(name.trim())}
$Email = ${powerShellLiteral(email.trim())}

ssh-keygen -t ed25519 -C $Email
$publicKeyPath = "$env:USERPROFILE\\.ssh\\id_ed25519.pub"
$allowedSignersPath = "$env:USERPROFILE\\.ssh\\allowed_signers"
$publicKey = (Get-Content $publicKeyPath -Raw).Trim()
$utf8 = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($allowedSignersPath, "$Email $publicKey\`n", $utf8)

git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub
git config --global commit.gpgsign true
git config --global gpg.ssh.allowedSignersFile ~/.ssh/allowed_signers
git config --global user.email $Email
git config --global user.name $Name

Get-Content $publicKeyPath | Set-Clipboard
`.trim();

  const macScript = `
NAME=${shellLiteral(name.trim())}
EMAIL=${shellLiteral(email.trim())}

ssh-keygen -t ed25519 -C "$EMAIL"
printf '%s %s\\n' "$EMAIL" "$(cat ~/.ssh/id_ed25519.pub)" > ~/.ssh/allowed_signers

git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub
git config --global commit.gpgsign true
git config --global gpg.ssh.allowedSignersFile ~/.ssh/allowed_signers
git config --global user.email "$EMAIL"
git config --global user.name "$NAME"

pbcopy < ~/.ssh/id_ed25519.pub
`.trim();

  return (
    <section className="my-5 overflow-hidden rounded-2xl border-2 border-ink bg-paper shadow-[4px_4px_0_0_var(--color-layer-modelling)]">
      <div className="grid gap-2 border-b-2 border-ink bg-paper-warm p-3 sm:grid-cols-3">
        {(Object.keys(ROUTES) as Route[]).map((key) => (
          <button
            key={key}
            type="button"
            data-signing-route={key}
            aria-pressed={route === key}
            onClick={() => setRoute(key)}
            className={`rounded-lg border-2 px-3 py-2 text-left font-display text-xs font-extrabold transition ${
              route === key
                ? "border-ink bg-ink text-paper"
                : "border-line bg-paper text-ink hover:border-flame"
            }`}
          >
            {ROUTES[key]}
          </button>
        ))}
      </div>

      <div className="p-4 sm:p-5">
        {route !== "codespaces" && (
          <div className="mb-5 rounded-xl border-2 border-layer-modelling/25 bg-layer-modelling/5 p-4">
            <p className="!my-0 font-display text-sm font-bold !text-ink">
              Generate your commands
            </p>
            <p className="!mb-3 !mt-1 text-sm">
              Enter the name and email attached to your GitHub account. These values
              stay on this page and are only used to build the script below.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block font-display text-xs font-bold text-ink-soft">
                  Your name
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Alex Morgan"
                  autoComplete="name"
                  className="w-full rounded-lg border-2 border-line bg-paper px-3 py-2 text-sm text-ink outline-none transition placeholder:text-ink-faint/60 focus:border-layer-modelling"
                />
              </label>
              <label className="block">
                <span className="mb-1 block font-display text-xs font-bold text-ink-soft">
                  GitHub email
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="alex.morgan@example.org"
                  autoComplete="email"
                  className="w-full rounded-lg border-2 border-line bg-paper px-3 py-2 text-sm text-ink outline-none transition placeholder:text-ink-faint/60 focus:border-layer-modelling"
                />
              </label>
            </div>
          </div>
        )}

        {route === "windows" && (
          <>
            <p>
              Copy the complete script and paste it into PowerShell. At the{" "}
              <code>ssh-keygen</code>{" "}questions, press Enter to accept the default
              key location and choose a passphrase. The remaining commands then continue
              automatically.
            </p>
            {detailsReady ? (
              <CodeBlock
                lang="bash"
                title="PowerShell · copy and run together"
                code={windowsScript}
              />
            ) : (
              <p className="rounded-xl border border-dashed border-ink-faint bg-paper-warm px-4 py-5 text-center text-sm text-ink-faint">
                Enter your name and GitHub email to generate the PowerShell script.
              </p>
            )}
            <p>
              When the script finishes, your public key is on the clipboard. Add it under{" "}
              <em>GitHub Settings → SSH and GPG keys → New SSH key</em>, and change the
              key type from <em>Authentication Key</em> to <strong>Signing Key</strong>.
              Open a fresh workspace terminal afterwards; the bootstrap should report{" "}
              <code>[OK] Commit signing configured</code>.
            </p>
          </>
        )}

        {route === "mac" && (
          <>
            <p>
              Copy the complete script and paste it into Terminal. At the{" "}
              <code>ssh-keygen</code>{" "}questions, press Enter to accept the default
              key location and choose a passphrase. The remaining commands then continue
              automatically.
            </p>
            {detailsReady ? (
              <CodeBlock
                lang="bash"
                title="Terminal · copy and run together"
                code={macScript}
              />
            ) : (
              <p className="rounded-xl border border-dashed border-ink-faint bg-paper-warm px-4 py-5 text-center text-sm text-ink-faint">
                Enter your name and GitHub email to generate the Terminal script.
              </p>
            )}
            <p>
              When the script finishes, your public key is on the clipboard. Add it under{" "}
              <em>GitHub Settings → SSH and GPG keys → New SSH key</em>, and change the
              key type from <em>Authentication Key</em> to <strong>Signing Key</strong>.
              Open a fresh workspace terminal afterwards; the bootstrap should report{" "}
              <code>[OK] Commit signing configured</code>.
            </p>
          </>
        )}

        {route === "codespaces" && (
          <>
            <p>
              Codespaces can ask GitHub to sign commits for you, so do not create or
              upload a local SSH signing key inside the container.
            </p>
            <ol>
              <li>Open <em>GitHub Settings → Codespaces</em>.</li>
              <li>Enable <strong>GPG verification</strong>.</li>
              <li>Allow it for <code>wnl-icb-analytics/dbt-analytics</code>.</li>
              <li>Restart an existing codespace, or create a new one.</li>
            </ol>
            <p>
              GitHub then signs commits created in that trusted codespace and displays
              them as verified.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
