# Sprint Priority Framework (P1-P4)

**Purpose:** Decide what to write first when you have 75+ pages to ship and finite writing capacity. Stops "let's just start at the top of the list" mistakes that waste 60% of effort on low-leverage pages.

---

## 1. The four priority buckets

| Bucket | What goes here | When to ship |
|--------|---------------|--------------|
| **P1** | Highest opportunity score: homepage + top 2 cities/segments + main service hub + pricing | This sprint (week 1-2) |
| **P2** | Remaining core service surface (other cities/segments, secondary hubs, contact, about) | Sprint 2 (week 3-4) |
| **P3** | Secondary intent + conversion pages (calculators, comparison pages, location index pages, additional service variants) | Sprint 3 (week 5-6) |
| **P4** | Blog / long-tail (how-to, troubleshooting, cost guides, buying guides) | Sprint 4+ (ongoing) |

### Rule

**You do not start P2 until every P1 page passes `lazy-check.py` with a score ≥ 75.** Shipping a half-built P1 is worse than not shipping it — partial pages get indexed, then deindexed when refreshed, hurting domain trust.

---

## 2. Opportunity score formula

```
opportunity_score = volume × (100 - keyword_difficulty) / 100
```

**Inputs (from DataForSEO MCP or any keyword tool):**
- `volume` = monthly search volume for the primary KW (use the highest-volume KW in the cluster).
- `keyword_difficulty` = 0-100 score from your tool.

**Examples:**

| Page | Primary KW | Volume | KD | Score |
|------|-----------|-------:|---:|------:|
| Homepage / brand | brand name | 800 | 5 | 760 |
| Top city repair | `{service} {city_largest}` | 1,900 | 32 | 1,292 |
| Second city repair | `{service} {city_2nd}` | 1,300 | 28 | 936 |
| Service hub | `{service}` (generic) | 4,400 | 58 | 1,848 |
| Pricing page | `{service} cost` | 720 | 22 | 562 |
| Mid-tier city | `{service} {city_5th}` | 480 | 24 | 365 |
| Blog: cost guide | `{service} cost guide` | 320 | 18 | 262 |
| Blog: how-to | `how to {fix problem}` | 1,100 | 12 | 968 |
| Blog: comparison | `{X} vs {Y}` | 540 | 15 | 459 |

### Adjustments

Multiply the raw opportunity score by these modifiers when applicable:

| Modifier | When to apply | Multiplier |
|----------|---------------|------------|
| **High commercial intent** | Pricing pages, "buy" / "hire" / "near me" / "best" pages | ×1.5 |
| **Existing internal traffic** | Any page already ranking page 2-3 in GSC — easy to push to page 1 | ×1.3 |
| **Already has backlinks** | Pages with referring domains from prior content | ×1.25 |
| **AI Overview opportunity** | Query already shows AI Overview but competitors are weak (check via DataForSEO `ai_optimization_llm_response`) | ×1.4 |
| **Pure informational long-tail** | "What is X" / "How does X work" with no commercial intent | ×0.7 |
| **High kd (>60) with no brand authority** | We can't realistically rank for it in 6 months | ×0.5 |

**Sort all pages by adjusted score descending → that's your draft priority order.**

---

## 3. Bucket assignment rules

Once pages are sorted by score, assign buckets:

### P1 — Always includes (regardless of score):

1. **Homepage** — branded queries + sitelinks + canonical hub. Always P1.
2. **Top 2 city/segment landing pages** by adjusted score.
3. **Main service hub** (the broadest "what we do" page). Anchors topical authority.
4. **Pricing page** — highest conversion intent in the funnel.

If the homepage scores low on opportunity but you have a hub that outranks it on volume × intent, you still ship homepage first — it's the brand anchor.

### P2 — Remaining core surface:

- Remaining cities/segments (cities 3-N, segments 3-N).
- Secondary service hubs (sub-services, related services).
- About / team page (E-E-A-T anchor).
- Contact page.
- Free quote / lead form page.

### P3 — Secondary intent + conversion:

- Comparison pages (X vs Y, alternatives to X).
- Calculators / interactive tools.
- Location index page (`/our-locations/`).
- Service index page (`/our-services/`).
- Sub-service pages (`{service}-{variant}/`).
- Local landing × secondary city × service combinations.

