# Lazy Method — Design Doc

**Date:** 2026-04-24
**Status:** Approved by user
**Based on:** BMad 277-Parameters Checklist (Nika Appliance Repair project)
**Goal:** Universal page-quality QA system for any site (Boomy, Lumo, Bambino, Vora, + future sites)

---

## Purpose

Replace per-page manual QA with a deterministic Python-driven check that gates deployment. Every page must pass **100%** of ~313 parameters across 15 categories. No "85% threshold" — every single parameter is a binary pass/fail.

## Non-goals

- **Speed Performance** — handled separately to avoid breaking pages with premature optimization
- **Subjective photo quality** — no "is this a stock photo" checks; only HTML-level (alt, src, lazy-loading)
- **Site-specific hardcoding** — every value that would differ between sites lives in `config.json`

---

## Architecture

```
/c/Boomy Marketing/
├── docs/
│   └── LAZY-METHOD-CHECKLIST.md    # human-readable master checklist (~313 params)
│
├── lazy-method/
│   ├── config-template.json         # blank config with all fields
│   ├── lazy-check.py                # master runner (CLI entry)
│   ├── interactive_setup.py         # --init mode: asks user for missing fields
│   │
│   ├── checkers/
│   │   ├── __init__.py
│   │   ├── seo_checker.py           # 30 params
│   │   ├── responsive_checker.py    # 80 params (10 devices × 8 checks, via Playwright)
│   │   ├── cross_browser_checker.py # 28 params (4 browsers × 7 tests)
│   │   ├── visual_checker.py        # 20 params (CSS hierarchy, overflow, contrast)
│   │   ├── accessibility_checker.py # 15 params (axe-core)
│   │   ├── content_checker.py       # 15 params (readability, uniqueness hash)
│   │   ├── cro_checker.py           # 20 params
│   │   ├── psychology_checker.py    # 20 params (no fake urgency)
│   │   ├── data_consistency.py     # 15 params (phone/NAP/year everywhere)
│   │   ├── conversion_design.py    # 10 params
│   │   ├── eeat_checker.py          # 15 params ⭐ NEW 2026
│   │   ├── geo_ai_checker.py        # 15 params ⭐ NEW 2026
│   │   ├── schema_checker.py        # 10 params ⭐ NEW 2026
│   │   ├── brand_consistency.py    # 10 params ⭐ NEW (from config)
│   │   └── internal_linking.py     # 10 params ⭐ NEW
│   │
│   └── reports/
│       └── YYYY-MM-DD-HHMM.json    # per-run results
│
└── {boomy,lumo,bambino,vora}/
    └── lazy-config.json             # per-site config
```

---

## Config schema

`lazy-config.json` is the ONE file that makes Lazy Method universal. Adding a new site = creating a new config.

```json
{
  "site": {
    "name": "Boomy Marketing",
    "domain": "boomymarketing.com",
    "language": "en-US",
    "country": "CA",
    "currency": "CAD"
  },
  "brand": {
    "primary_color": "#D2085C",
    "secondary_color": "#13023E",
    "logo_path": "/assets/logo.svg",
    "font_family": "Inter"
  },
  "contact": {
    "phone": "+1-416-555-0100",
    "email": "hello@boomymarketing.com",
    "address": "Toronto, ON, Canada"
  },
  "business": {
    "founded_year": 2023,
    "review_count": 127,
    "rating": 4.9,
    "type": "MarketingAgency"
  },
  "thresholds": {
    "word_count": [800, 3000],
    "title_length": [40, 60],
    "meta_desc_length": [140, 160],
    "h2_count": [5, 12],
    "internal_links_min": 5,
    "reading_level": [8, 10],
    "faq_count_min": 3
  },
  "rules": {
    "no_cross_link_domains": ["lumoaiagency.com", "bambinoagency.com", "aivopa.com"],
    "required_mentions": ["${site.name}"],
    "required_schemas": ["LocalBusiness", "Organization", "BreadcrumbList"]
  }
}
```

---

## Interactive setup mode

Critical UX requirement: **the script must never silently use defaults for business-critical data** (phone, years, rating). If a field is missing or null when running on a new site, the master runner halts and prompts the user.

```bash
python lazy-method/lazy-check.py --init --config=newsite/lazy-config.json
```

Example session:

```
Lazy Method — Initial Setup for newsite/
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Site name: Acme Marketing
Domain (no https://): acme.com
Language (en-US | en-GB | en-CA | ...): en-US
Country (ISO 2-letter): US

Contact phone (format: +1-XXX-XXX-XXXX): +1-555-0100
Contact email: hi@acme.com
Business address (City, State, Country): New York, NY, USA

Founded year: 2020
Review count (integer, or 0 if not public): 42
Rating 1.0–5.0 (or 0 if not public): 4.8

Primary brand color (hex): #FF6B00
Secondary brand color (hex): #0A0A0A

Configuration saved to newsite/lazy-config.json
Run: python lazy-method/lazy-check.py --config=newsite/lazy-config.json newsite/about.html
```

If any required config field is missing on a regular (non-init) run, the runner exits with a helpful error:

