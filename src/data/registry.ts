/**
 * Build-time helpers that fetch live data about each CLI:
 *   - latest published version (npm + PyPI fallback to repo pyproject.toml)
 *   - GitHub stars
 *   - npm weekly download counts
 *   - README excerpt (the section under the first H2 heading)
 *
 * Network calls run once during `astro build`. Every fetch is wrapped in a
 * try/catch so a registry hiccup degrades gracefully to a static fallback
 * rather than failing the whole build.
 */

export interface CliMeta {
  name: string;
  version: string;     // e.g. "0.5.0"
  fetchedAt: string;   // ISO
  source: 'npm' | 'pypi' | 'repo' | 'fallback';
  excerpt?: string;    // first paragraph after the first H2 in README
  excerptHeading?: string;
  stars?: number;      // GitHub stargazer count
  weeklyDownloads?: number;            // last-week downloads (from npm or PyPI)
  weeklyDownloadsSource?: 'npm' | 'pypi';
}

const FALLBACKS: Record<string, string> = {
  'extract-cli': '0.1.8',
  'template-vault-cli': '0.4.8',
  'nda-review-cli': '0.5.1',
  'docx2pdf-cli': '0.2.2',
  'sign-cli': '0.6.4',
  'contract-vault-cli': '0.4.2',
  'contract-lint-cli': '0.1.0',
  'draft-cli': '0.9.0',
  'compare-cli': '0.3.0',
};

// Last-resort weekly-download counts for the PyPI packages only. npm's API is
// reliable; pypistats.org rate-limits build IPs (429), which would otherwise
// drop these badges intermittently. These are recent real figures — refresh
// occasionally — used only when the live pypistats fetch fails.
const PYPI_WEEKLY_FALLBACK: Record<string, number> = {
  'template-vault-cli': 470,
  'nda-review-cli': 164,
};

async function safeFetch(url: string, init: RequestInit = {}, timeoutMs = 8000): Promise<Response | null> {
  try {
    const r = await fetch(url, {
      ...init,
      signal: AbortSignal.timeout(timeoutMs),
      headers: { 'user-agent': 'drbaher-cli-site/0.4', ...(init.headers || {}) },
    });
    if (!r.ok) return null;
    return r;
  } catch {
    return null;
  }
}

async function npmVersion(name: string): Promise<{ version: string; source: CliMeta['source'] } | null> {
  const r = await safeFetch(`https://registry.npmjs.org/${name}`);
  if (!r) return null;
  const j = await r.json();
  const v = j?.['dist-tags']?.latest;
  return v ? { version: v, source: 'npm' } : null;
}

async function pypiVersion(name: string): Promise<{ version: string; source: CliMeta['source'] } | null> {
  const r = await safeFetch(`https://pypi.org/pypi/${name}/json`);
  if (!r) return null;
  const j = await r.json();
  const v = j?.info?.version;
  return v ? { version: v, source: 'pypi' } : null;
}

async function repoPyVersion(repo: string): Promise<{ version: string; source: CliMeta['source'] } | null> {
  const r = await safeFetch(`https://raw.githubusercontent.com/${repo}/main/pyproject.toml`);
  if (!r) return null;
  const text = await r.text();
  const m = text.match(/^version\s*=\s*"([^"]+)"/m);
  return m ? { version: m[1], source: 'repo' } : null;
}

async function githubStars(repo: string): Promise<number | undefined> {
  const r = await safeFetch(`https://api.github.com/repos/${repo}`, {
    headers: { 'accept': 'application/vnd.github+json' },
  });
  if (!r) return undefined;
  const j = await r.json();
  return typeof j?.stargazers_count === 'number' ? j.stargazers_count : undefined;
}

async function npmWeeklyDownloads(name: string): Promise<number | undefined> {
  const r = await safeFetch(`https://api.npmjs.org/downloads/point/last-week/${name}`);
  if (!r) return undefined;
  const j = await r.json();
  return typeof j?.downloads === 'number' ? j.downloads : undefined;
}

// PyPI weekly downloads via pypistats.org. Same shape as npm's: returns the
// 7-day total or undefined on any error (rate-limit, network, missing field).
// pypistats.org rate-limits (429) shared CI/build IPs, so retry once past a
// transient miss before giving up — otherwise the badge silently disappears.
async function pypiWeeklyDownloads(name: string): Promise<number | undefined> {
  for (let attempt = 0; attempt < 2; attempt++) {
    const r = await safeFetch(`https://pypistats.org/api/packages/${name}/recent`);
    if (r) {
      const j = await r.json();
      const w = j?.data?.last_week;
      if (typeof w === 'number') return w;
    }
    if (attempt === 0) await new Promise((res) => setTimeout(res, 600));
  }
  return undefined;
}

