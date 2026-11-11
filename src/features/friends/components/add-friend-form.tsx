"use client";

import { useActionState } from "react";
import { Card } from "@/components/ui/card";
import { FormMessage } from "@/components/ui/form-message";
import { SubmitButton } from "@/components/ui/submit-button";
import { TextField } from "@/components/ui/text-field";
import { IDLE_FORM_STATE } from "@/lib/forms";
import { sendFriendRequest } from "../actions";

export function AddFriendForm() {
  const [state, formAction] = useActionState(sendFriendRequest, IDLE_FORM_STATE);

  return (
    <Card>
      <form action={formAction} className="flex flex-col gap-3" noValidate>
        <h2 className="text-lg font-black">Ajouter un ami</h2>
        <FormMessage state={state} />
        <TextField
          label="Pseudo de votre ami"
          name="username"
          autoCapitalize="none"
          autoComplete="off"
          required
          defaultValue={state.values?.username}
          error={state.fieldErrors?.username}
        />
        <SubmitButton pendingLabel="Envoi…">Envoyer la demande</SubmitButton>
      </form>
    </Card>
  );
}
