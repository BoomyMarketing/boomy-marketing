/* "05:30 · The gym opens": the film is a numbered image sequence drawn on a canvas; the scroll picks the frame.
   Scroll down plays it, scroll up rewinds. Readouts and captions follow the footage (frame numbers from film.json).
   No form sending, no storage, no tracking. */
(() => {
  // ---------- form never submits; sticky button steps aside near the form ----------
  document.querySelectorAll('form.quick').forEach((f) => f.addEventListener('submit', (e) => e.preventDefault()));
  const dock = document.querySelector('.dock');
  const form = document.getElementById('request');
  if (dock && form && 'IntersectionObserver' in window) new IntersectionObserver(([e]) => dock.classList.toggle('is-away', e.isIntersecting), { threshold: 0.15 }).observe(form);

  // ---------- the film ----------
  const film = document.querySelector('.film');
  const cfg = JSON.parse(film.dataset.film);
  const N = cfg.frames, ev = cfg.ev;
  const canvas = film.querySelector('.screen');
  const ctx = canvas.getContext('2d');
  const caps = [...film.querySelectorAll('.cap')];
  const hudDoor = film.querySelector('.hud-door'), hudKey = film.querySelector('.hud-key'), hudLights = film.querySelector('.hud-lights');
  const clock = document.querySelector('.clock'), clockTime = clock.querySelector('.clock-time'), clockNote = clock.querySelector('.clock-note');
  const loadBar = film.querySelector('.load-bar'), loadTxt = film.querySelector('.load-txt');
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const src = (i) => `/sites/gym-film/media/seq/${String(i).padStart(3, '0')}.webp`;
  const frames = new Array(N);
  let loaded = 0, cur = 0, target = 0, drawn = -1, raf = 0;

  // preload: frame 0 first, then every 8th frame (so a fast scroll already has something close), then the rest
  const order = [0];
  for (let s = 8; s >= 1; s = s / 2) for (let i = 0; i < N; i += s) if (!order.includes(i)) order.push(i);
  for (let i = 0; i < N; i++) if (!order.includes(i)) order.push(i);
  let next = 0;
  const pump = () => {
    if (next >= order.length) return;
    const i = order[next++];
    const im = new Image();
    im.decoding = 'async';
    im.onload = () => { frames[i] = im; loaded++; progress(); if (Math.abs(i - Math.round(cur)) < 3) draw(true); pump(); };
    im.onerror = () => { loaded++; progress(); pump(); };
    im.src = src(i);
  };
  for (let k = 0; k < 6; k++) pump();
  function progress() {
    const p = Math.round((loaded / N) * 100);
    loadBar.style.setProperty('--p', `${p}%`);
    loadTxt.textContent = p < 100 ? `Loading the film ${p}%` : 'Ready';
    if (loaded >= N) film.classList.add('is-loaded');
  }

  // nearest frame that has loaded
  const nearest = (i) => { for (let d = 0; d < N; d++) { if (frames[i - d]) return frames[i - d]; if (frames[i + d]) return frames[i + d]; } return null; };
  function size() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr);
    drawn = -1; draw(true);
  }
  function draw(force) {
    const i = Math.max(0, Math.min(N - 1, Math.round(cur)));
    if (!force && i === drawn) return;
    const im = nearest(i);
    if (!im) return;
    const cw = canvas.width, ch = canvas.height, s = Math.max(cw / im.naturalWidth, ch / im.naturalHeight);
    const w = im.naturalWidth * s, h = im.naturalHeight * s;
    ctx.drawImage(im, (cw - w) / 2, (ch - h) / 2, w, h); // cover, centred: the action sits in the middle 80%
    drawn = i;
    film.classList.add('is-live');
  }

  // footage-keyed readouts
  const lerp = (a, b, t) => a + (b - a) * Math.min(1, Math.max(0, t));
  const fmt = (sec) => { const m = Math.floor(sec / 60), s = Math.floor(sec % 60); return `05:${String(29 + m).padStart(2, '0')}:${String(s).padStart(2, '0')}`; };
  function readouts(i) {
    const p = i / (N - 1);
    // the film covers 05:29:52 -> 05:30:06 (14 s of story time over the take)
    clockTime.textContent = fmt(52 + 14 * p);
    const go = i >= ev.green;
    const open = i >= ev.open;
    hudDoor.textContent = open ? 'Open' : go ? 'Unlocked' : 'Locked';
    hudDoor.classList.toggle('is-go', go);
    hudKey.textContent = i >= ev.tap ? 'Wallet · Coach' : '—';
    hudKey.classList.toggle('is-go', i >= ev.tap);
    const lights = Math.round(lerp(0, 12, (i - ev.lights) / Math.max(1, ev.inside - ev.lights)));
    hudLights.textContent = `${lights} / 12`;
    hudLights.classList.toggle('is-go', lights > 0);
    clock.classList.toggle('is-go', go);
    clockNote.textContent = open ? 'Door open' : go ? 'Unlocked' : 'Door locked';
    for (const c of caps) c.classList.toggle('on', p >= +c.dataset.from && p < +c.dataset.to);
  }

  function filmProgress() {
    const r = film.getBoundingClientRect();
    const span = r.height - innerHeight;
    return Math.min(1, Math.max(0, -r.top / span));
  }
  function tick() {
    raf = 0;
    target = filmProgress() * (N - 1);
    cur = still ? target : cur + (target - cur) * 0.22;
    if (Math.abs(target - cur) < 0.05) cur = target;
    draw(false);
    if (inFilm) readouts(Math.round(cur));
    if (cur !== target) raf = requestAnimationFrame(tick);
  }
  const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };

  // ---------- the day clock after the film ----------
  let inFilm = true;
  const secs = [...document.querySelectorAll('[data-clock]')];
  function dayClock() {
    const fr = film.getBoundingClientRect();
    inFilm = fr.bottom > innerHeight * 0.5;
    if (inFilm) { readouts(Math.round(cur)); return; }
    const mid = innerHeight * 0.5;
    const s = secs.find((x) => { const r = x.getBoundingClientRect(); return r.top <= mid && r.bottom > mid; }) || secs[secs.length - 1];
    clockTime.textContent = s.dataset.clock;
    clockNote.textContent = s.dataset.note;
    clock.classList.toggle('is-go', s.dataset.note !== 'Door locked');
  }

  // ---------- X-ray lens ----------
  const lens = document.querySelector('.lens');
  if (lens) {
    const input = lens.querySelector('input');
    const tags = [...lens.querySelectorAll('.tag')];
    const wires = new Map([...lens.querySelectorAll('.w')].map((g) => [g.dataset.id, g]));
    const set = (v) => { lens.style.setProperty('--x', `${v}%`); for (const t of tags) { const on = +t.dataset.x * 100 < v; t.classList.toggle('on', on); wires.get(t.dataset.id)?.classList.toggle('on', on); } };
    input.addEventListener('input', () => set(+input.value));
    set(+input.value);
    // drift slowly once when it first comes into view, so people see what it does
    if (!still && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return; io.disconnect();
        let t0 = null; const from = +input.value;
        const step = (t) => { if (t0 === null) t0 = t; const k = Math.min(1, (t - t0) / 2200); const v = from + (72 - from) * (1 - Math.cos(k * Math.PI)) / 2; input.value = v; set(v); if (k < 1 && !lens.matches(':active')) requestAnimationFrame(step); };
        requestAnimationFrame(step);
      }, { threshold: 0.5 });
      io.observe(lens);
    }
  }

  addEventListener('scroll', () => { kick(); dayClock(); }, { passive: true });
  addEventListener('resize', () => { size(); kick(); });
  size(); readouts(0); dayClock(); kick();
})();
