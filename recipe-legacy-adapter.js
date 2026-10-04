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

  function cloneArray(value) {
    return Array.isArray(value) ? value.slice() : value;
  }

  function adaptIngredient(value) {
    if (typeof value !== 'string') return value;
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
    if (!Array.isArray(value)) return value;
    return value.map(adaptIngredient);
  }

  function legacyMetadata(recipe) {
    const metadata = {};
    LEGACY_METADATA_FIELDS.forEach(key => {
      if (hasOwn(recipe, key)) metadata[key] = recipe[key];
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

  function adaptRecipe(recipe) {
    if (!recipe || typeof recipe !== 'object' || Array.isArray(recipe)) {
      const canonicalRecipe = deepFreeze({
        id: undefined,
        schemaVersion: schema().schemaVersion,
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
      return deepFreeze({
        recipe: canonicalRecipe,
        validation: schema().validateRecipe(canonicalRecipe),
        legacyMetadata: {}
      });
    }

    const currentSchema = schema();
    const canonicalRecipe = {
      id: recipe.id,
      schemaVersion: currentSchema.schemaVersion,
      name: recipe.name,
      language: 'sv',
      servings: hasOwn(recipe, 'servings') ? recipe.servings : null,
      time: {
        prep: hasOwn(recipe, 'prepTime') ? recipe.prepTime : null,
        cook: hasOwn(recipe, 'cookTime') ? recipe.cookTime : null,
        total: hasOwn(recipe, 'time') ? recipe.time : null
      },
      budget: hasOwn(recipe, 'budget') ? recipe.budget : null,
      tags: cloneArray(recipe.tags),
      ingredients: adaptIngredients(recipe.ingredients),
      steps: cloneArray(recipe.steps),
      equipment: hasOwn(recipe, 'equipment') ? cloneArray(recipe.equipment) : null,
      leftovers: hasOwn(recipe, 'leftovers') ? cloneArray(recipe.leftovers) : null,
      serving: hasOwn(recipe, 'serving') ? recipe.serving : null,
      swaps: hasOwn(recipe, 'swaps') ? recipe.swaps : null,
      tip: hasOwn(recipe, 'tip') ? recipe.tip : null,
      doneness: hasOwn(recipe, 'doneness') ? recipe.doneness : null,
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
