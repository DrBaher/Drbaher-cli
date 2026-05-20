---
title: "compare-cli v0.3.0 — surface .docx track-changes metadata"
date: 2026-05-18
cli: compare-cli
version: "0.3.0"
summary: "Parses WordprocessingML track-changes (<w:ins> / <w:del>) from .docx inputs and surfaces them in --json output as base.track_changes / candidate.track_changes. Informational only — track-changes presence does NOT change the exit-code classification; the text diff remains the source of truth."
tags: ["release", "docx"]
---

A minor release that makes `.docx` track-changes visible without changing what the gate decides.

- **New `extractDocxTrackChanges(buf)`** — parses `<w:ins>` and `<w:del>` elements from `word/document.xml` and returns a flat, document-ordered list of `{ op: "ins" | "del", text, author, date }`. Robust to malformed input (non-zip or missing `document.xml` returns an empty array rather than throwing).
- **`readInput` on a `.docx` populates `track_changes`** on the returned side object. Non-`.docx` inputs don't have the field; consumers should treat missing as `[]`.
- **`--json` output now includes `base.track_changes` and `candidate.track_changes`** as stable arrays.

**Informational only.** Track-changes presence does **not** change the exit-code classification — the text diff remains the source of truth in v0.3.x (still `0` match · `2` substantive · `3` cosmetic · `4` moved). A future version may use track-changes as ground truth where both sides carry it. Install: `npm i -g compare-cli`.
