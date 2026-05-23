#!/usr/bin/env node
/**
 * Catalog drift check — keep the site copy honest as the CLIs evolve.
 *
 * Each suite CLI publishes a machine-readable `--catalog json` (commands,
 * version, exit codes). The tools ship releases faster than the prose on this
 * site is rewritten, so command lists / rule counts / exit codes can silently
 * drift out of sync. This script fetches each CLI's LIVE catalog and diffs it
 * against a committed snapshot — the catalog state when the site copy was last
 * reviewed. On drift it prints a report and exits non-zero, which the scheduled
 * workflow turns into a GitHub issue prompting a human to refresh the prose.
 *
 *   node scripts/catalog-drift.mjs            # check; exit 1 on drift
 *   node scripts/catalog-drift.mjs --update   # re-baseline the snapshot
 *
 * Python CLIs run in an ephemeral venv (no pipx needed); npm CLIs via npx.
 * Network/transient install failures are reported but do NOT count as drift.
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const SNAPSHOT = join(HERE, 'catalog-snapshot.json');
const UPDATE = process.argv.includes('--update');

// One row per CLI that publishes `<bin> --catalog json`, in pipeline order.
// `rules: true` also captures the `rules --json` rule ids (contract-lint's
// known drift point). All nine suite CLIs now ship --catalog in a published
// release (compare-cli 0.4.0 + draft-cli 0.10.0 closed the last gap), so the
// whole pipeline is covered.
const CLIS = [
  { key: 'extract-cli',        kind: 'pypi', pkg: 'extract-cli',        bin: 'extract' },
  { key: 'template-vault-cli', kind: 'pypi', pkg: 'template-vault-cli', bin: 'template-vault' },
  { key: 'draft-cli',          kind: 'npm',  pkg: '@drbaher/draft-cli', bin: 'draft' },
  { key: 'nda-review-cli',     kind: 'pypi', pkg: 'nda-review-cli',     bin: 'nda-review-cli' },
  { key: 'contract-lint-cli',  kind: 'pypi', pkg: 'contract-lint',      bin: 'contract-lint', rules: true },
  { key: 'compare-cli',        kind: 'npm',  pkg: 'compare-cli',        bin: 'compare' },
  { key: 'docx2pdf-cli',       kind: 'npm',  pkg: 'docx2pdf-cli',       bin: 'docx2pdf' },
  { key: 'sign-cli',           kind: 'npm',  pkg: '@drbaher/sign-cli',  bin: 'sign' },
  { key: 'contract-vault-cli', kind: 'pypi', pkg: 'contract-vault',     bin: 'contract-vault' },
];

const sh = (cmd, args, opts = {}) =>
  execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], timeout: 240000, ...opts });

/** Run a CLI's `--catalog json` (and optionally `rules --json`), return parsed JSON. */
function fetchCatalog(c) {
  if (c.kind === 'npm') {
    const cat = JSON.parse(sh('npx', ['-y', '-p', c.pkg, c.bin, '--catalog', 'json']));
    return cat;
  }
  const venv = mkdtempSync(join(tmpdir(), 'cdrift-'));
  try {
    sh('python3', ['-m', 'venv', venv]);
    sh(join(venv, 'bin', 'pip'), ['install', '-q', c.pkg]);
    const cat = JSON.parse(sh(join(venv, 'bin', c.bin), ['--catalog', 'json']));
    if (c.rules) {
      try {
        const r = JSON.parse(sh(join(venv, 'bin', c.bin), ['rules', '--json']));
        const list = Array.isArray(r) ? r : r.rules || [];
        cat.__rules = list.map((x) => x.id).filter(Boolean).sort();
      } catch { /* rules subcommand optional */ }
    }
    return cat;
  } finally {
    rmSync(venv, { recursive: true, force: true });
  }
}

