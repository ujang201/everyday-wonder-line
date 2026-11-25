// Everyday Wonder — entry writer.
//
// The entry is one sentence about a small everyday moment seen at a
// strange angle: a shadow arriving somewhere before its owner. The
// sentence is assembled from four named parts — the walker, the beat,
// the turn, and the coda — so each part can be read and tuned on its
// own, and the finished line is fixed and deterministic: the same
// run always writes the same bytes.
//
// The sealed gate only accepts 1..200 characters, so the program
// checks its own line before writing and refuses to ship one the
// scorer would reject.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The walker: the everyday thing the sentence watches.
const WALKER = "My shadow";

// The beat: the small moment, stated plainly.
const BEAT = "got to the corner before I did";

// The turn: the strangeness — the shadow does something on its own.
const TURN = "and walked one whole step alone";

// The coda: the wondering read of what just happened.
const CODA = "as if it had somewhere better to be";

function buildLine(walker, beat, turn, coda) {
  return `${walker} ${beat} ${turn}, ${coda}.`;
}

// Count real characters (code points), the way the gate does, and
// require exactly one sentence: a single terminal full stop, so the
// judge reads one clear sentence and nothing more.
function assertWithinGate(line, maxChars) {
  const length = [...line].length;
  if (length < 1 || length > maxChars) {
    throw new Error(`entry is ${length} characters, gate allows 1..${maxChars}`);
  }
  if (line.trim().length === 0) {
    throw new Error("entry is only whitespace");
  }
  const stops = (line.match(/[.!?]/g) || []).length;
  if (stops !== 1 || !line.endsWith(".")) {
    throw new Error("entry must be exactly one sentence ending in a full stop");
  }
}

function main() {
  const outDir = process.env.OUTPUT_DIR || "/output";
  const line = buildLine(WALKER, BEAT, TURN, CODA);
  assertWithinGate(line, 200);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "entry.txt"), line + "\n", "utf8");
}

main();
