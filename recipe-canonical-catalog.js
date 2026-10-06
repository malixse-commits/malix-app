(() => {
  'use strict';

  if (typeof recipes === 'undefined' || !Array.isArray(recipes)) {
    throw new Error('recipes[] saknas för canonical snapshot.');
  }

  const adapter = window.MalixLegacyRecipeAdapter;
  if (!adapter || typeof adapter.adaptRecipes !== 'function') {
    throw new Error('MalixLegacyRecipeAdapter.adaptRecipes saknas.');
  }

  const schema = window.MalixRecipeSchema;
  const status = schema?.statuses?.status;
  if (!status) {
    throw new Error('MalixRecipeSchema.statuses.status saknas.');
  }

  const entries = adapter.adaptRecipes(recipes);
  const info = Object.freeze({
    total: entries.length,
    valid: entries.filter(entry => entry.validation?.status === status.VALID).length,
    validWithWarnings: entries.filter(entry => entry.validation?.status === status.VALID_WITH_WARNINGS).length,
    invalid: entries.filter(entry => entry.validation?.status === status.INVALID).length
  });

  window.MalixParallelCanonicalCatalog = Object.freeze({
    entries,
    info
  });

  if (document.readyState !== 'loading') {
    throw new Error('RECIPE-BANK-002 pilot måste laddas under dokumentets scriptkedja.');
  }
  document.write('<script src="recipe-wikibooks-pilot.js?v=20261006-1425"><\/script>');
  document.write('<script src="recipe-combined-canonical-catalog.js?v=20261006-1425"><\/script>');
  document.write('<script src="recipe-bank-imported-pilot-ui.js?v=20261006-1425"><\/script>');
})();
