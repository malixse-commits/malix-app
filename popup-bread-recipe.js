(() => {
  if (typeof recipes === 'undefined' || !Array.isArray(recipes)) return;
  if (recipes.some(r => r.id === 'popupbrod')) return;

  recipes.push({
    id: 'popupbrod',
    name: 'Glutenfritt popup-bröd',
    emoji: '🥖',
    time: 35,
    budget: 'low',
    tags: ['vegetariskt','bröd','tillbehör','soppa','gryta','glutenfritt'],
    ingredients: [
      '3 ägg',
      '3 dl mjölk',
      '1 nypa salt',
      '150 g glutenfri mjölmix',
      '40 g smält smör',
      '1 tsk fiberhusk – kan uteslutas'
    ],
    leftovers: [],
    plants: 1,
    tip: 'Påminner om Yorkshire pudding men bakas i muffinsformar. Gott till soppa, gryta, chili con carne, kålpudding eller som ett luftigare bröd till sallad.',
    serving: 'Servera gärna varmt till soppa eller gryta. Det passar också till chili con carne och kålpudding, där brödet kan suga upp sås eller sky.',
    steps: [
      'Sätt ugnen på 220 grader.',
      'Vispa ihop ägg, mjölk och salt.',
      'Tillsätt glutenfri mjölmix och fiberhusk. Vispa till en slät smet.',
      'Låt smeten vila 5–10 minuter.',
      'Smält smöret och fördela det i muffinsformar.',
      'Häll i smeten till cirka hälften av formarna.',
      'Grädda mitt i ugnen i cirka 20–25 minuter tills bröden puffat upp och fått fin färg.'
    ]
  });
})();