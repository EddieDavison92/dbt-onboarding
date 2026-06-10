import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { COURSES, getCourse } from "@/lib/courses";
import { LessonPlayer } from "@/components/LessonPlayer";

export function generateStaticParams() {
  return COURSES.flatMap((c) =>
    c.lessons.map((l) => ({ course: c.slug, lesson: l.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ course: string; lesson: string }>;
}): Promise<Metadata> {
  const { course, lesson } = await params;
  const title = getCourse(course)?.lessons.find((l) => l.slug === lesson)?.title;
  return { title: title ?? "Lesson" };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ course: string; lesson: string }>;
}) {
  const { course: courseSlug, lesson: lessonSlug } = await params;
  const course = getCourse(courseSlug);
  const index = course?.lessons.findIndex((l) => l.slug === lessonSlug) ?? -1;
  if (!course || index < 0) notFound();

  const lesson = course.lessons[index];
  const next = course.lessons[index + 1];
  const nextHref = next
    ? `/courses/${course.slug}/${next.slug}`
    : `/courses/${course.slug}/certificate`;
  const nextLabel = next ? next.title : "your certificate";

  return (
    <LessonPlayer
      courseSlug={course.slug}
      courseTitle={course.title}
      lessonSlug={lesson.slug}
      lessonTitle={lesson.title}
      lessonIndex={index}
      lessonCount={course.lessons.length}
      steps={lesson.steps}
      nextHref={nextHref}
      nextLabel={nextLabel}
    />
  );
}
