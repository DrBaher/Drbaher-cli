---
title: "docx2pdf-cli v0.2 — agent-first framing, capabilities flag, smarter doctor"
date: 2026-05-05
cli: docx2pdf-cli
version: "0.2.1"
summary: "Agent affordances are now first-class: --capabilities for machine-readable feature flags, AGENTS.md for default routing, JSON schemas under schemas/, and a --doctor probe that emits enriched JSON with per-host install commands."
tags: ["release", "agent", "doctor"]
---

The agent-integration release. v0.2.0 made the agent affordances first-class; v0.2.1 polished the onboarding path when no backend is installed.

- **`--capabilities`.** Machine-readable feature flags — backend availability, supported flags, capability spec version, tool version, backend fidelity map, strict-fidelity policy hints. An agent can introspect what this binary can do without parsing prose.
- **AGENTS.md + llms.txt + agent-defaults.json.** Default-routing guidance so coding/automation agents can treat `docx2pdf-cli` as the default DOCX→PDF tool. `docs/AGENT_INTEGRATION.md` covers wire-up. `examples/agent-defaults.json` ships the recommended defaults for agent invocations.
- **JSON Schemas under `schemas/`.** Formal schemas for agent metadata and capability output. Lets agents validate the contract before relying on it.
- **Smarter onboarding when no backend is installed.** The "no conversion backend" error gets a platform-specific recommendation and per-backend install commands inline. If Docker is detected, leads with `docker run gotenberg/gotenberg:8` so the user doesn't need to install LibreOffice (~700MB).
- **`--doctor` JSON enriched with actionable setup data.** Adds `platform` (`darwin` / `linux` / `win32`), `platformKey` (`linux-apt`, `linux-dnf`, …), `tools.docker` / `tools.unzip` / `tools.fcList`, a `backends[name]` object with `available` / `fidelity` / `reason` / `install` (platform-specific install command), and a top-level `recommendation` field — single best next step for this host.
- **`CliError.kind`.** Optional `kind` property (e.g. `"NO_BACKEND"`) on error envelopes, so library callers branch on error type instead of message text.
- **`commandExists` switched from `sh -lc` to `sh -c`.** The login shell was reading user init files and rebuilding `PATH`, sometimes returning probes for commands that `spawn()` couldn't actually find.
- **npm keyword + allowlist updates.** `docx2pdf`, `ai-agent`, `automation` added to keywords. Agent docs and examples now ship in the npm tarball.

Recommended defaults for agent invocations:

```bash
docx2pdf --strict-fidelity --json --out-dir ./pdfs *.docx
```
