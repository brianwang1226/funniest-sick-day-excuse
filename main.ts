// The Funniest Sick-Day Excuse — make.fun entry.
// Writes one short original sick-day excuse to /output/entry.txt
// (or $MAKEFUN_OUTPUT_DIR/entry.txt). Deterministic, no network.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY = `I woke up with a rash shaped exactly like the company logo. HR asked for a photo. I'm staying home before it spreads to the org chart.`;

// Kit gate: 1-200 UTF-8 chars, not only whitespace, exactly one line. Fail
// loudly instead of writing an entry the judge would reject.
const len = [...ENTRY].length;
const isSingleLine = !ENTRY.includes("\n");
if (len < 1 || len > 200 || ENTRY.trim().length === 0 || !isSingleLine) {
  console.error(
    `Entry rejected by local gate: ${len} chars, single line: ${isSingleLine} (must be one line, 1-200 chars, non-blank).`,
  );
  process.exit(1);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");
// Read back what was written: a partial or empty write must fail loudly
// instead of submitting a blank entry the judge would reject.
const written = readFileSync(outPath, "utf8");
if (written !== ENTRY) {
  console.error(
    `Entry mismatch after write: expected ${JSON.stringify(ENTRY)}, got ${JSON.stringify(written)}.`,
  );
  process.exit(1);
}
console.log(`Wrote ${[...ENTRY].length} characters to ${outPath} (verified)`);
