import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { requireUser } from "@/features/auth/lib/session";

export const metadata: Metadata = { title: "Apprendre" };

export default async function LearnPage() {
  const user = await requireUser();
  return <PageHeader title="Apprendre" subtitle={`Connecté en tant que ${user.email}`} />;
}
