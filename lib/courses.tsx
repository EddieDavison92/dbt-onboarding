import type { Course, CourseMeta } from "@/lib/course-types";
import { GIT_COURSE } from "@/lib/content/git-course";
import { FIRST_PR_COURSE } from "@/lib/content/first-pr-course";

export const COURSES: Course[] = [GIT_COURSE, FIRST_PR_COURSE];

/** announced but not yet built — shown on the landing page */
export const UPCOMING: CourseMeta[] = [
  {
    slug: "dbt-fundamentals",
    title: "dbt fundamentals",
    tagline: "The compiler, the DAG, the commands — with a live compile playground",
    audience: "Coming soon",
    hours: "~1 hr",
    accent: "var(--layer-modelling)",
  },
];

export function getCourse(slug: string): Course | undefined {
  return COURSES.find((c) => c.slug === slug);
}

export function lessonId(courseSlug: string, lessonSlug: string) {
  return `course/${courseSlug}/${lessonSlug}`;
}
