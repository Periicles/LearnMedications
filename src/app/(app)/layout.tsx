import { Suspense } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { PageSkeleton } from "@/components/layout/page-skeleton";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <AppShell>
      <Suspense fallback={<PageSkeleton />}>{children}</Suspense>
    </AppShell>
  );
}
