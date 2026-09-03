import { describe, expect, it } from "vitest";

import { en } from "./en";
import { localeFromPath, pathForLocale, t } from "./index";
import { tr } from "./tr";

describe("locale catalogs", () => {
  it("keeps English and Turkish keys in exact parity", () => {
    expect(Object.keys(tr).sort()).toEqual(Object.keys(en).sort());
  });

  it("resolves supported locale routes and defaults unknown paths to English", () => {
    expect(localeFromPath("/tr")).toBe("tr");
    expect(localeFromPath("/tr/evidence")).toBe("tr");
    expect(localeFromPath("/en")).toBe("en");
    expect(localeFromPath("/unknown")).toBe("en");
    expect(pathForLocale("tr")).toBe("/tr");
  });

  it("returns the selected locale value for a typed message key", () => {
    expect(t("en", "gate.ready")).toBe("READY");
    expect(t("tr", "gate.ready")).toBe("HAZIR");
  });
});
