#!/usr/bin/env python3
"""
update_local_pages.py — Batch modernization of all 258 local pages.

Fixes applied to each page:
1. Sidebar bare <li> bug  →  wrap in <ul class="feature-list">
2. Intro heading title-case  ("google ads agency" → "Google Ads Agency")
3. FAQ answers: add faq-answer-inner wrapper div for proper padding
4. Schema dateModified  →  2026-04-14
5. Schema servedArea (single city)  →  areaServed (array of nearby cities)

Idempotent: already-fixed pages are detected and left untouched.

Usage:
    python scripts/update_local_pages.py
    python scripts/update_local_pages.py --dry-run
"""

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).parent.parent
LOCAL_DIR = ROOT / "local"
DATE_MODIFIED = "2026-04-14"
DRY_RUN = "--dry-run" in sys.argv

# ---------------------------------------------------------------------------
# Title-case helpers
# ---------------------------------------------------------------------------
ACRONYM_MAP = {
    "seo": "SEO",
    "ai": "AI",
    "saas": "SaaS",
    "ppc": "PPC",
    "crm": "CRM",
    "erp": "ERP",
    "api": "API",
    "ui": "UI",
    "ux": "UX",
    "gdpr": "GDPR",
    "b2b": "B2B",
    "b2c": "B2C",
    "sdr": "SDR",
}
SMALL_WORDS = {"in", "of", "the", "a", "an", "and", "or", "but", "for",
               "with", "at", "by", "to", "from", "on"}


def smart_title(text: str) -> str:
    """Title-case with acronym awareness and small-word suppression."""
    words = text.split()
    result = []
    for i, w in enumerate(words):
        wl = w.lower()
        if wl in ACRONYM_MAP:
            result.append(ACRONYM_MAP[wl])
        elif i > 0 and wl in SMALL_WORDS:
            result.append(wl)
        else:
            result.append(w[0].upper() + w[1:] if w else w)
    return " ".join(result)


