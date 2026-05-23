---
title: "template-vault-cli v0.5 — agent discovery + a local-first hardening pass"
date: 2026-05-23
cli: template-vault-cli
version: "0.5.1"
summary: "0.5.0 published the suite-wide `--catalog json` discovery contract; 0.5.1 is a security pass that hardens the vault for living on your machine — path containment (no `../` escape), http/https-only URLs (no file:// reads, no cleartext keys), owner-only 0700/0600 permissions, plus pinned actions, PEP 740 build attestations, and CodeQL/Bandit in CI."
tags: ["template-vault-cli"]
---

[template-vault-cli](/tools/template-vault-cli/) shipped two releases:

- **0.5.0 — agent discovery.** `template-vault --catalog json` now answers the suite-wide discovery contract (`{name, bin, version, description, commands, exitCodes}`, walking the live argparse tree including nested subcommands), so an agent learns every command and flag at startup. This had been on `main` since 0.4.8 but was never published — 0.5.0 releases it to PyPI.
- **0.5.1 — a local-first hardening pass.** Because the vault is plain files on *your* machine, 0.5.1 tightens the boundaries:
  - **Path containment** — `category`/`name`, `compose --as`, `upload --category`, and a custom sources registry are validated as single path segments, so a crafted reference can't escape the vault with a `../../etc/passwd`-style value.
  - **URL-scheme validation** — `import` and the LLM `base_url` accept only `http`/`https` (no `file://` local reads), and the `base_url` refuses plain `http` to a non-loopback host, so an API key is never sent in cleartext (`http://localhost` stays allowed for local models like Ollama).
  - **Owner-only permissions** — new vault directories are created `0700` and `.vault.json` / `meta.json` / template files `0600` (best-effort POSIX; ACLs apply on Windows).
  - **Supply-chain hardening** — every GitHub Action pinned to a full commit SHA, least-privilege `publish.yml` with PEP 740 build attestations, plus CodeQL (security-extended), a Bandit gate, `CODEOWNERS`, and weekly Dependabot.

On the site, the [tool page](/tools/template-vault-cli/) gains a "hardened for a local-first vault" note, `llms.txt` records the safety properties, and the registry tracks **0.5.1**. The 25-command surface is unchanged.
