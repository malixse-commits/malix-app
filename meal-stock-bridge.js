(() => {
  const MEALS_KEY='malix-meals';
  const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();

  function recipeKitchenItems(recipe){
    return (recipe?.ingredients||[]).map(text=>{
      const raw=String(text||'').trim();
      if(!raw||/^(eventuellt|gärna|valfri|valfria|lite)\b/i.test(raw))return null;
      const m=raw.match(/^(\d+(?:[.,]\d+)?)\s*(kg|g|l|dl|ml|tsk|msk|st|styck|stycken|skiva|skivor|bit|bitar|portion|portioner)?\s+(.+)$/i);
      if(!m)return null;
      const quantity=`${m[1]} ${m[2]||'st'}`;
      const food=m[3].replace(/\s*[–—-]\s*(?:valfritt|valfri|om du vill).*$/i,'').replace(/\s*\([^)]*\)\s*/g,' ').replace(/\s+/g,' ').trim();
      return food?{food,quantity}:null;
    }).filter(Boolean);
  }

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

  function saveCookedRecipeToMeals(id,mealType){
    const recipe=typeof recipes!=='undefined'?recipes.find(r=>String(r.id)===String(id)):null;if(!recipe)return false;
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

  const originalMarkRecipeCooked=window.markRecipeCooked;
  if(typeof originalMarkRecipeCooked==='function'){
    window.markRecipeCooked=id=>{
      const mealType=chooseMealType();if(!mealType)return;
      const recipe=typeof recipes!=='undefined'?recipes.find(r=>String(r.id)===String(id)):null;if(!recipe)return;
      if(isImmediateDuplicate(id,mealType)){
        sessionStorage.removeItem('malix-selected-meal-type');
        const status=document.querySelector('#recipeCookStatus');
        if(status)status.textContent='Receptet är redan registrerat som lagat för den måltiden.';
        return;
      }
      const registered=originalMarkRecipeCooked(id);
      if(registered===false){sessionStorage.removeItem('malix-selected-meal-type');return}
      const saved=saveCookedRecipeToMeals(id,mealType);
      sessionStorage.removeItem('malix-selected-meal-type');
      if(!saved)return;
      const result=deductRecipeFromPlus(recipe);
      recipeStatus(mealType,result);
      document.dispatchEvent(new CustomEvent('malix-recipe-cooked',{detail:{recipe,mealType,kitchenResult:result}}));
      setTimeout(openFoodToday,50);
    };
  }
})();