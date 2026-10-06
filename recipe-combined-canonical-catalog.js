(() => {
  'use strict';

  const malix = window.MalixParallelCanonicalCatalog;
  const imported = window.MalixImportedCanonicalCatalog;
  if (!malix || !Array.isArray(malix.entries)) {
    throw new Error('MalixParallelCanonicalCatalog.entries saknas.');
  }
  if (!imported || !Array.isArray(imported.entries)) {
    throw new Error('MalixImportedCanonicalCatalog.entries saknas.');
  }

  const entries = [...malix.entries, ...imported.entries];
  const ids = new Set();
  entries.forEach(entry => {
    const id = String(entry?.recipe?.id || '').trim();
    if (!id) throw new Error('Combined canonical recipe saknar id.');
    if (ids.has(id)) throw new Error(`Duplicate combined canonical recipe id: ${id}`);
    ids.add(id);
  });

  window.MalixCombinedCanonicalCatalog = Object.freeze({
    entries: Object.freeze(entries),
    info: Object.freeze({
      total: entries.length,
      malix: malix.entries.length,
      imported: imported.entries.length
    })
  });
})();
