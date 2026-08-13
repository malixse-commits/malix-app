(()=>{
  function mealFix(){
    const form=document.querySelector('#mealForm');
    const select=form?.querySelector('select[name="meal"]');
    if(!form||!select)return;
    let busy=false;
    const hasBreakfastLayout=()=>[...form.parentElement.querySelectorAll('h3,h4,strong,p,legend')].some(x=>(x.textContent||'').trim()==='Bröd & gryn');
    const forceBreakfastLayout=()=>{
      if(busy||select.value!=='Kvällsmål'||hasBreakfastLayout())return;
      busy=true;
      const wanted='Kvällsmål';
      select.value='Frukost';
      select.dispatchEvent(new Event('change',{bubbles:true}));
      setTimeout(()=>{select.value=wanted;busy=false;},0);
    };
    select.addEventListener('change',()=>setTimeout(forceBreakfastLayout,20));
    const obs=new MutationObserver(()=>setTimeout(forceBreakfastLayout,20));
    obs.observe(form.parentElement,{childList:true,subtree:true});
    setTimeout(forceBreakfastLayout,50);
  }

  document.addEventListener('click',e=>{
    const b=e.target.closest('[data-activity]');
    if(!b)return;
    const sec=b.closest('.view');
    if(!sec)return;
    sec.dataset.chosen=b.dataset.activity||b.textContent.trim();
    sec.querySelectorAll('[data-activity]').forEach(x=>x.classList.toggle('selected',x===b));
  },true);

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(mealFix,700),{once:true});
  else setTimeout(mealFix,700);
})();