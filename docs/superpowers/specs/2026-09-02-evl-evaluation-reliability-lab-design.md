# EVL — AI Evaluation & Reliability Lab

Date: 2026-09-02

Status: Approved design specification

## 1. Product definition

EVL is a bilingual, evidence-aware Evaluation Contract Workbench for the
aserdargun.com learning system. It helps a visitor define what “good” means for
an AI system, inspect whether the proposed evaluation actually measures that
claim, identify missing evidence, and produce a deterministic release-gate
decision.

EVL is the portfolio's metrology layer. It does not replace the domain-specific
work performed by the other applications. It provides a shared measurement
language across them:

- USL: model and adaptation evaluation
- LLM: inference and serving evaluation
- CTX: retrieval and context evaluation
- HNS: agent trajectory and outcome evaluation
- SEC: adversarial and authorization evaluation
- WFM: prediction and planning evaluation
- ENG: physical-task and safety evaluation

CTX is treated as a planned integration until its public application exists.
All other relationships must be represented from current, verified portfolio
data rather than assumed availability.

## 2. Goals

The first release must let a visitor:

1. Select an AI-system class.
2. Start from a relevant reference evaluation contract.
3. Define the claim, evaluation unit, success criteria, thresholds, sampling,
   grader mix, evidence level, and critical risks.
4. Inspect coverage across output, trajectory, outcome, robustness, safety, and
   operational-reliability layers.
5. See missing or weak evidence without a misleading aggregate score hiding it.
6. Receive a deterministic `Ready`, `Conditional`, or `Hold` release-gate
   decision with an explainable reason trail.
7. Export the completed contract and decision as versioned JSON.
8. Learn the underlying evaluation patterns through concise, source-linked
   guidance in Turkish and English.

## 3. Non-goals

The first release will not:

- call model-provider APIs;
- execute benchmarks or arbitrary code;
- upload, store, or transmit user datasets;
- compare vendor leaderboards;
- claim certification, regulatory compliance, or production safety;
- provide accounts, collaboration, cloud persistence, or a backend;
- collapse reliability into one opaque numerical score;
- configure a custom domain as part of the initial Azure release.

## 4. Audience and success criteria

Primary users are AI engineers, evaluators, technical product owners, and
advanced learners who need to turn a broad quality claim into an auditable
evaluation plan.

The release is successful when a new visitor can load a reference case, change
its evaluation choices, understand why the gate decision changed, inspect the
supporting sources, switch language without losing state, and export the result
on both desktop and mobile without creating an account.

## 5. Product architecture

The application is a static React + Vite + TypeScript SPA. It uses no server
runtime. All evaluation logic is deterministic, testable client-side code.

Core modules:

- `AppShell`: locale-aware navigation and responsive layout.
- `Workbench`: coordinates target selection, contract editing, coverage, and
  release-gate output.
- `ContractEditor`: edits the explicit evaluation contract fields.
- `CoverageMatrix`: maps contract evidence to the six measurement layers.
- `DecisionGate`: displays the decision and the exact blocking or conditional
  rules that fired.
- `EvidenceLedger`: exposes sources, publication dates, verification dates,
  evidence types, and affected guidance.
- `PatternLibrary`: explains reusable evaluation patterns and grader types.
- `PortfolioMap`: shows where EVL connects to active and planned applications.
- `ExportService`: creates a schema-versioned JSON snapshot locally.
- `evaluationEngine`: a pure function that validates a contract and produces
  findings plus a gate result.

`App` remains composition glue. Domain data, calculation rules, translations,
and components stay in separate modules with typed public interfaces.

## 6. Routes and information architecture

- `/` redirects permanently to `/en`.
- `/en` is the English workbench.
- `/tr` is the Turkish workbench.
- Unknown client routes fall back to the locale-aware application shell.

The primary page is one cohesive product surface rather than a marketing page.
Its reading and interaction order is:

1. concise product identity and language control;
2. evaluation target selector;
3. evaluation contract workspace;
4. coverage matrix and release gate;
5. pattern library;
6. evidence ledger;
7. portfolio relationship map and methodology note.

Navigation uses anchored regions within the same route so state remains visible
and the static deployment stays simple.

## 7. Primary workflow

### 7.1 Select a system class

The initial system classes are:

- Model & adaptation
- Inference & serving
- Retrieval & context
- Agent & tool use
- Security & authorization
- World model & planning
- Physical AI task

