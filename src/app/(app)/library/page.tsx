import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { requireUser } from "@/features/auth/lib/session";
import { getCatalog } from "@/features/content/lib/catalog";
import { LibraryBrowser } from "@/features/library/components/library-browser";
import { buildLibraryEntries } from "@/features/library/lib/entries";
import { getMasteryRows } from "@/features/progress/lib/queries";

export const metadata: Metadata = { title: "Lexique" };

export default async function LibraryPage() {
  const user = await requireUser();
  const entries = buildLibraryEntries(getCatalog(), await getMasteryRows(user.id));

  return (
    <>
      <PageHeader
        title="Lexique"
        subtitle="Toutes les molécules de l'application, avec leurs marques et leur famille."
      />
      <LibraryBrowser entries={entries} />
    </>
  );
}
