const root = document.documentElement;
const preference = matchMedia('(prefers-reduced-motion: reduce)');
let paused = preference.matches;
const motionButton = document.querySelector('[data-motion]');
function setMotion(value) {
  paused = value;
  root.dataset.motion = paused ? 'paused' : 'active';
  motionButton.textContent = paused ? 'Resume motion' : 'Pause motion';
  motionButton.setAttribute('aria-pressed', String(paused));
  document.dispatchEvent(new CustomEvent('motionchange', { detail: { paused } }));
  if (paused) document.querySelectorAll('video').forEach(video => video.pause());
}
motionButton.addEventListener('click', () => setMotion(!paused));
preference.addEventListener('change', e => setMotion(e.matches));
setMotion(paused);

const fits = {
  gym: ['01 / GYMS & STUDIOS', 'Let the door fit the day.', 'Start with the entrance, member and staff access, and the times people should be able to enter. Plan access around the way your space works.'],
  building: ['02 / SHARED BUILDINGS', 'One entrance. Many arrivals.', 'Start with the shared entrance and how residents, visitors and building staff use it. A shared entrance and a private unit door need separate checks.'],
  rental: ['03 / SHORT-TERM RENTALS', 'A key for the visit.', 'Start with the guest arrival, the cleaner’s access and the door itself. Give guests and cleaners the access times they need, and manage their keys in one place.'],
  home: ['04 / HOMES', 'A familiar way home.', 'Start with the household, regular guests and the existing lock. A door check confirms whether an electric lock, power or other changes are needed.'],
};
document.querySelectorAll('[data-fit]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-fit]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  const [kicker, title, copy] = fits[button.dataset.fit];
  document.querySelector('[data-fit-kicker]').textContent = kicker;
  document.querySelector('[data-fit-title]').textContent = title;
  document.querySelector('[data-fit-copy]').textContent = copy;
}));

let unlocked = false;
document.querySelectorAll('[data-unlock]').forEach(button => button.addEventListener('click', () => {
  unlocked = !unlocked;
  root.dataset.unlocked = String(unlocked);
  document.querySelectorAll('[data-unlock]').forEach(item => {
    item.setAttribute('aria-pressed', String(unlocked));
    item.textContent = unlocked ? 'Watch again ↻' : 'See the tap ↗';
  });
  document.querySelectorAll('[data-state]').forEach(item => { item.textContent = unlocked ? 'Phone meets reader. Your next arrival begins.' : 'Your phone. Your key. Your door.'; });
  document.dispatchEvent(new CustomEvent('keydemo', { detail: { unlocked } }));
}));

document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('pointermove', e => {
    if (paused || e.pointerType !== 'mouse') return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    card.style.transform = `rotateY(${x * 15}deg) rotateX(${-y * 12}deg) rotateZ(${document.body.dataset.theme === 'glass' ? -5 : 4}deg)`;
  });
  card.addEventListener('pointerleave', () => card.style.removeProperty('transform'));
  document.addEventListener('motionchange', () => card.style.removeProperty('transform'));
});

const filmButton = document.querySelector('[data-film]');
if (filmButton) {
  const video = document.querySelector('video');
  filmButton.addEventListener('click', async () => {
    if (video.paused) {
      try { await video.play(); } catch { filmButton.textContent = 'Film unavailable — try again'; }
    } else video.pause();
  });
  video.addEventListener('play', () => { filmButton.textContent = 'Pause product film Ⅱ'; });
  video.addEventListener('pause', () => { filmButton.textContent = 'Play product film ▶'; });
  video.addEventListener('error', () => { filmButton.textContent = 'Film unavailable — try again'; });
  document.addEventListener('visibilitychange', () => { if (document.hidden) video.pause(); });
  new IntersectionObserver(entries => { if (!entries[0].isIntersecting) video.pause(); }).observe(video);
}

if (document.querySelector('[data-scene]')) {
  import('./scenes.js').then(module => module.startScenes()).catch(() => {
    document.querySelectorAll('.scene-caption').forEach(item => { item.textContent = 'Your phone. Your key. Your door.'; });
  });
}
if (document.querySelector('[data-gradient]')) import('./gradient.js').then(module => module.startGradient()).catch(() => {});
