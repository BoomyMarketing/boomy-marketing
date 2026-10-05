/* "One day with the key": the scroll is the clock. The header clock and the sun/moon follow the time between moments. */
(() => {
  const secs = [...document.querySelectorAll('[data-time]')];
  const clock = document.querySelector('.sun-clock');
  const sun = document.querySelector('.sun');
  const dot = document.querySelector('.sun-dot');
  const mins = (t) => { const m = /^(\d\d):(\d\d)$/.exec(t); return m ? +m[1] * 60 + +m[2] : null; };
  const fmt = (m) => `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(Math.floor(m % 60)).padStart(2, '0')}`;
  const DAY0 = 5 * 60, DAY1 = 23.5 * 60;
  function update() {
    const mid = innerHeight * 0.45;
    let i = secs.findIndex((s) => s.getBoundingClientRect().bottom > mid);
    if (i < 0) i = secs.length - 1;
    const s = secs[i], r = s.getBoundingClientRect();
    const a = mins(s.dataset.time);
    document.body.dataset.tone = r.top < 70 || i === 0 ? s.dataset.tone : (secs[i - 1] || s).dataset.tone;
    let m = a;
    if (a !== null) {
      const next = secs.slice(i + 1).map((x) => mins(x.dataset.time)).find((v) => v !== null);
      const f = Math.min(1, Math.max(0, (mid - r.top) / r.height));
      if (next != null) m = a + (next - a) * f * f; // most of the section reads at its own time, then the clock runs on
      clock.textContent = fmt(m);
    } else clock.textContent = s.dataset.time;
    const t = Math.min(1, Math.max(0, ((m ?? DAY1) - DAY0) / (DAY1 - DAY0)));
    const x = (1 - t) ** 2 * 4 + 2 * (1 - t) * t * 50 + t * t * 96, y = (1 - t) ** 2 * 38 + 2 * (1 - t) * t * -14 + t * t * 38;
    dot.setAttribute('cx', x.toFixed(1)); dot.setAttribute('cy', y.toFixed(1));
    sun.classList.toggle('is-night', (m ?? DAY1) >= 19 * 60 || (m ?? 0) < 6 * 60);
  }
  let raf = 0;
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; update(); }); }, { passive: true });
  addEventListener('resize', update);
  update();
})();
