(() => {
  'use strict';
  const data=()=>window.MalixNutritionDataV1;
  const esc=value=>String(value??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const num=value=>{const n=Number(String(value??'').replace(',','.'));return Number.isFinite(n)?n:null};
  const localKey=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  const mealDateKey=meal=>window.malixMealDateKey?.(meal)||(meal?.date?localKey(new Date(meal.date)):localKey(new Date()));
  const activeKey=()=>window.malixSelectedDateKey||localKey(new Date());
  const isPlus=()=>window.malixEntitlement?.isPlus===true;
  function gramsForItem(item){
    const explicit=Number(item?.nutritionGrams);
    if(Number.isFinite(explicit)&&explicit>0)return explicit;
    const amount=num(item?.amount),unit=String(item?.unit||'').trim().toLowerCase();
    if(amount==null||amount<=0)return null;
    if(unit==='g')return amount;
    if(unit==='kg')return amount*1000;
    return null;
  }
  function itemStatus(item){
    if(!item?.nutritionRef||item.nutritionRef.source!=='livsmedelsverket'||!item.nutritionRef.foodNumber)return'UNLINKED_FOOD';
    if(!data()?.getFood(item.nutritionRef.foodNumber))return'UNLINKED_FOOD';
    return gramsForItem(item)==null?'UNKNOWN_AMOUNT':'VALUE';
  }
  function calculateItems(items){
    const defs=data()?.nutrients||[],rows=Array.isArray(items)?items:[],nutrients={},unresolvedItems=[],calculable=[];
    defs.forEach(def=>nutrients[def.key]={key:def.key,eurofirCode:def.eurofirCode,unit:def.unit,label:def.label,value:null,status:'UNAVAILABLE',matchedItems:0,totalItems:rows.length});
    rows.forEach(item=>{
      const status=itemStatus(item);
      if(status!=='VALUE'){unresolvedItems.push({id:item?.id||null,status,label:item?.displayFood||item?.originalFood||item?.text||'Post'});return}
      const food=data().getFood(item.nutritionRef.foodNumber),grams=gramsForItem(item),map=new Map((food.nutrients||[]).map(n=>[`${n.eurofirCode}:${n.unit}`,n]));
      calculable.push(item);
      defs.forEach(def=>{
        const nutrient=map.get(def.key),out=nutrients[def.key];
        if(!nutrient||!Number.isFinite(Number(nutrient.value))){return}
        if(out.value===null)out.value=0;out.value+=Number(nutrient.value)*grams/100;out.matchedItems++;
      });
    });
    Object.values(nutrients).forEach(out=>{
      if(!rows.length)out.status='UNAVAILABLE';
      else if(out.matchedItems===rows.length)out.status='COMPLETE';
      else if(out.matchedItems>0)out.status='PARTIAL';
      else out.status='UNAVAILABLE';
    });
    let status='UNAVAILABLE';
    if(rows.length&&unresolvedItems.length===0&&Object.values(nutrients).every(n=>n.status==='COMPLETE'))status='COMPLETE';
    else if(calculable.length)status='PARTIAL';
    return{status,nutrients,unresolvedItems,totalItems:rows.length,calculatedItems:calculable.length};
  }
  function mealItems(meal){
    if(Array.isArray(meal?.items)&&meal.items.length)return meal.items;
    return[{id:`meal-${meal?.date||Math.random()}`,kind:'manual',source:meal?.source||'legacy',text:meal?.food||'Måltid'}];
  }
  function calculateMeals(meals){
    const all=[];(meals||[]).forEach(meal=>all.push(...mealItems(meal)));return calculateItems(all);
  }
  function dayMeals(key=activeKey()){
    try{const rows=JSON.parse(localStorage.getItem('malix-meals')||'[]');return Array.isArray(rows)?rows.filter(m=>mealDateKey(m)===key):[]}catch{return[]}
  }
  const fmt=(value,unit)=>{if(!Number.isFinite(value))return'–';const decimals=Math.abs(value)>=100?0:Math.abs(value)>=10?1:2;return`${value.toLocaleString('sv-SE',{maximumFractionDigits:decimals})} ${unit}`};
  const statusText=result=>result.status==='COMPLETE'?'✅ Full beräkning':result.status==='PARTIAL'?`⚠️ Delvis beräknat · ${result.calculatedItems} av ${result.totalItems} delar`:'❌ Otillräckliga data';
  function summaryHtml(result){
    const wanted=['ENERC:kcal','PROT:g','FAT:g','CHO:g','FIBT:g','NACL:g','CA:mg','FE:mg','MG:mg','K:mg','ZN:mg','VITD:µg','VITB12:µg','VITC:mg','FOL:µg'];
    return `<p class="status">${statusText(result)}</p><div class="dashboard-grid">${wanted.map(key=>{const n=result.nutrients[key];if(!n)return'';const suffix=n.status==='PARTIAL'?' · delvis':n.status==='UNAVAILABLE'?' · saknas':'';return `<article class="summary-card"><span>${esc(n.label)}</span><strong>${n.status==='UNAVAILABLE'?'–':esc(fmt(n.value,n.unit))}</strong><small>${esc(suffix)}</small></article>`}).join('')}</div>`;
  }
  function attributionHtml(){
    const s=data()?.source;if(!s)return'';
    return `<p class="note">Näringsdata: <a href="${esc(s.url)}" target="_blank" rel="noopener">Livsmedelsverkets Livsmedelsdatabas</a>, version ${esc(s.version)} · <a href="${esc(s.licenseUrl)}" target="_blank" rel="noopener">${esc(s.license)}</a>.</p>`;
  }
  function ensureDayPanel(){
    const view=document.querySelector('#foodLog');if(!view)return null;
    let root=view.querySelector('#nutritionPlusDay');
    if(!root){root=document.createElement('section');root.id='nutritionPlusDay';root.className='panel calm';root.style.marginTop='18px';const history=document.querySelector('#mealHistory');history?.insertAdjacentElement('afterend',root)}
    return root;
  }
  function renderMealSummaries(meals){
    if(!meals.length)return'';
    return `<h4 style="margin-top:16px">Näring per måltid</h4><div class="recipe-grid">${meals.map(meal=>{const result=calculateItems(mealItems(meal));return `<details class="recipe-card"><summary><strong>${esc(meal.meal||'Måltid')}</strong> · ${esc(statusText(result))}</summary><div style="margin-top:12px">${summaryHtml(result)}</div></details>`}).join('')}</div>`;
  }
  function renderDay(){
    const root=ensureDayPanel();if(!root)return;
    if(!isPlus()){root.hidden=true;return}
    root.hidden=false;const meals=dayMeals(),result=calculateMeals(meals);
    root.innerHTML=`<p class="eyebrow">PLUS · officiell näringsdata</p><h3>🥗 Näring för vald dag</h3>${meals.length?`${renderMealSummaries(meals)}<h4 style="margin-top:18px">Hela dagen</h4>${summaryHtml(result)}`:'<p class="note">Ingen mat registrerad den här dagen.</p>'}${attributionHtml()}`;
  }
  function ensureHomePanel(){
    const home=document.querySelector('#home .dashboard-panel');if(!home)return null;
    let root=home.querySelector('#nutritionPlusHome');
    if(!root){root=document.createElement('section');root.id='nutritionPlusHome';root.className='panel calm';root.style.marginTop='16px';home.appendChild(root)}
    return root;
  }
  function toggleFreeCards(hide){
    ['energySummary','vitaminSummary'].forEach(id=>{const el=document.querySelector('#'+id);const card=el?.closest('.summary-card');if(card)card.hidden=hide});
  }
  function renderHome(){
    const root=ensureHomePanel();if(!root)return;
    if(!isPlus()){root.hidden=true;toggleFreeCards(false);return}
    root.hidden=false;toggleFreeCards(true);const meals=dayMeals(localKey(new Date())),result=calculateMeals(meals);
    root.innerHTML=`<p class="eyebrow">PLUS · Livsmedelsverket</p><h3>Detaljerad näringsöversikt</h3>${meals.length?summaryHtml(result):'<p class="note">Ingen mat loggad ännu.</p>'}${attributionHtml()}`;
  }
  function ensureDraftPanel(){
    const form=document.querySelector('#mealForm'),flow=form?.querySelector('#simpleMealFlow');if(!form||!flow)return null;
    let root=flow.querySelector('#nutritionPlusDraft');
    if(!root){root=document.createElement('section');root.id='nutritionPlusDraft';root.className='panel';root.style.marginTop='14px';flow.appendChild(root)}
    return root;
  }
  function updateDraft(form,id,patch){
    if(typeof window.malixMealDraftUpdate!=='function')return null;
    return window.malixMealDraftUpdate(form,id,patch);
  }
  function setFoodForDraft(id,food){
    const form=document.querySelector('#mealForm');if(!form||!food)return;
    const entries=window.malixMealDraftGet?.(form)||[],item=entries.find(x=>String(x.id)===String(id));if(!item)return;
    const grams=gramsForItem(item);
    updateDraft(form,id,{nutritionRef:{source:'livsmedelsverket',foodNumber:food.foodNumber,sourceVersion:data().datasetVersion},...(grams?{nutritionGrams:grams}:{})});
    if(!grams){
      const answer=window.prompt(`${food.name} är kopplat. För näringsberäkning behövs vikt i gram eftersom ${item.amount||''} ${item.unit||''} inte kan omvandlas säkert.\n\nAnge gram eller lämna tomt för att göra det senare.`,'');
      if(answer!==null&&String(answer).trim()){const g=num(answer);if(g&&g>0)updateDraft(form,id,{nutritionGrams:g})}
    }
  }
  function searchForDraft(id){
    const q=window.prompt('Sök i Livsmedelsverkets lokala näringsdata. Skriv minst två bokstäver.','');if(q===null)return;
    const matches=data()?.search(q,8)||[];
    if(!matches.length){window.alert('Ingen kandidat hittades i den lokala referensdatan.');return}
    const list=matches.map((food,i)=>`${i+1}. ${food.name} · SLV ${food.foodNumber}`).join('\n');
    const answer=window.prompt(`Välj exakt livsmedel genom att skriva numret:\n\n${list}`,'1');if(answer===null)return;
    const chosen=matches[Number(answer)-1];if(!chosen){window.alert('Ogiltigt val. Ingen koppling gjordes.');return}
    setFoodForDraft(id,chosen);
  }
  function setDraftGrams(id){
    const form=document.querySelector('#mealForm'),entries=window.malixMealDraftGet?.(form)||[],item=entries.find(x=>String(x.id)===String(id));if(!item)return;
    const answer=window.prompt('Ange den faktiska vikten i gram.','');if(answer===null)return;const g=num(answer);if(!g||g<=0){window.alert('Ange en vikt större än 0 gram.');return}
    updateDraft(form,id,{nutritionGrams:g});
  }
  function renderDraft(){
    const root=ensureDraftPanel();if(!root)return;
    if(!isPlus()){root.hidden=true;return}
    root.hidden=false;const form=document.querySelector('#mealForm'),entries=window.malixMealDraftGet?.(form)||[];
    const rows=entries.filter(item=>item?.kind==='structured'||item?.source==='smart-kitchen-stock');
    root.innerHTML=`<p class="eyebrow">PLUS · Näringskoppling</p><h3>Koppla det du loggar</h3><p class="note">Text används bara för sökning. Du väljer själv rätt livsmedel från Livsmedelsverket.</p>${rows.length?rows.map(item=>{const status=itemStatus(item),food=item?.nutritionRef?data()?.getFood(item.nutritionRef.foodNumber):null,grams=gramsForItem(item);return `<article class="recipe-card"><strong>${esc(item.displayFood||item.originalFood||'Livsmedel')}</strong><p class="note">${food?`Kopplat: ${esc(food.name)} · SLV ${esc(food.foodNumber)}`:'Inte kopplat till Livsmedelsverket'}${grams?` · ${esc(fmt(grams,'g'))}`:status==='UNKNOWN_AMOUNT'?' · vikt i gram saknas':''}</p><div class="chips"><button type="button" class="secondary" data-nutrition-link="${esc(item.id)}">${food?'Byt koppling':'Koppla till livsmedel'}</button>${food&&!grams?`<button type="button" class="secondary" data-nutrition-grams="${esc(item.id)}">Ange gram</button>`:''}</div></article>`}).join(''):'<p class="note">Lägg till ett strukturerat livsmedel först.</p>'}`;
    root.querySelectorAll('[data-nutrition-link]').forEach(b=>b.onclick=()=>searchForDraft(b.dataset.nutritionLink));
    root.querySelectorAll('[data-nutrition-grams]').forEach(b=>b.onclick=()=>setDraftGrams(b.dataset.nutritionGrams));
  }
  function renderAll(){renderDraft();renderDay();renderHome()}
  window.MalixNutritionPlusV1=Object.freeze({gramsForItem,itemStatus,calculateItems,calculateMeals,dayMeals,renderMealSummaries,render:renderAll});
  ['malix-entitlement-changed','malix-meal-draft-changed','malix-meals-updated','malix-day-changed','malix-log-date-changed','malix-cloud-updated'].forEach(name=>document.addEventListener(name,()=>setTimeout(renderAll,0)));
  window.addEventListener('storage',()=>setTimeout(renderAll,0));
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(renderAll,0),{once:true});else setTimeout(renderAll,0);
})();