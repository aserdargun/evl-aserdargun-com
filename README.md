# EVL — AI Evaluation & Reliability Lab

EVL is a bilingual, evidence-aware workbench for defining evaluation contracts
and checking deterministic release-planning rules. It treats model output,
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

Each target's draft is stored only in the current browser under the versioned
`evl.workbench.v1` key. Each evaluation target retains its own draft, including incomplete edits.
Older single-contract saves remain readable. Invalid fields close the planning gate
and disable JSON export until corrected. Unsupported future storage versions are
never overwritten. No analytics, account, API, remote database, or telemetry
pipeline is included. Data leaves the browser only when the user explicitly
exports a JSON evidence pack.

Switching targets preserves edits through page reloads. Reset replaces only
the selected target's draft.
If storage is unavailable, edits remain in memory and a save warning is shown.

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

## Assessment boundary

READY means the declared contract passes planning checks. EVL does not execute
trials, compare measured outcomes against a threshold, verify a user's coverage
claims, or certify a release. Bundled sources support evaluation-method design;
they are not measurements of the selected system. JSON exports include
`assessmentScope: "contract-planning-only"` and an evaluation refreshed at export.

The editor exposes scope, sampling, success criteria, arbitration, environment
assumptions, uncertainty acknowledgment, and all four layer coverage states.
Critical layers cannot bypass the gate by being marked not applicable. Source
freshness and review dates are rechecked every minute and when the page regains
focus. Grader configurations and source references remain predefined examples.

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
