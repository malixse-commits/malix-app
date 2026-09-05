(() => {
  const VERSION='20260905-1715';
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

  async function loadRequired(files) { for (const src of files) await loadScript(src); }
  async function loadOptional(files) { for (const src of files) { try { await loadScript(src); } catch (error) { console.warn(`Valfri modul kunde inte laddas: ${src}`, error); } } }

  async function start() {
    // Bygg navigationen först, men visa inte appen som klar förrän kärnmodulerna finns.
    await loadRequired(['calm-navigation.js']);

    // De fyra huvudområdenas kärnfunktioner ska finnas innan användaren kan börja navigera.
    await loadRequired([
      'self-care.js',
      'presence-care.js',
      'presence-done.js',
      'sleep-care.js',
      'cleaning-square.js',
      'my-time-mobile.js',
      'my-day-summary.js',
      'inner-compass.js',
      'my-month.js'
    ]);

    // När kärnan är byggd får appen bli klickbar.
    await loadRequired(['calm-ready.js']);

    // Molnsynk är ett tillägg och får inte blockera kärnappen.
    await loadOptional(['cloud-config.js','https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2','cloud-sync.js']);

    // recipe-bank.js laddas direkt av index.html och är den enda filen som äger receptdata.
    await loadOptional(['recipe-catalog.js','recipe-category-dessert.js']);

    await loadOptional(['smart-kitchen.js','kitchen-item-cleanup.js','fridge-check-routine.js','smart-week-plan.js']);
    await loadOptional(['recipe-serving-suggestions.js','meal-stock-bridge.js','rescue-plus.js']);
    await loadOptional(['food-preferences.js','food-bank.js','meal-log-polish.js','breakfast-buffet.js','ready-made-foods.js','evening-meal-mirror.js','food-day-lock.js','food-history.js']);
    await loadOptional(['cleaning-home-offer.js','cleaning-reflection-history-edit.js','cleaning-flex-log.js','diary-history.js','cleaning-tips.js']);
  }

  start().catch(error => {
    console.error('Appens kärna kunde inte starta:', error);
    document.body.classList.add('calm-ready');
  });
})();