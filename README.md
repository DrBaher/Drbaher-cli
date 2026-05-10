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
npm run build      # outputs static site to dist/
npm run preview    # serves the build at http://localhost:4321
```

## Deploying

The repo is pre-configured for **Vercel**:

```bash
# from the project root
vercel        # follow the prompts
# or just push to the linked GitHub repo and Vercel deploys automatically
```

`vercel.json` declares `framework: astro`, `outputDirectory: dist`, and a few security headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy). No environment variables required.

GitHub Pages also works — point Pages at the built `dist/` directory and use the included `astro build` output.

## Structure

```
src/
  layouts/BaseLayout.astro        page shell with sidebar + footer
  components/
    Sidebar.astro                 sticky nav with section headers
    Footer.astro                  cross-link footer
    Callout.astro                 TL;DR / heads-up boxes
    ToolCard.astro                overview-page card per CLI
    WorkflowDiagram.astro         SVG of the 5-step pipeline
  pages/
    index.astro                   /             — overview + 3 tool cards
    workflow.astro                /workflow/    — step-by-step with copy-paste
    install.astro                 /install/     — install paths for all three
    principles.astro              /principles/  — shared design ethos
    tools/
      nda-review-cli.astro        /tools/nda-review-cli/
      sign-cli.astro              /tools/sign-cli/
      docx2pdf-cli.astro          /tools/docx2pdf-cli/
  styles/global.css               Tailwind imports + base styles
public/favicon.svg
astro.config.mjs                  Astro config
tailwind.config.mjs               custom palette (cream/ink/accent/mint) + serif/sans pairing
vercel.json                       deployment config
```

## Design

- **Typography**: Source Serif 4 for headings, Inter for body, JetBrains Mono for code (Google Fonts via `<link>` in BaseLayout)
- **Palette**: warm cream background (`#fdfcf9`), near-black text (`#1a1612`), forest/teal accent (`#1f7d5d`), mint-tinted callouts
- **Layout**: documentation-style — sticky sidebar nav, max-width content column, generous whitespace
- **No JS framework**: vanilla JS in BaseLayout for the mobile sidebar toggle; everything else is server-rendered HTML

## Adding content

- New CLI tool → add a page under `src/pages/tools/`, then add an entry to `Sidebar.astro` and a `<ToolCard>` on the index page.
- New top-level page → add to `src/pages/` and the Sidebar's "Start" section.
- Per-page metadata (title, description, active sidebar key) is set via `<BaseLayout>` props.

## License

MIT — see each linked CLI repository for its own license.
