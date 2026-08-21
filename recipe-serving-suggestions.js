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

  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

  function showRecipeView() {
    document.querySelectorAll('main > .view').forEach(view => view.classList.remove('active-view'));
    const recipeView = document.querySelector('main > #recipe');
    if (!recipeView) return;
    recipeView.classList.add('active-view');
    const back = recipeView.querySelector('.back');
    if (back) {
      back.setAttribute('data-nav-back', 'recipeBank');
      back.removeAttribute('data-open');
      back.textContent = '← Till receptbanken';
    }
    window.scrollTo({top:0, behavior:'smooth'});
  }

  function ideaBox(title, text, attr) {
    if (!text) return '';
    return `<section class="panel calm" ${attr}="true"><h3>${title}</h3><p>${esc(text)}</p></section>`;
  }

  function renderRecipe(id) {
    const recipe = recipes.find(r => String(r.id) === String(id));
    const root = document.querySelector('#recipeDetail');
    if (!recipe || !root) return false;

    const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
    const steps = Array.isArray(recipe.steps) ? recipe.steps : [];
    const price = recipe.budget === 'low' ? '💰 Billigt' : recipe.budget === 'mid' || recipe.budget === 'medium' ? '💰💰 Mellan' : '💰💰 Mellan';

    root.innerHTML = `<article class="recipe-detail">
      <div class="meta"><span class="badge">${esc(recipe.emoji || '🍲')}</span><span class="badge">⏱️ ${esc(recipe.time || '?')} min</span><span class="badge">${price}</span></div>
      <h2>${esc(recipe.name)}</h2>
      <p class="lead">Receptet är en utgångspunkt. Anpassa mängd, smak och tillbehör efter det du har hemma och det som passar idag.</p>
      <h3>Det här behöver du</h3>
      <ul class="ingredient-list">${ingredients.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
      ${ideaBox('🍚 Vad kan jag ha till?', recipe.serving, 'data-serving-suggestion')}
      ${ideaBox('🔄 Du kan byta eller använda det du har', recipe.swaps, 'data-recipe-swaps')}
      ${ideaBox('✨ Lite Jamie-känsla', recipe.flavourLift, 'data-flavour-lift')}
      ${ideaBox('🇮🇹 Malix-tips', recipe.malixItalyTip, 'data-malix-italy')}
      ${ideaBox('🧀 Parmesan?', recipe.parmesanTip, 'data-parmesan-tip')}
      <h3>En sak i taget</h3>
      <ol class="steps">${steps.map(x => `<li>${esc(x)}</li>`).join('')}</ol>
      ${recipe.tip ? `<div class="panel calm"><strong>Malix tips</strong><p>${esc(recipe.tip)}</p></div>` : ''}
      <div class="panel calm"><h3>När du har ätit</h3><p>Tryck här först när du faktiskt har ätit maträtten. Då kan den sparas i Min mat idag och köksfunktionerna uppdateras.</p><button class="primary" type="button" data-mark-recipe-cooked="${esc(recipe.id)}">✓ Jag åt detta</button><p id="recipeCookStatus" class="status" aria-live="polite"></p></div>
    </article>`;

    showRecipeView();
    window.malixDecorateRecipeForPreferences?.();
    return true;
  }

  window.openRecipe = renderRecipe;

  function recipeIdFromCard(card) {
    const explicit = card.querySelector('[data-open-recipe],[data-plus-open],[data-week-open]');
    if (explicit) return explicit.dataset.openRecipe || explicit.dataset.plusOpen || explicit.dataset.weekOpen || '';
    const inline = card.querySelector('button[onclick*="openRecipe"]')?.getAttribute('onclick') || '';
    const match = inline.match(/openRecipe\(['"]([^'"]+)['"]\)/);
    if (match) return match[1];
    const heading = card.querySelector('h3')?.textContent?.trim() || '';
    const normalized = heading.replace(/^[^\p{L}\p{N}]+/u, '').trim();
    return recipes.find(r => r.name === heading || r.name === normalized)?.id || '';
  }

  document.addEventListener('click', event => {
    const cooked = event.target.closest('[data-mark-recipe-cooked]');
    if (cooked) {
      event.preventDefault();
      event.stopImmediatePropagation();
      window.markRecipeCooked?.(cooked.dataset.markRecipeCooked);
      return;
    }

    const explicitOpen = event.target.closest('[data-open-recipe],[data-plus-open],[data-week-open],button[onclick*="openRecipe"]');
    const card = event.target.closest('#recipeBankResults .recipe-card, #ingredientResults .recipe-card, #leftoverResults .recipe-card, #suggestions .recipe-card, #lowEnergyResults .recipe-card, #plusCookFromHome .recipe-card, #smartWeekGrid .recipe-card');
    if (!explicitOpen && !card) return;

    if (event.target.closest('[data-plus-missing],[data-free-shop-delete],[data-free-shop-check],[data-recipe-shopping],[data-plus-stock-remove],[data-plus-shop-remove]')) return;

    const id = explicitOpen
      ? explicitOpen.dataset.openRecipe || explicitOpen.dataset.plusOpen || explicitOpen.dataset.weekOpen || (explicitOpen.getAttribute('onclick') || '').match(/openRecipe\(['"]([^'"]+)['"]\)/)?.[1]
      : recipeIdFromCard(card);
    if (!id) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    renderRecipe(id);
  }, true);
})();