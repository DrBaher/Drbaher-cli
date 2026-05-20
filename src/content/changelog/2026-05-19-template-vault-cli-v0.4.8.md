---
title: "template-vault-cli v0.4.8 — cross-CLI interop: schemas, INTEROP doc, shared LLM config"
date: 2026-05-19
cli: template-vault-cli
version: "0.4.8"
summary: "Ships the suite's storage contract: six JSON Schemas under docs/spec/ for the data template-vault produces, a docs/INTEROP.md citation point, and a suite-wide LLM-config lookup at ~/.config/contract-ops/llm.json shared with nda-review-cli."
tags: ["release", "interop"]
---

v0.4.8 turns template-vault-cli's outputs into a contract the rest of the suite can build on.

- **Six JSON Schemas in `docs/spec/`** (JSON Schema 2020-12) for the data template-vault produces: `meta.schema.json`, `vault-config.schema.json`, `info-json.schema.json`, `find-json.schema.json`, `history-json.schema.json`, `stats-json.schema.json`. Stable since this version, with a semver commitment — a backward-incompatible change requires a major version bump. Downstream tools (e.g. nda-review-cli reading `info --json`) can validate against the schema files directly instead of trusting field shapes by convention.
- **`docs/INTEROP.md`** — the cross-CLI contract document and citation point for the schemas, the shared LLM-config lookup, and the suite-wide UX conventions (`--why` to stderr, `--json` on stdout, `-q` / `--silent` aliases, `--no-color`, `NO_COLOR`, exit codes).
- **Shared LLM config** — `~/.config/contract-ops/llm.json` is now the suite-wide provider config location, shared with nda-review-cli. Configure it once and LLM features light up across every Python tool in the suite that adopts the same lookup order.

template-vault-cli structures existing templates; it does not generate clause text. The `ask` command remains opt-in and metadata-only by default. Install: `pipx install template-vault-cli`.
