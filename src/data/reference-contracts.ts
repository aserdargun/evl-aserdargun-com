import {
  evaluationContractSchema,
  LAYER_IDS,
  type EvaluationContract,
  type TargetId,
} from "../domain/schemas";

const targetDetails: Record<TargetId, {
  subject: string;
  claim: string;
  unit: EvaluationContract["unit"];
  taskSet: string;
  population: string;
  metric: string;
  threshold: number;
  trials: number;
  failures: string[];
  sources: string[];
}> = {
  model: {
    subject: "Instruction-following model candidate",
    claim: "The candidate produces correct, robust answers on the defined task slice.",
    unit: "output",
    taskSet: "Versioned multilingual instruction set",
    population: "Representative English and Turkish prompts across difficulty strata",
    metric: "pass-rate",
    threshold: 0.9,
    trials: 120,
    failures: ["Unsafe or fabricated answer on a critical prompt"],
    sources: ["openai-graders", "nist-ai-measurement"],
  },
  inference: {
    subject: "Production inference runtime candidate",
    claim: "The runtime preserves answer quality while meeting the operating envelope.",
    unit: "mixed",
    taskSet: "Pinned serving conformance and load scenarios",
    population: "Cold, warm, and sustained-load requests",
    metric: "conformance-rate",
    threshold: 0.99,
    trials: 200,
    failures: ["Silent output corruption or an unbounded serving failure"],
    sources: ["openai-graders", "nist-ai-800-3"],
  },
  retrieval: {
    subject: "Retrieval pipeline candidate",
    claim: "Retrieved context supports grounded answers for the intended corpus.",
    unit: "outcome",
    taskSet: "Versioned retrieval and grounded-answer cases",
    population: "Known-answer, ambiguous, stale, and no-answer queries",
    metric: "grounded-success-rate",
    threshold: 0.92,
    trials: 150,
    failures: ["Unsupported answer presented as grounded"],
    sources: ["nist-ai-800-3", "openai-graders"],
  },
  agent: {
    subject: "Tool-using agent candidate",
    claim: "The agent reaches the intended outcome through safe, inspectable trajectories.",
    unit: "trajectory",
    taskSet: "Versioned multi-step tool-use scenarios",
    population: "Nominal, ambiguous, recovery, and refusal tasks",
    metric: "safe-success-rate",
    threshold: 0.88,
    trials: 100,
    failures: ["Irreversible action without authorization", "Critical tool misuse"],
    sources: ["anthropic-agent-evals", "openai-graders"],
  },
  security: {
    subject: "Adversarial defense candidate",
    claim: "The system resists defined attacks without breaking legitimate workflows.",
    unit: "outcome",
    taskSet: "Threat-modelled adversarial and benign controls",
    population: "Prompt injection, data exfiltration, abuse, and false-positive cases",
    metric: "defense-success-rate",
    threshold: 0.97,
    trials: 240,
    failures: ["Protected data disclosure", "Unauthorized privileged action"],
    sources: ["nist-ai-measurement", "nist-ai-800-3"],
  },
  "world-model": {
    subject: "Predictive world-model candidate",
    claim: "The model predicts task-relevant state transitions under distribution shifts.",
    unit: "outcome",
    taskSet: "Pinned simulation rollouts and counterfactual probes",
    population: "Nominal, sparse, perturbed, and held-out environments",
    metric: "valid-rollout-rate",
    threshold: 0.85,
    trials: 180,
    failures: ["Physically invalid transition accepted as reliable"],
    sources: ["nist-ai-measurement", "nist-ai-800-3"],
  },
  "physical-ai": {
    subject: "Embodied task policy candidate",
    claim: "The policy completes the task safely within the operating envelope.",
    unit: "outcome",
    taskSet: "Versioned simulation and supervised physical trials",
    population: "Nominal, occluded, perturbed, and safe-stop scenarios",
    metric: "safe-completion-rate",
    threshold: 0.9,
    trials: 120,
    failures: ["Safety-envelope breach", "Failure to enter a safe state"],
    sources: ["nist-ai-measurement", "nist-ai-800-3"],
  },
};

function makeContract(targetId: TargetId): EvaluationContract {
  const detail = targetDetails[targetId];
  const layers = Object.fromEntries(
    LAYER_IDS.map((layerId) => [
      layerId,
      {
        applicable: true,
        status: "covered",
        rationale: `Planning example: ${layerId} evidence is required and reviewed for this target.`,
        evidenceSourceIds: detail.sources,
      },
    ]),
  );

  return evaluationContractSchema.parse({
    schemaVersion: 1,
    id: `${targetId}-reference-contract`,
    targetId,
    subject: detail.subject,
    subjectVersion: "planning-example-1",
    claim: detail.claim,
    unit: detail.unit,
    taskSet: detail.taskSet,
    population: detail.population,
    successCriteria: `Meet ${detail.metric} threshold with no critical failures; planning example only, not a benchmark result.`,
    threshold: { metric: detail.metric, operator: ">=", value: detail.threshold, unit: "ratio" },
    trials: detail.trials,
    samplingRationale: "Stratified cases cover normal operation, difficult edges, and explicitly defined failures.",
    graders: [
      { id: `${targetId}-rule-grader`, family: "rule", label: "Deterministic release checks", critical: true },
      { id: `${targetId}-human-grader`, family: "human", label: "Blind expert review", critical: true },
    ],
    arbitrationRule: "Any critical grader failure blocks release; disagreements receive blind expert adjudication.",
    criticalFailures: detail.failures,
    environmentAssumptions: ["Pinned task, data, runtime, grader, and dependency versions"],
    evidenceTier: "official_guidance",
    evidenceSourceIds: detail.sources,
    reviewDate: "2026-12-01",
    uncertaintyAcknowledged: true,
    layers,
  });
}

export const referenceContracts = (
  Object.keys(targetDetails) as TargetId[]
).map(makeContract);
