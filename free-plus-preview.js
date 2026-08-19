(() => {
  // Central bootstrap. Den laddar aktiva moduler i bestämd ordning men bygger inget eget UI.
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

  async function start() {
    // Synkning får aldrig hindra den lokala appen.
    try {
      await loadScript('cloud-config.js');
      await loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2');
      await loadScript('cloud-sync.js');
    } catch (error) {
      console.warn('Molnsynk kunde inte starta:', error);
    }

    // Receptdata och PLUS-kök. smart-kitchen.js äger PLUS-vyn.
    for (const src of [
      'taco-recipe.js',
      'tomato-sauce-addon.js',
      'chalaw-rice-addon.js',
      'popup-bread-recipe.js',
      'recipe-serving-suggestions.js',
      'smart-kitchen.js',
      'fridge-check-routine.js',
      'meal-kitchen-sync.js',
      'meal-stock-bridge.js',
      'smart-week-plan.js'
    ]) await loadScript(src);

    // Matlogg. Modulerna får komplettera data/formulär men inte bygga huvudnavigation.
    for (const src of [
      'food-preferences.js',
      'meal-log-polish.js',
      'breakfast-buffet.js',
      'takeaway-meals.js',
      'ready-made-foods.js',
      'evening-meal-mirror.js',
      'food-day-lock.js'
    ]) await loadScript(src);

    // Vardag och historik.
    for (const src of [
      'movement-recovery.js',
      'cleaning-square.js',
      'cleaning-reflection-history-edit.js',
      'cleaning-flex-log.js',
      'diary-history.js'
    ]) await loadScript(src);

    // En enda ägare av startsida och huvudnavigation.
    await loadScript('calm-navigation.js');

    // Undervyer under den fasta navigationen.
    for (const src of [
      'cleaning-tips.js',
      'self-care.js',
      'presence-care.js',
      'presence-done.js',
      'sleep-care.js',
      'my-time-mobile.js',
      'my-day-summary.js',
      'inner-compass.js'
    ]) await loadScript(src);
  }

  start().catch(error => console.error('Appens moduler kunde inte starta färdigt:', error));
})();