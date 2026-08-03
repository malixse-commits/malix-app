const KEY='malix-app-v1';
const empty={color:'',food:[],movement:[],sleep:[],calendar:[],cleaning:[],reflection:[]};
let data=load();
function load(){try{return {...empty,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{return {...empty}}}
function save(){localStorage.setItem(KEY,JSON.stringify(data));render()}
function stamp(){return new Date().toISOString()}
function today(){return new Date().toISOString().slice(0,10)}
function niceDate(d=new Date()){return new Intl.DateTimeFormat('sv-SE',{weekday:'long',day:'numeric',month:'long'}).format(d)}

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
