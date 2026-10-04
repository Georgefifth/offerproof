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
npx playwright install firefox
npm run test:e2e
```

The end-to-end test checks examples, warnings, highlighting, domain comparison, the verification checklist, language switching, download content, state reset, and mobile overflow.

## Demo flow

1. Click **Suspicious offer** and **Examine this offer**.
2. Review the highlighted text and the action linked to each warning.
3. Compare the sender email with a company site found independently. The sample uses fictional domains and has a personal email warning.
4. Complete or leave open the three verification steps, then download the text record.
5. Try **Ordinary offer** to see that no rule match is presented as *unverified*, never as "safe".

Sample company names and addresses are fictional. The samples are demonstration data, not actual scam reports or genuine job offers.

## Scope and limitations

- This is a guided check, not a fraud classifier, web reputation service, or employer identity certification.
- Phrase detection is limited and may miss scams or flag harmless text. A domain match can also be spoofed or compromised. Users should confirm the role and sender through a separately located official contact.
- The message is held only in memory in the open tab. It is not sent to a server or saved to browser storage. Export happens only when the user clicks Download. The export omits the complete message, redacts common contact and long-number formats in matched excerpts, and includes domains rather than full email or site addresses. Redaction is limited; review the record before sharing it.
- Source guidance is linked from the interface. The source pages are external, but the app does not load them automatically.

## Sources and prior art

- [FTC guidance for college job hunters](https://consumer.ftc.gov/consumer-alerts/2025/05/college-students-avoid-scammers-while-you-job-hunt)
- [FTC warning signs for job scams](https://consumer.ftc.gov/consumer-alerts/2023/12/how-spot-latest-job-scams)
- [Scamwatch jobs and employment scams](https://www.scamwatch.gov.au/types-of-scams/jobs-and-employment-scams)
- Existing open-source work includes [JobVerify](https://github.com/yessGlory17/job-verify), which offers OSINT-based recruiter and offer checks. OfferProof does not use its code. This prototype focuses on a small, private, evidence-first student review flow.
- See [COMPETITOR_NOTES.md](./COMPETITOR_NOTES.md) for a concise comparison with other available tools and the product changes it prompted.

## LovHack Season 3 submission notes

Created for LovHack Season 3. The implementation in this directory is a new browser prototype. It uses no copied project code or external JS/CSS dependencies. The safety guidance is derived from the credited sources above. Do not state that the tool was tested with real job seekers or has a measured detection accuracy; neither claim has been established.

The event requires a 2–3 minute demo video and a working prototype link. See `DEMO.md` for a draft script. Submission to Devpost remains a separate user action.
