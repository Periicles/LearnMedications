import { CONTENT_DISCLAIMER } from "@/constants/app";

export function SiteFooter() {
  return (
    <footer className="text-ink-soft border-line border-t-2 px-4 py-6 text-center text-sm font-semibold">
      <p className="mx-auto max-w-2xl">{CONTENT_DISCLAIMER}</p>
    </footer>
  );
}
