# Building a new CLI for the contract-ops suite — a playbook

This is the playbook for adding a **new CLI** to the **contract-ops** suite — written for whoever's
building it, human contributor or AI agent. It's the spec for "fits perfectly": follow it, don't reinvent
conventions. When in doubt, open an existing repo and copy its shape. (Building with an AI agent? Hand it
this file — it's written to be followed directly.)

> **Answer this first:** what does the new CLI *do*, and **where does it sit in the pipeline** (or is it
> orthogonal)? Everything below assumes you've answered that.

---

## 0. The suite at a glance

Six composable, **local-first, agent-first** CLIs for end-to-end contract operations. The agent does the
operational work; the human approves the gestures that need a deliberate human action (signing, accepting
a final position).

Pipeline (storage → fill → review → gate → render → sign):

```
template-vault-cli → draft-cli → nda-review-cli → compare-cli → docx2pdf-cli → sign-cli
   (Python)          (Node)       (Python)          (Node)        (Node)         (TS, Node ≥22)
```

- GitHub org: **DrBaher**. Showcase site: **https://cli.drbaher.com**. Playground: the in-browser runner
  embedded on the site (`contract-ops-playground` repo).
- The prose name of the suite is **`contract-ops`** — never "contract-operations", never "contract.cli".
- Positioning is **"agent-first"** (never "agent-driven").

Your new CLI must feel like it was built by the same hand. The rest of this doc is how.

---

## 1. The discovery contract (REQUIRED — this is the load-bearing one)

Every CLI answers `<bin> --catalog json` with this exact shape:

```json
{ "name": "...", "bin": "...", "version": "...", "description": "...",
  "commands": [ { "name": "...", "summary": "...", "flags": [...] } ],
  "exitCodes": { "0": "...", "2": "...", ... } }
```

(Flag-only tools use a top-level `"flags"` array instead of `"commands"`.) Agents call this **at startup**
instead of hardcoding command/flag names, so it must be **complete and accurate** — every command and
flag the binary accepts appears here, with nothing fictional. Treat the catalog as a stable contract.

Tool-specific discovery extras are encouraged where they fit the tool's nature, e.g. `--capabilities`
(machine-readable feature manifest), `--doctor` (host-readiness JSON), `--list-placeholders --json`,
`<bin> mcp tools` (live MCP catalog). Document them in AGENTS.md.

## 2. Output & error contract

- **Success:** JSON to stdout, exit `0`. Offer `--json` wherever scraping prose would otherwise be needed.
- **Errors:** the suite is **not** uniform on the *shape* of the error object (some emit a nested
  `error:{code,message}`, some a flat `error:"<string>"`), and that's fine — but **pick one, document it,
  and never make agents branch on the human-readable message.** Agents branch on the **exit code**.
- **Be a good pipe citizen:** read stdin (`-`), write stdout by default, support `--output PATH`.

## 3. Exit codes (define a small, documented set)

Exit codes are **NOT uniform across the suite** — each CLI documents its own in `--catalog json` and
AGENTS.md. The loose convention most follow: `0` ok · `2` invalid input/usage · `3` policy/verification
failure · `4` not found. But several deliberately diverge (template-vault `0`/`1`/`2`; draft `0`–`4`
ok/io/validation/vault/llm; compare reuses `0`–`4` as *drift severities*). Choose what's honest for your
tool, keep it small, and **document every code**.

## 4. AGENTS.md (REQUIRED)

Canonical sections, in this order:

```
## Output contract        — success/failure envelope, stdout/stderr, --json
## Exit codes             — every code + meaning
## Discovery              — --catalog json + any extras; "call this at startup, don't hardcode"
## Failure → recovery     — common failures and what the agent should do next
```

## 5. README.md

Opens with two sections, in this order:

```
## Run this               — ONE copy-paste command that does something real (a --demo / npx one-shot)
## Where to go next       — a small decision tree: new user / agent / contributor → where to look
```

Then cross-link the other CLIs (with their one-line roles) and the showcase site. Keep a `## Quick start`
and a real end-to-end transcript.

## 6. Repo shape (mirror the others)

```
README.md            # lede + "Run this" + "Where to go next"
AGENTS.md            # the agent contract (section 4)
CHANGELOG.md
llms.txt             # machine-readable suite/tool summary (copy an existing one's structure)
docs/
├── setup/           # per-provider/backend setup
├── reference/       # one canonical file per concept
└── recipes/         # task-oriented recipes (optional)
schemas/             # JSON Schemas for any machine-readable output (keep them validated + version-stable)
```

## 7. Packaging

- **npm:** scope as `@drbaher/<name>-cli` (the unscoped name may be taken); **PyPI:** `<name>-cli`.
- `homepage: https://cli.drbaher.com`; set the `repository`/Homepage to the GitHub URL.
- `keywords` must include: `contract-ops`, `agent-first`, `cli`, `legal-tech` (+ tool-specific).
- **Hard-won lesson — postinstall:** if you use a `postinstall` script, (a) **ship the script in the
  package** (`files` allowlist / not `.npmignore`'d) and (b) make it **non-fatal** (`node x.mjs || exit 0`
  or have the script always `exit 0`). An optional optimization must NEVER break `npm i`. (A real bug:
  sign-cli's postinstall referenced a script missing from `files` → `npm i` failed for everyone.)
- Python tools are **stdlib-first** where possible (single file, no SDKs, no telemetry); Node tools keep
  runtime deps minimal.

## 8. Interop (be a citizen of the pipeline)

- Shared LLM config lives at **`~/.config/contract-ops/llm.json`** (and `NDA_*`/tool-specific env). Reuse it;
  LLM tiers are **opt-in, off by default, with explicit consent** — never call out on a default path.
- Read/produce the suite's artifacts where relevant: template-vault refs are `<category>/<name>[@version]`;
  nda-review emits a hash-chained `negotiation.json` that compare reads via `--from-negotiation`; draft
  fills templates, docx2pdf renders, sign seals. If your CLI sits in the pipeline, accept the upstream
  format and emit something the downstream tool can consume.

## 9. NEVER rename technical identifiers

Prose says "contract-ops"; **identifiers do not change**: the config dir `~/.config/contract-ops/`, package
names, binary names, env vars, JSON-schema keys/enum values, URL slugs, import paths. Only fix *prose*.

## 10. Verify everything against the live CLI

**Every command shown in a README, AGENTS.md, the website, a recipe, or an asciinema cast MUST be verified
against the live `<bin> --catalog json` / `<bin> --help` before shipping.** Don't trust marketing copy or
memory for exact flags. (This caught a fictional `sign-cli send` API, wrong exit-code docs, a phantom
`docx2pdf --batch`, and stale demo casts across the suite.)

## 11. Tests + CI

Tests must pass **before** any push. Match the repo's gate: Python → `python3 -m unittest discover` (+
`mypy --strict` if the repo uses it); Node/TS → `node --test` (build first if TS). CI runs on push — keep
it green. Don't `--no-verify` / skip hooks.

## 12. Wire it into the suite (the integration checklist)

Once the CLI exists and is published, make it show up everywhere the other six do:

- **Site** (`drbaher-cli-site`): add `src/pages/tools/<name>-cli.astro` (copy an existing tool page —
  `FreshHeader`, `JsonLd`, the `## Try it live` `<Playground cli="<name>">` embed, `CastPlayer`); add it to
  `src/data/registry.ts`, the sidebar, the OG generator (`src/pages/og/[...slug].png.ts`), `public/llms.txt`,
  and any "six CLIs" copy (it's **seven** now — update counts honestly). Headings: tool-page `<h1>` uses
  the serif face like everything else.
- **Playground** (`contract-ops-playground`): add a tab — a builder in `src/clis.mjs` (`build()` → argv +
  files/cwd; `shape()` → JSON for the UI) and a panel + render in `public/index.html`. Read-only explorers
  seed a demo dataset at startup (see `seedVault` / `seedSignDb`) and run with `cwd`. Keep the hardened
  executor's guarantees (no-shell `execFile`, stripped env, ephemeral dirs, caps). Bundle example presets
  drawn from real fixtures, not toy strings.
- **GitHub:** add the `contract-ops` topic (+ relevant ones, lowercase-hyphenated, ≤20); accurate description.

## 13. Dev conventions for this project

- Commits: **author AND committer must be `DrBaher <Drbaher@gmail.com>`** (capital D in the email), with
  **no "Claude"/`noreply@anthropic.com` author and no co-author trailer.** Set repo-local
  `git config user.name "DrBaher"` / `user.email "Drbaher@gmail.com"`.
- Direct-to-`main` pushes are authorized for this work; **`git fetch` before every push** (concurrent
  branches); never force-push/reset `main`; never skip hooks.
- The dev display is often asleep, so a building site can't be *visually* verified by the agent — for
  visual/styling changes, stage on a branch and have the human eyeball a preview before merging.

---

## Definition of done

A new CLI "fits the suite" when: `--catalog json` is complete and accurate · AGENTS.md + README follow the
section conventions · it's a good pipe/interop citizen · packaging keywords/homepage/postinstall are right ·
every documented command is verified against the binary · tests/CI are green · and it's wired into the site,
the playground, and GitHub like the other six. Then update the suite's "six → seven" counts and the
[showcase site](https://cli.drbaher.com) honestly.
