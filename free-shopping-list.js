(()=>{
 const KEY='malix_free_shopping_list_v1';
 const main=document.querySelector('main');if(!main)return;
 let view=document.querySelector('#freeShoppingList');
 if(!view){view=document.createElement('section');view.id='freeShoppingList';view.className='view';main.appendChild(view)}
 view.innerHTML=`<button class="back" type="button" data-open-kitchen>← Mitt kök</button><p class="eyebrow">GRATIS</p><h2>🛒 Handlingslista</h2><p class="subtitle">En enkel lista där du själv bestämmer vad som ska köpas.</p><section class="panel"><h3>Lägg till en vara</h3><form id="freeShoppingForm" class="record-form"><label>Vara<input id="freeShoppingInput" type="text" placeholder="t.ex. mjölk, tomater eller ris" required></label><button type="submit" class="primary">Lägg till i handlingslistan</button></form><p id="freeShoppingSaved" class="status"></p></section><section class="panel"><h3>Det jag behöver köpa</h3><p class="note">När ett recept läggs till hamnar alla ingredienser här. Titta själv hemma och ta bort det du redan har.</p><div id="freeShoppingItems"></div><button id="clearFreeShopping" class="secondary" type="button">Rensa hela listan</button></section>`;
 const read=()=>{try{const x=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(x)?x:[]}catch{return[]}};
 const save=x=>localStorage.setItem(KEY,JSON.stringify(x));
 const esc=s=>String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
 function render(){const box=view.querySelector('#freeShoppingItems'),items=read();if(!box)return;box.innerHTML=items.length?items.map((x,i)=>`<div class="recipe-card" style="display:flex;justify-content:space-between;align-items:center;gap:10px"><span>${esc(x)}</span><button type="button" class="secondary" data-free-remove="${i}">Ta bort</button></div>`).join(''):'<p class="note">Handlingslistan är tom.</p>'}
 const form=view.querySelector('#freeShoppingForm');
 form.onsubmit=e=>{e.preventDefault();const input=view.querySelector('#freeShoppingInput'),v=input.value.trim();if(!v)return;const a=read();a.push(v);save(a);input.value='';view.querySelector('#freeShoppingSaved').textContent='Tillagd ✓';render();input.focus()};
 view.onclick=e=>{const r=e.target.closest('[data-free-remove]');if(r){const a=read();a.splice(Number(r.dataset.freeRemove),1);save(a);render();return}if(e.target.closest('#clearFreeShopping')){save([]);render();return}if(e.target.closest('[data-open-kitchen]')){document.querySelectorAll('main > .view').forEach(v=>v.classList.remove('active-view'));document.querySelector('#kitchenHub')?.classList.add('active-view')}};
 window.malixAddToFreeShoppingList=items=>{const a=read();(items||[]).forEach(x=>{const v=String(x).trim();if(v)a.push(v)});save(a);render()};
 render();
})();