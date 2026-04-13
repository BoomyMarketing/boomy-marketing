# FRONTEND WORKFLOW — Boomy Marketing
**Версія:** 1.0 | **Оновлено:** 2026-04-14
**Стек:** Static HTML · Vercel · CSS @layer · Design Tokens · Vanilla JS

> Цей файл — головний орієнтир при будь-якій правці верстки.
> Читати зверху вниз при старті задачі. Стрибати до потрібної секції при правці.

---

## ЗМІСТ (швидка навігація)

| # | Секція | Коли використовувати |
|---|--------|----------------------|
| 1 | [ПРОЦЕС РОБОТИ](#1-процес-роботи) | Кожна задача — починати тут |
| 2 | [АРХІТЕКТУРА ПРОЄКТУ](#2-архітектура-проєкту) | Де що лежить |
| 3 | [CSS СТАНДАРТИ](#3-css-стандарти) | При написанні стилів |
| 4 | [JS СТАНДАРТИ](#4-js-стандарти) | При написанні скриптів |
| 5 | [ТРЕНДИ 2026-2027](#5-тренди-2026-2027) | Нові фічі для впровадження |
| 6 | [UX/UI ПАТЕРНИ](#6-uxui-патерни) | Анімації, компоненти, типографіка |
| 7 | [PERFORMANCE](#7-performance) | Оптимізація швидкості |
| 8 | [ACCESSIBILITY](#8-accessibility) | A11y правила |
| 9 | [ЧЕКЛІСТИ](#9-чеклісти) | Верифікація перед комітом |

---

## 1. ПРОЦЕС РОБОТИ

### 1.1 Старт кожної задачі

```
КРОК 1 — Зрозуміти scope
  □ Що саме міняємо? (компонент / сторінка / глобальний стиль)
  □ Які файли зачіпаємо?
  □ Чи є це в main.css вже? (не дублювати)

КРОК 2 — Зробити скриншот ДО (через браузер)
  □ Desktop вигляд
  □ Mobile вигляд (якщо стосується layout)

КРОК 3 — Перевірити консоль
  □ Чи є помилки зараз? Зафіксувати.

КРОК 4 — Правка (за стандартами нижче)
  □ Один компонент за раз
  □ Після кожної зміни — перевірити в браузері

КРОК 5 — Верифікація
  □ Скриншот ПІСЛЯ
  □ Desktop + Mobile
  □ Консоль чиста?

КРОК 6 — Коміт
  □ Формат: type(scope): опис
  □ Приклади: feat(hero): add scroll animation
              fix(nav): mobile menu z-index
              perf(css): reduce specificity in cards
```

### 1.2 Типи задач і підхід

| Тип задачі | Підхід |
|------------|--------|
| Новий компонент | Спочатку HTML структура → потім CSS у @layer components |
| Правка існуючого | Читати поточний код → знайти токен → використати токен |
| Глобальна зміна | Міняти тільки в tokens layer або base layer |
| Анімація | Завжди `prefers-reduced-motion` fallback |
| Performance fix | Профілювати DevTools ПЕРЕД правкою |

### 1.3 Заборонено робити без обговорення

- Міняти CSS @layer порядок (`reset, tokens, base, layout, components, utilities`)
- Додавати нові Google Fonts
- Підключати нові JS бібліотеки
- Inline CSS/JS в HTML (все йде в external файли)
- Використовувати `!important` (крім reset layer)
- Хардкодити кольори/розміри — тільки CSS токени

---

## 2. АРХІТЕКТУРА ПРОЄКТУ

### 2.1 Структура файлів

```
boomy-marketing/
├── index.html                    # Головна сторінка
├── assets/
│   ├── css/
│   │   └── main.css              # ЄДИНИЙ глобальний CSS файл
│   └── js/
│       └── main.js               # ЄДИНИЙ глобальний JS файл
├── local/                        # Локальні сторінки міст/послуг
│   └── {city}/{service}/
│       └── index.html
├── seo-{city}/                   # SEO хаб сторінки
├── web-design-{city}/            # Web design сторінки
└── [інші хаб-директорії]/
```

### 2.2 Підключення assets (шаблон для будь-якої сторінки)

```html
<!-- В <head> -->
<link rel="stylesheet" href="/assets/css/main.css">

<!-- Перед </body> -->
<script src="/assets/js/main.js" defer></script>
```

### 2.3 CSS Layer порядок (не міняти)

```css
@layer reset, tokens, base, layout, components, utilities;
```

| Layer | Що містить |
|-------|-----------|
| `reset` | box-sizing, margin/padding reset |
| `tokens` | CSS custom properties (кольори, spacing, typography) |
| `base` | html, body, h1-h4, a, img defaults |
| `layout` | .section, .container, .grid системи |
| `components` | .nav, .card, .btn, .hero та інші UI блоки |
| `utilities` | .sr-only, .visually-hidden та дрібні хелпери |

---

## 3. CSS СТАНДАРТИ

### 3.1 Design Tokens — використовувати завжди

```css
/* ПРАВИЛЬНО */
color: var(--text-primary);
background: var(--bg-deep);
border-radius: var(--r-md);
padding: var(--space-lg) var(--space-xl);
font-size: var(--text-lg);
transition: color var(--transition-base);

/* ЗАБОРОНЕНО */
color: #ffffff;
background: #2D1B69;
border-radius: 16px;
font-size: 1.25rem;
```

### 3.2 Повний список токенів

**Кольори:**
```css
--bg-deep: #2D1B69        /* основний фон секцій */
--bg-darker: #1a0f3e      /* темніший фон */
--bg-darkest: #100930     /* body background */
--accent-orange: #FF6B35  /* CTA кнопки, акценти */
--accent-yellow: #FFD23F  /* highlights, badges */
--accent-purple: #7C3AED  /* secondary accent */
--text-primary: #FFFFFF
--text-sec: rgba(255,255,255,0.7)
--text-muted: rgba(255,255,255,0.45)
--card-bg: rgba(255,255,255,0.08)
--card-border: rgba(255,255,255,0.12)
```

**Spacing:**
```css
--space-xs: 0.25rem   --space-sm: 0.5rem   --space-md: 1rem
--space-lg: 1.5rem    --space-xl: 2rem      --space-2xl: 3rem
--space-3xl: 4rem
```

**Typography (fluid — автоматично масштабується):**
```css
--text-xs: clamp(0.75rem, 1.5vw, 0.875rem)
--text-sm: clamp(0.875rem, 1.8vw, 1rem)
--text-base: clamp(1rem, 2vw, 1.125rem)
--text-lg: clamp(1.125rem, 2.5vw, 1.25rem)
--text-xl: clamp(1.25rem, 3vw, 1.5rem)
--text-2xl: clamp(1.5rem, 4vw, 2rem)
--text-3xl: clamp(2rem, 5vw, 3rem)
--text-hero: clamp(2.5rem, 6vw, 4.5rem)
```

**Border radius:**
```css
--r-sm: 8px   --r-md: 16px   --r-lg: 24px   --r-xl: 32px
```

**Motion:**
```css
--ease: cubic-bezier(0.4,0,0.2,1)
--transition-fast: 150ms var(--ease)
--transition-base: 250ms var(--ease)
--transition-slow: 400ms var(--ease)
```

**Z-index:**
```css
--z-base: 0   --z-raised: 10   --z-dropdown: 100
--z-sticky: 200   --z-modal: 300   --z-toast: 400
```

### 3.3 CSS Nesting (підтримується Chrome 112+, Firefox 117+, Safari 17.2+)

```css
/* ПРАВИЛЬНО — нативний nesting */
.card {
  background: var(--card-bg);

  &:hover {
    border-color: var(--accent-orange);
  }

  & .card__title {
    font-size: var(--text-xl);
  }

  @media (max-width: 768px) {
    padding: var(--space-md);
  }
}

/* ЗАБОРОНЕНО — старий підхід */
.card { ... }
.card:hover { ... }
.card .card__title { ... }
```

### 3.4 Container Queries (для компонентів що залежать від батька)

```css
/* Контейнер */
.card-wrapper {
  container-type: inline-size;
  container-name: card;
}

/* Компонент реагує на розмір контейнера, не viewport */
@container card (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 1fr 2fr;
  }
}
```

> **Важливо:** НЕ ставити `container-type` на `.section` — це ламає layout (зафіксовано в коміті 1ee7445)

### 3.5 :has() — parent selector

```css
/* Scroll lock коли меню відкрите */
body:has(.mobile-menu.open) { overflow: hidden; }

/* Картка з зображенням — інший layout */
.card:has(img) { grid-template-columns: 200px 1fr; }

/* Форма з помилкою */
.form:has(.error) { border-color: red; }
```

### 3.6 Специфічність — тримати низькою

```css
/* ДОБРЕ — низька специфічність */
.btn { }
.btn-primary { }
.btn:hover { }

/* ПОГАНО — висока специфічність */
section .container .btn { }
div > ul > li > a { }
```

---

## 4. JS СТАНДАРТИ

### 4.1 Базові правила

```javascript
// ES2022+ — використовувати сучасний синтаксис
// Optional chaining
const text = element?.querySelector('.title')?.textContent;

// Nullish coalescing
const delay = config.delay ?? 300;

// Array at()
const last = items.at(-1);

// Object.hasOwn() замість hasOwnProperty
if (Object.hasOwn(obj, 'key')) { }

// логічне присвоєння
el.classList ||= 'default-class';
```

### 4.2 DOM — патерни

```javascript
// Делегування подій (не вішати на кожен елемент)
document.addEventListener('click', (e) => {
  if (e.target.closest('.btn-primary')) {
    handleCTA(e.target);
  }
});

// IntersectionObserver для lazy animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(el => {
    if (el.isIntersecting) {
      el.target.classList.add('visible');
      observer.unobserve(el.target); // відключити після спрацювання
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
```

### 4.3 Performance — обов'язково

```javascript
// Throttle для scroll/resize
function throttle(fn, delay) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= delay) { last = now; fn(...args); }
  };
}

window.addEventListener('scroll', throttle(handleScroll, 16));

// requestAnimationFrame для анімацій
function animate() {
  // ... оновлення позиції
  requestAnimationFrame(animate);
}
```

### 4.4 GSAP (вже підключено через CDN)

```javascript
// Перевіряти prefers-reduced-motion
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReduced) {
  gsap.from('.hero-title', {
    duration: 0.8,
    y: 40,
    opacity: 0,
    ease: 'power2.out'
  });
}

// ScrollTrigger — стандартний патерн
gsap.from('.card', {
  scrollTrigger: {
    trigger: '.cards-section',
    start: 'top 80%',
  },
  y: 30,
  opacity: 0,
  stagger: 0.1,
  duration: 0.6
});
```

---

## 5. ТРЕНДИ 2026-2027

### 5.1 CSS — вже впроваджено ✅

| Техніка | Статус | Де використовується |
|---------|--------|---------------------|
| CSS @layer | ✅ Активно | main.css |
| Design Tokens | ✅ Активно | main.css :root |
| CSS Nesting | ✅ Активно | main.css components |
| Container Queries | ✅ Частково | stats, footer |
| :has() | ✅ Активно | body scroll lock |
| clamp() fluid type | ✅ Активно | всі font-size |

### 5.2 CSS — наступні до впровадження

**@starting-style (анімація при появі елемента)**
```css
/* Анімувати елементи при display: block без JS */
@starting-style {
  .dialog[open] {
    opacity: 0;
    transform: translateY(-20px);
  }
}
.dialog[open] {
  opacity: 1;
  transform: translateY(0);
  transition: opacity var(--transition-base), transform var(--transition-base);
}
```
> Підтримка: Chrome 117+, Safari 17.5+. Використовувати з `@supports`.

**View Transitions API**
```javascript
// Плавні переходи між сторінками (без JS фреймворків)
document.startViewTransition(() => {
  updateContent();
});
```
```css
::view-transition-old(root) {
  animation: fade-out var(--transition-base);
}
::view-transition-new(root) {
  animation: fade-in var(--transition-base);
}
```

**CSS Anchor Positioning (tooltips без JS)**
```css
.tooltip {
  position: absolute;
  position-anchor: --my-anchor;
  top: anchor(bottom);
  left: anchor(center);
}
.trigger { anchor-name: --my-anchor; }
```
> Chrome 125+. Поки використовувати як progressive enhancement.

**scroll-driven animations**
```css
/* Анімація прив'язана до скролу — без JS */
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
}

.section {
  animation: fade-in-up linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 30%;
}
```
> Chrome 115+, Firefox 110+. Замінює більшість GSAP ScrollTrigger.

**text-wrap: balance / pretty**
```css
h1, h2, h3 { text-wrap: balance; }   /* рівні рядки в заголовках */
p           { text-wrap: pretty; }   /* уникати orphans */
```

### 5.3 UX/UI тренди 2026-2027

**Glass Morphism (вже є в проєкті — card-bg)**
```css
.glass-card {
  background: rgba(255,255,255,0.08);
  backdrop-filter: blur(20px) saturate(1.5);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: var(--r-lg);
}
```

**Bento Grid Layout**
```css
.bento-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: minmax(200px, auto);
  gap: var(--space-md);
}

.bento-grid .span-2 { grid-column: span 2; }
.bento-grid .span-tall { grid-row: span 2; }
```

**Noise Texture (depth без зображень)**
```css
.hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,..."); /* SVG noise */
  opacity: 0.03;
  pointer-events: none;
}
```

**Gradient Text**
```css
.gradient-text {
  background: linear-gradient(135deg, var(--accent-orange), var(--accent-yellow));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

**Micro-interactions (hover states)**
```css
.btn {
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(255,107,53,0.3);
  }

  &:active {
    transform: translateY(0);
  }
}
```

### 5.4 Типографіка 2026

```css
/* Variable Fonts (якщо підключено Inter Variable) */
font-variation-settings: 'wght' 400;

/* Fluid type вже є через clamp() — продовжувати цей підхід */

/* Оптична підгонка */
h1, h2 {
  font-optical-sizing: auto;
  letter-spacing: -0.02em;  /* щільніший для великих заголовків */
}

/* Баланс рядків */
h1, h2, h3 { text-wrap: balance; }
```

---

## 6. UX/UI ПАТЕРНИ

### 6.1 Стандартні компоненти проєкту

**Секція (шаблон)**
```html
<section class="section" id="section-id">
  <div class="container">
    <div class="section-header">
      <span class="section-tag">Мітка</span>
      <h2>Заголовок</h2>
      <p class="section-subtitle">Підзаголовок</p>
    </div>
    <!-- контент -->
  </div>
</section>
```

**CTA кнопка**
```html
<a href="#contact" class="btn btn-primary">
  Текст кнопки
  <svg><!-- arrow icon --></svg>
</a>
```

**Картка послуги**
```html
<div class="service-card" data-animate>
  <div class="card-icon"><!-- SVG --></div>
  <h3>Назва послуги</h3>
  <p>Опис</p>
  <a href="..." class="card-link">Дізнатись більше →</a>
</div>
```

### 6.2 Навігація

- Мобільне меню: клас `.mobile-menu.open` на `.mobile-menu` елементі
- Body lock через `:has()` — вже в main.css
- Hamburger: `.hamburger-btn` з aria-expanded
- Логіка в main.js

### 6.3 Анімації — принципи

```
ПРАВИЛО АНІМАЦІЙ:
1. Завжди @media (prefers-reduced-motion: reduce) fallback
2. Тривалість: fast=150ms, base=250ms, slow=400ms (токени)
3. Easing: var(--ease) = cubic-bezier(0.4,0,0.2,1)
4. Тригер: IntersectionObserver або scroll-driven (не setTimeout)
5. GSAP тільки для складних timeline анімацій

НІКОЛИ:
- Анімувати layout properties (width, height, top, left)
- Анімувати opacity + transform окремо (краще разом)
- Animate > 10 елементів одночасно без stagger
```

---

## 7. PERFORMANCE

### 7.1 Правила завантаження

```html
<!-- Критичний CSS — inline в <head> (тільки above-the-fold, max 14KB) -->
<style>/* критичний CSS */</style>

<!-- Основний CSS -->
<link rel="stylesheet" href="/assets/css/main.css">

<!-- Preload важливих ресурсів -->
<link rel="preload" href="/assets/images/hero.webp" as="image">
<link rel="preconnect" href="https://fonts.googleapis.com">

<!-- JS — завжди defer або type="module" -->
<script src="/assets/js/main.js" defer></script>

<!-- GSAP — preload + defer -->
<link rel="preload" as="script" href="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js">
<script defer src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
```

### 7.2 Зображення

```html
<!-- Завжди WebP з fallback -->
<picture>
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="опис" width="800" height="600" loading="lazy">
</picture>

<!-- Hero image — eager (не lazy) -->
<img src="hero.webp" alt="..." loading="eager" fetchpriority="high">

<!-- Завжди вказувати width + height (уникати CLS) -->
```

### 7.3 Core Web Vitals цілі

| Метрика | Ціль | Критично |
|---------|------|---------|
| LCP | < 2.5s | > 4s |
| CLS | < 0.1 | > 0.25 |
| INP | < 200ms | > 500ms |
| FCP | < 1.8s | > 3s |
| TTFB | < 800ms | > 1.8s |

---

## 8. ACCESSIBILITY

### 8.1 Обов'язкові атрибути

```html
<!-- Зображення -->
<img alt="змістовний опис">           <!-- інформаційне -->
<img alt="" role="presentation">       <!-- декоративне -->

<!-- Кнопки без тексту -->
<button aria-label="Відкрити меню">
  <svg aria-hidden="true">...</svg>
</button>

<!-- Навігація -->
<nav aria-label="Головна навігація">

<!-- Ланки-якорі -->
<a href="#main-content" class="skip-link">Перейти до контенту</a>

<!-- Інтерактивні елементи -->
<button aria-expanded="false" aria-controls="mobile-menu">
```

### 8.2 Focus стилі (не прибирати!)

```css
/* Замість :focus — використовувати :focus-visible */
.btn:focus-visible {
  outline: 2px solid var(--accent-orange);
  outline-offset: 3px;
}

/* Ніколи: */
*:focus { outline: none; }  /* ЗАБОРОНЕНО */
```

### 8.3 Колірний контраст

| Тип | Мінімум | Ціль |
|-----|---------|------|
| Звичайний текст | 4.5:1 | 7:1 |
| Великий текст (18px+) | 3:1 | 4.5:1 |
| UI компоненти | 3:1 | — |

---

## 9. ЧЕКЛІСТИ

### 9.1 Перед комітом — завжди

```
CSS:
□ Використані тільки CSS токени (не хардкод значень)
□ Новий код у правильному @layer
□ Немає !important (крім reset)
□ Перевірено на mobile (< 768px)
□ prefers-reduced-motion врахований

JS:
□ Немає console.log в продакшн коді
□ Event listeners прибрані при unmount (якщо потрібно)
□ Throttle/debounce на scroll/resize

HTML:
□ Всі img мають alt
□ Всі кнопки без тексту мають aria-label
□ defer на всіх <script>

Performance:
□ Нові зображення у WebP
□ width + height на img
□ Немає нового inline CSS або JS
```

### 9.2 При додаванні нового компонента

```
□ HTML структура відповідає шаблону секції
□ CSS написаний в @layer components
□ Використані токени для кольорів, spacing, type
□ Hover/focus стани задані
□ Mobile стан задано (< 768px)
□ data-animate додано якщо є scroll анімація
□ aria-атрибути додані де потрібно
```

### 9.3 При роботі з local/* сторінками

```
□ Підключено /assets/css/main.css (не inline CSS)
□ Підключено /assets/js/main.js (defer)
□ Немає дубльованих стилів з main.css
□ Canonical URL правильний
□ Schema markup присутній (LocalBusiness/Service)
```

---

## ДОВІДКА — Браузерна підтримка

| Фіча | Chrome | Firefox | Safari | Використовуємо |
|------|--------|---------|--------|----------------|
| CSS @layer | 99+ | 97+ | 15.4+ | ✅ Так |
| CSS Nesting | 112+ | 117+ | 17.2+ | ✅ Так |
| Container Queries | 105+ | 110+ | 16+ | ✅ Так |
| :has() | 105+ | 121+ | 15.4+ | ✅ Так |
| @starting-style | 117+ | — | 17.5+ | ⚠️ З @supports |
| View Transitions | 111+ | — | 18+ | ⚠️ З @supports |
| Scroll-driven anim | 115+ | 110+ | — | ⚠️ З @supports |
| Anchor Positioning | 125+ | — | — | ❌ Ще рано |

---

*Оновлювати цей файл при впровадженні нових технік або зміні підходів.*
