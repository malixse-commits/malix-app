(() => {
  function localDateKey(d = new Date()) {
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }

  function openMeal(type) {
    const key = localDateKey();
    if (localStorage.getItem(`malix-day-finalized-${key}`) === 'true') return;

    window.malixSelectedDateKey = key;

    // Öppna matloggen direkt utan beroende av andra skript.
    document.querySelectorAll('.view').forEach(view => {
      view.classList.toggle('active-view', view.id === 'foodLog');
    });

    const select = document.querySelector('#mealForm select[name="meal"]');
    if (select) {
      select.value = type;
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }

    document.dispatchEvent(new CustomEvent('malix-log-date-changed', { detail: { key } }));

    // Försök uppdatera den valda dagens måltider om funktionen finns.
    if (typeof window.malixRenderSelectedMeals === 'function') {
      window.malixRenderSelectedMeals();
    }

    const form = document.querySelector('#mealForm');
    if (form) form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Delegation fungerar även när Dagens översikt ritas om efter att sidan laddats.
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-meal-shortcut]');
    if (!button || button.disabled) return;
    event.preventDefault();
    event.stopPropagation();
    openMeal(button.dataset.mealShortcut);
  }, true);

  // Extra stöd för touch-enheter där klick ibland fördröjs eller fångas av annat element.
  document.addEventListener('pointerup', event => {
    if (event.pointerType !== 'touch') return;
    const button = event.target.closest('[data-meal-shortcut]');
    if (!button || button.disabled) return;
    event.preventDefault();
    openMeal(button.dataset.mealShortcut);
  }, true);
})();