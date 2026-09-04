(() => {
  const groups={
    ready:{label:'🍽️ Färdig rätt',items:['Portionsrätt / frysrätt','Färdig lasagne','Färdig paj','Färdig soppa','Färdig pizza','Färdig pastarätt','Pyttipanna','Annan färdigrätt']},
    simple:{label:'🥘 Något enkelt',items:['Färdiga köttbullar','Fiskpinnar','Nuggets','Falafel','Pulvermos','Färdigt potatismos','Färdigkokt ris','Färdig pastasås']},
    sides:{label:'🥣 Sås eller tillbehör',items:['Brunsås – pulver','Gräddsås – pulver','Pepparsås – pulver','Bearnaisesås – pulver','Currysås – pulver','Färdig brunsås','Färdig gräddsås','Tacosås','Potatissallad','Coleslaw','Picklad lök','Rostad lök','Bostongurka','Rödbetor','Inlagd gurka','Oliver','Jalapeño','Pepperoni']}
  };
  function defaultAmount(name){
    if(/köttbullar/i.test(name))return '5 st';
    if(/fiskpinnar|nuggets|falafel/i.test(name))return '4 st';
    if(/pulvermos|potatismos/i.test(name))return '200 g';
    if(/picklad lök|rostad lök|bostongurka|rödbetor|inlagd gurka|oliver|jalapeño|pepperoni/i.test(name))return '30 g';
    if(/brunsås|gräddsås|pepparsås|bearnaisesås|currysås|tacosås|pastasås/i.test(name))return '50 g';
    if(/potatissallad|coleslaw|ris|pyttipanna/i.test(name))return '200 g';
    return '1 portion';
  }
  function setup(){
    const form=document.querySelector('#mealForm');if(!form||form.querySelector('[data-ready-foods]'))return;
    const anchor=form.querySelector('textarea[name="food"]')?.closest('label');if(!anchor)return;
    const box=document.createElement('section');box.dataset.readyFoods='1';box.className='panel calm';
    box.innerHTML=`<h3>🍽️ Färdigt & enkelt</h3><p class="note">Välj först vad du vill lägga till. Du kan sedan välja flera delar till samma måltid.</p><div class="meal-choice-grid" data-ready-groups>${Object.entries(groups).map(([key,g])=>`<button type="button" class="secondary" data-ready-group="${key}">${g.label}</button>`).join('')}</div><div data-ready-options></div><div data-ready-summary class="note" style="margin-top:12px">Inget tillagt ännu.</div>`;
    anchor.insertAdjacentElement('beforebegin',box);
    const textarea=form.querySelector('textarea[name="food"]'),options=box.querySelector('[data-ready-options]'),summary=box.querySelector('[data-ready-summary]'),added=[];
    const renderSummary=()=>{summary.textContent=added.length?'Tillagt: '+added.join(' · '):'Inget tillagt ännu.'};
    const showGroup=key=>{const group=groups[key];if(!group)return;box.querySelectorAll('[data-ready-group]').forEach(b=>b.classList.toggle('active',b.dataset.readyGroup===key));options.innerHTML=`<h4>${group.label}</h4><div class="chips">${group.items.map(x=>`<button type="button" class="secondary" data-ready="${x}">${x}</button>`).join('')}</div>`};
    box.addEventListener('click',e=>{
      const groupButton=e.target.closest('[data-ready-group]');if(groupButton){showGroup(groupButton.dataset.readyGroup);return;}
      const b=e.target.closest('[data-ready]');if(!b)return;
      const name=b.dataset.ready,amount=window.prompt(`Hur mycket ${name.toLowerCase()}?`,defaultAmount(name));if(amount===null)return;
      const entry=`${name} (${String(amount).trim()||defaultAmount(name)})`,current=textarea.value.split(/,\s*/).map(x=>x.trim()).filter(Boolean);current.push(entry);textarea.value=current.join(', ');textarea.dispatchEvent(new Event('input',{bubbles:true}));added.push(entry);b.classList.add('active');renderSummary();form.querySelector('button[type="submit"]')?.scrollIntoView({behavior:'smooth',block:'center'});
    });
    form.addEventListener('reset',()=>setTimeout(()=>{added.length=0;options.innerHTML='';box.querySelectorAll('[data-ready-group]').forEach(b=>b.classList.remove('active'));renderSummary()},0));
  }
  setup();document.addEventListener('click',()=>setTimeout(setup,0),true);
})();