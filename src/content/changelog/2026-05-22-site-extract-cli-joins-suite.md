---
title: "Site — extract-cli joins the suite as the seventh CLI"
date: 2026-05-22
cli: site
version: "0.6.0"
summary: "extract-cli is now the open-loop front door of the suite — ingest any contract (.md/.txt/.html/.docx/.pdf, yours or a counterparty's) into structured JSON, taking the suite from six CLIs to seven. New tool page, a seven-card homepage grid, a seven-box workflow diagram + a 'Step 0 — Ingest' walkthrough, a seventh playground tab, and install/tour/play/principles/use-cases/404/og/llms all bumped to the seven-CLI narrative."
tags: ["site"]
---

[extract-cli](/tools/extract-cli/) is the seventh CLI: the suite's **open-loop front door**. The rest of the pipeline is a closed loop that only handles documents authored from its own templates; extract-cli ingests **any** document — a counterparty's foreign paper in `.md` / `.txt` / `.html` / `.docx` / `.pdf` — and emits structured JSON the pipeline can consume: parties, dates, term, governing law, and a clause map normalized onto the suite's canonical clause vocabulary. Every field carries a `confidence` and a `source`, so downstream tools verify, don't trust. It sits upstream of review, feeding [nda-review-cli](/tools/nda-review-cli/) and [compare-cli](/tools/compare-cli/).

What changed on the site:

- **New tool page** at [`/tools/extract-cli/`](/tools/extract-cli/), mirroring the sibling skeleton (TL;DR, try-it-live playground embed, what-it-does, quickstart, agent affordances, where-it-fits, repo link).
- **Registry entry** in `src/data/registry.ts` — PyPI `extract-cli`, repo `DrBaher/extract-cli` — version / stars / weekly-downloads fetched at build time alongside the other six. Fallback `0.1.7`.
- **Homepage** — hero, TL;DR, the "seven tools at a glance" table, the ToolCard grid (`lg:grid-cols-3`, now seven cards), and "why seven small tools" all rebalanced from six to seven, with extract-cli first.
- **Workflow diagram** rebuilt as a data-driven seven-box SVG: `ingest → store → draft → review → compare → convert → sign`.
- **Workflow walkthrough** gains a "0 — Ingest any contract" front-door step (extract feeds review/compare; the closed loop still starts at step 1 if you're authoring from your own template).
- **Playground** gains a seventh tab (`?cli=extract`); the `/play` page and tour now cover all seven zero-config demos.
- **Install page** — new extract-cli section (pipx, with `[docx,pdf]` extras), prerequisites, and Updating / Uninstalling commands.
- **Sibling pages, OG images, sidebar, footer, search, `built-for-agents`, `llms.txt`, content config, the cli-link plugin, and the `package.json` description** all move to the seven-CLI narrative.
- **Icon** — a document-under-a-magnifier motif (with JSON braces in the lens) in the suite palette.

On the repo side, extract-cli also shipped **v0.1.7**: the `extract --catalog json` discovery contract, an `AGENTS.md`, an `llms.txt`, and the suite-standard packaging keywords — so it answers the same agent contract as the other six.
