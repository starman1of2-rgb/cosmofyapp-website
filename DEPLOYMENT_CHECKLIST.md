# Deployment checklist

Work through this list in order. Do not check an item unless it has
actually been verified — do not mark DNS, HTTPS, or Wix-side steps as done
based on assumption.

## Local readiness

- [ ] Local site validation passes (`python3 scripts/check_site.py`)
- [ ] No sensitive files present (secrets, keys, tokens, client data, backups)
- [ ] No private client content anywhere in the repository
- [ ] No APK, AAB, or Android source code present
- [ ] Content has been reviewed against `CONTENT_REVIEW_CHECKLIST.md`

## GitHub repository

- [ ] Repository is public intentionally (required for free GitHub Pages)
- [ ] GitHub Pages enabled (Settings → Pages → Deploy from branch → `main` / `/ (root)`)
- [ ] Temporary `https://GITHUB_USERNAME.github.io/cosmofyapp-website/` address loads
- [ ] `CNAME` file contains exactly `cosmofyapp.com`
- [ ] GitHub custom domain field saved as `cosmofyapp.com`

## Wix DNS (see DNS_SETUP.md for exact records)

- [ ] Wix apex A records updated (four GitHub Pages IPs)
- [ ] Wix `www` CNAME updated to `GITHUB_USERNAME.github.io`
- [ ] MX records and unrelated TXT records preserved and untouched
- [ ] Apex domain resolves to GitHub Pages IPs (`dig cosmofyapp.com -t A`)
- [ ] `www` resolves to `GITHUB_USERNAME.github.io` (`dig www.cosmofyapp.com -t CNAME`)

## HTTPS

- [ ] HTTPS enabled in GitHub Pages settings
- [ ] HTTP requests redirect to HTTPS
- [ ] `www` and apex domain redirect/serve consistently

## Page checks

- [ ] Homepage loads
- [ ] Privacy page loads
- [ ] Accessibility page loads
- [ ] Support page loads
- [ ] 404 page displays correctly for an unknown path

## UX and accessibility

- [ ] Mobile layout checked at 320px–1440px widths
- [ ] Keyboard navigation checked (tab order, skip link, mobile menu, FAQ)
- [ ] Visible focus indicators confirmed
- [ ] 200% text zoom checked (no clipped or overlapping content)
- [ ] Reduced-motion preference respected

## Content and contact

- [ ] Contact email(s) confirmed correct in `site-config.js`
- [ ] Beta link configured, or clearly marked as using the mailto fallback
- [ ] Social preview image checked (rendered by a link-preview tool)
- [ ] Sitemap checked (`sitemap.xml` lists the correct URLs)
- [ ] No broken internal links (`python3 scripts/check_site.py`)

## Final approval

- [ ] Final content approved by the site owner (wording, claims, pricing/beta language)
