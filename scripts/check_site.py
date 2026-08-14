#!/usr/bin/env python3
"""
Stdlib-only local validator for the Cosmofy website.

Run from the repository root:

    python3 scripts/check_site.py

Checks:
  - required files and directories exist
  - internal HTML links point to an existing file or a valid anchor
  - each page has a <title> and exactly one <h1>
  - each page has a viewport meta tag
  - each primary page has a canonical link (404.html is intentionally
    excluded — it is noindexed and has no canonical URL of its own)
  - images include alt attributes
  - CNAME contains only "cosmofyapp.com"
  - no obvious localhost URL remains in site files
  - no accidental private filesystem paths appear in site files
  - no API-key-like literal is present
  - no APK, AAB, database, backup, keystore, or environment file exists
    anywhere in the repository
"""
import os
import re
import sys
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

REQUIRED_FILES = [
    "index.html",
    "privacy.html",
    "accessibility.html",
    "support.html",
    "404.html",
    "styles.css",
    "script.js",
    "site-config.js",
    "favicon.svg",
    "social-preview.svg",
    "robots.txt",
    "sitemap.xml",
    "site.webmanifest",
    "CNAME",
    ".nojekyll",
    ".gitignore",
    "README.md",
    "DNS_SETUP.md",
    "DEPLOYMENT_CHECKLIST.md",
    "CONTENT_REVIEW_CHECKLIST.md",
    "NOTICE.md",
]

REQUIRED_DIRS = [
    "assets/logo",
    "assets/screenshots",
    "assets/icons",
    "scripts",
]

HTML_PAGES = ["index.html", "product-tour.html", "privacy.html", "accessibility.html", "support.html", "404.html"]
PAGES_REQUIRING_CANONICAL = ["index.html", "product-tour.html", "privacy.html", "accessibility.html", "support.html"]

# Only actual served site files are checked for localhost/private-path leaks.
# Markdown documentation (README.md, DNS_SETUP.md, NOTICE.md, ...) is allowed
# to reference the separate ~/cosmofy project for maintainer context.
SITE_TEXT_EXTS = (".html", ".css", ".js", ".txt", ".xml", ".json", ".webmanifest")
DOC_AND_SITE_EXTS = SITE_TEXT_EXTS + (".md",)

FORBIDDEN_EXTENSIONS = (
    ".apk", ".aab", ".db", ".sqlite", ".sqlite3",
    ".backup", ".jks", ".keystore", ".zip",
)

errors = []


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.h1_count = 0
        self.has_viewport = False
        self.canonical_href = None
        self.links = []
        self.imgs = []
        self._in_title = False
        self._title_parts = []

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        if tag == "title":
            self._in_title = True
        elif tag == "h1":
            self.h1_count += 1
        elif tag == "meta":
            if attrs_dict.get("name", "").lower() == "viewport":
                self.has_viewport = True
        elif tag == "link":
            if attrs_dict.get("rel", "").lower() == "canonical":
                self.canonical_href = attrs_dict.get("href")
        elif tag == "a":
            href = attrs_dict.get("href")
            if href:
                self.links.append(href)
        elif tag == "img":
            self.imgs.append(attrs_dict)

    def handle_endtag(self, tag):
        if tag == "title":
            self._in_title = False

    def handle_data(self, data):
        if self._in_title:
            self._title_parts.append(data)

    @property
    def title_text(self):
        return "".join(self._title_parts).strip()


def relpath(path):
    return os.path.relpath(path, ROOT)


def walk_files(exts=None):
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d != ".git"]
        for name in filenames:
            if exts and not name.lower().endswith(exts):
                continue
            yield os.path.join(dirpath, name)


def check_required_files():
    for rel in REQUIRED_FILES:
        if not os.path.isfile(os.path.join(ROOT, rel)):
            errors.append(f"Missing required file: {rel}")


def check_required_dirs():
    for rel in REQUIRED_DIRS:
        if not os.path.isdir(os.path.join(ROOT, rel)):
            errors.append(f"Missing required directory: {rel}")


def check_forbidden_files():
    for full in walk_files():
        name = os.path.basename(full).lower()
        if name.endswith(FORBIDDEN_EXTENSIONS):
            errors.append(f"Forbidden file type present: {relpath(full)}")
        if name.startswith(".env"):
            errors.append(f"Forbidden environment file present: {relpath(full)}")


