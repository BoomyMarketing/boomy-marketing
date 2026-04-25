# Lazy Method — Page QA Checklist (~313 parameters)

**Replaces:** old BMad 277 checklist + Boomy SEO-PAGE-CHECKLIST.md
**Date:** 2026-04-25
**Updated for:** 2026-2027 SEO + AI search (E-E-A-T, GEO, Schema 2026)

> **Iron rule:** every parameter must pass. No 85% threshold. If even one parameter fails, the page does not deploy.

> **Speed Performance is intentionally excluded** — it's handled separately so optimization passes don't risk breaking pages.

> **Subjective photo quality** is excluded — only HTML-level image checks (alt, src, lazy loading).

## How to run

```bash
# First time on a new site:
python lazy-method/lazy-check.py --init --config=mysite/lazy-config.json

# Single page:
python lazy-method/lazy-check.py --config=mysite/lazy-config.json mysite/page.html

# Whole site:
python lazy-method/lazy-check.py --config=mysite/lazy-config.json --site=mysite/

# Specific categories:
python lazy-method/lazy-check.py --config=... --categories=seo,schema,eeat page.html
```

Trigger from Claude: "проверь по lazy method", "lazy check", "audit this page".

---

## 1. SEO Optimization (30 params)

### Content (9)
- [ ] Word count within configured range
- [ ] Exactly one `<h1>`
- [ ] Heading count `h2` within range, `h3` ≥ minimum
- [ ] Heading hierarchy logical (no skipped levels)
- [ ] Internal links ≥ minimum
- [ ] External links ≤ maximum
- [ ] Images ≥ minimum
- [ ] All images have `alt` attribute
- [ ] FAQ section detected

### Technical (7)
- [ ] `<title>` present
- [ ] Title length within range
- [ ] Meta description present
- [ ] Meta description length within range
- [ ] Viewport meta tag with `device-width`
- [ ] Canonical link present, uses `https://`
- [ ] Robots meta does not contain `noindex`

### AI Optimization (5)
- [ ] FAQ section present
- [ ] Question-format `<h3>` headings (count ≥ FAQ minimum)
- [ ] Lists present for snippet capture
- [ ] Structured content (lists or tables)
- [ ] Voice-friendly Q&A headings

### Local SEO (5) — applies if `business.is_local`
- [ ] Configured phone present in page text
- [ ] `tel:` link present
- [ ] Address city mentioned in text
- [ ] LocalBusiness or related schema present
- [ ] Map / directions link present

### User Experience (4)
- [ ] CTA elements ≥ 3
- [ ] Contact / lead form present
- [ ] Navigation `<nav>` present
- [ ] Top-level nav links ≤ 7

---

## 2. Responsive Design (80 params) — Playwright

8 checks × 10 devices (iPhone SE / 12 Pro / Galaxy S21 / 14 Pro Max / iPad Mini / Air / Pro / laptop / desktop HD / 4K):

- [ ] No horizontal overflow
- [ ] `scrollWidth ≤ innerWidth`
- [ ] Body width fits viewport
- [ ] No horizontal scrollbar
- [ ] Tap targets ≥ 44×44 px (mobile only)
- [ ] Body font ≥ 14 px (mobile) / 13 px (desktop)
- [ ] Images fit viewport
- [ ] Forms render usable

---

## 3. Cross-Browser (28 params) — Playwright

7 checks × 4 browsers (Chrome / Firefox / Safari / Edge):

- [ ] Page loads
- [ ] No console errors
- [ ] Layout renders
- [ ] JavaScript runs
- [ ] CSS applied
- [ ] Media queries work
- [ ] Forms render

---

## 4. Visual Design (20 params)

### Layout & Spacing (5)
- [ ] Semantic `<section>` / `<article>` blocks ≥ 4
- [ ] External CSS file linked
- [ ] `max-width` / `.container` constraint exists
- [ ] Flex or grid layout used
- [ ] Few inline `style="width:"` declarations

