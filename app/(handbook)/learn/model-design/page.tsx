import type { Metadata } from "next";
import { LessonShell } from "@/components/LessonShell";
import { CodeBlock } from "@/components/CodeBlock";
import { Callout } from "@/components/Callout";
import { Quiz } from "@/components/Quiz";
import { ModelDesignCompare } from "@/components/ModelDesignCompare";

export const metadata: Metadata = { title: "Designing models" };

export default function Page() {
  return (
    <LessonShell
      section="learn"
      slug="model-design"
      kicker="Learn 03"
      title="Designing models"
      lede="A model can be wide and easy to use without becoming the only place where every concept is defined. Good design separates ownership of meaning from presentation of data."
      minutes={14}
    >
      <h2>The SQL can work and the design can still matter</h2>
      <p>
        In a worksheet, one large query is often the quickest route to a result. It has
        one author, one immediate purpose and usually one output. If a definition is
        buried halfway through it, the person who wrote it still knows where to look.
      </p>
      <p>
        A shared dbt project is different. A model may be queried by analysts, joined
        into several products and changed years later by someone who has never seen its
        source system. The design has to make two things easy:
      </p>
      <ul>
        <li>
          <strong>Using the data</strong> without repeatedly reconstructing common joins.
        </li>
        <li>
          <strong>Changing one definition</strong> without first understanding several
          unrelated definitions around it.
        </li>
      </ul>
      <p>
        Those goals are compatible. Wide, denormalised models are often excellent
        analytical products. The important distinction is between <em>defining</em> a
        concept and <em>delivering</em> it.
      </p>

      <Callout kind="tip" title="The central idea">
        <p>
          <strong>Define concepts independently; compose them generously.</strong> A wide
          model may present many established concepts together without owning all of
          their business logic.
        </p>
      </Callout>

      <ModelDesignCompare />

      <h2>Begin with what one row means</h2>
      <p>
        Every model has a <strong>grain</strong>: the thing represented by one row. It
        might be one row per person, clinical observation, appointment, person and
        condition, or provider and month.
      </p>
      <p>
        Grain is the model&apos;s most important contract. It determines which columns
        belong, which joins are safe and which uniqueness test should pass. Before
        designing the SQL, complete this sentence:
      </p>
      <Callout kind="info" title="Name the grain">
        <p>This model contains one row for each…</p>
      </Callout>
      <p>
        A real example is <code>fct_person_diabetes_8_care_processes</code>. It contains
        one row per person on the diabetes register, with the latest date and completion
        flag for HbA1c, blood pressure, cholesterol, creatinine, urine ACR, foot checks,
        BMI and smoking status. It is wide, but its row meaning is unambiguous.
      </p>
      <p>
        It stays at that grain because it joins to models such as{" "}
        <code>int_hba1c_latest</code>{" "}and <code>int_blood_pressure_latest</code>,
        which already contain one selected record per person. If it joined directly to
        every raw HbA1c and blood-pressure observation, one person could become dozens
        of rows. The SQL would run successfully while every count downstream became
        unreliable.
      </p>
      <p>
        Once the grain is explicit, it can be documented and tested. Without it, a
        duplicated row might be a source error, a legitimate child record or an unsafe
        join — there is no contract against which to decide.
      </p>

      <h2>Definition and presentation are separate decisions</h2>
      <p>
        It is tempting to think that giving a concept a clear home means forcing every
        analyst to join a highly normalised set of tables. It does not.
      </p>
      <p>
        <code>dim_person_demographics</code>{" "}is a good example from this project. It
        gives analysts one current row per person containing age, gender, ethnicity,
        language, practice, PCN, registered and resident geography, and deprivation.
        That denormalisation is deliberate: these attributes are routinely needed
        together.
      </p>
      <CodeBlock
        lang="text"
        title="dim_person_demographics · one useful row per person"
        code={[
          "person identifiers and status",
          "+ age and age bands",
          "+ gender, ethnicity and language",
          "+ practice, PCN and ICB",
          "+ resident and registered geography",
          "+ IMD",
          "+ ESP 2013 weights",
        ].join("\n")}
      />
      <p>
        Asking each dashboard author to reconstruct that person row would be slower for
        them and would create competing versions of current practice, ethnicity and
        geography. The reporting model provides a convenient contract instead.
      </p>
      <p>
        That does not mean every attribute must originate there. The model selects the
        current period from <code>dim_person_demographics_historical</code>, calculates
        current age through a shared macro, and joins the published ESP 2013 weights.
        It owns the useful current-person presentation while reusing definitions which
        have value elsewhere.
      </p>

      <Callout kind="info" title="This is not a rule to build a star schema">
        <p>
          The project does not need a dimension for every code or a physical model for
          every derived column. Separate logic when its meaning, reuse or reason to
          change earns a boundary. Combine the resulting data in whatever shape is most
          useful to consume.
        </p>
      </Callout>

      <h2>Put boundaries around reasons to change</h2>
      <p>
        “One model, one job” is easily misunderstood. It does not mean one CTE, one
        calculation or one concept per table. A model may perform many transformations
        when they contribute to one coherent responsibility.
      </p>
      <p>A better question is:</p>
      <Callout kind="tip" title="A useful design test">
        <p>
          Do these transformations describe the same thing, and would they normally
          change for the same reason?
        </p>
      </Callout>
      <p>
        Return to the diabetes care-process model. Diabetes-register membership, the
        latest HbA1c, the latest blood pressure and a valid foot examination all affect
        the final output. But their definitions have different reasons to change:
      </p>
      <table>
        <thead>
          <tr>
            <th>Definition</th>
            <th>Why it might change</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Diabetes register</td>
            <td>The QOF register definition or age criteria change</td>
          </tr>
          <tr>
            <td>Latest HbA1c</td>
            <td>The observation selection or unit handling changes</td>
          </tr>
          <tr>
            <td>Latest blood pressure</td>
            <td>The valid reading or paired-result logic changes</td>
          </tr>
          <tr>
            <td>Foot examination</td>
            <td>Codes for checked, amputated, declined or unsuitable feet change</td>
          </tr>
          <tr>
            <td>Eight-process measure</td>
            <td>The completion window or required set of processes changes</td>
          </tr>
        </tbody>
      </table>
      <p>
        In the project, the latest clinical results and the diabetes register are
        established before the care-process model composes them. A change to blood
        pressure selection can therefore be reviewed and tested without reopening the
        foot-check definition. The final model remains wide because that is useful; the
        definitions remain independently owned because that is maintainable.
      </p>
      <p>
        A boundary lets one definition be understood and tested without loading the
        whole pipeline into your head. It becomes particularly valuable when the logic:
      </p>
      <ul>
        <li>is reused by more than one output;</li>
        <li>has meaningful complexity or its own grain;</li>
        <li>changes independently from the surrounding model;</li>
        <li>has a different geographical, contractual or legal scope;</li>
        <li>needs its own tests, provenance or named owner.</li>
      </ul>
      <p>
        A simple flag derived from two columns already in the model probably does not
        deserve a separate model. Selecting the latest valid blood pressure — useful in
        registers, targets and programmes — probably does. The goal is not the greatest
        possible number of models; it is clear ownership of important meaning.
      </p>

      <h2>Reuse protects meaning, not just developer time</h2>
      <p>
        <code>dim_nhs_health_check_eligibility</code>{" "}does not reconstruct diabetes,
        coronary heart disease, stroke, CKD, atrial fibrillation, heart failure and
        familial hypercholesterolaemia from clinical records. It references the existing
        register models and uses their results as exclusions.
      </p>
      <p>
        This means “has diabetes” has the same meaning in NHS Health Check eligibility
        as it does in other products. When the QOF diabetes definition changes, the
        eligibility model receives the corrected result through its dependency rather
        than needing a second clinical rewrite.
      </p>
      <Callout kind="smell" title="Hypothetical: seven private definitions">
        <p>
          Imagine that the eligibility model instead contained seven lists of clinical
          codes and seven independent diagnosis rules. It might produce the right answer
          today, but those conditions could drift away from the project&apos;s disease
          registers. Reuse prevents that semantic drift; saving SQL is the secondary
          benefit.
        </p>
      </Callout>
      <p>
        Before building something new, search for the concept and grain you need. An
        existing model may be too narrow; widening it can be the right change. A
        parallel definition is justified where the meaning or grain is genuinely
        different, not simply because the existing model needs to become more useful.
      </p>

      <h2>Shared meaning comes before local policy</h2>
      <p>
        Some definitions describe the data across the whole project. Others express a
        policy for one geography, contract or consumer. Those are both legitimate, but
        they should not be confused.
      </p>
      <p>
        The reporting layer&apos;s person demographics are useful to both direct-care
        and secondary-use products. The published layer can then apply the legal basis
        and population rules of a particular use. For example, secondary-use outputs
        apply national opt-out filtering without removing those people from the shared
        demographics model.
      </p>
      <p>
        A hypothetical borough enhanced-service classification should work the same way.
        It may enrich people in that borough for the relevant product, but it should not
        redefine the project-wide person record or label everyone elsewhere as
        “unmatched”. For them, the local policy is not applicable.
      </p>
      <CodeBlock
        lang="text"
        title="meaning becomes more specific downstream"
        code={[
          "shared source record",
          "    → shared domain meaning",
          "        → local classification or policy",
          "            → consumer-specific published output",
        ].join("\n")}
      />
      <p>
        This is why reporting and published outputs should generally define fewer new
        shared concepts. Their role is to compose established meaning into a useful
        shape, then apply an explicit scope, population or aggregation for the intended
        consumer.
      </p>

      <h2>Keep decisions easy to follow</h2>
      <p>
        Seeds and reference tables are good homes for simple facts and parameters: codes,
        mappings, effective dates, externally published thresholds and coefficients.
        These values can change while the shape of the calculation remains stable. The
        ESP 2013 weights joined by <code>dim_person_demographics</code>{" "}are a good
        example: the weights are reference data, while the SQL plainly shows how they
        are joined to a person&apos;s age band.
      </p>
      <p>
        More care is needed when data begins to describe how conditional logic should be
        executed: matcher types, inclusion and exclusion modes, precedence, nested
        expressions and exceptions. Understanding one result may then require someone
        to mentally combine the seed, a generic evaluator and additional SQL around it.
      </p>
      <p>
        Logic represented as data is appropriate when the underlying specification
        genuinely arrives that way. If implementation guidance supplies coefficients
        and time periods, storing those parameters is natural. For a small collection
        of locally invented conditional rules, ordinary SQL may be much easier to read
        and test.
      </p>

      <Callout kind="smell" title="Hypothetical: a seed becomes a programming language">
        <p>
          A seed starts with provider codes and dates, then gains columns for matcher
          type, inclusion or exclusion, precedence and expression groups. The data no
          longer explains itself: a reviewer must also understand the generic evaluator
          before they can follow one rule. A plainly named SQL model may be the simpler
          design.
        </p>
      </Callout>

      <Callout kind="tip" title="Choose the clearest representation">
        <p>
          Store simple inputs and externally defined parameters as data. Express
          conditional behaviour in the form that makes applicability, precedence and
          exceptions easiest to understand.
        </p>
      </Callout>

      <h2>Preserve the reason as well as the result</h2>
      <p>
        Derived values are safer to reuse when someone can see how they were reached.
        <code>fct_person_diabetes_register</code>{" "}does not expose only a final
        <code>is_on_register</code>{" "}result. It retains diagnosis and resolution
        dates, age, diabetes type, the criteria flags and the clinical concept codes
        which contributed to the decision.
      </p>
      <p>
        A hypothetical alternative might expose only a status code such as{" "}
        <code>DM1</code>, requiring the consumer to know that it combines age,
        diagnosis, resolution and type precedence. Explicit dates and flags answer both
        “what was decided?” and “why?”. That makes clinical validation and future
        changes much easier.
      </p>

      <h2>Putting it together</h2>
      <p>
        The diabetes care-process model brings the ideas together. Its output is a wide,
        convenient row answering a useful analytical question: which of the eight care
        processes has each person with diabetes completed in the last 12 months?
      </p>
      <p>Its simplified lineage looks like this:</p>
      <CodeBlock
        lang="text"
        title="real project pattern · definitions owned upstream, convenience delivered downstream"
        code={[
          "fct_person_diabetes_register",
          "int_hba1c_latest",
          "int_blood_pressure_latest",
          "int_cholesterol_latest",
          "int_creatinine_latest",
          "int_urine_acr_latest",
          "int_foot_examination_latest",
          "int_bmi_latest",
          "int_smoking_status_latest",
          "             │",
          "             ▼",
          "fct_person_diabetes_8_care_processes",
        ].join("\n")}
      />
      <p>
        The final model is not a star schema and it is not narrow. It deliberately
        composes nine established inputs into something straightforward to analyse. Its
        value comes from the division of responsibility:
      </p>
      <ul>
        <li>the diabetes register owns who belongs in the population;</li>
        <li>each latest-result model owns selection of its clinical observation;</li>
        <li>the care-process model owns the 12-month completion question;</li>
        <li>analysts receive all dates and flags together at one row per person.</li>
      </ul>
      <Callout kind="smell" title="Hypothetical: one dashboard model starts from raw records">
        <p>
          Imagine <code>fct_diabetes_dashboard</code>{" "}identified diabetes diagnoses,
          chose the latest result for every care process, interpreted foot checks and
          calculated completion inside one file. It might still return one row per
          person, but each reusable clinical definition would be trapped inside that
          dashboard&apos;s pipeline. A second product would have to copy or rediscover it.
        </p>
      </Callout>

      <h2>Four questions to carry into the project</h2>
      <ol>
        <li>
          <strong>What does one row mean?</strong>{" "}Name and test the grain before
          adding logic.
        </li>
        <li>
          <strong>Where is each important concept defined?</strong>{" "}A wide model can
          deliver many concepts without becoming their only definition.
        </li>
        <li>
          <strong>What would cause this logic to change?</strong>{" "}Use boundaries to
          keep independent changes understandable and testable.
        </li>
        <li>
          <strong>Who does this definition apply to?</strong>{" "}Keep shared meaning
          canonical and local policy explicitly scoped.
        </li>
      </ol>
      <p>
        There is rarely one perfect DAG. The aim is a project in which definitions are
        easy to find, analytical data is easy to consume and a future change has a
        limited, understandable impact.
      </p>

      <Quiz
        title="Check the design"
        questions={[
          {
            prompt:
              "dim_person_demographics exposes age, ethnicity, practice, geography and deprivation in one wide row. Is that inherently a design problem?",
            options: [
              "Yes — each concept should always be queried from a separate model",
              "No — a wide model is useful when its grain is clear and it composes well-owned definitions",
              "Yes — reporting models should contain source columns only",
              "No — width means the model can own any logic its consumers need",
            ],
            answer: 1,
            explain:
              "Presentation and definition are separate decisions. A wide analytical model can be excellent; the risk is making it the only home of several independently changing definitions.",
          },
          {
            prompt:
              "NHS Health Check eligibility needs to exclude people on the diabetes register. What should it normally reference?",
            options: [
              "A new list of diabetes clinical codes inside the eligibility model",
              "The established fct_person_diabetes_register",
              "The published diabetes dashboard table",
              "A seed containing people currently known to have diabetes",
            ],
            answer: 1,
            explain:
              "Referencing the established register keeps diabetes consistent across products. Eligibility owns how that result affects Health Checks, not the clinical definition of diabetes.",
          },
          {
            prompt:
              "A borough-specific programme rule does not apply to people elsewhere. What is the clearest design?",
            options: [
              "Exclude everyone else from the shared person model",
              "Classify everyone else as unmatched",
              "Apply the rule as an explicitly borough-scoped enrichment",
              "Put the rule in staging so all downstream models inherit it",
            ],
            answer: 2,
            explain:
              "Local policy should enrich shared data without redefining it. Explicit scope distinguishes not applicable from a genuine failure to match.",
          },
        ]}
      />
    </LessonShell>
  );
}