# ---------------------------------------------------------------------------
# areaServed city arrays  (city slug → nearby cities)
# ---------------------------------------------------------------------------
CITY_AREAS: dict[str, list[str]] = {
    "toronto":         ["Toronto", "North York", "Scarborough", "Etobicoke",
                        "Mississauga", "Brampton", "Markham", "Richmond Hill"],
    "vancouver":       ["Vancouver", "Burnaby", "Surrey", "Richmond",
                        "North Vancouver", "Coquitlam", "New Westminster", "Langley"],
    "calgary":         ["Calgary", "Airdrie", "Cochrane", "Okotoks", "Chestermere"],
    "edmonton":        ["Edmonton", "St. Albert", "Sherwood Park", "Spruce Grove", "Leduc"],
    "ottawa":          ["Ottawa", "Gatineau", "Kanata", "Orléans", "Barrhaven"],
    "hamilton":        ["Hamilton", "Burlington", "Oakville", "Stoney Creek", "Ancaster"],
    "brampton":        ["Brampton", "Mississauga", "Caledon", "Georgetown"],
    "mississauga":     ["Mississauga", "Brampton", "Oakville", "Toronto"],
    "burnaby":         ["Burnaby", "Vancouver", "New Westminster", "Coquitlam", "Port Moody"],
    "surrey":          ["Surrey", "Delta", "Langley", "White Rock", "Abbotsford"],
    "richmond":        ["Richmond", "Vancouver", "Delta", "Burnaby", "New Westminster"],
    "coquitlam":       ["Coquitlam", "Port Coquitlam", "Port Moody", "Burnaby"],
    "abbotsford":      ["Abbotsford", "Mission", "Chilliwack", "Langley", "Surrey"],
    "barrie":          ["Barrie", "Innisfil", "Collingwood", "Orillia", "Bradford"],
    "burlington":      ["Burlington", "Oakville", "Hamilton", "Mississauga"],
    "halifax":         ["Halifax", "Dartmouth", "Bedford", "Sackville"],
    "charlottetown":   ["Charlottetown", "Summerside", "Stratford", "Cornwall"],
    "north-vancouver": ["North Vancouver", "West Vancouver", "Burnaby", "Vancouver"],
    "kelowna":         ["Kelowna", "West Kelowna", "Penticton", "Vernon"],
    "victoria":        ["Victoria", "Saanich", "Langford", "Oak Bay"],
    "london":          ["London", "Woodstock", "St. Thomas", "Stratford"],
    "windsor":         ["Windsor", "Tecumseh", "LaSalle", "Essex"],
    "kingston":        ["Kingston", "Napanee", "Gananoque", "Belleville"],
    "waterloo":        ["Waterloo", "Kitchener", "Cambridge", "Guelph"],
    "kitchener":       ["Kitchener", "Waterloo", "Cambridge", "Guelph"],
    "guelph":          ["Guelph", "Kitchener", "Cambridge", "Waterloo"],
    "cambridge":       ["Cambridge", "Kitchener", "Waterloo", "Guelph"],
    "st-catharines":   ["St. Catharines", "Niagara Falls", "Welland", "Thorold"],
    "oshawa":          ["Oshawa", "Whitby", "Ajax", "Pickering", "Clarington"],
    "ajax":            ["Ajax", "Pickering", "Whitby", "Oshawa"],
    "whitby":          ["Whitby", "Oshawa", "Ajax", "Pickering"],
    "pickering":       ["Pickering", "Ajax", "Whitby", "Oshawa"],
    "markham":         ["Markham", "Richmond Hill", "Vaughan", "Newmarket"],
    "vaughan":         ["Vaughan", "Richmond Hill", "Markham", "Brampton"],
    "richmond-hill":   ["Richmond Hill", "Markham", "Vaughan", "Aurora", "Newmarket"],
    "newmarket":       ["Newmarket", "Aurora", "Richmond Hill", "Barrie"],
    "oakville":        ["Oakville", "Burlington", "Mississauga", "Hamilton"],
    "langley":         ["Langley", "Surrey", "Abbotsford", "Maple Ridge"],
    "new-westminster": ["New Westminster", "Burnaby", "Coquitlam", "Surrey"],
    "maple-ridge":     ["Maple Ridge", "Langley", "Coquitlam", "Pitt Meadows"],
    "chilliwack":      ["Chilliwack", "Abbotsford", "Hope", "Langley"],
    "nanaimo":         ["Nanaimo", "Ladysmith", "Parksville", "Courtenay"],
    "prince-george":   ["Prince George", "Quesnel", "Williams Lake"],
    "kamloops":        ["Kamloops", "Merritt", "Salmon Arm"],
    "red-deer":        ["Red Deer", "Blackfalds", "Lacombe", "Innisfail"],
    "lethbridge":      ["Lethbridge", "Taber", "Medicine Hat"],
    "st-john-s":       ["St. John's", "Mount Pearl", "Conception Bay South"],
    "moncton":         ["Moncton", "Dieppe", "Riverview"],
    "fredericton":     ["Fredericton", "Oromocto", "Minto"],
    "saint-john":      ["Saint John", "Quispamsis", "Rothesay"],
    "saskatoon":       ["Saskatoon", "Martensville", "Warman"],
    "regina":          ["Regina", "Moose Jaw", "White City"],
    "winnipeg":        ["Winnipeg", "Steinbach", "Portage la Prairie"],
    "thunder-bay":     ["Thunder Bay", "Kenora", "Dryden"],
    "sudbury":         ["Sudbury", "Espanola", "Elliot Lake"],
    "sault-ste-marie": ["Sault Ste. Marie", "Sudbury", "North Bay"],
    "north-bay":       ["North Bay", "Sudbury", "Huntsville"],
    "peterborough":    ["Peterborough", "Kawartha Lakes", "Belleville"],
}


def get_area_served(city_slug: str) -> list[dict]:
    cities = CITY_AREAS.get(city_slug, [city_slug.replace("-", " ").title()])
    return [{"@type": "City", "name": c} for c in cities]


# ---------------------------------------------------------------------------
# Fix 1: Sidebar bare <li> → <ul class="feature-list">
# ---------------------------------------------------------------------------
_RE_ASIDE = re.compile(
    r'(<aside\s+class="intro-aside[^"]*"[^>]*>)(.*?)(</aside>)',
    re.DOTALL
)
_RE_LI_BLOCK = re.compile(r'((?:\s*<li>[^<]*</li>)+)', re.DOTALL)


def fix_sidebar(html: str) -> str:
    def _fix_aside(m: re.Match) -> str:
        prefix, content, suffix = m.group(1), m.group(2), m.group(3)
        if "<li>" in content and "<ul" not in content:
            content = _RE_LI_BLOCK.sub(
                lambda m2: (
                    "\n                <ul class=\"feature-list\">"
                    + m2.group(1)
                    + "\n                </ul>"
                ),
                content,
            )
        return prefix + content + suffix

    return _RE_ASIDE.sub(_fix_aside, html)


# ---------------------------------------------------------------------------
# Fix 2: Intro heading title-case
# ---------------------------------------------------------------------------
_RE_INTRO_H2 = re.compile(r'<h2 id="intro-heading">([^<]+)</h2>')