Selecting a class loads an explicitly labeled reference contract. User changes
create a local working copy and never mutate the reference fixture.

### 7.2 Build the evaluation contract

Required fields:

- claim being evaluated;
- evaluation subject and version;
- evaluation unit (`output`, `trajectory`, `outcome`, or mixed);
- task set and intended population;
- success criteria and thresholds;
- number of trials or sampling rationale;
- grader set and arbitration rule;
- critical failure conditions;
- environment and dependency assumptions;
- evidence tier;
- review date.

Grader families are deterministic/rule-based, executable check, statistical
metric, human rubric, and model-based grader. A model-based grader cannot be the
sole evidence for a critical safety claim.

### 7.3 Inspect coverage

The matrix shows six independent layers:

1. Output quality
2. Trajectory/process quality
3. Environment outcome
4. Robustness and variance
5. Safety and security
6. Operational reliability

Each layer reports `covered`, `partial`, `missing`, or `not applicable`, with a
reason. “Not applicable” requires an explicit rationale and is not silently
treated as covered.

### 7.4 Gate the release

The deterministic rule engine returns:

- `Ready`: every applicable layer is covered, no critical condition is missing,
  evidence is current, and uncertainty is acknowledged.
- `Conditional`: no critical blocker exists, but at least one non-critical layer
  is partial or the review date is approaching.
- `Hold`: a critical layer, threshold, outcome check, evidence source, or review
  requirement is missing or invalid.

The decision is always accompanied by ordered findings. Critical findings cannot
be averaged away by strengths in unrelated dimensions.

### 7.5 Export and reset

Export produces JSON containing schema version, locale-neutral contract data,
engine version, findings, gate result, source references, and export timestamp.
No hidden application state is included. Reset restores the selected reference
case after confirmation inside the application.

## 8. Data model

Static, version-controlled data is separated into:

- evaluation targets and reference contracts;
- coverage and decision rules;
- pattern-library entries;
- evidence-source records;
- portfolio-application records;
- Turkish and English message catalogs.

Runtime validation uses Zod. Invalid reference data fails closed: the affected
reference case is unavailable and the UI displays a recoverable data-integrity
message. It must never produce a `Ready` decision from invalid or incomplete
source data.

The evaluation engine accepts a validated `EvaluationContract` and returns a
validated `EvaluationResult`. It performs no I/O, reads no browser state, and is
fully unit-testable.

## 9. Evidence policy

Every methodological claim exposed by the interface must map to a ledger entry
with:

- title and publishing organization;
- canonical URL;
- publication date when available;
- last verified date;
- evidence type (`standard`, `official guidance`, `research`, or `case study`);
- the EVL pattern or rule it supports;
- a concise scope/limitation note.

The initial source set prioritizes primary sources, including:

- Anthropic, “Demystifying evals for AI agents” for task, trial, grader,
  trajectory, outcome, and harness distinctions
  (`https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents`);
- NIST AI measurement and evaluation work for measurement characteristics
  (`https://www.nist.gov/ai-measurement-and-evaluation`);
- NIST AI 800-3 for explicit evaluation assumptions, measurement targets, and
  uncertainty (`https://doi.org/10.6028/NIST.AI.800-3`);
- OpenAI grader documentation for concrete grader families
  (`https://platform.openai.com/docs/guides/graders`).

Sources inform the taxonomy but do not become vendor endorsements. EVL copy must
distinguish research guidance from compliance or certification advice.

## 10. Localization

English and Turkish are equal product surfaces. Content is keyed by stable IDs;
the two catalogs must have exact key parity. Locale switching preserves the
current contract and workbench state because domain values are locale-neutral.

Visible dates use locale-aware formatting, while exported JSON uses ISO 8601.
Terminology that benefits from a stable English engineering term may retain it
with a Turkish explanation rather than inventing a misleading translation.

## 11. Visual system

The visual idea is a contemporary metrology laboratory:

- dark graphite background with high-contrast neutral typography;
- cyan as the active measurement signal;
- amber for conditional states and restrained red for blockers;
- fine calibration lines and sparse plotted marks as structural motifs;
- open rails, matrices, and ledger rows instead of a generic card grid;
- clear typographic hierarchy with compact, deliberately sized control text;
- minimal header containing the EVL mark, essential section navigation, and
  language control;
