(() => {
  const mealTypes=[['Frukost','🌅'],['Lunch','🥗'],['Middag','🍽️'],['Mellanmål','🍎'],['Kvällsmål','🌙']];
  const breakfastEveningFoods=['Äggröra','Kokt ägg','Stekt ägg','Omelett','Bacon','Prinskorv','Köttbullar','Fralla','Croissant','Rostat bröd','Smörgås','Knäckebröd','Smör','Ost','Skinka','Kalkon','Leverpastej','Kaviar','Färskost','Marmelad','Filmjölk','Yoghurt','Kvarg','Müsli','Granola','Cornflakes','Havrefras','Havregrynsgröt','Bär','Fruktsallad','Banan','Äpple','Apelsin','Tomat','Gurka','Paprika','Juice','Kaffe','Te','Mjölk','Vatten'];
  const choices={
    Lunch:['Fisk','Kyckling','Kött','Köttfärs','Korv','Ägg','Bönor/linser','Potatis','Ris','Pasta','Bröd','Sallad','Grönsaker','Vatten'],
    Middag:['Fisk','Kyckling','Kött','Köttfärs','Korv','Ägg','Bönor/linser','Potatis','Ris','Pasta','Bröd','Sallad','Grönsaker','Vatten'],
    Mellanmål:['Frukt','Banan','Äpple','Kvarg','Yoghurt','Smörgås','Knäckebröd','Ägg','Nötter/frön','Kaffe','Te','Vatten']
  };
  const amountFor=food=>/kaffe|te|mjölk|juice|vatten/i.test(food)?'2 dl':/smörgås|knäckebröd|ägg|banan|äpple|apelsin|fralla|croissant/i.test(food)?'1 st':/müsli|granola|cornflakes|havrefras|nötter/i.test(food)?'1 dl':/kvarg|yoghurt|filmjölk/i.test(food)?'2 dl':/potatis|ris|pasta|sallad|grönsaker/i.test(food)?'1 portion':'1 portion';

  function addFood(form,food){
    const q=window.prompt(`Hur mycket ${food.toLowerCase()} åt eller drack du?`,amountFor(food));
    if(q===null)return;
    const amount=String(q).trim()||amountFor(food);
    const ta=form.querySelector('textarea[name="food"]');if(!ta)return;
    const entry=`${food} (${amount})`;
    ta.value=ta.value.trim()?`${ta.value.trim()}, ${entry}`:entry;
    ta.dispatchEvent(new Event('input',{bubbles:true}));renderSelected(form);
  }
  function renderSelected(form){
    const box=form.querySelector('#simpleMealSelected'),ta=form.querySelector('textarea[name="food"]');if(!box||!ta)return;
    const value=ta.value.trim();
    box.innerHTML=value?`<strong>Det här har du valt:</strong><p>${value}</p><button type="button" class="secondary" id="clearSimpleMeal">Börja om</button>`:'<p class="note">Inget valt ännu.</p>';
    box.querySelector('#clearSimpleMeal')?.addEventListener('click',()=>{ta.value='';ta.dispatchEvent(new Event('input',{bubbles:true}));renderSelected(form)});
  }
  function collapseHistory(){
    const view=document.querySelector('#foodLog');if(!view||view.dataset.calmHistory==='1')return;view.dataset.calmHistory='1';
    const history=document.querySelector('#mealHistory'),heading=history?.previousElementSibling;
    if(history&&heading){const details=document.createElement('details');details.className='panel';details.style.marginTop='18px';const summary=document.createElement('summary');summary.innerHTML='<strong>✓ Dagens måltider</strong>';heading.replaceWith(details);details.append(summary,history)}
    const calendar=document.querySelector('#calendarGrid')?.closest('.panel');if(calendar){const details=document.createElement('details');details.className='panel';details.style.marginTop='14px';const summary=document.createElement('summary');summary.innerHTML='<strong>📅 Matkalender</strong>';calendar.replaceWith(details);details.append(summary,calendar)}
  }
  function init(){
    const form=document.querySelector('#mealForm');if(!form||form.dataset.simpleMealLog==='1')return;form.dataset.simpleMealLog='1';
    const mealSelect=form.querySelector('select[name="meal"]'),mealLabel=mealSelect?.closest('label'),foodArea=form.querySelector('textarea[name="food"]'),foodLabel=foodArea?.closest('label'),portionLabel=form.querySelector('input[name="portion"]')?.closest('label');if(!mealSelect||!foodArea)return;
    const style=document.createElement('style');style.textContent=`
      #mealForm > *{display:none !important}#mealForm > #simpleMealFlow{display:block !important}
      #mealForm #simpleMealFlow .simple-step:not([hidden]){display:block !important}
      #mealForm #simpleMealFlow .meal-choice-grid{display:grid !important;grid-template-columns:repeat(auto-fit,minmax(135px,1fr));gap:10px}
      #mealForm #simpleMealFlow .meal-choice-grid button{display:block !important;min-height:52px;text-align:left}
      #mealForm #simpleMealFlow .simple-food-select{display:block !important;width:100%;padding:12px;margin:8px 0 12px}
      #mealForm #simpleMealFlow #simpleMealSelected{display:block !important;margin:14px 0}
      #mealForm #simpleMealFlow h3,#mealForm #simpleMealFlow p,#mealForm #simpleMealFlow strong,#mealForm #simpleMealFlow label{display:block !important}
      #mealForm[data-simple-step="food"] > button[type="submit"],#mealForm[data-simple-step="food"] > label:has(select[name="taste"]),#mealForm[data-simple-step="food"] > label:has(select[name="satiety"]){display:block !important}
      #mealForm[data-simple-step="other"] > label:has(textarea[name="food"]),#mealForm[data-simple-step="other"] > button[type="submit"],#mealForm[data-simple-step="other"] > label:has(select[name="taste"]),#mealForm[data-simple-step="other"] > label:has(select[name="satiety"]){display:block !important}
      #mealForm[data-simple-step="ready"] [data-ready-foods],#mealForm[data-simple-step="takeaway"] [data-takeaway-box]{display:block !important}
      #simpleMealFlow .simple-step{margin-top:14px}`;document.head.appendChild(style);
    const flow=document.createElement('section');flow.id='simpleMealFlow';flow.className='panel calm';flow.innerHTML=`<div id="simpleMealStep1" class="simple-step"><h3>1. Vilken måltid?</h3><div class="meal-choice-grid">${mealTypes.map(([name,emoji])=>`<button type="button" class="secondary" data-simple-meal="${name}">${emoji} ${name}</button>`).join('')}</div></div><div id="simpleMealStep2" class="simple-step" hidden><h3>2. Vad åt du?</h3><p id="simpleMealFor" class="note"></p><div id="simpleFoodChoices"></div><div id="simpleMealSelected"></div><div id="simpleExtraChoices" class="meal-choice-grid"></div></div>`;form.insertBefore(flow,form.firstChild);
    if(mealLabel)mealLabel.hidden=true;if(foodLabel)foodArea.placeholder='Skriv det du åt eller drack';if(portionLabel)portionLabel.hidden=true;
    const step2=flow.querySelector('#simpleMealStep2'),choiceRoot=flow.querySelector('#simpleFoodChoices'),extraRoot=flow.querySelector('#simpleExtraChoices'),mealFor=flow.querySelector('#simpleMealFor');
    function renderFoodChoice(type){
      if(['Frukost','Kvällsmål'].includes(type)){
        choiceRoot.innerHTML=`<label>Välj mat eller dryck<select id="simpleFoodSelect" class="simple-food-select"><option value="">Välj ett alternativ…</option>${breakfastEveningFoods.map(food=>`<option value="${food}">${food}</option>`).join('')}</select></label><p class="note">Du kan välja flera saker, en i taget.</p>`;
        choiceRoot.querySelector('#simpleFoodSelect').addEventListener('change',e=>{const food=e.target.value;if(!food)return;addFood(form,food);e.target.value=''});
      }else{
        choiceRoot.innerHTML=`<div class="meal-choice-grid">${(choices[type]||[]).map(food=>`<button type="button" class="secondary" data-simple-food="${food}">${food}</button>`).join('')}</div>`;
        choiceRoot.querySelectorAll('[data-simple-food]').forEach(b=>b.addEventListener('click',()=>addFood(form,b.dataset.simpleFood)));
      }
    }
    function chooseMeal(type){
      mealSelect.value=type;mealSelect.dispatchEvent(new Event('change',{bubbles:true}));sessionStorage.setItem('malix-selected-meal-type',type);form.dataset.simpleStep='food';mealFor.textContent=`Du loggar: ${type}`;flow.querySelectorAll('[data-simple-meal]').forEach(b=>b.classList.toggle('active',b.dataset.simpleMeal===type));renderFoodChoice(type);
      const isMain=['Lunch','Middag'].includes(type);extraRoot.innerHTML=`${isMain?'<button type="button" class="secondary" data-simple-action="recipe">📖 Välj recept</button><button type="button" class="secondary" data-simple-action="ready">⚡ Färdigt & enkelt</button><button type="button" class="secondary" data-simple-action="takeaway">🥡 Hämtmat / restaurang</button>':''}<button type="button" class="secondary" data-simple-action="other">➕ Annat / skriv själv</button>`;step2.hidden=false;renderSelected(form);
    }
    flow.querySelectorAll('[data-simple-meal]').forEach(b=>b.addEventListener('click',()=>chooseMeal(b.dataset.simpleMeal)));
    flow.addEventListener('click',e=>{const b=e.target.closest('[data-simple-action]');if(!b)return;const action=b.dataset.simpleAction;if(action==='recipe'){sessionStorage.setItem('malix-selected-meal-type',mealSelect.value);const trigger=document.querySelector('[data-calm-open="recipeBank"]')||document.querySelector('[data-open="recipeBank"]');if(trigger)trigger.click();return}if(action==='other'){form.dataset.simpleStep='other';foodLabel.hidden=false;foodArea.focus();foodLabel.scrollIntoView({behavior:'smooth',block:'center'});return}form.dataset.simpleStep=action;setTimeout(()=>document.querySelector(action==='ready'?'[data-ready-foods]':'[data-takeaway-box]')?.scrollIntoView({behavior:'smooth',block:'start'}),0)});
    form.addEventListener('reset',()=>setTimeout(()=>{form.removeAttribute('data-simple-step');sessionStorage.removeItem('malix-selected-meal-type');step2.hidden=true;foodLabel.hidden=true;renderSelected(form);flow.querySelectorAll('[data-simple-meal]').forEach(b=>b.classList.remove('active'))},0));collapseHistory();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();