---
title: "contract-lint-cli joins the suite — a pre-signature quality gate"
date: 2026-05-22
cli: contract-lint-cli
version: "0.1.0"
summary: "The ninth CLI: a deterministic linter for a contract's internal consistency — leftover placeholders, broken cross-references, undefined/unused defined terms, numbering gaps, party-name and date inconsistencies — with CI-gateable exit codes. Where compare-cli gates drift between versions, contract-lint gates defects within one document."
tags: ["contract-lint-cli"]
---

[**contract-lint-cli**](/tools/contract-lint-cli/) is the **ninth** CLI in the suite — and the gate the workflow was missing.

Until now the only pre-signature gate was [compare-cli](/tools/compare-cli/), which catches **drift between versions**. Nothing checked a contract's **internal consistency**. contract-lint fills that slot:

- **Eight deterministic rules.** Errors: `placeholder` (leftover `[Bracketed]` / `{{mustache}}` / `TBD`) and `broken-xref` (a Section/Exhibit/Schedule reference with no target). Warnings (on by default): `unused-definition`, `double-definition`, `numbering`, `party-consistency`, `date-sanity`. `undefined-term` ships off by default.
- **A real CI gate.** `--fail-on error|warning|none` sets the threshold, `--check` is exit-code-only. Exit `0` clean · `1` findings at/above the threshold · `2` bad usage. No model, no network, byte-stable (timestamp-free) output.
- **Machine-readable.** A human table by default; `--json` (locked schema) and `--sarif` (2.1.0) for tools and agents. `contract-lint --catalog json` and `contract-lint rules --json` are the discovery surface.

The mental model: **compare-cli gates *drift between versions*; contract-lint gates *defects within one document*.** Run both after [draft](/tools/draft-cli/) and before [sign](/tools/sign-cli/) — `draft → contract-lint / compare → docx2pdf → sign`. It also stands alone as a deterministic CI check for any team that drafts contracts.

It's wired into the suite the same way as every other CLI: a [tool page](/tools/contract-lint-cli/), the [playground](/play/) (paste a contract → see findings), the registry, `llms.txt`, and the install + workflow pages. Stdlib-only Python, single file, MIT — `pipx install contract-lint`.
