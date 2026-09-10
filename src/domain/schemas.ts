import { z } from "zod";

export const LAYER_IDS = [
  "output",
  "trajectory",
  "outcome",
  "robustness",
  "safety",
  "operations",
] as const;
export const COVERAGE_STATES = [
  "covered",
  "partial",
  "missing",
  "not_applicable",
] as const;
export const GRADER_FAMILIES = [
  "rule",
  "executable",
  "statistical",
  "human",
  "model",
] as const;
export const GATE_STATES = ["ready", "conditional", "hold"] as const;
export const EVIDENCE_TIERS = [
  "standard",
  "official_guidance",
  "research",
  "case_study",
] as const;
export const TARGET_IDS = [
  "model",
  "inference",
  "retrieval",
  "agent",
  "security",
  "world-model",
  "physical-ai",
] as const;

const slug = z.string().trim().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const nonEmptyText = z.string().trim().min(1);
const isoDate = z.iso.date();
const isoDateTime = z.iso.datetime({ offset: true });

export const layerIdSchema = z.enum(LAYER_IDS);
export const coverageStateSchema = z.enum(COVERAGE_STATES);
export const graderFamilySchema = z.enum(GRADER_FAMILIES);
export const gateStateSchema = z.enum(GATE_STATES);
export const evidenceTierSchema = z.enum(EVIDENCE_TIERS);
export const targetIdSchema = z.enum(TARGET_IDS);

export const layerEvidenceSchema = z
  .object({
    applicable: z.boolean(),
    status: coverageStateSchema,
    rationale: nonEmptyText,
    evidenceSourceIds: z.array(slug),
  })
  .superRefine((value, context) => {
    if (value.applicable && value.status === "not_applicable") {
      context.addIssue({
        code: "custom",
        path: ["status"],
        message: "An applicable layer cannot be marked not applicable.",
      });
    }
    if (!value.applicable && value.status !== "not_applicable") {
      context.addIssue({
        code: "custom",
        path: ["status"],
        message: "A non-applicable layer must use not_applicable status.",
      });
    }
  });

export const graderSchema = z.object({
  id: slug,
  family: graderFamilySchema,
  label: nonEmptyText,
  critical: z.boolean(),
});

export const evaluationContractSchema = z.object({
  schemaVersion: z.literal(1),
  id: slug,
  targetId: targetIdSchema,
  subject: nonEmptyText,
  subjectVersion: nonEmptyText,
  claim: nonEmptyText,
  unit: z.enum(["output", "trajectory", "outcome", "mixed"]),
  taskSet: nonEmptyText,
  population: nonEmptyText,
  successCriteria: nonEmptyText,
  threshold: z.object({
    metric: slug,
    operator: z.enum([">=", "<=", ">", "<", "="]),
    value: z.number().finite(),
    unit: nonEmptyText,
  }).superRefine((threshold, context) => {
    if (threshold.unit === "ratio" && (threshold.value < 0 || threshold.value > 1)) {
      context.addIssue({ code: "custom", path: ["value"], message: "A ratio must be between 0 and 1." });
    }
  }),
  trials: z.number().int().min(3),
  samplingRationale: nonEmptyText,
  graders: z.array(graderSchema).min(1),
  arbitrationRule: nonEmptyText,
  criticalFailures: z.array(nonEmptyText).min(1),
  environmentAssumptions: z.array(nonEmptyText).min(1),
  evidenceTier: evidenceTierSchema,
  evidenceSourceIds: z.array(slug).min(1),
  reviewDate: isoDate,
  uncertaintyAcknowledged: z.boolean(),
  layers: z.record(layerIdSchema, layerEvidenceSchema),
});

export const evaluationTargetSchema = z.object({
  id: targetIdSchema,
  labelKey: nonEmptyText,
  descriptionKey: nonEmptyText,
  icon: z.enum([
    "cube",
    "server",
    "search",
    "agent",
    "shield",
    "globe",
    "robot",
  ]),
  criticalLayers: z.array(layerIdSchema).min(1),
});

export const evidenceSourceSchema = z.object({
  id: slug,
  title: nonEmptyText,
  organization: nonEmptyText,
  url: z.url({ protocol: /^https$/ }),
  publishedAt: isoDate.nullable(),
  verifiedAt: isoDate,
  tier: evidenceTierSchema,
  supportedPatternIds: z.array(slug).min(1),
  limitationKey: nonEmptyText,
});

export const patternSchema = z.object({
  id: slug,
  titleKey: nonEmptyText,
  descriptionKey: nonEmptyText,
  layerIds: z.array(layerIdSchema).min(1),
  evidenceSourceIds: z.array(slug).min(1),
});

