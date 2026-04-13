/* ================================================================
   BOOMY MARKETING — Shared JavaScript
   Version: 3.0 | 2026-04-14 | ES2022+
   Covers: starfield, navbar, progress bar, hamburger, magnetic
           buttons, GSAP reveals, visibility pause
   Note: body scroll-lock on menu open handled by CSS :has()
================================================================ */

/* ================================================================
   1. STARFIELD CANVAS
================================================================ */
const initStarfield = () => {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;

  // Respect prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d');
  let stars  = [];
  let raf;

  const resize = () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  const createStars = (n = 150) => {
    stars = Array.from({ length: n }, () => ({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      r:  Math.random() * 1.3 + 0.3,
      a:  Math.random() * 0.55 + 0.2,
      sp: Math.random() * 0.22 + 0.04,
      dr: (Math.random() - 0.5) * 0.07,
      td: Math.random() * 0.013 + 0.004,
      ti: Math.random() > 0.5 ? 1 : -1,
    }));
  };

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const s of stars) {
      s.a += s.td * s.ti;
      if (s.a > 0.82 || s.a < 0.1) s.ti *= -1;
      s.y -= s.sp;
      s.x += s.dr;
      if (s.y < -2)               { s.y = canvas.height + 2; s.x = Math.random() * canvas.width; }
      if (s.x < -2)               s.x = canvas.width + 2;
      if (s.x > canvas.width + 2) s.x = -2;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, 6.2832);
      ctx.fillStyle = `rgba(255,255,255,${s.a.toFixed(3)})`;
      ctx.fill();
    }
    raf = requestAnimationFrame(draw);
  };

  // Pause when tab hidden — save CPU/battery
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else raf = requestAnimationFrame(draw);
  });

  window.addEventListener('resize', () => {
    cancelAnimationFrame(raf);
    resize();
    createStars();
    draw();
  }, { passive: true });

  resize();
  createStars();
  draw();
};

/* ================================================================
   2. NAVBAR — glass blur on scroll
================================================================ */
const initNavbar = () => {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
};

/* ================================================================
   3. SCROLL PROGRESS BAR
================================================================ */
const initProgressBar = () => {
  const bar = document.getElementById('progressBar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct   = total > 0 ? (window.scrollY / total) * 100 : 0;
    bar.style.width = `${pct.toFixed(1)}%`;
    bar.setAttribute('aria-valuenow', Math.round(pct));
  }, { passive: true });
};

/* ================================================================
   4. HAMBURGER MENU
================================================================ */
const initHamburger = () => {
  const btn  = document.querySelector('.nav-hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    // Scroll lock handled by CSS: body:has(.mobile-menu.open)
  });

  // Close on nav link click
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on Escape
  document.addEventListener('keydown', ({ key }) => {
    if (key === 'Escape' && menu.classList.contains('open')) {
      menu.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.focus();
    }
  });

  // Close on outside click
  document.addEventListener('click', ({ target }) => {
    if (!menu.contains(target) && !btn.contains(target) && menu.classList.contains('open')) {
      menu.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
};

/* ================================================================
   5. MAGNETIC CTA BUTTONS
================================================================ */
const initMagneticButtons = () => {
  const PULL = 0.34;
  document.querySelectorAll('.magnetic-btn').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r  = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width  / 2)) * PULL;
      const dy = (e.clientY - (r.top  + r.height / 2)) * PULL;
      el.style.transform = `translate(${dx}px,${dy}px) translateY(-2px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
};

/* ================================================================
   6. GSAP SCROLL REVEALS (generic — used on every page)
================================================================ */
const initRevealAnimations = () => {
  if (typeof gsap === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.registerPlugin(ScrollTrigger);

  const revealConfig = (from) => ({
    opacity: 1,
    ...from,
    duration: 0.72,
    ease: 'power2.out',
  });

  gsap.utils.toArray('.reveal').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 38 },
      { ...revealConfig({ y: 0 }),
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
      }
    );
  });

  gsap.utils.toArray('.reveal-left').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, x: -50 },
      { ...revealConfig({ x: 0 }),
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
      }
    );
  });

  gsap.utils.toArray('.reveal-right').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, x: 50 },
      { ...revealConfig({ x: 0 }),
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
      }
    );
  });

  gsap.utils.toArray('.service-card, .team-card, .value-card, .bento-card').forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 42, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: 'power2.out',
        delay: (i % 3) * 0.08,
        scrollTrigger: { trigger: card, start: 'top 91%', toggleActions: 'play none none none' }
      }
    );
  });
};

/* ================================================================
   7. TOAST NOTIFICATIONS
================================================================ */
const showToast = (message, type = 'info') => {
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.textContent = message;

  // Styles injected once
  if (!document.getElementById('toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
      .toast {
        position: fixed; bottom: 24px; right: 24px;
        padding: 14px 24px;
        border-radius: 12px;
        font-weight: 600;
        font-size: 0.9rem;
        z-index: 9999;
        opacity: 0;
        transform: translateY(16px);
        transition: opacity 0.3s ease, transform 0.3s ease;
        max-width: 360px;
      }
      .toast--visible { opacity: 1; transform: translateY(0); }
      .toast--success { background: #22c55e; color: #fff; }
      .toast--error   { background: #ef4444; color: #fff; }
      .toast--info    { background: #3b82f6; color: #fff; }
      @media (max-width: 480px) {
        .toast { left: 16px; right: 16px; max-width: none; }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('toast--visible'));
  setTimeout(() => {
    toast.classList.remove('toast--visible');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
  }, 4000);
};

/* ================================================================
   INIT
================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initStarfield();
  initNavbar();
  initProgressBar();
  initHamburger();
  initMagneticButtons();
});

window.addEventListener('load', initRevealAnimations);

// Expose toast globally for inline handlers
window.showToast = showToast;
