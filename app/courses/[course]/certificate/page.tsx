import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { COURSES, getCourse } from "@/lib/courses";
import { Certificate } from "@/components/Certificate";

export function generateStaticParams() {
  return COURSES.map((c) => ({ course: c.slug }));
}

export const metadata: Metadata = { title: "Certificate" };

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ course: string }>;
}) {
  const { course: slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();

  return (
    <Certificate
      courseSlug={course.slug}
      courseTitle={course.title}
      hours={course.hours}
      lessonSlugs={course.lessons.map((l) => l.slug)}
      lessonTitles={course.lessons.map((l) => l.title)}
    />
  );
}
