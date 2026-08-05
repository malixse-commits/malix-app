(() => {
  const FAV_KEY='malix-meal-choice-counts-v1';
  const portionOptions={
    'Ägg':['1 st','2 st','3 st'],
    'Kaffe':['1 kopp','2 koppar','3 koppar'],
    'Te':['1 kopp','2 koppar','3 koppar'],
    'Brödskiva':['1 skiva','2 skivor','3 skivor'],
    'Knäckebröd':['1 skiva','2 skivor','3 skivor'],
    'Rostat bröd':['1 skiva','2 skivor','3 skivor'],
    'Kvarg':['100 g','200 g','250 g'],
    'Filmjölk':['1,5 dl','2 dl','2,5 dl'],
    'Yoghurt':['1,5 dl','2 dl','2,5 dl'],
    'Mjölk':['1 dl','2 dl','2,5 dl'],
    'Müsli':['0,5 dl','1 dl','1,5 dl'],
    'Cornflakes':['0,5 dl','1 dl','1,5 dl'],
    'Havrefras':['0,5 dl','1 dl','1,5 dl'],
    'Granola':['0,5 dl','1 dl','1,5 dl']
  };
  const extraGrains=['Cornflakes','Havrefras','Granola','Glutenfri müsli','Glutenfria flingor','Glutenfria havregryn','Glutenfritt bröd','Glutenfritt knäckebröd'];

  const loadCounts=()=>{try{return JSON.parse(localStorage.getItem(FAV_KEY)||'{}')}catch{return {}}};
  const saveCounts=x=>localStorage.setItem(FAV_KEY,JSON.stringify(x));
  const clean=s=>String(s||'').trim();

  function removeDuplicateQuickBox(){document.querySelector('#breakfastQuickChoices')?.remove();}

  function findChoiceArea(){
    const form=document.querySelector('#mealForm');
    if(!form)return null;
    const headings=[...form.parentElement.querySelectorAll('h3,h4,strong,p')];
    const start=headings.find(x=>clean(x.textContent)==='Välj det som ingick');
    return start?.parentElement||form.parentElement;
  }

  function addMissingGrains(root){
    const nodes=[...root.querySelectorAll('h3,h4,strong,p,legend')];
    const heading=nodes.find(x=>clean(x.textContent)==='Bröd & gryn');
    if(!heading)return;
    let group=heading.parentElement;
    const existing=new Set([...group.querySelectorAll('button')].map(b=>clean(b.textContent)));
    extraGrains.forEach(label=>{
      if(existing.has(label))return;
      const b=document.createElement('button');b.type='button';b.textContent=label;b.className='secondary';
      const target=group.querySelector('.chips')||group;
      target.appendChild(b);
    });
  }

  function makeGroupsCollapsible(root){
    const labels=['Bröd & gryn','Mejeri','Pålägg','Frukt & grönt','Dryck'];
    labels.forEach(label=>{
      const heading=[...root.querySelectorAll('h3,h4,strong,p,legend')].find(x=>clean(x.textContent)===label);
      if(!heading||heading.dataset.collapsibleReady)return;
      heading.dataset.collapsibleReady='1';
      const group=heading.parentElement;
      const controls=[...group.children].filter(x=>x!==heading);
      const wrap=document.createElement('div');wrap.dataset.groupBody=label;controls.forEach(x=>wrap.appendChild(x));group.appendChild(wrap);
      heading.style.cursor='pointer';heading.setAttribute('role','button');heading.tabIndex=0;
      heading.textContent=`${label} ▾`;
      const toggle=()=>{const hidden=wrap.hidden;wrap.hidden=!hidden;heading.textContent=`${label} ${hidden?'▾':'▸'}`};
      heading.addEventListener('click',toggle);heading.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle()}});
    });
  }

  function selectedButtonLabel(button){return clean(button.textContent).replace(/\s*\([^)]*\)\s*$/,'');}

  function addPortionBehavior(root){
    root.addEventListener('click',event=>{
      const b=event.target.closest('button');if(!b||b.dataset.mealPolishHandled)return;
      const label=selectedButtonLabel(b);if(!label)return;
      const counts=loadCounts();counts[label]=(counts[label]||0)+1;saveCounts(counts);renderFavorites(root);
      const opts=portionOptions[label];if(!opts||b.dataset.skipPortionPrompt)return;
      setTimeout(()=>{
        const answer=prompt(`Hur mycket ${label.toLowerCase()}?\nVälj gärna: ${opts.join(', ')}`,opts[0]);
        if(answer===null||!answer.trim())return;
        const current=clean(b.textContent).replace(/\s*\([^)]*\)\s*$/,'');
        b.textContent=`${current} (${answer.trim()})`;
      },0);
    },true);
  }

  function renderFavorites(root){
    let box=root.querySelector('#mealFavorites');
    if(!box){box=document.createElement('section');box.id='mealFavorites';box.className='panel calm';box.innerHTML='<h3>⭐ Dina vanligaste</h3><div class="chips"></div>';root.insertBefore(box,root.firstChild)}
    const counts=loadCounts();const top=Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,6);
    const chips=box.querySelector('.chips');
    if(!top.length){box.hidden=true;return}box.hidden=false;
    chips.innerHTML=top.map(([label])=>`<button type="button" class="secondary" data-favorite-choice="${label.replace(/"/g,'&quot;')}">${label}</button>`).join('');
    chips.querySelectorAll('[data-favorite-choice]').forEach(b=>b.onclick=()=>{
      const label=b.dataset.favoriteChoice;
      const original=[...root.querySelectorAll('button')].find(x=>x!==b&&selectedButtonLabel(x)===label&&!x.dataset.favoriteChoice);
      if(original)original.click();
    });
  }

  function init(){
    removeDuplicateQuickBox();
    const root=findChoiceArea();if(!root)return;
    addMissingGrains(root);makeGroupsCollapsible(root);renderFavorites(root);
    if(!root.dataset.portionBehavior){root.dataset.portionBehavior='1';addPortionBehavior(root)}
  }
  init();
  new MutationObserver(()=>queueMicrotask(init)).observe(document.body,{childList:true,subtree:true});
})();