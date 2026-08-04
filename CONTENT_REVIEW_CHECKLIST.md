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
- [ ] "Available on Google Play" (unless actually published)
- [ ] Any customer count, testimonial, or review not supplied and approved by the user
- [ ] Any release date not approved by the user
- [ ] A public APK/AAB download link
- [ ] The beta described as open to everyone, rather than a small/limited/approved group
- [ ] Any promise of cash compensation, hardware, future paid services, or unlimited
      future products for beta testers (only: the released app, at no cost, for
      testers who actively participate)

Confirm supportable phrasing is used instead, such as:

- [ ] "Designed with Android accessibility in mind"
- [ ] "Designed for private, local salon recordkeeping"
- [ ] "The stylist controls the calendar"
- [ ] "No client self-booking"
- [ ] "Now in Android beta testing" (current status — see `betaStatus` in
      `site-config.js`, which drives every status badge/footer note site-wide)
- [ ] "A small, approved group of beta testers" (not "open" or "everyone")

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
