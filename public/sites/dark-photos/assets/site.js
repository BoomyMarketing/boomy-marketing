/*
  SmartphoneKey Toronto & GTA — shared behaviour.
  No network requests, no browser storage of any kind, no tracking.
  Everything here is progressive enhancement: pages work without it.
*/
(() => {
  'use strict';
  const doc = document.documentElement;
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);
  const hasIO = 'IntersectionObserver' in window;

  /* ---------- Menu below 1280px ---------- */
  const header = document.getElementById('site-header');
  const menuToggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('site-menu');
  if (header && menuToggle && menu) {
    const menuLabel = menuToggle.querySelector('.menu-toggle-label');
    const inertTargets = [document.getElementById('main'), document.getElementById('site-footer')];
    const wideNav = window.matchMedia('(min-width: 1280px)');
    const isOpen = () => header.classList.contains('is-open');
    const setMenu = (open, returnFocus) => {
      header.classList.toggle('is-open', open);
      doc.classList.toggle('menu-open', open);
      menuToggle.setAttribute('aria-expanded', String(open));
      if (menuLabel) menuLabel.textContent = open ? 'Close' : 'Menu';
      inertTargets.forEach((el) => { if (el) el.inert = open; });
      if (!open && returnFocus) menuToggle.focus();
    };
    menuToggle.addEventListener('click', () => setMenu(!isOpen(), false));
    menu.addEventListener('click', (event) => {
      if (event.target.closest('a') && isOpen()) setMenu(false, false);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && isOpen()) setMenu(false, true);
    });
    wideNav.addEventListener('change', (event) => {
      if (event.matches && isOpen()) setMenu(false, false);
    });
  }

  /* ---------- SmartphoneKey film ---------- */
  document.querySelectorAll('[data-film]').forEach((figure) => {
    const film = figure.querySelector('video');
    const frame = figure.querySelector('.film-frame');
    const toggle = figure.querySelector('.film-toggle');
    const fallback = figure.querySelector('.film-fallback');
    if (!film || !frame) return;
    let failed = false;
    const fail = () => {
      if (failed) return;
      failed = true;
      if (fallback) fallback.hidden = false;
      if (toggle) toggle.hidden = true;
    };
    film.addEventListener('error', fail);
    const source = film.querySelector('source');
    if (source) source.addEventListener('error', fail);
    if (film.error) fail();
    window.addEventListener('load', () => {
      if (film.readyState === 0 && film.networkState === 3) fail();
    });

    // Only the hero film plays by itself; inline films keep native controls.
    if (figure.dataset.autoplay !== 'true' || !toggle) return;
    let choice = 'auto'; // 'auto' | 'play' | 'pause' — the visitor's explicit choice wins
    let inView = true;
    film.removeAttribute('controls');
    toggle.hidden = false;
    const label = () => { toggle.textContent = film.paused ? 'Play film' : 'Pause film'; };
    const wantsPlay = () => {
      if (failed || document.hidden || !inView) return false;
      if (choice === 'play') return true;
      if (choice === 'pause') return false;
      return !motionQuery.matches && !saveData;
    };
    const update = () => {
      if (wantsPlay()) {
        if (film.paused) {
          const request = film.play();
          if (request) request.catch(label);
        }
      } else if (!film.paused) {
        film.pause();
      }
      label();
    };
    toggle.addEventListener('click', () => {
      choice = film.paused ? 'play' : 'pause';
      update();
    });
    film.addEventListener('play', label);
    film.addEventListener('pause', label);
    document.addEventListener('visibilitychange', update);
    motionQuery.addEventListener('change', update);
    if (hasIO) {
      new IntersectionObserver((entries) => {
        inView = entries[entries.length - 1].isIntersecting;
        update();
      }, { threshold: 0.2 }).observe(frame);
    }
    update();
  });

  /* ---------- Scene story: the moment in the middle of the screen ---------- */
  const story = document.getElementById('story');
  if (story && hasIO) {
    const storyObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const step = entry.target.closest('[data-step]');
        if (step) story.dataset.active = step.dataset.step;
      });
    }, { rootMargin: '-42% 0px -42% 0px' });
    story.querySelectorAll('.story-text').forEach((el) => storyObserver.observe(el));
  }

  /* ---------- Request form: not connected, so it can never submit ---------- */
  const requestForm = document.getElementById('request-form');
  if (requestForm) {
    requestForm.addEventListener('submit', (event) => event.preventDefault());
  }

  /* ---------- Optional guide (homepage): local only ---------- */
  const finder = document.getElementById('finder');
  if (!finder) return;
  const SPACES = {
    gym: {
      heading: 'Worth asking about for a gym or studio',
      features: ['Wallet keys for members and staff', 'Key cards for anyone who would rather not use a phone', 'Guest keys with a start and end time for trials and visitors', 'An activity log of entries at each door'],
      note: 'A ready-made link with membership or billing software is not confirmed. Access is managed in SmartphoneKey’s own admin.',
      page: '/sites/dark-photos/gyms-and-studios/'
    },
    building: {
      heading: 'Worth asking about for a building',
      features: ['QR code visitor calls at the entrance', 'Access added at move-in and removed at move-out', 'Timed keys for movers, trades and deliveries', 'An activity log for shared doors'],
      note: 'A shared entrance is decided by the owner, manager or condo board, not by one resident.',
      page: '/sites/dark-photos/condos-and-buildings/'
    },
    rental: {
      heading: 'Worth asking about for a rental',
      features: ['Guest keys that start and end at the times you set', 'An optional limit on how many times a key works', 'Separate keys for cleaners and trades', 'An activity log of entries'],
      note: 'An automatic link with Airbnb or other booking platforms is not confirmed. You issue each key yourself.',
      page: '/sites/dark-photos/short-term-rentals/'
    },
    home: {
      heading: 'Worth asking about for a home',
      features: ['Wallet keys for your household', 'Timed keys for guests, sitters and trades', 'Key cards for anyone without a suitable phone', 'Google Home and Apple Home through Matter, as SmartphoneKey describes'],
      note: 'In a condo or apartment, your own door and the building’s entrance are separate decisions. Check the building’s rules first.',
      page: '/sites/dark-photos/homes/'
    }
  };
  const DOORS = {
    mechanical: { title: 'Start by adding an electric lock', text: 'Phone access needs an electric strike or magnetic lock, plus low-voltage power and wiring at the door. That work is scoped at the door check.' },
    electric: { title: 'Start by confirming the lock, power and wiring', text: 'The reader’s built-in relay is designed to switch an electric strike or magnetic lock. The door check confirms your lock, power supply and cable route.' },
    fob: { title: 'Start by checking what can stay', text: 'An existing system usually means there is electric locking hardware, but that does not make it compatible. The door check confirms what can stay and what would change.' },
    unsure: { title: 'Start with photos of the door', text: 'That is normal. Photos of both sides of the door, the frame edge and the lock show the team what you have before a visit.' }
  };
  const WIFI = {
    yes: 'Wi-Fi model: it joins your network during setup.',
    no: 'Ask about the LTE model: it uses a SIM card and mobile signal instead of Wi-Fi.',
    unsure: 'Not sure about Wi-Fi at the door? The LTE model uses a SIM card and mobile signal instead.'
  };
  const byId = (id) => document.getElementById(id);
  const out = {
    title: byId('result-title'), door: byId('result-door'), net: byId('result-net'),
    heading: byId('result-heading'), features: byId('result-features'), note: byId('result-note'),
    page: byId('result-page'), status: byId('finder-status')
  };
  const picked = (name, fallback) => {
    const input = finder.querySelector('input[name="' + name + '"]:checked');
    return input ? input.value : fallback;
  };
  const render = (announce) => {
    const space = SPACES[picked('guide-space', 'gym')] || SPACES.gym;
    const door = DOORS[picked('guide-door', 'unsure')] || DOORS.unsure;
    out.title.textContent = door.title;
    out.door.textContent = door.text;
    out.net.textContent = WIFI[picked('guide-wifi', 'unsure')] || WIFI.unsure;
    out.heading.textContent = space.heading;
    out.features.replaceChildren(...space.features.map((text) => {
      const item = document.createElement('li');
      item.textContent = text;
      return item;
    }));
    out.note.textContent = space.note;
    if (out.page) out.page.setAttribute('href', space.page);
    if (announce && out.status) out.status.textContent = 'Starting point updated: ' + door.title + '.';
  };
  finder.addEventListener('change', (event) => {
    if (event.target.matches('input[type="radio"]')) render(true);
  });
  window.addEventListener('pageshow', () => render(false));
  render(false);

  // "Use these answers" copies space and lock into the request form on this page only.
  const resultCta = byId('result-cta');
  const context = byId('request-context');
  if (resultCta && requestForm) {
    resultCta.addEventListener('click', () => {
      const spaceSelect = requestForm.elements.namedItem('space');
      const lockSelect = requestForm.elements.namedItem('lock');
      if (spaceSelect) spaceSelect.value = picked('guide-space', '');
      if (lockSelect) lockSelect.value = picked('guide-door', '');
      if (context) {
        const spaceText = spaceSelect && spaceSelect.selectedOptions[0] ? spaceSelect.selectedOptions[0].textContent : '';
        const lockText = lockSelect && lockSelect.selectedOptions[0] ? lockSelect.selectedOptions[0].textContent : '';
        context.textContent = 'Filled in from your answers above: ' + spaceText + ' · ' + lockText + '. Change anything that’s off.';
        context.hidden = false;
      }
    });
  }

  /* ---------- Live reader demo (home): local only, nothing sent or kept ---------- */
  const tryStage = document.querySelector('.try-stage');
  if (tryStage) {
    const statusEl = tryStage.querySelector('.try-status');
    const logEl = tryStage.querySelector('.try-log');
    const people = ['Maya R.', 'Sam T.', 'Priya K.', 'Jon L.', 'Ana M.'];
    let turn = 0;
    let timer = 0;
    const clock = () => {
      const now = new Date();
      return String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
    };
    const addLog = (who, door, result) => {
      const item = document.createElement('li');
      const time = document.createElement('time');
      time.textContent = clock();
      const strong = document.createElement('b');
      strong.textContent = result;
      item.append(time, ' ' + who + ' · ' + door + ' · ', strong);
      logEl.prepend(item);
      while (logEl.children.length > 4) logEl.lastElementChild.remove();
    };
    document.querySelectorAll('[data-try]').forEach((button) => {
      button.addEventListener('click', () => {
        clearTimeout(timer);
        const ok = button.dataset.try === 'ok';
        const delay = motionQuery.matches ? 0 : 650;
        tryStage.dataset.state = 'reading';
        statusEl.textContent = 'Reading the key…';
        timer = setTimeout(() => {
          if (ok) {
            const who = people[turn++ % people.length];
            tryStage.dataset.state = 'granted';
            statusEl.textContent = 'Access granted. ' + who + ', front door.';
            addLog(who, 'Front door', 'opened');
          } else {
            tryStage.dataset.state = 'denied';
            statusEl.textContent = 'Not opened. This guest key ended on Sunday at 11:00.';
            addLog('Guest key', 'Front door', 'refused, key ended');
          }
          timer = setTimeout(() => {
            tryStage.dataset.state = 'idle';
            statusEl.textContent = 'Waiting for a phone.';
          }, 3200);
        }, delay);
      });
    });
  }
})();
