# OfferProof iteration — 5 October 2026

## Product changes

- More precise evidence: contrast clauses and negation are handled separately; repeated matches remain inspectable. Conditional demands such as “we won't hire until you pay” stay visible. Common benign references to coffee, hourly pay, and checking a website avoid the earlier false positives.
- New task-payment and password/verification-code warnings, with FTC sources. Identity collection after hiring is a verification prompt rather than automatically treated as an early-stage demand.
- Stronger email/website validation, including Unicode hostnames. No site is fetched. A matching domain remains a clue, not proof of identity.
- Verification progress and selective invalidation: changing the official domain clears all checks; changing the sender clears the contact check. Changing a path on the same official domain keeps progress.
- Optional evidence notes and a copyable employer-question template. Report preview precedes copy or download; common contacts, long numbers, and URL tracking details are masked. Confirmation dates remain readable.
- English and Chinese versions of three fictional examples. User text survives language changes. Replacing user-entered text or notes with an example asks for confirmation; switching between untouched examples remains one click. Reset confirmation, keyboard shortcuts, clear input feedback, clipboard fallback, and an oversized-paste guard improve recovery from common interaction problems.
- Mobile evidence disclosure, clearer focus, contrast, target sizes, and a skip link. The original message remains available on demand.
- User-selected recovery links for Malaysia NSRC 997, Singapore ScamShield 1799, and the US FTC. An entry near the top lets someone who already shared money or details go directly to recovery steps. The app sends no messages or reports.

## Verification evidence

- 66 synthetic analysis/report regression cases passed. Exact offsets, multilingual examples, conditional demands, benign wording, malformed domains, and export redaction are covered.
- Headless Playwright Firefox completed the main flow, button interactions, keyboard actions, clipboard denial, actual file download, resets, language switching, notes, recovery selection, and repeated evidence.
- Screenshots were inspected, including desktop, Chinese, and mobile verification views. No horizontal page overflow at 320, 390, or 768 pixels in the tested states.
- axe reported zero violations for the selected WCAG A/AA rules in four states: initial desktop, completed review, Chinese report, and mobile risky review. Automated checks do not prove full accessibility.
- No unexpected external requests, browser storage writes, or page errors in the tested flow. Pasted markup remained inert text.
- One local Firefox run analyzed an 18,400-character synthetic message in about 100 ms including automation interaction overhead. This is not a device-independent performance guarantee.
- GitHub Actions repeats the analysis and Firefox suites and retains generated screenshots/audit JSON for seven days.

## Remaining limits

Rules can miss deceptive wording or flag harmless text. They do not certify an employer, authenticate an email, or inspect a website. Tests are synthetic and establish regression behavior, not scam-detection accuracy. Export masking is limited, so the user must inspect the preview. Data is intentionally not persisted; a refresh clears the review.

The next useful product evidence would be observing a small group of students using the prototype with fictional invitations and checking whether they can independently confirm a role. A demo video and Devpost submission remain separate deliverables.
