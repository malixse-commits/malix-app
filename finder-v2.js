(() => {
  if (typeof recipes === 'undefined' || !Array.isArray(recipes)) return;

  const sausageRecipes = [
    {
      id:'kokt-korv-mos', name:'Kokt korv med potatismos', emoji:'🌭', time:25, budget:'low',
      tags:['korv','snabbt','familj','budget'],
      ingredients:['grillkorv eller kokkorv','potatis','mjölk','smör','ärtor','senap eller ketchup'],
      leftovers:['potatismos','korv'],
      tip:'En enkel vardagsrätt. Har du färdigt mos går den ännu snabbare.',
      steps:['Koka potatisen mjuk och gör potatismos med mjölk och smör.','Värm korven försiktigt i hett vatten utan att låta den koka sönder.','Värm ärtor.','Servera med senap eller ketchup efter smak.']
    },
    {
      id:'falukorv-makaroner', name:'Stekt falukorv med makaroner', emoji:'🌭', time:20, budget:'low',
      tags:['korv','snabbt','familj','budget'],
      ingredients:['falukorv','makaroner','grönsaker','ketchup eller senap'],
      leftovers:['falukorv','makaroner'],
      tip:'Kokta makaroner från dagen innan gör middagen ännu snabbare.',
      steps:['Koka makaronerna.','Skiva falukorven och stek den.','Lägg till de grönsaker du vill ha.','Servera med ketchup eller senap om du tycker om det.']
    },
    {
      id:'falukorv-ugn', name:'Ugnsbakad falukorv med potatismos', emoji:'🌭', time:45, budget:'low',
      tags:['korv','familj','budget'],
      ingredients:['falukorv','tomat','gul lök','senap','ost','potatis','mjölk','smör'],
      leftovers:['falukorv','potatismos'],
      tip:'Fyll snitten med det du tycker om – tomat, lök, senap och ost är en klassisk kombination.',
      steps:['Skär snitt i falukorven utan att skära hela vägen igenom.','Fyll med tomat, lök, senap och ost.','Baka i ugn tills korven är genomvarm och osten fått färg.','Servera med potatismos.']
    },
    {
      id:'flaskkorv-rotmos', name:'Fläskkorv med rotmos', emoji:'🌭', time:50, budget:'mid',
      tags:['korv','familj'],
      ingredients:['fläskkorv','potatis','kålrot','morot','smör','buljong','senap'],
      leftovers:['rotmos'],
      tip:'Rotmos kan göras i större sats och användas till en annan måltid dagen efter.',
      steps:['Skala och koka potatis, kålrot och morot mjuka.','Mosa med lite kokspad eller buljong och smör.','Tillaga fläskkorven enligt förpackningens anvisning tills den är genomvarm.','Servera med senap.']
    },
    {
      id:'kottkorv-potatis', name:'Köttkorv med kokt potatis och senapssås', emoji:'🌭', time:35, budget:'mid',
      tags:['korv','familj'],
      ingredients:['köttkorv','potatis','mjölk','smör','mjöl','senap','grönsaker'],
      leftovers:['potatis','korv'],
      tip:'Senapssåsen kan göras mild eller stark efter smak.',
      steps:['Koka potatisen.','Tillaga köttkorven enligt förpackningens anvisning.','Gör en enkel vit sås och smaka av med senap.','Servera med valfria grönsaker.']
    },
    {
      id:'prinskorv-stekt-potatis', name:'Prinskorv med stekt potatis och ägg', emoji:'🌭', time:25, budget:'mid',
      tags:['korv','snabbt','familj','ta-vad-du-har'],
      ingredients:['prinskorv','kokt potatis','ägg','gul lök','grönsaker'],
      leftovers:['potatis','prinskorv'],
      tip:'Passar särskilt bra när det finns kokt potatis kvar.',
      steps:['Skiva den kokta potatisen och stek med lök.','Stek prinskorven genomvarm.','Stek ägg.','Servera med grönsaker.']
    }
  ];

  sausageRecipes.forEach(recipe => {
    if (!recipes.some(r => String(r.id) === recipe.id)) recipes.push(recipe);
  });

  const finder = document.querySelector('#finder');
  if (finder) {
    const tagRow = finder.querySelector('[data-finder="tag"]')?.parentElement;
    if (tagRow && !tagRow.querySelector('[data-finder="tag"][data-value="korv"]')) {
      const button = document.createElement('button');
      button.type='button';
      button.dataset.finder='tag';
      button.dataset.value='korv';
      button.textContent='Korv';
      const surprise = tagRow.querySelector('[data-value="överraska"]');
      tagRow.insertBefore(button, surprise || null);
    }
  }

  const recipeBank = document.querySelector('#recipeBank');
  const recipeTags = recipeBank?.querySelector('[data-recipe-tag="alla"]')?.parentElement;
  if (recipeTags && !recipeTags.querySelector('[data-recipe-tag="korv"]')) {
    const button=document.createElement('button');
    button.type='button';
    button.dataset.recipeTag='korv';
    button.textContent='Korv';
    const slow=recipeTags.querySelector('[data-recipe-tag="slowcooker"]');
    recipeTags.insertBefore(button,slow||null);
    button.addEventListener('click',()=>{
      const matches=recipes.filter(r=>r.tags?.includes('korv'));
      if(typeof renderBank==='function') renderBank(matches);
    });
  }

  if (typeof renderBank === 'function') renderBank();

  if (!finder || finder.dataset.finderV2Ready === '1') return;
  finder.dataset.finderV2Ready='1';

  const state={time:null,budget:'any',tag:null,energy:'any'};

  function activate(button){
    const key=button.dataset.finder;
    state[key]=button.dataset.value;
    finder.querySelectorAll(`[data-finder="${key}"]`).forEach(b=>b.classList.toggle('active',b===button));
  }

  function matchesExactly(r){
    if(state.time && Number(r.time)>Number(state.time)) return false;
    if(state.budget!=='any' && r.budget!==state.budget) return false;
    if(state.tag && state.tag!=='överraska' && !r.tags?.includes(state.tag)) return false;
    if(state.energy==='low' && Number(r.time)>30) return false;
    if(state.energy==='normal' && Number(r.time)>60) return false;
    return true;
  }

  function score(r){
    let value=0;
    if(state.tag && state.tag!=='överraska') value += r.tags?.includes(state.tag) ? 12 : -10;
    if(state.time){
      const max=Number(state.time), diff=Number(r.time)-max;
      value += diff<=0 ? 6 : Math.max(-6,-Math.ceil(diff/10));
    }
    if(state.budget!=='any') value += r.budget===state.budget ? 5 : -3;
    if(state.energy==='low') value += Number(r.time)<=15 ? 7 : Number(r.time)<=30 ? 4 : -5;
    if(state.energy==='normal') value += Number(r.time)<=60 ? 2 : -3;
    return value;
  }

  function card(r){
    const budget=r.budget==='low'?'💰 Billigt':'💰💰 Mellan';
    return `<article class="recipe-card"><div class="meta"><span class="badge">${r.emoji||'🍲'}</span><span class="badge">⏱️ ${r.time} min</span><span class="badge">${budget}</span></div><h3>${r.name}</h3><p>${r.tip||''}</p><button type="button" class="primary" data-finder-open="${r.id}">Öppna recept</button></article>`;
  }

  function showSuggestions(){
    const root=finder.querySelector('#suggestions');
    const message=finder.querySelector('#suggestionMessage');
    if(!root) return;

    let result;
    let relaxed=false;
    if(state.tag==='överraska') {
      result=[...recipes].sort(()=>Math.random()-.5).slice(0,3);
    } else {
      const exact=recipes.filter(matchesExactly);
      if(exact.length>=3) result=[...exact].sort((a,b)=>score(b)-score(a)).slice(0,3);
      else {
        relaxed=true;
        const pool=new Map(exact.map(r=>[r.id,r]));
        [...recipes].sort((a,b)=>score(b)-score(a)).forEach(r=>{if(pool.size<3)pool.set(r.id,r)});
        result=[...pool.values()].slice(0,3);
      }
    }

    root.innerHTML=result.length?result.map(card).join(''):'<div class="empty">Jag hittar inga recept ännu.</div>';
    root.querySelectorAll('[data-finder-open]').forEach(b=>b.addEventListener('click',()=>window.openRecipe?.(b.dataset.finderOpen)));
    if(message) message.textContent=relaxed?'Det fanns inte tre exakta träffar. Här är de närmaste alternativen utifrån dina val.':'Här är tre förslag utifrån dina val.';
  }

  function reset(){
    state.time=null;state.budget='any';state.tag=null;state.energy='any';
    finder.querySelectorAll('[data-finder]').forEach(b=>b.classList.remove('active'));
    const root=finder.querySelector('#suggestions');
    const message=finder.querySelector('#suggestionMessage');
    if(root)root.innerHTML='';
    if(message)message.textContent='';
  }

  finder.querySelectorAll('[data-finder]').forEach(b=>b.addEventListener('click',()=>activate(b)));
  finder.querySelector('#showSuggestionsV2')?.addEventListener('click',showSuggestions);
  finder.querySelector('#resetSuggestionsV2')?.addEventListener('click',reset);
})();