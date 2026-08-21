(() => {
  const loaded = new Set(Array.from(document.scripts).map(s => s.getAttribute('src')).filter(Boolean));

  function loadScript(src) {
    if (loaded.has(src) || document.querySelector(`script[data-malix-module="${src}"]`)) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.dataset.malixModule = src;
      script.onload = () => { loaded.add(src); resolve(); };
      script.onerror = () => reject(new Error(`Kunde inte ladda ${src}`));
      document.body.appendChild(script);
    });
  }

  async function loadGroup(files) {
    for (const src of files) await loadScript(src);
  }

  async function start() {
    // Första sidan ska bli användbar direkt. Navigationen får därför alltid
    // gå före molnsynk, PLUS-funktioner och andra tyngre undermoduler.
    await loadScript('calm-navigation.js');
    await loadScript('calm-ready.js');
    document.body.classList.add('calm-ready');

    // Grundfunktioner som behövs i vardagen laddas därefter.
    await loadGroup([
      'movement-recovery.js','cleaning-room-data.js','cleaning-square.js',
      'cleaning-reflection-history-edit.js','cleaning-flex-log.js','diary-history.js',
      'cleaning-tips.js','self-care.js','presence-care.js','presence-done.js',
      'sleep-care.js','my-time-mobile.js','my-day-summary.js','inner-compass.js'
    ]);

    // Matens tillägg laddas efter att startsidan redan är synlig och klickbar.
    // Receptöppningen lämnas medvetet till app.js, samma grundlösning som i
    // den tidigare fungerande food-v1-versionen. Ingen senare modul får
    // skriva över openRecipe().
    await loadGroup([
      'recipes-malix.js','desserts-malix.js','recipe-category-dessert.js',
      'food-preferences.js','meal-log-polish.js',
      'breakfast-buffet.js','takeaway-meals.js','ready-made-foods.js',
      'evening-meal-mirror.js','food-day-lock.js'
    ]);

    // PLUS-köket är inte startkritiskt.
    await loadGroup([
      'smart-kitchen.js','fridge-check-routine.js','meal-kitchen-sync.js',
      'meal-stock-bridge.js','smart-week-plan.js'
    ]);

    // Molnsynk får aldrig hålla startsidan gisslan. Om nätet eller CDN är
    // långsamt fortsätter appen lokalt och synken ansluter när den kan.
    try {
      await loadGroup(['cloud-config.js','https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2','cloud-sync.js']);
    } catch (error) {
      console.warn('Molnsynk kunde inte starta:', error);
    }
  }

  start().catch(error => {
    console.error('Appens moduler kunde inte starta färdigt:', error);
    document.body.classList.add('calm-ready');
  });
})();