import anesthesiaIcu from "@content/areas/anesthesia-icu.json";
import cardiovascular from "@content/areas/cardiovascular.json";
import endocrinology from "@content/areas/endocrinology.json";
import gastroenterology from "@content/areas/gastroenterology.json";
import hemostasis from "@content/areas/hemostasis.json";
import infectiology from "@content/areas/infectiology.json";
import neurology from "@content/areas/neurology.json";
import pain from "@content/areas/pain.json";
import psychiatry from "@content/areas/psychiatry.json";
import pulmonologyAllergy from "@content/areas/pulmonology-allergy.json";
import rheumatologyImmunology from "@content/areas/rheumatology-immunology.json";
import urologyGynecology from "@content/areas/urology-gynecology.json";
import type { AreaFile } from "@/types/content";

/** Order defines the order of areas in learning paths. JSON is validated by tests and CI. */
export const AREA_FILES = [
  pain,
  cardiovascular,
  hemostasis,
  infectiology,
  endocrinology,
  gastroenterology,
  pulmonologyAllergy,
  psychiatry,
  neurology,
  anesthesiaIcu,
  urologyGynecology,
  rheumatologyImmunology,
] as unknown as AreaFile[];
