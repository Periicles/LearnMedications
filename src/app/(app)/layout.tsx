import { AppShell } from "@/components/layout/app-shell";
import { TopBar } from "@/components/layout/top-bar";
import { StatusBar } from "@/features/progress/components/status-bar";

/** Each route has its own `loading.tsx`, so navigations show the shell and a skeleton instantly. */
export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <AppShell
      topBar={
        <TopBar>
          <StatusBar />
        </TopBar>
      }
    >
      {children}
    </AppShell>
  );
}
