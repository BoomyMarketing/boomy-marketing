# SEO Project Workflow — Phases 0–10 (COMPLETE)
> Робочий SOP для запуску нового SEO-проєкту. Заповнюється разом із Claude покроково.
> Версія: 2.0 | Оновлено: 2026-04 | Статус: ПОВНИЙ ДОКУМЕНТ

---

## PROJECT CARD
> Заповни перед початком роботи

| Поле | Значення |
|---|---|
| **Клієнт / Проєкт** | |
| **Домен** | |
| **Дата старту** | |
| **SEO-спеціаліст** | |
| **Тип бізнесу** | B2B / B2C / SaaS / eCommerce / Local / Publisher |
| **Географія** | |
| **Мова сайту** | |
| **CMS / Платформа** | WordPress / Webflow / Shopify / Static / інше |
| **Бюджет/міс** | |
| **Цілі проєкту** | |
| **Дедлайн першого звіту** | |

---

## ДОСТУПИ — ЧЕКЛИСТ

> Зібрати до початку аудиту

- [ ] Google Search Console (owner або full access)
- [ ] Google Analytics 4 (editor або viewer)
- [ ] Google Business Profile (якщо local)
- [ ] CMS / адмін-панель сайту
- [ ] Хостинг / CDN (Vercel, Cloudflare, Netlify тощо)
- [ ] Ahrefs / Semrush (додати домен у проєкт)
- [ ] Rank tracker (налаштувати keywords)
- [ ] Доступ до коду або репозиторію (GitHub/GitLab)
- [ ] Рекламні кабінети (Google Ads, Meta) — для розуміння BoFU

---

---

# PHASE 0 — ONBOARDING & DISCOVERY

> **Мета:** Зрозуміти бізнес, зафіксувати поточний стан, визначити конкурентів і KPI.
> **Час:** 4–8 годин | **Дедлайн:** День 1–3 проєкту
> **Результат:** Заповнений Project Card, Baseline Snapshot, Competitor List

---

## 0.1 — Business Intelligence

**Що робимо:** Розуміємо бізнес зсередини — модель, клієнти, конкуренти очима клієнта.

- [ ] **Провести kick-off дзвінок** (≥ 60 хв) — записати або законспектувати
  - Які продукти/послуги приносять найбільший revenue?
  - Хто ICP (Ideal Customer Profile)? Вік, посада, болі, де шукають?
  - Які географії пріоритетні?
  - Були провали або успіхи в SEO раніше? Що відомо?
  - Які keywords клієнт вважає найважливішими?
  - Чи є контент-команда або все аутсорс?

- [ ] **Зафіксувати бізнес-модель:**
  ```
  Тип: [B2B / B2C / SaaS / Local / eCommerce]
  Revenue model: [subscription / one-time / lead-gen / ads]
  Середній чек / LTV:
  Sales cycle:
  ```

- [ ] **Сформулювати SEO-цілі у SMART-форматі:**
  ```
  Ціль 1: Збільшити organic leads з X до Y до [дата]
  Ціль 2: Вийти в топ-5 по [keyword] до [дата]
  Ціль 3:
  ```

- [ ] **Визначити KPI:**

  | KPI | Поточно | Ціль | Термін |
  |---|---|---|---|
  | Organic sessions/міс | | | |
  | Organic leads/міс | | | |
  | Avg. position (top keywords) | | | |
  | Referring domains | | | |
  | Organic revenue share | | | |

---

## 0.2 — Baseline Metrics Snapshot

**Що робимо:** Фіксуємо стартову точку — всі цифри "до". Це основа для майбутніх звітів.

### GSC (Google Search Console)

- [ ] Відкрити GSC → Performance → Last 12 months
- [ ] Зафіксувати:
  ```
  Total Clicks (12 міс):
  Total Impressions (12 міс):
  Avg CTR:
  Avg Position:
  ```

- [ ] Відкрити GSC → Performance → Top Queries (Top 20)
  - Зафіксувати топ-20 запитів у таблицю: keyword / clicks / impressions / CTR / position
  - Занести у Baseline Spreadsheet

- [ ] Відкрити GSC → Coverage
  ```
  Valid pages:
  Valid with warnings:
  Excluded:
  Errors:
  ```

- [ ] Перевірити GSC → Manual Actions → чи є manual penalties?
  ```
  Manual Actions: [None / є — вказати які]
  ```

- [ ] Перевірити GSC → Security Issues
  ```
  Security Issues: [None / є]
  ```

### GA4

- [ ] Відкрити GA4 → Reports → Acquisition → Traffic Acquisition
  - Organic Search sessions за останні 3/6/12 міс:
  ```
  Органіка (3 міс):
  Органіка (12 міс):
  Частка органіки від загального трафіку: %
  ```

- [ ] Перевірити чи налаштовані Conversions у GA4:
  ```
  Conversions налаштовані: [Yes / No]
  Які conversion events:
  Organic-attributed conversions/міс:
  ```

### Ahrefs / Semrush

- [ ] Зафіксувати Domain Rating / Authority:
  ```
  DR (Ahrefs):
  DA (Moz):
  Referring domains:
  Organic keywords (approx):
  Estimated organic traffic:
  ```

- [ ] Зберегти скріншот Overview сторінки (для майбутніх порівнянь)

> ✅ **Результат 0.2:** Baseline Metrics Spreadsheet заповнений. Всі цифри зафіксовані з датою.

---

## 0.3 — Competitor Intelligence

**Що робимо:** Знаходимо SERP-конкурентів (не завжди = бізнес-конкуренти!) та аналізуємо їх.

- [ ] **Визначити SERP-конкурентів:**
  - Метод 1: Ahrefs → Competing Domains (або Semrush → Organic Research → Competitors)
  - Метод 2: Вручну — загуглити 5 основних keywords, хто стабільно в топ?
  - Вибрати 5 прямих конкурентів + 2–3 aspirational (лідери ніші)

  ```
  Прямі конкуренти:
  1.
  2.
  3.
  4.
  5.

  Aspirational (лідери):
  1.
  2.
  ```

- [ ] **Для кожного конкурента зняти:**

  | Конкурент | DR | Ref. Domains | Est. Traffic | Top Page |
  |---|---|---|---|---|
  | | | | | |
  | | | | | |
  | | | | | |

- [ ] **Keyword Gap аналіз** (Ahrefs → Content Gap або Semrush → Keyword Gap):
  - Які keywords ранжуються у конкурентів, але НЕ у клієнта?
  - Зафіксувати топ-30 gap keywords → додати до keyword research (Phase 3)

- [ ] **Контент аналіз конкурентів:**
  - Які формати контенту домінують? (articles / tools / calculators / videos)
  - Яка середня довжина статей у топ?
  - Чи є у них авторські профілі (E-E-A-T сигнали)?
  - Чи використовують schema / rich results?

- [ ] **Backlink аналіз конкурентів:**
  - Ahrefs → Backlinks → New / Lost (за останні 3 міс)
  - Які типи посилань вони отримують? (press / directories / guest posts / edu)
  - Є спільні referring domains де можна також отримати посилання?

> ✅ **Результат 0.3:** Competitor Intelligence таблиця. Список gap keywords для Phase 3.

---

---

# PHASE 1 — TECHNICAL SEO AUDIT

> **Мета:** Виявити всі технічні проблеми, що блокують індексацію або знижують rankings.
> **Час:** 8–16 годин | **Дедлайн:** День 3–7 проєкту
> **Результат:** Technical Audit Report з пріоритизованим списком правок

---

## 1.1 — Crawl & Indexability

**Що робимо:** Перевіряємо, чи Google може знайти, відвідати та проіндексувати всі важливі сторінки.

### robots.txt

- [ ] Відкрити: `https://domain.com/robots.txt`
- [ ] Перевірити синтаксис (User-agent → Allow/Disallow → Sitemap)
- [ ] Чи вказаний Sitemap URL в кінці?
- [ ] Чи не заблоковані важливі розділи (Disallow: / = все заблоковано!)?
- [ ] Чи не заблоковані JS/CSS файли (потрібні для рендерингу)?
- [ ] Чи прописані AI-crawlers?

  ```
  Sitemap вказаний: [Yes / No]
  Критичні Disallow: [немає / є — вказати]
  Проблеми з AI-crawlers: [немає / є]
  ```

  **AI crawlers — мінімальний set (2026):**
  ```
  User-agent: GPTBot
  Allow: /

  User-agent: OAI-SearchBot
  Allow: /

  User-agent: ClaudeBot
  Allow: /

  User-agent: Google-Extended
  Allow: /

  User-agent: PerplexityBot
  Allow: /

  User-agent: anthropic-ai
  Allow: /

  User-agent: Applebot-Extended
  Allow: /
  ```

### Sitemap

- [ ] Відкрити: `https://domain.com/sitemap.xml`
- [ ] Перевірити формат (XML, namespace `http://www.sitemaps.org/schemas/sitemap/0.9`)
- [ ] Скільки URL в sitemap?
- [ ] Чи є Sitemap Index (для великих сайтів > 50k URLs)?
- [ ] Зайти в GSC → Sitemaps → чи підключено? Скільки discovered vs indexed?

  ```
  URLs у sitemap:
  Discovered by Google:
  Indexed:
  Помилки у sitemap:
  ```

- [ ] Перевірити: чи містить sitemap тільки 200-статус, canonical, indexable сторінки?
  - ❌ НЕ повинно бути: 301/404 URLs, noindex сторінок, non-canonical URLs

### Crawl (Screaming Frog або Ahrefs Site Audit)

- [ ] Запустити повний краул сайту
- [ ] Зафіксувати ключові метрики:

  | Метрика | Значення |
  |---|---|
  | Всього URLs знайдено | |
  | 200 (OK) | |
  | 301 (Redirects) | |
  | 302 (Temporary redirects) | |
  | 404 (Not Found) | |
  | 500 (Server errors) | |
  | Blocked by robots.txt | |
  | noindex | |
  | Orphan pages | |

- [ ] Перевірити redirect chains (A → B → C — треба скоротити до A → C)
- [ ] Перевірити redirect loops
- [ ] Перевірити soft 404 (сторінки повертають 200, але містять "not found" контент)
- [ ] Виявити orphan pages (немає internal links → не індексуються)

---

## 1.2 — Canonical & Duplicate Content

**Що робимо:** Переконуємось що Google знає яка версія кожної сторінки — головна.

- [ ] Перевірити canonical tags на всіх типах сторінок:
  - Homepage: `<link rel="canonical" href="https://domain.com" />`
  - Внутрішні: `<link rel="canonical" href="https://domain.com/page-slug" />`
  - Canonical має бути self-referencing (вказує на саму себе)
  - Canonical НЕ повинен вказувати на сторінку з 301 редіректом (canonical chain!)

- [ ] Перевірити www vs non-www:
  ```
  Canonical версія домену: [www / non-www]
  301 редірект всіх варіантів → canonical: [Yes / No]
  ```

- [ ] Перевірити http vs https:
  ```
  HTTPS: [Yes / No]
  HTTP → HTTPS 301: [Yes / No]
  Mixed content warnings: [немає / є]
  ```

- [ ] Перевірити trailing slash consistency:
  ```
  Trailing slash: [Yes / No / Mixed]
  Canonical та URL відповідають: [Yes / No]
  ```

- [ ] Виявити duplicate title tags (Screaming Frog → Page Titles → Duplicates)
- [ ] Виявити duplicate meta descriptions
- [ ] Виявити near-duplicate сторінки (особливо для programmatic / local pages)

---

## 1.3 — URL Structure & Architecture

**Що робимо:** Перевіряємо логіку URL та доступність пріоритетних сторінок.

- [ ] URL format перевірка:
  - [ ] Всі lowercase
  - [ ] Слова через дефіс (не underscore, не пробіл)
  - [ ] Без спеціальних символів (`?`, `&`, `=` — тільки для параметрів)
  - [ ] Без зайвих слів-стопів ("the", "and", "of" де не потрібно)
  - [ ] Без дат у URL (якщо не news сайт)

- [ ] Глибина сторінок:
  - Пріоритетні сторінки досяжні за ≤ 3 кліки від homepage?
  - Перевірити через Screaming Frog → Crawl Depth
  ```
  Сторінки на глибині 1 (homepage):
  Сторінки на глибині 2:
  Сторінки на глибині 3:
  Сторінки на глибині 4+: [ПРОБЛЕМА якщо є важливі]
  ```

- [ ] Перевірити структуру відповідає топікальним кластерам:
  - Pillar pages: `/services/seo/` або `/blog/topic/`
  - Cluster pages: `/blog/topic/specific-article/`
  - Local pages: `/local/city/service/`

---

## 1.4 — Core Web Vitals (CWV)

**Що робимо:** Оцінюємо швидкість та UX — прямий ranking фактор Google.

- [ ] Відкрити GSC → Core Web Vitals (польові дані CrUX — реальні користувачі!)
  ```
  LCP — Largest Contentful Paint:
    Mobile: [Good <2.5s / Needs Improvement 2.5–4s / Poor >4s]
    Desktop: 
  INP — Interaction to Next Paint:
    Mobile: [Good <200ms / Needs Improvement 200–500ms / Poor >500ms]
    Desktop:
  CLS — Cumulative Layout Shift:
    Mobile: [Good <0.1 / Needs Improvement 0.1–0.25 / Poor >0.25]
    Desktop:
  ```

- [ ] Відкрити PageSpeed Insights (pagespeed.web.dev) для homepage + top landing page
  - Зафіксувати Performance score (Mobile / Desktop)
  - Зафіксувати LCP element (що є LCP — hero image, H1, block?)
  - Зафіксувати основні можливості оптимізації

- [ ] Виявити render-blocking resources:
  - JS без defer/async у `<head>` = блокує рендеринг
  - Синхронний CSS з великих external файлів

- [ ] Перевірити images:
  - [ ] Формат WebP / AVIF (не PNG/JPEG для великих зображень)
  - [ ] Lazy loading для below-fold (`loading="lazy"`)
  - [ ] Explicit width та height (запобігає CLS)
  - [ ] LCP image: `fetchpriority="high"` + `loading="eager"` (НЕ lazy!)

- [ ] Перевірити fonts:
  - `font-display: swap` або `optional` у @font-face
  - `<link rel="preconnect">` для Google Fonts
  - Чи не блокують рендеринг?

- [ ] TTFB (Time to First Byte):
  - Перевірити у WebPageTest або PageSpeed
  - Ціль: < 800ms. Якщо > 1.5s → проблема сервера або CDN
  ```
  TTFB:
  CDN використовується: [Yes / No]
  HTTP/2 або HTTP/3: [Yes / No]
  ```

---

## 1.5 — Mobile & On-Page Technical

- [ ] Viewport meta tag присутній на всіх сторінках:
  `<meta name="viewport" content="width=device-width, initial-scale=1.0">`

- [ ] Mobile-first indexing: Google індексує mobile версію → контент на мобільному = контент в індексі
  - Перевірити GSC → Settings → About this property (показує mobile first)
  - Чи є приховані блоки на мобільному (`display:none`)? Якщо так — Google їх бачить менш значимими

- [ ] Font sizes на мобільному: body ≥ 16px
- [ ] Touch targets: кнопки/посилання ≥ 48px висота

- [ ] hreflang (тільки якщо multilingual сайт):
  - Перевірити синтаксис (правильні мовні коди: uk, en, en-CA, fr-CA)
  - Перевірити return tags (кожна мова посилається назад)
  - Перевірити x-default

- [ ] Security Headers (перевірити через securityheaders.com):
  ```
  X-Content-Type-Options: [присутній / відсутній]
  X-Frame-Options або CSP frame-ancestors: [присутній / відсутній]
  Strict-Transport-Security (HSTS): [присутній / відсутній]
  ```

---

## 1.6 — Technical Audit Summary

> Заповни після завершення всіх пунктів 1.1–1.5

### Знайдені проблеми — Пріоритизований список

#### 🔴 CRITICAL — Виправити негайно (блокують індексацію або є penalty-ризик)
| # | Проблема | Сторінки/URLs | Відповідальний | Статус |
|---|---|---|---|---|
| 1 | | | | |
| 2 | | | | |

#### 🟠 HIGH — Виправити протягом 1 тижня
| # | Проблема | Сторінки/URLs | Відповідальний | Статус |
|---|---|---|---|---|
| 1 | | | | |
| 2 | | | | |

#### 🟡 MEDIUM — Виправити протягом місяця
| # | Проблема | Сторінки/URLs | Відповідальний | Статус |
|---|---|---|---|---|
| 1 | | | | |
| 2 | | | | |

#### 🟢 LOW — Backlog
| # | Проблема | Сторінки/URLs | Відповідальний | Статус |
|---|---|---|---|---|
| 1 | | | | |

---

---

# PHASE 2 — ENTITY SEO & E-E-A-T FOUNDATION

> **Мета:** Допомогти Google (та AI системам) зрозуміти хто є клієнт як entity — надійна, авторитетна організація.
> **Час:** 4–8 годин | **Дедлайн:** Паралельно з Phase 1, День 3–7
> **Результат:** Entity Checklist, Schema Implementation Plan, E-E-A-T Gap Report

---

## 2.1 — Entity Audit (Хто ви для Google?)

**Що робимо:** Перевіряємо наскільки Google може ідентифікувати бізнес як відому entity.

- [ ] Загуглити назву бренду — чи є Knowledge Panel у SERP?
  ```
  Knowledge Panel: [Yes / No / Partial]
  Які дані відображаються:
  Помилки у Knowledge Panel:
  ```

- [ ] Перевірити Wikidata (wikidata.org) — чи є Q-item для бізнесу?
  ```
  Wikidata Q-item: [є — вказати / немає]
  ```

- [ ] Перевірити Wikipedia — чи є стаття?
  ```
  Wikipedia: [є / немає]
  ```

- [ ] Перевірити Crunchbase, Clutch, G2, Trustpilot, LinkedIn Company — чи є профілі?

  | Платформа | Є/Немає | URL | NAP коректний |
  |---|---|---|---|
  | LinkedIn Company | | | |
  | Crunchbase | | | |
  | Clutch / Agency Spotter | | | |
  | G2 / Trustpilot | | | |
  | Facebook | | | |
  | Instagram | | | |
  | X (Twitter) | | | |
  | YouTube | | | |

---

## 2.2 — NAP Consistency Audit

**Що робимо:** Name, Address, Phone — три найважливіші data points для entity disambiguation. Мають бути ідентичні скрізь.

- [ ] Визначити канонічний NAP:
  ```
  Канонічна назва: [наприклад "Boomy Marketing Agency" — обрати ОДИН варіант]
  Адреса: [повна, з postal code]
  Телефон (E.164): [+16473701888]
  Email: 
  Website URL:
  ```

- [ ] Перевірити NAP на сайті:

  | Сторінка | Назва | Адреса | Телефон | Відповідає канонічному? |
  |---|---|---|---|---|
  | Homepage schema | | | | |
  | Contact page | | | | |
  | About page | | | | |
  | Footer | | | | |
  | Local pages | | | | |

- [ ] Перевірити формат телефону у `tel:` href:
  - ✅ Правильно: `href="tel:+16473701888"`
  - ❌ Неправильно: `href="tel:(647) 370-1888"`

- [ ] Перевірити founding date — чи однакова у всіх schema instances та body copy?
  ```
  Founding date у homepage schema:
  Founding date у about schema:
  Founding date у body copy:
  Founding date у llms.txt:
  Всі однакові: [Yes / No — вказати що виправити]
  ```

---

## 2.3 — Schema Markup Audit & Implementation

**Що робимо:** Перевіряємо поточну schema, виявляємо помилки та gaps.

### Аудит поточного стану

- [ ] Перевірити homepage schema (відкрити source, знайти `<script type="application/ld+json">`)
  - Тип: Organization / LocalBusiness / MarketingAgency / інше?
  - Чи є: name, url, logo, telephone, address, foundingDate, sameAs, areaServed?
  - Відкрити у Rich Results Test (search.google.com/test/rich-results) → перевірити errors/warnings

- [ ] Перевірити GSC → Enhancements → які schema types виявлені, є errors?

- [ ] Пройтись по типах сторінок та зафіксувати наявну schema:

  | Тип сторінки | Наявна schema | Errors | Що додати |
  |---|---|---|---|
  | Homepage | | | |
  | About | | | |
  | Services | | | |
  | Blog Index | | | |
  | Blog Article | | | |
  | Contact | | | |
  | Pricing | | | |
  | Local pages | | | |

### Schema Implementation Plan

**Мінімально необхідні типи по типу сторінок:**

#### Homepage
```json
{
  "@type": "Organization",  // або MarketingAgency / LocalBusiness
  "name": "Канонічна назва",
  "url": "https://domain.com",
  "logo": "https://domain.com/logo.png",
  "telephone": "+1XXXXXXXXXX",
  "email": "",
  "foundingDate": "РРРР",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "",
    "addressLocality": "",
    "addressRegion": "",
    "postalCode": "",
    "addressCountry": "CA"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": ,
    "longitude": 
  },
  "areaServed": [],
  "sameAs": []
}
```

- [ ] `sameAs` array — зібрати всі верифіковані профілі:
  ```
  sameAs: [
    "https://linkedin.com/company/...",
    "https://instagram.com/...",
    "https://facebook.com/...",
    "https://x.com/...",
    "https://youtube.com/...",
    "https://clutch.co/profile/..."  // якщо є
  ]
  ```

#### Кожна стаття/блог
- [ ] Article або BlogPosting schema:
  - `headline`, `author` (Person з name + url), `datePublished`, `dateModified`, `image`, `publisher`
  - ❗ `author` — ЛЮДИНА, не компанія

#### Сервісні сторінки
- [ ] Service schema: `name`, `description`, `provider`, `areaServed`, `offers`

#### FAQ секції
- [ ] FAQPage schema: `mainEntity` → масив `Question` + `Answer`
  - ❗ Питання/відповіді у schema мають відповідати видимому контенту на сторінці

#### Сторінки з відгуками
- [ ] AggregateRating — ТІЛЬКИ якщо реальні відгуки відображені на сторінці (не статичні дані!)

- [ ] Після впровадження schema:
  - [ ] Перевірити кожен тип у Rich Results Test
  - [ ] Підтвердити відображення у GSC → Enhancements через 1–2 тижні

---

## 2.4 — E-E-A-T Gap Analysis

**Що робимо:** Оцінюємо наскільки сайт демонструє Experience, Expertise, Authoritativeness, Trustworthiness.