export const portfolioAppSchema = z.object({
  code: z.string().regex(/^[a-z]{3}$/),
  labelKey: nonEmptyText,
  roleKey: nonEmptyText,
  status: z.enum(["active", "planned"]),
  url: z.url({ protocol: /^https$/ }).optional(),
});

export const findingSchema = z.object({
  code: slug,
  severity: z.enum(["blocker", "warning", "info"]),
  layerId: layerIdSchema.optional(),
  messageKey: nonEmptyText,
  details: nonEmptyText,
});

export const layerAssessmentSchema = z.object({
  layerId: layerIdSchema,
  status: coverageStateSchema,
  critical: z.boolean(),
  rationale: nonEmptyText,
});

export const evaluationResultSchema = z
  .object({
    engineVersion: z.string().regex(/^\d+\.\d+\.\d+$/),
    evaluatedAt: isoDateTime,
    gate: gateStateSchema,
    findings: z.array(findingSchema),
    layerAssessments: z.array(layerAssessmentSchema).length(LAYER_IDS.length),
  })
  .superRefine((result, context) => {
    const ids = new Set(result.layerAssessments.map(({ layerId }) => layerId));
    if (ids.size !== LAYER_IDS.length) {
      context.addIssue({
        code: "custom",
        path: ["layerAssessments"],
        message: "Every layer must have exactly one assessment.",
      });
    }
  });

// Drafts retain incomplete edits; the strict contract schema gates evaluation/export.
export const draftContractSchema = evaluationContractSchema.extend({
  subject: z.string(), subjectVersion: z.string(), claim: z.string(),
  taskSet: z.string(), population: z.string(), successCriteria: z.string(),
  samplingRationale: z.string(), arbitrationRule: z.string(), reviewDate: z.string(),
  trials: z.number().nullable(), criticalFailures: z.array(z.string()),
  environmentAssumptions: z.array(z.string()),
  threshold: z.object({
    metric: slug, operator: z.enum([">=", "<=", ">", "<", "="]),
    value: z.number().nullable(), unit: nonEmptyText,
  }),
});

export const persistedWorkbenchSchema = z.object({
  schemaVersion: z.literal(1),
  selectedTargetId: targetIdSchema,
  contract: draftContractSchema,
  drafts: z.partialRecord(targetIdSchema, draftContractSchema).optional(),
}).superRefine((state, context) => {
  if (state.selectedTargetId !== state.contract.targetId ||
      Object.entries(state.drafts ?? {}).some(([id, contract]) => id !== contract.targetId)) {
    context.addIssue({ code: "custom", message: "Draft target does not match its key." });
  }
});

export const exportEnvelopeSchema = z.object({
  schemaVersion: z.literal(1),
  engineVersion: z.string().regex(/^\d+\.\d+\.\d+$/),
  exportedAt: isoDateTime,
  assessmentScope: z.literal("contract-planning-only").default("contract-planning-only"),
  contract: evaluationContractSchema,
  result: evaluationResultSchema,
  sources: z.array(evidenceSourceSchema),
});

export type LayerId = (typeof LAYER_IDS)[number];
export type CoverageState = (typeof COVERAGE_STATES)[number];
export type GraderFamily = (typeof GRADER_FAMILIES)[number];
export type GateState = (typeof GATE_STATES)[number];
export type EvidenceTier = (typeof EVIDENCE_TIERS)[number];
export type TargetId = (typeof TARGET_IDS)[number];
export type LayerEvidence = z.infer<typeof layerEvidenceSchema>;
export type Grader = z.infer<typeof graderSchema>;
export type ContractDraft = z.infer<typeof draftContractSchema>;
export type EvaluationContract = z.infer<typeof evaluationContractSchema>;
export type EvaluationTarget = z.infer<typeof evaluationTargetSchema>;
export type EvidenceSource = z.infer<typeof evidenceSourceSchema>;
export type EvaluationPattern = z.infer<typeof patternSchema>;
export type PortfolioApp = z.infer<typeof portfolioAppSchema>;
export type Finding = z.infer<typeof findingSchema>;
export type LayerAssessment = z.infer<typeof layerAssessmentSchema>;
export type EvaluationResult = z.infer<typeof evaluationResultSchema>;
export type PersistedWorkbench = z.infer<typeof persistedWorkbenchSchema>;
export type ExportEnvelope = z.infer<typeof exportEnvelopeSchema>;

export function parseContract(value: unknown): EvaluationContract {
  return evaluationContractSchema.parse(value);
}

export function parseResult(value: unknown): EvaluationResult {
  return evaluationResultSchema.parse(value);
}
