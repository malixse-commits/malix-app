(() => {
  const KEY='malix-food-preferences-v1';
  const getPrefs=()=>{try{return {...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{return {}}};
  const savePrefs=p=>localStorage.setItem(KEY,JSON.stringify(p));
  const glutenMap=[
    [/\bpasta\b|spaghetti|makaron|nudlar|lasagneplattor/gi,'glutenfri pasta'],
    [/\bbröd\b|hamburgerbröd/gi,'glutenfritt bröd'],
    [/\bströbröd\b/gi,'glutenfritt ströbröd'],
    [/\bmjöl\b/gi,'glutenfri mjölmix'],
    [/\btortilla\b/gi,'glutenfri tortilla'],
    [/\bmüsli\b/gi,'glutenfri müsli'],
    [/\bflingor\b/gi,'glutenfria flingor'],
    [/\bhavregryn\b/gi,'glutenfria havregryn']
  ];
  const adapt=text=>{
    if(!getPrefs().glutenFree) return String(text||'');
    let out=String(text||'');
    glutenMap.forEach(([r,v])=>out=out.replace(r,v));
    return out;
  };
  window.malixAdaptFoodText=adapt;

  function addSettings(){
    const home=document.querySelector('#home');
    if(!home||document.querySelector('#foodPreferences'))return;
    const hero=home.querySelector('.hero-card');
    const box=document.createElement('section');
    box.id='foodPreferences';box.className='panel calm';
    box.innerHTML=`<p class="eyebrow">Matinställningar</p><h3>🌾 Anpassa maten</h3><label style="display:flex;gap:10px;align-items:center"><input id="glutenFreeChoice" type="checkbox"> Visa glutenfria alternativ i matdelen</label><p class="note">När detta är valt byter appen till glutenfria alternativ för bland annat pasta, bröd, mjöl, ströbröd, müsli, flingor och havregryn. Kontrollera alltid produktens märkning om du behöver äta strikt glutenfritt.</p>`;
    hero.insertAdjacentElement('afterend',box);
    const input=box.querySelector('#glutenFreeChoice');input.checked=!!getPrefs().glutenFree;
    input.addEventListener('change',()=>{const p=getPrefs();p.glutenFree=input.checked;savePrefs(p);document.dispatchEvent(new CustomEvent('malix-food-preference-changed'));});
  }

  function addBreakfastQuickChoices(){
    const foodLog=document.querySelector('#foodLog');
    const mealForm=document.querySelector('#mealForm');
    if(!foodLog||!mealForm||document.querySelector('#breakfastQuickChoices'))return;

    const groups={
      'Bröd & gryn':['Brödskiva','Knäckebröd','Rostat bröd','Cornflakes','Havrefras','Müsli','Granola','Havregrynsgröt','Overnight oats'],
      'Mejeri':['Mjölk','Filmjölk','Yoghurt','Kvarg','Turkisk yoghurt'],
      'Pålägg':['Ostskiva','Ägg','Skinka','Kalkon','Brieost','Färskost','Kaviar','Leverpastej','Makrill i tomatsås','Salami','Mjukost','Messmör','Jordnötssmör','Marmelad','Lingonsylt','Jordgubbssylt','Hallonsylt','Blåbärssylt','Blandsylt','Honung','Avokado','Hummus'],
      'Frukt & grönt':['Banan','Äpple','Päron','Apelsin','Bär','Tomat','Gurka','Paprika','Sallad','Avokado','Rödlök'],
      'Dryck':['Kaffe','Te','Vatten','Juice']
    };

    const panel=document.createElement('section');
    panel.id='breakfastQuickChoices';
    panel.className='panel calm';
    panel.innerHTML=`<p class="eyebrow">Snabbval</p><h3>🥣 Bygg min frukost</h3><p>Välj en eller flera saker. Du kan ändra text och mängd innan du sparar.</p>${Object.entries(groups).map(([name,items])=>`<fieldset style="margin:14px 0"><legend><strong>${name}</strong></legend><div class="chips">${items.map(item=>`<button type="button" data-breakfast-item="${item}">${item}</button>`).join('')}</div></fieldset>`).join('')}<div class="chips"><button type="button" class="primary" id="useBreakfastChoices">Använd i matloggen</button><button type="button" class="secondary" id="clearBreakfastChoices">Rensa val</button></div><p id="breakfastChoiceStatus" class="status"></p>`;

    mealForm.closest('.panel')?.insertAdjacentElement('beforebegin',panel);
    const selected=new Set();
    panel.querySelectorAll('[data-breakfast-item]').forEach(button=>button.addEventListener('click',()=>{
      const item=button.dataset.breakfastItem;
      if(selected.has(item)){selected.delete(item);button.classList.remove('active')}else{selected.add(item);button.classList.add('active')}
      panel.querySelector('#breakfastChoiceStatus').textContent=selected.size?`${selected.size} valda`:'Inget valt ännu';
    }));

    panel.querySelector('#clearBreakfastChoices').addEventListener('click',()=>{
      selected.clear();panel.querySelectorAll('[data-breakfast-item]').forEach(b=>b.classList.remove('active'));panel.querySelector('#breakfastChoiceStatus').textContent='Valen är rensade.';
    });

    panel.querySelector('#useBreakfastChoices').addEventListener('click',()=>{
      if(!selected.size){panel.querySelector('#breakfastChoiceStatus').textContent='Välj minst en sak först.';return}
      const mealSelect=mealForm.querySelector('[name="meal"]');
      const foodField=mealForm.querySelector('[name="food"]');
      const portionField=mealForm.querySelector('[name="portion"]');
      if(mealSelect)mealSelect.value='Frukost';
      if(foodField)foodField.value=[...selected].map(adapt).join(', ');
      if(portionField&&!portionField.value)portionField.placeholder='t.ex. 2 skivor, 2,5 dl eller 1 portion';
      panel.querySelector('#breakfastChoiceStatus').textContent='Frukosten är införd i matloggen. Kontrollera mängden och spara.';
      foodField?.focus();
    });
  }

  function decorateRecipe(){
    const detail=document.querySelector('#recipeDetail');if(!detail)return;
    const gf=getPrefs().glutenFree;
    detail.querySelectorAll('.ingredient-list li').forEach(li=>{const original=li.dataset.originalText||li.textContent;li.dataset.originalText=original;li.textContent=gf?adapt(original):original});
    detail.querySelectorAll('.steps li').forEach(li=>{const original=li.dataset.originalText||li.textContent;li.dataset.originalText=original;li.textContent=gf?adapt(original):original});
    detail.querySelector('[data-gf-note]')?.remove();
    if(gf){const note=document.createElement('p');note.dataset.gfNote='1';note.className='note';note.innerHTML='<strong>🌾 Glutenfritt valt:</strong> receptet visar glutenfria byten där det behövs. Kontrollera alltid märkningen på färdiga produkter, såser, buljong, flingor och andra sammansatta livsmedel.';detail.querySelector('h2')?.insertAdjacentElement('afterend',note)}
  }

  addSettings();
  addBreakfastQuickChoices();
  const detail=document.querySelector('#recipeDetail');if(detail)new MutationObserver(()=>queueMicrotask(decorateRecipe)).observe(detail,{childList:true,subtree:true});
  document.addEventListener('malix-food-preference-changed',decorateRecipe);
})();