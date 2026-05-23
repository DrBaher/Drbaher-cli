---
title: "contract-ops-mcp — one MCP server for the whole suite"
date: 2026-05-23
cli: site
version: "0.1.0"
summary: "A single MCP (stdio) server that exposes all nine CLIs as agent tools — connect once and an agent can extract, draft, lint, compare, convert, review, and query the vaults. Curated typed tools plus catalog/run escape hatches, discovery-driven off each CLI's --catalog json. Signing stays human-gated."
tags: ["site"]
---

The suite already had two MCP servers (sign-cli's 19-tool signing server, compare-cli-mcp's drift gate). Now there's a **unifying** one: [**contract-ops-mcp**](https://github.com/DrBaher/contract-ops-mcp).

Wire it up once and an agent gets the **whole suite** as tools:

```jsonc
{ "mcpServers": { "contract-ops": { "command": "npx", "args": ["-y", "contract-ops-mcp"] } } }
```

- **Curated, typed tools** for the common operations — `extract_contract`, `lint_contract`, `compare_versions`, `fill_template`, `convert_to_pdf`, `review_nda`, `template_vault_*`, `contract_vault_*`, and read-only `verify_signature` / `verify_receipt` / `audit_show` — each returning structured JSON.
- **Escape hatches** for the long tail: `catalog(cli)` (any CLI's full `--catalog json`) and `run(cli, args)`, plus `suite_status` for what's installed.
- **Discovery-driven** — the tools ride the suite's uniform `--catalog json` contract (the same one the weekly drift-check guards), so they stay in sync as the CLIs evolve.
- **Signing stays human-gated.** Only sign-cli's read/verify ops are exposed; request/sign stay behind sign-cli's own MCP with its per-signer approval tokens, so this server can never become an unguarded signing path.
- **Filesystem lockdown** via `CONTRACT_OPS_MCP_BASE_DIR`; no-shell `execFile`.

It needs the CLIs installed — `curl -fsSL https://cli.drbaher.com/install.sh | sh`, or run everything in the `ghcr.io/drbaher/contract-ops` image. See the [MCP page](/mcp/). MIT, on [GitHub](https://github.com/DrBaher/contract-ops-mcp).
