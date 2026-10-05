# OfferProof

OfferProof helps students pause and independently verify job or internship invitations. The browser prototype highlights exact phrases associated with known scam patterns, compares an email domain with a company website the user found independently, and makes a self-reported verification checklist and downloadable record.

## Run

Requires Python 3 for the local static server. No install, account, API key, or network connection is required for the core flow.

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`. The published prototype is at [GitHub Pages](https://georgefifth.github.io/offerproof/).

## Test

Run the analysis checks with `npm test`. To drive a headless Firefox through the complete browser flow and save desktop, Chinese, and mobile screenshots to `test-artifacts/`:

```bash
npm install
npx playwright install --with-deps firefox
npm run test:e2e
```

The end-to-end test drives actual buttons, keyboard navigation, evidence expansion, domain comparison, selective checklist resets, bilingual examples, report preview/copy/download, clipboard denial, oversized paste, reset confirmation, and mobile layouts. It also checks for unexpected network requests and runs axe on four page states. These automated checks do not establish complete accessibility or real-world detection accuracy.

The 58 analysis/report cases are synthetic regression examples based on documented mechanisms, not a representative collection of real offers. GitHub Actions runs both suites on pushes and pull requests and saves screenshots and audit results for seven days.

## Demo flow

1. Click **Suspicious offer** and **Examine this offer**.
2. Review the highlighted text and the action linked to each warning.
3. Compare the sender email with a company site found independently. The sample uses fictional domains and has a personal email warning.
4. Complete or leave open the three verification steps, optionally add evidence notes, then preview the redacted record before copying or downloading it.
5. Try **Ordinary offer** to see that no rule match is presented as *unverified*, never as "safe".

Sample company names and addresses are fictional. The samples are demonstration data, not actual scam reports or genuine job offers.

## Scope and limitations

- This is a guided check, not a fraud classifier, web reputation service, or employer identity certification.
- Phrase detection is limited and may miss scams or flag harmless text. A domain match can also be spoofed or compromised. Users should confirm the role and sender through a separately located official contact.
- The message and optional notes are held only in memory in the open tab. They are not sent to a server or saved to browser storage. Copy and download require explicit clicks. The record omits the complete message, redacts common contact and long-number formats in matched excerpts and notes, and includes domains rather than full email or site addresses. Redaction is limited; review the preview before sharing it. Refreshing or closing the tab clears the review.
- An identity request after hiring still needs independent confirmation and a secure HR channel. Checklist completion records the user's own checks; it does not certify an employer. Editing the official domain resets all checks; editing the sender resets the contact check.
- Recovery guidance offers official Malaysia, Singapore, and US links selected by the user. It does not call, report, locate the user, or send messages automatically.
- Source guidance is linked from the interface. The source pages are external, but the app does not load them automatically.

## Sources and prior art

- [FTC guidance for college job hunters](https://consumer.ftc.gov/consumer-alerts/2025/05/college-students-avoid-scammers-while-you-job-hunt)
- [FTC warning signs for job scams](https://consumer.ftc.gov/consumer-alerts/2023/12/how-spot-latest-job-scams)
- [Scamwatch jobs and employment scams](https://www.scamwatch.gov.au/types-of-scams/jobs-and-employment-scams)
- [FTC task scams](https://consumer.ftc.gov/consumer-alerts/2024/11/task-scams-create-illusion-making-money)
- [FTC verification code guidance](https://consumer.ftc.gov/consumer-alerts/2024/03/whats-verification-code-why-would-someone-ask-me-it)
- [Malaysia NSRC 997](https://www.malaysia.gov.my/en/categories/safety-community-and-law--order/cybersecurity/nsrc-997-hotline), [Singapore ScamShield 1799](https://www.scamshield.gov.sg/check-for-scams/scamshield-helpline/)
- Existing open-source work includes [JobVerify](https://github.com/yessGlory17/job-verify), which offers OSINT-based recruiter and offer checks. OfferProof does not use its code. This prototype focuses on a small, private, evidence-first student review flow.
- See [COMPETITOR_NOTES.md](./COMPETITOR_NOTES.md) for a concise comparison with other available tools and the product changes it prompted.

## LovHack Season 3 submission notes

Created for LovHack Season 3. The implementation in this directory is a new browser prototype. It uses no copied project code or external JS/CSS dependencies. The safety guidance is derived from the credited sources above. Do not state that the tool was tested with real job seekers or has a measured detection accuracy; neither claim has been established.

The event requires a 2–3 minute demo video and a working prototype link. See `DEMO.md` for a draft script. Submission to Devpost remains a separate user action.

See [ITERATION_NOTES.md](./ITERATION_NOTES.md) for the latest changes, verification evidence, and remaining limitations.
