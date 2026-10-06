(() => {
  'use strict';

  const schema = window.MalixRecipeSchema;
  if (!schema || typeof schema.validateRecipe !== 'function') {
    throw new Error('MalixRecipeSchema.validateRecipe saknas för Wikibooks-piloten.');
  }

  const LICENSE_URL = 'https://creativecommons.org/licenses/by-sa/4.0/';
  const IMPORTED_AT = '2026-10-06';

  const ingredient = (rawText, ingredientId = null, name = null, amount = null, unit = null, optional = false, note = null) => ({
    rawText,
    ingredientId,
    parentIngredientId: null,
    name,
    amount,
    unit,
    optional,
    note
  });

  const source = (sourceUrl, title) => ({
    kind: 'open-licensed',
    provider: 'Wikibooks Cookbook',
    sourceUrl,
    license: 'CC BY-SA 4.0',
    licenseUrl: LICENSE_URL,
    author: 'Wikibooks contributors',
    attribution: `${title}, Wikibooks Cookbook. Svensk bearbetning och översättning för Malix.`,
    importedAt: IMPORTED_AT,
    modified: true
  });

  const rawEntries = [
    {
      recipe: {
        id: 'wikibooks-honungs-senapslax',
        schemaVersion: 1,
        name: 'Honungs- och senapslax',
        language: 'sv',
        servings: 4,
        time: { prep: 10, cook: 18, total: 30 },
        budget: 'mid',
        tags: ['fisk', 'middag', 'snabbt', 'få ingredienser'],
        ingredients: [
          ingredient('600 g laxfilé', 'lax', 'Lax', 600, 'g'),
          ingredient('3 msk honung', null, 'Honung', 3, 'msk'),
          ingredient('2 msk dijonsenap eller grovkornig senap', null, null, 2, 'msk'),
          ingredient('0,25 tsk svartpeppar', 'svartpeppar', 'Svartpeppar', 0.25, 'tsk'),
          ingredient('1 msk citronjuice, valfritt', null, 'Citronjuice', 1, 'msk', true)
        ],
        steps: [
          'Sätt ugnen på 180 °C och lägg laxen i en lätt smord ugnsform.',
          'Rör ihop honung och senap till en jämn glaze. Smaka av så att balansen mellan sött och syrligt passar dig.',
          'Bred blandningen över laxen och strö över svartpeppar.',
          'Tillaga mitt i ugnen ungefär 15–18 minuter, beroende på laxens tjocklek.',
          'Pressa gärna över lite citron precis före servering.'
        ],
        tip: 'Malix-twist: lite citron och svartpeppar gör den söta senapen piggare utan att göra receptet krångligare.',
        source: source('https://en.wikibooks.org/wiki/Cookbook:Honey_Mustard_Salmon', 'Honey Mustard Salmon'),
        media: []
      },
      importMetadata: { emoji: '🐟', malixTwist: 'Citron och svartpeppar som enkel smakbalans.' }
    },
    {
      recipe: {
        id: 'wikibooks-kikartscurry',
        schemaVersion: 1,
        name: 'Vardaglig kikartscurry',
        language: 'sv',
        servings: 4,
        time: { prep: 15, cook: 25, total: 40 },
        budget: 'low',
        tags: ['vegetariskt', 'gryta', 'middag', 'budget'],
        ingredients: [
          ingredient('2 burkar kikärter, avrunna', 'kikarter', 'Kikärter', 2, 'st'),
          ingredient('1 st lök', 'lok', 'Lök', 1, 'st'),
          ingredient('1 st vitlöksklyfta', null, null, 1, 'st'),
          ingredient('2 st tomater, hackade', 'tomat', 'Tomat', 2, 'st'),
          ingredient('1 msk rapsolja', 'rapsolja', 'Rapsolja', 1, 'msk'),
          ingredient('1 msk garam masala', null, 'Garam masala', 1, 'msk'),
          ingredient('1 tsk gurkmeja', null, 'Gurkmeja', 1, 'tsk'),
          ingredient('1 tsk spiskummin, valfritt', null, 'Spiskummin', 1, 'tsk', true),
          ingredient('0,5 tsk salt', 'salt', 'Salt', 0.5, 'tsk'),
          ingredient('0,25 tsk chiliflakes, valfritt', 'chiliflakes', 'Chiliflakes', 0.25, 'tsk', true)
        ],
        steps: [
          'Skölj kikärterna och låt dem rinna av.',
          'Hacka löken och fräs den mjuk i oljan på medelvärme. Tillsätt finhackad vitlök mot slutet.',
          'Rör ner garam masala, gurkmeja och eventuellt spiskummin. Låt kryddorna bli varma en kort stund.',
          'Tillsätt tomater och låt dem mjukna till en enkel sås.',
          'Vänd ner kikärterna och låt allt småputtra cirka 15 minuter. Späd med lite vatten om grytan blir för torr.',
          'Smaka av med salt och, om du vill, lite chiliflakes. Servera med ris eller bröd.'
        ],
        tip: 'Malix-twist: chiliflakes är valfritt. Börja försiktigt och smaka av i stället för att göra grytan stark från början.',
        source: source('https://en.wikibooks.org/wiki/Cookbook:Cholley_(Chickpea_Curry)', 'Cholley (Chickpea Curry)'),
        media: []
      },
      importMetadata: { emoji: '🥘', malixTwist: 'Valfri chiliflakes och en förenklad vardagsversion med konserverade kikärter.' }
    },
    {
      recipe: {
        id: 'wikibooks-ortig-tomatsoppa',
        schemaVersion: 1,
        name: 'Örtig tomatsoppa',
        language: 'sv',
        servings: 4,
        time: { prep: 10, cook: 25, total: 35 },
        budget: 'low',
        tags: ['soppa', 'vegetariskt', 'lunch', 'budget'],
        ingredients: [
          ingredient('1 msk olivolja', null, 'Olivolja', 1, 'msk'),
          ingredient('1 st lök, hackad', 'lok', 'Lök', 1, 'st'),
          ingredient('400 g krossade tomater', null, 'Krossade tomater', 400, 'g'),
          ingredient('4 dl grönsaksbuljong', null, 'Grönsaksbuljong', 4, 'dl'),
          ingredient('3 dl passerade tomater', null, 'Passerade tomater', 3, 'dl'),
          ingredient('1 tsk torkad basilika', null, 'Basilika', 1, 'tsk'),
          ingredient('0,5 tsk torkad timjan', null, 'Timjan', 0.5, 'tsk'),
          ingredient('0,25 tsk svartpeppar', 'svartpeppar', 'Svartpeppar', 0.25, 'tsk'),
          ingredient('1 msk balsamvinäger, valfritt', null, 'Balsamvinäger', 1, 'msk', true)
        ],
        steps: [
          'Värm oljan i en kastrull och låt löken mjukna utan att få mycket färg.',
          'Häll i krossade tomater, passerade tomater och buljong.',
          'Tillsätt basilika, timjan och svartpeppar och låt soppan koka upp.',
          'Sänk värmen och sjud under lock ungefär 20 minuter.',
          'Smaka av. En liten skvätt balsamvinäger kan användas på slutet om du vill ha mer syra.'
        ],
        tip: 'Servera gärna med bröd eller en enkel varm smörgås när soppan ska bli en hel måltid.',
        source: source('https://en.wikibooks.org/wiki/Cookbook:Herbed_Tomato_Soup', 'Herbed Tomato Soup'),
        media: []
      },
      importMetadata: { emoji: '🍅', malixTwist: null }
    },
    {
      recipe: {
        id: 'wikibooks-hummus-snack',
        schemaVersion: 1,
        name: 'Enkel hummus',
        language: 'sv',
        servings: 6,
        time: { prep: 15, cook: 0, total: 15 },
        budget: 'low',
        tags: ['snacks', 'mellanmål', 'vegetariskt', 'röra', 'få ingredienser'],
        ingredients: [
          ingredient('2 burkar kikärter, avrunna', 'kikarter', 'Kikärter', 2, 'st'),
          ingredient('0,75 dl tahini', null, 'Tahini', 0.75, 'dl'),
          ingredient('0,75 dl citronjuice', null, 'Citronjuice', 0.75, 'dl'),
          ingredient('2 st vitlöksklyftor', null, null, 2, 'st'),
          ingredient('0,5 dl olivolja', null, 'Olivolja', 0.5, 'dl'),
          ingredient('0,5 tsk salt', 'salt', 'Salt', 0.5, 'tsk'),
          ingredient('0,25 tsk svartpeppar', 'svartpeppar', 'Svartpeppar', 0.25, 'tsk'),
          ingredient('0,5 dl vatten, ungefär', 'vatten', 'Vatten', 0.5, 'dl')
        ],
        steps: [
          'Skölj kikärterna och låt dem rinna av ordentligt.',
          'Mixa tahini och citronjuice först så att blandningen blir jämn.',
          'Tillsätt kikärter, vitlök, olivolja, salt och svartpeppar och mixa slätt.',
          'Späd med lite vatten i taget tills hummusen får den konsistens du tycker om.',
          'Smaka av och servera som dipp, på bröd eller tillsammans med grönsaksstavar.'
        ],
        tip: 'Malix-twist: strö gärna lite chiliflakes ovanpå om du vill ha mer sting, men låt grundröran vara mild.',
        source: source('https://en.wikibooks.org/wiki/Cookbook:Hummus_(Greek)', 'Hummus (Greek)'),
        media: []
      },
      importMetadata: { emoji: '🫓', malixTwist: 'Valfri chiliflakes som topping; vardagsversion med konserverade kikärter.' }
    },
    {
      recipe: {
        id: 'wikibooks-honungspannkakor',
        schemaVersion: 1,
        name: 'Pannkakor med honung',
        language: 'sv',
        servings: 4,
        time: { prep: 10, cook: 20, total: 30 },
        budget: 'low',
        tags: ['frukost', 'mellanmål', 'efterrätt'],
        ingredients: [
          ingredient('4 dl vetemjöl', null, 'Vetemjöl', 4, 'dl'),
          ingredient('2 tsk bakpulver', null, 'Bakpulver', 2, 'tsk'),
          ingredient('0,25 tsk salt', 'salt', 'Salt', 0.25, 'tsk'),
          ingredient('2 msk strösocker', null, 'Strösocker', 2, 'msk'),
          ingredient('4 dl mjölk', 'mjolk', 'Mjölk', 4, 'dl'),
          ingredient('2 st ägg', null, 'Ägg', 2, 'st'),
          ingredient('2 msk smält smör', null, 'Smör', 2, 'msk'),
          ingredient('honung till servering', null, 'Honung', null, null),
          ingredient('rostade sesamfrön, valfritt', null, 'Sesamfrön', null, null, true)
        ],
        steps: [
          'Blanda mjöl, bakpulver, salt och socker i en skål.',
          'Vispa ihop mjölk, ägg och smält smör i en annan skål.',
          'Rör ner det våta i det torra tills du har en jämn smet. Undvik att vispa längre än nödvändigt.',
          'Värm en stekpanna på medelvärme och smörj den lätt.',
          'Stek mindre pannkakor. Vänd när ytan börjar bubbla och undersidan fått färg.',
          'Servera varma med lite honung och eventuellt rostade sesamfrön.'
        ],
        tip: 'Frukt eller bär passar bra till om du vill göra frukosten eller mellanmålet mer varierat.',
        source: source('https://en.wikibooks.org/wiki/Cookbook:Pancakes_with_Honey', 'Pancakes with Honey'),
        media: []
      },
      importMetadata: { emoji: '🥞', malixTwist: null }
    }
  ];

  const entries = Object.freeze(rawEntries.map(entry => {
    const recipe = Object.freeze({
      ...entry.recipe,
      tags: Object.freeze([...entry.recipe.tags]),
      ingredients: Object.freeze(entry.recipe.ingredients.map(row => Object.freeze({ ...row }))),
      steps: Object.freeze([...entry.recipe.steps]),
      source: Object.freeze({ ...entry.recipe.source }),
      media: Object.freeze([])
    });
    return Object.freeze({
      recipe,
      validation: schema.validateRecipe(recipe),
      importMetadata: Object.freeze({ ...entry.importMetadata })
    });
  }));

  window.MalixImportedCanonicalCatalog = Object.freeze({
    provider: 'Wikibooks Cookbook',
    license: 'CC BY-SA 4.0',
    entries,
    info: Object.freeze({ total: entries.length })
  });
})();
