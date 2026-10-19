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

  /* Everything above reads index.html, so it only ever sees what the document
   * links. Fonts are requested from inside the stylesheet, and this build ships
   * sixteen of them, so the artifact check was blind to all of them: deleting
   * three referenced subsets still verified, and the live page would then fall
   * back to a system face with every gate green. Each url() target is resolved
   * against dist instead. */
  const cssFiles = (await readdir(path.join(repositoryRoot, "dist/assets"))).filter((name) =>
    name.endsWith(".css"),
  );
  const fontReferences = new Map();
  for (const name of cssFiles) {
    const sheet = await readFile(path.join(repositoryRoot, "dist/assets", name), "utf8");
    for (const [, url] of sheet.matchAll(/url\(\s*['"]?(\/[^)'"\s]+)/g)) {
      fontReferences.set(url, name);
    }
  }
  assert(fontReferences.size > 0, "stylesheets must request at least one asset");
  for (const [url, name] of fontReferences) {
    const info = await stat(path.join(repositoryRoot, "dist", url)).catch(() => null);
    assert.equal(
      info?.isFile(),
      true,
      `${url} is requested by ${name} but missing from the artifact`,
    );
  }

  // One document serves every route, so the static URL identity has to be a URL
  // that actually returns 200. `/` is a permanent redirect to `/en`, so a
  // canonical pointing at it tells crawlers this page duplicates itself.
  assert.match(
    html,
    /<link rel="canonical" href="https:\/\/evl\.aserdargun\.com\/en"/,
    "canonical must name a route that serves 200, not the redirecting root",
  );
  for (const [hreflang, href] of [
    ["en", "https://evl.aserdargun.com/en"],
    ["tr", "https://evl.aserdargun.com/tr"],
    ["x-default", "https://evl.aserdargun.com/en"],
  ]) {
    assert.match(
      html,
      new RegExp(`<link rel="alternate" hreflang="${hreflang}" href="${href}"`),
      `index must pair hreflang="${hreflang}" with href="${href}" in one alternate link`,
    );
  }

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

export async function verifyWorkflow() {
  const workflow = await readFile(
    path.join(repositoryRoot, ".github/workflows/deploy-swa-evl-aserdargun-com.yml"),
    "utf8",
  );
  assert.match(workflow, /push:\n\s+branches: \[main\]/);
  assert.match(workflow, /permissions:\n\s+contents: read/);
  assert.match(workflow, /group: swa-evl-aserdargun-com-production/);
  assert.match(workflow, /cancel-in-progress: false/);
  assert.match(workflow, /actions\/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1/);
  assert.match(workflow, /actions\/setup-node@820762786026740c76f36085b0efc47a31fe5020/);
  assert.match(workflow, /Azure\/static-web-apps-deploy@4d27395796ac319302594769cfe812bd207490b1/);
  assert.match(workflow, /secrets\.AZURE_STATIC_WEB_APPS_API_TOKEN_SWA_EVL_ASERDARGUN_COM/);
  assert.match(workflow, /app_location: dist/);
  assert.match(workflow, /output_location: ""/);
  assert.match(workflow, /skip_app_build: true/);
  assert.doesNotMatch(workflow, /repo_token:|deployment_action:|api_location:/);
}
