(() => {
  const clean=s=>String(s||'').trim();
  const extraGrains=['Cornflakes','Havrefras','Granola','Glutenfri müsli','Glutenfria flingor','Glutenfria havregryn','Glutenfritt bröd','Glutenfritt knäckebröd'];

  function init(){
    document.querySelector('#breakfastQuickChoices')?.remove();
    const form=document.querySelector('#mealForm');
    if(!form||document.body.dataset.mealPolishReady==='1') return;
    const container=form.parentElement;

    const headings=[...container.querySelectorAll('h3,h4,strong,p,legend')];
    const grainHeading=headings.find(x=>clean(x.textContent)==='Bröd & gryn');
    if(grainHeading){
      const group=grainHeading.parentElement;
      const target=group.querySelector('.chips')||group;
      const existing=new Set([...group.querySelectorAll('button')].map(b=>clean(b.textContent)));
      extraGrains.forEach(label=>{
        if(existing.has(label)) return;
        const b=document.createElement('button');
        b.type='button';b.className='secondary';b.textContent=label;
        target.appendChild(b);
      });
    }

    const labels=['Bröd & gryn','Mejeri','Pålägg','Frukt & grönt','Dryck'];
    labels.forEach(label=>{
      const heading=[...container.querySelectorAll('h3,h4,strong,p,legend')].find(x=>clean(x.textContent)===label);
      if(!heading) return;
      const group=heading.parentElement;
      const body=document.createElement('div');
      body.hidden=true;
      [...group.children].filter(x=>x!==heading).forEach(x=>body.appendChild(x));
      group.appendChild(body);
      heading.style.cursor='pointer';heading.tabIndex=0;heading.setAttribute('role','button');heading.textContent=label+' ▸';
      const toggle=()=>{body.hidden=!body.hidden;heading.textContent=label+(body.hidden?' ▸':' ▾');};
      heading.addEventListener('click',toggle);
      heading.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}});
    });

    document.body.dataset.mealPolishReady='1';
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();