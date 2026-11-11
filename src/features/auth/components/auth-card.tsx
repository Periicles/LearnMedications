import { Card } from "@/components/ui/card";
import type { AuthCardProps } from "@/types/auth";

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <Card className="flex w-full flex-col gap-5 p-6">
      <div>
        <h1 className="text-2xl font-black">{title}</h1>
        <p className="text-ink-soft mt-1 font-semibold">{subtitle}</p>
      </div>
      {children}
      {footer ? <div className="text-center text-sm font-bold">{footer}</div> : null}
    </Card>
  );
}
