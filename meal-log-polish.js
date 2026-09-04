(() => {
  const mealTypes=[['Frukost','🌅'],['Lunch','🥗'],['Middag','🍽️'],['Mellanmål','🍎'],['Kvällsmål','🌙']];
  const fallbackFoods=['Smörgås','Ägg','Kvarg','Yoghurt','Müsli','Äpple','Banan','Kyckling','Fisk','Köttfärs','Potatis','Ris','Pasta','Sallad','Vatten','Kaffe','Te'];
  const amountFor=food=>/kaffe|te|mjölk|juice|vatten|läsk|saft|smoothie/i.test(food)?'2 dl':/smörgås|knäckebröd|ägg|banan|äpple|apelsin|päron|kiwi|fralla|croissant/i.test(food)?'1 st':/müsli|granola|cornflakes|havrefras|nötter|frön/i.test(food)?'1 dl':/kvarg|yoghurt|filmjölk/i.test(food)?'2 dl':/potatis|ris|pasta|sallad|grönsaker|gryta|soppa|pizza|lasagne|tacos|hamburgare|kebab|sushi/i.test(food)?'1 portion':'1 portion';

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
      #mealForm [data-ready-foods],#mealForm [data-takeaway-box]{display:none !important}
      #mealForm #simpleMealFlow .simple-step:not([hidden]){display:block !important}
      #mealForm #simpleMealFlow .meal-choice-grid{display:grid !important;grid-template-columns:repeat(auto-fit,minmax(135px,1fr));gap:10px}
      #mealForm #simpleMealFlow .meal-choice-grid button{display:block !important;min-height:52px;text-align:left}
      #mealForm #simpleMealFlow .simple-food-search{display:block !important;width:100%;padding:12px;margin:8px 0}
      #mealForm #simpleMealFlow .simple-search-results{display:grid !important;grid-template-columns:1fr;gap:8px;margin-top:8px}
      #mealForm #simpleMealFlow .simple-search-results button{display:block !important;width:100%;text-align:left;min-height:46px}
      #mealForm #simpleMealFlow #simpleMealSelected{display:block !important;margin:14px 0}
      #mealForm #simpleMealFlow h3,#mealForm #simpleMealFlow p,#mealForm #simpleMealFlow strong,#mealForm #simpleMealFlow label{display:block !important}
      #mealForm[data-simple-step="food"] > button[type="submit"],#mealForm[data-simple-step="food"] > label:has(select[name="taste"]),#mealForm[data-simple-step="food"] > label:has(select[name="satiety"]){display:block !important}
      #mealForm[data-simple-step="other"] > label:has(textarea[name="food"]),#mealForm[data-simple-step="other"] > label:has(input[name="portion"]),#mealForm[data-simple-step="other"] > button[type="submit"],#mealForm[data-simple-step="other"] > label:has(select[name="taste"]),#mealForm[data-simple-step="other"] > label:has(select[name="satiety"]){display:block !important}
      #mealForm[data-simple-step="ready"] [data-ready-foods],#mealForm[data-simple-step="ready"] > button[type="submit"],#mealForm[data-simple-step="ready"] > label:has(select[name="taste"]),#mealForm[data-simple-step="ready"] > label:has(select[name="satiety"]){display:block !important}
      #simpleMealFlow .simple-step{margin-top:14px}`;document.head.appendChild(style);

    const flow=document.createElement('section');flow.id='simpleMealFlow';flow.className='panel calm';flow.innerHTML=`<div id="simpleMealStep1" class="simple-step"><h3>1. Vilken måltid?</h3><div class="meal-choice-grid">${mealTypes.map(([name,emoji])=>`<button type="button" class="secondary" data-simple-meal="${name}">${emoji} ${name}</button>`).join('')}</div></div><div id="simpleMealStep2" class="simple-step" hidden><h3>2. Vad åt du?</h3><p id="simpleMealFor" class="note"></p><div id="simpleFoodChoices"></div><div id="simpleMealSelected"></div><div id="simpleExtraChoices" class="meal-choice-grid"></div></div>`;form.insertBefore(flow,form.firstChild);
    if(mealLabel)mealLabel.hidden=true;if(foodLabel)foodArea.placeholder='Skriv det du åt eller drack';if(portionLabel)portionLabel.hidden=true;

    const step2=flow.querySelector('#simpleMealStep2'),choiceRoot=flow.querySelector('#simpleFoodChoices'),extraRoot=flow.querySelector('#simpleExtraChoices'),mealFor=flow.querySelector('#simpleMealFor');

    function searchFoods(query,type){
      if(window.MalixFoodBank?.search)return window.MalixFoodBank.search(query,type,18);
      const q=query.toLocaleLowerCase('sv-SE');return fallbackFoods.filter(food=>food.toLocaleLowerCase('sv-SE').includes(q)).slice(0,12);
    }

    function renderFoodChoice(type){
      choiceRoot.innerHTML=`<label>Sök mat eller dryck<input id="simpleFoodSearch" class="simple-food-search" type="search" autocomplete="off" placeholder="Skriv minst två bokstäver, t.ex. brie, kyck eller äpp"></label><p class="note">Samma stora matbank används för alla måltider. Skriv några bokstäver så visas passande alternativ.</p><div id="simpleFoodResults" class="simple-search-results"></div>`;
      const input=choiceRoot.querySelector('#simpleFoodSearch'),results=choiceRoot.querySelector('#simpleFoodResults');
      const showMatches=()=>{
        const q=input.value.trim();
        if(q.length<2){results.innerHTML=q?'<p class="note">Skriv minst två bokstäver.</p>':'';return;}
        const matches=searchFoods(q,type);
        results.innerHTML=matches.length?matches.map(food=>`<button type="button" class="secondary" data-search-food="${food.replace(/"/g,'&quot;')}">${food}</button>`).join(''):'<p class="note">Inget färdigt alternativ hittades. Du kan välja Annat / skriv själv nedan.</p>';
        results.querySelectorAll('[data-search-food]').forEach(b=>b.addEventListener('click',()=>{addFood(form,b.dataset.searchFood);input.value='';results.innerHTML='';input.focus()}));
      };
      input.addEventListener('input',showMatches);setTimeout(()=>input.focus(),0);
    }

    function chooseMeal(type){
      mealSelect.value=type;mealSelect.dispatchEvent(new Event('change',{bubbles:true}));sessionStorage.setItem('malix-selected-meal-type',type);form.dataset.simpleStep='food';mealFor.textContent=`Du loggar: ${type}`;flow.querySelectorAll('[data-simple-meal]').forEach(b=>b.classList.toggle('active',b.dataset.simpleMeal===type));renderFoodChoice(type);
      const isMain=['Lunch','Middag'].includes(type);extraRoot.innerHTML=`${isMain?'<button type="button" class="secondary" data-simple-action="recipe">📖 Välj recept</button><button type="button" class="secondary" data-simple-action="ready">⚡ Färdigt & enkelt</button>':''}<button type="button" class="secondary" data-simple-action="other">➕ Annat / skriv själv</button>`;step2.hidden=false;renderSelected(form);
    }

    flow.querySelectorAll('[data-simple-meal]').forEach(b=>b.addEventListener('click',()=>chooseMeal(b.dataset.simpleMeal)));
    flow.addEventListener('click',e=>{const b=e.target.closest('[data-simple-action]');if(!b)return;const action=b.dataset.simpleAction;if(action==='recipe'){sessionStorage.setItem('malix-selected-meal-type',mealSelect.value);const trigger=document.querySelector('[data-calm-open="recipeBank"]')||document.querySelector('[data-open="recipeBank"]');if(trigger)trigger.click();return}if(action==='other'){form.dataset.simpleStep='other';foodLabel.hidden=false;if(portionLabel)portionLabel.hidden=false;foodArea.focus();foodLabel.scrollIntoView({behavior:'smooth',block:'center'});return}form.dataset.simpleStep=action;setTimeout(()=>document.querySelector('[data-ready-foods]')?.scrollIntoView({behavior:'smooth',block:'start'}),0)});
    form.addEventListener('reset',()=>setTimeout(()=>{form.removeAttribute('data-simple-step');sessionStorage.removeItem('malix-selected-meal-type');step2.hidden=true;foodLabel.hidden=true;if(portionLabel)portionLabel.hidden=true;renderSelected(form);flow.querySelectorAll('[data-simple-meal]').forEach(b=>b.classList.remove('active'))},0));collapseHistory();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();