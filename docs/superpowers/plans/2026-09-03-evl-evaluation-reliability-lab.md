# EVL Evaluation & Reliability Lab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build, verify, publish, and live-validate a bilingual static Evaluation Contract Workbench that turns explicit AI evaluation evidence into an explainable `Ready`, `Conditional`, or `Hold` release decision.

**Architecture:** A React + Vite + TypeScript SPA keeps reference data, localization, contract state, and a pure deterministic evaluation engine in separate modules. The browser persists only the working contract, produces local JSON exports, and never sends user data to a backend. GitHub Actions validates a prebuilt `dist` artifact and deploys that exact artifact to one Free Azure Static Web App in `aserdargun subscription 2`.

**Tech Stack:** Node.js 22, npm 10, React 19, TypeScript 7, Vite 8, Zod 4, Vitest 4, Testing Library, Playwright Chromium, CSS modules organized as global design tokens plus focused component styles, GitHub Actions, Azure Static Web Apps.

**Spec:** `docs/superpowers/specs/2026-09-02-evl-evaluation-reliability-lab-design.md`

## Global Constraints

- Repository is `aserdargun/evl-aserdargun-com` on production branch `main`.
- The first release is a static SPA with no API, analytics, cookies, accounts, uploads, remote persistence, model calls, or arbitrary code execution.
- English `/en` and Turkish `/tr` are equal product surfaces; `/` redirects permanently to `/en`.
- Invalid or incomplete data must fail closed and can never yield `Ready`.
- A model-based grader cannot be the sole evidence for a critical safety claim.
- Gate strengths cannot average away a critical blocker.
- Working state is stored only in schema-versioned `localStorage`; export is local schema-versioned JSON.
- Visual direction is the approved dark graphite metrology laboratory with cyan measurement signals, amber conditional states, restrained red blockers, open rails/matrices/ledgers, and no generic card grid.
- Controls are keyboard-operable, visibly focused, WCAG AA, color-independent, reduced-motion safe, and at least 44 × 44 CSS pixels where space permits.
- Local Codex Run binds to `127.0.0.1:4178` with strict-port behavior; Stop is checkout-scoped and idempotent.
- Azure contract is `rg-evl-aserdargun-com` / `swa-evl-aserdargun-com`, West Europe, Free, generated hostname only, in `aserdargun subscription 2`.
- Initial release must leave the Azure custom-domain list empty and must not mutate DNS.
- Commit only task-owned files, keep commits reviewable, and never expose the Azure deployment token.

## File and responsibility map

### Project and release contract

