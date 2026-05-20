---
title: "Site — template-vault-cli and compare-cli join the suite"
date: 2026-05-20
cli: site
version: "0.5.0"
summary: "The suite grows from four CLIs to six. template-vault-cli is the Git-backed, clause-aware storage layer at the start of the pipeline; compare-cli is a clause-aware drift gate before signing. New tool pages, a six-card homepage grid, a reworked six-box workflow diagram + seven-step walkthrough, and install/principles/use-cases/compare/404/og/llms all updated to the six-CLI narrative."
tags: ["site"]
---

The contract-operations suite is now six CLIs. Two new tools bracket the existing pipeline:

- [template-vault-cli](/tools/template-vault-cli/) — the Git-backed, clause-aware **storage layer** at the start of the workflow. Your house templates and forked public sources (Common Paper, YC SAFE, Bonterms) live in one searchable, version-tracked vault; `template-vault get <ref>` resolves a template to hand to [draft-cli](/tools/draft-cli/).
- [compare-cli](/tools/compare-cli/) — a clause-aware **drift gate** before signing. It diffs the agreed text against the ready-to-sign artifact and returns an exit code (0 safe · 2 substantive · 3 cosmetic · 4 moved) that CI or an agent can branch on.

What changed on the site:

- **Two new tool pages** at [`/tools/template-vault-cli/`](/tools/template-vault-cli/) and [`/tools/compare-cli/`](/tools/compare-cli/), mirroring the sibling tool-page skeleton (TL;DR, what-it-does, quickstart, agent affordances, where-it-fits, repo link).
- **Homepage** — hero, TL;DR, and "why N small tools" rewritten from "Four CLIs" to "Six CLIs"; the ToolCard grid went from a 1 / 2 / 4 layout to a responsive 1 / 2 / 3 grid with the two new cards (template-vault first, compare after nda-review).
- **Workflow diagram** rebuilt as six boxes — one per CLI — `store → draft → review → compare → convert → sign`.
- **Workflow walkthrough** now has seven steps: a new "Store & version" step at the front and a "Compare for drift" gate before convert. Step anchors were renumbered.
- **Install page** — new template-vault-cli (pipx, with the `[docx]` extra) and compare-cli (npm, command `compare`) install sections, prerequisites, config-locations table rows, and Updating / Uninstalling commands.
- **Sibling tool pages** cross-link the two new CLIs where the pipeline narrative calls for it.
- **Registry** learns both CLIs (PyPI `template-vault-cli`, npm `compare-cli`) for live version / stars badges.
- **OG images, llms.txt, `og-default.svg`, sidebar, footer, 404, compare, principles, built-for-agents, package.json description** — all updated to the six-CLI narrative.
- **Icons** — a stacked-versions motif for template-vault-cli and a two-versions-with-delta motif for compare-cli, both in the suite palette (cream bg, `#1f7d5d` primary).

Suite description is now: "Six composable, local-first CLIs for the contract operations workflow." Storage and drift-detection are now explicit steps instead of implicit gaps.
