#!/usr/bin/env python3
"""Audit generated Zubware HTML for canonical and indexing consistency.

Run after npm run build: python3 scripts/audit_generated_seo.py
No network calls, credentials, paid APIs, or content rewriting.
"""
from __future__ import annotations

import json
import re
from collections import defaultdict
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
ORIGIN = "https://www.zubware.com"


class HeadParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.canonicals = []
        self.robots = []
        self.titles = []
        self.h1_count = 0
        self._title = False

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "link" and "canonical" in a.get("rel", "").lower().split():
            self.canonicals.append(a.get("href", ""))
        if tag == "meta" and a.get("name", "").lower() == "robots":
            self.robots.append(a.get("content", ""))
        if tag == "title":
            self._title = True
        if tag == "h1":
            self.h1_count += 1

    def handle_endtag(self, tag):
        if tag == "title":
            self._title = False

    def handle_data(self, data):
        if self._title:
            self.titles.append(data)


def route_for_file(p):
    rel = p.relative_to(DIST).as_posix()
    if rel == "index.html":
        return "/"
    if rel.endswith("/index.html"):
        return "/" + rel[:-11]
    if rel.endswith(".html"):
        return "/" + rel[:-5]
    return "/" + rel


def main():
    if not DIST.is_dir():
        raise SystemExit("Missing dist/; run npm run build first")
    findings = []
    by_route = defaultdict(list)
    pages = sorted(DIST.rglob("*.html"))
    headers = (DIST / "_headers").read_text(encoding="utf-8") if (DIST / "_headers").exists() else ""
    if "/qa/*" not in headers or "X-Robots-Tag: noindex" not in headers:
        findings.append({"file": "_headers", "issue": "missing_qa_noindex_header"})
    for p in pages:
        route = route_for_file(p)
        by_route[route].append(p.relative_to(DIST).as_posix())
        parser = HeadParser()
        parser.feed(p.read_text(encoding="utf-8", errors="replace"))
        # 404 and internal QA pages intentionally need no canonical URL.
        exempt = route == "/404" or route.startswith("/qa/")
        if not exempt and len(parser.canonicals) != 1:
            findings.append({"file": str(p.relative_to(DIST)), "issue": "canonical_count", "value": len(parser.canonicals)})
        for url in parser.canonicals:
            parsed = urlparse(url)
            if parsed.scheme != "https" or parsed.netloc != urlparse(ORIGIN).netloc:
                findings.append({"file": str(p.relative_to(DIST)), "issue": "canonical_origin", "value": url})
            if parsed.query or parsed.fragment:
                findings.append({"file": str(p.relative_to(DIST)), "issue": "canonical_query_or_fragment", "value": url})
        if not "".join(parser.titles).strip():
            findings.append({"file": str(p.relative_to(DIST)), "issue": "missing_title"})
        if parser.h1_count != 1:
            findings.append({"file": str(p.relative_to(DIST)), "issue": "h1_count", "value": parser.h1_count})
        # Internal QA indexability is enforced by Cloudflare _headers.
    duplicates = {route: files for route, files in by_route.items() if len(files) > 1}
    result = {
        "pages_checked": len(pages),
        "distinct_routes": len(by_route),
        "duplicate_route_outputs": duplicates,
        "findings": findings,
        "note": "Duplicate generated files do not prove duplicate indexed URLs; check server redirects and live canonical headers.",
    }
    output = ROOT / "reports" / "generated-seo-audit.json"
    output.parent.mkdir(exist_ok=True)
    output.write_text(json.dumps(result, indent=2), encoding="utf-8")
    print(f"Checked {len(pages)} HTML files, {len(by_route)} routes; {len(duplicates)} duplicate route outputs; {len(findings)} findings.")
    print(f"Report: {output.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
