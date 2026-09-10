import { describe, expect, it } from "vitest";

import { referenceContracts } from "../data/reference-contracts";
import {
  STORAGE_KEY,
  clearWorkbench,
  loadWorkbench,
  saveWorkbench,
} from "./persistence";

const state = {
  schemaVersion: 1 as const,
  selectedTargetId: "agent" as const,
  contract: referenceContracts.find(({ targetId }) => targetId === "agent")!,
};

describe("workbench persistence", () => {
  it("round-trips only the selected target and working contract", () => {
    expect(saveWorkbench(localStorage, state)).toBe(true);
    expect(loadWorkbench(localStorage)).toEqual({ status: "loaded", state });
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).not.toHaveProperty(
      "evidenceSources",
    );
  });

  it("reports unsupported schemas without coercing or erasing them", () => {
    const unsupported = JSON.stringify({ ...state, schemaVersion: 99 });
    localStorage.setItem(STORAGE_KEY, unsupported);
    expect(loadWorkbench(localStorage)).toEqual({ status: "unsupported" });
    expect(localStorage.getItem(STORAGE_KEY)).toBe(unsupported);
  });

  it("recovers from invalid JSON and storage access failures", () => {
    localStorage.setItem(STORAGE_KEY, "{");
    expect(loadWorkbench(localStorage)).toEqual({ status: "invalid" });

    const failingStorage = {
      getItem: () => {
        throw new Error("blocked");
      },
    } as unknown as Storage;
    expect(loadWorkbench(failingStorage)).toEqual({ status: "unavailable" });
  });

  it("clears only EVL workbench state", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    localStorage.setItem("other", "keep");
    expect(clearWorkbench(localStorage)).toBe(true);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    expect(localStorage.getItem("other")).toBe("keep");
  });
});

it("preserves a future storage version when an edit attempts to save", () => {
  const future = JSON.stringify({ ...state, schemaVersion: 99 });
  localStorage.setItem(STORAGE_KEY, future);
  expect(saveWorkbench(localStorage, state)).toBe(false);
  expect(localStorage.getItem(STORAGE_KEY)).toBe(future);
});

it("rejects a mismatched target before writing", () => {
  expect(saveWorkbench(localStorage, { ...state, selectedTargetId: "model" })).toBe(false);
  expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
});
