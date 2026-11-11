"use client";

import Link from "next/link";
import { useActionState } from "react";
import { FormMessage } from "@/components/ui/form-message";
import { SubmitButton } from "@/components/ui/submit-button";
import { TextField } from "@/components/ui/text-field";
import { ROUTES } from "@/constants/routes";
import { IDLE_FORM_STATE } from "@/lib/forms";
import { login } from "../actions";

export function LoginForm() {
  const [state, formAction] = useActionState(login, IDLE_FORM_STATE);

  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      <FormMessage state={state} />
      <TextField
        label="Adresse e-mail"
        name="email"
        type="email"
        autoComplete="email"
        inputMode="email"
        required
        defaultValue={state.values?.email}
        error={state.fieldErrors?.email}
      />
      <TextField
        label="Mot de passe"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        error={state.fieldErrors?.password}
      />
      <Link href={ROUTES.forgotPassword} className="text-brand self-end text-sm font-bold">
        Mot de passe oublié ?
      </Link>
      <SubmitButton>Se connecter</SubmitButton>
    </form>
  );
}
