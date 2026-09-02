(() => {
  const KEY='malix-smart-kitchen-v1';
  let busy=false;

  function cleanName(value){
    let s=String(value||'').trim();
    if(!s)return s;
    s=s.replace(/^[\s]*(?:ca\.?\s*)?(?:eventuellt\s+|gärna\s+|valfri(?:a)?\s+|lite\s+)*/i,'');
    s=s.replace(/^[\s]*(?:ca\.?\s*)?\d+(?:[.,]\d+)?\s*(?:kg|g|gr|gram|l|liter|dl|ml|cl|msk|tsk|st|styck|stycken|skiva|skivor|burk|burkar|paket|tub|tuber)\b\s*/i,'');
    s=s.replace(/\s*[–—-]\s*(?:tills|efter|för|så att|vid behov|om du vill).*$/i,'');
    s=s.replace(/\s*\([^)]*(?:ca|ungefär|valfri|efter smak|vid behov)[^)]*\)\s*$/i,'');
    s=s.replace(/\s+/g,' ').trim();
    return s||String(value||'').trim();
  }

  function cleanState(){
    if(busy)return;
    let state;try{state=JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return}
    if(!state||typeof state!=='object')return;
    const stock=Array.isArray(state.stock)?state.stock:[];
    const shopping=Array.isArray(state.shopping)?state.shopping:[];
    let changed=false;
    stock.forEach(x=>{const clean=cleanName(x.item);if(clean&&clean!==x.item){x.item=clean;changed=true}});
    shopping.forEach(x=>{const clean=cleanName(x.item);if(clean&&clean!==x.item){x.item=clean;changed=true}});
    if(!changed)return;
    busy=true;
    localStorage.setItem(KEY,JSON.stringify({...state,stock,shopping}));
    busy=false;
    window.malixRenderSmartKitchen?.();
  }

  document.addEventListener('malix-smart-kitchen-updated',()=>setTimeout(cleanState,0));
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',cleanState,{once:true});else cleanState();
})();