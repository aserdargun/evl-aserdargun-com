import { describe, expect, it } from "vitest";

import { parseContract, parseResult } from "./schemas";

const layer = (status: "covered" | "partial" | "missing") => ({
  applicable: true,
  status,
  rationale: "This layer is measured with named evidence.",
  evidenceSourceIds: ["anthropic-agent-evals"],
});

const completeContractFixture = {
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
  evidenceSourceIds: ["anthropic-agent-evals", "nist-ai-measurement"],
  reviewDate: "2026-09-30",
  uncertaintyAcknowledged: true,
  layers: {
    output: layer("covered"),
    trajectory: layer("covered"),
    outcome: layer("covered"),
    robustness: layer("partial"),
    safety: layer("covered"),
    operations: layer("partial"),
  },
};

describe("EvaluationContract schema", () => {
  it("accepts a complete mixed-unit contract", () => {
    expect(parseContract(completeContractFixture).targetId).toBe("agent");
  });

  it("rejects fewer than three trials", () => {
    expect(() => parseContract({ ...completeContractFixture, trials: 2 })).toThrow();
  });

  it("rejects an applicable layer without a rationale", () => {
    const layers = structuredClone(completeContractFixture.layers);
    layers.output.rationale = "";

    expect(() => parseContract({ ...completeContractFixture, layers })).toThrow();
  });

  it("rejects a not-applicable layer that is marked applicable", () => {
    const layers = structuredClone(completeContractFixture.layers);
    layers.operations.status = "not_applicable" as "covered";

    expect(() => parseContract({ ...completeContractFixture, layers })).toThrow();
  });
});

describe("EvaluationResult schema", () => {
  it("rejects a result without all six layer assessments", () => {
    expect(() =>
      parseResult({
        engineVersion: "1.0.0",
        evaluatedAt: "2026-09-03T00:00:00.000Z",
        gate: "ready",
        findings: [],
        layerAssessments: [],
      }),
    ).toThrow();
  });
});
