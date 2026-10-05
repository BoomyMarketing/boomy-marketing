/* Version 17 "The Door Opens": mobile menu, the door that opens with the scroll, the X-ray lens, the product film
   (plays by itself, muted, no controls), the sticky button. The form never sends. No storage, no tracking. */
(() => {
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // mobile menu
  const burger = document.querySelector('.hd-burger');
  const nav = document.getElementById('hd-nav');
  if (burger && nav) {
    const set = (open) => { burger.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open); };
    burger.addEventListener('click', () => set(burger.getAttribute('aria-expanded') !== 'true'));
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
  }

  // the door: how far it is open follows the scroll through the first screen
  const hero = document.querySelector('.hero');
  const stateTxt = hero && hero.querySelector('.state-txt');
  const label = (o) => (o < 0.04 ? 'Door: locked' : o < 0.3 ? 'Door: unlocked' : o < 0.95 ? 'Door: opening' : 'Door: open · come in');
  function door() {
    if (!hero) return;
    const r = hero.getBoundingClientRect();
    const span = Math.max(1, r.height - innerHeight * 0.9);
    let o = Math.min(1, Math.max(0, -r.top / span));
    if (still) o = o > 0.5 ? 1 : 0;
    hero.style.setProperty('--open', o.toFixed(3));
    hero.classList.toggle('is-open', o > 0.04);
    if (stateTxt) stateTxt.textContent = label(o);
  }
  let raf = 0;
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; door(); }); }, { passive: true });
  addEventListener('resize', door);
  door();

  // product film: plays by itself, muted and looping; nothing to press
  document.querySelectorAll('.product-film').forEach((v) => {
    v.muted = true; v.loop = true; v.playsInline = true; v.removeAttribute('controls');
    const play = () => { if (still || document.hidden) return; const p = v.play(); if (p) p.catch(() => {}); };
    if (still) { v.removeAttribute('autoplay'); v.pause(); }
    v.addEventListener('pause', () => { if (!v.ended) play(); });
    document.addEventListener('visibilitychange', play);
    play();
  });

  // X-ray lens
  const lens = document.querySelector('.lens');
  if (lens) {
    const input = lens.querySelector('input');
    const tags = [...lens.querySelectorAll('.tag')];
    const wires = new Map([...lens.querySelectorAll('.w')].map((g) => [g.dataset.id, g]));
    const set = (v) => { lens.style.setProperty('--x', `${v}%`); for (const t of tags) { const on = +t.dataset.x * 100 < v; t.classList.toggle('on', on); wires.get(t.dataset.id)?.classList.toggle('on', on); } };
    input.addEventListener('input', () => set(+input.value));
    set(+input.value);
    if (!still && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return; io.disconnect();
        let t0 = null; const from = +input.value;
        const step = (t) => { if (t0 === null) t0 = t; const k = Math.min(1, (t - t0) / 2200); const v = from + (72 - from) * (1 - Math.cos(k * Math.PI)) / 2; input.value = v; set(v); if (k < 1) requestAnimationFrame(step); };
        requestAnimationFrame(step);
      }, { threshold: 0.5 });
      io.observe(lens);
    }
  }

  // the form is not connected: never submit; the sticky button steps aside on the first screen and near the form
  document.querySelectorAll('form.quick').forEach((f) => f.addEventListener('submit', (e) => e.preventDefault()));
  const dock = document.querySelector('.dock');
  const form = document.getElementById('request');
  const heroCopy = document.querySelector('.hero-copy');
  if (dock && form && heroCopy && 'IntersectionObserver' in window) {
    let nearForm = false, onFirst = true;
    const upd = () => dock.classList.toggle('is-away', nearForm || onFirst);
    new IntersectionObserver(([e]) => { nearForm = e.isIntersecting; upd(); }, { threshold: 0.1 }).observe(form);
    const first = () => { onFirst = scrollY < innerHeight * 0.5; upd(); };
    addEventListener('scroll', first, { passive: true });
    first();
  }
})();
