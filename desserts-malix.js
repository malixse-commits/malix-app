(() => {
  if (typeof recipes === 'undefined' || !Array.isArray(recipes)) return;
  const add = recipe => { if (!recipes.some(r => r.id === recipe.id)) recipes.push(recipe); };

  // Popup-brödet får också fungera som enkel efterrätt/pannkaksalternativ.
  const popup = recipes.find(r => r.id === 'popupbrod');
  if (popup) {
    popup.tags = [...new Set([...(popup.tags || []), 'efterrätt', 'något gott', 'pannkaksalternativ'])];
    popup.serving = 'Servera varmt till soppa eller gryta. Som efterrätt kan popup-bröden bli små pannkaksbullar med sylt och vispad grädde.';
    popup.swaps = '🍓 Pannkaksbullar: När du inte vill stå och steka pannkakor kan samma popup-bröd serveras med sylt och grädde. En enkel efterrätt efter till exempel soppa.';
  }

  add({
    id:'malix-appelpaj-pa-en-hoft', name:'Malix enkla äppelpaj – på en höft', emoji:'🍎', time:50, budget:'low',
    tags:['efterrätt','något gott','paj','äpple','päron','på en höft','glutenfritt alternativ','Malix-recept'], plants:2,
    ingredients:['ca 300 g smör','ca 1,5 dl socker','havregryn eller glutenfritt mjöl – tills det blir en deg','vaniljsocker – om du vill','kokos – om du tycker om det','äpplen','kanel','socker till äpplena'],
    leftovers:['äpplen','päron'],
    tip:'🥄 På en höft: Det här receptet behöver inte vara exakt. Börja med ungefär 300 g smör och 1,5 dl socker och tillsätt havregryn eller glutenfritt mjöl tills degen känns bra att trycka ut. Vi gillar mycket deg.',
    serving:'Gott som det är eller med vaniljsås, glass eller vispad grädde.',
    swaps:'🍐 Päronpaj: byt äpplena mot päron. Vaniljsocker och kokos är frivilligt. Använd havregryn eller glutenfritt mjöl efter vad du tycker om och tål.',
    steps:['Sätt ugnen på cirka 200 grader.','Smält smöret i en kastrull.','Blanda ner socker och sedan havregryn eller glutenfritt mjöl direkt i kastrullen tills det blir en deg. Tillsätt vaniljsocker och lite kokos om du vill.','Tryck ut en del av degen i botten av en pajform. Spara resten till toppen.','Skala och klyfta äpplena. Lägg dem i en påse med kanel och socker och skaka så att allt blandas.','Fördela äpplena över pajbotten.','Lägg resten av degen ovanpå. Tryck ut den i bitar eller smula över – det behöver inte vara noggrant.','Grädda tills äpplena är mjuka och pajen har fått fin färg.']
  });

  add({
    id:'saffranspannkaka', name:'Saffranspannkaka', emoji:'💛', time:55, budget:'medium',
    tags:['efterrätt','något gott','risgrynsgröt','saffran','rester'], plants:1,
    ingredients:['risgrynsgröt','ägg','mjölk eller grädde','saffran','lite socker efter smak','mandel – valfritt'],
    leftovers:['risgrynsgröt'],
    tip:'Ett bra sätt att göra något nytt av risgrynsgröt. Smaka av sötman efter hur söt gröten redan är.',
    serving:'Servera gärna med sylt och vispad grädde.',
    swaps:'Mandeln kan uteslutas. Mjölk eller en skvätt grädde kan användas för att justera konsistensen.',
    steps:['Sätt ugnen på cirka 200 grader.','Rör ihop risgrynsgröt, ägg, saffran och lite mjölk eller grädde. Smaka av med socker.','Rör i mandel om du vill.','Häll i en smord ugnsform.','Grädda tills pannkakan har stannat och fått fin färg.']
  });

  add({
    id:'risgrynspudding', name:'Risgrynspudding', emoji:'🍚', time:45, budget:'low',
    tags:['efterrätt','något gott','risgrynsgröt','rester','ugn'], plants:1,
    ingredients:['risgrynsgröt','ägg','mjölk','lite socker efter smak','vaniljsocker – valfritt'],
    leftovers:['risgrynsgröt'],
    tip:'Bra restmat när det finns risgrynsgröt kvar. Anpassa mängden mjölk så att smeten blir mjuk men inte rinnig.',
    serving:'Servera varm eller kall med sylt, bär eller lite grädde.',
    swaps:'Vaniljsocker är valfritt. Sötman kan anpassas efter gröten och tillbehören.',
    steps:['Sätt ugnen på cirka 200 grader.','Rör ihop risgrynsgröt med ägg och lite mjölk.','Smaka av med socker och eventuellt vaniljsocker.','Häll i en smord form.','Grädda tills puddingen har stannat och fått lite färg.']
  });
})();