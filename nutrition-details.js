(() => {
  if(typeof recipes==='undefined'||!Array.isArray(recipes))return;

  const exactOverrides={
    'pastacapri':{
      servings:4,time:30,prepTime:10,cookTime:20,
      ingredients:[
        '320 g pasta',
        '400 g benfri kotlett',
        '1 lök',
        'svartpeppar efter smak',
        'basilika efter smak',
        'oregano efter smak',
        '3 dl Tomatsås à la Malix',
        'en skvätt grädde – valfritt'
      ],
      steps:[
        'Koka pastan.',
        'Skär den benfria kotletten i mindre bitar eller strimlor och stek den.',
        'Tillsätt lök och låt den mjukna. Krydda med svartpeppar, basilika och oregano.',
        'Häll på Tomatsås à la Malix och låt såsen gå ihop. Tillsätt en skvätt grädde om du vill ha en mildare och krämigare sås.',
        'Vänd ihop med pastan och servera.'
      ],
      swaps:'Tomatsås à la Malix är basen. En skvätt grädde är valfritt om du vill ha en mildare och krämigare sås.',
      tip:'Tomatsås à la Malix är grunden i Pasta Capri. Tillsätt en skvätt grädde om du vill runda av smaken.'
    },
    'pastamexicana':{
      ingredients:[
        '320 g pasta',
        '400 g Tomatsås à la Malix',
        '600 g fläskkött eller nötkött i bitar',
        '1 lök i bitar',
        '2 paprikor i bitar',
        '2 vitlöksklyftor',
        'chili efter smak',
        'svartpeppar efter smak',
        '1 buljongtärning',
        'majs – om du vill'
      ],
      steps:[
        'Koka pastan.',
        'Skär köttet i bitar och bryn det.',
        'Lägg i lök och paprika i bitar och stek vidare. Tillsätt rikligt med vitlök, chili och svartpeppar.',
        'Häll på Tomatsås à la Malix. Smula ner buljongtärningen och rör om. Lägg i majs om du vill.',
        'Låt allt puttra ihop och servera med pastan.'
      ]
    },
    'ugnsomelett-malix':{
      ingredients:[
        '4 ägg',
        '3 dl mjölk',
        '1 msk Maizena/majsstärkelse för glutenfri variant – eller 1½ msk vetemjöl om du tål gluten',
        '½ tsk salt',
        'svartpeppar efter smak',
        '1 msk smör till formen'
      ],
      steps:[
        'Sätt ugnen på cirka 200 grader och smörj en ugnsform.',
        'Värm mjölken. Gör en slät redning av 1 msk Maizena/majsstärkelse och lite kall mjölk för glutenfri variant – eller 1½ msk vetemjöl om du tål gluten. Vispa ner redningen i den varma mjölken och låt koka upp under omrörning. Ta kastrullen från värmen.',
        'Låt mjölkblandningen svalna något. Vispa upp äggen försiktigt med salt och peppar.',
        'Vispa ner mjölkblandningen i äggen.',
        'Häll i formen och grädda tills omeletten har stannat och blivit luftig.'
      ]
    },
    'veg-biffar':{
      servings:4,time:30,prepTime:10,cookTime:20,
      ingredients:[
        '690 g vita bönor, avrunnen vikt',
        '1 ägg',
        '2 msk potatismjöl',
        '1 msk spiskummin',
        '1 klyfta vitlök, krossad',
        'salt efter smak',
        'svartpeppar efter smak',
        'tzatziki till servering'
      ],
      steps:[
        'Spola hastigt av bönorna med kallt vatten och låt dem rinna av.',
        'Mixa bönorna i en matberedare eller med stavmixer.',
        'Tillsätt spiskummin, den krossade vitlöken, ägget och potatismjölet. Smaka av med salt och svartpeppar.',
        'Klicka ut rejäla matskedar av smeten i en het stekpanna och stek biffarna minst 4–5 minuter per sida.'
      ],
      serving:'Servera bönbiffarna nystekta med tzatziki.',
      tip:'Tzatziki finns som eget recept i appen.',
      doneness:'Biffarna är klara när de är genomvarma och har fått fin stekyta på båda sidor.'
    },
    'potatissallad-varm':{
      servings:4,time:25,prepTime:10,cookTime:15,
      ingredients:['cirka 800 g kokt potatis','1 rödlök','1 msk dijonsenap','cirka 2 msk olja','vinäger – lite i taget efter smak','örter','salt efter smak','svartpeppar efter smak'],
      steps:['Koka/dela potatisen och använd den varm eller ljummen.','Skiva rödlöken.','Blanda senap och olja och smaka fram vinägern lite i taget.','Vänd försiktigt ihop potatisen med dressingen, löken och örterna.'],
      serving:'Servera varm eller ljummen till fisk, kyckling eller bönbiffar.',
      tip:'Tillsätt vinägern lite i taget och smaka dig fram.'
    },
    'dillkött':{
      servings:4,time:120,prepTime:20,cookTime:100,
      ingredients:[
        'cirka 600 g grytkött',
        'morötter',
        '1 gul lök',
        'vatten och buljong till kokningen',
        'dill efter smak',
        'ättika – lite i taget efter smak',
        'Maizena/majsstärkelse till redning',
        'lite kallt vatten till redningen',
        'grädde – valfritt',
        'salt efter smak',
        'svartpeppar efter smak',
        'kokt potatis till servering'
      ],
      steps:[
        'Skala lök och morötter och skär dem.',
        'Lägg kött, lök och morötter i en gryta med vatten och buljong. Låt sjuda tills köttet är riktigt mört.',
        'Spara kokspadet och använd det som grund till såsen.',
        'Gör såsen av kokspadet. Grädde är valfritt.',
        'Rör ut Maizena i lite kallt vatten. Tillsätt redningen lite i taget och låt såsen koka upp.',
        'Smaksätt med dill. Tillsätt ättika lite i taget och smaka mellan gångerna. Smaka av med salt och svartpeppar.',
        'Lägg tillbaka kött och grönsaker och låt allt bli varmt tillsammans.'
      ],
      serving:'Servera med kokt potatis.',
      tip:'Smaka dig fram med ättikan. Börja med lite och tillsätt mer efter hand.',
      doneness:'Dillköttet är klart när köttet är riktigt mört, morötterna är mjuka, såsen är sammanhållen och smaken av dill och ättika är balanserad.'
    },
    'kottgrotta':{
      ingredients:[
        'efter behov: köttfärssmet',
        '200 g pikant- eller vitlöksfärskost/flødeost',
        '1 paket bacon',
        'valfri mängd valfria tillbehör'
      ]
    },
    'kalops':{
      servings:4,time:135,prepTime:15,cookTime:120,
      ingredients:[
        'cirka 600 g grytbitar av nötkött','1 gul lök','2–3 morötter','5 dl vatten','1 buljongtärning',
        'lite extra vatten vid behov under kokningen','8–10 hela kryddpepparkorn','2 lagerblad',
        'salt efter smak','svartpeppar efter smak','cirka 1–1,5 msk Maizena/majsstärkelse','lite kallt vatten till redningen'
      ],
      steps:[
        'Skala och hacka löken. Skala morötterna och skär dem i bitar.',
        'Bryn köttet tillsammans med löken så att köttet får färg.',
        'Lägg ner morötterna. Tillsätt 5 dl vatten, buljongtärningen, kryddpepparkornen och lagerbladen.',
        'Låt kalopsen sjuda under lock på låg värme i cirka 1½–2 timmar, tills köttet är riktigt mört. Kontrollera grytan ibland och tillsätt lite extra vatten om det behövs.',
        'När köttet är mört, smaka av med salt och svartpeppar.',
        'Rör ut Maizena i lite kallt vatten. Rör ner redningen lite i taget i grytan tills såsen har den konsistens du vill ha. All redning behöver inte användas.',
        'Låt kalopsen koka upp efter redningen. Kontrollera konsistensen och smaka av en sista gång.'
      ],
      serving:'Servera kalopsen med kokt potatis och rödbetor.',
      tip:'Låt köttet bestämma tiden. Efter ungefär 1½ timme kan man börja känna efter. Är köttet fortfarande segt får kalopsen sjuda vidare. Tillsätt lite mer vatten om det behövs.',
      doneness:'Kalopsen är klar när köttet är riktigt mört, morötterna är mjuka och såsen är lätt redd och sammanhållen.'
    },
    'kycklingmalix':{
      servings:4,time:45,prepTime:15,cookTime:30,
      ingredients:[
        '600 g kycklingfilé','cirka 1 dl Maizena/majsstärkelse','lite extra Maizena vid behov','rikligt med olja till tillagningen',
        '1 hel burk färdig satésås/jordnötssås','cirka 2,5 dl kokosgrädde','cirka 2 nävar jordnötter, grovt hackade',
        '1 förpackning grönkål eller svartkål','1 paket bacon','vitpeppar efter smak','salt endast vid behov'
      ],
      steps:[
        'Skär kycklingfilén i mindre strimlor. Lägg cirka 1 dl Maizena på en tallrik. Vänd och gnid in kycklingstrimlorna i Maizenan så att alla bitar får ett ordentligt lager. Använd lite extra Maizena om det behövs.',
        'Skär baconet i bitar och stek det i en panna. Låt baconet få färg och släppa sitt fett. Lägg grönkålen eller svartkålen i samma panna och stek tillsammans tills kålen har mjuknat men fortfarande har lite struktur. Krydda med vitpeppar. Smaka innan du eventuellt tillsätter salt. Ställ åt sidan och håll varmt.',
        'Värm den färdiga satésåsen tillsammans med cirka 2,5 dl kokosgrädde i en kastrull. Grovhacka cirka två nävar jordnötter, rör ner dem och låt såsen bli genomvarm. Håll den varm på låg värme.',
        'Hetta upp rikligt med olja i en stekpanna, nästan som vid grundfritering. Tillaga kycklingen i omgångar så att pannan inte blir överfull.',
        'Stek kycklingstrimlorna tills de har fått en krispig yta och är helt genomstekta. Ta upp den färdiga omgången och lägg åt sidan medan nästa tillagas.',
        'Servera den nygjorda krispiga kycklingen tillsammans med den varma jordnötssåsen och grönkålen eller svartkålen med bacon.'
      ],
      serving:'Servera den nygjorda krispiga kycklingen tillsammans med den varma jordnötssåsen och grönkålen eller svartkålen med bacon.',
      swaps:'Vill du ha kålen mer såsig kan du tillsätta cirka 1–2 dl grädde när kålen har stekt tillsammans med baconet. Låt grädden koka ihop en kort stund med kålen och baconet.',
      tip:'Stek kycklingen i omgångar. Fyller du pannan med för mycket kyckling på en gång blir det svårare att få den krispiga ytan. Låt hellre varje omgång få ordentligt med plats.',
      doneness:'Kycklingen ska vara krispig utanpå och helt genomstekt. Jordnötssåsen ska vara varm och sammanhållen, och kålen ska ha mjuknat men fortfarande ha lite struktur.'
    },
    'stektkalbacon':{
      servings:4,time:20,prepTime:5,cookTime:15,
      ingredients:['1 förpackning grönkål eller svartkål','1 paket bacon','vitpeppar efter smak','salt endast vid behov'],
      steps:[
        'Skär baconet i bitar.',
        'Stek baconet i en stekpanna tills det börjar få färg och har släppt sitt fett.',
        'Lägg grönkålen eller svartkålen i samma panna. Stek kålen tillsammans med baconet och låt den ta smak av baconfettet.',
        'Fortsätt steka tills kålen har mjuknat men fortfarande har lite struktur.',
        'Krydda med vitpeppar. Smaka innan du tillsätter salt – baconet ger redan mycket sälta.'
      ],
      serving:'Servera varmt som tillbehör till många olika rätter.',
      swaps:'Vill du ha kålen mer såsig kan du tillsätta cirka 1–2 dl grädde. Låt grädden koka ihop en kort stund med kålen och baconet.',
      tip:'Smaka innan du saltar. Baconet ger både fett, smak och sälta till kålen, så ofta behövs inget extra salt alls.',
      doneness:'Kålen ska ha mjuknat men fortfarande ha lite struktur, och baconet ska vara stekt och ha fått färg. Gör du den såsiga varianten ska grädden ha kokat ihop med kålen och baconet.'
    },
    'köttfärspaj':{
      servings:4,
      time:85,
      prepTime:20,
      cookTime:35,
      ingredients:[
        '2,5 dl glutenfri mjölmix, till exempel Leilas',
        '1 krm salt',
        '125 g smör',
        '2 msk kallt vatten, lite mer vid behov',
        '500 g köttfärs',
        '1 st gul lök, hackad',
        '1 msk tomatpuré',
        '1 buljongtärning, gärna umami',
        '1 dl mjölk',
        'cirka 1,5 msk majsstärkelse',
        'svartpeppar efter smak',
        'salt vid behov efter avsmakning',
        '2 st tomater, skivade',
        '1 st gul lök, skuren i tunna ringar',
        'cirka 75 g riven ost'
      ],
      steps:[
        'Blanda glutenfri mjölmix och salt. Arbeta in smöret. Tillsätt 2 msk kallt vatten och arbeta snabbt ihop till en deg. Om degen fortfarande är för smulig, tillsätt bara lite mer vatten tills den precis går ihop. Låt vila kallt i minst 30 minuter.',
        'Sätt ugnen på 200 °C över-/undervärme. Tryck ut degen i en pajform och nagga botten. Förgrädda cirka 10 minuter.',
        'Stek köttfärsen tillsammans med den hackade löken. Rör ner tomatpuré och buljongtärning. Krydda med svartpeppar och smaka av med salt först efter att buljongen kommit i.',
        'Rör ut majsstärkelsen i mjölken. Häll ner blandningen i köttfärsen och låt fyllningen tjockna. Den ska vara sammanhållen och krämig, inte rinnig.',
        'Lägg köttfärsfyllningen i det förgräddade pajskalet.',
        'Lägg på skivade tomater och lökringar. Strö över den rivna osten.',
        'Grädda ytterligare cirka 20–25 minuter, tills pajskalet är färdiggräddat och osten har smält och fått fin färg.'
      ],
      oven:'200 °C över-/undervärme',
      tip:'Paj är bra matlådemat och smakar gott även dagen efter.',
      serving:'Servera gärna köttfärspajen med en grönsallad eller pizzasallad.',
      timeNote:'30 minuters vilotid för pajdegen ingår i totaltiden.',
      doneness:'Pajen är klar när pajskalet är färdiggräddat, fyllningen är varm och fast och osten har smält och fått fin färg.'
    },
    'spenatpaj':{
      servings:4,
      time:90,
      prepTime:20,
      cookTime:40,
      ingredients:[
        '2,5 dl glutenfri mjölmix, till exempel Leilas',
        '1 krm salt',
        '125 g smör',
        '2 msk kallt vatten, lite mer vid behov',
        '300 g spenat – färsk eller fryst fungerar',
        '150 g fetaost',
        '1 st gul lök',
        '3 st ägg',
        '2,5 dl mjölk',
        'krydda efter smak'
      ],
      steps:[
        'Blanda glutenfri mjölmix och salt. Arbeta in smöret. Tillsätt 2 msk kallt vatten och arbeta snabbt ihop till en deg. Om den fortfarande är för smulig, tillsätt bara lite mer vatten tills den precis går ihop. Låt vila kallt i minst 30 minuter.',
        'Sätt ugnen på 200 °C över-/undervärme. Tryck ut degen i en pajform och nagga botten. Förgrädda cirka 10 minuter.',
        'Hacka löken och fräs den tillsammans med spenaten. Färsk spenat får sjunka ihop. Fryst spenat ska bli genomvarm och överflödig vätska ska få ånga bort. Krydda efter smak.',
        'Fördela spenat och lök i pajskalet och smula över 150 g fetaost.',
        'Vispa ihop 3 ägg och 2,5 dl mjölk och häll äggstanningen jämnt över fyllningen.',
        'Grädda cirka 25–30 minuter, tills äggstanningen har stannat även i mitten och pajen fått fin färg.'
      ],
      oven:'200 °C över-/undervärme',
      serving:'Servera gärna med en enkel grönsallad eller pizzasallad.',
      tip:'Både färsk och fryst spenat fungerar. Använder du fryst spenat, låt överflödig vätska ånga bort så att pajen inte blir blöt.',
      timeNote:'30 minuters vilotid för pajdegen ingår i totaltiden.',
      doneness:'Pajen är klar när äggstanningen har stannat även i mitten, pajskalet är färdiggräddat och pajen har fått fin färg.'
    },
    'malix-appelpaj-pa-en-hoft':{
      servings:4,
      time:50,
      prepTime:15,
      cookTime:35,
      ingredients:[
        'ca 300 g smör',
        'ca 1,5 dl socker',
        'rikligt med havregryn',
        'glutenfritt mjöl, lite i taget tills degen går ihop',
        'vaniljsocker om du vill',
        'kokos om du tycker om det',
        '5–6 äpplen, beroende på storlek och vad du har hemma',
        'kanel efter smak',
        'socker efter smak'
      ],
      oven:'175 °C över-/undervärme',
      serving:'Gott som det är eller med vaniljsås, glass eller grädde.',
      tip:'Ser äpplena lite tråkiga ut? Gör en paj av dem. De behöver inte vara perfekta för att bli goda i en paj.',
      swaps:'Päron kan användas ungefär som äpplen med kanel och lite socker efter smak, men päronen ska fortfarande vara fina och fräscha. För blåbär eller rabarber används så mycket att det blir ett ordentligt lager. Sockra efter smak. Vid saftig fyllning används lite potatismjöl.',
      steps:[
        'Sätt ugnen på 175 °C över-/undervärme.',
        'Smält smöret i en kastrull.',
        'Blanda ner socker och rikligt med havregryn. Tillsätt glutenfritt mjöl lite i taget tills allt går ihop till en mjuk deg som går att platta ut. Degen ska hålla ihop men inte bli hård. Tillsätt vaniljsocker och kokos om du vill.',
        'Tryck ut en del av degen i botten av pajformen. Spara resten till toppen.',
        'För äppelversionen: skala och klyfta 5–6 äpplen. Lägg dem i en påse med kanel och socker efter smak och skaka så att äppelbitarna täcks. Fördela över pajbotten.',
        'För blåbär/rabarber: fördela fyllningen över botten och sockra efter smak. Pudra potatismjölet lätt över fyllningen. Lägg potatismjölet i en tesil och sikta ett tunt, jämnt lager över bären eller rabarbern.',
        'Lägg, tryck eller smula resten av degen över fyllningen.',
        'Grädda mitt i ugnen cirka 30–45 minuter. Låt framför allt färgen avgöra när pajen är färdig.'
      ],
      doneness:'Pajen är klar när pajskalet och degen ovanpå har blivit gyllenbruna. Fyllningen ska vara varm och inte safta sig alltför mycket.'
    },
    'fruktsoppa-klassisk':{
      servings:4,
      time:40,
      prepTime:10,
      cookTime:30,
      ingredients:[
        '250 g blandad torkad frukt, till exempel katrinplommon, aprikoser, russin och äpple',
        '1,25 liter vatten',
        '1 kanelstång',
        'socker efter smak',
        'cirka 2 msk potatismjöl',
        'lite kallt vatten till redningen'
      ],
      doneness:'Fruktbitarna ska vara mjuka men fortfarande finnas kvar. Vätskan ska vara lätt redd, simmig och krämig – inte mixad och inte tjock som kräm.'
    },
    'gulaschsoppa':{
      time:90,
      prepTime:15,
      cookTime:75,
      ingredients:[
        '500 g nötkött i grytbitar – eller',
        '500 g köttfärs',
        '800 g potatis',
        '2 st paprika',
        '1 st gul lök',
        '2 st vitlöksklyftor',
        '400 g tomat',
        '1 tsk paprikapulver',
        '5 dl buljong'
      ],
      steps:[
        'Bryn nötköttet och löken. Använder du köttfärs, bryn färsen tills den är genomstekt.',
        'Tillsätt paprika, kryddor och tomat.',
        'Häll på buljongen. Använder du nötkött i grytbitar, låt köttet sjuda tills det börjar bli mört innan potatisen läggs i. Använder du köttfärs kan potatisen läggas i direkt.',
        'Koka tills potatisen är mjuk och, om du använder grytbitar, köttet är mört.'
      ],
      doneness:'Potatisen ska vara mjuk. Använder du nötkött i grytbitar ska köttet vara genomlagat och mört. Använder du köttfärs ska färsen vara helt genomstekt.'
    },
    'brödpudding-mat':{
      time:35,
      prepTime:10,
      cookTime:25,
      ingredients:[
        '8 skivor torrt bröd',
        '4 st ägg',
        '3 dl mjölk',
        '150 g ost',
        'cirka 2–3 dl tomat eller andra grönsaker'
      ],
      steps:[
        'Riv eller bryt brödet i mindre bitar och lägg det i en ugnsform.',
        'Fördela ost och tomat eller andra grönsaker över brödet. Låt mycket blöta grönsaker rinna av först.',
        'Vispa ihop ägg och mjölk och häll äggstanningen jämnt över brödet.',
        'Gratinera tills äggstanningen har stannat även i mitten och ytan fått lite färg.'
      ],
      doneness:'Brödpuddingen är klar när äggstanningen har stannat även i mitten och ytan fått lite färg.'
    },
    'pasta-tonfisk':{
      time:20,
      prepTime:5,
      cookTime:15,
      ingredients:[
        '320 g pasta',
        '1 burk tonfisk, avrunnen',
        '1 st citron',
        '2 st vitlöksklyftor',
        '2 dl crème fraîche eller tjock yoghurt',
        '250 g ärtor'
      ],
      steps:[
        'Koka pasta och ärtor.',
        'Rör ihop tonfisk med citron, vitlök och crème fraîche eller yoghurt.',
        'Vänd ner den varma pastan och ärtorna i tonfiskblandningen.',
        'Smaka av med peppar.'
      ],
      doneness:'Pastan och ärtorna ska vara kokta och allt ska vara jämnt blandat till en krämig pasta.'
    },
    'tonfiskmacka':{
      time:10,
      prepTime:10,
      cookTime:0,
      ingredients:[
        '2 burkar tonfisk, avrunna',
        '1 dl tjock yoghurt – eller',
        '0,5 dl majonnäs',
        '0,5 st citron',
        'gurka eller sallad till topping',
        '8 skivor bröd'
      ],
      steps:[
        'Låt tonfisken rinna av och blanda den med yoghurt eller majonnäs och saften från citronen.',
        'Fördela tonfiskröran på brödet.',
        'Toppa med gurka eller sallad.'
      ],
      doneness:'Röran ska vara jämnt blandad och krämig men inte rinnig.'
    },
    'carbonara':{
      time:25,
      prepTime:10,
      cookTime:15,
      ingredients:[
        '320 g pasta',
        '1 st gul lök',
        '200 g bacon',
        '2 dl grädde',
        '2 st ägg',
        '0,5 tsk svartpeppar',
        '100 g parmesan'
      ],
      steps:[
        'Koka pastan enligt anvisningen på förpackningen.',
        'Hacka löken och skär baconet i bitar. Stek lök och bacon i en stor stekpanna tills löken mjuknat och baconet fått färg.',
        'Vänd ner den kokta pastan i stekpannan. Häll över grädden, tillsätt svartpeppar och låt allt bli varmt.',
        'Vispa upp äggen lätt och rör ner dem i pastan. Fortsätt röra på svag värme tills ägget har tillagats och såsen blivit lätt grynig och krämig.',
        'Ta från värmen och strö över parmesan.'
      ],
      tip:'Spara lite pastavatten och späd med en skvätt om carbonaran blir för tjock.',
      swaps:'Parmesan kan bytas mot annan lagrad hårdost.',
      doneness:'Carbonaran är klar när allt är genomvarmt, ägget har tillagats och grädden och ägget bildat en lätt grynig, krämig sås runt pastan.'
    },
    'pastamurklor':{
      time:30,
      prepTime:10,
      cookTime:20,
      ingredients:[
        '320 g pasta',
        '1 burk konserverade murklor, väl avrunna',
        '1 st gul lök',
        '1–2 st vitlöksklyftor',
        '2–3 dl grädde',
        'cirka 75 g Riddarost eller parmesan',
        'grovkornig svartpeppar efter smak',
        'salt efter smak'
      ],
      steps:[
        'Koka pastan enligt anvisningen på förpackningen.',
        'Hacka lök och vitlök och låt murklorna rinna av ordentligt.',
        'Stek lök, vitlök och murklor i en stor stekpanna.',
        'Vänd ner den färdigkokta pastan och tillsätt först cirka 2 dl grädde.',
        'Krydda med salt och grovkornig svartpeppar. Tillsätt mer grädde vid behov, upp till cirka 3 dl.',
        'Tillsätt Riddarost eller parmesan och vänd runt tills osten har smält och pastan blivit varm och krämig.'
      ],
      tip:'Riddarost eller parmesan fungerar bra. Väljer du en mer smakrik ost kan du ta lite mindre så att osten inte tar över smaken från murklorna.',
      serving:'Något grönt passar bra till. Spenat, grönkål eller svartkål kan också vändas ner i pastan som variation.',
      swaps:'Murklor kan bytas mot annan matsvamp. Om den varianten ska göras matigare kan tunt strimlad benfri kotlett, oxfilé eller entrecôte användas som tillägg. Annan ost fungerar också. En mer smakrik ost används i mindre mängd så att den inte tar över svampsmaken.',
      doneness:'Pastan ska vara varm och krämig, osten ska ha smält och murklor och lök ska vara jämnt fördelade i pastan.'
    },
    'pulledpork':{
      time:480,
      prepTime:10,
      cookTime:470,
      ingredients:[
        '600 g fläskkött för långkok',
        '1 st gul lök',
        '2 st vitlöksklyftor',
        '1 dl cola',
        'kryddor efter smak',
        '1 dl BBQ-sås eller ketchup'
      ],
      steps:[
        'Lägg fläskkött, lök och vitlök i slowcookern. Tillsätt cola, kryddor och BBQ-sås eller ketchup.',
        'Tillaga på låg värme i cirka 8 timmar, tills köttet är genomlagat och så mört att det lätt går att dra isär.',
        'Dra isär köttet med två gafflar och blanda det med såsen i slowcookern.'
      ],
      doneness:'Köttet ska vara genomlagat och så mört att det lätt går att dra isär med två gafflar.'
    },
    'quesadilla-rester':{
      time:15,
      prepTime:5,
      cookTime:10,
      ingredients:[
        '4 st tortillas',
        '150 g ost',
        'cirka 3 dl valfri fyllning, till exempel tillagad kyckling, bönor eller grönsaker'
      ],
      tip:'Lite av mycket räcker fint i en quesadilla.',
      steps:[
        'Fördela ost och valfri fyllning på ena halvan av varje tortilla.',
        'Vik tortillas över fyllningen.',
        'Stek på båda sidor tills tortillan fått färg, osten smält och fyllningen blivit varm.'
      ],
      doneness:'Quesadillan är klar när tortillan fått färg på båda sidor, osten har smält och fyllningen är varm.'
    },
    'kyckling-senap':{ingredients:[
      '600 g kyckling',
      '1 st gul lök',
      '1 msk dijonsenap',
      '1 tsk dragon',
      '3 dl grädde',
      '5 dl buljong',
      '3 dl okokt ris – eller',
      '800 g potatis'
    ]},
    'kyckling-pesto':{ingredients:[
      '600 g kyckling',
      'efter behov: pesto',
      '400 g tomater',
      '150 g mozzarella eller ost',
      '320 g pasta – eller',
      '800 g potatis'
    ]},
    'falukorv-ugn':{ingredients:[
      '500 g falukorv',
      '400 g tomat',
      '1 msk senap',
      '150 g ost',
      '4 portioner potatismos – eller',
      '800 g potatis',
      '300 g grönsaker'
    ]},
    'kycklingwok':{ingredients:[
      '600 g kyckling',
      '300 g wokgrönsaker',
      '2 msk soja',
      '2 st vitlöksklyftor',
      '1 msk ingefära',
      '3 dl okokt ris – eller',
      '300 g nudlar'
    ]},
    'torsk-tomat':{ingredients:[
      '600 g torsk eller annan vit fisk',
      '400 g krossade tomater',
      '2 st vitlöksklyftor',
      '1 st gul lök',
      '2 msk örter',
      '800 g potatis – eller',
      '3 dl okokt ris'
    ]},
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
    if(
      s==='bostongurka' ||
      s==='kryddpeppar' ||
      s==='pikant- eller vitlöksfärskost/flødeost' ||
      (r.id==='kycklingmalix' && s==='majsstärkelse') ||
      (r.id==='malix-appelpaj-pa-en-hoft' && s.startsWith('lite potatismjöl till saftig fyllning'))
    )return `efter behov: ${text}`;
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
    const n=lower(r.name),
          all=lower((r.ingredients||[]).join(' ')),
          steps=lower((r.steps||[]).join(' ')),
          text=n+' '+all,
          cooks=/\b(kok\w*|stek\w*|bryn\w*|fräs\w*|bak\w*|ugnsbak\w*|grädd\w*|sjud\w*|tillag\w*|värm\w*|rost\w*|gratin\w*)\b/.test(steps);
    if(/\bkyckling\w*\b/.test(text)&&/\b(stek\w*|bryn\w*|tillag\w*|ugnsbak\w*|sjud\w*)\b/.test(steps)&&!/\bgenomlagad kyckling\b/.test(all))return 'Kycklingen ska vara helt genomlagad utan rå kärna. Med termometer: minst 72 °C i den tjockaste delen.';
    if(/\b(köttfärs\w*|blandfärs\w*|nötfärs\w*|färs|köttbull\w*|pannbiff\w*|järp\w*|köttfärslimpa\w*)\b/.test(text)&&/\b(stek\w*|bryn\w*|tillag\w*|ugnsbak\w*|grädd\w*|genomlag\w*|genomstekt\w*)\b/.test(steps))return 'Färsrätter ska vara helt genomlagade. Med termometer: minst 70 °C i mitten.';
    if(/\b(fisk\w*|lax\w*|torsk\w*|sej\w*)\b/.test(text)&&/\b(stek\w*|bak\w*|ugnsbak\w*|tillag\w*|sjud\w*|grädd\w*)\b/.test(steps))return 'Fisken ska vara genomlagad och lätt dela sig i flagor. Följ även eventuell anvisning på förpackningen.';
    if(!cooks)return '';
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