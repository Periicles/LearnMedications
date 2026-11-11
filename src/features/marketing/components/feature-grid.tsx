import { Card } from "@/components/ui/card";
import { LANDING_FEATURES } from "../constants";

export function FeatureGrid() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {LANDING_FEATURES.map((feature) => (
        <li key={feature.title}>
          <Card className="flex h-full gap-4">
            <span className="bg-brand-soft text-brand-strong dark:text-brand flex size-12 shrink-0 items-center justify-center rounded-2xl">
              <feature.icon className="size-6" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-lg font-extrabold">{feature.title}</h3>
              <p className="text-ink-soft mt-1 font-medium">{feature.description}</p>
            </div>
          </Card>
        </li>
      ))}
    </ul>
  );
}
