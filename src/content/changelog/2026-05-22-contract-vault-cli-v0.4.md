---
title: "contract-vault-cli v0.2 → v0.4 — obligation lifecycle, recurring obligations, reminders"
date: 2026-05-22
cli: contract-vault-cli
version: "0.4.2"
summary: "contract-vault grew from a register into a full obligation tracker: an obligation lifecycle (done/waived/owner), recurring obligations, per-obligation and corpus-wide reminders with a cron/agent-friendly `remind` digest, status-aware due/obligations, and adoption hardening (validated against the real extract-cli, Windows-safe .ics)."
tags: ["contract-vault-cli"]
---

[contract-vault-cli](/tools/contract-vault-cli/) moved fast from its 0.1 register into a full **post-signature obligation tracker** (0.2 → 0.4.2). Highlights:

- **Obligation lifecycle (0.2.0).** Every obligation now carries a stable `id`, a `status` (`open` / `done` / `waived`), and an optional `owner`. `obligation <deal> <id> --status … --owner …` tracks it; `due` / `obligations` are now **status-aware** — only *open* obligations by default, so completing one drops it off the calendar. Lifecycle survives a re-ingest/recompute (carried forward by id).
- **Recurring obligations + per-obligation reminders (0.3.0).** Obligations can recur (`weekly` / `monthly` / `quarterly` / `semiannual`), and each can set its own reminder lead-times (`--reminders 30,7`).
- **The `remind` digest (0.3.1).** `contract-vault remind` lists the obligations whose reminder window is open right now — a digest built for cron jobs and agents (pair with `--json`).
- **Corpus-wide reminder policy (0.4.0).** `config reminders` sets default reminder lead-times once for the whole vault, instead of per obligation.
- **Scheduling guide (0.4.1).** A bundled `docs/SCHEDULING.md` + example `contract-vault-remind.sh` show how to run the reminder digest from cron.
- **Adoption hardening (0.4.2).** Validated end-to-end against the **real** extract-cli for the first time (tolerates its evolving output shape), and `due --format ics` is now Windows-safe (no `\r\r\n`).

On the site, the [tool page](/tools/contract-vault-cli/) and `llms.txt` now cover the obligation lifecycle, recurrence, and the `remind` / `config reminders` surface, and the registry tracks **v0.4.2**. The page also leads with contract-vault's **standalone** value — a git-backed register that never lets a renewal or obligation slip — with its place in the contract-ops suite as a secondary note.
