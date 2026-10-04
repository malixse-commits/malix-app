(() => {
  'use strict';

  const analysis = window.MalixCanonicalMissingIngredientAnalysis;
  if (!analysis || typeof analysis.getRecipe !== 'function') {
    throw new Error('MalixCanonicalMissingIngredientAnalysis.getRecipe saknas.');
  }

  const originalOpenRecipe = window.openRecipe;
  if (typeof originalOpenRecipe !== 'function' || originalOpenRecipe.__malixCanonicalMissingPresentation) return;

  const GROUPS = Object.freeze([
    Object.freeze({
      statuses: Object.freeze(['FOUND']),
      title: 'Registrerat i lagret'
    }),
    Object.freeze({
      statuses: Object.freeze(['MISSING']),
      title: 'Inte registrerat i lagret',
      note: 'Det betyder bara att varan inte finns registrerad i lagret. Appen vet inte om du faktiskt har den hemma.'
    }),
    Object.freeze({
      statuses: Object.freeze(['UNRESOLVED', 'INVALID_INPUT']),
      title: 'Kan inte jämföras säkert'
    })
  ]);

  function buildGroup(group, rows) {
    const matches = rows.filter(row => group.statuses.includes(row?.status));
    if (!matches.length) return null;

    const section = document.createElement('section');
    section.setAttribute('data-canonical-missing-group', group.statuses.join('-').toLowerCase());

    const heading = document.createElement('h4');
    heading.textContent = group.title;
    section.appendChild(heading);

    const list = document.createElement('ul');
    for (const row of matches) {
      const item = document.createElement('li');
      item.textContent = String(row?.rawText ?? '');
      list.appendChild(item);
    }
    section.appendChild(list);

    if (group.note) {
      const note = document.createElement('p');
      note.className = 'note';
      note.textContent = group.note;
      section.appendChild(note);
    }

    return section;
  }

  function renderMissingPresentation(recipeId) {
    const recipeAnalysis = analysis.getRecipe(recipeId);
    const ingredientList = document.querySelector('#recipeDetail .recipe-detail .ingredient-list');
    if (!recipeAnalysis || !ingredientList || !Array.isArray(recipeAnalysis.ingredients)) return;

    const existing = document.querySelector('#recipeDetail [data-canonical-missing-presentation]');
    if (existing) existing.remove();

    const panel = document.createElement('section');
    panel.className = 'panel calm';
    panel.setAttribute('data-canonical-missing-presentation', 'true');

    const title = document.createElement('h3');
    title.textContent = '🧊 Jämfört med ditt registrerade lager';
    panel.appendChild(title);

    for (const group of GROUPS) {
      const groupSection = buildGroup(group, recipeAnalysis.ingredients);
      if (groupSection) panel.appendChild(groupSection);
    }

    ingredientList.insertAdjacentElement('afterend', panel);
  }

  function openWithMissingPresentation(id) {
    originalOpenRecipe(id);
    renderMissingPresentation(id);
  }

  openWithMissingPresentation.__malixCanonicalMissingPresentation = true;
  window.openRecipe = openWithMissingPresentation;
})();
