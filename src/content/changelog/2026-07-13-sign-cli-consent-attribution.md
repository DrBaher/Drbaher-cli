---
title: "sign-cli — consent & attribution layer (intent, consent, and identity assurance in the audit chain)"
date: 2026-07-13
cli: sign-cli
summary: "sign-cli now captures the evidence e-signature disputes actually turn on — intent, consent, and attribution — directly in its tamper-evident audit chain. Opt in per request: --require-consent gates signing on a recorded intent-to-sign attestation plus an electronic-records (ESIGN) disclosure; --require-email-verification gates it on proof of mailbox control. A third command records how you verified a signer's identity out-of-band. No accounts, no KYC forms, no identity documents stored — by design. On main now; ships in the next release after 0.8.0."
tags: ["sign-cli"]
---

**Availability:** merged to `main` (commits `f18a4b6` + `6773469`); ships in the first release after 0.8.0. The published `@drbaher/sign-cli@0.8.0` does not have these flags yet.

Under US ESIGN/UETA, what a court asks about an e-signature is procedural: did the signer intend to sign, did they consent to transact electronically, and can you attribute the signature to them? This release records all three in sign-cli's hash-chained audit log — and deliberately stops short of collecting identity documents, because self-asserted KYC data adds privacy liability without adding evidentiary weight.

### Intent + consent, as versioned attestations

Create a request with `--require-consent true` and no signer can sign until they've affirmatively accepted two canonical statements — an intent-to-sign attestation and an electronic-records disclosure covering the ESIGN §7001(c) elements (right to paper, withdrawal, retention). `sign consent show` prints the exact texts; the audit chain records each acceptance with the statement's version id, SHA-256, full text, and timestamp. Statement versions are immutable: historical consents always re-verify against exactly what was accepted.

### Email verification, opt-in

`--require-email-verification true` gates signing on a 6-digit code that proves control of the signer's mailbox — evidence the approval token alone can't give you. Codes are hashed at rest, TTL-bounded, locked after 5 wrong attempts, and never appear in the audit chain (only a masked hint does). Wire `SIGN_VERIFICATION_WEBHOOK_URL` to your mailer, or deliver codes out-of-band.

### Identity assurance, recorded — not collected

When you have verified who you're dealing with (a video call, an in-person meeting, a provider IDV flow), `sign signer record-identity` logs the method, the verifier, and a pointer to the evidence in the audit chain. The assertion is recorded; the personal data stays wherever it already lives.

### Enforced everywhere, gated where it counts

Both gates live in the shared signing service, so the CLI, the MCP `sign` tool, and `POST /v1/sign` all honor them — an agent holding a token still can't get past a gate (`CONSENT_REQUIRED`, `EMAIL_VERIFICATION_REQUIRED`), and `--auto-approve` is rejected in combination with either. Capture itself (`approve`, `verify-email`, `record-identity`) stays CLI-side, consistent with the tool's core asymmetry: agents drive the workflow, humans perform the signing gesture.

### Quick reference

| New | Command / flag |
| --- | --- |
| Require consent per request | `request create --require-consent true` |
| Require mailbox proof per request | `request create --require-email-verification true` |
| Read the canonical statements | `sign consent show` |
| Accept them (signer) | `approve --agree true --accept-disclosure true` |
| Issue / redeem a verification code | `signer send-verification` / `signer verify-email` (or `approve --verification-code`) |
| Record an out-of-band identity check | `signer record-identity --identity-assurance method:…` |
| New audit events | `request.consent_captured`, `request.esign_consent_captured`, `request.signer_verification_issued`, `request.signer_email_verified`, `request.identity_assurance_recorded` |

### See it in five seconds

Once released, `npx @drbaher/sign-cli demo` runs the full consent flow offline: both gates on, two sign attempts visibly blocked (`EMAIL_VERIFICATION_REQUIRED`, `CONSENT_REQUIRED`), email verified, consent captured, identity recorded, then approve → sign → verify chain → export receipt. Then it deletes everything.

### What it doesn't claim

This strengthens the ESIGN/UETA evidence story. It does not change the eIDAS tier — the local provider still produces a Simple Electronic Signature, and verified legal identity remains the domain of hosted-provider IDV or a QTSP. The full posture is documented in [`docs/reference/legal.md`](https://github.com/DrBaher/sign-cli/blob/main/docs/reference/legal.md) and the new [`docs/reference/consent-and-identity.md`](https://github.com/DrBaher/sign-cli/blob/main/docs/reference/consent-and-identity.md).
