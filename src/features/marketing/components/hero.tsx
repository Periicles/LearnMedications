import { ButtonLink } from "@/components/ui/button";
import { APP_DESCRIPTION, APP_TAGLINE } from "@/constants/app";
import { ROUTES } from "@/constants/routes";
import { HeroPreview } from "./hero-preview";

export function Hero() {
  return (
    <section className="grid items-center gap-10 py-8 md:grid-cols-2 md:py-16">
      <div className="flex flex-col gap-5">
        <h1 className="text-4xl leading-tight font-black sm:text-5xl">{APP_TAGLINE}</h1>
        <p className="text-ink-soft text-lg font-semibold">{APP_DESCRIPTION}</p>
        <div className="flex flex-col gap-3 sm:max-w-sm">
          <ButtonLink href={ROUTES.signup} size="large" fullWidth>
            Commencer gratuitement
          </ButtonLink>
          <ButtonLink href={ROUTES.demo} variant="secondary" size="large" fullWidth>
            Essayer une leçon
          </ButtonLink>
          <ButtonLink href={ROUTES.login} variant="ghost" fullWidth>
            J&apos;ai déjà un compte
          </ButtonLink>
        </div>
      </div>
      <HeroPreview />
    </section>
  );
}
