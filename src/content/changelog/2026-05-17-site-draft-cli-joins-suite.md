---
title: "Site — draft-cli joins the suite as the fourth CLI"
date: 2026-05-17
cli: site
version: "0.4.0"
summary: "draft-cli is now the templated drafting step at the start of the contract pipeline. New tool page, four-card homepage grid, updated workflow diagram + walkthrough, install/principles/use-cases/compare/404/og/llms all updated to the four-CLI narrative."
tags: ["site"]
---

[draft-cli](/tools/draft-cli/) is the templated drafting step at the start of the contract pipeline: fill placeholders in markdown or `.docx` templates, hand the filled draft to [nda-review-cli](/tools/nda-review-cli/) for policy review or directly to [docx2pdf-cli](/tools/docx2pdf-cli/) for PDF rendering.

What changed on the site:

- **New tool page** at [`/tools/draft-cli/`](/tools/draft-cli/) — mirrors the sibling tool-page skeleton (TL;DR, what-it-does, quickstart, agent affordances, where-it-fits, repo link).
- **Homepage hero rewritten** — "Three CLIs" → "Four CLIs" with draft-cli's tagline added to the "drafting an NDA, reviewing what comes back, negotiating, converting to PDF, signing" narrative.
- **ToolCard grid** went from 3 columns to a responsive 1 / 2 / 4 layout. The card body was rebalanced so the tags row, install command, and "Read more" link sit at the same vertical position across cards even when taglines have different lengths.
- **Workflow diagram** — step 1 box now reads `draft-cli` / `draft` instead of `nda-review-cli` / `draft`. The bottom-strip caption updates from "house policy" to "your template" to match.
- **Workflow walkthrough** — step 1 rewritten around `draft template.docx --params deal.json`, with a clarifying note that `nda-review-cli` still ships bundled NDA templates and can render them directly via its own `draft` subcommand for the NDA-specific case.
- **Install page** — new draft-cli install section first (npm / pnpm / yarn / npx tabs), prerequisites list updated to list Node.js first, configuration-locations table row added, Updating + Uninstalling commands updated.
- **Sibling tool pages** cross-link draft-cli where the pipeline narrative calls for it.
- **Vendor-onboarding use case** updated to chain `draft …` then `nda-review-cli review …` rather than a single `nda-review-cli draft` call.
- **Built-for-agents discovery** lists `draft --list-placeholders --json` alongside the sibling CLIs' discovery commands.
- **OG images, llms.txt, `og-default.svg`, sidebar, footer, 404, compare, principles, package.json description** — all updated to the four-CLI narrative.
- **Icon** — bracket motif (suite palette: cream bg, `#1f7d5d` primary), tuned for legibility at the 40 × 40 ToolCard size.

Suite description is now: "Four composable, local-first CLIs for the contract operations workflow." Same shape as before, with templated drafting as the first explicit step instead of an implicit prerequisite.
