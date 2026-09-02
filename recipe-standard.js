(() => {
  if (typeof recipes === 'undefined' || !Array.isArray(recipes)) return;

  const detailed = {
    'kycklinggryta-curry': {
      servings:4, prepTime:15, cookTime:25, time:40, equipment:['skärbräda','kniv','stor stekpanna eller gryta','kastrull med lock till riset','mått'],
      ingredients:['600 g kycklingfilé','1 st gul lök','1 st röd paprika','1 msk rapsolja','2 tsk curry','1 st kycklingbuljongtärning','1 dl vatten','3 dl matlagningsgrädde','0,5 tsk salt','0,25 tsk svartpeppar','3 dl okokt ris','6 dl vatten till riset','0,5 tsk salt till riset'],
      steps:['Mät upp alla ingredienser. Skala löken. Skär löken i små bitar och paprikan i cirka 2 cm stora bitar.','Skär kycklingen i cirka 2–3 cm stora bitar. Tvätta händer, kniv och skärbräda efter att du hanterat rå kyckling.','Koka riset: häll 3 dl ris, 6 dl vatten och 0,5 tsk salt i en kastrull. Koka upp. Sänk till låg värme, lägg på lock och låt sjuda enligt tiden på risförpackningen, oftast 15–20 minuter.','Värm en stor stekpanna eller gryta på medelvärme. Häll i 1 msk olja. Lägg i kycklingen och stek 5–7 minuter. Rör några gånger så att bitarna får färg runt om.','Lägg i lök och paprika. Stek ytterligare 3 minuter under omrörning.','Strö över 2 tsk curry och rör runt i cirka 30 sekunder så att kryddan blandas med kycklingen och grönsakerna.','Smula ner 1 buljongtärning. Häll i 1 dl vatten och 3 dl matlagningsgrädde. Rör om.','Låt grytan koka upp försiktigt. Sänk till låg–medelvärme och låt sjuda utan lock 8–10 minuter. Rör någon gång.','Kontrollera en av de största kycklingbitarna. Den ska vara helt genomlagad utan rå kärna. Har du termometer ska kycklingen nå minst 72 °C i mitten.','Smaka av med cirka 0,5 tsk salt och 0,25 tsk svartpeppar. Servera grytan med det kokta riset.'],
      doneness:'Kycklingen ska vara helt genomlagad. Med termometer: minst 72 °C i den tjockaste biten.', heat:'Spis: medelvärme vid stekning, låg–medelvärme när grytan sjuder.'
    },
    'lasagne': {
      servings:4, prepTime:25, cookTime:40, time:65, oven:'200 °C över-/undervärme', equipment:['skärbräda','kniv','stor stekpanna','2 kastruller','visp','ugnsform cirka 20 × 30 cm','mått'],
      ingredients:['500 g nötfärs eller blandfärs','1 st gul lök','2 st vitlöksklyftor','1 msk rapsolja','500 g krossade tomater','2 msk tomatpuré','1 tsk torkad oregano','1 tsk salt','0,5 tsk svartpeppar','9 st lasagneplattor','5 dl mjölk','3 msk vetemjöl','3 msk smör','0,5 tsk salt till såsen','150 g riven ost'],
      steps:['Sätt ugnen på 200 °C över-/undervärme. Placera ett galler i mitten av ugnen.','Skala och hacka löken fint. Skala och finhacka eller pressa vitlöken.','Värm en stor stekpanna på medel–hög värme. Häll i oljan och stek färsen 5–7 minuter. Dela färsen med en stekspade tills den är smulig och inte längre rå.','Tillsätt gul lök och vitlök. Stek 2–3 minuter. Rör ner tomatpuré och stek 30 sekunder.','Häll i krossade tomater. Tillsätt oregano, 1 tsk salt och svartpeppar. Sänk värmen och låt köttfärssåsen sjuda 10 minuter.','Gör den vita såsen: smält smöret i en kastrull på medelvärme. Vispa ner mjölet. Häll i mjölken lite i taget under ständig vispning. Låt såsen sjuda 3–5 minuter tills den tjocknar. Tillsätt 0,5 tsk salt.','Lägg ett tunt lager köttfärssås i botten av formen. Lägg på lasagneplattor, mer köttfärssås och vit sås. Fortsätt i lager. Avsluta med vit sås och riven ost.','Grädda mitt i ugnen cirka 30–35 minuter. Lasagnen är klar när den bubblar, osten fått färg och en kniv går lätt genom plattorna.','Ta ut formen och låt lasagnen vila 5–10 minuter innan du skär upp den.'],
      doneness:'Lasagneplattorna ska vara mjuka och såsen ska bubbla. Osten ska ha fått färg.'
    },
    'kottfärssås': {
      servings:4, prepTime:10, cookTime:30, time:40, equipment:['skärbräda','kniv','rivjärn','stor stekpanna eller gryta','kastrull till pasta','mått'],
      ingredients:['500 g nötfärs eller blandfärs','1 st gul lök','2 st vitlöksklyftor','1 st morot','1 msk rapsolja','2 msk tomatpuré','500 g krossade tomater','1 dl vatten','1 st köttbuljongtärning','1 tsk torkad oregano','0,5 tsk salt','0,25 tsk svartpeppar','320 g pasta','3 l vatten till pastan','1 msk salt till pastavattnet'],
      steps:['Skala löken och moroten. Hacka löken fint, riv moroten grovt och finhacka eller pressa vitlöken.','Värm en stor stekpanna eller gryta på medel–hög värme. Häll i oljan. Lägg i färsen och stek 5–7 minuter. Dela den med stekspaden tills den är smulig och genomstekt.','Tillsätt lök och morot. Stek 3 minuter. Tillsätt vitlök och tomatpuré och stek ytterligare 1 minut.','Häll i krossade tomater och 1 dl vatten. Smula ner buljongtärningen. Tillsätt oregano, salt och svartpeppar.','Koka upp, sänk till låg värme och låt såsen sjuda 15–20 minuter utan lock. Rör några gånger.','Koka under tiden upp cirka 3 liter vatten i en stor kastrull. Tillsätt 1 msk salt och 320 g pasta. Koka enligt tiden på förpackningen.','Häll av pastan när den är mjuk men fortfarande har lite tuggmotstånd. Servera med köttfärssåsen.'],
      doneness:'Köttfärsen ska vara helt genomstekt och såsen varm och sammanhängande.'
    },
    'stroganoff': {
      servings:4, prepTime:10, cookTime:20, time:30, equipment:['skärbräda','kniv','stor stekpanna eller gryta','kastrull med lock till ris','mått'],
      ingredients:['500 g falukorv','1 st gul lök','1 msk rapsolja','2 msk tomatpuré','1 tsk dijonsenap','0,25 tsk chiliflakes','1 st köttbuljongtärning','1 dl vatten','3 dl matlagningsgrädde','0,25 tsk svartpeppar','3 dl okokt ris','6 dl vatten till riset','0,5 tsk salt till riset'],
      steps:['Skala och hacka löken. Skär falukorven i stavar, ungefär 1 cm tjocka.','Koka riset: lägg ris, vatten och salt i en kastrull. Koka upp, sänk till låg värme och låt sjuda under lock enligt förpackningen.','Värm en stor stekpanna eller gryta på medelvärme. Häll i oljan och stek korven 4–5 minuter tills den fått lite färg.','Tillsätt löken och stek 3 minuter tills den börjar mjukna.','Rör ner tomatpuré, dijonsenap och chiliflakes. Stek under omrörning cirka 30 sekunder.','Smula ner buljongtärningen. Häll i vatten och grädde och rör om.','Koka upp försiktigt. Sänk värmen och låt stroganoffen sjuda 8–10 minuter. Rör någon gång.','Smaka av med svartpeppar. Servera med riset.'],
      doneness:'Såsen ska vara varm och lätt krämig och korven genomvarm.'
    },
    'kottbullar': {
      servings:4, prepTime:20, cookTime:30, time:50, oven:'225 °C över-/undervärme om du väljer ugn', equipment:['stor skål','skärbräda','kniv','stekpanna eller ugnsplåt','kastrull till potatis','mått'],
      ingredients:['500 g nötfärs eller blandfärs','1 st gul lök','1 st ägg','0,75 dl ströbröd','1,5 dl mjölk','1 tsk salt','0,5 tsk svartpeppar','1 msk smör eller rapsolja till stekning','800 g potatis','4 dl färdig eller hemlagad gräddsås','250 g gröna ärtor'],
      steps:['Skala potatisen och dela stora potatisar i mindre bitar. Lägg i en kastrull och täck med vatten. Vänta med att starta kokningen tills köttbullarna är formade.','Blanda ströbröd och mjölk i en stor skål. Låt stå 5 minuter.','Skala och finhacka löken. Lägg lök, färs, ägg, salt och peppar i skålen. Blanda tills smeten precis blivit jämn.','Fukta händerna med kallt vatten och forma cirka 24 lika stora köttbullar.','Koka potatisen: koka upp, sänk till medelvärme och koka cirka 15–20 minuter tills en liten kniv går lätt igenom.','Stekpanna: värm smör eller olja på medelvärme. Stek köttbullarna i omgångar cirka 8–10 minuter och vänd dem ofta. De ska vara helt genomlagade. Alternativt: lägg dem på plåt och tillaga mitt i ugnen på 225 °C cirka 12–15 minuter.','Värm såsen och ärtorna enligt förpackningen eller ditt såsrecept.','Kontrollera en stor köttbulle. Den ska vara helt genomlagad. Med termometer ska färsrätter nå minst 70 °C i mitten. Servera med potatis, sås och ärtor.'],
      doneness:'Köttbullarna ska vara helt genomlagade. Med termometer: minst 70 °C i mitten.'
    }
  };

  Object.entries(detailed).forEach(([id,data])=>{const r=recipes.find(x=>x.id===id);if(r)Object.assign(r,data,{recipeStandard:2});});

  const oldOpen=window.openRecipe;
  if(typeof oldOpen!=='function'||oldOpen.__beginnerStandard)return;
  function openRecipeStandard(id){
    oldOpen(id);
    const r=recipes.find(x=>x.id===id); const detail=document.querySelector('#recipeDetail .recipe-detail');
    if(!r||!detail)return;
    const h2=detail.querySelector('h2');
    if(h2&&!detail.querySelector('[data-recipe-facts]')){
      const facts=document.createElement('section');facts.className='panel calm';facts.dataset.recipeFacts='1';
      const bits=[r.servings?`🍽️ ${r.servings} portioner`:null,r.prepTime!=null?`🔪 Förberedelse ${r.prepTime} min`:null,r.cookTime!=null?`🔥 Tillagning ${r.cookTime} min`:null,r.time?`⏱️ Totalt cirka ${r.time} min`:null,r.oven?`🌡️ Ugn ${r.oven}`:null,r.heat?`🔥 ${r.heat}`:null].filter(Boolean);
      facts.innerHTML=`<h3>Innan du börjar</h3><p>${bits.join(' · ')}</p>${r.equipment?.length?`<p><strong>Ta fram:</strong> ${r.equipment.join(', ')}.</p>`:''}`;
      h2.insertAdjacentElement('afterend',facts);
    }
    if(r.doneness&&!detail.querySelector('[data-doneness]')){const box=document.createElement('section');box.className='panel calm';box.dataset.doneness='1';box.innerHTML=`<h3>✓ Hur vet jag att det är klart?</h3><p>${r.doneness}</p>`;const cooked=[...detail.querySelectorAll('h3')].find(x=>x.textContent.includes('När maten är lagad'));const panel=cooked?.closest('.panel');if(panel)panel.insertAdjacentElement('beforebegin',box);else detail.appendChild(box);}
    if(!r.recipeStandard&&!detail.querySelector('[data-recipe-draft]')){const note=document.createElement('div');note.className='note';note.dataset.recipeDraft='1';note.innerHTML='<strong>Receptet håller på att förtydligas.</strong> Det finns i receptbanken, men mängder och steg är ännu inte genomgångna enligt den nya receptstandarden.';h2?.insertAdjacentElement('afterend',note);}
  }
  openRecipeStandard.__beginnerStandard=true;
  window.openRecipe=openRecipeStandard;
})();