### Author Signals
- [ ] Є іменовані автори на статтях? (не "Editorial Team")
  ```
  Автори є: [Yes / No]
  Full name вказано: [Yes / No]
  Фото автора: [Yes / No]
  Bio/credentials: [Yes / No]
  Посилання на LinkedIn: [Yes / No]
  ```

- [ ] Якщо немає → **Action: Додати author profiles + bylines на всіх статтях**

### Trust Signals
- [ ] На сайті є:
  - [ ] Privacy Policy (посилання у footer)
  - [ ] Terms of Service
  - [ ] Contact page з реальною адресою та телефоном
  - [ ] About page з командою та досвідом
  - [ ] Відгуки клієнтів з ім'ям + компанія (не анонімні)
  - [ ] Case studies з реальними даними (до/після)
  - [ ] Awards / certifications / partnerships (з посиланнями на першоджерело)
  - [ ] Press mentions / media coverage

### Content Freshness
- [ ] "Last Updated" дата видима на evergreen статтях
- [ ] `dateModified` у schema виставлено
- [ ] Є пункти у статтях які вже застаріли? → черга на refresh

### E-E-A-T Score (суб'єктивна оцінка):
```
Experience (реальний досвід у темі): /10
Expertise (глибина знань): /10
Authoritativeness (авторитет у ніші): /10
Trustworthiness (довіра): /10
Загальний рівень: [Low / Medium / High]
```

### Gaps та Action Items:
```
Критичні gaps:
1.
2.

План виправлення:
1.
2.
```

---

## 2.5 — llms.txt (AI Search Readiness)

**Що робимо:** Перевіряємо/створюємо файл для AI search систем (ChatGPT, Perplexity, Claude).

- [ ] Перевірити наявність: `https://domain.com/llms.txt` (відповідає 200?)
  ```
  llms.txt є: [Yes / No]
  ```

- [ ] Якщо є — перевірити якість:
  - [ ] Правильний формат: `#` Name, `>` tagline, опис, `## Pages`, `## Optional`
  - [ ] Містить посилання на ключові сторінки з описом?
  - [ ] Дані відповідають schema на сайті (NAP, founding date)?
  - [ ] Є ліцензійний statement?

- [ ] Якщо немає або неповний — **Action: Створити/доповнити**

  **Шаблон llms.txt:**
  ```markdown
  # [Назва компанії]

  > [Одне речення — що робить компанія]

  [2–3 речення опису: хто, що, для кого, де]

  Founded: [рік] | Location: [місто, країна] | Phone: [+1XXXXXXXXXX]

  ## Services
  - [Service 1]
  - [Service 2]

  ## Pages

  - [URL]: [Що відповідає ця сторінка — 1 речення]
  - [URL]: [Що відповідає]

  ## Optional

  - [URL]: [Додатковий контент який можна пропустити]

  ## For AI Systems
  Content may be cited with attribution to [Назва]. 
  Do not reproduce in full without permission.
  ```

---

---

# PHASE 3 — KEYWORD RESEARCH & TOPICAL AUTHORITY MAPPING

> **Мета:** Побудувати повний keyword universe та топікальну карту — основу для всього контенту.
> **Час:** 8–16 годин | **Дедлайн:** День 7–14 проєкту
> **Результат:** Keyword Master List, Topical Authority Map, Content Cluster Plan

---

## 3.1 — Seed Keywords

**Що робимо:** Збираємо початковий список keywords від клієнта та з перших пошуків.

- [ ] Зібрати seed keywords під час kick-off (Phase 0):
  - Які терміни клієнт вважає найважливішими? (записати дослівно)
  - Як клієнт описує свій продукт/послугу?
  - Якими словами клієнти зазвичай описують проблему, яку вирішує клієнт?

- [ ] Зафіксувати 10–20 seed keywords:
  ```
  1.
  2.
  3.
  ...
  ```

- [ ] Розширити seeds через GSC: Performance → Queries (що вже приносить impressions?)
  - Виписати всі запити з > 10 impressions та position > 20 → потенційні quick wins

---

## 3.2 — Keyword Expansion

**Що робимо:** З seed keywords будуємо повний keyword universe.

- [ ] **Ahrefs / Semrush — Keyword Explorer:**
  - Для кожного seed: "Matching terms" + "Related terms" + "Questions"
  - Фільтри: Keyword Difficulty ≤ [реалістичний поріг для DR сайту], Volume ≥ 100/міс
  - Зберегти всі результати у Keyword Master List

- [ ] **AlsoAsked.com або People Also Ask у SERP:**
  - Ввести топ-5 seed keywords → зібрати всі PAA питання
  - Це основа для AEO / FAQ контенту

- [ ] **Google Autocomplete:**
  - Ввести seed + пробіл → записати всі підказки (A–Z)
  - Альтернатива: Keywordtool.io або Ubersuggest автоматизують це

- [ ] **Answer The Public / Exploding Topics:**
  - Питання (who/what/when/where/why/how + keyword)
  - Порівняння (X vs Y)
  - Прийменники (keyword + for/without/with/near)

---

## 3.3 — Keyword Classification

**Що робимо:** Кожен keyword класифікуємо за intent та funnel stage. Без цього неможливо призначити правильний тип сторінки.

### Search Intent типи:
| Intent | Що хоче користувач | Тип контенту |
|---|---|---|
| **Informational** | Дізнатись / зрозуміти | Blog article, guide, FAQ |
| **Commercial** | Порівняти варіанти | Comparison, reviews, "best X" |
| **Transactional** | Купити / замовити | Product/service page, pricing |
| **Navigational** | Знайти конкретний бренд | Homepage, brand page |

### Funnel Stage:
| Стадія | Keyword приклади | Мета |
|---|---|---|
| **ToFU** (Awareness) | "what is SEO", "how to get more traffic" | Залучення нової аудиторії |
| **MoFU** (Consideration) | "best SEO agency Toronto", "SEO vs PPC" | Допомогти обрати |
| **BoFU** (Decision) | "hire SEO agency", "SEO agency pricing" | Конвертувати |

- [ ] Створити Keyword Master List у Google Sheets / Airtable:

  | Keyword | Monthly Volume | KD | Intent | Funnel | Business Value (1–5) | Current Position | Target URL |
  |---|---|---|---|---|---|---|---|
  | | | | | | | | |

- [ ] Пріоритизувати keyword list:
  - BoFU + High Business Value → найвищий пріоритет
  - ToFU з великим volume → контент-маховик / awareness
  - Position 4–15 у GSC → quick win через оптимізацію існуючих сторінок

---

## 3.4 — Topical Authority Map

**Що робимо:** Групуємо keywords у кластери та призначаємо архітектуру сторінок.

### Принцип Topic Cluster:
```
Pillar Page (головна тема)
├── Cluster Page 1 (підтема)
├── Cluster Page 2 (підтема)
├── Cluster Page 3 (підтема)
└── Cluster Page N...
```
- Pillar Page: широка тема, комерційний або informational intent, таргетує head keyword
- Cluster Pages: вузькі підтеми, internal link до Pillar Page

### Побудова кластерів:

- [ ] Визначити 5–10 Primary Topic Clusters (по кількості основних напрямків бізнесу):
  ```
  Cluster 1: [Назва теми]
    Pillar page URL: /services/[topic]/
    Pillar keyword: 
    Cluster pages:
      - /blog/[subtopic-1]/  — keyword:
      - /blog/[subtopic-2]/  — keyword:
      - /blog/[subtopic-3]/  — keyword:

  Cluster 2: [Назва теми]
    Pillar page URL:
    Pillar keyword:
    Cluster pages:
      - 
      - 
  ```

- [ ] Перевірити cannibalization:
  - Чи є кілька сторінок що таргетують однаковий keyword?
  - Якщо так → вирішити: merge (301) / canonical / differentiate intent

- [ ] Перевірити які кластери вже є на сайті (хоча б частково)
- [ ] Визначити які кластери повністю відсутні → пріоритет для нового контенту

---

## 3.5 — SERP Analysis для пріоритетних keywords

**Що робимо:** Для кожного пріоритетного keyword аналізуємо що насправді ранжується — це визначає що нам треба створити.

- [ ] Для топ-20 пріоритетних keywords — заповнити:

  | Keyword | Домінуючий тип контенту | Сер. довжина топ-5 | SERP Features | AI Overview? | Що нам треба |
  |---|---|---|---|---|---|
  | | | | | | |

- [ ] Виявити Featured Snippet opportunities:
  - Keyword показує Featured Snippet у SERP?
  - Який формат: paragraph / list / table?
  - Хто займає? Чи можемо ми зайти з кращою відповіддю?

- [ ] Виявити AI Overview opportunities:
  - Які keywords показують AI Overview?
  - Чи клієнт цитується? Якщо ні — що треба щоб потрапити?

---

## 3.6 — Phase 3 Output: Content Plan

> Результат Phase 3 — готовий план контенту

- [ ] **Keyword Master List** — заповнений, класифікований, пріоритизований
- [ ] **Topical Authority Map** — всі кластери, pillar + cluster pages
- [ ] **Content Production Queue** — черга статей з пріоритетом:

  | Пріоритет | URL | Keyword | Intent | Funnel | Статус |
  |---|---|---|---|---|---|
  | 1 (BoFU) | | | | | Планується |
  | 2 (BoFU) | | | | | |
  | 3 (MoFU) | | | | | |
  | ... | | | | | |

- [ ] **Quick Wins List** — сторінки в позиції 4–15, потребують лише оптимізації:

  | URL | Keyword | Поточна позиція | Дія |
  |---|---|---|---|
  | | | | Оновити title/H1/meta |
  | | | | Додати internal links |
  | | | | Розширити контент |

---

---

# PHASE 4 — ON-PAGE SEO OPTIMIZATION

> **Мета:** Оптимізувати кожну пріоритетну сторінку так, щоб Google чітко розумів тему, intent та цінність — і ставив її вище конкурентів.
> **Час:** 2–4 год/сторінка для повного аудиту + правки | **Дедлайн:** День 7–21 проєкту
> **Результат:** On-Page Audit таблиця, правки внесені у CMS/код, Pre-Publish QA пройдений

---

## 4.0 — Черга сторінок для on-page оптимізації

**Що робимо:** Визначаємо порядок — які сторінки оптимізувати першими.

**Пріоритети:**
1. BoFU сторінки (послуги, pricing, landing) — прямий вплив на revenue
2. Pillar pages — фундамент топікальних кластерів
3. Quick Wins зі Phase 3 (позиції 4–15) — найшвидший ROI
4. Нові сторінки перед публікацією

- [ ] Скласти черга сторінок для оптимізації:

  | # | URL | Тип | Keyword | Пріоритет | Статус |
  |---|---|---|---|---|---|
  | 1 | | BoFU / Pillar / Quick Win | | 🔴 Критично | |
  | 2 | | | | 🟠 High | |
  | 3 | | | | 🟡 Medium | |
  | ... | | | | | |

---

## 4.1 — Title Tag

**Що робимо:** Title — перше що бачить Google і користувач у SERP. Критично для CTR і rankings.

### Правила:

- [ ] Унікальний для кожної сторінки (перевірити дублікати через Screaming Frog → Page Titles → Duplicates)
- [ ] Довжина: **50–60 символів** (≤ 600px у SERP). Перевірити через: `https://www.serpsim.com`
- [ ] Primary keyword — бажано на початку title
- [ ] Не keyword stuffing: один primary keyword, решта природньо
- [ ] Включити brand name наприкінці через `|` або `—` (якщо є місце)

### Формули по intent:

| Intent | Формула title | Приклад |
|---|---|---|
| **Transactional** | [Keyword] + CTA/benefit | "SEO Services Toronto — Drive 5x Organic Growth" |
| **Commercial** | [Keyword] + Differentiator | "Best SEO Agency Toronto — 127+ Clients, 4.9★" |
| **Informational** | Question або Topic | "How SEO Works in 2026: Complete Guide" |
| **Local** | [Service] + [City] | "SEO Company Vancouver — Boomy Marketing" |

### Аудит поточних title tags:

- [ ] Для кожної пріоритетної сторінки заповнити:

  | URL | Поточний title | Символів | Проблема | Новий title | Символів |
  |---|---|---|---|---|---|
  | /services/seo | | | Занадто довгий | | |
  | /about | | | Keyword відсутній | | |
  | /blog/... | | | Дублюється з H1 | | |

- [ ] Типові помилки — перевірити:
  - [ ] Title = H1 (повне копіювання) → різний кут зору для title та H1
  - [ ] Title > 60 символів → truncated у SERP
  - [ ] Title без keyword → Google перегенерує власний
  - [ ] "Home" або "Page" у title → замінити на keyword
  - [ ] Brand name на початку (не BoFU) → перемістити в кінець

---

## 4.2 — Meta Description

**Що робимо:** Не прямий ranking фактор, але впливає на CTR — а CTR впливає на rankings. Google перегенеровує ~70% мет — зробити їх настільки добрими, щоб залишав оригінал.

### Правила:

- [ ] Унікальний для кожної сторінки
- [ ] Довжина: **140–160 символів** (~920px). Перевірити через serpsim.com
- [ ] Включити primary keyword (Google болдить його у SERP)
- [ ] Включити CTA або value proposition ("Get a free audit", "See pricing", "Learn how")
- [ ] Не повторювати title дослівно — розкрити додатковий кут
- [ ] Специфічні цифри підвищують CTR: "127 clients", "From $1,500/mo", "In 90 days"

### Формули:

