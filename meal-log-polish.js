(() => {
  const clean=s=>String(s||'').trim();
  const extraGrains=['Cornflakes','Havrefras','Granola','Glutenfri müsli','Glutenfria flingor','Glutenfria havregryn','Glutenfritt bröd','Glutenfritt knäckebröd'];
  const vegetables=['Morot','Broccoli','Blomkål','Vitkål','Rödkål','Spenat','Majs','Ärtor','Gröna bönor','Zucchini','Aubergine','Svamp','Gul lök','Purjolök'];
  const fruits=['Kiwi','Vindruvor','Melon','Mango','Jordgubbar','Blåbär','Hallon'];
  const treats=['Glass','Chips','Popcorn','Jordnötter','Nötter/frön','Choklad','Godis','Kaka','Bulle'];
  function addButtons(target,labels){const existing=new Set([...target.querySelectorAll('button')].map(b=>clean(b.textContent)));labels.forEach(label=>{if(existing.has(label))return;const b=document.createElement('button');b.type='button';b.className='secondary';b.textContent=label;target.appendChild(b);});}
  function init(){
    document.querySelector('#breakfastQuickChoices')?.remove();
    const form=document.querySelector('#mealForm');
    if(!form||document.body.dataset.mealPolishReady==='1') return;
    const container=form.parentElement;
    const headings=[...container.querySelectorAll('h3,h4,strong,p,legend')];
    const grainHeading=headings.find(x=>clean(x.textContent)==='Bröd & gryn');
    if(grainHeading){const group=grainHeading.parentElement;addButtons(group.querySelector('.chips')||group,extraGrains);}
    const fgHeading=headings.find(x=>clean(x.textContent)==='Frukt & grönt');
    if(fgHeading){const group=fgHeading.parentElement;addButtons(group.querySelector('.chips')||group,[...vegetables,...fruits]);}
    const anchor=fgHeading?.parentElement;
    if(anchor&&!container.querySelector('[data-treats-group]')){
      const group=document.createElement('div');group.dataset.treatsGroup='1';group.className='meal-choice-group';
      group.innerHTML='<h3>🍦 Något gott</h3><p class="note">Sådant du tycker om kan också få plats bland vanlig mat. Här registrerar du det bara som en del av dagen.</p><div class="chips"></div>';
      addButtons(group.querySelector('.chips'),treats);anchor.insertAdjacentElement('afterend',group);
    }
    const labels=['Bröd & gryn','Mejeri','Pålägg','Frukt & grönt','🍦 Något gott','Dryck'];
    labels.forEach(label=>{
      const heading=[...container.querySelectorAll('h3,h4,strong,p,legend')].find(x=>clean(x.textContent)===label);if(!heading)return;
      const group=heading.parentElement,body=document.createElement('div');body.hidden=true;[...group.children].filter(x=>x!==heading).forEach(x=>body.appendChild(x));group.appendChild(body);heading.style.cursor='pointer';heading.tabIndex=0;heading.setAttribute('role','button');heading.textContent=label+' ▸';const toggle=()=>{body.hidden=!body.hidden;heading.textContent=label+(body.hidden?' ▸':' ▾');};heading.addEventListener('click',toggle);heading.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}});
    });
    document.body.dataset.mealPolishReady='1';
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();