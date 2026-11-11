"use client";

import { useActionState } from "react";
import { FormMessage } from "@/components/ui/form-message";
import { TextField } from "@/components/ui/text-field";
import { Button } from "@/components/ui/button";
import { IDLE_FORM_STATE } from "@/lib/forms";
import type { DeleteAccountProps } from "@/types/profile";
import { deleteAccount } from "../actions";

export function DeleteAccount({ username }: DeleteAccountProps) {
  const [state, formAction, isPending] = useActionState(deleteAccount, IDLE_FORM_STATE);

  return (
    <details className="border-line rounded-3xl border-2 p-5">
      <summary className="text-danger cursor-pointer font-extrabold">Supprimer mon compte</summary>
      <form action={formAction} className="mt-4 flex flex-col gap-4" noValidate>
        <p className="text-ink-soft text-sm font-semibold">
          Cette action est définitive : votre progression, vos succès et vos amis seront effacés.
          Saisissez <strong className="text-ink">{username}</strong> pour confirmer.
        </p>
        <FormMessage state={state} />
        <TextField
          label="Votre pseudo"
          name="confirmation"
          autoCapitalize="none"
          autoComplete="off"
          error={state.fieldErrors?.confirmation}
        />
        <Button type="submit" variant="danger" disabled={isPending}>
          Supprimer définitivement
        </Button>
      </form>
    </details>
  );
}
