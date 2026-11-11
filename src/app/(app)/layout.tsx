import { Suspense } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { TopBar } from "@/components/layout/top-bar";
import { StatusBar } from "@/features/progress/components/status-bar";
import { PageSkeleton } from "@/components/layout/page-skeleton";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <AppShell
      topBar={
        <TopBar>
          <StatusBar />
        </TopBar>
      }
    >
      <Suspense fallback={<PageSkeleton />}>{children}</Suspense>
    </AppShell>
  );
}
