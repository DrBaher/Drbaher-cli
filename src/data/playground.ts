// Live, sandboxed playground service (contract-ops-playground on Railway).
// Defaults to the deployed URL; override with PUBLIC_PLAYGROUND_URL if it moves.
export const PLAYGROUND_URL =
  import.meta.env.PUBLIC_PLAYGROUND_URL || 'https://contract-ops-playground-production.up.railway.app';

// Tool slugs that have a tab in the unified playground (?cli=<id>).
// nda-review and sign aren't here — they have their own dedicated live demos.
export const PLAYGROUND_CLIS = ['extract', 'draft', 'compare', 'docx2pdf', 'template-vault', 'contract-vault'] as const;
