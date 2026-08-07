(() => {
  const REF_KEY='malix-reflection-diary-v2';
  const pad=n=>String(n).padStart(2,'0');
  const keyOf=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  const todayKey=()=>keyOf(new Date());
  const loadRef=()=>{try{return JSON.parse(localStorage.getItem(REF_KEY)||'{}')}catch{return {}}};
  const saveRef=x=>localStorage.setItem(REF_KEY,JSON.stringify(x));
  const fmt=k=>new Intl.DateTimeFormat('sv-SE',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(new Date(`${k}T12:00:00`));

  function setupReflection(){
    const form=document.querySelector('#dailyReflection');
    if(!form||form.dataset.historyReady==='1')return;
    form.dataset.historyReady='1';
    const panel=form.closest('.daily-panel')||form.parentElement;
    const history=document.createElement('section');history.className='panel calm';history.style.marginTop='18px';history.innerHTML=`<div class="dashboard-heading"><div><p class="eyebrow">Dagbok</p><h3>📖 Mina reflektioner</h3><p class="note">Det du skriver sparas med datum i den här webbläsaren.</p></div></div><div id="reflectionHistory"></div>`;panel.appendChild(history);

    function render(){
      const data=loadRef();const keys=Object.keys(data).sort().reverse();const out=history.querySelector('#reflectionHistory');
      if(!keys.length){out.innerHTML='<p class="empty">Ingen sparad reflektion ännu.</p>';return;}
      out.innerHTML=keys.slice(0,31).map(k=>{const r=data[k]||{};return `<details class="history-meal"><summary><strong>${fmt(k)}</strong></summary><div style="margin-top:10px"><p><strong>Vad blev bra idag?</strong><br>${r.good||'–'}</p><p><strong>Vad vill jag göra annorlunda?</strong><br>${r.different||'–'}</p><p><strong>Vad vill jag behålla?</strong><br>${r.keep||'–'}</p></div></details>`}).join('');
    }

    form.addEventListener('submit',()=>{
      const fd=new FormData(form),data=loadRef(),k=todayKey();
      data[k]={good:String(fd.get('good')||'').trim(),different:String(fd.get('different')||'').trim(),keep:String(fd.get('keep')||'').trim(),savedAt:new Date().toISOString()};
      saveRef(data);setTimeout(render,0);
    },true);
    render();
  }

  function mealDateKey(meal){const d=meal?.date?new Date(meal.date):new Date();return keyOf(d)}
  function setupFoodOverview(){
    const home=document.querySelector('#home');if(!home||document.querySelector('#foodOverTime'))return;
    const dashboard=home.querySelector('.dashboard-panel');if(!dashboard)return;
    const box=document.createElement('section');box.id='foodOverTime';box.className='panel';box.innerHTML=`<p class="eyebrow">Historik</p><h3>📊 Mat över tid</h3><p class="note">En enkel överblick. I Matkalendern kan du öppna varje enskild dag.</p><div class="dashboard-grid"><article class="summary-card"><span>Senaste 7 dagarna</span><strong data-week>–</strong></article><article class="summary-card"><span>Senaste 30 dagarna</span><strong data-month>–</strong></article></div><div data-mealtypes class="note"></div><button type="button" class="secondary" data-open-food-calendar>Öppna Matkalendern</button>`;
    dashboard.insertAdjacentElement('afterend',box);
    box.querySelector('[data-open-food-calendar]').addEventListener('click',()=>{if(typeof show==='function')show('foodLog');document.querySelector('#calendarGrid')?.scrollIntoView({behavior:'smooth',block:'start'});});
    function render(){
      const meals=JSON.parse(localStorage.getItem('malix-meals')||'[]');const now=new Date();
      const within=days=>meals.filter(m=>{const d=new Date(m.date||Date.now());return (now-d)/(86400000)<days && d<=now});
      const stats=days=>{const arr=within(days),dates=new Set(arr.map(mealDateKey));return {meals:arr.length,days:dates.size,arr}};
      const w=stats(7),m=stats(30);box.querySelector('[data-week]').textContent=`${w.meals} måltider · ${w.days} dagar`;box.querySelector('[data-month]').textContent=`${m.meals} måltider · ${m.days} dagar`;
      const counts={};m.arr.forEach(x=>counts[x.meal]=(counts[x.meal]||0)+1);const txt=Object.entries(counts).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`${k}: ${v}`).join(' · ');box.querySelector('[data-mealtypes]').innerHTML=txt?`<strong>Senaste 30 dagarna:</strong> ${txt}`:'Ingen mat loggad de senaste 30 dagarna.';
    }
    document.addEventListener('malix-day-changed',render);render();
  }

  setupReflection();setupFoodOverview();
})();