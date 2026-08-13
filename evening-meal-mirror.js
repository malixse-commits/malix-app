(()=>{
  function init(){
    const form=document.querySelector('#mealForm');
    const select=form?.querySelector('select[name="meal"]');
    if(!form||!select)return setTimeout(init,200);
    if(select.dataset.eveningMirror==='2')return;
    select.dataset.eveningMirror='2';
    let syncing=false;
    function mirrorBreakfast(){
      if(syncing||select.value!=='Kvällsmål')return;
      syncing=true;
      setTimeout(()=>{
        select.value='Frukost';
        select.dispatchEvent(new Event('change',{bubbles:true}));
        setTimeout(()=>{
          select.value='Kvällsmål';
          syncing=false;
        },100);
      },100);
    }
    select.addEventListener('change',mirrorBreakfast);
    document.addEventListener('click',e=>{
      const t=(e.target.textContent||'').toLowerCase();
      if(t.includes('kvällsmål'))setTimeout(mirrorBreakfast,150);
    },true);
    mirrorBreakfast();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,500),{once:true});
  else setTimeout(init,500);
})();