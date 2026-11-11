import type { AppShellProps } from "@/types/ui";
import { Sidebar } from "./sidebar";
import { TabBar } from "./tab-bar";

export function AppShell({ children, topBar }: AppShellProps) {
  return (
    <div className="flex min-h-dvh">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        {topBar}
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 pt-5 pb-28 sm:px-6 lg:pb-10">
          {children}
        </main>
      </div>
      <TabBar />
    </div>
  );
}
