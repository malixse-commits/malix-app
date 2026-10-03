(() => {
  'use strict';

  const SCHEMA_VERSION = 1;
  const KNOWN_UNITS = Object.freeze(new Set([
    'kg', 'g', 'l', 'dl', 'ml', 'tsk', 'msk', 'st', 'skiva', 'bit', 'portion'
  ]));

  const STATUS = Object.freeze({
    VALID: 'VALID',
    VALID_WITH_WARNINGS: 'VALID_WITH_WARNINGS',
    INVALID: 'INVALID'
  });

  const DISPLAY_VALIDITY = Object.freeze({
    VALID: 'VALID',
    INVALID: 'INVALID'
  });

  const RIGHTS_VALIDITY = Object.freeze({
    VALID: 'VALID',
    VALID_WITH_WARNINGS: 'VALID_WITH_WARNINGS',
    INVALID: 'INVALID',
    NOT_APPLICABLE: 'NOT_APPLICABLE'
  });

  const KITCHEN_READINESS = Object.freeze({
    READY: 'READY',
    PARTIAL: 'PARTIAL',
    UNSAFE: 'UNSAFE'
  });

  const PERSISTENCE_ELIGIBILITY = Object.freeze({
    PRODUCTION_ALLOWED: 'PRODUCTION_ALLOWED',
    DEVELOPMENT_ONLY: 'DEVELOPMENT_ONLY',
    RIGHTS_REVIEW_REQUIRED: 'RIGHTS_REVIEW_REQUIRED',
    INVALID: 'INVALID'
  });

  const SOURCE_KINDS = Object.freeze([
    'malix-original',
    'user-created',
    'open-licensed',
    'external-api'
  ]);

  const nonEmptyString = value => typeof value === 'string' && value.trim().length > 0;
  const nullableString = value => value == null || typeof value === 'string';
  const plainObject = value => !!value && typeof value === 'object' && !Array.isArray(value);
  const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value, key);

  function issue(code, path, message) {
    return Object.freeze({ code, path, message });
  }

  function resultStatus(errors, warnings) {
    if (errors.length) return STATUS.INVALID;
    if (warnings.length) return STATUS.VALID_WITH_WARNINGS;
    return STATUS.VALID;
  }

  function combineReadiness(values) {
    if (!values.length) return KITCHEN_READINESS.UNSAFE;
    if (values.every(value => value === KITCHEN_READINESS.READY)) return KITCHEN_READINESS.READY;
    if (values.every(value => value === KITCHEN_READINESS.UNSAFE)) return KITCHEN_READINESS.UNSAFE;
    return KITCHEN_READINESS.PARTIAL;
  }

  function validateIngredient(value) {
    const warnings = [];
    const errors = [];

    if (!plainObject(value)) {
      errors.push(issue('INGREDIENT_NOT_OBJECT', 'ingredient', 'Ingrediensen måste vara ett objekt.'));
      return Object.freeze({
        status: STATUS.INVALID,
        displayValidity: DISPLAY_VALIDITY.INVALID,
        kitchenAutomationReadiness: KITCHEN_READINESS.UNSAFE,
        canonicalIdentifierSupplied: false,
        warnings: Object.freeze(warnings),
        errors: Object.freeze(errors)
      });
    }

    if (!nonEmptyString(value.rawText)) {
      errors.push(issue('RAW_TEXT_REQUIRED', 'rawText', 'rawText måste innehålla läsbar ingredienstext.'));
    }

    if (!(value.ingredientId == null || nonEmptyString(value.ingredientId))) {
      errors.push(issue('INVALID_INGREDIENT_ID', 'ingredientId', 'ingredientId måste vara en icke-tom sträng eller null.'));
    }

    if (!(value.parentIngredientId == null || nonEmptyString(value.parentIngredientId))) {
      errors.push(issue('INVALID_PARENT_INGREDIENT_ID', 'parentIngredientId', 'parentIngredientId måste vara en icke-tom sträng eller null.'));
    }

    if (!(value.name == null || nonEmptyString(value.name))) {
      errors.push(issue('INVALID_INGREDIENT_NAME', 'name', 'name måste vara en icke-tom sträng eller null.'));
    }

    if (!(value.note == null || typeof value.note === 'string')) {
      errors.push(issue('INVALID_INGREDIENT_NOTE', 'note', 'note måste vara en sträng eller null.'));
    }

    if (hasOwn(value, 'optional') && typeof value.optional !== 'boolean') {
      errors.push(issue('INVALID_OPTIONAL_FLAG', 'optional', 'optional måste vara boolean när fältet finns.'));
    }

    let amountReady = false;
    if (value.amount == null) {
      warnings.push(issue('AMOUNT_MISSING', 'amount', 'Mängd saknas för köksanalys.'));
    } else if (typeof value.amount !== 'number' || !Number.isFinite(value.amount) || value.amount <= 0) {
      warnings.push(issue('INVALID_AMOUNT', 'amount', 'Mängd måste vara ett positivt ändligt tal för köksanalys.'));
    } else {
      amountReady = true;
    }

    let unitReady = false;
    if (value.unit == null) {
      warnings.push(issue('UNIT_MISSING', 'unit', 'Enhet saknas för köksanalys.'));
    } else if (typeof value.unit !== 'string' || !value.unit.trim()) {
      warnings.push(issue('INVALID_UNIT', 'unit', 'Enheten är inte användbar för köksanalys.'));
    } else if (!KNOWN_UNITS.has(value.unit.trim().toLowerCase())) {
      warnings.push(issue('UNSUPPORTED_AUTOMATION_UNIT', 'unit', 'Enheten är läsbar men inte strukturellt redo för köksautomation.'));
    } else {
      unitReady = true;
    }

    const canonicalIdentifierSupplied = nonEmptyString(value.ingredientId);
    let kitchenAutomationReadiness = KITCHEN_READINESS.UNSAFE;
    if (canonicalIdentifierSupplied && amountReady && unitReady) {
      kitchenAutomationReadiness = KITCHEN_READINESS.READY;
    } else if (canonicalIdentifierSupplied || amountReady || unitReady) {
      kitchenAutomationReadiness = KITCHEN_READINESS.PARTIAL;
    }

    if (!canonicalIdentifierSupplied) {
      warnings.push(issue('NO_CANONICAL_ID', 'ingredientId', 'Ingen canonical ingredient-identitet är angiven.'));
    }

    const displayValidity = errors.some(row => row.code === 'RAW_TEXT_REQUIRED' || row.code === 'INGREDIENT_NOT_OBJECT')
      ? DISPLAY_VALIDITY.INVALID
      : DISPLAY_VALIDITY.VALID;

    return Object.freeze({
      status: resultStatus(errors, warnings),
      displayValidity,
      kitchenAutomationReadiness,
      canonicalIdentifierSupplied,
      warnings: Object.freeze(warnings),
      errors: Object.freeze(errors)
    });
  }

  function validateSource(value) {
    const warnings = [];
    const errors = [];
    let rightsValidity = RIGHTS_VALIDITY.NOT_APPLICABLE;
    let persistenceEligibility = PERSISTENCE_ELIGIBILITY.INVALID;

    if (!plainObject(value)) {
      errors.push(issue('SOURCE_NOT_OBJECT', 'source', 'source måste vara ett objekt.'));
      return Object.freeze({
        status: STATUS.INVALID,
        rightsValidity: RIGHTS_VALIDITY.INVALID,
        persistenceEligibility,
        warnings: Object.freeze(warnings),
        errors: Object.freeze(errors)
      });
    }

    if (!SOURCE_KINDS.includes(value.kind)) {
      errors.push(issue('UNKNOWN_SOURCE_KIND', 'source.kind', 'Okänd source.kind.'));
      return Object.freeze({
        status: STATUS.INVALID,
        rightsValidity: RIGHTS_VALIDITY.INVALID,
        persistenceEligibility,
        warnings: Object.freeze(warnings),
        errors: Object.freeze(errors)
      });
    }

    if (value.kind === 'malix-original') {
      if (value.provider !== 'malix') {
        errors.push(issue('MALIX_PROVIDER_REQUIRED', 'source.provider', 'malix-original kräver provider="malix".'));
      }
      rightsValidity = RIGHTS_VALIDITY.NOT_APPLICABLE;
      persistenceEligibility = errors.length
        ? PERSISTENCE_ELIGIBILITY.INVALID
        : PERSISTENCE_ELIGIBILITY.PRODUCTION_ALLOWED;
    }

    if (value.kind === 'user-created') {
      rightsValidity = RIGHTS_VALIDITY.NOT_APPLICABLE;
      persistenceEligibility = PERSISTENCE_ELIGIBILITY.PRODUCTION_ALLOWED;
    }

    if (value.kind === 'open-licensed') {
      const requiredStrings = ['provider', 'sourceUrl', 'license', 'licenseUrl', 'author', 'attribution', 'importedAt'];
      requiredStrings.forEach(key => {
        if (!nonEmptyString(value[key])) {
          warnings.push(issue('OPEN_LICENSED_PROVENANCE_REQUIRED', `source.${key}`, `${key} krävs för produktionsgodkänd open-licensed provenance.`));
        }
      });
      if (typeof value.modified !== 'boolean') {
        warnings.push(issue('OPEN_LICENSED_MODIFIED_REQUIRED', 'source.modified', 'modified måste vara boolean för open-licensed provenance.'));
      }
      if (warnings.length) {
        rightsValidity = RIGHTS_VALIDITY.INVALID;
        persistenceEligibility = PERSISTENCE_ELIGIBILITY.RIGHTS_REVIEW_REQUIRED;
      } else {
        rightsValidity = RIGHTS_VALIDITY.VALID;
        persistenceEligibility = PERSISTENCE_ELIGIBILITY.PRODUCTION_ALLOWED;
      }
    }

    if (value.kind === 'external-api') {
      ['provider', 'externalId', 'importedAt'].forEach(key => {
        if (!nonEmptyString(value[key])) {
          errors.push(issue('EXTERNAL_API_SOURCE_REQUIRED', `source.${key}`, `${key} krävs för external-api source.`));
        }
      });
      rightsValidity = RIGHTS_VALIDITY.VALID_WITH_WARNINGS;
      persistenceEligibility = errors.length
        ? PERSISTENCE_ELIGIBILITY.INVALID
        : PERSISTENCE_ELIGIBILITY.DEVELOPMENT_ONLY;
      if (!errors.length) {
        warnings.push(issue('EXTERNAL_API_DEVELOPMENT_ONLY', 'source', 'Extern API-källa är DEVELOPMENT_ONLY tills separat produktionsrättighet har godkänts.'));
      }
    }

    return Object.freeze({
      status: resultStatus(errors, warnings),
      rightsValidity,
      persistenceEligibility,
      warnings: Object.freeze(warnings),
      errors: Object.freeze(errors)
    });
  }

  function validateMedia(value) {
    const warnings = [];
    const errors = [];
    let rightsValidity = RIGHTS_VALIDITY.NOT_APPLICABLE;
    let persistenceEligibility = PERSISTENCE_ELIGIBILITY.PRODUCTION_ALLOWED;

    if (!plainObject(value)) {
      errors.push(issue('MEDIA_NOT_OBJECT', 'media', 'Media måste vara ett objekt.'));
      return Object.freeze({
        status: STATUS.INVALID,
        rightsValidity: RIGHTS_VALIDITY.INVALID,
        persistenceEligibility: PERSISTENCE_ELIGIBILITY.INVALID,
        warnings: Object.freeze(warnings),
        errors: Object.freeze(errors)
      });
    }

    if (!nonEmptyString(value.kind)) {
      errors.push(issue('MEDIA_KIND_REQUIRED', 'media.kind', 'media.kind krävs.'));
    }

    const hasUrl = nonEmptyString(value.url);
    const hasLocalAsset = nonEmptyString(value.localAsset);
    if (hasUrl === hasLocalAsset) {
      errors.push(issue('MEDIA_REFERENCE_REQUIRED', 'media', 'Media måste ha exakt en av url eller localAsset.'));
    }

    const rightsControlledExternally = value.kind === 'external' || value.kind === 'open-licensed';
    if (rightsControlledExternally) {
      ['creator', 'sourceUrl', 'license', 'licenseUrl', 'attribution'].forEach(key => {
        if (!nonEmptyString(value[key])) {
          warnings.push(issue('MEDIA_RIGHTS_REQUIRED', `media.${key}`, `${key} krävs för extern/open-licensed media.`));
        }
      });
      if (warnings.length) {
        rightsValidity = RIGHTS_VALIDITY.INVALID;
        persistenceEligibility = PERSISTENCE_ELIGIBILITY.RIGHTS_REVIEW_REQUIRED;
      } else {
        rightsValidity = RIGHTS_VALIDITY.VALID;
      }
    }

    if (errors.length) {
      persistenceEligibility = PERSISTENCE_ELIGIBILITY.INVALID;
      if (rightsValidity === RIGHTS_VALIDITY.NOT_APPLICABLE) rightsValidity = RIGHTS_VALIDITY.INVALID;
    }

    return Object.freeze({
      status: resultStatus(errors, warnings),
      rightsValidity,
      persistenceEligibility,
      warnings: Object.freeze(warnings),
      errors: Object.freeze(errors)
    });
  }

  function validateRecipe(value) {
    const warnings = [];
    const errors = [];

    if (!plainObject(value)) {
      errors.push(issue('RECIPE_NOT_OBJECT', 'recipe', 'Receptet måste vara ett objekt.'));
      return Object.freeze({
        status: STATUS.INVALID,
        displayValidity: DISPLAY_VALIDITY.INVALID,
        rightsValidity: RIGHTS_VALIDITY.INVALID,
        kitchenAutomationReadiness: KITCHEN_READINESS.UNSAFE,
        persistenceEligibility: PERSISTENCE_ELIGIBILITY.INVALID,
        warnings: Object.freeze(warnings),
        errors: Object.freeze(errors)
      });
    }

    if (!nonEmptyString(value.id)) errors.push(issue('RECIPE_ID_REQUIRED', 'id', 'id krävs.'));
    if (value.schemaVersion !== SCHEMA_VERSION) errors.push(issue('UNSUPPORTED_SCHEMA_VERSION', 'schemaVersion', `Endast schemaVersion ${SCHEMA_VERSION} stöds.`));
    if (!nonEmptyString(value.name)) errors.push(issue('RECIPE_NAME_REQUIRED', 'name', 'name krävs.'));
    if (!nonEmptyString(value.language)) errors.push(issue('RECIPE_LANGUAGE_REQUIRED', 'language', 'language krävs.'));
    if (!Array.isArray(value.tags)) errors.push(issue('RECIPE_TAGS_ARRAY_REQUIRED', 'tags', 'tags måste vara en array.'));
    if (!Array.isArray(value.ingredients)) errors.push(issue('RECIPE_INGREDIENTS_ARRAY_REQUIRED', 'ingredients', 'ingredients måste vara en array.'));
    if (!Array.isArray(value.steps)) errors.push(issue('RECIPE_STEPS_ARRAY_REQUIRED', 'steps', 'steps måste vara en array.'));
    if (!plainObject(value.source)) errors.push(issue('RECIPE_SOURCE_REQUIRED', 'source', 'source måste vara ett objekt.'));
    if (!Array.isArray(value.media)) errors.push(issue('RECIPE_MEDIA_ARRAY_REQUIRED', 'media', 'media måste vara en array.'));

    if (value.servings != null && (typeof value.servings !== 'number' || !Number.isFinite(value.servings) || value.servings <= 0)) {
      warnings.push(issue('INVALID_SERVINGS', 'servings', 'servings bör vara ett positivt ändligt tal eller null.'));
    }

    if (value.time != null && !plainObject(value.time)) {
      warnings.push(issue('INVALID_TIME_OBJECT', 'time', 'time bör vara ett objekt eller null.'));
    } else if (plainObject(value.time)) {
      ['prep', 'cook', 'total'].forEach(key => {
        const timeValue = value.time[key];
        if (timeValue != null && (typeof timeValue !== 'number' || !Number.isFinite(timeValue) || timeValue < 0)) {
          warnings.push(issue('INVALID_TIME_VALUE', `time.${key}`, `${key} bör vara ett icke-negativt ändligt tal eller null.`));
        }
      });
    }

    const optionalArrays = ['equipment', 'leftovers'];
    optionalArrays.forEach(key => {
      if (value[key] != null && !Array.isArray(value[key])) warnings.push(issue('INVALID_OPTIONAL_ARRAY', key, `${key} bör vara en array när fältet finns.`));
    });
    ['budget', 'serving', 'swaps', 'tip', 'doneness'].forEach(key => {
      if (!nullableString(value[key])) warnings.push(issue('INVALID_OPTIONAL_TEXT', key, `${key} bör vara en sträng eller null.`));
    });

    const ingredientResults = Array.isArray(value.ingredients)
      ? value.ingredients.map(validateIngredient)
      : [];
    ingredientResults.forEach((result, index) => {
      result.warnings.forEach(row => warnings.push(issue(row.code, `ingredients[${index}].${row.path}`, row.message)));
      result.errors.forEach(row => errors.push(issue(row.code, `ingredients[${index}].${row.path}`, row.message)));
    });

    if (Array.isArray(value.ingredients) && value.ingredients.length === 0) {
      warnings.push(issue('INGREDIENTS_EMPTY', 'ingredients', 'Receptet saknar ingredienser.'));
    }
    if (Array.isArray(value.steps) && value.steps.length === 0) {
      warnings.push(issue('STEPS_EMPTY', 'steps', 'Receptet saknar steg.'));
    }

    const sourceResult = plainObject(value.source)
      ? validateSource(value.source)
      : Object.freeze({
          status: STATUS.INVALID,
          rightsValidity: RIGHTS_VALIDITY.INVALID,
          persistenceEligibility: PERSISTENCE_ELIGIBILITY.INVALID,
          warnings: Object.freeze([]),
          errors: Object.freeze([])
        });

    if (plainObject(value.source)) {
      sourceResult.warnings.forEach(row => warnings.push(issue(row.code, row.path, row.message)));
      sourceResult.errors.forEach(row => errors.push(issue(row.code, row.path, row.message)));
    }

    const mediaResults = Array.isArray(value.media) ? value.media.map(validateMedia) : [];
    mediaResults.forEach((result, index) => {
      result.warnings.forEach(row => warnings.push(issue(row.code, `media[${index}].${row.path}`, row.message)));
      result.errors.forEach(row => warnings.push(issue(row.code, `media[${index}].${row.path}`, row.message)));
    });

    const hardRecipeErrors = errors.filter(row => !row.path.startsWith('source.'));
    const displayValidity = hardRecipeErrors.length
      ? DISPLAY_VALIDITY.INVALID
      : DISPLAY_VALIDITY.VALID;

    const rightsValues = [sourceResult.rightsValidity, ...mediaResults.map(result => result.rightsValidity)];
    let rightsValidity = RIGHTS_VALIDITY.NOT_APPLICABLE;
    if (rightsValues.includes(RIGHTS_VALIDITY.INVALID)) rightsValidity = RIGHTS_VALIDITY.INVALID;
    else if (rightsValues.includes(RIGHTS_VALIDITY.VALID_WITH_WARNINGS)) rightsValidity = RIGHTS_VALIDITY.VALID_WITH_WARNINGS;
    else if (rightsValues.includes(RIGHTS_VALIDITY.VALID)) rightsValidity = RIGHTS_VALIDITY.VALID;

    const persistenceValues = [sourceResult.persistenceEligibility, ...mediaResults.map(result => result.persistenceEligibility)];
    let persistenceEligibility = PERSISTENCE_ELIGIBILITY.PRODUCTION_ALLOWED;
    if (persistenceValues.includes(PERSISTENCE_ELIGIBILITY.INVALID)) persistenceEligibility = PERSISTENCE_ELIGIBILITY.INVALID;
    else if (persistenceValues.includes(PERSISTENCE_ELIGIBILITY.DEVELOPMENT_ONLY)) persistenceEligibility = PERSISTENCE_ELIGIBILITY.DEVELOPMENT_ONLY;
    else if (persistenceValues.includes(PERSISTENCE_ELIGIBILITY.RIGHTS_REVIEW_REQUIRED)) persistenceEligibility = PERSISTENCE_ELIGIBILITY.RIGHTS_REVIEW_REQUIRED;

    const kitchenAutomationReadiness = combineReadiness(
      ingredientResults.map(result => result.kitchenAutomationReadiness)
    );

    let status = STATUS.VALID;
    if (displayValidity === DISPLAY_VALIDITY.INVALID || sourceResult.status === STATUS.INVALID) {
      status = STATUS.INVALID;
    } else if (warnings.length || rightsValidity === RIGHTS_VALIDITY.INVALID || rightsValidity === RIGHTS_VALIDITY.VALID_WITH_WARNINGS) {
      status = STATUS.VALID_WITH_WARNINGS;
    }

    return Object.freeze({
      status,
      displayValidity,
      rightsValidity,
      kitchenAutomationReadiness,
      persistenceEligibility,
      warnings: Object.freeze(warnings),
      errors: Object.freeze(errors)
    });
  }

  const namespace = Object.freeze({
    schemaVersion: SCHEMA_VERSION,
    validateRecipe,
    validateIngredient,
    validateSource,
    validateMedia,
    statuses: Object.freeze({
      status: STATUS,
      displayValidity: DISPLAY_VALIDITY,
      rightsValidity: RIGHTS_VALIDITY,
      kitchenAutomationReadiness: KITCHEN_READINESS,
      persistenceEligibility: PERSISTENCE_ELIGIBILITY
    }),
    sourceKinds: SOURCE_KINDS,
    knownAutomationUnits: Object.freeze([...KNOWN_UNITS])
  });

  window.MalixRecipeSchema = namespace;
})();
