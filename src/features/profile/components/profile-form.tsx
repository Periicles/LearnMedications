"use client";

import { useActionState } from "react";
import { Card } from "@/components/ui/card";
import { FormMessage } from "@/components/ui/form-message";
import { SubmitButton } from "@/components/ui/submit-button";
import { TextField } from "@/components/ui/text-field";
import { IDLE_FORM_STATE } from "@/lib/forms";
import type { ProfileFormProps } from "@/types/profile";
import { updateProfile } from "../actions";
import { AvatarPicker } from "./avatar-picker";

export function ProfileForm({ username, avatar }: ProfileFormProps) {
  const [state, formAction] = useActionState(updateProfile, IDLE_FORM_STATE);

  return (
    <Card>
      <form action={formAction} className="flex flex-col gap-4" noValidate>
        <h2 className="text-lg font-black">Modifier mon profil</h2>
        <FormMessage state={state} />
        <TextField
          label="Pseudo"
          name="username"
          defaultValue={username}
          autoCapitalize="none"
          autoComplete="username"
          required
          error={state.fieldErrors?.username}
        />
        <AvatarPicker selected={avatar} />
        <SubmitButton>Enregistrer</SubmitButton>
      </form>
    </Card>
  );
}
