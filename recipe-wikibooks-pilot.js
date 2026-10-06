(() => {
  'use strict';

  const schema = window.MalixRecipeSchema;
  if (!schema?.validateRecipe) throw new Error('MalixRecipeSchema.validateRecipe saknas.');
  const catalog = window.MalixIngredientCatalog;
  const originalOpenRecipe = window.openRecipe;
  if (typeof originalOpenRecipe !== 'function') throw new Error('window.openRecipe saknas.');

  const importedAt = '2026-10-06T08:00:00Z';
  const licenseUrl = 'https://creativecommons.org/licenses/by-sa/4.0/';
  const esc = v => String(v ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
  const ing = (rawText, ingredientId=null, amount=null, unit=null, note=null) => {
    const row = ingredientId && catalog?.getById ? catalog.getById(ingredientId) : null;
    return Object.freeze({rawText,ingredientId:row?.id||null,parentIngredientId:row?.parentIngredientId||null,name:row?.name||null,amount,unit,optional:false,note});
  };
  const src = (originalTitle, oldid, attribution) => Object.freeze({
    kind:'open-licensed',provider:'Wikibooks Cookbook',
    sourceUrl:`https://en.wikibooks.org/w/index.php?title=${oldid.title}&oldid=${oldid.id}`,
    license:'CC BY-SA 4.0',licenseUrl,author:'Wikibooks contributors',attribution,importedAt,modified:true,originalTitle
  });
  const freezeRecipe = r => Object.freeze({...r,schemaVersion:schema.schemaVersion,language:'sv',tags:Object.freeze(r.tags),ingredients:Object.freeze(r.ingredients),steps:Object.freeze(r.steps),equipment:Object.freeze(r.equipment||[]),leftovers:Object.freeze(r.leftovers||[]),source:r.source,media:Object.freeze([])});

  const recipes = Object.freeze([
    freezeRecipe({
      id:'wikibooks-lax-honungssenap',name:'Lax med honungssenap',servings:4,time:Object.freeze({prep:10,cook:20,total:30}),budget:'mid',
      tags:['fisk','middag','snabbt','ugn','wikibooks'],
      ingredients:[ing('600 g laxfilé','lax',600,'g'),ing('3 msk honung',null,3,'msk'),ing('2 msk grovkornig senap',null,2,'msk'),ing('1 msk citronjuice',null,1,'msk'),ing('0,5 tsk salt','salt',0.5,'tsk'),ing('0,25 tsk svartpeppar','svartpeppar',0.25,'tsk'),ing('1 msk hackad dill, valfritt',null,1,'msk','Malix-twist')],
      steps:['Sätt ugnen på 180 °C och lägg laxen i en lätt smord ugnsform.','Rör ihop honung, senap och citronjuice. Smaka av med salt och svartpeppar.','Bred blandningen över laxen och strö över dill om du vill.','Tillaga mitt i ugnen cirka 15–20 minuter, tills laxen precis är genomlagad.','Låt vila någon minut före servering.'],
      equipment:['ugnsform','liten skål','sked'],leftovers:['lax'],serving:'Passar med potatis, ris eller en enkel sallad.',tip:'Malix-twist: citron och dill gör glasyren friskare. Smaka av efter egen smak.',doneness:'Laxen ska vara varm och lätt dela sig i flagor utan att kännas torr.',
      source:src('Honey Mustard Salmon',{title:'Cookbook:Honey_Mustard_Salmon',id:'4613365'},'Bearbetad och översatt svensk version av “Honey Mustard Salmon”, Wikibooks Cookbook, CC BY-SA 4.0.')
    }),
    freezeRecipe({
      id:'wikibooks-kikartsgryta-garam-masala',name:'Kikärtsgryta med tomat och garam masala',servings:4,time:Object.freeze({prep:10,cook:20,total:30}),budget:'low',
      tags:['vegetariskt','gryta','middag','budget','wikibooks'],
      ingredients:[ing('2 burkar kikärter, avrunna','kikarter'),ing('1 st lök','lok',1,'st'),ing('2 st vitlöksklyftor',null,2,'st'),ing('1 msk rapsolja','rapsolja',1,'msk'),ing('2 st tomater, hackade','tomat',2,'st'),ing('1 msk garam masala',null,1,'msk'),ing('1 tsk gurkmeja',null,1,'tsk'),ing('1 tsk malen spiskummin',null,1,'tsk'),ing('0,5 tsk salt','salt',0.5,'tsk'),ing('0,25 tsk chiliflakes, valfritt','chiliflakes',0.25,'tsk','Malix-twist'),ing('1 dl vatten','vatten',1,'dl')],
      steps:['Hacka lök och vitlök. Skölj kikärterna och låt dem rinna av.','Värm oljan i en gryta och mjukstek löken några minuter. Tillsätt vitlök och spiskummin.','Rör ner garam masala, gurkmeja, tomat och eventuellt chiliflakes.','Tillsätt kikärter och vatten. Låt sjuda utan lock cirka 15 minuter.','Smaka av med salt. Grytan ska bli mustig och lätt tjock i konsistensen.'],
      equipment:['gryta','kniv','skärbräda'],leftovers:['kikärter','tomat'],serving:'Servera med ris, bröd eller en klick yoghurt om du vill.',tip:'Malix-twist: lite chiliflakes ger värme men kan hoppas över helt.',doneness:'Kikärterna ska vara varma och såsen lätt tjocknad.',
      source:src('Cholley (Chickpea Curry)',{title:'Cookbook:Cholley_(Chickpea_Curry)',id:'4436533'},'Bearbetad och översatt svensk version av “Cholley (Chickpea Curry)”, Wikibooks Cookbook, CC BY-SA 4.0.')
    }),
    freezeRecipe({
      id:'wikibooks-rod-linssoppa-citron',name:'Röd linssoppa med vitlök och citron',servings:4,time:Object.freeze({prep:10,cook:30,total:40}),budget:'low',
      tags:['soppa','vegetariskt','budget','vardag','wikibooks'],
      ingredients:[ing('2 msk olivolja eller rapsolja',null,2,'msk'),ing('1 st lök','lok',1,'st'),ing('2 st morötter','morot',2,'st'),ing('2 st vitlöksklyftor',null,2,'st'),ing('250 g röda linser',null,250,'g'),ing('1,5 l vatten eller grönsaksbuljong',null,1.5,'l'),ing('1 st lagerblad',null,1,'st'),ing('1 tsk oregano',null,1,'tsk'),ing('0,25 tsk chiliflakes, valfritt','chiliflakes',0.25,'tsk'),ing('1 msk citronjuice',null,1,'msk'),ing('salt efter smak','salt')],
      steps:['Skölj linserna. Hacka lök och vitlök och skär morötterna i små bitar.','Värm oljan i en gryta. Mjukstek lök och morot några minuter och tillsätt sedan vitlöken.','Häll i linser, vatten eller buljong, lagerblad och oregano. Tillsätt chiliflakes om du vill.','Låt sjuda 20–30 minuter tills linser och morötter är mjuka.','Ta bort lagerbladet. Smaka av med citron och salt.'],
      equipment:['gryta','kniv','skärbräda'],leftovers:['morot','soppa'],serving:'Gott med bröd eller en klick yoghurt.',tip:'Smaka av med citron precis före servering. Lite extra oregano eller chili kan läggas till efter egen smak.',doneness:'Linserna och morötterna ska vara mjuka och soppan sammanhållen.',
      source:src('Red Lentil Soup',{title:'Cookbook:Red_Lentil_Soup',id:'4518501'},'Bearbetad och översatt svensk version av “Red Lentil Soup”, Wikibooks Cookbook, CC BY-SA 4.0.')
    }),
    freezeRecipe({
      id:'wikibooks-hummus-citron-vitlok',name:'Hummus med citron och vitlök',servings:4,time:Object.freeze({prep:10,cook:0,total:10}),budget:'low',
      tags:['snacks','vegetariskt','snabbt','mellanmål','tillbehör','wikibooks'],
      ingredients:[ing('1 burk kikärter, cirka 400 g','kikarter'),ing('2 msk tahini',null,2,'msk'),ing('3 msk citronjuice',null,3,'msk'),ing('2 msk olivolja',null,2,'msk'),ing('1 st vitlöksklyfta',null,1,'st'),ing('0,5 tsk salt','salt',0.5,'tsk'),ing('2–4 msk vatten','vatten',null,'msk'),ing('0,5 tsk spiskummin, valfritt',null,0.5,'tsk','Malix-twist')],
      steps:['Skölj kikärterna och låt dem rinna av.','Mixa kikärter, tahini, citronjuice, olivolja, vitlök och salt.','Tillsätt vatten lite i taget tills hummusen är så krämig som du vill ha den.','Smaka av. Tillsätt spiskummin eller lite extra citron om det passar dig.'],
      equipment:['mixer eller matberedare','sil'],leftovers:['kikärter','hummus'],serving:'Servera som dipp till grönsaker eller bröd, eller som pålägg.',tip:'Malix-twist: en liten nypa spiskummin eller chili kan ge mer smak.',doneness:'Hummusen ska vara slät och krämig men fortfarande hålla formen som dipp.',
      source:src('Hummus III',{title:'Cookbook:Hummus_III',id:'4630237'},'Bearbetad och översatt svensk version av “Hummus III”, Wikibooks Cookbook, CC BY-SA 4.0.')
    }),
    freezeRecipe({
      id:'wikibooks-honungspannkakor',name:'Honungspannkakor',servings:4,time:Object.freeze({prep:10,cook:20,total:30}),budget:'low',
      tags:['frukost','mellanmål','efterrätt','fika','vegetariskt','wikibooks'],
      ingredients:[ing('5 dl vetemjöl',null,5,'dl'),ing('2 tsk bakpulver',null,2,'tsk'),ing('0,25 tsk salt','salt',0.25,'tsk'),ing('2 msk strösocker',null,2,'msk'),ing('5 dl mjölk','mjolk',5,'dl'),ing('2 st ägg',null,2,'st'),ing('2 msk smält smör',null,2,'msk'),ing('honung till servering'),ing('0,5 tsk kanel, valfritt',null,0.5,'tsk','Malix-twist')],
      steps:['Blanda mjöl, bakpulver, salt och socker i en skål.','Vispa ihop mjölk, ägg och smält smör i en annan skål.','Rör ner det våta i det torra till en jämn smet. Blanda i kanel om du vill.','Stek mindre pannkakor i en lätt smord panna på medelvärme.','Vänd när små bubblor syns på ytan och stek andra sidan gyllene.','Servera med lite honung och gärna frukt eller bär.'],
      equipment:['två skålar','visp','stekpanna','stekspade'],leftovers:['pannkakor'],serving:'Passar till frukost, mellanmål eller enkel efterrätt.',tip:'Malix-twist: lite kanel i smeten och frukt eller bär ovanpå gör det enkelt att variera.',doneness:'Pannkakorna ska vara gyllene på båda sidor och genomstekta i mitten.',
      source:src('Pancakes with Honey',{title:'Cookbook:Pancakes_with_Honey',id:'4479253'},'Bearbetad och översatt svensk version av “Pancakes with Honey”, Wikibooks Cookbook, CC BY-SA 4.0.')
    })
  ]);

  const entries = Object.freeze(recipes.map(recipe => Object.freeze({recipe,validation:schema.validateRecipe(recipe)})));
  window.MalixImportedRecipeCatalog = Object.freeze({entries,info:Object.freeze({total:entries.length})});
  const byId = new Map(recipes.map(r=>[r.id,r]));
  let activeTag='alla';

  const emoji = r => r.tags.includes('fisk')?'🐟':r.tags.includes('soppa')?'🍲':r.tags.includes('snacks')?'🥣':r.tags.includes('frukost')?'🥞':r.tags.includes('vegetariskt')?'🌿':'🍽️';
  const card = r => `<article class="recipe-card" data-imported-recipe-card="${esc(r.id)}"><div class="meta"><span class="badge">${emoji(r)}</span><span class="badge">⏱️ ${esc(r.time.total)} min</span><span class="badge">${r.budget==='low'?'💰':'💰💰'}</span></div><h3>${esc(r.name)}</h3><p>${esc(r.tip||'')}</p><button class="primary" type="button" onclick="openRecipe('${esc(r.id)}')">Öppna recept</button></article>`;
  function appendImported(query='',tag=activeTag){
    const target=document.querySelector('#recipeBankResults'); if(!target)return;
    target.querySelectorAll('[data-imported-recipe-card]').forEach(n=>n.remove());
    const q=String(query).trim().toLowerCase();
    const rows=recipes.filter(r=>(tag==='alla'||r.tags.includes(tag))&&(!q||[r.name,...r.tags,...r.ingredients.map(i=>i.rawText)].join(' ').toLowerCase().includes(q)));
    if(rows.length)target.insertAdjacentHTML('beforeend',rows.map(card).join(''));
  }
  function sourcePanel(r){const s=r.source;return `<details class="panel calm" data-recipe-source-license><summary><strong>Källa &amp; licens</strong></summary><p><strong>Källa:</strong> ${esc(s.provider)}</p><p><strong>Original:</strong> <a href="${esc(s.sourceUrl)}" target="_blank" rel="noopener noreferrer">${esc(s.originalTitle)}</a></p><p><strong>Licens:</strong> <a href="${esc(s.licenseUrl)}" target="_blank" rel="noopener noreferrer">${esc(s.license)}</a></p><p>${esc(s.attribution)}</p><p>Receptet är översatt och bearbetat för Malix.</p></details>`;}
  function renderImported(r){
    const detail=document.querySelector('#recipeDetail'); if(!detail)return;
    const facts=[`🍽️ ${r.servings} portioner`,`🔪 Förberedelse ${r.time.prep} min`,`🔥 Tillagning ${r.time.cook} min`,`⏱️ Totalt cirka ${r.time.total} min`];
    detail.innerHTML=`<article class="recipe-detail" data-imported-recipe="true"><div class="meta"><span class="badge">${emoji(r)}</span><span class="badge">⏱️ ${r.time.total} min</span><span class="badge">${r.budget==='low'?'💰 Billigt':'💰💰 Mellan'}</span><span class="badge">Wikibooks</span></div><h2>${esc(r.name)}</h2><section class="panel calm"><h3>Innan du börjar</h3><p>${facts.map(esc).join(' · ')}</p><p><strong>Ta fram:</strong> ${r.equipment.map(esc).join(', ')}.</p></section><h3>Det här behöver du</h3><ul class="ingredient-list">${r.ingredients.map(i=>`<li>${esc(i.rawText)}</li>`).join('')}</ul><h3>En sak i taget</h3><ol class="steps">${r.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol>${r.serving?`<section class="panel calm"><h3>🍽️ Servera gärna med</h3><p>${esc(r.serving)}</p></section>`:''}${r.tip?`<div class="panel calm"><strong>Malix tips</strong><p>${esc(r.tip)}</p></div>`:''}${r.doneness?`<section class="panel calm"><h3>✓ Hur vet jag att det är klart?</h3><p>${esc(r.doneness)}</p></section>`:''}<p class="note">Pilotimport: receptet ligger i den separata canonical Wikibooks-katalogen. Smart Kitchen-logiken är inte ändrad i denna pilot.</p>${sourcePanel(r)}</article>`;
    document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active-view',v.id==='recipe')); window.scrollTo({top:0,behavior:'smooth'});
  }
  function openWithImported(id){const r=byId.get(id); if(r){renderImported(r);return;} originalOpenRecipe(id);}
  openWithImported.__malixImportedRecipes=true; window.openRecipe=openWithImported;

  const chipHost=document.querySelector('#recipeBank .chips');
  if(chipHost){
    [['snacks','Snacks'],['frukost','Frukost']].forEach(([tag,label])=>{
      if(chipHost.querySelector(`[data-recipe-tag="${tag}"]`))return;
      const button=document.createElement('button');
      button.type='button'; button.dataset.recipeTag=tag; button.textContent=label;
      chipHost.appendChild(button);
    });
  }
  document.querySelectorAll('[data-recipe-tag]').forEach(b=>b.addEventListener('click',()=>{activeTag=b.dataset.recipeTag||'alla';if(activeTag==='snacks'||activeTag==='frukost'){const target=document.querySelector('#recipeBankResults');if(target)target.innerHTML='';}appendImported(document.querySelector('#recipeSearch')?.value||'',activeTag);}));
  document.querySelector('#recipeSearch')?.addEventListener('input',e=>{activeTag='alla';appendImported(e.target.value,'alla');});
  document.addEventListener('click',e=>{if(!e.target.closest('[data-open="recipeBank"]'))return;queueMicrotask(()=>appendImported(document.querySelector('#recipeSearch')?.value||'',activeTag));});

  function buildCombinedCatalog(){
    const malix=window.MalixParallelCanonicalCatalog;
    if(!malix?.entries)return;
    const combined=Object.freeze([...malix.entries,...entries]);
    const ids=new Set();
    for(const entry of combined){const id=String(entry?.recipe?.id||'').trim();if(!id)continue;if(ids.has(id))throw new Error(`Duplicate combined recipe id: ${id}`);ids.add(id);}
    window.MalixCombinedCanonicalRecipeCatalog=Object.freeze({entries:combined,info:Object.freeze({total:combined.length,malix:malix.entries.length,imported:entries.length})});
  }
  if(document.readyState==='loading')window.addEventListener('DOMContentLoaded',buildCombinedCatalog);
  else buildCombinedCatalog();
})();
