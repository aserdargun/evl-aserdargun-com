import { describe, expect, it } from "vitest";

import { evaluateContract } from "../domain/evaluate-contract";
import { LAYER_IDS, parseContract } from "../domain/schemas";
import { evidenceSources } from "./evidence";
import { patterns } from "./patterns";
import { portfolioApps } from "./portfolio";
import { referenceContracts } from "./reference-contracts";
import { targets } from "./targets";

describe("bundled EVL data", () => {
  it("provides one valid reference contract for every target", () => {
    expect(targets).toHaveLength(7);
    expect(targets.map(({ id }) => id).sort()).toEqual(
      referenceContracts.map(({ targetId }) => targetId).sort(),
    );
    referenceContracts.forEach((contract) =>
      expect(() => parseContract(contract)).not.toThrow(),
    );
  });

  it("resolves every evidence reference used by contracts and patterns", () => {
    const sourceIds = new Set(evidenceSources.map(({ id }) => id));
    const contractReferences = referenceContracts.flatMap((contract) => [
      ...contract.evidenceSourceIds,
      ...LAYER_IDS.flatMap(
        (layerId) => contract.layers[layerId].evidenceSourceIds,
      ),
    ]);
    const patternReferences = patterns.flatMap(
      ({ evidenceSourceIds }) => evidenceSourceIds,
    );

    expect(
      [...contractReferences, ...patternReferences].every((id) =>
        sourceIds.has(id),
      ),
    ).toBe(true);
  });

  it("keeps target IDs and source IDs unique", () => {
    expect(new Set(targets.map(({ id }) => id)).size).toBe(targets.length);
    expect(new Set(evidenceSources.map(({ id }) => id)).size).toBe(
      evidenceSources.length,
    );
  });

  it("ships reference contracts that start at ready", () => {
    for (const contract of referenceContracts) {
      const target = targets.find(({ id }) => id === contract.targetId);
      expect(target).toBeDefined();
      expect(
        evaluateContract(
          contract,
          target!,
          evidenceSources,
          "2026-09-03T06:00:00.000Z",
        ).gate,
      ).toBe("ready");
    }
  });

  it("marks CTX planned and every active relationship link as HTTPS", () => {
    expect(portfolioApps.find(({ code }) => code === "ctx")?.status).toBe(
      "planned",
    );
    expect(
      portfolioApps
        .filter(({ status }) => status === "active")
        .every(({ url }) => url?.startsWith("https://")),
    ).toBe(true);
    expect(portfolioApps.find(({ code }) => code === "ctx")?.url).toBeUndefined();
  });
});
