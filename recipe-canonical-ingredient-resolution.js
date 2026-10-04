(() => {
  'use strict';

  const STATUS = Object.freeze({
    RESOLVED: 'RESOLVED',
    UNRESOLVED: 'UNRESOLVED',
    INVALID_INPUT: 'INVALID_INPUT'
  });

  const KNOWN_UNITS = Object.freeze(new Set([
    'kg', 'g', 'l', 'dl', 'ml', 'tsk', 'msk', 'st', 'skiva', 'bit', 'portion'
  ]));

  const catalog = window.MalixIngredientCatalog;
  if (!catalog || typeof catalog.resolveExact !== 'function') {
    throw new Error('MalixIngredientCatalog.resolveExact saknas.');
  }

  const canonicalCatalog = window.MalixParallelCanonicalCatalog;
  if (!canonicalCatalog || !Array.isArray(canonicalCatalog.entries)) {
    throw new Error('MalixParallelCanonicalCatalog.entries saknas.');
  }

  if (typeof window.malixGetKitchenStock !== 'function') {
    throw new Error('malixGetKitchenStock saknas.');
  }

  const nonEmptyString = value => typeof value === 'string' && value.trim().length > 0;

  function resolveIdentity(value) {
    if (!nonEmptyString(value)) return null;
    return catalog.resolveExact(value);
  }

  function parseExplicitQuantityPrefix(rawText) {
    if (!nonEmptyString(rawText)) return null;
    const match = rawText.match(/^(\d+(?:[.,]\d+)?)\s+(kg|g|l|dl|ml|tsk|msk|st|skiva|bit|portion)\s+(.+)$/i);
    if (!match) return null;

    const amount = Number(match[1].replace(',', '.'));
    const unit = match[2].toLowerCase();
    const candidateName = match[3];

    if (!Number.isFinite(amount) || amount <= 0 || !KNOWN_UNITS.has(unit) || !candidateName.trim()) {
      return null;
    }

    return Object.freeze({ amount, unit, candidateName });
  }

  function resolveRecipeIngredient(ingredient, index) {
    const rawText = ingredient?.rawText;
    if (!nonEmptyString(rawText)) {
      return Object.freeze({
        index,
        rawText,
        ingredientId: null,
        identityStatus: STATUS.INVALID_INPUT,
        amount: null,
        unit: null,
        quantityStatus: STATUS.INVALID_INPUT
      });
    }

    const wholeTextMatch = resolveIdentity(rawText);
    if (wholeTextMatch) {
      return Object.freeze({
        index,
        rawText,
        ingredientId: wholeTextMatch.id,
        identityStatus: STATUS.RESOLVED,
        amount: null,
        unit: null,
        quantityStatus: STATUS.UNRESOLVED
      });
    }

    const quantity = parseExplicitQuantityPrefix(rawText);
    if (!quantity) {
      return Object.freeze({
        index,
        rawText,
        ingredientId: null,
        identityStatus: STATUS.UNRESOLVED,
        amount: null,
        unit: null,
        quantityStatus: STATUS.UNRESOLVED
      });
    }

    const candidateMatch = resolveIdentity(quantity.candidateName);
    return Object.freeze({
      index,
      rawText,
      ingredientId: candidateMatch?.id || null,
      identityStatus: candidateMatch ? STATUS.RESOLVED : STATUS.UNRESOLVED,
      amount: quantity.amount,
      unit: quantity.unit,
      quantityStatus: STATUS.RESOLVED
    });
  }

  const recipeEntries = Object.freeze(canonicalCatalog.entries.map(entry => {
    const ingredients = Array.isArray(entry?.recipe?.ingredients)
      ? entry.recipe.ingredients.map(resolveRecipeIngredient)
      : [];

    return Object.freeze({
      recipeId: entry?.recipe?.id,
      ingredients: Object.freeze(ingredients)
    });
  }));

  function resolveStockEntry(stockEntry) {
    if (!stockEntry || typeof stockEntry !== 'object' || Array.isArray(stockEntry) || !nonEmptyString(stockEntry.item)) {
      return Object.freeze({
        stockId: stockEntry?.id,
        item: stockEntry?.item,
        ingredientId: null,
        identityStatus: STATUS.INVALID_INPUT,
        amount: stockEntry?.amount,
        place: stockEntry?.place
      });
    }

    const match = resolveIdentity(stockEntry.item);
    return Object.freeze({
      stockId: stockEntry.id,
      item: stockEntry.item,
      ingredientId: match?.id || null,
      identityStatus: match ? STATUS.RESOLVED : STATUS.UNRESOLVED,
      amount: stockEntry.amount,
      place: stockEntry.place
    });
  }

  function getStockEntries() {
    const stock = window.malixGetKitchenStock();
    if (!Array.isArray(stock)) return Object.freeze([]);
    return Object.freeze(stock.map(resolveStockEntry));
  }

  window.MalixCanonicalIngredientResolution = Object.freeze({
    statuses: STATUS,
    recipeEntries,
    getStockEntries
  });
})();
