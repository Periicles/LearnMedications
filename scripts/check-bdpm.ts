/**
 * Cross-checks the curated content against the French public medication database (BDPM).
 * Findings are hints for a human reviewer, not hard failures: naming differs between sources.
 * Usage: npm run content:check-bdpm
 */
import { AREA_FILES } from "@/features/content/lib/area-files";
import { compareWithBdpm } from "./bdpm/compare";
import { downloadBdpm } from "./bdpm/download";

async function main(): Promise<void> {
  const data = await downloadBdpm();
  const substances = AREA_FILES.flatMap((file) => file.substances);
  const findings = compareWithBdpm(substances, data);
  for (const finding of findings) {
    console.log(`- [${finding.substanceSlug}] ${finding.message}`);
  }
  console.log(`\n${substances.length} substances checked, ${findings.length} findings to review.`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
