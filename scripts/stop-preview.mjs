import { execFile as execFileCallback } from "node:child_process";
import { realpath } from "node:fs/promises";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const execFile = promisify(execFileCallback);

async function listenerPids(port) {
  try {
    const { stdout } = await execFile("lsof", [
      "-nP",
      `-iTCP:${String(port)}`,
      "-sTCP:LISTEN",
      "-t",
    ]);
    return [...new Set(stdout.split(/\s+/).filter(Boolean).map(Number))];
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === 1) return [];
    throw error;
  }
}

async function processCwd(pid) {
  try {
    const { stdout } = await execFile("lsof", ["-a", "-p", String(pid), "-d", "cwd", "-Fn"]);
    const pathLine = stdout.split("\n").find((line) => line.startsWith("n"));
    return pathLine ? realpath(pathLine.slice(1)) : null;
  } catch {
    return null;
  }
}

function isAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

async function waitForExit(pids, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (pids.every((pid) => !isAlive(pid))) return true;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  return pids.every((pid) => !isAlive(pid));
}

export async function stopPreview({ port, repositoryRoot }) {
  if (!Number.isInteger(port) || port < 1 || port > 65_535) throw new Error("Invalid port");
  const expectedRoot = await realpath(repositoryRoot);
  const pids = await listenerPids(port);
  if (pids.length === 0) return { status: "free", pids: [] };

  const ownership = await Promise.all(pids.map(async (pid) => ({ pid, cwd: await processCwd(pid) })));
  if (ownership.some(({ cwd }) => cwd !== expectedRoot)) {
    return { status: "foreign", pids, ownership };
  }

  pids.forEach((pid) => process.kill(pid, "SIGTERM"));
  if (!(await waitForExit(pids, 2_000))) {
    pids.filter(isAlive).forEach((pid) => process.kill(pid, "SIGKILL"));
    await waitForExit(pids, 1_000);
  }
  return { status: "stopped", pids };
}

async function main() {
  const portFlag = process.argv.indexOf("--port");
  const port = portFlag === -1 ? 4178 : Number(process.argv[portFlag + 1]);
  const { stdout } = await execFile("git", ["rev-parse", "--show-toplevel"]);
  const result = await stopPreview({ port, repositoryRoot: stdout.trim() });
  if (result.status === "foreign") {
    console.error(`Refusing to stop port ${String(port)} because its listener belongs to another working directory.`);
    process.exitCode = 2;
    return;
  }
  console.log(result.status === "free" ? `Port ${String(port)} is already free.` : `Stopped EVL preview on port ${String(port)}.`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  await main();
}
