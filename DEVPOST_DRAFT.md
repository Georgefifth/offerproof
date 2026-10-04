# Devpost draft — OfferProof

**Tagline:** Pause before you reply: an evidence-first check for student job offers.

## Inspiration

Students looking for their first internship or part-time job may receive offers that look professional but request money or identity documents. The FTC specifically warns college job seekers about fake offers and recommends confirming employers through independently found contact details. We wanted to make that advice usable in the moment when someone is about to reply.

## What it does

OfferProof is a browser prototype with a three-step flow. A student pastes a job invitation. The app highlights exact passages matching a small set of documented warning patterns and shows an action and source for each. The student then compares the sender domain with a company site they found independently and works through a self-reported verification checklist. They can download a text record of their review.

It never declares an offer safe or fraudulent. When no phrases match, it still asks the user to verify the employer.

## How we built it

We used HTML, CSS, and JavaScript modules with no external runtime dependencies. The detection rules run locally in the browser. The interface is available in English and Chinese. The core flow needs no login, API key, or network request. The downloaded report is generated in the browser and omits the full pasted message.

## Challenges

The main design challenge was communicating uncertainty. A simple risk score would imply a level of accuracy we have not measured. We instead show the text that triggered each rule, distinguish high-impact requests from weaker signals, and require independent verification. The sender-domain comparison is only a clue, not an identity check.

## What we learned

Fraud guidance becomes more useful when it turns into a sequence a person can perform: pause, inspect the exact request, contact the company through an independent source, and keep a record. The app needs to be honest about what it cannot establish from a message alone.

## What was built during LovHack Season 3

The OfferProof prototype in this directory: bilingual interface, local phrase analysis, evidence highlighting, sender-domain comparison, verification checklist, and downloadable review record. FTC and Scamwatch guidance informed the rules and is credited in the product. No code was copied from prior job-verification projects.

## Built with

HTML, CSS, JavaScript, Node.js built-in test runner (development only).

## Before submission

- Add a public, working demo URL or clearly explain how judges can run the prototype.
- Record and link a 2–3 minute video showing the working product.
- Confirm team eligibility and complete the Devpost form before the deadline.
- Do not add claims of measured accuracy, real-user testing, or production deployment without evidence.