- `package.json`: locked scripts, dependencies, and Node/npm engines.
- `package-lock.json`: exact npm dependency graph.
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`: strict browser and tooling compilation.
- `vite.config.ts`: React, Vitest, and deterministic build configuration.
- `eslint.config.js`: TypeScript/React lint contract.
- `playwright.config.ts`: production-preview browser contract on port 4178.
- `index.html`: document shell and metadata.
- `public/staticwebapp.config.json`: root redirect, SPA fallback, MIME-safe exclusions, and security headers.
- `.codex/environments/environment.toml`: exact Setup, Run, Validate, Stop actions.
- `.github/workflows/deploy-swa-evl-aserdargun-com.yml`: one serialized production deployment.
- `scripts/verify-artifact.mjs`: validates built routes/assets/config and release metadata.
- `scripts/stop-preview.mjs`: kills only a listener owned by this checkout.
- `scripts/stamp-release.mjs`: writes the commit identity into the build environment without secrets.

### Domain and data

- `src/domain/schemas.ts`: Zod schemas and exported domain types.
- `src/domain/evaluate-contract.ts`: pure gate evaluation function and rule ordering.
- `src/domain/export-contract.ts`: versioned export builder and download adapter.
- `src/domain/persistence.ts`: versioned browser-state serialization and recovery.
- `src/data/targets.ts`: seven system targets and their critical layers.
- `src/data/reference-contracts.ts`: one validated reference contract per target.
- `src/data/evidence.ts`: source ledger with scope and verification dates.
- `src/data/patterns.ts`: evaluation pattern and grader guidance.
- `src/data/portfolio.ts`: active/planned portfolio integration records.

### Localization and application state

- `src/i18n/en.ts`, `src/i18n/tr.ts`: exact-parity message catalogs.
- `src/i18n/index.ts`: locale resolution, message lookup, and route helpers.
- `src/app/use-workbench.ts`: reducer, persistence, and derived decision state.
- `src/app/App.tsx`: composition-only application shell.
- `src/main.tsx`: bootstrap and fatal data-integrity boundary.

### Interface

- `src/components/Header.tsx`: identity, anchored navigation, locale control.
- `src/components/TargetRail.tsx`: system-target selector.
- `src/components/ContractEditor.tsx`: accessible contract fields and grader controls.
- `src/components/CoverageMatrix.tsx`: desktop matrix and linear mobile semantics.
- `src/components/DecisionGate.tsx`: decision, blockers, and conditional findings.
- `src/components/PatternLibrary.tsx`: sourced reusable evaluation patterns.
- `src/components/EvidenceLedger.tsx`: filterable evidence table/rows.
- `src/components/PortfolioMap.tsx`: EVL relationships with active/planned status.
- `src/components/PrivacyNote.tsx`: local-only persistence disclosure.
- `src/components/icons.tsx`: small, consistent custom SVG icon family.
- `src/styles/tokens.css`, `src/styles/global.css`, `src/styles/workbench.css`: approved visual system and responsive layout.

### Tests

- `src/domain/*.test.ts`: schema, gate, export, and persistence behavior.
- `src/data/data-contract.test.ts`: bundled-data and source-reference integrity.
- `src/i18n/catalog-parity.test.ts`: exact locale key parity.
- `src/app/App.test.tsx`: main interaction and accessibility-facing state.
- `scripts/stop-preview.test.mjs`: owned/foreign/no-listener Stop paths.
- `tests/artifact-contract.test.mjs`: build-output and SWA configuration contract.
- `tests/e2e/workbench.spec.ts`: bilingual core workflow and export.
- `tests/e2e/responsive.spec.ts`: desktop/mobile overflow and touch-target checks.

---

### Task 1: Create and approve the visual production specification

**Files:**
- Create: `docs/design/evl-workbench-desktop.png`
- Create: `docs/design/evl-workbench-mobile.png`
- Create: `docs/design/evl-design-inventory.md`

**Interfaces:**
- Consumes: approved product spec, exact workbench section order, visual constraints, and bilingual copy roles.
- Produces: accepted desktop/mobile concept paths; locked tokens, typography, copy, component, icon, media-treatment, and responsive inventories consumed by Tasks 6–8.

- [ ] **Step 1: Read the visual-generation contract**

Read the complete `imagegen` skill and the frontend builder reference before generating anything:

```bash
sed -n '1,10000p' /Users/aserdargun/.codex/skills/.system/imagegen/SKILL.md
sed -n '1,10000p' /Users/aserdargun/.codex/plugins/cache/openai-curated-remote/build-web-apps/0.1.2/skills/frontend-app-builder/references/imagegen-website-concepts.md
```

- [ ] **Step 2: Generate a full desktop concept**

Use Image Gen for a fresh 1440 × 1100 product-screen concept. The prompt must include the seven targets, editable evaluation contract, six-layer coverage matrix, decision gate, pattern library, evidence ledger, portfolio map, exact visual constraints, code-native text/controls, and prohibition on decorative hero badges, generic cards, fake live metrics, or unreadable text.

Expected: one complete, legible primary workbench screen—not a marketing hero—and a local deliverable saved as `docs/design/evl-workbench-desktop.png`.

- [ ] **Step 3: Generate a matching mobile concept**

Use the accepted desktop direction as the reference and generate a fresh 390 × 844 mobile screen with the same component family, a linear workflow, at least 44 × 44 controls, a compact sticky decision summary, and no horizontal interaction.

Expected: `docs/design/evl-workbench-mobile.png` matches the desktop design system without becoming a stack of generic cards.

- [ ] **Step 4: Present both concepts and obtain explicit approval**

Show both images to the user. Do not write application code until the user accepts the visual direction. Iterate the images if any required region, copy role, state, or responsive behavior is unclear.

- [ ] **Step 5: Write the locked implementation inventory**

Create `docs/design/evl-design-inventory.md` with this exact structure and concrete values sampled from the accepted concepts:

```markdown
# EVL Design Inventory

## Accepted concepts
- Desktop: `docs/design/evl-workbench-desktop.png` (1440 × 1100)
- Mobile: `docs/design/evl-workbench-mobile.png` (390 × 844)

## Allowed first-viewport copy
<!-- list every visible EVL mark, navigation label, heading, support line,
target label, field label, CTA, status label, and privacy string verbatim -->

## Tokens
<!-- list exact sampled hex colors, radii, shadows, spacing, motion durations -->

## Typography
<!-- list family, weight, size, line-height, and tracking per role -->

## Containers and component families
<!-- document rails, matrix, ledger rows, controls, gate, and mobile transforms -->

## Icon inventory
<!-- document metaphor, viewBox, stroke/fill, weight, size, and state -->

## Media treatment
No hero image or raster overlay. Calibration marks are structural CSS or SVG.

## Responsive contract
<!-- document the exact desktop-to-mobile order and sticky decision behavior -->
```

Replace every instructional comment with extracted values before committing.

- [ ] **Step 6: Inspect both images and commit the accepted visual spec**

Use `view_image` on both concept files in the same QA pass, verify all required regions are legible, then run:

```bash
git add docs/design/evl-workbench-desktop.png docs/design/evl-workbench-mobile.png docs/design/evl-design-inventory.md
git commit -m "docs: lock EVL visual specification"
```

Expected: one commit containing only the two accepted concepts and completed inventory.

### Task 2: Establish the typed static application and data contracts

**Files:**
- Create: `package.json`
- Create: `package-lock.json`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `eslint.config.js`
- Create: `index.html`
- Create: `src/vite-env.d.ts`
- Create: `src/domain/schemas.ts`
- Create: `src/domain/schemas.test.ts`

**Interfaces:**
- Consumes: Node 22/npm 10 global contract.
- Produces: `LayerId`, `CoverageState`, `GraderFamily`, `EvidenceSource`, `EvaluationTarget`, `EvaluationContract`, `EvaluationResult`, `Finding`, `ExportEnvelope`; `parseContract(value)` and `parseResult(value)`.

- [ ] **Step 1: Create and lock the package contract**

Create `package.json` with exact package versions observed at planning time and the complete validation chain:

```json
{
  "name": "evl-aserdargun-com",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "engines": { "node": "22.x", "npm": "10.x" },
  "scripts": {
    "dev": "vite --host 127.0.0.1 --port 4178 --strictPort",
    "build": "tsc -b && vite build",
    "lint": "eslint . --max-warnings 0",
    "typecheck": "tsc -b --pretty false",
    "test": "vitest run",
    "test:e2e": "playwright test",
    "verify:artifact": "node scripts/verify-artifact.mjs",
    "start:codex": "npm run dev",
    "stop:codex": "node scripts/stop-preview.mjs --port 4178",
    "validate": "npm run lint && npm run typecheck && npm run test && npm run build && npm run verify:artifact && npm run test:e2e && git diff --check"
  },
  "dependencies": {
    "react": "19.2.8",
    "react-dom": "19.2.8",
    "zod": "4.5.4"
  },
  "devDependencies": {
    "@playwright/test": "1.62.1",
    "@testing-library/jest-dom": "6.9.1",
    "@testing-library/react": "16.3.3",
    "@testing-library/user-event": "14.6.7",
    "@types/node": "26.4.1",
    "@types/react": "19.2.18",
    "@types/react-dom": "19.2.5",
    "@vitejs/plugin-react": "6.1.1",
    "eslint": "10.9.1",
    "eslint-plugin-react-hooks": "7.1.1",
    "eslint-plugin-react-refresh": "0.5.6",
    "jsdom": "30.0.1",
    "typescript": "7.0.2",
    "typescript-eslint": "8.69.0",
    "vite": "8.2.2",
    "vitest": "4.1.11"
  }
}
```

Run `npm install` and confirm `package-lock.json` uses lockfile version 3 and preserves every exact version from `package.json`.

- [ ] **Step 2: Add strict compiler, Vite, Vitest, ESLint, and document-shell configuration**

Configure strict TypeScript with `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noFallthroughCasesInSwitch`, and project references. Configure Vitest for `jsdom`, `src/test/setup.ts`, globals disabled, and tests under `src/**/*.test.{ts,tsx}`. `index.html` must contain only the root mount, title `EVL — AI Evaluation & Reliability Lab`, neutral description, theme color, and no third-party scripts.

- [ ] **Step 3: Write failing schema tests**

Create `src/domain/schemas.test.ts` with these required cases:

```ts
import { describe, expect, it } from "vitest";
import { parseContract } from "./schemas";