/** Reduce a catalog to the facts the site copy depends on. */
function fingerprint(cat) {
  const fp = {
    version: cat.version ?? null,
    commands: (cat.commands ?? []).map((c) => c.name).filter(Boolean).sort(),
    exitCodes: cat.exitCodes ?? {},
  };
  if (cat.__rules) { fp.rules = cat.__rules; fp.ruleCount = cat.__rules.length; }
  return fp;
}

const arrDiff = (a = [], b = []) => ({
  added: b.filter((x) => !a.includes(x)),
  removed: a.filter((x) => !b.includes(x)),
});

/** Human-readable diff of two fingerprints; returns null if identical (ignoring version). */
function diff(key, was, now) {
  const lines = [];
  if (was.version !== now.version) lines.push(`    version: ${was.version} → ${now.version}`);
  const cmd = arrDiff(was.commands, now.commands);
  if (cmd.added.length) lines.push(`    + commands: ${cmd.added.join(', ')}`);
  if (cmd.removed.length) lines.push(`    − commands: ${cmd.removed.join(', ')}`);
  const exWas = JSON.stringify(was.exitCodes ?? {});
  const exNow = JSON.stringify(now.exitCodes ?? {});
  if (exWas !== exNow) lines.push(`    exit codes changed: ${exWas} → ${exNow}`);
  if (was.rules || now.rules) {
    const rd = arrDiff(was.rules, now.rules);
    if (rd.added.length) lines.push(`    + rules: ${rd.added.join(', ')} (now ${now.ruleCount})`);
    if (rd.removed.length) lines.push(`    − rules: ${rd.removed.join(', ')} (now ${now.ruleCount})`);
  }
  return lines.length ? lines.join('\n') : null;
}

const snapshot = existsSync(SNAPSHOT) ? JSON.parse(readFileSync(SNAPSHOT, 'utf8')) : {};
const live = {};
const failures = [];

for (const c of CLIS) {
  process.stderr.write(`· ${c.key} … `);
  try {
    live[c.key] = fingerprint(fetchCatalog(c));
    process.stderr.write(`ok (v${live[c.key].version})\n`);
  } catch (e) {
    failures.push(c.key);
    process.stderr.write(`FETCH FAILED (${String(e.message).split('\n')[0].slice(0, 80)})\n`);
  }
}

if (UPDATE) {
  // Keep the prior value for any CLI we couldn't fetch this run.
  const next = { _generated: new Date().toISOString().slice(0, 10) };
  for (const c of CLIS) next[c.key] = live[c.key] ?? snapshot[c.key];
  writeFileSync(SNAPSHOT, JSON.stringify(next, null, 2) + '\n');
  console.log(`Snapshot updated (${Object.keys(live).length}/${CLIS.length} fetched live).`);
  process.exit(0);
}

// Check mode
const drifted = [];
const isNew = [];
for (const c of CLIS) {
  if (!live[c.key]) continue; // fetch failure → reported below, not drift
  const was = snapshot[c.key];
  if (!was) { isNew.push(c.key); continue; }
  const d = diff(c.key, was, live[c.key]);
  if (d) drifted.push(`  ${c.key}:\n${d}`);
}

console.log('# Catalog drift report\n');
console.log(`Snapshot baseline: ${snapshot._generated ?? '(none)'} · checked ${CLIS.length} CLIs\n`);
if (drifted.length) {
  console.log('## Drift detected — the site copy may need a refresh:\n');
  console.log(drifted.join('\n\n'));
  console.log('\nAfter updating the site prose (tool pages, llms.txt, install, recipes), re-baseline with:');
  console.log('  node scripts/catalog-drift.mjs --update');
}
if (isNew.length) console.log(`\n## Not yet in snapshot (run --update): ${isNew.join(', ')}`);
if (failures.length) console.log(`\n## Could not fetch (transient — ignored): ${failures.join(', ')}`);
if (!drifted.length && !isNew.length) console.log('No drift. Site catalog facts match the live CLIs. ✓');

process.exit(drifted.length || isNew.length ? 1 : 0);
