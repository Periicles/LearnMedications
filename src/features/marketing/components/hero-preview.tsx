import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";

const PREVIEW_CHOICES = ["Ibuprofène", "Paracétamol", "Tramadol", "Kétoprofène"];
const PREVIEW_ANSWER = "Paracétamol";

export function HeroPreview() {
  return (
    <div aria-hidden="true" className="mx-auto w-full max-w-sm">
      <Card className="flex flex-col gap-4 shadow-xl">
        <ProgressBar value={60} label="Progression de la leçon" />
        <Badge tone="accent" className="self-start">
          Nom commercial → molécule
        </Badge>
        <p className="text-xl font-extrabold">Quelle est la molécule du Doliprane ?</p>
        <ul className="flex flex-col gap-2">
          {PREVIEW_CHOICES.map((choice) => (
            <li
              key={choice}
              className={
                choice === PREVIEW_ANSWER
                  ? "border-brand bg-brand-soft flex items-center justify-between rounded-2xl border-2 border-b-4 px-4 py-3 font-extrabold"
                  : "border-line rounded-2xl border-2 border-b-4 px-4 py-3 font-bold"
              }
            >
              {choice}
              {choice === PREVIEW_ANSWER ? <Check className="text-brand size-5" /> : null}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