- no decorative hero eyebrow, fake live metrics, generic dashboard chrome, or
  invented certification badges.

Desktop uses three coordinated regions: target rail, contract workspace, and
evidence/gate rail. The coverage matrix spans the main workspace below the
contract controls. Mobile converts this into a single linear sequence with a
sticky compact decision summary; no horizontal interaction is required.

Motion is limited to state transitions, matrix updates, and focus movement, and
is removed under `prefers-reduced-motion`.

## 12. Accessibility

- Semantic landmarks and heading order describe the complete workflow.
- All controls have visible labels, keyboard operation, and visible focus.
- Touch targets are at least 44 × 44 CSS pixels where space permits.
- Color is never the only carrier of gate or coverage status.
- Status changes use a polite live region without repeating the whole result.
- Tables/matrices have a linear mobile representation and meaningful headers.
- Contrast meets WCAG AA for text and interactive states.
- Reduced motion and high zoom remain usable.

## 13. Local persistence and privacy

The working contract is persisted in `localStorage` under a schema-versioned key.
Only user-entered contract fields and selected target are stored. Evidence,
translations, and rules remain bundled version-controlled data.

The application has no analytics, cookies, accounts, remote storage, or network
submission in the first release. A visible privacy note states that work remains
in the browser unless the user downloads the JSON export.

## 14. Error handling

- Invalid bundled data disables the affected reference case and records a clear
  integrity error.
- Invalid user fields identify the specific field and prevent a release decision.
- Missing critical evidence always yields `Hold`.
- A failed export keeps the working state and presents a retryable message.
- Unsupported persisted schema versions are ignored safely and offer reset; they
  are never coerced into the current schema.
- Empty filters show a meaningful empty state without changing the contract.

## 15. Testing and validation

Automated coverage includes:

- schema validation for every bundled record;
- unit tests for all release-gate branches and critical-blocker precedence;
- property-oriented tests ensuring incomplete contracts cannot return `Ready`;
- TR/EN key and content-structure parity;
- component tests for target selection, editing, reset, and export;
- accessibility checks for labels, landmarks, focus, and status announcements;
- Playwright flows for the full reference-contract journey in both locales;
- desktop and mobile overflow checks;
- production build and artifact-contract validation;
- Static Web Apps routing/security-header contract checks.

Browser acceptance covers page identity, source visibility, meaningful state
changes, JSON export, keyboard access, clean console, and responsive layout.

## 16. Local Codex environment

The repository will provide reproducible Setup, Run, Validate, and Stop actions.
Run binds to loopback on a deterministic strict port. Stop only terminates a
listener proven to belong to this checkout and succeeds when the port is already
free. Validate runs data checks, lint, typecheck, tests, build, artifact checks,
browser tests, and `git diff --check`.

## 17. GitHub and Azure release contract

Repository and release identifiers are fixed:

- GitHub repository: `aserdargun/evl-aserdargun-com`
- production branch: `main`
- resource group: `rg-evl-aserdargun-com`
- Static Web App: `swa-evl-aserdargun-com`
- workflow: `.github/workflows/deploy-swa-evl-aserdargun-com.yml`
- concurrency group: `swa-evl-aserdargun-com-production`
- deployment secret:
  `AZURE_STATIC_WEB_APPS_API_TOKEN_SWA_EVL_ASERDARGUN_COM`
- artifact: `dist`
- Azure subscription: `aserdargun subscription 2`
- region: West Europe
- SKU: Free

The workflow validates and builds the repository, verifies `dist`, and deploys
the prebuilt artifact with `skip_app_build: true`. The Azure deployment token is
piped directly into the GitHub Actions secret and is never printed or stored.

Initial publication ends at the Azure-generated `*.azurestaticapps.net` host.
Custom-domain and DNS work are explicitly outside this release.

## 18. Release acceptance contract

Completion requires correlated evidence that:

1. local validation, tests, build, artifact checks, and browser checks pass;
2. the intended commit is the remote `main` head and the worktree is clean;
3. the single production workflow succeeds for that commit;
4. the exact Azure resource is Free, in West Europe, provisioned successfully,
   and `Ready` on `main`;
5. the generated hostname serves the intended HTML and assets with correct MIME
   types and security headers;
6. desktop and mobile production interaction checks pass without overflow or
   console errors;
7. the custom-domain list is empty.

The release is reported as pending rather than complete if any one of these
signals is missing or belongs to a different commit/run.
