(() => {
  const mealTypes=[['Frukost','🌅'],['Lunch','🥗'],['Middag','🍽️'],['Mellanmål','🍎'],['Kvällsmål','🌙']];
  const fallbackFoods=['Smörgås','Ägg','Kvarg','Yoghurt','Müsli','Äpple','Banan','Kyckling','Fisk','Köttfärs','Potatis','Ris','Pasta','Sallad','Vatten','Kaffe','Te'];
  const adapt=food=>window.malixAdaptFoodText?window.malixAdaptFoodText(food):food;
  const esc=s=>String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const fallbackQuantity=food=>/kaffe|te|mjölk|juice|vatten|läsk|saft|smoothie/i.test(food)?{units:['dl','ml'],unit:'dl',defaultAmount:'2'}:/smörgås|knäckebröd/i.test(food)?{units:['skiva','st','g'],unit:'skiva',defaultAmount:'1'}:/ägg|banan|äpple|apelsin|päron|kiwi|fralla|croissant/i.test(food)?{units:['st','g'],unit:'st',defaultAmount:'1'}:/müsli|granola|cornflakes|havrefras/i.test(food)?{units:['dl','g'],unit:'dl',defaultAmount:'1'}:/kvarg|yoghurt|filmjölk/i.test(food)?{units:['dl','g'],unit:'dl',defaultAmount:'2'}:{units:['g'],unit:'g',defaultAmount:'100'};
  const quantityFor=food=>window.MalixFoodBank?.getItem?.(food)?.quantity||fallbackQuantity(food);
  const splitEntries=value=>String(value||'').split(/,\s*(?=[^,]+\s\([^()]+\)(?:,|$))/).map(x=>x.trim()).filter(Boolean);
  const syncEntries=(form,entries)=>{const ta=form.querySelector('textarea[name="food"]');if(!ta)return;ta.value=entries.join(', ');ta.dispatchEvent(new Event('input',{bubbles:true}))};

  function ensureQuantityDialog(){
    let dialog=document.querySelector('#foodQuantityDialog');
    if(dialog)return dialog;
    dialog=document.createElement('dialog');
    dialog.id='foodQuantityDialog';
    dialog.className='food-quantity-dialog';
    dialog.innerHTML=`<form method="dialog" id="foodQuantityForm" class="panel calm">
      <h3 id="foodQuantityTitle">Mängd</h3>
      <p class="note" id="foodQuantityHelp">Välj mängd och enhet.</p>
      <div class="food-quantity-grid">
        <label>Mängd<input id="foodQuantityAmount" inputmode="decimal" autocomplete="off"></label>
        <label>Enhet<select id="foodQuantityUnit"></select></label>
      </div>
      <div class="food-quantity-actions">
        <button type="button" class="secondary" id="foodQuantityCancel">Avbryt</button>
        <button type="submit" class="primary" value="save">Lägg till</button>
      </div>
    </form>`;
    document.body.appendChild(dialog);
    dialog.querySelector('#foodQuantityCancel').addEventListener('click',()=>dialog.close('cancel'));
    dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close('cancel')});
    return dialog;
  }

  function addFood(form,food){
    const shown=adapt(food),q=quantityFor(food),units=[...(q.units||[q.unit||'g'])],dialog=ensureQuantityDialog();
    const amountInput=dialog.querySelector('#foodQuantityAmount'),unitSelect=dialog.querySelector('#foodQuantityUnit'),title=dialog.querySelector('#foodQuantityTitle'),help=dialog.querySelector('#foodQuantityHelp'),quantityForm=dialog.querySelector('#foodQuantityForm');
    title.textContent=`Hur mycket ${shown.toLowerCase()}?`;
    help.textContent=units.length>1?'Välj den enhet som stämmer bäst med hur du mätte maten.':'Enheten är vald utifrån livsmedlet.';
    amountInput.value=q.defaultAmount||'1';
    unitSelect.innerHTML=units.map(unit=>`<option value="${esc(unit)}"${unit===(q.unit||units[0])?' selected':''}>${esc(unit)}</option>`).join('');
    unitSelect.disabled=units.length===1;
    const onSubmit=e=>{
      e.preventDefault();
      const amount=String(amountInput.value).trim();
      const unit=unitSelect.value||q.unit||units[0];
      if(!amount){amountInput.focus();return}
      const ta=form.querySelector('textarea[name="food"]');if(!ta)return;
      const entry=`${shown} (${amount} ${unit})`,entries=splitEntries(ta.value);entries.push(entry);syncEntries(form,entries);
      quantityForm.removeEventListener('submit',onSubmit);
      dialog.close('save');
    };
    quantityForm.addEventListener('submit',onSubmit);
    dialog.addEventListener('close',()=>quantityForm.removeEventListener('submit',onSubmit),{once:true});
    dialog.showModal();
    setTimeout(()=>amountInput.select(),0);
  }

  function renderSelected(form){
    const box=form.querySelector('#simpleMealSelected'),ta=form.querySelector('textarea[name="food"]');if(!box||!ta)return;
    const entries=splitEntries(ta.value);
    box.innerHTML=entries.length?`<strong>Det här har du valt:</strong><div class="selected-food-list">${entries.map((entry,i)=>`<div class="selected-food-row"><span>${esc(entry)}</span><button type="button" class="secondary" data-remove-selected="${i}">Ta bort</button></div>`).join('')}</div><button type="button" class="secondary" id="clearSimpleMeal">Börja om</button>`:'<p class="note">Inget valt ännu.</p>';
    box.querySelectorAll('[data-remove-selected]').forEach(b=>b.addEventListener('click',()=>{const next=splitEntries(ta.value);next.splice(Number(b.dataset.removeSelected),1);syncEntries(form,next)}));
    box.querySelector('#clearSimpleMeal')?.addEventListener('click',()=>syncEntries(form,[]));
  }

  function collapseHistory(){const view=document.querySelector('#foodLog');if(!view||view.dataset.calmHistory==='1')return;view.dataset.calmHistory='1';const history=document.querySelector('#mealHistory'),heading=history?.previousElementSibling;if(history&&heading){const details=document.createElement('details');details.className='panel';details.style.marginTop='18px';const summary=document.createElement('summary');summary.innerHTML='<strong>✓ Dagens måltider</strong>';heading.replaceWith(details);details.append(summary,history)}const calendar=document.querySelector('#calendarGrid')?.closest('.panel');if(calendar){const details=document.createElement('details');details.className='panel';details.style.marginTop='14px';const summary=document.createElement('summary');summary.innerHTML='<strong>📅 Matkalender</strong>';calendar.replaceWith(details);details.append(summary,calendar)}}

  function init(){const form=document.querySelector('#mealForm');if(!form||form.dataset.simpleMealLog==='1')return;form.dataset.simpleMealLog='1';const mealSelect=form.querySelector('select[name="meal"]'),mealLabel=mealSelect?.closest('label'),foodArea=form.querySelector('textarea[name="food"]'),foodLabel=foodArea?.closest('label'),portionLabel=form.querySelector('input[name="portion"]')?.closest('label');if(!mealSelect||!foodArea)return;
    const style=document.createElement('style');style.textContent=`#mealForm > *{display:none !important}#mealForm > #simpleMealFlow{display:block !important}#mealForm [data-ready-foods],#mealForm [data-takeaway-box]{display:none !important}#mealForm #simpleMealFlow .simple-step:not([hidden]){display:block !important}#mealForm #simpleMealFlow .meal-choice-grid{display:grid !important;grid-template-columns:repeat(auto-fit,minmax(135px,1fr));gap:10px}#mealForm #simpleMealFlow .meal-choice-grid button{display:block !important;min-height:52px;text-align:left}#mealForm #simpleMealFlow .simple-food-search{display:block !important;width:100%;padding:12px;margin:8px 0}#mealForm #simpleMealFlow .simple-search-results{display:grid !important;grid-template-columns:1fr;gap:8px;margin-top:8px}#mealForm #simpleMealFlow .simple-search-results button{display:block !important;width:100%;text-align:left;min-height:46px}#mealForm #simpleMealFlow #simpleMealSelected{display:block !important;margin:14px 0}#mealForm #simpleMealFlow h3,#mealForm #simpleMealFlow p,#mealForm #simpleMealFlow strong,#mealForm #simpleMealFlow label{display:block !important}#mealForm[data-simple-step="food"] > button[type="submit"],#mealForm[data-simple-step="food"] > label:has(select[name="taste"]),#mealForm[data-simple-step="food"] > label:has(select[name="satiety"]){display:block !important}#mealForm[data-simple-step="other"] > label:has(textarea[name="food"]),#mealForm[data-simple-step="other"] > label:has(input[name="portion"]),#mealForm[data-simple-step="other"] > button[type="submit"],#mealForm[data-simple-step="other"] > label:has(select[name="taste"]),#mealForm[data-simple-step="other"] > label:has(select[name="satiety"]){display:block !important}#mealForm[data-simple-step="ready"] [data-ready-foods],#mealForm[data-simple-step="ready"] > button[type="submit"],#mealForm[data-simple-step="ready"] > label:has(select[name="taste"]),#mealForm[data-simple-step="ready"] > label:has(select[name="satiety"]){display:block !important}#simpleMealFlow .simple-step{margin-top:14px}.selected-food-list{display:grid;gap:8px;margin:10px 0}.selected-food-row{display:flex!important;align-items:center;justify-content:space-between;gap:12px;padding:9px 0;border-bottom:1px solid rgba(0,0,0,.08)}.selected-food-row span{display:block!important;flex:1}.selected-food-row button{display:block!important;width:auto!important;min-height:38px!important;white-space:nowrap}.food-quantity-dialog{border:0;border-radius:18px;padding:0;max-width:min(92vw,440px);width:100%;box-shadow:0 20px 60px rgba(0,0,0,.24)}.food-quantity-dialog::backdrop{background:rgba(0,0,0,.35)}.food-quantity-dialog form{margin:0}.food-quantity-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:14px 0}.food-quantity-grid input,.food-quantity-grid select{width:100%;box-sizing:border-box}.food-quantity-actions{display:flex!important;justify-content:flex-end;gap:10px;margin-top:14px}@media(max-width:520px){.food-quantity-grid{grid-template-columns:1fr}.food-quantity-actions{flex-direction:column-reverse}}`;document.head.appendChild(style);
    const flow=document.createElement('section');flow.id='simpleMealFlow';flow.className='panel calm';flow.innerHTML=`<div id="simpleMealStep1" class="simple-step"><h3>1. Vilken måltid?</h3><div class="meal-choice-grid">${mealTypes.map(([name,emoji])=>`<button type="button" class="secondary" data-simple-meal="${name}">${emoji} ${name}</button>`).join('')}</div></div><div id="simpleMealStep2" class="simple-step" hidden><h3>2. Vad åt du?</h3><p id="simpleMealFor" class="note"></p><div id="simpleFoodChoices"></div><div id="simpleMealSelected"></div><div id="simpleExtraChoices" class="meal-choice-grid"></div></div>`;form.insertBefore(flow,form.firstChild);if(mealLabel)mealLabel.hidden=true;if(foodLabel)foodArea.placeholder='Skriv det du åt eller drack';if(portionLabel)portionLabel.hidden=true;
    const step2=flow.querySelector('#simpleMealStep2'),choiceRoot=flow.querySelector('#simpleFoodChoices'),extraRoot=flow.querySelector('#simpleExtraChoices'),mealFor=flow.querySelector('#simpleMealFor');
    function searchFoods(query,type){if(window.MalixFoodBank?.search)return window.MalixFoodBank.search(query,type,18);const q=query.toLocaleLowerCase('sv-SE');return fallbackFoods.filter(food=>food.toLocaleLowerCase('sv-SE').includes(q)).slice(0,12)}
    function renderFoodChoice(type){choiceRoot.innerHTML=`<label>Sök mat eller dryck<input id="simpleFoodSearch" class="simple-food-search" type="search" autocomplete="off" placeholder="Skriv minst två bokstäver, t.ex. brie, kyck eller äpp"></label><p class="note">Livsmedlen är kategoriserade så att appen kan föreslå naturliga registreringsmått. När du väljer ett livsmedel ser du både mängd och enhet och kan byta enhet när flera passar.</p><div id="simpleFoodResults" class="simple-search-results"></div>`;const input=choiceRoot.querySelector('#simpleFoodSearch'),results=choiceRoot.querySelector('#simpleFoodResults');const showMatches=()=>{const q=input.value.trim();if(q.length<2){results.innerHTML=q?'<p class="note">Skriv minst två bokstäver.</p>':'';return}const matches=searchFoods(q,type);results.innerHTML=matches.length?matches.map(food=>`<button type="button" class="secondary" data-search-food="${food.replace(/"/g,'&quot;')}">${adapt(food)}</button>`).join(''):'<p class="note">Inget färdigt alternativ hittades. Du kan välja Annat / skriv själv nedan.</p>';results.querySelectorAll('[data-search-food]').forEach(b=>b.addEventListener('click',()=>{addFood(form,b.dataset.searchFood);input.value='';results.innerHTML=''}))};input.addEventListener('input',showMatches);document.addEventListener('malix-food-preferences-changed',showMatches);setTimeout(()=>input.focus(),0)}
    function chooseMeal(type){mealSelect.value=type;mealSelect.dispatchEvent(new Event('change',{bubbles:true}));sessionStorage.setItem('malix-selected-meal-type',type);form.dataset.simpleStep='food';mealFor.textContent=`Du loggar: ${type}`;flow.querySelectorAll('[data-simple-meal]').forEach(b=>b.classList.toggle('active',b.dataset.simpleMeal===type));renderFoodChoice(type);const isMain=['Lunch','Middag'].includes(type);extraRoot.innerHTML=`${isMain?'<button type="button" class="secondary" data-simple-action="recipe">📖 Välj recept</button><button type="button" class="secondary" data-simple-action="ready">⚡ Färdigt & enkelt</button>':''}<button type="button" class="secondary" data-simple-action="other">➕ Annat / skriv själv</button>`;step2.hidden=false;renderSelected(form)}
    foodArea.addEventListener('input',()=>renderSelected(form));flow.querySelectorAll('[data-simple-meal]').forEach(b=>b.addEventListener('click',()=>chooseMeal(b.dataset.simpleMeal)));flow.addEventListener('click',e=>{const b=e.target.closest('[data-simple-action]');if(!b)return;const action=b.dataset.simpleAction;if(action==='recipe'){sessionStorage.setItem('malix-selected-meal-type',mealSelect.value);const trigger=document.querySelector('[data-calm-open="recipeBank"]')||document.querySelector('[data-open="recipeBank"]');if(trigger)trigger.click();return}if(action==='other'){form.dataset.simpleStep='other';foodLabel.hidden=false;if(portionLabel)portionLabel.hidden=false;foodArea.focus();foodLabel.scrollIntoView({behavior:'smooth',block:'center'});return}form.dataset.simpleStep=action;setTimeout(()=>document.querySelector('[data-ready-foods]')?.scrollIntoView({behavior:'smooth',block:'start'}),0)});form.addEventListener('reset',()=>setTimeout(()=>{form.removeAttribute('data-simple-step');sessionStorage.removeItem('malix-selected-meal-type');step2.hidden=true;foodLabel.hidden=true;if(portionLabel)portionLabel.hidden=true;renderSelected(form);flow.querySelectorAll('[data-simple-meal]').forEach(b=>b.classList.remove('active'))},0));collapseHistory()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();