### Typography (5)
- [ ] Web font referenced (or brand font configured)
- [ ] Configured font present in HTML/CSS
- [ ] Heading size styling declared
- [ ] `line-height` declared
- [ ] Text color rules declared

### Colors & Contrast (4)
- [ ] Primary brand color present in HTML/CSS
- [ ] Secondary brand color present in HTML/CSS
- [ ] `:hover` / `:focus` states declared
- [ ] Body background styled

### Images & Media (3)
- [ ] All `<img>` have `alt`
- [ ] Responsive images (`srcset` / `<picture>` / `loading=lazy`)
- [ ] Lazy loading used

### Interactive (3)
- [ ] CTAs styled with `btn`/`button`/`cta` class
- [ ] Link styling declared
- [ ] Form/input styling declared

---

## 5. Accessibility (15 params)

### Keyboard (4)
- [ ] `<html lang="">` attribute set
- [ ] Skip-to-content link present
- [ ] No critical interactive elements with `tabindex="-1"`
- [ ] `<main>` or `role="main"` landmark present

### Screen Reader (4)
- [ ] All `<img>` have `alt` attribute
- [ ] All form inputs labeled
- [ ] All buttons have accessible names
- [ ] All links have accessible names

### Color & Contrast (3)
- [ ] Color is not the only state indicator
- [ ] `:focus` / `:focus-visible` styles declared
- [ ] `aria-live` region for dynamic form feedback (if applicable)

### Content (4)
- [ ] Heading levels in logical order
- [ ] `<title>` is descriptive (≥ 10 chars)
- [ ] No autoplay video/audio without controls
- [ ] No redundant ARIA roles

---

## 6. Content Quality (15 params)

### Uniqueness & Value (5)
- [ ] Body text not empty
- [ ] Content hash recorded for cross-page deduplication
- [ ] Duplicate sentences within page ≤ threshold
- [ ] Current year (2026 / 2027) referenced (freshness)
- [ ] Lexical diversity ≥ 200 unique meaningful words

### Readability (5)
- [ ] Average sentence length 10–25 words
- [ ] No (or few) sentences > 35 words
- [ ] No paragraphs > max sentence count
- [ ] Lists ≥ 3 for scannability
- [ ] Flesch-Kincaid grade within configured range

### Structure (5)
- [ ] H2 section count within range
- [ ] Hero / intro section detected
- [ ] Services / offerings section detected
- [ ] FAQ section detected
- [ ] Contact section detected
- [ ] Social proof section detected (reviews / testimonials / case studies / clients)

---

## 7. CRO (20 params)

### Above the fold (5)
- [ ] H1 reads as a value proposition (≥ 4 words)
- [ ] Substantive intro section near top
- [ ] Primary CTA element present
- [ ] Phone visible in header (local) OR free trial / demo CTA (non-local)
- [ ] Trust signal phrasing present (rated, certified, guarantee, etc.)

### CTAs (5)
- [ ] CTA count ≥ 5
- [ ] CTA type diversity (≥ 2 of phone / form / booking / purchase / link / email)
- [ ] Action-oriented copy on at least half of CTAs
- [ ] No more than ~25% weak ("learn more", "click here") CTAs
- [ ] Sticky / fixed / floating CTA element

### Forms (5)
- [ ] Form present
- [ ] Form input count ≤ 6 (per form)
- [ ] Submit button present
- [ ] Privacy assurance language near form
- [ ] Form validation attributes (required / pattern / type=email)

### Friction (5)
- [ ] No modal opens on page load
- [ ] `tel:` click-to-call link (local)
- [ ] No login wall blocking content
- [ ] Top-level nav ≤ 7 links
- [ ] Secondary CTA below the fold

---

## 8. Psychology (20 params) — honest only

