export type NavItem = {
  slug: string;
  title: string;
  blurb: string;
  minutes: number;
};

export const LEARN: NavItem[] = [
  {
    slug: "why-dbt",
    title: "Why dbt?",
    blurb: "From SQL scripts in folders to a tested, versioned pipeline",
    minutes: 6,
  },
  {
    slug: "layer-cake",
    title: "The layer cake",
    blurb: "Five layers, one job each — raw to published",
    minutes: 8,
  },
  {
    slug: "refs-and-sources",
    title: "ref() and source()",
    blurb: "How models connect, and why you never hardcode a table",
    minutes: 6,
  },
  {
    slug: "tests-and-docs",
    title: "Tests & documentation",
    blurb: "The YAML file that travels with every model",
    minutes: 7,
  },
  {
    slug: "git-and-prs",
    title: "Git & pull requests",
    blurb: "Branch, commit, PR, CI — the whole loop, no git experience assumed",
    minutes: 9,
  },
];

export const PRACTICE: NavItem[] = [
  {
    slug: "setup",
    title: "Set up your development environment",
    blurb: "Prerequisites, setup commands and connection checks",
    minutes: 10,
  },
  {
    slug: "find-a-source",
    title: "Find your source",
    blurb: "Find the raw model or choose the right source route",
    minutes: 5,
  },
  {
    slug: "first-model",
    title: "Write a staging model",
    blurb: "The staging contract, template and quick checks",
    minutes: 5,
  },
  {
    slug: "yaml-and-tests",
    title: "Add the YAML",
    blurb: "Generate the file, then add the decisions that matter",
    minutes: 5,
  },
  {
    slug: "build-and-test",
    title: "Build & test locally",
    blurb: "Daily selectors and a failure triage guide",
    minutes: 5,
  },
  {
    slug: "open-a-pr",
    title: "Open your pull request",
    blurb: "The command sequence, PR template and CI recovery",
    minutes: 5,
  },
  {
    slug: "review-and-merge",
    title: "Review & merge",
    blurb: "Update the PR, merge, and sync your local checkout",
    minutes: 4,
  },
];

export const ADVANCED: NavItem[] = [
  {
    slug: "dbt-extension",
    title: "The dbt extension",
    blurb: "Live error detection, rename-a-column-everywhere, lineage in the editor",
    minutes: 8,
  },
  {
    slug: "macros",
    title: "Macros",
    blurb: "Reusable SQL — define cleaning logic once, use it everywhere",
    minutes: 7,
  },
  {
    slug: "materialisations",
    title: "Materialisations",
    blurb: "Views, tables, incremental models — and when each earns its keep",
    minutes: 9,
  },
  {
    slug: "clustering",
    title: "Clustering",
    blurb: "Choosing keys for how data is filtered and joined downstream",
    minutes: 7,
  },
  {
    slug: "project-config",
    title: "Project configuration",
    blurb: "dbt_project.yml — where the defaults you've been relying on live",
    minutes: 9,
  },
  {
    slug: "snapshots",
    title: "Snapshots",
    blurb: "Capturing history when the source only keeps the present",
    minutes: 9,
  },
  {
    slug: "semantic-views",
    title: "Semantic views",
    blurb: "Declared keys, joins and metrics — so query tools stop guessing",
    minutes: 8,
  },
  {
    slug: "python-models",
    title: "Python models",
    blurb: "Python in the DAG, for the work SQL is bad at",
    minutes: 8,
  },
];

export type Section = "learn" | "practice" | "advanced";

const SECTIONS: { id: Section; list: NavItem[] }[] = [
  { id: "learn", list: LEARN },
  { id: "practice", list: PRACTICE },
  { id: "advanced", list: ADVANCED },
];

/** prev/next across the journey: learn → practice → going further → reference */
export function pager(section: Section, slug: string) {
  const flat = SECTIONS.flatMap((s) =>
    s.list.map((item) => ({ href: `/${s.id}/${item.slug}`, title: item.title })),
  );
  const i = flat.findIndex((f) => f.href === `/${section}/${slug}`);
  const prev = i > 0 ? flat[i - 1] : null;
  const next =
    i < flat.length - 1
      ? flat[i + 1]
      : { href: "/reference", title: "Command reference" };
  return { prev, next };
}
