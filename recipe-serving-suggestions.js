(() => {
  if (typeof recipes === 'undefined' || !Array.isArray(recipes)) return;

  const suggestions = {
    chili: 'Servera gärna med det som passar idag: ris, färskt bröd eller popupbröd och gärna en enkel sallad. Du behöver inte ha allt – välj ett tillbehör eller kombinera flera.',
    chilibillig: 'Servera gärna med ris, färskt bröd eller popupbröd. En enkel sallad, majs eller en klick yoghurt/crème fraîche kan också passa. Välj det du har hemma och tycker om.'
  };

  Object.entries(suggestions).forEach(([id, serving]) => {
    const recipe = recipes.find(r => r.id === id);
    if (!recipe) return;
    recipe.serving = serving;
  });

  // Receptdetaljen ägs fortfarande av app.js. Vi kompletterar bara den redan renderade
  // detaljen med en tydlig serveringsruta när receptet har serveringsförslag.
  const originalOpenRecipe = window.openRecipe;
  if (typeof originalOpenRecipe !== 'function' || originalOpenRecipe.__malixServingSuggestions) return;

  function openWithServing(id) {
    originalOpenRecipe(id);
    const recipe = recipes.find(r => r.id === id);
    const detail = document.querySelector('#recipeDetail .recipe-detail');
    if (!recipe?.serving || !detail || detail.querySelector('[data-serving-suggestion]')) return;

    const stepsHeading = [...detail.querySelectorAll('h3')].find(h => h.textContent.trim() === 'En sak i taget');
    const box = document.createElement('section');
    box.className = 'panel calm';
    box.dataset.servingSuggestion = 'true';
    box.innerHTML = `<h3>🍚 Vad kan jag ha till?</h3><p>${recipe.serving}</p>`;
    if (stepsHeading) detail.insertBefore(box, stepsHeading);
    else detail.appendChild(box);
  }
  openWithServing.__malixServingSuggestions = true;
  window.openRecipe = openWithServing;
})();