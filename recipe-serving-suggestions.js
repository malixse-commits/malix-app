(() => {
  if (typeof recipes === 'undefined' || !Array.isArray(recipes)) return;

  const suggestions = {
    chili: 'Servera gärna med det som passar idag: ris, färskt bröd eller popupbröd och gärna en enkel sallad. Du behöver inte ha allt – välj ett tillbehör eller kombinera flera.',
    chilibillig: 'Servera gärna med ris, färskt bröd eller popupbröd. En enkel sallad, majs eller en klick yoghurt/crème fraîche kan också passa. Välj det du har hemma och tycker om.'
  };
  Object.entries(suggestions).forEach(([id, serving]) => {
    const recipe = recipes.find(r => r.id === id);
    if (recipe) recipe.serving = serving;
  });

  const pastaIds = new Set(['carbonara','pastamexicana','fruttidimare','pastamurklor','pastacapri','kasslergorgonzolapasta','pastatomatsasmalix']);
  recipes.forEach(recipe => {
    const isPasta = pastaIds.has(recipe.id) || (Array.isArray(recipe.tags) && recipe.tags.includes('pasta'));
    if (!isPasta) return;
    recipe.flavourLift = 'Smaka först. Vill du lyfta smaken lite kan du prova något enkelt: färska eller torkade örter, lite citron, chili, vitlök, svartpeppar, en skvätt olivolja eller parmesan – välj det som passar just rätten och det du har hemma.';
    recipe.malixItalyTip = 'Vill jag ta maten en liten sväng till Italien åker basilika och oregano fram. Det räcker långt för att ge vardagsmaten en italiensk känsla – i alla fall i mitt kök.';
    recipe.parmesanTip = 'Lite parmesan på toppen kan ge extra smak till många pastarätter. Ta så mycket eller lite du tycker passar.';
  });

  const originalOpenRecipe = window.openRecipe;
  if (typeof originalOpenRecipe !== 'function' || originalOpenRecipe.__malixRecipeIdeas) return;

  function openWithIdeas(id) {
    originalOpenRecipe(id);
    const recipe = recipes.find(r => r.id === id);
    const detail = document.querySelector('#recipeDetail .recipe-detail');
    if (!recipe || !detail) return;
    const stepsHeading = [...detail.querySelectorAll('h3')].find(h => h.textContent.trim() === 'En sak i taget');
    const insert = (title, text, attr) => {
      if (!text || detail.querySelector(`[${attr}]`)) return;
      const box = document.createElement('section');
      box.className = 'panel calm';
      box.setAttribute(attr, 'true');
      box.innerHTML = `<h3>${title}</h3><p>${text}</p>`;
      if (stepsHeading) detail.insertBefore(box, stepsHeading); else detail.appendChild(box);
    };
    insert('🍚 Vad kan jag ha till?', recipe.serving, 'data-serving-suggestion');
    insert('🔄 Du kan byta eller använda det du har', recipe.swaps, 'data-recipe-swaps');
    insert('✨ Lite Jamie-känsla', recipe.flavourLift, 'data-flavour-lift');
    insert('🇮🇹 Malix-tips', recipe.malixItalyTip, 'data-malix-italy');
    insert('🧀 Parmesan?', recipe.parmesanTip, 'data-parmesan-tip');
  }
  openWithIdeas.__malixRecipeIdeas = true;
  window.openRecipe = openWithIdeas;

  // Receptbanken ska alltid öppna receptet. Vi fångar bara knappar som
  // faktiskt är byggda för openRecipe och lämnar alla andra knappar orörda.
  document.addEventListener('click', event => {
    const button = event.target.closest('.recipe-card button');
    if (!button) return;
    const handler = button.getAttribute('onclick') || '';
    const match = handler.match(/openRecipe\(['"]([^'"]+)['"]\)/);
    if (!match) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    window.openRecipe(match[1]);
  }, true);
})();