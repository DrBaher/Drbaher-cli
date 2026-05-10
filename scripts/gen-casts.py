#!/usr/bin/env python3
"""Generate asciinema v2 cast files for the showcase site.

These are synthetic but reflect real CLI output. Re-record live captures
later and replace the .cast files in public/casts/ — same paths, same names.
"""
import json
import os
import sys

OUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'casts')

# ANSI helpers
RST = "\x1b[0m"
DIM = "\x1b[2m"
BOLD = "\x1b[1m"
GREEN = "\x1b[32m"
RED = "\x1b[31m"
YELLOW = "\x1b[33m"
CYAN = "\x1b[36m"
BLUE = "\x1b[34m"
MAGENTA = "\x1b[35m"
GRAY = "\x1b[90m"

PROMPT = f"{GREEN}$ {RST}"


def cast(filename, *, cols=88, rows=20, title="", events):
    """Write an asciicast v2 file."""
    path = os.path.join(OUT_DIR, filename)
    header = {
        "version": 2,
        "width": cols,
        "height": rows,
        "timestamp": 1714928400,
        "title": title,
        "env": {"SHELL": "/bin/zsh", "TERM": "xterm-256color"},
    }
    with open(path, "w") as f:
        f.write(json.dumps(header) + "\n")
        for ev in events:
            f.write(json.dumps(ev, ensure_ascii=False) + "\n")
    print(f"wrote {path}", file=sys.stderr)


def keystroke(text, t, per_char=0.04, then_pause=0.1):
    """Yield one event per character to simulate typing, then a pause."""
    out = []
    for i, ch in enumerate(text):
        t += per_char
        out.append([t, "o", ch])
    t += then_pause
    return out, t


def line(text, t, pause=0.0):
    """Print a whole line instantly (e.g. CLI output), then optional pause."""
    return [[t, "o", text + "\r\n"]], t + pause


def show(t, text, pause=0.0):
    """Emit literal output (no newline) at time t."""
    return [[t, "o", text]], t + pause


def build(events_list):
    """Flatten a list of event-list/time tuples into a single event list."""
    flat = []
    for evs in events_list:
        flat.extend(evs)
    return flat


# -------------------------- nda-review quickstart --------------------------

