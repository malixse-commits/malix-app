(() => {
  const profiles = [
    {keys:['havregryn','müsli','overnight oats'],kcal:370,unit:'100g',vit:['järn','magnesium','B1']},
    {keys:['brödskiva','knäckebröd','rostat bröd','smörgås','bröd'],kcal:250,unit:'100g',vit:['B-vitaminer','järn']},
    {keys:['mjölk'],kcal:47,unit:'100ml',vit:['kalcium','B12','B2']},
    {keys:['filmjölk','yoghurt'],kcal:60,unit:'100ml',vit:['kalcium','B12','B2']},
    {keys:['kvarg'],kcal:70,unit:'100g',vit:['kalcium','B12']},
    {keys:['ost','brie','mjukost','färskost'],kcal:330,unit:'100g',vit:['kalcium','B12']},
    {keys:['ägg'],kcal:75,unit:'piece',vit:['D-vitamin','B12','selen']},
    {keys:['kaviar'],kcal:300,unit:'100g',vit:['B12','D-vitamin']},
    {keys:['leverpastej'],kcal:270,unit:'100g',vit:['järn','A-vitamin','B12']},
    {keys:['makrill'],kcal:210,unit:'100g',vit:['D-vitamin','B12','omega-3']},
    {keys:['fisk','lax','torsk','fiskpanett'],kcal:170,unit:'100g',vit:['D-vitamin','B12','selen','omega-3']},
    {keys:['kyckling'],kcal:165,unit:'100g',vit:['B6','niacin','selen']},
    {keys:['köttfärs','kött'],kcal:210,unit:'100g',vit:['järn','B12','zink']},
    {keys:['bön','linser','kikärt','hummus'],kcal:125,unit:'100g',vit:['folat','järn','magnesium']},
    {keys:['tofu'],kcal:130,unit:'100g',vit:['järn','kalcium']},
    {keys:['potatis'],kcal:80,unit:'100g',vit:['C-vitamin','kalium','B6']},
    {keys:['ris'],kcal:130,unit:'100g',vit:['B-vitaminer']},
    {keys:['pasta'],kcal:150,unit:'100g',vit:['B-vitaminer']},
    {keys:['banan'],kcal:105,unit:'piece',vit:['kalium','B6']},
    {keys:['äpple','päron','apelsin','frukt'],kcal:70,unit:'piece',vit:['C-vitamin']},
    {keys:['bär'],kcal:50,unit:'100g',vit:['C-vitamin','folat']},
    {keys:['tomat','gurka','paprika','sallad','morot','broccoli','blomkål','kål','spenat','ärtor','majs','zucchini','aubergine','selleri','rödbet','avokado','lök','vitlök','purjolök','grönsak'],kcal:35,unit:'100g',vit:['C-vitamin','folat','kalium']}
  ];
  const weights={
    'brödskiva':35,'knäckebröd':12,'rostat bröd':35,'ostskiva':15,'kaviar':15,'leverpastej':20,'makrill i tomatsås':40,'salami':15,'mjukost':20,'färskost':20,'ägg':1,'banan':1,'äpple':1,'päron':1,'apelsin':1
  };
  function num(q){const m=String(q||'').replace(',','.').match(/\d+(?:\.\d+)?/);return m?Number(m[0]):1}
  function amount(food,q,profile){const s=String(q||'').toLowerCase(),n=num(s),f=food.toLowerCase();if(profile.unit==='piece')return n;if(s.includes('dl'))return n*100;if(s.includes('ml'))return n;if(s.includes('kg'))return n*1000;if(s.includes(' g'))return n;if(s.includes('st'))return profile.unit==='piece'?n:n*(weights[f]||80);if(s.includes('skiva'))return n*(weights[f]||30);if(s.includes('kopp'))return n*200;if(s.includes('portion'))return profile.unit==='piece'?n: n*(weights[f]||150);return profile.unit==='piece'?n:n*(weights[f]||100)}
  function parse(meal){const parts=String(meal.food||'').split(/,\s*/).filter(Boolean);return parts.map(part=>{const m=part.match(/^(.*?)\s*\((.*?)\)$/);return {food:(m?m[1]:part).trim(),q:(m?m[2]:meal.portion||'1 portion').trim()}})}
  function profileFor(food){const f=food.toLowerCase();return profiles.find(p=>p.keys.some(k=>f.includes(k)))}
  function summarize(meals){let kcal=0,matched=0,total=0;const micros=new Map();meals.flatMap(parse).forEach(item=>{total++;const p=profileFor(item.food);if(!p)return;matched++;const a=amount(item.food,item.q,p);kcal += p.unit==='piece'?p.kcal*a:p.kcal*a/100;p.vit.forEach(v=>micros.set(v,(micros.get(v)||0)+1))});return {kcal:Math.round(kcal/10)*10,matched,total,micros:[...micros.entries()].sort((a,b)=>b[1]-a[1]).map(x=>x[0])}}
  function render(){const key=window.malixOverviewKey?.() || window.malixLocalDateKey?.(new Date());let meals=[];try{const all=JSON.parse(localStorage.getItem('malix-meals')||'[]');meals=all.filter(m=>(window.malixMealDateKey?.(m)||'')===key)}catch{}const energy=document.querySelector('#energySummary'),vit=document.querySelector('#vitaminSummary');if(!energy||!vit)return;if(!meals.length){energy.textContent='Ingen mat loggad ännu';vit.textContent='Ingen mat loggad ännu';return}const s=summarize(meals);energy.textContent=s.matched?`≈ ${s.kcal} kcal från det som kunnat beräknas`:'Mängderna går ännu inte att beräkna';vit.textContent=s.micros.length?`${s.micros.slice(0,6).join(' · ')}${s.matched<s.total?' · delvis beräknat':''}`:'Ingen tydlig vitamin/mineralkälla kunde beräknas';energy.title='Ungefärlig energi. Värdet beror på angivna mängder och generella livsmedelsvärden.';vit.title='Översikten visar näringsämnen som typiskt finns i de loggade livsmedlen. Den är inte en exakt näringsanalys.'}
  window.malixNutritionSummaryForMeals=summarize;
  document.addEventListener('malix-day-changed',()=>setTimeout(render,0));document.addEventListener('malix-log-date-changed',()=>setTimeout(render,0));window.addEventListener('storage',render);window.malixRenderNutritionSummary=render;setTimeout(render,0);
})();