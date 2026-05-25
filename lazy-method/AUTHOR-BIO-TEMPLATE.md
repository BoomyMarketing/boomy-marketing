# Author Bio Pattern (E-E-A-T 2026)

**Why this exists:** Google's December 2025 update extended E-E-A-T from YMYL to **all competitive queries**. Every indexable page now needs a visible, credible author signal. Pages without one rank lower and get cited less by AI surfaces.

This document defines:
1. What fields to capture for the author.
2. Where to render the bio.
3. How to encode it in schema (Person + Article + sameAs graph).
4. Reference render snippets (HTML, Astro, React).

---

## 1. Author data file

Store author data in **one canonical location** per site. Recommended path: `src/data/author.json` (or `data/author.json` for non-component sites).

### Required fields

```json
{
  "_comment": "Primary author profile for Article and Person schema across the site. One file, one source of truth.",

  "name": "{Author Name}",
  "jobTitle": "{Role e.g. Founder & Lead Technician / Senior Engineer / Editor-in-Chief}",
  "credentials": [
    "{Certification 1 — e.g. CFA, PE, IDEA Certified, Board Certified, etc.}",
    "{Licensing — e.g. Licensed in {state/country}}",
    "{Experience claim — e.g. 15+ years in {field}}"
  ],
  "bio": "{Long bio — 60-100 words. Includes founding year if founder, certifications spelled out, primary expertise, geographic or vertical scope, concrete proof (count of clients / projects / years).}",
  "shortBio": "{20-30 word version for compact cards. Includes credential + scope.}",
  "photo": "/assets/img/team/{author-slug}.jpg",
  "photoPlaceholder": "/assets/img/{placeholder}.jpg",
  "email": "{author@domain}",
  "sameAs": [
    "https://www.linkedin.com/in/{handle}",
    "https://twitter.com/{handle}",
    "https://www.facebook.com/{page}",
    "https://github.com/{handle}",
    "https://{industry-association}/profile/{id}"
  ],
  "knowsAbout": [
    "{Topic 1 — be specific}",
    "{Topic 2}",
    "{Topic 3}",
    "{Topic 4 — niche / sub-vertical}",
    "{Topic 5 — geographic specialty if local}",
    "{Topic 6 — standards / regulations expertise}"
  ]
}
```

### Field-by-field guidance

| Field | What to put | Why |
|-------|-------------|-----|
| `name` | Real full name | LLM citation requires real attribution. Pen names hurt E-E-A-T. |
| `jobTitle` | Specific role + organization implied | Powers Person schema `jobTitle`. |
| `credentials` | Array of strings — cert / license / experience | Renders as visible badges + populates Person schema `hasCredential`. |
| `bio` | 60-100 word paragraph | Renders in the AuthorBio block under articles. |
| `shortBio` | 20-30 words | Renders in compact card variant + meta `<meta name="author">`. |
| `photo` | Real headshot — first-party | Stock photos hurt E-E-A-T. If no real photo yet, use `photoPlaceholder` and prioritize getting one. |
| `email` | Author-specific email | Populates Person schema `email`. |
| `sameAs` | Array of canonical profile URLs | **Critical for entity disambiguation in Google + LLM knowledge graphs.** |
| `knowsAbout` | 5-10 topic strings | Populates Person schema `knowsAbout`. Tell Google what they're an expert in. |

---

## 2. Where to render the bio

| Page type | Variant | Position |
|-----------|---------|----------|
| Blog post | `full` | End of article, before related posts |
| Local landing | `full` | Above footer (after FAQ section) |
| Service hub | `full` | Above footer |
| Pricing page | `compact` | Above footer, or inline in "Why us" block |
| Product page | `compact` | Sidebar or inline near "About the seller" |
| About page | `full` + team block | Top of page |
| Homepage | optional — `compact` in trust strip | If shown, low in scroll |

**Never render on:** thank-you pages, privacy/terms, sitemap, noindex pages.

---

## 3. Schema encoding

### Inside Article / BlogPosting

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{Article Title}",
  "datePublished": "2026-05-23T09:00:00Z",
  "dateModified": "2026-05-23T09:00:00Z",
  "author": {
    "@type": "Person",
    "@id": "{site_url}/about#author-{slug}",
    "name": "{Author Name}",
    "jobTitle": "{Role}",
    "image": "{site_url}{photo}",
    "url": "{site_url}/about/",
    "email": "{email}",
    "sameAs": [
      "{linkedin_url}",
      "{twitter_url}"
    ],
    "knowsAbout": ["{topic1}", "{topic2}"],
    "hasCredential": [
      {
        "@type": "EducationalOccupationalCredential",
        "name": "{Credential 1}"
      }
    ]
  },
  "publisher": {
    "@type": "Organization",
    "@id": "{site_url}#organization",
    "name": "{Site Name}",
    "logo": {
      "@type": "ImageObject",
      "url": "{site_url}/logo.png"
    }
  }
}
```

### Standalone Person block on About page

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "{site_url}/about#author-{slug}",
  "name": "{Author Name}",
  "jobTitle": "{Role}",
  "worksFor": {
    "@type": "Organization",
    "@id": "{site_url}#organization"
  },
  "image": "{site_url}{photo}",
  "description": "{shortBio}",
  "sameAs": ["{linkedin}", "{twitter}", "{industry_profile}"],
  "knowsAbout": ["{topic1}", "{topic2}", "{topic3}"],
  "alumniOf": {
    "@type": "EducationalOrganization",
    "name": "{If applicable}"
  },
  "hasCredential": [
    {
      "@type": "EducationalOccupationalCredential",
      "name": "{Credential 1}",
      "credentialCategory": "certification"
    }
  ]
}
```