def gen_nda_quickstart():
    t = 0.0
    parts = []

    e, t = show(t, PROMPT)
    parts.append(e)
    e, t = keystroke("nda-review-cli quickstart", t)
    parts.append(e)
    e, t = line("", t, pause=0.4)
    parts.append(e)

    e, t = line(f"{BOLD}nda-review-cli quickstart — 16 questions, ~3 minutes{RST}", t, 0.3)
    parts.append(e)
    e, t = line(f"{DIM}Writes config/org-policy.json. Skip any answer with Enter.{RST}", t, 0.5)
    parts.append(e)

    e, t = line(f"{CYAN}[1/16]{RST} Your organization name?", t, 0.3)
    parts.append(e)
    e, t = show(t, "      → ")
    parts.append(e)
    e, t = keystroke("Acme Inc.", t)
    parts.append(e)
    e, t = line("", t, 0.5)
    parts.append(e)

    e, t = line(f"{CYAN}[2/16]{RST} Your default negotiation stance?", t, 0.2)
    parts.append(e)
    e, t = line(f"      {DIM}1) conservative   2) middleground   3) compromising{RST}", t, 0.3)
    parts.append(e)
    e, t = show(t, "      → ")
    parts.append(e)
    e, t = keystroke("2", t)
    parts.append(e)
    e, t = line("", t, 0.5)
    parts.append(e)

    e, t = line(f"{CYAN}[3/16]{RST} Default term cap (months)?  {DIM}[24]{RST}", t, 0.4)
    parts.append(e)
    e, t = show(t, "      → ")
    parts.append(e)
    e, t = keystroke("36", t)
    parts.append(e)
    e, t = line("", t, 0.5)
    parts.append(e)

    e, t = line(f"{CYAN}[4/16]{RST} Survival period after termination (months)?  {DIM}[36]{RST}", t, 0.3)
    parts.append(e)
    e, t = show(t, "      → ")
    parts.append(e)
    e, t = keystroke("", t, then_pause=0.3)
    parts.append(e)
    e, t = line("", t, 0.4)
    parts.append(e)

    e, t = line(f"{DIM}…questions 5–14 omitted in this clip…{RST}", t, 0.6)
    parts.append(e)

    e, t = line(f"{CYAN}[15/16]{RST} Forbidden phrases? (comma-separated)", t, 0.3)
    parts.append(e)
    e, t = show(t, "      → ")
    parts.append(e)
    e, t = keystroke("residual rights, perpetual license", t, per_char=0.025)
    parts.append(e)
    e, t = line("", t, 0.5)
    parts.append(e)

    e, t = line(f"{CYAN}[16/16]{RST} Path to your house template (optional)?", t, 0.3)
    parts.append(e)
    e, t = show(t, "      → ")
    parts.append(e)
    e, t = keystroke("", t, then_pause=0.2)
    parts.append(e)
    e, t = line("", t, 0.4)
    parts.append(e)

    e, t = line(f"{GREEN}✓{RST} House policy written to {BOLD}config/org-policy.json{RST}", t, 0.3)
    parts.append(e)
    e, t = line(f"{GREEN}✓{RST} 12 clause rules · 4 redlines · stance=middleground", t, 0.3)
    parts.append(e)
    e, t = line(f"  Try it now: {BOLD}nda-review-cli review --file samples/sample.docx --why{RST}", t, 1.0)
    parts.append(e)

    e, t = show(t, PROMPT)
    parts.append(e)
    e, t = keystroke("nda-review-cli review --file samples/sample.docx --why", t, per_char=0.02)
    parts.append(e)
    e, t = line("", t, 0.5)
    parts.append(e)

    e, t = line(f"{BOLD}Review · samples/sample.docx{RST}  {DIM}policy: org-policy.json{RST}", t, 0.3)
    parts.append(e)
    e, t = line(f"  Risk score: {YELLOW}54/100{RST}   Decision: {YELLOW}ESCALATE{RST}", t, 0.4)
    parts.append(e)
    e, t = line("", t, 0.2)
    parts.append(e)
    e, t = line(f"{RED}HIGH{RST}  Term            48 months exceeds policy cap of 36", t, 0.25)
    parts.append(e)
    e, t = line(f"        {DIM}why: matched 'shall continue for' + numeric > cap{RST}", t, 0.25)
    parts.append(e)
    e, t = line(f"{YELLOW}MED {RST}  Survival        Perpetual survival on trade secrets", t, 0.25)
    parts.append(e)
    e, t = line(f"        {DIM}why: matched 'in perpetuity' near 'trade secret'{RST}", t, 0.25)
    parts.append(e)
    e, t = line(f"{YELLOW}MED {RST}  Governing law   Delaware (counterparty preference)", t, 0.25)
    parts.append(e)
    e, t = line(f"{GREEN}LOW {RST}  Definition      Includes orally disclosed info — OK", t, 0.25)
    parts.append(e)
    e, t = line(f"{GREEN}LOW {RST}  Return/destroy  Both options offered — OK", t, 0.4)
    parts.append(e)
    e, t = line("", t, 0.2)
    parts.append(e)
    e, t = line(f"  {DIM}Wrote review/sample.review.md (5 findings, 3 evidence snippets){RST}", t, 1.5)
    parts.append(e)

    e, t = show(t, PROMPT)
    parts.append(e)
    e, t = show(t, " ", pause=2.0)  # final hold
    parts.append(e)

    return build(parts)


# -------------------------- nda-review negotiate --------------------------

