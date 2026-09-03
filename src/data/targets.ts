import { evaluationTargetSchema, type EvaluationTarget } from "../domain/schemas";

const records = [
  {
    id: "model",
    labelKey: "target.model",
    descriptionKey: "target.model.description",
    icon: "cube",
    criticalLayers: ["output", "robustness"],
  },
  {
    id: "inference",
    labelKey: "target.inference",
    descriptionKey: "target.inference.description",
    icon: "server",
    criticalLayers: ["output", "operations"],
  },
  {
    id: "retrieval",
    labelKey: "target.retrieval",
    descriptionKey: "target.retrieval.description",
    icon: "search",
    criticalLayers: ["output", "outcome"],
  },
  {
    id: "agent",
    labelKey: "target.agent",
    descriptionKey: "target.agent.description",
    icon: "agent",
    criticalLayers: ["trajectory", "outcome", "safety"],
  },
  {
    id: "security",
    labelKey: "target.security",
    descriptionKey: "target.security.description",
    icon: "shield",
    criticalLayers: ["safety", "outcome"],
  },
  {
    id: "world-model",
    labelKey: "target.world-model",
    descriptionKey: "target.world-model.description",
    icon: "globe",
    criticalLayers: ["outcome", "robustness"],
  },
  {
    id: "physical-ai",
    labelKey: "target.physical-ai",
    descriptionKey: "target.physical-ai.description",
    icon: "robot",
    criticalLayers: ["outcome", "safety", "operations"],
  },
] as const satisfies readonly EvaluationTarget[];

export const targets = records.map((target) => evaluationTargetSchema.parse(target));
