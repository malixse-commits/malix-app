(() => {
  const esc=s=>String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  function stock(){return typeof window.malixGetKitchenStock==='function'?window.malixGetKitchenStock():[]}

  function appendChoice(input,item){
    const parts=input.value.split(',').map(x=>x.trim()).filter(Boolean);
    if(!parts.some(x=>x.toLocaleLowerCase('sv-SE')===item.toLocaleLowerCase('sv-SE')))parts.push(item);
    input.value=parts.join(', ');
    input.focus();
  }

  function renderStockChooser({viewSelector,inputSelector,marker,title,note}){
    const view=document.querySelector(viewSelector),input=document.querySelector(inputSelector);if(!view||!input)return;
    let box=view.querySelector(`[${marker}]`);
    if(!box){box=document.createElement('section');box.className='panel calm';box.setAttribute(marker,'1');view.querySelector('.panel')?.insertAdjacentElement('beforebegin',box)}
    const items=stock();
    box.innerHTML=`<p class="eyebrow">PLUS</p><h3>${title}</h3><p class="note">${note}</p>${items.length?`<div class="chips">${items.slice(0,40).map(x=>`<button type="button" class="secondary" data-stock-choice="${esc(x.item)}">${esc(x.item)} <small>${esc(x.place||'')} · ${esc(x.amount||'')}</small></button>`).join('')}</div>`:'<p class="empty">Det finns inget registrerat i Kyl, frys & skafferi ännu.</p>'}`;
    box.querySelectorAll('[data-stock-choice]').forEach(b=>b.addEventListener('click',()=>appendChoice(input,b.dataset.stockChoice)));
  }

  function enhanceKitchenSearches(){
    renderStockChooser({viewSelector:'#ingredient',inputSelector:'#ingredientInput',marker:'data-plus-home-stock',title:'🧊 Välj bland det jag har hemma',note:'Tryck på en eller flera varor så används de i sökningen Vad finns hemma?'});
    renderStockChooser({viewSelector:'#leftovers',inputSelector:'#leftoverInput',marker:'data-plus-rescue-stock',title:'♻️ Rädda det jag redan har hemma',note:'Välj något från Kyl, frys & skafferi så kan Rädda maten ge förslag utifrån det.'});
  }

  function showLeftoverQuestion(recipe){
    const view=document.querySelector('#foodLog');if(!view||!recipe)return;
    view.querySelector('[data-leftover-question]')?.remove();
    const panel=document.createElement('section');
    panel.className='panel calm';panel.dataset.leftoverQuestion='1';
    panel.innerHTML=`<p class="eyebrow">PLUS · Rädda maten</p><h3>♻️ Blev det något över av ${esc(recipe.name)}?</h3><p class="note">Om du sparar resten läggs den i Kyl, frys & skafferi. Då kan Vad finns hemma? och Rädda maten använda den senare.</p><div class="chips"><button type="button" class="primary" data-leftover-yes>Ja, spara resten</button><button type="button" class="secondary" data-leftover-no>Nej</button></div><form data-leftover-form class="record-form" hidden style="margin-top:12px"><label>Vad blev över?<input name="item" value="${esc(recipe.name)}" required></label><label>Hur mycket?<input name="amount" value="1 portion" placeholder="t.ex. 2 portioner eller 3 dl" required></label><label>Var sparar du det?<select name="place"><option>Kyl</option><option>Frys</option></select></label><button class="primary" type="submit">Spara resten</button></form><p data-leftover-status class="status" aria-live="polite"></p>`;
    const anchor=view.querySelector('#mealSaved')?.closest('.panel')||view.querySelector('.panel');anchor?.insertAdjacentElement('beforebegin',panel);
    const form=panel.querySelector('[data-leftover-form]'),status=panel.querySelector('[data-leftover-status]');
    panel.querySelector('[data-leftover-yes]')?.addEventListener('click',()=>{form.hidden=false;form.querySelector('input')?.focus()});
    panel.querySelector('[data-leftover-no]')?.addEventListener('click',()=>{form.hidden=true;status.textContent='Ingen rest sparades.'});
    form?.addEventListener('submit',e=>{
      e.preventDefault();const data=new FormData(form),item=String(data.get('item')||'').trim(),amount=String(data.get('amount')||'').trim(),place=String(data.get('place')||'Kyl');
      if(!item||!amount)return;
      if(typeof window.malixAddKitchenItem!=='function'){status.textContent='PLUS-köket kunde inte uppdateras just nu.';return}
      window.malixAddKitchenItem(item,place,amount);status.textContent='Resten är sparad i PLUS-köket ✓';form.hidden=true;enhanceKitchenSearches();
    });
  }

  document.addEventListener('malix-recipe-cooked',event=>showLeftoverQuestion(event.detail?.recipe));
  document.addEventListener('malix-smart-kitchen-updated',enhanceKitchenSearches);
  document.addEventListener('malix-plus-view-ready',enhanceKitchenSearches);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enhanceKitchenSearches,{once:true});else enhanceKitchenSearches();
})();