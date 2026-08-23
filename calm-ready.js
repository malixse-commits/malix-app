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
    }, { once: true });
  } else {
    ensureFoodLogFirst();
    ensureOverviewCards();
  }
  setTimeout(ensureFoodLogFirst, 0);
  setTimeout(wireOverviewCards, 100);
  setTimeout(wireOverviewCards, 500);
  document.body.classList.add('calm-ready');
})();