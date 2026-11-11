export type Tier = 1 | 2 | 3;

export type ServiceSlug =
  | "emergency"
  | "intensive-care"
  | "neuro-icu"
  | "anesthesia"
  | "orthopedic-surgery"
  | "geriatrics"
  | "pediatrics"
  | "psychiatry"
  | "oncology"
  | "community-pharmacy";

export type CollectionKind = "general" | "service" | "area";

export interface Area {
  slug: string;
  name: string;
  icon: string;
}

export interface RawDrugClass {
  slug: string;
  name: string;
  atc: string;
  summary: string;
}

export interface RawSubstance {
  slug: string;
  name: string;
  brands: string[];
  classSlug: string;
  hint: string;
  tier: Tier;
  services: ServiceSlug[];
}

export interface AreaFile {
  area: Area;
  classes: RawDrugClass[];
  substances: RawSubstance[];
}

export interface DrugClass extends RawDrugClass {
  areaSlug: string;
}

export interface Substance extends RawSubstance {
  areaSlug: string;
}

export interface Lesson {
  key: string;
  title: string;
  areaSlug: string;
  substanceSlugs: string[];
}

export interface CollectionMeta {
  slug: string;
  title: string;
  description: string;
  icon: string;
  kind: CollectionKind;
}

export interface Collection extends CollectionMeta {
  substanceSlugs: string[];
  lessons: Lesson[];
}

export interface ServiceMeta {
  slug: ServiceSlug;
  title: string;
  description: string;
  icon: string;
}

export interface Catalog {
  areas: Area[];
  classes: Map<string, DrugClass>;
  substances: Map<string, Substance>;
  collections: Collection[];
}

export interface SubstanceGroup {
  classSlug: string;
  areaSlug: string;
  substances: Substance[];
}
