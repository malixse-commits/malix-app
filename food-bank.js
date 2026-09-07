(() => {
  const groups={
    bread:['Smörgås','Fralla','Tekaka','Hönökaka','Polarkaka','Rågbröd','Surdegsbröd','Formfranska','Rostat bröd','Knäckebröd','Tunnbröd','Pitabröd','Tortillabröd','Baguette','Ciabatta','Croissant','Bagel','Hamburgerbröd','Korvbröd'],
    dairy:['Mjölk','Lättmjölk','Mellanmjölk','Standardmjölk','Havredryck','Sojadryck','Mandeldryck','Filmjölk','A-fil','Yoghurt naturell','Vaniljyoghurt','Grekisk yoghurt','Turkisk yoghurt','Kvarg','Keso','Crème fraiche','Gräddfil','Vispgrädde','Matlagningsgrädde','Smör','Bregott','Margarin'],
    cheese:['Hushållsost','Prästost','Herrgårdsost','Grevé','Västerbottensost','Cheddar','Gouda','Edamer','Brieost','Camembert','Ädelost','Blåmögelost','Fetaost','Mozzarella','Halloumi','Parmesan','Färskost','Getost','Ricotta','Mascarpone'],
    toppings:['Skinka','Rökt skinka','Kalkonpålägg','Kycklingpålägg','Salami','Medwurst','Leverpastej','Kaviar','Makrill i tomatsås','Rökt lax','Gravad lax','Tonfiskröra','Äggröra','Kokt ägg','Stekt ägg','Omelett','Marmelad','Sylt','Honung','Jordnötssmör','Nutella','Avokado','Tomat','Gurka','Paprika'],
    cereals:['Havregrynsgröt','Mannagrynsgröt','Risgrynsgröt','Råggröt','Müsli','Granola','Cornflakes','Havrefras','Special K','Flingor','Chokladflingor','Rice Krispies','All-Bran'],
    fruit:['Äpple','Päron','Banan','Apelsin','Clementin','Mandarin','Satsuma','Grapefrukt','Citron','Lime','Kiwi','Vindruvor','Jordgubbar','Hallon','Blåbär','Björnbär','Vinbär','Krusbär','Mango','Ananas','Melon','Vattenmelon','Honungsmelon','Persika','Nektarin','Plommon','Aprikos','Granatäpple','Passionsfrukt','Papaya','Fikon','Dadlar','Fruktsallad'],
    vegetables:['Potatis','Sötpotatis','Morot','Palsternacka','Rotselleri','Kålrot','Rödbeta','Gul lök','Rödlök','Purjolök','Vitlök','Broccoli','Blomkål','Vitkål','Rödkål','Spetskål','Brysselkål','Grönkål','Sallad','Isbergssallad','Romansallad','Ruccola','Spenat','Mangold','Tomat','Körsbärstomat','Gurka','Paprika','Chili','Zucchini','Aubergine','Champinjoner','Svamp','Majs','Ärtor','Haricots verts','Sockerärtor','Sparris','Avokado','Oliver','Bönor','Kidneybönor','Vita bönor','Svarta bönor','Kikärter','Linser'],
    meat:['Köttbullar','Falukorv','Prinskorv','Grillkorv','Varmkorv','Chorizo','Isterband','Bacon','Fläskfilé','Fläskkotlett','Karré','Revbensspjäll','Fläskfärs','Köttfärs','Nötfärs','Blandfärs','Högrev','Entrecôte','Ryggbiff','Lövbiff','Oxfilé','Rostbiff','Kalvkött','Lammkött','Lammfärs','Kassler','Pannbiff','Hamburgare','Kebabkött'],
    poultry:['Kyckling','Kycklingfilé','Kycklinglår','Kycklingklubba','Kycklingfärs','Kalkon','Kalkonfilé'],
    fish:['Lax','Torsk','Sej','Kolja','Rödspätta','Makrill','Sill','Strömming','Tonfisk','Röding','Regnbåge','Fiskpinnar','Fiskbullar','Räkor','Kräftor','Musslor','Bläckfisk','Skaldjur'],
    vegetarian:['Tofu','Tempeh','Quorn','Vegofärs','Vegetariska köttbullar','Vegetarisk korv','Vegoburgare','Falafel','Hummus','Halloumi','Bönbiffar','Linsbiffar'],
    starch:['Kokt potatis','Potatismos','Ugnsrostad potatis','Pommes frites','Potatisklyftor','Hasselbackspotatis','Ris','Basmatiris','Jasminris','Fullkornsris','Couscous','Bulgur','Quinoa','Matvete','Pasta','Spaghetti','Makaroner','Tagliatelle','Penne','Fusilli','Lasagneplattor','Nudlar','Äggnudlar','Risnudlar','Gnocchi'],
    dishes:['Köttbullar med potatis och sås','Pannbiff med lök','Korvstroganoff','Falukorv i ugn','Makaroner och korv','Köttfärssås med spaghetti','Lasagne','Pytt i panna','Raggmunk','Pannkakor','Ugnspannkaka','Plättar','Ärtsoppa','Köttsoppa','Fisksoppa','Tomatsoppa','Broccolisoppa','Potatis- och purjolökssoppa','Kålpudding','Kåldolmar','Kalops','Dillkött','Sjömansbiff','Flygande Jacob','Kycklinggryta','Kyckling curry','Kycklingwok','Kyckling med ris','Lax med potatis','Torsk med äggsås','Fiskgratäng','Fiskburgare','Räksmörgås','Toast Skagen','Caesarsallad','Pastasallad','Tonfisksallad','Grekisk sallad','Poké bowl','Sushi','Pizza','Kebabtallrik','Kebabrulle','Hamburgare med pommes','Tacos','Tacopaj','Quesadilla','Nachos','Burrito','Fajitas','Chili con carne','Chili sin carne','Pasta carbonara','Pasta bolognese','Pasta pesto','Mac and cheese','Risotto','Ravioli','Tortellini','Gulasch','Moussaka','Paella','Currygryta','Butter chicken','Tikka masala','Nasi goreng','Pad thai','Wok','Falafelrulle','Hummustallrik','Shakshuka'],
    sauces:['Brunsås','Gräddsås','Pepparsås','Bearnaisesås','Rödvinssås','Tzatziki','Vitlökssås','Currysås','Dillsås','Remouladsås','Hollandaisesås','Tomatsås','Pastasås','Pesto','Ketchup','Senap','Majonnäs','Aioli','Sriracha','Sweet chilisås','Soja','Teriyakisås','Salsa','Guacamole','Dressing'],
    snacks:['Nötter','Mandlar','Cashewnötter','Jordnötter','Valnötter','Pistagenötter','Frön','Pumpafrön','Solrosfrön','Popcorn','Chips','Ostbågar','Kex','Riskakor','Majskakor','Proteinbar','Müslibar'],
    sweets:['Mjölkchoklad','Mörk choklad','Vit choklad','Godis','Lakrits','Gelégodis','Kola','Glass','Vaniljglass','Chokladglass','Sorbet','Kanelbulle','Wienerbröd','Muffins','Kladdkaka','Chokladboll','Sockerkaka','Tårta','Cheesecake','Paj','Fruktpaj','Semla','Pepparkaka'],
    drinks:['Vatten','Kolsyrat vatten','Kaffe','Te','Choklad','Juice','Apelsinjuice','Äppeljuice','Smoothie','Mjölk','Havredryck','Läsk','Cola','Sockerfri läsk','Saft','Energidryck'],
    extras:['Sylt','Lingonsylt','Äppelmos','Inlagd gurka','Rödbetor','Pickles','Kapris','Soltorkade tomater','Fetaost','Krutonger','Rostad lök','Tacosås','Tortillachips']
  };

  const aliases={'Smörgås':['macka'],'Hushållsost':['ost'],'Brieost':['brie'],'Clementin':['mandarin'],'Köttfärssås med spaghetti':['köttfärssås','spagetti och köttfärssås'],'Kokt potatis':['potatis'],'Pasta bolognese':['bolognese'],'Köttbullar med potatis och sås':['köttbullar'],'Kyckling curry':['currykyckling'],'Hamburgare med pommes':['burgare'],'Kebabtallrik':['kebab'],'Falukorv':['falukorv'],'Filmjölk':['fil'],'Yoghurt naturell':['yoghurt'],'Grekisk yoghurt':['grekisk yoghurt'],'Havredryck':['havremjölk']};
  const preferred={Frukost:['bread','dairy','cheese','toppings','cereals','fruit','drinks'],Mellanmål:['fruit','dairy','bread','toppings','snacks','drinks'],Lunch:['dishes','meat','poultry','fish','vegetarian','starch','vegetables','sauces','drinks'],Middag:['dishes','meat','poultry','fish','vegetarian','starch','vegetables','sauces','drinks'],Kvällsmål:['bread','dairy','cheese','toppings','cereals','fruit','snacks','drinks','dishes']};

  // Registreringsmått: hushållsmått/styck där det är naturligt, gram där vikt är tydligare.
  // De är inmatningsförslag, inte rekommenderade portionsstorlekar.
  const quantityByGroup={
    bread:{unit:'skiva/st',defaultAmount:'1'},
    dairy:{unit:'dl',defaultAmount:'2'},
    cheese:{unit:'g',defaultAmount:'30'},
    toppings:{unit:'g',defaultAmount:'30'},
    cereals:{unit:'dl',defaultAmount:'1'},
    fruit:{unit:'st/g',defaultAmount:'1'},
    vegetables:{unit:'g',defaultAmount:'100'},
    meat:{unit:'g',defaultAmount:'100'},
    poultry:{unit:'g',defaultAmount:'100'},
    fish:{unit:'g',defaultAmount:'100'},
    vegetarian:{unit:'g',defaultAmount:'100'},
    starch:{unit:'dl',defaultAmount:'2'},
    dishes:{unit:'portion',defaultAmount:'1'},
    sauces:{unit:'msk',defaultAmount:'1'},
    snacks:{unit:'g',defaultAmount:'30'},
    sweets:{unit:'g',defaultAmount:'30'},
    drinks:{unit:'dl',defaultAmount:'2'},
    extras:{unit:'g',defaultAmount:'20'}
  };
  const quantityOverrides={
    'Smörgås':{unit:'skiva',defaultAmount:'1'},'Rågbröd':{unit:'skiva',defaultAmount:'1'},'Surdegsbröd':{unit:'skiva',defaultAmount:'1'},'Formfranska':{unit:'skiva',defaultAmount:'1'},'Rostat bröd':{unit:'skiva',defaultAmount:'1'},'Knäckebröd':{unit:'skiva',defaultAmount:'1'},
    'Fralla':{unit:'st',defaultAmount:'1'},'Tekaka':{unit:'st',defaultAmount:'1'},'Hönökaka':{unit:'st',defaultAmount:'1'},'Polarkaka':{unit:'st',defaultAmount:'1'},'Pitabröd':{unit:'st',defaultAmount:'1'},'Tortillabröd':{unit:'st',defaultAmount:'1'},'Croissant':{unit:'st',defaultAmount:'1'},'Bagel':{unit:'st',defaultAmount:'1'},'Hamburgerbröd':{unit:'st',defaultAmount:'1'},'Korvbröd':{unit:'st',defaultAmount:'1'},
    'Brieost':{unit:'g',defaultAmount:'30'},'Camembert':{unit:'g',defaultAmount:'30'},'Fetaost':{unit:'g',defaultAmount:'30'},'Mozzarella':{unit:'g',defaultAmount:'50'},'Halloumi':{unit:'g',defaultAmount:'50'},'Parmesan':{unit:'g',defaultAmount:'15'},
    'Hushållsost':{unit:'skiva',defaultAmount:'1'},'Prästost':{unit:'skiva',defaultAmount:'1'},'Herrgårdsost':{unit:'skiva',defaultAmount:'1'},'Grevé':{unit:'skiva',defaultAmount:'1'},'Cheddar':{unit:'skiva/g',defaultAmount:'1'},'Gouda':{unit:'skiva',defaultAmount:'1'},'Edamer':{unit:'skiva',defaultAmount:'1'},
    'Kokt ägg':{unit:'st',defaultAmount:'1'},'Stekt ägg':{unit:'st',defaultAmount:'1'},
    'Äpple':{unit:'st',defaultAmount:'1'},'Päron':{unit:'st',defaultAmount:'1'},'Banan':{unit:'st',defaultAmount:'1'},'Apelsin':{unit:'st',defaultAmount:'1'},'Clementin':{unit:'st',defaultAmount:'1'},'Mandarin':{unit:'st',defaultAmount:'1'},'Satsuma':{unit:'st',defaultAmount:'1'},'Kiwi':{unit:'st',defaultAmount:'1'},'Persika':{unit:'st',defaultAmount:'1'},'Nektarin':{unit:'st',defaultAmount:'1'},'Plommon':{unit:'st',defaultAmount:'1'},'Aprikos':{unit:'st',defaultAmount:'1'},
    'Potatis':{unit:'st/g',defaultAmount:'1'},'Kokt potatis':{unit:'st/g',defaultAmount:'1'},
    'Müsli':{unit:'dl',defaultAmount:'1'},'Granola':{unit:'dl',defaultAmount:'1'},'Cornflakes':{unit:'dl',defaultAmount:'1'},
    'Nötter':{unit:'g',defaultAmount:'25'},'Mandlar':{unit:'g',defaultAmount:'25'},'Cashewnötter':{unit:'g',defaultAmount:'25'},'Jordnötter':{unit:'g',defaultAmount:'25'},'Valnötter':{unit:'g',defaultAmount:'25'},'Pistagenötter':{unit:'g',defaultAmount:'25'},'Frön':{unit:'g',defaultAmount:'25'},
    'Ris':{unit:'dl',defaultAmount:'2'},'Basmatiris':{unit:'dl',defaultAmount:'2'},'Jasminris':{unit:'dl',defaultAmount:'2'},'Fullkornsris':{unit:'dl',defaultAmount:'2'},'Pasta':{unit:'dl',defaultAmount:'2'},'Spaghetti':{unit:'dl/g',defaultAmount:'2'},'Makaroner':{unit:'dl',defaultAmount:'2'},
    'Smör':{unit:'tsk/g',defaultAmount:'1'},'Bregott':{unit:'tsk/g',defaultAmount:'1'},'Margarin':{unit:'tsk/g',defaultAmount:'1'},'Crème fraiche':{unit:'msk/dl',defaultAmount:'1'},'Gräddfil':{unit:'msk/dl',defaultAmount:'1'},'Vispgrädde':{unit:'dl',defaultAmount:'1'},'Matlagningsgrädde':{unit:'dl',defaultAmount:'1'}
  };

  const normalize=value=>String(value||'').toLocaleLowerCase('sv-SE').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const items=[];
  Object.entries(groups).forEach(([group,names])=>names.forEach(name=>items.push({name,group,aliases:aliases[name]||[],quantity:quantityOverrides[name]||quantityByGroup[group]||{unit:'g',defaultAmount:'100'}})));
  const unique=[...new Map(items.map(item=>[normalize(item.name),item])).values()];
  function searchItems(query,meal,limit=16){const q=normalize(query).trim();if(q.length<2)return[];const pref=preferred[meal]||[];return unique.map(item=>{const n=normalize(item.name),a=item.aliases.map(normalize);let score=999;if(n.startsWith(q))score=0;else if(n.includes(q))score=1;else if(a.some(x=>x.startsWith(q)))score=2;else if(a.some(x=>x.includes(q)))score=3;if(score===999)return null;const p=pref.indexOf(item.group);if(p>=0)score+=p/100;return{item,score}}).filter(Boolean).sort((a,b)=>a.score-b.score||a.item.name.localeCompare(b.item.name,'sv')).slice(0,limit).map(x=>x.item)}
  function search(query,meal,limit=16){return searchItems(query,meal,limit).map(x=>x.name)}
  function getItem(name){return unique.find(x=>normalize(x.name)===normalize(name))||null}
  window.MalixFoodBank={items:unique,search,searchItems,getItem,groups,quantityByGroup};
})();