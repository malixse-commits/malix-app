(() => {
  const history = document.querySelector('#mealHistory');
  if (!history) return;

  function getMeals() {
    try { return JSON.parse(localStorage.getItem('malix-meals') || '[]'); }
    catch { return []; }
  }

  function saveMeals(meals) {
    localStorage.setItem('malix-meals', JSON.stringify(meals));
  }

  function addDeleteButtons() {
    const cards = [...history.querySelectorAll('.recipe-card')];
    cards.forEach((card, index) => {
      if (card.querySelector('[data-delete-meal]')) return;
      const wrap = document.createElement('div');
      wrap.style.marginTop = '12px';
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'secondary';
      button.dataset.deleteMeal = String(index);
      button.textContent = 'Ta bort måltiden';
      wrap.appendChild(button);
      card.appendChild(wrap);
    });
  }

  history.addEventListener('click', event => {
    const button = event.target.closest('[data-delete-meal]');
    if (!button) return;
    const index = Number(button.dataset.deleteMeal);
    const meals = getMeals();
    const meal = meals[index];
    if (!meal) return;
    if (!confirm(`Vill du ta bort ${meal.meal.toLowerCase()} – ${meal.food}?`)) return;
    meals.splice(index, 1);
    saveMeals(meals);
    if (typeof window.renderMeals === 'function') window.renderMeals();
    setTimeout(addDeleteButtons, 0);
  });

  const observer = new MutationObserver(() => addDeleteButtons());
  observer.observe(history, { childList: true, subtree: true });

  document.querySelector('#mealForm')?.addEventListener('submit', () => {
    setTimeout(addDeleteButtons, 50);
  });

  addDeleteButtons();
})();