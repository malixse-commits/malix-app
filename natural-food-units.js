(() => {
  const gramFoods=/kaviar|messmör|mjukost|färskost|leverpastej|hummus|jordnötssmör|marmelad|sylt|honung|brie|ost(?!skiva)|skinka|kalkon|salami|makrill|kyckling|köttfärs|\bkött\b|\bfisk\b|lax|torsk|sej|tofu|bönor|linser|kvarg/i;
  const liquidFoods=/mjölk|filmjölk|yoghurt|grädde|juice|olja/i;
  const pieceFoods=/ägg|banan|äpple|päron|apelsin|avokado|tomat|paprika|potatis/i;
  const breadFoods=/brödskiva|rostat bröd|knäckebröd|\bbröd\b|limpa/i;
  const defaults=[
    [/kaviar/i,'15 g'],[/messmör/i,'15 g'],[/mjukost/i,'15 g'],[/färskost/i,'20 g'],[/leverpastej/i,'20 g'],[/hummus/i,'30 g'],[/jordnötssmör/i,'15 g'],[/marmelad|sylt|honung/i,'15 g'],[/brie/i,'30 g'],[/ostskiva/i,'1 skiva'],[/skinka|kalkon|salami/i,'30 g'],[/makrill/i,'60 g'],[/kvarg/i,'200 g'],[/mjölk|filmjölk|yoghurt/i,'200 ml'],[/juice/i,'200 ml'],[/ägg/i,'1 st'],[/banan|äpple|päron|apelsin/i,'1 st'],[/kyckling|köttfärs|\bkött\b|\bfisk\b|lax|torsk|sej|tofu|bönor|linser/i,'150 g']
  ];
  const originalPrompt=window.prompt.bind(window);
  window.prompt=(message,defaultValue)=>{
    const text=String(message||'');
    if(/hur mycket/i.test(text)){
      const d=defaults.find(([rx])=>rx.test(text));
      if(d)defaultValue=d[1];
      if(breadFoods.test(text))defaultValue=/köpte du/i.test(text)?'20 skivor':'1 skiva';
    }
    return originalPrompt(message,defaultValue);
  };
  function setup(){
    const form=document.querySelector('#stockForm');if(!form||form.dataset.naturalUnits==='1')return;
    const item=form.querySelector('[name="item"]'),amount=form.querySelector('[name="amount"]');if(!item||!amount)return;
    item.addEventListener('input',()=>{
      const v=item.value;
      if(breadFoods.test(v)){amount.placeholder='t.ex. 20 skivor';if(!amount.value)amount.value='20 skivor';}
      else if(gramFoods.test(v)){amount.placeholder='t.ex. 300 g';if(!amount.value)amount.value='300 g';}
      else if(liquidFoods.test(v)){amount.placeholder='t.ex. 1000 ml';if(!amount.value)amount.value='1000 ml';}
      else if(pieceFoods.test(v)){amount.placeholder='t.ex. 6 st';if(!amount.value)amount.value='6 st';}
    });
    form.dataset.naturalUnits='1';
  }
  setup();document.addEventListener('click',()=>setTimeout(setup,0),true);
})();