async function readmeExcerpt(repo: string): Promise<{ heading?: string; excerpt?: string }> {
  const r = await safeFetch(`https://raw.githubusercontent.com/${repo}/main/README.md`);
  if (!r) return {};
  const md = await r.text();
  const lines = md.split('\n');
  let i = 0;
  while (i < lines.length && !lines[i].match(/^##\s+/)) i++;
  if (i >= lines.length) return {};
  const heading = lines[i].replace(/^##\s+/, '').trim();
  i++;
  const body: string[] = [];
  while (i < lines.length && !lines[i].match(/^##\s+/)) {
    body.push(lines[i]);
    i++;
  }
  const para = body.join('\n').trim().split(/\n\s*\n/)[0]?.replace(/\n/g, ' ').trim();
  const cleaned = (para || '')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .trim();
  return { heading, excerpt: cleaned.slice(0, 320) };
}

export async function getCliMeta(): Promise<Record<string, CliMeta>> {
  const targets: Array<{ key: string; npm?: string; pypi?: string; repo?: string }> = [
    { key: 'extract-cli',    pypi: 'extract-cli',  repo: 'DrBaher/extract-cli' },
    { key: 'template-vault-cli', pypi: 'template-vault-cli', repo: 'DrBaher/template-vault-CLI' },
    { key: 'draft-cli',      npm: '@drbaher/draft-cli', repo: 'DrBaher/draft-cli' },
    { key: 'nda-review-cli', pypi: 'nda-review-cli', repo: 'DrBaher/nda-review-cli' },
    { key: 'docx2pdf-cli',   npm: 'docx2pdf-cli',   repo: 'DrBaher/docx2pdf-cli' },
    { key: 'sign-cli',       npm: '@drbaher/sign-cli', repo: 'DrBaher/sign-cli' },
    { key: 'contract-vault-cli', pypi: 'contract-vault', repo: 'DrBaher/contract-vault-cli' },
    { key: 'contract-lint-cli', pypi: 'contract-lint', repo: 'DrBaher/contract-lint-cli' },
    { key: 'compare-cli',    npm: 'compare-cli',    repo: 'DrBaher/compare-cli' },
  ];

  const out: Record<string, CliMeta> = {};
  await Promise.all(
    targets.map(async ({ key, npm, pypi, repo }) => {
      const [versionAttempt, stars, weeklyDownloadsResult, excerptObj] = await Promise.all([
        (async () => {
          let v: { version: string; source: CliMeta['source'] } | null = null;
          if (npm) v = await npmVersion(npm);
          if (!v && pypi) v = await pypiVersion(pypi);
          if (!v && repo) v = await repoPyVersion(repo);
          return v ?? { version: FALLBACKS[key] ?? '0.0.0', source: 'fallback' as const };
        })(),
        repo ? githubStars(repo) : Promise.resolve(undefined),
        // Prefer npm (most CLIs); fall back to PyPI for pure-Python packages.
        // Returns the count + which registry it came from so callers can
        // label the figure correctly.
        (async (): Promise<{ count?: number; source?: 'npm' | 'pypi' }> => {
          if (npm) {
            const c = await npmWeeklyDownloads(npm);
            return { count: c, source: 'npm' };
          }
          if (pypi) {
            const c = await pypiWeeklyDownloads(pypi);
            return { count: c ?? PYPI_WEEKLY_FALLBACK[key], source: 'pypi' };
          }
          return {};
        })(),
        repo ? readmeExcerpt(repo) : Promise.resolve<{ heading?: string; excerpt?: string }>({}),
      ]);

      out[key] = {
        name: key,
        version: versionAttempt.version,
        source: versionAttempt.source,
        fetchedAt: new Date().toISOString(),
        excerpt: excerptObj.excerpt,
        excerptHeading: excerptObj.heading,
        stars,
        weeklyDownloads: weeklyDownloadsResult.count,
        weeklyDownloadsSource: weeklyDownloadsResult.source,
      };
    }),
  );
  return out;
}

export function fmtCount(n?: number): string | undefined {
  if (typeof n !== 'number' || !Number.isFinite(n)) return undefined;
  if (n < 1000) return String(n);
  if (n < 10000) return (n / 1000).toFixed(1) + 'k';
  if (n < 1_000_000) return Math.round(n / 1000) + 'k';
  return (n / 1_000_000).toFixed(1) + 'M';
}
