(() => {
  'use strict';
  const KEY='malix-user-recipes-v1';
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const read=()=>{try{const rows=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(rows)?rows:[]}catch{return[]}};
  const write=rows=>{localStorage.setItem(KEY,JSON.stringify(rows));document.dispatchEvent(new CustomEvent('malix-user-recipes-updated'))};
  const schema=()=>window.MalixRecipeSchema;
  const newId=()=>{const used=new Set(read().map(r=>String(r?.id||'')));for(let attempt=0;attempt<10;attempt++){const id=`user-recipe-${crypto.randomUUID?crypto.randomUUID():Date.now()+'-'+Math.random().toString(36).slice(2,9)}`;if(!used.has(id))return id}throw new Error('Kunde inte skapa ett unikt recept-ID.');};
  const normalizeTags=value=>[...new Set(String(value||'').split(',').map(x=>x.trim().toLocaleLowerCase('sv-SE')).filter(Boolean))];
  const parseIngredientRow=rawText=>{
    const text=String(rawText||'').trim(),catalog=window.MalixIngredientCatalog;
    const quantity=text.match(/^(\d+(?:[.,]\d+)?)\s+(kg|g|l|dl|ml|tsk|msk|st|skiva|bit|portion)\s+(.+)$/i);
    if(quantity){
      const amount=Number(quantity[1].replace(',','.')),unit=quantity[2].toLowerCase(),name=quantity[3].trim(),canonical=catalog?.resolveExact?.(name);
      return {rawText:text,ingredientId:canonical?.id||null,amount:Number.isFinite(amount)&&amount>0?amount:null,unit};
    }
    const canonical=catalog?.resolveExact?.(text);
    return {rawText:text,ingredientId:canonical?.id||null,amount:null,unit:null};
  };
  const ingredientRows=(value,existing=[])=>String(value||'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean).map((rawText,index)=>{
    const previous=Array.isArray(existing)?existing[index]:null;
    if(previous&&String(previous.rawText||'').trim()===rawText)return {...previous,rawText};
    return parseIngredientRow(rawText);
  });
  const stepRows=value=>String(value||'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
  const getById=id=>read().find(r=>String(r?.id)===String(id))||null;
  const validationOk=result=>result&&result.persistenceEligibility==='PRODUCTION_ALLOWED'&&result.status!=='INVALID';
  function build(values,existing=null){
    const s=schema();if(!s?.validateRecipe)throw new Error('Receptvalideringen är inte tillgänglig.');
    const now=new Date().toISOString(),servings=String(values.servings||'').trim();
    return {
      id:existing?.id||newId(),
      schemaVersion:s.schemaVersion,
      name:String(values.name||'').trim(),
      language:'sv',
      tags:normalizeTags(values.tags),
      ingredients:ingredientRows(values.ingredients,existing?.ingredients),
      steps:stepRows(values.steps),
      servings:servings?Number(servings):null,
      source:{kind:'user-created'},
      media:[],
      createdAt:existing?.createdAt||now,
      updatedAt:now
    };
  }
  function saveRecipe(values,id=null){
    const rows=read(),index=id?rows.findIndex(r=>String(r?.id)===String(id)):-1,existing=index>=0?rows[index]:null,recipe=build(values,existing);
    const validation=schema().validateRecipe(recipe);
    if(!validationOk(validation))return {saved:false,validation,recipe};
    if(index>=0)rows[index]=recipe;else rows.unshift(recipe);
    write(rows);return {saved:true,validation,recipe};
  }
  function updateIngredientNutrition(id,index,patch={}){
    const rows=read(),recipeIndex=rows.findIndex(r=>String(r?.id)===String(id));
    if(recipeIndex<0)return {saved:false,error:'RECIPE_NOT_FOUND'};
    const recipe=rows[recipeIndex],ingredients=Array.isArray(recipe.ingredients)?recipe.ingredients.map(i=>({...i})):[];
    if(!Number.isInteger(index)||index<0||index>=ingredients.length)return {saved:false,error:'INGREDIENT_NOT_FOUND'};
    const next={...ingredients[index]};
    if(Object.prototype.hasOwnProperty.call(patch,'nutritionRef')){
      if(patch.nutritionRef==null)delete next.nutritionRef;
      else next.nutritionRef={...patch.nutritionRef};
    }
    if(Object.prototype.hasOwnProperty.call(patch,'nutritionGrams')){
      const grams=Number(patch.nutritionGrams);
      if(patch.nutritionGrams==null||!Number.isFinite(grams)||grams<=0)delete next.nutritionGrams;
      else next.nutritionGrams=grams;
    }
    ingredients[index]=next;
    const updated={...recipe,ingredients,updatedAt:new Date().toISOString()},validation=schema().validateRecipe(updated);
    if(!validationOk(validation))return {saved:false,validation,recipe:updated};
    rows[recipeIndex]=updated;write(rows);return {saved:true,validation,recipe:updated};
  }
  function removeRecipe(id){const rows=read(),next=rows.filter(r=>String(r?.id)!==String(id));if(next.length===rows.length)return false;write(next);return true}
  function renderRecipe(recipe){
    const root=document.querySelector('#recipeDetail');if(!root)return false;
    const ingredients=(recipe.ingredients||[]).map(i=>`<li>${esc(i?.rawText||'')}</li>`).join('');
    const steps=(recipe.steps||[]).map(s=>`<li>${esc(s)}</li>`).join('');
    root.innerHTML=`<article class="recipe-detail" data-user-recipe-id="${esc(recipe.id)}"><div class="meta"><span class="badge">Mitt recept</span>${recipe.servings?`<span class="badge">🍽️ ${esc(recipe.servings)} portioner</span>`:''}</div><h2>${esc(recipe.name)}</h2><h3>Det här behöver du</h3><ul class="ingredient-list">${ingredients}</ul><h3>En sak i taget</h3><ol class="steps">${steps}</ol><div class="panel calm"><h3>När maten är lagad</h3><p>Lagret ändras bara för ingredienser som har en säker canonical identitet och strukturerad mängd.</p><button class="primary" type="button" data-user-cooked="${esc(recipe.id)}">✓ Jag lagade detta</button><p id="recipeCookStatus" class="status" aria-live="polite"></p></div><div class="chips"><button type="button" class="secondary" data-user-edit="${esc(recipe.id)}">Redigera</button><button type="button" class="secondary" data-user-delete="${esc(recipe.id)}">Radera</button></div></article>`;
    root.querySelector('[data-user-cooked]')?.addEventListener('click',()=>window.markRecipeCooked?.(recipe.id));
    root.querySelector('[data-user-edit]')?.addEventListener('click',()=>openEditor(recipe.id));
    root.querySelector('[data-user-delete]')?.addEventListener('click',()=>{if(window.confirm(`Radera receptet "${recipe.name}"?`)){removeRecipe(recipe.id);showBank()}});
    document.querySelectorAll('main > .view').forEach(v=>v.classList.toggle('active-view',v.id==='recipe'));window.scrollTo({top:0,behavior:'smooth'});return true;
  }
  function ensureUi(){
    const bank=document.querySelector('#recipeBank');if(!bank||bank.querySelector('[data-user-recipes-section]'))return;
    const results=bank.querySelector('#recipeBankResults');
    const section=document.createElement('section');section.dataset.userRecipesSection='true';section.className='panel calm';section.innerHTML=`<div class="dashboard-heading"><div><p class="eyebrow">Mina recept</p><h3>Recept du själv har sparat</h3></div><button type="button" class="primary" data-user-new>+ Lägg till eget recept</button></div><div id="userRecipeResults" class="recipe-grid"></div><div id="userRecipeEditor" hidden></div>`;
    bank.insertBefore(section,results);
    if(results){const h=document.createElement('h3');h.textContent='Malix recept';bank.insertBefore(h,results)}
    section.querySelector('[data-user-new]')?.addEventListener('click',()=>openEditor());
    renderList();
  }
  function renderList(){
    const root=document.querySelector('#userRecipeResults');if(!root)return;
    const rows=read();root.innerHTML=rows.length?rows.map(r=>`<article class="recipe-card"><small>Mitt recept</small><h3>${esc(r.name)}</h3><p>${esc((r.tags||[]).join(' · '))}</p><button type="button" class="primary" data-user-open="${esc(r.id)}">Öppna recept</button></article>`).join(''):'<p class="note">Du har inga egna recept ännu.</p>';
    root.querySelectorAll('[data-user-open]').forEach(b=>b.addEventListener('click',()=>window.openRecipe?.(b.dataset.userOpen)));
  }
  function openEditor(id=null){
    ensureUi();const root=document.querySelector('#userRecipeEditor');if(!root)return;const recipe=id?getById(id):null;
    root.hidden=false;root.innerHTML=`<form id="userRecipeForm" class="record-form"><h3>${recipe?'Redigera recept':'Lägg till eget recept'}</h3><label>Namn<input name="name" required value="${esc(recipe?.name||'')}"></label><label>Portioner<input name="servings" type="number" min="0.1" step="0.1" value="${esc(recipe?.servings??'')}"></label><label>Kategori / taggar<input name="tags" placeholder="t.ex. middag, soppa" value="${esc((recipe?.tags||[]).join(', '))}"></label><label>Ingredienser – en per rad<textarea name="ingredients" rows="7" required>${esc((recipe?.ingredients||[]).map(i=>i?.rawText||'').join('\n'))}</textarea></label><label>Tillagningssteg – ett per rad<textarea name="steps" rows="7" required>${esc((recipe?.steps||[]).join('\n'))}</textarea></label><div class="chips"><button class="primary" type="submit">Spara recept</button><button class="secondary" type="button" data-user-cancel>Avbryt</button></div><p class="status" data-user-status></p></form>`;
    const form=root.querySelector('#userRecipeForm');form.addEventListener('submit',e=>{e.preventDefault();const values=Object.fromEntries(new FormData(form).entries()),result=saveRecipe(values,recipe?.id||null),status=form.querySelector('[data-user-status]');if(!result.saved){const first=result.validation?.errors?.[0]?.message||'Receptet kunde inte valideras.';status.textContent=first;return}root.hidden=true;root.innerHTML='';renderList()});
    root.querySelector('[data-user-cancel]')?.addEventListener('click',()=>{root.hidden=true;root.innerHTML=''});
    root.scrollIntoView({behavior:'smooth',block:'start'});
  }
  function showBank(){document.querySelectorAll('main > .view').forEach(v=>v.classList.toggle('active-view',v.id==='recipeBank'));ensureUi();renderList();window.scrollTo({top:0,behavior:'smooth'})}
  const previousOpen=window.openRecipe;
  window.openRecipe=function(id,...args){const recipe=getById(id);if(recipe)return renderRecipe(recipe);return typeof previousOpen==='function'?previousOpen.call(this,id,...args):undefined};
  window.MalixUserRecipes=Object.freeze({key:KEY,list:()=>read().map(r=>({...r})),getById,save:saveRecipe,remove:removeRecipe,updateIngredientNutrition,renderList,openEditor});
  document.addEventListener('malix-user-recipes-updated',renderList);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensureUi,{once:true});else ensureUi();
})();