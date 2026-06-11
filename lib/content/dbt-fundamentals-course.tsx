import type { Course } from "@/lib/course-types";
import { Callout } from "@/components/Callout";
import { CodeBlock } from "@/components/CodeBlock";
import { TryIt } from "@/components/TryIt";
import { DbtExecutionFlow } from "@/components/DbtExecutionFlow";
import { CommandChooser } from "@/components/CommandChooser";
import { TargetExplorer } from "@/components/TargetExplorer";
import { SelectorPlayground } from "@/components/SelectorPlayground";

export const DBT_FUNDAMENTALS_COURSE: Course = {
  slug: "dbt-fundamentals",
  title: "dbt fundamentals",
  tagline: "Understand what dbt reads, selects, compiles and runs before you trust it with a project",
  audience:
    "For analysts who know SQL and have completed Git essentials (or already use git). No warehouse access is required: the terminal exercises are simulations. Take this before Your first PR.",
  hours: "~2 hrs 45 mins",
  accent: "var(--layer-modelling)",
  lessons: [
    {
      slug: "what-dbt-does",
      title: "What dbt does",
      blurb: "The parse, compile, execute mental model",
      minutes: 18,
      steps: [
        {
          id: "not-a-query-runner",
          body: (
            <>
              <p>
                It is tempting to learn dbt as a list of commands: run this one to
                build, that one to test. That works until a command surprises you.
                The safer starting point is to understand the machine underneath.
              </p>
              <p>
                dbt is not mainly a SQL runner. It is a <strong>project compiler and
                task runner</strong>. It reads a whole project, turns files into a
                dependency graph, compiles templates into executable SQL, then acts on
                the part of that graph you selected.
              </p>
              <DbtExecutionFlow />
              <p>
                Every command uses some or all of those phases. Once you can say which
                phase failed, a wall of terminal output becomes much less mysterious.
              </p>
            </>
          ),
        },
        {
          id: "project-map",
          title: "Parse: make the project map",
          body: (
            <>
              <p>
                During parsing, dbt reads model files, YAML, tests, macros and project
                configuration. Calls such as <code>{"{{ ref('stg_people') }}"}</code>{" "}
                become graph edges. Folder and resource configuration becomes metadata
                attached to each node.
              </p>
              <p>
                The result is a manifest: dbt&apos;s structured understanding of the
                project. It knows that <code>fct_waiting_list</code> is a model, where
                its file lives, what it depends on, how it should materialise and which
                tests belong to it.
              </p>
              <Callout kind="info" title="Parsing does not mean building">
                <p>
                  A successful parse proves that dbt can understand the project
                  structure. It does not prove that every SQL statement is valid in
                  Snowflake or that any model has been created.
                </p>
              </Callout>
            </>
          ),
        },
        {
          id: "render-sql",
          title: "Compile: turn templates into SQL",
          body: (
            <>
              <p>A dbt model can contain things Snowflake does not understand:</p>
              <CodeBlock
                lang="sql"
                title="models/modelling/int_current_waits.sql"
                code={`
select *
from {{ ref('stg_waiting_list') }}
where snapshot_date = {{ var('reporting_date') }}
`}
              />
              <p>
                Compilation resolves <code>ref()</code>, renders variables and macros,
                and produces plain SQL using the configured development environment:
              </p>
              <CodeBlock
                lang="sql"
                title="compiled output (where dbt stores this comes later)"
                code={`
select *
from DEV__MODELLING.DBT_STAGING.STG_WAITING_LIST
where snapshot_date = '2026-06-01'
`}
              />
              <p>
                This is one of the best debugging moves in dbt: when the template looks
                right but the result does not, inspect what dbt actually generated.
              </p>
            </>
          ),
        },
        {
          id: "verb-selector",
          title: "Every command has a verb and a selection",
          body: (
            <>
              <CodeBlock lang="bash" code={`dbt build --select +int_current_waits`} />
              <p>Read that command in two halves:</p>
              <ul>
                <li>
                  <strong>The verb is build.</strong> It says what dbt should do to the
                  resources it receives.
                </li>
                <li>
                  <strong>The selection is +int_current_waits.</strong> It says which
                  resources the verb should receive.
                </li>
              </ul>
              <p>
                Most command confusion comes from mixing those questions together.
                Keep them separate: <em>what will dbt select?</em> Then:{" "}
                <em>what will this verb do to that selection?</em>
              </p>
            </>
          ),
          check: {
            prompt: "In dbt build -s +int_current_waits, which part decides the nodes involved?",
            options: [
              "build",
              "-s +int_current_waits",
              "The model's materialisation",
              "The active warehouse",
            ],
            answer: 1,
            explain:
              "The selector chooses the resources. The build verb decides what work to perform on those selected resources.",
            affirm: "selection chooses the nodes; the verb chooses the work.",
          },
        },
        {
          id: "first-parse",
          title: "Try it: ask dbt to read the project",
          body: (
            <>
              <p>
                Run the simulated command. Notice what is missing from the output: no
                model is created and no rows are returned.
              </p>
              <TryIt
                stages={[
                  {
                    cmd: "dbt parse",
                    prompt: "Build the project manifest without running models",
                    out: `dbt-fusion 2.0.0
Parsing project 'wnl_analytics'
Found 684 models, 1,942 data tests, 38 sources, 12 snapshots
Wrote project manifest
Completed successfully in 1.8s`,
                  },
                ]}
                done="The project is understood. Nothing has been materialised."
              />
            </>
          ),
        },
      ],
    },
    {
      slug: "project-profile-target",
      title: "Project, profile and destination",
      blurb: "Code configuration versus your connection and environment",
      minutes: 22,
      steps: [
        {
          id: "two-configs",
          body: (
            <>
              <p>
                First, an awkward naming detail: dbt uses the word{" "}
                <strong>target</strong> for two different things.
              </p>
              <ul>
                <li>
                  <strong>A profile target</strong> is a named connection destination,
                  such as <code>dev</code> or <code>prod</code>. One is active for each
                  command and determines where warehouse work goes.
                </li>
                <li>
                  <strong>The <code>target/</code> directory</strong> is a local generated
                  folder where dbt writes compiled SQL and project artifacts. It is not
                  a database destination. We inspect it in the next lesson.
                </li>
              </ul>
              <p>
                Same word, unrelated jobs. When this course says <em>active target</em>,
                it means the profile destination. When it shows <code>target/</code> with
                a slash, it means the local folder.
              </p>
              <p>
                Two configuration ideas sit beside each other and do different jobs.
                Mixing them up is a common first-week problem.
              </p>
              <ul>
                <li>
                  <strong><code>dbt_project.yml</code> describes the shared project.</strong>{" "}
                  It belongs in git. It defines paths, defaults, variables and how
                  groups of resources should behave.
                </li>
                <li>
                  <strong><code>profiles.yml</code> describes how your dbt process connects.</strong>{" "}
                  It usually lives under <code>~/.dbt/</code>, outside the repository.
                  It defines outputs such as dev or prod and which output is active.
                </li>
              </ul>
              <p>
                Project configuration is team knowledge. Connection details are
                environment-specific and may contain secrets, so they stay local or in
                a deployment platform&apos;s secure settings.
              </p>
            </>
          ),
        },
        {
          id: "project-file",
          title: "dbt_project.yml: what should this codebase do?",
          body: (
            <>
              <CodeBlock
                lang="yaml"
                title="dbt_project.yml (abridged)"
                code={`
name: wnl_analytics
profile: wnl_analytics
model-paths: ["models"]
target-path: target  # local generated folder

models:
  wnl_analytics:
    +materialized: table
    staging:
      +materialized: view
      +schema: DBT_STAGING
`}
              />
              <p>
                The <code>profile:</code> value is a lookup name. It tells dbt which
                profile entry to use; it is not the connection itself. The models
                section then applies shared defaults by folder.
              </p>
              <p>
                This is why moving a model between folders can change where and how it
                builds even when the SQL file itself is untouched.
              </p>
            </>
          ),
        },
        {
          id: "profile-file",
          title: "profiles.yml: where and as whom should dbt connect?",
          body: (
            <>
              <CodeBlock
                lang="yaml"
                title="~/.dbt/profiles.yml (illustrative)"
                code={`
wnl_analytics:
  target: dev  # active connection destination
  outputs:
    dev:
      type: snowflake
      account: "{{ env_var('DBT_ACCOUNT') }}"
      user: "{{ env_var('DBT_USER') }}"
      role: ANALYST
      database: DEV__MODELLING
      schema: DBT_EDDIE
      warehouse: ANALYST_WH
    prod:
      type: snowflake
      account: "{{ env_var('DBT_ACCOUNT') }}"
      role: TRANSFORMER
      database: MODELLING
      schema: DBT_DEFAULT
      warehouse: TRANSFORMING_WH
`}
              />
              <p>
                The target named at the top is the default output. You can override it
                for one invocation with <code>--target</code>, but analysts should not
                casually point local commands at production.
              </p>
              <Callout kind="warn" title="This project loads connection values for you">
                <p>
                  The repository&apos;s setup script reads your ignored <code>.env</code>{" "}
                  file and prepares the local dbt environment. You still need to
                  understand profiles and targets because they explain where dbt sends
                  work, but you should not duplicate credentials into tracked files.
                </p>
              </Callout>
            </>
          ),
        },
        {
          id: "target-effects",
          title: "The same model, a different destination",
          body: (
            <>
              <p>
                <code>ref()</code> is environment-aware. In development, a reference
                can resolve to a development relation; in production, the same source
                code resolves to the production relation. The active profile output
                participates in that decision.
              </p>
              <CodeBlock
                lang="text"
                code={`
source code:  {{ ref('stg_waiting_list') }}

dev target:   DEV__MODELLING.DBT_STAGING.STG_WAITING_LIST
prod target:  MODELLING.DBT_STAGING.STG_WAITING_LIST
`}
              />
              <p>
                That separation is what lets you build and inspect work without
                replacing the shared production object. A hardcoded production table
                name throws that protection away.
              </p>
            </>
          ),
          check: {
            prompt: "Which file should contain the shared folder-level materialisation defaults?",
            options: [
              "profiles.yml",
              ".env",
              "dbt_project.yml",
              "manifest.json",
            ],
            answer: 2,
            explain:
              "dbt_project.yml is versioned project configuration. profiles.yml and .env describe local connection context; manifest.json is generated output.",
            affirm: "shared project behavior belongs in dbt_project.yml.",
          },
        },
        {
          id: "debug",
          title: "Try it: inspect the active setup",
          body: (
            <>
              <TryIt
                stages={[
                  {
                    cmd: "dbt debug",
                    prompt: "Check project and connection configuration",
                    out: `dbt-fusion 2.0.0
Project file: dbt_project.yml [OK]
Profile: wnl_analytics
Target: dev
Connection: Snowflake / DEV__MODELLING / DBT_EDDIE [OK]
All checks passed!`,
                  },
                ]}
                done="debug answers: can dbt find its project, profile and warehouse?"
              />
              <p>
                Use <code>dbt debug</code> for configuration and connectivity. It does
                not validate the business logic in your models.
              </p>
            </>
          ),
        },
      ],
    },
    {
      slug: "parse-compile-target",
      title: "Parse, compile and artifacts",
      blurb: "Read generated artifacts instead of guessing",
      minutes: 23,
      steps: [
        {
          id: "parse-vs-compile",
          body: (
            <>
              <p>
                <code>dbt parse</code> and <code>dbt compile</code> are close relatives,
                but they answer different questions.
              </p>
              <ul>
                <li>
                  <strong>parse:</strong> can dbt understand the project structure and
                  create its manifest?
                </li>
                <li>
                  <strong>compile:</strong> what executable SQL does this project
                  produce after Jinja, macros and references are resolved?
                </li>
              </ul>
              <p>
                Fusion also performs static SQL analysis during compilation. Depending
                on project settings and macro behavior, compilation may use warehouse
                metadata or introspective queries. Treat it as non-materialising, not
                as a promise that the warehouse is never contacted.
              </p>
            </>
          ),
        },
        {
          id: "compile-one",
          title: "Compile the smallest useful selection",
          body: (
            <>
              <TryIt
                stages={[
                  {
                    cmd: "dbt compile -s int_current_waits",
                    prompt: "Render one model without materialising it",
                    out: `Compiling 1 model
Analyzed int_current_waits [PASS]
Compiled node 'int_current_waits' is:
select * from DEV__MODELLING.DBT_STAGING.STG_WAITING_LIST
where is_current = true
Completed successfully`,
                  },
                ]}
                done="The rendered SQL exists under target/compiled; no model was replaced."
              />
              <p>
                Compile one model while debugging. Compile the whole project before a
                PR when you want broad confidence that your change did not break
                project-wide references or templating.
              </p>
            </>
          ),
        },
        {
          id: "target-explorer",
          title: "target/ is dbt's workbench",
          body: (
            <>
              <p>
                The <code>target/</code> directory is generated output. It is safe to
                inspect and normally ignored by git. Its contents change as commands
                progress through parsing, compilation and execution.
              </p>
              <TargetExplorer />
              <p>
                You do not need to memorise every artifact. Know the three that answer
                most analyst questions: <code>manifest.json</code>, compiled SQL and
                <code>run_results.json</code>.
              </p>
            </>
          ),
        },
        {
          id: "artifacts",
          title: "Three artifacts worth knowing",
          body: (
            <>
              <ul>
                <li>
                  <strong><code>manifest.json</code>:</strong> the project graph and
                  resource metadata. Tools use it for lineage, state comparison and
                  documentation.
                </li>
                <li>
                  <strong><code>target/compiled/</code>:</strong> rendered model and
                  test SQL. Read this when macros or references obscure the actual query.
                </li>
                <li>
                  <strong><code>run_results.json</code>:</strong> the outcome and timing
                  of resources from the latest execution command.
                </li>
              </ul>
              <Callout kind="tip" title="Generated does not mean unimportant">
                <p>
                  Do not hand-edit files under <code>target/</code>; dbt will overwrite
                  them. But do read them. They are often the clearest account of what
                  dbt believed and what it sent to the warehouse.
                </p>
              </Callout>
            </>
          ),
        },
        {
          id: "clean",
          title: "When stale output gets in the way",
          body: (
            <>
              <CodeBlock lang="bash" code={`dbt clean`} />
              <p>
                <code>dbt clean</code> removes directories configured in
                <code>clean-targets</code>, usually including <code>target/</code> and
                installed packages. Use it when generated output is stale or when you
                want to prove a result can be recreated from a clean state.
              </p>
              <p>
                It does <strong>not</strong> drop your Snowflake models. It cleans local
                generated directories, then later commands recreate what they need.
              </p>
            </>
          ),
          check: {
            prompt: "A macro produced surprising SQL. Where should you look first?",
            options: [
              "Edit the SQL under target/compiled",
              "Open the rendered file under target/compiled and compare it with the model",
              "Delete profiles.yml",
              "Run dbt test repeatedly",
            ],
            answer: 1,
            explain:
              "Compiled SQL reveals the actual query produced by Jinja and macros. Inspect it, then fix the source model or macro, never the generated file.",
            affirm: "inspect generated SQL; fix its source.",
          },
        },
      ],
    },
    {
      slug: "run-test-build",
      title: "Run, test or build?",
      blurb: "Same selection, different work and failure behavior",
      minutes: 24,
      steps: [
        {
          id: "compare",
          body: (
            <>
              <p>
                These commands share the same selector language, but their verbs
                operate on different resource types. Click through the comparison
                before running the exercises.
              </p>
              <CommandChooser />
              <p>
                In daily model development, <code>dbt build -s my_model</code> is the
                strongest default because it materialises the model and runs the tests
                selected with it. The narrower commands still matter when you are
                isolating one stage of a failure.
              </p>
            </>
          ),
        },
        {
          id: "run",
          title: "run: materialise models",
          body: (
            <>
              <TryIt
                stages={[
                  {
                    cmd: "dbt run -s int_current_waits",
                    prompt: "Materialise the selected model",
                    out: `Found 1 selected model
1 of 1 START table model DBT_EDDIE.INT_CURRENT_WAITS
1 of 1 OK created table model DBT_EDDIE.INT_CURRENT_WAITS [SUCCESS 1 in 2.14s]
Completed successfully`,
                  },
                ]}
                done="The relation was created. Its data tests have not run."
              />
              <p>
                Use <code>run</code> when the materialisation itself is the thing you
                are investigating. A green run means creation succeeded; it does not
                mean the result satisfies its tests.
              </p>
            </>
          ),
        },
        {
          id: "test",
          title: "test: execute assertions",
          body: (
            <>
              <TryIt
                stages={[
                  {
                    cmd: "dbt test -s int_current_waits",
                    prompt: "Run tests associated with the selected model",
                    out: `Found 3 selected data tests
1 of 3 PASS not_null_int_current_waits_person_id
2 of 3 PASS unique_int_current_waits_wait_id
3 of 3 FAIL 12 accepted_values_int_current_waits_status
Completed with 1 error`,
                  },
                ]}
                done="Tests queried the existing relation; they did not rebuild it first."
              />
              <p>
                A dbt data test passes when its query returns zero failing rows.
                Running <code>test</code> alone assumes the relation under test already
                exists in the active target.
              </p>
            </>
          ),
        },
        {
          id: "build",
          title: "build: execute the selected DAG in order",
          body: (
            <>
              <TryIt
                stages={[
                  {
                    cmd: "dbt build -s int_current_waits",
                    prompt: "Build the model and the tests selected with it",
                    out: `Found 1 model, 3 data tests
1 of 4 START table model DBT_EDDIE.INT_CURRENT_WAITS
1 of 4 OK created table model DBT_EDDIE.INT_CURRENT_WAITS
2 of 4 PASS not_null_int_current_waits_person_id
3 of 4 PASS unique_int_current_waits_wait_id
4 of 4 PASS accepted_values_int_current_waits_status
Completed successfully. PASS=4 WARN=0 ERROR=0 SKIP=0 TOTAL=4`,
                  },
                ]}
                done="One command materialised the model, then tested it in dependency order."
              />
              <p>
                <code>build</code> can execute selected models, tests, seeds and
                snapshots. The selector still controls scope: selecting one model does
                not include unrelated seed files or snapshots elsewhere in the project.
              </p>
            </>
          ),
        },
        {
          id: "skips",
          title: "Build failures protect downstream nodes",
          body: (
            <>
              <p>
                Build interleaves resources in DAG order. If an upstream model&apos;s
                error-severity test fails, dependent downstream resources can be
                skipped rather than built from data that has just failed its contract.
              </p>
              <CodeBlock
                lang="text"
                code={`
PASS  stg_waiting_list
FAIL  unique_stg_waiting_list_wait_id
SKIP  int_current_waits
SKIP  fct_waiting_list
`}
              />
              <p>
                A skip is not an extra broken model. Read upward in the log until you
                find the first failure that caused the protection to activate.
              </p>
            </>
          ),
          check: {
            prompt: "dbt run -s my_model is green. What has that proved?",
            options: [
              "The model was materialised successfully, but its data tests may not have run",
              "The model and all downstream models passed every test",
              "The entire project compiled and tested",
              "The production model was updated",
            ],
            answer: 0,
            explain:
              "run materialises selected models. Use build for materialisation plus selected tests, and always remember the active target determines the destination.",
            affirm: "run proves materialisation; build adds selected tests.",
          },
        },
      ],
    },
    {
      slug: "inspect-first",
      title: "Inspect before you build",
      blurb: "show, ls, compile and debug answer different questions",
      minutes: 17,
      steps: [
        {
          id: "question-first",
          body: (
            <>
              <p>
                The fastest command is the one that answers your actual question. Do
                not rebuild a model merely to find out which nodes a selector matches,
                and do not query rows merely to inspect rendered SQL.
              </p>
              <ul>
                <li><strong>What will this selector match?</strong> Use <code>dbt ls</code>.</li>
                <li><strong>What SQL will dbt generate?</strong> Use <code>dbt compile</code>.</li>
                <li><strong>What rows does this query return?</strong> Use <code>dbt show</code>.</li>
                <li><strong>Can dbt connect and find its config?</strong> Use <code>dbt debug</code>.</li>
              </ul>
            </>
          ),
        },
        {
          id: "show",
          title: "show: preview a query result",
          body: (
            <>
              <TryIt
                stages={[
                  {
                    cmd: "dbt show -s int_current_waits --limit 5",
                    prompt: "Compile and preview five rows",
                    out: `Previewing node 'int_current_waits':
| WAIT_ID | PERSON_ID | STATUS | WAIT_DAYS |
| 8142    | 102991    | OPEN   | 46        |
| 8143    | 883104    | OPEN   | 12        |
| 8144    | 441220    | PAUSED | 21        |
| 8145    | 775201    | OPEN   | 8         |
| 8146    | 332190    | OPEN   | 91        |`,
                  },
                ]}
                done="Rows were returned to the terminal; the model was not materialised."
              />
              <p>
                <code>show</code> runs a query, so it uses warehouse compute and can
                fail on permissions or invalid SQL. It is still lighter than replacing
                a model when all you need is a quick look at the result.
              </p>
            </>
          ),
        },
        {
          id: "ls",
          title: "ls: inspect selection without execution",
          body: (
            <>
              <TryIt
                stages={[
                  {
                    cmd: "dbt ls -s tag:reporting",
                    prompt: "List matching resources",
                    out: `wnl_analytics.reporting.fct_waiting_list
wnl_analytics.reporting.dim_specialty
wnl_analytics.reporting.obt_pathway_activity
wnl_analytics.reporting.dq_waiting_list`,
                  },
                ]}
                done="You now know the scope. No selected resource was built or queried."
              />
              <p>
                Make <code>dbt ls</code> your safety check for unfamiliar selectors,
                especially broad graph, tag, path or state-based selections.
              </p>
            </>
          ),
        },
        {
          id: "command-map",
          title: "A compact decision map",
          body: (
            <>
              <CodeBlock
                lang="text"
                code={`
Can dbt connect?             dbt debug
Can dbt understand project? dbt parse
What SQL will it produce?   dbt compile -s my_model
What does the query return? dbt show -s my_model --limit 20
What will this select?      dbt ls -s "selector"
Create the model only?      dbt run -s my_model
Test an existing relation?  dbt test -s my_model
Create and test it?         dbt build -s my_model
`}
              />
            </>
          ),
          check: {
            prompt: "You want to know what +fct_waiting_list matches without running warehouse SQL. Which command?",
            options: [
              "dbt show -s +fct_waiting_list",
              "dbt ls -s +fct_waiting_list",
              "dbt run -s +fct_waiting_list",
              "dbt debug -s +fct_waiting_list",
            ],
            answer: 1,
            explain:
              "ls applies the selector and prints matching resources without executing them. It is the safest way to inspect scope.",
            affirm: "use ls to inspect selection scope.",
          },
        },
      ],
    },
    {
      slug: "select-the-dag",
      title: "Select the right slice",
      blurb: "Names, methods, graph operators, sets and exclusion",
      minutes: 29,
      steps: [
        {
          id: "selection-methods",
          body: (
            <>
              <p>
                A selector can name one resource or describe a set. Common methods
                include file/model name, path, tag, resource type and source.
              </p>
              <CodeBlock
                lang="bash"
                code={`
dbt ls -s int_current_waits
dbt ls -s path:models/reporting/commissioning
dbt ls -s tag:daily
dbt ls -s resource_type:snapshot
dbt ls -s source:csds
`}
              />
              <p>
                Methods answer <em>which matching nodes?</em> Graph operators then
                expand from those matches through dependencies.
              </p>
            </>
          ),
        },
        {
          id: "graph-operators",
          title: "+ and @ walk the graph",
          body: (
            <>
              <SelectorPlayground />
              <ul>
                <li><code>+model</code> includes ancestors (upstream).</li>
                <li><code>model+</code> includes descendants (downstream).</li>
                <li><code>+model+</code> includes both directions.</li>
                <li><code>2+model</code> limits the upstream walk to two edges.</li>
                <li>
                  <code>@model</code> includes descendants and the ancestors required
                  to build those descendants, which is useful in isolated CI schemas.
                </li>
              </ul>
              <p>
                There is no symmetric bare <code>-</code> graph operator. To remove
                resources from a selection, use <code>--exclude</code>.
              </p>
            </>
          ),
        },
        {
          id: "sets",
          title: "Union, intersection and exclusion",
          body: (
            <>
              <CodeBlock
                lang="bash"
                code={`
# space = union: either selector may match
dbt ls -s "tag:daily tag:weekly"

# comma = intersection: both selectors must match
dbt ls -s "tag:daily,path:models/reporting"

# exclusion removes from the result
dbt ls -s "tag:daily" --exclude "tag:slow"
`}
              />
              <p>
                Quote selector expressions in the terminal. It keeps commas, spaces
                and graph operators together as one argument and avoids shell-specific
                surprises.
              </p>
              <Callout kind="warn" title="Comma means intersection, not a friendly separator">
                <p>
                  <code>tag:daily,path:models/reporting</code> means resources that are
                  both daily-tagged and under that path. A space means either set.
                </p>
              </Callout>
            </>
          ),
        },
        {
          id: "tests-follow",
          title: "Tests can be selected indirectly",
          body: (
            <>
              <p>
                When you select a model for <code>dbt build</code>, tests attached to
                that model can be included through indirect selection. A relationships
                test may depend on two models, so whether it is included can depend on
                which parents are selected.
              </p>
              <p>
                You do not need every indirect-selection mode memorised for daily work.
                You do need to notice tests in <code>dbt ls --select ... --output name</code>{" "}
                or in the build plan, and understand that tests are graph nodes too.
              </p>
            </>
          ),
        },
        {
          id: "practice-selectors",
          title: "Try it: inspect before executing",
          body: (
            <>
              <TryIt
                stages={[
                  {
                    cmd: "dbt ls -s +int_current_waits",
                    prompt: "List the model and all ancestors",
                    out: `source:wnl_analytics.wl.open_pathways
wnl_analytics.raw.raw_wl_open_pathways
wnl_analytics.staging.stg_wl_open_pathways
wnl_analytics.modelling.int_current_waits`,
                  },
                  {
                    cmd: "dbt ls -s int_current_waits+ --exclude resource_type:exposure",
                    prompt: "List descendants but remove exposures",
                    out: `wnl_analytics.modelling.int_current_waits
wnl_analytics.reporting.fct_waiting_list`,
                  },
                ]}
                done="You inspected two graph selections without executing either one."
              />
            </>
          ),
          check: {
            prompt: "Which selector means reporting models that carry the daily tag?",
            options: [
              "tag:daily path:models/reporting",
              "tag:daily,path:models/reporting",
              "tag:daily --exclude path:models/reporting",
              "+tag:daily+path:models/reporting",
            ],
            answer: 1,
            explain:
              "The comma is set intersection: nodes must match both the tag and path selectors. A space would form a union.",
            affirm: "comma intersects; space unites; --exclude subtracts.",
          },
        },
      ],
    },
    {
      slug: "daily-loop",
      title: "The daily command loop",
      blurb: "Choose the smallest command that proves the next thing",
      minutes: 18,
      steps: [
        {
          id: "progressive-confidence",
          body: (
            <>
              <p>
                Good local development is not one giant command after every edit. It
                is a ladder of increasingly expensive checks. Stop at the first failure,
                fix it, then move up one rung.
              </p>
              <CodeBlock
                lang="bash"
                code={`
dbt parse
dbt compile -s my_model
dbt show -s my_model --limit 20
dbt build -s my_model
dbt build -s my_model+
`}
              />
              <p>
                You will not always run every line. The sequence expresses the logic:
                structure, generated SQL, sample result, local contract, downstream
                impact.
              </p>
            </>
          ),
        },
        {
          id: "new-model",
          title: "Scenario: a new model",
          body: (
            <>
              <ol>
                <li>Compile it to catch references, Jinja and static-analysis findings.</li>
                <li>Show a small result and check grain, nulls and obvious values.</li>
                <li>Build it so the relation and selected tests are green together.</li>
                <li>Inspect downstream selection before deciding whether to build it.</li>
              </ol>
              <CodeBlock
                lang="bash"
                code={`
dbt compile -s stg_reference_opening_hours
dbt show -s stg_reference_opening_hours --limit 20
dbt build -s stg_reference_opening_hours
dbt ls -s stg_reference_opening_hours+
`}
              />
            </>
          ),
        },
        {
          id: "existing-contract",
          title: "Scenario: changing an existing model",
          body: (
            <>
              <p>
                Existing models have consumers. After proving the model itself, inspect
                and test the downstream slice appropriate to the change.
              </p>
              <CodeBlock
                lang="bash"
                code={`
dbt build -s int_current_waits
dbt ls -s int_current_waits+
dbt build -s int_current_waits+
`}
              />
              <p>
                The project also provides <code>.\build_changed.ps1</code> to select
                branch changes consistently. Use project helpers when they encode team
                policy; understand the underlying selectors so their output is never
                magic.
              </p>
            </>
          ),
        },
        {
          id: "failure-triage",
          title: "Scenario: a red command",
          body: (
            <>
              <ol>
                <li>Find the first error, not the final summary.</li>
                <li>Classify it: parse, compile, execute or test.</li>
                <li>Reduce to the smallest command that reproduces it.</li>
                <li>Inspect compiled SQL or failing rows.</li>
                <li>Re-run the narrow check before expanding scope again.</li>
              </ol>
              <Callout kind="tip" title="A failure is evidence about a phase">
                <p>
                  Missing <code>ref()</code>? Project graph. Invalid rendered SQL?
                  Compilation. Permission denied? Target or warehouse execution.
                  Duplicate grain? The test found data that violates the contract.
                </p>
              </Callout>
            </>
          ),
          check: {
            prompt: "After editing a macro, compilation succeeds but a model returns surprising rows. What is the best next move?",
            options: [
              "Run the entire project immediately",
              "Inspect the compiled SQL and use dbt show on the smallest affected model",
              "Delete the model's YAML",
              "Switch the local target to prod",
            ],
            answer: 1,
            explain:
              "Compiled SQL shows the macro expansion; show gives a small result without replacing the model. Together they isolate logic before a wider build.",
            affirm: "inspect narrowly, then expand confidence.",
          },
        },
      ],
    },
    {
      slug: "fundamentals-check",
      title: "Fundamentals check",
      blurb: "Prove you can predict what dbt will do before it does it",
      minutes: 20,
      steps: [
        {
          id: "intro",
          body: (
            <>
              <p>
                The goal is not command trivia. It is prediction: given a command, can
                you explain which project, target and resources it will use; whether it
                compiles, queries or materialises; and where you would inspect the result?
              </p>
              <p>
                Answer each scenario to complete the course. A wrong answer is not a
                penalty; the explanation is part of the lesson.
              </p>
            </>
          ),
        },
        {
          id: "q-project-profile",
          title: "1. Configuration",
          body: <p>A teammate asks why their model builds into a different development schema from yours.</p>,
          check: {
            prompt: "Which configuration is the most likely starting point?",
            options: ["The shared model SQL", "Their active profile target", "manifest.json", "The test YAML"],
            answer: 1,
            explain:
              "The profile target supplies environment-specific connection and destination context. Shared model SQL should remain the same.",
            affirm: "targets explain environment-specific destinations.",
          },
        },
        {
          id: "q-parse",
          title: "2. Parsing",
          body: <p>You run <code>dbt parse</code> and it completes successfully.</p>,
          check: {
            prompt: "What can you safely conclude?",
            options: [
              "Every model exists in Snowflake",
              "Every data test passes",
              "dbt understood the project structure and wrote its manifest",
              "The production target is healthy",
            ],
            answer: 2,
            explain:
              "Parse validates project understanding. It does not materialise models or execute their data tests.",
            affirm: "parse proves project understanding, not warehouse results.",
          },
        },
        {
          id: "q-compile",
          title: "3. Compilation",
          body: <p>A model contains several nested macros and the generated relation name looks wrong.</p>,
          check: {
            prompt: "Which artifact is most directly useful?",
            options: ["run_results.json", "The rendered SQL under target/compiled", ".env", "packages.yml"],
            answer: 1,
            explain:
              "Compiled output shows the actual SQL and resolved relation names produced by the templates.",
            affirm: "compiled SQL is the truth after templating.",
          },
        },
        {
          id: "q-run-build",
          title: "4. Command boundaries",
          body: <p>You want to recreate one model and immediately run its selected tests.</p>,
          check: {
            prompt: "Which is the strongest direct command?",
            options: ["dbt parse -s my_model", "dbt run -s my_model", "dbt build -s my_model", "dbt ls -s my_model"],
            answer: 2,
            explain:
              "build processes the selected model and its indirectly selected tests in DAG order. run only materialises the model.",
            affirm: "build combines selected resource execution in DAG order.",
          },
        },
        {
          id: "q-build-scope",
          title: "5. Build scope",
          body: <p>The project contains many seeds and snapshots. You run <code>dbt build -s my_model</code>.</p>,
          check: {
            prompt: "What happens to unrelated seeds and snapshots?",
            options: [
              "They all run because build always means the whole project",
              "They are not included unless the selector selects them",
              "Seeds run but snapshots never can",
              "Snapshots run but seeds never can",
            ],
            answer: 1,
            explain:
              "build can execute selected models, tests, seeds and snapshots, but the selector determines which resources are in scope.",
            affirm: "build capabilities are broad; selection scope remains precise.",
          },
        },
        {
          id: "q-plus",
          title: "6. Graph selection",
          body: <p>You need a model and everything it depends on.</p>,
          check: {
            prompt: "Which selector expresses that?",
            options: ["my_model+", "+my_model", "-my_model", "@my_model+"],
            answer: 1,
            explain:
              "+ before the node selects its ancestors. A trailing + selects descendants.",
            affirm: "prefix + walks upstream; suffix + walks downstream.",
          },
        },
        {
          id: "q-sets",
          title: "7. Set selection",
          body: <p>You need models that are both tagged daily and located under the reporting path.</p>,
          check: {
            prompt: "Which expression is correct?",
            options: [
              "tag:daily path:models/reporting",
              "tag:daily,path:models/reporting",
              "tag:daily --exclude path:models/reporting",
              "+tag:daily+",
            ],
            answer: 1,
            explain:
              "A comma intersects selectors. A space forms a union, selecting resources that match either side.",
            affirm: "comma means both; space means either.",
          },
        },
        {
          id: "q-show",
          title: "8. Preview",
          body: <p>You want to inspect ten rows from a model query without replacing its relation.</p>,
          check: {
            prompt: "Which command fits?",
            options: [
              "dbt show -s my_model --limit 10",
              "dbt run -s my_model --limit 10",
              "dbt parse -s my_model --limit 10",
              "dbt test -s my_model --limit 10",
            ],
            answer: 0,
            explain:
              "show compiles and queries the node, returning a limited preview without materialising the model.",
            affirm: "show previews rows without replacing the relation.",
          },
        },
        {
          id: "finish",
          title: "You can predict dbt",
          body: (
            <>
              <p>
                You now have the machinery the practical course assumes: project and
                profile, parse and compile, artifacts, command verbs, selectors and a
                disciplined local loop.
              </p>
              <p>
                Next, <strong>Your first PR</strong> turns this into muscle memory on a
                real model: choose a source, write SQL and YAML, build the right slice,
                open the PR and watch the same checks run in CI.
              </p>
              <Callout kind="info" title="The handbook is for recall">
                <p>
                  You are not expected to retain every selector. The handbook and
                  command reference remain available when you need exact syntax. This
                  course gives you the mental model to interpret that reference safely.
                </p>
              </Callout>
            </>
          ),
        },
      ],
    },
  ],
};
