/* SmartphoneKey Toronto · Signal. No network requests, no browser storage, no tracking. */
(() => {
  'use strict';
  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motion = !reduce.matches;
  root.classList.add('js');
  if (motion) root.classList.add('motion');
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
  const vh = () => window.innerHeight;

  // ---------- Colour scheme: this page view only, never stored ----------
  const toneButtons = [...document.querySelectorAll('.tone [data-tone]')];
  const tone = (name) => {
    root.dataset.theme = name;
    toneButtons.forEach((b) => b.setAttribute('aria-checked', String(b.dataset.tone === name)));
    window.dispatchEvent(new CustomEvent('tone'));
  };
  toneButtons.forEach((b, i) => {
    b.addEventListener('click', () => tone(b.dataset.tone));
    b.addEventListener('keydown', (e) => {
      if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) return;
      e.preventDefault();
      const next = toneButtons[(i + (e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : toneButtons.length - 1)) % toneButtons.length];
      next.focus();
      tone(next.dataset.tone);
    });
    b.tabIndex = b.getAttribute('aria-checked') === 'true' ? 0 : -1;
  });
  window.addEventListener('tone', () => toneButtons.forEach((b) => { b.tabIndex = b.getAttribute('aria-checked') === 'true' ? 0 : -1; }));

  // ---------- The request form is not connected: never submit, never clear, never show success ----------
  const form = document.getElementById('request');
  if (form) form.addEventListener('submit', (event) => event.preventDefault());

  // ---------- Menu ----------
  const burger = document.querySelector('.burger');
  const dropBtn = document.querySelector('.nav-drop');
  const group = dropBtn && dropBtn.closest('.nav-group');
  const setMenu = (open) => { root.classList.toggle('menu-open', open); if (burger) burger.setAttribute('aria-expanded', String(open)); };
  if (burger) burger.addEventListener('click', () => setMenu(!root.classList.contains('menu-open')));
  const setDrop = (open) => { group.classList.toggle('is-open', open); dropBtn.setAttribute('aria-expanded', String(open)); };
  if (dropBtn) {
    dropBtn.addEventListener('click', (e) => { e.stopPropagation(); setDrop(!group.classList.contains('is-open')); });
    document.addEventListener('click', (e) => { if (!group.contains(e.target)) setDrop(false); });
  }
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { setMenu(false); if (group) setDrop(false); } });
  document.querySelectorAll('.nav a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

  const bar = document.querySelector('.bar');
  const onBar = () => bar.classList.toggle('solid', window.scrollY > 24);
  onBar();
  window.addEventListener('scroll', onBar, { passive: true });

  // ---------- Count-up numbers (true figures only; the final value is already in the HTML) ----------
  const nums = [...document.querySelectorAll('.num')];
  const countUp = (el) => {
    const n = el.querySelector('[data-count]');
    if (!n || !motion) return;
    const end = Number(n.dataset.count);
    const t0 = performance.now();
    const step = (t) => {
      const k = clamp((t - t0) / 1100);
      n.textContent = String(Math.round(end * (1 - Math.pow(1 - k, 3))));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  // ---------- Reveal on arrival ----------
  if (motion && 'IntersectionObserver' in window) {
    document.querySelectorAll('.sec .eyebrow, .sec-title, .sec-lede, .steps li, .pass, .ftile, .checks li, .qa details, .door-list li, .fit-col, .log-panel, .visit-photo, .cmp-wrap, .facts li, .brief-answer')
      .forEach((el) => el.classList.add('rv'));
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      if (e.target.classList.contains('num')) countUp(e.target);
      io.unobserve(e.target);
    }), { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.rv').forEach((el) => io.observe(el));
    nums.forEach((el) => io.observe(el));
  } else nums.forEach((el) => el.classList.add('in'));

  // ---------- Pass tilt toward the pointer ----------
  if (motion && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.pass').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--ry', ((e.clientX - r.left) / r.width - 0.5) * 12 + 'deg');
        card.style.setProperty('--rx', (0.5 - (e.clientY - r.top) / r.height) * 10 + 'deg');
      });
      card.addEventListener('pointerleave', () => { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); });
    });
  }

  // ---------- Film: play only while visible and only when motion is welcome ----------
  const film = document.querySelector('[data-film] video');
  if (film && motion && 'IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => { if (e.isIntersecting) film.play().catch(() => {}); else film.pause(); }, { threshold: 0.4 }).observe(film);
  }

  // ---------- Scenes: chip lights when the photo fills the screen ----------
  const scenes = [...document.querySelectorAll('[data-scene]')];
  if ('IntersectionObserver' in window) {
    const so = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('lit'); }), { threshold: 0.45 });
    scenes.forEach((s) => so.observe(s));
  } else scenes.forEach((s) => s.classList.add('lit'));

  // ---------- Key builder and door simulator: an example in the browser only, nothing is created or sent ----------
  const tool = document.querySelector('[data-tool]');
  if (tool) {
    const PRESETS = { cleaner: ['guest', '11:30', '15:00', '0'], walker: ['guest', '12:00', '13:00', '0'], plumber: ['once', '09:00', '17:00', '1'], guest: ['guest', '16:00', '11:00', '0'], family: ['wallet', '00:00', '23:45', '0'] };
    const NAMES = { cleaner: 'Cleaner', walker: 'Dog walker', plumber: 'Plumber', guest: 'Weekend guest', family: 'Family member' };
    const KIND = { guest: ['Guest key', ' pass--guest'], once: ['One-use key', ' pass--once'], wallet: ['Wallet key', ''], card: ['Key card', ' pass--card'] };
    const $ = (s) => tool.querySelector(s);
    const val = (name) => (tool.querySelector(`[name="${name}"]:checked`) || tool.querySelector(`[name="${name}"]`)).value;
    const mins = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
    const hhmm = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
    const sim = $('.sim');
    const statusEl = $('.sim-status');
    const log = $('[data-out="log"]');
    let opens = 0;
    let removed = false;
    const reset = () => { opens = 0; removed = false; sim.dataset.state = 'idle'; statusEl.textContent = 'Tap the phone to try the door.'; };
    const render = () => {
      const kind = val('tool-kind');
      const [label, cls] = KIND[kind];
      const from = $('[name="tool-from"]').value || '00:00';
      const to = $('[name="tool-to"]').value || '23:45';
      const limit = Number($('[name="tool-limit"]').value);
      $('.tool-window').disabled = kind !== 'guest';
      const passEl = $('.tool-pass');
      passEl.className = `pass tool-pass${cls}`;
      $('[data-out="kind"]').textContent = label;
      $('[data-out="who"]').textContent = NAMES[val('tool-who')];
      $('[data-out="rule"]').textContent = kind === 'guest'
        ? `${from} → ${to}${mins(to) <= mins(from) ? ' next day' : ''}${limit ? ` · opens ${limit === 1 ? 'once' : `${limit} times`}` : ''}`
        : kind === 'once' ? 'Opens once, then it’s spent' : 'Works until you remove it';
    };
    const clock = () => { const t = Number($('[name="tool-time"]').value); $('[name="tool-clock"]').value = hhmm(t); return t; };
    tool.querySelectorAll('[name="tool-who"]').forEach((r) => r.addEventListener('change', () => {
      const [kind, from, to, limit] = PRESETS[r.value];
      tool.querySelector(`[name="tool-kind"][value="${kind}"]`).checked = true;
      $('[name="tool-from"]').value = from; $('[name="tool-to"]').value = to; $('[name="tool-limit"]').value = limit;
      reset(); render();
    }));
    tool.querySelectorAll('[name="tool-kind"], [name="tool-from"], [name="tool-to"], [name="tool-limit"]').forEach((el) => el.addEventListener('change', () => { reset(); render(); }));
    $('[name="tool-time"]').addEventListener('input', clock);
    const addLog = (t, result, ok) => {
      const empty = log.querySelector('.sim-empty');
      if (empty) empty.remove();
      const tr = document.createElement('tr');
      [hhmm(t), NAMES[val('tool-who')], KIND[val('tool-kind')][0], result].forEach((text, i) => { const td = document.createElement('td'); td.textContent = text; if (i === 3) td.className = ok ? 'ok' : 'no'; tr.append(td); });
      log.prepend(tr);
      while (log.children.length > 6) log.lastElementChild.remove();
    };
    tool.querySelector('[data-act="tap"]').addEventListener('click', () => {
      const t = clock();
      const kind = val('tool-kind');
      let ok = true; let why = '';
      if (removed) { ok = false; why = 'Key removed'; }
      else if (kind === 'once' && opens >= 1) { ok = false; why = 'Already spent'; }
      else if (kind === 'guest') {
        const a = mins($('[name="tool-from"]').value || '00:00'); const b = mins($('[name="tool-to"]').value || '23:45');
        const limit = Number($('[name="tool-limit"]').value);
        const inWindow = b > a ? t >= a && t < b : t >= a || t < b;
        if (!inWindow) { ok = false; why = `Outside ${hhmm(a)}–${hhmm(b)}`; }
        else if (limit && opens >= limit) { ok = false; why = 'Opening limit reached'; }
      }
      if (ok) opens++;
      const result = ok ? (kind === 'once' ? 'Opened, spent' : 'Opened') : `Refused · ${why}`;
      sim.dataset.state = ok ? 'open' : 'refused';
      statusEl.textContent = ok ? `Opened at ${hhmm(t)}.` : `Refused at ${hhmm(t)}: ${why.toLowerCase()}.`;
      addLog(t, result, ok);
    });
    tool.querySelector('[data-act="remove"]').addEventListener('click', () => {
      removed = true;
      sim.dataset.state = 'idle';
      statusEl.textContent = 'Key removed. It no longer opens the door.';
      addLog(clock(), 'Key removed', false);
    });
    render(); clock();
  }

  if (!motion) return;

  // ---------- Depth: photos settle as they arrive (wide screens only; phones keep the full frame) ----------
  const wide = window.matchMedia('(min-width: 1024px)');
  const depthTargets = [...document.querySelectorAll('.scene-photo img, .hero-photo img')];
  const depth = () => {
    if (!wide.matches) return;
    const h = vh();
    depthTargets.forEach((img) => {
      const box = img.closest('.scene, .hero');
      const r = box.getBoundingClientRect();
      if (r.bottom < -h || r.top > h * 2) return;
      const k = box.classList.contains('hero') ? clamp(-r.top / h) : clamp(1 - r.top / h);
      img.style.setProperty('--z', box.classList.contains('hero') ? (1 + 0.08 * k).toFixed(4) : (1.14 - 0.14 * k).toFixed(4));
    });
  };

  // ---------- The door, then a frame-sequence scrub through the reader ----------
  // Timeline over the pinned run (p 0 → 1): tap → granted → the door opens → the camera walks through the doorway
  // → one continuous shot of the product film scrubs frame by frame (scroll up rewinds it).
  const track = document.querySelector('[data-door]');
  const stage = track && track.querySelector('.stage');
  const copy = document.querySelector('.th-copy');
  const wall = stage && stage.querySelector('.wall');
  const doorset = stage && stage.querySelector('.doorset');
  const beats = stage ? [...stage.querySelectorAll('.beats li')] : [];
  const rail = stage ? [...stage.querySelectorAll('.rail li')] : [];
  const hudStatus = stage && stage.querySelector('.hud-status');
  const hudFrame = stage && stage.querySelector('.hud-frame');
  const hudHint = stage && stage.querySelector('.hud-hint');
  const RUN = 3.6;
  let tilt = { x: 0, y: 0 };
  let geo = null;

  // Frames: phone or desktop set, frame 1 first, then a coarse pass, then the rest; draw the nearest loaded frame.
  const filmCanvas = stage && stage.querySelector('.inside-film');
  const still = stage && stage.querySelector('.inside-still');
  const frames = [];
  let frameCount = 0;
  let loaded = 0;
  let lastDrawn = '';
  const loadFrames = () => {
    if (!filmCanvas) return;
    frameCount = Number(filmCanvas.dataset.frameCount) || 0;
    const phone = window.innerWidth < 720;
    const src = phone ? still.querySelector('source').getAttribute('srcset') : still.querySelector('img').getAttribute('src');
    const base = src.replace(/f001\.webp$/, '');
    const order = [0];
    for (let step of [24, 8, 2, 1]) for (let i = 0; i < frameCount; i += step) if (!order.includes(i)) order.push(i);
    let next = 0;
    const pump = () => {
      if (next >= order.length) return;
      const i = order[next++];
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => { frames[i] = img; loaded++; if (i === 0) { stage.querySelector('.inside').classList.add('has-film'); } queue(); pump(); };
      img.onerror = () => { loaded++; pump(); };
      img.src = `${base}f${String(i + 1).padStart(3, '0')}.webp`;
    };
    for (let k = 0; k < 4; k++) pump();
  };
  const nearest = (i) => {
    for (let d = 0; d < frameCount; d++) {
      if (frames[i - d]) return frames[i - d];
      if (frames[i + d]) return frames[i + d];
    }
    return null;
  };
  const sizeFilm = () => {
    if (!filmCanvas) return;
    const dpr = Math.min(1.5, window.devicePixelRatio || 1);
    filmCanvas.width = Math.round(filmCanvas.clientWidth * dpr);
    filmCanvas.height = Math.round(filmCanvas.clientHeight * dpr);
    lastDrawn = '';
  };
  // zoom 0 → the frame sits inside the doorway; 1 → it covers the whole stage
  const drawFrame = (index, zoom, ox, oy) => {
    if (!filmCanvas || !filmCanvas.width) return;
    const img = nearest(index);
    if (!img) return;
    const key = `${img.src}|${zoom.toFixed(3)}|${ox.toFixed(1)}|${oy.toFixed(1)}`;
    if (key === lastDrawn) return;
    lastDrawn = key;
    const ctx = filmCanvas.getContext('2d');
    const W = filmCanvas.width; const H = filmCanvas.height;
    const dpr = W / filmCanvas.clientWidth;
    const cover = Math.max(W / img.naturalWidth, H / img.naturalHeight);
    const inDoor = (geo.dh * dpr * 0.72) / img.naturalHeight;
    const s = inDoor + (cover - inDoor) * zoom;
    const w = img.naturalWidth * s; const h = img.naturalHeight * s;
    ctx.fillStyle = '#050607';
    ctx.fillRect(0, 0, W, H);
    ctx.drawImage(img, (W - w) / 2 + ox * dpr, (H - h) / 2 + oy * dpr, w, h);
  };

  const measure = () => {
    if (!track) return;
    const h = vh();
    const copyH = copy.offsetHeight;
    const start = Math.max(0, copyH - h * 0.55);
    track.style.height = `${Math.round(start + h * RUN + h)}px`;
    geo = { start, run: h * RUN, W: stage.clientWidth, H: stage.clientHeight, cx: doorset.offsetLeft + doorset.offsetWidth / 2, cy: doorset.offsetTop + doorset.offsetHeight / 2, dw: doorset.offsetWidth, dh: doorset.offsetHeight };
    sizeFilm();
  };
  const STATUS = [[0, 'Reader · locked'], [0.09, 'Reading the key…'], [0.1, 'Granted · lock released'], [0.3, 'Door open · stepping inside']];
  const door = () => {
    if (!geo) return;
    const scrolled = -track.getBoundingClientRect().top;
    const p = clamp((scrolled - geo.start) / geo.run);
    const tap = smooth(0, 0.08, p);
    const lit = p > 0.09;
    const open = smooth(0.1, 0.28, p) * 98;
    const k = smooth(0.26, 0.48, p);
    stage.style.setProperty('--tap', tap.toFixed(3));
    stage.style.setProperty('--ghost', (tap * (1 - smooth(0.1, 0.16, p))).toFixed(3));
    stage.style.setProperty('--lit', lit ? '1' : '0');
    stage.classList.toggle('is-lit', lit);
    stage.style.setProperty('--open', open.toFixed(2));
    stage.style.setProperty('--dolly', k.toFixed(4));
    stage.style.setProperty('--rail', p > 0.005 && p < 0.995 ? '1' : '0');
    const S = Math.max(geo.W / geo.dw, geo.H / geo.dh) * 1.12;
    const s = 1 + (S - 1) * Math.pow(k, 2.2);
    // the doorway drifts to the centre while the door opens, then the camera walks through it
    const c = Math.max(k, smooth(0, 0.3, p));
    const tx = (geo.W / 2 - geo.cx) * c;
    const ty = (geo.H / 2 - geo.cy) * c;
    const free = 1 - k;
    wall.style.transformOrigin = `${geo.cx}px ${geo.cy}px`;
    wall.style.transform = `rotateY(${(tilt.x * 5 * free).toFixed(2)}deg) rotateX(${(-tilt.y * 3 * free).toFixed(2)}deg) translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) scale(${s.toFixed(4)})`;
    wall.style.opacity = String(1 - smooth(0.44, 0.5, p));
    // frame index: the shell gets 45% of the scrub, the circuit board (the reveal) gets the longer 55%
    const q = clamp((p - 0.48) / 0.52);
    const fi = Math.round(q < 0.45 ? (q / 0.45) * 115 : 115 + ((q - 0.45) / 0.55) * (frameCount - 1 - 115));
    const index = clamp(fi, 0, Math.max(0, frameCount - 1));
    drawFrame(index, k, (geo.cx + tx - geo.W / 2), (geo.cy + ty - geo.H / 2));
    // copy and readouts follow what is on screen in the footage
    const beat = p <= 0.01 ? -1 : p < 0.1 ? 0 : p < 0.26 ? 1 : p < 0.48 ? 2 : index < 118 ? 3 : 4;
    beats.forEach((b, i) => b.classList.toggle('on', i === beat));
    const chapter = p < 0.1 ? 0 : p < 0.48 ? 1 : 2;
    rail.forEach((r, i) => r.classList.toggle('on', i === chapter));
    let status = STATUS.filter(([at]) => p >= at).pop()[1];
    if (p >= 0.48) status = index < 40 ? 'Reader · outer shell' : index < 118 ? 'Reader · front panel' : 'Inside · circuit board';
    if (hudStatus.textContent !== status) hudStatus.textContent = status;
    hudStatus.classList.toggle('go', lit);
    const loading = loaded < frameCount ? ` · loading ${Math.round((loaded / Math.max(1, frameCount)) * 100)}%` : '';
    hudFrame.textContent = `Frame ${String(index + 1).padStart(3, '0')} / ${frameCount}${loading}`;
    hudHint.classList.toggle('on', q > 0.6);
  };
  if (filmCanvas) loadFrames();
  if (track && window.matchMedia('(hover: hover)').matches) {
    stage.addEventListener('pointermove', (e) => { tilt = { x: e.clientX / window.innerWidth - 0.5, y: e.clientY / vh() - 0.5 }; queue(); });
    stage.addEventListener('pointerleave', () => { tilt = { x: 0, y: 0 }; queue(); });
  }

  // ---------- Particles: drift → a key on a phone → a Wallet pass ----------
  const pTrack = document.querySelector('[data-particles]');
  const canvas = pTrack && pTrack.querySelector('canvas');
  const kfBeats = pTrack ? [...pTrack.querySelectorAll('[data-kf]')] : [];
  let field = null;
  let visible = false;
  let raf = 0;
  const mouse = { x: -9999, y: -9999 };
  const sample = (draw, W, H, n) => {
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const g = c.getContext('2d');
    g.fillStyle = '#fff'; g.strokeStyle = '#fff';
    draw(g);
    const data = g.getImageData(0, 0, W, H).data;
    const pts = [];
    const step = Math.max(3, Math.round(Math.sqrt((W * H) / 26000)));
    for (let y = 0; y < H; y += step) for (let x = 0; x < W; x += step) if (data[(y * W + x) * 4 + 3] > 128) pts.push([x, y]);
    for (let i = pts.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pts[i], pts[j]] = [pts[j], pts[i]]; }
    const out = [];
    for (let i = 0; i < n; i++) out.push(pts[i % Math.max(1, pts.length)] || [W / 2, H / 2]);
    return out;
  };
  const rr = (g, x, y, w, h, r) => { g.beginPath(); g.roundRect(x, y, w, h, r); };
  const buildField = () => {
    if (!canvas) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = canvas.clientWidth; const H = canvas.clientHeight;
    if (!W || !H) return;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    const narrow = W < 720;
    const cx = narrow ? W / 2 : W * 0.68;
    const cy = narrow ? H * 0.7 : H * 0.52;
    const u = narrow ? Math.min(H * 0.36, W * 0.8) : Math.min(H * 0.62, W * 0.42);
    const n = narrow ? 520 : 1000;
    const pw = u * 0.42; const ph = u * 0.86;
    const keyShape = sample((g) => {
      g.lineWidth = Math.max(2, u * 0.012);
      rr(g, cx - pw / 2, cy - ph / 2, pw, ph, pw * 0.16); g.stroke();
      g.beginPath(); g.moveTo(cx - pw * 0.14, cy - ph / 2 + ph * 0.035); g.lineTo(cx + pw * 0.14, cy - ph / 2 + ph * 0.035); g.stroke();
      const kr = pw * 0.17; const ky = cy - ph * 0.14;
      g.lineWidth = Math.max(3, u * 0.03);
      g.beginPath(); g.arc(cx, ky, kr, 0, Math.PI * 2); g.stroke();
      g.beginPath(); g.moveTo(cx, ky + kr); g.lineTo(cx, cy + ph * 0.26); g.stroke();
      g.beginPath(); g.moveTo(cx, cy + ph * 0.1); g.lineTo(cx + pw * 0.14, cy + ph * 0.1); g.moveTo(cx, cy + ph * 0.2); g.lineTo(cx + pw * 0.1, cy + ph * 0.2); g.stroke();
    }, W, H, n);
    const cw = u * 0.62; const ch = u * 0.8;
    const passShape = sample((g) => {
      g.lineWidth = Math.max(2, u * 0.012);
      rr(g, cx - cw / 2, cy - ch / 2, cw, ch, cw * 0.07); g.stroke();
      g.fillRect(cx - cw / 2, cy - ch / 2, cw, ch * 0.05);
      g.font = `800 ${Math.round(cw * 0.2)}px system-ui, sans-serif`; g.textBaseline = 'top';
      g.fillText('KEY', cx - cw / 2 + cw * 0.1, cy - ch / 2 + ch * 0.14);
      g.fillRect(cx - cw / 2 + cw * 0.1, cy - ch / 2 + ch * 0.42, cw * 0.5, Math.max(2, ch * 0.022));
      g.fillRect(cx - cw / 2 + cw * 0.1, cy - ch / 2 + ch * 0.5, cw * 0.34, Math.max(2, ch * 0.022));
      const q = cw * 0.3; const qx = cx + cw / 2 - cw * 0.1 - q; const qy = cy + ch / 2 - ch * 0.08 - q; const cell = q / 5;
      for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) if ((i * 7 + j * 3 + i * j) % 3 !== 1 || (i % 4 === 0 && j % 4 === 0)) g.fillRect(qx + i * cell, qy + j * cell, cell * 0.86, cell * 0.86);
    }, W, H, n);
    const parts = [];
    for (let i = 0; i < n; i++) {
      parts.push({ hx: Math.random() * W, hy: Math.random() * H, k: keyShape[i], p: passShape[i], ph: Math.random() * Math.PI * 2, sp: 0.4 + Math.random() * 0.8, ox: 0, oy: 0, s: Math.random() < 0.12 ? 2.2 : 1.3 });
    }
    field = { W, H, dpr, parts, ctx: canvas.getContext('2d') };
  };
  let colour = '#9ff0c0';
  const readColour = () => { colour = getComputedStyle(root).getPropertyValue('--particle').trim() || colour; };
  const drawField = (t) => {
    raf = 0;
    if (!field || !visible) return;
    const { W, H, dpr, parts, ctx } = field;
    const r = pTrack.getBoundingClientRect();
    const p = clamp(-r.top / (r.height - vh()));
    const a = smooth(0.1, 0.4, p);
    const b = smooth(0.58, 0.86, p);
    const beat = p < 0.25 ? 0 : p < 0.66 ? 1 : 2;
    kfBeats.forEach((li, i) => li.classList.toggle('on', i === beat));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = colour;
    const time = t / 1000;
    const formed = Math.max(a, b);
    for (const q of parts) {
      const dx = q.hx + Math.sin(time * q.sp + q.ph) * 26;
      const dy = q.hy + Math.cos(time * q.sp * 0.8 + q.ph) * 20;
      let x = dx + (q.k[0] - dx) * a;
      let y = dy + (q.k[1] - dy) * a;
      x += (q.p[0] - x) * b;
      y += (q.p[1] - y) * b;
      x += Math.sin(time * 2 + q.ph) * 0.8 * formed;
      y += Math.cos(time * 2 + q.ph) * 0.8 * formed;
      const mx = x + q.ox - mouse.x; const my = y + q.oy - mouse.y;
      const d2 = mx * mx + my * my;
      if (d2 < 8100) { const d = Math.sqrt(d2) || 1; const f = (90 - d) / 90; q.ox += (mx / d) * f * 6; q.oy += (my / d) * f * 6; }
      q.ox *= 0.9; q.oy *= 0.9;
      ctx.globalAlpha = 0.35 + 0.6 * formed * (q.s > 2 ? 1 : 0.8);
      ctx.fillRect(x + q.ox, y + q.oy, q.s, q.s);
    }
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(drawField);
  };
  const startField = () => { if (!raf && visible) raf = requestAnimationFrame(drawField); };
  if (canvas && 'IntersectionObserver' in window) {
    readColour();
    window.addEventListener('tone', readColour);
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) { if (!field) buildField(); startField(); } else if (raf) { cancelAnimationFrame(raf); raf = 0; } }).observe(pTrack);
    canvas.parentElement.addEventListener('pointermove', (e) => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
    canvas.parentElement.addEventListener('pointerleave', () => { mouse.x = -9999; mouse.y = -9999; });
  }

  // ---------- One scroll loop ----------
  let queued = false;
  const frame = () => { queued = false; door(); depth(); };
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(frame); } };
  window.addEventListener('scroll', queue, { passive: true });
  let lastW = window.innerWidth;
  let lastH = window.innerHeight;
  window.addEventListener('resize', () => {
    if (Math.abs(window.innerHeight - lastH) > 150 || window.innerWidth !== lastW) { lastH = window.innerHeight; measure(); }
    queue();
    if (canvas && Math.abs(window.innerWidth - lastW) > 40) { lastW = window.innerWidth; field = null; if (visible) buildField(); }
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { measure(); queue(); });
  measure();
  frame();

  // ?solo=door:0.6 or ?solo=particles:0.5 pins a chapter at that point, for screenshots and reviews.
  const solo = /^(door|particles):(0(?:\.\d+)?|1(?:\.0+)?)$/.exec(new URLSearchParams(location.search).get('solo') || '');
  if (solo) {
    const at = Number(solo[2]);
    const go = () => {
      let y;
      if (solo[1] === 'door' && geo) y = track.getBoundingClientRect().top + window.scrollY + geo.start + geo.run * at;
      else if (pTrack) y = pTrack.getBoundingClientRect().top + window.scrollY + (pTrack.offsetHeight - vh()) * at;
      if (y !== undefined) window.scrollTo(0, Math.round(y));
    };
    go();
    window.addEventListener('load', go);
  }
})();
