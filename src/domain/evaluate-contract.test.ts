import { describe, expect, it } from "vitest";

import { evaluateContract } from "./evaluate-contract";
import {
  parseContract,
  type EvidenceSource,
  type EvaluationContract,
  type EvaluationTarget,
  type LayerId,
} from "./schemas";

const NOW = "2026-09-03T06:00:00.000Z";

const source = (id: string): EvidenceSource => ({
  id,
  title: `Source ${id}`,
  organization: "Measurement Institute",
  url: `https://example.com/${id}`,
  publishedAt: "2026-01-09",
  verifiedAt: "2026-09-03",
  tier: "official_guidance",
  supportedPatternIds: ["outcome-verification"],
  limitationKey: "source.limit.general",
});

const sources = [source("source-a"), source("source-b")];

const agentTarget: EvaluationTarget = {
  id: "agent",
  labelKey: "target.agent",
  descriptionKey: "target.agent.description",
  icon: "agent",
  criticalLayers: ["trajectory", "outcome", "safety"],
};

const modelTarget: EvaluationTarget = {
  id: "model",
  labelKey: "target.model",
  descriptionKey: "target.model.description",
  icon: "cube",
  criticalLayers: ["output", "robustness"],
};

const coveredLayer = () => ({
  applicable: true as const,
  status: "covered" as const,
  rationale: "Named evidence and an explicit threshold cover this layer.",
  evidenceSourceIds: ["source-a"],
});

const readyFixture = (): EvaluationContract =>
  parseContract({
    schemaVersion: 1,
    id: "agent-support-v1",
    targetId: "agent",
    subject: "Support agent",
    subjectVersion: "2.3.1",
    claim: "Agent completes tasks correctly and safely",
    unit: "mixed",
    taskSet: "Customer Support Tasks v1.0",
    population: "Refund, cancellation, and escalation cases",
    successCriteria: "At least 90% successful outcomes and no unauthorized action",
    threshold: {
      metric: "task-success-rate",
      operator: ">=",
      value: 0.9,
      unit: "ratio",
    },
    trials: 300,
    samplingRationale: "Stratified task templates across three deterministic seeds.",
    graders: [
      {
        id: "policy-rules",
        family: "rule",
        label: "Policy rule grader",
        critical: true,
      },
      {
        id: "outcome-check",
        family: "executable",
        label: "Environment outcome check",
        critical: true,
      },
    ],
    arbitrationRule: "Any critical grader failure blocks release.",
    criticalFailures: [
      "Unauthorized tool call",
      "Claimed action without environment outcome",
    ],
    environmentAssumptions: [
      "Sandboxed tool environment",
      "Deterministic fixture reset",
    ],
    evidenceTier: "official_guidance",
    evidenceSourceIds: ["source-a", "source-b"],
    reviewDate: "2026-12-01",
    uncertaintyAcknowledged: true,
    layers: {
      output: coveredLayer(),
      trajectory: coveredLayer(),
      outcome: coveredLayer(),
      robustness: coveredLayer(),
      safety: coveredLayer(),
      operations: coveredLayer(),
    },
  });

function withLayer(
  layerId: LayerId,
  status: "covered" | "partial" | "missing",
): EvaluationContract {
  const contract = structuredClone(readyFixture());
  contract.layers[layerId].status = status;
  if (status === "missing") contract.layers[layerId].evidenceSourceIds = [];
  return contract;
}

