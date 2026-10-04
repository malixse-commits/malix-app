(() => {
  'use strict';

  const resolution = window.MalixCanonicalIngredientResolution;
  if (!resolution || !Array.isArray(resolution.recipeEntries) || typeof resolution.getStockEntries !== 'function') {
    throw new Error('MalixCanonicalIngredientResolution saknas.');
  }

  const STATUS = Object.freeze({
    FOUND: 'FOUND',
    MISSING: 'MISSING',
    UNRESOLVED: 'UNRESOLVED',
    INVALID_INPUT: 'INVALID_INPUT'
  });

  function analyzeIngredient(ingredient, resolvedStockIds) {
    const identityStatus = ingredient?.identityStatus;

    if (identityStatus === 'INVALID_INPUT') {
      return Object.freeze({
        index: ingredient?.index,
        rawText: ingredient?.rawText,
        ingredientId: ingredient?.ingredientId ?? null,
        status: STATUS.INVALID_INPUT
      });
    }

    if (identityStatus !== 'RESOLVED' || !ingredient?.ingredientId) {
      return Object.freeze({
        index: ingredient?.index,
        rawText: ingredient?.rawText,
        ingredientId: ingredient?.ingredientId ?? null,
        status: STATUS.UNRESOLVED
      });
    }

    return Object.freeze({
      index: ingredient.index,
      rawText: ingredient.rawText,
      ingredientId: ingredient.ingredientId,
      status: resolvedStockIds.has(ingredient.ingredientId) ? STATUS.FOUND : STATUS.MISSING
    });
  }

  function currentResolvedStockIds() {
    const stockEntries = resolution.getStockEntries();
    const ids = new Set();

    for (const stockEntry of stockEntries) {
      if (stockEntry?.identityStatus === 'RESOLVED' && stockEntry.ingredientId) {
        ids.add(stockEntry.ingredientId);
      }
    }

    return ids;
  }

  function analyzeRecipeEntry(recipeEntry, resolvedStockIds) {
    const ingredients = Array.isArray(recipeEntry?.ingredients)
      ? recipeEntry.ingredients.map(ingredient => analyzeIngredient(ingredient, resolvedStockIds))
      : [];

    return Object.freeze({
      recipeId: recipeEntry?.recipeId,
      ingredients: Object.freeze(ingredients)
    });
  }

  function getRecipe(recipeId) {
    const recipeEntry = resolution.recipeEntries.find(entry => String(entry?.recipeId) === String(recipeId));
    if (!recipeEntry) return null;
    return analyzeRecipeEntry(recipeEntry, currentResolvedStockIds());
  }

  function getRecipeEntries() {
    const resolvedStockIds = currentResolvedStockIds();
    return Object.freeze(
      resolution.recipeEntries.map(recipeEntry => analyzeRecipeEntry(recipeEntry, resolvedStockIds))
    );
  }

  window.MalixCanonicalMissingIngredientAnalysis = Object.freeze({
    statuses: STATUS,
    getRecipe,
    getRecipeEntries
  });
})();
