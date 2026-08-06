(() => {
  const plan=[
    {day:'Måndag',id:'potatisbullar',note:'♻️ Restdag: använd gärna potatis eller mos från söndagen.'},
    {day:'Tisdag',id:'kottbullar',note:'Laga gärna lite extra så något kan bli lunch eller rest senare i veckan.'},
    {day:'Onsdag',id:'kycklingmalix',note:'Spara gärna lite ris eller kyckling om det passar.'},
    {day:'Torsdag',id:'fiskpanetter',note:'En vanlig vardagsmiddag kopplad till receptbanken.'},
    {day:'Fredag',id:'chilibillig',note:'✨ Fredag får gärna kännas lite extra god och enkel.'},
    {day:'Lördag',id:'kottgrotta',note:'✨ Helgmat: välj gärna något ni tycker känns lite festligare.'},
    {day:'Söndag',id:'kalops',note:'♻️ Laga gärna lite extra potatis och kött så måndagen kan bli enklare, till exempel pyttipanna.'}
  ];
  function allRecipes(){try{return typeof recipes!=='undefined'?recipes:[]}catch{return []}}
  function findRecipe(id){return allRecipes().find(r=>r.id===id)}
  function render(){
    const view=document.querySelector('#weekPlan');
    if(!view||view.dataset.smartWeek==='1')return;
    const p=view.querySelector('p');
    if(p)p.textContent='Planera sju dagar som hänger ihop med recept, rester, Mitt kök och handlingslistan.';
    const panel=view.querySelector('.panel');
    if(!panel)return;
    panel.innerHTML='<div class="recipe-grid" id="smartWeekGrid"></div>';
    const grid=panel.querySelector('#smartWeekGrid');
    plan.forEach(item=>{
      const r=findRecipe(item.id);
      const card=document.createElement('article');
      card.className='recipe-card';
      card.innerHTML=`<p class="eyebrow">${item.day}</p><h3>${r?(r.emoji||'🍽️')+' '+r.name:'🍽️ Välj recept'}</h3><p>${item.note}</p><div class="stack-buttons"><button type="button" class="primary" data-week-open="${item.id}">📖 Se recept</button><button type="button" class="secondary" data-open="smartKitchen">🧊 Mitt kök</button></div>`;
      grid.appendChild(card);
    });
    panel.addEventListener('click',e=>{
      const b=e.target.closest('[data-week-open]');
      if(!b)return;
      const id=b.dataset.weekOpen;
      if(typeof window.openRecipe==='function')window.openRecipe(id);
      else {
        const homeBtn=document.querySelector('[data-open="recipeBank"]');
        homeBtn?.click();
        setTimeout(()=>{const target=[...document.querySelectorAll('[data-recipe-id]')].find(x=>x.dataset.recipeId===id);target?.click();},50);
      }
    });
    view.dataset.smartWeek='1';
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render,{once:true});else render();
})();