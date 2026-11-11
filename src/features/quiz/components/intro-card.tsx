import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { IntroCardViewProps } from "@/types/quiz";

export function IntroCardView({ card, step, total, onNext }: IntroCardViewProps) {
  return (
    <div className="animate-pop flex flex-1 flex-col gap-5">
      <Badge tone="info" className="self-start">
        Nouvelle molécule {step}/{total}
      </Badge>
      <Card className="flex flex-col gap-4">
        <h1 className="text-3xl font-black break-words">{card.name}</h1>
        {card.brands.length > 0 ? (
          <div>
            <p className="text-ink-soft text-sm font-bold">Noms commerciaux</p>
            <ul className="mt-1.5 flex flex-wrap gap-2">
              {card.brands.map((brand) => (
                <li key={brand}>
                  <Badge tone="accent" className="text-sm">
                    {brand}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <div>
          <p className="text-ink-soft text-sm font-bold">Famille</p>
          <p className="text-brand-strong dark:text-brand text-lg font-extrabold">
            {card.className}
          </p>
          <p className="text-ink-soft mt-1 font-medium">{card.classSummary}</p>
        </div>
        <div>
          <p className="text-ink-soft text-sm font-bold">Utilisation principale</p>
          <p className="font-semibold">{card.hint}</p>
        </div>
      </Card>
      <div className="mt-auto pb-[max(1rem,env(safe-area-inset-bottom))]">
        <Button size="large" fullWidth onClick={onNext} autoFocus>
          {step === total ? "Commencer les exercices" : "Suivant"}
        </Button>
      </div>
    </div>
  );
}
