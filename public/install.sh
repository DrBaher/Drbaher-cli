#!/bin/sh
# contract-ops suite installer — installs all nine CLIs from their native registries.
#
#   curl -fsSL https://cli.drbaher.com/install.sh | sh
#
# Prefer to read before running (recommended):
#   curl -fsSL https://cli.drbaher.com/install.sh -o install.sh && less install.sh && sh install.sh
#
# Re-runnable: upgrades anything already installed. Local-first — no account,
# no telemetry, MIT. Python CLIs go through pipx; Node CLIs through npm.
# Source: https://github.com/DrBaher/Drbaher-cli/blob/main/public/install.sh
set -eu

PY_CLIS="extract-cli template-vault-cli nda-review-cli contract-vault contract-lint"
NPM_CLIS="@drbaher/draft-cli compare-cli docx2pdf-cli @drbaher/sign-cli"
BINS="extract template-vault draft nda-review-cli contract-lint compare docx2pdf sign contract-vault"

say()  { printf '\033[36m▸ %s\033[0m\n' "$1"; }
warn() { printf '\033[33m! %s\033[0m\n' "$1" >&2; }
die()  { printf '\033[31m✗ %s\033[0m\n' "$1" >&2; exit 1; }
have() { command -v "$1" >/dev/null 2>&1; }

say "contract-ops suite — installing nine CLIs (five via pipx, four via npm)"

# --- prerequisites ---
have python3 || die "python3 not found (need 3.9+). Install Python, then re-run."
have pipx    || die "pipx not found. Install it (e.g. 'brew install pipx' or 'python3 -m pip install --user pipx'), run 'pipx ensurepath', then re-run."
have npm     || die "npm not found. Install Node.js 22+ (sign-cli uses node:sqlite), then re-run."

node_major=$(node -p 'process.versions.node.split(".")[0]' 2>/dev/null || echo 0)
if [ "$node_major" -lt 22 ] 2>/dev/null; then
  warn "Node $node_major detected — sign-cli needs Node 22+ at runtime (compare-cli needs 20+). Install will proceed; upgrade Node if those fail to run."
fi

# --- Python CLIs (pipx installs one package per command) ---
for p in $PY_CLIS; do
  say "pipx install $p"
  pipx install "$p" >/dev/null 2>&1 || pipx upgrade "$p" >/dev/null 2>&1 || warn "could not install/upgrade $p — try 'pipx install $p' manually"
done

# --- Node CLIs (one npm command) ---
say "npm i -g $NPM_CLIS"
# shellcheck disable=SC2086  # intentional word-splitting: install all four at once
npm i -g $NPM_CLIS >/dev/null 2>&1 || warn "npm reported a problem — try 'npm i -g $NPM_CLIS' manually"

# --- report ---
say "installed:"
missing=0
for b in $BINS; do
  if have "$b"; then
    printf '   \033[32m✓\033[0m %-16s %s\n' "$b" "$($b --version 2>/dev/null | head -1 || echo ok)"
  else
    printf '   \033[33m?\033[0m %-16s not on PATH yet\n' "$b"; missing=1
  fi
done
[ "$missing" -eq 0 ] || warn "some commands aren't on PATH — restart your shell, or run 'pipx ensurepath' and reopen the terminal."

say "next: try a zero-config demo —  extract demo  ·  contract-lint demo  ·  sign demo"
say "docs & recipes: https://cli.drbaher.com/"
