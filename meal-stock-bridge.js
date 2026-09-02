(() => {
  const MEALS_KEY='malix-meals';
  const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();

  function selectedItems(){
    const items=[...document.querySelectorAll('#selectedFoods [data-remove]')].map(b=>{const t=(b.textContent||'').replace(/\s*×\s*$/,'').trim(),m=t.match(/^(.*?):\s*(.+)$/);return m?{food:m[1].trim(),quantity:m[2].trim()}:null}).filter(Boolean);
    const text=document.querySelector('#mealForm textarea[name="food"]')?.value||'';
    text.split(',').map(x=>x.trim()).filter(Boolean).forEach(entry=>{
      let food=entry,quantity='1 portion';
      const m=entry.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
      if(m){food=m[1].trim();quantity=m[2].trim()}
      if(!food)return;
      if(!items.some(x=>norm(x.food)===norm(food)))items.push({food,quantity});
    });
    return items;
  }

  function recipeKitchenItems(recipe){
    return (recipe?.ingredients||[]).map(text=>{
      const raw=String(text||'').trim();
      if(!raw||/^(eventuellt|gärna|valfri|valfria|lite)\b/i.test(raw))return null;
      const m=raw.match(/^(\d+(?:[.,]\d+)?)\s*(kg|g|l|dl|ml|st|styck|stycken|skiva|skivor)?\s+(.+)$/i);
      if(!m)return null;
      const quantity=`${m[1]} ${m[2]||'st'}`;
      const food=m[3].replace(/\s*\([^)]*\)\s*/g,' ').replace(/\s+/g,' ').trim();
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
      const clean=norm(answer);
      const chosen=numbers[clean]||names[clean]||choices.find(x=>norm(x)===clean);
      if(chosen)return chosen;
      window.alert('Välj Frukost, Lunch, Middag, Mellanmål eller Kvällsmål.');
    }
  }

  function saveCookedRecipeToMeals(id,mealType){
    const recipe=typeof recipes!=='undefined'?recipes.find(r=>String(r.id)===String(id)):null;
    if(!recipe)return false;
    let meals=[];try{const parsed=JSON.parse(localStorage.getItem(MEALS_KEY)||'[]');meals=Array.isArray(parsed)?parsed:[]}catch{}
    const now=new Date();
    const immediateDuplicate=meals.some(m=>String(m.recipeId||'')===String(recipe.id)&&String(m.meal||'')===String(mealType)&&m.date&&Math.abs(now.getTime()-new Date(m.date).getTime())<2000);
    if(immediateDuplicate)return false;
    meals.unshift({meal:mealType,food:recipe.name,portion:'1 portion',taste:'',satiety:'',recipeId:recipe.id,source:'receptbank',date:now.toISOString()});
    localStorage.setItem(MEALS_KEY,JSON.stringify(meals.slice(0,500)));
    document.dispatchEvent(new CustomEvent('malix-meals-updated'));
    document.dispatchEvent(new CustomEvent('malix-day-changed'));
    window.renderMeals?.();
    return true;
  }

  function openFoodToday(){
    const trigger=document.querySelector('[data-calm-open="foodToday"]');
    if(trigger){trigger.click();return}
    const target=document.querySelector('#foodToday')||document.querySelector('#foodLog');
    if(!target)return;
    document.querySelectorAll('main > .view').forEach(v=>v.classList.remove('active-view'));
    target.classList.add('active-view');
    window.scrollTo({top:0,behavior:'smooth'});
  }

  document.addEventListener('submit',event=>{
    const form=event.target;if(form?.id!=='mealForm')return;
    const submit=form.querySelector('button[type="submit"]');if(submit&&/^Spara ändringar/i.test(submit.textContent||''))return;
    const foodField=form.querySelector('textarea[name="food"]');
    if(foodField?.dataset.takeaway==='1'||/^Hämtmat:/i.test(foodField?.value||'')){sessionStorage.removeItem('malix-skip-kitchen-once');return}
    if(sessionStorage.getItem('malix-skip-kitchen-once')==='1'){sessionStorage.removeItem('malix-skip-kitchen-once');return}
    const items=selectedItems();if(!items.length)return;
    setTimeout(()=>{
      if(typeof window.malixDeductKitchenItems!=='function')return;
      const result=window.malixDeductKitchenItems(items),saved=document.querySelector('#mealSaved');
      if(saved&&result?.changed)saved.textContent+=' · PLUS-köket uppdaterat ✓';
      if(saved&&result?.emptied)saved.textContent+=` · ${result.emptied} vara${result.emptied===1?'':'or'} tog slut och lades på PLUS-listan`;
    },0);
  },true);

  const originalMarkRecipeCooked=window.markRecipeCooked;
  if(typeof originalMarkRecipeCooked==='function'){
    window.markRecipeCooked=id=>{
      const mealType=chooseMealType();
      if(!mealType)return;
      originalMarkRecipeCooked(id);
      const recipe=typeof recipes!=='undefined'?recipes.find(r=>String(r.id)===String(id)):null;
      const saved=saveCookedRecipeToMeals(id,mealType);
      sessionStorage.removeItem('malix-selected-meal-type');
      if(saved&&recipe){
        const items=recipeKitchenItems(recipe);
        const result=typeof window.malixDeductKitchenItems==='function'?window.malixDeductKitchenItems(items):null;
        document.dispatchEvent(new CustomEvent('malix-recipe-cooked',{detail:{recipe,mealType,kitchenResult:result}}));
        setTimeout(openFoodToday,50);
      }
    };
  }
})();