(() => {
  const proteinDefaults=[
    [/kyckling/i,'150 g'],[/köttfärs/i,'150 g'],[/\bkött\b/i,'150 g'],[/\bfisk\b/i,'150 g'],[/tofu/i,'150 g'],[/bönor|linser/i,'150 g']
  ];
  const originalPrompt=window.prompt.bind(window);
  window.prompt=(message,defaultValue)=>{
    const text=String(message||'');
    const match=proteinDefaults.find(([rx])=>rx.test(text));
    if(match && /hur mycket/i.test(text)) defaultValue=match[1];
    return originalPrompt(message,defaultValue);
  };

  function selectedItems(){
    return [...document.querySelectorAll('#selectedFoods [data-remove]')].map(b=>{
      const t=(b.textContent||'').replace(/\s*×\s*$/,'').trim();
      const m=t.match(/^(.*?):\s*(.+)$/);
      return m?{food:m[1].trim(),quantity:m[2].trim()}:null;
    }).filter(Boolean);
  }

  document.addEventListener('submit',event=>{
    const form=event.target;if(form?.id!=='mealForm')return;
    const submit=form.querySelector('button[type="submit"]');
    if(submit && /^Spara ändringar/i.test(submit.textContent||'')) return;
    const items=selectedItems();
    if(!items.length)return;
    setTimeout(()=>{
      if(typeof window.malixDeductKitchenItems!=='function')return;
      const result=window.malixDeductKitchenItems(items);
      if(result?.items?.length){
        const saved=document.querySelector('#mealSaved');
        if(saved && result.changed) saved.textContent += ' · Mitt kök uppdaterat ✓';
      }
    },0);
  },true);
})();