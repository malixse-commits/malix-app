(() => {
  'use strict';

  const analysis = window.MalixCanonicalMissingIngredientAnalysis;
  if (!analysis || typeof analysis.getRecipe !== 'function') {
    throw new Error('MalixCanonicalMissingIngredientAnalysis.getRecipe saknas.');
  }

  const originalOpenRecipe = window.openRecipe;
  if (typeof originalOpenRecipe !== 'function' || originalOpenRecipe.__malixCanonicalMissingPlusAction) return;

  const BUTTON_TEXT = 'Lägg dessa på PLUS-listan';
  const ERROR_TEXT = 'PLUS-listan kunde inte uppdateras just nu.';

  function eligibleIngredientIds(recipeAnalysis) {
    const ids = new Set();
    for (const row of recipeAnalysis?.ingredients || []) {
      if (row?.status !== 'MISSING') continue;
      const ingredientId = String(row?.ingredientId || '').trim();
      if (ingredientId) ids.add(ingredientId);
    }
    return [...ids];
  }

  function successMessage(added, duplicate) {
    if (!added && duplicate) {
      return duplicate === 1
        ? 'Varan finns redan på PLUS-listan.'
        : 'De här varorna finns redan på PLUS-listan.';
    }

    const parts = [];
    if (added === 1) parts.push('1 vara lades till på PLUS-listan.');
    if (added > 1) parts.push(`${added} varor lades till på PLUS-listan.`);
    if (duplicate === 1) parts.push('1 fanns redan på PLUS-listan.');
    if (duplicate > 1) parts.push(`${duplicate} fanns redan på PLUS-listan.`);
    return parts.join(' ');
  }

  function mountPlusAction(recipeId) {
    const recipeAnalysis = analysis.getRecipe(recipeId);
    const panel = document.querySelector('#recipeDetail [data-canonical-missing-presentation]');
    if (!recipeAnalysis || !panel) return;

    const ingredientIds = eligibleIngredientIds(recipeAnalysis);
    if (!ingredientIds.length) return;

    const existing = panel.querySelector('[data-canonical-missing-plus-action]');
    if (existing) existing.remove();

    const action = document.createElement('div');
    action.setAttribute('data-canonical-missing-plus-action', 'true');

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'primary';
    button.textContent = BUTTON_TEXT;

    const status = document.createElement('p');
    status.className = 'status';
    status.setAttribute('aria-live', 'polite');

    button.addEventListener('click', () => {
      button.disabled = true;

      const addCanonical = window.malixAddCanonicalPlusShoppingItem;
      if (typeof addCanonical !== 'function') {
        status.textContent = ERROR_TEXT;
        return;
      }

      let added = 0;
      let duplicate = 0;
      let invalid = false;

      for (const ingredientId of ingredientIds) {
        let result;
        try {
          result = addCanonical({
            ingredientId,
            source: 'Tillagd från recept'
          });
        } catch {
          invalid = true;
          continue;
        }

        if (result?.invalid) {
          invalid = true;
        } else if (result?.added) {
          added += 1;
        } else if (result?.duplicate) {
          duplicate += 1;
        } else {
          invalid = true;
        }
      }

      status.textContent = invalid ? ERROR_TEXT : successMessage(added, duplicate);
    });

    action.append(button, status);
    panel.appendChild(action);
  }

  function openWithMissingPlusAction(id) {
    originalOpenRecipe(id);
    mountPlusAction(id);
  }

  openWithMissingPlusAction.__malixCanonicalMissingPlusAction = true;
  window.openRecipe = openWithMissingPlusAction;
})();
