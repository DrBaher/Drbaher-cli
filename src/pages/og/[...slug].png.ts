import type { APIRoute, GetStaticPaths } from 'astro';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const fontPath = (name: string) => path.join(ROOT, 'src/fonts', name);

const serifRegular = fs.readFileSync(fontPath('LiberationSerif-Regular.ttf'));
const serifBold    = fs.readFileSync(fontPath('LiberationSerif-Bold.ttf'));
const sansRegular  = fs.readFileSync(fontPath('LiberationSans-Regular.ttf'));
const sansBold     = fs.readFileSync(fontPath('LiberationSans-Bold.ttf'));
const monoRegular  = fs.readFileSync(fontPath('LiberationMono-Regular.ttf'));

interface Page { title: string; eyebrow: string; description: string; }

const pages: Record<string, Page> = {
  default: {
    eyebrow: 'contract.cli',
    title: 'Four CLIs for the contract workflow',
    description: 'Fill templates · review against your policy · convert to PDF · sign with audit trails. Local-first, MIT.',
  },
  overview: {
    eyebrow: 'contract.cli',
    title: 'Four CLIs for the contract workflow',
    description: 'draft-cli · nda-review-cli · docx2pdf-cli · sign-cli. Local-first, deterministic, no SaaS.',
  },
  workflow: {
    eyebrow: 'The workflow',
    title: 'From blank page to signed agreement',
    description: 'Draft → review → negotiate → convert → sign. Five commands across four CLIs, all on your machine.',
  },
  install: {
    eyebrow: 'Install',
    title: 'Four installs, one workflow',
    description: 'npm i -g @drbaher/draft-cli · pipx install nda-review-cli · npm i -g docx2pdf-cli @drbaher/sign-cli',
  },
  principles: {
    eyebrow: 'Principles',
    title: 'What these tools have in common',
    description: 'Local-first by default. Deterministic where possible. Audit-grade evidence baked in.',
  },
  compare: {
    eyebrow: 'Compare',
    title: 'CLIs vs. SaaS contract suites',
    description: 'An honest table — what you trade and what you get when you go local-first.',
  },
  'use-cases': {
    eyebrow: 'Use cases',
    title: 'Three concrete jobs the CLIs do well',
    description: 'Vendor onboarding, M&A diligence, employment paperwork. Real workflows, copy-paste commands.',
  },
  changelog: {
    eyebrow: 'Changelog',
    title: 'What’s new across the suite',
    description: 'Releases, fixes, and roadmap notes for draft-cli, nda-review-cli, docx2pdf-cli, and sign-cli.',
  },
  mcp: {
    eyebrow: 'MCP server',
    title: 'sign-cli speaks MCP',
    description: 'Drive signing from Claude, Cursor, or any MCP-aware client — same per-signer guardrails.',
  },
  'tools/draft-cli': {
    eyebrow: 'Tool · Node.js',
    title: 'draft-cli',
    description: 'Fill placeholders in markdown or .docx templates. Typed/computed/positional params, multi-doc bundles.',
  },
  'tools/nda-review-cli': {
    eyebrow: 'Tool · Python',
    title: 'nda-review-cli',
    description: 'Draft, review, and negotiate NDAs against your house playbook. Stdlib-only Python.',
  },
  'tools/docx2pdf-cli': {
    eyebrow: 'Tool · Node.js',
    title: 'docx2pdf-cli',
    description: 'Honest DOCX → PDF with hybrid backends, parallel batches, and font validation.',
  },
  'tools/sign-cli': {
    eyebrow: 'Tool · TypeScript',
    title: 'sign-cli',
    description: 'Multi-provider e-signature with hash-chained audit events and RFC 3161 timestamps.',
  },
};

export const getStaticPaths: GetStaticPaths = () =>
  Object.keys(pages).map((slug) => ({ params: { slug } }));

export const GET: APIRoute = async ({ params }) => {
  const slug = (params.slug as string) || 'default';
  const page = pages[slug] ?? pages.default;

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '1200px',
          height: '630px',
          display: 'flex',
          background: 'linear-gradient(135deg, #fdfcf9 0%, #f0f9f5 60%, #dff2e8 100%)',
          fontFamily: 'Sans',
          color: '#1a1612',
          position: 'relative',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                left: 0, top: 0, bottom: 0,
                width: '14px',
                background: 'linear-gradient(180deg, #1f7d5d 0%, #0c5642 100%)',
              },
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                padding: '80px',
                paddingLeft: '94px',
                width: '100%',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      fontFamily: 'Mono',
                      fontSize: '24px',
                      color: '#0c5642',
                      letterSpacing: '0.04em',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            width: '12px',
                            height: '12px',
                            borderRadius: '999px',
                            background: '#1f7d5d',
                            display: 'flex',
                          },
                        },
                      },
                      page.eyebrow,
                    ],
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      marginTop: '46px',
                      fontFamily: 'Serif',
                      fontWeight: 700,
                      fontSize: '78px',
                      lineHeight: '1.08',
                      letterSpacing: '-0.02em',
                      color: '#1a1612',
                      maxWidth: '1000px',
                    },
                    children: page.title,
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      marginTop: '40px',
                      fontFamily: 'Sans',
                      fontSize: '30px',
                      lineHeight: '1.45',
                      color: '#3d362f',
                      maxWidth: '1000px',
                    },
                    children: page.description,
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      marginTop: 'auto',
                      display: 'flex',
                      gap: '20px',
                      fontFamily: 'Mono',
                      fontSize: '20px',
                      color: '#1f7d5d',
                    },
                    children: [
                      'draft-cli',
                      '·',
                      'nda-review-cli',
                      '·',
                      'docx2pdf-cli',
                      '·',
                      'sign-cli',
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Serif', data: serifRegular, weight: 400, style: 'normal' },
        { name: 'Serif', data: serifBold,    weight: 700, style: 'normal' },
        { name: 'Sans',  data: sansRegular,  weight: 400, style: 'normal' },
        { name: 'Sans',  data: sansBold,     weight: 700, style: 'normal' },
        { name: 'Mono',  data: monoRegular,  weight: 400, style: 'normal' },
      ],
    },
  );

  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
