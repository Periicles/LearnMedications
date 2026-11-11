import type { Metadata } from "next";
import { AuthCard } from "@/features/auth/components/auth-card";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

export const metadata: Metadata = { title: "Nouveau mot de passe" };

export default function ResetPasswordPage() {
  return (
    <AuthCard
      title="Nouveau mot de passe"
      subtitle="Choisissez un mot de passe que vous retiendrez."
    >
      <ResetPasswordForm />
    </AuthCard>
  );
}