describe("EvaluationContract schema", () => {
  it("accepts a complete mixed-unit contract", () => {
    expect(parseContract(completeContractFixture).targetId).toBe("agent");
  });

  it("rejects fewer than three trials", () => {
    expect(() => parseContract({ ...completeContractFixture, trials: 2 })).toThrow();
  });

  it("rejects an applicable layer without a rationale", () => {
    const layers = structuredClone(completeContractFixture.layers);
    layers.output.rationale = "";
    expect(() => parseContract({ ...completeContractFixture, layers })).toThrow();
  });
});
```

Include the complete fixture in the test; do not reference a file that does not yet exist.

- [ ] **Step 4: Run the focused test and observe the red state**

```bash
npx vitest run src/domain/schemas.test.ts
```

Expected: FAIL because `./schemas` does not exist.

- [ ] **Step 5: Implement the Zod schemas and type exports**

`src/domain/schemas.ts` must define these exact stable discriminants:

```ts
export const LAYER_IDS = ["output", "trajectory", "outcome", "robustness", "safety", "operations"] as const;
export const COVERAGE_STATES = ["covered", "partial", "missing", "not_applicable"] as const;
export const GRADER_FAMILIES = ["rule", "executable", "statistical", "human", "model"] as const;
export const GATE_STATES = ["ready", "conditional", "hold"] as const;
export const EVIDENCE_TIERS = ["standard", "official_guidance", "research", "case_study"] as const;

export type LayerId = (typeof LAYER_IDS)[number];
export type GateState = (typeof GATE_STATES)[number];

export function parseContract(value: unknown): EvaluationContract {
  return evaluationContractSchema.parse(value);
}

export function parseResult(value: unknown): EvaluationResult {
  return evaluationResultSchema.parse(value);
}
```

`EvaluationContract` must include every required field from spec §7.2 plus a six-key `layers` record. `EvaluationResult` must include `engineVersion`, `gate`, ordered `findings`, and six layer assessments. Every ID is a non-empty stable slug; every user-visible free-text field is trimmed and non-empty.

- [ ] **Step 6: Run schema tests and foundational checks**

```bash
npx vitest run src/domain/schemas.test.ts
npm run typecheck
npm run lint
```

Expected: all schema tests pass and the strict compiler/linter exits 0.

- [ ] **Step 7: Commit the typed foundation**

```bash
git add package.json package-lock.json tsconfig.json tsconfig.app.json tsconfig.node.json vite.config.ts eslint.config.js index.html src/vite-env.d.ts src/test/setup.ts src/domain/schemas.ts src/domain/schemas.test.ts
git commit -m "feat: establish EVL typed application contract"
```

### Task 3: Implement the fail-closed evaluation engine

**Files:**
- Create: `src/domain/evaluate-contract.ts`
- Create: `src/domain/evaluate-contract.test.ts`

**Interfaces:**
- Consumes: `EvaluationContract`, `EvaluationTarget`, `EvidenceSource`, `EvaluationResult`, and `LayerId` from `schemas.ts`.
- Produces: `evaluateContract(contract: EvaluationContract, target: EvaluationTarget, sources: readonly EvidenceSource[], evaluatedAt: string): EvaluationResult` and `ENGINE_VERSION = "1.0.0"`.

- [ ] **Step 1: Write the gate-precedence tests**

The focused suite must assert all of the following with complete fixtures:

```ts
it("returns hold when any critical layer is not covered", () => {
  const result = evaluateContract(withLayer("safety", "partial"), securityTarget, sources, NOW);
  expect(result.gate).toBe("hold");
  expect(result.findings[0].code).toBe("critical-layer-not-covered");
});

it("returns hold when a model grader is the sole critical-safety evidence", () => {
  const result = evaluateContract(modelOnlySafetyContract, securityTarget, sources, NOW);
  expect(result.gate).toBe("hold");
  expect(result.findings.map(({ code }) => code)).toContain("model-only-critical-safety");
});

it("returns conditional for partial non-critical coverage", () => {
  expect(evaluateContract(partialOperationsContract, modelTarget, sources, NOW).gate).toBe("conditional");
});

it("returns conditional when review is due within thirty days", () => {
  expect(evaluateContract(reviewDueContract, modelTarget, sources, NOW).gate).toBe("conditional");
});

it("returns ready only for complete current evidence", () => {
  expect(evaluateContract(readyContract, modelTarget, sources, NOW).gate).toBe("ready");
});

it("is deterministic when contract, sources, target, and clock are fixed", () => {
  expect(evaluateContract(readyContract, modelTarget, sources, NOW)).toEqual(
    evaluateContract(readyContract, modelTarget, sources, NOW),
  );
});
```

Also test expired review, missing source IDs, invalid review timestamp, missing critical failure definitions, and that finding order is severity then stable rule order.

- [ ] **Step 2: Run the focused suite and observe the red state**

```bash
npx vitest run src/domain/evaluate-contract.test.ts
```

Expected: FAIL because `evaluateContract` does not exist.

- [ ] **Step 3: Implement pure rules with explicit precedence**

Use named rules returning `Finding | null` and no ambient clock:

```ts
type RuleContext = Readonly<{
  contract: EvaluationContract;
  target: EvaluationTarget;
  sourceIds: ReadonlySet<string>;
  evaluatedAt: Date;
}>;

