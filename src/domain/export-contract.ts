import { LAYER_IDS, exportEnvelopeSchema, type EvidenceSource, type EvaluationContract, type EvaluationResult, type ExportEnvelope } from "./schemas";

function referencedSourceIds(contract: EvaluationContract): ReadonlySet<string> {
  return new Set([
    ...contract.evidenceSourceIds,
    ...LAYER_IDS.flatMap((layerId) => contract.layers[layerId].evidenceSourceIds),
  ]);
}

export function buildExportEnvelope(
  contract: EvaluationContract,
  result: EvaluationResult,
  sources: readonly EvidenceSource[],
  exportedAt: string,
): ExportEnvelope {
  const referenced = referencedSourceIds(contract);
  return exportEnvelopeSchema.parse({
    schemaVersion: 1,
    engineVersion: result.engineVersion,
    exportedAt,
    contract,
    result,
    sources: sources.filter(({ id }) => referenced.has(id)),
  });
}

export function downloadExport(
  envelope: ExportEnvelope,
  targetDocument: Document,
): void {
  const targetWindow = targetDocument.defaultView;
  if (!targetWindow) throw new Error("Export requires a browser document");
  const objectUrl = targetWindow.URL.createObjectURL(
    new targetWindow.Blob([`${JSON.stringify(envelope, null, 2)}\n`], {
      type: "application/json",
    }),
  );
  try {
    const link = targetDocument.createElement("a");
    link.href = objectUrl;
    link.download = `evl-${envelope.contract.targetId}-${envelope.exportedAt.slice(0, 10)}.json`;
    link.click();
  } finally {
    targetWindow.URL.revokeObjectURL(objectUrl);
  }
}