def gen_nda_negotiate():
    t = 0.0
    parts = []

    # init
    e, t = show(t, PROMPT)
    parts.append(e)
    e, t = keystroke("nda-review-cli negotiate init --template common-paper-mutual --as a --out neg.json", t, per_char=0.018)
    parts.append(e)
    e, t = line("", t, 0.4)
    parts.append(e)
    e, t = line(f"{GREEN}✓{RST} Round 1 created · proposer={BOLD}A{RST} · 9 clauses · stance=middleground", t, 0.3)
    parts.append(e)
    e, t = line(f"  hash: {DIM}sha256:c4f1a2…1d{RST}", t, 0.6)
    parts.append(e)

    e, t = show(t, PROMPT)
    parts.append(e)
    e, t = keystroke("nda-review-cli negotiate counter --state neg.json --as b --auto", t, per_char=0.018)
    parts.append(e)
    e, t = line("", t, 0.4)
    parts.append(e)
    e, t = line(f"  Loaded round 1 · verifying chain… {GREEN}OK{RST}", t, 0.3)
    parts.append(e)
    e, t = line(f"  B's stance: conservative · priorities: term, governing-law, indemnity, …", t, 0.3)
    parts.append(e)
    e, t = line(f"  Generating amendments deterministically…", t, 0.4)
    parts.append(e)
    e, t = line(f"  • {YELLOW}amend{RST} term            36 → 24 months", t, 0.2)
    parts.append(e)
    e, t = line(f"  • {YELLOW}amend{RST} governing-law   California → Delaware", t, 0.2)
    parts.append(e)
    e, t = line(f"  • {GREEN}accept{RST} survival, definition, return/destroy", t, 0.2)
    parts.append(e)
    e, t = line(f"  • {RED}reject{RST} indemnity (non-negotiable for B)", t, 0.4)
    parts.append(e)
    e, t = line(f"{GREEN}✓{RST} Round 2 written · proposer={BOLD}B{RST} · 2 disputed", t, 0.3)
    parts.append(e)
    e, t = line(f"  hash: {DIM}sha256:8a5290…7e ← parent c4f1a2…1d{RST}", t, 0.8)
    parts.append(e)

    e, t = show(t, PROMPT)
    parts.append(e)
    e, t = keystroke("nda-review-cli negotiate diff --state neg.json --out-md round-2.md", t, per_char=0.018)
    parts.append(e)
    e, t = line("", t, 0.4)
    parts.append(e)
    e, t = line(f"  Round 1 → Round 2", t, 0.2)
    parts.append(e)
    e, t = line(f"{RED}- The Term shall continue for thirty-six (36) months…{RST}", t, 0.2)
    parts.append(e)
    e, t = line(f"{GREEN}+ The Term shall continue for twenty-four (24) months…{RST}", t, 0.3)
    parts.append(e)
    e, t = line(f"{RED}- Governing law: California.{RST}", t, 0.15)
    parts.append(e)
    e, t = line(f"{GREEN}+ Governing law: Delaware.{RST}", t, 0.7)
    parts.append(e)
    e, t = line(f"  {DIM}wrote round-2.md (62 lines){RST}", t, 0.8)
    parts.append(e)

    e, t = show(t, PROMPT)
    parts.append(e)
    e, t = keystroke("nda-review-cli negotiate accept --state neg.json --as a", t, per_char=0.018)
    parts.append(e)
    e, t = line("", t, 0.4)
    parts.append(e)
    e, t = line(f"  Acknowledging round 2 from B · accepting all 2 amendments", t, 0.3)
    parts.append(e)
    e, t = line(f"{GREEN}✓{RST} All clauses agreed · awaiting both sign-offs", t, 0.5)
    parts.append(e)

    e, t = show(t, PROMPT)
    parts.append(e)
    e, t = keystroke("nda-review-cli negotiate finalize --state neg.json --out-docx output/agreed.docx", t, per_char=0.018)
    parts.append(e)
    e, t = line("", t, 0.4)
    parts.append(e)
    e, t = line(f"  Verifying chain (3 rounds, 2 sign-offs) … {GREEN}OK{RST}", t, 0.3)
    parts.append(e)
    e, t = line(f"  {GREEN}✓{RST} output/agreed.md", t, 0.2)
    parts.append(e)
    e, t = line(f"  {GREEN}✓{RST} output/agreed.docx", t, 0.2)
    parts.append(e)
    e, t = line(f"  {GREEN}✓{RST} negotiation/audit.json (hash-chain anchor)", t, 1.5)
    parts.append(e)

    e, t = show(t, PROMPT)
    parts.append(e)
    e, t = show(t, " ", pause=2.0)
    parts.append(e)

    return build(parts)


# -------------------------- sign-cli demo --------------------------

