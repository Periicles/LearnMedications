import { z as schema } from "zod";
import { MAX_SESSION_RECORDS } from "@/features/progress/constants";

const slug = schema.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/);

export const sessionInputSchema = schema.object({
  mode: schema.enum(["learn", "review"]),
  collectionSlug: slug.optional(),
  lessonKey: slug.optional(),
  records: schema
    .array(schema.object({ substanceSlug: slug, correct: schema.boolean() }))
    .min(1)
    .max(MAX_SESSION_RECORDS),
});
