(() => {
  'use strict';

  const catalog = window.MalixParallelCanonicalCatalog;
  if (!catalog || !Array.isArray(catalog.entries)) {
    throw new Error('MalixParallelCanonicalCatalog.entries saknas.');
  }

  const increment = (counts, key) => {
    const normalizedKey = String(key);
    counts[normalizedKey] = (counts[normalizedKey] || 0) + 1;
  };

  const freezeCounts = counts => Object.freeze({ ...counts });

  const byStatus = {};
  const byDisplayValidity = {};
  const byRightsValidity = {};
  const byKitchenAutomationReadiness = {};
  const byPersistenceEligibility = {};
  const warningCodes = {};
  const errorCodes = {};

  const entries = Object.freeze(catalog.entries.map(entry => {
    const validation = entry.validation;
    const warnings = Array.isArray(validation?.warnings) ? validation.warnings : [];
    const errors = Array.isArray(validation?.errors) ? validation.errors : [];

    increment(byStatus, validation?.status);
    increment(byDisplayValidity, validation?.displayValidity);
    increment(byRightsValidity, validation?.rightsValidity);
    increment(byKitchenAutomationReadiness, validation?.kitchenAutomationReadiness);
    increment(byPersistenceEligibility, validation?.persistenceEligibility);
    warnings.forEach(row => increment(warningCodes, row?.code));
    errors.forEach(row => increment(errorCodes, row?.code));

    return Object.freeze({
      recipeId: entry.recipe?.id,
      status: validation?.status,
      displayValidity: validation?.displayValidity,
      rightsValidity: validation?.rightsValidity,
      kitchenAutomationReadiness: validation?.kitchenAutomationReadiness,
      persistenceEligibility: validation?.persistenceEligibility,
      warningCount: warnings.length,
      errorCount: errors.length
    });
  }));

  const summary = Object.freeze({
    total: entries.length,
    byStatus: freezeCounts(byStatus),
    byDisplayValidity: freezeCounts(byDisplayValidity),
    byRightsValidity: freezeCounts(byRightsValidity),
    byKitchenAutomationReadiness: freezeCounts(byKitchenAutomationReadiness),
    byPersistenceEligibility: freezeCounts(byPersistenceEligibility),
    warningCodes: freezeCounts(warningCodes),
    errorCodes: freezeCounts(errorCodes)
  });

  window.MalixCanonicalRecipeAnalysis = Object.freeze({
    entries,
    summary
  });
})();
