"use client";

import { useFormStatus } from "react-dom";
import type { SubmitButtonProps } from "@/types/auth";
import { Button } from "./button";

export function SubmitButton({ children, pendingLabel = "Un instant…" }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="large" fullWidth disabled={pending}>
      {pending ? pendingLabel : children}
    </Button>
  );
}
