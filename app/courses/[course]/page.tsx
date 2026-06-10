import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { COURSES, getCourse } from "@/lib/courses";
import { CourseOverview } from "@/components/CourseOverview";

export function generateStaticParams() {
  return COURSES.map((c) => ({ course: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ course: string }>;
}): Promise<Metadata> {
  const { course } = await params;
  return { title: getCourse(course)?.title ?? "Course" };
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ course: string }>;
}) {
  const { course: slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();

  return (
    <CourseOverview
      slug={course.slug}
      title={course.title}
      tagline={course.tagline}
      audience={course.audience}
      hours={course.hours}
      accent={course.accent}
      lessons={course.lessons.map((l) => ({
        slug: l.slug,
        title: l.title,
        blurb: l.blurb,
        minutes: l.minutes,
        stepCount: l.steps.length,
      }))}
    />
  );
}
