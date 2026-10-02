/* "The door opens": scroll position -> how far the door is open (--open, 0..1), interpolated between sections. */
(() => {
  const root = document.documentElement;
  const scene = document.querySelector('.scene');
  const beats = [...document.querySelectorAll('[data-open]')];
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let anchors = [];
  // a section's value is reached when its top meets the middle of the screen; the first one holds at the top of the page
  const measure = () => { anchors = beats.map((b, i) => (i ? b.getBoundingClientRect().top + scrollY : innerHeight * 0.5)); update(); };
  function update() {
    const p = scrollY + innerHeight * 0.5;
    let o = +beats[0].dataset.open;
    for (let i = 1; i < beats.length; i++) {
      const a = anchors[i - 1], b = anchors[i], va = +beats[i - 1].dataset.open, vb = +beats[i].dataset.open;
      if (p >= b) { o = vb; continue; }
      if (p > a) o = va + (vb - va) * ((p - a) / (b - a));
      break;
    }
    if (still) o = Math.round(o * 4) / 4;
    root.style.setProperty('--open', o.toFixed(3));
    scene.classList.toggle('is-open', o > 0.04);
    document.body.classList.toggle('is-inside', o > 0.95);
  }
  let raf = 0;
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; update(); }); }, { passive: true });
  addEventListener('resize', measure);
  addEventListener('load', measure);
  if (document.fonts) document.fonts.ready.then(measure);
  document.querySelectorAll('details').forEach((d) => d.addEventListener('toggle', measure));
  measure();
})();
