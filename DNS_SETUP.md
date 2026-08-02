# DNS setup for cosmofyapp.com (Wix domain → GitHub Pages)

This document is the exact, safe sequence for pointing the Wix-registered
domain `cosmofyapp.com` at this GitHub Pages site, without a paid Wix
website-hosting plan and without touching Wix email/DNS records that are
unrelated to the website.

`GITHUB_USERNAME` below must be replaced with the actual authenticated
GitHub account name that owns the `cosmofyapp-website` repository. It could
not be auto-detected during this build because the GitHub CLI (`gh`) is not
installed/authenticated in this environment — see README.md for how to
confirm it once `gh` is set up (`gh api user --jq .login`).

## Order of operations (do not skip ahead)

1. Confirm GitHub Pages is enabled for `cosmofyapp-website` (Settings → Pages).
2. Confirm the temporary address `https://GITHUB_USERNAME.github.io/cosmofyapp-website/` loads successfully.
3. In the repository Settings → Pages → Custom domain, enter `cosmofyapp.com` and save.
4. Only then make the Wix DNS changes below.

Do not edit Wix DNS before GitHub Pages is confirmed working — otherwise
the domain may point at nothing while you debug two systems at once.

## Wix DNS records to add

### Apex domain (`cosmofyapp.com`)

Add **four** A records at the root/apex host (Wix may show the host field
as blank rather than `@` — either is the same thing):

| Host          | Type | Value           |
|---------------|------|-----------------|
| (blank) or @  | A    | 185.199.108.153 |
| (blank) or @  | A    | 185.199.109.153 |
| (blank) or @  | A    | 185.199.110.153 |
| (blank) or @  | A    | 185.199.111.153 |

### `www` subdomain

| Host | Type  | Value                          |
|------|-------|---------------------------------|
| www  | CNAME | GITHUB_USERNAME.github.io      |

Do not include `https://` in the CNAME value. Do not append a path or
repository name — it is the bare `github.io` host only.

## Wix steps

1. Sign in to Wix.
2. Open **Domains**.
3. Find `cosmofyapp.com`.
4. Open **Domain Actions** → **Manage DNS Records**.
5. Review the existing A records. Note what is currently there before
   changing anything (write it down in case you need to revert).
6. Remove only A records that conflict with website hosting (i.e. records
   pointing at a previous website host for the root domain).
7. Add the four GitHub Pages A records above.
8. Review the existing `www` CNAME record.
9. Remove only a conflicting `www` **website** CNAME (one that currently
   points `www` at a website host).
10. Add `www` → `GITHUB_USERNAME.github.io`.
11. Save changes.
12. **Do not remove:** MX records, TXT mail records, domain-verification
    TXT records, or any other DNS entry not directly related to website
    hosting.
13. Wait for DNS propagation (can take up to 48 hours, though it is
    often much faster).
14. Return to GitHub repository Settings → Pages and enable **Enforce
    HTTPS** once GitHub shows the option as available.

### Explicit warnings

- Do not delete MX records — this would break email for the domain.
- Do not change nameservers.
- Do not use wildcard DNS records (e.g. `*.cosmofyapp.com`).
- Do not delete domain-verification TXT records.
- DNS changes can take up to 48 hours to fully propagate everywhere.
- HTTPS may remain unavailable until GitHub finishes issuing the
  certificate for the custom domain — this can take some time after DNS
  is correctly pointed.

## Verifying DNS from a terminal

```
dig cosmofyapp.com +noall +answer -t A
dig www.cosmofyapp.com +noall +answer -t CNAME
```

Expected apex `A` values (all four, in any order):

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

Expected `www` CNAME target:

```
GITHUB_USERNAME.github.io
```

### Windows PowerShell equivalent

```
Resolve-DnsName cosmofyapp.com -Type A
Resolve-DnsName www.cosmofyapp.com -Type CNAME
```

## Domain verification (recommended by GitHub)

GitHub supports verifying ownership of a custom domain at the account
level, which reduces the risk of a subdomain/domain takeover. This is
separate from, and in addition to, simply setting the custom domain on
the repository.

1. Open GitHub account **Settings**.
2. Open **Pages** (under "Code, planning, and automation" in account
   settings).
3. Add `cosmofyapp.com` under verified domains.
4. GitHub will generate a **unique TXT record value** — do not invent
   or reuse a value from anywhere else.
5. Add that exact TXT record in Wix DNS.
6. Wait for GitHub to confirm verification.
7. Keep the TXT record in place after verification succeeds; removing it
   later can cause verification to lapse.

Do not create a wildcard record such as `*.cosmofyapp.com`.

## Status of this step

DNS changes, propagation, and certificate issuance require access to the
Wix account and time to propagate — none of that has been performed or
verified as part of this local build. This document only prepares the
exact steps to run.
