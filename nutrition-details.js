(() => {
  if(typeof recipes==='undefined'||!Array.isArray(recipes))return;

  const exactOverrides={
    fiskpanetter:{servings:4,prepTime:10,cookTime:20,equipment:['kastrull med lock','stekpanna eller ugnsplåt','skål','kniv','mått'],ingredients:['8 st fiskpanetter','3 dl okokt ris','2 dl gröna ärtor','1,5 dl majs','1 st röd paprika','2 dl filmjölk','2 msk majonnäs','2 msk bostongurka','2 msk hackad dill','0,5 st citron'],doneness:'Fiskpanetterna ska vara genomvarma och riset mjukt med lite tuggmotstånd.'},
    tzatziki:{servings:6,prepTime:15,cookTime:0,equipment:['rivjärn','sil eller durkslag','skål','mått'],ingredients:['1 kg turkisk yoghurt','1 st gurka','7 st vitlöksklyftor','1 msk olivolja','0,5 tsk salt','0,25 tsk svartpeppar','0,5 st citron – valfritt'],doneness:'Tzatzikin är klar när gurkan är väl avrunnen och allt är jämnt blandat.'},
    fetaostkram:{servings:4,prepTime:10,cookTime:0,equipment:['skål','gaffel','vitlökspress'],ingredients:['2 dl turkisk yoghurt','150 g fetaost','2 st vitlöksklyftor'],doneness:'Krämen ska vara jämn och krämig. Smaka av innan servering.'},
    pannkakor:{servings:4,prepTime:10,cookTime:20,equipment:['skål','visp','stekpanna','mått'],ingredients:['2,5 dl vetemjöl','6 dl mjölk','3 st ägg','0,5 tsk salt','2 msk smör eller olja till stekning'],doneness:'Pannkakorna ska ha stannat helt och fått lätt färg på båda sidor.'},
    'pannkakor-grund':{servings:4,prepTime:10,cookTime:20,equipment:['skål','visp','stekpanna','mått'],ingredients:['2,5 dl vetemjöl','6 dl mjölk','3 st ägg','0,5 tsk salt','2 msk smör eller annat matfett till stekning'],doneness:'Pannkakorna ska ha stannat helt och fått lätt färg på båda sidor.'},
    ugnspannkaka:{servings:4,prepTime:10,cookTime:30,oven:'225 °C över-/undervärme',equipment:['skål','visp','ugnsform cirka 20 × 30 cm','mått'],ingredients:['3 dl vetemjöl','6 dl mjölk','4 st ägg','0,5 tsk salt','1 msk smör till formen','140 g bacon eller 2 st äpplen – valfritt'],doneness:'Ugnspannkakan ska vara genomgräddad, ha stannat i mitten och fått färg.'},
    'ugnspannkaka':{servings:4,prepTime:10,cookTime:30,oven:'225 °C över-/undervärme',equipment:['skål','visp','ugnsform cirka 20 × 30 cm','mått'],ingredients:['3 dl vetemjöl','6 dl mjölk','4 st ägg','0,5 tsk salt','1 msk smör till formen','140 g bacon eller 2 st äpplen – valfritt'],doneness:'Ugnspannkakan ska vara genomgräddad, ha stannat i mitten och fått färg.'},
    'klassisk-chokladpudding':{servings:4,prepTime:5,cookTime:15,equipment:['kastrull','visp','mått','4 portionsskålar'],ingredients:['5 dl mjölk','3 msk kakao','3 msk strösocker','3 msk majsstärkelse','1 tsk vaniljsocker'],doneness:'Puddingen är klar när den har tjocknat jämnt utan klumpar. Den sätter sig mer när den kallnar.'},
    'klassisk-vaniljpudding':{servings:4,prepTime:5,cookTime:15,equipment:['kastrull','visp','mått','4 portionsskålar'],ingredients:['5 dl mjölk','3 msk strösocker','3 msk majsstärkelse','2 tsk vaniljsocker'],doneness:'Puddingen är klar när den har tjocknat jämnt. Den sätter sig mer när den kallnar.'},
    mannagrynspudding:{servings:4,prepTime:15,cookTime:25,oven:'200 °C över-/undervärme',equipment:['kastrull','skål','visp','ugnsform','mått'],ingredients:['5 dl mjölk','0,75 dl mannagryn','2 st ägg','2 msk strösocker','1 tsk vaniljsocker – valfritt','1 tsk smör till formen'],doneness:'Puddingen ska ha stannat i mitten och fått lätt färg.'},
    saffranspannkaka:{servings:6,prepTime:10,cookTime:45,oven:'200 °C över-/undervärme',equipment:['skål','visp','ugnsform','mått'],ingredients:['1 l färdig risgrynsgröt','3 st ägg','2 dl mjölk','0,5 g saffran','2 msk strösocker','0,5 dl hackad mandel – valfritt'],doneness:'Saffranspannkakan ska ha stannat i mitten och fått lätt färg.'},
    risgrynspudding:{servings:4,prepTime:10,cookTime:35,oven:'200 °C över-/undervärme',equipment:['skål','visp','ugnsform','mått'],ingredients:['8 dl färdig risgrynsgröt','2 st ägg','1 dl mjölk','2 msk strösocker','1 tsk vaniljsocker – valfritt'],doneness:'Puddingen ska ha stannat i mitten och fått lätt färg.'},
    'klassisk-chokladpudding':{servings:4,prepTime:5,cookTime:15,equipment:['kastrull','visp','mått','4 portionsskålar'],ingredients:['5 dl mjölk','3 msk kakao','3 msk strösocker','3 msk majsstärkelse','1 tsk vaniljsocker'],doneness:'Puddingen är klar när den har tjocknat jämnt utan klumpar. Den sätter sig mer när den kallnar.'},
    'farmors-appelmos':{servings:4,prepTime:2,cookTime:0,equipment:['4 portionsskålar'],ingredients:['4 dl äppelmos','2 dl ovispad grädde','0,5 tsk kanel'],doneness:'Efterrätten är klar när den är upplagd. Grädden ska vara rinnande, inte vispad.'}
  };

  const hasAmount=s=>/^\s*(?:ca\s*)?\d+(?:[.,]\d+)?\s*(?:kg|g|l|dl|ml|tsk|msk|st|styck|stycken|skiva|skivor|bit|bitar|portion|portioner)?\b/i.test(String(s));
  const lower=s=>String(s||'').toLocaleLowerCase('sv-SE');
  function qty(text,r){
    const s=lower(text),name=lower(r.name),tags=(r.tags||[]).map(lower);
    if(hasAmount(text))return text;
    if(/valfri|valfritt|efter smak|på en höft/.test(s))return `valfri mängd ${text}`;
    if(/salt/.test(s))return `0,5 tsk ${text}`;
    if(/svartpeppar|vitpeppar|peppar/.test(s))return `0,25 tsk ${text}`;
    if(/saffran/.test(s))return `0,5 g ${text}`;
    if(/kanel|oregano|timjan|rosmarin|basilika|curry|spiskummin|paprikapulver|chiliflakes|kryddpeppar/.test(s))return `1 tsk ${text}`;
    if(/dill|persilja|örter/.test(s))return `2 msk ${text}`;
    if(/vitlök/.test(s))return `2 st vitlöksklyftor`;
    if(/gul lök|rödlök|\blök\b/.test(s))return `1 st ${text}`;
    if(/citron|lime/.test(s))return `1 st ${text}`;
    if(/olja/.test(s))return `1 msk ${text}`;
    if(/smör/.test(s))return `1 msk ${text}`;
    if(/tomatpuré/.test(s))return `2 msk ${text}`;
    if(/senap/.test(s))return `1 msk ${text}`;
    if(/majonnäs/.test(s))return `2 msk ${text}`;
    if(/buljongtärning/.test(s))return `1 st ${text}`;
    if(/^buljong$/.test(s)||/\bbuljong\b/.test(s))return `5 dl ${text}`;
    if(/vatten/.test(s))return `5 dl ${text}`;
    if(/grädde|crème fraîche|creme fraiche/.test(s))return `3 dl ${text}`;
    if(/yoghurt|filmjölk|kvarg/.test(s))return `2 dl ${text}`;
    if(/mjölk/.test(s))return `3 dl ${text}`;
    if(/ost|fetaost|halloumi|mozzarella|parmesan|gorgonzola|färskost/.test(s))return `150 g ${text}`;
    if(/ägg/.test(s))return `4 st ${text}`;
    if(/ströbröd|havregryn|müsli|mjölmix|vetemjöl|\bmjöl\b/.test(s))return `1 dl ${text}`;
    if(/ris/.test(s)){if(/kokt|kallt/.test(s))return `6 dl ${text}`;return `3 dl ${text}`}
    if(/pasta|makaron|nudlar|lasagneplattor/.test(s)){if(/kokt|kall/.test(s))return `6 dl ${text}`;return `320 g ${text}`}
    if(/potatismos/.test(s))return `8 dl ${text}`;
    if(/potatis|rotfrukt|kålrot/.test(s))return `800 g ${text}`;
    if(/morot/.test(s))return `300 g ${text}`;
    if(/broccoli|blomkål|spenat|vitkål|grönkål|svartkål|wokgrönsaker|grönsaker/.test(s))return `300 g ${text}`;
    if(/paprika/.test(s))return `2 st ${text}`;
    if(/tomat/.test(s))return `400 g ${text}`;
    if(/gurka/.test(s))return `1 st ${text}`;
    if(/ärtor|majs|bönor|linser|kikärtor/.test(s))return `250 g ${text}`;
    if(/frukt|bär/.test(s))return `300 g ${text}`;
    if(/banan|äpple|päron/.test(s))return `2 st ${text}`;
    if(/kyckling/.test(s))return `600 g ${text}`;
    if(/lax|torsk|sej|vit fisk|fiskfilé|\bfisk\b/.test(s))return `600 g ${text}`;
    if(/räkor|musslor|skaldjur/.test(s))return `400 g ${text}`;
    if(/köttfärs|blandfärs|nötfärs/.test(s))return `500 g ${text}`;
    if(/nötkött|grytbitar|grytkött|fläskkött|kotlett|kassler|kebabkött/.test(s))return `600 g ${text}`;
    if(/falukorv|korv|prinskorv/.test(s))return `500 g ${text}`;
    if(/bröd|tortilla|tacoskal/.test(s))return `4 st ${text}`;
    if(/dressing|sås|tacosås|jordnötssås/.test(s))return `2 dl ${text}`;
    if(/socker/.test(s))return `2 msk ${text}`;
    if(/kakao|majsstärkelse|potatismjöl/.test(s))return `2 msk ${text}`;
    if(/vaniljsocker/.test(s))return `1 tsk ${text}`;
    if(tags.includes('efterrätt'))return `efter smak: ${text}`;
    if(/krydda|smaksättning/.test(s))return `efter smak: ${text}`;
    return `efter behov: ${text}`;
  }

  function equipmentFor(r){
    const n=lower(r.name),t=(r.tags||[]).map(lower);
    if(/slowcooker/.test(n)||t.includes('slowcooker'))return ['slowcooker','skärbräda','kniv','mått'];
    if(/soppa|gryta|kalops|stroganoff|chili/.test(n)||t.includes('gryta')||t.includes('soppa'))return ['stor gryta eller kastrull','skärbräda','kniv','mått'];
    if(/ugn|gratäng|lasagne|paj|pudding|plåt|bakad|sufflé/.test(n))return ['ugnsform eller plåt','skärbräda','kniv','skål','mått'];
    if(/pasta|ris|makaron/.test(n))return ['kastrull','stekpanna eller gryta','skärbräda','kniv','mått'];
    if(/pannkak|omelett|biff|järp|köttbull|pytt|stekt/.test(n))return ['stekpanna','skål','skärbräda','kniv','mått'];
    return ['skärbräda','kniv','skål eller kastrull efter behov','mått'];
  }

  function donenessFor(r){
    const n=lower(r.name),all=lower((r.ingredients||[]).join(' '));
    if(/kyckling/.test(n+' '+all))return 'Kycklingen ska vara helt genomlagad utan rå kärna. Med termometer: minst 72 °C i den tjockaste delen.';
    if(/köttfärs|färs|köttbull|pannbiff|järp|köttfärslimpa/.test(n+' '+all))return 'Färsrätter ska vara helt genomlagade. Med termometer: minst 70 °C i mitten.';
    if(/fisk|lax|torsk|sej/.test(n+' '+all))return 'Fisken ska vara genomlagad och lätt dela sig i flagor. Följ även eventuell anvisning på förpackningen.';
    if(/soppa|gryta|sås|chili|kalops|stroganoff/.test(n))return 'Rätten är klar när den är genomvarm och har den konsistens som beskrivs i stegen.';
    if(/paj|pudding|ugnspannkaka|omelett|lasagne|gratäng/.test(n))return 'Rätten ska ha stannat eller blivit genomvarm i mitten och fått den färg som beskrivs i stegen.';
    return 'Rätten är klar när alla delar är genomlagade eller genomvarma och konsistensen stämmer med stegen.';
  }

  function ovenFor(r){
    const n=lower(r.name);
    if(r.oven)return r.oven;
    if(/sufflé/.test(n))return '175 °C över-/undervärme';
    if(/lasagne|gratäng|pudding|paj|omelett/.test(n))return '200 °C över-/undervärme';
    if(/ugnspannkaka|falukorv|plåt|ugnsbakad/.test(n))return '225 °C över-/undervärme';
    return undefined;
  }

  recipes.forEach(r=>{
    if(r.recipeStandard===2)return;
    const o=exactOverrides[r.id];
    if(o)Object.assign(r,o);
    if(!r.servings)r.servings=(r.tags||[]).includes('efterrätt')?4:4;
    if(r.prepTime==null){r.prepTime=r.time<=15?r.time:Math.max(5,Math.min(20,Math.round((r.time*0.3)/5)*5));}
    if(r.cookTime==null)r.cookTime=Math.max(0,(r.time||r.prepTime)-r.prepTime);
    if(!r.equipment?.length)r.equipment=equipmentFor(r);
    if(!o?.ingredients)r.ingredients=(r.ingredients||[]).map(x=>qty(x,r));
    if(!r.doneness)r.doneness=donenessFor(r);
    if(!r.oven){const oven=ovenFor(r);if(oven)r.oven=oven;}
    r.recipeStandard=2;
  });

  window.malixRecipeStandardInfo={total:recipes.length,standardized:recipes.filter(r=>r.recipeStandard===2).length};
})();

