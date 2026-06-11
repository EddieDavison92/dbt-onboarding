import Link from "next/link";

export function GuidedCourseLink({ href }: { href: string }) {
  return (
    <aside className="mb-7 rounded-xl border border-line bg-paper-warm px-4 py-3 text-sm leading-relaxed text-ink-soft">
      Learning this for the first time? The course explains the reasoning and walks
      through each step. This page is the short version for use during real work.{" "}
      <Link href={href} className="font-semibold">
        Open the guided lesson →
      </Link>
    </aside>
  );
}
