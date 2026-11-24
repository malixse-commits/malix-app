(() => {
  'use strict';

  let currentRecipeId=null;
  const esc=value=>String(value??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const num=value=>{const n=Number(String(value??'').replace(',','.'));return Number.isFinite(n)?n:null};
  const data=()=>window.MalixNutritionDataV1;
  const calculator=()=>window.MalixNutritionPlusV1;
  const isPlus=()=>window.malixEntitlement?.isPlus===true;
  const validServings=value=>typeof value==='number'&&Number.isFinite(value)&&value>0;

  function gramsForIngredient(ingredient){
    const explicit=Number(ingredient?.nutritionGrams);
    if(Number.isFinite(explicit)&&explicit>0)return explicit;
    const amount=num(ingredient?.amount),unit=String(ingredient?.unit||'').trim().toLowerCase();
    if(amount==null||amount<=0)return null;
    if(unit==='g')return amount;
    if(unit==='kg')return amount*1000;
    return null;
  }

  function validNutritionRef(ref){
    if(!ref||ref.source!=='livsmedelsverket'||!ref.foodNumber)return null;
    const food=data()?.getFood?.(ref.foodNumber);
    return food?{source:'livsmedelsverket',foodNumber:food.foodNumber,sourceVersion:String(ref.sourceVersion||data()?.datasetVersion||'')}:null;
  }

  function userItems(recipe){
    return (Array.isArray(recipe?.ingredients)?recipe.ingredients:[]).map((ingredient,index)=>{
      const ref=validNutritionRef(ingredient?.nutritionRef);
      const grams=gramsForIngredient(ingredient);
      return {
        id:`user-recipe-${recipe?.id||'recipe'}-${index}`,
        kind:'recipe-ingredient',
        source:'user-recipe',
        text:ingredient?.rawText||'Ingrediens',
        amount:ingredient?.amount,
        unit:ingredient?.unit,
        ...(ref?{nutritionRef:ref}:{}),
        ...(grams?{nutritionGrams:grams}:{})
      };
    });
  }

  function verifiedMalixRef(ingredientId){
    const mapping=window.MalixRecipeNutritionLinksV1?.get?.(ingredientId);
    if(!mapping)return null;
    const food=data()?.getFood?.(mapping.foodNumber);
    if(!food||String(food.name)!==String(mapping.slvName))return null;
    return {source:'livsmedelsverket',foodNumber:food.foodNumber,sourceVersion:data()?.datasetVersion};
  }

  function malixResolution(recipeId){
    return window.MalixCanonicalIngredientResolution?.recipeEntries?.find?.(entry=>String(entry?.recipeId)===String(recipeId))||null;
  }

  function malixItems(recipe){
    const resolution=malixResolution(recipe?.id),resolved=Array.isArray(resolution?.ingredients)?resolution.ingredients:[];
    const raw=Array.isArray(recipe?.ingredients)?recipe.ingredients:[];
    return raw.map((rawText,index)=>{
      const ingredient=resolved[index]||{},ref=verifiedMalixRef(ingredient?.ingredientId),grams=gramsForIngredient(ingredient);
      return {
        id:`malix-recipe-${recipe?.id||'recipe'}-${index}`,
        kind:'recipe-ingredient',
        source:'malix-recipe',
        text:ingredient?.rawText||rawText||'Ingrediens',
        amount:ingredient?.amount,
        unit:ingredient?.unit,
        ...(ref?{nutritionRef:ref}:{}),
        ...(grams?{nutritionGrams:grams}:{})
      };
    });
  }

  function calculateRecipe(recipe,{user=false}={}){
    const engine=calculator();
    if(!engine?.calculateItems)return null;
    return engine.calculateItems(user?userItems(recipe):malixItems(recipe));
  }

  function perServing(result,servings){
    if(!result||!validServings(servings))return null;
    const nutrients={};
    Object.entries(result.nutrients||{}).forEach(([key,row])=>{
      nutrients[key]={...row,value:Number.isFinite(row?.value)?row.value/servings:row?.value};
    });
    return {...result,nutrients,servings};
  }

  const fmt=(value,unit)=>{
    if(!Number.isFinite(value))return'–';
    const decimals=Math.abs(value)>=100?0:Math.abs(value)>=10?1:2;
    return `${value.toLocaleString('sv-SE',{maximumFractionDigits:decimals})} ${unit}`;
  };

  const statusText=result=>result?.status==='COMPLETE'
    ?'✅ Komplett beräkning'
    :result?.status==='PARTIAL'
      ?`⚠️ Delvis beräknat · ${result.calculatedItems} av ${result.totalItems} ingredienser`
      :'❌ Otillräckliga data';

  function summaryHtml(result){
    if(!result)return'<p class="note">Näringsberäkningen är inte tillgänglig.</p>';
    const wanted=['ENERC:kcal','PROT:g','FAT:g','CHO:g','FIBT:g','NACL:g','CA:mg','FE:mg','MG:mg','K:mg','ZN:mg','VITD:µg','VITB12:µg','VITC:mg','FOL:µg'];
    return `<p class="status">${esc(statusText(result))}</p><div class="dashboard-grid">${wanted.map(key=>{
      const nutrient=result.nutrients?.[key];
      if(!nutrient)return'';
      const suffix=nutrient.status==='PARTIAL'?' · delvis':nutrient.status==='UNAVAILABLE'?' · saknas':'';
      return `<article class="summary-card"><span>${esc(nutrient.label)}</span><strong>${nutrient.status==='UNAVAILABLE'?'–':esc(fmt(nutrient.value,nutrient.unit))}</strong><small>${esc(suffix)}</small></article>`;
    }).join('')}</div>`;
  }

  function cleanSearchText(rawText){
    return String(rawText||'')
      .replace(/^\s*\d+(?:[.,]\d+)?\s+(?:kg|g|l|dl|ml|tsk|msk|st|skiva|bit|portion)\s+/i,'')
      .replace(/\s+[–-].*$/,'')
      .trim();
  }

  function updateUserIngredient(recipeId,index,patch){
    return window.MalixUserRecipes?.updateIngredientNutrition?.(recipeId,index,patch)||{saved:false};
  }

  function chooseFood(recipeId,index,ingredient){
    const initial=cleanSearchText(ingredient?.rawText),query=window.prompt('Sök i Livsmedelsverkets lokala näringsdata. Texten används bara för kandidater – du väljer själv exakt livsmedel.',initial);
    if(query===null)return;
    const matches=data()?.search?.(query,8)||[];
    if(!matches.length){window.alert('Ingen kandidat hittades i den lokala näringsdatan.');return}
    const list=matches.map((food,i)=>`${i+1}. ${food.name} · SLV ${food.foodNumber}`).join('\n');
    const answer=window.prompt(`Välj exakt livsmedel genom att skriva numret:\n\n${list}`,'1');
    if(answer===null)return;
    const chosen=matches[Number(answer)-1];
    if(!chosen){window.alert('Ogiltigt val. Ingen koppling gjordes.');return}
    const saved=updateUserIngredient(recipeId,index,{nutritionRef:{source:'livsmedelsverket',foodNumber:chosen.foodNumber,sourceVersion:data()?.datasetVersion}});
    if(!saved?.saved){window.alert('Kopplingen kunde inte sparas.');return}
    window.openRecipe?.(recipeId);
  }

  function setGrams(recipeId,index){
    const answer=window.prompt('Ange den faktiska vikten i gram.','');
    if(answer===null)return;
    const grams=num(answer);
    if(grams==null||grams<=0){window.alert('Ange en vikt större än 0 gram.');return}
    const saved=updateUserIngredient(recipeId,index,{nutritionGrams:grams});
    if(!saved?.saved){window.alert('Vikten kunde inte sparas.');return}
    window.openRecipe?.(recipeId);
  }

  function userControlsHtml(recipe){
    const ingredients=Array.isArray(recipe?.ingredients)?recipe.ingredients:[];
    if(!ingredients.length)return'';
    return `<h4 style="margin-top:18px">Ingredienser och SLV-koppling</h4><div class="recipe-grid">${ingredients.map((ingredient,index)=>{
      const food=validNutritionRef(ingredient?.nutritionRef)?data()?.getFood?.(ingredient.nutritionRef.foodNumber):null;
      const grams=gramsForIngredient(ingredient);
      const amountText=grams?`${fmt(grams,'g')}`:'säker gramvikt saknas';
      return `<article class="recipe-card"><strong>${esc(ingredient?.rawText||'Ingrediens')}</strong><p class="note">${food?`Kopplat: ${esc(food.name)} · SLV ${esc(food.foodNumber)}`:'Inte kopplat till Livsmedelsverket'} · ${esc(amountText)}</p><div class="chips"><button type="button" class="secondary" data-recipe-nutrition-link="${index}">${food?'Byt koppling':'Koppla till livsmedel'}</button>${food&&!grams?`<button type="button" class="secondary" data-recipe-nutrition-grams="${index}">Ange gram</button>`:''}</div></article>`;
    }).join('')}</div>`;
  }

  function attributionHtml(){
    const source=data()?.source;
    if(!source)return'';
    return `<p class="note">Näringsdata: <a href="${esc(source.url)}" target="_blank" rel="noopener">Livsmedelsverkets Livsmedelsdatabas</a>, version ${esc(source.version)} · <a href="${esc(source.licenseUrl)}" target="_blank" rel="noopener">${esc(source.license)}</a>.</p>`;
  }

  function hideLegacyPlaceholder(root){
    const heading=[...root.querySelectorAll('h3')].find(node=>node.textContent.trim()==='Vad får jag med mig?');
    if(!heading)return;
    heading.hidden=true;
    if(heading.nextElementSibling?.classList?.contains('note'))heading.nextElementSibling.hidden=true;
  }

  function renderForRecipe(id){
    const root=document.querySelector('#recipeDetail');
    if(!root)return;
    root.querySelector('[data-recipe-nutrition-v1]')?.remove();
    if(!isPlus())return;

    const userRecipe=window.MalixUserRecipes?.getById?.(id)||null;
    const recipe=userRecipe||(window.malixRecipeCatalog||[]).find?.(row=>String(row?.id)===String(id));
    if(!recipe)return;

    const result=calculateRecipe(recipe,{user:!!userRecipe});
    const portion=perServing(result,recipe.servings);
    if(!userRecipe)hideLegacyPlaceholder(root);

    const section=document.createElement('section');
    section.dataset.recipeNutritionV1='true';
    section.className='panel calm';
    section.style.marginTop='18px';
    section.innerHTML=`<p class="eyebrow">PLUS · officiell näringsdata</p><h3>Näringsinnehåll</h3><h4>Hela receptet</h4>${summaryHtml(result)}${portion?`<h4 style="margin-top:18px">Per portion</h4>${summaryHtml(portion)}`:'<p class="note">Per portion visas först när receptet har ett giltigt portionsantal.</p>'}${userRecipe?userControlsHtml(userRecipe):''}${attributionHtml()}`;

    const article=root.querySelector('.recipe-detail')||root;
    const cooked=[...article.querySelectorAll('.panel')].find(node=>node.querySelector('#recipeCookStatus')||node.querySelector('[data-user-cooked]'));
    if(cooked)article.insertBefore(section,cooked);else article.appendChild(section);

    if(userRecipe){
      section.querySelectorAll('[data-recipe-nutrition-link]').forEach(button=>button.addEventListener('click',()=>chooseFood(recipe.id,Number(button.dataset.recipeNutritionLink),recipe.ingredients[Number(button.dataset.recipeNutritionLink)])));
      section.querySelectorAll('[data-recipe-nutrition-grams]').forEach(button=>button.addEventListener('click',()=>setGrams(recipe.id,Number(button.dataset.recipeNutritionGrams))));
    }
  }

  function renderCurrent(){if(currentRecipeId!=null)renderForRecipe(currentRecipeId)}

  const previousOpen=window.openRecipe;
  window.openRecipe=function(id,...args){
    const result=typeof previousOpen==='function'?previousOpen.call(this,id,...args):undefined;
    currentRecipeId=id;
    setTimeout(()=>renderForRecipe(id),0);
    return result;
  };

  document.addEventListener('malix-entitlement-changed',()=>{
    if(currentRecipeId==null)return;
    setTimeout(()=>window.openRecipe?.(currentRecipeId),0);
  });

  window.MalixRecipeNutritionV1=Object.freeze({
    gramsForIngredient,
    userItems,
    malixItems,
    calculateRecipe,
    perServing,
    render:renderForRecipe,
    verifiedMalixRef
  });
})();
