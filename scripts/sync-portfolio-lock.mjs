#!/usr/bin/env node
// Regenerates src/data/portfolio.lock.json from the canonical public application
// manifest, which lives in the sibling `aserdargun-com` repo
// (data/living-system.json). The lock is committed on purpose: CI has no network
// access, so the hand-written portfolio data is verified against this committed
// projection instead of against the live manifest.
//
// Usage:
//   npm run sync:portfolio
//   ASERDARGUN_LIVING_SYSTEM=/abs/path/living-system.json npm run sync:portfolio
//   node scripts/sync-portfolio-lock.mjs /abs/path/living-system.json
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const repoRoot = path.resolve(import.meta.dirname, '..')
const lockPath = path.join(repoRoot, 'src', 'data', 'portfolio.lock.json')

// Declared here, never derived from src/data/portfolio.ts: the grouping below is
// local editorial taxonomy, but which codes exist upstream is not. The test
// compares the module against this list, not against itself.
const CODES = [
  'adp',
  'aos',
  'arl',
  'cld',
  'cul',
  'ctx',
  'dcl',
  'dpl',
  'eng',
  'hex',
  'hns',
  'itl',
  'lcl',
  'llm',
  'mem',
  'pdt',
  'dtr',
  'sec',
  'tfl',
  'usl',
  'wfm',
  'wml',
]
// Minimal projection: only the fields src/data/portfolio.ts derives from.
const FIELDS = ['code', 'address', 'focusState', 'status']

const defaultManifest = path.join(repoRoot, '..', 'aserdargun-com', 'data', 'living-system.json')
const manifestPath = path.resolve(process.env.ASERDARGUN_LIVING_SYSTEM ?? process.argv[2] ?? defaultManifest)

function fail(message) {
  console.error(`sync:portfolio — ${message}`)
  process.exit(1)
}

let raw
try {
  raw = await readFile(manifestPath, 'utf8')
} catch {
  fail(
    `canonical manifest not readable at ${manifestPath}. Clone the sibling aserdargun-com repo ` +
      'next to this checkout, or pass ASERDARGUN_LIVING_SYSTEM=<path to data/living-system.json>.',
  )
}

let manifest
try {
  manifest = JSON.parse(raw)
} catch (error) {
  fail(`canonical manifest is not valid JSON (${manifestPath}): ${error.message}`)
}

if (!Array.isArray(manifest?.applications)) {
  fail(`canonical manifest has no "applications" array (${manifestPath})`)
}

const byCode = new Map(manifest.applications.map((app) => [app?.code, app]))
const missing = CODES.filter((code) => !byCode.has(code))
if (missing.length > 0) {
  fail(
    `canonical manifest is missing ${missing.length} referenced code(s): ${missing.join(', ')}. ` +
      'Either the code was retired upstream or this repo must drop it deliberately.',
  )
}

const applications = CODES.map((code) => {
  const app = byCode.get(code)
  for (const field of FIELDS) {
    if (app[field] === undefined || app[field] === null) {
      fail(`manifest application "${code}" has no "${field}"`)
    }
  }
  return Object.fromEntries(FIELDS.map((field) => [field, app[field]]))
})

const next = {
  source: 'aserdargun-com/data/living-system.json',
  applications,
}

const previous = await readFile(lockPath, 'utf8').then(
  (text) => JSON.parse(text),
  () => null,
)

await writeFile(lockPath, `${JSON.stringify(next, null, 2)}\n`, 'utf8')

if (previous === null) {
  console.log(`sync:portfolio — created ${path.relative(repoRoot, lockPath)} with ${applications.length} applications from ${manifestPath}`)
} else if (previous.source !== next.source) {
  console.log(`sync:portfolio — source changed: ${previous.source} -> ${next.source}`)
}

const previousByCode = new Map((previous?.applications ?? []).map((app) => [app.code, app]))
const changes = []
for (const app of applications) {
  const before = previousByCode.get(app.code)
  if (!before) {
    changes.push(`+ ${app.code} ${app.address} (${app.focusState}/${app.status})`)
    continue
  }
  for (const field of FIELDS) {
    if (JSON.stringify(before[field]) !== JSON.stringify(app[field])) {
      changes.push(`~ ${app.code}.${field}: ${JSON.stringify(before[field])} -> ${JSON.stringify(app[field])}`)
    }
  }
  previousByCode.delete(app.code)
}
for (const code of previousByCode.keys()) {
  changes.push(`- ${code} (no longer referenced by this repo's CODES list)`)
}

if (changes.length === 0) {
  console.log(`sync:portfolio — ${applications.length} applications already match ${manifestPath}`)
} else {
  console.log(`sync:portfolio — ${changes.length} change(s) written to ${path.relative(repoRoot, lockPath)}:`)
  for (const change of changes) console.log(`  ${change}`)
}
console.log('sync:portfolio — run `npm test` to confirm src/data/portfolio.ts still matches the lock.')
