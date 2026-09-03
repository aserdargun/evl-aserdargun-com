import {
  LAYER_IDS,
  parseResult,
  type EvidenceSource,
  type EvaluationContract,
  type EvaluationResult,
  type EvaluationTarget,
  type Finding,
  type LayerId,
} from "./schemas";

export const ENGINE_VERSION = "1.0.0";

type RuleContext = Readonly<{
  contract: EvaluationContract;
  target: EvaluationTarget;
  sources: readonly EvidenceSource[];
  sourceIds: ReadonlySet<string>;
  evaluatedAt: Date;
}>;

type EvaluationRule = (context: RuleContext) => Finding[];

const DAY_MS = 86_400_000;
const severityWeight: Record<Finding["severity"], number> = {
  blocker: 0,
  warning: 1,
  info: 2,
};

function finding(
  code: string,
  severity: Finding["severity"],
  details: string,
  layerId?: LayerId,
): Finding {
  return layerId === undefined
    ? { code, severity, messageKey: `finding.${code}`, details }
    : { code, severity, layerId, messageKey: `finding.${code}`, details };
}

function asUtcDate(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

function dateOnly(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}

function referencedSourceIds(contract: EvaluationContract): string[] {
  return [
    ...contract.evidenceSourceIds,
    ...LAYER_IDS.flatMap((layerId) => contract.layers[layerId].evidenceSourceIds),
  ];
}

const targetMismatchRule: EvaluationRule = ({ contract, target }) =>
  contract.targetId === target.id
    ? []
    : [
        finding(
          "target-mismatch",
          "blocker",
          `Contract target ${contract.targetId} does not match selected target ${target.id}.`,
        ),
      ];

const invalidEvidenceReferenceRule: EvaluationRule = ({ contract, sourceIds }) => {
  const invalidIds = [...new Set(referencedSourceIds(contract))].filter(
    (id) => !sourceIds.has(id),
  );
  return invalidIds.length === 0
    ? []
    : [
        finding(
          "invalid-evidence-reference",
          "blocker",
          `Unresolved evidence: ${invalidIds.join(", ")}.`,
        ),
      ];
};

const staleEvidenceRule: EvaluationRule = ({
  contract,
  sources,
  evaluatedAt,
}) => {
  const referenced = new Set(referencedSourceIds(contract));
  const currentDate = asUtcDate(evaluatedAt);
  const staleIds = sources
    .filter(({ id }) => referenced.has(id))
    .filter(({ verifiedAt }) => {
      const ageInDays = (currentDate.getTime() - dateOnly(verifiedAt).getTime()) / DAY_MS;
      return ageInDays > 365;
    })
    .map(({ id }) => id);

  return staleIds.length === 0
    ? []
    : [
        finding(
          "evidence-stale",
          "blocker",
          `Evidence has not been verified within 365 days: ${staleIds.join(", ")}.`,
        ),
      ];
};

const overdueReviewRule: EvaluationRule = ({ contract, evaluatedAt }) => {
  const daysUntilReview =
    (dateOnly(contract.reviewDate).getTime() - asUtcDate(evaluatedAt).getTime()) /
    DAY_MS;
  return daysUntilReview < 0
    ? [
        finding(
          "review-overdue",
          "blocker",
          `Review date ${contract.reviewDate} has passed.`,
        ),
      ]
    : [];
};

const missingCriticalFailureRule: EvaluationRule = ({ contract }) =>
  contract.criticalFailures.length > 0
    ? []
    : [
        finding(
          "critical-failures-undefined",
          "blocker",
          "At least one release-blocking failure must be defined.",
        ),
      ];

const uncertaintyRule: EvaluationRule = ({ contract }) =>
  contract.uncertaintyAcknowledged
    ? []
    : [
        finding(
          "uncertainty-unacknowledged",
          "blocker",
          "Evaluation uncertainty must be acknowledged.",
        ),
      ];

const criticalLayerRule: EvaluationRule = ({ contract, target }) =>
  target.criticalLayers.flatMap((layerId) => {
    const layer = contract.layers[layerId];
    return layer.status === "covered"
      ? []
      : [
          finding(
            "critical-layer-not-covered",
            "blocker",
            `Critical layer ${layerId} is ${layer.status}.`,
            layerId,
          ),
        ];
  });

const modelOnlyCriticalSafetyRule: EvaluationRule = ({ contract, target }) => {
  if (!target.criticalLayers.includes("safety")) return [];
  const hasNonModelGrader = contract.graders.some(
    ({ family }) => family !== "model",
  );
  return hasNonModelGrader
    ? []
    : [
        finding(
          "model-only-critical-safety",
          "blocker",
          "A model grader cannot be the sole evidence for critical safety.",
          "safety",
        ),
      ];
};

const incompleteNonCriticalLayerRule: EvaluationRule = ({ contract, target }) => {
  const criticalLayers = new Set(target.criticalLayers);
  return LAYER_IDS.flatMap((layerId) => {
    const layer = contract.layers[layerId];
    if (
      criticalLayers.has(layerId) ||
      layer.status === "covered" ||
      layer.status === "not_applicable"
    ) {
      return [];
    }
    return [
      finding(
        "noncritical-layer-incomplete",
        "warning",
        `Non-critical layer ${layerId} is ${layer.status}.`,
        layerId,
      ),
    ];
  });
};

const reviewDueSoonRule: EvaluationRule = ({ contract, evaluatedAt }) => {
  const daysUntilReview =
    (dateOnly(contract.reviewDate).getTime() - asUtcDate(evaluatedAt).getTime()) /
    DAY_MS;
  return daysUntilReview >= 0 && daysUntilReview <= 30
    ? [
        finding(
          "review-due-soon",
          "warning",
          `Review is due in ${String(daysUntilReview)} days.`,
        ),
      ]
    : [];
};

const rules: readonly EvaluationRule[] = [
  targetMismatchRule,
  invalidEvidenceReferenceRule,
  staleEvidenceRule,
  overdueReviewRule,
  missingCriticalFailureRule,
  uncertaintyRule,
  criticalLayerRule,
  modelOnlyCriticalSafetyRule,
  incompleteNonCriticalLayerRule,
  reviewDueSoonRule,
];

export function evaluateContract(
  contract: EvaluationContract,
  target: EvaluationTarget,
  sources: readonly EvidenceSource[],
  evaluatedAt: string,
): EvaluationResult {
  const evaluatedDate = new Date(evaluatedAt);
  if (Number.isNaN(evaluatedDate.getTime())) {
    throw new Error("Invalid evaluation timestamp");
  }

  const context: RuleContext = {
    contract,
    target,
    sources,
    sourceIds: new Set(sources.map(({ id }) => id)),
    evaluatedAt: evaluatedDate,
  };
  const findings = rules
    .flatMap((rule) => rule(context))
    .map((item, order) => ({ item, order }))
    .sort(
      (left, right) =>
        severityWeight[left.item.severity] - severityWeight[right.item.severity] ||
        left.order - right.order,
    )
    .map(({ item }) => item);

  const gate = findings.some(({ severity }) => severity === "blocker")
    ? "hold"
    : findings.some(({ severity }) => severity === "warning")
      ? "conditional"
      : "ready";

  return parseResult({
    engineVersion: ENGINE_VERSION,
    evaluatedAt: evaluatedDate.toISOString(),
    gate,
    findings,
    layerAssessments: LAYER_IDS.map((layerId) => ({
      layerId,
      status: contract.layers[layerId].status,
      critical: target.criticalLayers.includes(layerId),
      rationale: contract.layers[layerId].rationale,
    })),
  });
}
