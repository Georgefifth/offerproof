# Competitor review — 4 October 2026

This is a lightweight product comparison based on public product pages. Feature descriptions are the publishers' own claims; they were not independently benchmarked.

| Product | Publicly described strengths | Implication for OfferProof |
| --- | --- | --- |
| [OfferSentry](https://www.offersentry.com/) | Browser-local message screening, common scam signals, recruiter and domain guidance, no signup | A basic paste-and-flag checker is already available. Keep the flow short and make the user’s independent review more useful. |
| [JobOfferChecker](https://jobofferchecker.com/) | Local analysis, quick questions, risk score, safe replies, dedicated recovery tools | Avoid a pseudo-precise score. Preserve a single page with the source evidence and a review record. |
| [ScamOffer](https://scamoffer.com/) | Screenshot input, many documented patterns, quoted red flags, safe replies, reporting | Competing on pattern count or unsupported accuracy claims is unwise. Improve transparency, privacy of exported excerpts, and clarity of uncertainty. |
| [JobVerify](https://github.com/yessGlory17/job-verify) | Open-source OSINT checks through an MCP server, using registries, DNS, blocklists and archives | External intelligence can add value, but it requires more setup and network access. Keep OfferProof usable without an account, install, or external service. |

## Changes made after review

- Added sentence-level matching and explicit-denial handling. “We will never ask you to pay a training fee” should not be flagged as a demand. A later real payment demand must still be found.
- Added limited redaction of common email, phone and long-number formats in the downloadable record. The full message is omitted, and the record contains sender and independently found site domains rather than full addresses.
- Made sender email optional for SMS and messaging-app offers. The independent website and contact checklist still work.
- Kept the original one-paste workflow, evidence highlights, bilingual interface, and a small number of clear findings.

## Deliberate limits

OfferProof does not certify an employer, browse the company website, run OSINT, or state a detection accuracy. The user must confirm the role and recruiter through independently located contact details. The export redaction is limited and users should review a record before sharing it.
