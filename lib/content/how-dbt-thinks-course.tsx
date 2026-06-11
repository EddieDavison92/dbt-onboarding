import type { Course } from "@/lib/course-types";
import { Callout } from "@/components/Callout";
import { CodeBlock } from "@/components/CodeBlock";
import { Dag } from "@/components/Dag";
import { LayerCake } from "@/components/LayerCake";
import { LayerSorter } from "@/components/LayerSorter";
import { ModelJourney } from "@/components/ModelJourney";
import { ScriptChaos } from "@/components/ScriptChaos";
import { TestProbe } from "@/components/TestProbe";
import { BranchToProd } from "@/components/BranchToProd";

export const HOW_DBT_THINKS_COURSE: Course = {
  slug: "how-dbt-thinks",
  title: "How dbt thinks",
  tagline: "What dbt is and why it exists — in pictures, before you ever run it",
  audience:
    "For SQL analysts who have never used dbt. Nothing to install, nothing to run — short visual chunks with a question at each step. Take it after Git essentials, before Your first PR.",
  hours: "~50 min",
  accent: "var(--layer-modelling)",
  lessons: [
    // ------------------------------------------------------------------
    {
      slug: "the-problem",
      title: "The problem dbt solves",
      blurb: "Why a folder of good SQL still goes wrong",
      minutes: 7,
      steps: [
        {
          id: "chaos",
          body: (
            <>
              <p>
                Every analytics team accumulates SQL: views, scripts, a
                “FINAL_v3” table nobody dares drop. The SQL itself is usually
                fine. The problem sits around it. Try this:
              </p>
              <ScriptChaos />
            </>
          ),
        },
        {
          id: "two-ideas",
          title: "Two ideas fix this",
          body: (
            <>
              <p>
                dbt (data build tool) is built on two ideas working together.
              </p>
              <p>
                First, <strong>one shared codebase</strong>: every
                transformation lives in a single git repository, so there is
                one definition of each concept, a full history of every change,
                and a review step before anything ships. That is why Git
                essentials came first.
              </p>
              <p>
                Second, <strong>every transformation is a SELECT statement</strong>{" "}
                whose dependencies dbt can read. The order of operations is
                derived from the code itself, computed fresh on every run —
                never something a person has to remember.
              </p>
            </>
          ),
          check: {
            prompt: "How does dbt know which order to build things in?",
            options: [
              "It reads the references in each SQL file and derives the order",
              "From a run-order file someone maintains",
              "Alphabetically, by file name",
              "You schedule each model by hand",
            ],
            answer: 0,
            explain:
              "There is no run-order config anywhere. dbt reads the references inside the SQL and works the sequence out itself, every time.",
            affirm: "the order lives in the SQL, and dbt derives it.",
          },
        },
        {
          id: "what-it-is-not",
          title: "What dbt is not",
          body: (
            <>
              <p>
                dbt does not move data into Snowflake — feeds land there
                without it. And it does not query data for dashboards — that
                happens downstream. dbt does exactly one job: it{" "}
                <strong>transforms data already in the warehouse</strong> into
                clean, tested, analysis-ready tables.
              </p>
              <div className="my-6 flex flex-col items-center justify-center gap-2 sm:flex-row">
                <span className="rounded-xl border-2 border-dashed border-line px-4 py-2 text-sm text-ink-faint">
                  feeds land
                </span>
                <span className="font-mono text-flame">→</span>
                <span className="rounded-xl border-2 border-ink bg-flame-soft px-4 py-2 font-display text-sm font-bold">
                  dbt transforms
                </span>
                <span className="font-mono text-flame">→</span>
                <span className="rounded-xl border-2 border-dashed border-line px-4 py-2 text-sm text-ink-faint">
                  dashboards consume
                </span>
              </div>
              <p>
                Your day-to-day barely changes: it is still writing SELECT
                statements against Snowflake. What changes is that your SQL now
                lives somewhere it is ordered, tested, reviewed and rerun
                automatically.
              </p>
            </>
          ),
          check: {
            prompt: "Which of these does dbt itself do?",
            options: [
              "Loads source feeds into Snowflake",
              "Transforms data that is already in Snowflake",
              "Renders the dashboards",
              "All three",
            ],
            answer: 1,
            explain:
              "dbt is the T in ELT. Loading happens before it; dashboards consume what it builds.",
            affirm: "dbt transforms what is already in the warehouse — nothing else.",
          },
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      slug: "a-model-is-a-select",
      title: "A model is a SELECT",
      blurb: "One file, one SELECT — dbt does the rest",
      minutes: 7,
      steps: [
        {
          id: "build-it",
          body: (
            <>
              <p>
                The unit of work in dbt is the <strong>model</strong>: one{" "}
                <code>.sql</code> file containing one SELECT statement. That is
                the whole definition. Press <strong>Build it</strong>.
              </p>
              <ModelJourney />
              <p>
                You describe the rows. dbt adds the <code>CREATE VIEW</code> or{" "}
                <code>CREATE TABLE</code>, picks the right destination, and
                sends the finished SQL to Snowflake.
              </p>
            </>
          ),
        },
        {
          id: "whats-missing",
          title: "Notice what's missing",
          body: (
            <>
              <p>
                No <code>CREATE</code>. No <code>DROP</code>. No database or
                schema names. Everything a worksheet script needs around the
                SELECT, dbt supplies — and because models build as{" "}
                <code>create or replace</code>, rebuilding is always safe. Run
                it again, get the same object again.
              </p>
            </>
          ),
          check: {
            prompt: "A dbt model is…",
            options: [
              "A .sql file containing a single SELECT statement",
              "A .sql file with the CREATE TABLE and INSERT statements",
              "A YAML file defining a table's columns",
              "Any SQL file in the repo",
            ],
            answer: 0,
            explain:
              "One file, one SELECT. dbt generates the surrounding DDL itself, so the model stays a pure description of the rows.",
            affirm: "one file, one SELECT — dbt writes the DDL.",
          },
        },
        {
          id: "two-destinations",
          title: "Same file, two destinations",
          body: (
            <>
              <p>
                You never hardcode where the model builds. The same file lands
                somewhere safe while you develop, and in production after
                review:
              </p>
              <CodeBlock
                lang="text"
                code={`
your SQL:    select person_id, postcode from …
development: DEV__MODELLING.DBT_STAGING.STG_PEOPLE
production:  MODELLING.DBT_STAGING.STG_PEOPLE
`}
              />
              <p>
                Shared project configuration handles the difference. You write
                the SELECT once; dbt decides the destination for whichever
                environment is doing the work.
              </p>
            </>
          ),
          check: {
            prompt: "What changes between your dev build and the production build of a model?",
            options: [
              "The destination it builds into — the SQL file is identical",
              "You maintain a dev copy and a prod copy of the file",
              "The SELECT is rewritten for production",
              "Nothing — dev builds go straight to production",
            ],
            answer: 0,
            explain:
              "One file serves every environment. Configuration, not your SQL, decides where the object is created.",
            affirm: "one file, different safe destinations.",
          },
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      slug: "ref-draws-the-map",
      title: "ref() draws the map",
      blurb: "One function replaces every hardcoded table name",
      minutes: 8,
      steps: [
        {
          id: "ref",
          body: (
            <>
              <p>
                In a worksheet you would write{" "}
                <code>from MODELLING.DBT_STAGING.STG_PEOPLE</code>. In dbt you
                point at the model that builds it:
              </p>
              <CodeBlock
                lang="sql"
                code={`
select person_id, postcode
from {{ ref('raw_people') }}
`}
              />
              <p>
                <code>ref(&apos;raw_people&apos;)</code> means “the table that{" "}
                <code>raw_people.sql</code> builds, wherever that is”. Each
                call does two jobs: it resolves to the right location for your
                environment, and it <strong>records the dependency</strong> —
                your model now officially sits downstream of{" "}
                <code>raw_people</code>.
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
              "ref() resolves the relation name and records the dependency. Collect every arrow and you have the build order.",
            affirm: "ref() names the relation and draws the dependency.",
          },
        },
        {
          id: "dag",
          title: "All the arrows together: the DAG",
          body: (
            <>
              <p>
                From every <code>ref()</code> in the project, dbt assembles one
                map — the <strong>DAG</strong> (directed acyclic graph). This
                is a real slice of ours. Hover over any node:
              </p>
              <Dag />
              <p>
                The DAG is how dbt always builds upstream models first, and how
                anyone can trace what feeds a number — or what breaks if a
                column changes — without reading a single file.
              </p>
            </>
          ),
          check: {
            prompt: "You want to rename a column in a staging model. How do you know what might break?",
            options: [
              "Search every file and hope",
              "Follow the model's downstream arrows in the DAG",
              "Rename it and wait for complaints",
              "You can't know until the nightly build",
            ],
            answer: 1,
            explain:
              "Dependencies are recorded, so they are visible in both directions. Everything downstream of your model is exactly the list of things that could break.",
            affirm: "the DAG shows what depends on your model before you change it.",
          },
        },
        {
          id: "source",
          title: "Where the map starts: source()",
          body: (
            <>
              <p>
                The dotted nodes in the DAG are tables nobody in the project
                builds — the feeds landing in the data lake. They are declared
                once in YAML, then referenced with <code>source()</code>{" "}
                instead of <code>ref()</code>.
              </p>
              <p>
                In this project only the generated raw layer calls{" "}
                <code>source()</code>. Everything you write uses{" "}
                <code>ref()</code> — so if a feed changes, only one layer
                moves.
              </p>
              <Callout kind="smell" title="Spot the smell">
                <p>
                  A hardcoded <code>DATABASE.SCHEMA.TABLE</code> in a model
                  compiles fine — and silently breaks dev/prod separation while
                  hiding the dependency from the map. It will draw a review
                  comment every time. The fix is always <code>ref()</code>.
                </p>
              </Callout>
            </>
          ),
          check: {
            prompt: "Why is hardcoding MODELLING.DBT_STAGING.STG_X in a model a problem?",
            options: [
              "dbt refuses to compile it",
              "It breaks dev/prod separation and hides the dependency from the DAG",
              "Fully-qualified names are slower in Snowflake",
              "It only matters if the table is renamed",
            ],
            answer: 1,
            explain:
              "The danger is that it works: your dev build quietly reads production objects, and the dependency is invisible to lineage and build ordering.",
            affirm: "hardcoded names hide the arrow and pierce dev/prod separation.",
          },
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      slug: "the-layer-cake",
      title: "The layer cake",
      blurb: "Five layers, each with exactly one job",
      minutes: 9,
      steps: [
        {
          id: "why-layers",
          body: (
            <>
              <p>
                Without structure, every script repeats the whole journey from
                raw feed to finished number — so the same column gets cleaned a
                dozen slightly different ways across a dozen scripts.
              </p>
              <p>
                The project fixes this by giving every model exactly one{" "}
                <strong>job</strong>, and stacking the jobs in layers: clean
                once near the bottom, build reusable blocks in the middle,
                assemble finished datasets at the top. Each layer only reads
                from the layers beneath it.
              </p>
            </>
          ),
          check: {
            prompt: "What decides which layer a model belongs in?",
            options: [
              "The job the model is doing",
              "Which data source it touches",
              "How large the result is",
              "Who wrote it",
            ],
            answer: 0,
            explain:
              "Job, not data. Cleaning one table is staging work; joining and deriving is modelling work — whatever the data is about.",
            affirm: "the job picks the layer, not the data.",
          },
        },
        {
          id: "cake",
          title: "Click through the layers",
          body: (
            <>
              <LayerCake />
              <p>
                Two are worth pinning down now. <strong>Staging</strong> cleans
                one source table — no joins, no business logic, ever.{" "}
                <strong>Modelling</strong> is where joins and derivations live,
                and where most analyst work happens.
              </p>
            </>
          ),
          check: {
            prompt: "A staging model needs a join to look up specialty names. What does that tell you?",
            options: [
              "Joins are fine in staging if they're small",
              "The moment it needs a join, it isn't staging work — it belongs in the modelling layer",
              "The join should go in the raw layer instead",
              "Staging models can join but not filter",
            ],
            answer: 1,
            explain:
              "Staging's one job is cleaning a single source table. Wanting a join is the signal you've started a different job — a modelling (int_) model.",
            affirm: "staging never joins — a join means modelling-layer work.",
          },
        },
        {
          id: "sorter",
          title: "Your turn",
          body: (
            <>
              <p>
                Five real model descriptions. Ask “what job is this model
                doing?” and place each one:
              </p>
              <LayerSorter />
              <p>
                One practical payoff before moving on: hundreds of tested
                models already exist in these layers. Most new analysis starts
                by joining two or three of them — not by rebuilding a patient
                spine from raw feeds.
              </p>
            </>
          ),
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      slug: "tests-are-promises",
      title: "Tests are promises",
      blurb: "Assertions that run every night, forever",
      minutes: 7,
      steps: [
        {
          id: "probe",
          body: (
            <>
              <p>
                Next to a model&apos;s SQL sits a small YAML file declaring{" "}
                <strong>tests</strong>: rules the data must obey. Each one
                compiles to a query that hunts for rows breaking the rule. Run
                all three against this table:
              </p>
              <TestProbe />
            </>
          ),
          check: {
            prompt: "A dbt test passes when its query returns…",
            options: [
              "All the rows that satisfy the rule",
              "A single row containing true",
              "Zero rows",
              "The same row count as the model",
            ],
            answer: 2,
            explain:
              "Tests select violations, not successes. An empty result means nothing broke the rule.",
            affirm: "tests hunt for rule-breakers — zero rows means pass.",
          },
        },
        {
          id: "grain",
          title: "The one test that matters most",
          body: (
            <>
              <p>
                Every table answers one question: <strong>one row per
                what?</strong> One row per person? Per person per referral per
                week? That sentence is the table&apos;s <em>grain</em> — and a
                test asserting it catches the classic silent failure: a join
                that fans out and quietly doubles your counts.
              </p>
              <p>
                If the grain is “one row per site per weekday”, neither column
                is unique on its own. The test goes on the{" "}
                <strong>combination</strong>.
              </p>
            </>
          ),
          check: {
            prompt: "Grain: one row per site per weekday. Which test catches a join that duplicates rows?",
            options: [
              "unique on site_code",
              "unique on the combination of site_code and day_of_week",
              "not_null on both columns",
              "A row-count test with a generous range",
            ],
            answer: 1,
            explain:
              "unique on site_code alone fails immediately — each site legitimately has seven rows. Only the combination matches the grain, so only it detects a fan-out.",
            affirm: "test the combination — that is what the grain actually is.",
          },
        },
        {
          id: "always-on",
          title: "Written once, checked forever",
          body: (
            <>
              <p>
                Tests run when a model is built, again on every pull request,
                and again in the nightly production build. So when a feed
                starts sending duplicates six months from now, the test fails
                that night — and the team hears about it before any dashboard
                shows a wrong number.
              </p>
              <p>
                That is the trade dbt offers: write down what you know about
                the data once, and the pipeline checks it every night, forever,
                without you.
              </p>
            </>
          ),
          check: {
            prompt: "Six months on, a feed starts sending duplicate rows. Who finds out first, and how?",
            options: [
              "A dashboard user notices odd numbers",
              "The nightly build — the grain test fails before any output is consumed",
              "Nobody, unless someone re-checks the model",
              "Snowflake blocks duplicates automatically",
            ],
            answer: 1,
            explain:
              "A test is your understanding of the data turned into an assertion that runs nightly. It guards everyone downstream of the model — including future you.",
            affirm: "tests raise the alarm before dashboards go wrong.",
          },
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      slug: "branch-to-production",
      title: "From branch to production",
      blurb: "Why nothing you do locally can break anything",
      minutes: 6,
      steps: [
        {
          id: "path",
          body: (
            <>
              <p>
                Put the pieces together: git from the first course, models and
                tests from this one. A change takes exactly one path to
                production. Click each stage:
              </p>
              <BranchToProd />
            </>
          ),
          check: {
            prompt: "What is the only way a change reaches production?",
            options: [
              "Running dbt build from your machine",
              "A pull request that passes its checks and is merged to main",
              "Asking an administrator to copy it across",
              "Waiting — dev schemas sync to production nightly",
            ],
            answer: 1,
            explain:
              "Your local commands only ever touch your own dev schema. Production is written by the deployment that follows a merged, reviewed PR — there is no other door.",
            affirm: "production is only reachable through a merged PR.",
          },
        },
        {
          id: "freedom",
          title: "Which means: you can't break it",
          body: (
            <>
              <p>
                This is the most useful thing to internalise before touching
                the real project. While you develop, everything you build lands
                in a sandbox schema keyed to you. Build nonsense, break your
                own tables, rebuild from scratch — nobody else can tell.
              </p>
              <p>
                Between your sandbox and production stand the compile check,
                the test suite, an automated reviewer and a human one. The
                safety comes from the path, not from you being careful.
              </p>
            </>
          ),
        },
        {
          id: "handoff",
          title: "What comes next",
          body: (
            <>
              <p>
                You now have the mental model: models are SELECTs,{" "}
                <code>ref()</code> draws the map, layers give each model one
                job, tests guard the data nightly, and production sits behind a
                merged PR.
              </p>
              <p>
                <strong>Your first PR</strong> makes it real: you will set up
                your machine, learn the actual dbt commands at the moment you
                need them, and take a model of your own down that whole path.
                The handbook stays available for depth when you want it.
              </p>
            </>
          ),
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      slug: "fundamentals-check",
      title: "Can you predict dbt?",
      blurb: "Six situations to confirm the mental model",
      minutes: 6,
      steps: [
        {
          id: "intro",
          body: (
            <p>
              No syntax, no commands — just the ideas. For each situation,
              predict what dbt does.
            </p>
          ),
        },
        {
          id: "q-model",
          title: "1. The model",
          body: <p>A colleague opens <code>stg_people.sql</code> for the first time.</p>,
          check: {
            prompt: "What do they find inside?",
            options: [
              "One SELECT statement — nothing else",
              "CREATE TABLE and INSERT statements",
              "A YAML description of the columns",
              "A list of models to run, in order",
            ],
            answer: 0,
            explain: "A model is a single SELECT. The DDL around it is dbt's job; the YAML lives in a separate file beside it.",
            affirm: "a model is one SELECT.",
          },
        },
        {
          id: "q-ref",
          title: "2. The arrow",
          body: <p><code>dim_people.sql</code> contains <code>{"{{ ref('stg_people') }}"}</code>.</p>,
          check: {
            prompt: "What does dbt learn from that?",
            options: [
              "dim_people depends on stg_people, so stg_people builds first",
              "Both models must always run together",
              "stg_people is a source feed",
              "dim_people belongs in the staging layer",
            ],
            answer: 0,
            explain: "ref() records the dependency. The build order falls out of all the arrows together.",
            affirm: "ref() draws the dependency arrow.",
          },
        },
        {
          id: "q-layer",
          title: "3. The layer",
          body: <p>A model joins GP observations to derive a reusable smoking-status block.</p>,
          check: {
            prompt: "Which layer does it belong in?",
            options: [
              "Staging — it reads staged data",
              "Modelling — joining and deriving reusable blocks is its job",
              "Raw — it's close to the source",
              "Reporting — analysts will use it",
            ],
            answer: 1,
            explain: "The job picks the layer. Joins and derivations are modelling work; staging never joins; reporting assembles finished datasets that would ref() this block.",
            affirm: "the job picks the layer.",
          },
        },
        {
          id: "q-test",
          title: "4. The test",
          body: <p>A <code>unique</code> test on <code>person_id</code> compiles and runs its query.</p>,
          check: {
            prompt: "The query returns 3 rows. What happened?",
            options: [
              "Pass — it found 3 valid people",
              "Fail — it found 3 values breaking the uniqueness rule",
              "Pass — fewer than 10 rows counts as passing",
              "Nothing — tests don't query real data",
            ],
            answer: 1,
            explain: "Tests select violations. Three rows back means three duplicated values; only an empty result is a pass.",
            affirm: "rows returned = rule broken.",
          },
        },
        {
          id: "q-dev",
          title: "5. The sandbox",
          body: <p>While developing, you build a model with a bad join and ruin its output.</p>,
          check: {
            prompt: "Who is affected?",
            options: [
              "Only you — it built into your own dev schema",
              "Everyone — models share one schema",
              "Dashboard users, from tonight",
              "Nobody, because dbt refused to build it",
            ],
            answer: 0,
            explain: "Local builds land in a sandbox keyed to you. Production sits behind a reviewed, merged PR — your experiments can't reach it.",
            affirm: "local builds touch only your sandbox.",
          },
        },
        {
          id: "q-change",
          title: "6. The change",
          body: <p>Your PR is approved, checks are green, and you merge it to main.</p>,
          check: {
            prompt: "What happens to production?",
            options: [
              "The deployment builds your change into production, and the nightly build maintains it from then on",
              "Nothing until you run dbt build from your machine",
              "An administrator copies your tables across manually",
              "Production updates only at the end of the month",
            ],
            answer: 0,
            explain: "Merge is the moment a change becomes real: deployment builds it, and the nightly run — models and tests — keeps it fresh without you.",
            affirm: "merge deploys; the nightly build takes it from there.",
          },
        },
        {
          id: "finish",
          title: "Ready for the real repo",
          body: (
            <Callout kind="info" title="Primer complete">
              <p>
                You can predict what dbt will do and why the project is shaped
                the way it is. Next: <strong>Your first PR</strong>, where you
                set up your machine and do all of this for real.
              </p>
            </Callout>
          ),
        },
      ],
    },
  ],
};