```
ERROR: Missing required config field `contact.phone`
Run with --init to set up interactively, or edit lazy-config.json manually.
```

---

## 15 categories (~313 params)

| # | Category | Params | Source |
|---|---|---|---|
| 1 | SEO Optimization | 30 | BMad |
| 2 | Responsive Design | 80 | BMad |
| 3 | Cross-Browser | 28 | BMad |
| 4 | Visual Design (no photo-subjective) | 20 | BMad (trimmed) |
| 5 | Accessibility | 15 | BMad |
| 6 | Content Quality | 15 | BMad |
| 7 | CRO | 20 | BMad |
| 8 | Psychology | 20 | BMad (trimmed) |
| 9 | Data Consistency | 15 | BMad |
| 10 | Conversion Design | 10 | BMad |
| 11 | **E-E-A-T signals** | 15 | NEW |
| 12 | **GEO / AI Citations** | 15 | NEW |
| 13 | **Schema.org 2026** | 10 | NEW |
| 14 | **Brand Consistency** | 10 | NEW (from config) |
| 15 | **Internal Linking** | 10 | NEW |
| | **TOTAL** | **~313** | |

Removed from BMad: Speed Performance (9 params — separate), ~10 subjective photo checks.
Added for 2026–2027: +60 params across 5 new categories.

---

## Pass/Fail model

**Hard 100% pass required on every parameter.**

Each checker returns:

```python
{
  "category": "seo",
  "total": 30,
  "passed": 29,
  "failed": [
    {
      "param": "h1_unique",
      "severity": "critical",
      "details": "Found 2 <h1> tags, expected exactly 1",
      "location": "line 42"
    }
  ]
}
```

Master runner exits `1` if any `failed[]` is non-empty. GitHub Action blocks merge.

## Manual-only parameters

Where a parameter cannot be automated losslessly, we use an **automated equivalent** (not "proxy"):

| Original (subjective) | Automated equivalent |
|---|---|
| "Content is unique" | SHA1 of normalized text + check against other pages, max 3 duplicate sentences |
| "Reading level Grade 8–10" | Flesch-Kincaid formula |
| "Visual hierarchy clear" | Computed styles: `font-size(H1) > H2 > H3 > p` AND ≥ 1.2× ratio |
| "Navigation simple" | Count of top-level `<nav>` links ≤ 7 |
| "Hero value proposition" | H1 contains at least one word from `thresholds.required_mentions` |

No internet / no external API — all checks run locally via `beautifulsoup4`, `playwright`, `axe-core-python`, `textstat`.

---

## CLI workflow

```bash
# First time on a new site — interactive setup
python lazy-method/lazy-check.py --init --config=newsite/lazy-config.json

# Check one page
python lazy-method/lazy-check.py --config=boomy/lazy-config.json boomy/about.html

# Check whole site
python lazy-method/lazy-check.py --config=boomy/lazy-config.json --site=boomy/

# Only run specific categories
python lazy-method/lazy-check.py --categories=seo,schema,data_consistency \
  --config=boomy/lazy-config.json boomy/about.html

# CI — non-zero exit code blocks merge
python lazy-method/lazy-check.py --config=boomy/lazy-config.json --site=boomy/ --ci
```

Output format:

```
🔴 FAIL: boomy/local/toronto/seo-agency.html
  ✅ SEO Optimization: 30/30
  ✅ Responsive Design: 80/80
  ✅ Cross-Browser: 28/28
  ✅ Visual Design: 20/20
  ✅ Accessibility: 15/15
  ✅ Content Quality: 15/15
  ✅ CRO: 20/20
  ✅ Psychology: 20/20
  ✅ Data Consistency: 15/15
  ✅ Conversion Design: 10/10
  ❌ E-E-A-T: 14/15
      • author_present: no <meta name="author"> or Person schema
  ✅ GEO / AI Citations: 15/15
  ✅ Schema.org 2026: 10/10
  ✅ Brand Consistency: 10/10
  ✅ Internal Linking: 10/10

  TOTAL: 312/313 — PAGE FAILED (1 issue)
```

---

## Implementation phases

**Phase 1 — Foundation** (this PR)
1. Folder structure
2. `config-template.json` + interactive setup
3. `lazy-check.py` master runner
4. 5 foundation checkers: SEO, Schema, Data Consistency, E-E-A-T, Brand Consistency
5. `boomy/lazy-config.json` populated with real data

**Phase 2 — Remaining checkers**
6. Content, CRO, Psychology, Conversion Design, Internal Linking, GEO
7. Visual Design, Accessibility (requires `axe-core-python`)
8. Responsive, Cross-Browser (requires Playwright)

**Phase 3 — Docs + CI**
9. `docs/LAZY-METHOD-CHECKLIST.md` — human-readable
10. GitHub Action workflow

**Phase 4 — Rollout**
11. Run on all 4 sites, fix fails
12. Configure for new sites as needed

---

## Dependencies

```
beautifulsoup4>=4.12
lxml>=5.0
textstat>=0.7
playwright>=1.40       # Phase 2
axe-core-python>=0.1   # Phase 2
```

All pure-Python + one Chromium for Playwright. No external APIs.
