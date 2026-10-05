/* SmartphoneKey gym stories: shared behaviour. No form sending, no browser storage, no tracking. */
(() => {
  // The request form is not connected: never submit.
  document.querySelectorAll('form.quick').forEach((f) => f.addEventListener('submit', (e) => e.preventDefault()));
  // The sticky "door check" button steps aside while the form is on screen.
  const dock = document.querySelector('.dock');
  const form = document.getElementById('request');
  if (dock && form && 'IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => dock.classList.toggle('is-away', e.isIntersecting), { threshold: 0.15 }).observe(form);
  }
})();
