(()=>{
 const KEY='malix-my-time-v1';
 const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return[]}};
 const esc=s=>String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
 const icon=c=>c==='red'?'🟥':c==='yellow'?'🟨':c==='green'?'🟩':'🟦';
 function render(){const week=document.querySelector('#myTime #week');if(!week)return;week.querySelectorAll('[data-week-details]').forEach(x=>x.remove());week.querySelectorAll('[data-day]').forEach(btn=>{const d=btn.dataset.day,a=load().filter(x=>x.type==='event'&&x.date===d).sort((x,y)=>String(x.start||'').localeCompare(String(y.start||'')));const box=document.createElement('div');box.dataset.weekDetails=d;box.style.margin='2px 6px 10px 12px';box.style.fontSize='0.92em';box.innerHTML=a.length?a.map(x=>`<div>${icon(x.color)} ${esc(x.start)}–${esc(x.end)} · <strong>${esc(x.title)}</strong></div>`).join(''):'<div class="note">Inget planerat.</div>';btn.insertAdjacentElement('afterend',box)})}
 function init(){const week=document.querySelector('#myTime #week');if(!week)return setTimeout(init,250);render();new MutationObserver(()=>requestAnimationFrame(render)).observe(week,{childList:true,subtree:false});document.addEventListener('malix-time-date-changed',()=>setTimeout(render,50));document.addEventListener('malix-cloud-updated',()=>setTimeout(render,80));document.addEventListener('malix-time-extra-added',()=>setTimeout(render,80));}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();