const rules: readonly EvaluationRule[] = [
  invalidEvidenceReferenceRule,
  overdueReviewRule,
  missingCriticalFailureRule,
  criticalLayerRule,
  modelOnlyCriticalSafetyRule,
  partialNonCriticalLayerRule,
  reviewDueSoonRule,
];

export function evaluateContract(
  contract: EvaluationContract,
  target: EvaluationTarget,
  sources: readonly EvidenceSource[],
  evaluatedAt: string,
): EvaluationResult;
```

Gate derivation is exact: any blocker finding → `hold`; otherwise any warning → `conditional`; otherwise `ready`. Never average scores. Parse `evaluatedAt` once and throw on an invalid ISO timestamp.

- [ ] **Step 4: Run domain tests and type checks**

```bash
npx vitest run src/domain/schemas.test.ts src/domain/evaluate-contract.test.ts
npm run typecheck
```

Expected: all domain tests pass.

- [ ] **Step 5: Commit the deterministic engine**

```bash
git add src/domain/evaluate-contract.ts src/domain/evaluate-contract.test.ts
git commit -m "feat: add fail-closed evaluation gate"
```

### Task 4: Add validated bilingual reference data and evidence

**Files:**
- Create: `src/data/targets.ts`
- Create: `src/data/reference-contracts.ts`
- Create: `src/data/evidence.ts`
- Create: `src/data/patterns.ts`
- Create: `src/data/portfolio.ts`
- Create: `src/data/data-contract.test.ts`
- Create: `src/i18n/en.ts`
- Create: `src/i18n/tr.ts`
- Create: `src/i18n/index.ts`
- Create: `src/i18n/catalog-parity.test.ts`

**Interfaces:**
- Consumes: Zod schemas and domain types from Task 2.
- Produces: `targets`, `referenceContracts`, `evidenceSources`, `patterns`, `portfolioApps`, `Locale = "en" | "tr"`, `messages`, `t(locale, key)`, `localeFromPath(pathname)`, and `pathForLocale(locale)`.

- [ ] **Step 1: Write bundled-data and locale-parity tests**

Required assertions:

```ts
it("provides one valid reference contract for every target", () => {
  expect(targets.map(({ id }) => id).sort()).toEqual(
    referenceContracts.map(({ targetId }) => targetId).sort(),
  );
  referenceContracts.forEach((contract) => expect(() => parseContract(contract)).not.toThrow());
});

it("resolves every contract evidence reference", () => {
  const sourceIds = new Set(evidenceSources.map(({ id }) => id));
  for (const contract of referenceContracts) {
    expect(allReferencedSourceIds(contract).every((id) => sourceIds.has(id))).toBe(true);
  }
});

it("keeps English and Turkish catalogs in exact key parity", () => {
  expect(Object.keys(tr).sort()).toEqual(Object.keys(en).sort());
});

it("marks CTX planned and every linked live app active", () => {
  expect(portfolioApps.find(({ code }) => code === "ctx")?.status).toBe("planned");
  expect(portfolioApps.filter(({ status }) => status === "active").every(({ url }) => url?.startsWith("https://"))).toBe(true);
});
```

- [ ] **Step 2: Run focused tests and observe the red state**

```bash
npx vitest run src/data/data-contract.test.ts src/i18n/catalog-parity.test.ts
```

Expected: FAIL because data and catalogs do not exist.

- [ ] **Step 3: Implement seven targets and reference contracts**

Create targets with these stable IDs and critical layers:

```ts
export const targets = [
  { id: "model", criticalLayers: ["output", "robustness"] },
  { id: "inference", criticalLayers: ["output", "operations"] },
  { id: "retrieval", criticalLayers: ["output", "outcome"] },
  { id: "agent", criticalLayers: ["trajectory", "outcome", "safety"] },
  { id: "security", criticalLayers: ["safety", "outcome"] },
  { id: "world-model", criticalLayers: ["outcome", "robustness"] },
  { id: "physical-ai", criticalLayers: ["outcome", "safety", "operations"] },
] as const satisfies readonly EvaluationTarget[];
```

Every reference contract must be credible, internally consistent, and labeled as a planning example—not a benchmark result. Give each contract at least two grader families, a concrete threshold, three or more trials, explicit critical failures, current review date, and source-backed layer rationales.

- [ ] **Step 4: Implement the evidence and pattern ledgers**

The initial ledger must include canonical primary-source records for Anthropic agent evals, NIST AI measurement, NIST AI 800-3, and OpenAI graders. Each record includes publication date where known, `verifiedAt: "2026-09-03"`, evidence tier, supported pattern IDs, and a limitation. Pattern entries cover output grading, trajectory inspection, outcome verification, repeated trials, uncertainty, adversarial evaluation, and regression gates.

- [ ] **Step 5: Implement equal English and Turkish catalogs**

Use flat stable keys such as `nav.workbench`, `target.agent`, `contract.claim`, `layer.trajectory`, `gate.hold`, `finding.critical-layer-not-covered`, and `privacy.localOnly`. `t(locale, key)` accepts only the compile-time `MessageKey` union and throws a data-integrity error if the selected catalog has no value. Normal builds must have exact parity and no missing keys.

- [ ] **Step 6: Run all data/domain checks**

```bash
npx vitest run src/domain src/data src/i18n
npm run typecheck
```

Expected: all bundled records parse, source references resolve, and catalogs match exactly.

- [ ] **Step 7: Commit the evidence-aware content layer**

```bash
git add src/data src/i18n
git commit -m "feat: add bilingual EVL reference corpus"
```

### Task 5: Implement persistence, export, and workbench state

**Files:**
- Create: `src/domain/persistence.ts`
- Create: `src/domain/persistence.test.ts`
- Create: `src/domain/export-contract.ts`
- Create: `src/domain/export-contract.test.ts`
- Create: `src/app/use-workbench.ts`
- Create: `src/app/use-workbench.test.tsx`

**Interfaces:**
- Consumes: validated domain data and `evaluateContract`.
- Produces: `STORAGE_KEY = "evl.workbench.v1"`, `loadWorkbench(storage)`, `saveWorkbench(storage, state)`, `clearWorkbench(storage)`, `buildExportEnvelope(contract, result, sources, exportedAt)`, `downloadExport(envelope, document)`, and `useWorkbench(locale: Locale, options?: { storage?: Storage; now?: () => Date })`.

- [ ] **Step 1: Write red tests for versioned persistence**

Test exact behaviors:

```ts
it("round-trips only the selected target and working contract", () => {
  saveWorkbench(storage, state);
  expect(loadWorkbench(storage)).toEqual(state);
  expect(JSON.parse(storage.getItem(STORAGE_KEY)!)).not.toHaveProperty("evidenceSources");
});

