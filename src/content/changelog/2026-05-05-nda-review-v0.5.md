---
title: "nda-review-cli v0.5 — fatigue concession, web demo, profile learning"
date: 2026-05-05
cli: nda-review-cli
version: "0.5.0"
summary: "Two-party negotiation now breaks deadlocks deterministically with fatigue concession. Counterparty profiles can be learned from past reviews. Sandboxed web demo bundled in /web."
tags: ["release", "negotiation"]
---

Headline release for the negotiation engine.

- **Fatigue concession.** When a clause bounces past `max_clause_bounces` (default 4), the next proposer is force-conceded deterministically. Solves the conservative-vs-conservative stalemate without resorting to randomness.
- **Counterparty profile learning.** Pass `--learn-profile` on a review and the CLI builds a per-counterparty stance profile from the patterns it sees. Next round, that profile is applied automatically.
- **Web demo in `web/`.** A sandboxed Flask-style server that exposes the three headline flows (draft, review, negotiate-simulator) for trying without installing.
- **Stalemate detection** still trips on hard non-negotiable conflicts and surfaces them for human escalation rather than auto-resolving.
