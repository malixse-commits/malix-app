(() => {
  if (typeof recipes === 'undefined' || !Array.isArray(recipes)) return;

  // En enda samlingspunkt för hela receptbanken medan gamla receptfiler
  // successivt flyttas hit. Ingen receptdata ändras i detta steg.
  const byId = new Map();
  const duplicates = [];

  recipes.forEach((recipe, index) => {
    const id = String(recipe?.id || '').trim();
    if (!id) return;
    if (byId.has(id)) duplicates.push({ id, firstIndex: byId.get(id).index, duplicateIndex: index });
    else byId.set(id, { recipe, index });
  });

  const catalog = [...byId.values()].map(entry => entry.recipe);
  const categories = {};
  catalog.forEach(recipe => {
    (Array.isArray(recipe.tags) ? recipe.tags : []).forEach(tag => {
      categories[tag] = (categories[tag] || 0) + 1;
    });
  });

  window.malixRecipeCatalog = catalog;
  window.malixRecipeCatalogInfo = {
    totalLoaded: recipes.length,
    uniqueRecipes: catalog.length,
    duplicateIds: duplicates,
    categories
  };

  // Receptbanken arbetar vidare med samma array så befintliga funktioner
  // fortsätter fungera. Om dubbletter finns tas bara senare kopior bort.
  if (duplicates.length) {
    const seen = new Set();
    for (let i = recipes.length - 1; i >= 0; i--) {
      const id = String(recipes[i]?.id || '').trim();
      if (!id) continue;
      if (seen.has(id)) recipes.splice(i, 1);
      else seen.add(id);
    }
  }

  document.dispatchEvent(new CustomEvent('malix-recipe-catalog-ready', {
    detail: window.malixRecipeCatalogInfo
  }));
})();