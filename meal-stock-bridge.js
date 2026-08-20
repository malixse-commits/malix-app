(() => {
  const KITCHEN_KEY='malix-smart-kitchen-v1';
  const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9åäö ]/gi,' ').replace(/\s+/g,' ').trim();
  const aliases={brodskiva:['brod'],'rostat brod':['brod'],'knackebrod':['knackebrod','brod'],'ostskiva':['ost'],'filmjolk':['filmjolk','fil'],'turkisk yoghurt':['turkisk yoghurt','yoghurt'],'kyckling':['kyckling','kycklingfile'],'fisk':['fisk','lax','torsk','sej'],'kottfars':['kottfars','fars'],'kott':['kott'],'makrill i tomatsas':['makrill']};
  const optional=/^(eventuellt|gärna|valfri|valfria|rikligt|lite)\b/i;

  function selectedItems(){return [...document.querySelectorAll('#selectedFoods [data-remove]')].map(b=>{const t=(b.textContent||'').replace(/\s*×\s*$/,'').trim(),m=t.match(/^(.*?):\s*(.+)$/);return m?{food:m[1].trim(),quantity:m[2].trim()}:null}).filter(Boolean)}
  function load(){try{const s=JSON.parse(localStorage.getItem(KITCHEN_KEY)||'{}');return {stock:Array.isArray(s.stock)?s.stock:[],shopping:Array.isArray(s.shopping)?s.shopping:[]}}catch{return {stock:[],shopping:[]}}}
  function save(s){localStorage.setItem(KITCHEN_KEY,JSON.stringify(s));document.dispatchEvent(new CustomEvent('malix-smart-kitchen-updated'))}
  function candidates(food){const fn=norm(food);return aliases[fn]||[fn]}
  function findStock(stock,food){const cands=candidates(food);return stock.find(x=>{const sn=norm(x.item);return cands.some(c=>{const cn=norm(c);return sn===cn||sn.includes(cn)||cn.includes(sn)})})}
  function inStock(stock,food){return !!findStock(stock,food)}
  function cleanIngredient(text){return String(text||'').trim().replace(/^(eventuellt|gärna|valfri|valfria|rikligt|lite)\s+/i,'').trim()}
  function parseIngredient(text){
    const original=String(text||'').trim();
    if(!original||optional.test(original))return {optional:true,food:cleanIngredient(original),quantity:''};
    const m=original.match(/^(\d+(?:[.,]\d+)?)\s*(kg|g|l|dl|ml|st|stycken|skiva|skivor)?\s+(.+)$/i);
    if(!m)return {optional:false,food:cleanIngredient(original),quantity:''};
    return {optional:false,food:cleanIngredient(m[3]),quantity:`${m[1]}${m[2]?` ${m[2]}`:''}`.trim()};
  }
  function addShopping(st,item,source){
    const clean=String(item||'').trim();if(!clean)return false;
    if(st.shopping.some(x=>!x.done&&norm(x.item)===norm(clean)))return false;
    st.shopping.push({id:'plus-shop-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),item:clean,done:false,source,category:'🛒 Behövs'});
    return true;
  }
  function addMissingToPlus(items,mealType){const st=load();let added=0;items.forEach(({food,quantity})=>{if(inStock(st.stock,food))return;if(addShopping(st,food,`Behövs till ${String(mealType||'måltid').toLowerCase()}${quantity?` · ${quantity}`:''}`))added++});if(added){save(st);window.malixRenderSmartKitchen?.()}return added}

  function simplifyRecipeView(){
    const root=document.querySelector('#recipeDetail');if(!root)return;
    const headings=[...root.querySelectorAll('h3')];
    const cookedHeading=headings.find(h=>h.textContent.trim()==='När maten är lagad');
    if(cookedHeading){const p=cookedHeading.nextElementSibling;const text='När du har lagat maten uppdateras det du har hemma och det som saknas läggs i inköpslistan.';if(p&&p.tagName==='P'&&p.textContent!==text)p.textContent=text}
    const nutritionHeading=headings.find(h=>h.textContent.trim()==='Vad får jag med mig?');
    if(nutritionHeading){const next=nutritionHeading.nextElementSibling;if(next&&next.classList.contains('note'))next.remove();nutritionHeading.remove()}
  }

  function recipeList(){return typeof recipes!=='undefined'?recipes:[]}
  window.markRecipeCooked=id=>{
    const recipe=recipeList().find(x=>String(x.id)===String(id));if(!recipe)return;
    const st=load(),deduct=[];let added=0;
    (recipe.ingredients||[]).map(parseIngredient).filter(x=>!x.optional&&x.food).forEach(ing=>{
      const stock=findStock(st.stock,ing.food);
      if(!stock){if(addShopping(st,ing.food,`Saknas till ${recipe.name}`))added++;return}
      if(ing.quantity)deduct.push({food:ing.food,quantity:ing.quantity});
    });
    save(st);
    let changed=false;
    if(deduct.length&&typeof window.malixDeductKitchenItems==='function')changed=!!window.malixDeductKitchenItems(deduct)?.changed;
    const cooked=JSON.parse(localStorage.getItem('malix-cooked-recipes')||'[]');cooked.unshift({recipeId:recipe.id,name:recipe.name,date:new Date().toISOString()});localStorage.setItem('malix-cooked-recipes',JSON.stringify(cooked.slice(0,100)));
    window.malixRenderSmartKitchen?.();
    const status=document.querySelector('#recipeCookStatus');
    if(status){let msg='Lagat ✓';if(changed)msg+=' Receptets mängder har dragits från det du har hemma.';if(added)msg+=` ${added} sak${added===1?'':'er'} som saknades lades i inköpslistan.`;if(!changed&&!added)msg+=' Det du har hemma och inköpslistan är kontrollerade.';status.textContent=msg}
  };

  document.addEventListener('submit',event=>{
    const form=event.target;if(form?.id!=='mealForm')return;
    const submit=form.querySelector('button[type="submit"]');if(submit&&/^Spara ändringar/i.test(submit.textContent||''))return;
    const items=selectedItems();if(!items.length)return;
    const mealType=form.querySelector('[name="meal"]')?.value||'måltid';
    setTimeout(()=>{
      const added=addMissingToPlus(items,mealType);
      if(typeof window.malixDeductKitchenItems==='function'){
        const result=window.malixDeductKitchenItems(items),saved=document.querySelector('#mealSaved');
        if(saved&&result?.changed)saved.textContent+=' · Det du har hemma är uppdaterat ✓';
        if(saved&&added)saved.textContent+=` · ${added} sak${added===1?'':'er'} till inköpslistan`;
      }
    },0);
  },true);

  const root=document.querySelector('#recipeDetail');if(root)new MutationObserver(simplifyRecipeView).observe(root,{childList:true,subtree:true});
  document.addEventListener('click',e=>{if(e.target.closest('[data-open-recipe], [data-plus-open]'))setTimeout(simplifyRecipeView,0)},true);
  setTimeout(simplifyRecipeView,0);
})();