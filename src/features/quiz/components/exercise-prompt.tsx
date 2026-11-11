import { Badge } from "@/components/ui/badge";
import type { ExercisePromptProps } from "@/types/quiz";
import { KIND_LABELS, KIND_PROMPTS } from "../constants";

export function ExercisePrompt({ kind, subject }: ExercisePromptProps) {
  return (
    <div className="flex flex-col gap-3">
      <Badge tone="accent" className="self-start">
        {KIND_LABELS[kind]}
      </Badge>
      <h1 className="text-xl font-extrabold sm:text-2xl">{KIND_PROMPTS[kind]}</h1>
      {subject ? (
        <p className="border-line bg-surface rounded-3xl border-2 px-5 py-6 text-center text-2xl font-black break-words sm:text-3xl">
          {subject}
        </p>
      ) : null}
    </div>
  );
}
