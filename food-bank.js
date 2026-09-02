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

  const aliases={
    'Smörgås':['macka'],
    'Hushållsost':['ost'],
    'Brieost':['brie'],
    'Clementin':['mandarin'],
    'Köttfärssås med spaghetti':['köttfärssås','spagetti och köttfärssås'],
    'Kokt potatis':['potatis'],
    'Pasta bolognese':['bolognese'],
    'Köttbullar med potatis och sås':['köttbullar'],
    'Kyckling curry':['currykyckling'],
    'Hamburgare med pommes':['burgare'],
    'Kebabtallrik':['kebab'],
    'Falukorv':['falukorv'],
    'Filmjölk':['fil'],
    'Yoghurt naturell':['yoghurt'],
    'Grekisk yoghurt':['grekisk yoghurt'],
    'Havredryck':['havremjölk']
  };

  const preferred={
    Frukost:['bread','dairy','cheese','toppings','cereals','fruit','drinks'],
    Mellanmål:['fruit','dairy','bread','toppings','snacks','drinks'],
    Lunch:['dishes','meat','poultry','fish','vegetarian','starch','vegetables','sauces','drinks'],
    Middag:['dishes','meat','poultry','fish','vegetarian','starch','vegetables','sauces','drinks'],
    Kvällsmål:['bread','dairy','cheese','toppings','cereals','fruit','snacks','drinks','dishes']
  };

  const normalize=value=>String(value||'').toLocaleLowerCase('sv-SE').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const items=[];
  Object.entries(groups).forEach(([group,names])=>names.forEach(name=>items.push({name,group,aliases:aliases[name]||[]})));
  const unique=[...new Map(items.map(item=>[normalize(item.name),item])).values()];

  function search(query,meal,limit=16){
    const q=normalize(query).trim();
    if(q.length<2)return [];
    const pref=preferred[meal]||[];
    return unique.map(item=>{
      const n=normalize(item.name),a=item.aliases.map(normalize);
      let score=999;
      if(n.startsWith(q))score=0;else if(n.includes(q))score=1;else if(a.some(x=>x.startsWith(q)))score=2;else if(a.some(x=>x.includes(q)))score=3;
      if(score===999)return null;
      const p=pref.indexOf(item.group);if(p>=0)score+=p/100;
      return {item,score};
    }).filter(Boolean).sort((a,b)=>a.score-b.score||a.item.name.localeCompare(b.item.name,'sv')).slice(0,limit).map(x=>x.item.name);
  }

  window.MalixFoodBank={items:unique,search,groups};
})();