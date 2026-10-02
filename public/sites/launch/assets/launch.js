/* SmartphoneKey Toronto · "Launch". No form sending, no browser storage, no tracking. */
(() => {
  'use strict';
  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const smooth = (t) => t * t * (3 - 2 * t);
  root.classList.add('js');

  // The request form is not connected: never submit, never clear, never show success.
  document.querySelectorAll('form.quick').forEach((form) => form.addEventListener('submit', (e) => e.preventDefault()));

  // Menu: audience dropdown on wide screens, full-screen sheet on phones.
  const burger = document.querySelector('.burger');
  const dropBtn = document.querySelector('.nav-drop');
  const group = dropBtn && dropBtn.closest('.nav-group');
  const setMenu = (open) => { root.classList.toggle('menu-open', open); if (burger) burger.setAttribute('aria-expanded', String(open)); };
  const setDrop = (open) => { if (!group) return; group.classList.toggle('is-open', open); dropBtn.setAttribute('aria-expanded', String(open)); };
  if (burger) burger.addEventListener('click', () => setMenu(!root.classList.contains('menu-open')));
  if (dropBtn) {
    dropBtn.addEventListener('click', (e) => { e.stopPropagation(); setDrop(!group.classList.contains('is-open')); });
    document.addEventListener('click', (e) => { if (!group.contains(e.target)) setDrop(false); });
  }
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { setMenu(false); setDrop(false); } });
  document.querySelectorAll('.nav a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

  // Header turns to glass once the page moves.
  const bar = document.querySelector('.bar');
  const onBar = () => bar.classList.toggle('solid', window.scrollY > 24);
  onBar();
  window.addEventListener('scroll', onBar, { passive: true });

  // Sections rise in as they arrive.
  if (!reduce) {
    const targets = document.querySelectorAll('.sec .eyebrow, .sec-title, .sec-lede, .step, .tile, .pass, .checks li, .qa details, .aud li, .mo-copy, .mo-photo, .log, .fit-col, .facts li, .call li, .ticks li');
    targets.forEach((el) => el.classList.add('rv'));
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px' });
      targets.forEach((el) => io.observe(el));
    } else targets.forEach((el) => el.classList.add('in'));
  }

  // Wallet passes tilt toward the pointer; the stage glow follows it.
  if (!reduce && fine) {
    document.querySelectorAll('.pass').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--ry', ((e.clientX - r.left) / r.width - 0.5) * 12 + 'deg');
        card.style.setProperty('--rx', (0.5 - (e.clientY - r.top) / r.height) * 10 + 'deg');
      });
      card.addEventListener('pointerleave', () => { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); });
    });
    window.addEventListener('pointermove', (e) => {
      root.style.setProperty('--cx', (e.clientX / window.innerWidth * 100).toFixed(1) + '%');
      root.style.setProperty('--cy', (e.clientY / window.innerHeight * 100).toFixed(1) + '%');
    }, { passive: true });
  }

  // Sound: off by default, a short access chirp on tap when switched on. Nothing is remembered.
  const soundBtn = document.querySelector('.sound');
  let audio = null;
  let soundOn = false;
  const beep = () => {
    if (!soundOn || !audio) return;
    const t = audio.currentTime;
    [[1320, 0], [1760, 0.085]].forEach(([f, d]) => {
      const o = audio.createOscillator();
      const g = audio.createGain();
      o.type = 'sine';
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t + d);
      g.gain.exponentialRampToValueAtTime(0.06, t + d + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + d + 0.07);
      o.connect(g).connect(audio.destination);
      o.start(t + d);
      o.stop(t + d + 0.08);
    });
  };
  if (soundBtn) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) soundBtn.hidden = true;
    soundBtn.addEventListener('click', () => {
      soundOn = !soundOn;
      if (soundOn && !audio && Ctx) audio = new Ctx();
      if (audio && audio.state === 'suspended') audio.resume();
      soundBtn.setAttribute('aria-pressed', String(soundOn));
      soundBtn.querySelector('.sound-txt').textContent = soundOn ? 'Sound on' : 'Sound off';
      if (soundOn) beep();
    });
  }

  // Contactless tap ripple wherever someone clicks or taps.
  document.addEventListener('pointerdown', (e) => {
    if (e.button > 0 || e.target.closest('input, select, textarea, .sound')) return;
    if (!reduce) {
      const r = document.createElement('span');
      r.className = 'ripple';
      r.setAttribute('aria-hidden', 'true');
      r.style.left = e.clientX + 'px';
      r.style.top = e.clientY + 'px';
      r.innerHTML = '<i></i><i></i><i></i>';
      document.body.appendChild(r);
      setTimeout(() => r.remove(), 1300);
    }
    beep();
  });

  // Progress of a tall section while its sticky stage is pinned: 0 → 1.
  const progress = (el) => {
    const r = el.getBoundingClientRect();
    const run = r.height - window.innerHeight;
    return run > 0 ? clamp(-r.top / run) : 0;
  };

  // Home: the door-tap shot as a canvas image sequence. Scroll position picks the frame; scrolling up rewinds.
  const launch = document.querySelector('[data-launch]');
  if (launch && !reduce) {
    const count = +launch.dataset.count;
    const seq = launch.querySelector('.seq');
    const canvas = launch.querySelector('.seq-canvas');
    const still = launch.querySelector('.seq-still');
    const ctx = canvas.getContext('2d');
    const loadPct = launch.querySelector('.seq-load span');
    const steps = [...launch.querySelectorAll('.status-steps li')];
    const frameOut = launch.querySelector('.status-frame');
    const set = window.matchMedia('(max-width: 719px)').matches ? 'm' : 'd';
    const src = (i) => `/sites/launch/media/seq/${set}/${String(i).padStart(3, '0')}.webp`;
    const frames = new Array(count);
    let loaded = 0;
    let current = 0;
    let target = 0;
    let drawn = -1;
    let raf = 0;
    root.classList.add('scrub');
    seq.classList.add('seq-loading');

    const fit = () => {
      const r = seq.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      drawn = -1;
    };
    // nearest frame that has arrived, so scrubbing works while the rest load
    const nearest = (i) => {
      for (let d = 0; d < count; d++) {
        if (frames[i - d] && frames[i - d].done) return i - d;
        if (frames[i + d] && frames[i + d].done) return i + d;
      }
      return -1;
    };
    const draw = (i) => {
      const k = nearest(i);
      if (k < 0 || k === drawn) return;
      const img = frames[k].img;
      // contain: the whole frame is always visible
      const s = Math.min(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
      const w = img.naturalWidth * s, h = img.naturalHeight * s;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
      drawn = k;
      seq.classList.add('seq-on');
    };
    const readout = (i) => {
      let now = -1;
      steps.forEach((li, k) => { const on = i >= +li.dataset.at; li.classList.toggle('done', on); if (on) now = k; });
      steps.forEach((li, k) => li.classList.toggle('now', k === now));
      frameOut.textContent = `Frame ${String(i).padStart(3, '0')} / ${count - 1}`;
      launch.classList.toggle('at-end', i >= count - 3);
    };
    const tick = () => {
      raf = 0;
      const p = progress(launch);
      launch.style.setProperty('--lp', p.toFixed(4));
      target = p * (count - 1);
      current += (target - current) * 0.22;
      if (Math.abs(target - current) < 0.4) current = target;
      const i = Math.round(current);
      draw(i);
      readout(i);
      if (current !== target) raf = requestAnimationFrame(tick);
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };

    // Coarse-to-fine preload: first frame, then every 16th, 8th, 4th, 2nd, then the rest. Six at a time.
    const order = [0];
    [16, 8, 4, 2, 1].forEach((step) => { for (let i = 0; i < count; i += step) if (!order.includes(i)) order.push(i); });
    if (!order.includes(count - 1)) order.splice(1, 0, count - 1);
    let next = 0;
    const pump = () => {
      if (next >= order.length) return;
      const i = order[next++];
      const img = new Image();
      img.decoding = 'async';
      frames[i] = { img, done: false };
      const finish = () => {
        loaded++;
        if (loadPct) loadPct.textContent = Math.round(loaded / count * 100) + '%';
        if (loaded === count) seq.classList.remove('seq-loading');
        drawn = -1;
        kick();
        pump();
      };
      img.onload = () => { frames[i].done = true; finish(); };
      img.onerror = finish;
      img.src = src(i);
    };
    fit();
    for (let k = 0; k < 6; k++) pump();
    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', () => { fit(); kick(); });
    kick();
  }

  // Home: the chapter rail marks where you are.
  const rail = document.querySelector('.rail');
  if (rail && 'IntersectionObserver' in window) {
    const links = [...rail.querySelectorAll('a')];
    const seen = new Map();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => seen.set(en.target.id, en.isIntersecting));
      const active = links.map((a) => a.dataset.ch).filter((id) => seen.get(id)).pop();
      links.forEach((a) => a.classList.toggle('on', a.dataset.ch === active));
    }, { rootMargin: '-45% 0px -45% 0px' });
    links.forEach((a) => { const el = document.getElementById(a.dataset.ch); if (el) io.observe(el); });
  }

  // The reader, exploded: push in, separate the layers, then walk the spec callouts.
  document.querySelectorAll('[data-xv]').forEach((xv) => {
    const scene = xv.querySelector('.xv-scene');
    const view = xv.querySelector('.xv-view');
    const specs = [...xv.querySelectorAll('.spec')];
    const outLayers = xv.querySelector('.xv-layers');
    const outPart = xv.querySelector('.xv-part');
    const outK = xv.querySelector('.xv-k');
    const PART = { glass: 'Glass front', coil: 'NFC antenna coil', board: 'Relay board', back: 'Backplate' };
    const setActive = (i, focusLayer) => {
      if (outK) outK.textContent = String(i + 1);
      if (outPart) outPart.textContent = focusLayer && specs[i] ? PART[specs[i].dataset.layer] : 'All';
      specs.forEach((s, k) => s.classList.toggle('on', k === i));
      const s = specs[i];
      xv.dataset.node = s ? s.dataset.node : '';
      if (focusLayer && s) xv.dataset.focus = s.dataset.layer; else delete xv.dataset.focus;
    };

    // View modes: exploded or X-ray wiring.
    xv.querySelectorAll('.mode').forEach((btn) => btn.addEventListener('click', () => {
      xv.dataset.mode = btn.dataset.mode;
      xv.querySelectorAll('.mode').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      if (btn.dataset.mode === 'xray' && !reduce) {
        xv.classList.remove('drawing');
        void xv.offsetWidth;
        xv.classList.add('drawing');
      }
    }));
    xv.dataset.mode = 'explode';

    if (reduce) {
      // Static: fully exploded, every callout listed; hovering a callout highlights its part.
      specs.forEach((s, i) => {
        s.addEventListener('pointerenter', () => setActive(i, true));
        s.addEventListener('pointerleave', () => { specs.forEach((x) => x.classList.remove('on')); delete xv.dataset.focus; xv.dataset.node = ''; });
      });
      return;
    }

    root.classList.add('scrub-x');
    let raf = 0;
    let last = -2;
    const tick = () => {
      raf = 0;
      const p = progress(xv);
      const push = clamp(p / 0.12);
      const e = smooth(clamp((p - 0.08) / 0.22));
      const b = clamp((p - 0.08) / 0.3);
      const q = clamp((p - 0.32) / 0.64);
      const idx = Math.min(specs.length - 1, Math.floor(q * specs.length));
      const scan = p > 0.32 ? (q * specs.length) % 1 : -1;
      scene.style.setProperty('--push', push.toFixed(3));
      scene.style.setProperty('--e', e.toFixed(3));
      scene.style.setProperty('--b', b.toFixed(3));
      scene.style.setProperty('--scan', scan.toFixed(3));
      if (outLayers) outLayers.textContent = String(1 + Math.round(e * 3));
      const key = p > 0.32 ? idx : -1;
      if (key !== last) { last = key; setActive(Math.max(0, idx), p > 0.32); }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    tick();

    if (fine) {
      view.addEventListener('pointermove', (ev) => {
        const r = view.getBoundingClientRect();
        scene.style.setProperty('--mx', (((ev.clientX - r.left) / r.width - 0.5) * 16).toFixed(2));
        scene.style.setProperty('--my', (((ev.clientY - r.top) / r.height - 0.5) * -12).toFixed(2));
      });
      view.addEventListener('pointerleave', () => { scene.style.setProperty('--mx', '0'); scene.style.setProperty('--my', '0'); });
    }
  });

  // How it works: the regular film plays only while visible and only when motion is welcome.
  const reel = document.querySelector('[data-film] video');
  if (reel && !reduce && 'IntersectionObserver' in window) {
    new IntersectionObserver(([en]) => { if (en.isIntersecting) reel.play().catch(() => {}); else reel.pause(); }, { threshold: 0.4 }).observe(reel);
  }
})();
