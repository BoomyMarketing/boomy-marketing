/* SmartphoneKey Toronto v4. No network requests, no browser storage, no tracking. */
(() => {
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.documentElement.classList.add('js');

  // Sections rise in as they arrive; the log fills row by row; the step line draws itself.
  const revealTargets = document.querySelectorAll('.sec .eyebrow, .sec-title, .sec-lede, .how-step, .passes, .tile, .checks li, .qa details, .visit-photo, .cmp-wrap, .call li, .ticks li');
  revealTargets.forEach((el) => el.classList.add('rv'));
  let pending = [...document.querySelectorAll('.rv, .log-panel, .how-steps')];
  let ticking = false;
  const reveal = () => {
    ticking = false;
    const line = window.innerHeight * 0.9;
    pending = pending.filter((el) => {
      if (el.getBoundingClientRect().top < line) { el.classList.add('in'); return false; }
      return true;
    });
    if (!pending.length) window.removeEventListener('scroll', onReveal);
  };
  const onReveal = () => { if (!ticking) { ticking = true; requestAnimationFrame(reveal); } };
  window.addEventListener('scroll', onReveal, { passive: true });
  window.addEventListener('resize', onReveal);
  reveal();

  // Wallet passes tilt toward the pointer.
  if (!reduce.matches && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.pass').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--ry', ((e.clientX - r.left) / r.width - 0.5) * 14 + 'deg');
        card.style.setProperty('--rx', (0.5 - (e.clientY - r.top) / r.height) * 12 + 'deg');
      });
      card.addEventListener('pointerleave', () => { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); });
    });
  }

  // The request form is not connected: never submit, never clear, never show success.
  const form = document.getElementById('request');
  if (form) form.addEventListener('submit', (event) => event.preventDefault());

  // Menu: audience dropdown on wide screens, full-screen sheet on phones.
  const burger = document.querySelector('.burger');
  const dropBtn = document.querySelector('.nav-drop');
  const group = dropBtn && dropBtn.closest('.nav-group');
  const setMenu = (open) => {
    document.documentElement.classList.toggle('menu-open', open);
    if (burger) burger.setAttribute('aria-expanded', String(open));
  };
  if (burger) burger.addEventListener('click', () => setMenu(!document.documentElement.classList.contains('menu-open')));
  if (dropBtn) {
    dropBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = !group.classList.contains('is-open');
      group.classList.toggle('is-open', open);
      dropBtn.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', (e) => { if (!group.contains(e.target)) { group.classList.remove('is-open'); dropBtn.setAttribute('aria-expanded', 'false'); } });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    setMenu(false);
    if (group) { group.classList.remove('is-open'); dropBtn.setAttribute('aria-expanded', 'false'); }
  });
  document.querySelectorAll('.nav a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

  // Header turns to glass once the page moves, so text never runs under the logo.
  const bar = document.querySelector('.bar');
  const onScroll = () => bar.classList.toggle('solid', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const reader = document.querySelector('.reader');
  const status = reader && reader.querySelector('.r-status');
  const log = reader && reader.querySelector('.r-log');
  const chapters = [...document.querySelectorAll('[data-chapter]')];
  const day = document.querySelector('.day');
  if (!reader || !chapters.length || !('IntersectionObserver' in window)) {
    chapters.forEach((ch) => ch.classList.add('in'));
    return;
  }

  const seen = new Set();
  let timer = 0;
  const open = (ch) => {
    clearTimeout(timer);
    reader.dataset.state = 'reading';
    status.textContent = 'Reading the key…';
    timer = setTimeout(() => {
      reader.dataset.state = 'granted';
      status.textContent = 'Access granted · ' + ch.dataset.door;
      if (!seen.has(ch.id)) {
        seen.add(ch.id);
        const item = document.createElement('li');
        const time = document.createElement('time');
        time.textContent = ch.dataset.time;
        item.append(time, ch.dataset.who + ' · ' + ch.dataset.door + ' · opened');
        log.prepend(item);
      }
    }, reduce.matches ? 0 : 700);
  };

  // Each chapter that fills most of the screen "taps" the reader.
  // The reader shows only while a chapter fills most of the screen, so it never covers other sections.
  const showing = new Set();
  const chapterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio >= 0.6) {
        showing.add(entry.target);
        entry.target.classList.add('in');
        open(entry.target);
      } else showing.delete(entry.target);
    });
    reader.classList.toggle('on', showing.size > 0);
  }, { threshold: [0, 0.6] });
  chapters.forEach((ch) => chapterObserver.observe(ch));

  // Film: play only while visible and only when motion is welcome.
  const film = document.querySelector('[data-film] video');
  if (film && !reduce.matches) {
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) film.play().catch(() => {});
      else film.pause();
    }, { threshold: 0.4 }).observe(film);
  }
})();
