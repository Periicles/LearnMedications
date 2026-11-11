import { Logo } from "@/components/layout/logo";
import { SiteFooter } from "@/components/layout/site-footer";
import { ButtonLink } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { FeatureGrid } from "@/features/marketing/components/feature-grid";
import { Hero } from "@/features/marketing/components/hero";

export default function HomePage() {
  return (
    <>
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4">
        <Logo />
        <ButtonLink href={ROUTES.login} variant="secondary" size="small">
          Connexion
        </ButtonLink>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-12">
        <Hero />
        <FeatureGrid />
      </main>
      <SiteFooter />
    </>
  );
}
