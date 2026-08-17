(()=>{
 const KEY='malix-inner-compass-v1';
 let editingId=null;
 const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
 const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return{}}};
 const save=x=>localStorage.setItem(KEY,JSON.stringify(x));
 const safe=s=>String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
 const show=id=>{document.querySelectorAll('main > .view').forEach(v=>v.classList.remove('active-view'));document.querySelector('#'+id)?.classList.add('active-view');window.scrollTo({top:0,behavior:'smooth'})};
 function addView(id,html){let v=document.querySelector('#'+id);if(!v){v=document.createElement('section');v.id=id;v.className='view';document.querySelector('main')?.appendChild(v)}v.innerHTML=html;return v}
 function circleLabel(c){return c==='green'?'🟢 Grön – trygghet och ro':c==='blue'?'🔵 Blå – driv och utforskande':c==='red'?'🔴 Röd – hot och skydd':'⚪ Ingen cirkel vald'}
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
 function clearForm(){
   editingId=null;
   ['compassCircle','compassWhy','compassNotice','compassNeed','compassCompassion'].forEach(id=>{const e=document.getElementById(id);if(e)e.value=''});
   const b=document.querySelector('#saveCompass');if(b)b.textContent='Spara min reflektion';
   const cancel=document.querySelector('#cancelCompassEdit');if(cancel)cancel.hidden=true;
 }
 function renderToday(){
   const list=document.querySelector('#compassTodayList');if(!list)return;
   const entries=dayEntries().slice().sort((a,b)=>new Date(b.savedAt)-new Date(a.savedAt));
   const counts={green:0,blue:0,red:0};entries.forEach(x=>{if(counts[x.circle]!==undefined)counts[x.circle]++});
   const summary=document.querySelector('#compassDaySummary');
   if(summary)summary.innerHTML=entries.length?`<strong>Idag:</strong> 🟢 ${counts.green} · 🔵 ${counts.blue} · 🔴 ${counts.red} <span class="note">(${entries.length} avstämning${entries.length===1?'':'ar'})</span>`:'Ingen avstämning sparad idag ännu.';
   if(!entries.length){list.innerHTML='<p class="note">När du sparar en avstämning visas den här. Du kan komma tillbaka och registrera flera gånger under dagen.</p>';return}
   list.innerHTML=entries.map(x=>{
     const t=x.savedAt?new Date(x.savedAt).toLocaleTimeString('sv-SE',{hour:'2-digit',minute:'2-digit'}):'';
     return `<article class="recipe-card compass-entry" data-compass-id="${safe(x.id)}"><p class="eyebrow">${safe(t)} · ${circleLabel(x.circle)}</p>${x.why?`<p><strong>Vad gjorde att jag hamnade här?</strong><br>${safe(x.why)}</p>`:''}${x.notice?`<p><strong>Vad märker jag?</strong><br>${safe(x.notice)}</p>`:''}${x.need?`<p><strong>Vad behöver jag?</strong><br>${safe(x.need)}</p>`:''}${x.compassion?`<p><strong>Hur kan jag möta mig själv med mer förståelse?</strong><br>${safe(x.compassion)}</p>`:''}<div class="chips" style="margin-top:10px"><button type="button" class="secondary" data-compass-edit="${safe(x.id)}">Ändra</button><button type="button" class="secondary" data-compass-delete="${safe(x.id)}">Ta bort</button></div></article>`
   }).join('');
 }
 function loadEntry(id){
   const x=dayEntries().find(e=>e.id===id);if(!x)return;
   editingId=id;
   const vals={compassCircle:x.circle,compassWhy:x.why,compassNotice:x.notice,compassNeed:x.need,compassCompassion:x.compassion};
   Object.entries(vals).forEach(([id,v])=>{const e=document.getElementById(id);if(e)e.value=v||''});
   const b=document.querySelector('#saveCompass');if(b)b.textContent='Spara ändringen';
   const cancel=document.querySelector('#cancelCompassEdit');if(cancel)cancel.hidden=false;
   document.querySelector('#compassReflect')?.scrollIntoView({behavior:'smooth',block:'start'});
 }
 function init(){const home=document.querySelector('#home'),grid=home?.querySelector('.calm-main-grid');if(!home||!grid)return setTimeout(init,250);if(!grid.querySelector('[data-calm-open="compassHub"]'))grid.insertAdjacentHTML('beforeend','<button type="button" class="choice-card" data-calm-open="compassHub"><span>🌿</span><strong>Min inre kompass</strong><small>Compassion, cirklar och reflektion.</small></button>');
  addView('compassHub',`<button type="button" class="back" data-compass-home>← Hem</button><p class="eyebrow">Compassion i vardagen</p><h2>🌿 Min inre kompass</h2><p class="subtitle">Lägg märke till var du befinner dig och vad du behöver just nu.</p><div class="choice-grid"><button type="button" class="choice-card" data-compass-open="compassAbout"><span>🌿</span><strong>Vad är compassion?</strong><small>Om att möta det som är svårt med förståelse, omtanke och mod.</small></button><button type="button" class="choice-card" data-compass-open="compassCircles"><span>🟢 🔵 🔴</span><strong>Mina tre cirklar</strong><small>Trygghet, driv och hot – och varför vi vandrar mellan dem.</small></button><button type="button" class="choice-card" data-compass-open="compassReflect"><span>💚</span><strong>Stanna upp en stund</strong><small>Var är jag just nu och vad behöver jag?</small></button></div>`);
  addView('compassAbout',`<button type="button" class="back" data-compass-back>← Min inre kompass</button><h2>🌿 Vad är compassion?</h2><p>Compassion handlar om att kunna lägga märke till att något är svårt och möta det med förståelse, omtanke och mod.</p><p>Det betyder inte att allt ska kännas bra. Det handlar om att kunna fråga: <strong>Vad händer i mig just nu? Vad behöver jag? Vad skulle vara hjälpsamt?</strong></p><section class="panel calm" style="margin-top:18px"><h3>Vill du utforska det här tillsammans med någon?</h3><p>Ibland kan det vara hjälpsamt att få stöd i att förstå känslor, mönster och vad man behöver.</p><p><a class="primary" href="https://malix.se/samtal-online/" target="_blank" rel="noopener">🌿 Läs mer om samtal online</a></p></section>`);
  addView('compassCircles',`<button type="button" class="back" data-compass-back>← Min inre kompass</button><h2>🟢 🔵 🔴 Mina tre cirklar</h2><p>Vi vandrar mellan olika känslolägen under en vanlig dag. Cirklarna är inte bra eller dåliga – de hjälper oss att lägga märke till vad som händer inom oss.</p><div class="recipe-grid"><article class="recipe-card"><h3>🟢 Grön – trygghet och ro</h3><p>Lugn, trygghet, närhet och återhämtning. Vad hjälper mig att komma hit?</p></article><article class="recipe-card"><h3>🔵 Blå – driv och utforskande</h3><p>Jag gör, lär mig, undersöker, skapar eller strävar mot något. Vad driver mig just nu?</p></article><article class="recipe-card"><h3>🔴 Röd – hot och skydd</h3><p>Stress, oro, ilska, skam eller rädsla kan aktiveras. Vad hände och vad försöker mitt system skydda mig från?</p></article></div><p class="note">Fyrkanterna 🟥 🟨 🟩 🟦 hör till Min tid och planering. Cirklarna 🟢 🔵 🔴 hör till Min inre kompass.</p>`);
  addView('compassReflect',`<button type="button" class="back" data-compass-back>← Min inre kompass</button><h2>💚 Stanna upp en stund</h2><p class="note">Du kan göra flera avstämningar under samma dag. Varje sparad reflektion får automatiskt ett klockslag och visas nedanför.</p><section class="panel"><label>Vilken cirkel befinner jag mig i just nu?<select id="compassCircle"><option value="">Välj om du vill</option><option value="green">🟢 Grön – trygghet och ro</option><option value="blue">🔵 Blå – driv och utforskande</option><option value="red">🔴 Röd – hot och skydd</option></select></label><label>Vad tror jag gjorde att jag hamnade här?<textarea id="compassWhy" rows="2"></textarea></label><label>Vad märker jag i tankar, känslor och kropp?<textarea id="compassNotice" rows="2"></textarea></label><label>Vad behöver jag just nu?<textarea id="compassNeed" rows="2"></textarea></label><label>Hur kan jag möta mig själv med lite mer förståelse?<textarea id="compassCompassion" rows="2"></textarea></label><button type="button" class="primary" id="saveCompass">Spara min reflektion</button> <button type="button" class="secondary" id="cancelCompassEdit" hidden>Avbryt ändring</button><p class="status" id="compassStatus"></p></section><section class="panel calm" style="margin-top:18px"><p class="eyebrow">Dagens kompass</p><h3>🌿 Mina avstämningar idag</h3><p id="compassDaySummary" class="note"></p><div id="compassTodayList" class="recipe-grid"></div></section>`);
  wire();clearForm();renderToday();
 }
 function wire(){document.addEventListener('click',e=>{
   const open=e.target.closest('[data-compass-open]');if(open){e.preventDefault();show(open.dataset.compassOpen);if(open.dataset.compassOpen==='compassReflect'){clearForm();renderToday()}return}
   if(e.target.closest('[data-compass-back]')){e.preventDefault();show('compassHub');return}
   if(e.target.closest('[data-compass-home]')){e.preventDefault();show('home');return}
   const edit=e.target.closest('[data-compass-edit]');if(edit){e.preventDefault();loadEntry(edit.dataset.compassEdit);return}
   const del=e.target.closest('[data-compass-delete]');if(del){e.preventDefault();if(!confirm('Ta bort den här avstämningen?'))return;writeDay(dayEntries().filter(x=>x.id!==del.dataset.compassDelete));if(editingId===del.dataset.compassDelete)clearForm();renderToday();const s=document.querySelector('#compassStatus');if(s)s.textContent='Avstämningen är borttagen.';return}
   if(e.target.closest('#cancelCompassEdit')){e.preventDefault();clearForm();const s=document.querySelector('#compassStatus');if(s)s.textContent='Ändringen avbröts.';return}
   if(e.target.closest('#saveCompass')){
     const entry={circle:document.querySelector('#compassCircle')?.value||'',why:document.querySelector('#compassWhy')?.value.trim()||'',notice:document.querySelector('#compassNotice')?.value.trim()||'',need:document.querySelector('#compassNeed')?.value.trim()||'',compassion:document.querySelector('#compassCompassion')?.value.trim()||''};
     if(!entry.circle&&!entry.why&&!entry.notice&&!entry.need&&!entry.compassion){const s=document.querySelector('#compassStatus');if(s)s.textContent='Skriv eller välj något innan du sparar.';return}
     const wasEditing=!!editingId;
     let entries=dayEntries();
     if(wasEditing){entries=entries.map(x=>x.id===editingId?{...x,...entry,editedAt:new Date().toISOString()}:x)}else{entries.push({...entry,id:'compass-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),savedAt:new Date().toISOString()})}
     writeDay(entries);clearForm();renderToday();const s=document.querySelector('#compassStatus');if(s)s.textContent=wasEditing?'Ändringen är sparad ✓':'Reflektionen är sparad ✓';return
   }
 },true);document.addEventListener('malix-cloud-updated',renderToday)}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();