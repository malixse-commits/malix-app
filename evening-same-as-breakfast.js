(() => {
  function getMealSelect(){return document.querySelector('#mealForm select[name="meal"]')}
  let syncing=false;
  function mirrorBreakfast(){
    const select=getMealSelect();
    if(!select||select.value!=='Kvällsmål'||syncing)return;
    syncing=true;
    const original='Kvällsmål';
    select.value='Frukost';
    select.dispatchEvent(new Event('change',{bubbles:true}));
    setTimeout(()=>{
      select.value=original;
      syncing=false;
    },0);
  }
  function init(){
    const select=getMealSelect();
    if(!select)return setTimeout(init,150);
    if(select.dataset.eveningBreakfastMirror==='1')return;
    select.dataset.eveningBreakfastMirror='1';
    select.addEventListener('change',()=>{
      if(select.value==='Kvällsmål')setTimeout(mirrorBreakfast,0);
    });
    document.addEventListener('click',e=>{
      const b=e.target.closest('button');
      if(!b)return;
      const text=(b.textContent||'').trim().toLowerCase();
      if(text.includes('öppna kvällsmål'))setTimeout(mirrorBreakfast,60);
    },true);
    const form=document.querySelector('#mealForm');
    if(form){
      const obs=new MutationObserver(()=>{
        const s=getMealSelect();
        if(s?.value==='Kvällsmål'&&!syncing){
          const container=form.parentElement;
          const hasFull=[...container.querySelectorAll('h3,h4,strong,legend')].some(x=>(x.textContent||'').trim()==='Bröd & gryn');
          if(!hasFull)setTimeout(mirrorBreakfast,0);
        }
      });
      obs.observe(form.parentElement,{childList:true,subtree:true});
    }
    if(select.value==='Kvällsmål')mirrorBreakfast();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();