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

  function leftoverIdeas(recipe) {
    const text = [recipe.name, ...(recipe.ingredients || []), ...(recipe.tags || [])].join(' ').toLowerCase();
    if (text.includes('köttfärssås') || text.includes('bolognese')) return ['Soppa – låt lite köttfärssås ge smak och fyllighet.', 'Crêpes – fyll pannkakor med köttfärssås, tomat, lök och ost och gratinera med ost ovanpå.', 'Gratäng – använd såsen tillsammans med pasta eller potatis.', 'Varma smörgåsar – lite köttfärssås och ost blir en snabb ny måltid.'];
    if (text.includes('pannkak')) return ['Crêpes – spara några pannkakor och fyll dem nästa dag.', 'Kvällsmys – servera kalla eller uppvärmda med det tillbehör du tycker om.', 'Frukost eller mellanmål – förvara kallt och använd nästa dag.'];
    if (text.includes('potatis') || text.includes('potatismos')) return ['Potatisbullar – särskilt bra av överblivet mos.', 'Potatissoppa – använd kokt potatis eller mos som grund.', 'Stekt potatis eller pytt – kokt potatis är redan förberedd.', 'Potatissallad – ett enkelt sätt att använda kall kokt potatis.'];
    if (text.includes('pasta') || text.includes('spaghetti') || text.includes('makaron')) return ['Soppa – lägg den kokta pastan i mot slutet.', 'Pastagratäng – blanda med sås, grönsaker och det du har hemma.', 'Pastasallad – kyl snabbt och använd kall nästa dag.'];
    if (text.includes('ris')) return ['Stekt ris – använd kallt ris tillsammans med exempelvis ägg och grönsaker.', 'Rissallad – blanda med grönsaker och en enkel dressing.', 'Ny måltid – spara en portion som tillbehör nästa dag.'];
    if (text.includes('kyckling')) return ['Wrap eller smörgås – skiva kall tillagad kyckling och komplettera med grönsaker.', 'Sallad – använd resterna kalla tillsammans med det du har hemma.', 'Gryta eller soppa – tillsätt den färdiga kycklingen mot slutet så den bara blir varm.'];
    if (text.includes('gryta') || text.includes('soppa')) return ['Lunch nästa dag – många grytor och soppor passar bra att kyla snabbt och värma igen.', 'Frys en portion – märk med innehåll och datum för en dag när tiden eller orken är mindre.'];
    return [];
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
    const reuse = leftoverIdeas(recipe);

    detail.innerHTML = `
      <article class="recipe-detail">
        <div class="meta">
          <span class="badge">${esc(recipe.emoji || '🍽️')}</span>
          <span class="badge">⏱️ ${esc(recipe.time || '–')} min</span>
          <span class="badge">${recipe.budget === 'low' ? '💰 Billigt' : recipe.budget === 'mid' ? '💰💰 Mellan' : 'Pris varierar'}</span>
          ${reuse.length ? '<span class="badge">♻️ Bra att laga extra</span>' : ''}
        </div>
        <h2>${esc(recipe.name)}</h2>
        ${recipe.tip ? `<p class="note"><strong>Malix tips:</strong> ${esc(recipe.tip)}</p>` : ''}
        ${tags.length ? `<div class="chips">${tags.map(tag => `<span class="badge">${esc(tag)}</span>`).join('')}</div>` : ''}
        <h3>Ingredienser</h3>
        <ul class="ingredient-list">${ingredients.map(item => `<li>${esc(item)}</li>`).join('')}</ul>
        <h3>Gör så här</h3>
        <ol class="steps">${steps.map(step => `<li>${esc(step)}</li>`).join('')}</ol>
        ${reuse.length ? `<section class="panel" style="margin-top:18px"><h3>♻️ Laga gärna extra – det kan bli något nytt</h3><p>Om du ändå lagar den här rätten kan en extra portion eller en del av tillbehöret göra nästa måltid enklare.</p><ul class="ingredient-list">${reuse.map(item => `<li>${esc(item)}</li>`).join('')}</ul><p class="note"><strong>Tänk på morgondagen:</strong> kyl rester som ska sparas så snart det är praktiskt möjligt och förvara dem kallt.</p></section>` : ''}
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