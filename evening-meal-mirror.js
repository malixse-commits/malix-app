(()=>{
  function init(){
    const form=document.querySelector('#mealForm');
    const select=form?.querySelector('select[name="meal"]');
    if(!form||!select)return setTimeout(init,200);
    if(select.dataset.eveningMirror==='1')return;
    select.dataset.eveningMirror='1';
    let syncing=false;
    function mirrorBreakfast(){
      if(syncing||select.value!=='Kvällsmål')return;
      syncing=true;
      const wanted='Kvällsmål';
      select.value='Frukost';
      select.dispatchEvent(new Event('change',{bubbles:true}));
      setTimeout(()=>{
        select.value=wanted;
        syncing=false;
      },0);
    }
    select.addEventListener('change',()=>setTimeout(mirrorBreakfast,0));
    mirrorBreakfast();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,500),{once:true});
  else setTimeout(init,500);
})();