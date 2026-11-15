import fs from 'node:fs/promises';

const API_BASE='https://dataportal.livsmedelsverket.se/livsmedel/api/v1';
const DATASET_VERSION='2026-07-01';
const OUTPUT='nutrition-data-v1.js';
const CONCURRENCY=16;
const PAGE_SIZE=200;

const nutrientDefs=[
  ['ENERC','kcal','Energi'],['ENERC','kJ','Energi'],['PROT','g','Protein'],['FAT','g','Fett'],
  ['CHO','g','Kolhydrater'],['SUGAR','g','Sockerarter'],['FIBT','g','Fibrer'],
  ['FASAT','g','Mättat fett'],['FAMS','g','Enkelomättat fett'],['FAPU','g','Fleromättat fett'],
  ['NACL','g','Salt'],['CA','mg','Kalcium'],['FE','mg','Järn'],['MG','mg','Magnesium'],
  ['K','mg','Kalium'],['ZN','mg','Zink'],['VITA','RE/µg','Vitamin A'],['VITD','µg','Vitamin D'],
  ['VITB12','µg','Vitamin B12'],['VITC','mg','Vitamin C'],['FOL','µg','Folat']
];
const allowed=new Set(nutrientDefs.map(([code,unit])=>`${code}:${unit}`));

async function fetchJson(url,attempt=1){
  const response=await fetch(url,{headers:{accept:'application/json','user-agent':'malix-app-nutrition-import/1.0'}});
  if(response.ok)return response.json();
  if(attempt<5&&(response.status===429||response.status>=500)){
    await new Promise(resolve=>setTimeout(resolve,attempt*1500));
    return fetchJson(url,attempt+1);
  }
  throw new Error(`SLV request failed ${response.status}: ${url}`);
}

async function loadFoods(){
  const foods=[];
  let offset=0,total=Infinity;
  while(offset<total){
    const page=await fetchJson(`${API_BASE}/livsmedel?offset=${offset}&limit=${PAGE_SIZE}&sprak=1`);
    const rows=Array.isArray(page?.livsmedel)?page.livsmedel:[];
    total=Number(page?._meta?.totalRecords);
    if(!Number.isFinite(total))total=offset+rows.length;
    foods.push(...rows);
    if(!rows.length)break;
    offset+=rows.length;
  }
  return foods;
}

async function mapPool(rows,worker){
  const out=new Array(rows.length);
  let next=0;
  async function run(){
    for(;;){
      const index=next++;
      if(index>=rows.length)return;
      out[index]=await worker(rows[index],index);
    }
  }
  await Promise.all(Array.from({length:Math.min(CONCURRENCY,rows.length)},run));
  return out;
}

function normalizeNutrient(row){
  const code=String(row?.euroFIRkod||'').trim();
  const unit=String(row?.enhet||'').trim().replaceAll('μ','µ');
  const key=`${code}:${unit}`;
  if(!allowed.has(key))return null;
  const value=Number(row?.varde);
  if(!Number.isFinite(value))return null;
  const result={eurofirCode:code,unit,value};
  const valueTypeCode=String(row?.vardetypkod||'').trim();
  if(valueTypeCode)result.valueTypeCode=valueTypeCode;
  return result;
}

async function enrichFood(food){
  const foodNumber=Number(food?.nummer);
  if(!Number.isInteger(foodNumber))throw new Error('SLV food without valid nummer');
  const rows=await fetchJson(`${API_BASE}/livsmedel/${foodNumber}/naringsvarden?sprak=1`);
  const nutrients=(Array.isArray(rows)?rows:[]).map(normalizeNutrient).filter(Boolean);
  nutrients.sort((a,b)=>a.eurofirCode.localeCompare(b.eurofirCode)||a.unit.localeCompare(b.unit));
  return {
    foodNumber,
    name:String(food?.namn||'').trim(),
    type:String(food?.livsmedelsTyp||'').trim(),
    sourceRecordVersion:String(food?.version||'').trim()||null,
    nutrients
  };
}

function generateModule(foods){
  const source={
    name:'Livsmedelsverkets Livsmedelsdatabas',
    version:DATASET_VERSION,
    license:'CC BY 4.0',
    url:'https://www.livsmedelsverket.se/om-oss/psidata/livsmedelsdatabasen',
    licenseUrl:'https://creativecommons.org/licenses/by/4.0/'
  };
  return `(() => {
  'use strict';
  const datasetVersion=${JSON.stringify(DATASET_VERSION)};
  const source=Object.freeze(${JSON.stringify(source,null,2)});
  const nutrients=Object.freeze(${JSON.stringify(nutrientDefs.map(([eurofirCode,unit,label])=>({key:`${eurofirCode}:${unit}`,eurofirCode,unit,label})),null,2)}.map(Object.freeze));
  const rawFoods=${JSON.stringify(foods,null,2)};
  const foods=Object.freeze(rawFoods.map(food=>Object.freeze({...food,nutrients:Object.freeze((food.nutrients||[]).map(Object.freeze))})));
  const normalize=value=>String(value||'').toLocaleLowerCase('sv-SE').normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').replace(/[^a-z0-9åäö ]/gi,' ').replace(/\\s+/g,' ').trim();
  const byNumber=new Map(foods.map(food=>[String(food.foodNumber),food]));
  function search(query,limit=12){
    const q=normalize(query);if(q.length<2)return[];
    return foods.map(food=>{const name=normalize(food.name);let score=99;if(name===q)score=0;else if(name.startsWith(q))score=1;else if(name.includes(q))score=2;return score<99?{food,score}:null})
      .filter(Boolean).sort((a,b)=>a.score-b.score||a.food.name.localeCompare(b.food.name,'sv-SE')).slice(0,limit).map(x=>x.food);
  }
  window.MalixNutritionDataV1=Object.freeze({
    datasetVersion,source,nutrients,foods,datasetScope:'slv-public-foods-reduced-21-v1',
    search,
    getFood:foodNumber=>byNumber.get(String(foodNumber))||null,
    nutrientKey:(code,unit)=>\`\${code}:\${unit}\`
  });
})();
`;
}

const foods=await loadFoods();
if(foods.length<2000)throw new Error(`Expected broad SLV dataset, got only ${foods.length} foods`);
const enriched=await mapPool(foods,enrichFood);
enriched.sort((a,b)=>a.foodNumber-b.foodNumber);
await fs.writeFile(OUTPUT,generateModule(enriched),'utf8');

const withAny=enriched.filter(food=>food.nutrients.length>0).length;
const withoutAny=enriched.length-withAny;
console.log(JSON.stringify({
  datasetVersion:DATASET_VERSION,
  foods:enriched.length,
  foodsWithSelectedNutrients:withAny,
  foodsWithoutSelectedNutrients:withoutAny,
  selectedNutrientRepresentations:nutrientDefs.length,
  output:OUTPUT
},null,2));
