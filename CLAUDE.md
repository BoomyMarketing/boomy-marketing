# Boomy Marketing — Claude Instructions

## Проєкт
Static HTML сайт на Vercel. boomymarketing.com.

## Головний документ
**При будь-якій задачі з версткою — читати `FRONTEND-WORKFLOW.md`**

Там: процес роботи, CSS стандарти, JS патерни, тренди 2026-2027, чеклісти.

## Ключові правила (коротко)
- CSS тільки в `/assets/css/main.css` — ніякого inline CSS
- JS тільки в `/assets/js/main.js` — ніякого inline JS
- Всі кольори/spacing через CSS токени (`var(--...)`)
- `@layer` порядок не міняти: `reset, tokens, base, layout, components, utilities`
- Всі `<script>` з атрибутом `defer`
- `container-type` НЕ ставити на `.section` (ламає layout)

## Документи проєкту
- `FRONTEND-WORKFLOW.md` — стандарти верстки і тренди 2026-2027
- `SEO-CONTENT-WORKFLOW.md` — SEO контент стандарти, E-E-A-T, GEO, schema 2026-2027
- `CONTENT-OPTIMIZATION-PLAN.md` — 9-кроковий план оптимізації контенту
- `FRONTEND-AUDIT-PLAN.md` — план аудиту та оптимізації верстки
- `SEO-WORKFLOW-SYSTEM-2026.md` — SEO процес (загальний)
- `PARTNER-REPORT.md` — звіт для партнера
