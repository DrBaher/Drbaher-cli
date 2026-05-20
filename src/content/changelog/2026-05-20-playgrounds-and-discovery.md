---
title: "Suite — interactive playgrounds, uniform discovery, and a polish pass"
date: 2026-05-20
cli: site
summary: "Run all six CLIs in the browser on the new /play page (four in a shared sandbox plus the nda-review and sign hosted demos); every CLI now answers `--catalog json` with one uniform shape; a friendly first run on every tool; the suite name standardized to contract-ops everywhere; plus a 5-minute tour and a recipes page."
tags: ["suite"]
---

A communication, onboarding, and discoverability pass so the suite is easy to try, easy to drive, and consistent end to end.

- **Run any of the six in your browser.** The new [playground](/play/) executes the real CLIs on your own input in a sandbox — draft, compare, docx2pdf and a template-vault explorer share one runner, alongside the existing [nda-review](/tools/nda-review-cli/) and [sign](/tools/sign-cli/) hosted demos. Each tool page also has a "Try it live" embed.
- **Uniform agent discovery.** All six CLIs now answer `<cli> --catalog json` with one shape — `{ name, bin, version, description, commands|flags, exitCodes }` — so an agent discovers the surface the same way everywhere instead of special-casing each tool. Added it to template-vault, draft, and compare; aligned nda-review and sign to match.
- **A friendly first run.** Running `draft` or `compare` with no arguments now prints a short "here's what I do, try the demo, here's where I fit" hint instead of a terse error — matching template-vault and nda-review.
- **One name.** Standardized the prose name to **contract-ops** across every repo's docs, and gave each repo a consistent "part of the suite" cross-link.
- **More ways in.** A [5-minute tour](/tour/) of the whole suite and a [recipes](/recipes/) page for real situations (an incoming third-party NDA, a CI drift gate, an agent loop, batch convert + sign).
- **Accuracy fixes.** Corrected the per-CLI exit-code matrix (draft-cli is `0`–`4`, not `0`–`5`) and refreshed `llms.txt` to reflect the uniform discovery contract.
