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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureFoodLogFirst, { once: true });
  } else {
    ensureFoodLogFirst();
  }
  setTimeout(ensureFoodLogFirst, 0);
  document.body.classList.add('calm-ready');
})();