(() => {
  function initDessertCategory() {
    const bank = document.querySelector('#recipeBank');
    const chips = bank?.querySelector('.chips');
    if (!bank || !chips) return setTimeout(initDessertCategory, 200);
    if (chips.querySelector('[data-recipe-tag="efterrätt"]')) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.dataset.recipeTag = 'efterrätt';
    btn.textContent = '🍰 Efterrätt & något gott';
    chips.appendChild(btn);

    btn.addEventListener('click', () => {
      const entries = window.MalixParallelCanonicalCatalog?.entries;
      if (!Array.isArray(entries)) return;

      const list = entries
        .filter(entry => Array.isArray(entry?.recipe?.tags) && entry.recipe.tags.includes('efterrätt'))
        .map(entry => ({
          id: entry.recipe.id,
          name: entry.recipe.name,
          emoji: entry.legacyMetadata?.emoji,
          time: entry.recipe.time?.total,
          budget: entry.recipe.budget,
          tip: entry.recipe.tip
        }));

      if (typeof renderBank === 'function') renderBank(list);
      chips.querySelectorAll('[data-recipe-tag]').forEach(b => b.classList.toggle('active', b === btn));
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initDessertCategory, { once: true });
  else initDessertCategory();
})();