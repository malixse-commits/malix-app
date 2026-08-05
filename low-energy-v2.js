(() => {
  const target = document.querySelector('#lowEnergyResults');
  const buttons = [...document.querySelectorAll('[data-energy]')];
  if (!target || !buttons.length || typeof recipes === 'undefined') return;

  const ideas = {
    none: [
      {title:'🥪 Smörgåstallrik',text:'Bröd + ett pålägg du har hemma. Lägg gärna till gurka, tomat eller en frukt om det finns.',recipe:'macka'},
      {title:'🥣 Fil eller yoghurt',text:'Fil/yoghurt + müsli eller havregryn + frukt eller bär. Färdigt på några minuter.',recipe:'fil'},
      {title:'🍌 Frukt + något mättande',text:'Ta en frukt tillsammans med yoghurt, kvarg, ostsmörgås eller annat du redan har hemma.'},
      {title:'🧀 Plockmåltid',text:'Ost, bröd/kex, grönsaker, frukt och rester från kylen. Det behöver inte bli en lagad rätt.'}
    ],
    five: [
      {title:'🥪 Varm smörgås',text:'Bröd, ost och valfritt pålägg. Värm tills osten smält. Lägg till tomat eller annan grönsak om du vill.',recipe:'macka'},
      {title:'🥣 Yoghurt- eller filskål',text:'Fil/yoghurt, müsli och bär eller frukt. Lägg till kvarg om du vill ha mer protein.',recipe:'fil'},
      {title:'🧄 Fetaostkräm och bröd',text:'Fetaostkräm med bröd och grönsaker blir en snabb liten måltid.',recipe:'fetaostkram'},
      {title:'🍳 Ägg och smörgås',text:'Koka eller stek ägg och ät med bröd och något grönt du har hemma.'}
    ],
    simple: [
      {title:'🥔 Potatissoppa på rester',text:'Har du potatismos över kan det snabbt bli soppa.',recipe:'potatissoppa'},
      {title:'🥔 Potatisbullar',text:'Överblivet potatismos, ägg och lite mjöl blir en ny måltid.',recipe:'potatisbullar'},
      {title:'🐟 Fiskpanetter med enkla tillbehör',text:'Låt ugnen göra jobbet och välj ett enkelt tillbehör.',recipe:'fiskpanetter'},
      {title:'🍝 Pasta med det som finns',text:'Koka pasta och blanda med pesto, tomatsås, ost, tonfisk eller rester du redan har.'},
      {title:'🍳 Omelett eller äggröra',text:'Ägg + det som behöver användas i kylen, till exempel ost, lök, tomat eller grönsaker.'},
      {title:'🥣 Enkel soppa',text:'Buljong, frysta grönsaker och något mättande som potatis, pasta, bönor eller linser.'}
    ]
  };

  function render(level) {
    const list = ideas[level] || [];
    buttons.forEach(b => b.classList.toggle('active', b.dataset.energy === level));
    target.innerHTML = `<div class="panel calm" style="grid-column:1/-1"><strong>${level==='none'?'Du behöver inte laga mat för att äta.':level==='five'?'Fem minuter räcker.':'Välj en enkel sak och låt resten vara enkelt.'}</strong><p style="margin:6px 0 0">Förslagen är genvägar, inte krav. Ta det som finns hemma och det som känns möjligt idag.</p></div>` + list.map(item => `<article class="recipe-card"><h3>${item.title}</h3><p>${item.text}</p>${item.recipe ? `<button type="button" class="primary" data-low-recipe="${item.recipe}">Öppna recept</button>` : `<button type="button" class="secondary" data-open-bank>Sök liknande i receptbanken</button>`}</article>`).join('');
  }

  buttons.forEach(button => button.addEventListener('click', event => {
    event.preventDefault(); event.stopImmediatePropagation(); render(button.dataset.energy);
  }, true));

  target.addEventListener('click', event => {
    const recipeButton = event.target.closest('[data-low-recipe]');
    if (recipeButton) { window.openRecipe?.(recipeButton.dataset.lowRecipe); return; }
    if (event.target.closest('[data-open-bank]')) {
      if (typeof show === 'function') show('recipeBank');
    }
  });

  render('none');
})();