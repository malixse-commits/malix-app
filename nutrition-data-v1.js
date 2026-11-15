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
  ]);
  const normalize=value=>String(value||'').toLocaleLowerCase('sv-SE').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9åäö ]/gi,' ').replace(/\s+/g,' ').trim();
  const byNumber=new Map(foods.map(food=>[String(food.foodNumber),food]));
  function search(query,limit=12){
    const q=normalize(query);if(q.length<2)return[];
    return foods.map(food=>{const name=normalize(food.name);let score=99;if(name===q)score=0;else if(name.startsWith(q))score=1;else if(name.includes(q))score=2;return score<99?{food,score}:null})
      .filter(Boolean).sort((a,b)=>a.score-b.score||a.food.name.localeCompare(b.food.name,'sv-SE')).slice(0,limit).map(x=>x.food);
  }
  const api=Object.freeze({
    datasetVersion,source,nutrients,foods,
    search,
    getFood:foodNumber=>byNumber.get(String(foodNumber))||null,
    nutrientKey:(code,unit)=>`${code}:${unit}`
  });
  window.MalixNutritionDataV1=api;
})();