### Pain → Solve (3)
- [ ] Pain points identified
- [ ] Solutions offered
- [ ] Before / after or outcomes described

### AIDA (4)
- [ ] H1 is attention-grabbing (question / number / length)
- [ ] First paragraph substantive (≥ 25 words)
- [ ] Benefit-focused phrasing
- [ ] Multiple action CTAs

### Social Proof (4)
- [ ] Testimonials / reviews block present
- [ ] Configured rating visible (if rating > 0)
- [ ] Configured review count visible (if > 0)
- [ ] Client logos / featured-in section

### Urgency (3) — must be truthful
- [ ] Urgency / timeliness language present
- [ ] **No forbidden urgency phrases** ("only X spots left", "limited time", "act now", "don't miss out")
- [ ] **No countdown timers / "expires in"**

### Authority (6)
- [ ] Years in business visible (since YYYY / X+ years)
- [ ] Credentials referenced (certified / licensed / accredited)
- [ ] Guarantee or warranty language
- [ ] Named team / founder / leadership block
- [ ] Free guide / consultation / audit offered
- [ ] Specific numbers used (≥ 5 numeric figures)

---

## 9. Data Consistency (15 params) — 100% required

- [ ] Configured phone present on page
- [ ] Phone mentioned multiple times (local pages)
- [ ] No other phone-like sequences not matching configured number
- [ ] Configured email present (or domain email)
- [ ] No third-party emails inconsistent with site domain
- [ ] Founded year matches the years on the page
- [ ] Review count consistent with config
- [ ] Rating consistent with config
- [ ] City from address mentioned (local)
- [ ] Canonical URL uses configured domain
- [ ] OG URL uses configured domain
- [ ] No links to forbidden sibling-brand domains
- [ ] Site name appears on page
- [ ] Currency symbols match configured currency
- [ ] All numeric facts cross-check against config

---

## 10. Conversion Design (10 params)

- [ ] Single focal H1
- [ ] CTAs styled as buttons (≥ 3)
- [ ] Content sectioned with `<section>` / `<article>`
- [ ] Icons (SVG / icon imgs) used for scanning
- [ ] Primary brand color drives visual attention
- [ ] Viewport meta set
- [ ] Mobile tap-target sizing styled
- [ ] `tel:` link for mobile (local)
- [ ] Lazy loading on images
- [ ] Mobile menu pattern (hamburger / nav)

---

## 11. E-E-A-T Signals (15 params) ⭐ NEW 2026

### Experience (4)
- [ ] Author signal (meta name="author" or Person schema)
- [ ] Author bio or byline visible
- [ ] Years in business signaled in copy
- [ ] First-person voice used

### Expertise (4)
- [ ] Subject expertise terms (certified / licensed / expert / specialist)
- [ ] Case studies / portfolio referenced
- [ ] Process / methodology documented
- [ ] External authoritative outbound links (.gov, .edu, Wikipedia, Forbes, etc.)

### Authoritativeness (4)
- [ ] Organization or LocalBusiness schema (or subtype) present
- [ ] Social profile links / `sameAs` in schema
- [ ] Awards / press mentions / featured-in
- [ ] Team / founder / leadership visible

### Trustworthiness (3)
- [ ] HTTPS-only resources (no `http://` references)
- [ ] Privacy / terms / cookie link
- [ ] Trust badges / guarantee language

---

## 12. GEO / AI Citations (15 params) ⭐ NEW 2026

- [ ] `llms.txt` at site root
- [ ] `robots.txt` does not block AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended)
- [ ] Brand mentioned in first 100 words
- [ ] TL;DR / summary / key takeaways block
- [ ] Question-format H2/H3 headings ≥ 3
- [ ] FAQ section present
- [ ] Citable short-answer passages (20–80 words after question headings) ≥ 2
- [ ] Author meta or byline
- [ ] JSON-LD uses `@id` for entities
- [ ] Structured facts (lists ≥ 3 or `<dl>`)
- [ ] Numerical claims ≥ 3
- [ ] Outbound authority links
- [ ] Publish / updated / last-reviewed date visible
- [ ] `og:image` present
- [ ] `twitter:card` meta present

