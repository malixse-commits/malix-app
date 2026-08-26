(() => {
 const KEY='malix-presence-reflections-v1';
 const exercises=[
  ['👣','Känn steget','Gå långsamt några steg. Lägg märke till hur foten möter golvet. Känn hälen, fotsulan och tårna. Du behöver inte förändra något – bara lägg märke till.'],
  ['🫶','Känn kroppen','Stanna upp. Hur känns kroppen just nu? Lägg märke till om någon del känns varm, kall, tung, lätt eller avslappnad. Du behöver inte ändra känslan.'],
  ['🌬️','Tre andetag','Lägg märke till tre vanliga andetag. Du behöver inte andas på något särskilt sätt. Följ bara andetaget in och ut.'],
  ['👂','Vad hör du?','Stanna en stund och lägg märke till tre ljud. Ett nära, ett längre bort och kanske ett du inte lade märke till först.'],
  ['🌳','Ute en minut','Känn temperaturen och luften mot huden. Titta på något omkring dig. Du behöver inte göra något mer just nu.'],
  ['☕','Här är jag','Om du har en kopp kaffe, te eller något annat: känn koppen i handen, lägg märke till doften och smaken av nästa klunk.']
 ];
 const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return []}};
 const save=a=>localStorage.setItem(KEY,JSON.stringify(a));
 const safe=s=>String(s||'').replace(/[<>]/g,'');
 function init(){
  const hub=document.querySelector('#careHub');
  if(!hub||hub.querySelector('[data-care="carePresence"]'))return;
  const grid=hub.querySelector('.choice-grid');if(!grid)return;
  const btn=document.createElement('button');btn.type='button';btn.className='choice-card';btn.dataset.care='carePresence';btn.innerHTML='<span>🌱</span><strong>Närvaro</strong><small>Korta övningar mitt i vardagen. Ingen prestation.</small>';grid.insertBefore(btn,grid.lastElementChild);
  let s=document.querySelector('#carePresence');if(!s){s=document.createElement('section');s.id='carePresence';s.className='view';document.querySelector('main').appendChild(s)}
  s.innerHTML=`<button class="back" type="button" data-presence-back>← Ta hand om mig</button><p class="eyebrow">En sak i taget</p><h2>🌱 Närvaro</h2><p class="subtitle">Du behöver inte kunna meditera. Välj en mycket liten övning och lägg bara märke till det som redan finns.</p><div class="choice-grid">${exercises.map((x,i)=>`<button class="choice-card" type="button" data-presence="${i}"><span>${x[0]}</span><strong>${x[1]}</strong><small>En kort stund</small></button>`).join('')}</div><section id="presenceExercise" class="panel calm" style="margin-top:20px"><h3>🌿 Välj en övning</h3><p>Det räcker med en liten stund.</p></section><section id="presenceHistory" class="panel calm" style="margin-top:20px"></section><section class="panel calm" style="margin-top:20px"><p class="eyebrow">Tips för dig som vill fortsätta</p><h3>🌿 Hitta tillbaka till dig själv</h3><p>Om du tycker om de korta närvaroövningarna finns kursen <strong>Hitta tillbaka till dig själv</strong> på Malix. Där kan du arbeta vidare med närvaro och reflektion i din egen takt.</p><p><a class="primary" href="https://malix.se/hitta-tillbaka-till-dig-sjalv/" target="_blank" rel="noopener">Läs mer om kursen →</a></p></section>`;
  function show(){document.querySelectorAll('main > .view').forEach(v=>v.classList.remove('active-view'));s.classList.add('active-view');window.scrollTo({top:0,behavior:'smooth'})}
  btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();show()});
  s.querySelector('[data-presence-back]').onclick=e=>{e.preventDefault();window.malixOpenCare?.()};
  function renderHistory(){
   const box=s.querySelector('#presenceHistory'),all=load(),a=all.slice(0,20);
   box.innerHTML=a.length?`<h3>🌱 Mina senaste stunder</h3>${a.map((x,index)=>`<div style="padding:10px 0;border-bottom:1px solid rgba(0,0,0,.08)"><strong>${safe(x.exercise)}</strong> <small>${new Date(x.date).toLocaleDateString('sv-SE')}</small>${x.feel?`<p>${safe(x.feel)}</p>`:''}${x.notice?`<p class="note">Jag märkte: ${safe(x.notice)}</p>`:''}${x.feeling?`<p class="note">Hur jag mådde/kände: ${safe(x.feeling)}</p>`:''}<button type="button" class="secondary" data-presence-delete-index="${index}">Ta bort</button></div>`).join('')}`:'<h3>🌱 Mina stunder</h3><p class="note">När du sparar en reflektion kan du se dina senaste stunder här.</p>';
   box.querySelectorAll('[data-presence-delete-index]').forEach(b=>b.onclick=()=>{if(!confirm('Ta bort den här närvaroreflektionen?'))return;const list=load(),index=Number(b.dataset.presenceDeleteIndex);if(Number.isInteger(index)&&index>=0&&index<list.length){list.splice(index,1);save(list)}renderHistory()});
  }
  renderHistory();
  s.querySelectorAll('[data-presence]').forEach(b=>b.addEventListener('click',e=>{
   e.preventDefault();e.stopPropagation();
   const x=exercises[+b.dataset.presence],box=s.querySelector('#presenceExercise');box.dataset.exercise=x[1];box.dataset.feel='';
   s.querySelectorAll('[data-presence]').forEach(q=>q.classList.toggle('selected',q===b));
   box.innerHTML=`<p class="eyebrow">${x[0]} En liten stund</p><h3>${x[1]}</h3><p>${x[2]}</p><hr><h3>Hur är det för mig just nu?</h3><p class="note">Stanna kvar ett ögonblick efter övningen. Du behöver inte hitta något särskilt.</p><div class="chips"><button type="button" data-feel="Lugnare">Lugnare</button><button type="button" data-feel="Annorlunda">Annorlunda</button><button type="button" data-feel="Ungefär samma">Ungefär samma</button><button type="button" data-feel="Mer orolig">Mer orolig</button><button type="button" data-feel="Vet inte">Vet inte</button></div><label style="display:block;margin-top:14px">Vad märkte jag?<textarea id="presenceNotice" rows="3" placeholder="Kanske något i kroppen, en tanke, en känsla, ett ljud eller något helt annat …"></textarea></label><label style="display:block;margin-top:12px">Hur mår jag? Vad känner jag?<textarea id="presenceFeeling" rows="3" placeholder="Några ord räcker. Du kan också lämna det tomt."></textarea></label><button type="button" class="primary" id="savePresence">Spara min reflektion</button><div class="panel calm" id="presenceStatus" style="display:none;margin-top:12px"></div><p class="note">Det finns inget rätt svar. Övningen handlade bara om att vara här en liten stund.</p>`;
   box.querySelectorAll('[data-feel]').forEach(f=>f.onclick=()=>{box.dataset.feel=f.dataset.feel;box.querySelectorAll('[data-feel]').forEach(q=>q.classList.toggle('selected',q===f))});
   box.querySelector('#savePresence').onclick=()=>{
    const saveButton=box.querySelector('#savePresence');if(saveButton.disabled)return;
    const a=load();a.unshift({id:'presence-'+Date.now(),date:new Date().toISOString(),exercise:x[1],feel:box.dataset.feel,notice:box.querySelector('#presenceNotice').value.trim(),feeling:box.querySelector('#presenceFeeling').value.trim()});save(a);
    const status=box.querySelector('#presenceStatus');status.style.display='block';status.innerHTML='<strong>✓ Reflektionen är sparad.</strong><p class="note">Du behöver inte göra något mer med den nu.</p>';
    saveButton.disabled=true;saveButton.textContent='✓ Sparad';
    renderHistory();
   };
  }));
 }
 setTimeout(init,100);document.addEventListener('click',e=>{if(e.target.closest('[data-calm-open="careHub"]'))setTimeout(init,50)},true)
})();