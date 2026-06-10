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
    slug: "macros",
    title: "Macros",
    blurb: "Reusable SQL — stop copy-pasting that CASE statement",
    minutes: 5,
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
    title: "Set up your machine",
    blurb: "Clone, credentials, dbt Fusion, first dbt debug",
    minutes: 15,
  },
  {
    slug: "find-a-source",
    title: "Find your source",
    blurb: "Locate the raw model you'll build on",
    minutes: 5,
  },
  {
    slug: "first-model",
    title: "Write a staging model",
    blurb: "Your first .sql file, the project way",
    minutes: 10,
  },
  {
    slug: "yaml-and-tests",
    title: "Add the YAML",
    blurb: "Owner, descriptions, tests — scaffolded for you",
    minutes: 8,
  },
  {
    slug: "build-and-test",
    title: "Build & test locally",
    blurb: "dbt build, reading output, fixing failures",
    minutes: 8,
  },
  {
    slug: "open-a-pr",
    title: "Open your pull request",
    blurb: "Branch, commit, push, PR — and what CI does next",
    minutes: 10,
  },
  {
    slug: "review-and-merge",
    title: "Review & merge",
    blurb: "Responding to feedback and landing on main",
    minutes: 5,
  },
];

export function learnIndex(slug: string): number {
  return LEARN.findIndex((l) => l.slug === slug);
}

export function practiceIndex(slug: string): number {
  return PRACTICE.findIndex((l) => l.slug === slug);
}

/** prev/next within the combined journey: learn lessons then practice steps */
export function pager(section: "learn" | "practice", slug: string) {
  const list = section === "learn" ? LEARN : PRACTICE;
  const i = list.findIndex((l) => l.slug === slug);
  const prev =
    i > 0
      ? { href: `/${section}/${list[i - 1].slug}`, title: list[i - 1].title }
      : section === "practice"
        ? { href: `/learn/${LEARN[LEARN.length - 1].slug}`, title: LEARN[LEARN.length - 1].title }
        : null;
  const next =
    i < list.length - 1
      ? { href: `/${section}/${list[i + 1].slug}`, title: list[i + 1].title }
      : section === "learn"
        ? { href: `/practice/${PRACTICE[0].slug}`, title: PRACTICE[0].title }
        : { href: "/reference", title: "Command reference" };
  return { prev, next };
}
