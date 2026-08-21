(() => {
  const KITCHEN_KEY='malix-smart-kitchen-v1';
  const MEALS_KEY='malix-meals';
  const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
  const aliases={brodskiva:['brod'],'rostat brod':['brod'],'knackebrod':['knackebrod','brod'],'ostskiva':['ost'],'filmjolk':['filmjolk','fil'],'turkisk yoghurt':['turkisk yoghurt','yoghurt'],'kyckling':['kyckling','kycklingfile'],'fisk':['fisk','lax','torsk','sej'],'kottfars':['kottfars','fars'],'kott':['kott'],'makrill i tomatsas':['makrill']};
  function selectedItems(){return [...document.querySelectorAll('#selectedFoods [data-remove]')].map(b=>{const t=(b.textContent||'').replace(/\s*×\s*$/,'').trim(),m=t.match(/^(.*?):\s*(.+)$/);return m?{food:m[1].trim(),quantity:m[2].trim()}:null}).filter(Boolean)}
  function load(){try{const s=JSON.parse(localStorage.getItem(KITCHEN_KEY)||'{}');return {stock:Array.isArray(s.stock)?s.stock:[],shopping:Array.isArray(s.shopping)?s.shopping:[]}}catch{return {stock:[],shopping:[]}}}
  function save(s){localStorage.setItem(KITCHEN_KEY,JSON.stringify(s));document.dispatchEvent(new CustomEvent('malix-smart-kitchen-updated'))}
  function inStock(stock,food){const fn=norm(food),cands=aliases[fn]||[fn];return stock.some(x=>{const sn=norm(x.item);return cands.some(c=>{const cn=norm(c);return sn===cn||sn.includes(cn)||cn.includes(sn)})})}
  function addMissingToPlus(items,mealType){const st=load();let added=0;items.forEach(({food,quantity})=>{if(inStock(st.stock,food))return;if(st.shopping.some(x=>!x.done&&norm(x.item)===norm(food)))return;st.shopping.push({id:'plus-shop-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),item:food,done:false,source:`Behövs till planerad ${String(mealType||'måltid').toLowerCase()} · ${quantity}`,category:'🛒 Planerat'});added++});if(added){save(st);window.malixRenderSmartKitchen?.()}return added}
  function mealTypeNow(){const h=new Date().getHours();if(h<10)return'Frukost';if(h<14)return'Lunch';if(h<17)return'Mellanmål';if(h<21)return'Middag';return'Kvällsmål'}
  function saveCookedRecipeToMeals(id){
    const recipe=typeof recipes!=='undefined'?recipes.find(r=>String(r.id)===String(id)):null;
    if(!recipe)return false;
    let meals=[];try{const parsed=JSON.parse(localStorage.getItem(MEALS_KEY)||'[]');meals=Array.isArray(parsed)?parsed:[]}catch{}
    const today=new Date(),dayKey=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    const duplicate=meals.some(m=>String(m.recipeId||'')===String(recipe.id)&&m.date&&dayKey(new Date(m.date))===dayKey(today));
    if(!duplicate){meals.unshift({meal:mealTypeNow(),food:recipe.name,portion:'1 portion',taste:'',satiety:'',recipeId:recipe.id,source:'receptbank',date:today.toISOString()});localStorage.setItem(MEALS_KEY,JSON.stringify(meals.slice(0,500)))}
    document.dispatchEvent(new CustomEvent('malix-meals-updated'));
    document.dispatchEvent(new CustomEvent('malix-day-changed'));
    window.renderMeals?.();
    return !duplicate;
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
    const items=selectedItems();if(!items.length)return;
    const mealType=form.querySelector('[name="meal"]')?.value||'måltid';
    setTimeout(()=>{
      const added=addMissingToPlus(items,mealType);
      if(typeof window.malixDeductKitchenItems==='function'){
        const result=window.malixDeductKitchenItems(items),saved=document.querySelector('#mealSaved');
        if(saved&&result?.changed)saved.textContent+=' · PLUS-köket uppdaterat ✓';
        if(saved&&added)saved.textContent+=` · ${added} sak${added===1?'':'er'} till PLUS-listan`;
      }
    },0);
  },true);
  const originalMarkRecipeCooked=window.markRecipeCooked;
  if(typeof originalMarkRecipeCooked==='function'){
    window.markRecipeCooked=id=>{
      originalMarkRecipeCooked(id);
      saveCookedRecipeToMeals(id);
      setTimeout(openFoodToday,50);
    };
  }
})();