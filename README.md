# cosmofyapp-website

The official public marketing website for **Cosmofy™**, hosted free on
GitHub Pages at the custom domain **cosmofyapp.com**.

## What this repository is (and isn't)

This repository contains **only** the public landing website: static
HTML, CSS, and a small amount of vanilla JavaScript. It is intentionally
a separate, standalone Git repository from the private Cosmofy Android
application, which lives at `~/cosmofy` on the developer's machine and is
**not** included, referenced in code, or exposed here in any way.

This site is:

- A one-page marketing/landing site plus a few supporting pages
- Static — no backend, no database, no build step, no npm dependencies
- Public — everything committed here is visible to anyone

This site is **not**:

- A web version of the Cosmofy app
- A booking, login, or client-portal system
- An e-commerce platform

Because the repository is public, **never commit anything private** —
see `CONTENT_REVIEW_CHECKLIST.md` and the "What must never be committed"
section below.

## File structure

```
cosmofyapp-website/
├── index.html                    Homepage (all main marketing sections)
├── privacy.html                  Website + app privacy statement
├── accessibility.html            Accessibility statement
├── support.html                  Support / beta status page
├── 404.html                      Custom not-found page
├── styles.css                    All site styling (CSS custom properties)
├── script.js                     Mobile nav, config-driven links, footer year
├── site-config.js                Editable contact/beta/store configuration
├── favicon.svg                   Favicon (Cosmofy logomark)
├── social-preview.svg            Open Graph / Twitter card image
├── robots.txt                    Search engine crawl rules + sitemap link
├── sitemap.xml                   Listed public pages
├── site.webmanifest              Web app manifest
├── CNAME                         GitHub Pages custom domain (cosmofyapp.com)
├── .nojekyll                     Disables Jekyll processing on GitHub Pages
├── .gitignore                    Excludes secrets, build artifacts, binaries
├── NOTICE.md                     Proprietary branding/content notice
├── DNS_SETUP.md                  Wix → GitHub Pages DNS instructions
├── DEPLOYMENT_CHECKLIST.md       Pre/post-publish checklist
├── CONTENT_REVIEW_CHECKLIST.md   Sensitive-content and claims review checklist
├── assets/
│   ├── logo/                    Additional logo files (currently empty)
│   ├── screenshots/             Real app screenshots, once reviewed (currently empty)
│   └── icons/                   Additional icon formats (currently empty)
└── scripts/
    └── check_site.py            Stdlib-only local validation script
```

## Previewing locally

No build step is required. Either open `index.html` directly in a
browser, or serve it with Python's built-in server (recommended, since
some browsers restrict `fetch`/relative paths under `file://`):

```
cd ~/cosmofyapp-website
python3 -m http.server 8080
```

Then visit `http://127.0.0.1:8080/`.

## Updating content

Most page text lives directly in the relevant `.html` file (there is no
templating system, so the header/footer markup is duplicated across
pages — update all pages when changing shared elements like navigation).

Shared styling lives in `styles.css`, using CSS custom properties defined
at the top of the file (colors, spacing, etc.) so visual tweaks can
usually be made in one place.

## How `site-config.js` works

`site-config.js` defines a single `COSMOFY_CONFIG` object that `script.js`
uses to fill in contact links, the beta CTA, and beta status text at page
load, via `data-*` attributes in the HTML (e.g. `data-contact-email`,
`data-beta-cta`, `data-beta-status`). Core content still works with
JavaScript disabled, because every element has a sensible static
fallback already in the HTML (e.g. the mailto link and beta status text
are already correct as plain HTML).

### To add a beta-signup form URL later

Edit `site-config.js` and set:

```js
betaFormUrl: "https://your-form-url-here",
```

The "Express beta interest" button will then link to that form instead
of the `mailto:` fallback. Do not wire up a third-party form provider
without first reviewing its own privacy practices, since it would become
an external service this site links to.

### To add a Google Play Store URL later

Edit `site-config.js` and set:

```js
playStoreUrl: "https://play.google.com/store/apps/details?id=...",
```

