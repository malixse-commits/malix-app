(() => {
  const KEY='malix-smart-kitchen-v1';
  const load=()=>{try{const s=JSON.parse(localStorage.getItem(KEY)||'{}');return {stock:Array.isArray(s.stock)?s.stock:[],shopping:Array.isArray(s.shopping)?s.shopping:[]}}catch{return {stock:[],shopping:[]}}};
  const save=s=>{localStorage.setItem(KEY,JSON.stringify(s));document.dispatchEvent(new CustomEvent('malix-smart-kitchen-updated'))};
  function diag(entry){window.__malixStockTraceSeq=Number(window.__malixStockTraceSeq||0)+1;const row={seq:window.__malixStockTraceSeq,time:new Date().toISOString(),...entry};window.__malixStockTrace=Array.isArray(window.__malixStockTrace)?window.__malixStockTrace:[];window.__malixStockTrace.push(row);window.__malixStockTrace=window.__malixStockTrace.slice(-80);console.log('[STOCK TRACE]',row);renderDiag()}
  function renderDiag(){const box=document.querySelector('#stockTraceDiag');if(!box)return;const rows=Array.isArray(window.__malixStockTrace)?window.__malixStockTrace:[];box.textContent=rows.length?rows.map(x=>`#${x.seq} · ${x.time} · ${x.operation}\n${JSON.stringify(Object.fromEntries(Object.entries(x).filter(([k])=>!['seq','time','operation'].includes(k))),null,2)}`).join('\n\n'):'Väntar på nästa skrivning…'}
  function parseKitchenState(raw){if(raw==null)return null;try{return JSON.parse(String(raw))}catch{return {__diagnosticError:'invalid-json',raw:String(raw)}}}
  function indexStockForDiff(state){
    const stock=Array.isArray(state?.stock)?state.stock:[];
    const groups=new Map(),missingId=[];
    for(const item of stock){
      const id=String(item?.id||'').trim();
      if(!id){missingId.push(item);continue}
      const items=groups.get(id)||[];items.push(item);groups.set(id,items);
    }
    const byId=new Map(),duplicateIds=[];
    for(const [id,items] of groups){
      if(items.length===1)byId.set(id,items[0]);
      else duplicateIds.push({id,items});
    }
    return {byId,missingId,duplicateIds};
  }
  function diffStock(beforeState,afterState){
    const before=indexStockForDiff(beforeState),after=indexStockForDiff(afterState),changes=[];
    for(const [id,beforeItem] of before.byId){
      const afterItem=after.byId.get(id);
      if(!afterItem){changes.push({id,type:'removed',before:beforeItem});continue}
      const fields={};
      for(const field of ['item','place','amount']){
        const beforeValue=beforeItem?.[field]??null,afterValue=afterItem?.[field]??null;
        if(String(beforeValue??'')!==String(afterValue??''))fields[field]={before:beforeValue,after:afterValue};
      }
      if(Object.keys(fields).length)changes.push({id,type:'changed',item:afterItem.item||beforeItem.item||'',fields});
    }
    for(const [id,afterItem] of after.byId){if(!before.byId.has(id))changes.push({id,type:'added',after:afterItem})}
    return {changes,diagnostics:{beforeMissingId:before.missingId,afterMissingId:after.missingId,beforeDuplicateIds:before.duplicateIds,afterDuplicateIds:after.duplicateIds}};
  }
  function installWriteTrace(){if(window.__malixStockWriteTraceInstalled)return;window.__malixStockWriteTraceInstalled=true;const previousSetItem=Storage.prototype.setItem,previousRemoveItem=Storage.prototype.removeItem;Storage.prototype.setItem=function(k,v){if(this!==localStorage||String(k)!==KEY)return previousSetItem.call(this,k,v);const before=parseKitchenState(localStorage.getItem(KEY)),written=parseKitchenState(String(v)),sourceStack=String(new Error().stack||'');const result=previousSetItem.call(this,k,v);diag({operation:'SET_KEY',sourceStack,before,written,diff:diffStock(before,written)});return result};Storage.prototype.removeItem=function(k){if(this!==localStorage||String(k)!==KEY)return previousRemoveItem.call(this,k);const before=parseKitchenState(localStorage.getItem(KEY)),sourceStack=String(new Error().stack||'');const result=previousRemoveItem.call(this,k);diag({operation:'REMOVE_KEY',sourceStack,before,after:null});return result}}
  const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\b(kg|g|dl|ml|l|tsk|msk|st|styck|stycken|skiva|skivor|bit|bitar|portion|portioner|paket|burk|burkar)\b/g,' ').replace(/\d+[\d,.]*/g,' ').replace(/[^a-zåäö ]/gi,' ').replace(/\s+/g,' ').trim();
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
    const stock=norm(stockItem),food=norm(ingredient);if(!stock||!food)return false;
    if(stock===food)return true;
    if(sausageVariants.has(stock)&&sausageVariants.has(food))return false;
    if(stock==='korv'&&sausageVariants.has(food))return true;
    if(food==='korv'&&sausageVariants.has(stock))return true;
    const a=namesFor(stock),b=namesFor(food);if(a.some(x=>b.includes(x)))return true;
    const aw=words(stock),bw=words(food);return aw.some(x=>bw.some(y=>x===y||(x.length>4&&y.length>4&&(x.includes(y)||y.includes(x)))));
  };
  const categoryFor=item=>{const n=norm(item);if(/tomat|gurka|paprika|morot|potatis|lok|vitlok|kal|broccoli|sallad|spenat|frukt|apple|banan|citron|lime|avokado|zucchini|aubergine|selleri|rodbet|palsternack/.test(n))return'🥦 Frukt & grönt';if(/kott|kottfars|kyckling|fisk|lax|torsk|sej|rak|mussl|korv|agg|tofu/.test(n))return'🥩 Protein';if(/mjolk|gradde|yoghurt|filmjolk|kvarg|ost|smor|creme|feta/.test(n))return'🥛 Mejeri';if(/toalett|disk|tvatt|papper|schampo|tval/.test(n))return'🧻 Övrigt';return'🥫 Skafferi & övrigt'};
  function parseAmount(value){
    const raw=String(value||'').trim().toLowerCase().replace(',','.');
    const m=raw.match(/(-?\d+(?:\.\d+)?)\s*(kg|g|l|dl|ml|tsk|msk|st|styck|stycken|skiva|skivor|bit|bitar|portion|portioner)?/i);if(!m)return null;
    const number=Number(m[1]);if(!Number.isFinite(number))return null;const u=(m[2]||'st').toLowerCase();
    if(u==='kg')return {group:'weight',base:number*1000,unit:'kg'};if(u==='g')return {group:'weight',base:number,unit:'g'};
    if(u==='l')return {group:'volume',base:number*1000,unit:'l'};if(u==='dl')return {group:'volume',base:number*100,unit:'dl'};if(u==='ml')return {group:'volume',base:number,unit:'ml'};if(u==='msk')return {group:'volume',base:number*15,unit:'msk'};if(u==='tsk')return {group:'volume',base:number*5,unit:'tsk'};
    if(['st','styck','stycken'].includes(u))return {group:'count',base:number,unit:'st'};if(['skiva','skivor'].includes(u))return {group:'slice',base:number,unit:'skiva'};if(['bit','bitar'].includes(u))return {group:'piece',base:number,unit:'bit'};if(['portion','portioner'].includes(u))return {group:'portion',base:number,unit:'portion'};return null;
  }
  const tidy=n=>Number.isInteger(n)?String(n):String(Math.round(n*100)/100).replace('.',',');
  function formatAmount(parsed,preferred){if(parsed.group==='weight'){if(preferred==='kg'&&parsed.base>=1000)return`${tidy(parsed.base/1000)} kg`;return`${tidy(parsed.base)} g`}if(parsed.group==='volume'){if(preferred==='l'&&parsed.base>=1000)return`${tidy(parsed.base/1000)} l`;if(preferred==='dl'&&parsed.base>=100)return`${tidy(parsed.base/100)} dl`;if(preferred==='msk'&&parsed.base%15===0)return`${tidy(parsed.base/15)} msk`;if(preferred==='tsk'&&parsed.base%5===0)return`${tidy(parsed.base/5)} tsk`;return`${tidy(parsed.base)} ml`}if(parsed.group==='slice')return`${tidy(parsed.base)} skiva`;if(parsed.group==='piece')return`${tidy(parsed.base)} bit`;if(parsed.group==='portion')return`${tidy(parsed.base)} portion`;return`${tidy(parsed.base)} st`}
  function combineAmounts(current,extra){const a=parseAmount(current),b=parseAmount(extra);if(!a||!b||a.group!==b.group)return null;return formatAmount({...a,base:a.base+b.base},a.unit)}
  function subtractAmounts(current,used){const a=parseAmount(current),b=parseAmount(used);if(!a||!b||a.group!==b.group)return null;const base=Math.max(0,a.base-b.base);return {amount:formatAmount({...a,base},a.unit),empty:base<=0}}
  function addShoppingBecauseEmpty(st,item){const clean=String(item||'').trim();if(!clean)return false;if(st.shopping.some(x=>matches(x.item,clean)&&!x.done))return false;st.shopping.push({id:'plus-shop-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),item:clean,source:'Tog slut när du lagade mat',category:categoryFor(clean),done:false});return true}
  function clearCoveredAutoShopping(st,item){st.shopping=st.shopping.filter(x=>!(x.source&&matches(item,x.item)))}
  function addStock(st,item,place,amount){const clean=String(item||'').trim();if(!clean)return;const existing=st.stock.find(x=>matches(x.item,clean)&&x.place===place);if(existing){const combined=combineAmounts(existing.amount,amount);existing.amount=combined||String(amount||existing.amount||'1 st').trim()}else st.stock.push({id:'stock-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),item:clean,place,amount:String(amount||'1 st').trim()});clearCoveredAutoShopping(st,clean)}
  function ensureView(){let s=document.querySelector('main > #smartKitchen');if(!s){s=document.createElement('section');s.id='smartKitchen';s.className='view';document.querySelector('main')?.appendChild(s)}return s}
  function renderView(){const s=ensureView();s.innerHTML=`<button type="button" class="back" data-open="home">← Tillbaka</button><p class="eyebrow">PLUS</p><h2>🧊 Kyl, frys & skafferi</h2><p class="subtitle">Att öppna eller läsa ett recept ändrar ingenting. Lagret minskar först när du trycker ”Jag lagade detta”. Om en vara då tar slut läggs den på PLUS-listan.</p><section class="panel calm"><h3>🍲 Vad kan jag laga av det jag har?</h3><div id="plusCookFromHome" class="recipe-grid"></div></section><div class="plan-grid"><section class="panel"><h3>🧊 Det jag har hemma</h3><form id="plusStockForm" class="record-form"><label>Vara<input name="item" placeholder="t.ex. mjölk eller potatis" required></label><label>Var finns den?<select name="place"><option>Kyl</option><option>Frys</option><option>Skafferi</option></select></label><label>Mängd<input name="amount" placeholder="t.ex. 1 kg eller 6 st" required></label><button class="primary">Lägg till hemma</button></form><div id="plusStockList"></div></section><section class="panel"><h3>🛒 PLUS-lista</h3><p class="note">Varor läggs automatiskt här endast när de tar slut efter att du markerat ett recept som lagat. Du kan också lägga till något själv.</p><form id="plusShoppingForm" class="record-form"><label>Lägg till något<input name="item" placeholder="t.ex. kaffe" required></label><button class="primary">Lägg till</button></form><div id="plusShoppingList"></div></section></div><section class="panel" style="margin-top:14px"><h3>Tillfällig lagerdiagnostik</h3><p class="note">Visar endast skrivningar till PLUS-lagrets lagringsnyckel.</p><button type="button" class="secondary" data-stock-trace-clear>Rensa logg</button><pre id="stockTraceDiag" style="white-space:pre-wrap;font-size:12px">Väntar på nästa skrivning…</pre></section>`;wireForms(s);s.querySelector('[data-stock-trace-clear]')?.addEventListener('click',()=>{window.__malixStockTrace=[];window.__malixStockTraceSeq=0;renderDiag()});renderData();renderDiag();document.dispatchEvent(new CustomEvent('malix-plus-view-ready'))}
  function wireForms(s){s.querySelector('#plusStockForm')?.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(e.target),item=String(d.get('item')||''),place=String(d.get('place')||''),amount=String(d.get('amount')||''),st=load();addStock(st,item,place,amount);save(st);e.target.reset();renderData()});s.querySelector('#plusShoppingForm')?.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(e.target),item=String(d.get('item')||'').trim();if(!item)return;const st=load();if(!st.shopping.some(x=>matches(x.item,item)&&!x.done))st.shopping.push({id:'manual-shop-'+Date.now(),item,source:'',category:categoryFor(item),done:false});save(st);e.target.reset();renderData()})}
  function recipeScore(r,stock){const ing=r.ingredients||[],found=ing.filter(i=>stock.some(s=>matches(s.item,i))).length;return {found,total:ing.length,ratio:ing.length?found/ing.length:0}}
  function renderSuggestions(st){const root=document.querySelector('#plusCookFromHome');if(!root)return;if(!st.stock.length){root.innerHTML='<p class="empty">Lägg in några saker i kyl, frys eller skafferi så visas recept som passar.</p>';return}const ranked=recipesList().map(r=>({r,...recipeScore(r,st.stock)})).filter(x=>x.found>0).sort((a,b)=>b.ratio-a.ratio||b.found-a.found).slice(0,8);root.innerHTML=ranked.length?ranked.map(x=>`<article class="recipe-card"><h3>${x.r.emoji||'🍲'} ${x.r.name}</h3><p><strong>${x.found} av ${x.total}</strong> ingredienser matchar det du har hemma.</p><button type="button" class="primary" data-plus-open="${x.r.id}">Öppna recept</button></article>`).join(''):'<p class="empty">Inget recept matchar ännu.</p>';root.querySelectorAll('[data-plus-open]').forEach(b=>b.onclick=()=>window.openRecipe?.(b.dataset.plusOpen))}
  function choosePlace(item){const guess=/mjölk|grädde|yoghurt|filmjölk|kvarg|ost|smör|kött|kyckling|fisk|korv|ägg|tofu|tomat|gurka|paprika|sallad|spenat/i.test(item)?'Kyl':'Skafferi';const answer=window.prompt(`Var vill du lägga ${item}?\nSkriv Kyl, Frys eller Skafferi.`,guess);if(answer===null)return null;const clean=String(answer).trim().toLowerCase();if(clean==='kyl')return'Kyl';if(clean==='frys')return'Frys';if(clean==='skafferi')return'Skafferi';window.alert('Skriv Kyl, Frys eller Skafferi.');return choosePlace(item)}
  function renderData(){const st=load(),stock=document.querySelector('#plusStockList'),shop=document.querySelector('#plusShoppingList');renderSuggestions(st);if(stock){stock.innerHTML=st.stock.length?st.stock.map(x=>`<div class="history-meal"><strong>${x.item}</strong><small>${x.place} · ${x.amount}</small><div class="chips"><button type="button" class="secondary" data-plus-stock-add="${x.id}">+ Lägg till mer</button><button type="button" class="secondary" data-plus-stock-remove="${x.id}">Ta bort</button></div></div>`).join(''):'<p class="empty">Inget inlagt hemma ännu.</p>';stock.querySelectorAll('[data-plus-stock-add]').forEach(b=>b.onclick=()=>{const s=load(),item=s.stock.find(x=>String(x.id)===String(b.dataset.plusStockAdd));if(!item)return;const extra=window.prompt(`Hur mycket vill du lägga till av ${item.item}?\nDu har nu: ${item.amount}`,'');if(extra===null||!String(extra).trim())return;item.amount=combineAmounts(item.amount,extra)||String(extra).trim();clearCoveredAutoShopping(s,item.item);save(s);renderData()});stock.querySelectorAll('[data-plus-stock-remove]').forEach(b=>b.onclick=()=>{const s=load();s.stock=s.stock.filter(x=>String(x.id)!==String(b.dataset.plusStockRemove));save(s);renderData()})}if(shop){const groups={};st.shopping.forEach(x=>(groups[x.category||categoryFor(x.item)]||(groups[x.category||categoryFor(x.item)]=[])).push(x));shop.innerHTML=st.shopping.length?Object.entries(groups).map(([cat,items])=>`<div class="shopping-group"><h4>${cat}</h4>${items.map(x=>`<div class="history-meal"><strong>${x.item}</strong>${x.source?`<small>${x.source}</small>`:''}<div class="chips"><button type="button" class="primary" data-plus-shop-bought="${x.id}">✓ Handlat – lägg hemma</button><button type="button" class="secondary" data-plus-shop-remove="${x.id}">Ta bort från listan</button></div></div>`).join('')}</div>`).join(''):'<p class="empty">PLUS-listan är tom.</p>';shop.querySelectorAll('[data-plus-shop-bought]').forEach(b=>b.onclick=()=>{const s=load(),item=s.shopping.find(x=>String(x.id)===String(b.dataset.plusShopBought));if(!item)return;const amount=window.prompt(`Hur mycket ${item.item} har du handlat?`,'1 st');if(amount===null||!String(amount).trim())return;const place=choosePlace(item.item);if(!place)return;addStock(s,item.item,place,String(amount).trim());s.shopping=s.shopping.filter(x=>String(x.id)!==String(item.id));save(s);renderData()});shop.querySelectorAll('[data-plus-shop-remove]').forEach(b=>b.onclick=()=>{const s=load();s.shopping=s.shopping.filter(x=>String(x.id)!==String(b.dataset.plusShopRemove));save(s);renderData()})}}
  window.malixRenderSmartKitchen=()=>{if(!document.querySelector('main > #smartKitchen'))renderView();else renderData()};
  window.malixKitchenHasStock=food=>load().stock.some(x=>matches(x.item,food));
  window.malixGetKitchenStock=()=>load().stock.map(x=>({...x}));
  window.malixAddKitchenItem=(item,place='Kyl',amount='1 portion')=>{const st=load();addStock(st,item,place,amount);save(st);renderData();return true};
  window.malixDeductKitchenItems=items=>{const st=load();let changed=0,unmatched=0,emptied=0;for(const entry of items||[]){const food=entry?.food,quantity=entry?.quantity;if(!food)continue;const candidates=st.stock.filter(x=>matches(x.item,food));if(candidates.length!==1){unmatched++;continue}const item=candidates[0],result=subtractAmounts(item.amount,quantity);if(!result){unmatched++;continue}if(result.empty){st.stock=st.stock.filter(x=>x.id!==item.id);addShoppingBecauseEmpty(st,item.item);emptied++;changed++}else{item.amount=result.amount;changed++}}if(changed){save(st);renderData()}return {changed,unmatched,emptied}};
  window.malixAddRecipeMissingToPlusShopping=()=>0;
  installWriteTrace();
  renderView();
})();