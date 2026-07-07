import type { TeachingFeedback } from "../core/types.js";
import { getDecisions } from "./decisions.js";
import { getAssets } from "./assets.js";

const CODE_SMELL_MARKERS = ["TODO", "FIXME", "console.log", "debugger"];
const LARGE_ASSET_LINE_THRESHOLD = 500;

function wordSet(text: string): Set<string> {
  return new Set(text.toLowerCase().split(/\W+/).filter(Boolean));
}

function jaccardSimilarity(a: string, b: string): number {
  const setA = wordSet(a);
  const setB = wordSet(b);
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  for (const word of setA) if (setB.has(word)) intersection++;
  const union = setA.size + setB.size - intersection;
  return intersection / union;
}

export interface GetTeachingFeedbackInput {
  project?: string;
}

export async function getTeachingFeedback(input: GetTeachingFeedbackInput = {}): Promise<TeachingFeedback> {
  const [decisions, assets] = await Promise.all([
    getDecisions({ project: input.project }),
    getAssets({ project: input.project }),
  ]);

  const antiPatterns: TeachingFeedback["antiPatterns"] = [];

  const undocumented = decisions.filter((d) => !d.consequences?.trim());
  if (undocumented.length > 0) {
    antiPatterns.push({
      pattern: "undocumented-consequences",
      detail: `${undocumented.length} decision(s) have no recorded consequences — revisit them to close the reflection loop.`,
      refs: undocumented.map((d) => d.id),
    });
  }

  const churnPairs: string[] = [];
  for (let i = 0; i < decisions.length; i++) {
    for (let j = i + 1; j < decisions.length; j++) {
      const a = decisions[i];
      const b = decisions[j];
      if (!a || !b) continue;
      if (jaccardSimilarity(a.title, b.title) > 0.6) {
        churnPairs.push(a.id, b.id);
      }
    }
  }
  if (churnPairs.length > 0) {
    antiPatterns.push({
      pattern: "decision-churn",
      detail: "Multiple decisions with near-duplicate titles were logged — may indicate re-litigating settled decisions instead of amending them.",
      refs: [...new Set(churnPairs)],
    });
  }

  const smellyAssets = assets.filter((a) => {
    const hasMarker = CODE_SMELL_MARKERS.some((marker) => a.content.includes(marker));
    const isLarge = a.content.split("\n").length > LARGE_ASSET_LINE_THRESHOLD;
    return a.kind === "code" && (hasMarker || isLarge);
  });
  if (smellyAssets.length > 0) {
    antiPatterns.push({
      pattern: "code-smell",
      detail: `${smellyAssets.length} code asset(s) contain TODO/FIXME/debug markers or exceed ${LARGE_ASSET_LINE_THRESHOLD} lines.`,
      refs: smellyAssets.map((a) => a.id),
    });
  }

  return {
    summary:
      antiPatterns.length === 0
        ? "No anti-patterns detected across logged decisions and assets."
        : `Found ${antiPatterns.length} anti-pattern categor${antiPatterns.length === 1 ? "y" : "ies"} across ${decisions.length} decision(s) and ${assets.length} asset(s).`,
    antiPatterns,
    generatedAt: new Date().toISOString(),
  };
}