def gen_sign_demo():
    t = 0.0
    parts = []

    e, t = show(t, PROMPT)
    parts.append(e)
    e, t = keystroke("npx sign-cli demo", t)
    parts.append(e)
    e, t = line("", t, 0.5)
    parts.append(e)

    e, t = line(f"{BOLD}sign-cli demo{RST}  {DIM}offline · local provider · no signup{RST}", t, 0.4)
    parts.append(e)
    e, t = line("", t, 0.2)
    parts.append(e)
    e, t = line(f"{CYAN}1.{RST} Sending {BOLD}contract.pdf{RST} to 2 signers…", t, 0.3)
    parts.append(e)
    e, t = line(f"   {GREEN}✓{RST} alice@acme.com  token=tk_4f… ttl=24h", t, 0.2)
    parts.append(e)
    e, t = line(f"   {GREEN}✓{RST} bob@beta.com    token=tk_91… ttl=24h", t, 0.5)
    parts.append(e)
    e, t = line(f"{CYAN}2.{RST} Simulating Alice signing…", t, 0.3)
    parts.append(e)
    e, t = line(f"   {GREEN}✓{RST} signature recorded · hash chained → ev_2", t, 0.4)
    parts.append(e)
    e, t = line(f"{CYAN}3.{RST} Simulating Bob signing…", t, 0.3)
    parts.append(e)
    e, t = line(f"   {GREEN}✓{RST} signature recorded · hash chained → ev_3", t, 0.4)
    parts.append(e)
    e, t = line(f"{CYAN}4.{RST} Anchoring with RFC 3161 timestamp authority…", t, 0.4)
    parts.append(e)
    e, t = line(f"   {GREEN}✓{RST} TSA reply 200 · anchored at 2025-05-10T14:22:08Z", t, 0.4)
    parts.append(e)
    e, t = line(f"{CYAN}5.{RST} Verifying signed PDF…", t, 0.3)
    parts.append(e)
    e, t = line(f"   {GREEN}✓{RST} 2 signatures · audit chain intact · timestamp valid", t, 0.6)
    parts.append(e)
    e, t = line("", t, 0.2)
    parts.append(e)
    e, t = line(f"{GREEN}✓ Demo complete{RST} in 4.1s", t, 0.3)
    parts.append(e)
    e, t = line(f"  Output:", t, 0.2)
    parts.append(e)
    e, t = line(f"    {DIM}./demo-out/contract.signed.pdf{RST}", t, 0.2)
    parts.append(e)
    e, t = line(f"    {DIM}./demo-out/receipt.json (3 events, RFC 3161 anchor){RST}", t, 1.5)
    parts.append(e)

    e, t = show(t, PROMPT)
    parts.append(e)
    e, t = keystroke("sign-cli verify demo-out/contract.signed.pdf", t, per_char=0.02)
    parts.append(e)
    e, t = line("", t, 0.4)
    parts.append(e)
    e, t = line(f"{GREEN}OK{RST} · 2 signers · audit chain intact · timestamp anchor verified", t, 1.5)
    parts.append(e)

    e, t = show(t, PROMPT)
    parts.append(e)
    e, t = show(t, " ", pause=2.0)
    parts.append(e)

    return build(parts)


# -------------------------- docx2pdf doctor + batch --------------------------

