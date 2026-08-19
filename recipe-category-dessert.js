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
      if (typeof recipes === 'undefined' || !Array.isArray(recipes)) return;
      const list = recipes.filter(r => Array.isArray(r.tags) && r.tags.includes('efterrätt'));
      if (typeof renderBank === 'function') renderBank(list);
      chips.querySelectorAll('[data-recipe-tag]').forEach(b => b.classList.toggle('active', b === btn));
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initDessertCategory, { once: true });
  else initDessertCategory();
})();