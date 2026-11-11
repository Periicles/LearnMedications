import { areaFileSchema } from "@/schemas/content";
import type { AreaFile } from "@/types/content";

function findDuplicates(values: string[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return [...duplicates];
}

function checkSchemas(files: unknown[]): string[] {
  return files.flatMap((file, index) => {
    const result = areaFileSchema.safeParse(file);
    if (result.success) return [];
    return result.error.issues.map(
      (issue) => `file #${index}: ${issue.path.join(".")} ${issue.message}`,
    );
  });
}

function checkReferences(files: AreaFile[]): string[] {
  return files.flatMap((file) => {
    const classSlugs = new Set(file.classes.map((drugClass) => drugClass.slug));
    const usedSlugs = new Set(file.substances.map((substance) => substance.classSlug));
    const missing = file.substances
      .filter((substance) => !classSlugs.has(substance.classSlug))
      .map((substance) => `${substance.slug}: unknown class "${substance.classSlug}"`);
    const unused = [...classSlugs]
      .filter((slug) => !usedSlugs.has(slug))
      .map((slug) => `${file.area.slug}: class "${slug}" has no substance`);
    return [...missing, ...unused];
  });
}

function checkUniqueness(files: AreaFile[]): string[] {
  const substances = files.flatMap((file) => file.substances);
  const checks: [string, string[]][] = [
    ["area slug", files.map((file) => file.area.slug)],
    ["class slug", files.flatMap((file) => file.classes.map((drugClass) => drugClass.slug))],
    ["class name", files.flatMap((file) => file.classes.map((drugClass) => drugClass.name))],
    ["substance slug", substances.map((substance) => substance.slug)],
    ["substance name", substances.map((substance) => substance.name.toLowerCase())],
    [
      "brand",
      substances.flatMap((substance) => substance.brands.map((brand) => brand.toLowerCase())),
    ],
  ];
  return checks.flatMap(([label, values]) =>
    findDuplicates(values).map((value) => `duplicate ${label}: "${value}"`),
  );
}

/** Returns a list of human readable issues; an empty list means the content is valid. */
export function validateAreaFiles(files: unknown[]): string[] {
  const schemaIssues = checkSchemas(files);
  if (schemaIssues.length > 0) return schemaIssues;
  const typedFiles = files as AreaFile[];
  return [...checkReferences(typedFiles), ...checkUniqueness(typedFiles)];
}
