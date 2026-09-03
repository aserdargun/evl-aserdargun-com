import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import test from "node:test";

import { stopPreview } from "./stop-preview.mjs";

const repositoryRoot = path.resolve(import.meta.dirname, "..");

function spawnListener(cwd) {
  const child = spawn(
    process.execPath,
    ["-e", "require('http').createServer((_,res)=>res.end('ok')).listen(0,'127.0.0.1',function(){console.log(this.address().port)})"],
    { cwd, stdio: ["ignore", "pipe", "inherit"] },
  );
  return new Promise((resolve, reject) => {
    child.once("error", reject);
    child.stdout.once("data", (chunk) => resolve({ child, port: Number(String(chunk).trim()) }));
  });
}

function waitForChildExit(child) {
  return child.exitCode === null && child.signalCode === null
    ? new Promise((resolve) => child.once("exit", resolve))
    : Promise.resolve();
}

test("stops a listener owned by this checkout", async () => {
  const { child, port } = await spawnListener(repositoryRoot);
  const result = await stopPreview({ port, repositoryRoot });
  assert.equal(result.status, "stopped");
  await waitForChildExit(child);
});

test("refuses a listener owned by another working directory", async () => {
  const foreignDirectory = await mkdtemp(path.join(tmpdir(), "evl-stop-foreign-"));
  const { child, port } = await spawnListener(foreignDirectory);
  try {
    const result = await stopPreview({ port, repositoryRoot });
    assert.equal(result.status, "foreign");
    assert.equal(child.exitCode, null);
  } finally {
    child.kill("SIGTERM");
    await waitForChildExit(child);
    await rm(foreignDirectory, { recursive: true, force: true });
  }
});

test("returns success when the port is already free", async () => {
  const result = await stopPreview({ port: 49_999, repositoryRoot });
  assert.equal(result.status, "free");
});
