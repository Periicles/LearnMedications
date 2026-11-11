import { z as schema } from "zod";
import { SERVICE_SLUGS } from "@/features/content/constants";

const slugSchema = schema.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/);

export const areaSchema = schema.strictObject({
  slug: slugSchema,
  name: schema.string().min(3),
  icon: schema.string().min(1),
});

export const drugClassSchema = schema.strictObject({
  slug: slugSchema,
  name: schema.string().min(3),
  atc: schema.string().regex(/^([A-Z][0-9A-Z]{0,6})?$/),
  summary: schema.string().min(10).max(160),
});

export const substanceSchema = schema.strictObject({
  slug: slugSchema,
  name: schema.string().min(3),
  brands: schema.array(schema.string().min(2)).max(3),
  classSlug: slugSchema,
  hint: schema.string().min(3).max(90),
  tier: schema.union([schema.literal(1), schema.literal(2), schema.literal(3)]),
  services: schema.array(schema.enum(SERVICE_SLUGS)),
});

export const areaFileSchema = schema.strictObject({
  area: areaSchema,
  classes: schema.array(drugClassSchema).min(1),
  substances: schema.array(substanceSchema).min(1),
});
