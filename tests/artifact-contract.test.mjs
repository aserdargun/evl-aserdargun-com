import test from "node:test";

import { verifyArtifact, verifyWorkflow } from "../scripts/artifact-contract.mjs";

test("built EVL output satisfies the Azure Static Web Apps contract", async () => {
  await verifyArtifact();
});

test("production workflow is pinned to the exact EVL deployment contract", async () => {
  await verifyWorkflow();
});