**Important:** use `@id` for the Person entity so it can be referenced from multiple Article schemas without duplication. Use the same `@id` for the same person across the entire site.

---

## 4. Render snippets

### HTML (vanilla)

```html
<aside class="author-bio author-bio--full" aria-label="About the author">
  <div class="author-bio__photo">
    <img
      src="/assets/img/team/author.jpg"
      alt="Photo of {Author Name}, {Role}"
      width="96"
      height="96"
      loading="lazy"
    />
  </div>
  <div class="author-bio__content">
    <p class="author-bio__eyebrow">About the author</p>
    <p class="author-bio__name">{Author Name}</p>
    <p class="author-bio__title">{Role} · {Site Name}</p>
    <p class="author-bio__text">{Long bio paragraph}</p>
    <ul class="author-bio__credentials">
      <li>{Credential 1}</li>
      <li>{Credential 2}</li>
      <li>{Credential 3}</li>
    </ul>
  </div>
</aside>
```

### Astro component (component-based site)

```astro
---
import author from '../data/author.json';

interface Props {
  variant?: 'full' | 'compact';
}
const { variant = 'full' } = Astro.props as Props;
---

<aside class={`author-bio author-bio--${variant}`} aria-label="About the author">
  <div class="author-bio__photo">
    <img
      src={author.photoPlaceholder}
      alt={`Photo of ${author.name}, ${author.jobTitle}`}
      width="96"
      height="96"
      loading="lazy"
    />
  </div>
  <div class="author-bio__content">
    <p class="author-bio__eyebrow">About the author</p>
    <p class="author-bio__name">{author.name}</p>
    <p class="author-bio__title">{author.jobTitle}</p>
    {variant === 'full'
      ? <p class="author-bio__text">{author.bio}</p>
      : <p class="author-bio__text">{author.shortBio}</p>}
    <ul class="author-bio__credentials">
      {author.credentials.map(c => <li>{c}</li>)}
    </ul>
  </div>
</aside>
```

### React / JSX (Next.js, Remix, etc.)

```jsx
import author from '@/data/author.json';

export function AuthorBio({ variant = 'full' }) {
  return (
    <aside className={`author-bio author-bio--${variant}`} aria-label="About the author">
      <div className="author-bio__photo">
        <img
          src={author.photoPlaceholder}
          alt={`Photo of ${author.name}, ${author.jobTitle}`}
          width="96"
          height="96"
          loading="lazy"
        />
      </div>
      <div className="author-bio__content">
        <p className="author-bio__eyebrow">About the author</p>
        <p className="author-bio__name">{author.name}</p>
        <p className="author-bio__title">{author.jobTitle}</p>
        <p className="author-bio__text">
          {variant === 'full' ? author.bio : author.shortBio}
        </p>
        <ul className="author-bio__credentials">
          {author.credentials.map(c => <li key={c}>{c}</li>)}
        </ul>
      </div>
    </aside>
  );
}
```

### Reference CSS (works across frameworks — adapt design tokens to your system)

```css
.author-bio {
  display: grid;
  grid-template-columns: 96px 1fr;
  gap: 1.25rem;
  align-items: start;
  padding: 1.5rem;
  margin-block: 2.5rem;
  background: var(--bg-elevated, #f7f7f8);
  border: 1px solid var(--border-default, #e5e5e9);
  border-left: 4px solid var(--brand-primary, #1a2744);
  border-radius: 0.75rem;
}
.author-bio--compact {
  grid-template-columns: 64px 1fr;
  padding: 1rem 1.25rem;
}
.author-bio__photo img {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--brand-primary, #1a2744);
}
.author-bio--compact .author-bio__photo img { width: 64px; height: 64px; }
.author-bio__eyebrow {
  font-weight: 700;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--brand-primary, #1a2744);
  margin-bottom: 0.5rem;
}
.author-bio__name {
  font-weight: 700;
  font-size: 1.25rem;
  margin-bottom: 0.25rem;
}
.author-bio__title {
  font-size: 0.875rem;
  color: var(--text-secondary, #4a4a52);
  margin-bottom: 0.75rem;
}
.author-bio__text {
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 0.75rem;
}
.author-bio__credentials {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.author-bio__credentials li {
  font-size: 0.75rem;
  background: white;
  border: 1px solid var(--border-default, #e5e5e9);
  border-radius: 999px;
  padding: 0.25rem 0.75rem;
}
@media (max-width: 480px) {
  .author-bio,
  .author-bio--compact {
    grid-template-columns: 1fr;
  }
}
```

---

## 5. Multi-author sites

If your site has more than one author (publisher, agency, multi-contributor blog):

1. Store all authors in `src/data/authors/{slug}.json` (one file each).
2. Each blog post brief specifies `author: {slug}`.
3. Render `AuthorBio` reads the right file.
4. Each author gets a profile page at `/about/{slug}/` with full Person schema.
5. Each Article schema uses the per-author `@id` so the knowledge graph stays clean.

---

## 6. Verification checklist

Before any page goes live:

- [ ] `author.json` (or per-author file) is filled — no `{placeholder}` strings.
- [ ] Photo is a **real first-party headshot** — not stock, not AI-generated.
- [ ] Bio is 60-100 words; shortBio is 20-30 words.
- [ ] `sameAs` includes at least LinkedIn + one other canonical profile.
- [ ] `knowsAbout` has 5-10 specific topics — not generic ones.
- [ ] `hasCredential` populated with verifiable certifications.
- [ ] Schema Article references the same Person `@id` everywhere.
- [ ] Rendered AuthorBio appears under every blog post, local landing, service hub, and about page.
- [ ] Google Rich Results Test validates the Person + Article combination.
- [ ] `<meta name="author" content="{name}">` present in `<head>`.
