import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { Locale } from "../i18n";
import { useWorkbench } from "./use-workbench";

const NOW = new Date("2026-09-03T06:00:00.000Z");

describe("useWorkbench", () => {
  it("preserves the working contract when locale changes", () => {
    const { result, rerender } = renderHook(
      ({ locale }) =>
        useWorkbench(locale, { storage: localStorage, now: () => NOW }),
      { initialProps: { locale: "en" as Locale } },
    );

    act(() => result.current.updateField("claim", "My measured claim"));
    rerender({ locale: "tr" });

    expect(result.current.contract.claim).toBe("My measured claim");
    expect(result.current.locale).toBe("tr");
  });

  it("moves the fail-closed gate to hold when a critical layer is missing", () => {
    const { result } = renderHook(() =>
      useWorkbench("en", { storage: localStorage, now: () => NOW }),
    );
    expect(result.current.result.gate).toBe("ready");

    act(() => result.current.updateLayer("outcome", "missing"));

    expect(result.current.result.gate).toBe("hold");
    expect(result.current.result.findings[0]?.code).toBe(
      "critical-layer-not-covered",
    );
  });

  it("switches to the selected target reference and can reset local edits", () => {
    const { result } = renderHook(() =>
      useWorkbench("en", { storage: localStorage, now: () => NOW }),
    );
    act(() => result.current.selectTarget("security"));
    expect(result.current.contract.targetId).toBe("security");

    act(() => result.current.updateField("claim", "Changed"));
    act(() => result.current.reset());
    expect(result.current.contract.claim).not.toBe("Changed");
    expect(result.current.contract.targetId).toBe("security");
  });

  it("keeps in-memory edits and reports a failed browser save", () => {
    const failingStorage = {
      getItem: () => null,
      setItem: () => {
        throw new Error("quota");
      },
      removeItem: () => undefined,
    } as unknown as Storage;
    const { result } = renderHook(() =>
      useWorkbench("en", { storage: failingStorage, now: () => NOW }),
    );

    act(() => result.current.updateField("claim", "Unsaved but safe"));

    expect(result.current.contract.claim).toBe("Unsaved but safe");
    expect(result.current.persistenceNotice).toBe("saveFailed");
  });
});
