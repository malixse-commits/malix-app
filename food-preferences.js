(() => {
  const KEY='malix-food-preferences-v1';
  const getPrefs=()=>{try{return {...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{return {}}};
  const savePrefs=p=>localStorage.setItem(KEY,JSON.stringify(p));
  const glutenMap=[
    [/\bpasta\b|spaghetti|makaron|nudlar|lasagneplattor/gi,'glutenfri pasta'],
    [/\bbröd\b|hamburgerbröd/gi,'glutenfritt bröd'],
    [/\bströbröd\b/gi,'glutenfritt ströbröd'],
    [/\bmjöl\b/gi,'glutenfri mjölmix'],
    [/\btortilla\b/gi,'glutenfri tortilla'],
    [/\bmüsli\b/gi,'glutenfri müsli'],
    [/\bflingor\b/gi,'glutenfria flingor'],
    [/\bhavregryn\b/gi,'glutenfria havregryn']
  ];
  const adapt=text=>{
    if(!getPrefs().glutenFree) return String(text||'');
    let out=String(text||'');
    glutenMap.forEach(([r,v])=>out=out.replace(r,v));
    return out;
  };
  window.malixAdaptFoodText=adapt;

  function addSettings(){
    const home=document.querySelector('#home');
    if(!home||document.querySelector('#foodPreferences'))return;
    const hero=home.querySelector('.hero-card');
    const box=document.createElement('section');
    box.id='foodPreferences';box.className='panel calm';
    box.innerHTML=`<p class="eyebrow">Matinställningar</p><h3>🌾 Anpassa maten</h3><label style="display:flex;gap:10px;align-items:center"><input id="glutenFreeChoice" type="checkbox"> Visa glutenfria alternativ i matdelen</label><p class="note">När detta är valt byter appen till glutenfria alternativ för bland annat pasta, bröd, mjöl, ströbröd, müsli, flingor och havregryn. Kontrollera alltid produktens märkning om du behöver äta strikt glutenfritt.</p>`;
    hero.insertAdjacentElement('afterend',box);
    const input=box.querySelector('#glutenFreeChoice');input.checked=!!getPrefs().glutenFree;
    input.addEventListener('change',()=>{const p=getPrefs();p.glutenFree=input.checked;savePrefs(p);document.dispatchEvent(new CustomEvent('malix-food-preference-changed'));});
  }

  function addBreakfast(){
    if(typeof recipes==='undefined'||recipes.some(r=>r.id==='frukostflingor'))return;
    recipes.push({id:'frukostflingor',name:'Frukost med flingor, fil eller yoghurt',emoji:'🥣',time:3,budget:'low',tags:['snabbt','vegetariskt','frukost'],ingredients:['fil, yoghurt eller mjölk','valfria flingor','frukt eller bär'],leftovers:[],plants:2,tip:'Välj den sort du tycker om. Lägg gärna till frukt eller bär om du har hemma.',steps:['Häll upp fil, yoghurt eller mjölk.','Välj flingor: cornflakes, havrefras, müsli, granola, havregryn eller en annan sort du tycker om.','Lägg gärna till frukt eller bär.']});
  }

  function decorateRecipe(){
    const detail=document.querySelector('#recipeDetail');if(!detail)return;
    const gf=getPrefs().glutenFree;
    detail.querySelectorAll('.ingredient-list li').forEach(li=>{const original=li.dataset.originalText||li.textContent;li.dataset.originalText=original;li.textContent=gf?adapt(original):original});
    detail.querySelectorAll('.steps li').forEach(li=>{const original=li.dataset.originalText||li.textContent;li.dataset.originalText=original;li.textContent=gf?adapt(original):original});
    detail.querySelector('[data-gf-note]')?.remove();
    if(gf){const note=document.createElement('p');note.dataset.gfNote='1';note.className='note';note.innerHTML='<strong>🌾 Glutenfritt valt:</strong> receptet visar glutenfria byten där det behövs. Kontrollera alltid märkningen på färdiga produkter, såser, buljong, flingor och andra sammansatta livsmedel.';detail.querySelector('h2')?.insertAdjacentElement('afterend',note)}
  }

  addBreakfast();addSettings();
  const detail=document.querySelector('#recipeDetail');if(detail)new MutationObserver(()=>queueMicrotask(decorateRecipe)).observe(detail,{childList:true,subtree:true});
  document.addEventListener('malix-food-preference-changed',decorateRecipe);
})();