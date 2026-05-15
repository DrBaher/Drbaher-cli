---
title: "docx2pdf-cli v0.2.2 — `--catalog json`, agent-doc reorg, telemetry shipped"
date: 2026-05-15
cli: docx2pdf-cli
version: "0.2.2"
summary: "Ships the `--retries` flag and `--json` success telemetry (outputBytes, durationMs, exitCode in failure rows) as v0.2.2 alongside the doc reorg. Adds `--catalog json` for cross-suite agent discovery."
tags: ["release", "agent", "catalog"]
---

The agent-discovery + telemetry-on-npm release.

- **`--catalog json`** — machine-readable flag inventory matching the cross-suite contract (parallels `sign --catalog json` and `nda-review-cli --catalog json`). Stable across minor versions. Complements the existing `--capabilities` (feature contract) and `--doctor` (host readiness). Agents call this at startup rather than parsing `--help`.
- **`--retries <n>`** — retry network backends (`gotenberg`, `convertapi`) with non-busy backoff (`Atomics.wait`). Advertised via `supports.retries: true` in `--capabilities`.
- **JSON success telemetry** — every success row in `--json` mode now carries `backend`, `input`, `output`, `outputBytes`, and `durationMs`. Failure rows carry `exitCode` so a batch consumer can branch per file. NDJSON shape is documented in [docs/reference/json-output.md](https://github.com/DrBaher/docx2pdf-cli/blob/main/docs/reference/json-output.md).
- **`CliError.kind`** — structured error class (e.g. `"NO_BACKEND"`) so library callers branch on error type, not message text.
- **Doc reorg adopted** — new `AGENTS.md` (replaces the prior `docs/AGENT_INTEGRATION.md`), `docs/setup/` per-backend (LibreOffice, Gotenberg, ConvertAPI, Pages, Word), `docs/reference/` for concept docs (backends, doctor JSON shape, exit codes, json-output), and a new `schemas/doctor.schema.json` so the `--doctor` output is now formally schema-validated.
- README restructured around audience: "Run this" (`docx2pdf --doctor`) → "Where to go next" decision tree → human quickstart → agent affordances. Human path precedes the agent section now.

Install: `npm i -g docx2pdf-cli` (already on npm).
