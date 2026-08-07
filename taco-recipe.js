(() => {
  if (typeof recipes === 'undefined' || !Array.isArray(recipes)) return;
  if (recipes.some(r => r.id === 'tacos-blandfars')) return;
  recipes.push({
    id:'tacos-blandfars',
    name:'Vanliga tacos med blandfärs',
    emoji:'🌮',
    time:30,
    budget:'mid',
    tags:['familj','köttfärs','snabbt'],
    ingredients:[
      '500 g blandfärs',
      'tacokrydda',
      'tacoskal',
      'crème fraîche eller gräddfil',
      'tomat',
      'gurka',
      'gul lök',
      'sallad',
      'majs',
      'pepperoni',
      'tacosås',
      'riven ost'
    ],
    leftovers:['tacofärs','grönsaker','riven ost'],
    plants:6,
    tip:'Ställ fram allt i små skålar så kan var och en bygga sin taco med de tillbehör den tycker om. Det som blir över kan bli tacotallrik eller lunch nästa dag.',
    steps:[
      'Bryn blandfärsen tills den är helt genomstekt.',
      'Tillsätt tacokrydda och den mängd vatten som behövs enligt kryddningen. Låt puttra några minuter.',
      'Hacka tomat, gurka, lök och sallad. Ställ fram majs, pepperoni, tacosås, ost och crème fraîche eller gräddfil.',
      'Värm tacoskalen och låt var och en fylla sin taco med det den tycker om.'
    ]
  });
  if (typeof renderRecipes === 'function') renderRecipes();
})();