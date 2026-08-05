(() => {
  let returnView = 'recipeBank';

  function esc(value='') {
    return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }

  function recipeById(id) {
    return typeof recipes !== 'undefined' ? recipes.find(r => String(r.id) === String(id)) : null;
  }

  function sourceView() {
    const active = document.querySelector('.view.active-view');
    return active && active.id && active.id !== 'recipe' ? active.id : 'recipeBank';
  }

  window.openRecipe = id => {
    const recipe = recipeById(id);
    const detail = document.querySelector('#recipeDetail');
    if (!recipe || !detail) {
      alert('Receptet kunde inte öppnas.');
      return;
    }

    returnView = sourceView();
    const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
    const steps = Array.isArray(recipe.steps) ? recipe.steps : [];
    const tags = Array.isArray(recipe.tags) ? recipe.tags : [];

    detail.innerHTML = `
      <article class="recipe-detail">
        <div class="meta">
          <span class="badge">${esc(recipe.emoji || '🍽️')}</span>
          <span class="badge">⏱️ ${esc(recipe.time || '–')} min</span>
          <span class="badge">${recipe.budget === 'low' ? '💰 Billigt' : recipe.budget === 'mid' ? '💰💰 Mellan' : 'Pris varierar'}</span>
        </div>
        <h2>${esc(recipe.name)}</h2>
        ${recipe.tip ? `<p class="note"><strong>Malix tips:</strong> ${esc(recipe.tip)}</p>` : ''}
        ${tags.length ? `<div class="chips">${tags.map(tag => `<span class="badge">${esc(tag)}</span>`).join('')}</div>` : ''}
        <h3>Ingredienser</h3>
        <ul class="ingredient-list">${ingredients.map(item => `<li>${esc(item)}</li>`).join('')}</ul>
        <h3>Gör så här</h3>
        <ol class="steps">${steps.map(step => `<li>${esc(step)}</li>`).join('')}</ol>
        <section class="panel calm" style="margin-top:18px">
          <h3>Två sätt att tänka kring måltiden</h3>
          <p><strong>🍽️ Som vanligt</strong> – laga och servera rätten som den är.</p>
          <p><strong>🌿 Mer näring & mättnad</strong> – komplettera gärna med en tydlig proteinkälla om den saknas, mer grönsaker eller frukt och en fiberrik del som passar rätten.</p>
        </section>
      </article>`;

    if (typeof show === 'function') show('recipe');
    else {
      document.querySelectorAll('.view').forEach(v => v.classList.toggle('active-view', v.id === 'recipe'));
      window.scrollTo({top:0,behavior:'smooth'});
    }
  };

  const back = document.querySelector('#recipe .back');
  if (back) {
    back.removeAttribute('data-open');
    back.textContent = '← Tillbaka till förslagen';
    back.addEventListener('click', () => {
      if (typeof show === 'function') show(returnView);
      else document.querySelectorAll('.view').forEach(v => v.classList.toggle('active-view', v.id === returnView));
    });
  }

  // Säkerhetsnät: alla receptkort i alla delar ska öppna just det recept som knappen hör till.
  document.addEventListener('click', event => {
    const button = event.target.closest('button[onclick*="openRecipe"]');
    if (!button) return;
    const match = button.getAttribute('onclick')?.match(/openRecipe\(['"]([^'"]+)['"]\)/);
    if (!match) return;
    event.preventDefault();
    event.stopPropagation();
    window.openRecipe(match[1]);
  }, true);
})();