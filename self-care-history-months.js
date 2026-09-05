(() => {
 const KEY='malix-self-care-v1';
 const MONTHS=['januari','februari','mars','april','maj','juni','juli','augusti','september','oktober','november','december'];
 const esc=s=>String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
 const load=()=>{try{const a=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(a)?a:[]}catch{return[]}};
 const save=a=>localStorage.setItem(KEY,JSON.stringify(a));
 const monthKey=d=>{const x=new Date(d);return Number.isNaN(x.getTime())?'':`${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,'0')}`};
 const monthLabel=k=>{const [y,m]=k.split('-').map(Number);return `${MONTHS[m-1]} ${y}`};
 const fingerprint=x=>[monthKey(x.date),String(x.type||'').trim(),String(x.text||'').trim(),String(x.extra||'').trim()].join('|').toLocaleLowerCase('sv-SE');
 const isTraining=x=>String(x?.type||'').toLocaleLowerCase('sv-SE').includes('träning');
 function unique(items){const seen=new Set();return items.filter(x=>{const k=fingerprint(x);if(seen.has(k))return false;seen.add(k);return true})}
 function render(){
  const box=document.querySelector('#careHistory');if(!box)return;
  const all=unique(load()).sort((a,b)=>new Date(b.date)-new Date(a.date));
  if(!all.length){box.innerHTML='<p class="note">Här kommer du kunna se dina sparade stunder och reflektioner.</p>';return}
  const groups={};all.forEach(x=>{const k=monthKey(x.date);if(k)(groups[k]||(groups[k]=[])).push(x)});
  const keys=Object.keys(groups).sort().reverse();if(!keys.length)return;
  const now=new Date(),current=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
  const selected=box.dataset.careMonth&&groups[box.dataset.careMonth]?box.dataset.careMonth:(groups[current]?current:keys[0]);box.dataset.careMonth=selected;
  const cards=groups[selected].map(x=>`<article class="recipe-card"><p class="eyebrow">${new Date(x.date).toLocaleDateString('sv-SE')}</p><h3>${esc(x.type)}</h3><p>${esc(x.text)}</p>${x.extra?`<p class="note">${esc(x.extra)}</p>`:''}${isTraining(x)?`<button type="button" class="secondary" data-care-history-delete="${x.id}">Ta bort</button>`:''}</article>`).join('');
  box.innerHTML=`<h3>Det jag gjort för mig själv</h3><label style="display:block;margin:12px 0">Visa månad<select id="careHistoryMonth">${keys.map(k=>`<option value="${k}"${k===selected?' selected':''}>${monthLabel(k)}</option>`).join('')}</select></label><div class="recipe-grid">${cards}</div><section class="panel calm" style="margin-top:16px"><p class="note">För helhetsbilden finns <strong>Månadens återblick</strong> på Ta hand om mig-sidan.</p></section>`;
  box.querySelector('#careHistoryMonth')?.addEventListener('change',e=>{box.dataset.careMonth=e.target.value;render()});
 }
 const observer=new MutationObserver(()=>{const box=document.querySelector('#careHistory');if(!box||box.dataset.monthRenderBusy==='1')return;box.dataset.monthRenderBusy='1';queueMicrotask(()=>{render();box.dataset.monthRenderBusy='0'})});
 observer.observe(document.body,{childList:true,subtree:true});
 document.addEventListener('click',e=>{
  const del=e.target.closest('[data-care-history-delete]');
  if(del){e.preventDefault();e.stopPropagation();const id=del.dataset.careHistoryDelete;save(load().filter(x=>String(x.id)!==String(id)));render();window.malixRenderTrainingToday?.();return}
  if(e.target.closest('[data-care="careReflection"]'))setTimeout(render,0)
 },true);
 window.malixRenderCareHistoryByMonth=render;
 setTimeout(render,0);
})();