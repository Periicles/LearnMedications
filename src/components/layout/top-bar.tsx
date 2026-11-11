import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChildrenProps } from "@/types/ui";
import { Logo } from "./logo";

export function TopBar({ children }: ChildrenProps) {
  return (
    <div className="border-line bg-canvas/95 sticky top-0 z-10 border-b-2 px-4 pt-[max(0.5rem,env(safe-area-inset-top))] pb-2 backdrop-blur sm:px-6">
      <div className="mx-auto flex min-h-10 w-full max-w-3xl items-center justify-between gap-3">
        <div className="lg:invisible">
          <Logo compact />
        </div>
        <Suspense fallback={<Skeleton className="h-6 w-40" />}>{children}</Suspense>
      </div>
    </div>
  );
}
