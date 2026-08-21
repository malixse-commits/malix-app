(() => {
  // Den gamla HTML-hemsidan finns kvar som reserv/struktur medan moduler laddas.
  // Visa inte appens huvudyta förrän calm-navigation har byggt den riktiga startsidan.
  function moveFoodLogFirst() {
    const foodToday = document.querySelector('#foodToday');
    const button = foodToday?.querySelector('[data-calm-open="foodLog"]');
    const actionGrid = button?.closest('.choice-grid');
    const subtitle = foodToday?.querySelector('.subtitle');
    if (!foodToday || !actionGrid || !subtitle) return;
    subtitle.insertAdjacentElement('afterend', actionGrid);
    actionGrid.style.margin = '16px 0';
  }

  moveFoodLogFirst();
  document.body.classList.add('calm-ready');
})();