def fix_intro_heading(html: str) -> str:
    def _fix(m: re.Match) -> str:
        return f'<h2 id="intro-heading">{smart_title(m.group(1))}</h2>'
    return _RE_INTRO_H2.sub(_fix, html)


# ---------------------------------------------------------------------------
# Fix 3: FAQ answers — add faq-answer-inner wrapper where missing
# ---------------------------------------------------------------------------
_RE_FAQ_ANSWER = re.compile(
    r'(<div class="faq-answer"[^>]*>)\s*((?:<p>.*?</p>\s*)+)(</div>)',
    re.DOTALL
)


def fix_faq_answer_inner(html: str) -> str:
    def _wrap(m: re.Match) -> str:
        open_tag = m.group(1)
        content   = m.group(2).strip()
        close_tag = m.group(3)
        return (
            f'{open_tag}\n'
            f'      <div class="faq-answer-inner">{content}</div>\n'
            f'    {close_tag}'
        )
    return _RE_FAQ_ANSWER.sub(_wrap, html)


# ---------------------------------------------------------------------------
# Fix 4+5: Schema — dateModified & servedArea → areaServed
# ---------------------------------------------------------------------------
_RE_SCHEMA = re.compile(
    r'<script type="application/ld\+json">\s*(.*?)\s*</script>',
    re.DOTALL
)


def fix_schema(html: str, city_slug: str) -> str:
    def _fix_block(m: re.Match) -> str:
        raw = m.group(1).strip()
        try:
            data = json.loads(raw)
        except json.JSONDecodeError:
            return m.group(0)

        # Only process LocalBusiness / MarketingAgency schema
        types = data.get("@type", [])
        if isinstance(types, str):
            types = [types]
        if "LocalBusiness" not in types and "MarketingAgency" not in types:
            return m.group(0)

        changed = False

        # dateModified
        if data.get("dateModified") != DATE_MODIFIED:
            data["dateModified"] = DATE_MODIFIED
            changed = True

        # servedArea → areaServed
        area = data.get("areaServed")
        served = data.get("servedArea")
        if served is not None:
            # Old key — replace
            data["areaServed"] = get_area_served(city_slug)
            del data["servedArea"]
            changed = True
        elif area is None:
            data["areaServed"] = get_area_served(city_slug)
            changed = True
        elif isinstance(area, dict):
            # Single city object — convert to array
            data["areaServed"] = get_area_served(city_slug)
            changed = True
        # elif isinstance(area, list) → already an array, leave as-is

        if not changed:
            return m.group(0)

        serialized = json.dumps(data, ensure_ascii=False)
        return f'<script type="application/ld+json">\n{serialized}\n    </script>'

    return _RE_SCHEMA.sub(_fix_block, html)


# ---------------------------------------------------------------------------
# Process one file
# ---------------------------------------------------------------------------
def process_file(filepath: Path, city_slug: str) -> bool:
    """Apply all fixes. Returns True if file was modified."""
    original = filepath.read_text(encoding="utf-8")

    html = original
    html = fix_sidebar(html)
    html = fix_intro_heading(html)
    html = fix_faq_answer_inner(html)
    html = fix_schema(html, city_slug)

    if html == original:
        return False

    if not DRY_RUN:
        filepath.write_text(html, encoding="utf-8")
    return True


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main() -> None:
    if DRY_RUN:
        print("DRY RUN — no files will be written\n")

    modified = 0
    unchanged = 0
    error_log: list[tuple[str, str]] = []

    for city_dir in sorted(LOCAL_DIR.iterdir()):
        if not city_dir.is_dir():
            continue
        city_slug = city_dir.name.lower()

        for service_dir in sorted(city_dir.iterdir()):
            if not service_dir.is_dir():
                continue

            index_file = service_dir / "index.html"
            if not index_file.exists():
                continue

            label = f"{city_slug}/{service_dir.name}"
            try:
                changed = process_file(index_file, city_slug)
                if changed:
                    modified += 1
                    print(f"  OK {label}")
                else:
                    unchanged += 1
            except Exception as exc:
                error_log.append((label, str(exc)))
                print(f"  ERR {label}:  {exc}")

    print(f"\n{'='*52}")
    mode = " (dry run)" if DRY_RUN else ""
    print(f"Modified{mode}:  {modified}")
    print(f"Unchanged:     {unchanged}")
    print(f"Errors:        {len(error_log)}")

    if error_log:
        print("\nFailed pages:")
        for label, err in error_log:
            print(f"  {label}: {err}")


if __name__ == "__main__":
    main()
