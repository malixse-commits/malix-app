(() => {
  'use strict';

  const importedCatalog = window.MalixImportedCanonicalCatalog;
  const combinedCatalog = window.MalixCombinedCanonicalCatalog;
  if (!importedCatalog || !combinedCatalog) {
    throw new Error('Canonical importkatalog saknas för receptbankspiloten.');
  }

  const originalOpenRecipe = window.openRecipe;
  if (typeof originalOpenRecipe !== 'function') {
    throw new Error('openRecipe saknas för receptbankspiloten.');
  }

  const esc = value => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const importedById = new Map(importedCatalog.entries.map(entry => [entry.recipe.id, entry]));

  function importedView(entry) {
    const r = entry.recipe;
    return Object.freeze({
      id: r.id,
      name: r.name,
      emoji: entry.importMetadata?.emoji || '🍽️',
      time: r.time?.total ?? 0,
      budget: r.budget || 'mid',
      tags: [...r.tags],
      ingredients: r.ingredients.map(row => row.rawText),
      steps: [...r.steps],
      servings: r.servings,
      prepTime: r.time?.prep ?? null,
      cookTime: r.time?.cook ?? null,
      tip: r.tip || '',
      __imported: true
    });
  }

  const importedViews = Object.freeze(importedCatalog.entries.map(importedView));
  const allViews = () => [...recipes, ...importedViews];

  function card(r) {
    const budget = r.budget === 'low' ? '💰' : '💰💰';
    const sourceBadge = r.__imported ? '<span class="badge">Wikibooks</span>' : '';
    return `<article class="recipe-card"><div class="meta"><span class="badge">${esc(r.emoji || '🍽️')}</span><span class="badge">⏱️ ${esc(r.time || '–')} min</span><span class="badge">${budget}</span>${sourceBadge}</div><h3>${esc(r.name)}</h3><p>${esc(r.tip || '')}</p><button class="primary" type="button" onclick="openRecipe('${esc(r.id)}')">Öppna recept</button></article>`;
  }

  function render(list) {
    const target = document.querySelector('#recipeBankResults');
    if (!target) return;
    target.innerHTML = list.length ? list.map(card).join('') : '<div class="empty">Inga träffar ännu.</div>';
  }

  function searchCombined(query) {
    const q = String(query || '').trim().toLowerCase();
    if (!q) return allViews();
    return allViews().filter(r => `${r.name} ${r.ingredients.join(' ')} ${r.tags.join(' ')}`.toLowerCase().includes(q));
  }

  document.querySelectorAll('[data-open="recipeBank"]').forEach(button => {
    button.addEventListener('click', () => render(allViews()));
  });

  document.querySelector('#recipeSearch')?.addEventListener('input', event => {
    render(searchCombined(event.target.value));
  });

  document.querySelectorAll('[data-recipe-tag]').forEach(button => {
    button.addEventListener('click', () => {
      const tag = button.dataset.recipeTag;
      render(tag === 'alla' ? allViews() : allViews().filter(recipe => recipe.tags.includes(tag)));
    });
  });

  function renderImportedRecipe(entry) {
    const r = entry.recipe;
    const source = r.source;
    const detail = document.querySelector('#recipeDetail');
    if (!detail) return;

    const facts = [
      r.servings ? `🍽️ ${r.servings} portioner` : null,
      r.time?.prep != null ? `🔪 Förberedelse ${r.time.prep} min` : null,
      r.time?.cook != null ? `🔥 Tillagning ${r.time.cook} min` : null,
      r.time?.total != null ? `⏱️ Totalt cirka ${r.time.total} min` : null
    ].filter(Boolean);

    const twist = entry.importMetadata?.malixTwist
      ? `<div class="panel calm"><strong>Malix-twist</strong><p>${esc(entry.importMetadata.malixTwist)}</p></div>`
      : '';

    detail.innerHTML = `<article class="recipe-detail">
      <div class="meta"><span class="badge">${esc(entry.importMetadata?.emoji || '🍽️')}</span><span class="badge">Wikibooks</span><span class="badge">CC BY-SA 4.0</span></div>
      <h2>${esc(r.name)}</h2>
      <section class="panel calm"><h3>Innan du börjar</h3><p>${facts.map(esc).join(' · ')}</p></section>
      <h3>Det här behöver du</h3>
      <ul class="ingredient-list">${r.ingredients.map(row => `<li>${esc(row.rawText)}</li>`).join('')}</ul>
      <h3>En sak i taget</h3>
      <ol class="steps">${r.steps.map(step => `<li>${esc(step)}</li>`).join('')}</ol>
      ${r.tip ? `<div class="panel calm"><strong>Tips</strong><p>${esc(r.tip)}</p></div>` : ''}
      ${twist}
      <details class="panel calm"><summary><strong>Källa & licens</strong></summary>
        <p>Bearbetat och översatt från <a href="${esc(source.sourceUrl)}" target="_blank" rel="noopener noreferrer">Wikibooks Cookbook</a>.</p>
        <p>${esc(source.attribution)}</p>
        <p>Licens: <a href="${esc(source.licenseUrl)}" target="_blank" rel="noopener noreferrer">${esc(source.license)}</a>. Bearbetat: ${source.modified ? 'ja' : 'nej'}.</p>
      </details>
    </article>`;

    if (typeof window.show === 'function') window.show('recipe');
  }

  function openImportedAware(id) {
    const imported = importedById.get(id);
    if (imported) {
      renderImportedRecipe(imported);
      return;
    }
    originalOpenRecipe(id);
  }

  openImportedAware.__malixImportedRecipePilot = true;
  window.openRecipe = openImportedAware;

  window.MalixImportedRecipePilotUI = Object.freeze({
    renderAll: () => render(allViews()),
    importedCount: importedViews.length
  });
})();
