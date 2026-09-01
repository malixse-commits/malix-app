(() => {
 const KEY='malix-smart-kitchen-v1';
 const load=()=>{try{const s=JSON.parse(localStorage.getItem(KEY)||'{}');return {stock:Array.isArray(s.stock)?s.stock:[],shopping:Array.isArray(s.shopping)?s.shopping:[]}}catch{return {stock:[],shopping:[]}}};
 const save=s=>{localStorage.setItem(KEY,JSON.stringify(s));document.dispatchEvent(new CustomEvent('malix-smart-kitchen-updated'))};
 const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\b(kg|g|dl|ml|l|st|styck|stycken|skiva|skivor|paket|burk|burkar)\b/g,' ').replace(/\d+[\d,.]*/g,' ').replace(/[^a-zåäö ]/gi,' ').replace(/\s+/g,' ').trim();
 const words=s=>norm(s).split(' ').filter(w=>w.length>2&&!['eller','valfri','valfria','garna','lite','eventuellt','med','och','for'].includes(w));
 const aliases={
  'brodskiva':['brod'],'rostat brod':['brod'],'knackebrod':['knackebrod','brod'],'ostskiva':['ost'],'filmjolk':['filmjolk','fil'],
  'turkisk yoghurt':['turkisk yoghurt','yoghurt'],'kyckling':['kyckling','kycklingfile'],'fisk':['fisk','lax','torsk','sej'],
  'kottfars':['kottfars','fars'],'kott':['kott'],'makrill i tomatsas':['makrill'],'tomater':['tomat'],'tomat':['tomat'],
  'aggs':['agg'],'agg':['agg'],'bananer':['banan'],'applen':['apple'],'potatisar':['potatis'],'morotter':['morot'],
  'korv':['korv','grillkorv','kokkorv','kottkorv','flaskkorv','falukorv','wienerkorv','prinskorv','chorizo','salsiccia','kycklingkorv','vegetarisk korv'],
  'grillkorv':['grillkorv','korv'],'kokkorv':['kokkorv','korv'],'kottkorv':['kottkorv','korv'],'flaskkorv':['flaskkorv','korv'],
  'falukorv':['falukorv','korv'],'wienerkorv':['wienerkorv','korv'],'prinskorv':['prinskorv','korv'],'chorizo':['chorizo','korv'],
  'salsiccia':['salsiccia','korv'],'kycklingkorv':['kycklingkorv','korv'],'vegetarisk korv':['vegetarisk korv','korv']
 };
 const sausageVariants=new Set(['grillkorv','kokkorv','kottkorv','flaskkorv','falukorv','wienerkorv','prinskorv','chorizo','salsiccia','kycklingkorv','vegetarisk korv']);
 const recipesList=()=>typeof recipes!=='undefined'?recipes:[];
 const namesFor=value=>{const n=norm(value),set=new Set([n,...(aliases[n]||[]).map(norm)]);return [...set].filter(Boolean)};
 const matches=(stockItem,ingredient)=>{
  const stock=norm(stockItem),food=norm(ingredient);
  if(stock===food)return true;
  if(sausageVariants.has(stock)&&sausageVariants.has(food))return false;
  if(stock==='korv'&&sausageVariants.has(food))return true;
  if(food==='korv'&&sausageVariants.has(stock))return true;
  const a=namesFor(stock),b=namesFor(food);
  if(a.some(x=>b.includes(x)))return true;
  const aw=words(stock),bw=words(food);
  return aw.some(x=>bw.some(y=>x===y||(x.length>4&&y.length>4&&(x.includes(y)||y.includes(x)))));
 };
 const categoryFor=item=>{const n=norm(item);if(/tomat|gurka|paprika|morot|potatis|lok|vitlok|kal|broccoli|sallad|spenat|frukt|apple|banan|citron|lime|avokado|zucchini|aubergine|selleri|rodbet|palsternack/.test(n))return'🥦 Frukt & grönt';if(/kott|kottfars|kyckling|fisk|lax|torsk|sej|rak|mussl|korv|agg|tofu/.test(n))return'🥩 Protein';if(/mjolk|gradde|yoghurt|filmjolk|kvarg|ost|smor|creme|feta/.test(n))return'🥛 Mejeri';if(/toalett|disk|tvatt|papper|schampo|tval/.test(n))return'🧻 Övrigt';return'🥫 Skafferi & övrigt'};
 function parseAmount(value){
  const raw=String(value||'').trim().toLowerCase().replace(',','.');
  const m=raw.match(/(-?\d+(?:\.\d+)?)\s*(kg|g|l|dl|ml|st|styck|stycken|skiva|skivor)?/i);
  if(!m)return null;
  const number=Number(m[1]);if(!Number.isFinite(number))return null;
  const u=(m[2]||'st').toLowerCase();
  if(u==='kg')return {group:'weight',base:number*1000,unit:'kg'};
  if(u==='g')return {group:'weight',base:number,unit:'g'};
  if(u==='l')return {group:'volume',base:number*1000,unit:'l'};
  if(u==='dl')return {group:'volume',base:number*100,unit:'dl'};
  if(u==='ml')return {group:'volume',base:number,unit:'ml'};
  if(['st','styck','stycken'].includes(u))return {group:'count',base:number,unit:'st'};
  if(['skiva','skivor'].includes(u))return {group:'slice',base:number,unit:'skivor'};
  return null;
 }
 const tidy=n=>Number.isInteger(n)?String(n):String(Math.round(n*100)/100).replace('.',',');
 function formatAmount(parsed,preferred){
  if(parsed.group==='weight'){
   if(preferred==='kg'&&parsed.base>=1000)return `${tidy(parsed.base/1000)} kg`;
   return `${tidy(parsed.base)} g`;
  }
  if(parsed.group==='volume'){
   if(preferred==='l'&&parsed.base>=1000)return `${tidy(parsed.base/1000)} l`;
   if(preferred==='dl'&&parsed.base>=100)return `${tidy(parsed.base/100)} dl`;
   return `${tidy(parsed.base)} ml`;
  }
  if(parsed.group==='slice')return `${tidy(parsed.base)} skivor`;
  return `${tidy(parsed.base)} st`;
 }
 function combineAmounts(current,extra){
  const a=parseAmount(current),b=parseAmount(extra);if(!a||!b||a.group!==b.group)return null;
  return formatAmount({...a,base:a.base+b.base},a.unit);
 }
 function subtractAmounts(current,used){
  const a=parseAmount(current),b=parseAmount(used);if(!a||!b||a.group!==b.group)return null;
  const base=Math.max(0,a.base-b.base);return {amount:formatAmount({...a,base},a.unit),empty:base<=0};
 }
 function addPlusShopping(st,item,source=''){const clean=String(item||'').trim();if(!clean)return;if(st.stock.some(x=>matches(x.item,clean)))return;if(!st.shopping.some(x=>matches(x.item,clean)&&!x.done))st.shopping.push({id:'plus-shop-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),item:clean,source,category:categoryFor(clean),done:false})}
 function clearCoveredAutoShopping(st,item){st.shopping=st.shopping.filter(x=>!(x.source&&matches(item,x.item)))}
 function addStock(st,item,place,amount){const clean=String(item||'').trim();if(!clean)return;const existing=st.stock.find(x=>matches(x.item,clean)&&x.place===place);if(existing){const combined=combineAmounts(existing.amount,amount);existing.amount=combined||String(amount||existing.amount||'1 st').trim()}else st.stock.push({id:'stock-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),item:clean,place,amount:String(amount||'1 st').trim()});clearCoveredAutoShopping(st,clean)}
 function ensureView(){let s=document.querySelector('main > #smartKitchen');if(!s){s=document.createElement('section');s.id='smartKitchen';s.className='view';document.querySelector('main')?.appendChild(s)}return s}
 function renderView(){const s=ensureView();s.innerHTML=`<button type="button" class="back" data-open="home">← Tillbaka</button><p class="eyebrow">PLUS</p><h2>🧊 Kyl, frys & skafferi</h2><p class="subtitle">PLUS håller reda på vad du har hemma. Den vanliga handlingslistan är en separat gratis funktion.</p><section class="panel calm"><h3>🍲 Vad kan jag laga av det jag har?</h3><div id="plusCookFromHome" class="recipe-grid"></div></section><div class="plan-grid"><section class="panel"><h3>🧊 Det jag har hemma</h3><form id="plusStockForm" class="record-form"><label>Vara<input name="item" placeholder="t.ex. mjölk eller potatis" required></label><label>Var finns den?<select name="place"><option>Kyl</option><option>Frys</option><option>Skafferi</option></select></label><label>Mängd<input name="amount" placeholder="t.ex. 1 kg eller 6 st" required></label><button class="primary">Lägg till hemma</button></form><div id="plusStockList"></div></section><section class="panel"><h3>🛒 PLUS-lista</h3><p class="note">När du har handlat kan varan flyttas direkt till kyl, frys eller skafferi.</p><form id="plusShoppingForm" class="record-form"><label>Lägg till något<input name="item" placeholder="t.ex. kaffe" required></label><button class="primary">Lägg till</button></form><div id="plusShoppingList"></div></section></div>`;wireForms(s);renderData();document.dispatchEvent(new CustomEvent('malix-plus-view-ready'))}
 function wireForms(s){s.querySelector('#plusStockForm')?.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(e.target),st=load();addStock(st,d.get('item'),d.get('place'),d.get('amount'));save(st);e.target.reset();renderData()});s.querySelector('#plusShoppingForm')?.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(e.target),st=load();addPlusShopping(st,d.get('item'));save(st);e.target.reset();renderData()})}
 function recipeScore(r,stock){const ing=r.ingredients||[],found=ing.filter(i=>stock.some(s=>matches(s.item,i))).length;return {found,total:ing.length,ratio:ing.length?found/ing.length:0}}
 function renderSuggestions(st){const root=document.querySelector('#plusCookFromHome');if(!root)return;if(!st.stock.length){root.innerHTML='<p class="empty">Lägg in några saker i kyl, frys eller skafferi så visas recept som passar.</p>';return}const ranked=recipesList().map(r=>({r,...recipeScore(r,st.stock)})).filter(x=>x.found>0).sort((a,b)=>b.ratio-a.ratio||b.found-a.found).slice(0,8);root.innerHTML=ranked.length?ranked.map(x=>`<article class="recipe-card"><h3>${x.r.emoji||'🍲'} ${x.r.name}</h3><p><strong>${x.found} av ${x.total}</strong> ingredienser matchar det du har hemma.</p><div class="chips"><button type="button" class="primary" data-plus-open="${x.r.id}">Öppna recept</button><button type="button" class="secondary" data-plus-missing="${x.r.id}">Lägg det som saknas i PLUS-listan</button></div></article>`).join(''):'<p class="empty">Inget recept matchar ännu.</p>';root.querySelectorAll('[data-plus-open]').forEach(b=>b.onclick=()=>window.openRecipe?.(b.dataset.plusOpen));root.querySelectorAll('[data-plus-missing]').forEach(b=>b.onclick=()=>{const r=recipesList().find(x=>String(x.id)===String(b.dataset.plusMissing));if(!r)return;const s=load(),missing=(r.ingredients||[]).filter(i=>!s.stock.some(x=>matches(x.item,i)));missing.forEach(i=>addPlusShopping(s,i,r.name));save(s);renderData()})}
 function choosePlace(item){
  const guess=/mjölk|grädde|yoghurt|filmjölk|kvarg|ost|smör|kött|kyckling|fisk|korv|ägg|tofu|tomat|gurka|paprika|sallad|spenat/i.test(item)?'Kyl':'Skafferi';
  const answer=window.prompt(`Var vill du lägga ${item}?\nSkriv Kyl, Frys eller Skafferi.`,guess);
  if(answer===null)return null;
  const clean=String(answer).trim().toLowerCase();
  if(clean==='kyl')return'Kyl';if(clean==='frys')return'Frys';if(clean==='skafferi')return'Skafferi';
  window.alert('Skriv Kyl, Frys eller Skafferi.');return choosePlace(item);
 }
 function renderData(){
  const st=load(),stock=document.querySelector('#plusStockList'),shop=document.querySelector('#plusShoppingList');renderSuggestions(st);
  if(stock){
   stock.innerHTML=st.stock.length?st.stock.map(x=>`<div class="history-meal"><strong>${x.item}</strong><small>${x.place} · ${x.amount}</small><div class="chips"><button type="button" class="secondary" data-plus-stock-add="${x.id}">+ Lägg till mer</button><button type="button" class="secondary" data-plus-stock-remove="${x.id}">Ta bort</button></div></div>`).join(''):'<p class="empty">Inget inlagt hemma ännu.</p>';
   stock.querySelectorAll('[data-plus-stock-add]').forEach(b=>b.onclick=()=>{const s=load(),item=s.stock.find(x=>String(x.id)===String(b.dataset.plusStockAdd));if(!item)return;const extra=window.prompt(`Hur mycket vill du lägga till av ${item.item}?\nDu har nu: ${item.amount}`,'');if(extra===null||!String(extra).trim())return;const combined=combineAmounts(item.amount,extra);item.amount=combined||String(extra).trim();clearCoveredAutoShopping(s,item.item);save(s);renderData()});
   stock.querySelectorAll('[data-plus-stock-remove]').forEach(b=>b.onclick=()=>{const s=load();s.stock=s.stock.filter(x=>String(x.id)!==String(b.dataset.plusStockRemove));save(s);renderData()})
  }
  if(shop){
   const visible=st.shopping.filter(x=>!st.stock.some(s=>x.source&&matches(s.item,x.item))),groups={};
   visible.forEach(x=>(groups[x.category||categoryFor(x.item)]||(groups[x.category||categoryFor(x.item)]=[])).push(x));
   shop.innerHTML=visible.length?Object.entries(groups).map(([cat,items])=>`<div class="shopping-group"><h4>${cat}</h4>${items.map(x=>`<div class="history-meal"><strong>${x.item}</strong>${x.source?`<small>${x.source}</small>`:''}<div class="chips"><button type="button" class="primary" data-plus-shop-bought="${x.id}">✓ Handlat – lägg hemma</button><button type="button" class="secondary" data-plus-shop-remove="${x.id}">Ta bort från listan</button></div></div>`).join('')}</div>`).join(''):'<p class="empty">PLUS-listan är tom.</p>';
   shop.querySelectorAll('[data-plus-shop-bought]').forEach(b=>b.onclick=()=>{
    const s=load(),item=s.shopping.find(x=>String(x.id)===String(b.dataset.plusShopBought));if(!item)return;
    const amount=window.prompt(`Hur mycket ${item.item} har du handlat?`,'1 st');if(amount===null||!String(amount).trim())return;
    const place=choosePlace(item.item);if(!place)return;
    addStock(s,item.item,place,String(amount).trim());
    s.shopping=s.shopping.filter(x=>String(x.id)!==String(item.id));
    save(s);renderData();
   });
   shop.querySelectorAll('[data-plus-shop-remove]').forEach(b=>b.onclick=()=>{const s=load();s.shopping=s.shopping.filter(x=>String(x.id)!==String(b.dataset.plusShopRemove));save(s);renderData()})
  }
 }
 window.malixRenderSmartKitchen=()=>{if(!document.querySelector('main > #smartKitchen'))renderView();else renderData()};
 window.malixKitchenHasStock=food=>load().stock.some(x=>matches(x.item,food));
 window.malixDeductKitchenItems=items=>{const st=load();let changed=0,unmatched=0;for(const entry of items||[]){const food=entry?.food,quantity=entry?.quantity;if(!food)continue;const candidates=st.stock.filter(x=>matches(x.item,food));if(candidates.length!==1){unmatched++;continue}const item=candidates[0],result=subtractAmounts(item.amount,quantity);if(!result){unmatched++;continue}if(result.empty)st.stock=st.stock.filter(x=>x.id!==item.id);else item.amount=result.amount;changed++}if(changed)save(st);return {changed,unmatched}};
 window.malixAddRecipeMissingToPlusShopping=recipe=>{const st=load(),missing=(recipe?.ingredients||[]).filter(i=>!st.stock.some(x=>matches(x.item,i)));missing.forEach(i=>addPlusShopping(st,i,recipe?.name||'recept'));save(st);renderData();return missing.length};
 renderView();
})();