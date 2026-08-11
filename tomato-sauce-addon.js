(() => {
 if(typeof recipes==='undefined'||recipes.some(r=>r.id==='tomatsas-malix'))return;
 recipes.push({
  id:'tomatsas-malix',name:'Tomatsås à la Malix',emoji:'🍅',time:30,budget:'low',tags:['vegetariskt','budget','tillbehör','ta-vad-du-har','pizza','varma mackor'],
  ingredients:['krossade tomater','buljongtärning','vitlök','basilika','rikligt med svartpeppar','grädde valfritt','vatten vid behov','majsstärkelse eller mjöl till toppredning valfritt'],
  leftovers:['grillade grönsaker','grillad kyckling','grillat kött','grillad korv'],plants:3,
  tip:'🍅 En grundsås med många användningar: till pasta, pizza och varma mackor. Rädda också grillrester genom att skära ner dem och låta dem puttra i tomatsåsen. Servera med pasta eller ris – blanda med tomatsås och du är nästan hemma i Italien.',
  steps:['Häll krossade tomater i en kastrull och tillsätt buljongtärning, vitlök, basilika och rikligt med svartpeppar.','Låt såsen koka och utveckla smak en stund.','Vill du ha en rundare och krämigare sås kan du tillsätta lite grädde, men den går bra att utesluta.','Späd med lite vatten om såsen blir för tjock.','Om du vill ha den tjockare, avsluta med en liten toppredning av majsstärkelse eller mjöl utrört i kallt vatten.','Använd som pastasås, pizzasås eller bred på varma mackor före topping och gratinering.']
 });
})();