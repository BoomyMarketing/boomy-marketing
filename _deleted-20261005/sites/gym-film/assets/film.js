/* The original 12-second film, played quietly in view. No sending, storage or tracking. */
(() => {
  document.querySelectorAll('form.quick').forEach((f) => f.addEventListener('submit', (e) => e.preventDefault()));
  const dock = document.querySelector('.dock'), form = document.getElementById('request');
  if (dock && form && 'IntersectionObserver' in window) new IntersectionObserver(([e]) => dock.classList.toggle('is-away', e.isIntersecting), { threshold: 0.1 }).observe(form);

  const film = document.querySelector('.film'), video = film.querySelector('video');
  const cfg = JSON.parse(film.dataset.film), caps = [...film.querySelectorAll('.cap')];
  const toggle = film.querySelector('.film-toggle'), state = film.querySelector('.film-state');
  const clock = document.querySelector('.clock'), clockTime = clock.querySelector('.clock-time'), clockNote = clock.querySelector('.clock-note');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const sections = [...document.querySelectorAll('[data-clock]')];
  let inView = false, userPaused = false, userStarted = false, scrollFrame = 0;
  video.controls = false;
  toggle.hidden = false;
  video.muted = true;

  function syncButton() {
    toggle.textContent = video.paused ? 'Play film' : 'Pause film';
    toggle.setAttribute('aria-label', video.paused ? 'Play the muted 12-second film' : 'Pause the film');
  }
  function play() {
    if (video.error) return;
    video.play().catch(() => {
      syncButton();
      if (video.paused) state.textContent = 'Tap play to watch · 12 seconds';
    });
  }
  function playback() {
    if (inView && !document.hidden && !userPaused && (userStarted || !reduced.matches)) play();
    else video.pause();
  }
  toggle.addEventListener('click', () => {
    if (video.paused) { userPaused = false; userStarted = true; play(); }
    else { userPaused = true; userStarted = false; video.pause(); }
  });
  video.addEventListener('playing', () => { state.textContent = 'Playing · 12 seconds · muted'; syncButton(); });
  video.addEventListener('pause', () => { state.textContent = '12-second film · paused'; syncButton(); });
  video.addEventListener('error', () => { state.textContent = 'Film unavailable · read the story below'; toggle.disabled = true; });
  if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => { inView = e.isIntersecting; playback(); }, { threshold: 0.15 }).observe(video);
  else { inView = true; playback(); }
  document.addEventListener('visibilitychange', playback);
  reduced.addEventListener('change', () => { userStarted = false; playback(); });

  function readouts() {
    const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : cfg.duration;
    const p = Math.min(1, video.currentTime / duration), i = p * (cfg.frames - 1);
    for (const c of caps) c.classList.toggle('on', p >= +c.dataset.from && p < +c.dataset.to);
    if (film.getBoundingClientRect().bottom <= innerHeight * 0.4) return;
    const sec = Math.floor(52 + 14 * p);
    clockTime.textContent = `05:${String(29 + Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;
    clockNote.textContent = i >= cfg.ev.open ? 'Door open' : i >= cfg.ev.green ? 'Unlocked' : 'Door locked';
    clock.classList.toggle('is-go', i >= cfg.ev.green);
  }
  video.addEventListener('timeupdate', readouts);
  function dayClock() {
    scrollFrame = 0;
    if (film.getBoundingClientRect().bottom > innerHeight * 0.4) { readouts(); return; }
    const mid = innerHeight * 0.5;
    const s = sections.find((x) => { const r = x.getBoundingClientRect(); return r.top <= mid && r.bottom > mid; }) || sections.find((x) => x.getBoundingClientRect().bottom > mid) || sections.at(-1);
    clockTime.textContent = s.dataset.clock;
    clockNote.textContent = s.dataset.note;
    clock.classList.toggle('is-go', s.dataset.note !== 'Door locked');
  }
  addEventListener('scroll', () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(dayClock); }, { passive: true });
  addEventListener('resize', dayClock);

  const lens = document.querySelector('.lens');
  if (lens) {
    const input = lens.querySelector('input'), tags = [...lens.querySelectorAll('.tag')];
    const wires = new Map([...lens.querySelectorAll('.w')].map((g) => [g.dataset.id, g]));
    const set = (v) => {
      lens.style.setProperty('--x', `${v}%`);
      input.setAttribute('aria-valuetext', `${Math.round(v)}% of the door interior revealed`);
      for (const t of tags) {
        const on = +t.dataset.x * 100 < v;
        t.classList.toggle('on', on); wires.get(t.dataset.id)?.classList.toggle('on', on);
      }
    };
    input.addEventListener('input', () => set(+input.value));
    set(+input.value);
  }
  syncButton(); readouts(); dayClock();
})();
