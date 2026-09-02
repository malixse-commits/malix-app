(() => {
  const esc=s=>String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  function stock(){return typeof window.malixGetKitchenStock==='function'?window.malixGetKitchenStock():[]}

  function enhanceRescue(){
    const view=document.querySelector('#leftovers'),input=document.querySelector('#leftoverInput');
    if(!view||!input)return;
    let box=view.querySelector('[data-plus-rescue-stock]');
    if(!box){
      box=document.createElement('section');
      box.className='panel calm';
      box.dataset.plusRescueStock='1';
      const firstPanel=view.querySelector('.panel');
      firstPanel?.insertAdjacentElement('beforebegin',box);
    }
    const items=stock();
    box.innerHTML=`<p class="eyebrow">PLUS</p><h3>🧊 Rädda det jag redan har hemma</h3><p class="note">Välj något från Kyl, frys & skafferi så läggs det i sökningen nedan.</p>${items.length?`<div class="chips">${items.slice(0,30).map(x=>`<button type="button" class="secondary" data-rescue-stock="${esc(x.item)}">${esc(x.item)} <small>${esc(x.amount||'')}</small></button>`).join('')}</div>`:'<p class="empty">Det finns inget registrerat i PLUS-köket ännu.</p>'}`;
    box.querySelectorAll('[data-rescue-stock]').forEach(b=>b.addEventListener('click',()=>{
      const item=b.dataset.rescueStock;
      const parts=input.value.split(',').map(x=>x.trim()).filter(Boolean);
      if(!parts.some(x=>x.toLocaleLowerCase('sv-SE')===item.toLocaleLowerCase('sv-SE')))parts.push(item);
      input.value=parts.join(', ');
      input.focus();
    }));
  }

  function showLeftoverQuestion(recipe){
    const view=document.querySelector('#foodLog');if(!view||!recipe)return;
    view.querySelector('[data-leftover-question]')?.remove();
    const panel=document.createElement('section');
    panel.className='panel calm';
    panel.dataset.leftoverQuestion='1';
    panel.innerHTML=`<p class="eyebrow">PLUS · Rädda maten</p><h3>♻️ Blev det något över av ${esc(recipe.name)}?</h3><p class="note">Om du sparar resten läggs den i Kyl, frys & skafferi och kan användas av Rädda maten senare.</p><div class="chips"><button type="button" class="primary" data-leftover-yes>Ja, spara resten</button><button type="button" class="secondary" data-leftover-no>Nej</button></div><form data-leftover-form class="record-form" hidden style="margin-top:12px"><label>Vad blev över?<input name="item" value="${esc(recipe.name)}" required></label><label>Hur mycket?<input name="amount" value="1 portion" placeholder="t.ex. 2 portioner eller 3 dl" required></label><label>Var sparar du det?<select name="place"><option>Kyl</option><option>Frys</option></select></label><button class="primary" type="submit">Spara resten</button></form><p data-leftover-status class="status" aria-live="polite"></p>`;
    const anchor=view.querySelector('#mealSaved')?.closest('.panel')||view.querySelector('.panel');
    anchor?.insertAdjacentElement('beforebegin',panel);
    const form=panel.querySelector('[data-leftover-form]'),status=panel.querySelector('[data-leftover-status]');
    panel.querySelector('[data-leftover-yes]')?.addEventListener('click',()=>{form.hidden=false;form.querySelector('input')?.focus()});
    panel.querySelector('[data-leftover-no]')?.addEventListener('click',()=>{form.hidden=true;status.textContent='Ingen rest sparades.'});
    form?.addEventListener('submit',e=>{
      e.preventDefault();const data=new FormData(form),item=String(data.get('item')||'').trim(),amount=String(data.get('amount')||'').trim(),place=String(data.get('place')||'Kyl');
      if(!item||!amount)return;
      if(typeof window.malixAddKitchenItem!=='function'){status.textContent='PLUS-köket kunde inte uppdateras just nu.';return}
      window.malixAddKitchenItem(item,place,amount);
      status.textContent='Resten är sparad i PLUS-köket ✓';
      form.hidden=true;
      enhanceRescue();
    });
  }

  document.addEventListener('malix-recipe-cooked',event=>showLeftoverQuestion(event.detail?.recipe));
  document.addEventListener('malix-smart-kitchen-updated',enhanceRescue);
  document.addEventListener('malix-plus-view-ready',enhanceRescue);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enhanceRescue,{once:true});else enhanceRescue();
})();