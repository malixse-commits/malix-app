(() => {
  // Den gamla HTML-hemsidan finns kvar som reserv/struktur medan moduler laddas.
  // Visa inte appens huvudyta förrän calm-navigation har byggt den riktiga startsidan.
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

  function openOverviewTarget(id) {
    if (id === 'careHub' && typeof window.malixOpenCare === 'function') {
      window.malixOpenCare();
      return;
    }
    document.querySelectorAll('main > .view').forEach(v => v.classList.remove('active-view'));
    const target = document.querySelector(`main > #${id}`);
    if (target) {
      target.classList.add('active-view');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function openHome() {
    document.querySelectorAll('main > .view').forEach(v => v.classList.remove('active-view'));
    const home = document.querySelector('main > #home') || document.querySelector('#home');
    if (home) {
      home.classList.add('active-view');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function wireAllHomeButtons() {
    if (document.documentElement.dataset.homeNavigationWired === '1') return;
    document.documentElement.dataset.homeNavigationWired = '1';
    document.addEventListener('click', event => {
      const button = event.target.closest('button.back, a.back, [data-calm-home], [data-nav-back="home"]');
      if (!button) return;
      const label = String(button.textContent || '').replace(/\s+/g, ' ').trim();
      const isHome = button.hasAttribute('data-calm-home') || button.getAttribute('data-nav-back') === 'home' || label === '← Hem' || label === 'Hem';
      if (!isHome) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      openHome();
    }, true);
  }

  function wireOverviewCards() {
    const grid = document.querySelector('#homeOverviewGrid');
    if (!grid) return false;
    const cards = [...grid.querySelectorAll('[data-calm-open]')];
    if (!cards.length) return false;
    cards.forEach(card => {
      if (card.dataset.overviewDirect === '1') return;
      card.dataset.overviewDirect = '1';
      card.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        openOverviewTarget(card.dataset.calmOpen);
      });
    });
    return true;
  }

  function ensureOverviewCards() {
    wireOverviewCards();
    const observer = new MutationObserver(() => wireOverviewCards());
    const overview = document.querySelector('#dailyOverview') || document.querySelector('main');
    if (overview) observer.observe(overview, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      ensureFoodLogFirst();
      ensureOverviewCards();
      wireAllHomeButtons();
    }, { once: true });
  } else {
    ensureFoodLogFirst();
    ensureOverviewCards();
    wireAllHomeButtons();
  }
  setTimeout(ensureFoodLogFirst, 0);
  setTimeout(wireOverviewCards, 100);
  setTimeout(wireOverviewCards, 500);
  wireAllHomeButtons();
  document.body.classList.add('calm-ready');
})();