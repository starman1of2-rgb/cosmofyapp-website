/**
 * Cosmofy website configuration.
 *
 * Edit the values below to update contact links, beta status, and the
 * Play Store link across the whole site without touching individual pages.
 * See README.md for step-by-step instructions.
 */
const COSMOFY_CONFIG = {
  siteName: "Cosmofy",
  domain: "https://cosmofyapp.com",

  // When betaFormUrl is set to a real link, the "Contact Cosmofy" beta
  // button will open that form in place of the mailto fallback.
  betaFormUrl: "",

  // Cosmofy's own hello@/support@ mailboxes aren't active yet — routed to a
  // personal address in the interim so the site's contact/support links
  // actually reach someone. Visible link text stays generic ("Contact
  // Cosmofy" / "Email Support") rather than showing this address as page
  // text; swap this back to hello@cosmofyapp.com / support@cosmofyapp.com
  // once those mailboxes are live.
  contactEmail: "dkeding1@gmail.com",
  supportEmail: "dkeding1@gmail.com",

  // When a Google Play listing exists, set this to the store URL.
  playStoreUrl: "",

  betaStatus: "Now in Android beta testing",
};
