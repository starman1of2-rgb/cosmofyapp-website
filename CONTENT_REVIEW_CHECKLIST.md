# Content review checklist

Complete this review before every publish or public update. The goal is
to make sure nothing private, unsupported, or overstated goes live.

## Sensitive content

- [ ] No client names, contact information, or photographs
- [ ] No client formulas or treatment records
- [ ] No financial records, reports, or exports
- [ ] No passwords, API keys, tokens, or credentials
- [ ] No signing keys, keystores, or Gradle signing configuration
- [ ] No database files, backup files, or `.env` files
- [ ] No internal development documentation or private paths (e.g. `/home/...`, `~/cosmofy`)
- [ ] No Android source code or APK/AAB files

## Trademark and branding

- [ ] "Cosmofy™" uses the ™ symbol on first prominent mention per primary page
- [ ] The ® symbol is not used anywhere
- [ ] Only the approved brand color palette and logomark are used

## Claims and wording

Confirm none of the following unsupported claims appear:

- [ ] "Fully ADA compliant" / "legally compliant" / "certified accessible"
- [ ] "HIPAA compliant"
- [ ] "Accountant approved" / "tax authority approved"
- [ ] "Guaranteed secure" / "impossible to hack"
- [ ] "Cloud encrypted" (unless specifically documented and true)
- [ ] "Available on Google Play", "Available now", "Download now", or "Buy now"
      (only true now that the Play Store listing at `com.cosmofy.app` is
      actually publicly accessible — re-verify before reusing this checklist
      if that ever changes)
- [ ] Any customer count, testimonial, or review not supplied and approved by the user
- [ ] Any release date not approved by the user
- [ ] Any sale date, sale price, or savings figure that doesn't match
      `pricing` in `site-config.js`
- [ ] A public APK/AAB download link
- [ ] Beta-testing, closed-testing, tester-recruitment, "join the beta", or
      "production review" language (closed testing and Google Play review have
      both ended; the app is live)

Confirm supportable phrasing is used instead, such as:

- [ ] "Designed with Android accessibility in mind"
- [ ] "Designed for private, local salon recordkeeping"
- [ ] "The stylist controls the calendar"
- [ ] "No client self-booking"
- [ ] "Available now on Google Play" (current status — see `betaStatus` in
      `site-config.js`, which drives every status badge/footer note site-wide)
- [ ] "One-time purchase — no subscription" with the correct regular price
      ($49.99) and, during the approved launch-sale window only, the sale
      price ($29.99) and savings ($20 / about 40%) from `pricing` in
      `site-config.js` — never a hardcoded date or amount typed directly
      into a page

## Mock data

- [ ] All sample/mock interface content is obviously fictional (e.g.
      "Sample Client", "Root Retouch", "9:00 AM")
- [ ] No real names or data from development/testing appear anywhere

## Technical/privacy review

- [ ] No analytics, tracking pixels, or advertising scripts
- [ ] No third-party fonts or CDNs
- [ ] No external JavaScript dependencies
- [ ] No forms that collect or transmit data anywhere
- [ ] Content Security Policy present on every page and not broken

## Sign-off

- [ ] Reviewed by the site owner before this update is published
