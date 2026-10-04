(() => {
  'use strict';

  const rawEntries = [
    { id: 'potatis', name: 'Potatis', parentIngredientId: null, aliases: [] },
    { id: 'potatismos', name: 'Potatismos', parentIngredientId: null, aliases: [] },
    { id: 'korv', name: 'Korv', parentIngredientId: null, aliases: [] },
    { id: 'falukorv', name: 'Falukorv', parentIngredientId: 'korv', aliases: [] },
    { id: 'prinskorv', name: 'Prinskorv', parentIngredientId: 'korv', aliases: [] },
    { id: 'chorizo', name: 'Chorizo', parentIngredientId: 'korv', aliases: [] },
    { id: 'fisk', name: 'Fisk', parentIngredientId: null, aliases: [] },
    { id: 'lax', name: 'Lax', parentIngredientId: 'fisk', aliases: [] },
    { id: 'torsk', name: 'Torsk', parentIngredientId: 'fisk', aliases: [] },
    { id: 'sej', name: 'Sej', parentIngredientId: 'fisk', aliases: [] },
    { id: 'ost', name: 'Ost', parentIngredientId: null, aliases: [] },
    { id: 'fetaost', name: 'Fetaost', parentIngredientId: 'ost', aliases: ['feta'] },
    { id: 'mozzarella', name: 'Mozzarella', parentIngredientId: 'ost', aliases: [] },
    { id: 'yoghurt', name: 'Yoghurt', parentIngredientId: null, aliases: [] },
    { id: 'turkisk-yoghurt', name: 'Turkisk yoghurt', parentIngredientId: 'yoghurt', aliases: [] },
    { id: 'grekisk-yoghurt', name: 'Grekisk yoghurt', parentIngredientId: 'yoghurt', aliases: [] },
    { id: 'kottfars', name: 'Köttfärs', parentIngredientId: null, aliases: [] },
    { id: 'notfars', name: 'Nötfärs', parentIngredientId: 'kottfars', aliases: [] },
    { id: 'blandfars', name: 'Blandfärs', parentIngredientId: 'kottfars', aliases: [] },
    { id: 'flaskfars', name: 'Fläskfärs', parentIngredientId: 'kottfars', aliases: [] },
    { id: 'kikarter', name: 'Kikärter', parentIngredientId: null, aliases: ['kikärtor'] },
    { id: 'gul-lok', name: 'Gul lök', parentIngredientId: null, aliases: [] },
    { id: 'rod-lok', name: 'Rödlök', parentIngredientId: null, aliases: ['röd lök'] },
    { id: 'vitlok', name: 'Vitlök', parentIngredientId: null, aliases: [] },
    { id: 'morot', name: 'Morot', parentIngredientId: null, aliases: ['morötter'] },
    { id: 'tomat', name: 'Tomat', parentIngredientId: null, aliases: ['tomater'] },
    { id: 'paprika', name: 'Paprika', parentIngredientId: null, aliases: [] },
    { id: 'zucchini', name: 'Zucchini', parentIngredientId: null, aliases: ['squash'] },
    { id: 'mjolk', name: 'Mjölk', parentIngredientId: null, aliases: [] },
    { id: 'matlagningsgradde', name: 'Matlagningsgrädde', parentIngredientId: null, aliases: [] },
    { id: 'ris', name: 'Ris', parentIngredientId: null, aliases: [] },
    { id: 'pasta', name: 'Pasta', parentIngredientId: null, aliases: [] }
  ];

  const normalizeLabel = value => String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9åäö]+/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const normalizeId = value => String(value || '').trim().toLowerCase();

  function freezeEntry(entry) {
    return Object.freeze({
      id: entry.id,
      name: entry.name,
      parentIngredientId: entry.parentIngredientId,
      aliases: Object.freeze([...entry.aliases])
    });
  }

  const entries = Object.freeze(rawEntries.map(freezeEntry));
  const byId = new Map();
  const exactLabels = new Map();

  entries.forEach(entry => {
    const id = normalizeId(entry.id);
    if (!id || byId.has(id)) throw new Error(`Duplicate ingredient id: ${entry.id}`);
    byId.set(id, entry);
  });

  entries.forEach(entry => {
    if (entry.parentIngredientId != null && !byId.has(normalizeId(entry.parentIngredientId))) {
      throw new Error(`Unknown parent ingredient id: ${entry.parentIngredientId}`);
    }

    const labels = [entry.name, ...entry.aliases];
    labels.forEach(label => {
      const normalized = normalizeLabel(label);
      if (!normalized) throw new Error(`Empty ingredient label for: ${entry.id}`);
      const existing = exactLabels.get(normalized);
      if (existing && existing.id !== entry.id) {
        throw new Error(`Ingredient label collision: ${label}`);
      }
      exactLabels.set(normalized, entry);
    });
  });

  entries.forEach(entry => {
    const visited = new Set([entry.id]);
    let parentId = entry.parentIngredientId;
    while (parentId != null) {
      if (visited.has(parentId)) throw new Error(`Ingredient parent cycle: ${entry.id}`);
      visited.add(parentId);
      parentId = byId.get(normalizeId(parentId))?.parentIngredientId ?? null;
    }
  });

  function getById(id) {
    return byId.get(normalizeId(id)) || null;
  }

  function resolveExact(value) {
    const byCanonicalId = getById(value);
    if (byCanonicalId) return byCanonicalId;
    return exactLabels.get(normalizeLabel(value)) || null;
  }

  window.MalixIngredientCatalog = Object.freeze({
    entries,
    getById,
    resolveExact
  });
})();