---

## 13. Schema.org 2026 (10 params) ⭐ NEW

- [ ] JSON-LD present
- [ ] All blocks valid (`@type` set)
- [ ] All required schemas from config present (subtypes count, e.g. MarketingAgency satisfies Organization)
- [ ] BreadcrumbList present
- [ ] FAQPage present (recommended)
- [ ] `@context` is schema.org
- [ ] `aggregateRating` if reviews configured
- [ ] Review objects if reviews configured
- [ ] Organization / LocalBusiness with `sameAs`
- [ ] Organization name matches configured site name
- [ ] All JSON-LD blocks parse cleanly

---

## 14. Brand Consistency (10 params) ⭐ NEW

- [ ] Site name appears in page text
- [ ] Site name in `<title>`
- [ ] Primary brand color used (HTML or linked CSS)
- [ ] Secondary brand color used (HTML or linked CSS)
- [ ] Configured font family referenced
- [ ] Logo present (`<img alt="site name">` or `.logo` / `.brand` element)
- [ ] `<html lang="">` matches configured language
- [ ] Canonical domain matches configured domain
- [ ] `og:site_name` matches configured site name
- [ ] No links to forbidden sibling-brand domains

---

## 15. Internal Linking (10 params) ⭐ NEW

- [ ] Internal links ≥ minimum
- [ ] External links ≤ maximum
- [ ] No weak anchors ("click here", "read more", "here", "learn more")
- [ ] Anchor text diversity ≥ 50% unique
- [ ] Contextual links inside `<p>` tags
- [ ] Links to pillar / top-level pages ≥ 2
- [ ] Breadcrumb navigation present
- [ ] Footer legal links ≥ 2 (privacy, terms, cookie)
- [ ] Related / "next step" / "see also" section
- [ ] No broken template placeholders in `href` (`{{...}}`, `${...}`, `undefined`)

---

## What this replaces / adds vs. BMad 277

| Removed from BMad | Why |
|---|---|
| Speed Performance (9 params) | Handled separately to avoid breaking pages with optimization |
| Subjective photo checks (~10) | Cannot be automated reliably; only HTML-level image checks kept |

| New in Lazy Method | Why |
|---|---|
| **E-E-A-T (15)** | Google December 2025 update extended E-E-A-T signals to all competitive queries |
| **GEO / AI Citations (15)** | ChatGPT, Perplexity, AI Overviews now drive ≥ 20% of traffic for many sites |
| **Schema.org 2026 (10)** | Subtype-aware (MarketingAgency satisfies Organization), `@id`-based entity graph |
| **Brand Consistency (10)** | Universal — driven by config, no per-site hardcoding |
| **Internal Linking (10)** | Pillar-cluster strategy + anchor text quality became key in 2026 |

| Adapted | Note |
|---|---|
| Niche-aware via `niche-profiles/{niche}.json` | 7 niches: marketing-agency, saas, ecommerce, restaurant, local-service, professional-service, publisher |
| Universal config (no hardcoded site values) | All brand / phone / rating / colors / domains read from `{site}/lazy-config.json` |
| Interactive setup (`--init`) | Asks user for every required field; never silently uses defaults |

---

## Related files

- Tooling: `/lazy-method/`
- Per-site config: `/{site}/lazy-config.json`
- Niche templates: `/lazy-method/niche-profiles/`
- Claude skill (auto-trigger on "проверь по lazy method"): `/.claude/skills/lazy-method/SKILL.md`
- Design doc: `/docs/plans/2026-04-24-lazy-method-design.md`
- Original source: `C:\Users\petru\Nika Appliance Repair Website\BMAD-277-PARAMETERS-CHECKLIST.md`
