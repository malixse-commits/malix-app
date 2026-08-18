(() => {
  // Transitional bootstrap: this file is still referenced by index.html,
  // but it no longer changes the UI or adds a PLUS preview panel.
  // It only loads the active feature modules in one deterministic order.
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
    // Synk/data först. Fel här ska inte hindra den lokala appen från att fungera.
    try {
      await loadScript('cloud-config.js');
      await loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2');
      await loadScript('cloud-sync.js');
    } catch (error) {
      console.warn('Molnsynk kunde inte starta:', error);
    }

    // Receptdata och köksfunktioner.
    for (const src of [
      'taco-recipe.js',
      'tomato-sauce-addon.js',
      'chalaw-rice-addon.js',
      'smart-kitchen.js',
      'oil-stock-fix.js',
      'bread-unit-fix.js',
      'natural-food-units.js',
      'meal-kitchen-sync.js',
      'meal-stock-bridge.js',
      'smart-week-plan.js',
      'cook-from-kitchen.js'
    ]) await loadScript(src);

    // Matlogg. Dessa moduler kompletterar app.js men äger inte navigationen.
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
      'cleaning-flex-log.js',
      'diary-history.js'
    ]) await loadScript(src);

    // Navigationen byggs en gång. Inga äldre tab-navigationer eller dashboard-fixar körs efteråt.
    await loadScript('calm-navigation.js');

    // Funktioner som får sina egna vyer under den fasta navigationen.
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