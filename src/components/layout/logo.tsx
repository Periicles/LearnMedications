import Link from "next/link";
import { Pill } from "lucide-react";
import { APP_NAME } from "@/constants/app";
import { ROUTES } from "@/constants/routes";
import type { LogoProps } from "@/types/ui";

export function Logo({ compact = false }: LogoProps) {
  return (
    <Link href={ROUTES.home} className="flex items-center gap-2 text-lg font-black">
      <span className="bg-brand flex size-9 items-center justify-center rounded-xl text-white">
        <Pill className="size-5" aria-hidden="true" />
      </span>
      <span className={compact ? "sr-only sm:not-sr-only" : undefined}>{APP_NAME}</span>
    </Link>
  );
}
