const KEY='malix-app-v1';
const empty={color:'',food:[],movement:[],sleep:[],calendar:[],cleaning:[],reflection:[]};
let data=load();
function load(){try{return {...empty,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{return {...empty}}}
function save(){localStorage.setItem(KEY,JSON.stringify(data));render()}
function stamp(){return new Date().toISOString()}
function today(){return new Date().toISOString().slice(0,10)}
function niceDate(d=new Date()){return new Intl.DateTimeFormat('sv-SE',{weekday:'long',day:'numeric',month:'long'}).format(d)}

const cleaningTasks={
  'Kök':['Plocka undan','Torka av bänkar','Rengöra diskbänk','Rengöra spis','Torka köksluckor','Rengöra kylskåp invändigt','Rensa kylskåp','Rengöra mikrovågsugn','Torka av vitvaror','Damma','Dammsuga','Torka golv','Tvätta fönster','Torka fönsterbrädor','Rensa en låda','Rensa ett skåp'],
  'Vardagsrum':['Plocka undan','Damma','Damma lampor','Torka av bord','Torka fönsterbrädor','Dammsuga soffa','Dammsuga golv','Torka golv','Tvätta fönster','Putsa speglar','Vattna blommor','Rensa en hylla','Torka lister'],
  'Gillestuga':['Plocka undan','Damma','Damma lampor','Torka av bord','Dammsuga möbler','Dammsuga golv','Torka golv','Tvätta fönster','Torka fönsterbrädor','Rensa en hylla','Torka lister'],
  'Sovrum':['Bädda rent','Byta sängkläder','Vädra täcken och kuddar','Damma','Damma lampor','Torka nattduksbord','Torka fönsterbrädor','Dammsuga','Torka golv','Tvätta fönster','Rensa garderob','Rensa en låda','Torka lister'],
  'Toalett':['Rengöra toalett','Rengöra handfat','Putsa spegel','Torka kranar','Torka av skåp','Damma','Dammsuga','Torka golv','Torka lister','Fylla på toalettpapper'],
  'Badrum/dusch':['Rengöra dusch','Rengöra badkar','Rengöra handfat','Rengöra toalett','Putsa spegel','Torka kranar','Rengöra golvbrunn','Torka av skåp','Damma','Dammsuga','Torka golv','Tvätta duschväggar'],
  'Tvättstuga':['Plocka undan','Torka av tvättmaskin','Torka av torktumlare','Rengöra tvättmedelsfack','Rensa filter','Torka av bänkar','Damma','Dammsuga','Torka golv','Rensa en hylla','Sortera tvätt'],
  'Torkrum':['Plocka undan','Torka av ytor','Damma','Dammsuga','Torka golv','Rensa och sortera'],
  'Källare':['Plocka undan','Damma','Dammsuga','Torka golv','Rensa en hylla','Sortera saker','Torka lister','Tvätta fönster'],
  'Hall':['Plocka undan','Sortera skor','Torka av skohylla','Damma','Putsa spegel','Dammsuga','Torka golv','Torka lister','Tvätta fönster','Rensa jackor och ytterkläder'],
  'Trappa':['Plocka undan','Damma räcke','Torka räcke','Dammsuga trappa','Torka trappsteg','Torka lister'],
  'Annat':['Plocka undan','Damma','Dammsuga','Torka golv','Tvätta fönster','Putsa spegel','Rensa och sortera']
};

const cleaningRoom=document.querySelector('#cleaningRoom');
const cleaningTask=document.querySelector('#cleaningTask');
function updateCleaningTasks(){
  if(!cleaningRoom||!cleaningTask)return;
  const tasks=cleaningTasks[cleaningRoom.value]||[];
  cleaningTask.innerHTML='<option value="">Välj göromål</option>'+tasks.map(task=>`<option>${task}</option>`).join('');
  cleaningTask.disabled=tasks.length===0;
}
if(cleaningRoom) cleaningRoom.addEventListener('change',updateCleaningTasks);

document.querySelector('#todayLabel').textContent=niceDate();
document.querySelector('#todayButton').addEventListener('click',()=>show('overview'));
document.querySelectorAll('.tab').forEach(b=>b.addEventListener('click',()=>show(b.dataset.view)));
function show(id){document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active-view',v.id===id));document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b.dataset.view===id));window.scrollTo({top:0,behavior:'smooth'})}

function setColor(color){data.color=color;save()}
document.querySelectorAll('[data-color]').forEach(b=>b.addEventListener('click',()=>setColor(b.dataset.color)));
document.querySelectorAll('[data-recovery]').forEach(b=>b.addEventListener('click',()=>setColor(b.dataset.recovery)));

document.querySelectorAll('.record-form').forEach(form=>form.addEventListener('submit',e=>{
  e.preventDefault();
  const type=form.dataset.type;
  const values=Object.fromEntries(new FormData(form).entries());
  data[type].unshift({...values,createdAt:stamp()});
  form.reset();
  if(type==='calendar') form.elements.date.value=today();
  if(type==='cleaning') updateCleaningTasks();
  save();
}));

document.querySelectorAll('input[type=date]').forEach(i=>i.value=today());
function esc(s=''){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function entry(text,date){return `<article class="entry"><p>${text}</p><small>${date}</small></article>`}
function renderList(type,format){const el=document.querySelector(`[data-list=${type}]`);if(!el)return;el.innerHTML=data[type].slice(0,12).map(x=>entry(format(x),new Date(x.createdAt).toLocaleString('sv-SE',{dateStyle:'short',timeStyle:'short'}))).join('')}
function todays(arr){return arr.filter(x=>(x.date||x.createdAt?.slice(0,10))===today())}
function render(){
 document.querySelectorAll('[data-color]').forEach(b=>b.classList.toggle('selected',b.dataset.color===data.color));
 document.querySelector('#recoverySummary').textContent=data.color?`Just nu: ${data.color} tid.`:'Välj dagens färg.';
 const f=todays(data.food); document.querySelector('#foodSummary').textContent=f.length?`${f.length} måltid${f.length===1?'':'er'} registrerade idag.`:'Inget registrerat idag.';
 const m=todays(data.movement); const mins=m.reduce((a,x)=>a+(Number(x.minutes)||0),0); document.querySelector('#movementSummary').textContent=m.length?`${mins} minuter rörelse idag.`:'Inget registrerat idag.';
 const c=todays(data.calendar); document.querySelector('#calendarSummary').textContent=c.length?`${c.length} sak${c.length===1?'':'er'} planerade idag.`:'Inget planerat idag.';
 const cl=todays(data.cleaning); document.querySelector('#cleaningSummary').textContent=cl.length?`${esc(cl[0].room)}: ${esc(cl[0].task)}`:'Ingen fyrkant vald idag.';
 const r=todays(data.reflection); document.querySelector('#reflectionSummary').textContent=r.length?'Dagens incheckning är sparad.':'Ingen reflektion ännu.';
 renderList('food',x=>`<strong>${esc(x.meal)}</strong> – ${esc(x.note)}`);
 renderList('movement',x=>`<strong>${esc(x.activity)}</strong> – ${esc(x.minutes)} min${x.note?` · ${esc(x.note)}`:''}`);
 renderList('calendar',x=>`<strong>${esc(x.date)}</strong> – ${esc(x.title)}`);
 renderList('cleaning',x=>`<strong>${esc(x.room)}</strong> – ${esc(x.task)}${x.minutes?` · ${esc(x.minutes)} min`:''}`);
 renderList('reflection',x=>`<strong>Vad hände:</strong> ${esc(x.happened||'–')}<br><strong>Känsla:</strong> ${esc(x.feeling||'–')}<br><strong>Behov:</strong> ${esc(x.need||'–')}<br><strong>Litet steg:</strong> ${esc(x.step||'–')}`);
}
render();
