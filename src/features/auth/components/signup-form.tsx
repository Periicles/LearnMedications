"use client";

import { useActionState } from "react";
import { FormMessage } from "@/components/ui/form-message";
import { SubmitButton } from "@/components/ui/submit-button";
import { TextField } from "@/components/ui/text-field";
import { IDLE_FORM_STATE } from "@/lib/forms";
import { signup } from "../actions";

export function SignupForm() {
  const [state, formAction] = useActionState(signup, IDLE_FORM_STATE);
  if (state.status === "success") return <FormMessage state={state} />;

  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      <FormMessage state={state} />
      <TextField
        label="Pseudo"
        name="username"
        autoComplete="username"
        autoCapitalize="none"
        required
        defaultValue={state.values?.username}
        hint="Visible par vos amis. 3 à 20 caractères."
        error={state.fieldErrors?.username}
      />
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
        autoComplete="new-password"
        required
        hint="Au moins 8 caractères."
        error={state.fieldErrors?.password}
      />
      <SubmitButton>Créer mon compte</SubmitButton>
    </form>
  );
}
