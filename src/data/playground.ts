// Live, sandboxed playground service (contract-ops-playground on Railway).
// Defaults to the deployed URL; override with PUBLIC_PLAYGROUND_URL if it moves.
export const PLAYGROUND_URL =
  import.meta.env.PUBLIC_PLAYGROUND_URL || 'https://contract-ops-playground-production.up.railway.app';

// Tool slugs that have an interactive playground tab (?cli=<id>).
export const PLAYGROUND_CLIS = ['draft', 'compare', 'docx2pdf', 'template-vault'] as const;
