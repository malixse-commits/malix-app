(() => {
  // Den gamla HTML-hemsidan finns kvar som reserv/struktur medan moduler laddas.
  // Visa inte appens huvudyta förrän calm-navigation har byggt den riktiga startsidan.
  document.body.classList.add('calm-ready');
})();