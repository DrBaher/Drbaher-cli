# drbaher-cli-site

Showcase site for three composable, local-first CLIs:

- **nda-review-cli** — draft, review, negotiate NDAs (Python)
- **docx2pdf-cli** — DOCX → PDF with hybrid backends (Node.js)
- **sign-cli** — multi-provider e-signature with audit trails (TypeScript)

Built with [Astro](https://astro.build) + [Tailwind CSS](https://tailwindcss.com). Deployable to Vercel with one click.

## Local development

```bash
npm install
npm run dev
# http://localhost:4321
```

## Build

```bash
npm run build      # astro build + pagefind index → dist/
npm run preview    # serves the build at http://localhost:4321
```

The build step has two parts: Astro generates the HTML/CSS/PNG assets (including dynamic OG images via `satori`), then Pagefind indexes the rendered pages and writes the search index to `dist/pagefind/`.

## Deploying

The repo is pre-configured for **Vercel**:

```bash
# from the project root
vercel        # follow the prompts
# or just push to the linked GitHub repo and Vercel deploys automatically
```

`vercel.json` declares `framework: astro`, `outputDirectory: dist`, and a few security headers. No required environment variables.

### Optional: privacy-respecting analytics

To enable Plausible analytics, set the env var on Vercel (Settings → Environment Variables):

```
PUBLIC_PLAUSIBLE_DOMAIN=drbaher-cli.vercel.app
```

The script only loads when the variable is set; locally it's a no-op.

## Structure

```
src/
  layouts/BaseLayout.astro        page shell, head meta, hotkeys, theme toggle
  components/
    Sidebar.astro                 sticky nav with section headers + search trigger
    Footer.astro                  cross-link footer
    Callout.astro                 TL;DR / heads-up boxes
    CodeBlock.astro               <pre> with copy-to-clipboard button
    InstallTabs.astro             install-method tabs (pipx/pip/npm/etc.)
    ToolCard.astro                overview-page card per CLI (with live version badge)
    WorkflowDiagram.astro         SVG of the 5-step pipeline (animated)
    CastPlayer.astro              asciinema-player wrapper
    TryDemo.astro                 "live demo" CTA panel
    FreshHeader.astro             live-version badge for tool pages
    SearchPalette.astro           cmd+K command palette + Pagefind search
  data/
    registry.ts                   build-time fetcher for npm/PyPI versions + READMEs
  content/
    config.ts                     content collection schema (changelog)
    changelog/*.md                release-notes entries
  pages/
    index.astro                   /             — overview + 3 tool cards
    workflow.astro                /workflow/    — step-by-step with copy-paste
    install.astro                 /install/     — install paths + tabs
    principles.astro              /principles/
    compare.astro                 /compare/     — vs. SaaS suites
    mcp.astro                     /mcp/         — sign-cli MCP server guide
    changelog/index.astro         /changelog/
    tools/
      nda-review-cli.astro
      sign-cli.astro
      docx2pdf-cli.astro
    og/[...slug].png.ts           dynamic OG image generator (satori + resvg)
  fonts/                          bundled Liberation TTFs (used by satori)
  styles/global.css               Tailwind imports + base styles
public/
  favicon.svg
  og-default.svg                  static brand fallback
  robots.txt                      sitemap pointer
  casts/*.cast                    asciinema recordings
scripts/gen-casts.py              regenerates synthetic casts
astro.config.mjs                  Astro + tailwind + sitemap
tailwind.config.mjs               custom palette + dark mode
vercel.json
```

## Features

- **Dark mode** — system-preference detection + manual moon/sun toggle (persisted to localStorage)
- **Cmd+K search** — Pagefind-backed palette indexes every page at build time
- **Animated workflow diagram** — SVG with traveling dots between steps
- **Asciinema casts** — pre-rendered terminal recordings on each tool page
- **Live version badges** — fetched from npm/PyPI at build time, with `pyproject.toml` fallback
- **Auto-generated OG images** — per-page PNGs via `satori` + `@resvg/resvg-js`
- **Sitemap + robots** — standard SEO basics
- **Embedded sandbox** — the live nda-review-cli web demo runs inline on its tool page
- **Copy-to-clipboard** on every code block, **install-method tabs** for each CLI
- **Reveal-on-scroll** with `prefers-reduced-motion` support
- **Optional Plausible analytics** behind the `PUBLIC_PLAUSIBLE_DOMAIN` env var

## Regenerating asciinema casts

The `public/casts/*.cast` files are synthetic but reflect real CLI output. To regenerate them:

```bash
npm run casts          # python3 scripts/gen-casts.py
```

To replace with real recordings, capture the live CLI session and save with the same filename:

```bash
asciinema rec public/casts/nda-review-quickstart.cast -c "nda-review-cli quickstart"
```

## License

MIT. See each linked CLI repository for its own license. Bundled Liberation fonts are licensed under the SIL Open Font License with a GPL exception (see Liberation Fonts project).