it("ignores an unsupported persisted schema without coercion", () => {
  storage.setItem(STORAGE_KEY, JSON.stringify({ schemaVersion: 99, state }));
  expect(loadWorkbench(storage)).toBeNull();
});

it("preserves the working contract when locale changes", () => {
  const { result, rerender } = renderHook(({ locale }) => useWorkbench(locale), { initialProps: { locale: "en" as const } });
  act(() => result.current.updateField("claim", "My claim"));
  rerender({ locale: "tr" });
  expect(result.current.contract.claim).toBe("My claim");
});
```

- [ ] **Step 2: Write red tests for export privacy and validity**

Assert that the envelope contains `schemaVersion`, `engineVersion`, contract, result, referenced source records, and injected ISO timestamp; assert it omits localStorage keys, UI locale, browser metadata, and unrelated ledger records. Assert `downloadExport` revokes the object URL after clicking the generated link.

- [ ] **Step 3: Run focused tests and observe the red state**

```bash
npx vitest run src/domain/persistence.test.ts src/domain/export-contract.test.ts src/app/use-workbench.test.tsx
```

Expected: FAIL because the modules do not exist.

- [ ] **Step 4: Implement storage and export adapters around pure parsers**

Inject `Storage` and `Document` dependencies rather than reading globals in pure functions. Catch storage access/quota/JSON errors and return typed recovery results:

```ts
export type LoadWorkbenchResult =
  | { status: "loaded"; state: PersistedWorkbench }
  | { status: "empty" }
  | { status: "unsupported" }
  | { status: "invalid" };
```

The hook surfaces `persistenceNotice`, never loses in-memory state after a save failure, and recomputes the gate from the injected contract, target, evidence, and current UTC date.

- [ ] **Step 5: Run focused and domain tests**

```bash
npx vitest run src/domain src/app/use-workbench.test.tsx
npm run typecheck
```

Expected: persistence, export, state, and gate tests pass.

- [ ] **Step 6: Commit the browser-only workbench model**

```bash
git add src/domain/persistence.ts src/domain/persistence.test.ts src/domain/export-contract.ts src/domain/export-contract.test.ts src/app/use-workbench.ts src/app/use-workbench.test.tsx
git commit -m "feat: add private local EVL workbench state"
```

### Task 6: Build the approved workbench interface

**Files:**
- Create: `src/main.tsx`
- Create: `src/app/App.tsx`
- Create: `src/components/Header.tsx`
- Create: `src/components/TargetRail.tsx`
- Create: `src/components/ContractEditor.tsx`
- Create: `src/components/CoverageMatrix.tsx`
- Create: `src/components/DecisionGate.tsx`
- Create: `src/components/PatternLibrary.tsx`
- Create: `src/components/EvidenceLedger.tsx`
- Create: `src/components/PortfolioMap.tsx`
- Create: `src/components/PrivacyNote.tsx`
- Create: `src/components/icons.tsx`
- Create: `src/styles/tokens.css`
- Create: `src/styles/global.css`
- Create: `src/styles/workbench.css`
- Create: `src/app/App.test.tsx`

**Interfaces:**
- Consumes: `useWorkbench`, localization helpers, bundled data, and the accepted design inventory.
- Produces: `App(props: { initialPath?: string })` and the complete `/en` and `/tr` application surface with semantic region IDs `workbench`, `patterns`, `evidence`, and `system-map`.

- [ ] **Step 1: Write red interaction tests**

Cover the real workflow:

```tsx
it("changes the gate when critical evidence is removed", async () => {
  const user = userEvent.setup();
  render(<App initialPath="/en" />);
  expect(screen.getByRole("status", { name: /release gate/i })).toHaveTextContent("Ready");
  await user.click(screen.getByRole("checkbox", { name: /safety evidence/i }));
  expect(screen.getByRole("status", { name: /release gate/i })).toHaveTextContent("Hold");
  expect(screen.getByText(/critical layer/i)).toBeVisible();
});

it("switches locale without resetting the edited claim", async () => {
  const user = userEvent.setup();
  render(<App initialPath="/en" />);
  const claim = screen.getByLabelText("Evaluation claim");
  await user.clear(claim);
  await user.type(claim, "Measure tool-use correctness");
  await user.click(screen.getByRole("link", { name: "Türkçe" }));
  expect(screen.getByLabelText("Değerlendirme iddiası")).toHaveValue("Measure tool-use correctness");
});

