(() => {
  function addRoutine(){
    const form=document.querySelector('#shoppingForm');
    if(!form||document.querySelector('#beforeShoppingCheck'))return;
    const box=document.createElement('section');
    box.id='beforeShoppingCheck';
    box.className='panel calm';
    box.style.marginBottom='14px';
    box.innerHTML=`<h3>🧊 Innan du handlar – kolla hemma</h3><p class="note">En liten vardagsrutin som hjälper dig att använda det som redan finns och minska matsvinnet.</p><label><input type="checkbox"> Kolla kylskåpet efter sådant som behöver användas</label><label><input type="checkbox"> Titta på bäst före-datum</label><label><input type="checkbox"> Kolla rester</label><label><input type="checkbox"> Kolla frys och skafferi</label><label><input type="checkbox"> Finns något som kan bli en måltid innan du köper nytt?</label><button type="button" class="secondary" data-kitchen-checked>✓ Jag har kollat hemma</button><p class="status" data-check-status></p>`;
    form.parentElement.insertBefore(box,form);
    box.querySelector('[data-kitchen-checked]').onclick=()=>{box.querySelector('[data-check-status]').textContent='Bra – nu kan du handla utifrån det du faktiskt behöver.';box.querySelectorAll('input').forEach(x=>x.checked=true);};
  }
  addRoutine();
  document.addEventListener('click',()=>setTimeout(addRoutine,0),true);
})();