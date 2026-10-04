(() => {
  'use strict';

  const LEGACY_METADATA_FIELDS = Object.freeze([
    'emoji',
    'oven',
    'plants',
    'recipeStandard',
    'heat'
  ]);

  const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value, key);
  const isObject = value => !!value && typeof value === 'object';

  function deepFreeze(value) {
    if (!isObject(value) || Object.isFrozen(value)) return value;
    Object.freeze(value);
    Object.keys(value).forEach(key => deepFreeze(value[key]));
    return value;
  }

  function cloneValue(value) {
    if (Array.isArray(value)) return value.map(cloneValue);
    if (!isObject(value)) return value;
    const copy = {};
    Object.keys(value).forEach(key => {
      copy[key] = cloneValue(value[key]);
    });
    return copy;
  }

  function adaptIngredient(value) {
    if (typeof value !== 'string') return cloneValue(value);
    return {
      rawText: value,
      ingredientId: null,
      parentIngredientId: null,
      name: null,
      amount: null,
      unit: null,
      optional: false,
      note: null
    };
  }

  function adaptIngredients(value) {
    if (!Array.isArray(value)) return cloneValue(value);
    return value.map(adaptIngredient);
  }

  function legacyMetadata(recipe) {
    const metadata = {};
    LEGACY_METADATA_FIELDS.forEach(key => {
      if (hasOwn(recipe, key)) metadata[key] = cloneValue(recipe[key]);
    });
    return metadata;
  }

  function schema() {
    const current = window.MalixRecipeSchema;
    if (!current || typeof current.validateRecipe !== 'function') {
      throw new Error('MalixRecipeSchema.validateRecipe saknas.');
    }
    return current;
  }

  function invalidCanonicalRecipe(currentSchema) {
    return deepFreeze({
      id: undefined,
      schemaVersion: currentSchema.schemaVersion,
      name: undefined,
      language: 'sv',
      servings: null,
      time: { prep: null, cook: null, total: null },
      budget: null,
      tags: undefined,
      ingredients: undefined,
      steps: undefined,
      equipment: null,
      leftovers: null,
      serving: null,
      swaps: null,
      tip: null,
      doneness: null,
      source: { kind: 'malix-original', provider: 'malix' },
      media: []
    });
  }

  function adaptRecipe(recipe) {
    const currentSchema = schema();

    if (!recipe || typeof recipe !== 'object' || Array.isArray(recipe)) {
      const canonicalRecipe = invalidCanonicalRecipe(currentSchema);
      return deepFreeze({
        recipe: canonicalRecipe,
        validation: currentSchema.validateRecipe(canonicalRecipe),
        legacyMetadata: {}
      });
    }

    const canonicalRecipe = {
      id: cloneValue(recipe.id),
      schemaVersion: currentSchema.schemaVersion,
      name: cloneValue(recipe.name),
      language: 'sv',
      servings: hasOwn(recipe, 'servings') ? cloneValue(recipe.servings) : null,
      time: {
        prep: hasOwn(recipe, 'prepTime') ? cloneValue(recipe.prepTime) : null,
        cook: hasOwn(recipe, 'cookTime') ? cloneValue(recipe.cookTime) : null,
        total: hasOwn(recipe, 'time') ? cloneValue(recipe.time) : null
      },
      budget: hasOwn(recipe, 'budget') ? cloneValue(recipe.budget) : null,
      tags: cloneValue(recipe.tags),
      ingredients: adaptIngredients(recipe.ingredients),
      steps: cloneValue(recipe.steps),
      equipment: hasOwn(recipe, 'equipment') ? cloneValue(recipe.equipment) : null,
      leftovers: hasOwn(recipe, 'leftovers') ? cloneValue(recipe.leftovers) : null,
      serving: hasOwn(recipe, 'serving') ? cloneValue(recipe.serving) : null,
      swaps: hasOwn(recipe, 'swaps') ? cloneValue(recipe.swaps) : null,
      tip: hasOwn(recipe, 'tip') ? cloneValue(recipe.tip) : null,
      doneness: hasOwn(recipe, 'doneness') ? cloneValue(recipe.doneness) : null,
      source: {
        kind: 'malix-original',
        provider: 'malix'
      },
      media: []
    };

    deepFreeze(canonicalRecipe);
    const validation = currentSchema.validateRecipe(canonicalRecipe);

    return deepFreeze({
      recipe: canonicalRecipe,
      validation,
      legacyMetadata: legacyMetadata(recipe)
    });
  }

  function adaptRecipes(input) {
    if (!Array.isArray(input)) throw new TypeError('adaptRecipes kräver en array.');
    return deepFreeze(input.map(adaptRecipe));
  }

  window.MalixLegacyRecipeAdapter = Object.freeze({
    adaptRecipe,
    adaptRecipes
  });
})();
