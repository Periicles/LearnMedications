import type { BdpmData } from "@/types/bdpm";
import { normalizeName } from "./normalize";

const BASE_URL = "https://base-donnees-publique.medicaments.gouv.fr/download/file";

async function fetchRows(fileName: string): Promise<string[][]> {
  const response = await fetch(`${BASE_URL}/${fileName}`);
  if (!response.ok) throw new Error(`BDPM download failed for ${fileName}: ${response.status}`);
  const text = new TextDecoder("latin1").decode(await response.arrayBuffer());
  return text
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .map((line) => line.split("\t"));
}

export async function downloadBdpm(): Promise<BdpmData> {
  const [specialtyRows, compositionRows] = await Promise.all([
    fetchRows("CIS_bdpm.txt"),
    fetchRows("CIS_COMPO_bdpm.txt"),
  ]);
  const specialties = new Map<string, string>();
  for (const [cisCode, specialtyName] of specialtyRows) {
    specialties.set(cisCode, normalizeName(specialtyName));
  }
  const compositions = new Map<string, string[]>();
  for (const [cisCode, , , denomination] of compositionRows) {
    const known = compositions.get(cisCode) ?? [];
    known.push(normalizeName(denomination ?? ""));
    compositions.set(cisCode, known);
  }
  return { specialties, compositions };
}
