(() => {
  const KEY='malix-smart-kitchen-v1';
  const isOil=name=>/olivolja|rapsolja|matolja|solrosolja|olja/i.test(String(name||''));
  const parseAmount=s=>{const m=String(s||'').toLowerCase().replace(',','.').match(/(\d+(?:\.\d+)?)\s*(ml|dl|l|g|kg|st)?/);if(!m)return null;let n=Number(m[1]),u=m[2]||'';if(u==='l'){n*=1000;u='ml'}if(u==='dl'){n*=100;u='ml'}if(u==='kg'){n*=1000;u='g'}return {n,u}};
  const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {stock:[],shopping:[]}}};
  const save=s=>localStorage.setItem(KEY,JSON.stringify(s));

  function normalizeOilStock(){
    const state=load();
    if(!Array.isArray(state.stock)) return true;
    let changed=false;
    for(const item of state.stock){
      if(!isOil(item.item)) continue;
      const amount=parseAmount(item.amount);
      if(amount && (amount.u==='ml'||amount.u==='g')) continue;
      const bottle=prompt(`${item.item} är registrerad som ${item.amount||'1 st'}.\nHur mycket finns i flaskan just nu?`, '500 ml');
      if(bottle===null) return false;
      const parsed=parseAmount(bottle);
      if(!parsed || !['ml','g'].includes(parsed.u) || parsed.n<=0){
        alert('Skriv mängden som till exempel 500 ml eller 450 g.');
        return false;
      }
      item.amount=`${parsed.n} ${parsed.u}`;
      changed=true;
    }
    if(changed){save(state);window.malixRenderSmartKitchen?.();}
    return true;
  }

  function install(){
    const original=window.malixCookRecipeFromKitchen;
    if(typeof original!=='function'||original.__oilStockWrapped) return false;
    const wrapped=function(recipe){
      if(!normalizeOilStock()) return;
      return original(recipe);
    };
    wrapped.__oilStockWrapped=true;
    window.malixCookRecipeFromKitchen=wrapped;
    return true;
  }

  if(!install()){
    let tries=0;
    const timer=setInterval(()=>{tries++;if(install()||tries>40)clearInterval(timer)},100);
  }
})();