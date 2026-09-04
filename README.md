# EVL — AI Evaluation & Reliability Lab

EVL is a bilingual, evidence-aware workbench for defining evaluation contracts
and making deterministic AI release decisions. It treats model output,
trajectory, outcome, robustness, safety, and operations as separate evidence
layers. Critical gaps fail closed instead of disappearing inside an average
score.

## Product routes

- `/en` — English workbench
- `/tr` — Turkish workbench
- `/` — permanent redirect to `/en` in Azure Static Web Apps

The initial corpus connects EVL to the live USL, LLM, CTX, HNS, SEC, WFM, and
ENG applications as a shared verification layer.

## Privacy boundary

The working contract is stored only in the current browser under the versioned
`evl.workbench.v1` key. No analytics, account, API, remote database, or telemetry
pipeline is included. Data leaves the browser only when the user explicitly
exports a JSON evidence pack.

## Local workflow

Requires Node.js 22 and npm 10.

```bash
npm ci
npx playwright install chromium
npm run start:codex
```

Validation and safe shutdown:

```bash
npm run validate
npm run stop:codex
```

`stop:codex` checks that the process listening on port 4178 belongs to this
checkout before terminating it. It refuses foreign processes.

## Evidence policy

Bundled sources are primary NIST, Anthropic, and OpenAI materials. Every record
carries a publication date when available, a current verification date, an
evidence tier, supported patterns, and a visible limitation. Reference
contracts are planning examples, not benchmark results. The evidence ledger
supports method design; it does not certify a model, system, vendor, or release.

## Release contract

The public `main` branch deploys its tested `dist` artifact to an Azure Static
Web App on the Free plan in `aserdargun subscription 2`. The workflow uses pinned
official actions and a repository secret named
`AZURE_STATIC_WEB_APPS_API_TOKEN_SWA_EVL_ASERDARGUN_COM`. Each build publishes a
`release.json` containing the exact Git commit SHA.

The Azure-generated production hostname is
`ambitious-sea-06418d303.6.azurestaticapps.net`; the validated public custom
domain is `evl.aserdargun.com`. Deployment reuses the existing binding and does
not create or modify DNS records.
