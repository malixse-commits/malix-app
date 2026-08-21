(() => {
  const clean=s=>String(s||'').trim();
  const extraGrains=['Cornflakes','Havrefras','Granola','Glutenfri müsli','Glutenfria flingor','Glutenfria havregryn','Glutenfritt bröd','Glutenfritt knäckebröd'];
  const vegetables=['Tomat','Gurka','Paprika','Sallad','Avokado','Rödlök','Morot','Broccoli','Blomkål','Vitkål','Rödkål','Spenat','Majs','Ärtor','Gröna bönor','Zucchini','Aubergine','Svamp','Gul lök','Purjolök'];
  const fruits=['Banan','Äpple','Päron','Apelsin','Clementin','Mandarin','Kiwi','Vindruvor','Melon','Vattenmelon','Honungsmelon','Galiamelon','Mango','Ananas','Persika','Nektarin','Plommon','Grapefrukt','Granatäpple','Passionsfrukt','Papaya','Jordgubbar','Blåbär','Hallon','Björnbär','Vinbär'];
  const fruitNames=new Set(fruits.map(x=>x.toLowerCase()));
  const treats=['Glass','Chips','Popcorn','Jordnötter','Nötter/frön','Choklad','Godis','Kaka','Bulle'];
  const mealTypes=[['Frukost','🌅'],['Lunch','🥗'],['Middag','🍽️'],['Mellanmål','🍎'],['Kvällsmål','🌙']];
  const defaultAmount=food=>/glass/i.test(food)?'1 dl':/chips|popcorn|jordnötter|nötter|choklad|godis/i.test(food)?'30 g':/kaka|bulle/i.test(food)?'1 st':/jordgubbar|blåbär|hallon|björnbär|vinbär|vindruvor|melon|mango|ananas|papaya/i.test(food)?'100 g':/banan|äpple|päron|apelsin|clementin|mandarin|kiwi|persika|nektarin|plommon|grapefrukt|granatäpple|passionsfrukt|morot/i.test(food)?'1 st':'100 g';
  function addToFreeText(food){const form=document.querySelector('#mealForm');if(!form)return;const q=prompt(`Hur mycket ${food.toLowerCase()}?`,defaultAmount(food));if(q===null)return;const ta=form.querySelector('textarea[name="food"]');if(!ta)return;const entry=`${food} (${q.trim()||defaultAmount(food)})`;ta.value=ta.value.trim()?`${ta.value.trim()}, ${entry}`:entry;ta.dispatchEvent(new Event('input',{bubbles:true}));}
  function addButtons(target,labels){const existing=new Set([...target.querySelectorAll('button')].map(b=>clean(b.textContent)));labels.forEach(label=>{if(existing.has(label))return;const b=document.createElement('button');b.type='button';b.className='secondary';b.textContent=label;b.addEventListener('click',()=>addToFreeText(label));target.appendChild(b);});}
  function makeCollapsible(group,label){if(!group||group.dataset.simpleCollapse==='1')return;group.dataset.simpleCollapse='1';const heading=[...group.children].find(x=>['H3','H4','STRONG','P','LEGEND'].includes(x.tagName));if(!heading)return;const body=document.createElement('div');[...group.children].filter(x=>x!==heading).forEach(x=>body.appendChild(x));body.hidden=true;group.appendChild(body);heading.style.cursor='pointer';heading.tabIndex=0;heading.setAttribute('role','button');const set=()=>heading.textContent=label+(body.hidden?' ▸':' ▾');const toggle=()=>{body.hidden=!body.hidden;set()};set();heading.addEventListener('click',toggle);heading.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}});}
  function setupMealFirst(form){
    if(form.dataset.mealFirst==='1')return;
    form.dataset.mealFirst='1';
    const mealSelect=form.querySelector('select[name="meal"]');
    if(!mealSelect)return;
    const mealLabel=mealSelect.closest('label');
    const chooser=document.createElement('section');
    chooser.id='mealTypeFirstStep';
    chooser.className='panel calm';
    chooser.innerHTML=`<h3>Vad vill du logga?</h3><p class="note">Välj måltid först. Sedan visas det som hör till den måltiden.</p><div class="chips">${mealTypes.map(([name,emoji])=>`<button type="button" class="secondary" data-meal-first="${name}">${emoji} ${name}</button>`).join('')}</div><p id="mealFirstChosen" class="status"></p>`;
    form.insertBefore(chooser,form.firstChild);
    if(mealLabel)mealLabel.hidden=true;

    const recipeBox=document.createElement('section');
    recipeBox.id='mealRecipeChoice';
    recipeBox.className='panel calm';
    recipeBox.hidden=true;
    recipeBox.innerHTML='<h3>📖 Vill du välja en maträtt från receptbanken?</h3><p class="note">Receptbanken är ett av sätten att logga lunch eller middag. Appen kommer ihåg vilken måltid du valde.</p><button type="button" class="primary" id="mealOpenRecipeBank">Välj från receptbanken</button>';
    chooser.insertAdjacentElement('afterend',recipeBox);

    const originalChildren=[...form.children].filter(el=>el!==chooser&&el!==recipeBox&&el!==mealLabel);
    const setVisible=chosen=>originalChildren.forEach(el=>{el.hidden=!chosen});
    setVisible(false);

    function choose(type){
      mealSelect.value=type;
      mealSelect.dispatchEvent(new Event('change',{bubbles:true}));
      sessionStorage.setItem('malix-selected-meal-type',type);
      form.dataset.selectedMeal=type;
      chooser.querySelector('#mealFirstChosen').textContent=`Du loggar: ${type}`;
      chooser.querySelectorAll('[data-meal-first]').forEach(b=>b.classList.toggle('active',b.dataset.mealFirst===type));
      recipeBox.hidden=!['Lunch','Middag'].includes(type);
      setVisible(true);
    }

    chooser.querySelectorAll('[data-meal-first]').forEach(b=>b.addEventListener('click',()=>choose(b.dataset.mealFirst)));
    recipeBox.querySelector('#mealOpenRecipeBank')?.addEventListener('click',()=>{
      sessionStorage.setItem('malix-selected-meal-type',mealSelect.value);
      const trigger=document.querySelector('[data-calm-open="recipeBank"]')||document.querySelector('[data-open="recipeBank"]');
      if(trigger)trigger.click();
      else document.querySelector('#recipeBank')?.classList.add('active-view');
    });

    form.addEventListener('reset',()=>setTimeout(()=>{
      form.dataset.selectedMeal='';
      sessionStorage.removeItem('malix-selected-meal-type');
      chooser.querySelector('#mealFirstChosen').textContent='';
      chooser.querySelectorAll('[data-meal-first]').forEach(b=>b.classList.remove('active'));
      recipeBox.hidden=true;
      setVisible(false);
    },0));
  }
  function init(){document.querySelector('#breakfastQuickChoices')?.remove();const form=document.querySelector('#mealForm');if(!form)return;setupMealFirst(form);const container=form.parentElement;if(document.querySelector('[data-fruit-group]'))return;const headings=[...container.querySelectorAll('h3,h4,strong,p,legend')];const grainHeading=headings.find(x=>clean(x.textContent)==='Bröd & gryn');if(grainHeading)addButtons(grainHeading.parentElement.querySelector('.chips')||grainHeading.parentElement,extraGrains);
    const fgHeading=headings.find(x=>clean(x.textContent)==='Frukt & grönt'||clean(x.textContent)==='Grönsaker');if(fgHeading){fgHeading.textContent='Grönsaker';const group=fgHeading.parentElement,buttons=[...group.querySelectorAll('button')];buttons.forEach(b=>{if(fruitNames.has(clean(b.textContent).toLowerCase()))b.remove()});addButtons(group.querySelector('.chips')||group,vegetables);}
    const picker=container.querySelector('.meal-picker')||container,fruit=document.createElement('section');fruit.dataset.fruitGroup='1';fruit.className='panel calm';fruit.style.margin='14px 0';fruit.innerHTML='<h3>🍎 Frukt</h3><p class="note">Välj den frukt du åt.</p><div class="chips"></div>';addButtons(fruit.querySelector('.chips'),fruits);const selected=picker.querySelector('#selectedFoods')?.closest('.panel');if(selected)selected.insertAdjacentElement('beforebegin',fruit);else picker.appendChild(fruit);
    if(!picker.querySelector('[data-treats-group]')){const group=document.createElement('section');group.dataset.treatsGroup='1';group.className='panel calm';group.style.margin='14px 0';group.innerHTML='<h3>🍦 Något gott</h3><div class="chips"></div>';addButtons(group.querySelector('.chips'),treats);fruit.insertAdjacentElement('afterend',group)}['Bröd & gryn','Mejeri','Pålägg','Grönsaker','Dryck'].forEach(label=>{const h=[...container.querySelectorAll('h3,h4,strong,p,legend')].find(x=>clean(x.textContent)===label);if(h)makeCollapsible(h.parentElement,label)});makeCollapsible(fruit,'🍎 Frukt');}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();