def check_cname():
    path = os.path.join(ROOT, "CNAME")
    if os.path.isfile(path):
        with open(path, encoding="utf-8") as fh:
            content = fh.read().strip()
        if content != "cosmofyapp.com":
            errors.append(f"CNAME must contain exactly 'cosmofyapp.com', found: {content!r}")


PRIVATE_PATTERNS = [
    (re.compile(r"localhost"), "localhost reference"),
    (re.compile(r"127\.0\.0\.1"), "loopback IP reference"),
    (re.compile(r"/home/[^/\s\"'<>]+"), "private filesystem path"),
    (re.compile(r"~/cosmofy(?!app)"), "private Android repo path"),
    (re.compile(r"/mnt/c/"), "private filesystem path"),
    (re.compile(r"C:\\Users\\"), "private filesystem path"),
]

SECRET_PATTERN = re.compile(
    r"(?:api[_-]?key|secret|password|private[_-]?key|token)\s*[:=]\s*"
    r"['\"][A-Za-z0-9_\-]{12,}['\"]",
    re.IGNORECASE,
)


def check_no_localhost_or_private_paths():
    for full in walk_files(SITE_TEXT_EXTS):
        try:
            with open(full, encoding="utf-8") as fh:
                content = fh.read()
        except UnicodeDecodeError:
            continue
        rel = relpath(full)
        for pattern, label in PRIVATE_PATTERNS:
            if pattern.search(content):
                errors.append(f"{rel}: possible {label}")


def check_secret_like_literals():
    for full in walk_files(DOC_AND_SITE_EXTS):
        try:
            with open(full, encoding="utf-8") as fh:
                content = fh.read()
        except UnicodeDecodeError:
            continue
        if SECRET_PATTERN.search(content):
            errors.append(f"{relpath(full)}: possible API key / secret / token literal")


def parse_page(rel_path):
    full = os.path.join(ROOT, rel_path)
    with open(full, encoding="utf-8") as fh:
        content = fh.read()
    parser = PageParser()
    parser.feed(content)
    return parser, content


def check_links(rel, links, content):
    for href in links:
        if href.startswith(("http://", "https://", "mailto:", "tel:")):
            continue
        if href.startswith("#"):
            anchor = href[1:]
            if anchor and f'id="{anchor}"' not in content:
                errors.append(f"{rel}: broken same-page anchor link '{href}'")
            continue
        path_part, _, anchor = href.partition("#")
        if not path_part:
            continue
        target = os.path.join(ROOT, path_part)
        if not os.path.isfile(target):
            errors.append(f"{rel}: broken link to '{href}'")
        elif anchor:
            try:
                with open(target, encoding="utf-8") as fh:
                    target_content = fh.read()
            except UnicodeDecodeError:
                continue
            if f'id="{anchor}"' not in target_content:
                errors.append(f"{rel}: broken anchor '{href}'")


def check_pages():
    for rel in HTML_PAGES:
        full = os.path.join(ROOT, rel)
        if not os.path.isfile(full):
            continue
        parser, content = parse_page(rel)

        if not parser.title_text:
            errors.append(f"{rel}: missing <title>")

        if parser.h1_count != 1:
            errors.append(f"{rel}: expected exactly one <h1>, found {parser.h1_count}")

        if not parser.has_viewport:
            errors.append(f"{rel}: missing viewport meta tag")

        if rel in PAGES_REQUIRING_CANONICAL and not parser.canonical_href:
            errors.append(f"{rel}: missing canonical link")

        for img in parser.imgs:
            if "alt" not in img:
                errors.append(f"{rel}: <img> missing alt attribute (src={img.get('src')})")

        check_links(rel, parser.links, content)


def main():
    check_required_files()
    check_required_dirs()
    check_forbidden_files()
    check_cname()
    check_no_localhost_or_private_paths()
    check_secret_like_literals()
    check_pages()

    if errors:
        print(f"FAILED - {len(errors)} issue(s) found:\n")
        for e in errors:
            print(f"  - {e}")
        print()
        return 1

    print("All checks passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