| Тип сторінки | Формула | Приклад |
|---|---|---|
| **Service** | [Benefit] + [Proof] + [CTA] | "Grow organic traffic 3x faster with Toronto's top-rated SEO agency. 127 clients, 98% retention. Get your free audit today." |
| **Blog article** | [Hook/Question] + [What you'll learn] | "Wondering why your site doesn't rank? Discover the 7 technical SEO fixes that move the needle — with step-by-step instructions." |
| **Pricing** | [Transparency] + [Differentiator] + [CTA] | "SEO plans from $1,500/mo with no lock-in contracts. See exactly what's included at each tier — and choose what fits your growth goals." |

### Аудит:

- [ ] Для кожної пріоритетної сторінки:

  | URL | Поточна meta description | Символів | Проблема | Нова meta description |
  |---|---|---|---|---|
  | | | | | |
  | | | | | |

- [ ] Типові помилки:
  - [ ] Відсутня (Google генерує сам — часто погано)
  - [ ] > 160 символів → обрізається
  - [ ] Keyword відсутній → не болдиться у SERP
  - [ ] Дублюється між сторінками

---

## 4.3 — Heading Structure (H1 / H2 / H3)

**Що робимо:** Headings — це структура документа для Google і карта навігації для читача. Також основа для Featured Snippets та AI Overviews.

### H1 — Правила:

- [ ] **Одна H1 на кожній сторінці** — перевірити через Screaming Frog → H1 → Missing/Multiple/Duplicate
- [ ] H1 містить primary keyword (не обов'язково точна відповідність)
- [ ] H1 ≠ Title Tag (різний формат/кут зору)
- [ ] H1 — перший елемент основного контенту (не лого, не навігація)
- [ ] Довжина: 40–70 символів оптимально

  | Title Tag | H1 |
  |---|---|
  | "SEO Services Toronto — Drive 5x Growth" | "SEO Services in Toronto That Actually Rank" |
  | "What Is Technical SEO?" | "Technical SEO: The Complete Beginner's Guide (2026)" |

### H2 — Правила:

- [ ] H2 = основні секції сторінки (2–7 секцій залежно від довжини)
- [ ] Включати secondary keywords та LSI-терміни природно
- [ ] **Формулювати як питання де можливо** → пряме попадання в PAA та AI Overviews
  - ❌ "Our SEO Process"
  - ✅ "How Does Our SEO Process Work?"
- [ ] H2 самодостатні: читач має розуміти тему секції без читання тексту навколо

### H3 — Правила:

- [ ] H3 = підсекції H2 (деталізація)
- [ ] Використовувати long-tail keywords та question-based формати
- [ ] Для FAQ секцій: кожне питання = H3

### Аудит heading structure:

- [ ] Для кожної пріоритетної сторінки — зафіксувати поточну структуру:

  ```
  URL: /services/seo/
  H1: [поточний текст] → [новий якщо потрібно]
  H2: [поточний] → [новий]
    H3: [поточний] → [новий]
    H3: [поточний] → [новий]
  H2: [поточний] → [новий]
  ...
  ```

- [ ] Типові помилки:
  - [ ] Кілька H1 на сторінці (часто через header або footer)
  - [ ] Пропущені рівні: H1 → H3 (без H2)
  - [ ] H2 = декоративний текст без keywords
  - [ ] Занадто мало H2 (1–2 на довгій сторінці) → додати структуру

---

## 4.4 — URL Slug Audit

**Що робимо:** URL — постійний ідентифікатор сторінки. Змінювати старі URL тільки якщо є 301 редірект. Нові URL — відразу правильні.

### Правила для нових URL:

- [ ] Lowercase: `/seo-services-toronto` ✅ не `/SEO-Services-Toronto` ❌
- [ ] Дефіс між словами: `/how-seo-works` ✅ не `/how_seo_works` ❌
- [ ] Короткий: 3–5 слів оптимально
- [ ] Keyword присутній
- [ ] Без стоп-слів: "a", "the", "and", "of", "in" → прибрати де не змінює зміст
- [ ] Без дат (якщо не news): `/blog/seo-guide` ✅ не `/blog/2026/03/seo-guide` ❌
- [ ] Без ID або хешів: `/product/blue-running-shoes` ✅ не `/product?id=4729` ❌

### Аудит існуючих URL:

- [ ] Виявити проблемні URL через Screaming Frog → URL

  | Поточний URL | Проблема | Рекомендований URL | 301 потрібен? |
  |---|---|---|---|
  | /services/search-engine-optimization-services-toronto-canada | Занадто довгий | /services/seo-toronto | Yes |
  | /blog/post?id=123 | Параметр у URL | /blog/seo-guide-2026 | Yes |

- [ ] ❗ Якщо URL вже проіндексований і має backlinks — змінювати ТІЛЬКИ якщо критично + обов'язково 301

---

## 4.5 — Internal Linking

**Що робимо:** Internal links — другий після backlinks фактор передачі авторитету. Також допомагають Google зрозуміти топікальні кластери.

### Правила:

- [ ] Кожна нова стаття: мінімум **3–5 internal links** до релевантних сторінок
- [ ] Pillar page: посилання з усіх cluster pages цього кластера (spoke → hub)
- [ ] Pillar page → посилання на cluster pages (hub → spokes)
- [ ] Anchor text: **descriptive, keyword-rich** (не "click here", не "read more")
  - ✅ "our technical SEO audit process"
  - ❌ "click here to learn more"
- [ ] Посилання відкриваються у тій самій вкладці (internal links — не `target="_blank"`)
- [ ] Не більше 100 internal links на одній сторінці (Google може не краулити всі)
- [ ] Уникати nofollow на internal links (передавай PageRank)

### Orphan pages (сторінки без internal links):

- [ ] Знайти orphan pages: Ahrefs → Site Audit → Internal Pages → Orphan pages
- [ ] Для кожної orphan page: знайти де логічно додати посилання → додати

### Internal Link Audit — пріоритетні сторінки:

- [ ] Для топ-10 пріоритетних сторінок перевірити:

  | URL | Кількість вхідних internal links | Кількість вихідних internal links | Що додати / виправити |
  |---|---|---|---|
  | | | | |
  | | | | |

### Link Equity Distribution Map:

- [ ] Чи homepage передає link equity до пріоритетних сторінок через nav/footer/body?
- [ ] Чи є "orphaned silos" — кластери, що не пов'язані з homepage?
- [ ] Чи є "link equity sinks" — сторінки, що отримують багато посилань але нікуди не ведуть?

---

## 4.6 — Content On-Page Elements

**Що робимо:** Деталі які разом визначають наскільки сторінка "повна" для Google.

### Keyword Placement:

- [ ] Primary keyword у **першому параграфі** (перші 100 слів)
- [ ] Primary keyword у H1 (обов'язково)
- [ ] Primary keyword у title та meta description (обов'язково)
- [ ] Secondary keywords та LSI терміни розподілені природно (не "напхані")
- [ ] Перевірити через Surfer SEO або Clearscope чи вистачає keyword density vs топ-конкуренти

### Зображення:

- [ ] Кожне зображення має `alt` атрибут
- [ ] Alt text: описовий, включає keyword де природно, не keyword stuffing
  - ✅ `alt="SEO audit checklist for Canadian businesses"`
  - ❌ `alt="seo seo toronto seo agency seo"`
- [ ] Формат: WebP або AVIF (не PNG/JPEG для великих зображень)
- [ ] Lazy loading для below-fold: `loading="lazy"`
- [ ] LCP зображення: `loading="eager"` + `fetchpriority="high"` (НЕ lazy!)
- [ ] Explicit dimensions: `width="800" height="450"` (запобігає CLS)
- [ ] Назва файлу: `keyword-description.webp` (не `IMG_4829.jpg`)
- [ ] Caption де доречно (Google читає captions)

### Зовнішні посилання:

- [ ] 1–3 посилання на **авторитетні зовнішні джерела** (Google, Wikipedia, .gov, .edu, industry reports)
- [ ] Відкриваються у новій вкладці: `target="_blank" rel="noopener"`
- [ ] Статистика та цитати — атрибутовані з посиланням на першоджерело (не на агрегатор)
- [ ] Перевіряти зовнішні посилання на broken links кожні 6 місяців

### Довжина контенту:

- [ ] Визначити target довжину через SERP аналіз (медіана топ-5 результатів)
- [ ] **НЕ ціль — "більше = краще"**. Ціль — покрити тему повніше та точніше ніж конкуренти

  | Тип сторінки | Орієнтовна довжина |
  |---|---|
  | Pillar page / Ultimate Guide | 3,000–6,000 слів |
  | Cluster article | 1,200–2,500 слів |
  | Service page | 800–1,500 слів |
  | Local landing page | 600–1,200 слів |
  | FAQ / Glossary | 500–1,000 слів |

---

## 4.7 — Open Graph & Social Meta Tags

**Що робимо:** OG теги контролюють як сторінка виглядає при шерінгу у соцмережах та месенджерах.

- [ ] Перевірити наявність на всіх пріоритетних сторінках:

  ```html
  <meta property="og:title" content="[Title — може відрізнятись від <title>]" />
  <meta property="og:description" content="[150–200 символів]" />
  <meta property="og:url" content="https://domain.com/page" />
  <meta property="og:type" content="website" />  <!-- або "article" для статей -->
  <meta property="og:image" content="https://domain.com/og-image.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />

  <!-- Twitter/X Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="[Title]" />
  <meta name="twitter:description" content="[Description]" />
  <meta name="twitter:image" content="https://domain.com/og-image.jpg" />
  ```

- [ ] `og:image` вимоги:
  - Розмір: **1200×630px** мінімум
  - Формат: PNG або JPEG (WebP підтримується не всіма платформами)
  - Файл < 1MB
  - Не містить дрібний текст (не читається у preview)

- [ ] Перевірити OG теги через: `https://www.opengraph.xyz` або Facebook Debugger

- [ ] Для статей додатково:
  ```html
  <meta property="article:published_time" content="2026-04-01T09:00:00+00:00" />
  <meta property="article:modified_time" content="2026-04-13T10:00:00+00:00" />
  <meta property="article:author" content="https://domain.com/about/author-name" />
  ```

- [ ] Перевірити: чи homepage має `og:image`? (Часто забувають саме на homepage)

---

## 4.8 — Content Formatting для Readability та AI Parsing

**Що робимо:** Форматування контенту — для читача (UX) та для AI систем (Featured Snippets, AI Overviews, Perplexity citations).

### Структура тексту:

- [ ] Абзаци: **2–4 речення максимум** (не суцільні блоки тексту)
- [ ] Subheadings (H2/H3) кожні **200–300 слів**
- [ ] Перше речення абзацу = найважливіше (inverted pyramid)
- [ ] **Bold** для ключових термінів та важливих statements (не overuse — max 1–2 на абзац)
- [ ] Bulleted/numbered lists де є перелік 3+ елементів
- [ ] Tables для порівнянь, цін, характеристик (Google любить tables у Featured Snippets)

### Елементи, що підвищують AI citability:

- [ ] **Definition block** на початку статті для "what is X" запитів:
  ```
  **[Термін]** — це [пряме визначення у 1–2 реченнях із конкретними деталями].
  ```
- [ ] **TL;DR або Key Takeaways** блок (на початку або кінці) — підвищує featured snippet шанси
- [ ] **Numbered steps** для "how to" контенту (Google витягує steps у AI Overview)
- [ ] **Статистика з атрибуцією**: `За даними [Джерело, рік], 67% компаній...` (sourced = citable)
- [ ] **Table of Contents** з anchor links для статей > 1,500 слів
- [ ] **FAQ секція** у кінці (5–8 питань з прямими відповідями 40–70 слів) + FAQPage schema

### Читабельність:

- [ ] Flesch Reading Ease ≥ 60 (перевірити через Hemingway App або Yoast)
- [ ] Уникати пасивного голосу > 20% речень
- [ ] Уникати жаргону без пояснення (якщо тільки це не B2B ніша де аудиторія знає термін)
- [ ] Кожна секція логічно завершена — читач може зупинитись після H2 і зрозуміти суть

---

## 4.9 — On-Page Audit Protocol (для існуючих сторінок)

**Що робимо:** Систематичний покроковий аудит кожної пріоритетної сторінки.

### Покроковий процес для КОЖНОЇ сторінки:

**Крок 1 — SERP аналіз перед початком:**
- [ ] Загуглити target keyword → що займає позиції 1–5?
- [ ] Який формат контенту домінує?
- [ ] Яка приблизна довжина?
- [ ] Які SERP features активні?
- [ ] Чи є AI Overview? Хто в ньому?

**Крок 2 — Аудит поточної сторінки:**
- [ ] Відкрити сторінку у браузері + переглянути source
- [ ] Заповнити On-Page Audit Sheet (нижче)

**Крок 3 — Конкурентний аналіз топ-3:**
- [ ] Відкрити топ-3 конкуренти → які H2 вони мають? Що ми пропускаємо?
- [ ] Які питання вони відповідають, що ми не відповідаємо?
- [ ] Які внутрішні та зовнішні посилання вони використовують?

**Крок 4 — Скласти список правок:**
- [ ] Пріоритизувати: що впливає на rankings vs що впливає на CTR vs що впливає на UX
- [ ] Передати в CMS/код з дедлайном

**Крок 5 — Після внесення правок:**
- [ ] Пройти Pre-Publish QA Checklist (4.10)
- [ ] Подати URL у GSC → Request Indexing

---

### On-Page Audit Sheet (заповнювати для кожної сторінки)

```
URL:
Target keyword (primary):
Target keyword (secondary):
Дата аудиту:
Поточна позиція у GSC:
Поточний трафік (GA4, міс):

--- TITLE TAG ---
Поточний: 
Символів:
Проблема: [немає / keyword відсутній / занадто довгий / дублікат]
Новий:

--- META DESCRIPTION ---
Поточна:
Символів:
Проблема:
Нова:

--- H1 ---
Поточний:
Проблема: [немає / keyword відсутній / відсутня H1 / кілька H1]
Новий:

--- HEADING STRUCTURE ---
Поточна структура (H2/H3 список):
Що додати/змінити:

--- CONTNET ---
Поточна довжина (слів):
Target довжина (медіана топ-5):
Розрив: [вистачає / потрібно додати ~ X слів]
Пропущені теми vs конкуренти:
Пропущені FAQ питання:

--- INTERNAL LINKS ---
Вхідних internal links (Ahrefs):
Вихідних internal links:
Що додати:

--- IMAGES ---
Alt text відсутній: [Yes/No — кількість]
Формат не оптимальний: [Yes/No]
Що виправити:

--- SCHEMA ---
Поточна schema: [тип або відсутня]
Errors у Rich Results Test:
Що додати/виправити:

--- OG TAGS ---
og:image присутня: [Yes/No]
Що виправити:

--- ПРІОРИТЕТНІ ПРАВКИ ---
🔴 Critical:
🟠 High:
🟡 Medium:

--- СТАТУС ---
Правки внесені: [Yes/No/In Progress]
Дата submit у GSC:
```

---

## 4.10 — Pre-Publish QA Checklist

**Що робимо:** Фінальна перевірка перед кожною публікацією — нової сторінки або після оновлення.

> Виконати по черзі. Не публікувати якщо є 🔴 пункти не закриті.

### Технічні елементи:
- [ ] 🔴 Title tag: унікальний, 50–60 символів, keyword є
- [ ] 🔴 Meta description: унікальна, 140–160 символів
- [ ] 🔴 H1: одна, містить keyword
- [ ] 🔴 Canonical tag: self-referencing, правильний протокол + без trailing slash конфлікту
- [ ] 🔴 URL: lowercase, дефіси, короткий, keyword є
- [ ] 🟠 og:image: присутня, 1200×630px
- [ ] 🟠 Schema: реалізована, перевірена у Rich Results Test, 0 errors
- [ ] 🟠 Internal links: ≥ 3, descriptive anchor text
- [ ] 🟡 Open Graph: всі теги присутні
- [ ] 🟡 Twitter Card: присутня

### Контент:
- [ ] 🔴 Primary keyword у першому параграфі
- [ ] 🟠 H2/H3 включають secondary keywords
- [ ] 🟠 Зовнішні посилання: авторитетні джерела, `rel="noopener"`, `target="_blank"`
- [ ] 🟠 Статистика атрибутована з посиланням на першоджерело
- [ ] 🟠 Author byline + bio (для статей): ім'я, посада, посилання на профіль
- [ ] 🟡 FAQ секція + FAQPage schema (для informational статей)
- [ ] 🟡 datePublished / dateModified у schema виставлено

### Зображення:
- [ ] 🟠 Alt text на всіх зображеннях
- [ ] 🟠 Lazy loading для below-fold зображень (`loading="lazy"`)
- [ ] 🟠 Explicit width та height на всіх зображеннях
- [ ] 🟡 Формат WebP або AVIF

### Фінальна перевірка:
- [ ] 🟠 Мобільний preview: виглядає коректно (Chrome DevTools → Mobile)
- [ ] 🟠 Сторінка завантажується < 3 сек (швидкий тест у PageSpeed Insights)
- [ ] 🔴 Немає `noindex` тегу на сторінці (якщо сторінка має індексуватись)
- [ ] 🔴 Подати URL у GSC → URL Inspection → Request Indexing після публікації

---

## 4.11 — Phase 4 Output: On-Page Optimization Tracker

> Зводна таблиця прогресу по всіх оптимізованих сторінках

| URL | Target Keyword | До (позиція) | Дата правок | QA пройдено | Submit GSC | Після (позиція) | Δ |
|---|---|---|---|---|---|---|---|
| | | | | | | | |
| | | | | | | | |
| | | | | | | | |

**Правило:** Знімати позицію через 2–4 тижні після внесення правок і submit у GSC.

---

---

---

---

# PHASE 5 — CONTENT STRATEGY & PRODUCTION

> **Мета:** Збудувати контент-машину яка системно виробляє сторінки що ранжуються, залучають трафік та конвертують — на основі Topical Authority Map зі Phase 3.
> **Час:** Ongoing | **Дедлайн:** Перша стаття — День 14–21. Далі — за Editorial Calendar
> **Результат:** Content Brief для кожної нової сторінки, Editorial Calendar, опублікований + оптимізований контент

---

## 5.1 — Content Brief (обов'язковий для КОЖНОЇ нової сторінки)

**Що робимо:** Перед написанням будь-якого контенту — заповнити brief. Без brief = без гарантії результату.

### Шаблон Content Brief:

```
══════════════════════════════════════════════════
CONTENT BRIEF
══════════════════════════════════════════════════

ЗАГАЛЬНА ІНФОРМАЦІЯ
Target URL (slug):
Дата публікації:
Автор:
Статус: [Brief / Writing / Review / Published]

══════════════════════════════════════════════════
KEYWORD & INTENT
══════════════════════════════════════════════════

Primary Keyword:
Monthly Volume:
Keyword Difficulty:
Search Intent: [Informational / Commercial / Transactional / Navigational]
Funnel Stage: [ToFU / MoFU / BoFU]
Business Value (1–5):

Secondary Keywords:
  -
  -
  -

LSI / Related Terms:
  -
  -

══════════════════════════════════════════════════
SERP SNAPSHOT
══════════════════════════════════════════════════

Топ-3 конкурентних URL:
  1.
  2.
  3.

Домінуючий формат контенту: [article / list / how-to / comparison / tool / video]
Медіана довжини топ-5 (слів):
SERP Features активні: [Featured Snippet / PAA / AI Overview / Local Pack / Video]
AI Overview присутній: [Yes / No]
Хто у Featured Snippet (якщо є):

══════════════════════════════════════════════════
СТРУКТУРА СТОРІНКИ
══════════════════════════════════════════════════

Title Tag (≤ 60 символів):
Meta Description (140–160 символів):

H1:
  H2:
    H3:
    H3:
  H2:
    H3:
    H3:
  H2: (FAQ секція — обов'язково для informational)
    H3: Питання 1?
    H3: Питання 2?
    H3: Питання 3?

Target довжина (слів):
Target Featured Snippet формат: [paragraph 40–60 слів / numbered list / table]

══════════════════════════════════════════════════
КОНТЕНТ ВИМОГИ
══════════════════════════════════════════════════

Обов'язкові теми для покриття (яких немає у нас, але є у конкурентів):
  -
  -

Обов'язкова статистика / дані (з першоджерела!):
  -
  -

Обов'язкові приклади або кейси:
  -

E-E-A-T вимоги:
  - Credentials автора:
  - Original data або insight:
  - External citations (джерела):

══════════════════════════════════════════════════
LINKING PLAN
══════════════════════════════════════════════════

Internal links — вхідні (звідки посилатися на цю сторінку):
  - [URL] — anchor text:
  - [URL] — anchor text:

Internal links — вихідні (куди посилатися з цієї сторінки):
  - [URL] — anchor text:
  - [URL] — anchor text:

External links (авторитетні джерела для цитування):
  - [URL] — для чого:
  - [URL] — для чого:

══════════════════════════════════════════════════
SCHEMA & TECHNICAL
══════════════════════════════════════════════════

Schema types для сторінки:
  - [ ] Article / BlogPosting
  - [ ] FAQPage
  - [ ] HowTo
  - [ ] BreadcrumbList
  - [ ] інше:

og:image потрібна: [Yes / No] | Розмір: 1200×630px

══════════════════════════════════════════════════
MULTIMEDIA
══════════════════════════════════════════════════

Зображення потрібні:
  -
  -

Відео: [Yes / No] | Яке:
Інфографіка: [Yes / No] | Яка:
Таблиця порівнянь: [Yes / No]

══════════════════════════════════════════════════
```

---

## 5.2 — Типи контенту та коли використовувати

**Що робимо:** Вибираємо правильний тип сторінки під кожен keyword та intent — не все є статтею.

| Тип контенту | Коли використовувати | Intent | Funnel |
|---|---|---|---|
| **Pillar Page** | Головна тема кластера, broad keyword | Informational / Commercial | ToFU / MoFU |
| **How-To Guide** | "How to X" запити, покрокові інструкції | Informational | ToFU |
| **Listicle** | "Best X", "Top 10 Y" запити | Commercial | MoFU |
| **Comparison** | "X vs Y", "Alternatives to X" | Commercial | MoFU |
| **Case Study** | Доказ результатів, конкретні дані | Commercial | MoFU / BoFU |
| **FAQ Page** | Питання по темі, PAA кластери | Informational | ToFU |
| **Glossary / Definition** | "What is X" терміни | Informational | ToFU |
| **Service Page** | Пряме замовлення послуги | Transactional | BoFU |
| **Landing Page** | Paid/organic campaign, конкретна пропозиція | Transactional | BoFU |
| **Local Page** | "[Service] in [City]" | Transactional / Commercial | BoFU |
| **Pricing Page** | "[Service] pricing/cost" | Transactional | BoFU |
| **Tool / Calculator** | Інтерактивний ресурс, linkable asset | Informational | ToFU |

### Правило вибору формату:

- [ ] Загуглити target keyword → подивитись що домінує у топ-5
- [ ] **Якщо топ-5 = статті** → пиши статтю (не service page і навпаки)
- [ ] **Якщо топ-5 = product/service pages** → не пиши blog post
- [ ] Ніколи не йти проти SERP intent — Google буде ранжувати те що відповідає intent

---

## 5.3 — Content Production Standards

**Що робимо:** Встановлюємо планку якості. Кожна опублікована сторінка має відповідати цим стандартам.

### Обов'язкові стандарти для КОЖНОГО матеріалу:

**Оригінальність:**
- [ ] Не копіювати структуру або формулювання конкурентів — перекрити тему з іншого кута
- [ ] Мінімум 1 оригінальний елемент: власні дані / власний кейс / власний погляд / унікальна статистика
- [ ] Перевірити на плагіат (Copyscape) перед публікацією
- [ ] AI-generated контент — дозволено як чернетка, але обов'язкова редакторська переробка

**Фактична точність:**
- [ ] Всі цифри верифіковані у першоджерелі (не брати статистику з інших SEO блогів)
- [ ] Дати та факти актуальні (не статті з 2021 без оновлення)
- [ ] Назви продуктів, компаній, осіб — перевірені

**E-E-A-T:**
- [ ] Named author з реальними credentials
- [ ] Автор має першоджерельний досвід у темі (не просто перефраз чужих думок)
- [ ] External citations на авторитетні джерела (Google Docs, Harvard, industry reports)
- [ ] "Last Updated" дата для evergreen матеріалу

**Технічна якість:**
- [ ] Правопис та граматика перевірені (Grammarly або LanguageTool)
- [ ] Всі посилання робочі (не broken)
- [ ] Всі зображення мають alt text
- [ ] Schema реалізована та перевірена

---

## 5.4 — Editorial Calendar

**Що робимо:** Плануємо публікації системно — без хаосу та пропусків.

### Принципи:

- [ ] Краще **1 якісна стаття на тиждень** ніж 5 поверхневих
- [ ] Спочатку Pillar Pages → потім Cluster Pages (Google будує topical authority поступово)
- [ ] Чергувати: BoFU сторінки (конверсійні) + ToFU статті (трафік)
- [ ] Планувати мінімум на **4 тижні вперед**
- [ ] Враховувати сезонність: holiday SEO, галузеві події, peak seasons

### Editorial Calendar шаблон:

| Тиждень | URL | Тип | Primary Keyword | Автор | Brief готовий | Написано | Review | Опубліковано |
|---|---|---|---|---|---|---|---|---|
| W1 | | Pillar | | | | | | |
| W2 | | Cluster | | | | | | |
| W3 | | BoFU Service | | | | | | |
| W4 | | Cluster | | | | | | |
| W5 | | Case Study | | | | | | |
| W6 | | Cluster | | | | | | |

### Статуси:
- `📋 Brief` — Brief заповнений, чекає на автора
- `✍️ Writing` — В процесі написання
- `🔍 Review` — На редакторській перевірці
- `✅ Ready` — Готово до публікації
- `🟢 Live` — Опубліковано
- `🔄 Refresh` — Потребує оновлення

---

## 5.5 — Content Refresh Protocol

**Що робимо:** Старі сторінки часто дають кращий ROI ніж нові — якщо їх правильно оновити.

### Коли робити refresh:

| Сигнал | Поріг | Дія |
|---|---|---|
| Падіння трафіку | -20% за 3 місяці | Refresh |
| Падіння позиції | -5 позицій за 2 місяці | Refresh |
| CTR < 2% при позиції 1–5 | Стабільно | Переписати title/meta |
| Контент застарів | > 12 місяців для тактичних тем | Refresh |
| Конкурент зайшов вище | З'явився новий лідер | Deep refresh |
| AI Overview з'явився | Клієнт не в ньому | AEO refresh |

### Процес Content Refresh:

**Крок 1 — Діагностика:**
- [ ] Подивитись GSC: clicks/impressions тренд за 6–12 міс
- [ ] Знайти точку падіння — чи збігається з Google update?
- [ ] Порівняти поточну сторінку з топ-5 у SERP — що змінилось?
- [ ] Виявити пропущені теми через нові PAA питання

**Крок 2 — Рішення:**

| Ситуація | Дія |
|---|---|
| Контент застарів, структура OK | Оновити статистику, дати, факти |
| Пропущені теми | Додати нові секції (H2/H3) |
| Title/meta неоптимальні | Переписати title + meta (без змін тіла) |
| CTR низький, позиція OK | Покращити title + meta description |
| Конкурент значно глибший | Повний rewrite або суттєве розширення |
| Keyword cannibalization | Merge або differentiate |

**Крок 3 — Виконання:**
- [ ] Оновити застарілу статистику + посилання на першоджерела
- [ ] Додати нові секції під нові PAA питання
- [ ] Оновити internal links (нові релевантні сторінки з'явились)
- [ ] Оновити `dateModified` у schema та OG meta
- [ ] Оновити "Last Updated" у видимому тексті
- [ ] Перевірити та оновити всі external links (broken?)
- [ ] Додати нові multimedia якщо SERP вимагає
- [ ] Пройти Pre-Publish QA (4.10)
- [ ] Submit URL у GSC → Request Indexing

**Крок 4 — Відстеження:**
- [ ] Зафіксувати позицію до refresh
- [ ] Знімати позицію через 2, 4, 8 тижнів після
- [ ] Фіксувати у Content Performance Tracker (5.7)

---

## 5.6 — Content для AI Search (AEO-оптимізація)

**Що робимо:** Кожна нова стаття пишеться з урахуванням AI Overviews, Featured Snippets та Perplexity citations.

### AEO Checklist для кожної статті:

**Структура:**
- [ ] H2/H3 сформульовані як питання ("How does X work?", "What is the best Y?")
- [ ] Пряма відповідь у **першому реченні після H2** (не "це складне питання...")
- [ ] Відповідь на H2 питання: 40–80 слів, самодостатня, без посилань на попередні секції

**Definition block** (для "what is X" queries):
```
**[Термін]** — це [визначення у 1 реченні]. [Розширення у 1–2 реченнях з конкретними деталями].
```

**Featured Snippet optimization:**
- [ ] Paragraph snippet: відповідь 40–60 слів прямо під H2
- [ ] List snippet: numbered/bulleted list з ≥ 5 елементів після H2
- [ ] Table snippet: порівняльна таблиця з заголовками рядків і стовпців

**AI citability:**
- [ ] Статистика атрибутована: `"За даними [Джерело], [рік], [факт]"`
- [ ] Конкретні числа > загальні твердження: "340% зростання трафіку" > "значне зростання"
- [ ] Named entities: конкретні компанії, люди, місця (не "один з наших клієнтів")
- [ ] TL;DR блок на початку або Key Takeaways в кінці
- [ ] FAQ секція: 5–8 питань, відповіді 40–70 слів + FAQPage schema

**Perplexity/ChatGPT:**
- [ ] Посилання на зовнішні авторитетні джерела у тексті (Perplexity збирає citations)
- [ ] Статичний HTML — контент видимий без JS виконання

---

## 5.7 — Content Performance Tracker

**Що робимо:** Відстежуємо результати кожного опублікованого матеріалу — це основа для прийняття рішень про refresh та пріоритети.

### Таблиця для щомісячного заповнення:

| URL | Keyword | Дата публікації | Позиція (M1) | Позиція (M3) | Позиція (M6) | Органічний трафік/міс | Conversions | Статус |
|---|---|---|---|---|---|---|---|---|
| | | | | | | | | 🟢 Росте |
| | | | | | | | | 🟡 Стабільно |
| | | | | | | | | 🔴 Падає → Refresh |

### Правила аналізу:

- [ ] **M1 (1 місяць після публікації):** Нормально якщо ще не в топ-10 — Google тестує
- [ ] **M3 (3 місяці):** Повинна бути динаміка вгору. Якщо ні → діагностика
- [ ] **M6 (6 місяців):** Якщо не в топ-20 при правильному brief → або KD завищений, або потрібен deep refresh або більше backlinks
- [ ] Сторінки що ростуть → будувати кластер навколо них (більше cluster pages)
- [ ] Сторінки що падають → trigger для Content Refresh Protocol (5.5)

### Quarterly Content Audit:

- [ ] Раз на квартал: переглянути всі опубліковані сторінки
- [ ] Виявити "content decay": сторінки що були в топ і почали падати
- [ ] Визначити топ-10 сторінок за трафіком → поглибити кластер навколо них
- [ ] Визначити сторінки з нульовим трафіком → merge, noindex або refresh

---

## 5.8 — Content Scaling (для агенцій та великих проєктів)

**Що робимо:** Коли потрібно виробляти 10–50+ статей на місяць — без втрати якості.

### Процес при масштабуванні:

- [ ] **Brief завжди пишемо ми (SEO)** — автор НЕ вигадує структуру сам
- [ ] Використовувати AI (Claude, GPT-4) для:
  - Генерації чернетки на основі brief
  - Розширення секцій
  - Пропозицій для FAQs
  - Перевірки структури
  - НЕ для кінцевого тексту без редактури
- [ ] Редактор перевіряє: фактична точність, E-E-A-T, оригінальність, formatting
- [ ] SEO спеціаліст перевіряє: keyword placement, internal links, schema, Pre-Publish QA

### Workflow при команді:

```
SEO Architect → Content Brief
      ↓
Writer / AI Draft
      ↓
Editor → Fact-check + E-E-A-T + Style
      ↓
SEO Review → Keywords + Links + Schema + QA
      ↓
Publish + GSC Submit
      ↓
Content Performance Tracker (M1 / M3 / M6)
```

### Контроль якості при scale:

- [ ] Випадкова перевірка 20% матеріалів SEO-архітектом
- [ ] Щомісячний аналіз: які автори / типи контенту дають кращий ranking результат
- [ ] A/B тест title tags на сторінках з > 500 impressions (через GSC CTR)

---

## 5.9 — Phase 5 Output

> Результат Phase 5 — функціонуюча контент-машина

- [ ] **Content Brief Template** — готовий та використовується для кожної нової сторінки
- [ ] **Editorial Calendar** — заповнений мінімум на 4 тижні вперед
- [ ] **Перші 4 сторінки опубліковані** (1 Pillar + 2 Cluster + 1 BoFU)
- [ ] **Content Performance Tracker** — налаштований, перші дані внесені (M1)
- [ ] **Content Refresh Queue** — список існуючих сторінок для оновлення

---

---

## SUMMARY: PHASES 0–5 COMPLETION CHECKLIST

| Phase | Виконано? | Результат | Дата |
|---|---|---|---|
| **0.1** Business Intelligence | | Project Card заповнений | |
| **0.2** Baseline Metrics | | Baseline Spreadsheet | |
| **0.3** Competitor Intelligence | | Competitor Dashboard | |
| **1.1** Crawl & Indexability | | Crawl Issues List | |
| **1.2** Canonical & Duplicates | | Duplicate Report | |
| **1.3** URL Architecture | | Architecture Map | |
| **1.4** Core Web Vitals | | CWV Status Report | |
| **1.5** Mobile & Security | | Mobile/Security Checklist | |
| **1.6** Technical Summary | | Prioritized Fix List | |
| **2.1** Entity Audit | | Entity Status | |
| **2.2** NAP Consistency | | NAP Audit Table | |
| **2.3** Schema Audit | | Schema Implementation Plan | |
| **2.4** E-E-A-T Gap Analysis | | E-E-A-T Gap Report | |
| **2.5** llms.txt | | llms.txt готовий/оновлений | |
| **3.1** Seed Keywords | | Seed list (10–20 terms) | |
| **3.2** Keyword Expansion | | Keyword Master List | |
| **3.3** Keyword Classification | | Класифікований Master List | |
| **3.4** Topical Authority Map | | Cluster Map | |
| **3.5** SERP Analysis | | SERP Analysis Table | |
| **3.6** Content Plan | | Content Queue | |
| **4.0** Черга сторінок | | Priority Page List | |
| **4.1** Title Tags | | Title Tag Audit + правки | |
| **4.2** Meta Descriptions | | Meta Audit + правки | |
| **4.3** Heading Structure | | H1/H2/H3 Audit + правки | |
| **4.4** URL Slugs | | URL Audit | |
| **4.5** Internal Linking | | Link Audit + Orphan Fix | |
| **4.6** Content Elements | | Images, keywords, links | |
| **4.7** OG & Social Meta | | OG tags на всіх пріоритетних | |
| **4.8** Content Formatting | | Formatting Review | |
| **4.9** On-Page Audit (сторінки) | | On-Page Audit Sheets | |
| **4.10** Pre-Publish QA | | QA Checklist ✅ кожна сторінка | |
| **4.11** Optimization Tracker | | Position tracking таблиця | |
| **5.1** Content Brief | | Brief template готовий | |
| **5.2** Типи контенту | | Формат обрано для кожної сторінки | |
| **5.3** Production Standards | | Checklist якості | |
| **5.4** Editorial Calendar | | Calendar заповнений на 4 тижні | |
| **5.5** Content Refresh Protocol | | Refresh queue визначена | |
| **5.6** AEO-оптимізація | | AEO checklist виконаний | |
| **5.7** Performance Tracker | | Tracker налаштований | |
| **5.8** Content Scaling | | Workflow для команди | |
| **5.9** Phase 5 Output | | Перші 4 сторінки live | |

---

---

# PHASE 6 — AI SEARCH OPTIMIZATION (GEO / AEO / SGE)

> **Мета:** Зробити сайт видимим та цитованим у AI-powered пошуку — Google AI Overviews, ChatGPT, Perplexity, Bing Copilot, Apple Intelligence. У 2026 це вже не "майбутнє" — це реальний трафік-канал.
> **Час:** 8–12 годин (початкове налаштування) + ongoing моніторинг
> **Дедлайн:** Паралельно з Phase 2–5, не після
> **Результат:** AI Accessibility Audit, llms.txt оновлений, AEO checklist виконаний, AI Visibility Score зафіксований

---

## 6.0 — Базові поняття (швидкий довідник)

| Термін | Що означає | Де з'являється |
|---|---|---|
| **SGE / AI Overviews** | Згенерована відповідь Google над органічною видачею | Google SERP |
| **GEO** | Generative Engine Optimization — оптимізація під AI-генеровані відповіді | ChatGPT, Perplexity, Google SGE |
| **AEO** | Answer Engine Optimization — оптимізація під пряму відповідь на питання | Featured Snippets, PAA, AI Overviews |
| **Zero-click** | Користувач отримав відповідь у SERP і не клікнув | AI Overviews, Featured Snippets |
| **Citation** | Сайт згаданий / процитований у AI-відповіді | ChatGPT, Perplexity, Gemini |
| **Passage-level indexing** | Google індексує та ранжує окремі пасажі тексту | AI Overviews, Featured Snippets |
| **llms.txt** | Файл-інструкція для AI crawlers (аналог robots.txt) | Корінь сайту |
| **Entity** | Чітко ідентифікований об'єкт у Knowledge Graph Google | Google Knowledge Panel |

---

## 6.1 — AI Crawler Access Audit

**Що робимо:** Перевіряємо чи всі AI системи фізично можуть сканувати сайт. Якщо ні — жодна оптимізація не допоможе.

### Повний список AI crawlers 2026:

- [ ] Відкрити `https://domain.com/robots.txt`
- [ ] Перевірити наявність та коректність кожного:

  | Crawler | Система | Потрібен | Є в robots.txt | Allow: / |
  |---|---|---|---|---|
  | `GPTBot` | OpenAI (ChatGPT training) | ✅ | | |
  | `OAI-SearchBot` | OpenAI (ChatGPT live search) | ✅ | | |
  | `ClaudeBot` | Anthropic | ✅ | | |
  | `anthropic-ai` | Anthropic (альтернативний) | ✅ | | |
  | `Google-Extended` | Google (AI training + Bard/Gemini) | ✅ | | |
  | `PerplexityBot` | Perplexity AI | ✅ | | |
  | `Applebot-Extended` | Apple Intelligence | ✅ | | |
  | `cohere-ai` | Cohere | 🟡 Бажано | | |
  | `CCBot` | Common Crawl (база для багатьох AI) | 🟡 Бажано | | |
  | `Bytespider` | ByteDance / TikTok | 🟡 Бажано | | |
  | `Amazonbot` | Amazon Alexa / AWS AI | 🟡 Бажано | | |

### Критична перевірка — порядок директив:

- [ ] ❗ Перевірити: чи не перекривають named AI-blocks загальний `Disallow`?

  **Правильна структура (named блоки ДО wildcard або з повним Allow):**
  ```
  # AI Crawlers — повний доступ
  User-agent: GPTBot
  Allow: /

  User-agent: OAI-SearchBot
  Allow: /

  User-agent: ClaudeBot
  Allow: /

  User-agent: anthropic-ai
  Allow: /

  User-agent: Google-Extended
  Allow: /

  User-agent: PerplexityBot
  Allow: /

  User-agent: Applebot-Extended
  Allow: /

  # Загальний wildcard
  User-agent: *
  Allow: /published-path-1
  Allow: /published-path-2
  Disallow: /private/
  Disallow: /admin/

  Sitemap: https://domain.com/sitemap.xml
  ```

  **Проблема:** Якщо named AI-блок стоїть ПІСЛЯ wildcard з `Disallow: /some-section/` — поведінка парсерів різна. Частина AI crawlers успадковує wildcard правила, інші — ні. **Рішення: завжди ставити AI-блоки першими або повторювати Allow директиви.**

- [ ] Перевірити рендеринг: AI crawlers отримують той самий HTML що й Google?
  - Static HTML → ✅ ідеально
  - Client-side rendering (React, Vue без SSR) → ⚠️ AI crawler може не бачити контент
  - SSR / SSG (Next.js, Nuxt) → ✅ добре

  ```
  Тип рендерингу сайту: [Static / SSR / CSR]
  AI crawlers бачать повний контент: [Yes / No / Partial]
  ```

---

## 6.2 — llms.txt — Повний Аудит та Реалізація

**Що робимо:** Створюємо або вдосконалюємо файл-інструкцію для AI систем. Це аналог robots.txt — але не для блокування, а для навігації та контексту.

### Аудит існуючого llms.txt:

- [ ] Перевірити: `https://domain.com/llms.txt` → статус 200?
- [ ] Якщо файл є — оцінити якість по кожному критерію:

  | Критерій | Є | Якість (1–5) | Що покращити |
  |---|---|---|---|
  | `#` Name — канонічна назва | | | |
  | `>` Tagline — одне речення що робить бізнес | | | |
  | Опис (3–5 речень) | | | |
  | Founding date (узгоджена з schema!) | | | |
  | Контактні дані (phone, email, address) | | | |
  | `## Pages` з URL + description | | | |
  | `## Optional` — менш пріоритетний контент | | | |
  | Ліцензійний statement | | | |
  | Pricing (якщо публічне) | | | |
  | Services список | | | |
  | Stats / credentials | | | |

### Шаблон якісного llms.txt:

```markdown
# [Канонічна назва компанії]

> [Одне речення: хто ви, що робите, для кого, де]

[Параграф 1: Розширений опис — послуги, підхід, результати]
[Параграф 2: Географія, клієнти, унікальна перевага]

Founded: [РРРР] | Location: [Місто, Країна]
Phone: [+1XXXXXXXXXX] | Email: [email] | Web: https://domain.com

## Services
- [Service 1]
- [Service 2]
- [Service 3]

## Pricing
- [Plan 1]: від $X/міс — [що включено]
- [Plan 2]: від $X/міс — [що включено]

## Stats
- [Кількість] клієнтів обслуговано
- [Цифра] — ключовий результат
- [Цифра] — retention або satisfaction

## Pages

- https://domain.com/: Головна сторінка — огляд послуг та підходу
- https://domain.com/about: Команда, досвід та історія компанії з [рік]
- https://domain.com/services/seo: SEO-послуги — що включено, процес, терміни
- https://domain.com/pricing: Прозорі тарифи — що входить у кожен план
- https://domain.com/blog/[slug]: [Що відповідає стаття — 1 речення]
- https://domain.com/blog/[slug]: [Що відповідає стаття — 1 речення]
- https://domain.com/contact: Контактна інформація та форма для запиту

## Optional

- https://domain.com/privacy-policy: Політика конфіденційності
- https://domain.com/terms: Умови використання

## For AI Systems
Content on this site may be cited with attribution to [Назва компанії] (https://domain.com).
Full reproduction requires written permission. Data cited as "[Назва], [рік]."
```

### Правило узгодженості:

- [ ] Founding date у llms.txt = founding date у всіх schema instances
- [ ] Business name у llms.txt = канонічна назва скрізь
- [ ] Phone у llms.txt = E.164 формат як у schema
- [ ] URLs у `## Pages` → всі 200-статус, canonical, indexed

---

## 6.3 — Google AI Overviews Optimization

**Що робимо:** Оптимізуємо під Google's AI Overviews (колишній SGE) — найбільший AI-трафік ризик та можливість одночасно.

### Діагностика:

- [ ] Для кожного топ-20 target keyword — перевірити SERP:
  - AI Overview активний? (Так / Ні)
  - Клієнт цитується у AI Overview? (Так / Ні / Частково)
  - Хто цитується у AI Overview? (записати конкурентів)

  | Keyword | AI Overview? | Клієнт у ньому? | Хто в ньому | Що нам бракує |
  |---|---|---|---|---|
  | | | | | |
  | | | | | |

### Фактори потрапляння у AI Overview:

- [ ] **E-E-A-T** — автор з credentials, named expert, dated content
- [ ] **Структура** — H2/H3 як питання, пряма відповідь першим реченням
- [ ] **FAQPage schema** — Google безпосередньо використовує для AI Overviews
- [ ] **Цитованість** — сторінка вже ранжується в топ-10 (AI Overview бере з топ органіки)
- [ ] **Корисний контент** — оригінальна інформація, не перефраз

### Content adjustments для AI Overview eligibility:

- [ ] Додати **"Quick Answer"** блок після H1 (40–60 слів, пряма відповідь на головне питання сторінки)
- [ ] Кожна H2 = питання → перше речення після H2 = пряма відповідь
- [ ] Додати **Summary / Key Takeaways** блок наприкінці
- [ ] FAQ секція: 5–8 питань, відповіді 40–70 слів, FAQPage schema
- [ ] Статистика з атрибуцією — AI Overview цитує конкретні дані
- [ ] Уникати clickbait headlines — AI Overview ігнорує "сенсаційні" заголовки

### Zero-click стратегія:

> AI Overview = потенційна втрата кліків. Але це не завжди погано.

- [ ] Якщо keyword = ToFU informational → AI Overview OK, основний трафік іде на BoFU anyway
- [ ] Якщо keyword = BoFU transactional → AI Overview рідко з'являється (добре)
- [ ] Якщо AI Overview з'явився на BoFU keyword → потрібно потрапити в нього (branded citation = trust)
- [ ] Моніторити CTR через GSC: якщо impressions → але clicks падають → AI Overview з'явився

---

## 6.4 — Featured Snippets (Позиція 0)

**Що робимо:** Featured Snippet = позиція 0 — вище всіх органічних результатів. Основа для AEO.

### Діагностика:

- [ ] У GSC: знайти keywords де є impressions але позиція 1–3 і є "Featured snippet" у SERP
- [ ] Ahrefs → Site Explorer → Organic Keywords → SERP features → Featured snippet
- [ ] Зафіксувати: які keywords вже мають FS і хто займає

  | Keyword | Поточний власник FS | URL власника | Наша позиція | Можемо зайняти? |
  |---|---|---|---|---|
  | | | | | |

### Оптимізація під 3 формати:

**Paragraph Snippet** (відповідь на "what is" / "why" / "how"):
```
H2: What Is [Термін]?

[Термін] — це [визначення у 1 реченні, 10–15 слів].
[Розширення: контекст + ключовий факт, разом 40–60 слів].
```

**List Snippet** (відповідь на "how to" / "steps" / "types of"):
```
H2: How to [Дія] (або: [N] Steps to [Result])

1. [Крок — дієслово + об'єкт]
2. [Крок]
3. [Крок]
4. [Крок]
5. [Крок]
[Мінімум 5 пунктів — Google зазвичай показує 5–8]
```

**Table Snippet** (порівняння, ціни, характеристики):
```
| Варіант | Характеристика 1 | Характеристика 2 | Ціна |
|---|---|---|---|
| Option A | | | |
| Option B | | | |
```

- [ ] Для кожного target snippet keyword → перевірити чи є потрібна структура на сторінці
- [ ] Якщо немає → додати у рамках Content Refresh (5.5)

---

## 6.5 — ChatGPT & Perplexity Optimization

**Що робимо:** ChatGPT (через GPTBot + OAI-SearchBot) та Perplexity — це окремі AI системи зі своєю логікою цитування. Оптимізація відрізняється від Google.

### ChatGPT:

- [ ] `GPTBot` дозволений у robots.txt (training data)
- [ ] `OAI-SearchBot` дозволений у robots.txt (live ChatGPT search — ❗ окремий від GPTBot!)
- [ ] Контент статично доступний (не за JS)
- [ ] Бренд згадується на зовнішніх авторитетних сайтах (ChatGPT cross-references the web)
- [ ] Перевірити вручну: запитати ChatGPT про компанію → чи знає? що відповідає?

  ```
  ChatGPT prompt: "What is [Company Name]? What services do they offer?"
  Результат: [записати відповідь]
  Проблеми: [неправильна дата / неправильна інфо / не знає взагалі]
  Дія: [виправити дані в schema / llms.txt / зовнішніх джерелах]
  ```

### Perplexity:

- [ ] `PerplexityBot` дозволений у robots.txt
- [ ] Статичний HTML — Perplexity не рендерить JavaScript
- [ ] Структурований контент: списки, таблиці, чіткі абзаци
- [ ] Зовнішні посилання у тексті на авторитетні джерела (Perplexity будує citation chain)
- [ ] FAQPage schema → Perplexity любить Q&A структуру
- [ ] Перевірити вручну:

  ```
  Perplexity prompt: "[Primary keyword клієнта]" або "best [service] in [city]"
  Результат: [чи є клієнт у citations?]
  Дія: [якщо немає — посилити authority signals + external citations]
  ```

---

## 6.6 — Bing Copilot & Microsoft AI

**Що робимо:** Bing = основа для Copilot (Microsoft 365, Edge, Windows). Окрема екосистема від Google.

- [ ] Верифікувати сайт у **Bing Webmaster Tools** (bingewmaster tools.com)
- [ ] Підключити Sitemap у Bing Webmaster Tools → submit
- [ ] Активувати **IndexNow** (миттєва нотифікація Bing про нові/оновлені сторінки):
  - Для WordPress: плагін Bing IndexNow або Rank Math
  - Для інших CMS: API інтеграція або Cloudflare IndexNow
  - Для статичного сайту: POST запит до `https://api.indexnow.org/indexnow` після кожної зміни
- [ ] Перевірити Bing coverage: скільки сторінок проіндексовано vs Google
- [ ] Перевірити Bing Mobile Friendliness у Bing Webmaster Tools

  ```
  Bing Webmaster Tools верифіковано: [Yes / No]
  Sitemap подано: [Yes / No]
  IndexNow активовано: [Yes / No]
  Сторінок у Bing індексі:
  ```

---

## 6.7 — Entity & Knowledge Graph Signals

**Що робимо:** AI системи будують свої відповіді на основі Knowledge Graph — чим чіткіша entity клієнта, тим частіше вона цитується.

### Entity Clarity Checklist:

- [ ] **Одна канонічна назва** скрізь (site + всі зовнішні профілі)
- [ ] **Founding date** — одна, правильна, скрізь (schema + llms.txt + body copy + зовнішні)
- [ ] **sameAs** у schema → всі верифіковані платформи з правильними URL
- [ ] **YouTube** канал пов'язаний із сайтом (найвищий AI citation correlation: ~0.737)
- [ ] **Wikipedia/Wikidata** — якщо є Q-item, верифікувати та оновити дані
- [ ] **Crunchbase / Clutch** — профілі claimed, дані коректні, URL у sameAs

### Branded Search Optimization:

- [ ] Загуглити brand name → що показує Google (Knowledge Panel, site links, reviews)?
- [ ] Якщо Knowledge Panel відсутній → посилити entity signals:
  - Більше sameAs посилань
  - Wikidata Q-item
  - Прес-покриття на авторитетних сайтах
- [ ] Якщо Knowledge Panel є але дані неправильні → використати "Suggest an edit" або GSC

### AI Citation Correlation Factors (дані досліджень 2025–2026):

| Фактор | Кореляція з AI citations | Дія |
|---|---|---|
| YouTube channel present | ~0.737 | Підключити + embed відео на сторінках |
| Named authors with credentials | Висока | Author schema + bylines на всіх статтях |
| FAQPage schema | Висока | Додати на всі informational сторінки |
| External citations in content | Висока | Посилатись на авторитетні джерела |
| Statistic-heavy content | Середня-Висока | Sourced stats > general claims |
| Wikipedia mentions | Висока | PR + Wikidata entity |
| Clutch / G2 / Trustpilot profile | Середня | Claimed verified profiles |
| Podcast appearances | Середня | Appearing на галузевих подкастах |

---

## 6.8 — Passage-Level Citability Audit

**Що робимо:** AI системи витягують не сторінки, а **пасажі** — конкретні абзаци та речення. Оптимізуємо на рівні параграфу.

### Self-contained passage test:

Для кожного ключового абзацу задати собі питання:
> "Якби AI система взяла тільки цей абзац — він має самостійний зміст?"

- ✅ **Так** — абзац самодостатній, містить subject, fact, context
- ❌ **Ні** — абзац посилається на попередній текст ("як ми вже сказали...", "цей метод...")

### Citation-ready passage formula:

```
[Named entity / Subject] + [конкретна дія / факт] + [число або специфіка] + [контекст або наслідок].

Приклад:
"Boomy Marketing's SEO campaigns increased organic traffic for Toronto-based e-commerce 
clients by an average of 340% over 12 months, measured across 23 client accounts 
between 2024 and 2025."
```

### Аудит пасажів на топ-5 сторінках:

- [ ] Відкрити кожну пріоритетну сторінку
- [ ] Знайти та відмітити: скільки citation-ready пасажів на сторінці?
- [ ] Ціль: мінімум **3–5 citation-ready пасажів** на кожній пріоритетній сторінці
- [ ] Де не вистачає → переписати абзаци за формулою вище

  | URL | Citation-ready пасажів (зараз) | Ціль | Дія |
  |---|---|---|---|
  | | | 3–5 | |
  | | | 3–5 | |

---

## 6.9 — AI Visibility Monitoring

**Що робимо:** Регулярно вимірюємо де і як бренд згадується в AI відповідях.

### Щомісячний AI Visibility Check:

- [ ] **ChatGPT** (gpt-4o або останній):

  ```
  Запити для перевірки:
  1. "What is [Company Name]?"
  2. "Best [service] agency in [city]"
  3. "[Primary service keyword] — top companies"
  4. "[Specific industry problem] — how to solve it"

  Фіксувати:
  - Чи згадується компанія?
  - Які дані наводяться? (точні / хибні?)
  - Чи є посилання на сайт?
  ```

- [ ] **Perplexity** (perplexity.ai):

  ```
  Аналогічні запити + "Sources" tab → чи є сайт клієнта у sources?
  ```

- [ ] **Google AI Overview** (через Google Search):

  ```
  Топ-10 branded + non-branded queries → чи є клієнт у AI Overview?
  ```

- [ ] **Gemini** (gemini.google.com):

  ```
  Запити про компанію та послуги → що відповідає?
  ```

### AI Visibility Score (щомісячна таблиця):

| Місяць | ChatGPT | Perplexity | Google SGE | Gemini | Загальний score | Дія |
|---|---|---|---|---|---|---|
| | Так/Ні | Так/Ні | Так/Ні | Так/Ні | /4 | |
| | | | | | | |

### Якщо AI системи дають хибну інформацію:

- [ ] Виправити дані у schema (першоджерело для Knowledge Graph)
- [ ] Оновити llms.txt
- [ ] Оновити Wikidata Q-item (якщо є)
- [ ] Оновити Crunchbase / Clutch профілі
- [ ] Publish корегуючий контент на сайті (блог-пост або About page update)
- [ ] ❗ Неможливо "видалити" хибну інформацію з AI напряму — тільки через виправлення джерел

---

## 6.10 — AI Search Action Plan (Пріоритизований)

> Заповнити на початку проєкту. Оновлювати щоквартально.

### 🔴 КРИТИЧНО (зробити протягом 1 тижня):

- [ ] Верифікувати доступ всіх AI crawlers у robots.txt (6.1)
- [ ] Перевірити порядок директив у robots.txt — нема конфліктів (6.1)
- [ ] Уніфікувати founding date скрізь (schema + llms.txt + body copy) (Phase 2)
- [ ] Уніфікувати канонічну назву компанії скрізь (Phase 2)

### 🟠 HIGH (протягом 2 тижнів):

- [ ] Створити або повністю оновити llms.txt з `## Pages` секцією (6.2)
- [ ] Додати FAQPage schema на всі informational сторінки (Phase 2)
- [ ] Додати named authors з credentials на всі статті (Phase 2)
- [ ] Додати OAI-SearchBot до robots.txt (6.1)
- [ ] Верифікувати сайт у Bing Webmaster Tools + подати sitemap (6.6)

### 🟡 MEDIUM (протягом місяця):

- [ ] Переписати ключові абзаци у citation-ready format (6.8)
- [ ] Додати Quick Answer блок після H1 на пріоритетних сторінках (6.3)
- [ ] Активувати IndexNow для Bing (6.6)
- [ ] Перевірити ChatGPT та Perplexity вручну → зафіксувати baseline (6.9)
- [ ] Додати YouTube відео (власні або embedded) на ключові сторінки (6.7)
- [ ] Заповнити та верифікувати Clutch / G2 профілі (6.7)

### 🟢 LOW / ONGOING:

- [ ] Щомісячний AI Visibility Check (6.9)
- [ ] Моніторинг нових AI crawlers та оновлення robots.txt
- [ ] Пресс-покриття та earned media для Knowledge Graph signals
- [ ] Podcast appearances та speaking engagements

---

## 6.11 — Phase 6 Output

- [ ] **AI Crawler Access Audit** — всі crawler-и дозволені, конфліктів немає
- [ ] **llms.txt** — готовий, якісний, узгоджений з schema
- [ ] **AI Overview Map** — зафіксовано які keywords мають AI Overview та чи клієнт там є
- [ ] **Featured Snippet targets** — виявлені та внесені у Content Refresh Queue
- [ ] **Bing Webmaster Tools** — верифіковано, sitemap подано, IndexNow активовано
- [ ] **AI Visibility Baseline** — перший моніторинг проведений, результати зафіксовані
- [ ] **Citation-ready passages** — додані на топ-5 пріоритетних сторінках

---

---

## SUMMARY: PHASES 0–6 COMPLETION CHECKLIST

| Phase | Виконано? | Результат | Дата |
|---|---|---|---|
| **0.1** Business Intelligence | | Project Card заповнений | |
| **0.2** Baseline Metrics | | Baseline Spreadsheet | |
| **0.3** Competitor Intelligence | | Competitor Dashboard | |
| **1.1** Crawl & Indexability | | Crawl Issues List | |
| **1.2** Canonical & Duplicates | | Duplicate Report | |
| **1.3** URL Architecture | | Architecture Map | |
| **1.4** Core Web Vitals | | CWV Status Report | |
| **1.5** Mobile & Security | | Mobile/Security Checklist | |
| **1.6** Technical Summary | | Prioritized Fix List | |
| **2.1** Entity Audit | | Entity Status | |
| **2.2** NAP Consistency | | NAP Audit Table | |
| **2.3** Schema Audit | | Schema Implementation Plan | |
| **2.4** E-E-A-T Gap Analysis | | E-E-A-T Gap Report | |
| **2.5** llms.txt | | llms.txt готовий/оновлений | |
| **3.1** Seed Keywords | | Seed list (10–20 terms) | |
| **3.2** Keyword Expansion | | Keyword Master List | |
| **3.3** Keyword Classification | | Класифікований Master List | |
| **3.4** Topical Authority Map | | Cluster Map | |
| **3.5** SERP Analysis | | SERP Analysis Table | |
| **3.6** Content Plan | | Content Queue | |
| **4.0** Черга сторінок | | Priority Page List | |
| **4.1** Title Tags | | Title Tag Audit + правки | |
| **4.2** Meta Descriptions | | Meta Audit + правки | |
| **4.3** Heading Structure | | H1/H2/H3 Audit + правки | |
| **4.4** URL Slugs | | URL Audit | |
| **4.5** Internal Linking | | Link Audit + Orphan Fix | |
| **4.6** Content Elements | | Images, keywords, links | |
| **4.7** OG & Social Meta | | OG tags на всіх пріоритетних | |
| **4.8** Content Formatting | | Formatting Review | |
| **4.9** On-Page Audit (сторінки) | | On-Page Audit Sheets | |
| **4.10** Pre-Publish QA | | QA Checklist ✅ кожна сторінка | |
| **4.11** Optimization Tracker | | Position tracking таблиця | |
| **5.1** Content Brief | | Brief template готовий | |
| **5.2** Типи контенту | | Формат обрано для кожної сторінки | |
| **5.3** Production Standards | | Checklist якості | |
| **5.4** Editorial Calendar | | Calendar заповнений на 4 тижні | |
| **5.5** Content Refresh Protocol | | Refresh queue визначена | |
| **5.6** AEO-оптимізація | | AEO checklist виконаний | |
| **5.7** Performance Tracker | | Tracker налаштований | |
| **5.8** Content Scaling | | Workflow для команди | |
| **5.9** Phase 5 Output | | Перші 4 сторінки live | |
| **6.1** AI Crawler Access | | Всі crawlers дозволені | |
| **6.2** llms.txt повний аудит | | llms.txt якісний + узгоджений | |
| **6.3** Google AI Overviews | | AI Overview Map + правки | |
| **6.4** Featured Snippets | | Snippet targets виявлені | |
| **6.5** ChatGPT & Perplexity | | Ручна перевірка + baseline | |
| **6.6** Bing Copilot | | BWT верифіковано + IndexNow | |
| **6.7** Entity & Knowledge Graph | | sameAs, YouTube, Clutch | |
| **6.8** Passage-Level Citability | | Citation-ready пасажі додані | |
| **6.9** AI Visibility Monitoring | | Щомісячний tracker готовий | |
| **6.10** AI Action Plan | | Critical fixes виконані | |
| **6.11** Phase 6 Output | | Всі deliverables готові | |

---

> **Далі: Phase 8 — Link Building | Phase 9 — Analytics & Reporting | Phase 10 — Ongoing Cadence**
> Скажи "Переходимо до Phase 8" — і продовжимо.

---

---

# PHASE 7 — LOCAL SEO

> **Мета:** Домінувати у локальній видачі Google (Local Pack, Maps, Local Finder) та AI-локальних відповідях для всіх цільових міст та послуг.
> **Застосовується для:** Brick-and-mortar / Service Area Business (SAB) / Multi-location / Hybrid
> **Час:** 8–20 годин початкове налаштування + ongoing щомісячно
> **Дедлайн:** День 7–14 (GBP) + паралельно з Phase 4–5 (local pages)
> **Результат:** GBP повністю оптимізований, NAP уніфікований, local pages живі та якісні

---

## 7.0 — Визначення типу бізнесу

**Що робимо:** Від типу бізнесу залежить вся Local SEO стратегія — особливо налаштування GBP.

- [ ] Визначити тип:

  | Тип | Опис | GBP Налаштування |
  |---|---|---|
  | **Storefront** | Клієнти приходять до офісу/магазину | Адреса публічна, карта embedded |
  | **SAB (Service Area Business)** | Виїжджаємо до клієнтів, свій офіс не показуємо | Адреса прихована в GBP, вказуємо service areas |
  | **Hybrid** | І офіс є, і виїзд до клієнтів | Адреса публічна + service areas |
  | **Multi-location** | Кілька фізичних локацій | Окремий GBP listing для кожної |

  ```
  Тип бізнесу клієнта: [Storefront / SAB / Hybrid / Multi-location]
  Фізична адреса (якщо є):
  Service areas (якщо SAB):
  Кількість локацій:
  ```

- [ ] ❗ **SAB помилка #1:** Вказати адресу публічно в GBP якщо бізнес — SAB → Google може зняти listing
- [ ] ❗ **Storefront помилка #1:** Приховати адресу → втрата Local Pack rankings

---

## 7.1 — Google Business Profile (GBP) Аудит

**Що робимо:** GBP — головний Local SEO актив. Більшість local pack rankings визначається GBP сигналами.

### Базова верифікація:

- [ ] GBP listing claimed та верифікований?
  ```
  GBP URL: https://business.google.com/...
  Верифікований: [Yes / No / Pending]
  Метод верифікації: [Postcard / Phone / Video / Instant]
  ```

- [ ] Перевірити статус listing: `Active` (не `Suspended` або `Pending`)
- [ ] Перевірити дублікати: чи є кілька listings для одного бізнесу? → merge або report

### Категорії:

- [ ] **Primary category** — найточніша до core business (критично для Local Pack)
  ```
  Поточна primary category:
  Рекомендована (якщо інша):
  ```
- [ ] **Secondary categories** (до 9): всі релевантні послуги
  ```
  Поточні secondary categories:
  Додати:
  Прибрати (нерелевантні):
  ```
- [ ] Перевірити категорії конкурентів у Local Pack → чи використовують вони категорії яких немає у нас?

### Business Description:

- [ ] Довжина: до 750 символів (використати повністю)
- [ ] Включає primary keyword природно
- [ ] Включає service areas або ключові міста
- [ ] Включає USP (унікальна перевага)
- [ ] НЕ містить: посилань, промо-акцій, хибних тверджень

  ```
  Поточний опис (символів):
  Проблеми:
  Новий опис:
  ```

### Photos & Media:

- [ ] Мінімум **10 фото** на старті (ціль — 25+)
- [ ] Обов'язкові типи фото:

  | Тип фото | Є | Кількість | Якість |
  |---|---|---|---|
  | Logo | | | |
  | Cover photo (1080×608px) | | | |
  | Exterior (вхід, будівля) | | | |
  | Interior (офіс, простір) | | | |
  | Team / people at work | | | |
  | Products / work samples | | | |
  | "At work" / service delivery | | | |

- [ ] ❌ Стокові фото → негативний сигнал, замінити на реальні
- [ ] Відео: додати 1–3 коротких відео (30 сек – 3 хв): офіс, команда, процес роботи
- [ ] Перевіряти customer-uploaded photos регулярно (неякісні → flag for removal)

### Business Info — повнота:

- [ ] Телефон (E.164 формат: +1XXXXXXXXXX)
- [ ] Website URL (без UTM — clean URL)
- [ ] Business hours (включно зі special hours для holidays)
- [ ] Appointment/booking link (якщо є)
- [ ] Service menu (для service businesses)
- [ ] Products (для product businesses)
- [ ] Attributes (відповідно до категорії: "Women-owned", "LGBTQ+ friendly", "Online appointments" тощо)
- [ ] "From the Business" опис заповнений

### GBP Audit Summary:

  | Елемент | Поточний стан | Що виправити | Пріоритет |
  |---|---|---|---|
  | Primary category | | | |
  | Description | | | |
  | Photos | | | |
  | Business hours | | | |
  | Attributes | | | |
  | Services/Products | | | |
  | Website URL | | | |

---

## 7.2 — NAP Consistency (Name, Address, Phone)

**Що робимо:** Навіть один символ різниці у NAP між джерелами — сигнал недовіри для Google. Уніфікуємо скрізь.

### Крок 1 — Визначити канонічний NAP:

```
Канонічна назва: [точно як у GBP — наприклад "Boomy Marketing Agency"]
Адреса: [вулиця, місто, провінція/штат, поштовий індекс]
Телефон: [+1XXXXXXXXXX — E.164]
Website: [https://domain.com — без trailing slash]
```

### Крок 2 — Аудит по всіх точках:

  | Джерело | Назва | Адреса | Телефон | Відповідає? |
  |---|---|---|---|---|
  | GBP listing | | | | |
  | Homepage schema | | | | |
  | Contact page schema | | | | |
  | About page schema | | | | |
  | Footer сайту | | | | |
  | Local pages schema | | | | |
  | Yelp | | | | |
  | Yellow Pages | | | | |
  | BBB | | | | |
  | Facebook | | | | |
  | LinkedIn | | | | |
  | Apple Maps | | | | |
  | Bing Places | | | | |

### Крок 3 — Виправлення:

- [ ] Для кожної розбіжності → виправити вручну або через citation management tool
- [ ] Пріоритет виправлення: GBP → сайт (schema) → Tier 1 directories → решта
- [ ] Формат телефону у `tel:` href: `href="tel:+1XXXXXXXXXX"` (не `(XXX) XXX-XXXX`)

---

## 7.3 — Citation Building

**Що робимо:** Citations = згадки NAP на зовнішніх сайтах. Чим більше якісних citations — тим вища Local Pack видимість.

### Tier 1 — Обов'язкові (зробити в першу чергу):

  | Directory | URL | Статус | NAP коректний |
  |---|---|---|---|
  | Google Business Profile | business.google.com | | |
  | Bing Places | bingplaces.com | | |
  | Apple Maps Connect | mapsconnect.apple.com | | |
  | Yelp | yelp.ca / yelp.com | | |
  | Yellow Pages Canada | yellowpages.ca | | |
  | Canada411 | canada411.ca | | |
  | BBB Canada | bbb.org | | |
  | Facebook Business | facebook.com | | |
  | LinkedIn Company | linkedin.com | | |

### Tier 2 — Галузеві директорії (для digital marketing agency):

  | Directory | URL | Статус |
  |---|---|---|
  | Clutch.co | clutch.co | |
  | Agency Spotter | agencyspotter.com | |
  | DesignRush | designrush.com | |
  | Sortlist | sortlist.ca | |
  | G2 | g2.com | |
  | Trustpilot | trustpilot.com | |
  | Expertise.com | expertise.com | |
  | Upcity | upcity.com | |
  | Bark.com | bark.com | |

### Tier 3 — Локальні директорії (для Канади):

  | Directory | Актуально для | Статус |
  |---|---|---|
  | TorontoDirectory.ca | Toronto | |
  | VancouverBusiness.com | Vancouver | |
  | CalgaryBusiness.com | Calgary | |
  | LocalPages.ca | Multi-city | |
  | Canpages.ca | Canada-wide | |

### Citation Management:

- [ ] Використати BrightLocal або Whitespark для автоматичного аудиту citations
- [ ] Виявити та виправити duplicate listings (навіть один дублікат шкодить)
- [ ] Після додавання citation → перевірити через 2–4 тижні чи живий

---

## 7.4 — Review Strategy

**Що робимо:** Відгуки = #1 Local Pack ranking фактор та #1 conversion фактор для local businesses.

### Поточний стан відгуків:

  ```
  GBP рейтинг:         /5.0
  Кількість відгуків:
  Останній відгук (дата):
  Відповіді на відгуки: [Є / Немає / Частково]
  Review velocity (нових/міс):
  ```

- [ ] ❗ **Sterling Sky 18-day rule:** Якщо останній відгук > 18 днів тому → GBP rankings падають. Потрібна постійна velocity, не spike-and-drop.

### Review Generation Process:

- [ ] Визначити точку запиту відгуку (після delivery, після закриття проєкту, через N днів)
- [ ] Створити короткий GBP review link: Google → GBP → Get more reviews → Copy link
- [ ] Налаштувати автоматичний review request:
  - Email / SMS через CRM (після завершення послуги)
  - Шаблон запиту: персональний, конкретний, без тиску

  **Шаблон email:**
  ```
  Тема: Як пройшла наша робота разом, [Ім'я]?

  Привіт [Ім'я],

  Дякуємо що обрали [Назва компанії]. Нам важливо знати ваш досвід.

  Якщо у вас є хвилина — будемо вдячні за відгук на Google:
  [GBP short link]

  З повагою,
  [Ім'я менеджера]
  ```

- [ ] ❌ НЕ пропонувати знижки або подарунки за відгук (Google Terms violation)
- [ ] ❌ НЕ просити залишити відгук на робочому місці клієнта (Google Terms violation)
- [ ] ❌ НЕ купувати fake відгуки (ризик GBP suspension)

### Response Protocol:

- [ ] **Позитивні відгуки:** відповідати протягом 48 год
  - Персоналізована відповідь (не copy-paste)
  - Згадати конкретну деталь з відгуку
  - Подякувати + підкреслити USP
  - Природно включити 1–2 keywords

  **Шаблон:**
  ```
  Дякуємо за чудовий відгук, [Ім'я]! Ми раді чути що [конкретний результат/деталь з відгуку].
  Команда [Назва] завжди прагне [USP]. Чекаємо на подальшу співпрацю!
  ```

- [ ] **Негативні відгуки:** відповідати протягом 24 год
  - Empathy першим: визнати проблему без виправдань
  - Запропонувати вирішення (offline якщо деталі приватні)
  - Не сперечатись публічно
  - Не видаляти — Google бачить це негативно

  **Шаблон:**
  ```
  [Ім'я], дякуємо за зворотній зв'язок. Нам шкода чути про цей досвід.
  Ми б хотіли розібратись у ситуації — прохання написати нам на [email]
  або зателефонувати [телефон]. Ми вирішимо це для вас.
  ```

### Review Widget на сайті:

- [ ] Embedded live review widget (Grade.us, Elfsight, або Google native embed)
- [ ] Widget показує реальні відгуки з актуальними датами та іменами
- [ ] AggregateRating schema — ТІЛЬКИ якщо widget є на сторінці (не статичні дані!)
- [ ] Розмістити на: homepage, about, contact, та ключових service pages

---

## 7.5 — GBP Posts Strategy

**Що робимо:** GBP Posts — безкоштовний контент-канал прямо у SERP. Регулярні пости = активність сигнал для Google.

### Типи GBP Posts:

  | Тип | Коли | Термін дії |
  |---|---|---|
  | **What's New** | Новини, оновлення, блог | 7 днів |
  | **Event** | Вебінари, заходи, відкриття | До кінця події |
  | **Offer** | Знижки, акції, промо | Вказуєш сам |
  | **Product** | Нові послуги, пакети | Без терміну |

### Editorial Calendar для GBP Posts:

- [ ] Мінімум **2 пости на місяць** (ціль — 1 на тиждень)
- [ ] Кожен пост: фото + текст (150–300 слів) + CTA кнопка + UTM-лінк

  | Тиждень | Тип поста | Тема | CTA | Статус |
  |---|---|---|---|---|
  | W1 | What's New | Нова стаття блогу | Learn more | |
  | W2 | Offer | Безкоштовний аудит | Book now | |
  | W3 | What's New | Кейс клієнта | Learn more | |
  | W4 | Product | Нова послуга | Contact us | |

- [ ] Включати keywords у текст поста природно
- [ ] Додавати UTM параметри до посилань: `?utm_source=gbp&utm_medium=post&utm_campaign=[назва]`

---

## 7.6 — GBP Q&A Management

**Що робимо:** Q&A у GBP впливає на конверсію та дає AI системам структуровані відповіді про бізнес.

- [ ] Переглянути поточні Q&A — є нерелевантні або некоректні відповіді?
- [ ] **Seed власні питання та відповіді** (не чекати на питання від клієнтів):
  - Зайти в GBP → Q&A → задати питання через Google Maps (з іншого акаунту) → відповісти офіційно
  - Мінімум 5–10 seed Q&A

  **Рекомендовані seed питання:**
  ```
  - "What services does [Company] offer?"
  - "What areas do you serve?"
  - "How much do your services cost?"
  - "How long does [main service] take?"
  - "Do you offer free consultations?"
  - "Are you Google certified/partnered?"
  - "What makes [Company] different from other agencies?"
  ```

- [ ] Відповідати на нові питання протягом 24 год
- [ ] Відповіді: конкретні, включають keywords природно, з CTA де доречно

---

## 7.7 — Local Landing Pages

**Що робимо:** Для кожного цільового міста + послуги — окрема сторінка. Це основа для ранжування в містах де немає фізичного офісу.

### Структура local page:

```
URL: /local/[city]/[service]/
Приклад: /local/toronto/seo-agency/
```

### Мінімальні вимоги до якості (щоб уникнути Doorway Page penalty):

- [ ] **≥ 40% унікального контенту** (не просто city name swap)
- [ ] Унікальний H1: `[Service] in [City] — [Differentiator]`
- [ ] Унікальний перший параграф: специфіка ринку цього міста
- [ ] Локальний market insight (1–2 речення з даними про місто)
- [ ] Локальний кейс або відгук від клієнта з цього міста (якщо є)
- [ ] Neighbourhood targeting для великих міст (Downtown, Midtown, North York тощо)
- [ ] Local schema (LocalBusiness/Service) з коректними addressRegion та servedArea
- [ ] Cross-links: до інших послуг у тому ж місті + до сусідніх міст

### Local Page Content Template:

```
H1: [Service] in [City] — [Unique Angle]

[Вступний параграф — унікальний: ринок міста, специфіка, чому [Назва] тут]

H2: [Service] Services We Offer in [City]
[Список послуг з описом — можна template але не тільки це]

H2: Why [City] Businesses Choose [Назва]
[Унікальний контент: local proof, specific results, city context]

H2: Our [City] [Service] Process
[Процес — може бути template але адаптований]

H2: [City] [Service] Pricing
[Pricing section — однакова по всіх містах, OK]

H2: Frequently Asked Questions About [Service] in [City]
H3: How much does [service] cost in [City]?
[Відповідь]
H3: How long until I see results from [service] in [City]?
[Відповідь]
H3: Do you serve businesses across [Province]?
[Відповідь]

H2: Serving [City] and Nearby Areas
[Nearby cities list з посиланнями]

[CTA section]
```

### Local Schema для кожної local page:

```json
{
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "MarketingAgency"],
  "name": "[Канонічна назва]",
  "url": "https://domain.com/local/[city]/[service]/",
  "telephone": "+1XXXXXXXXXX",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "[City]",
    "addressRegion": "[ON/BC/AB/etc]",
    "addressCountry": "CA"
  },
  "servedArea": {
    "@type": "City",
    "name": "[City]"
  },
  "priceRange": "$$"
}
```

- [ ] ❗ `geo` об'єкт — додавати тільки з реальними координатами. Порожній `{}` = гірше ніж нічого
- [ ] ❗ `aggregateRating` — тільки якщо є живий review widget на сторінці

### Internal Linking для local pages:

- [ ] Кожна local page → посилання на 3–5 **сусідніх міст** (географічна кластеризація)
- [ ] Кожна local page → посилання на **інші послуги в тому ж місті**
  ```
  Також у [City]: [Digital Marketing] | [Google Ads] | [Web Design] | [Social Media]
  ```
- [ ] Footer: показувати 6–8 пріоритетних local pages (Toronto, Vancouver, Calgary як мінімум)
- [ ] Pillar service pages → посилання до local pages (`"SEO Services in Toronto →"`)

### Local Pages Quality Audit:

  | URL | Унікальний контент % | Local schema OK | Review widget | Internal links | Статус |
  |---|---|---|---|---|---|
  | /local/toronto/seo-agency | | | | | |
  | /local/vancouver/seo-agency | | | | | |
  | /local/calgary/seo-agency | | | | | |

---

## 7.8 — Local Rank Tracking

**Що робимо:** Відстежуємо позиції в Local Pack та органіці по кожному місту та запиту.

### Налаштування:

- [ ] Додати target keywords у rank tracker з **геолокацією** (не загальні rankings — потрібен local tracking)
  - BrightLocal Local Search Grid
  - Whitespark Local Rank Tracker
  - Semrush Local Rankings
  - Або ручна перевірка через Google Maps з VPN на потрібне місто

- [ ] Відстежувати окремо:
  - **Local Pack** позиція (1–3 у Map Pack)
  - **Organic** позиція (під Map Pack)
  - **Local Finder** позиція (при "More places →")

### Keywords для local tracking:

  ```
  [Primary service] [City] — наприклад "SEO agency Toronto"
  [Primary service] near me — (прив'язати геолокацію до GBP)
  [Secondary service] [City]
  [Service] [Neighbourhood] — "SEO downtown Toronto"
  ```

### Local Rank Tracking таблиця:

  | Keyword | Місто | Local Pack | Organic | Дата | Δ |
  |---|---|---|---|---|---|
  | seo agency toronto | Toronto | | | | |
  | seo company vancouver | Vancouver | | | | |
  | digital marketing calgary | Calgary | | | | |

---

## 7.9 — Multi-Location Protocol

> Застосовується якщо клієнт має 2+ фізичних локацій

- [ ] Окремий GBP listing для **кожної** локації (не один listing з кількома адресами)
- [ ] Окрема сторінка на сайті для кожної локації з унікальним контентом
- [ ] Унікальний місцевий телефон для кожної локації (або call tracking number)
- [ ] LocalBusiness schema з точною адресою та geo координатами для кожної локації
- [ ] Окремий NAP по кожній локації у всіх citations
- [ ] Перехресні посилання між location pages: "Також є у [City] →"
- [ ] Reviews відповідають конкретній локації (не мішати відгуки між listings)
- [ ] Unified brand → але локалізований контент та photos для кожної локації

---

## 7.10 — Local SEO Monthly Checklist

**Що робимо:** Ongoing local SEO — без регулярності rankings не тримаються.

  | Задача | Частота | Відповідальний | Статус |
  |---|---|---|---|
  | Публікувати GBP Post | 2x на місяць | | |
  | Відповідати на нові відгуки | Протягом 24–48 год | | |
  | Перевіряти нові Q&A | Щотижня | | |
  | Перевіряти нові customer photos | Щотижня | | |
  | Аналізувати GBP Insights | Щомісяця | | |
  | Local rank tracking review | Щомісяця | | |
  | Citation audit (нові/змінені) | Щоквартально | | |
  | Оновити GBP photos | Щоквартально | | |
  | Перевірити special hours (holidays) | За 2 тижні до свята | | |
  | Review velocity check | Щомісяця | | |

### GBP Insights — що відстежувати щомісяця:

  ```
  Searches (Direct + Discovery + Branded):
  Views (Search + Maps):
  Actions (Calls + Direction requests + Website clicks):

  MoM зміни:
  Calls:          → Δ
  Direction requests: → Δ
  Website clicks: → Δ
  ```

---

## 7.11 — Phase 7 Output

- [ ] **GBP повністю заповнений** — категорії, опис, фото, hours, attributes
- [ ] **NAP уніфікований** — сайт + GBP + Tier 1 directories
- [ ] **Tier 1 citations** — всі claimed та перевірені
- [ ] **Review process запущений** — email/SMS sequence налаштований
- [ ] **GBP Posts calendar** — перший місяць запланований
- [ ] **Q&A seeded** — 5–10 питань додані
- [ ] **Local pages** — топ-5 пріоритетних міст з якісним контентом
- [ ] **Local rank tracking** — налаштований по всіх target містах
- [ ] **Local schema** — коректна на всіх local pages

---

---

## SUMMARY: PHASES 0–7 COMPLETION CHECKLIST

| Phase | Виконано? | Результат | Дата |
|---|---|---|---|
| **0.1** Business Intelligence | | Project Card заповнений | |
| **0.2** Baseline Metrics | | Baseline Spreadsheet | |
| **0.3** Competitor Intelligence | | Competitor Dashboard | |
| **1.1–1.6** Technical Audit | | Prioritized Fix List | |
| **2.1–2.5** Entity & E-E-A-T | | Schema + llms.txt + E-E-A-T | |
| **3.1–3.6** Keyword & Topical Map | | Keyword Master List + Clusters | |
| **4.1–4.11** On-Page Optimization | | On-Page Tracker | |
| **5.1–5.9** Content Strategy | | Editorial Calendar + 4 pages live | |
| **6.1–6.11** AI Search (GEO/AEO) | | AI Visibility Baseline | |
| **7.0** Тип бізнесу | | SAB / Storefront визначено | |
| **7.1** GBP Аудит | | GBP повністю заповнений | |
| **7.2** NAP Consistency | | NAP уніфікований скрізь | |
| **7.3** Citation Building | | Tier 1 + Tier 2 claimed | |
| **7.4** Review Strategy | | Process запущений + widget | |
| **7.5** GBP Posts | | Calendar готовий | |
| **7.6** GBP Q&A | | 5–10 seed Q&A додані | |
| **7.7** Local Landing Pages | | Топ-5 міст live | |
| **7.8** Local Rank Tracking | | Tracking налаштований | |
| **7.9** Multi-Location | | (якщо застосовно) | |
| **7.10** Monthly Local Checklist | | Ongoing процес запущений | |
| **7.11** Phase 7 Output | | Всі deliverables готові | |

---

> **Далі: Phase 8 — Link Building | Phase 9 — Analytics & Reporting**
> Скажи "Переходимо до Phase 8" — і продовжимо.

---

---

# PHASE 8 — LINK BUILDING & DIGITAL PR

> **Мета:** Нарощувати авторитет домену через якісні посилання з релевантних та авторитетних джерел — без ризику Google Spam penalties.
> **Час:** Ongoing | **Мінімум:** 8–12 год/міс на outreach + контент
> **Дедлайн:** Перші посилання — Місяць 1–2. Системний процес — Місяць 3+
> **Результат:** Growing referring domains, підвищений DR/DA, authority signals для AI search

---

## 8.0 — Backlink Audit (Стартова точка)

**Що робимо:** Перш ніж будувати нові посилання — розуміємо що вже є і що шкодить.

### Поточний профіль:

- [ ] Відкрити Ahrefs → Site Explorer → Backlinks Overview
- [ ] Зафіксувати baseline:

  ```
  Domain Rating (DR):
  Referring Domains:
  Total Backlinks:
  Dofollow / Nofollow split:
  Organic Traffic (Ahrefs estimate):
  ```

### Anchor Text Distribution:

- [ ] Ahrefs → Anchors → подивитись розподіл

  | Тип Anchor | % зараз | Ціль |
  |---|---|---|
  | Branded ("Boomy Marketing") | | 40–60% |
  | Naked URL (domain.com) | | 10–20% |
  | Generic ("click here", "website") | | 5–10% |
  | Exact match keyword | | 5–10% |
  | Partial match / LSI | | 15–25% |

- [ ] ❗ Якщо exact match anchor > 20% → over-optimization ризик → потрібно dilute branded посиланнями

### Toxic Link Detection:

- [ ] Ahrefs → Backlinks → фільтр по низькому DR (< 10) + нерелевантний домен
- [ ] Semrush → Backlink Audit → Toxic Score
- [ ] Виявлені токсичні посилання:

  | URL | DR | Проблема | Дія |
  |---|---|---|---|
  | | | Spam / irrelevant / PBN | Disavow / Ignore |

- [ ] Підготувати disavow file якщо є очевидні spam links (обережно — тільки явний spam):
  ```
  # Disavow file — domain.com
  # Created: [дата]
  domain:spammy-site.com
  domain:another-spam.net
  ```
- [ ] Подати disavow через GSC → Disavow Links Tool

### Lost Links Recovery:

- [ ] Ahrefs → Lost Backlinks (фільтр: Lost, last 3–6 months)
- [ ] Для кожного lost link > DR 30 → outreach до власника сайту з проханням відновити
- [ ] Причини втрати: сторінка видалена (301 fix) / посилання замінили / сайт зник

  | Referring Domain | DR | Lost Link URL | Причина | Дія |
  |---|---|---|---|---|
  | | | | | Outreach |

---

## 8.1 — Link Building Strategy Selection

**Що робимо:** Вибираємо тактики відповідно до ніші, бюджету та поточного DR. Не всі тактики підходять всім.

### Вибір тактик по DR та бюджету:

  | DR сайту | Бюджет | Рекомендовані тактики |
  |---|---|---|
  | 0–20 | Low | Citations, directories, guest posts на нових сайтах, resource pages |
  | 20–40 | Medium | Guest posts, HARO/Qwoted, broken link building, linkable assets |
  | 40–60 | Medium-High | Digital PR, original research, podcast appearances, partnerships |
  | 60+ | High | Flagship research, industry reports, speaking at conferences, Wikipedia |

### Тактики — детальний огляд:

**✅ Безпечні та ефективні:**
- Guest Posting на авторитетних галузевих сайтах
- Digital PR (data studies, surveys, newsworthy stories)
- HARO / Qwoted / SourceBottle (відповіді журналістам)
- Broken Link Building
- Resource Page Link Building
- Linkable Asset Creation (tools, calculators, free resources)
- Podcast Appearances
- Partnership Links (certified partners, integrations)
- Local Citations (для local SEO)
- Unlinked Brand Mention Reclamation

**⚠️ Ризиковані (потребують обережності):**
- Paid Guest Posts (якщо без nofollow/sponsored tag — Google penalty ризик)
- Link Exchanges (A→B→C OK, пряма A↔B — ні)
- Forum/Comment Links (як supplemental, не основний метод)

**❌ Заборонено (Google Spam Policy):**
- PBN (Private Blog Networks)
- Купівля посилань без sponsored/nofollow
- Automated link building
- Keyword-stuffed anchor text у масових guest posts
- Link farms та directories низької якості

---

## 8.2 — Guest Posting

**Що робимо:** Публікуємо статті на авторитетних зовнішніх сайтах з посиланням на клієнта.

### Пошук prospects:

- [ ] Google оператори для пошуку guest post сайтів:
  ```
  "[ніша]" + "write for us"
  "[ніша]" + "guest post"
  "[ніша]" + "contribute"
  "[ніша]" + "submit article"
  "[ніша]" + "accepting submissions"
  ```
- [ ] Ahrefs → Content Explorer → знайти popular articles у ніші → подивитись де автори публікуються
- [ ] Перевірити де публікуються **конкуренти** (Ahrefs → Backlinks → filter by "guest post" in anchor)

### Qualifying Criteria (фільтри для відбору):

  | Критерій | Мінімум | Ідеально |
  |---|---|---|
  | Domain Rating (DR) | ≥ 30 | ≥ 50 |
  | Organic Traffic | > 1,000/міс | > 10,000/міс |
  | Relevance до ніші | Висока | Дуже висока |
  | Spam Score (Moz) | < 30% | < 10% |
  | Real audience | Є коментарі/shares | Активна спільнота |
  | Не link farm | Контент якісний | Редакційний відбір |

- [ ] Для кожного prospect заповнити:

  | Сайт | DR | Traffic | Relevance | Контакт | Статус |
  |---|---|---|---|---|---|
  | | | | High/Med/Low | | Prospect |

### Outreach Email — Структура:

```
Тема: Guest Post Idea for [SiteName] — [Конкретна тема]

Привіт [Ім'я],

[1 речення — що ти помітив на їхньому сайті, конкретно]

Я [Ім'я], [посада] в [Компанія]. Ми [1 речення credibility — клієнти, результати, досвід].

Хотів запропонувати статтю для [SiteName]:

**"[Конкретний заголовок #1]"**
→ [2 речення — про що, чому цінно для їхньої аудиторії]

**"[Конкретний заголовок #2]"**
→ [2 речення]

Яка з них більше підходить? Або можу запропонувати іншу тему.

З повагою,
[Ім'я]
[Посада, Компанія]
[Website]
```

- [ ] ❌ НЕ надсилати однаковий template всім — Google та редактори бачать масові аутрічі
- [ ] Follow-up: через 5–7 днів якщо немає відповіді (1 раз)
- [ ] Follow-up #2: через ще 5 днів (останній раз)

### Guest Post Content Standards:

- [ ] Стаття: мінімум 1,200 слів, якісний контент (не для посилання — для читача)
- [ ] Посилання на клієнта: 1–2 в тілі статті, anchor text — branded або partial match
- [ ] НЕ ставити exact match keyword anchor у guest posts → over-optimization signal
- [ ] Author bio: включає посилання на клієнта (додатковий dofollow або nofollow)
- [ ] Перевірити чи сайт додає `sponsored` або `ugc` атрибут (якщо так — цінність знижена)

---

## 8.3 — Digital PR & Original Research

**Що робимо:** Найпотужніша тактика для отримання посилань з DR 70+ медіа. Потребує інвестиції у контент — але дає масштабний результат.

### Типи Digital PR активів:

  | Тип | Опис | Складність | Potential Links |
  |---|---|---|---|
  | **Original Survey** | Опитування 200–500+ респондентів → унікальні дані | Середня | 20–100+ |
  | **Industry Report** | Аналіз даних галузі за рік | Висока | 30–200+ |
  | **Data Study** | Аналіз публічних даних під новим кутом | Середня | 15–80+ |
  | **Ranking/Index** | "Best Cities for X", "Top Companies Y" | Середня | 20–100+ |
  | **Controversial Insight** | Counter-intuitive висновок з даними | Низька | 10–50+ |
  | **Free Tool/Calculator** | Корисний інструмент у ніші | Висока | 50–500+ |
  | **Trend Prediction** | Обґрунтований прогноз на рік | Низька | 10–30+ |

### Process:

**Крок 1 — Ідея:**
- [ ] Знайти тему де є дефіцит даних у ніші (що журналісти хочуть але немає)
- [ ] Перевірити чи є попит: `[тема] statistics site:forbes.com OR site:businessinsider.com` → якщо шукають — є попит

**Крок 2 — Дослідження:**
- [ ] Провести опитування (Google Forms, Typeform, SurveyMonkey)
- [ ] АБО зібрати та проаналізувати публічні дані (StatCan, Census, industry reports)
- [ ] Мінімальна вибірка для credibility: 200+ респондентів (опитування), 1,000+ data points (дані)

**Крок 3 — Контент:**
- [ ] Опублікувати повний звіт на сайті клієнта (довга сторінка з візуалізаціями)
- [ ] Створити press release з топ-3 найцікавішими висновками
- [ ] Підготувати embeddable інфографіку (з attribution link)

**Крок 4 — Outreach:**
- [ ] Скласти медіа-список: журналісти які пишуть про цю тему (BuzzSumo, Twitter/X пошук)
- [ ] Pitch email:

  ```
  Тема: Exclusive Data: [Shocking Finding] — [Нова стаття]

  Привіт [Ім'я журналіста],

  Бачив вашу статтю про [тема] від [дата]. Маю ексклюзивні дані які можуть зацікавити:

  [Назва компанії] провела опитування [N] [аудиторія] та виявила:
  • [Найбільш шокуючий факт з %]
  • [Другий цікавий факт]
  • [Третій]

  Повний звіт: [URL]
  Ексклюзивні дані / цитата від експерта — доступні для вашої статті.

  [Ім'я]
  ```

---

## 8.4 — HARO / Qwoted / SourceBottle

**Що робимо:** Журналісти шукають експертів для коментарів — відповідаємо та отримуємо посилання з медіа.

### Налаштування:

- [ ] Зареєструватись як **Source** (не журналіст) на:
  - **HARO** (Help a Reporter Out) → haro.com → отримувати 3 email/день
  - **Qwoted** → qwoted.com → платформа + alerts
  - **SourceBottle** → sourcebottle.com → безкоштовно для AU/CA/UK
  - **Featured.com** → featured.com → преміум але якісні outlets
  - **ProfNet** → професійна платформа (PR Newswire)

- [ ] Налаштувати alerts на релевантні категорії (Business, Marketing, Technology, Finance тощо)

### Response Protocol:

- [ ] Читати запити двічі на день (ранок + обід) — deadline часто < 24 год
- [ ] Відповідати тільки якщо є реальна експертиза у темі (не generic advice)
- [ ] Структура відповіді:

  ```
  [Ім'я журналіста],

  [Ім'я], [Посада] в [Компанія].

  [Пряма відповідь на питання — 2–4 конкретних речення, без вступу]

  [Додатковий context або data point якщо є]

  Якщо потрібна додаткова інформація або цитата — звертайтесь.

  [Ім'я]
  [Посада | Компанія | Phone | Email]
  [Website]
  ```

- [ ] ❌ НЕ починати з "Great question!" або "As an expert in..."
- [ ] ❌ НЕ робити pitch продукту/послуги — тільки цінна відповідь
- [ ] Очікування: 5–15% відповідей призводять до публікації (нормально)

### Відстеження:

  | Дата | Платформа | Outlet | Тема | Відповів | Опублікували | Link |
  |---|---|---|---|---|---|---|
  | | HARO | Forbes | | Так | Так | |
  | | Qwoted | | | Так | Ні | |

---

## 8.5 — Broken Link Building

**Що робимо:** Знаходимо broken links на авторитетних сайтах → пропонуємо свій контент як заміну.

### Процес:

**Крок 1 — Пошук broken links:**
- [ ] Метод 1: Ahrefs → Content Explorer → шукаємо тему → фільтр "Broken" → знаходимо сторінки з broken backlinks
- [ ] Метод 2: Ahrefs → Site Explorer конкурента → Backlinks → фільтр "404" → їхні broken pages мають наші потенційні linkers
- [ ] Метод 3: Check My Links (Chrome extension) → відкриваємо resource pages конкурентів → шукаємо red (broken) links

**Крок 2 — Верифікація:**
- [ ] DR referring сайту ≥ 30
- [ ] Тема broken link релевантна нашому контенту
- [ ] Є контент на нашому сайті що може замінити (або треба створити)

**Крок 3 — Outreach:**

```
Тема: Broken Link on [PageName]

Привіт [Ім'я],

Читав вашу статтю "[Назва сторінки]" і помітив що посилання на [описати broken link] більше не працює.

У нас є актуальний матеріал на цю тему: [URL нашої сторінки]
[1 речення — чому це хороша заміна]

Сподіваюсь буде корисно для ваших читачів.

[Ім'я]
```

---

## 8.6 — Unlinked Brand Mention Reclamation

**Що робимо:** Знаходимо де вже згадують бренд клієнта без посилання — просимо додати link.

### Пошук unlinked mentions:

- [ ] Ahrefs → Content Explorer → `"[Brand Name]"` → фільтр "No links to target"
- [ ] Google Alerts → налаштувати на brand name → отримувати нові mentions
- [ ] Mention.com або Brand24 → моніторинг в реальному часі

### Qualifying:

- [ ] DR сайту ≥ 20 (менше — не варто зусиль)
- [ ] Контекст позитивний або нейтральний
- [ ] Сторінка проіндексована та має трафік

### Outreach:

```
Тема: Quick Question About Your [Article Name]

Привіт [Ім'я],

Дякуємо що згадали [Назва компанії] у вашій статті "[Назва]" — приємно!

Чи могли б ви додати посилання на наш сайт [URL] при згадці? Це допоможе вашим читачам знайти нас напряму.

Дякуємо!
[Ім'я]
```

- [ ] Conversion rate: 20–40% (люди зазвичай погоджуються легко — вони вже згадали)

---

## 8.7 — Resource Page Link Building

**Що робимо:** Знаходимо сторінки з корисними ресурсами у ніші → просимо додати наш контент/інструмент.

### Пошук resource pages:

```
[ніша] + "useful resources"
[ніша] + "recommended tools"
[ніша] + "best blogs"
[ніша] + intitle:resources
[ніша] + inurl:links
[ніша] + "helpful links"
```

### Qualifying:

- [ ] Сторінка дійсно є resource page (не просто стаття)
- [ ] DR ≥ 30
- [ ] Наш контент/інструмент реально корисний для аудиторії цього сайту
- [ ] Нас ще немає у списку

### Outreach:

```
Тема: Resource Suggestion for [Page Name]

Привіт [Ім'я],

Знайшов вашу сторінку з ресурсами [URL] — дуже корисна добірка для [аудиторія].

Хотів запропонувати додати: [Назва нашого ресурсу] ([URL])
[1–2 речення — що це, чому корисно для їхньої аудиторії]

Якщо підходить — буду радий бачити у вашому списку.

[Ім'я]
```

---

## 8.8 — Podcast Appearances

**Що робимо:** Подкасти дають: referring domain (show notes link), brand mentions, AI citation signals, нову аудиторію.

### Пошук подкастів:

- [ ] Listen Notes → пошук по ніші → фільтр за popularity
- [ ] Podchaser → галузеві подкасти
- [ ] Google: `[ніша] podcast site:podcasts.apple.com`
- [ ] Подкасти де вже були конкуренти (Ahrefs → Backlinks → filter "podcast")

### Qualifying критерії:

  | Критерій | Мінімум |
  |---|---|
  | Нові епізоди виходять | Останній < 3 місяці |
  | Слухачі | > 500/епізод (estimate) |
  | Релевантна аудиторія | Відповідає ICP клієнта |
  | Show notes з посиланнями | Так |

### Pitch шаблон:

```
Тема: Guest Idea for [Podcast Name] — [Конкретна Тема]

Привіт [Ім'я ведучого],

Слухаю [Podcast Name] з [N] сезону — особливо сподобався епізод з [Гостем/Темою].

Я [Ім'я], [Посада] в [Компанія]. [1 речення credibility — специфічний результат або досвід].

Думаю ваша аудиторія може зацікавитись темою:
**"[Конкретна тема епізоду]"**

Де б ми могли розглянути: [3 bullet points — що обговоримо]

Якщо цікаво — happy to send more details або записати короткий intro відео.

[Ім'я]
```

### Після запису:

- [ ] Поширити епізод у власних соцмережах (взаємна вигода)
- [ ] Перевірити show notes — є посилання на сайт клієнта?
- [ ] Додати посилання на епізод зі сторінки клієнта (About або Team page)
- [ ] Зафіксувати referring domain та DR

---

## 8.9 — Partnership & Co-Marketing Links

**Що робимо:** Отримуємо посилання через офіційні партнерства — найбільш природні та довготривалі.

### Типи партнерських посилань:

- [ ] **Technology partners:** інструменти що клієнт використовує (Semrush Partner, Google Partner, HubSpot Partner) → listed на їхніх partner pages
- [ ] **Certification pages:** Google Ads Certified, Meta Blueprint → partner/certified directory
- [ ] **Industry associations:** вступити до галузевих асоціацій (CAMSC, CMA Canada тощо) → member directory
- [ ] **Supplier/vendor pages:** постачальники клієнта → "Our Clients" або "Case Studies" page
- [ ] **Affiliate/referral program:** якщо є — партнери лінкують назад

### Action items:

- [ ] Скласти список всіх сертифікацій та партнерств клієнта
- [ ] Перевірити чи кожне дає posилання на сайт
- [ ] Для відсутніх → звернутись до партнера з проханням додати

  | Партнер | Тип | Посилання є | DR партнера | Дія |
  |---|---|---|---|---|
  | Google Partner | Certification | | | |
  | Semrush Agency Partner | Technology | | | |
  | | | | | |

---

## 8.10 — Link Building Tracker & KPIs

**Що робимо:** Системно відстежуємо всі активності та результати.

### Outreach Tracker (щомісячно):

  | Дата | Тактика | Prospect URL | DR | Контакт | Email відправлено | Відповідь | Результат | Link URL |
  |---|---|---|---|---|---|---|---|---|
  | | Guest Post | | | | | | Placed | |
  | | HARO | | | | | | Published | |
  | | Broken Link | | | | | | Declined | |

### Щомісячні KPI:

  | KPI | Ціль | Факт | Δ |
  |---|---|---|---|
  | Outreach emails sent | ≥ 30 | | |
  | Response rate | ≥ 15% | | |
  | Links placed | ≥ 3–5 | | |
  | New referring domains | ≥ 3 | | |
  | Avg DR нових посилань | ≥ 35 | | |
  | DR клієнта | +1–2/квартал | | |

### Quarterly Link Audit:

- [ ] Перевірити referring domains (Ahrefs) — нові та lost
- [ ] Перевірити anchor text distribution — не перекошений на exact match?
- [ ] Перевірити spam score нових посилань — немає нових токсичних?
- [ ] Порівняти DR з конкурентами — closing the gap?

---

## 8.11 — Linkable Asset Plan

**Що робимо:** Створюємо контент спеціально для залучення посилань — раз вклали, посилання йдуть роками.

### Ідеї linkable assets для digital marketing agency:

- [ ] **SEO ROI Calculator** — безкоштовний інструмент ("скільки заробиш від SEO")
- [ ] **Annual Digital Marketing Report** — дані по ринку Канади
- [ ] **"State of SEO in Canada" Survey** — опитування 300+ Canadian businesses
- [ ] **Google Algorithm Update Timeline** — інтерактивна хронологія всіх updates
- [ ] **Local SEO Checklist** — downloadable PDF (гейт або безкоштовно)
- [ ] **Marketing Budget Calculator** — скільки витрачати на маркетинг при X revenue
- [ ] **Competitor Analysis Template** — безкоштовний Google Sheet

### Process для кожного asset:

- [ ] Визначити target audience та яким сайтам це буде цікаво для linking
- [ ] Розробити та опублікувати
- [ ] Написати email campaign для outreach до 50–100 potential linkers
- [ ] Відстежити нові referring domains за 3 місяці після публікації

---

## 8.12 — Phase 8 Output

- [ ] **Backlink Audit** — токсичні знайдені, disavow file готовий (якщо потрібно)
- [ ] **Lost Links Recovery** — outreach до top-10 lost links
- [ ] **Tactics chosen** — 2–3 основні тактики для першого кварталу
- [ ] **Prospect List** — ≥ 50 qualifying prospects у tracker
- [ ] **First Outreach Wave** — ≥ 20 emails відправлено
- [ ] **HARO/Qwoted** — зареєстровані, alerts налаштовані
- [ ] **Linkable Asset** — 1 asset запланований або в розробці
- [ ] **KPI Dashboard** — місячний tracker налаштований

---

---

# PHASE 9 — ANALYTICS, TRACKING & REPORTING

> **Мета:** Побудувати інфраструктуру вимірювання де кожне SEO-рішення приймається на основі даних, а клієнт бачить прямий зв'язок між нашою роботою та бізнес-результатами.
> **Час:** 4–8 годин початкове налаштування | **Дедлайн:** День 1–7 (паралельно з Phase 0)
> **Результат:** GA4 + GSC + Rank Tracker налаштовані, Looker Studio dashboard живий, перший звіт готовий

---

## 9.1 — GA4 Audit & Setup

**Що робимо:** GA4 — основа для розуміння що органічний трафік реально робить на сайті.

### Верифікація базового трекінгу:

- [ ] GA4 property існує та підключена до сайту
- [ ] Перевірити через GA4 → Real-time → чи приходять hits?
- [ ] Перевірити тип імплементації:
  ```
  Метод: [Google Tag Manager / gtag.js / CMS plugin]
  GTM Container ID (якщо є):
  GA4 Measurement ID: G-XXXXXXXXXX
  ```
- [ ] Перевірити чи немає **дублювання** (два GA4 коди на одній сторінці):
  - Chrome → DevTools → Network → фільтр `collect` → має бути 1 hit на pageview
- [ ] Виключити internal traffic:
  - GA4 → Admin → Data Streams → Configure Tag Settings → Define internal traffic → додати IP офісу клієнта + агенції
- [ ] Виключити bot traffic:
  - GA4 → Admin → Reporting Identity → Enable "Filter out all hits from known bots and spiders"

### Conversion Events:

- [ ] Перевірити які Conversion Events налаштовані:

  | Event | Тип | Налаштовано | Перевірено |
  |---|---|---|---|
  | form_submit / generate_lead | Lead form | | |
  | purchase | eCommerce | | |
  | phone_call_click | Phone CTA | | |
  | schedule_call | Booking | | |
  | file_download | Lead magnet | | |
  | scroll (90%) | Engagement | | |

- [ ] Для кожної missing conversion → налаштувати через GTM:
  - **Form submission:** Trigger: Form Submit → GA4 Event: `generate_lead`
  - **Phone clicks:** Trigger: Click URL contains `tel:` → GA4 Event: `phone_call_click`
  - **Thank you page:** GA4 → Events → Mark as Conversion → `page_view` where `page_path` = `/thank-you`

- [ ] Перевірити атрибуцію:
  - GA4 → Advertising → Attribution → Conversion paths
  - Organic Search присутній у conversion paths?
  - Змінити модель з Last-click на **Data-Driven** (Admin → Attribution settings)

### GSC ↔ GA4 Link:

- [ ] GA4 → Admin → Product Links → Search Console → Link
- [ ] Після linking: GA4 → Reports → Acquisition → Search Console reports (з'являється через 24–48 год)

---

## 9.2 — Google Search Console Setup

**Що робимо:** GSC — єдине джерело правди про те як Google бачить сайт.

### Верифікація:

- [ ] Сайт верифікований у GSC?
  ```
  Method: [HTML tag / DNS / Google Analytics / GTM]
  Properties додані:
    [ ] https://domain.com  ← preferred
    [ ] http://domain.com
    [ ] https://www.domain.com (якщо є)
  ```
- [ ] Sitemap поданий: GSC → Sitemaps → Submit → `https://domain.com/sitemap.xml`
- [ ] GSC → Settings → Email preferences → увімкнути alerts:
  - [ ] Manual actions
  - [ ] Security issues
  - [ ] Coverage issues

### Ключові звіти — що і де перевіряти:

  | Звіт | Де знайти | Що перевіряти |
  |---|---|---|
  | Performance | Search results | Clicks, Impressions, CTR, Position |
  | Coverage | Index → Coverage | Valid, Errors, Excluded — динаміка |
  | Core Web Vitals | Experience → CWV | LCP, INP, CLS — поле vs лаб |
  | Manual Actions | Security & Manual Actions | Penalties |
  | Links | Links | Top linking sites, anchor text |
  | Sitemaps | Indexing → Sitemaps | Discovered vs Indexed |
  | URL Inspection | Top bar | Crawl + index status окремої URL |

### GSC Export Routine:

- [ ] Щомісяця: Performance → Export → Google Sheets → зберігати як snapshot з датою
- [ ] Завжди порівнювати: MoM та YoY (рік до року)
- [ ] ❗ GSC data — 3 дні затримки, не реальний час

---

## 9.3 — Rank Tracking Setup

**Що робимо:** Позиції у динаміці — основа для розуміння що працює, що ні.

### Вибір інструменту:

  | Інструмент | Сильна сторона | Підходить для |
  |---|---|---|
  | Ahrefs Rank Tracker | Найточніший, SERP features | Будь-який проєкт |
  | Semrush Position Tracking | Широкий функціонал | Agency multi-project |
  | SERPWatcher | Простий, доступний | Малий бюджет |
  | Nightwatch | Local + white-label звіти | Agency з клієнтами |
  | BrightLocal | Тільки local rankings | Local-only проєкти |

### Налаштування:

- [ ] Додати домен → вибрати **країну + місто** (локальні rankings ≠ загальні!)
- [ ] Відстежувати **Mobile та Desktop** окремо
- [ ] Додати всі target keywords зі Phase 3 (Keyword Master List)
- [ ] Налаштувати competitor tracking (5 основних конкурентів)
- [ ] Групи (Labels/Tags) для зручної фільтрації:

  ```
  ├── BoFU — конверсійні keywords
  ├── MoFU — commercial keywords
  ├── ToFU — informational keywords
  ├── Branded — brand queries
  ├── Local — [service] + [city]
  └── Quick Wins — позиції 4–15
  ```

- [ ] Alerts:
  - [ ] Keyword впав ≥ 5 позицій → email notification
  - [ ] Keyword увійшов у топ-10 → email notification

### Baseline позицій:

- [ ] Зняти позиції у Day 1 → зберегти як Baseline Rankings Snapshot
- [ ] Наступне знімання: через 2 тижні → потім щотижня або щомісяця

---

## 9.4 — Looker Studio Dashboard

**Що робимо:** Живий дашборд що автоматично оновлюється — клієнт бачить результати без очікування звіту.

### Data Sources:

- [ ] Google Search Console → офіційний Looker Studio connector
- [ ] Google Analytics 4 → офіційний connector
- [ ] Rank Tracker → Google Sheets export → Looker Studio
- [ ] Ahrefs/Semrush → Sheets export → Looker Studio

### Структура Dashboard (6 сторінок):

**Сторінка 1 — Executive Summary:**
- [ ] Organic Sessions (поточний місяць vs попередній vs рік тому) — Scorecards з Δ%
- [ ] Organic Conversions та Conversion Rate
- [ ] Average Position (GSC) — топ target keywords
- [ ] Referring Domains (поточний vs попередній місяць)
- [ ] Core Web Vitals status indicator (🟢 Good / 🟡 Needs Improvement / 🔴 Poor)

**Сторінка 2 — Traffic & Visibility:**
- [ ] Organic Sessions trendline (12 місяців)
- [ ] Impressions + Clicks trendline (GSC)
- [ ] CTR trendline
- [ ] Top Landing Pages table: URL / Sessions / Conversions / Δ MoM
- [ ] Traffic by Device (Mobile / Desktop / Tablet)

**Сторінка 3 — Keywords & Rankings:**
- [ ] Top 20 queries (GSC): Clicks / Impressions / CTR / Position
- [ ] Position distribution chart: % keywords у топ-3 / топ-10 / топ-20 / 20+
- [ ] Ranking Movers таблиця: keyword / позиція було / стало / Δ
- [ ] Нові keywords що увійшли у топ-20 цього місяця

**Сторінка 4 — Technical Health:**
- [ ] Index Coverage: Valid / Errors / Excluded / Warnings (stacked bar chart)
- [ ] CWV gauges: LCP / INP / CLS (зелений / жовтий / червоний)
- [ ] Crawl Errors тренд

**Сторінка 5 — Content Performance:**
- [ ] Нові сторінки опубліковані цього місяця
- [ ] Top сторінки за органічними conversions
- [ ] Сторінки з найбільшим Δ трафіку (зростання та падіння)

**Сторінка 6 — Link Building:**
- [ ] Referring Domains trendline (12 місяців)
- [ ] New + Lost referring domains цього місяця
- [ ] DR динаміка (якщо є Ahrefs API)
- [ ] Top linking domains таблиця

### Налаштування доступу:

- [ ] Клієнт → View access (посилання)
- [ ] Команда → Edit access
- [ ] Date Range picker: default = поточний місяць, порівняння = попередній місяць

---

## 9.5 — Monthly Report Structure

**Що робимо:** Звіт — не spreadsheet з цифрами, а **story** з висновками та діями.

### Шаблон Monthly SEO Report:

```
══════════════════════════════════════════
MONTHLY SEO REPORT — [Місяць РРРР]
Клієнт: [Назва] | Підготовлено: [Дата]
══════════════════════════════════════════

1. EXECUTIVE SUMMARY
   Загальний стан: 🟢 Зростання / 🟡 Стабільно / 🔴 Проблема
   Топ-3 досягнення місяця:
   •
   •
   •
   Ризики або проблеми:
   •
   Головна рекомендація на наступний місяць:

2. KPI SCORECARD
   | KPI            | Ціль | Факт | Δ MoM | Δ YoY |
   | Organic Sessions | | | | |
   | Conversions     | | | | |
   | Avg. Position   | | | | |
   | Referring Domains | | | | |

3. ОРГАНІЧНИЙ ТРАФІК
   Sessions: [N] (MoM: X% | YoY: X%)
   Conversions: [N] (MoM: X%)
   Conversion Rate: X%
   ▶ Чому: [конкретна причина зміни — не просто цифра]

4. RANKINGS
   Avg. Position: X → X (Δ)
   Keywords у топ-10: X% (було X%)
   Топ-5 wins: [keyword / позиція була → стала]
   Топ-5 losses: [keyword / позиція була → стала]
   ▶ Аналіз: [чому зміни — update / нові конкуренти / наш контент]

5. ТЕХНІЧНИЙ СТАН
   CWV: LCP [X] / INP [X] / CLS [X]
   Coverage: Valid [N] / Errors [N] / Excluded [N]
   Виконані правки цього місяця:
   •

6. КОНТЕНТ
   Опубліковано: [N] сторінок — [URLs]
   Refreshed: [N] сторінок
   Найкращий performer: [URL] — [N] sessions
   Наступний місяць: [список]

7. LINK BUILDING
   Нових referring domains: N (DR avg: X)
   Outreach: [N] emails → [N] відповідей → [N] посилань
   Отримані посилання: [URLs]

8. LOCAL SEO (якщо є)
   GBP Calls: N (Δ) | Directions: N (Δ)
   Нових відгуків: N | Rating: X/5
   Local Pack позиції: [ключові keywords]

9. AI SEARCH VISIBILITY
   AI Overview присутній на: [keywords]
   Бренд у ChatGPT/Perplexity: [Yes/Частково/No]
   Зміни vs минулий місяць: [є/немає]

10. ПЛАН НА НАСТУПНИЙ МІСЯЦЬ
    Пріоритет 1: [дія + очікуваний результат]
    Пріоритет 2:
    Пріоритет 3:
    Контент: [список]
    Технічні правки: [список]
```

### Правила хорошого звіту:

- [ ] **Insights > Data:** "Трафік +23% завдяки 3 статтям що потрапили у Featured Snippet" — не просто "+23%"
- [ ] **Кожне падіння пояснене:** Google update? Сезонність? Технічна помилка?
- [ ] **Кожен розділ → дія:** що робимо далі з цим
- [ ] **Мова клієнта:** без SEO-жаргону без пояснення
- [ ] **Довжина:** 4–8 сторінок (не 20 що ніхто не читає)
- [ ] **Branded vs Non-Branded split:** завжди показуємо обидва

---

## 9.6 — Quarterly Business Review (QBR)

**Що робимо:** Раз на квартал — стратегічний дзвінок. Не operational update, а стратегія.

### QBR Agenda (60–90 хв):

```
1. РЕЗУЛЬТАТИ КВАРТАЛУ (20 хв)
   • KPI vs цілі: що досягли / що ні + чому
   • Топ-3 wins кварталу (з даними)
   • Що не спрацювало і чому

2. РИНОК ТА КОНКУРЕНТИ (15 хв)
   • Google updates за квартал — вплив на сайт
   • Що роблять конкуренти — нові загрози або можливості
   • Нові SERP features / AI тренди

3. СТРАТЕГІЯ Q[N+1] (20 хв)
   • Топ-3 пріоритети наступного кварталу
   • Бюджет: контент / лінкбілдинг / технічні роботи
   • Нові ініціативи (якщо є)

4. FEEDBACK ВІД КЛІЄНТА (15 хв)
   • Що хоче більше/менше
   • Зміни в бізнесі що впливають на SEO
   • Нові продукти/послуги/гео для просування
```

### QBR Preparation:

- [ ] QBR Deck (8–12 слайдів) готовий за 2 дні до зустрічі
- [ ] Квартальний competitor analysis проведений
- [ ] Конкретні рекомендації (з числами та термінами, не загальні)
- [ ] YoY порівняння даних (MoM недостатньо для кварталу)

---

## 9.7 — Attribution & Common Pitfalls

**Що робимо:** Уникаємо хибних висновків що заводять стратегію не туди.

  | Проблема | Причина | Вирішення |
  |---|---|---|
  | Органіка йде у "(direct)" | Redirect strips UTMs | Перевірити redirect chain, cross-domain tracking |
  | Branded зростання = "SEO результат" | Реклама підняла brand searches | Сегментувати branded / non-branded у GSC |
  | Conversions не в органіці | Last-click модель | Перемкнути на Data-Driven attribution |
  | "Трафік виріс" — але боти | Bot filter вимкнений | Увімкнути у GA4 |
  | GSC clicks ≠ GA4 sessions | Різна методологія рахунку | Норма — розрив 10–30% завжди є |
  | Сезонне падіння = "провал SEO" | YoY не порівнювалось | Завжди YoY для сезонних ніш |

### Branded vs Non-Branded Split (щомісяця):

- [ ] GSC → Performance → фільтр Queries → "Contains [brand name]" → записати branded clicks
- [ ] Non-branded clicks = Total clicks − Branded clicks
- [ ] Відстежувати обидва: branded ріст = awareness; non-branded ріст = SEO результат

---

## 9.8 — SEO Health Score

**Що робимо:** Один агрегований бал що показує загальний стан проєкту — без занурення в деталі.

### Scorecard (заповнювати щомісяця):

  | Категорія | Вага | Оцінка (0–10) | Зважений бал |
  |---|---|---|---|
  | Organic Traffic trend | 20% | | |
  | Rankings trend | 20% | | |
  | Technical Health | 15% | | |
  | Content output + quality | 15% | | |
  | Link Building (нові RDs) | 15% | | |
  | Conversions (organic) | 15% | | |
  | **РАЗОМ** | 100% | | **/10** |

  | Бал | Статус | |
  |---|---|---|
  | 8–10 | 🟢 Excellent | Проєкт виконується відмінно |
  | 6–7.9 | 🟡 Good | Є зони росту, загалом добре |
  | 4–5.9 | 🟠 Needs Work | Є серйозні проблеми |
  | 0–3.9 | 🔴 Critical | Екстрений review |

---

## 9.9 — Tracking Setup Checklist (Фінальна верифікація)

> Виконати в перший тиждень проєкту. Не рухатись далі поки немає ✅ на всіх 🔴.

- [ ] 🔴 GA4 fires на всіх сторінках (Real-time перевірений)
- [ ] 🔴 Internal traffic виключений
- [ ] 🔴 Мінімум 2 Conversion Events налаштовані + перевірені
- [ ] 🔴 GSC верифікований + sitemap поданий
- [ ] 🔴 GSC ↔ GA4 linked
- [ ] 🔴 Rank Tracker налаштований (keywords + геолокація + alerts)
- [ ] 🟠 Baseline Metrics Snapshot збережений з датою
- [ ] 🟠 Looker Studio dashboard живий, клієнт має доступ
- [ ] 🟠 GSC email alerts увімкнені
- [ ] 🟠 GA4 attribution model → Data-Driven
- [ ] 🟡 Brand mention alerts (Google Alerts або Mention.com)
- [ ] 🟡 Backlink monitoring alerts (Ahrefs)
- [ ] 🟡 Uptime monitoring (UptimeRobot)
- [ ] 🟡 Bing Webmaster Tools верифікований

---

## 9.10 — Phase 9 Output

- [ ] **GA4** — conversions, bot filter, internal IP виключений, Data-Driven attribution
- [ ] **GSC** — верифікований, sitemap, linked до GA4, alerts увімкнені
- [ ] **Rank Tracker** — всі target keywords, гео, Mobile + Desktop, alerts
- [ ] **Looker Studio** — 6 сторінок, живий, клієнт має посилання
- [ ] **Перший Monthly Report** — надісланий клієнту
- [ ] **QBR Template** — готовий до першого кварталу
- [ ] **Branded/Non-branded split** — налаштований у GSC фільтрах

---

---

## SUMMARY: PHASES 0–9 COMPLETION CHECKLIST

| Phase | Виконано? | Результат | Дата |
|---|---|---|---|
| **0–3** Onboarding → Keywords | | Baseline + Topical Map | |
| **4** On-Page Optimization | | On-Page Tracker | |
| **5** Content Strategy | | Editorial Calendar + Content live | |
| **6** AI Search (GEO/AEO) | | AI Visibility Baseline | |
| **7** Local SEO | | GBP + Citations + Local Pages | |
| **8** Link Building | | Outreach Tracker + First Links | |
| **9.1** GA4 Setup | | Conversions + bot filter + internal IP | |
| **9.2** GSC Setup | | Верифікований + Sitemap + Alerts | |
| **9.3** Rank Tracking | | Tracker + groups + alerts активний | |
| **9.4** Looker Studio | | Dashboard live, клієнт має доступ | |
| **9.5** Monthly Report | | Перший звіт надісланий | |
| **9.6** QBR | | Template готовий | |
| **9.7** Attribution | | Branded/Non-branded split | |
| **9.8** SEO Health Score | | Перша оцінка зафіксована | |
| **9.9** Tracking Checklist | | Всі 🔴 пункти ✅ | |
| **9.10** Phase 9 Output | | Всі deliverables готові | |

---

> ✅ **Документ завершено. Всі 10 фаз охоплені.**
> Використовуй як живий SOP — заповнюй разом із Claude для кожного нового проєкту.

---

---

# PHASE 10 — ONGOING CADENCE & ALGORITHM RESPONSE

> **Мета:** Підтримувати та нарощувати SEO-результати у довгостроковій перспективі через системний ритм роботи та швидку реакцію на зміни Google.
> **Час:** Ongoing — весь термін проєкту
> **Дедлайн:** Запустити з першого місяця, підтримувати постійно
> **Результат:** Передбачувані результати, швидка реакція на зміни, масштабування без хаосу

---

## 10.1 — Weekly Cadence (Щотижневий ритм)

**Що робимо:** Короткі перевірки — 30–60 хвилин на тиждень. Ціль: виявляти проблеми до того, як вони стають кризою.

### Щопонеділкова перевірка (30 хв):

- [ ] **GSC Performance** → порівняти clicks та impressions з минулим тижнем
  - Різкий drop impressions (> -30%) → можливий technical issue або algorithm update
  - Drop clicks при стабільних impressions → CTR проблема (title/meta змінились?)
  - Spike → перевірити причину (нова сторінка потрапила в топ? вірусний контент?)

- [ ] **GSC Coverage** → нові errors або Excluded сторінки?
  - Нові 404 → зламані URL або internal links
  - Spike в "Crawled — currently not indexed" → можлива якість або дублікат проблема

- [ ] **Rank Tracker** → significant movements (±5 позицій для пріоритетних keywords)
  - Падіння топ BoFU keywords → негайна діагностика
  - Зростання → зафіксувати що зробили (для атрибуції)

- [ ] **Uptime monitor** → чи не було downtime за тиждень?

- [ ] **GBP** (якщо local) → нові відгуки, питання, фото від клієнтів

### Щотижневий лог (заповнювати):

  | Тиждень | GSC Clicks Δ | Coverage Errors | Rank Changes | Дії вжиті |
  |---|---|---|---|---|
  | W1 | | | | |
  | W2 | | | | |
  | W3 | | | | |
  | W4 | | | | |

---

## 10.2 — Monthly Cadence (Щомісячний ритм)

**Що робимо:** Повний огляд всіх метрик + виконання планових робіт.

### Перший тиждень місяця — Data Collection:

- [ ] Вивантажити GSC Performance за минулий місяць → Google Sheets snapshot
- [ ] Зафіксувати GA4 органічні sessions + conversions
- [ ] Зафіксувати Rank Tracker monthly summary (avg position, top movers)
- [ ] Зафіксувати Ahrefs: referring domains, DR, lost/new links
- [ ] Заповнити SEO Health Score (9.8)
- [ ] Скласти Monthly Report (9.5)

### Другий тиждень місяця — Content:

- [ ] Опублікувати заплановані статті згідно Editorial Calendar
- [ ] Подати нові URLs у GSC → Request Indexing
- [ ] Розпочати Content Brief для наступного місяця

### Третій тиждень місяця — Optimization:

- [ ] Content Refresh: оновити 1–2 сторінки з declining traffic
- [ ] Internal linking review: додати посилання з нових сторінок на старі та навпаки
- [ ] On-Page QA: перевірити 3–5 сторінок з Quick Wins list

### Четвертий тиждень місяця — Link Building & Planning:

- [ ] Відправити ≥ 20 outreach emails (guest posts / HARO replies / broken links)
- [ ] Перевірити нові та lost referring domains
- [ ] Скласти план робіт на наступний місяць
- [ ] Надіслати Monthly Report клієнту

### Monthly Checklist (повний):

  | Задача | Виконано | Дата |
  |---|---|---|
  | GSC + GA4 data export | | |
  | Rank tracker monthly review | | |
  | Referring domains check | | |
  | SEO Health Score оновлений | | |
  | Monthly Report надісланий | | |
  | Контент опублікований (N сторінок) | | |
  | Content Refresh (N сторінок) | | |
  | Outreach (≥ 20 emails) | | |
  | GBP Posts опубліковані (≥ 2) | | |
  | Нові відгуки — відповіді надіслані | | |
  | CWV check (PageSpeed Insights) | | |
  | Schema Enhancement report у GSC | | |
  | Plan наступного місяця готовий | | |

---

## 10.3 — Quarterly Cadence (Щоквартальний ритм)

**Що робимо:** Стратегічний рівень — адаптуємо стратегію, оновлюємо keyword universe, проводимо глибокий аудит.

### Quarterly Review Checklist:

**Стратегія:**
- [ ] QBR з клієнтом (agenda з Phase 9.6)
- [ ] KPI vs цілі: що досягли за квартал? Що ні? Чому?
- [ ] Переглянути та оновити SEO-стратегію якщо потрібно

**Keyword Universe Refresh:**
- [ ] Додати нові keywords що з'явились у GSC з impressions
- [ ] Перевірити нові PAA питання у ніші (AlsoAsked.com)
- [ ] Виявити нові keyword opportunities від конкурентів (Ahrefs Content Gap)
- [ ] Додати нові keywords у rank tracker

**Topical Coverage Audit:**
- [ ] Порівняти coverage vs конкурентів (Ahrefs Content Gap) — нові gaps?
- [ ] Які кластери повністю закриті? Які мають слабкі cluster pages?
- [ ] Визначити наступні 3 місяці контент пріоритети

**Technical Audit (mini):**
- [ ] Screaming Frog crawl → нові broken links, redirects, duplicate titles
- [ ] CWV check по всіх основних сторінках (не тільки homepage)
- [ ] Schema Enhancement report у GSC → нові errors?
- [ ] Sitemap перевірка → всі нові сторінки включені?

**Link Profile Audit:**
- [ ] Anchor text distribution → не перекошений на exact match?
- [ ] Spam score нових посилань → є нові токсичні?
- [ ] DR vs конкурентів → closing the gap?

**AI Search Quarterly Review:**
- [ ] AI Visibility Check (ChatGPT / Perplexity / Google SGE) — що змінилось?
- [ ] llms.txt актуальний? Нові сторінки додані до `## Pages`?
- [ ] Нові AI crawlers у ніші → додати до robots.txt?

**Content Performance Review:**
- [ ] Які статті дали найбільший ROI (трафік + конверсії)?
- [ ] Які статті показали content decay → черга на refresh
- [ ] Які типи контенту працюють найкраще? → більше такого

**Competitor Intelligence Update:**
- [ ] Нові конкуренти у SERP що з'явились?
- [ ] Які нові тактики використовують існуючі конкуренти?
- [ ] Нові backlinks конкурентів → нові link building opportunities?

---

## 10.4 — Google Algorithm Update Response Protocol

**Що робимо:** Коли виходить підтверджений Google update — чіткий план дій без паніки.

### Крок 1 — Детекція (День 0–3):

- [ ] Моніторинг джерел: Google Search Status Dashboard, Search Engine Roundtable, Barry Schwartz Twitter/X
- [ ] Перевірити GSC Performance: порівняти 7 днів до та після дати update
- [ ] Перевірити GA4: organic sessions тренд
- [ ] Перевірити rank tracker: масові зміни позицій?

  ```
  Дата update:
  Тип update: [Core / Helpful Content / Spam / Link / Reviews / Other]
  Вплив на наш сайт: [Позитивний / Нейтральний / Негативний / Невідомо]
  Зміна трафіку: Δ X% (порівняно з тижнем до)
  Зміна avg position: Δ X
  ```

### Крок 2 — Діагностика (День 3–7):

- [ ] Виявити **сторінки що втратили ≥ 30% трафіку** (GA4 → Compare → Landing Pages)
- [ ] Виявити **keywords що впали на ≥ 10 позицій** (rank tracker)
- [ ] Подивитись хто зайняв місце: який тип контенту виграв?

  | Тип Update | Де шукати причину |
  |---|---|
  | **Core Update** | Topical authority, E-E-A-T, content depth, entity signals |
  | **Helpful Content** | Originality, author credentials, "written for humans", primary purpose |
  | **Spam Update** | Backlink profile, keyword stuffing, cloaking, doorway pages |
  | **Link Spam** | Toxic/purchased links, unnatural anchor text |
  | **Reviews Update** | Thin review content, no first-hand experience |

### Крок 3 — Recovery Plan (День 7–30):

**Core Update recovery:**
- [ ] Аудит E-E-A-T на сторінках що впали: автор, credentials, trust signals
- [ ] Порівняти контент з тим що зараз ранжується: глибина, format, оригінальність
- [ ] Перевірити topical authority: чи є gaps у кластерах? Чи конкурент покриває тему краще?
- [ ] Оновити застарілий контент (дати, статистика, посилання)
- [ ] ❗ Core updates rollout займає 2 тижні — не робити різких змін поки не стабілізується

**Helpful Content recovery:**
- [ ] Перевірити: чи є на сайті AI-generated контент без редактури?
- [ ] Перевірити: чи є сторінки "для пошукових систем" а не для людей?
- [ ] Перевірити: чи є надлишкові рекламні блоки що погіршують UX?
- [ ] Переписати слабкий контент з реальним досвідом та expertise
- [ ] Розглянути noindex або consolidation для thin content сторінок

**Spam recovery:**
- [ ] Якщо manual action → GSC → Manual Actions → перевірити
- [ ] Провести backlink audit → підготувати disavow file
- [ ] Виявити keyword stuffing → переписати природно
- [ ] Виявити doorway pages → merge або суттєво покращити

**Крок 4 — Моніторинг Recovery:**
- [ ] Перевіряти позиції щотижня після внесених змін
- [ ] Recovery від Core Update: може зайняти до наступного Core Update (3–6 місяців)
- [ ] Фіксувати все що змінили та коли → для атрибуції recovery

### Algorithm Update Log (вести весь проєкт):

  | Дата | Тип Update | Вплив | Δ Трафік | Δ Позиції | Дії вжиті | Recovery? |
  |---|---|---|---|---|---|---|
  | | | Neg/Pos/Neutral | | | | |

---

## 10.5 — Cannibalization Monitoring

**Що робимо:** Keyword cannibalization руйнує rankings поступово. Ловимо та вирішуємо системно.

### Як виявити:

- [ ] Ahrefs → Site Explorer → Organic Keywords → фільтр keyword → якщо 2+ сторінки ранжуються
- [ ] GSC → Performance → Query → подивитись які URLs показуються для одного query
- [ ] Screaming Frog → Content → Near Duplicate Content

### Рішення по ситуаціях:

  | Ситуація | Вирішення |
  |---|---|
  | Дві схожі статті на одну тему | Merge (301 слабкої → сильнішу) + об'єднати контент |
  | Service page + blog article конкурують | Differentiate intent: service = transactional, blog = informational |
  | Paginated pages конкурують | Canonical → page 1 для всіх pagination |
  | Local pages конкурують між собою | Перевірити URL uniqueness, посилити differentiators |
  | Стара та нова стаття на ту саму тему | 301 old → new (якщо new краща) АБО refresh old |

---

## 10.6 — Seasonal SEO Planning

**Що робимо:** Планування SEO під сезонні піки — контент та оптимізація мають бути готові заздалегідь.

### Правило випередження:

> Контент для сезонного піку треба публікувати за **2–3 місяці** до пікового попиту — Google потребує часу для індексації та тестування.

### Seasonal Planning Calendar:

- [ ] Виявити сезонні піки у ніші клієнта (Google Trends → порівняти 5 років)
- [ ] Скласти Seasonal Content Calendar:

  | Місяць пік | Контент готовий до | Тип контенту | Keywords |
  |---|---|---|---|
  | Листопад (Black Friday) | Вересень | Comparison + promo pages | "[service] black friday deal" |
  | Січень (New Year resolutions) | Листопад | "How to" guides | "how to [goal] in 2027" |
  | Березень (Q1 planning) | Січень | B2B guides | "[service] for Q1 growth" |

- [ ] Для eCommerce: Sale pages + category pages готові за 8–10 тижнів до сезону
- [ ] Для B2B: Thought leadership + guides готові за 3 місяці до planning season

---

## 10.7 — Competitor Monitoring Routine

**Що робимо:** Конкуренти не стоять на місці. Системно відстежуємо їхні рухи.

### Щомісячний competitor check (30 хв):

- [ ] Ahrefs → Competitors → New Backlinks (що нового отримали за місяць?)
- [ ] Ahrefs → Competitors → New Pages (які нові сторінки опублікували?)
- [ ] Перевірити топ-5 конкурентів у SERP для головних BoFU keywords → позиції змінились?
- [ ] Перевірити чи конкурент запустив нові linkable assets → нова загроза або opportunity?

### Quarterly competitor deep dive (2 год):

- [ ] Content Gap оновлення: нові теми що вони покрили?
- [ ] Backlink Gap: нові linking domains де вони є, ми ні?
- [ ] Schema: нові rich results що вони отримали?
- [ ] GBP (local): нові відгуки, оновлення категорій?
- [ ] AI visibility: чи цитуються конкуренти у ChatGPT/Perplexity де нас немає?

  | Конкурент | Нові backlinks/міс | Нові сторінки/міс | Нові BoFU rankings | Дія для нас |
  |---|---|---|---|---|
  | | | | | |

---

## 10.8 — Scaling Protocol

**Що робимо:** Коли базові результати досягнуті — масштабуємо системно.

### Сигнали що час масштабуватись:

- [ ] DR ≥ 40 → можна йти за більш конкурентними keywords
- [ ] Organic traffic стабільно зростає 3+ місяці → масштабувати контент
- [ ] BoFU сторінки конвертують → масштабувати на нові гео/послуги
- [ ] Topical Authority у 1–2 кластерах → розширити на суміжні кластери

### Scaling Levers:

  | Lever | Як масштабувати | Умова |
  |---|---|---|
  | **Контент** | Збільшити frequency (1 → 2–3 статті/тиждень) | Editorial process налагоджений |
  | **Local pages** | Додати нові міста до programmatic rollout | Якісний template + unique content |
  | **Keywords** | Розширити на суміжні ніші та довші tail | DR дозволяє конкурувати |
  | **Link Building** | Додати 1–2 нові тактики (Digital PR, podcasts) | Базові тактики дають результат |
  | **Мови** | Multilingual expansion (EN → FR для Канади) | Окремий keyword research по мові |
  | **Gео** | Новий регіон або країна | Competitor analysis для нового ринку |

---

## 10.9 — Project Handoff Protocol

**Що робимо:** Якщо проєкт передається іншому спеціалісту або агенції — забезпечуємо continuity.

### Handoff Package:

- [ ] **SEO Audit документ** — поточний стан (оновлений)
- [ ] **Baseline + Historical Metrics** — всі snapshots з датами
- [ ] **Keyword Master List** — актуальний, з поточними позиціями
- [ ] **Content Production Queue** — що заплановано, що в роботі
- [ ] **Editorial Calendar** — наступні 3 місяці
- [ ] **Link Building Tracker** — всі відкриті outreach threads
- [ ] **Looker Studio Dashboard** — передати доступ
- [ ] **GSC + GA4** — додати нового власника, прибрати старого
- [ ] **GBP** — передати управління (якщо local)
- [ ] **Algorithm Update Log** — вся історія updates та реакцій
- [ ] **Handoff Call** (60 хв): walk-through всіх активних ініціатив

---

## 10.10 — Master Ongoing Task Board

**Що робимо:** Єдиний центр управління поточними SEO-задачами.

### Структура Task Board (Notion / Trello / Asana):

```
BOARDS:
├── 🔴 Urgent (виконати цього тижня)
├── 🟠 This Month (поточний місяць)
├── 🟡 Next Month (наступний місяць)
├── 🟢 Backlog (коли буде час)
├── ✅ Done (архів з датою)
└── 🔄 Recurring (recurring tasks з frequency)

RECURRING TASKS:
Weekly:
  - GSC Performance check
  - Rank tracker review
  - GBP responses

Monthly:
  - Content publish (N articles)
  - Outreach (≥ 20 emails)
  - Monthly Report
  - CWV check

Quarterly:
  - QBR
  - Technical audit (mini)
  - Keyword refresh
  - Competitor deep dive
  - llms.txt update
```

---

## 10.11 — Phase 10 Output

- [ ] **Weekly check routine** — запущений, лог ведеться
- [ ] **Monthly Cadence** — всі задачі в Task Board з дедлайнами
- [ ] **Quarterly Review** — перший QBR проведений
- [ ] **Algorithm Update Log** — шаблон готовий, вести з першого дня
- [ ] **Seasonal Calendar** — піки виявлені, контент запланований заздалегідь
- [ ] **Competitor Monitoring** — щомісячний check в routine
- [ ] **Scaling Plan** — визначено коли та як масштабувати

---

---

## MASTER SUMMARY: ПОВНИЙ WORKFLOW (PHASES 0–10)

> Фінальний чеклист для перевірки що весь SOP запущений та виконується.

| # | Phase | Ключовий Deliverable | Статус | Дата |
|---|---|---|---|---|
| **0** | Onboarding & Discovery | Project Card + Baseline + Competitors | | |
| **1** | Technical SEO Audit | Prioritized Fix List (Critical виправлені) | | |
| **2** | Entity SEO & E-E-A-T | Schema ✅ + llms.txt ✅ + NAP unified ✅ | | |
| **3** | Keyword & Topical Map | Keyword Master List + Cluster Map | | |
| **4** | On-Page Optimization | On-Page Tracker (топ-20 сторінок оптимізовані) | | |
| **5** | Content Strategy | Editorial Calendar + Перші 4 сторінки live | | |
| **6** | AI Search (GEO/AEO) | AI Visibility Baseline + llms.txt якісний | | |
| **7** | Local SEO | GBP ✅ + NAP ✅ + Local Pages ✅ | | |
| **8** | Link Building | Outreach активний + ≥ 3 нові RDs/міс | | |
| **9** | Analytics & Reporting | GA4 ✅ + GSC ✅ + Dashboard ✅ + Звіт ✅ | | |
| **10** | Ongoing Cadence | Weekly/Monthly/Quarterly routine запущений | | |

---

## ШВИДКИЙ ДОВІДНИК — Коли що використовувати

| Ситуація | Іди до |
|---|---|
| Новий проєкт — з чого почати? | Phase 0 → 9 (tracking) → 1 → 2 паралельно |
| Трафік різко впав | 10.4 Algorithm Update Protocol |
| Клієнт питає про результати | Phase 9.5 Monthly Report |
| Потрібно написати нову статтю | Phase 5.1 Content Brief |
| Готуємо нову сторінку до публікації | Phase 4.10 Pre-Publish QA |
| Сторінка в позиції 4–15 | Phase 4.9 On-Page Audit Protocol |
| Конкурент обійшов нас | Phase 10.7 Competitor Monitoring |
| Клієнт хоче йти в нове місто | Phase 7.7 Local Landing Pages |
| Потрібні посилання | Phase 8.1 Strategy Selection |
| Хочемо потрапити в AI Overview | Phase 6.3 Google AI Overviews |
| Schema errors у GSC | Phase 2.3 Schema Audit |
| CWV у червоній зоні | Phase 1.4 Core Web Vitals |
| Квартальний звіт | Phase 9.6 QBR |
| Масштабуємось | Phase 10.8 Scaling Protocol |

---

*SEO Project Workflow — Phases 0–10 | Версія 2.0 | 2026-04*
*Оновлювати: щоквартально або після значних змін Google алгоритму*
*Наступний review: 2026-07*

| Phase | Виконано? | Результат | Дата |
|---|---|---|---|
| **0–3** Onboarding → Keywords | | Baseline + Topical Map | |
| **4** On-Page Optimization | | On-Page Tracker | |
| **5** Content Strategy | | Editorial Calendar + Content live | |
| **6** AI Search (GEO/AEO) | | AI Visibility Baseline | |
| **7** Local SEO | | GBP + Citations + Local Pages | |
| **8.0** Backlink Audit | | Audit + Disavow (якщо потрібно) | |
| **8.1** Strategy Selection | | 2–3 тактики обрані | |
| **8.2** Guest Posting | | Prospect list + outreach запущений | |
| **8.3** Digital PR | | Asset ідея або в розробці | |
| **8.4** HARO / Qwoted | | Зареєстровані + alerts | |
| **8.5** Broken Link Building | | Перший batch prospects | |
| **8.6** Unlinked Mentions | | Mentions знайдені + outreach | |
| **8.7** Resource Pages | | Prospects + outreach | |
| **8.8** Podcast Appearances | | Pitch відправлений | |
| **8.9** Partnership Links | | Партнерства верифіковані | |
| **8.10** Link Tracker | | Tracker активний + KPIs | |
| **8.11** Linkable Asset | | Asset запланований | |
| **8.12** Phase 8 Output | | Всі deliverables готові | |

---

> **Далі: Phase 9 — Analytics & Reporting | Phase 10 — Ongoing Cadence**
> Скажи "Переходимо до Phase 9" — і продовжимо.
