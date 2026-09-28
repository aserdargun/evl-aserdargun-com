import { portfolioAppSchema, type TargetId } from "../domain/schemas";
import lock from "./portfolio.lock.json";

// Public identities come from the canonical manifest in the sibling aserdargun-com
// repo (data/living-system.json), projected into the committed
// ./portfolio.lock.json. Refresh it with `npm run sync:portfolio`; the tests in
// ./portfolio.sync.test.ts fail if this module and the lock disagree.
//
// The GROUPING below is local editorial taxonomy — which application informs which
// evaluation target is an EVL decision, not something the manifest can derive.
export const portfolioGroups = [
  { targetId: "model", codes: ["usl", "adp"] },
  { targetId: "inference", codes: ["llm", "tfl", "lcl", "cld", "dcl"] },
  { targetId: "retrieval", codes: ["ctx", "mem"] },
  { targetId: "agent", codes: ["hns", "arl", "dpl", "cul", "aos"] },
  { targetId: "security", codes: ["sec"] },
  { targetId: "world-model", codes: ["wfm", "wml"] },
  { targetId: "physical-ai", codes: ["itl", "pdt", "dtr", "eng", "hex"] },
] as const satisfies readonly { targetId: TargetId; codes: readonly string[] }[];

interface LockedApplication {
  code: string;
  address: string;
  focusState: string;
  status: string;
}

const lockedApps: readonly LockedApplication[] = lock.applications;
const lockedByCode = new Map(lockedApps.map((application) => [application.code, application]));

/**
 * The manifest tracks four focus states; EVL's `status` enum is two-valued
 * ("active" | "planned") and is rendered only as a link class, never as a claim
 * about integration depth. Every application EVL links is a published, reachable
 * lab, so all four states currently resolve to "active".
 *
 * The mapping is exhaustive on purpose: a new focusState upstream throws instead
 * of being silently coerced, which is what keeps `status` derived rather than
 * hardcoded.
 */
const STATUS_BY_FOCUS_STATE: Readonly<Record<string, "active" | "planned">> = {
  active: "active",
  assurance: "active",
  foundation: "active",
  horizon: "active",
};

export function portfolioStatusFor(focusState: string): "active" | "planned" {
  const status = STATUS_BY_FOCUS_STATE[focusState];
  if (status === undefined) {
    throw new Error(
      `Manifest focusState "${focusState}" has no EVL status mapping. ` +
        "Add an explicit entry to STATUS_BY_FOCUS_STATE in src/data/portfolio.ts.",
    );
  }
  return status;
}

function lockedApplication(code: string): LockedApplication {
  const application = lockedByCode.get(code);
  if (application === undefined) {
    throw new Error(
      `Application code "${code}" is not in src/data/portfolio.lock.json. Run \`npm run sync:portfolio\`.`,
    );
  }
  return application;
}

export const portfolioApps = portfolioGroups.flatMap(({ codes }) =>
  codes.map((code) => {
    const application = lockedApplication(code);
    return portfolioAppSchema.parse({
      code,
      labelKey: `portfolio.${code}`,
      roleKey: `portfolio.${code}.role`,
      status: portfolioStatusFor(application.focusState),
      url: application.address,
    });
  }),
);
