(() => {
  const KITCHEN_KEY='malix-smart-kitchen-v1';
  const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
  const aliases={
    'ostskiva':['ost','ostskiva'], 'brieost':['brieost','brie','brie ost'], 'brie':['brieost','brie','brie ost'], 'skinka':['skinka'], 'kalkon':['kalkon'], 'salami':['salami'], 'makrill i tomatsas':['makrill','makrill i tomatsas'],
    'brodskiva':['brod'], 'rostat brod':['brod'], 'knackebrod':['knackebrod','brod'],
    'filmjolk':['filmjolk','fil'], 'turkisk yoghurt':['turkisk yoghurt','yoghurt'], 'musli':['musli'],
    'cornflakes':['cornflakes'], 'havrefras':['havrefras'], 'granola':['granola'], 'agg':['agg'],
    'kvarg':['kvarg'], 'yoghurt':['yoghurt'], 'mjolk':['mjolk'], 'kaffe':['kaffe'], 'te':['te'],
    'banan':['banan'], 'apple':['apple'], 'paron':['paron'], 'apelsin':['apelsin'], 'bar':['bar'],
    'tomat':['tomat'], 'gurka':['gurka'], 'paprika':['paprika'], 'sallad':['sallad'], 'avokado':['avokado'], 'rodlok':['rodlok'],
    'kyckling':['kyckling','kycklingfile','kycklingfilé'], 'fisk':['fisk','fiskfile','fiskfilé','torsk','lax','sej'],
    'kott':['kott','notkott','flaskkott'], 'kottfars':['kottfars','fars'], 'tofu':['tofu'], 'bonor linser':['bonor','linser']
  };
  const sliceWeights={ostskiva:15,skinka:12,kalkon:12,salami:5};
  function parseAmount(s){
    const m=String(s||'').toLowerCase().replace(',','.').match(/(\d+(?:\.\d+)?)\s*(kg|g|dl|ml|l|st|stycken|skiva|skivor|kopp|koppar|portion|portioner)?/);
    if(!m)return null;let n=Number(m[1]),u=m[2]||'';
    if(u==='kg'){n*=1000;u='g'} if(u==='l'){n*=1000;u='ml'} if(u==='dl'){n*=100;u='ml'};
    if(['stycken'].includes(u))u='st';
    if(['skiva','skivor'].includes(u))u='slice';
    if(['kopp','koppar'].includes(u)){u='ml';n*=200}
    return {n,u};
  }
  function formatAmount(a){if(a.u==='ml'&&a.n>=1000)return `${Math.round(a.n/10)/100} l`;if(a.u==='g'&&a.n>=1000)return `${Math.round(a.n/10)/100} kg`;if(a.u==='slice')return `${Math.max(0,Math.round(a.n*100)/100)} skivor`;return `${Math.max(0,Math.round(a.n*100)/100)} ${a.u}`.trim()}
  function load(){try{const s=JSON.parse(localStorage.getItem(KITCHEN_KEY)||'{}');return {stock:Array.isArray(s.stock)?s.stock:[],shopping:Array.isArray(s.shopping)?s.shopping:[]}}catch{return {stock:[],shopping:[]}}}
  function save(s){localStorage.setItem(KITCHEN_KEY,JSON.stringify(s))}
  function matches(stockName,food){const sn=norm(stockName),fn=norm(food),candidates=aliases[fn]||[fn];return candidates.some(a=>{const an=norm(a);return sn===an||sn.includes(an)||an.includes(sn)})}
  function convert(food,have,used){
    if(have.u===used.u)return used;
    const f=norm(food);
    if(/kvarg|yoghurt|filmjolk|turkisk yoghurt/.test(f)){if(have.u==='g'&&used.u==='ml')return {n:used.n,u:'g'};if(have.u==='ml'&&used.u==='g')return {n:used.n,u:'ml'}}
    if(have.u==='g'&&used.u==='slice'&&sliceWeights[f])return {n:used.n*sliceWeights[f],u:'g'};
    if(have.u==='st'&&used.u==='slice'&&/brodskiva|rostat brod|knackebrod/.test(f))return {n:used.n,u:'st'};
    return null;
  }
  function deduct(items){
    const st=load();if(!st.stock.length||!items.length)return {changed:false,items:[]};let changed=false;const results=[];
    items.forEach(({food,quantity})=>{
      const stock=st.stock.find(x=>matches(x.item,food));if(!stock){results.push(`${food}: finns inte i Mitt kök`);return}
      const have=parseAmount(stock.amount),raw=parseAmount(quantity);if(!have||!raw){results.push(`${food}: mängden kunde inte räknas`);return}
      if(raw.u==='portion'||raw.u==='portioner'||!raw.u){results.push(`${food}: ange vikt eller tydlig mängd`);return}
      const used=convert(food,have,raw);if(!used){results.push(`${food}: ${stock.amount} kan inte jämföras med ${quantity}`);return}
      const remain=Math.max(0,have.n-used.n);stock.amount=formatAmount({n:remain,u:have.u});changed=true;results.push(`${food}: ${formatAmount(used)} använt, ${stock.amount} kvar`);
      if(remain<=0){st.shopping.push({id:Date.now()+Math.random(),item:stock.item,done:false,source:'Tog slut när måltiden loggades',category:'🥫 Skafferi & övrigt'});st.stock=st.stock.filter(x=>x.id!==stock.id)}
    });
    if(changed){save(st);window.malixRenderSmartKitchen?.()}return {changed,items:results};
  }
  window.malixDeductKitchenItems=deduct;
})();