Any element marked `data-play-store-link` will be revealed and pointed at
that URL. You will also want to update `support.html` and the homepage
FAQ answer about Google Play availability once this is set.

### To update contact addresses

Edit `contactEmail` and `supportEmail` in `site-config.js`.

### To change beta status text

Edit `betaStatus` in `site-config.js`. This updates every element marked
`data-beta-status` (currently in the header nav and `support.html`).

### To replace CSS mockups with real screenshots

1. Confirm the screenshot contains no client names, contact info,
   formulas, photographs, or financial data — see
   `CONTENT_REVIEW_CHECKLIST.md`.
2. Add the reviewed image to `assets/screenshots/`.
3. Replace the relevant `.phone-mockup` block in `index.html` with an
   `<img>` tag pointing at the new file, including a `width`/`height` and
   meaningful `alt` text (or `alt=""` if purely decorative and already
   described in nearby text).

## How GitHub Pages deployment works

This repository is configured to deploy via **Settings → Pages → Deploy
from a branch → `main` / `/ (root)`** — no GitHub Actions workflow, no
build step. Any push to `main` updates the live site within a few
minutes. `.nojekyll` disables GitHub's default Jekyll processing so
files like `.nojekyll`-prefixed or underscore-prefixed paths aren't
silently ignored (not currently used here, but harmless and standard
practice).

## How the custom domain works

The `CNAME` file in this repository tells GitHub Pages to serve the site
at `cosmofyapp.com` in addition to the default
`https://GITHUB_USERNAME.github.io/cosmofyapp-website/` address. DNS at
the domain registrar (Wix, in this case) must point `cosmofyapp.com` and
`www.cosmofyapp.com` at GitHub's servers — see `DNS_SETUP.md` for the
exact records and order of operations.

## Updating the privacy/accessibility statements

Edit `privacy.html` or `accessibility.html` directly. Update the "Last
updated" date in `privacy.html` when making a substantive change.

## Publishing future changes

```
cd ~/cosmofyapp-website
git pull
# edit and test
python3 scripts/check_site.py
git status
git diff
git add <specific files>
git commit -m "Describe the website update"
git push
```

Avoid `git add .` or `git add -A` without first reviewing `git status` —
it's easy to accidentally stage a local scratch file, editor swap file,
or exported data file that doesn't belong in a public repository.

## Rolling back

Since this is an ordinary Git repository, you can revert any change with
standard Git history commands, e.g.:

```
git log --oneline
git revert <commit-hash>
git push
```

## What must never be committed

- Cosmofy Android source code, APK/AAB files, or Gradle signing config
- Signing keys or keystores
- Passwords, API keys, or GitHub tokens
- Client names, contact information, formulas, or photographs
- Financial records, backups, or database files
- Internal reports or private development documentation
- Local environment files (`.env`, etc.)

See `.gitignore` and `CONTENT_REVIEW_CHECKLIST.md`.

## Public visibility

This repository is public. Everything committed to it — including full
file history — is visible to anyone on the internet, indefinitely
(even after a later commit removes or changes a file). When in doubt,
don't commit it.

## Brand asset origin

`favicon.svg`, `social-preview.svg`, and the inline logomark used in the
site header/footer were redrawn as standard SVG from two small vector
shapes and a five-color palette already used as the Cosmofy Android app
icon:

- Shape/geometry source: `~/cosmofy/app/src/main/res/drawable/ic_launcher_foreground.xml`
  and `ic_launcher_background.xml` (Android vector-drawable path data,
  translated to standard SVG `<path>` syntax — same coordinates and
  colors, no other change)
- Color source: `~/cosmofy/app/src/main/res/values/colors.xml`
  (`warm_charcoal`, `soft_cream`, `espresso`, `champagne`, `muted_bronze`)

Both source files contain only generic geometric shapes and hex color
values — no client data, no private text, no identifying metadata. No
other file was copied from the Android repository. The Android app's
`splash_background.png` (a photographic image) was deliberately **not**
used on this website because its image licensing/rights could not be
verified from local inspection alone; the hero section uses a CSS-drawn
phone mockup instead.
