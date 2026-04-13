# Boomy Marketing — TOP 10 SEO Priority Actions
> **Мета:** Підняти позиції, CTR, цільовий трафік, нові клієнти
> **Підхід:** Найбільший вплив × найшвидша реалізація
> **Дата:** 2026-04-13

---

## Як користуватись цим файлом

1. Відкрий задачу → прочитай **Проблему** + **Вплив**
2. Скопіюй **Prompt** → вставте у Claude Code
3. Перевір результат → зроби commit
4. Постав ✅ і переходь до наступної

| # | Задача | Вплив | Час | Статус |
|---|--------|-------|-----|--------|
| 1 | Додати OAI-SearchBot у robots.txt | AI Search | 5 хв | ⬜ |
| 2 | Виправити ім'я компанії (NAP consistency) | Entity SEO | 15 хв | ⬜ |
| 3 | Виправити дату заснування | Trust / E-E-A-T | 10 хв | ⬜ |
| 4 | Додати og:image на homepage | CTR у пошуку | 20 хв | ⬜ |
| 5 | Виправити телефон на всіх local pages | Schema / NAP | 30 хв | ⬜ |
| 6 | Додати GeoCoordinates на всі local pages | Local Pack | 45 хв | ⬜ |
| 7 | Додати addressRegion на всі local pages | Local SEO | 30 хв | ⬜ |
| 8 | Виправити title tags (регістр) на local pages | CTR | 20 хв | ⬜ |
| 9 | Оновити llms.txt (phone + ## Pages) | AI Search | 15 хв | ⬜ |
| 10 | Виправити aggregateRating або прибрати | Trust | 20 хв | ⬜ |

---

## Крок 1 — Додати OAI-SearchBot у robots.txt

### Проблема
`robots.txt` дозволяє GPTBot, ClaudeBot, Google-Extended, PerplexityBot — але **OAI-SearchBot** (OpenAI live search) відсутній. ChatGPT Search не може повноцінно сканувати сайт.

### Вплив
- AI Overview, ChatGPT Search — додаткові джерела трафіку
- Конкуренти вже оптимізовані для цього каналу

### Prompt для Claude Code
```
Відкрий файл robots.txt у кореневій папці проєкту.

Знайди блок з AI crawlers (після рядка "# AI crawlers").
Додай після блоку "anthropic-ai" наступний блок:

User-agent: OAI-SearchBot
Allow: /

Також перевір: чи є named AI crawler блоки (GPTBot, ClaudeBot тощо) ПІСЛЯ рядка "Disallow: /local/" у секції User-agent: *?
Якщо так — перемісти всі named AI crawler блоки ПЕРЕД першим User-agent: * блоком, щоб вони мали пріоритет над загальним Disallow: /local/.

Покажи мені diff змін перед збереженням.
```

---

## Крок 2 — Виправити ім'я компанії (NAP Entity Consistency)

### Проблема
- `index.html` schema: `"name": "Boomy Marketing Agency"` ✅
- `local/*/index.html` schema: `"name": "Boomy Marketing"` ❌ (без "Agency")
- Google бачить два різних entity — знижує авторитет

### Вплив
- Entity SEO: Google Knowledge Panel
- Local Pack: NAP match
- E-E-A-T: Trust signals

### Prompt для Claude Code
```
Зроби пошук по всіх HTML файлах у папці /local/ цього проєкту.
Знайди всі входження рядка "Boomy Marketing" у JSON-LD schema (тобто у тегах <script type="application/ld+json">).

Перевір: чи є там "name": "Boomy Marketing" БЕЗ слова "Agency"?
Якщо так — заміни "Boomy Marketing" на "Boomy Marketing Agency" у всіх таких місцях.

ВАЖЛИВО:
- Змінюй тільки значення поля "name" у JSON-LD
- Не чіпай відображуваний текст на сторінці (заголовки, параграфи)
- Не чіпай URL-и та slug-и

Покажи кількість файлів де зробили заміну + перший приклад до/після.
```

---

## Крок 3 — Виправити дату заснування

### Проблема
- `index.html` schema: `"foundingDate": "2013"` ❌
- `about.html` schema і текст: "2020" — реальна дата

Google зважує сигнали і бачить протиріччя → знижує довіру до entity.

### Вплив
- Knowledge Panel accuracy
- E-E-A-T Trust score
- Brand SERP

### Prompt для Claude Code
```
Відкрий файл index.html у кореневій папці проєкту.

Знайди у JSON-LD schema рядок "foundingDate": "2013".
Заміни на "foundingDate": "2020".

Потім відкрий about.html і перевір яка дата там вказана в schema та в тексті сторінки.
Переконайся що всюди однакова дата — 2020.

Покажи всі місця де зробив заміну.
```

---

## Крок 4 — Додати og:image на homepage (Critical CTR Fix)

### Проблема
На `index.html` відсутній `<meta property="og:image">`.
Коли сайт шерять у соцмережах або Google показує картку — немає зображення.
CTR у rich results падає на 25–40%.

### Вплив
- CTR у Google Search (image в результатах)
- Соціальний CTR при шерингу
- Виглядає непрофесійно при пошуку назви бренду

### Prompt для Claude Code
```
Відкрий файл index.html у кореневій папці проєкту.

Знайди секцію <head> і Open Graph теги (meta property="og:*").
Після тегу <meta property="og:description"> додай:

<meta property="og:image" content="https://boomymarketing.com/assets/images/boomy-marketing-og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Boomy Marketing Agency — Digital Marketing in Toronto">

Також додай Twitter Card теги якщо їх немає:
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="https://boomymarketing.com/assets/images/boomy-marketing-og-image.jpg">

ПРИМІТКА: Після цього потрібно буде створити реальне зображення 1200×630px і завантажити як /assets/images/boomy-marketing-og-image.jpg
Покажи де саме у файлі вставив теги.
```

---

## Крок 5 — Виправити формат телефону на всіх local pages

### Проблема
- `local/toronto/seo-agency/index.html` schema: `"telephone": "(647) 370-1888"` ❌
- `index.html` schema: `"telephone": "+16473701888"` ✅ (правильний E.164)
- `tel:` href на local pages: `tel:+1647370188` ❌ (не вистачає цифри — 10 цифр замість 11!)

### Вплив
- Schema validation errors у GSC
- NAP consistency (call tracking, citations)
- Клієнти не можуть зателефонувати з мобільного

### Prompt для Claude Code
```
Знайди всі HTML файли у папці /local/ цього проєкту.

Для кожного файлу зроби наступні заміни:

1. У JSON-LD schema:
   Заміни "telephone": "(647) 370-1888" на "telephone": "+16473701888"

2. У href атрибутах:
   Заміни tel:+1647370188 на tel:+16473701888
   (перевір точну кількість цифр — має бути 11 після +1647370)

3. Перевір чи є відображуваний текст телефону у форматі "(647) 370-1888" — його НЕ міняй, він для людей

Покажи:
- Кількість файлів де зроблені заміни
- Приклад одного файлу до/після (тільки змінені рядки)
```

---

## Крок 6 — Додати GeoCoordinates на всі local pages

### Проблема
Всі local pages мають порожній об'єкт:
```json
"geo": {"@type": "GeoCoordinates"}
```
Без lat/lng Google не може прив'язати сторінку до місця — Local Pack ranking страждає.

### Вплив
- Local Pack появи (найцінніший результат для B2B)
- Map ranking
- "Near me" queries

### Координати по містах (Toronto — головний офіс)
```
Toronto: lat 43.6532, lng -79.3832
Vancouver: lat 49.2827, lng -123.1207
Calgary: lat 51.0447, lng -114.0719
Ottawa: lat 45.4215, lng -75.6972
Edmonton: lat 53.5461, lng -113.4938
Mississauga: lat 43.5890, lng -79.6441
Brampton: lat 43.7315, lng -79.7624
Hamilton: lat 43.2557, lng -79.8711
London (ON): lat 42.9849, lng -81.2453
Markham: lat 43.8561, lng -79.3370
Richmond Hill: lat 43.8828, lng -79.4403
Oakville: lat 43.4675, lng -79.6877
Burlington: lat 43.3255, lng -79.7990
Oshawa: lat 43.8971, lng -78.8658
Kitchener: lat 43.4516, lng -80.4925
Barrie: lat 44.3894, lng -79.6903
Surrey: lat 49.1913, lng -122.8490
Burnaby: lat 49.2488, lng -122.9805
Coquitlam: lat 49.2838, lng -122.7932
Victoria: lat 48.4284, lng -123.3656
Saskatoon: lat 52.1332, lng -106.6700
Regina: lat 50.4452, lng -104.6189
Halifax: lat 44.6488, lng -63.5752
Charlottetown: lat 46.2382, lng -63.1311
Abbotsford: lat 49.0504, lng -122.3045
```

### Prompt для Claude Code
```
Мені потрібно оновити GeoCoordinates у JSON-LD schema для всіх local pages.

Є папки: /local/toronto/, /local/vancouver/, /local/calgary/ тощо.

Для кожного міста замінити:
"geo": {"@type": "GeoCoordinates"}
на відповідні координати. Наприклад для toronto:
"geo": {"@type": "GeoCoordinates", "latitude": 43.6532, "longitude": -79.3832}

Координати по містах:
- toronto: lat 43.6532, lng -79.3832
- vancouver: lat 49.2827, lng -123.1207
- calgary: lat 51.0447, lng -114.0719
- ottawa: lat 45.4215, lng -75.6972
- edmonton: lat 53.5461, lng -113.4938
- mississauga: lat 43.5890, lng -79.6441
- brampton: lat 43.7315, lng -79.7624
- hamilton: lat 43.2557, lng -79.8711
- markham: lat 43.8561, lng -79.3370
- richmond-hill: lat 43.8828, lng -79.4403
- oakville: lat 43.4675, lng -79.6877
- burlington: lat 43.3255, lng -79.7990
- oshawa: lat 43.8971, lng -78.8658
- kitchener: lat 43.4516, lng -80.4925
- barrie: lat 44.3894, lng -79.6903
- surrey: lat 49.1913, lng -122.8490
- burnaby: lat 49.2488, lng -122.9805
- coquitlam: lat 49.2838, lng -122.7932
- victoria: lat 48.4284, lng -123.3656
- saskatoon: lat 52.1332, lng -106.6700
- regina: lat 50.4452, lng -104.6189
- halifax: lat 44.6488, lng -63.5752
- charlottetown: lat 46.2382, lng -63.1311
- abbotsford: lat 49.0504, lng -122.3045

Зроби зміни у всіх HTML файлах у відповідних папках.
Покажи скільки файлів оновлено по кожному місту.
```

---

## Крок 7 — Додати addressRegion на всі local pages

### Проблема
У `PostalAddress` schema на local pages відсутній `addressRegion` (провінція: "ON", "BC", "AB" тощо).
Google не може правильно класифікувати регіон.

### Вплив
- Local Pack qualifier (місто + провінція)
- Schema validation в GSC
- Structured data rich results

### Провінції по містах
```
ON (Ontario): Toronto, Mississauga, Brampton, Hamilton, Ottawa, Markham,
              Richmond Hill, Oakville, Burlington, Oshawa, Kitchener, Barrie
BC (British Columbia): Vancouver, Surrey, Burnaby, Coquitlam, Victoria, Abbotsford
AB (Alberta): Calgary, Edmonton
SK (Saskatchewan): Saskatoon, Regina
NS (Nova Scotia): Halifax
PE (Prince Edward Island): Charlottetown
```

### Prompt для Claude Code
```
Відкрий кілька local page файлів (наприклад /local/toronto/seo-agency/index.html та /local/vancouver/seo-agency/index.html).

Знайди у JSON-LD schema об'єкт "address" типу "PostalAddress".
Перевір чи є поле "addressRegion".
Якщо немає — додай його.

Правила по містах:
- toronto, mississauga, brampton, hamilton, ottawa, markham, richmond-hill, oakville, burlington, oshawa, kitchener, barrie → "addressRegion": "ON"
- vancouver, surrey, burnaby, coquitlam, victoria, abbotsford → "addressRegion": "BC"
- calgary, edmonton → "addressRegion": "AB"
- saskatoon, regina → "addressRegion": "SK"
- halifax → "addressRegion": "NS"
- charlottetown → "addressRegion": "PE"

Також перевір "addressCountry" — має бути "CA" (не "Canada").

Зроби зміни у всіх HTML файлах відповідних папок.
Покажи diff для одного файлу як приклад.
```

---

## Крок 8 — Виправити title tags на local pages (CTR Fix)

### Проблема
Поточні title tags на local pages мають непослідовний регістр:
- `"Affordable Seo Agency in Toronto"` — "Seo" з маленької
- `"Best Seo Company Toronto"` — "Seo" замість "SEO"

**SEO** — це абревіатура, завжди пишеться великими літерами.

### Вплив
- CTR у пошуковій видачі (виглядає непрофесійно)
- Брендова довіра
- Click-through rate по branded queries

### Prompt для Claude Code
```
Знайди всі HTML файли у папці /local/ цього проєкту.

Перевір <title> теги на кожній сторінці.
Знайди всі входження "Seo" (з великої S, маленька eo) або "seo" (повністю малими).

Заміни:
- " Seo " → " SEO " (з пробілами навколо)
- " Seo" наприкінці → " SEO"
- "Seo " на початку → "SEO "

Так само перевір "Ppc" → "PPC", "Ai " → "AI ".

Покажи список всіх файлів де зроблені зміни + старий та новий title.
```

---

## Крок 9 — Оновити llms.txt (AI Search Readiness)

### Проблема
`llms.txt` — інструкція для AI асистентів (ChatGPT, Claude, Perplexity) як описувати компанію.
Поточні проблеми:
1. Телефон у форматі `(647) 370-1888` замість `+16473701888`
2. Немає `## Pages` розділу — AI не знає які сторінки є на сайті
3. Немає licensing statement

### Вплив
- ChatGPT, Perplexity, Claude згадують правильний телефон
- AI може посилатись на конкретні сторінки сайту
- Brand mentions у AI-generated content

### Prompt для Claude Code
```
Відкрий файл llms.txt у кореневій папці проєкту.

Зроби наступні зміни:

1. Знайди телефон у форматі "(647) 370-1888" і заміни на "+1 (647) 370-1888"

2. Після останнього розділу додай новий розділ ## Pages з ключовими сторінками:

## Pages

- [Home](https://boomymarketing.com): Digital marketing agency overview and services
- [SEO Services](https://boomymarketing.com/seo): Search engine optimization for Canadian businesses
- [Google Ads / PPC](https://boomymarketing.com/google-ads): Pay-per-click advertising management
- [Social Media Marketing](https://boomymarketing.com/social-media-marketing): Social media strategy and management
- [Web Design](https://boomymarketing.com/web-design): Professional website design services
- [Content Marketing](https://boomymarketing.com/content-marketing): Content strategy and creation
- [AI Automation](https://boomymarketing.com/ai-automation): AI-powered marketing automation
- [Toronto SEO Agency](https://boomymarketing.com/local/toronto/seo-agency): Local SEO services in Toronto
- [Vancouver SEO Agency](https://boomymarketing.com/local/vancouver/seo-agency): Local SEO services in Vancouver
- [Calgary SEO Agency](https://boomymarketing.com/local/calgary/seo-agency): Local SEO services in Calgary
- [About Us](https://boomymarketing.com/about): Our team, story, and approach
- [Blog](https://boomymarketing.com/blog): Digital marketing insights and guides
- [Contact](https://boomymarketing.com/contact): Get in touch with our team

3. Також додай перед ## Pages:

## License
Content on this site is © 2020-2026 Boomy Marketing Agency. All rights reserved.
Reproduction requires written permission.

Покажи повний оновлений файл.
```

---

## Крок 10 — Виправити aggregateRating (Trust & Policy Compliance)

### Проблема
Всі local pages мають захардкодений рейтинг:
```json
"aggregateRating": {"@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "127"}
```
Але на сторінках **немає видимих відгуків**.
Google's policy: aggregateRating schema без visible review content → може призвести до Manual Action.

### Варіанти вирішення
- **Варіант A:** Прибрати aggregateRating з local pages (безпечно, але втрачаємо зірки)
- **Варіант B:** Додати реальні відгуки на сторінки (краще для CTR, але потребує контенту)
- **Варіант C:** Перенести aggregateRating тільки на homepage де є секція з відгуками

### Вплив
- Google Manual Action prevention (критично!)
- CTR через star ratings у SERP
- Trust signals

### Prompt для Claude Code (Варіант A — швидкий і безпечний)
```
Знайди всі HTML файли у папці /local/ цього проєкту.

У кожному файлі знайди JSON-LD schema і видали блок "aggregateRating":
{
  "@type": "AggregateRating",
  "ratingValue": "4.9",
  "reviewCount": "127"
}
(включно з комою перед або після блоку)

ВАЖЛИВО: Не видаляй цей блок з index.html у кореневій папці — тільки з /local/ файлів.

Після видалення перевір що JSON-LD залишається валідним (немає зайвих ком, дужки закриті).

Покажи кількість файлів де видалено + один приклад до/після.
```

### Prompt для Claude Code (Варіант B — додати відгуки на сторінки)
```
Я хочу додати реальний блок відгуків на local pages щоб виправдати aggregateRating schema.

Відкрий файл /local/toronto/seo-agency/index.html.

Знайди місце перед закриваючим тегом </main> або перед footer.
Додай HTML секцію з 3 відгуками у форматі:

<section class="reviews" aria-label="Client Reviews">
  <h2>What Our Toronto Clients Say</h2>
  <div class="review-item" itemscope itemtype="https://schema.org/Review">
    <meta itemprop="reviewRating" content="5">
    <p itemprop="reviewBody">"Boomy Marketing Agency transformed our online presence. We saw a 150% increase in organic traffic within 6 months."</p>
    <cite itemprop="author">— Sarah K., E-commerce Business Owner, Toronto</cite>
  </div>
  <!-- додати ще 2 відгуки -->
</section>

Покажи як виглядає результат і скажи скільки файлів потрібно оновити аналогічно.
```

---

## Бонус — Розширити areaServed на homepage

### Проблема
`index.html` schema: `"areaServed": "Toronto, Canada"` — занадто вузько.
Boomy Marketing обслуговує всю Канаду.

### Prompt для Claude Code
```
Відкрий index.html у кореневій папці.

Знайди у JSON-LD schema поле "areaServed": "Toronto, Canada".

Заміни на масив з усіма містами де є local pages:

"areaServed": [
  {"@type": "City", "name": "Toronto", "containedInPlace": {"@type": "State", "name": "Ontario"}},
  {"@type": "City", "name": "Vancouver", "containedInPlace": {"@type": "State", "name": "British Columbia"}},
  {"@type": "City", "name": "Calgary", "containedInPlace": {"@type": "State", "name": "Alberta"}},
  {"@type": "City", "name": "Ottawa", "containedInPlace": {"@type": "State", "name": "Ontario"}},
  {"@type": "City", "name": "Edmonton", "containedInPlace": {"@type": "State", "name": "Alberta"}},
  {"@type": "City", "name": "Mississauga", "containedInPlace": {"@type": "State", "name": "Ontario"}},
  {"@type": "City", "name": "Brampton", "containedInPlace": {"@type": "State", "name": "Ontario"}},
  {"@type": "City", "name": "Hamilton", "containedInPlace": {"@type": "State", "name": "Ontario"}},
  {"@type": "City", "name": "Markham", "containedInPlace": {"@type": "State", "name": "Ontario"}},
  {"@type": "City", "name": "Surrey", "containedInPlace": {"@type": "State", "name": "British Columbia"}},
  {"@type": "City", "name": "Burnaby", "containedInPlace": {"@type": "State", "name": "British Columbia"}},
  {"@type": "City", "name": "Halifax", "containedInPlace": {"@type": "State", "name": "Nova Scotia"}},
  {"@type": "City", "name": "Victoria", "containedInPlace": {"@type": "State", "name": "British Columbia"}},
  {"@type": "City", "name": "Saskatoon", "containedInPlace": {"@type": "State", "name": "Saskatchewan"}},
  {"@type": "City", "name": "Regina", "containedInPlace": {"@type": "State", "name": "Saskatchewan"}},
  {"@type": "Country", "name": "Canada"}
],

Покажи diff змін.
```

---

## Швидкий старт — перші 3 кроки сьогодні

Якщо хочеш максимум за мінімум часу — зроби сьогодні кроки **1, 2, 3**:

1. **robots.txt + OAI-SearchBot** (5 хв) → AI Search coverage
2. **Name consistency** (15 хв) → Entity authority
3. **foundingDate fix** (10 хв) → Trust signal

Разом: 30 хвилин роботи, commit, deploy → Google побачить зміни протягом 2–7 днів.

---

## Після кожного кроку

```
git add -p
git commit -m "fix(seo): [описати що зроблено]"
git push
```

Перевір у:
- [Google Rich Results Test](https://search.google.com/test/rich-results) — schema validation
- [Google Search Console](https://search.google.com/search-console) → Enhancements → Schema errors
- [Schema.org Validator](https://validator.schema.org/) — повна валідація

---

*Документ створено: 2026-04-13 | Проєкт: Boomy Marketing | boomymarketing.com*

---

# Технічний SEO — TOP 10 (Раунд 2)
> **Фокус:** Технічні помилки що блокують ріст — внутрішні посилання, дублі, canonical, schema
> **Дата:** 2026-04-13 | Всі кроки Раунду 1 виконані ✅

## Статус виконання

| # | Задача | Вплив | Час | Статус |
|---|--------|-------|-----|--------|
| T1 | Виправити зламані посилання у locations hub | Crawl / Link Equity | 20 хв | ⬜ |
| T2 | Canonical trailing slash у locations/index.html | Crawl / Duplicate | 5 хв | ⬜ |
| T3 | about.html: name + BreadcrumbList URL | Entity SEO | 10 хв | ⬜ |
| T4 | Meta descriptions: прибрати "..." truncation | CTR | 30 хв | ⬜ |
| T5 | BreadcrumbList: "Seo" → "SEO" у всіх local pages | Schema / CTR | 15 хв | ⬜ |
| T6 | Schema description field: lowercase → правильний | Schema quality | 20 хв | ⬜ |
| T7 | FAQ schema: lowercase service names → uppercase | Rich Results | 30 хв | ⬜ |
| T8 | Homepage meta description — назва компанії | Brand / CTR | 5 хв | ⬜ |
| T9 | Внутрішні посилання: homepage → local pages | Link Equity | 30 хв | ⬜ |
| T10 | areaServed на homepage — розширити до всіх міст | Entity / Local | 15 хв | ⬜ |

---

## T1 — Виправити зламані посилання у locations hub (КРИТИЧНО)

### Проблема
`locations/index.html` містить посилання типу:
```html
<a href="https://boomymarketing.com/seo/on/toronto/">Toronto</a>
<a href="https://boomymarketing.com/seo/bc/vancouver/">Vancouver</a>
<a href="https://boomymarketing.com/seo/on/seo-services-calgary/">Calgary</a>
```
Але реальні сторінки знаходяться у `/local/toronto/seo-agency` тощо.
**Це 404 помилки на головній хаб-сторінці.** Google не передає link equity, Googlebot витрачає crawl budget на неіснуючі URL.

### Вплив
- Crawl errors у GSC
- 0 link equity до local pages з locations hub
- Locations hub не ранжується через broken UX signals

### Виправлення
```
Відкрий файл locations/index.html.

Знайди всі посилання виду href="https://boomymarketing.com/seo/on/..."
і href="https://boomymarketing.com/seo/bc/..."

Заміни їх на правильні URL до local pages:

Ontario:
- /seo/on/toronto/ → /local/toronto/seo-agency
- /seo/on/mississauga/ → /local/mississauga/seo-agency
- /seo/on/brampton/ → /local/brampton/seo-agency
- /seo/on/north-york/ → /local/toronto/seo-agency (немає окремої сторінки)
- /seo/on/markham/ → /local/markham/seo-agency
- /seo/on/kitchener/ → /local/kitchener/seo-agency
- /seo/on/barrie/ → /local/barrie/seo-agency
- /seo/on/richmond-hill-seo-company/ → /local/richmond-hill/seo-agency
- /seo/on/vaughan-seo-company/ → /local/toronto/seo-agency (немає)
- /seo/on/uxbridge/ → /local/toronto/seo-agency (немає)
- /seo/on/seo-services-hamilton/ → /local/hamilton/seo-agency
- /seo/on/ottawa/ → /local/ottawa/seo-agency
- /seo/on/seo-services-calgary/ → /local/calgary/seo-agency
- /seo/on/edmonton/ → /local/edmonton/seo-agency
- /seo/on/winnipeg/ → /local/winnipeg/seo-agency
- /seo/on/halifax/ → /local/halifax/seo-agency

British Columbia:
- /seo/bc/vancouver/ → /local/vancouver/seo-agency
- /seo/bc/kelowna/ → /local/abbotsford/seo-agency (найближча)
- /seo/bc/surrey/ → /local/surrey/seo-agency
- /seo/bc/burnaby/ → /local/burnaby/seo-agency
- /seo/bc/victoria/ → /local/victoria/seo-agency

Також оновити stats: "22+ Cities" → "26+ Cities", "3 Provinces" → "7 Provinces covered"

Покажи всі зміни.
```

---

## T2 — Canonical trailing slash у locations/index.html

### Проблема
`locations/index.html`:
```html
<link rel="canonical" href="https://boomymarketing.com/locations/">
```
Але `vercel.json` має `"trailingSlash": false` — Vercel редіректить `/locations/` → `/locations`.
Canonical вказує на URL що сам по собі є redirect — canonical/redirect loop.

### Вплив
- Google може проігнорувати canonical або індексувати redirect-URL
- Confusing crawl signals

### Виправлення
```
Відкрий файл locations/index.html.

Знайди: <link rel="canonical" href="https://boomymarketing.com/locations/">
Заміни на: <link rel="canonical" href="https://boomymarketing.com/locations">

Також перевір чи є такі самі trailing slash помилки у canonical тегах:
- about.html
- contact.html
- services.html
- pricing.html

Покажи всі знайдені та виправлені canonical теги.
```

---

## T3 — about.html: name + BreadcrumbList URL

### Проблема 1: Назва компанії
```json
"name": "Boomy Marketing"  // рядок 22
```
Має бути `"Boomy Marketing Agency"` — як на всіх інших сторінках.

### Проблема 2: BreadcrumbList URL з .html розширенням
```json
{"@type": "ListItem", "position": 2, "name": "About",
 "item": "https://boomymarketing.com/about.html"}
```
Canonical сторінки — `https://boomymarketing.com/about` (без .html).
Vercel cleanUrls: true — `/about.html` редіректиться на `/about`. Breadcrumb вказує на redirect URL.

### Вплив
- Entity mismatch (Google Knowledge Graph)
- BreadcrumbList invalid — item URL ≠ canonical URL

### Виправлення
```
Відкрий файл about.html.

1. Знайди "name": "Boomy Marketing" у JSON-LD schema (не в тексті)
   Заміни на "name": "Boomy Marketing Agency"

2. Знайди BreadcrumbList item для About:
   "item": "https://boomymarketing.com/about.html"
   Заміни на: "item": "https://boomymarketing.com/about"

3. Також перевір: чи є в тексті сторінки (h1, h2, paragraphs) "Boomy Marketing" без "Agency"?
   Якщо так — покажи де, і ми вирішимо чи міняти.

Покажи diff.
```

---

## T4 — Meta descriptions: виправити truncation (CTR Impact)

### Проблема
Всі 258 local pages мають meta description що обривається:
```
"Looking for expert seo agency in Toronto? Boomy Marketing delivers proven results
for businesses across Canada. Transparent reporting. Get your free strategy sess..."
```
Обривається на `sess...` — незакінчене слово. Google не буде показувати такий опис. CTR падає.

### Додаткова проблема
Всі описи майже ідентичні — тільки місто та сервіс відрізняються. Google це бачить як thin content.

### Вплив
- CTR у пошуковій видачі (прямий вплив)
- Google може генерувати власний snippet замість нашого

### Виправлення
```
Знайди всі файли у /local/ де meta description закінчується на "...">

Для кожного такого файлу:
1. Визнач місто (з папки) та сервіс (з папки)
2. Заміни опис на повний варіант без обриву

Новий шаблон опису (155 символів max):
"Expert [Service] in [City], [Province]. Boomy Marketing Agency delivers
measurable results — SEO, leads, revenue. Free strategy session. Call +1 (647) 370-1888."

Приклади:
- toronto/seo-agency: "Expert SEO Agency in Toronto, ON. Boomy Marketing Agency delivers measurable results — higher rankings, more leads, stronger ROI. Free strategy session."
- vancouver/seo-agency: "Expert SEO Agency in Vancouver, BC. Boomy Marketing Agency delivers measurable results — higher rankings, more leads, stronger ROI. Free strategy session."
- calgary/digital-marketing-agency: "Top Digital Marketing Agency in Calgary, AB. Boomy Marketing Agency delivers SEO, PPC, and social media that drive real business growth. Free strategy call."

Автоматизуй заміну для всіх 258 файлів використовуючи шаблон з містом та провінцією.
Покажи приклади 5 різних файлів до/після.
```

---

## T5 — BreadcrumbList: виправити назви (SEO → SEO)

### Проблема
Всі 258 local pages мають BreadcrumbList:
```json
{"@type": "ListItem", "position": 3, "name": "Seo Agency in Toronto", ...}
```
"Seo" з маленькою буквою — непрофесійно, неконсистентно.

### Вплив
- Breadcrumb відображення у SERP (Google показує breadcrumbs у результатах)
- Schema validation quality

### Виправлення
```
Знайди всі HTML файли у /local/ де BreadcrumbList містить "name" з "Seo", "Ai", "Ppc".

Зроби заміни у JSON-LD BreadcrumbList:
- "Seo Agency" → "SEO Agency"
- "Seo Company" → "SEO Company"
- "Ai Automation Agency" → "AI Automation Agency"
- "Ai Development Company" → "AI Development Company"
- "Ppc Agency" → "PPC Agency"

ТІЛЬКИ у JSON-LD schema (у тегах <script type="application/ld+json">).

Покажи кількість файлів та приклад до/після.
```

---

## T6 — Schema description field: виправити casing

### Проблема
LocalBusiness schema на всіх local pages:
```json
"description": "Seo Agency services in Toronto"
```
- "Seo" замість "SEO"
- Надто короткий опис (5-6 слів) — виглядає як шаблон
- Не містить province, не передає value proposition

### Вплив
- Schema quality score
- Google може використовувати description у Knowledge Panel
- E-E-A-T sигнали

### Виправлення
```
Знайди всі HTML файли у /local/ де schema "description" містить "Seo ", "Ai ", "Ppc ".

Зроби заміни ТІЛЬКИ у JSON-LD schema description поле:
- "Seo Agency services in" → "SEO Agency services in"
- "Seo Company services in" → "SEO Company services in"
- "Ai Automation Agency services in" → "AI Automation Agency services in"
- "Ai Development Company services in" → "AI Development Company services in"
- "Digital Marketing Agency services in" → залишити (вже правильно)
- "Google Ads Agency services in" → залишити (правильно)

Покажи кількість замін та приклади до/після.
```

---

## T7 — FAQ schema: виправити lowercase service names

### Проблема
FAQ schema на local pages містить lowercase сервіси у питаннях та відповідях:
```json
"name": "How much does seo agency cost in Toronto?"
"text": "...the cost of seo agency in Toronto varies..."
```
Google може показати ці FAQ у rich results — виглядає непрофесійно.

### Вплив
- FAQ rich results якість
- E-E-A-T: Google оцінює якість контенту
- Брендова репутація у SERP

### Виправлення
```
Знайди всі HTML файли у /local/ де FAQPage schema містить "seo agency", "ai automation", "ai development", "ppc agency" (малими).

Зроби заміни у JSON-LD FAQPage schema:
- "seo agency" → "SEO Agency" (в питаннях/відповідях)
- "seo company" → "SEO Company"
- "ai automation agency" → "AI Automation Agency"
- "ai development company" → "AI Development Company"
- "digital marketing agency" → залишити або "Digital Marketing Agency"
- "google ads agency" → "Google Ads Agency"

ТІЛЬКИ у JSON-LD schema блоках, не в HTML тексті.

Покажи приклад одного повного FAQ після виправлення.
```

---

## T8 — Homepage meta description: назва компанії

### Проблема
`index.html` meta description:
```html
<meta name="description" content="Boomy Marketing is Toronto's award-winning digital agency...">
```
Назва `"Boomy Marketing"` замість `"Boomy Marketing Agency"` — inconsistency.

### Вплив
- Brand SERP — Google показує meta description у результаті по назві бренду
- Entity consistency

### Виправлення
```
Відкрий index.html.

Знайди: content="Boomy Marketing is Toronto's award-winning digital agency...
Заміни "Boomy Marketing is" на "Boomy Marketing Agency is"

Перевір чи є ще входження "Boomy Marketing" (без Agency) у visible тексті homepage.
Покажи всі знайдені місця.
```

---

## T9 — Додати внутрішні посилання: homepage → local pages

### Проблема
`index.html` має **0 посилань** на `/local/` сторінки.
Local pages мають **0 посилань** між собою (наприклад, Toronto SEO не посилається на Vancouver SEO).
Google не може ефективно crawl-ити і передавати authority до 258 local pages через homepage.

### Вплив
- Link equity distribution (критично для local page rankings)
- Crawl depth — local pages зараз "orphaned" від homepage
- Internal PageRank flow

### Виправлення
```
Відкрий index.html.

Знайди секцію де перелічені міста або сервіси (наприклад "We serve Toronto, Vancouver..." або stats section).

Додай новий блок після services section але перед CTA section:

<section>
  <h2>Digital Marketing Services Across Canada</h2>
  <p>We serve businesses in all major Canadian cities:</p>
  <ul>
    <li><a href="/local/toronto/seo-agency">SEO Agency Toronto</a></li>
    <li><a href="/local/vancouver/seo-agency">SEO Agency Vancouver</a></li>
    <li><a href="/local/calgary/seo-agency">SEO Agency Calgary</a></li>
    <li><a href="/local/ottawa/seo-agency">SEO Agency Ottawa</a></li>
    <li><a href="/local/edmonton/seo-agency">SEO Agency Edmonton</a></li>
    <li><a href="/local/mississauga/seo-agency">SEO Agency Mississauga</a></li>
    <li><a href="/local/toronto/digital-marketing-agency">Digital Marketing Toronto</a></li>
    <li><a href="/local/vancouver/digital-marketing-agency">Digital Marketing Vancouver</a></li>
    <li><a href="/local/toronto/google-ads-agency">Google Ads Agency Toronto</a></li>
    <li><a href="/local/vancouver/google-ads-agency">Google Ads Agency Vancouver</a></li>
  </ul>
  <a href="/locations">View all cities →</a>
</section>

Зроби цей блок стилістично відповідним до існуючого дизайну (мінімальний стиль,
без нових CSS класів що не існують). Покажи де саме вставив блок.
```

---

## T10 — areaServed на homepage: розширити до всіх міст

### Проблема
`index.html` schema:
```json
"areaServed": {"@type": "Place", "name": "Toronto, Canada"}
```
Boomy Marketing обслуговує 26 міст у 7 провінціях, але schema каже тільки Toronto.
Google entity graph обмежує relevance до Toronto.

### Вплив
- Local Pack появи в інших містах
- Knowledge Panel "service area" відображення
- Relevance signals для non-Toronto queries

### Виправлення
```
Відкрий index.html.

Знайди "areaServed": {"@type": "Place", "name": "Toronto, Canada"}

Заміни на масив з усіма містами де є local pages:

"areaServed": [
  {"@type": "City", "name": "Toronto", "containedInPlace": {"@type": "Province", "name": "Ontario", "addressCountry": "CA"}},
  {"@type": "City", "name": "Vancouver", "containedInPlace": {"@type": "Province", "name": "British Columbia", "addressCountry": "CA"}},
  {"@type": "City", "name": "Calgary", "containedInPlace": {"@type": "Province", "name": "Alberta", "addressCountry": "CA"}},
  {"@type": "City", "name": "Ottawa", "containedInPlace": {"@type": "Province", "name": "Ontario", "addressCountry": "CA"}},
  {"@type": "City", "name": "Edmonton", "containedInPlace": {"@type": "Province", "name": "Alberta", "addressCountry": "CA"}},
  {"@type": "City", "name": "Mississauga", "containedInPlace": {"@type": "Province", "name": "Ontario", "addressCountry": "CA"}},
  {"@type": "City", "name": "Brampton", "containedInPlace": {"@type": "Province", "name": "Ontario", "addressCountry": "CA"}},
  {"@type": "City", "name": "Hamilton", "containedInPlace": {"@type": "Province", "name": "Ontario", "addressCountry": "CA"}},
  {"@type": "City", "name": "Markham", "containedInPlace": {"@type": "Province", "name": "Ontario", "addressCountry": "CA"}},
  {"@type": "City", "name": "Surrey", "containedInPlace": {"@type": "Province", "name": "British Columbia", "addressCountry": "CA"}},
  {"@type": "City", "name": "Burnaby", "containedInPlace": {"@type": "Province", "name": "British Columbia", "addressCountry": "CA"}},
  {"@type": "City", "name": "Richmond Hill", "containedInPlace": {"@type": "Province", "name": "Ontario", "addressCountry": "CA"}},
  {"@type": "City", "name": "Oakville", "containedInPlace": {"@type": "Province", "name": "Ontario", "addressCountry": "CA"}},
  {"@type": "City", "name": "Burlington", "containedInPlace": {"@type": "Province", "name": "Ontario", "addressCountry": "CA"}},
  {"@type": "City", "name": "Oshawa", "containedInPlace": {"@type": "Province", "name": "Ontario", "addressCountry": "CA"}},
  {"@type": "City", "name": "Kitchener", "containedInPlace": {"@type": "Province", "name": "Ontario", "addressCountry": "CA"}},
  {"@type": "City", "name": "Barrie", "containedInPlace": {"@type": "Province", "name": "Ontario", "addressCountry": "CA"}},
  {"@type": "City", "name": "Coquitlam", "containedInPlace": {"@type": "Province", "name": "British Columbia", "addressCountry": "CA"}},
  {"@type": "City", "name": "Victoria", "containedInPlace": {"@type": "Province", "name": "British Columbia", "addressCountry": "CA"}},
  {"@type": "City", "name": "Abbotsford", "containedInPlace": {"@type": "Province", "name": "British Columbia", "addressCountry": "CA"}},
  {"@type": "City", "name": "Saskatoon", "containedInPlace": {"@type": "Province", "name": "Saskatchewan", "addressCountry": "CA"}},
  {"@type": "City", "name": "Regina", "containedInPlace": {"@type": "Province", "name": "Saskatchewan", "addressCountry": "CA"}},
  {"@type": "City", "name": "Halifax", "containedInPlace": {"@type": "Province", "name": "Nova Scotia", "addressCountry": "CA"}},
  {"@type": "City", "name": "Charlottetown", "containedInPlace": {"@type": "Province", "name": "Prince Edward Island", "addressCountry": "CA"}},
  {"@type": "City", "name": "Windsor", "containedInPlace": {"@type": "Province", "name": "Ontario", "addressCountry": "CA"}},
  {"@type": "City", "name": "Winnipeg", "containedInPlace": {"@type": "Province", "name": "Manitoba", "addressCountry": "CA"}},
  {"@type": "Country", "name": "Canada"}
],

Покажи diff.
```

---

## Порядок виконання Раунду 2

**Сьогодні (критичні):**
1. T1 — locations hub broken links → link equity відновлюється одразу
2. T2 — canonical trailing slash → технічний сигнал
3. T3 — about.html fixes → entity consistency

**Наступний сеанс (CTR + schema):**
4. T4 → meta descriptions (найбільший CTR impact)
5. T5 + T6 + T7 → schema quality (одночасно, всі local pages)

**Фінальний сеанс:**
8. T8 → homepage meta
9. T9 → internal linking (вимагає перевірки дизайну)
10. T10 → areaServed schema

---

*Раунд 2 додано: 2026-04-13 | Технічний SEO audit на основі прямого аналізу файлів*

---

# E-E-A-T & Schema — TOP 10 (Раунд 3)
> **Фокус:** E-E-A-T сигнали, Article schema, свіжість контенту, cross-linking
> **Дата:** 2026-04-14 | Раунди 1 і 2 виконані ✅

## Знайдені проблеми (пряма перевірка файлів)

| Проблема | Де | Критичність |
|----------|-----|-------------|
| Немає `BlogPosting`/`Article` schema | 39 SEO статей | 🔴 Критично |
| Немає `author` Person у статтях | 39 статей | 🔴 Критично |
| `"name": "Boomy Marketing"` (без Agency) | 39 статей, seo/ | 🔴 Критично |
| `dateModified` 2023/2024 (застарілий) | 39 статей | 🟠 Високо |
| `"seo agency in Nearby Areas"` — lowercase H2 | 258 local pages | 🟠 Високо |
| BreadcrumbList trailing slashes у статтях | 39 статей | 🟠 Високо |
| Inline `<span>Boomy Marketing</span>` у art-meta | 39 статей | 🟡 Середньо |
| Тільки 3 сусідніх міст у Nearby section | 258 local pages | 🟡 Середньо |
| Sitemap lastmod дати застарілі | sitemap.xml | 🟡 Середньо |
| Дублікати `/seo/bc-kelowna/` і `/seo/bc/kelowna/` | seo/ folder | 🟡 Середньо |

## Статус виконання

| # | Задача | Вплив | Файлів | Статус |
|---|--------|-------|--------|--------|
| R1 | BlogPosting schema на всі SEO статті | E-E-A-T / Rich Results | 39 | ⬜ |
| R2 | Author Person schema у статтях | E-E-A-T Authorship | 39 | ⬜ |
| R3 | "Boomy Marketing" → "Boomy Marketing Agency" у статтях | Entity | 39 | ⬜ |
| R4 | dateModified → 2026-04-14 на всіх статтях | Freshness | 39 | ⬜ |
| R5 | H2 "seo agency in Nearby Areas" → Title Case | CTR / Schema | 258 | ⬜ |
| R6 | BreadcrumbList trailing slashes у статтях | Canonical | 39 | ⬜ |
| R7 | art-meta: "Boomy Marketing" → "Boomy Marketing Agency" | Brand | 39 | ⬜ |
| R8 | Розширити Nearby section: 3 → 6+ міст | Internal links | 258 | ⬜ |
| R9 | Sitemap lastmod оновити | Crawl freshness | 1 | ⬜ |
| R10 | Видалити/canonicalize дублікат seo/bc-kelowna/ | Duplicate content | 1 | ⬜ |