describe("evaluateContract", () => {
  it("returns hold when any critical layer is not covered", () => {
    const result = evaluateContract(
      withLayer("safety", "partial"),
      agentTarget,
      sources,
      NOW,
    );

    expect(result.gate).toBe("hold");
    expect(result.findings[0]?.code).toBe("critical-layer-not-covered");
  });

  it("returns hold when a model grader is the sole critical-safety evidence", () => {
    const contract = readyFixture();
    contract.graders = [
      {
        id: "model-judge",
        family: "model",
        label: "Model judge",
        critical: true,
      },
    ];

    const result = evaluateContract(contract, agentTarget, sources, NOW);

    expect(result.gate).toBe("hold");
    expect(result.findings.map(({ code }) => code)).toContain(
      "model-only-critical-safety",
    );
  });

  it("returns conditional for partial non-critical coverage", () => {
    const contract = withLayer("operations", "partial");
    contract.targetId = "model";

    expect(evaluateContract(contract, modelTarget, sources, NOW).gate).toBe(
      "conditional",
    );
  });

  it("returns conditional when review is due within thirty days", () => {
    const contract = readyFixture();
    contract.reviewDate = "2026-09-20";

    const result = evaluateContract(contract, agentTarget, sources, NOW);

    expect(result.gate).toBe("conditional");
    expect(result.findings.map(({ code }) => code)).toContain("review-due-soon");
  });

  it("returns hold when the review date is overdue", () => {
    const contract = readyFixture();
    contract.reviewDate = "2026-09-02";

    const result = evaluateContract(contract, agentTarget, sources, NOW);

    expect(result.gate).toBe("hold");
    expect(result.findings.map(({ code }) => code)).toContain("review-overdue");
  });

  it("returns hold for an unresolved evidence reference", () => {
    const contract = readyFixture();
    contract.layers.output.evidenceSourceIds = ["missing-source"];

    const result = evaluateContract(contract, agentTarget, sources, NOW);

    expect(result.gate).toBe("hold");
    expect(result.findings[0]?.code).toBe("invalid-evidence-reference");
  });

  it("returns hold when critical failures are empty even if parsing was bypassed", () => {
    const contract = readyFixture();
    contract.criticalFailures = [];

    const result = evaluateContract(contract, agentTarget, sources, NOW);

    expect(result.gate).toBe("hold");
    expect(result.findings.map(({ code }) => code)).toContain(
      "critical-failures-undefined",
    );
  });

  it("returns hold when uncertainty is not acknowledged", () => {
    const contract = readyFixture();
    contract.uncertaintyAcknowledged = false;

    const result = evaluateContract(contract, agentTarget, sources, NOW);

    expect(result.gate).toBe("hold");
    expect(result.findings.map(({ code }) => code)).toContain(
      "uncertainty-unacknowledged",
    );
  });

  it("returns hold when the target and contract disagree", () => {
    const contract = readyFixture();
    contract.targetId = "model";

    const result = evaluateContract(contract, agentTarget, sources, NOW);

    expect(result.gate).toBe("hold");
    expect(result.findings[0]?.code).toBe("target-mismatch");
  });

  it("returns hold when referenced evidence has not been verified for a year", () => {
    const staleSources = sources.map((item) => ({
      ...item,
      verifiedAt: "2025-01-01",
    }));

    const result = evaluateContract(
      readyFixture(),
      agentTarget,
      staleSources,
      NOW,
    );

    expect(result.gate).toBe("hold");
    expect(result.findings.map(({ code }) => code)).toContain("evidence-stale");
  });

  it("returns ready only for complete current evidence", () => {
    const result = evaluateContract(readyFixture(), agentTarget, sources, NOW);

    expect(result.gate).toBe("ready");
    expect(result.findings).toEqual([]);
    expect(result.layerAssessments).toHaveLength(6);
  });

  it("orders blocker findings by stable rule order", () => {
    const contract = withLayer("safety", "missing");
    contract.layers.output.evidenceSourceIds = ["missing-source"];

    const result = evaluateContract(contract, agentTarget, sources, NOW);

    expect(result.findings.slice(0, 2).map(({ code }) => code)).toEqual([
      "invalid-evidence-reference",
      "critical-layer-not-covered",
    ]);
  });

  it("is deterministic when all inputs and the clock are fixed", () => {
    expect(evaluateContract(readyFixture(), agentTarget, sources, NOW)).toEqual(
      evaluateContract(readyFixture(), agentTarget, sources, NOW),
    );
  });

  it("throws for an invalid evaluation timestamp", () => {
    expect(() =>
      evaluateContract(readyFixture(), agentTarget, sources, "not-a-date"),
    ).toThrow("Invalid evaluation timestamp");
  });
});
