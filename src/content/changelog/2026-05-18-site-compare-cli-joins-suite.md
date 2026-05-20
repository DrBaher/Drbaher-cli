---
title: "Site — compare-cli joins the suite as the fifth CLI"
date: 2026-05-18
cli: site
version: "0.4.1"
summary: "compare-cli is now the pre-signature gate in the contract pipeline. New tool page and registry entry; homepage hero / workflow diagram / ToolCard grid scoped to a follow-up to keep this change minimal."
tags: ["site"]
---

[compare-cli](/tools/compare-cli/) is the pre-signature gate: compare two contract versions (the negotiated text vs the ready-to-sign artifact) and classify every difference as cosmetic, typographic, or substantive. The exit code is the contract — `0` safe to sign, `2` substantive drift, `3` cosmetic-only, `4` clauses moved but content identical.

What changed on the site:

- **New tool page** at [`/tools/compare-cli/`](/tools/compare-cli/) — mirrors the sibling tool-page skeleton (TL;DR, what-it-does, quickstart, agent affordances, where-it-fits, repo link).
- **Registry entry** added in `src/data/registry.ts` — npm `compare-cli`, repo `DrBaher/compare-cli`. Version, GitHub stars, and weekly downloads now fetched at build time alongside the other four CLIs. Fallback version `0.2.1`.
- **Sidebar** Tools section adds compare-cli as the fifth entry under draft-cli / nda-review-cli / docx2pdf-cli / sign-cli.
- **Footer** Repos column adds the compare-cli GitHub link.
- **`package.json` description** updated to list five CLIs.

What's NOT in this PR (deliberate scope cut, follow-ups welcome):

- **Homepage hero rewrite** ("Four CLIs" → "Five CLIs"). The current copy still reads as four; would benefit from a paragraph re-balance.
- **ToolCard grid** layout reflow to fit a fifth card cleanly (probably a 1 / 2 / 5 or 1 / 2 / 3 wrap).
- **Workflow diagram** — currently doesn't have a pre-signature gate box; adding compare-cli there is a real design question (does it sit between docx2pdf and sign? After sign as a verify step? Both?).
- **Use-cases page** — compare-cli is a natural fit for the "vendor onboarding" and "negotiated contract" flows but the prose hasn't been updated.
- **Compare-vs-SaaS** page — no compare-cli row in the feature-comparison table yet.
- **`built-for-agents.astro`** — should call out `compare-cli-mcp` and the `compare_files` / `compare_with_negotiation` / `compare_demo` tools alongside the existing MCP discovery snippets.

The tool page works on its own. The narrative integration above is the next step.
