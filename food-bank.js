(() => {
  // Matbank för vardagsregistrering. Kategorierna följer svenska livsmedelsgrupper.
  // Mängderna är neutrala startvärden för registrering – inte kostråd eller rekommenderade portioner.
  const groups={
    bread:['Smörgås','Fullkornsbröd','Rågbröd','Surdegsbröd','Formfranska','Rostat bröd','Knäckebröd','Tunnbröd','Fralla','Tekaka','Hönökaka','Polarkaka','Pitabröd','Tortillabröd','Baguette','Ciabatta','Croissant','Bagel','Hamburgerbröd','Korvbröd'],
    cereals:['Havregryn','Rågflingor','Havregrynsgröt','Mannagrynsgröt','Risgrynsgröt','Råggröt','Müsli','Granola','Cornflakes','Havrefras','Special K','Flingor','Chokladflingor','Rice Krispies','All-Bran'],
    dairy:['Mjölk','Lättmjölk','Mellanmjölk','Standardmjölk','Laktosfri mjölk','Filmjölk','A-fil','Laktosfri fil','Yoghurt naturell','Vaniljyoghurt','Grekisk yoghurt','Turkisk yoghurt','Laktosfri yoghurt','Kvarg','Laktosfri kvarg','Keso','Crème fraiche','Gräddfil','Vispgrädde','Matlagningsgrädde'],
    plantDrinks:['Havredryck','Sojadryck','Mandeldryck','Ärtdryck','Kokosdryck'],
    cheese:['Hushållsost','Prästost','Herrgårdsost','Grevé','Västerbottensost','Cheddar','Gouda','Edamer','Brieost','Camembert','Ädelost','Blåmögelost','Fetaost','Mozzarella','Halloumi','Parmesan','Färskost','Getost','Ricotta','Mascarpone'],
    eggs:['Ägg','Kokt ägg','Stekt ägg','Äggröra','Omelett'],
    spreads:['Smör','Bregott','Margarin','Leverpastej','Kaviar','Marmelad','Sylt','Honung','Jordnötssmör','Nötkräm','Färskost'],
    coldCuts:['Skinka','Rökt skinka','Kalkonpålägg','Kycklingpålägg','Salami','Medwurst','Rostbiff pålägg','Rökt lax','Gravad lax','Makrill i tomatsås','Tonfiskröra'],
    fruit:['Äpple','Päron','Banan','Apelsin','Clementin','Mandarin','Satsuma','Grapefrukt','Citron','Lime','Kiwi','Vindruvor','Mango','Ananas','Melon','Vattenmelon','Honungsmelon','Persika','Nektarin','Plommon','Aprikos','Granatäpple','Passionsfrukt','Papaya','Fikon','Dadlar','Fruktsallad'],
    berries:['Jordgubbar','Hallon','Blåbär','Björnbär','Vinbär','Krusbär','Lingon'],
    vegetables:['Morot','Palsternacka','Rotselleri','Kålrot','Rödbeta','Gul lök','Rödlök','Purjolök','Vitlök','Broccoli','Blomkål','Vitkål','Rödkål','Spetskål','Brysselkål','Grönkål','Sallad','Isbergssallad','Romansallad','Ruccola','Spenat','Mangold','Tomat','Körsbärstomat','Gurka','Paprika','Chili','Zucchini','Aubergine','Champinjoner','Svamp','Majs','Haricots verts','Sockerärtor','Sparris','Avokado','Oliver'],
    legumes:['Gröna ärter','Bönor','Kidneybönor','Vita bönor','Svarta bönor','Sojabönor','Edamame','Kikärter','Gröna linser','Röda linser','Belugalinser'],
    potatoes:['Potatis','Kokt potatis','Bakad potatis','Sötpotatis','Potatismos','Ugnsrostad potatis','Potatisklyftor','Hasselbackspotatis','Pommes frites'],
    grains:['Ris','Basmatiris','Jasminris','Fullkornsris','Couscous','Bulgur','Quinoa','Matvete','Mathavre','Korn','Pasta','Fullkornspasta','Spaghetti','Makaroner','Tagliatelle','Penne','Fusilli','Nudlar','Äggnudlar','Risnudlar','Gnocchi'],
    fish:['Lax','Torsk','Sej','Kolja','Rödspätta','Makrill','Sill','Strömming','Tonfisk','Röding','Regnbåge','Fiskpinnar','Fiskbullar'],
    seafood:['Räkor','Kräftor','Musslor','Bläckfisk','Skaldjur'],
    poultry:['Kyckling','Kycklingfilé','Kycklinglår','Kycklingklubba','Kycklingfärs','Kalkon','Kalkonfilé'],
    meat:['Nötkött','Fläskkött','Lammkött','Kalvkött','Fläskfilé','Fläskkotlett','Karré','Högrev','Entrecôte','Ryggbiff','Lövbiff','Oxfilé','Köttfärs','Nötfärs','Fläskfärs','Blandfärs','Lammfärs','Pannbiff','Hamburgare'],
    processedMeat:['Köttbullar','Falukorv','Prinskorv','Grillkorv','Varmkorv','Chorizo','Isterband','Bacon','Kassler','Kebabkött'],
    vegetarian:['Tofu','Tempeh','Quorn','Vegofärs','Vegetariska köttbullar','Vegetarisk korv','Vegoburgare','Falafel','Hummus','Bönbiffar','Linsbiffar'],
    nutsSeeds:['Nötter','Mandlar','Cashewnötter','Jordnötter','Valnötter','Pistagenötter','Hasselnötter','Pekannötter','Frön','Pumpafrön','Solrosfrön','Sesamfrön','Chiafrön','Linfrön'],
    fats:['Rapsolja','Olivolja','Matolja','Smör','Bregott','Margarin'],
    sauces:['Brunsås','Gräddsås','Pepparsås','Bearnaisesås','Rödvinssås','Tzatziki','Vitlökssås','Currysås','Dillsås','Remouladsås','Hollandaisesås','Tomatsås','Pastasås','Pesto','Ketchup','Senap','Majonnäs','Aioli','Sriracha','Sweet chilisås','Soja','Teriyakisås','Salsa','Guacamole','Dressing'],
    dishes:['Köttbullar med potatis och sås','Pannbiff med lök','Korvstroganoff','Falukorv i ugn','Makaroner och korv','Köttfärssås med spaghetti','Lasagne','Pytt i panna','Raggmunk','Pannkakor','Ugnspannkaka','Plättar','Ärtsoppa','Köttsoppa','Fisksoppa','Tomatsoppa','Broccolisoppa','Potatis- och purjolökssoppa','Kålpudding','Kåldolmar','Kalops','Dillkött','Sjömansbiff','Flygande Jacob','Kycklinggryta','Kyckling curry','Kycklingwok','Kyckling med ris','Lax med potatis','Torsk med äggsås','Fiskgratäng','Fiskburgare','Räksmörgås','Toast Skagen','Caesarsallad','Pastasallad','Tonfisksallad','Grekisk sallad','Poké bowl','Sushi','Pizza','Kebabtallrik','Kebabrulle','Hamburgare med pommes','Tacos','Tacopaj','Quesadilla','Nachos','Burrito','Fajitas','Chili con carne','Chili sin carne','Pasta carbonara','Pasta bolognese','Pasta pesto','Mac and cheese','Risotto','Ravioli','Tortellini','Gulasch','Moussaka','Paella','Currygryta','Butter chicken','Tikka masala','Nasi goreng','Pad thai','Wok','Falafelrulle','Hummustallrik','Shakshuka'],
    snacks:['Popcorn','Chips','Ostbågar','Kex','Riskakor','Majskakor','Proteinbar','Müslibar'],
    sweets:['Mjölkchoklad','Mörk choklad','Vit choklad','Godis','Lakrits','Gelégodis','Kola','Glass','Vaniljglass','Chokladglass','Sorbet','Kanelbulle','Wienerbröd','Muffins','Kladdkaka','Chokladboll','Sockerkaka','Tårta','Cheesecake','Paj','Fruktpaj','Semla','Pepparkaka'],
    drinks:['Vatten','Kolsyrat vatten','Kaffe','Te','Chokladdryck','Juice','Apelsinjuice','Äppeljuice','Smoothie','Läsk','Cola','Sockerfri läsk','Saft','Energidryck'],
    extras:['Lingonsylt','Äppelmos','Inlagd gurka','Inlagda rödbetor','Pickles','Kapris','Soltorkade tomater','Krutonger','Rostad lök','Tacosås','Tortillachips']
  };

  const aliases={
    'Smörgås':['macka'],'Hushållsost':['ost'],'Brieost':['brie'],'Clementin':['mandarin'],'Köttfärssås med spaghetti':['köttfärssås','spagetti och köttfärssås'],'Kokt potatis':['potatis kokt'],'Pasta bolognese':['bolognese'],'Köttbullar med potatis och sås':['köttbullar middag'],'Kyckling curry':['currykyckling'],'Hamburgare med pommes':['burgare'],'Kebabtallrik':['kebab'],'Falukorv':['falukorv'],'Filmjölk':['fil'],'Yoghurt naturell':['yoghurt'],'Grekisk yoghurt':['grekisk yoghurt'],'Havredryck':['havremjölk'],'Laktosfri kvarg':['kvarg laktosfri'],'Fullkornsbröd':['grovt bröd'],'Fullkornspasta':['pasta fullkorn'],'Kikärter':['kikärtor']
  };

  const preferred={
    Frukost:['bread','cereals','dairy','plantDrinks','cheese','eggs','spreads','coldCuts','fruit','berries','nutsSeeds','drinks'],
    Mellanmål:['fruit','berries','dairy','plantDrinks','bread','cheese','nutsSeeds','snacks','drinks'],
    Lunch:['dishes','vegetables','legumes','potatoes','grains','fish','seafood','poultry','meat','processedMeat','vegetarian','sauces','drinks'],
    Middag:['dishes','vegetables','legumes','potatoes','grains','fish','seafood','poultry','meat','processedMeat','vegetarian','sauces','drinks'],
    Kvällsmål:['bread','cereals','dairy','plantDrinks','cheese','eggs','spreads','coldCuts','fruit','berries','nutsSeeds','drinks','dishes']
  };

  // Naturliga registreringsenheter. Startvärdena är endast hjälp vid inmatning.
  const quantityByGroup={
    bread:{units:['skiva','st','g'],unit:'skiva',defaultAmount:'1'},
    cereals:{units:['dl','g'],unit:'dl',defaultAmount:'1'},
    dairy:{units:['dl','g'],unit:'dl',defaultAmount:'2'},
    plantDrinks:{units:['dl','ml'],unit:'dl',defaultAmount:'2'},
    cheese:{units:['g','skiva'],unit:'g',defaultAmount:'30'},
    eggs:{units:['st','g'],unit:'st',defaultAmount:'1'},
    spreads:{units:['tsk','msk','g'],unit:'tsk',defaultAmount:'1'},
    coldCuts:{units:['skiva','g'],unit:'skiva',defaultAmount:'1'},
    fruit:{units:['st','g','dl'],unit:'st',defaultAmount:'1'},
    berries:{units:['dl','g'],unit:'dl',defaultAmount:'1'},
    vegetables:{units:['g','dl','st'],unit:'g',defaultAmount:'100'},
    legumes:{units:['dl','g'],unit:'dl',defaultAmount:'1'},
    potatoes:{units:['st','g','dl'],unit:'st',defaultAmount:'1'},
    grains:{units:['dl','g'],unit:'dl',defaultAmount:'2'},
    fish:{units:['g'],unit:'g',defaultAmount:'100'},seafood:{units:['g','dl'],unit:'g',defaultAmount:'100'},
    poultry:{units:['g','st'],unit:'g',defaultAmount:'100'},meat:{units:['g','st'],unit:'g',defaultAmount:'100'},processedMeat:{units:['g','st','skiva'],unit:'g',defaultAmount:'100'},vegetarian:{units:['g','st','dl'],unit:'g',defaultAmount:'100'},
    nutsSeeds:{units:['g','dl'],unit:'g',defaultAmount:'25'},fats:{units:['tsk','msk','g'],unit:'tsk',defaultAmount:'1'},sauces:{units:['msk','dl','g'],unit:'msk',defaultAmount:'1'},
    dishes:{units:['portion','g','dl','st'],unit:'portion',defaultAmount:'1'},snacks:{units:['g','st','dl'],unit:'g',defaultAmount:'30'},sweets:{units:['g','st','bit'],unit:'g',defaultAmount:'30'},drinks:{units:['dl','ml'],unit:'dl',defaultAmount:'2'},extras:{units:['msk','g','st'],unit:'msk',defaultAmount:'1'}
  };

  const overrides={
    'Smörgås':{units:['skiva','st','g'],unit:'skiva',defaultAmount:'1'},'Fullkornsbröd':{units:['skiva','g'],unit:'skiva',defaultAmount:'1'},'Rågbröd':{units:['skiva','g'],unit:'skiva',defaultAmount:'1'},'Surdegsbröd':{units:['skiva','g'],unit:'skiva',defaultAmount:'1'},'Formfranska':{units:['skiva','g'],unit:'skiva',defaultAmount:'1'},'Rostat bröd':{units:['skiva','g'],unit:'skiva',defaultAmount:'1'},'Knäckebröd':{units:['skiva','st','g'],unit:'skiva',defaultAmount:'1'},
    'Fralla':{units:['st','g'],unit:'st',defaultAmount:'1'},'Tekaka':{units:['st','g'],unit:'st',defaultAmount:'1'},'Hönökaka':{units:['st','g'],unit:'st',defaultAmount:'1'},'Polarkaka':{units:['st','g'],unit:'st',defaultAmount:'1'},'Pitabröd':{units:['st','g'],unit:'st',defaultAmount:'1'},'Tortillabröd':{units:['st','g'],unit:'st',defaultAmount:'1'},'Croissant':{units:['st','g'],unit:'st',defaultAmount:'1'},'Bagel':{units:['st','g'],unit:'st',defaultAmount:'1'},
    'Hushållsost':{units:['skiva','g'],unit:'skiva',defaultAmount:'1'},'Prästost':{units:['skiva','g'],unit:'skiva',defaultAmount:'1'},'Herrgårdsost':{units:['skiva','g'],unit:'skiva',defaultAmount:'1'},'Grevé':{units:['skiva','g'],unit:'skiva',defaultAmount:'1'},'Gouda':{units:['skiva','g'],unit:'skiva',defaultAmount:'1'},'Edamer':{units:['skiva','g'],unit:'skiva',defaultAmount:'1'},'Brieost':{units:['g'],unit:'g',defaultAmount:'30'},'Camembert':{units:['g'],unit:'g',defaultAmount:'30'},'Fetaost':{units:['g'],unit:'g',defaultAmount:'30'},'Mozzarella':{units:['g'],unit:'g',defaultAmount:'50'},'Halloumi':{units:['g'],unit:'g',defaultAmount:'50'},'Parmesan':{units:['g','msk'],unit:'g',defaultAmount:'15'},
    'Äpple':{units:['st','g'],unit:'st',defaultAmount:'1'},'Päron':{units:['st','g'],unit:'st',defaultAmount:'1'},'Banan':{units:['st','g'],unit:'st',defaultAmount:'1'},'Apelsin':{units:['st','g'],unit:'st',defaultAmount:'1'},'Clementin':{units:['st','g'],unit:'st',defaultAmount:'1'},'Mandarin':{units:['st','g'],unit:'st',defaultAmount:'1'},'Satsuma':{units:['st','g'],unit:'st',defaultAmount:'1'},'Kiwi':{units:['st','g'],unit:'st',defaultAmount:'1'},'Vindruvor':{units:['g','dl'],unit:'g',defaultAmount:'100'},'Mango':{units:['g','st'],unit:'g',defaultAmount:'100'},'Ananas':{units:['g','skiva'],unit:'g',defaultAmount:'100'},'Melon':{units:['g','skiva'],unit:'g',defaultAmount:'100'},'Vattenmelon':{units:['g','skiva'],unit:'g',defaultAmount:'100'},
    'Potatis':{units:['st','g'],unit:'st',defaultAmount:'1'},'Kokt potatis':{units:['st','g'],unit:'st',defaultAmount:'1'},'Bakad potatis':{units:['st','g'],unit:'st',defaultAmount:'1'},'Potatismos':{units:['dl','g'],unit:'dl',defaultAmount:'2'},'Pommes frites':{units:['g','portion'],unit:'g',defaultAmount:'100'},
    'Havregryn':{units:['dl','msk','g'],unit:'dl',defaultAmount:'1'},'Rågflingor':{units:['dl','g'],unit:'dl',defaultAmount:'1'},'Havregrynsgröt':{units:['dl','portion','g'],unit:'dl',defaultAmount:'2'},'Müsli':{units:['dl','g'],unit:'dl',defaultAmount:'1'},'Granola':{units:['dl','g'],unit:'dl',defaultAmount:'1'},
    'Ris':{units:['dl','g'],unit:'dl',defaultAmount:'2'},'Basmatiris':{units:['dl','g'],unit:'dl',defaultAmount:'2'},'Jasminris':{units:['dl','g'],unit:'dl',defaultAmount:'2'},'Fullkornsris':{units:['dl','g'],unit:'dl',defaultAmount:'2'},'Pasta':{units:['dl','g'],unit:'dl',defaultAmount:'2'},'Fullkornspasta':{units:['dl','g'],unit:'dl',defaultAmount:'2'},'Spaghetti':{units:['dl','g'],unit:'dl',defaultAmount:'2'},'Makaroner':{units:['dl','g'],unit:'dl',defaultAmount:'2'},
    'Mjölk':{units:['dl','ml'],unit:'dl',defaultAmount:'2'},'Filmjölk':{units:['dl','g'],unit:'dl',defaultAmount:'2'},'Yoghurt naturell':{units:['dl','g'],unit:'dl',defaultAmount:'2'},'Kvarg':{units:['dl','g'],unit:'dl',defaultAmount:'2'},'Laktosfri kvarg':{units:['dl','g'],unit:'dl',defaultAmount:'2'},'Keso':{units:['dl','g'],unit:'dl',defaultAmount:'1'},
    'Kaffe':{units:['dl','ml'],unit:'dl',defaultAmount:'2'},'Te':{units:['dl','ml'],unit:'dl',defaultAmount:'2'},'Vatten':{units:['dl','ml'],unit:'dl',defaultAmount:'2'},'Kolsyrat vatten':{units:['dl','ml'],unit:'dl',defaultAmount:'2'},
    'Köttbullar':{units:['st','g'],unit:'st',defaultAmount:'4'},'Prinskorv':{units:['st','g'],unit:'st',defaultAmount:'3'},'Grillkorv':{units:['st','g'],unit:'st',defaultAmount:'1'},'Varmkorv':{units:['st','g'],unit:'st',defaultAmount:'1'},'Hamburgare':{units:['st','g'],unit:'st',defaultAmount:'1'},'Fiskpinnar':{units:['st','g'],unit:'st',defaultAmount:'3'},
    'Pannkakor':{units:['st','g'],unit:'st',defaultAmount:'2'},'Plättar':{units:['st','g'],unit:'st',defaultAmount:'5'},'Pizza':{units:['portion','st','g'],unit:'portion',defaultAmount:'1'},'Sushi':{units:['bit','g'],unit:'bit',defaultAmount:'8'}
  };

  const normalize=v=>String(v||'').toLocaleLowerCase('sv-SE').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const items=[];
  Object.entries(groups).forEach(([group,names])=>names.forEach(name=>items.push({name,group,aliases:aliases[name]||[],quantity:overrides[name]||quantityByGroup[group]})));
  const unique=[...new Map(items.map(item=>[normalize(item.name),item])).values()];
  function search(query,meal,limit=18){const q=normalize(query).trim();if(q.length<2)return[];const pref=preferred[meal]||[];return unique.map(item=>{const n=normalize(item.name),a=item.aliases.map(normalize);let score=999;if(n.startsWith(q))score=0;else if(n.includes(q))score=1;else if(a.some(x=>x.startsWith(q)))score=2;else if(a.some(x=>x.includes(q)))score=3;if(score===999)return null;const p=pref.indexOf(item.group);if(p>=0)score+=p/100;return{item,score}}).filter(Boolean).sort((a,b)=>a.score-b.score||a.item.name.localeCompare(b.item.name,'sv')).slice(0,limit).map(x=>x.item.name)}
  function getItem(name){return unique.find(item=>normalize(item.name)===normalize(name))||null}
  window.MalixFoodBank={items:unique,search,getItem,groups,quantityByGroup,source:{name:'Livsmedelsverket',databaseVersion:'2026-07-01',note:'Kategorier och registreringsmått inspirerade av Livsmedelsverkets livsmedelsgrupper och portionsregistrering. Näringsdata ingår inte i denna lokala matbank.'}};
})();