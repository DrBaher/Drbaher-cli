---
title: "contract-ops-agent — a ready-made, enclosed agent for the whole suite"
date: 2026-07-15
cli: site
version: "0.10.0"
summary: "New: contract-ops-agent, a terminal agent whose only tools are the contract-ops suite — no shell, no filesystem, no signing, by construction. Bring your own model (Claude, OpenAI, or any OpenAI-compatible endpoint). Beyond wiring the MCP server into your own agent, you can now run the ready-made enclosed one."
tags: ["site", "agents", "contract-ops-agent"]
---

Until now, using the suite from an agent meant wiring [contract-ops-mcp](/mcp/) into your own client. Now there's a ready-made option: [**contract-ops-agent**](https://github.com/DrBaher/contract-ops-agent) — a terminal agent that already wraps the whole pipeline, in an **enclosure**.

The idea is the enclosure. The model's *only* tools are the contract-ops tools — extract, lint, compare, draft, review, convert, negotiate, the vaults, verify. No shell, no filesystem access, no web, no signing. Not by policy, by construction: if a request can't be served by one of those tools, the agent has no way to do it, and the session refuses to start if any tool outside the suite is ever mounted.

- **Bring your own model.** Claude (an API key or your existing Claude Code login), OpenAI, or any OpenAI-compatible endpoint — Gemini, Grok, DeepSeek, OpenRouter, a local Ollama — behind one interface, with the same enclosure on every backend.
- **Human gates where they matter.** It reads files in your workspace freely but asks before it writes a file or runs anything beyond a read. Signing stays impossible unless you deliberately opt in (a config flag *and* a launch flag), and even then every signing action stops at a typed-consent gate you approve.
- **NDA review & negotiation.** Score an NDA against your house playbook, generate clause-ready redlines, draft from a template, and run a round-based negotiation — with every binding commitment gated.
- **Zero-setup option.** A Docker image bundles the agent, all the CLIs, and a PDF backend: `docker run -it --rm -v "$PWD:/workspace" -e OPENAI_API_KEY ghcr.io/drbaher/contract-ops-agent`.

Install and run: `npm install -g contract-ops-agent`, then `contract-ops-agent` for a short setup wizard and a REPL. See [the agent page](/agent/) for the full walkthrough, or the [repo](https://github.com/DrBaher/contract-ops-agent) for source and docs. MIT.
