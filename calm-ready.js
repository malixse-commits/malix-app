(() => {
  // Den gamla HTML-hemsidan finns kvar som reserv/struktur medan moduler laddas.
  // free-plus-preview.js laddar nu kärnmodulerna innan denna fil körs.
  function moveFoodLogFirst() {
    const foodToday = document.querySelector('#foodToday');
    const button = foodToday?.querySelector('[data-calm-open="foodLog"]');
    const actionGrid = button?.closest('.choice-grid');
    const subtitle = foodToday?.querySelector('.subtitle');
    if (!foodToday || !actionGrid || !subtitle) return false;
    subtitle.insertAdjacentElement('afterend', actionGrid);
    actionGrid.style.margin = '16px 0';
    return true;
  }

  function ensureFoodLogFirst() {
    if (moveFoodLogFirst()) return;
    let tries = 0;
    const timer = setInterval(() => {
      tries += 1;
      if (moveFoodLogFirst() || tries >= 20) clearInterval(timer);
    }, 50);
  }

  function openHome() {
    document.querySelectorAll('main > .view').forEach(v => v.classList.remove('active-view'));
    const home = document.querySelector('main > #home') || document.querySelector('#home');
    if (home) {
      home.classList.add('active-view');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Endast den särskilda Hem-markören hanteras här.
  // data-calm-open och data-nav-back ägs av calm-navigation.js.
  if (document.documentElement.dataset.calmHomeWired !== '1') {
    document.documentElement.dataset.calmHomeWired = '1';
    document.addEventListener('click', event => {
      const button = event.target.closest('[data-calm-home]');
      if (!button) return;
      event.preventDefault();
      event.stopPropagation();
      openHome();
    }, true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureFoodLogFirst, { once: true });
  } else {
    ensureFoodLogFirst();
  }
  setTimeout(ensureFoodLogFirst, 0);

  document.body.classList.add('calm-ready');
})();