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
      'tortillabröd eller tacoskal',
      'sallad',
      'tomat',
      'gurka',
      'majs',
      'riven ost',
      'tacosås',
      'gräddfil eller crème fraiche'
    ],
    leftovers:['tacofärs','grönsaker','riven ost'],
    plants:5,
    tip:'Ställ fram tillbehören var för sig så kan alla bygga sin egen taco. Det som blir över går bra att använda till tacotallrik, quesadillas eller lunch dagen efter.',
    steps:[
      'Bryn blandfärsen tills den är helt genomstekt.',
      'Tillsätt tacokrydda och den mängd vatten som behövs enligt kryddningen. Låt puttra några minuter.',
      'Skär sallad, tomat och gurka och ställ fram majs, ost, tacosås och gräddfil.',
      'Värm tortillabröd eller tacoskal och låt var och en fylla sin taco med det den tycker om.'
    ]
  });
  if (typeof renderRecipes === 'function') renderRecipes();
})();