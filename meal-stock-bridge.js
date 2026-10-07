(() => {
  const MEALS_KEY='malix-meals';
  const COOKED_KEY='malix-cooked-recipes';
  const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();

  function legacyRecipeById(id){
    return typeof recipes!=='undefined'&&Array.isArray(recipes)
      ? recipes.find(r=>String(r?.id||'')===String(id))||null
      : null;
  }

  function canonicalRecipeById(id){
    const entries=window.MalixCombinedCanonicalRecipeCatalog?.entries;
    if(!Array.isArray(entries))return null;
    const entry=entries.find(row=>String(row?.recipe?.id||'')===String(id));
    return entry?.recipe||null;
  }

  function resolveRecipe(id){
    return legacyRecipeById(id)||canonicalRecipeById(id);
  }

  function ingredientTexts(recipe){
    return (recipe?.ingredients||[]).map(value=>{
      if(typeof value==='string')return value;
      if(value&&typeof value==='object')return String(value.rawText||'').trim();
      return '';
    }).filter(Boolean);
  }

  function recipeKitchenItems(recipe){
    return ingredientTexts(recipe).map(text=>{
      const raw=String(text||'').trim();
      if(!raw||/^(eventuellt|gärna|valfri|valfria|lite)\b/i.test(raw))return null;
      const m=raw.match(/^(\d+(?:[.,]\d+)?)\s*(kg|g|l|dl|ml|tsk|msk|st|styck|stycken|skiva|skivor|bit|bitar|portion|portioner)?\s+(.+)$/i);
      if(!m)return null;
      const quantity=`${m[1]} ${m[2]||'st'}`;
      const food=m[3].replace(/\s*[–—-]\s*(?:valfritt|valfri|om du vill).*$/i,'').replace(/\s*\([^)]*\)\s*/g,' ').replace(/\s+/g,' ').trim();
      return food?{food,quantity}:null;
    }).filter(Boolean);
  }

  function sharedCookedPanel(recipeId){
    const panel=document.createElement('div');
    panel.className='panel calm';
    panel.setAttribute('data-recipe-cooked-actions','true');

    const heading=document.createElement('h3');
    heading.textContent='När maten är lagad';
    const note=document.createElement('p');
    note.textContent='Öppna receptet påverkar inte lagret. Tryck först när du faktiskt har lagat maten.';
    const button=document.createElement('button');
    button.className='primary';
    button.type='button';
    button.textContent='✓ Jag lagade detta';
    button.addEventListener('click',()=>window.markRecipeCooked?.(recipeId));
    const status=document.createElement('p');
    status.id='recipeCookStatus';
    status.className='status';
    status.setAttribute('aria-live','polite');
    panel.append(heading,note,button,status);
    return panel;
  }

  function mountCookedActions(recipeId){
    if(!resolveRecipe(recipeId))return false;
    const root=document.querySelector('#recipeDetail .recipe-detail');
    if(!root)return false;

    root.querySelectorAll('[data-recipe-cooked-actions]').forEach(node=>node.remove());
    for(const panel of root.querySelectorAll('.panel.calm')){
      const heading=panel.querySelector('h3');
      if(heading?.textContent?.trim()==='När maten är lagad')panel.remove();
    }

    const panel=sharedCookedPanel(recipeId);
    const legacyNutrition=[...root.querySelectorAll('h3')].find(h=>h.textContent?.trim()==='Vad får jag med mig?');
    const provenance=root.querySelector('[data-recipe-source-license]');
    const anchor=legacyNutrition||provenance;
    if(anchor)root.insertBefore(panel,anchor);
    else root.appendChild(panel);
    return true;
  }

  function wrapOpenRecipe(fn){
    if(typeof fn!=='function')return fn;
    if(fn.__malixCanonicalCookedBridge)return fn;
    const wrapped=function(id,...args){
      const result=fn.call(this,id,...args);
      queueMicrotask(()=>mountCookedActions(id));
      return result;
    };
    wrapped.__malixCanonicalCookedBridge=true;
    wrapped.__malixWrappedOpenRecipe=fn;
    return wrapped;
  }

  function installOpenRecipeBridge(){
    const descriptor=Object.getOwnPropertyDescriptor(window,'openRecipe');
    let current=wrapOpenRecipe(window.openRecipe);
    if(descriptor&&!descriptor.configurable){
      window.openRecipe=current;
      return false;
    }
    Object.defineProperty(window,'openRecipe',{
      configurable:true,
      enumerable:true,
      get(){return current;},
      set(value){current=wrapOpenRecipe(value);}
    });
    return true;
  }

  window.MalixRecipeCookedActions=Object.freeze({
    resolveRecipe,
    ingredientTexts,
    mountCookedActions
  });

  installOpenRecipeBridge();

  function mealTypeNow(){const h=new Date().getHours();if(h<10)return'Frukost';if(h<14)return'Lunch';if(h<17)return'Mellanmål';if(h<21)return'Middag';return'Kvällsmål'}
  function chooseMealType(){
    const remembered=sessionStorage.getItem('malix-selected-meal-type');
    if(['Frukost','Lunch','Middag','Mellanmål','Kvällsmål'].includes(remembered))return remembered;
    const choices=['Frukost','Lunch','Middag','Mellanmål','Kvällsmål'];
    const numbers={'1':'Frukost','2':'Lunch','3':'Middag','4':'Mellanmål','5':'Kvällsmål'};
    const names={frukost:'Frukost',lunch:'Lunch',middag:'Middag',mellanmal:'Mellanmål',kvallsmal:'Kvällsmål'};
    while(true){
      const answer=window.prompt('Vilken måltid gäller receptet?\n1 Frukost\n2 Lunch\n3 Middag\n4 Mellanmål\n5 Kvällsmål',mealTypeNow());
      if(answer===null)return null;
      const clean=norm(answer),chosen=numbers[clean]||names[clean]||choices.find(x=>norm(x)===clean);
      if(chosen)return chosen;
      window.alert('Välj Frukost, Lunch, Middag, Mellanmål eller Kvällsmål.');
    }
  }

  function storedMeals(){try{const parsed=JSON.parse(localStorage.getItem(MEALS_KEY)||'[]');return Array.isArray(parsed)?parsed:[]}catch{return []}}
  function isImmediateDuplicate(id,mealType,now=new Date()){
    return storedMeals().some(m=>String(m.recipeId||'')===String(id)&&String(m.meal||'')===String(mealType)&&m.date&&Math.abs(now.getTime()-new Date(m.date).getTime())<2000);
  }

  function registerCookedRecipe(recipe){
    if(!recipe)return false;
    let cooked=[];
    try{const parsed=JSON.parse(localStorage.getItem(COOKED_KEY)||'[]');cooked=Array.isArray(parsed)?parsed:[]}catch{}
    cooked.unshift({recipeId:recipe.id,name:recipe.name,date:new Date().toISOString()});
    localStorage.setItem(COOKED_KEY,JSON.stringify(cooked.slice(0,100)));
    const status=document.querySelector('#recipeCookStatus');
    if(status)status.textContent='Lagat ✓ Receptet registrerades.';
    return true;
  }

  function saveCookedRecipeToMeals(recipe,mealType){
    if(!recipe)return false;
    let meals=[];try{const parsed=JSON.parse(localStorage.getItem(MEALS_KEY)||'[]');meals=Array.isArray(parsed)?parsed:[]}catch{}
    const now=new Date(),immediateDuplicate=meals.some(m=>String(m.recipeId||'')===String(recipe.id)&&String(m.meal||'')===String(mealType)&&m.date&&Math.abs(now.getTime()-new Date(m.date).getTime())<2000);
    if(immediateDuplicate)return false;
    meals.unshift({meal:mealType,food:recipe.name,portion:'1 portion',taste:'',satiety:'',recipeId:recipe.id,source:'receptbank',date:now.toISOString()});
    localStorage.setItem(MEALS_KEY,JSON.stringify(meals.slice(0,500)));
    document.dispatchEvent(new CustomEvent('malix-meals-updated'));document.dispatchEvent(new CustomEvent('malix-day-changed'));window.renderMeals?.();return true;
  }

  const kitchenEnvelope=()=>({updated:0,emptied:0,results:[]});
  function mergeKitchenResult(target,part){
    target.updated+=Number(part?.updated||0);
    target.emptied+=Number(part?.emptied||0);
    if(Array.isArray(part?.results))target.results.push(...part.results);
    return target;
  }
  function pushKitchenResult(target,item,status,extra={}){
    target.results.push({item:String(item||''),status,...extra});
    return target;
  }
  function exactStockCandidates(food){
    const wanted=norm(food);
    if(!wanted||typeof window.malixGetKitchenStock!=='function')return [];
    return window.malixGetKitchenStock().filter(item=>norm(item?.item)===wanted);
  }
  function chooseInsufficientAction(row,item){
    const requested=String(row?.requestedAmount||'').trim()||'den loggade mängden';
    const available=String(row?.currentAmount||item?.amount||'').trim()||'den registrerade mängden';
    return window.confirm(`Lagret visar ${available} ${item.item}, men receptet använder ${requested}.\n\nOK: Sätt lagret till 0 och lägg varan på PLUS-listan.\nAvbryt: Lämna lagret oförändrat.`);
  }
  function deductRecipeFromPlus(recipe){
    const result=kitchenEnvelope();
    if(typeof window.malixDeductKitchenStockById!=='function'||typeof window.malixEmptyKitchenStockById!=='function'||typeof window.malixGetKitchenStock!=='function'){
      result.unavailable=true;
      return result;
    }
    for(const entry of recipeKitchenItems(recipe)){
      const candidates=exactStockCandidates(entry.food);
      if(!candidates.length){pushKitchenResult(result,entry.food,'no_match',{requestedAmount:entry.quantity});continue}
      if(candidates.length!==1){pushKitchenResult(result,entry.food,'multiple_matches',{requestedAmount:entry.quantity});continue}
      const stockItem=candidates[0];
      const part=window.malixDeductKitchenStockById(stockItem.id,entry.quantity);
      const row=part?.results?.[0];
      if(row?.status==='insufficient_stock'){
        if(chooseInsufficientAction(row,stockItem)){
          mergeKitchenResult(result,window.malixEmptyKitchenStockById(stockItem.id,'Tog slut när du lagade mat'));
        }else{
          pushKitchenResult(result,stockItem.item,'user_left_unchanged',{stockId:stockItem.id,requestedAmount:row.requestedAmount,currentAmount:row.currentAmount,reason:'insufficient_stock'});
        }
        continue;
      }
      mergeKitchenResult(result,part);
    }
    return result;
  }
  function recipeStatus(mealType,result){
    const status=document.querySelector('#recipeCookStatus');if(!status)return;
    const parts=[`Lagat ✓ Receptet sparades som ${String(mealType).toLowerCase()}.`];
    if(result?.unavailable){parts.push('PLUS-lagret kunde inte uppdateras just nu.');status.textContent=parts.join(' ');return}
    if(result?.updated)parts.push(`Lagret uppdaterades för ${result.updated} ingrediens${result.updated===1?'':'er'}.`);
    if(result?.emptied)parts.push(`${result.emptied} vara${result.emptied===1?'':'or'} tog slut och lades på PLUS-listan.`);
    const unresolved=(result?.results||[]).filter(row=>!['updated','emptied'].includes(row.status)).length;
    if(unresolved)parts.push(`${unresolved} ingrediens${unresolved===1?'':'er'} kunde inte uppdateras säkert och lämnades oförändrade.`);
    status.textContent=parts.join(' ');
  }

  function openFoodToday(){const trigger=document.querySelector('[data-calm-open="foodToday"]');if(trigger){trigger.click();return}const target=document.querySelector('#foodToday')||document.querySelector('#foodLog');if(!target)return;document.querySelectorAll('main > .view').forEach(v=>v.classList.remove('active-view'));target.classList.add('active-view');window.scrollTo({top:0,behavior:'smooth'})}

  window.markRecipeCooked=id=>{
    const mealType=chooseMealType();if(!mealType)return;
    const recipe=resolveRecipe(id);if(!recipe)return;
    if(isImmediateDuplicate(id,mealType)){
      sessionStorage.removeItem('malix-selected-meal-type');
      const status=document.querySelector('#recipeCookStatus');
      if(status)status.textContent='Receptet är redan registrerat som lagat för den måltiden.';
      return;
    }
    if(!registerCookedRecipe(recipe)){sessionStorage.removeItem('malix-selected-meal-type');return}
    const saved=saveCookedRecipeToMeals(recipe,mealType);
    sessionStorage.removeItem('malix-selected-meal-type');
    if(!saved)return;
    const result=deductRecipeFromPlus(recipe);
    recipeStatus(mealType,result);
    document.dispatchEvent(new CustomEvent('malix-recipe-cooked',{detail:{recipe,mealType,kitchenResult:result}}));
    setTimeout(openFoodToday,50);
  };
})();