it("renders active links and a non-link planned CTX entry", () => {
  render(<App initialPath="/en" />);
  expect(screen.getByRole("link", { name: /HNS/i })).toHaveAttribute("href", "https://hns.aserdargun.com");
  expect(screen.getByText(/CTX/)).toHaveTextContent(/planned/i);
});
```

Also test accessible field errors, evidence filters, reset confirmation, persistence notice, export action invocation, and a fatal data-integrity boundary that cannot render a release gate from invalid bundled data.

- [ ] **Step 2: Run UI tests and observe the red state**

```bash
npx vitest run src/app/App.test.tsx
```

Expected: FAIL because the application components do not exist.

- [ ] **Step 3: Implement the first viewport from the accepted concept**

Build the exact accepted header, target rail, contract workspace, coverage matrix, and decision rail before downstream sections. Use only copy from the design inventory. Each custom icon in `icons.tsx` must use a 24-unit `viewBox`, `currentColor`, consistent stroke width/caps, and an accessible name only when it conveys meaning not already present in text.

- [ ] **Step 4: Capture and compare the first viewport**

Run the app on port 4178, capture the browser at the desktop concept dimensions, and use `view_image` on the desktop concept plus implementation screenshot. Record mismatches for copy, layout, typography, palette, spacing/container model, icon treatment, and first-viewport balance; fix every material mismatch before continuing.

- [ ] **Step 5: Implement patterns, ledger, map, and privacy note**

Follow the accepted section rhythm. The evidence ledger is a semantic table on desktop and labeled rows on mobile. External source and active portfolio links open normally and receive visible focus; planned entries are not clickable. Filters change only ledger visibility and never mutate the contract.

- [ ] **Step 6: Implement the matching mobile transform**

At the accepted breakpoint, order content as target → contract → coverage → gate → patterns → evidence → system map. Keep the compact decision summary sticky only while it does not cover focused controls. Replace the wide matrix with linear layer rows; do not require horizontal scrolling.

- [ ] **Step 7: Run UI tests and inspect accessibility-facing markup**

```bash
npx vitest run src/app/App.test.tsx
npm run typecheck
npm run lint
```

Expected: all interactions pass, there is one `h1`, each anchored region is a named landmark, and gate changes are announced once through a polite live region.

- [ ] **Step 8: Commit the complete approved interface**

```bash
git add src/main.tsx src/app src/components src/styles
git commit -m "feat: build EVL evaluation workbench"
```

### Task 7: Add artifact, routing, security, and local lifecycle contracts

**Files:**
- Create: `public/staticwebapp.config.json`
- Create: `scripts/verify-artifact.mjs`
- Create: `scripts/stop-preview.mjs`
- Create: `scripts/stop-preview.test.mjs`
- Create: `scripts/stamp-release.mjs`
- Create: `tests/artifact-contract.test.mjs`
- Create: `.codex/environments/environment.toml`
- Modify: `vite.config.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: `npm run build` output and local port 4178.
- Produces: safe Run/Validate/Stop actions; stamped `dist/release.json`; artifact and SWA configuration verification.

- [ ] **Step 1: Write red lifecycle and artifact tests**

`scripts/stop-preview.test.mjs` must spawn a temporary HTTP listener from this checkout and assert Stop terminates it; spawn another listener with a different cwd and assert Stop refuses it; assert a free port returns success. `tests/artifact-contract.test.mjs` must assert after build:

```js
assertFile("dist/index.html");
assertFile("dist/staticwebapp.config.json");
assertFile("dist/release.json");
assertHashedAssetReferences("dist/index.html");
assertNoSourceMaps("dist/assets");
assertRootRedirect("dist/staticwebapp.config.json", "/en", 301);
assertNavigationFallback("dist/staticwebapp.config.json", "/index.html");
assertSecurityHeaders("dist/staticwebapp.config.json", [
  "Content-Security-Policy",
  "Permissions-Policy",
  "Referrer-Policy",
  "X-Content-Type-Options",
  "X-Frame-Options",
]);
```

- [ ] **Step 2: Run lifecycle tests and observe the red state**

```bash
node --test scripts/stop-preview.test.mjs tests/artifact-contract.test.mjs
```

Expected: FAIL because scripts/config/artifact do not exist.

- [ ] **Step 3: Implement checkout-scoped Stop**

Resolve listeners with `lsof -nP -iTCP:<port> -sTCP:LISTEN -t`; resolve each PID cwd with `lsof -a -p <pid> -d cwd -Fn`; compare real paths to `git rev-parse --show-toplevel`; send SIGTERM and poll for closure; use SIGKILL only for the same verified PID after timeout. Refuse any foreign cwd without killing it. Never use `pkill` or a process-name match.

- [ ] **Step 4: Implement release stamping and artifact verification**

`stamp-release.mjs` accepts `--git-head` plus `--output`, resolves the full lowercase SHA from the current checkout, generates one UTC ISO timestamp, and writes `{ repository, sha, builtAt }`. It also accepts explicit `--sha` and `--built-at` only for focused tests. It rejects a non-40-character SHA or invalid timestamp. Change the package `build` script to `tsc -b && vite build && node scripts/stamp-release.mjs --git-head --output dist/release.json`. Vite excludes source maps. `verify-artifact.mjs` invokes the same exported assertions as the Node artifact test and exits nonzero on any mismatch.

- [ ] **Step 5: Add SWA routing and exact security headers**

`public/staticwebapp.config.json` must include:

```json
{
  "routes": [{ "route": "/", "redirect": "/en", "statusCode": 301 }],
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/assets/*", "/*.json", "/*.txt", "/*.ico", "/*.svg", "/*.png", "/*.webp"]
  },
  "globalHeaders": {
    "Content-Security-Policy": "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY"
  },
  "mimeTypes": { ".json": "application/json; charset=utf-8" }
}
```

- [ ] **Step 6: Define and exercise exact Codex actions**

Create:

```toml
# THIS IS AUTOGENERATED. DO NOT EDIT MANUALLY
version = 1
name = "EVL — AI Evaluation & Reliability Lab"

[setup]
script = "npm ci && npx playwright install chromium"

[[actions]]
name = "Run"
icon = "run"
command = "npm run start:codex"

[[actions]]
name = "Validate"
icon = "tool"
command = "npm run validate"

[[actions]]
name = "Stop"
icon = "tool"
command = "npm run stop:codex"
```

Execute the exact setup script, parse the TOML, run Validate, start Run and probe `/en`, then execute Stop and prove port 4178 is free.

- [ ] **Step 7: Run lifecycle, build, and artifact checks**

```bash
node --test scripts/stop-preview.test.mjs
npm run build
npm run verify:artifact
node --test tests/artifact-contract.test.mjs
git diff --check
```

Expected: all checks pass and no listener remains on 4178.

- [ ] **Step 8: Commit the local and static-host contracts**

```bash
git add package.json package-lock.json vite.config.ts public/staticwebapp.config.json scripts tests/artifact-contract.test.mjs .codex/environments/environment.toml
git commit -m "build: add EVL release and local lifecycle contracts"
```

