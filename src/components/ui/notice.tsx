import { mergeClasses } from "@/lib/class-names";
import type { NoticeProps } from "@/types/ui";
import { SOFT_TONE_CLASSES } from "./tones";

export function Notice({ children, tone = "info" }: NoticeProps) {
  return (
    <p
      role={tone === "danger" ? "alert" : "status"}
      className={mergeClasses("rounded-2xl px-4 py-3 text-sm font-bold", SOFT_TONE_CLASSES[tone])}
    >
      {children}
    </p>
  );
}
