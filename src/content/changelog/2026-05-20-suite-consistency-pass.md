---
title: "Suite — uniform demos, stdin piping, and one shared LLM config"
date: 2026-05-20
cli: site
summary: "A consistency pass across the six CLIs: a zero-config `demo` on every tool (added to docx2pdf + nda-review), stdin (`-`) piping so the full pipeline composes end to end, draft-cli reading the suite-shared ~/.config/contract-ops/llm.json, and an honest per-CLI exit-code matrix on the site. Changes are on each repo's main, landing in their next releases."
tags: ["suite"]
---

A consistency pass across the six CLIs so the suite behaves like one thing instead of six tools that happened to ship together. These changes are on each repo's `main` and land in their next published releases.

- **A zero-config `demo` on every CLI.** Added `docx2pdf demo` (converts a bundled sample with whatever backend is installed) and a non-interactive `nda-review-cli demo` (reviews the bundled sample NDA against the bundled default policy). [template-vault-cli](/tools/template-vault-cli/), [draft-cli](/tools/draft-cli/), [compare-cli](/tools/compare-cli/), and [sign-cli](/tools/sign-cli/) already had one — now all six do.
- **The pipeline actually pipes.** [docx2pdf-cli](/tools/docx2pdf-cli/) and [nda-review-cli](/tools/nda-review-cli/) now read from stdin (`-`), joining draft-cli and compare-cli. The full chain composes end to end: `template-vault get … | draft - | nda-review-cli review --file - | compare … | docx2pdf - - | sign …`.
- **Configure your LLM once for the whole suite.** [draft-cli](/tools/draft-cli/) now reads the suite-shared `~/.config/contract-ops/llm.json` (the environment still wins), matching template-vault-cli and nda-review-cli. template-vault-cli's setup docs and error messages now point at that shared path too.
- **Honest agent contract on the site.** [Built for agents](/built-for-agents/) gained a per-CLI exit-code matrix, and `llms.txt` was corrected — the exit codes are **not** uniform across the suite (compare-cli reuses `0`–`4` as drift severities; template-vault-cli uses `0/1/2`), so agents should branch per CLI.