### Task 8: Add browser regression coverage and complete fidelity QA

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/workbench.spec.ts`
- Create: `tests/e2e/responsive.spec.ts`
- Create: `docs/design/evl-fidelity-ledger.md`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Consumes: complete local SPA and accepted concept files.
- Produces: deterministic Chromium coverage for both locales and viewports; final concept-to-render fidelity ledger.

- [ ] **Step 1: Write the desktop/mobile end-to-end journeys**

`playwright.config.ts` starts `npm run dev`, reuses no existing server in CI, and tests `http://127.0.0.1:4178`. Required flow:

```ts
test("English agent contract changes from ready to hold and exports", async ({ page }) => {
  await page.goto("/en");
  await page.getByRole("button", { name: "Agent & tool use" }).click();
  await expect(page.getByRole("status", { name: "Release gate" })).toContainText("Ready");
  await page.getByRole("checkbox", { name: "Safety evidence" }).uncheck();
  await expect(page.getByRole("status", { name: "Release gate" })).toContainText("Hold");
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export JSON" }).click();
  expect((await download).suggestedFilename()).toMatch(/^evl-agent-.*\.json$/);
});
```

Mirror the primary journey in Turkish and verify edited claim preservation across `/en` → `/tr`.

- [ ] **Step 2: Add responsive and accessibility assertions**

At 1440 × 1100 and 390 × 844, assert `document.documentElement.scrollWidth === document.documentElement.clientWidth`, visible 44-pixel target controls, no clipped focused control, linear mobile coverage rows, sticky gate not covering the active element, one `h1`, and no browser console errors. Tab through the entire primary workflow and verify the focus indicator remains visible.

- [ ] **Step 3: Run E2E tests and fix product defects**

```bash
npx playwright test
```

Expected: both locales and both viewports pass. Fix implementation defects rather than weakening assertions.

- [ ] **Step 4: Capture native-size final renders**

Capture fresh desktop and mobile implementation screenshots at exactly 1440 × 1100 and 390 × 844. Use `view_image` on each accepted concept and corresponding implementation screenshot in the same QA pass.

- [ ] **Step 5: Write the fidelity ledger**

Document at least these comparison points in `docs/design/evl-fidelity-ledger.md`: copy/order, first-viewport balance, typography, palette, rail/matrix container model, spacing, icon treatment, gate states, mobile transformation, motion/reduced motion, and core interaction. For each, record concept evidence, rendered evidence, mismatch, and fix. Include the above-the-fold copy diff result and any intentional deviation with reason.

- [ ] **Step 6: Run the full local release contract**

```bash
npm run validate
npm run stop:codex
lsof -nP -iTCP:4178 -sTCP:LISTEN
git diff --check
```

Expected: validation exits 0; the final `lsof` prints nothing; no fixable visual mismatch remains.

- [ ] **Step 7: Commit browser coverage and fidelity evidence**

```bash
git add playwright.config.ts tests/e2e package.json package-lock.json docs/design/evl-fidelity-ledger.md
git commit -m "test: verify EVL workbench across viewports"
```

### Task 9: Create the GitHub repository and reconcile the Azure workflow

**Files:**
- Create: `.github/workflows/deploy-swa-evl-aserdargun-com.yml`
- Modify: `README.md` if created earlier; otherwise Create: `README.md`

**Interfaces:**
- Consumes: clean validated `main`, verified `dist`, authenticated GitHub owner `aserdargun`, and exact Azure contract.
- Produces: public `aserdargun/evl-aserdargun-com`, one production workflow, and documented local/product contract.

- [ ] **Step 1: Repeat live preflight immediately before mutation**

```bash
git status --short --branch
git log --oneline -5
gh auth status
gh repo view aserdargun/evl-aserdargun-com --json nameWithOwner,visibility,defaultBranchRef,url
az account show --query "{name:name,id:id,state:state,isDefault:isDefault}" -o json
az group show --subscription "aserdargun subscription 2" --name rg-evl-aserdargun-com -o json
az staticwebapp show --subscription "aserdargun subscription 2" --resource-group rg-evl-aserdargun-com --name swa-evl-aserdargun-com -o json
```

Expected before creation: GitHub repository, resource group, and SWA each return not found; active GitHub owner is `aserdargun`; enabled Azure subscription is exactly `aserdargun subscription 2`. Stop on any unexpected existing target or unrelated worktree change.

- [ ] **Step 2: Write the pinned production workflow**

Use these immutable official-action SHAs verified at planning time:

```yaml
name: Deploy EVL to Azure Static Web Apps

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read

concurrency:
  group: swa-evl-aserdargun-com-production
  cancel-in-progress: false

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@11d5960a326750d5838078e36cf38b85af677262
      - uses: actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run validate
      - run: npm run verify:artifact
      - uses: Azure/static-web-apps-deploy@1a947af9992250f3bc2e68ad0754c0b0c11566c9
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_SWA_EVL_ASERDARGUN_COM }}
          action: upload
          app_location: dist
          output_location: ""
          skip_app_build: true
```

At execution time, re-resolve the three official tag SHAs. Update only if an official tag now resolves to a newer immutable commit and review the release notes before changing the pinned values.

- [ ] **Step 3: Write README and validate the workflow contract**

README must describe the product, privacy boundary, routes, Setup/Run/Validate/Stop commands, evidence policy, generated-host-only release, and non-certification limitation. Add a Node test or extend `tests/artifact-contract.test.mjs` to parse the workflow and assert branch, permissions, concurrency, exact secret, `dist`, `skip_app_build: true`, and absence of unsupported inputs.

- [ ] **Step 4: Commit the GitHub/Azure release definition**

```bash
git add .github/workflows/deploy-swa-evl-aserdargun-com.yml README.md tests/artifact-contract.test.mjs
git commit -m "ci: define EVL Azure Static Web Apps release"
npm run validate
git status --short --branch
```

Expected: validation passes and worktree is clean before creating remote/cloud resources.

- [ ] **Step 5: Create the public GitHub repository without pushing yet**

```bash
gh repo create aserdargun/evl-aserdargun-com --public --description "Evidence-aware AI Evaluation & Reliability Lab" --source . --remote origin
git remote -v
gh repo view aserdargun/evl-aserdargun-com --json nameWithOwner,visibility,url
```

Expected: exact public repository exists, `origin` is its HTTPS URL, and no branch has been pushed yet so no incomplete Azure deployment can run.

