import { describe, expect, it } from "vitest";

import { portfolioApps, portfolioGroups, portfolioStatusFor } from "./portfolio";
import lock from "./portfolio.lock.json";

// The canonical manifest lives in the sibling aserdargun-com repo
// (data/living-system.json). ./portfolio.lock.json is a committed projection of
// the fields src/data/portfolio.ts derives from; refresh it with
// `npm run sync:portfolio`. CI has no network access, so this lock is the
// contract these assertions run against.
interface LockedApplication {
  code: string;
  address: string;
  focusState: string;
  status: string;
}

const locked = lock.applications as LockedApplication[];
const lockedByCode = new Map(locked.map((application) => [application.code, application]));

describe("portfolio data against the canonical portfolio lock", () => {
  it("stamps the lock with its canonical source and no extra fields", () => {
    expect(lock.source).toBe("aserdargun-com/data/living-system.json");
    for (const application of locked) {
      expect(Object.keys(application)).toEqual([
        "code",
        "address",
        "focusState",
        "status",
      ]);
    }
  });

  it("resolves every grouped code against the lock", () => {
    const groupedCodes = portfolioGroups.flatMap(({ codes }) => [...codes]);
    for (const code of groupedCodes) {
      expect(lockedByCode.has(code), `${code} is not in portfolio.lock.json`).toBe(
        true,
      );
    }
  });

  it("covers every locked code exactly once across the seven targets", () => {
    expect(portfolioGroups).toHaveLength(7);
    const groupedCodes = portfolioGroups.flatMap(({ codes }) => [...codes]);
    expect(new Set(groupedCodes).size).toBe(groupedCodes.length);
    expect([...groupedCodes].sort()).toEqual(locked.map(({ code }) => code).sort());
  });

  it("derives every app url from the canonical manifest address", () => {
    for (const app of portfolioApps) {
      expect(app.url, `${app.code} url must equal the canonical manifest address`).toBe(
        lockedByCode.get(app.code)?.address,
      );
    }
  });

  it("derives every app status from the manifest focusState, never from a literal", () => {
    for (const app of portfolioApps) {
      const application = lockedByCode.get(app.code);
      expect(app.status).toBe(portfolioStatusFor(application!.focusState));
    }
  });

  it("maps every focusState the manifest currently uses, and refuses to coerce a new one", () => {
    const focusStates = new Set(locked.map(({ focusState }) => focusState));
    expect([...focusStates].sort()).toEqual([
      "active",
      "assurance",
      "foundation",
      "horizon",
    ]);
    for (const focusState of focusStates) {
      expect(["active", "planned"]).toContain(portfolioStatusFor(focusState));
    }
    expect(() => portfolioStatusFor("retired")).toThrow(
      /has no EVL status mapping/,
    );
  });

  it("keeps the lock free of anything but the four mirrored fields", () => {
    // The grouping stays local; the manifest must not grow a taxonomy field here.
    for (const app of portfolioApps) {
      expect(app.labelKey).toBe(`portfolio.${app.code}`);
      expect(app.roleKey).toBe(`portfolio.${app.code}.role`);
    }
  });
});
