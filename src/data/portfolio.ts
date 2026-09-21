import { portfolioAppSchema, type TargetId } from "../domain/schemas";

// Curated from the public aserdargun-com registry on 2026-09-21.
// These are learning relationships, never evaluation inputs or runtime integrations.
export const portfolioGroups = [
  { targetId: "model", codes: ["usl", "adp"] },
  { targetId: "inference", codes: ["llm", "tfl", "lcl", "cld", "dcl"] },
  { targetId: "retrieval", codes: ["ctx", "mem"] },
  { targetId: "agent", codes: ["hns", "arl", "dpl", "cul", "aos"] },
  { targetId: "security", codes: ["sec"] },
  { targetId: "world-model", codes: ["wfm", "wml"] },
  { targetId: "physical-ai", codes: ["itl", "pdt", "dtr", "eng", "hex"] },
] as const satisfies readonly { targetId: TargetId; codes: readonly string[] }[];

export const portfolioApps = portfolioGroups.flatMap(({ codes }) =>
  codes.map((code) => portfolioAppSchema.parse({
    code,
    labelKey: `portfolio.${code}`,
    roleKey: `portfolio.${code}.role`,
    status: "active",
    url: `https://${code}.aserdargun.com`,
  })),
);
