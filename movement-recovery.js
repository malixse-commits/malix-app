(() => {
  const KEY='malix-movement-recovery-v1';
  const today=()=>new Date().toISOString().slice(0,10);
  const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}};
  const save=data=>localStorage.setItem(KEY,JSON.stringify(data));
  const options={
    movement:['Promenad','Simning','Cykling','Städning','Trädgård','Lek/aktivitet','Annat'],
    recovery:['Vilat','Suttit ute','Naturen','Badat','Läst/lyssnat','Egen stund','Annat']
  };
  function add(kind,label,emoji){
    const home=document.querySelector('#home'); if(!home)return;
    const dashboard=home.querySelector('.dashboard-panel'); if(!dashboard)return;
    const box=document.createElement('section');box.className='panel calm';box.dataset.wellbeing=kind;
    box.innerHTML=`<p class="eyebrow">${label}</p><h3>${emoji} ${label}</h3><p>${kind==='movement'?'Lite vardagsrörelse räknas också.':'En liten stund för återhämtning kan vara nog.'}</p><div class="chips">${options[kind].map(x=>`<button type="button" data-choice="${x}">${x}</button>`).join('')}</div><label>Ungefär hur länge?<select data-minutes><option value="5">5 min</option><option value="15">15 min</option><option value="30" selected>30 min</option><option value="45">45 min</option><option value="60">60+ min</option></select></label>${kind==='movement'?'<label>Hur kändes det?<select data-feeling><option>Lätt</option><option selected>Lagom</option><option>Ansträngande</option></select></label>':'<label>Hur kändes det efteråt?<select data-feeling><option>Lugnare</option><option>Mer energi</option><option selected>Oförändrat</option><option>Tröttare</option></select></label>'}<button type="button" class="primary" data-save>Spara</button><div data-summary class="note"></div>`;
    dashboard.insertAdjacentElement('afterend',box);
    let selected='';
    box.addEventListener('click',e=>{
      const b=e.target.closest('[data-choice]');
      if(b){selected=b.dataset.choice;box.querySelectorAll('[data-choice]').forEach(x=>x.classList.toggle('active',x===b));return}
      const del=e.target.closest('[data-remove-entry]');
      if(del){const data=load(),d=today(),list=data[d]?.[kind]||[];list.splice(Number(del.dataset.removeEntry),1);if(data[d])data[d][kind]=list;save(data);render(box,kind);return}
      if(e.target.closest('[data-save]')){if(!selected){alert(`Välj ${kind==='movement'?'en rörelse':'en återhämtning'} först.`);return}const data=load(),d=today();data[d]=data[d]||{movement:[],recovery:[]};data[d][kind].push({type:selected,minutes:Number(box.querySelector('[data-minutes]').value),feeling:box.querySelector('[data-feeling]').value});save(data);render(box,kind);selected='';box.querySelectorAll('[data-choice]').forEach(x=>x.classList.remove('active'));}
    });
    render(box,kind);
  }
  function render(box,kind){const data=load()[today()]?.[kind]||[];const out=box.querySelector('[data-summary]');if(!data.length){out.textContent='Inget sparat idag – och det är helt okej.';return}const total=data.reduce((s,x)=>s+x.minutes,0);out.innerHTML=`<strong>Idag:</strong><div style="margin-top:8px">${data.map((x,i)=>`<div style="margin:6px 0">${x.type} ${x.minutes}${x.minutes>=60?'+':''} min <button type="button" class="secondary" data-remove-entry="${i}">Ta bort</button></div>`).join('')}</div><strong>Totalt:</strong> ${total} min`;}
  add('movement','Rörelse','🚶');
  add('recovery','Återhämtning','🌿');
})();