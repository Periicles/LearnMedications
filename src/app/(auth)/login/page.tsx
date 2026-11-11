import type { Metadata } from "next";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { AuthCard } from "@/features/auth/components/auth-card";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = { title: "Connexion" };

export default function LoginPage() {
  return (
    <AuthCard
      title="Bon retour !"
      subtitle="Connectez-vous pour reprendre votre progression."
      footer={
        <Link href={ROUTES.signup} className="text-brand">
          Pas encore de compte ? Inscrivez-vous
        </Link>
      }
    >
      <LoginForm />
    </AuthCard>
  );
}
