(()=>{
 const KEY='malix-inner-compass-v1';
 let editingId=null,pendingSystemId=null;
 const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
 const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return{}}};
 const save=x=>localStorage.setItem(KEY,JSON.stringify(x));
 const safe=s=>String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
 const show=id=>{document.querySelectorAll('main > .view').forEach(v=>v.classList.remove('active-view'));document.querySelector('#'+id)?.classList.add('active-view');window.scrollTo({top:0,behavior:'smooth'})};
 function addView(id,html){let v=document.querySelector('#'+id);if(!v){v=document.createElement('section');v.id=id;v.className='view';document.querySelector('main')?.appendChild(v)}v.innerHTML=html;return v}
 function circleLabel(c){return c==='green'?'🟢 Grön – trygghet och ro':c==='blue'?'🔵 Blå – driv och utforskande':c==='red'?'🔴 Röd – hot och skydd':'⚪ Inget system valt'}
 function shortCircle(c){return c==='green'?'🟢 trygghet/ro':c==='blue'?'🔵 driv/utforskande':c==='red'?'🔴 hot/stress':'ett annat system'}
 function dayEntries(d=today()){
   const raw=read()[d];
   if(!raw)return [];
   if(Array.isArray(raw))return raw;
   if(typeof raw==='object')return [{...raw,id:raw.id||('legacy-'+d),savedAt:raw.savedAt||new Date(d+'T12:00:00').toISOString()}];
   return [];
 }
 function writeDay(entries,d=today()){
   const all=read();all[d]=entries;save(all);
   document.dispatchEvent(new CustomEvent('malix-compass-updated',{detail:{date:d,entries}}));
 }
 function textForEntry(entry){return [entry.why,entry.notice,entry.need,entry.compassion].filter(Boolean).join(' ').toLowerCase()}
 const systemCues={
   green:['lugn','lugnt','trygg','trygghet','ro','mjuk','mjuka','vila','vilar','återhämt','andas','andning','närvaro','här och nu','landa','landar','slappna','skönt','njuta','njuter','värme','kontakt'],
   blue:['planera','planering','nästa','projekt','lösa','lösning','ordna','fixa','göra','gör','ska jag','skulle kunna','kan jag','prestera','prestation','mål','hinna','aktivitet','träna','cykla','jobba','börja','undersöka','utforska','idé','idéer','nyfiken','nyfikenhet','möjlighet','möjligheter','lust att'],
   red:['orolig','oro','stress','stressad','rädd','rädsla','hot','måste','press','pressad','spänd','ilska','arg','skam','panik','fara','konflikt','grubblar','katastrof','ont i magen','hjärtat slår','skydda','försvara']
 };
 function score(text,circle){return systemCues[circle].reduce((n,w)=>n+(text.includes(w)?1:0),0)}
 function detectSystemSignals(entry){
   const text=textForEntry(entry).trim();if(text.length<35)return null;
   const cut=Math.floor(text.length*.58),ending=text.slice(cut);
   const scored=['green','blue','red'].map(circle=>({circle,full:score(text,circle),ending:score(ending,circle)}));
   const suggested=scored.filter(x=>x.full>=2||x.ending>=1).sort((a,b)=>(b.ending*2+b.full)-(a.ending*2+a.full)).map(x=>x.circle);
   const otherThanChosen=suggested.filter(c=>c!==entry.circle);
   if(entry.circle){
     if(!otherThanChosen.length)return null;
     if(!suggested.includes(entry.circle))suggested.unshift(entry.circle);
   }else if(suggested.length<2){return null}
   return {suggested:[...new Set(suggested)].slice(0,3),detectedAt:new Date().toISOString()};
 }
 function clearForm(){
   editingId=null;
   ['compassCircle','compassWhy','compassNotice','compassNeed','compassCompassion'].forEach(id=>{const e=document.getElementById(id);if(e)e.value=''});
   const b=document.querySelector('#saveCompass');if(b)b.textContent='Spara min reflektion';
   const cancel=document.querySelector('#cancelCompassEdit');if(cancel)cancel.hidden=true;
 }
 function renderSystemPrompt(){
   const box=document.querySelector('#compassShiftPrompt');if(!box)return;
   if(!pendingSystemId){box.hidden=true;box.innerHTML='';return}
   const entry=dayEntries().find(x=>x.id===pendingSystemId);
   const r=entry?.systemReflection;
   if(!entry||!r||r.response){pendingSystemId=null;box.hidden=true;box.innerHTML='';return}
   const labels=(r.suggested||[]).map(c=>`<span class="badge">${shortCircle(c)}</span>`).join(' ');
   box.hidden=false;
   box.innerHTML=`<p class="eyebrow">🌿 Stanna upp och lägg märke till vad som finns här nu</p><p>I det du skrivit kan det finnas tecken på flera system samtidigt. Du behöver inte bestämma vilket system du <em>är i</em>. Lägg märke till vad som händer.</p><label><strong>Vad märker du just nu?</strong><span class="note">Lägg märke till kroppen, tankarna, känslorna, impulserna eller vad du får lust att göra.</span><textarea id="compassSystemNotice" rows="3" placeholder="Skriv om du vill"></textarea></label><div class="panel" style="margin-top:12px"><strong>Det kan finnas drag av:</strong><p>${labels}</p><p class="note">Flera system kan vara aktiva samtidigt. Ingen färg är bättre än någon annan.</p></div><div class="chips" style="margin-top:12px"><button type="button" class="primary" data-system-answer="recognize">Jag känner igen det</button><button type="button" class="secondary" data-system-answer="partly">Jag känner igen delar av det</button><button type="button" class="secondary" data-system-answer="unsure">Jag är osäker</button><button type="button" class="secondary" data-system-answer="no">Det stämmer inte för mig</button></div><label style="margin-top:14px"><strong>När du ser det här lite tydligare – vad skulle vara ett vänligt och hjälpsamt nästa steg för dig?</strong><textarea id="compassSystemNext" rows="3" placeholder="Skriv om du vill"></textarea></label><p class="note">Färgerna är en karta – inte ett facit. Syftet är att undersöka vad som händer, inte att kategorisera dig.</p>`;
 }
 function legacyShiftHtml(x){
   const s=x.possibleShift;if(!s||!s.response)return'';
   const answer=s.response==='yes'?'Jag kände igen förflyttningen':s.response==='no'?'Jag upplevde ingen förflyttning':'Jag var osäker på om en förflyttning skedde';
   return `<div class="note" style="margin-top:10px"><strong>🌿 Tidigare uppmärksammad förflyttning:</strong> ${shortCircle(s.from)} → ${shortCircle(s.to)}<br>${safe(answer)}${s.body?`<br><strong>Vad märkte du?</strong> ${safe(s.body)}`:''}</div>`;
 }
 function systemReflectionHtml(x){
   const r=x.systemReflection;if(!r||!r.response)return legacyShiftHtml(x);
   const answer={recognize:'Jag känner igen det',partly:'Jag känner igen delar av det',unsure:'Jag är osäker',no:'Det stämmer inte för mig'}[r.response]||r.response;
   const labels=(r.suggested||[]).map(shortCircle).join(' · ');
   return `<div class="note" style="margin-top:10px"><strong>🌿 Reflektion över systemen</strong>${labels?`<br><strong>Det kunde finnas drag av:</strong> ${safe(labels)}`:''}<br>${safe(answer)}${r.noticed?`<br><strong>Vad märkte jag?</strong> ${safe(r.noticed)}`:''}${r.nextStep?`<br><strong>Vänligt och hjälpsamt nästa steg:</strong> ${safe(r.nextStep)}`:''}</div>`;
 }
 function renderToday(){
   const list=document.querySelector('#compassTodayList');if(!list)return;
   const entries=dayEntries().slice().sort((a,b)=>new Date(b.savedAt)-new Date(a.savedAt));
   const counts={green:0,blue:0,red:0};entries.forEach(x=>{if(counts[x.circle]!==undefined)counts[x.circle]++});
   const reflections=entries.filter(x=>x.systemReflection?.response).length;
   const summary=document.querySelector('#compassDaySummary');
   if(summary)summary.innerHTML=entries.length?`<strong>Idag:</strong> 🟢 ${counts.green} · 🔵 ${counts.blue} · 🔴 ${counts.red} <span class="note">(${entries.length} avstämning${entries.length===1?'':'ar'}${reflections?` · ${reflections} systemreflektion${reflections===1?'':'er'}`:''})</span>`:'Ingen avstämning sparad idag ännu.';
   if(!entries.length){list.innerHTML='<p class="note">När du sparar en avstämning visas den här. Du kan komma tillbaka och registrera flera gånger under dagen.</p>';renderSystemPrompt();return}
   list.innerHTML=entries.map(x=>{
     const t=x.savedAt?new Date(x.savedAt).toLocaleTimeString('sv-SE',{hour:'2-digit',minute:'2-digit'}):'';
     return `<article class="recipe-card compass-entry" data-compass-id="${safe(x.id)}"><p class="eyebrow">${safe(t)} · ${circleLabel(x.circle)}</p>${x.why?`<p><strong>Vad gjorde att det här blev framträdande?</strong><br>${safe(x.why)}</p>`:''}${x.notice?`<p><strong>Vad märker jag?</strong><br>${safe(x.notice)}</p>`:''}${x.need?`<p><strong>Vad behöver jag?</strong><br>${safe(x.need)}</p>`:''}${x.compassion?`<p><strong>Hur kan jag möta mig själv med mer förståelse?</strong><br>${safe(x.compassion)}</p>`:''}${systemReflectionHtml(x)}<div class="chips" style="margin-top:10px"><button type="button" class="secondary" data-compass-edit="${safe(x.id)}">Ändra</button><button type="button" class="secondary" data-compass-delete="${safe(x.id)}">Ta bort</button></div></article>`;
   }).join('');
   renderSystemPrompt();
 }
 function loadEntry(id){
   const x=dayEntries().find(e=>e.id===id);if(!x)return;
   editingId=id;pendingSystemId=null;renderSystemPrompt();
   const vals={compassCircle:x.circle,compassWhy:x.why,compassNotice:x.notice,compassNeed:x.need,compassCompassion:x.compassion};
   Object.entries(vals).forEach(([field,v])=>{const e=document.getElementById(field);if(e)e.value=v||''});
   const b=document.querySelector('#saveCompass');if(b)b.textContent='Spara ändringen';
   const cancel=document.querySelector('#cancelCompassEdit');if(cancel)cancel.hidden=false;
   document.querySelector('#compassReflect')?.scrollIntoView({behavior:'smooth',block:'start'});
 }
 function init(){
   const home=document.querySelector('#home'),grid=home?.querySelector('.calm-main-grid');
   if(!home||!grid)return setTimeout(init,250);
   if(!grid.querySelector('[data-calm-open="compassHub"]'))grid.insertAdjacentHTML('beforeend','<button type="button" class="choice-card" data-calm-open="compassHub"><span>🌿</span><strong>Min inre kompass</strong><small>Compassion, cirklar och reflektion.</small></button>');
   addView('compassHub',`<button type="button" class="back" data-compass-home>← Hem</button><p class="eyebrow">Compassion i vardagen</p><h2>🌿 Min inre kompass</h2><p class="subtitle">Färgerna är en karta – inte ett facit. Utforska vad som händer inom dig utan att behöva passa in dig i en kategori.</p><div class="choice-grid"><button type="button" class="choice-card" data-compass-open="compassAbout"><span>🌿</span><strong>Vad är compassion?</strong><small>Om att möta det som är svårt med förståelse, omtanke och mod.</small></button><button type="button" class="choice-card" data-compass-open="compassCircles"><span>🟢 🔵 🔴</span><strong>Mina tre cirklar</strong><small>Trygghet, driv och hot – system som kan finnas samtidigt och förändras.</small></button><button type="button" class="choice-card" data-compass-open="compassReflect"><span>💚</span><strong>Stanna upp en stund</strong><small>Vad märker jag just nu och vad behöver jag?</small></button></div>`);
   addView('compassAbout',`<button type="button" class="back" data-compass-back>← Min inre kompass</button><h2>🌿 Vad är compassion?</h2><p>Compassion handlar om att kunna lägga märke till att något är svårt och möta det med förståelse, omtanke och mod.</p><p>Det betyder inte att allt ska kännas bra. Det handlar om att kunna fråga: <strong>Vad händer i mig just nu? Vad behöver jag? Vad skulle vara hjälpsamt?</strong></p><section class="panel calm" style="margin-top:18px"><h3>Vill du utforska det här tillsammans med någon?</h3><p>Ibland kan det vara hjälpsamt att få stöd i att förstå känslor, mönster och vad man behöver.</p><p><a class="primary" href="https://malix.se/samtal-online/" target="_blank" rel="noopener">🌿 Läs mer om samtal online</a></p></section>`);
   addView('compassCircles',`<button type="button" class="back" data-compass-back>← Min inre kompass</button><h2>🟢 🔵 🔴 Mina tre cirklar</h2><p><strong>Färgerna är en karta – inte ett facit.</strong> Flera system kan vara aktiva samtidigt och inget system är bättre än något annat.</p><div class="recipe-grid"><article class="recipe-card"><h3>🟢 Grön – trygghet och ro</h3><p>Lugn, trygghet, närhet och återhämtning. Vad märker jag när sådana drag finns här?</p></article><article class="recipe-card"><h3>🔵 Blå – driv och utforskande</h3><p>Göra, lära, undersöka, skapa, planera och sträva mot något. Vad väcker mitt driv och min nyfikenhet?</p></article><article class="recipe-card"><h3>🔴 Röd – hot och skydd</h3><p>Stress, oro, ilska, skam eller rädsla kan aktiveras. Vad försöker mitt system uppmärksamma eller skydda?</p></article></div><section class="panel calm" style="margin-top:18px"><h3>🌿 Lägg märke till blandningar och förflyttningar</h3><p>En reflektion kan innehålla drag från flera system samtidigt. Appen kan uppmärksamma sådana tecken, men det är alltid du som avgör om de känns relevanta. Syftet är att bli nyfiken på dina mönster, inte att bestämma vilken färg du är.</p></section><p class="note">Fyrkanterna 🟥 🟨 🟩 🟦 hör till Min tid och planering. Cirklarna 🟢 🔵 🔴 hör till Min inre kompass.</p>`);
   addView('compassReflect',`<button type="button" class="back" data-compass-back>← Min inre kompass</button><h2>💚 Stanna upp en stund</h2><p class="note">Du kan göra flera avstämningar under samma dag. Färgerna hjälper dig att undersöka – de behöver inte beskriva hela ditt tillstånd.</p><section class="panel"><label><strong>Vilket system känns mest framträdande just nu?</strong><span class="note">Välj om du vill. Flera system kan finnas samtidigt.</span><select id="compassCircle"><option value="">Jag vill inte välja just nu</option><option value="green">🟢 Grön – trygghet och ro</option><option value="blue">🔵 Blå – driv och utforskande</option><option value="red">🔴 Röd – hot och skydd</option></select></label><label>Vad tror jag gjorde att det här blev framträdande?<textarea id="compassWhy" rows="2"></textarea></label><label>Vad märker jag i tankar, känslor, kropp eller impulser?<textarea id="compassNotice" rows="2"></textarea></label><label>Vad behöver jag just nu?<textarea id="compassNeed" rows="2"></textarea></label><label>Hur kan jag möta mig själv med lite mer förståelse?<textarea id="compassCompassion" rows="2"></textarea></label><button type="button" class="primary" id="saveCompass">Spara min reflektion</button> <button type="button" class="secondary" id="cancelCompassEdit" hidden>Avbryt ändring</button><p class="status" id="compassStatus"></p></section><section class="panel calm" id="compassShiftPrompt" style="margin-top:18px" hidden></section><section class="panel calm" style="margin-top:18px"><p class="eyebrow">Dagens kompass</p><h3>🌿 Mina avstämningar idag</h3><p id="compassDaySummary" class="note"></p><div id="compassTodayList" class="recipe-grid"></div></section>`);
   wire();clearForm();renderToday();
 }
 function wire(){document.addEventListener('click',e=>{
   const open=e.target.closest('[data-compass-open]');if(open){e.preventDefault();show(open.dataset.compassOpen);if(open.dataset.compassOpen==='compassReflect'){clearForm();renderToday()}return}
   if(e.target.closest('[data-compass-back]')){e.preventDefault();show('compassHub');return}
   if(e.target.closest('[data-compass-home]')){e.preventDefault();show('home');return}
   const answer=e.target.closest('[data-system-answer]');if(answer){
     e.preventDefault();if(!pendingSystemId)return;
     const noticed=document.querySelector('#compassSystemNotice')?.value.trim()||'';
     const nextStep=document.querySelector('#compassSystemNext')?.value.trim()||'';
     const response=answer.dataset.systemAnswer;
     const entries=dayEntries().map(x=>x.id===pendingSystemId?{...x,systemReflection:{...x.systemReflection,response,noticed,nextStep,answeredAt:new Date().toISOString()}}:x);
     writeDay(entries);pendingSystemId=null;renderToday();
     const s=document.querySelector('#compassStatus');if(s)s.textContent='Din egen reflektion över systemen är sparad ✓';return
   }
   const edit=e.target.closest('[data-compass-edit]');if(edit){e.preventDefault();loadEntry(edit.dataset.compassEdit);return}
   const del=e.target.closest('[data-compass-delete]');if(del){e.preventDefault();if(!confirm('Ta bort den här avstämningen?'))return;writeDay(dayEntries().filter(x=>x.id!==del.dataset.compassDelete));if(editingId===del.dataset.compassDelete)clearForm();if(pendingSystemId===del.dataset.compassDelete)pendingSystemId=null;renderToday();const s=document.querySelector('#compassStatus');if(s)s.textContent='Avstämningen är borttagen.';return}
   if(e.target.closest('#cancelCompassEdit')){e.preventDefault();clearForm();const s=document.querySelector('#compassStatus');if(s)s.textContent='Ändringen avbröts.';return}
   if(e.target.closest('#saveCompass')){
     const entry={circle:document.querySelector('#compassCircle')?.value||'',why:document.querySelector('#compassWhy')?.value.trim()||'',notice:document.querySelector('#compassNotice')?.value.trim()||'',need:document.querySelector('#compassNeed')?.value.trim()||'',compassion:document.querySelector('#compassCompassion')?.value.trim()||''};
     if(!entry.circle&&!entry.why&&!entry.notice&&!entry.need&&!entry.compassion){const s=document.querySelector('#compassStatus');if(s)s.textContent='Skriv eller välj något innan du sparar.';return}
     const wasEditing=!!editingId;let entries=dayEntries();let savedId=editingId;
     if(wasEditing){
       entries=entries.map(x=>{if(x.id!==editingId)return x;const updated={...x,...entry,editedAt:new Date().toISOString()};const signal=detectSystemSignals(updated);return {...updated,systemReflection:signal?{...(x.systemReflection||{}),...signal,response:x.systemReflection?.response||null,noticed:x.systemReflection?.noticed||'',nextStep:x.systemReflection?.nextStep||''}:null}});
     }else{
       savedId='compass-'+Date.now()+'-'+Math.random().toString(36).slice(2,7);
       const created={...entry,id:savedId,savedAt:new Date().toISOString()};const signal=detectSystemSignals(created);entries.push({...created,systemReflection:signal});
     }
     writeDay(entries);const savedEntry=entries.find(x=>x.id===savedId);pendingSystemId=savedEntry?.systemReflection&&!savedEntry.systemReflection.response?savedId:null;clearForm();renderToday();const s=document.querySelector('#compassStatus');if(s)s.textContent=wasEditing?'Ändringen är sparad ✓':'Reflektionen är sparad ✓';return
   }
 },true);document.addEventListener('malix-cloud-updated',renderToday)}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();