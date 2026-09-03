import test from "node:test";

import { verifyArtifact } from "../scripts/artifact-contract.mjs";

test("built EVL output satisfies the Azure Static Web Apps contract", async () => {
  await verifyArtifact();
});
