/**
 * Cosmofy website configuration.
 *
 * Edit the values below to update contact links, availability status,
 * the Play Store link, and launch-sale pricing/dates across the whole
 * site without touching individual pages. See README.md for step-by-step
 * instructions.
 */
const COSMOFY_CONFIG = {
  siteName: "Cosmofy",
  domain: "https://cosmofyapp.com",

  // Cosmofy's own hello@/support@ mailboxes aren't active yet — routed to a
  // personal address in the interim so the site's contact/support links
  // actually reach someone. Visible link text stays generic ("Contact
  // Cosmofy" / "Email Support") rather than showing this address as page
  // text; swap this back to hello@cosmofyapp.com / support@cosmofyapp.com
  // once those mailboxes are live.
  contactEmail: "dkeding1@gmail.com",
  supportEmail: "dkeding1@gmail.com",

  // Official public Facebook community. This is the preferred place for
  // general questions, tips, feedback, feature ideas, and salon discussion.
  facebookGroupUrl: "https://www.facebook.com/groups/1084569343945187",

  // Cosmofy is publicly available now on Google Play in the United States.
  playStoreUrl: "https://play.google.com/store/apps/details?id=com.cosmofy.app",

  betaStatus: "Available now on Google Play",

  // Centralized pricing/launch-sale facts. All dates are calendar days in
  // Pacific Time (America/Los_Angeles) — script.js compares the visitor's
  // current Pacific-Time date against these to decide which sale-phase
  // message to show (before / during / after), so this is the only place
  // that ever needs to change when the sale schedule changes. Keep these
  // in sync with the real Google Play listing; see
  // CONTENT_REVIEW_CHECKLIST.md before publishing any change here.
  pricing: {
    regularPrice: "$49.99",
    salePrice: "$29.99",
    savingsAmount: "$20",
    savingsPercent: "40%",
    saleName: "Cosmofy Launch Sale",
    // Inclusive calendar-day window, Pacific Time, United States only.
    saleStartDate: "2026-10-07",
    saleEndDate: "2026-10-20",
  },
};