(() => {
  const groups={
    protein:{title:'🥩 Det här gav protein',words:['fisk','lax','torsk','kyckling','kött','köttfärs','ägg','ost','kvarg','yoghurt','filmjölk','mjölk','bön','linser','kikärt','tofu','makrill','leverpastej']},
    fiber:{title:'🥬 Det här gav fiber',words:['havre','müsli','fullkorn','knäckebröd','bön','linser','kikärt','morot','kål','broccoli','ärtor','majs','paprika','frukt','äpple','päron','banan','bär','potatis','grönsak']},
    produce:{title:'🥦 Frukt & grönt du loggat',words:['morot','kål','broccoli','ärtor','majs','paprika','tomat','gurka','sallad','spenat','lök','rödlök','vitlök','purjolök','avokado','zucchini','aubergine','svamp','blomkål','selleri','äpple','päron','banan','bär','frukt','citron','rödbet','palsternack','potatis']},
    plants:{title:'🌈 Växter i dagens variation',words:['morot','vitkål','kål','broccoli','ärtor','majs','paprika','tomat','gurka','sallad','spenat','lök','rödlök','vitlök','purjolök','avokado','zucchini','aubergine','svamp','blomkål','selleri','äpple','päron','banan','bär','citron','rödbeta','palsternacka','potatis','ris','havre','bönor','linser','kikärtor','dill','rosmarin','timjan','chili']}
  };
  const micro={mjölk:['kalcium','B12'],filmjölk:['kalcium','B12'],yoghurt:['kalcium','B12'],kvarg:['kalcium','B12'],ost:['kalcium','B12'],ägg:['D-vitamin','B12','selen'],makrill:['D-vitamin','B12','omega-3'],fisk:['D-vitamin','B12','selen'],lax:['D-vitamin','B12','omega-3'],kött:['järn','B12','zink'],köttfärs:['järn','B12','zink'],leverpastej:['järn','A-vitamin','B12'],havregryn:['järn','magnesium','B1'],müsli:['järn','magnesium','B1'],bönor:['folat','järn','magnesium'],linser:['folat','järn','magnesium'],potatis:['C-vitamin','kalium','B6'],banan:['kalium','B6'],bär:['C-vitamin','folat'],paprika:['C-vitamin','folat'],broccoli:['C-vitamin','folat'],spenat:['folat','järn']};
  function meals(){const key=window.malixOverviewKey?.();try{return JSON.parse(localStorage.getItem('malix-meals')||'[]').filter(m=>(window.malixMealDateKey?.(m)||'')===key)}catch{return[]}}
  function foods(){return meals().flatMap(m=>String(m.food||'').split(/,\s*/)).map(x=>x.replace(/\s*\(.*?\)\s*$/,'').trim()).filter(Boolean)}
  function unique(a){return [...new Set(a)]}
  function sources(type){const fs=foods();if(type==='vitamins')return fs.map(food=>{const f=food.toLowerCase();const k=Object.keys(micro).find(k=>f.includes(k));return k?`${food} → ${micro[k].join(', ')}`:null}).filter(Boolean);const g=groups[type];return unique(fs.filter(food=>g.words.some(w=>food.toLowerCase().includes(w))))}
  function ensureBox(){let box=document.querySelector('#nutritionDetailBox');if(box)return box;const dash=document.querySelector('.dashboard-panel');if(!dash)return null;box=document.createElement('div');box.id='nutritionDetailBox';box.className='note';box.hidden=true;dash.appendChild(box);return box}
  function showDetail(type){const box=ensureBox();if(!box)return;const list=sources(type);const title=type==='vitamins'?'💊 Varifrån vitaminerna & mineralerna kommer':groups[type].title;box.hidden=false;box.innerHTML=`<strong>${title}</strong>${list.length?`<ul>${list.map(x=>`<li>${x}</li>`).join('')}</ul>`:'<p>Jag hittar ännu ingen tydlig källa i det som är loggat.</p>'}<small>Översikten bygger på det du själv har loggat och är till för att visa var näringen kommer ifrån, inte för att sätta betyg på måltiden.</small>`;box.scrollIntoView({behavior:'smooth',block:'nearest'});}
  function wire(){const map={proteinSummary:'protein',fiberSummary:'fiber',produceSummary:'produce',plantSummary:'plants',vitaminSummary:'vitamins'};Object.entries(map).forEach(([id,type])=>{const strong=document.querySelector('#'+id);const card=strong?.closest('.summary-card');if(!card||card.dataset.explainable)return;card.dataset.explainable='true';card.tabIndex=0;card.setAttribute('role','button');card.setAttribute('aria-label',`Visa vad som bidrog till ${type}`);const hint=document.createElement('small');hint.className='nutrition-more';hint.textContent='Se vad som bidrog ›';card.appendChild(hint);card.addEventListener('click',()=>showDetail(type));card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();showDetail(type)}});});}
  document.addEventListener('malix-day-changed',()=>setTimeout(wire,0));wire();
  if(!document.querySelector('script[data-water-tracker]')){const s=document.createElement('script');s.src='water-tracker.js';s.dataset.waterTracker='1';document.body.appendChild(s)}
})();