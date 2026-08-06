(() => {
  const KITCHEN_KEY='malix-smart-kitchen-v1';
  const proteinDefaults=[[/kyckling/i,'150 g'],[/köttfärs/i,'150 g'],[/\bkött\b/i,'150 g'],[/\bfisk\b/i,'150 g'],[/tofu/i,'150 g'],[/bönor|linser/i,'150 g']];
  const originalPrompt=window.prompt.bind(window);
  window.prompt=(message,defaultValue)=>{const text=String(message||'');const match=proteinDefaults.find(([rx])=>rx.test(text));if(match&&/hur mycket/i.test(text))defaultValue=match[1];return originalPrompt(message,defaultValue)};
  const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
  const aliases={brodskiva:['brod'],'rostat brod':['brod'],'knackebrod':['knackebrod','brod'],'ostskiva':['ost'],'filmjolk':['filmjolk','fil'],'turkisk yoghurt':['turkisk yoghurt','yoghurt'],'kyckling':['kyckling','kycklingfile'],'fisk':['fisk','lax','torsk','sej'],'kottfars':['kottfars','fars'],'kott':['kott'],'makrill i tomatsas':['makrill']};
  function selectedItems(){return [...document.querySelectorAll('#selectedFoods [data-remove]')].map(b=>{const t=(b.textContent||'').replace(/\s*×\s*$/,'').trim();const m=t.match(/^(.*?):\s*(.+)$/);return m?{food:m[1].trim(),quantity:m[2].trim()}:null}).filter(Boolean)}
  function load(){try{const s=JSON.parse(localStorage.getItem(KITCHEN_KEY)||'{}');return {stock:Array.isArray(s.stock)?s.stock:[],shopping:Array.isArray(s.shopping)?s.shopping:[]}}catch{return {stock:[],shopping:[]}}}
  function save(s){localStorage.setItem(KITCHEN_KEY,JSON.stringify(s))}
  function inStock(stock,food){const fn=norm(food),cands=aliases[fn]||[fn];return stock.some(x=>{const sn=norm(x.item);return cands.some(c=>{const cn=norm(c);return sn===cn||sn.includes(cn)||cn.includes(sn)})})}
  function addMissingToShopping(items,mealType){const st=load();let added=0;items.forEach(({food,quantity})=>{if(inStock(st.stock,food))return;const exists=st.shopping.some(x=>!x.done&&norm(x.item)===norm(food));if(exists)return;st.shopping.push({id:Date.now()+Math.random(),item:food,done:false,source:`Behövs till planerad ${String(mealType||'måltid').toLowerCase()} · ${quantity}`,category:'🛒 Planerat'});added++});if(added){save(st);window.malixRenderSmartKitchen?.()}return added}
  document.addEventListener('submit',event=>{
    const form=event.target;if(form?.id!=='mealForm')return;
    const submit=form.querySelector('button[type="submit"]');if(submit&&/^Spara ändringar/i.test(submit.textContent||''))return;
    const items=selectedItems();if(!items.length)return;
    const mealType=form.querySelector('[name="meal"]')?.value||'måltid';
    setTimeout(()=>{
      const added=addMissingToShopping(items,mealType);
      if(typeof window.malixDeductKitchenItems==='function'){
        const result=window.malixDeductKitchenItems(items);
        const saved=document.querySelector('#mealSaved');
        if(saved&&result?.changed)saved.textContent+=' · Mitt kök uppdaterat ✓';
        if(saved&&added)saved.textContent+=` · ${added} sak${added===1?'':'er'} till handlingslistan`;
      }
    },0);
  },true);
})();