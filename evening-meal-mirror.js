(()=>{
  function setup(){
    const form=document.querySelector('#mealForm');
    const select=form?.querySelector('select[name="meal"]');
    if(!form||!select)return setTimeout(setup,200);

    function showBreakfastChoicesForEvening(){
      if(select.value!=='Kvällsmål')return;
      select.value='Frukost';
      select.dispatchEvent(new Event('change',{bubbles:true}));
      select.value='Kvällsmål';
    }

    function toggleLunchDinnerExtras(){
      const show=select.value==='Lunch'||select.value==='Middag';
      form.querySelector('[data-ready-foods]')?.toggleAttribute('hidden',!show);
      form.querySelector('[data-takeaway-box]')?.toggleAttribute('hidden',!show);
    }

    function refresh(){
      if(select.value==='Kvällsmål')showBreakfastChoicesForEvening();
      toggleLunchDinnerExtras();
    }

    select.addEventListener('change',()=>setTimeout(refresh,0));
    document.addEventListener('click',e=>{
      if((e.target.textContent||'').toLowerCase().includes('öppna kvällsmål'))setTimeout(refresh,50);
    },true);
    setTimeout(refresh,50);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});
  else setup();
})();