### Task 10: Provision Subscription 2, deploy, and prove production completion

**Files:**
- No source changes expected; if a production defect is discovered, return to the owning task, fix with a failing regression, validate, commit, and redeploy.

**Interfaces:**
- Consumes: public GitHub repository without a pushed production branch, exact clean local `main`, and workflow from Task 9.
- Produces: one compatible Free SWA, one non-printed GitHub secret, remote `main`, successful correlated workflow, verified Azure-generated URL, and clean Git state.

- [ ] **Step 1: Select and verify the exact subscription**

```bash
az account set --subscription "aserdargun subscription 2"
az account show --query "{name:name,id:id,state:state,isDefault:isDefault}" -o json
```

Expected: `name` is exactly `aserdargun subscription 2`, state is `Enabled`, and it is the active context.

- [ ] **Step 2: Create the exact resource group and Free Static Web App**

```bash
az group create --subscription "aserdargun subscription 2" --name rg-evl-aserdargun-com --location westeurope
az staticwebapp create --subscription "aserdargun subscription 2" --resource-group rg-evl-aserdargun-com --name swa-evl-aserdargun-com --location westeurope --sku Free
```

Do not pass repository/source integration arguments; Azure must not create a competing workflow.

- [ ] **Step 3: Prove the new target is compatible before retrieving the token**

Query and verify exact name/group, `Free`, West Europe, successful provisioning, generated hostname belonging to this app, no source-provider integration, no custom domains, and no unexpected production environment. Stop rather than mutate/replace if any property is incompatible.

- [ ] **Step 4: Pipe the deployment token directly to the exact GitHub secret**

```bash
az staticwebapp secrets list --subscription "aserdargun subscription 2" --resource-group rg-evl-aserdargun-com --name swa-evl-aserdargun-com --query properties.apiKey -o tsv | gh secret set AZURE_STATIC_WEB_APPS_API_TOKEN_SWA_EVL_ASERDARGUN_COM --repo aserdargun/evl-aserdargun-com
gh secret list --repo aserdargun/evl-aserdargun-com
```

Expected: the token value never appears; only secret name and update timestamp are inspected.

- [ ] **Step 5: Fetch-before-push and publish the intended production head**

```bash
git fetch origin
git ls-remote --symref origin HEAD
git rev-list --count HEAD..origin/main 2>/dev/null || true
git push -u origin main
```

If a remote `main` unexpectedly exists or has commits, stop before pushing. After push, record the full local/remote SHA and confirm equality.

- [ ] **Step 6: Monitor and inspect the exact workflow run**

```bash
evl_sha="$(git rev-parse HEAD)"
gh run list --repo aserdargun/evl-aserdargun-com --workflow deploy-swa-evl-aserdargun-com.yml --limit 5
evl_run_id="$(gh run list --repo aserdargun/evl-aserdargun-com --workflow deploy-swa-evl-aserdargun-com.yml --commit "$evl_sha" --limit 1 --json databaseId --jq '.[0].databaseId')"
gh run watch "$evl_run_id" --repo aserdargun/evl-aserdargun-com --exit-status
gh run view "$evl_run_id" --repo aserdargun/evl-aserdargun-com --json headSha,status,conclusion,url,jobs
```

Require `evl_run_id` to be a non-empty integer before watching it. Completion requires `headSha` to equal `evl_sha` and the upload step to succeed; queued, cancelled, superseded, or build-only success is not completion.

- [ ] **Step 7: Correlate Azure readiness and release identity**

Poll observable Azure state without sleeps longer than 60 seconds. Confirm the default environment is `Ready` on `main`, its update timestamp is no earlier than the successful deploy step, and the generated host's `/release.json` contains the intended 40-character SHA.

- [ ] **Step 8: Verify generated-host HTTP and headers**

Resolve the exact hostname returned by Azure and the first hashed JavaScript asset referenced by the deployed HTML, then verify:

```bash
evl_host="$(az staticwebapp show --subscription "aserdargun subscription 2" --resource-group rg-evl-aserdargun-com --name swa-evl-aserdargun-com --query defaultHostname -o tsv)"
evl_asset="$(curl -fsS "https://$evl_host/en" | rg -o '/assets/[^\" ]+\.js' | head -n 1)"
curl -fsSI "https://$evl_host/"
curl -fsS "https://$evl_host/release.json"
curl -fsSI "https://$evl_host/en"
curl -fsSI "https://$evl_host/tr"
curl -fsSI "https://$evl_host$evl_asset"
curl -fsSI "https://$evl_host/staticwebapp.config.json"
```

Expected: root is a 301 to `/en`; locale routes return the SPA; HTML, JS, JSON, and CSS MIME types are correct; security headers are present; the config source itself is not exposed as content.

- [ ] **Step 9: Run production browser and E2E acceptance**

Use the Browser/IAB first. Inspect desktop and mobile, change the target, remove critical evidence, observe `Hold`, switch locale without losing the claim, inspect a source, export JSON, verify no horizontal overflow, and inspect relevant console logs. Then run:

```bash
PLAYWRIGHT_BASE_URL="https://$evl_host" npx playwright test
```

Expected: production-targeted E2E passes for both locales and both viewports.

- [ ] **Step 10: Prove final repository, Azure, domain boundary, and cleanup state**

```bash
git status --short --branch
git rev-parse HEAD
git rev-parse origin/main
gh run list --repo aserdargun/evl-aserdargun-com --workflow deploy-swa-evl-aserdargun-com.yml --limit 3
az staticwebapp show --subscription "aserdargun subscription 2" --resource-group rg-evl-aserdargun-com --name swa-evl-aserdargun-com -o json
az staticwebapp hostname list --subscription "aserdargun subscription 2" --resource-group rg-evl-aserdargun-com --name swa-evl-aserdargun-com -o json
npm run stop:codex
lsof -nP -iTCP:4178 -sTCP:LISTEN
```

Expected: local/remote SHAs match, worktree is clean, latest correlated run succeeded, SWA is Free/West Europe/Ready, custom-domain list is empty, and no local listener remains. Return the verified Azure-generated `*.azurestaticapps.net` URL.
