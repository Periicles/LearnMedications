"use client";

import { useActionState } from "react";
import { FormMessage } from "@/components/ui/form-message";
import { SubmitButton } from "@/components/ui/submit-button";
import { TextField } from "@/components/ui/text-field";
import { IDLE_FORM_STATE } from "@/lib/forms";
import { updatePassword } from "../actions";

export function ResetPasswordForm() {
  const [state, formAction] = useActionState(updatePassword, IDLE_FORM_STATE);

  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      <FormMessage state={state} />
      <TextField
        label="Nouveau mot de passe"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        hint="Au moins 8 caractères."
        error={state.fieldErrors?.password}
      />
      <TextField
        label="Confirmez le mot de passe"
        name="confirmation"
        type="password"
        autoComplete="new-password"
        required
        error={state.fieldErrors?.confirmation}
      />
      <SubmitButton>Enregistrer</SubmitButton>
    </form>
  );
}
