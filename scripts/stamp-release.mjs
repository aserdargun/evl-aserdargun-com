import { execFile as execFileCallback } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const execFile = promisify(execFileCallback);

function option(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

const output = option("--output");
if (!output) throw new Error("--output is required");

let sha = option("--sha");
if (process.argv.includes("--git-head")) {
  const result = await execFile("git", ["rev-parse", "HEAD"]);
  sha = result.stdout.trim().toLowerCase();
}
if (!sha || !/^[0-9a-f]{40}$/.test(sha)) throw new Error("Release SHA must be 40 lowercase hexadecimal characters");

const builtAt = option("--built-at") ?? new Date().toISOString();
if (Number.isNaN(new Date(builtAt).getTime())) throw new Error("Release timestamp must be valid ISO-8601");

await mkdir(path.dirname(output), { recursive: true });
await writeFile(output, `${JSON.stringify({ repository: "aserdargun/evl-aserdargun-com", sha, builtAt }, null, 2)}\n`, "utf8");
