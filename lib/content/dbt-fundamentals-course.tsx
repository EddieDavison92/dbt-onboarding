import type { Course } from "@/lib/course-types";
import { Callout } from "@/components/Callout";
import { CodeBlock } from "@/components/CodeBlock";
import { TryIt } from "@/components/TryIt";
import { DbtExecutionFlow } from "@/components/DbtExecutionFlow";
import { ModelJourney } from "@/components/ModelJourney";
import { CommandLab } from "@/components/CommandLab";
import { ProjectFilesMap } from "@/components/ProjectFilesMap";
import { SelectorPlayground } from "@/components/SelectorPlayground";

export const DBT_FUNDAMENTALS_COURSE: Course = {
  slug: "dbt-fundamentals",
  title: "dbt fundamentals",
  tagline: "See what dbt will do before you ask it to do it",
  audience:
    "For SQL analysts who have completed Git essentials (or already use git). Everything runs in a simulation, so you do not need Snowflake access yet. Take this before Your first PR.",
  hours: "~1 hr 40 mins",
  accent: "var(--layer-modelling)",
  lessons: [
    {
      slug: "one-model-one-result",
      title: "One model, one result",
      blurb: "Turn a SELECT file into a Snowflake view or table",
      minutes: 12,
      steps: [
        {
          id: "build-it",
          body: (
            <>
              <p>
                Start with the smallest useful idea: a dbt model is a SQL file with a
                <code>SELECT</code> statement. Press <strong>Build it</strong>.
              </p>
              <ModelJourney />
              <p>
                You describe the rows. dbt adds the <code>CREATE VIEW</code> or
                <code>CREATE TABLE</code>, chooses the right location, and sends the
                finished SQL to Snowflake.
              </p>
            </>
          ),
        },
        {
          id: "ref",
          title: "ref() draws the arrows",
          body: (
            <>
              <CodeBlock
                lang="sql"
                code={`
select person_id, postcode
from {{ ref('raw_people') }}
`}
              />
              <p>
                <code>ref(&apos;raw_people&apos;)</code> means “use the result built by
                <code>raw_people.sql</code>”. It also draws an arrow between the two
                models, so dbt knows which one comes first.
              </p>
              <div className="my-6 flex flex-col items-center justify-center gap-2 sm:flex-row">
                <code>raw_people</code>
                <span className="font-mono text-flame">→</span>
                <code>stg_people</code>
                <span className="font-mono text-flame">→</span>
                <code>dim_people</code>
              </div>
              <p>
                That chain is part of the DAG: dbt&apos;s map of what depends on what.
                You do not schedule the order by hand.
              </p>
            </>
          ),
          check: {
            prompt: "What does ref('raw_people') give dbt besides a table name?",
            options: [
              "A dependency arrow, so dbt knows the build order",
              "A copy of every row",
              "A test for duplicates",
              "Permission to change production",
            ],
            answer: 0,
            explain:
              "ref() resolves the relation name and records the dependency. That is how dbt builds the DAG and orders work.",
            affirm: "ref() names the relation and draws the dependency.",
          },
        },
        {
          id: "repeatable",
          title: "The same file works in dev and production",
          body: (
            <>
              <p>
                You do not hardcode a development or production table name. dbt
                resolves <code>ref()</code> for the environment doing the work.
              </p>
              <CodeBlock
                lang="text"
                code={`
your SQL:     {{ ref('raw_people') }}
development: DEV__MODELLING.DBT_RAW.RAW_PEOPLE
production:  MODELLING.DBT_RAW.RAW_PEOPLE
`}
              />
              <p>
                Same model file, different safe destination. The shared project
                configuration handles the difference.
              </p>
            </>
          ),
        },
      ],
    },
    {
      slug: "inside-a-command",
      title: "Inside a dbt command",
      blurb: "Parse the project, compile the SQL, then do the work",
      minutes: 14,
      steps: [
        {
          id: "three-moves",
          body: (
            <>
              <p>
                Most dbt commands are built from three moves. Click each one.
              </p>
              <DbtExecutionFlow />
              <p>
                The important split is simple: parsing understands the project;
                compiling produces plain SQL; execution queries Snowflake or creates
                something there.
              </p>
            </>
          ),
        },
        {
          id: "parse",
          title: "parse: can dbt understand the project?",
          body: (
            <TryIt
              stages={[
                {
                  cmd: "dbt parse",
                  out: `Parsing project 'wnl_analytics'
Found models, tests, sources and snapshots
Wrote project manifest
Completed successfully`,
                },
              ]}
              done="dbt understood the files and their links. It did not build a model."
            />
          ),
        },
        {
          id: "compile",
          title: "compile: what SQL did dbt produce?",
          body: (
            <>
              <TryIt
                stages={[
                  {
                    cmd: "dbt compile -s stg_people",
                    out: `Compiled stg_people

select person_id, postcode
from DEV__MODELLING.DBT_RAW.RAW_PEOPLE`,
                  },
                ]}
                done="ref() has become a real Snowflake relation. Nothing was created."
              />
              <p>
                Compile is your window into dbt&apos;s work. If a macro or
                <code>ref()</code> surprises you, look at the SQL it produced.
              </p>
            </>
          ),
          check: {
            prompt: "Which command shows the rendered SQL without building the model?",
            options: ["dbt build", "dbt compile", "dbt test", "dbt debug"],
            answer: 1,
            explain: "compile turns dbt templates into plain SQL without materialising the model.",
            affirm: "compile reveals the SQL dbt generated.",
          },
        },
      ],
    },
    {
      slug: "choose-the-command",
      title: "Choose the command",
      blurb: "Match the question to the smallest useful command",
      minutes: 20,
      steps: [
        {
          id: "command-lab",
          body: (
            <>
              <p>
                Do not memorise a table yet. Work through these five situations and
                choose the command that answers each one.
              </p>
              <CommandLab />
            </>
          ),
        },
        {
          id: "run-build-test",
          title: "The three that sound alike",
          body: (
            <>
              <div className="my-6 grid gap-3 sm:grid-cols-3">
                {[
                  ["dbt run", "Create the selected model."],
                  ["dbt test", "Test a relation that already exists."],
                  ["dbt build", "Create selected resources and run their selected tests in order."],
                ].map(([command, description]) => (
                  <div key={command} className="rounded-xl border-2 border-line bg-paper p-4">
                    <code className="!whitespace-normal">{command}</code>
                    <p className="!mb-0 !mt-2 text-sm">{description}</p>
                  </div>
                ))}
              </div>
              <p>
                For everyday model work, <code>dbt build -s my_model</code> is usually
                the best check: create it, then test it.
              </p>
            </>
          ),
        },
        {
          id: "build-output",
          title: "Read the shape of the output",
          body: (
            <TryIt
              stages={[
                {
                  cmd: "dbt build -s stg_people",
                  out: `1 of 4 OK created view STG_PEOPLE
2 of 4 PASS not_null_stg_people_person_id
3 of 4 PASS unique_stg_people_person_id
4 of 4 PASS accepted_values_stg_people_status

PASS=4 WARN=0 ERROR=0 SKIP=0`,
                },
              ]}
              done="One model was created and three tests passed."
            />
          ),
          check: {
            prompt: "dbt run -s stg_people is green. What has it proved?",
            options: [
              "The model was created, but its data tests may not have run",
              "The model and every downstream model passed",
              "The whole project is production-ready",
              "No source data can be null",
            ],
            answer: 0,
            explain: "run creates selected models. build adds the selected tests.",
            affirm: "run creates; build creates and tests.",
          },
        },
      ],
    },
    {
      slug: "choose-what-runs",
      title: "Choose what runs",
      blurb: "Select one model, its parents, or its children",
      minutes: 18,
      steps: [
        {
          id: "selector-first",
          body: (
            <>
              <p>
                A command has two parts. The command says <em>what to do</em>; the
                selector says <em>which nodes to do it to</em>.
              </p>
              <CodeBlock lang="bash" code={`dbt build -s +int_current_waits`} />
              <p>
                Here, <code>build</code> is the action. <code>+int_current_waits</code>{" "}
                is the selection.
              </p>
            </>
          ),
        },
        {
          id: "plus",
          title: "Move the + and watch the graph",
          body: <SelectorPlayground />,
        },
        {
          id: "exclude",
          title: "To leave something out, say exclude",
          body: (
            <>
              <CodeBlock
                lang="bash"
                code={`
dbt build -s int_current_waits+ --exclude weekly_waits
`}
              />
              <p>
                There is no matching bare <code>-</code> operator. Use
                <code>--exclude</code> so the subtraction is clear.
              </p>
            </>
          ),
        },
        {
          id: "look-before-run",
          title: "Use ls before a broad build",
          body: (
            <>
              <TryIt
                stages={[
                  {
                    cmd: "dbt ls -s +int_current_waits",
                    out: `source:wl.open_pathways
raw_wl_open_pathways
stg_wl_open_pathways
int_current_waits`,
                  },
                ]}
                done="You saw the selection without running any of it."
              />
              <p>
                If a selector is unfamiliar, replace <code>build</code> with
                <code>ls</code> first. Then there is nothing to guess.
              </p>
            </>
          ),
          check: {
            prompt: "Which selector means a model and everything upstream of it?",
            options: ["my_model+", "+my_model", "-my_model", "my_model --up"],
            answer: 1,
            explain: "A plus before the name walks upstream. A plus after it walks downstream.",
            affirm: "prefix + goes upstream; suffix + goes downstream.",
          },
        },
      ],
    },
    {
      slug: "four-files-four-jobs",
      title: "Four files, four jobs",
      blurb: "Know what is shared, local and generated in this project",
      minutes: 14,
      steps: [
        {
          id: "map",
          body: (
            <>
              <p>
                These names appear around dbt. You only need one job for each. Click
                through the map.
              </p>
              <ProjectFilesMap />
            </>
          ),
        },
        {
          id: "profile-truth",
          title: "profiles.yml is shared here",
          body: (
            <>
              <p>
                In <strong>dbt-analytics</strong>, <code>profiles.yml</code> is committed
                to git. That is safe because it contains the shape of each connection,
                not the secrets themselves.
              </p>
              <CodeBlock
                lang="yaml"
                title="profiles.yml (simplified from this project)"
                code={`
wnl_analytics:
  target: dev
  outputs:
    dev:
      type: snowflake
      account: "{{ env_var('SNOWFLAKE_ACCOUNT') }}"
      user: "{{ env_var('SNOWFLAKE_USER') }}"
      database: MODELLING
      schema: DBT_DEV
`}
              />
              <p>
                <code>target: dev</code> chooses the default named connection. Your
                local <code>.env</code> supplies the values inside <code>env_var()</code>.
              </p>
            </>
          ),
        },
        {
          id: "two-targets",
          title: "One awkward word: target",
          body: (
            <>
              <div className="my-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border-2 border-layer-staging bg-layer-staging/10 p-4">
                  <code>target: dev</code>
                  <p className="!mb-0 !mt-2 text-sm">A named Snowflake connection destination.</p>
                </div>
                <div className="rounded-xl border-2 border-layer-raw bg-paper-warm p-4">
                  <code>target/</code>
                  <p className="!mb-0 !mt-2 text-sm">A generated folder on your machine.</p>
                </div>
              </div>
              <p>
                Same word, different jobs. The slash is the useful clue when someone
                means the folder.
              </p>
            </>
          ),
          check: {
            prompt: "Where do the real account and authentication values live for local work?",
            options: ["dbt_project.yml", "The committed profiles.yml", "Your ignored .env file", "target/"],
            answer: 2,
            explain:
              "profiles.yml is shared and reads environment variables. The local .env file supplies the real values and stays out of git.",
            affirm: "shared profile shape; local secret values.",
          },
        },
      ],
    },
    {
      slug: "daily-loop",
      title: "Your daily loop",
      blurb: "Move from a quick look to a confident build",
      minutes: 12,
      steps: [
        {
          id: "ladder",
          body: (
            <>
              <p>
                Use the smallest command that proves the next thing. A useful ladder
                for a new model is:
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
                You will not always need all four. The point is to grow confidence in
                steps instead of launching the widest build first.
              </p>
            </>
          ),
        },
        {
          id: "red-output",
          title: "When it goes red",
          body: (
            <>
              <CodeBlock
                lang="text"
                code={`
PASS  stg_people
FAIL  unique_stg_people_person_id
SKIP  dim_people
`}
              />
              <p>
                Read upward to the first failure. Here, <code>dim_people</code> was
                skipped because an upstream test failed. Fix the duplicate-person
                problem first; the skipped model is not a second mystery.
              </p>
            </>
          ),
        },
        {
          id: "handoff",
          title: "Now make it real",
          body: (
            <>
              <p>
                That is enough machinery to start: models and <code>ref()</code>, the
                main commands, selectors, and the four files around your project.
              </p>
              <p>
                <strong>Your first PR</strong> now puts those ideas into practice on the
                real repository. The handbook remains the place for deeper selector
                syntax, artifacts, CI targets and full project configuration.
              </p>
            </>
          ),
        },
      ],
    },
    {
      slug: "fundamentals-check",
      title: "Can you predict dbt?",
      blurb: "Six short situations to confirm the mental model",
      minutes: 12,
      steps: [
        {
          id: "intro",
          body: (
            <p>
              No obscure syntax. For each situation, choose what dbt will do or which
              command gives the smallest useful answer.
            </p>
          ),
        },
        {
          id: "q-ref",
          title: "1. Build order",
          body: <p><code>stg_people</code> contains <code>{"{{ ref('raw_people') }}"}</code>.</p>,
          check: {
            prompt: "What does dbt learn?",
            options: ["stg_people depends on raw_people", "Both models must run together forever", "raw_people is a test", "stg_people belongs in production"],
            answer: 0,
            explain: "ref() records the dependency, so dbt can resolve the relation and order the DAG.",
            affirm: "ref() draws the dependency arrow.",
          },
        },
        {
          id: "q-preview",
          title: "2. Preview",
          body: <p>You want to inspect a few rows without creating the model.</p>,
          check: {
            prompt: "Which command?",
            options: ["dbt show -s my_model", "dbt run -s my_model", "dbt test -s my_model", "dbt debug"],
            answer: 0,
            explain: "show compiles and queries the SELECT, then prints a preview without materialising the model.",
            affirm: "show previews; it does not build.",
          },
        },
        {
          id: "q-build",
          title: "3. Create and test",
          body: <p>You want one model created and its selected tests run.</p>,
          check: {
            prompt: "Which command?",
            options: ["dbt parse -s my_model", "dbt build -s my_model", "dbt ls -s my_model", "dbt compile -s my_model"],
            answer: 1,
            explain: "build executes selected resources and tests in DAG order.",
            affirm: "build is the everyday create-and-test command.",
          },
        },
        {
          id: "q-selector",
          title: "4. Upstream",
          body: <p>You need a model and everything it depends on.</p>,
          check: {
            prompt: "Which selector?",
            options: ["my_model+", "+my_model", "-my_model", "my_model --children"],
            answer: 1,
            explain: "A plus before the name walks upstream; a plus after it walks downstream.",
            affirm: "prefix + means upstream.",
          },
        },
        {
          id: "q-profile",
          title: "5. Shared configuration",
          body: <p>A teammate opens this project&apos;s <code>profiles.yml</code>.</p>,
          check: {
            prompt: "Why is it safe to commit?",
            options: ["It is encrypted", "It contains no connection settings", "Secret values come from environment variables", "Git removes passwords automatically"],
            answer: 2,
            explain: "The shared file defines outputs but reads actual credentials through env_var().",
            affirm: "profiles.yml is shared; secrets are injected locally.",
          },
        },
        {
          id: "q-target",
          title: "6. Generated output",
          body: <p>You want to inspect the SQL dbt compiled on your machine.</p>,
          check: {
            prompt: "Where do you look?",
            options: [".env", "profiles.yml", "target/compiled/", "dbt_project.yml"],
            answer: 2,
            explain: "target/ is dbt's generated local folder; compiled SQL sits beneath target/compiled/.",
            affirm: "target/ holds generated local output.",
          },
        },
        {
          id: "finish",
          title: "Ready for the real repo",
          body: (
            <Callout kind="info" title="Fundamentals complete">
              <p>
                You can now predict the everyday commands and explain their scope.
                That is the foundation the hands-on first-PR course needs.
              </p>
            </Callout>
          ),
        },
      ],
    },
  ],
};