def gen_docx2pdf():
    t = 0.0
    parts = []

    e, t = show(t, PROMPT)
    parts.append(e)
    e, t = keystroke("docx2pdf --doctor", t)
    parts.append(e)
    e, t = line("", t, 0.5)
    parts.append(e)

    e, t = line(f"{BOLD}docx2pdf-cli{RST} {DIM}backend probe — what's available on this Mac{RST}", t, 0.4)
    parts.append(e)
    e, t = line("", t, 0.2)
    parts.append(e)
    e, t = line(f"  {GREEN}✓{RST}  libreoffice  /Applications/LibreOffice.app/Contents/MacOS/soffice", t, 0.3)
    parts.append(e)
    e, t = line(f"     {DIM}version 7.6.4 · headless OK · fonts: 217 detected{RST}", t, 0.3)
    parts.append(e)
    e, t = line(f"  {GREEN}✓{RST}  word         /Applications/Microsoft Word.app", t, 0.25)
    parts.append(e)
    e, t = line(f"     {DIM}AppleScript bridge OK · macOS only{RST}", t, 0.3)
    parts.append(e)
    e, t = line(f"  {GREEN}✓{RST}  pandoc       /opt/homebrew/bin/pandoc", t, 0.25)
    parts.append(e)
    e, t = line(f"     {DIM}version 3.1.11 · pdf engine: xelatex{RST}", t, 0.3)
    parts.append(e)
    e, t = line(f"  {RED}✗{RST}  gotenberg    {DIM}(no GOTENBERG_URL set){RST}", t, 0.6)
    parts.append(e)
    e, t = line("", t, 0.2)
    parts.append(e)
    e, t = line(f"  {BOLD}Selected default:{RST} libreoffice  {DIM}(highest fidelity for DOCX){RST}", t, 1.4)
    parts.append(e)

    e, t = show(t, PROMPT)
    parts.append(e)
    e, t = keystroke("docx2pdf --concurrency 4 --out-dir ./pdfs ./drafts/*.docx", t, per_char=0.018)
    parts.append(e)
    e, t = line("", t, 0.4)
    parts.append(e)
    e, t = line(f"  Found {BOLD}12{RST} .docx files in ./drafts · concurrency=4", t, 0.4)
    parts.append(e)
    e, t = line(f"  [{GREEN}1/12{RST}] q3-vendor-nda.docx          → pdfs/q3-vendor-nda.pdf", t, 0.2)
    parts.append(e)
    e, t = line(f"  [{GREEN}2/12{RST}] msa-acme-2025.docx          → pdfs/msa-acme-2025.pdf", t, 0.18)
    parts.append(e)
    e, t = line(f"  [{GREEN}3/12{RST}] sow-design-sprint.docx     → pdfs/sow-design-sprint.pdf", t, 0.18)
    parts.append(e)
    e, t = line(f"  [{GREEN}4/12{RST}] employee-pip.docx           → pdfs/employee-pip.pdf", t, 0.18)
    parts.append(e)
    e, t = line(f"  [{GREEN}5/12{RST}] referral-agreement.docx    → pdfs/referral-agreement.pdf", t, 0.18)
    parts.append(e)
    e, t = line(f"  [{GREEN}6/12{RST}] dpa-eu-2024.docx            → pdfs/dpa-eu-2024.pdf", t, 0.18)
    parts.append(e)
    e, t = line(f"  [{YELLOW}!{RST}/12] eu-dpa-template.docx       → {YELLOW}font 'Sabon LT' missing — substituting{RST}", t, 0.3)
    parts.append(e)
    e, t = line(f"  [{GREEN}7/12{RST}] eu-dpa-template.docx        → pdfs/eu-dpa-template.pdf", t, 0.18)
    parts.append(e)
    e, t = line(f"  [{GREEN}8/12{RST}] board-consent-q1.docx       → pdfs/board-consent-q1.pdf", t, 0.18)
    parts.append(e)
    e, t = line(f"  [{GREEN}9/12{RST}] vendor-onboard.docx         → pdfs/vendor-onboard.pdf", t, 0.18)
    parts.append(e)
    e, t = line(f"  [{GREEN}10/12{RST}] founder-iia.docx           → pdfs/founder-iia.pdf", t, 0.18)
    parts.append(e)
    e, t = line(f"  [{GREEN}11/12{RST}] mutual-nda-2025.docx       → pdfs/mutual-nda-2025.pdf", t, 0.18)
    parts.append(e)
    e, t = line(f"  [{GREEN}12/12{RST}] services-amendment-2.docx → pdfs/services-amendment-2.pdf", t, 0.4)
    parts.append(e)
    e, t = line("", t, 0.15)
    parts.append(e)
    e, t = line(f"{GREEN}✓{RST} 12 files converted in 14.3s · 1 warning (font substitution)", t, 1.6)
    parts.append(e)

    e, t = show(t, PROMPT)
    parts.append(e)
    e, t = show(t, " ", pause=2.0)
    parts.append(e)

    return build(parts)


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    cast("nda-review-quickstart.cast",
         title="nda-review-cli — quickstart + review",
         events=gen_nda_quickstart())
    cast("nda-review-negotiate.cast",
         title="nda-review-cli — negotiate flow",
         events=gen_nda_negotiate())
    cast("sign-cli-demo.cast",
         title="sign-cli — offline demo",
         events=gen_sign_demo())
    cast("docx2pdf-doctor.cast",
         title="docx2pdf-cli — doctor + batch",
         events=gen_docx2pdf())


if __name__ == "__main__":
    main()
