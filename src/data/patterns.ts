import { patternSchema } from "../domain/schemas";

export const patterns = [
  { id: "output-grading", titleKey: "pattern.output.title", descriptionKey: "pattern.output.description", layerIds: ["output"], evidenceSourceIds: ["openai-graders"] },
  { id: "trajectory-inspection", titleKey: "pattern.trajectory.title", descriptionKey: "pattern.trajectory.description", layerIds: ["trajectory"], evidenceSourceIds: ["anthropic-agent-evals", "openai-graders"] },
  { id: "outcome-verification", titleKey: "pattern.outcome.title", descriptionKey: "pattern.outcome.description", layerIds: ["outcome"], evidenceSourceIds: ["anthropic-agent-evals", "nist-tevv-athlon"] },
  { id: "repeated-trials", titleKey: "pattern.trials.title", descriptionKey: "pattern.trials.description", layerIds: ["robustness"], evidenceSourceIds: ["anthropic-agent-evals", "nist-ai-800-3"] },
  { id: "uncertainty-accounting", titleKey: "pattern.uncertainty.title", descriptionKey: "pattern.uncertainty.description", layerIds: ["robustness"], evidenceSourceIds: ["nist-ai-measurement", "nist-ai-800-3", "nist-tevv-athlon"] },
  { id: "adversarial-evaluation", titleKey: "pattern.adversarial.title", descriptionKey: "pattern.adversarial.description", layerIds: ["safety"], evidenceSourceIds: ["nist-ai-measurement", "nist-tevv-athlon"] },
  { id: "regression-gates", titleKey: "pattern.regression.title", descriptionKey: "pattern.regression.description", layerIds: ["operations"], evidenceSourceIds: ["nist-ai-measurement", "nist-tevv-athlon", "openai-graders"] },
].map((pattern) => patternSchema.parse(pattern));
