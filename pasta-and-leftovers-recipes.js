(() => {
  if (typeof recipes === 'undefined' || !Array.isArray(recipes)) return;

  const add = recipe => {
    if (!recipes.some(r => r.id === recipe.id)) recipes.push(recipe);
  };

  // Pasta blir en sökbar kategori genom gemensam tagg. Recepten är vardagsversioner
  // och kan senare finjusteras utan att navigationen behöver ändras.
  [
    {
      id:'carbonara', name:'Pasta carbonara', emoji:'🍝', time:25, budget:'medium',
      tags:['pasta','snabbt','vardag'], plants:1,
      ingredients:['pasta','bacon eller pancetta','ägg','parmesan','svartpeppar'], leftovers:['bacon'],
      tip:'Spara lite pastavatten och använd för att få såsen blank och krämig.',
      serving:'Gott med extra parmesan, vitt bröd och något grönt vid sidan.',
      swaps:'Bacon kan bytas mot annan rökt/skivad rest som passar. Parmesan kan bytas mot annan lagrad hårdost.',
      steps:['Koka pastan.','Stek bacon/pancetta.','Vispa ihop ägg, parmesan och svartpeppar.','Vänd ner varm pasta och bacon. Ta från värmen och rör ner äggblandningen. Späd försiktigt med lite pastavatten.']
    },
    {
      id:'pastamexicana', name:'Pasta Mexicana', emoji:'🌶️', time:30, budget:'medium',
      tags:['pasta','mexicana','vardag'], plants:4,
      ingredients:['pasta','köttfärs eller färs du har','lök','tomat','majs','mexikanska kryddor','ost'], leftovers:['köttfärs','majs'],
      tip:'Bra rätt för små rester av majs, paprika, bönor eller färs.',
      serving:'Servera gärna med tomat, majs, avokado eller bröd efter vad som finns hemma.',
      swaps:'Färsen kan bytas mot bönor eller annan färs. Lägg gärna i paprika eller andra grönsaksrester.',
      steps:['Koka pastan.','Stek lök och färs.','Tillsätt tomat, majs och kryddor och låt puttra.','Blanda med pastan och toppa med ost.']
    },
    {
      id:'fruttidimare', name:'Pasta Frutti di mare', emoji:'🦐', time:30, budget:'medium',
      tags:['pasta','fisk','skaldjur'], plants:3,
      ingredients:['pasta','blandade skaldjur','vitlök','tomat','olivolja','persilja','citron'], leftovers:[],
      tip:'Skaldjuren behöver bara bli varma så att de inte tillagas för länge.',
      serving:'Citron, persilja, vitt bröd och en enkel sallad passar bra till.',
      swaps:'Använd den blandning av skaldjur du har. Tomat kan vara färsk eller från burk.',
      steps:['Koka pastan.','Fräs vitlök försiktigt i olja och tillsätt tomat.','Vänd ner skaldjuren mot slutet.','Blanda med pasta och avsluta med persilja och citron.']
    },
    {
      id:'pastamurklor', name:'Pasta à la murklor', emoji:'🍄', time:30, budget:'medium',
      tags:['pasta','svamp','krämigt'], plants:2,
      ingredients:['pasta','förvällda/tillagade murklor','lök','grädde','parmesan','svartpeppar'], leftovers:['svamp'],
      tip:'Använd endast murklor som är korrekt förberedda för matlagning.',
      serving:'Parmesan och något grönt vid sidan passar bra. Stekt grönkål eller svartkål kan vara ett alternativ.',
      swaps:'Murklor kan bytas mot annan matsvamp. Grädde kan anpassas efter vad du brukar använda.',
      steps:['Koka pastan.','Fräs lök och de färdigförberedda murklorna.','Tillsätt grädde och låt såsen gå ihop.','Vänd ner pastan och avsluta med parmesan och svartpeppar.']
    },
    {
      id:'pastacapri', name:'Pasta Capri', emoji:'🍅', time:20, budget:'low',
      tags:['pasta','vegetariskt','snabbt'], plants:4,
      ingredients:['pasta','tomat','mozzarella','basilika','olivolja','svartpeppar'], leftovers:['tomat'],
      tip:'En enkel pasta där tomat, mozzarella och basilika får vara huvudsmakerna.',
      serving:'Ruccola, vitt bröd eller extra tomat passar fint till.',
      swaps:'Mozzarella kan bytas mot annan mild ost. Basilika kan ersättas med andra örter du tycker om.',
      steps:['Koka pastan.','Dela tomat och mozzarella.','Vänd ihop varm pasta med tomat, olivolja och basilika.','Lägg i mozzarella sist och krydda.']
    },
    {
      id:'kasslergorgonzolapasta', name:'Pasta med kassler och gorgonzola', emoji:'🧀', time:30, budget:'medium',
      tags:['pasta','krämigt','vardag'], plants:2,
      ingredients:['pasta','kassler','lök','gorgonzola','grädde','svartpeppar'], leftovers:['kassler'],
      tip:'Smaka innan du saltar – både kassler och gorgonzola ger mycket sälta.',
      serving:'Något grönt passar bra till, till exempel stekt grönkål eller svartkål.',
      swaps:'Kassler kan bytas mot en lämplig köttrest. Gorgonzola kan bytas mot annan smakrik ost.',
      steps:['Koka pastan.','Fräs lök och kassler.','Tillsätt grädde och gorgonzola och låt osten smälta.','Vänd ner pastan och krydda med svartpeppar.']
    },
    {
      id:'pastatomatsasmalix', name:'Pasta med Tomatsås à la Malix', emoji:'🍅', time:25, budget:'low',
      tags:['pasta','rester','billigt','vegetariskt'], plants:5,
      ingredients:['pasta','Tomatsås à la Malix'], leftovers:['grillrester','tonfisk','grönsaker'],
      tip:'Tomatsåsen och pasta räcker som rätt. Vill du förändra den kan du använda det som redan finns hemma.',
      serving:'Vitt bröd, popup-bröd eller parmesan kan passa till.',
      swaps:'Rör ner tonfisk mot slutet, eller använd grillrester, svamp, paprika, zucchini eller andra grönsaksrester. Lite grädde ger en mildare och krämigare sås.',
      steps:['Koka pastan.','Värm Tomatsås à la Malix.','Välj om du vill äta den som den är eller lägga till tonfisk, grillrester eller grönsaker.','Blanda med pastan och servera.']
    },
    {
      id:'stektkalbacon', name:'Stekt grönkål eller svartkål med bacon', emoji:'🥬', time:20, budget:'low',
      tags:['tillbehör','grönkål','svartkål','rester'], plants:1,
      ingredients:['grönkål eller svartkål','bacon','lite grädde – valfritt','svartpeppar'], leftovers:['bacon','grönkål','svartkål'],
      tip:'Lite grädde gör kålen mjukare och krämigare.',
      serving:'Passar som varmt tillbehör till många pastarätter och andra vardagsrätter.',
      swaps:'Grönkål och svartkål kan bytas mot varandra. Bacon kan uteslutas. Lite parmesan eller vitlök kan läggas till om du vill.',
      steps:['Strimla kålen.','Stek bacon och låt kålen steka med tills den mjuknar.','Tillsätt eventuellt lite grädde och låt den koka in.','Avsluta med svartpeppar.']
    },
    {
      id:'makaronpuddingpizza', name:'Restpizza på makaronpudding', emoji:'🍕', time:25, budget:'low',
      tags:['rester','pizza','makaronpudding','rädda maten'], plants:2,
      ingredients:['kall makaronpudding','lite tomatsås – valfritt','skinka','lök','det du har hemma','rikligt med riven ost'], leftovers:['makaronpudding','skinka','ost','grönsaker'],
      tip:'Här är makaronpuddingen själva pizzabottnen – ett sätt att göra en helt ny rätt av rester.',
      serving:'Servera som den är eller med något grönt vid sidan.',
      swaps:'Skinka och lök är bara en början. Använd till exempel svamp, paprika, tomat, majs, grillrester eller andra pizzavänliga rester. Toppa ordentligt med ost.',
      steps:['Sätt ugnen på cirka 225 grader.','Lägg kall makaronpudding i en smord form eller på bakplåtspapper och tryck ut den till en stadig, jämn botten.','Bred eventuellt på lite tomatsås.','Lägg på skinka, lök och det du har hemma.','Täck med rikligt med ost.','Grädda tills allt är genomvarmt och osten har smält och fått färg.']
    }
  ].forEach(add);
})();