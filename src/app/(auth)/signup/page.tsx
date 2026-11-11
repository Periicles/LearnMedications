import type { Metadata } from "next";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { AuthCard } from "@/features/auth/components/auth-card";
import { SignupForm } from "@/features/auth/components/signup-form";

export const metadata: Metadata = { title: "Inscription" };

export default function SignupPage() {
  return (
    <AuthCard
      title="Créer un compte"
      subtitle="Gratuit, et prêt en moins d'une minute."
      footer={
        <Link href={ROUTES.login} className="text-brand">
          Déjà inscrit ? Connectez-vous
        </Link>
      }
    >
      <SignupForm />
    </AuthCard>
  );
}
