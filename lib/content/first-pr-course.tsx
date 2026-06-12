import type { Course } from "@/lib/course-types";
import { CodeBlock } from "@/components/CodeBlock";
import { Callout } from "@/components/Callout";
import { FolderPicker } from "@/components/FolderPicker";
import { TryIt } from "@/components/TryIt";
import { DbtExecutionFlow } from "@/components/DbtExecutionFlow";
import { CommandDAG } from "@/components/CommandDAG";
import { CommandLab } from "@/components/CommandLab";
import { SelectorPlayground } from "@/components/SelectorPlayground";
import { ProjectFilesMap } from "@/components/ProjectFilesMap";
import { SourceSetupFlow } from "@/components/SourceSetupFlow";
import { SourceRouteLab } from "@/components/SourceRouteLab";

export const FIRST_PR_COURSE: Course = {
  slug: "first-pr",
  title: "Your first PR",
  tagline: "A guided build: from a blank machine to a merged model in production",
  audience:
    "Hands-on, at your own machine. Assumes Git essentials and How dbt thinks (or equivalent experience). The dbt commands are taught here, at the moment you need them. Best done with real access — work through it your first week.",
  hours: "~3.5 hrs hands-on",
  accent: "var(--layer-reporting)",
  lessons: [
    // ------------------------------------------------------------------
    {
      slug: "set-up-your-machine",
      title: "Set up your machine",
      blurb: "Tools, credentials and a green dbt debug",
      minutes: 30,
      steps: [
        {
          id: "before",
          body: (
            <>
              <p>
                This course is hands-on: every lesson is <em>do this → you should
                see this → here&apos;s why</em>. Before starting you need three
                things from your team lead: a GitHub account added to the org,
                Snowflake access with the analyst role or higher, and the connection
                details (account identifier, role, warehouse).
              </p>
              <p>
                Setup is the slowest part of the whole course — and you only ever do
                it once.
              </p>
            </>
          ),
        },
        {
          id: "install",
          title: "Do: install the tools",
          body: (
            <>
              <ol>
                <li>
                  Install <strong>Git for Windows</strong>{" "}from git-scm.com
                  (defaults are fine).
                </li>
                <li>
                  Install <strong>VS Code</strong>{" "}if you don&apos;t have it.
                </li>
                <li>
                  Clone the repo — in a terminal:
                  <CodeBlock
                    lang="bash"
                    code={`git clone https://github.com/wnl-icb-analytics/dbt-analytics.git`}
                  />
                </li>
                <li>Open the cloned folder in VS Code.</li>
              </ol>
              <p>
                <strong>You should see:</strong>{" "}VS Code offers to install the
                workspace&apos;s recommended extensions — say yes; that includes the
                dbt extension, which gives you error-checking, autocomplete and
                lineage as you write.
              </p>
            </>
          ),
        },
        {
          id: "script",
          title: "Do: open a terminal",
          body: (
            <>
              <p>
                Open a terminal in VS Code (<code>Ctrl+`</code>). The project&apos;s
                setup script, <code>start_dbt.ps1</code>, runs automatically — it
                configures git hooks, installs the dbt engine (called Fusion),
                prepares the Python tooling for helper scripts, and loads your
                connection settings.
              </p>
              <p>
                <strong>You should see:</strong>{" "}since this is your first run with
                no <code>.env</code>{" "}file, it walks you through creating one —
                prompting for the account identifier, your username, role and
                warehouse (the details from your team lead), then asking how to
                authenticate. Pick option 1 (browser SSO) unless you have been given
                a token.
              </p>
              <Callout kind="warn" title="Why a .env file?">
                <p>
                  Credentials never go in the repo — the repo is public. The{" "}
                  <code>.env</code>{" "}file lives only on your machine and git is
                  configured to ignore it. The script writes it for you; you never
                  paste secrets into project files.
                </p>
              </Callout>
            </>
          ),
          check: {
            prompt: "Why does the `.env` file exist outside version control?",
            options: [
              "It changes too often to be worth committing",
              "It holds your credentials, and the repo is public — secrets stay on your machine only",
              "git cannot store configuration files",
              "It is regenerated by the setup script every day",
            ],
            answer: 1,
            explain:
              "Anything committed to this repo is on the public internet. Connection details and tokens live in .env, which .gitignore keeps out of every commit automatically.",
            affirm: "secrets live in .env on your machine — never in the repo.",
          },
        },
        {
          id: "files-map",
          title: "The four files around the project",
          body: (
            <>
              <p>
                Your <code>.env</code>{" "}is one of four names you will keep
                meeting. Each has exactly one job — click through:
              </p>
              <ProjectFilesMap />
              <p>
                One word trap: <code>target: dev</code>{" "}in{" "}
                <code>profiles.yml</code>{" "}names a Snowflake connection, while{" "}
                <code>target/</code>{" "}with a slash is the generated folder on
                your machine. Same word, different jobs — the slash is the
                clue.
              </p>
            </>
          ),
          check: {
            prompt: "You want to inspect the SQL dbt actually compiled on your machine. Where do you look?",
            options: ["`.env`", "`profiles.yml`", "`target/compiled/`", "`dbt_project.yml`"],
            answer: 2,
            explain:
              "target/ is dbt's generated output folder; compiled SQL sits under target/compiled/. You inspect it, never edit it.",
            affirm: "target/ holds generated output — compiled SQL included.",
          },
        },
        {
          id: "signing",
          title: "Do: set up commit signing (one-off)",
          body: (
            <>
              <p>
                This repo requires commits to be <em>signed</em> — cryptographic
                proof that a commit really came from you. One-time setup, in the
                terminal:
              </p>
              <CodeBlock
                lang="bash"
                code={`
ssh-keygen -t ed25519 -C "you@nhs.net"
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub
git config --global commit.gpgsign true
`}
              />
              <p>
                Then add the key at{" "}
                <a
                  href="https://github.com/settings/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub Settings → SSH and GPG keys
                </a>{" "}
                → <em>New SSH key</em>.{" "}
                <strong>The key-type dropdown defaults to Authentication Key —
                change it to Signing Key</strong>, or your commits will still count
                as unsigned.
              </p>
            </>
          ),
        },
        {
          id: "debug",
          title: "Do: prove the connection works",
          body: (
            <>
              <CodeBlock lang="bash" code={`dbt debug`} />
              <p>
                <strong>You should see:</strong>{" "}a series of checks ending in{" "}
                <strong>“All checks passed!”</strong> — possibly after a browser
                window opens for Snowflake sign-in.
              </p>
              <p>
                <strong>If it fails:</strong>{" "}the cause is almost always the{" "}
                <code>.env</code> — a typo in the account identifier or a role you
                don&apos;t have yet. Fix the value in <code>.env</code>, open a new
                terminal (so it reloads), and run <code>dbt debug</code>{" "}again.
              </p>
              <p>
                Green? Your machine is done — permanently. Everything from here is
                the actual work.
              </p>
            </>
          ),
          check: {
            prompt: "`dbt debug` fails to connect. Where do you look first?",
            options: [
              "Reinstall dbt",
              "The `.env` file — a wrong account identifier or role is the usual cause",
              "Snowflake's status page",
              "The `dbt_project.yml` file",
            ],
            answer: 1,
            explain:
              "dbt debug tests connection + config, and the connection details come from .env. Check those values, open a fresh terminal so they reload, retry — that resolves nearly every first-day failure.",
            affirm: "when dbt can't connect, .env is the first suspect.",
          },
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      slug: "pick-your-table",
      title: "Pick your table",
      blurb: "Choose familiar data and state its grain",
      minutes: 12,
      steps: [
        {
          id: "familiar",
          body: (
            <>
              <p>
                You are about to build your first model. The single best decision
                you can make now: <strong>build it on data you already know</strong>{" "}
                — a reference table you maintain, a feed you have queried for
                reports. You are learning dbt&apos;s mechanics; don&apos;t make
                yourself learn an unfamiliar dataset at the same time.
              </p>
              <p>
                Your existing judgement is the test harness: you can glance at the
                output and know whether it looks right.
              </p>
            </>
          ),
        },
        {
          id: "grain",
          title: "Do: state the grain in one sentence",
          body: (
            <>
              <p>
                Before any SQL, answer: <strong>one row per what?</strong>{" "}One row
                per site per weekday? Per patient per referral per week? Write the
                sentence down — it decides your tests later, and not being able to
                say it is the signal you don&apos;t know the table well enough yet.
              </p>
              <p>
                <strong>You should have:</strong>{" "}a table in mind, and its grain in
                one sentence. The rest of the course uses a practice-opening-hours
                reference table (“one row per site per day of week”) as its example —
                substitute yours throughout.
              </p>
            </>
          ),
          check: {
            prompt: "Why insist on stating the grain before writing SQL?",
            options: [
              "dbt requires it in configuration",
              "It defines what unique means for this table — which becomes your most important test",
              "It determines which warehouse the model uses",
              "It is needed for the file name",
            ],
            answer: 1,
            explain:
              "The grain is the table's contract: one row per what. Your grain test (next lessons) asserts it forever — and a join that breaks it is the most common serious modelling bug.",
            affirm: "one row per what — the grain sentence becomes your most important test.",
          },
        },
        {
          id: "branch",
          title: "Do: branch from fresh main",
          body: (
            <>
              <p>
                You know what you are building, so create the branch before changing
                project files. First make sure the working tree is clean, then update{" "}
                <code>main</code>{" "}and branch from that latest commit:
              </p>
              <CodeBlock
                lang="bash"
                code={`git status
git switch main
git pull
git switch -c feat/opening-hours-staging`}
              />
              <p>
                Replace <code>opening-hours-staging</code>{" "}with a short description of
                your model. From this point onward, every edit in the course should be
                on that feature branch. If <code>git status</code>{" "}is not clean, stop
                before pulling and work out what those existing changes are.
              </p>
              <p>
                <strong>You should see:</strong>{" "}
                <code>Switched to a new branch</code>, followed by your branch name.
              </p>
            </>
          ),
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      slug: "find-or-add-the-source",
      title: "Find — or add — the source",
      blurb: "A mechanical route from a Snowflake table to a generated raw model",
      minutes: 30,
      steps: [
        {
          id: "map",
          title: "First, see the whole route",
          body: (
            <>
              <p>
                A table landing in Snowflake is not ready to use in hand-written dbt
                SQL. This project first declares it as a <strong>source</strong>, then
                generates a 1:1 <strong>raw model</strong> that quotes and renames its
                columns. Your staging model uses that raw model with <code>ref()</code>.
              </p>
              <SourceSetupFlow />
              <p>
                An <strong>automatic</strong>{" "}schema admits every table the pipeline
                discovers. A <strong>manual</strong>{" "}schema admits only tables listed
                in its curated YAML. In both routes, the raw SQL is generated — never
                written by hand.
              </p>
            </>
          ),
          check: {
            prompt: "Which file do you edit to add one table to a `manual: true` schema?",
            options: [
              "The generated raw SQL file",
              "The schema's `manual_*.yml` source file",
              "The schema's `auto_*.yml` file",
              "`dbt_project.yml`",
            ],
            answer: 1,
            explain:
              "The manual YAML is the curated admission list. The pipeline reads it and generates the raw model; generated raw SQL and auto YAML are replaceable outputs.",
            affirm: "manual YAML is the editable admission list for a curated schema.",
          },
        },
        {
          id: "search",
          title: "1 · Search before creating anything",
          body: (
            <>
              <p>
                Start with the table&apos;s three-part Snowflake address. For the worked
                example it is:
              </p>
              <CodeBlock
                lang="text"
                code={`DATA_LAKE__NCL.ANALYST_MANAGED.OPENING_HOURS`}
              />
              <p>
                In VS Code press <code>Ctrl+P</code>{" "}and search in this order:
              </p>
              <ol>
                <li>
                  <code>stg_reference_opening_hours</code>{" "}— if it exists, reuse it.
                </li>
                <li>
                  <code>raw_reference_opening_hours</code>{" "}— if it exists, open it
                  and use its cleaned columns to create staging later.
                </li>
                <li>
                  Search <code>OPENING_HOURS</code>{" "}across the repo to catch an
                  unexpected existing name.
                </li>
              </ol>
              <Callout kind="info" title="Found one? Keep the result">
                <p>
                  If staging exists, that is your input. If only raw exists, preview
                  it with <code>dbt show -s raw_reference_opening_hours</code>. The rest
                  of this lesson rehearses the recovery path for a genuinely missing raw model.
                </p>
              </Callout>
            </>
          ),
        },
        {
          id: "decide",
          title: "2 · Find the schema in the source registry",
          body: (
            <>
              <p>
                Open <code>scripts/sources/source_mappings.yml</code>. Search for the
                table&apos;s <strong>schema</strong>, here <code>ANALYST_MANAGED</code>, and
                confirm the database on the same block. Do not search only for your
                guessed source name; the mapping tells you the project&apos;s name.
              </p>
              <CodeBlock
                lang="yaml"
                title="scripts/sources/source_mappings.yml"
                code={`- source_name: reference_analyst_managed
  database: DATA_LAKE__NCL
  schema: ANALYST_MANAGED
  raw_prefix: raw_reference
  domain: shared
  manual: true`}
              />
              <p>
                Read the block as a recipe: the source is called
                <code>reference_analyst_managed</code>, generated models start
                <code>raw_reference_</code>, they live under the shared domain, and
                <code>manual: true</code>{" "}means you must approve the table in manual YAML first.
              </p>
            </>
          ),
        },
        {
          id: "route-lab",
          title: "3 · Choose the route from the mapping",
          body: (
            <>
              <p>
                Use only two facts: did you find the database/schema, and does its
                block say <code>manual: true</code>? Route each case before moving on.
              </p>
              <SourceRouteLab />
            </>
          ),
          interact: true,
        },
        {
          id: "manual-route",
          title: "4 · Manual route: add the table block",
          body: (
            <>
              <p>
                The worked example is manual. Open
                <code>models/sources/manual_analyst_managed.yml</code>, find the
                existing <code>reference_analyst_managed</code>{" "}source, then add one
                table block inside its <code>tables:</code>{" "}list. Copy a neighbouring
                block so the indentation stays exact.
              </p>
              <CodeBlock
                lang="yaml"
                title="models/sources/manual_analyst_managed.yml"
                code={`
- name: reference_analyst_managed
  database: '"DATA_LAKE__NCL"'
  schema: '"ANALYST_MANAGED"'
  tables:
  # ...existing table blocks stay here...
  - name: OPENING_HOURS
    identifier: '"OPENING_HOURS"'
    columns:
    - name: SITE_CODE
      data_type: TEXT
    - name: DAY_OF_WEEK
      data_type: NUMBER(2,0)
`}
              />
              <p>
                Use the exact Snowflake table and column identifiers. Do not create a
                second <code>sources:</code>{" "}section or a second source with the same
                name. The pipeline syncs declared data types against live metadata and
                warns about missing or extra columns.
              </p>
            </>
          ),
        },
        {
          id: "automatic-route",
          title: "5 · Automatic route: do not edit YAML",
          body: (
            <>
              <p>
                If the database/schema mapping exists and has no
                <code>manual: true</code>, make no source-file edit. The pipeline reads
                Snowflake metadata and updates the matching <code>auto_*.yml</code>{" "}
                itself.
              </p>
              <p>
                If there is <strong>no matching database/schema block</strong>, stop and
                pair with the team. Adding a mapping chooses a source name, raw prefix,
                domain and ownership convention for every table in that schema; that is
                a project design decision, not a mechanical one-table edit.
              </p>
            </>
          ),
          check: {
            prompt: "The schema is mapped and there is no `manual: true`. What do you edit before running the pipeline?",
            options: [
              "The matching `auto_*.yml`",
              "A new raw SQL model",
              "Nothing — the pipeline discovers the table from Snowflake metadata",
              "`dbt_project.yml`",
            ],
            answer: 2,
            explain:
              "An automatic mapping already contains the naming and placement rules. Running the pipeline refreshes its generated source YAML and raw models from live metadata.",
            affirm: "automatic mappings need a pipeline run, not a hand edit.",
          },
        },
        {
          id: "run",
          title: "6 · Run the four-stage pipeline",
          body: (
            <>
              <p>From the repo root, in the terminal opened by the workspace, run:</p>
              <CodeBlock
                lang="bash"
                code={`python scripts/sources/run_all_source_generation.py`}
              />
              <p>
                A browser window opens for Snowflake SSO. Complete the sign-in and
                return to the terminal. The script then builds the metadata query,
                extracts live metadata, updates source YAML, and generates raw models.
              </p>
              <p>
                <strong>You should see:</strong>{" "}all four scripts complete
                successfully. For this manual example,
                <code>manual_analyst_managed.yml</code>{" "}remains the source declaration
                and a new
                <code>models/raw/shared/raw_reference_opening_hours.sql</code>{" "}appears.
              </p>
              <Callout kind="warn" title="Generated means replaceable">
                <p>
                  Never hand-edit <code>models/raw/**/*.sql</code>{" "}or
                  <code>models/sources/auto_*.yml</code>. A future pipeline run will
                  overwrite the edit. Fix manual YAML or generator configuration instead.
                </p>
              </Callout>
            </>
          ),
        },
        {
          id: "verify",
          title: "7 · Verify the files and preview the raw model",
          body: (
            <>
              <p>First inspect exactly what generation changed:</p>
              <CodeBlock
                lang="bash"
                code={`git status --short
git diff -- models/sources models/raw`}
              />
              <p>
                For the worked example, expect the manual YAML to be modified and the
                raw SQL file to be new. If the full refresh shows unrelated source
                drift, review it with the team rather than bundling it into your PR blindly.
              </p>
              <p>Then make dbt parse the declaration and preview real rows:</p>
              <CodeBlock
                lang="bash"
                code={`dbt parse
dbt show -s raw_reference_opening_hours`}
              />
              <p>
                <strong>You are done when:</strong>{" "}<code>dbt parse</code>{" "}passes,
                <code>dbt show</code>{" "}returns rows, and you can see the cleaned
                snake_case columns you will use in staging.
              </p>
            </>
          ),
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      slug: "where-does-it-go",
      title: "Where does it go?",
      blurb: "Layers × domains: choosing the folder (it chooses your config)",
      minutes: 12,
      steps: [
        {
          id: "why-folders",
          body: (
            <>
              <p>
                In this project, the folder you put a file in is not tidiness — it{" "}
                <strong>is</strong>{" "}configuration. The folder decides whether your
                model builds as a view or table, which database and schema it lands
                in, what tags and governance hooks it gets. Choose the folder and
                you have configured the model.
              </p>
              <p>
                The choice is two simple questions: which <strong>layer</strong>{" "}
                (what job is the model doing) and which <strong>domain</strong>{" "}
                (what data is it about).
              </p>
              <Callout kind="info" title="Raw and staging share the STAGING database">
                <p>
                  Raw models all build in <code>STAGING.DBT_RAW</code>. Staging models
                  use a proper schema for the source or domain, such as
                  <code>STAGING.OLIDS</code>{" "}or <code>STAGING.REFERENCE</code>.
                  Development mirrors the same layout in <code>DEV__STAGING</code>.
                </p>
              </Callout>
            </>
          ),
        },
        {
          id: "picker",
          title: "Try it",
          body: (
            <>
              <FolderPicker />
              <p>
                For our worked example — cleaning one reference table about sites —
                the answers are <em>staging</em> + <em>shared reference</em>:{" "}
                <code>models/staging/shared/</code>, file starting{" "}
                <code>stg_</code>.
              </p>
            </>
          ),
          check: {
            prompt:
              "You're building a model that joins GP observations to derive a reusable smoking-status block. Folder?",
            options: [
              "`models/staging/olids/` — it reads staged data",
              "`models/modelling/olids/` — joins and reusable derivations are modelling-layer work",
              "`models/reporting/olids/` — analysts will use it",
              "`models/modelling/commissioning/` — derivations live under commissioning",
            ],
            answer: 1,
            explain:
              "Job first: joining and deriving a reusable block = modelling (int_). Data second: GP observations = olids. Staging never joins; reporting is for assembled analyst-facing datasets that would ref() this block.",
            affirm: "the job picks the layer, the data picks the domain.",
          },
        },
        {
          id: "name",
          title: "Do: create the file",
          body: (
            <>
              <p>
                Name = layer prefix + source + table, matching the raw model:
              </p>
              <CodeBlock
                lang="text"
                code={`models/staging/shared/stg_reference_opening_hours.sql`}
              />
              <p>
                <strong>You should have:</strong>{" "}an empty <code>.sql</code>{" "}file in
                the right folder. That empty file is already configured — the
                staging folder will make it a view in the staging schema.
              </p>
            </>
          ),
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      slug: "write-the-model",
      title: "Write the model",
      blurb: "One SELECT, project style, previewed as you go",
      minutes: 25,
      steps: [
        {
          id: "write",
          body: (
            <>
              <p>
                A staging model is one SELECT from the raw model: explicit columns,
                light cleaning, renames to conventions. Write yours; for the worked
                example:
              </p>
              <CodeBlock
                lang="sql"
                title="stg_reference_opening_hours.sql"
                code={`
select
    organisation_code,
    upper(trim(site_code)) as site_code,
    day_of_week,
    opens_at::time as opens_at,
    closes_at::time as closes_at,
    is_open_24h::boolean as is_open_24h
from {{ ref('raw_reference_opening_hours') }}
`}
              />
              <p>Why each choice:</p>
              <ul>
                <li>
                  <code>ref()</code>, never a hardcoded table — dbt fills in the
                  right database per environment and learns the dependency.
                </li>
                <li>
                  <strong>Explicit columns</strong>, no <code>select *</code> — you
                  are defining the interface downstream models will rely on.
                </li>
                <li>
                  <strong>No joins, no filters with business meaning</strong> — the
                  moment you want one, that is a modelling-layer (<code>int_</code>)
                  model instead.
                </li>
                <li>
                  <strong>Lowercase keywords</strong> — the linter in CI checks it.
                </li>
              </ul>
            </>
          ),
        },
        {
          id: "inside-a-command",
          title: "What a dbt command actually does",
          body: (
            <>
              <p>
                You are about to run dbt against your model, so it is worth
                seeing the three moves inside every command. Click each one:
              </p>
              <DbtExecutionFlow />
              <p>
                The split that matters: parse and compile only read and render
                — they cannot touch Snowflake. Only execution does warehouse
                work. That is why <code>dbt compile</code>{" "}is always safe, and
                why it is your window into what dbt generated whenever a{" "}
                <code>ref()</code>{" "}or macro surprises you.
              </p>
            </>
          ),
          check: {
            prompt: "Which command shows the rendered SQL without building anything?",
            options: ["`dbt build`", "`dbt compile`", "`dbt test`", "`dbt debug`"],
            answer: 1,
            explain:
              "compile stops after rendering: templates become plain SQL, and nothing is created in Snowflake.",
            affirm: "compile reveals the SQL dbt generated — nothing is built.",
          },
        },
        {
          id: "preview",
          title: "Do: look at it before building it",
          body: (
            <>
              <CodeBlock
                lang="bash"
                code={`
dbt show -s stg_reference_opening_hours    # run the SELECT, print 5 rows
dbt compile                                # render every model to plain SQL
`}
              />
              <p>
                <strong>You should see:</strong>{" "}five sensible-looking rows from{" "}
                <code>dbt show</code>; and <code>dbt compile</code>{" "}finishing in
                seconds with no errors. While you type, the dbt extension is doing
                the same checking live — a red underline now is an error{" "}
                <code>dbt build</code>{" "}would have given you later.
              </p>
              <p>
                <strong>If show fails:</strong>{" "}read the message — a misspelled{" "}
                <code>ref()</code>{" "}names the model it can&apos;t find; a SQL error
                points at the line.
              </p>
            </>
          ),
          check: {
            prompt: "Why explicit columns rather than `select *` in staging?",
            options: [
              "`select *` is slower in Snowflake",
              "The column list is the interface downstream models depend on — * silently changes when the source does",
              "dbt cannot compile `select *`",
              "It makes the file longer, which reviewers prefer",
            ],
            answer: 1,
            explain:
              "With *, a new upstream column appears downstream unannounced, and a removed one breaks consumers without warning. Naming columns makes the model's contract explicit and changes deliberate.",
            affirm: "explicit columns are the contract downstream models rely on.",
          },
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      slug: "describe-and-test",
      title: "Describe and test it",
      blurb: "Eight lines of YAML, written by hand, that work forever",
      minutes: 20,
      steps: [
        {
          id: "why-yaml",
          body: (
            <>
              <p>
                Next to your <code>.sql</code>{" "}goes a <code>.yml</code>{" "}file with
                the same name. It does three jobs: names an owner, documents the
                columns, and declares <strong>tests</strong> — assertions checked on
                every build, forever. CI requires it; more importantly, it is where
                your knowledge of the data gets written down.
              </p>
              <p>
                Write it by hand — it is short, and writing it is how you make the
                decisions it contains:
              </p>
              <CodeBlock
                lang="yaml"
                title="stg_reference_opening_hours.yml"
                code={`
models:
  - name: stg_reference_opening_hours
    description: Site opening hours reference, one row per site per day of week
    config:
      meta:
        owner:
          name: Your Name
    data_tests:
      - dbt_utils.unique_combination_of_columns:
          arguments:
            combination_of_columns: [site_code, day_of_week]
    columns:
      - name: site_code
        description: Standardised site identifier
        data_tests: [not_null]
      - name: day_of_week
        description: ISO day of week (1 = Monday)
        data_tests: [not_null]
`}
              />
            </>
          ),
        },
        {
          id: "anatomy",
          title: "What each part does",
          body: (
            <>
              <ul>
                <li>
                  <strong>description</strong> — note it states the grain. Ends up in
                  dbt docs and as a Snowflake comment.
                </li>
                <li>
                  <strong>owner</strong> — every model names a human; CI checks.
                </li>
                <li>
                  <strong>the grain test</strong> — remember your one-sentence grain?{" "}
                  <code>unique_combination_of_columns</code>{" "}on those columns is the
                  single most valuable test you can write: it fails the moment
                  anything duplicates rows.
                </li>
                <li>
                  <strong>not_null</strong>{" "}on the key columns the grain depends on.
                </li>
              </ul>
              <p>
                Three tests is right for a staging model. Every test compiles to a
                query that hunts for violating rows — zero rows back means pass.
              </p>
            </>
          ),
          check: {
            prompt:
              "Your grain is one row per site per weekday. Which single test catches a future join accidentally duplicating rows?",
            options: [
              "`not_null` on `site_code`",
              "`unique` on `site_code`",
              "`unique_combination_of_columns` on `[site_code, day_of_week]`",
              "A row-count test",
            ],
            answer: 2,
            explain:
              "unique on site_code alone would fail now (each site has 7 rows). Only the combination test matches your actual grain — and it fires the moment anything fans the table out.",
            affirm: "test the combination — that's what your grain actually is.",
          },
        },
        {
          id: "agents",
          title: "On tooling and agents",
          body: (
            <>
              <p>
                AI assistants write competent YAML, and a generator command exists
                that scaffolds the column list from the built model (see the command
                reference). Use either to save typing — but notice what cannot be
                delegated: <em>what is the grain, which columns matter, what does
                null mean here</em>. Those are your decisions; tools are the junior
                partner that types them up.
              </p>
            </>
          ),
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      slug: "build-and-test",
      title: "Build it",
      blurb: "run, test, build and selectors — learned on your own model",
      minutes: 35,
      steps: [
        {
          id: "build",
          body: (
            <>
              <CodeBlock lang="bash" code={`dbt build -s stg_reference_opening_hours`} />
              <p>
                <code>build</code> = run the model <em>and</em>{" "}its tests, in
                order, in the <strong>DEV__ databases</strong> — the shared
                development copy of the warehouse. Nothing you do here touches
                production.
              </p>
              <p>
                <strong>You should see:</strong>
              </p>
              <CodeBlock
                lang="text"
                code={`
1 of 4 OK created sql view model ...stg_reference_opening_hours  [SUCCESS]
2 of 4 PASS not_null_..._site_code                               [PASS]
3 of 4 PASS not_null_..._day_of_week                             [PASS]
4 of 4 PASS dbt_utils_unique_combination_of_columns_...          [PASS]
Completed successfully
`}
              />
            </>
          ),
        },
        {
          id: "run-test-build",
          title: "Why build, and not run?",
          body: (
            <>
              <p>
                Three commands sound alike. The quickest way to tell them apart
                is to watch the same small project react to each — run all
                three:
              </p>
              <CommandDAG />
              <p>
                <code>run</code>{" "}creates without testing; <code>test</code>{" "}
                tests without creating; <code>build</code>{" "}does both, in DAG
                order, and stops downstream work when a test fails. For
                everyday model work, build is the answer.
              </p>
            </>
          ),
          check: {
            prompt: "`dbt run -s your_model` finishes green. What has it proved?",
            options: [
              "The model was created — but its data tests have not run",
              "The model and all its tests passed",
              "The whole project is healthy",
              "Nothing — run is a dry run",
            ],
            answer: 0,
            explain:
              "run only creates. A green run with a broken grain is still broken — which is why build, which adds the tests, is the everyday command.",
            affirm: "run creates; build creates and tests.",
          },
        },
        {
          id: "fail",
          title: "If a test fails",
          body: (
            <>
              <p>
                A FAIL line prints the count of violating rows. This is not a
                setback — <strong>your test just told you something true about the
                data</strong>{" "}that nobody had written down. The usual first-model
                discoveries:
              </p>
              <ul>
                <li>
                  <strong>Grain test fails</strong> — the source has duplicates you
                  didn&apos;t expect. Investigate: is your grain sentence wrong, or
                  is the feed dirty? Either answer is progress.
                </li>
                <li>
                  <strong>not_null fails</strong> — nulls are real. Decide whether
                  the column is genuinely optional (drop the test, document the
                  meaning of null) or the rows are junk worth flagging to the team.
                </li>
              </ul>
              <p>
                Investigate with <code>dbt show -s your_model --limit 20</code>, or
                run the failing test&apos;s compiled SQL from{" "}
                <code>target/compiled/</code>{" "}to see the exact offending rows.
              </p>
            </>
          ),
          check: {
            prompt:
              "Your grain test fails with 14 duplicate site/day pairs. What does that mean?",
            options: [
              "Your YAML is misconfigured",
              "dbt built the model twice",
              "The data genuinely contains duplicates your grain didn't expect — investigate before changing anything",
              "Snowflake's cache is stale; rebuild",
            ],
            answer: 2,
            explain:
              "The test ran a real query against real rows. Either your understanding of the grain is incomplete or the feed has a quality issue — both are findings worth a sentence in your PR description.",
            affirm: "a failing test is information about the data, not a verdict on you.",
          },
        },
        {
          id: "green",
          title: "Do: get to green",
          body: (
            <>
              <p>
                Iterate — edit, <code>dbt build -s stg_reference_opening_hours</code>,
                read — until everything passes.{" "}
                <strong>You should have:</strong>{" "}a fully green build, and (worth the
                30 seconds) a look at your actual table in Snowflake, sitting in the
                DEV__ database for its layer.
              </p>
            </>
          ),
        },
        {
          id: "selectors",
          title: "Choose what runs: selectors",
          body: (
            <>
              <p>
                You have been typing <code>-s your_model</code>{" "}all along —
                that is a <strong>selector</strong>. The command says what to
                do; the selector says which nodes to do it to. A <code>+</code>{" "}
                extends the selection along the DAG:
              </p>
              <SelectorPlayground />
              <p>
                To leave something out, there is no bare <code>-</code>{" "}
                operator — say it explicitly:
              </p>
              <CodeBlock
                lang="bash"
                code={`dbt build -s int_current_waits+ --exclude weekly_waits`}
              />
            </>
          ),
          check: {
            prompt: "Which selector means a model and everything upstream of it?",
            options: ["`my_model+`", "`+my_model`", "`-my_model`", "`my_model --up`"],
            answer: 1,
            explain:
              "A plus before the name walks upstream; after it, downstream. You'll use +my_model when your model needs fresh parents.",
            affirm: "prefix + goes upstream; suffix + goes downstream.",
          },
        },
        {
          id: "ls-first",
          title: "Do: look before a broad build",
          body: (
            <>
              <p>
                Before running a selector wider than one model, see what it
                catches — replace <code>build</code>{" "}with <code>ls</code>:
              </p>
              <TryIt
                stages={[
                  {
                    cmd: "dbt ls -s +stg_reference_opening_hours",
                    out: `source:reference.opening_hours
raw_reference_opening_hours
stg_reference_opening_hours`,
                  },
                ]}
                done="You saw the selection without running any of it."
              />
              <p>
                <strong>You should see:</strong>{" "}just your model and its raw
                parent. Cheap, instant, and there is nothing left to guess.
              </p>
            </>
          ),
        },
        {
          id: "daily-loop",
          title: "Your daily loop",
          body: (
            <>
              <p>
                That is the whole toolkit. From your second model on, the loop
                is: use the smallest command that proves the next thing.
              </p>
              <div className="my-6 flex flex-col gap-2">
                {[
                  ["1", "dbt compile -s my_model", "Does the SQL make sense?"],
                  ["2", "dbt show -s my_model", "Do a few rows look right?"],
                  ["3", "dbt build -s my_model", "Can it be created and pass its tests?"],
                  ["4", "dbt ls -s my_model+", "What downstream work might be affected?"],
                ].map(([number, command, question]) => (
                  <div key={number} className="flex items-center gap-3 rounded-xl border border-line bg-paper px-4 py-3">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-ink font-display text-sm font-bold text-paper">{number}</span>
                    <div className="min-w-0">
                      <code className="!whitespace-normal">{command}</code>
                      <span className="mt-1 block text-xs text-ink-faint">{question}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p>
                Five quick situations to lock it in — choose the smallest
                useful command for each:
              </p>
              <CommandLab />
            </>
          ),
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      slug: "open-the-pr",
      title: "Open the PR",
      blurb: "Branch, commit, push, propose — then watch the checks",
      minutes: 20,
      steps: [
        {
          id: "branch-commit",
          body: (
            <>
              <p>
                Time for the git loop from the essentials course — for real this
                time. You should still be on the feature branch you created before
                editing any project files. Confirm that before staging anything:
              </p>
              <CodeBlock
                lang="bash"
                code={`git status`}
              />
              <p>
                <strong>You should see:</strong>{" "}your <code>.sql</code>{" "}and{" "}
                <code>.yml</code>{" "}listed as untracked/modified — and nothing else.
                If generated source files from earlier are listed, they belong in
                this PR too. Anything you don&apos;t recognise: don&apos;t stage it.
              </p>
              <p>
                If status says <code>On branch main</code>, create your feature branch
                now with <code>git switch -c feat/opening-hours-staging</code>; your
                uncommitted changes will move with you. Do not pull until those
                changes are safely on a branch.
              </p>
              <CodeBlock
                lang="bash"
                code={`
git add models/staging/shared/stg_reference_opening_hours.sql
git add models/staging/shared/stg_reference_opening_hours.yml
git commit -m "feat: add opening hours staging model"
git push
`}
              />
            </>
          ),
        },
        {
          id: "pr",
          title: "Do: open the pull request",
          body: (
            <>
              <p>
                <strong>You should see:</strong>{" "}the push output includes a “Create a
                pull request” link — click it (or run <code>gh pr create</code>).
                Write a description a stranger could follow:
              </p>
              <CodeBlock
                lang="text"
                code={`
## What
Adds stg_reference_opening_hours: one row per site per weekday.

## Why
Needed for the access dashboard; nothing currently stages this table.

## Checks
- dbt build green locally; grain verified on (site_code, day_of_week)
- ~40 rows have null closes_at where is_open_24h = true - kept, noted in column description
`}
              />
              <p>
                That third section — what you checked and what you noticed — is the
                habit that makes reviews fast.
              </p>
            </>
          ),
        },
        {
          id: "checks",
          title: "Then: watch what happens",
          body: (
            <>
              <p>
                <strong>You should see, within a couple of minutes:</strong>{" "}checks
                appearing at the bottom of the PR (compile, code quality, ownership)
                and <strong>CodeRabbit</strong> — an automated reviewer — commenting
                on your diff. A human reviewer is auto-assigned; once they are, the
                heavier validation check builds your changed models in a shared dev
                environment.
              </p>
              <p>
                While you wait, read your own diff in the Files changed tab.
                Everyone finds something.
              </p>
            </>
          ),
          check: {
            prompt: "CodeRabbit leaves a comment you're fairly sure is wrong. You should…",
            options: [
              "Apply it anyway — automated reviewers are authoritative",
              "Ignore it silently",
              "Reply explaining why you're keeping it as is — disagreeing with reasons is a normal review response",
              "Close the PR and re-open to clear the comments",
            ],
            answer: 2,
            explain:
              "Automated review comments are suggestions, not gates. Address the valid ones, push back on the rest in a reply — the human reviewer sees both the comment and your reasoning.",
            affirm: "automated comments are suggestions — disagreeing with reasons is a valid response.",
          },
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      slug: "merge-and-after",
      title: "Merge — and what happens next",
      blurb: "Responding to review, landing on main, and your model's new life",
      minutes: 15,
      steps: [
        {
          id: "respond",
          body: (
            <>
              <p>
                Review comments arrive. The loop for each: make the change locally,
                then —
              </p>
              <CodeBlock
                lang="bash"
                code={`
git add -u
git commit -m "fix: rename site identifier to match conventions"
git push
`}
              />
              <p>
                — and <strong>reply to the comment</strong>{" "}(“done in abc123”) so the
                reviewer doesn&apos;t have to re-read your whole diff. Disagree with
                a comment? Say why in the thread; reviewers are often missing
                context you have.
              </p>
            </>
          ),
        },
        {
          id: "merge",
          title: "Do: merge",
          body: (
            <>
              <p>
                Approval plus green checks unlocks the merge button. We
                squash-merge: your branch&apos;s commits become one tidy commit on
                main. Delete the branch when GitHub offers, then locally:
              </p>
              <CodeBlock
                lang="bash"
                code={`
git switch main
git pull
`}
              />
              <p>
                <strong>You should see:</strong>{" "}your model in the pulled main — and
                shortly after the merge, the deploy workflow building it into
                production Snowflake.
              </p>
            </>
          ),
        },
        {
          id: "after",
          title: "Your model's new life",
          body: (
            <>
              <p>From tonight, without you doing anything:</p>
              <ul>
                <li>the nightly build rebuilds your model and runs your tests;</li>
                <li>
                  if the feed changes in six months, your grain test raises the
                  alarm — to the team, before any dashboard is wrong;
                </li>
                <li>
                  your column descriptions are live in dbt docs and as Snowflake
                  comments;
                </li>
                <li>anyone can <code>ref()</code>{" "}your model and build on it.</li>
              </ul>
              <p>
                That is the full loop, and it is the same loop for everything from a
                one-line fix to a new disease register. It felt heavyweight this
                time; from the second PR on, the loop is minutes.
              </p>
            </>
          ),
          check: {
            prompt: "Six months on, the feed starts sending duplicate rows. Who finds out, and how?",
            options: [
              "A dashboard user notices odd numbers and emails around",
              "The nightly build — your grain test fails and the team sees it before any output is consumed",
              "Nobody, unless someone re-checks the model",
              "Snowflake blocks the duplicate rows automatically",
            ],
            answer: 1,
            explain:
              "This is the payoff of the YAML you wrote in twenty minutes: your understanding of the data became an assertion that runs every night, forever, guarding everyone downstream of you.",
            affirm: "your tests now guard the pipeline every night, without you.",
          },
        },
      ],
    },
  ],
};
