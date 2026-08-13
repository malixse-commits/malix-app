(()=>{
  function setup(){
    const form=document.querySelector('#mealForm');
    const select=form?.querySelector('select[name="meal"]');
    if(!form||!select)return;
    const toggleExtras=()=>{
      const show=select.value==='Lunch'||select.value==='Middag';
      form.querySelector('[data-ready-foods]')?.toggleAttribute('hidden',!show);
      form.querySelector('[data-takeaway-box]')?.toggleAttribute('hidden',!show);
    };
    select.addEventListener('change',toggleExtras);
    toggleExtras();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});
  else setup();
})();