(() => {
  if (typeof recipes === 'undefined' || !Array.isArray(recipes)) return;
  const add = r => { if (!recipes.some(x => x.id === r.id)) recipes.push(r); };

  add({
    id:'pannkakor-grund', name:'Pannkakor – grundrecept', emoji:'🥞', time:30, budget:'low',
    tags:['pannkaka','vegetariskt','vardag'], plants:1,
    ingredients:['ägg','mjölk','vetemjöl','lite salt','smör eller annat matfett till stekning'], leftovers:[],
    tip:'Låt gärna smeten stå en liten stund om du har tid. Servera sött eller matigt efter vad som finns hemma.',
    serving:'Sylt och bär passar fint, men pannkakor kan också fyllas med matiga rester.',
    swaps:'Behöver du glutenfritt, använd en glutenfri pannkaksmix/mjölmix avsedd för pannkakor och följ mängden för just den produkten.',
    steps:['Vispa ihop mjöl och en del av mjölken till en slät smet.','Vispa ner resten av mjölken, äggen och saltet.','Stek tunna pannkakor i lite matfett.']
  });

  add({
    id:'ugnsomelett-malix', name:'Fluffig ugnsomelett', emoji:'🍳', time:40, budget:'low',
    tags:['omelett','ugn','glutenfritt alternativ','vardag'], plants:0,
    ingredients:['ägg','mjölk','lite salt och peppar','lite Maizena/majsstärkelse för glutenfri redning – eller vetemjöl om du tål gluten','smör till formen'], leftovers:[],
    tip:'Varm mjölk och en lätt redning ger en mjuk och luftig ugnsomelett. Lägg gärna till en stuvning eller fyllning efter vad du har hemma.',
    serving:'Kan serveras som den är eller med exempelvis svamp-, räk- eller grönsaksstuvning och bröd.',
    swaps:'För glutenfri variant: red med majsstärkelse. Om gluten fungerar för dig kan du använda vanligt vetemjöl som redning.',
    steps:['Sätt ugnen på cirka 200 grader och smörj en ugnsform.','Värm mjölken. Gör en liten slät redning av Maizena/majsstärkelse och lite kall mjölk, eller använd vetemjöl om du tål gluten. Vispa ner redningen i den varma mjölken och låt den tjockna lätt.','Låt mjölkblandningen svalna något. Vispa upp äggen försiktigt med salt och peppar.','Vispa ner mjölkblandningen i äggen.','Häll i formen och grädda tills omeletten har stannat och blivit luftig.']
  });
})();