### P4 — Blog / long-tail:

- How-to articles.
- Troubleshooting / symptom pages.
- Cost guide articles.
- Buying guide / comparison articles.
- Industry news / commentary.
- Persona-targeted deep guides.

---

## 4. Order within each bucket

Within a bucket, write in this order:

1. **Highest adjusted opportunity score first.**
2. **If two pages tie**, prioritize the one with more internal links pointing to it (it's already mid-build).
3. **If still tied**, prioritize the one that unlocks more dependent pages (e.g., the service hub before its 14 city spokes — you can't link spokes properly until the hub exists).

### Dependency rule

Some pages depend on others existing first:

- **Hub before spokes** — write the service hub before its city pages. Otherwise the city pages link upward to a stub.
- **Pricing before service pages** — service pages reference pricing tables. Get pricing canonical first.
- **About before blog** — blog needs a real author bio page to link to.
- **Locations index before individual city pages** — saves regenerating internal links.

Use a quick DAG / dependency check before locking the bucket order.

---

## 5. Sprint cadence

| Sprint week | Activity | Output |
|-------------|----------|--------|
| Week 1 | Keyword research + clustering + brief creation | `{site}_PAGES.csv` + briefs for P1 pages |
| Week 1-2 | Write all P1 pages from briefs | 5-7 pages drafted |
| Week 2 | Edit + lazy-check + schema verify + ship P1 | P1 live, indexed |
| Week 3-4 | Write + ship P2 | 8-12 pages live |
| Week 5-6 | Write + ship P3 | 6-10 pages live |
| Week 7+ | Blog (P4) — ongoing, 2-4 posts per week | Long-tail surface grows |
| Every 12 weeks | Refresh sprint — update `dateModified`, add 100 words to top performers | Existing pages stay fresh |

### Hard stop rules

- Do not start a new bucket until the previous bucket's pages all have `lazy-check.py` score ≥ 75.
- Do not start writing a page before its brief is complete.
- Do not publish a page without schema verified in Google Rich Results Test.
- Do not skip the author bio render on indexable pages.

---

## 6. Example — a 75-page site

Site: a local-service business with 1 main service, 14 cities, 1 secondary service, 14 cities for that, pricing, contact, free-quote, about, 7 how-to blog posts, 5 cost guides, 4 comparison guides, 6 troubleshooting articles, 5 misc blog posts. Homepage + locations index + services index. = 75 pages.

| Sprint | Bucket | Pages | Count |
|--------|--------|------:|------:|
| 1 | P1 | homepage, main hub, top-2 cities main service, pricing | 5 |
| 2 | P2 | cities 3-14 main service, contact, about, free-quote, services index, locations index | 17 |
| 3 | P3 | secondary service hub + 14 cities, calculators, comparison pages | ~17 |
| 4-6 | P4 | 7 how-to + 5 cost + 4 comparison + 6 troubleshooting + 5 misc | 27 |

**Total:** 66 writable + 9 noindex (thank-you, privacy, terms, sitemap, robots, etc.).

---

## 7. Tracking

For each page, track in `{site}_PAGES.csv`:

```csv
page,priority,volume,kd,opportunity_score,adj_score,status,lazy_score,date_published,date_modified
"/","P1",800,5,760,760,published,87,2026-05-23,2026-05-23
"/{service}-{city_1}/","P1",1900,32,1292,1938,published,82,2026-05-23,2026-05-23
"/{service}-{city_2}/","P1",1300,28,936,1170,draft,—,—,—
```

**`status` values:** `brief` → `draft` → `edited` → `lazy-checked` → `schema-verified` → `published` → `refresh-due` (every 12 weeks).

---

## 8. When to deviate

Some situations override the score-based ordering:

- **Seasonal pages** — pages tied to a season (HVAC AC repair in spring, holiday gift guides in October). Move forward 2 sprints regardless of score.
- **Competitor takedown** — a competitor just lost ranking on a key query. Write that page immediately, even if it's a P3 by score.
- **Active customer demand** — pages tied to a current sales push, paid campaign, or press placement should be P1 regardless of organic score.
- **Manual penalty / deindex recovery** — if a page is deindexed and rewriting will recover trust, treat it as P1 until recovered.

In each case, log the deviation in the page's brief so future planners understand the reasoning.
