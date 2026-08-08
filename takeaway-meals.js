(() => {
  const choices=['🍕 Pizza','🥙 Kebab','🍜 Thai','🍣 Sushi','🍔 Hamburgare','🥡 Kinamat','🍛 Indiskt','🥗 Restaurangsallad','🥪 Café/smörgås','🥡 Annan hämtmat'];
  function setup(){
    const form=document.querySelector('#mealForm');
    if(!form||form.querySelector('[data-takeaway-box]'))return;
    const anchor=form.querySelector('.food-groups')||form.querySelector('[data-food-groups]')||form.querySelector('textarea')?.parentElement;
    if(!anchor)return;
    const box=document.createElement('section');box.dataset.takeawayBox='1';box.className='panel calm';
    box.innerHTML=`<h3>🥡 Hämtmat & ute</h3><p class="note">Hämtmat är bara en måltid. Inget från Mitt kök räknas ner när du väljer här.</p><div class="chips">${choices.map(x=>`<button type="button" data-takeaway="${x.replace(/^\S+\s/,'')}">${x}</button>`).join('')}</div><label style="display:block;margin-top:12px">Vad åt du? <input data-takeaway-detail type="text" placeholder="t.ex. kebabpizza, pad thai eller 10 bitar sushi"></label><label style="display:block;margin-top:10px">Hur mycket? <input data-takeaway-amount type="text" placeholder="t.ex. 1 pizza, 1 portion eller 10 bitar"></label><button type="button" class="secondary" data-use-takeaway style="margin-top:10px">Använd i matloggen</button>`;
    anchor.insertAdjacentElement('beforebegin',box);
    let selected='';
    box.addEventListener('click',e=>{const b=e.target.closest('[data-takeaway]');if(b){selected=b.dataset.takeaway;box.querySelectorAll('[data-takeaway]').forEach(x=>x.classList.toggle('active',x===b));return}if(!e.target.closest('[data-use-takeaway]'))return;if(!selected){alert('Välj typ av hämtmat först.');return}const detail=box.querySelector('[data-takeaway-detail]').value.trim();const amount=box.querySelector('[data-takeaway-amount]').value.trim()||'1 portion';const food=form.querySelector('#foodText,[name="food"],textarea');if(!food)return;food.value=`Hämtmat: ${detail||selected} (${amount})`;food.dataset.takeaway='1';food.dispatchEvent(new Event('input',{bubbles:true}));});
    form.addEventListener('submit',()=>{const food=form.querySelector('#foodText,[name="food"],textarea');if(food?.dataset.takeaway==='1')sessionStorage.setItem('malix-skip-kitchen-once','1')},true);
  }
  setup();document.addEventListener('click',()=>setTimeout(setup,0),true);
})();