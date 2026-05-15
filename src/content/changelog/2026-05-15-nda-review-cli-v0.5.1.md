---
title: "nda-review-cli v0.5.1 — `--catalog json`, `sample-nda`, `doctor --check-llm`, doc reorg"
date: 2026-05-15
cli: nda-review-cli
version: "0.5.1"
summary: "Adds --catalog json for cross-suite agent discovery, sample-nda for first-run users, doctor --check-llm for LLM-provider reachability, --help epilogs on the four user-facing subcommands. Ships the shared three-CLI-suite doc shape (AGENTS.md + docs/setup/ + docs/reference/)."
tags: ["release", "agent", "catalog"]
---

Cuts the agent-discovery + onboarding-polish work as v0.5.1.

- **`nda-review-cli --catalog json`** — machine-readable inventory of every subcommand and flag, including the nested `negotiate <sub>` tree (23 top-level commands, 12 nested negotiate subcommands). Stable across minor versions. Matches the cross-suite contract used by `sign --catalog json` and `docx2pdf --catalog json`. Agents call this at startup rather than parsing `--help`.
- **`sample-nda --out PATH`** — drops the bundled sample NDA fixture into a user-chosen path so first-run users have something substantial to point `review` at without knowing the fixture's filesystem location. The fixture is a representative SaaS-style mutual NDA with clauses that reliably trip rule-engine findings (jurisdiction mismatch, indefinite-survival carve-out, term length).
- **`doctor --check-llm`** — sends a 1-token round-trip to the configured LLM provider (from `config/llm.json` or `NDA_LLM_*` env vars) to confirm reachability, model name, and auth. Closes the most common LLM-setup stumble: "I edited config/llm.json, did it work?"
- **`--help` epilogs with concrete examples** for the four most user-facing subcommands: `review`, `draft`, `doctor`, and `negotiate init`. Replaces a README round-trip with in-place discovery.
- **First-run hint adapts to invocation form** — detects whether the user invoked as `./nda_review_cli.py` or `nda-review-cli` (pipx) and prints the matching prefix in every example. Disambiguates the three onboarding paths (`tutorial` / `quickstart` / `setup --quick --yes`).
- **Wheel-bundling fix** — `pyproject.toml`'s manifest now uses a `templates/*.md` glob so all bundled templates (including Common Paper Mutual NDA v1.0) ship in the wheel. The previous per-file allowlist silently omitted templates.
- **Sandboxed web demo** under `web/` with one-click deployment to Railway / Fly.io / Render. Stdlib-only Python service wrapping the CLI behind three browser flows (draft / review / negotiation simulator). Per-session UUID sandboxes auto-expire after 30 minutes.
- **Doc reorg adopted** — new top-level `AGENTS.md`, `docs/setup/` (per-LLM-provider setup: Anthropic, OpenAI, Ollama, OpenAI-compatible, plus `integrations.json` hooks for handing off to `docx2pdf-cli` and `sign-cli`), and `docs/reference/` for concept deep-dives (policy, stance, fatigue, scoring, state-file, exit codes, LLM data-flow). README trimmed from 619 to 280 lines.

Install: clone the repo or `pipx install git+https://github.com/DrBaher/nda-review-cli.git`. PyPI publishing is being set up — once enabled, `pipx install nda-review-cli` will fetch the latest release directly.
