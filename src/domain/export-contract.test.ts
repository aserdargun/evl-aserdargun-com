import { describe, expect, it, vi } from "vitest";

import { evidenceSources } from "../data/evidence";
import { referenceContracts } from "../data/reference-contracts";
import { targets } from "../data/targets";
import { evaluateContract } from "./evaluate-contract";
import { buildExportEnvelope, downloadExport } from "./export-contract";

const NOW = "2026-09-03T06:00:00.000Z";
const contract = referenceContracts.find(({ targetId }) => targetId === "agent")!;
const target = targets.find(({ id }) => id === "agent")!;
const result = evaluateContract(contract, target, evidenceSources, NOW);

describe("evidence export", () => {
  it("exports a valid, deterministic envelope with only referenced sources", () => {
    const envelope = buildExportEnvelope(contract, result, evidenceSources, NOW);
    const json = JSON.stringify(envelope);

    expect(envelope.schemaVersion).toBe(1);
    expect(envelope.engineVersion).toBe(result.engineVersion);
    expect(envelope.exportedAt).toBe(NOW);
    expect(envelope.contract).toEqual(contract);
    expect(envelope.result).toEqual(result);
    expect(envelope.sources.map(({ id }) => id).sort()).toEqual(
      contract.evidenceSourceIds.slice().sort(),
    );
    expect(json).not.toContain("evl.workbench.v1");
    expect(json).not.toContain('"locale"');
    expect(json).not.toContain("userAgent");
  });

  it("clicks a generated download and always revokes its object URL", () => {
    const createObjectURL = vi.fn(() => "blob:evl-export");
    const revokeObjectURL = vi.fn();
    Object.defineProperties(window.URL, {
      createObjectURL: { configurable: true, value: createObjectURL },
      revokeObjectURL: { configurable: true, value: revokeObjectURL },
    });
    const click = vi.fn();
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
      if (tag === "a") return { click } as unknown as HTMLAnchorElement;
      return originalCreateElement(tag);
    });

    downloadExport(
      buildExportEnvelope(contract, result, evidenceSources, NOW),
      document,
    );

    expect(createObjectURL).toHaveBeenCalledOnce();
    expect(click).toHaveBeenCalledOnce();
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:evl-export");
  });
});
