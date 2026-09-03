import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const repositoryRoot = path.resolve(import.meta.dirname, "..");

async function assertFile(relativePath) {
  const info = await stat(path.join(repositoryRoot, relativePath));
  assert.equal(info.isFile(), true, `${relativePath} must be a file`);
}

export async function verifyArtifact() {
  await Promise.all([
    assertFile("dist/index.html"),
    assertFile("dist/staticwebapp.config.json"),
    assertFile("dist/release.json"),
  ]);
  const [html, configText, releaseText, assets] = await Promise.all([
    readFile(path.join(repositoryRoot, "dist/index.html"), "utf8"),
    readFile(path.join(repositoryRoot, "dist/staticwebapp.config.json"), "utf8"),
    readFile(path.join(repositoryRoot, "dist/release.json"), "utf8"),
    readdir(path.join(repositoryRoot, "dist/assets")),
  ]);
  assert.match(html, /\/assets\/[^"']+-[A-Za-z0-9_-]{8,}\.(?:js|css)/, "index must reference hashed assets");
  assert.equal(assets.some((name) => name.endsWith(".map")), false, "source maps must not ship");

  const config = JSON.parse(configText);
  assert.deepEqual(config.routes?.find(({ route }) => route === "/"), { route: "/", redirect: "/en", statusCode: 301 });
  assert.equal(config.navigationFallback?.rewrite, "/index.html");
  for (const header of ["Content-Security-Policy", "Permissions-Policy", "Referrer-Policy", "X-Content-Type-Options", "X-Frame-Options"]) {
    assert.equal(typeof config.globalHeaders?.[header], "string", `missing ${header}`);
  }

  const release = JSON.parse(releaseText);
  assert.equal(release.repository, "aserdargun/evl-aserdargun-com");
  assert.match(release.sha, /^[0-9a-f]{40}$/);
  assert.equal(Number.isNaN(new Date(release.builtAt).getTime()), false);
}
