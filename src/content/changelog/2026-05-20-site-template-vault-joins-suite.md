---
title: "Site — template-vault-cli joins the suite as the sixth CLI"
date: 2026-05-20
cli: site
version: "0.5.0"
summary: "template-vault-cli is now the Git-backed, clause-aware storage layer at the start of the pipeline, taking the suite from five CLIs to six. New tool page, six-card homepage grid, a six-box workflow diagram (one per CLI) + a 'Store & version' walkthrough step, and install/principles/use-cases/compare/404/og/llms all bumped to the six-CLI narrative."
tags: ["site"]
---

Following [compare-cli joining as the fifth CLI](/changelog/), [template-vault-cli](/tools/template-vault-cli/) is the sixth: the Git-backed, clause-aware **storage layer** at the start of the workflow. Your house templates and forked public sources (Common Paper, YC SAFE, Bonterms) live in one searchable, version-tracked vault; `template-vault get <ref>` resolves a template to hand to [draft-cli](/tools/draft-cli/). The full pipeline is now `store → draft → review → compare → convert → sign`.

What changed on the site:

- **New tool page** at [`/tools/template-vault-cli/`](/tools/template-vault-cli/), mirroring the sibling skeleton (TL;DR, what-it-does, quickstart, agent affordances, where-it-fits, repo link).
- **Registry entry** added in `src/data/registry.ts` — PyPI `template-vault-cli`, repo `DrBaher/template-vault-CLI` — with version / stars / weekly-downloads fetched at build time alongside the other five. Fallback `0.4.8`.
- **Homepage** — hero, TL;DR, and "why six small tools" rebalanced from five to six; the ToolCard grid stays `lg:grid-cols-3`, now a clean 2×3 with template-vault first.
- **Workflow diagram** rebuilt as six boxes, one per CLI: `store → draft → review → compare → convert → sign`.
- **Workflow walkthrough** gains a "Store & version" step at the front (the compare drift-gate step was already integrated); step anchors carry explicit ids so they stay stable.
- **Install page** — new template-vault-cli section (pipx, with the `[docx]` extra), prerequisites, a config-locations row, and Updating / Uninstalling commands.
- **Sibling tool pages** cross-link template-vault as the source of templates; `built-for-agents`, `llms.txt`, OG images, sidebar, footer, 404, compare, principles, and the `package.json` description all move to the six-CLI narrative.
- **Icon** — a stacked-versions motif in the suite palette (cream bg, `#1f7d5d` primary).

Suite description is now: "Six composable, local-first CLIs for the contract operations workflow." Storage is an explicit step instead of an implicit prerequisite.
