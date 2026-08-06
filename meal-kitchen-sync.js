(() => {
  const KITCHEN_KEY='malix-smart-kitchen-v1';
  const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zåäö0-9 ]/gi,' ').replace(/\s+/g,' ').trim();
  const aliases={
    'ostskiva':['ost'], 'brödskiva':['bröd'], 'rostat bröd':['bröd'], 'knäckebröd':['knäckebröd'],
    'filmjölk':['filmjölk','fil'], 'turkisk yoghurt':['turkisk yoghurt','yoghurt'], 'müsli':['müsli'],
    'cornflakes':['cornflakes'], 'havrefras':['havrefras'], 'granola':['granola'], 'ägg':['ägg'],
    'kvarg':['kvarg'], 'yoghurt':['yoghurt'], 'mjölk':['mjölk'], 'kaffe':['kaffe'], 'te':['te'],
    'banan':['banan'], 'äpple':['äpple'], 'päron':['päron'], 'apelsin':['apelsin'], 'bär':['bär'],
    'tomat':['tomat'], 'gurka':['gurka'], 'paprika':['paprika'], 'sallad':['sallad'], 'avokado':['avokado'], 'rödlök':['rödlök']
  };
  function parseAmount(s){
    const m=String(s||'').toLowerCase().replace(',','.').match(/(\d+(?:\.\d+)?)\s*(kg|g|dl|ml|l|st|stycken|skiva|skivor|kopp|koppar|portion|portioner)?/);
    if(!m)return null;let n=Number(m[1]),u=m[2]||'';
    if(u==='kg'){n*=1000;u='g'};if(u==='l'){n*=1000;u='ml'};if(u==='dl'){n*=100;u='ml'};
    if(['stycken','skiva','skivor','portion','portioner'].includes(u))u='st';
    if(['kopp','koppar'].includes(u))u='ml',n*=200;
    return {n,u};
  }
  function formatAmount(a){if(a.u==='ml'&&a.n>=1000)return `${Math.round(a.n/10)/100} l`;if(a.u==='g'&&a.n>=1000)return `${Math.round(a.n/10)/100} kg`;return `${Math.max(0,Math.round(a.n*100)/100)} ${a.u}`.trim()}
  function load(){try{const s=JSON.parse(localStorage.getItem(KITCHEN_KEY)||'{}');return {stock:Array.isArray(s.stock)?s.stock:[],shopping:Array.isArray(s.shopping)?s.shopping:[]}}catch{return {stock:[],shopping:[]}}}
  function save(s){localStorage.setItem(KITCHEN_KEY,JSON.stringify(s));}
  function matches(stockName,food){const sn=norm(stockName),fn=norm(food),candidates=aliases[fn]||[fn];return candidates.some(a=>sn.includes(norm(a))||norm(a).includes(sn));}
  function convertForFood(food,have,used){
    if(have.u===used.u)return used;
    const f=norm(food);
    // Practical kitchen approximation for thick dairy: 1 ml ≈ 1 g.
    if(/kvarg|yoghurt|filmjolk|turkisk yoghurt/.test(f)){
      if(have.u==='g'&&used.u==='ml')return {n:used.n,u:'g'};
      if(have.u==='ml'&&used.u==='g')return {n:used.n,u:'ml'};
    }
    // Milk is commonly stored/logged by volume only; do not guess other conversions.
    return null;
  }
  function deduct(items){
    const st=load(); if(!st.stock.length||!items.length)return;
    let changed=false;
    items.forEach(({food,quantity})=>{
      const stock=st.stock.find(x=>matches(x.item,food)); if(!stock)return;
      const have=parseAmount(stock.amount),rawUsed=parseAmount(quantity); if(!have||!rawUsed)return;
      const used=convertForFood(food,have,rawUsed);if(!used)return;
      const remain=Math.max(0,have.n-used.n); stock.amount=formatAmount({n:remain,u:have.u}); changed=true;
      if(remain<=0){
        st.shopping.push({id:Date.now()+Math.random(),item:stock.item,done:false,source:'Tog slut när måltiden loggades',category:'🥫 Skafferi & övrigt'});
        st.stock=st.stock.filter(x=>x.id!==stock.id);
      }
    });
    if(changed){save(st);window.malixRenderSmartKitchen?.();}
  }
  document.addEventListener('submit',event=>{
    const form=event.target;if(form?.id!=='mealForm')return;
    const submit=form.querySelector('button[type="submit"]');
    if(submit&&/^Spara ändringar/i.test(submit.textContent||'')) return;
    const chips=[...document.querySelectorAll('#selectedFoods [data-remove]')];
    const items=chips.map(b=>{
      const t=(b.textContent||'').replace(/\s*×\s*$/,'').trim();
      const m=t.match(/^(.*?):\s*(.+)$/);return m?{food:m[1].trim(),quantity:m[2].trim()}:null;
    }).filter(Boolean);
    setTimeout(()=>deduct(items),0);
  },true);
})();