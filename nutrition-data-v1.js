(() => {
  'use strict';
  const datasetVersion='2026-07-01';
  const source=Object.freeze({
    name:'Livsmedelsverkets Livsmedelsdatabas',
    version:datasetVersion,
    license:'CC BY 4.0',
    url:'https://www.livsmedelsverket.se/om-oss/psidata/livsmedelsdatabasen',
    licenseUrl:'https://creativecommons.org/licenses/by/4.0/'
  });
  const nutrients=Object.freeze([
    ['ENERC','kcal','Energi'],['ENERC','kJ','Energi'],['PROT','g','Protein'],['FAT','g','Fett'],
    ['CHO','g','Kolhydrater'],['SUGAR','g','Sockerarter'],['FIBT','g','Fibrer'],
    ['FASAT','g','Mättat fett'],['FAMS','g','Enkelomättat fett'],['FAPU','g','Fleromättat fett'],
    ['NACL','g','Salt'],['CA','mg','Kalcium'],['FE','mg','Järn'],['MG','mg','Magnesium'],
    ['K','mg','Kalium'],['ZN','mg','Zink'],['VITA','RE/µg','Vitamin A'],['VITD','µg','Vitamin D'],
    ['VITB12','µg','Vitamin B12'],['VITC','mg','Vitamin C'],['FOL','µg','Folat']
  ].map(([eurofirCode,unit,label])=>Object.freeze({key:`${eurofirCode}:${unit}`,eurofirCode,unit,label})));
  const n=(eurofirCode,unit,value)=>Object.freeze({eurofirCode,unit,value});
  const foods=Object.freeze([
    Object.freeze({
      foodNumber:320,name:'Avokado',type:'analyserat',
      nutrients:Object.freeze([
        n('ENERC','kcal',197),n('ENERC','kJ',825),n('FAT','g',19.6),n('PROT','g',1.9),n('CHO','g',1.7),
        n('SUGAR','g',0.5),n('FIBT','g',4.8),n('FASAT','g',3.4),n('FAMS','g',12.7),n('FAPU','g',2.6),
        n('NACL','g',0),n('CA','mg',14),n('FE','mg',0.3),n('MG','mg',32),n('K','mg',600),n('ZN','mg',0.4),
        n('VITA','RE/µg',6.2),n('VITD','µg',0),n('VITB12','µg',0),n('VITC','mg',3.3),n('FOL','µg',116)
      ])
    }),
    Object.freeze({
      foodNumber:1225,name:'Ägg rått',type:'analyserat',
      nutrients:Object.freeze([
        n('ENERC','kcal',136),n('ENERC','kJ',568),n('FAT','g',9.8),n('PROT','g',12.1),n('CHO','g',0),
        n('SUGAR','g',0.3),n('FIBT','g',0),n('FASAT','g',2.6),n('FAMS','g',3.9),n('FAPU','g',1.5),
        n('NACL','g',0.3),n('CA','mg',48),n('FE','mg',1.8),n('MG','mg',12),n('K','mg',140),n('ZN','mg',1.3),
        n('VITA','RE/µg',76.6),n('VITD','µg',2.13),n('VITB12','µg',1.68),n('VITC','mg',0),n('FOL','µg',96)
      ])
    }),
    Object.freeze({
      foodNumber:588,name:'Äpple m. skal',type:'analyserat',
      nutrients:Object.freeze([
        n('ENERC','kcal',48),n('ENERC','kJ',200),n('FAT','g',0.1),n('PROT','g',0),n('CHO','g',10.6),
        n('SUGAR','g',9.9),n('FIBT','g',2.3),n('FASAT','g',0),n('FAMS','g',0),n('FAPU','g',0),
        n('NACL','g',0),n('CA','mg',3),n('FE','mg',0.1),n('MG','mg',4),n('K','mg',62),n('ZN','mg',0),
        n('VITA','RE/µg',2),n('VITD','µg',0),n('VITB12','µg',0),n('VITC','mg',7.2),n('FOL','µg',2.9)
      ])
    })
  ,
    Object.freeze({
      foodNumber:553,name:'Banan',type:'analyserat',
      nutrients:Object.freeze([
        n('ENERC','kcal',95),n('ENERC','kJ',396),n('FAT','g',0.1),n('PROT','g',1.1),n('CHO','g',21.3),
        n('SUGAR','g',18.1),n('FIBT','g',1.4),n('FASAT','g',0),n('FAMS','g',0),n('FAPU','g',0),
        n('NACL','g',0),n('CA','mg',6),n('FE','mg',0),n('MG','mg',27),n('K','mg',330),n('ZN','mg',0.2),
        n('VITA','RE/µg',2.2),n('VITD','µg',0),n('VITB12','µg',0),n('VITC','mg',9),n('FOL','µg',14)
      ])
    }),
    Object.freeze({
      foodNumber:124,name:'Yoghurt naturell fett 3% berikad',type:'analyserat',
      nutrients:Object.freeze([
        n('ENERC','kcal',56),n('ENERC','kJ',234),n('FAT','g',2.7),n('PROT','g',3.4),n('CHO','g',4.5),
        n('SUGAR','g',2.9),n('FIBT','g',0),n('FASAT','g',1.8),
        n('NACL','g',0.1),n('CA','mg',116),n('FE','mg',0.1),n('MG','mg',11),n('K','mg',162),n('ZN','mg',1.6),
        n('VITA','RE/µg',24.1),n('VITD','µg',1),n('VITB12','µg',0.21),n('FOL','µg',13.8)
      ])
    }),
    Object.freeze({
      foodNumber:5136,name:'Potatis höst kokt u. salt',type:'analyserat',
      nutrients:Object.freeze([
        n('ENERC','kcal',85),n('ENERC','kJ',355),n('FAT','g',0.1),n('PROT','g',1.9),n('CHO','g',17.8),
        n('FIBT','g',2.1),n('VITA','RE/µg',0.4),n('VITD','µg',0)
      ])
    }),
    Object.freeze({
      foodNumber:1170,name:'Kyckling bröstfilé färsk stekt u. skinn',type:'analyserat',
      nutrients:Object.freeze([
        n('ENERC','kcal',116),n('ENERC','kJ',484),n('FAT','g',2.5),n('PROT','g',23),n('CHO','g',0),
        n('SUGAR','g',0),n('FIBT','g',0),n('FASAT','g',0.7),n('NACL','g',0.2),
        n('CA','mg',5),n('FE','mg',0.4),n('MG','mg',41),n('K','mg',374),n('ZN','mg',0.8),
        n('VITA','RE/µg',11),n('VITD','µg',0.41)
      ])
    }),
    Object.freeze({
      foodNumber:210,name:'Bröd fullkorn graham m. mjölk fibrer ca 5%',type:'analyserat',
      nutrients:Object.freeze([
        n('ENERC','kcal',279),n('ENERC','kJ',1167),n('FAT','g',5.2),n('PROT','g',8.9),n('CHO','g',46.1),
        n('SUGAR','g',1.9),n('FIBT','g',4.9),n('FASAT','g',1),n('FAMS','g',1.6),n('FAPU','g',1),
        n('NACL','g',1.2),n('CA','mg',60),n('FE','mg',2.8),n('MG','mg',75),n('K','mg',270),n('ZN','mg',1.9),
        n('VITA','RE/µg',46.9),n('VITD','µg',0.44),n('VITB12','µg',0.1),n('VITC','mg',0),n('FOL','µg',27.2)
      ])
    }),
    Object.freeze({
      foodNumber:702,name:'Havregryn fullkorn',type:'analyserat',
      nutrients:Object.freeze([])
    }),
    Object.freeze({
      foodNumber:150,name:'Mellanmjölk fett 1,5% berikad',type:'analyserat',
      nutrients:Object.freeze([])
    }),
  ]);
  const normalize=value=>String(value||'').toLocaleLowerCase('sv-SE').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9åäö ]/gi,' ').replace(/\s+/g,' ').trim();
  const byNumber=new Map(foods.map(food=>[String(food.foodNumber),food]));
  function search(query,limit=12){
    const q=normalize(query);if(q.length<2)return[];
    return foods.map(food=>{const name=normalize(food.name);let score=99;if(name===q)score=0;else if(name.startsWith(q))score=1;else if(name.includes(q))score=2;return score<99?{food,score}:null})
      .filter(Boolean).sort((a,b)=>a.score-b.score||a.food.name.localeCompare(b.food.name,'sv-SE')).slice(0,limit).map(x=>x.food);
  }
  const api=Object.freeze({
    datasetVersion,source,nutrients,foods,datasetScope:'reduced-common-foods-v1',
    search,
    getFood:foodNumber=>byNumber.get(String(foodNumber))||null,
    nutrientKey:(code,unit)=>`${code}:${unit}`
  });
  window.MalixNutritionDataV1=api;
})();