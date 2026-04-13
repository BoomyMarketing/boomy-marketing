# Boomy Marketing — Frontend Audit & Optimization Plan
**Версія:** 1.0 | **Дата:** 2026-04-14
**Охоплення:** HTML, CSS, JS, Performance, Accessibility, Cross-Browser, Modern Practices 2026-2027
**Сайт:** boomymarketing.com (Static HTML на Vercel)

---

## Зміст
1. [Поточний стан — оцінка](#оцінка)
2. [Критичні проблеми](#критичні)
3. [Performance](#performance)
4. [CSS — Сучасні практики](#css)
5. [JavaScript — Модернізація](#javascript)
6. [Accessibility](#accessibility)
7. [Cross-Device & Browser](#cross-device)
8. [Modern Web 2026-2027](#modern)
9. [Порядок виконання](#порядок)
10. [Інструменти перевірки](#інструменти)

---

## Поточний стан — Оцінка {#оцінка}

| Категорія | Оцінка | Критичних проблем |
|-----------|--------|-------------------|
| HTML структура | 6/10 | 2 |
| CSS якість | 5/10 | 3 |
| JavaScript | 4/10 | 3 |
| Performance | 4/10 | 4 |
| Accessibility | 6/10 | 2 |
| Cross-Device | 6/10 | 1 |
| Modern Practices 2026 | 3/10 | 6 |
| **Загально** | **4.9/10** | **21** |

### Структура файлів (виміряно)
| Файл | Розмір | Рядків |
|------|--------|--------|
| `index.html` | 82 KB | 1 563 |
| `about.html` | 39 KB | 510 |
| `contact.html` | 34 KB | 452 |
| `services.html` | 31 KB | 377 |
| `pricing.html` | 33 KB | 412 |
| `local/toronto/seo-agency/index.html` | **103 KB** | 2 109 |
| **Проблема** | CSS і JS 100% inline | Немає кешування |

---

## Критичні проблеми {#критичні}

### F1 — GSAP завантажується у `<head>` без `defer` (🔴 Блокує рендер)

**Поточний код:**
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
```

**Проблема:** 163 KB зовнішнього JS блокує рендер сторінки. LCP страждає.

**Виправлення:**
```html
<link rel="preload" as="script"
  href="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js">
<script defer
  src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script defer
  src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
```

**Файли:** index.html, about.html, contact.html, services.html, pricing.html, всі local pages
**Ефект:** LCP -200-500ms, FID покращення

---

### F2 — Весь CSS та JS інлайновий (🔴 Немає кешування)

**Проблема:**
- Кожна сторінка завантажує CSS заново — браузер не кешує
- Local pages: 103 KB HTML = ~40 KB CSS інлайн + ~20 KB JS інлайн
- При переході між сторінками — все перезавантажується

**Виправлення (поступове):**
```
Крок 1: Виділити shared CSS у /assets/css/main.css
Крок 2: Виділити shared JS у /assets/js/main.js
Крок 3: Підключити через <link rel="stylesheet"> і <script defer src="">
Крок 4: Vercel автоматично додає Cache-Control: max-age=31536000
```

**Пріоритет файлів для виділення:**
- Навбар (однаковий на всіх сторінках)
- Footer (однаковий на всіх сторінках)
- Кнопки, typography, CSS variables
- GSAP animation utilities

---

### F3 — JavaScript написаний на ES5 (🔴 2015 рік)

**Поточний код:**
```javascript
var btn = document.querySelector('.nav-hamburger');
var menu = document.getElementById('mobile-menu');
btn.addEventListener('click', function () {
  var isOpen = menu.classList.contains('active');
  menu.classList.toggle('active');
});
```

**Сучасний код 2026:**
```javascript
const btn = document.querySelector('.nav-hamburger');
const menu = document.getElementById('mobile-menu');

btn?.addEventListener('click', () => {
  const isOpen = menu.classList.toggle('active');
  btn.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});
```

**Що замінити:**
| ES5 | ES2022+ замінник |
|-----|-----------------|
| `var` | `const` / `let` |
| `function() {}` | `() => {}` |
| `document.getElementById` + null check | `?.` optional chaining |
| `'string' + var` | `` `template ${literal}` `` |
| `XMLHttpRequest` | `fetch()` + `async/await` |
| `arguments` | rest parameters `...args` |

---

### F4 — Зображення не існують, немає форматів (🔴 Performance + SEO)

**Стан:**
- `og-image.png` — не існує у проєкті
- 0 зображень у HTML на жодній сторінці
- 0 використань `<img>`, `<picture>`, `srcset`
- 0 WebP або AVIF форматів

**Потрібно створити:**
```
/assets/images/
  og-image.png           — 1200×630px (для Open Graph)
  og-image.webp          — WebP версія
  hero-bg.webp           — Hero секція фон (якщо є)
  team/                  — Фото команди (для E-E-A-T)
  logo.svg               — SVG логотип
  favicon.ico            — Фавікон
  apple-touch-icon.png   — 180×180px
```

**Шаблон для зображень 2026:**
```html
<picture>
  <source srcset="/assets/images/hero.avif" type="image/avif">
  <source srcset="/assets/images/hero.webp" type="image/webp">
  <img
    src="/assets/images/hero.png"
    alt="Опис зображення"
    width="1200"
    height="630"
    loading="lazy"
    decoding="async"
  >
</picture>
```

---

### F5 — Heading hierarchy порушена (🟠 Accessibility + SEO)

**Знайдено у index.html:**
```html
<h2>Why Choose Boomy</h2>        <!-- OK -->
  <h4>No Long-Term Lock-Ins</h4> <!-- ❌ пропущено H3! -->
  <h4>Dedicated Senior Team</h4>  <!-- ❌ пропущено H3! -->
```

**Виправлення:** H4 → H3 або додати проміжний H3

**Файли:** index.html, contact.html, footer sections

---

### F6 — Немає favicon та apple-touch-icon (🟠 Brand + UX)

**Поточний стан:**
```html
<!-- Немає жодного: -->
<!-- <link rel="icon" ...> -->
<!-- <link rel="apple-touch-icon" ...> -->
<!-- <link rel="manifest" ...> -->
```

**Виправлення (додати у `<head>` всіх сторінок):**
```html
<link rel="icon" type="image/svg+xml" href="/assets/images/favicon.svg">
<link rel="icon" type="image/png" href="/assets/images/favicon-32.png" sizes="32x32">
<link rel="apple-touch-icon" href="/assets/images/apple-touch-icon.png">
<meta name="theme-color" content="#0a0a0a">
<link rel="manifest" href="/manifest.json">
```

---

## Performance {#performance}

### P1 — Core Web Vitals цілі 2026

| Метрика | Ціль "Good" | Поточний стан | Проблема |
|---------|-------------|---------------|----------|
| LCP (Largest Contentful Paint) | < 2.5s | ~3-4s (оцінка) | GSAP блокує, немає preload |
| INP (Interaction to Next Paint) | < 200ms | ~150-250ms | Inline JS важкий |
| CLS (Cumulative Layout Shift) | < 0.1 | ~0.05-0.15 | Шрифти без розмірів |

### P2 — Google Fonts оптимізація

**Поточний:**
```html
<link href="https://fonts.googleapis.com/css2?family=Berkshire+Swash&family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
```

**Проблема:** Завантажує Inter 300-900 (7 ваг) — більшість не використовується.

**Оптимізований:**
```html
<!-- Тільки потрібні ваги: 400, 600, 700 -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style"
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap">
<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
  media="print" onload="this.media='all'">
<noscript>
  <link rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap">
</noscript>
```

**Ефект:** -40% розміру шрифтів, усунення render-blocking

### P3 — Starfield Canvas оптимізація

**Проблема:** Canvas анімація на кожній сторінці виконується постійно, навіть коли не видна.

**Виправлення:**
```javascript
// Зупиняти анімацію коли вкладка не активна
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    cancelAnimationFrame(animationId);
  } else {
    animationId = requestAnimationFrame(animate);
  }
});

// Поважати налаштування "prefers-reduced-motion"
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) {
  canvas.style.display = 'none'; // Прибрати анімацію для користувачів з вестибулярними проблемами
}
```

### P4 — Resource Hints (повний набір)

**Додати у `<head>` index.html та всіх сторінок:**
```html
<!-- DNS prefetch для CDN -->
<link rel="dns-prefetch" href="//cdnjs.cloudflare.com">
<link rel="dns-prefetch" href="//fonts.googleapis.com">

<!-- Preconnect для критичних origins -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Preload критичного CSS (якщо буде external) -->
<link rel="preload" href="/assets/css/main.css" as="style">

<!-- Prefetch наступних сторінок (для швидшої навігації) -->
<link rel="prefetch" href="/about">
<link rel="prefetch" href="/contact">
```

---

## CSS — Сучасні практики {#css}

### C1 — CSS Custom Properties розширити

**Поточні variables добрі, але додати:**
```css
:root {
  /* Spacing scale (замість magic numbers) */
  --space-xs: 0.25rem;   /*  4px */
  --space-sm: 0.5rem;    /*  8px */
  --space-md: 1rem;      /* 16px */
  --space-lg: 1.5rem;    /* 24px */
  --space-xl: 2rem;      /* 32px */
  --space-2xl: 3rem;     /* 48px */
  --space-3xl: 4rem;     /* 64px */

  /* Typography scale */
  --text-xs: clamp(0.75rem, 1.5vw, 0.875rem);
  --text-sm: clamp(0.875rem, 1.8vw, 1rem);
  --text-base: clamp(1rem, 2vw, 1.125rem);
  --text-lg: clamp(1.125rem, 2.5vw, 1.25rem);
  --text-xl: clamp(1.25rem, 3vw, 1.5rem);
  --text-2xl: clamp(1.5rem, 4vw, 2rem);
  --text-3xl: clamp(2rem, 5vw, 3rem);
  --text-hero: clamp(2.5rem, 6vw, 4.5rem);

  /* Transitions */
  --transition-fast: 150ms var(--ease);
  --transition-base: 250ms var(--ease);
  --transition-slow: 400ms var(--ease);

  /* Z-index scale */
  --z-base: 0;
  --z-raised: 10;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-modal: 300;
  --z-toast: 400;
}
```

### C2 — CSS Nesting (нативний, 2024+)

**Підтримка:** Chrome 112+, Firefox 117+, Safari 17.2+ — всі major browsers ✅

**До (старий стиль):**
```css
.card { background: var(--bg-card); border-radius: var(--r-md); }
.card:hover { transform: translateY(-4px); }
.card .card-title { font-size: 1.25rem; }
.card .card-title:hover { color: var(--accent); }
```

**Після (CSS Nesting 2026):**
```css
.card {
  background: var(--bg-card);
  border-radius: var(--r-md);
  transition: transform var(--transition-base);

  &:hover {
    transform: translateY(-4px);
  }

  & .card-title {
    font-size: var(--text-xl);

    &:hover {
      color: var(--accent);
    }
  }
}
```

### C3 — CSS @layer для організації (2026 best practice)

**Рекомендована структура:**
```css
/* Оголошуємо шари на початку файлу */
@layer reset, base, tokens, layout, components, utilities, overrides;

@layer reset {
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
}

@layer tokens {
  :root { /* CSS variables */ }
}

@layer base {
  body { font-family: Inter, system-ui, sans-serif; }
  h1, h2, h3 { line-height: 1.2; }
}

@layer components {
  .btn { /* кнопки */ }
  .card { /* картки */ }
  .nav { /* навбар */ }
}

@layer utilities {
  .sr-only { /* screen reader only */ }
  .text-gradient { /* gradient text */ }
}
```

### C4 — CSS Container Queries (2026 стандарт)

**Чому важливо:** компонент адаптується до свого контейнера, а не до ширини вікна.

**Приклад для service cards:**
```css
.services-grid {
  container-type: inline-size;
  container-name: services;
}

.service-card {
  /* Базовий стиль */
  padding: var(--space-lg);
}

/* Коли контейнер вузький — стек */
@container services (max-width: 500px) {
  .service-card {
    flex-direction: column;
    padding: var(--space-md);
  }
}

/* Коли контейнер широкий — горизонтальний */
@container services (min-width: 800px) {
  .service-card {
    display: grid;
    grid-template-columns: auto 1fr;
  }
}
```

### C5 — :has() selector (2026 — підтримується всюди)

**Практичні застосування:**
```css
/* Навбар зі скролом — додати фон */
.nav:has(+ .hero.scrolled) {
  background: rgba(0, 0, 0, 0.95);
}

/* Форма з помилкою — виділити */
.form-group:has(.form-input:invalid:not(:placeholder-shown)) {
  --border-color: var(--error);
}

/* Картка з іконкою — відступ */
.card:has(> .card-icon) {
  padding-top: var(--space-xl);
}

/* Активний пункт меню */
.nav-list:has(.nav-link[aria-current="page"]) .nav-link:not([aria-current]) {
  opacity: 0.6;
}
```

### C6 — Медіа-запити: додати великі екрани

**Поточні breakpoints:** 480, 768, 1024px
**Бракує:** 1280, 1440, 1920px (великі монітори, ultrawide)

```css
/* Додати до existing media queries */

/* Large desktop */
@media (min-width: 1280px) {
  .container { max-width: 1200px; }
  .hero h1 { font-size: clamp(3rem, 5vw, 4.5rem); }
}

/* XL desktop */
@media (min-width: 1440px) {
  .container { max-width: 1360px; }
}

/* Ultrawide */
@media (min-width: 1920px) {
  .container { max-width: 1600px; }
}

/* Fold phones / very small */
@media (max-width: 320px) {
  :root { font-size: 14px; }
}
```

---

## JavaScript — Модернізація {#javascript}

### J1 — Modernize to ES2022+

**Файл: /assets/js/main.js (новий)**

```javascript
// ============================================================
// Navigation
// ============================================================
const initNav = () => {
  const btn = document.querySelector('.nav-hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on outside click
  document.addEventListener('click', ({ target }) => {
    if (!menu.contains(target) && !btn.contains(target)) {
      menu.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  // Close on Escape
  document.addEventListener('keydown', ({ key }) => {
    if (key === 'Escape' && menu.classList.contains('is-open')) {
      menu.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      btn.focus();
    }
  });
};

// ============================================================
// Scroll Progress Bar
// ============================================================
const initScrollProgress = () => {
  const bar = document.getElementById('progressBar');
  if (!bar) return;

  const update = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
    bar.style.width = `${Math.min(progress, 100)}%`;
    bar.setAttribute('aria-valuenow', Math.round(progress));
  };

  window.addEventListener('scroll', update, { passive: true });
};

// ============================================================
// Reduced Motion check
// ============================================================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ============================================================
// GSAP Animations (load only after DOMContentLoaded)
// ============================================================
const initAnimations = () => {
  if (prefersReducedMotion || typeof gsap === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Hero entrance
  gsap.from('.hero-content > *', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out',
  });

  // Reveal elements
  document.querySelectorAll('.reveal').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      opacity: 0,
      y: 24,
      duration: 0.7,
      ease: 'power2.out',
    });
  });
};

// ============================================================
// Starfield Canvas
// ============================================================
const initStarfield = () => {
  if (prefersReducedMotion) return;

  const canvas = document.getElementById('starfield');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animId;
  const stars = [];

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  const createStars = (n = 120) => {
    stars.length = 0;
    for (let i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5,
        o: Math.random(),
        speed: 0.2 + Math.random() * 0.3,
      });
    }
  };

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${s.o})`;
      ctx.fill();
      s.y -= s.speed;
      if (s.y < 0) { s.y = canvas.height; s.x = Math.random() * canvas.width; }
    });
    animId = requestAnimationFrame(draw);
  };

  // Pause when tab hidden (save CPU)
  document.addEventListener('visibilitychange', () => {
    document.hidden ? cancelAnimationFrame(animId) : draw();
  });

  window.addEventListener('resize', () => { resize(); createStars(); }, { passive: true });

  resize();
  createStars();
  draw();
};

// ============================================================
// Form with fetch + validation
// ============================================================
const initContactForm = () => {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const data = Object.fromEntries(new FormData(form));

    btn.disabled = true;
    btn.textContent = 'Sending…';

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Network error');

      form.reset();
      showToast('Message sent! We\'ll be in touch within a few hours.', 'success');
    } catch {
      showToast('Something went wrong. Please email care@boomymarketing.com', 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Send Message';
    }
  });
};

// ============================================================
// Toast notifications
// ============================================================
const showToast = (message, type = 'info') => {
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('toast--visible'));
  setTimeout(() => {
    toast.classList.remove('toast--visible');
    toast.addEventListener('transitionend', () => toast.remove());
  }, 5000);
};

// ============================================================
// Init
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollProgress();
  initStarfield();
  initContactForm();
});

// GSAP ініціалізуємо після defer завантаження
window.addEventListener('load', initAnimations);
```

### J2 — Intersection Observer замість GSAP ScrollTrigger (для простих reveal)

```javascript
// Легший альтернатив для простих fade-in
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) {
        target.classList.add('is-visible');
        observer.unobserve(target); // once
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
```

```css
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s var(--ease), transform 0.6s var(--ease);
}

.reveal.is-visible {
  opacity: 1;
  transform: none;
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .reveal { opacity: 1; transform: none; transition: none; }
}
```

---

## Accessibility {#accessibility}

### A1 — Skip Navigation Link

**Додати першим елементом у `<body>`:**
```html
<a href="#main-content" class="skip-link">Skip to main content</a>

<style>
.skip-link {
  position: absolute;
  top: -100%;
  left: 1rem;
  background: var(--accent);
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 0 0 var(--r-md) var(--r-md);
  font-weight: 600;
  z-index: var(--z-toast);
  transition: top 0.2s;
}
.skip-link:focus { top: 0; }
</style>
```

### A2 — Focus Visible Styles

**Поточний стан:** `outline: none` у деяких місцях — небезпечно для keyboard users.

```css
/* 2026 стандарт — :focus-visible замість :focus */
:focus-visible {
  outline: 3px solid var(--accent);
  outline-offset: 3px;
  border-radius: 4px;
}

/* Прибираємо outline тільки для mouse clicks */
:focus:not(:focus-visible) {
  outline: none;
}
```

### A3 — Form autocomplete (contact.html)

```html
<input type="text" id="fname" name="fname"
  autocomplete="given-name" required>

<input type="text" id="lname" name="lname"
  autocomplete="family-name" required>

<input type="email" id="email" name="email"
  autocomplete="email" required>

<input type="tel" id="phone" name="phone"
  autocomplete="tel">

<select id="service" name="service" autocomplete="off" required>
```

### A4 — prefers-reduced-motion у всіх анімаціях

```css
/* Глобальне правило у :root */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### A5 — Color Contrast перевірка

**Потенційні проблеми:**
```css
/* Перевірити (WCAG AA = 4.5:1) */
--text-muted: rgba(255,255,255,0.45); /* ⚠️ на темному фоні може бути < 4.5:1 */
--text-sec: rgba(255,255,255,0.7);    /* ✅ ok */

/* Виправлення */
--text-muted: rgba(255,255,255,0.55); /* Підняти до ≥4.5:1 */
```

---

## Cross-Device & Browser {#cross-device}

### CD1 — Тестування на реальних пристроях (чекліст)

| Пристрій | ОС | Браузер | Пріоритет |
|----------|-----|---------|-----------|
| iPhone 14/15 Pro | iOS 17 | Safari | 🔴 Критично |
| Samsung Galaxy S23 | Android 14 | Chrome | 🔴 Критично |
| iPad Pro 12.9" | iPadOS 17 | Safari | 🟠 Висока |
| MacBook Pro | macOS | Safari 17 | 🟠 Висока |
| Desktop 1920px | Windows 11 | Chrome | 🟠 Висока |
| Desktop 1920px | Windows 11 | Edge | 🟡 Середня |
| Desktop 1920px | Windows 11 | Firefox | 🟡 Середня |
| Galaxy Fold | Android | Chrome | 🟡 Середня (320px ширина) |

### CD2 — iOS Safari специфічні проблеми

```css
/* iOS Safari viewport height bug (100vh = включає browser chrome) */
.hero {
  min-height: 100vh; /* Старий підхід */
  min-height: 100dvh; /* ✅ Dynamic Viewport Height — iOS 15.4+ */
}

/* iOS Safari scroll bounce */
html {
  overscroll-behavior: none; /* Якщо не потрібен bounce effect */
}

/* iOS tap highlight */
* {
  -webkit-tap-highlight-color: transparent;
}

/* iOS input zoom prevention */
input, select, textarea {
  font-size: max(16px, 1rem); /* Забороняє zoom при фокусі на iOS */
}
```

### CD3 — Touch targets (мобільний UX)

**Google рекомендація:** мінімум 48×48px для touch targets.

```css
/* Перевірити усі кнопки та посилання */
.btn {
  min-height: 48px;
  min-width: 48px;
  padding: 12px 24px;
}

.nav-link {
  min-height: 48px;
  display: flex;
  align-items: center;
}

/* Для малих іконок — збільшуємо зону кліку */
.social-link {
  padding: 12px;
  margin: -12px;
}
```

### CD4 — Print stylesheet

```css
@media print {
  .nav, .footer, .starfield, #progressBar, .btn-ghost { display: none; }
  body { color: #000; background: #fff; }
  a[href]::after { content: " (" attr(href) ")"; font-size: 0.8em; }
  .container { max-width: 100%; padding: 0; }
}
```

---

## Modern Web 2026-2027 {#modern}

### M1 — View Transitions API (Page transitions)

```javascript
// Плавний перехід між сторінками (Chrome 111+, Safari 18+)
document.querySelectorAll('a[href]').forEach(link => {
  link.addEventListener('click', async (e) => {
    const href = link.getAttribute('href');
    // Тільки internal links
    if (!href.startsWith('/') && !href.startsWith(location.origin)) return;
    if (!document.startViewTransition) return; // Fallback для старих браузерів

    e.preventDefault();
    await document.startViewTransition(async () => {
      const response = await fetch(href);
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      document.title = doc.title;
      document.querySelector('main').replaceWith(doc.querySelector('main'));
    });

    history.pushState({}, '', href);
  });
});
```

```css
/* CSS для View Transitions */
::view-transition-old(root) {
  animation: fade-out 0.25s ease forwards;
}
::view-transition-new(root) {
  animation: fade-in 0.25s ease forwards;
}

@keyframes fade-out { to { opacity: 0; } }
@keyframes fade-in  { from { opacity: 0; } }
```

### M2 — Web App Manifest (PWA ready)

**Новий файл: `/manifest.json`**
```json
{
  "name": "Boomy Marketing Agency",
  "short_name": "Boomy",
  "description": "AI-Powered Digital Marketing in Canada",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0a0a",
  "theme_color": "#f97316",
  "icons": [
    { "src": "/assets/images/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/assets/images/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/assets/images/icon-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

### M3 — CSS Scroll-Driven Animations (Chrome 115+)

```css
/* Анімація прогрес-бару через CSS замість JS */
#progressBar {
  animation: scaleProgress linear;
  animation-timeline: scroll(root block);
  transform-origin: left;
  transform: scaleX(0);
}

@keyframes scaleProgress {
  to { transform: scaleX(1); }
}
```

### M4 — Native Dialog Element (для модалей)

```html
<!-- Замість div з aria-modal -->
<dialog id="contactModal" aria-labelledby="modal-title">
  <h2 id="modal-title">Book a Strategy Call</h2>
  <button autofocus aria-label="Close modal">×</button>
  <!-- content -->
</dialog>
```

```javascript
const modal = document.getElementById('contactModal');
document.querySelector('[data-modal-open]')
  .addEventListener('click', () => modal.showModal());
modal.querySelector('[aria-label="Close modal"]')
  .addEventListener('click', () => modal.close());
```

### M5 — Popover API (Chrome 114+, Firefox 125+)

```html
<!-- Tooltip без JS -->
<button popovertarget="tooltip-seo">What is SEO?</button>
<div popover id="tooltip-seo">
  SEO (Search Engine Optimisation) is the practice of improving
  your website's visibility in search results.
</div>
```

---

## Порядок виконання {#порядок}

### Спринт 1 — Критичні виправлення (1-2 дні)

| # | Задача | Файли | Час |
|---|--------|-------|-----|
| 1 | `defer` на GSAP скриптах | index.html + всі сторінки | 30 хв |
| 2 | `prefers-reduced-motion` global | CSS у всіх сторінках | 20 хв |
| 3 | iOS `100dvh` fix | index.html, local pages | 15 хв |
| 4 | Skip navigation link | Всі сторінки | 20 хв |
| 5 | `autocomplete` на формах | contact.html | 15 хв |
| 6 | Heading hierarchy H3→H4 | index.html, contact.html | 30 хв |
| 7 | Focus-visible styles | Глобальний CSS | 20 хв |
| 8 | favicon + apple-touch-icon | `<head>` всіх сторінок | 30 хв |

### Спринт 2 — Performance (2-3 дні)

| # | Задача | Файли | Час |
|---|--------|-------|-----|
| 1 | Виділити shared CSS у main.css | Всі сторінки | 4 год |
| 2 | Виділити shared JS у main.js | Всі сторінки | 3 год |
| 3 | Оптимізувати Google Fonts | Всі сторінки | 1 год |
| 4 | Canvas visibility pause | JS | 30 хв |
| 5 | Resource hints (dns-prefetch) | `<head>` | 20 хв |
| 6 | Створити og-image.png | — | 1 год |

### Спринт 3 — Modern CSS (3-5 днів)

| # | Задача |
|---|--------|
| 1 | Впровадити CSS @layer структуру |
| 2 | Перейти на CSS Nesting |
| 3 | Додати Container Queries для cards/grids |
| 4 | :has() selector для форм та навбару |
| 5 | Великі breakpoints (1280, 1440, 1920px) |
| 6 | Print stylesheet |

### Спринт 4 — JS Modernization (3-5 днів)

| # | Задача |
|---|--------|
| 1 | `var` → `const`/`let` у всьому коді |
| 2 | `function(){}` → arrow functions |
| 3 | Intersection Observer для reveals (замість GSAP де можливо) |
| 4 | `fetch` + `async/await` для форми |
| 5 | Toast notifications система |
| 6 | View Transitions API для навігації |

### Спринт 5 — Polish & PWA (2-3 дні)

| # | Задача |
|---|--------|
| 1 | Web App Manifest |
| 2 | Native `<dialog>` для модалів |
| 3 | WebP/AVIF зображення (коли з'являться) |
| 4 | CSS Scroll-Driven Animations |
| 5 | Cross-browser повне тестування |

---

## Інструменти перевірки {#інструменти}

### Автоматичні (запускати перед кожним deploy)

```bash
# Lighthouse CI (якщо є Node.js)
npx lighthouse https://boomymarketing.com --view

# HTML валідатор
npx html-validator --file index.html

# CSS валідатор
npx stylelint "**/*.css"
```

### Онлайн інструменти

| Інструмент | URL | Що перевіряє |
|------------|-----|--------------|
| PageSpeed Insights | pagespeed.web.dev | CWV, LCP, CLS, INP |
| WebPageTest | webpagetest.org | Waterfall, TTFB, film strip |
| WAVE | wave.webaim.org | Accessibility |
| Colour Contrast | webaim.org/resources/contrastchecker | WCAG AA/AAA |
| Can I Use | caniuse.com | Browser support |
| Responsively | responsively.app | Multi-device preview |
| Chrome DevTools | F12 → Lighthouse | Все разом |

### Браузерне тестування (BrowserStack або вручну)

```
Мінімальний набір:
✅ Chrome latest (Windows + Mac)
✅ Safari latest (Mac + iOS)
✅ Firefox latest (Windows)
✅ Edge latest (Windows)
✅ Chrome Android (Samsung Galaxy)
✅ Safari iOS (iPhone 13+)
```

---

*Файл створено: 2026-04-14 | Boomy Marketing | boomymarketing.com*
*Автор: Claude Sonnet 4.6 — Frontend Audit & Modern Web Practices 2026-2027*
