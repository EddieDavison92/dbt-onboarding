import { redirect } from "next/navigation";
import { LEARN } from "@/lib/curriculum";

export default function LearnIndex() {
  redirect(`/learn/${LEARN[0].slug}`);
}
