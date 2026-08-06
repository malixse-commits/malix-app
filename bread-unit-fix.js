(() => {
  const KITCHEN_KEY='malix-smart-kitchen-v1';
  const originalPrompt=window.prompt.bind(window);

  window.prompt=(message,defaultValue)=>{
    const msg=String(message||'').toLowerCase();
    if(/hur mycket (brödskiva|rostat bröd|knäckebröd)/i.test(message||'')){
      return originalPrompt(message,'1 skiva');
    }
    if(/hur mycket .*bröd.*köpte du/i.test(message||'')){
      return originalPrompt(message,'20 skivor');
    }
    return originalPrompt(message,defaultValue);
  };

  function setupStockForm(){
    const form=document.querySelector('#stockForm');
    if(!form||form.dataset.breadUnitsReady==='1')return;
    const item=form.querySelector('[name="item"]');
    const amount=form.querySelector('[name="amount"]');
    if(item&&amount){
      item.addEventListener('input',()=>{
        if(/\b(bröd|limpa)\b/i.test(item.value)){
          amount.placeholder='t.ex. 20 skivor';
          if(!amount.value)amount.value='20 skivor';
        }
      });
    }
    form.dataset.breadUnitsReady='1';
  }

  function parseAmount(s){
    const m=String(s||'').toLowerCase().replace(',','.').match(/(\d+(?:\.\d+)?)\s*(kg|g|dl|ml|l|st|stycken|skiva|skivor)?/);
    if(!m)return null;
    let n=Number(m[1]),u=m[2]||'';
    if(u==='kg'){n*=1000;u='g'}
    if(u==='l'){n*=1000;u='ml'}
    if(u==='dl'){n*=100;u='ml'}
    if(['stycken','skiva','skivor'].includes(u))u='st';
    return {n,u};
  }
  const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]/gi,' ').replace(/\s+/g,' ').trim();
  function breadLike(s){return /brod|knackebrod|rostat brod|limpa/.test(norm(s));}

  document.addEventListener('malix-day-changed',()=>{
    // This only repairs bread quantities that are stored as slices. The normal meal-kitchen sync handles the actual deduction.
    const raw=localStorage.getItem(KITCHEN_KEY); if(!raw)return;
    try{
      const st=JSON.parse(raw); let changed=false;
      (st.stock||[]).forEach(x=>{
        if(breadLike(x.item)&&/^\s*\d+(?:[.,]\d+)?\s*skivor?\s*$/i.test(x.amount||'')){
          const a=parseAmount(x.amount);if(a){x.amount=`${a.n} st`;changed=true;}
        }
      });
      if(changed)localStorage.setItem(KITCHEN_KEY,JSON.stringify(st));
    }catch{}
  });

  setupStockForm();
  document.addEventListener('click',()=>setTimeout(setupStockForm,0),true);
})();