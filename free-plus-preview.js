(() => {
  const VERSION='20260901-1145';
  const loaded = new Set(Array.from(document.scripts).map(s => s.getAttribute('src')).filter(Boolean));

  function loadScript(src) {
    if (loaded.has(src) || document.querySelector(`script[data-malix-module="${src}"]`)) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = /^https?:\/\//.test(src) ? src : `${src}?v=${VERSION}`;
      script.dataset.malixModule = src;
      script.onload = () => { loaded.add(src); resolve(); };
      script.onerror = () => reject(new Error(`Kunde inte ladda ${src}`));
      document.body.appendChild(script);
    });
  }

  async function loadRequired(files) {
    for (const src of files) await loadScript(src);
  }

  async function loadOptional(files) {
    for (const src of files) {
      try {
        await loadScript(src);
      } catch (error) {
        console.warn(`Valfri modul kunde inte laddas: ${src}`, error);
      }
    }
  }

  async function start() {
    await loadRequired(['calm-navigation.js','calm-ready.js']);
    await loadOptional(['cloud-config.js','https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2','cloud-sync.js']);
    await loadOptional([
      'recipes-malix.js','desserts-malix.js','recipe-category-dessert.js','recipe-serving-suggestions.js','smart-kitchen.js','fridge-check-routine.js','meal-kitchen-sync.js','meal-stock-bridge.js','smart-week-plan.js'
    ]);
    await loadOptional([
      'food-preferences.js','meal-log-polish.js','breakfast-buffet.js','takeaway-meals.js','ready-made-foods.js','evening-meal-mirror.js','food-day-lock.js','food-history.js'
    ]);
    await loadOptional([
      'movement-recovery.js','cleaning-square.js','cleaning-home-offer.js','cleaning-monthly.js','cleaning-reflection-history-edit.js','cleaning-flex-log.js','diary-history.js'
    ]);
    await loadOptional([
      'cleaning-tips.js','self-care.js','presence-care.js','presence-done.js','sleep-care.js','my-time-mobile.js','my-day-summary.js','inner-compass.js'
    ]);
  }

  start().catch(error => {
    console.error('Appens kärna kunde inte starta:', error);
    document.body.classList.add('calm-ready');
  });
})();