(() => {
 const KEY='malix-food-day-locks-v1';
 const localDate=(d=new Date())=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
 const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}};
 const save=v=>localStorage.setItem(KEY,JSON.stringify(v));
 function currentDate(){
   const selected=document.querySelector('[data-date].selected,[data-date].active,.calendar-day.selected,.calendar-day.active');
   const raw=selected?.dataset?.date;
   if(raw&&/^\d{4}-\d{2}-\d{2}$/.test(raw))return raw;
   return localDate();
 }
 function isLocked(date){return !!load()[date]}
 function setLocked(date,locked){const a=load();if(locked)a[date]=true;else delete a[date];save(a)}
 function updateUI(){
   const btn=document.querySelector('#dayLockButton');if(!btn)return;
   const date=currentDate(),locked=isLocked(date),status=document.querySelector('#dayLockStatus');
   btn.textContent=locked?'🔓 Lås upp dagen':'🔒 Lås dagen';
   btn.dataset.lockDate=date;
   if(status)status.textContent=locked?'Dagen är låst. Du kan låsa upp den igen om du behöver ändra något.':'';
   const form=document.querySelector('#mealForm');
   if(form){[...form.querySelectorAll('input,textarea,select,button')].forEach(el=>{if(el.id!=='dayLockButton')el.disabled=locked});}
   const note=document.querySelector('#foodLogLockNotice');if(note)note.hidden=!locked;
 }
 function init(){
   const btn=document.querySelector('#dayLockButton');if(!btn)return setTimeout(init,250);
   if(btn.dataset.lockWired==='1'){updateUI();return}
   btn.dataset.lockWired='1';
   btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const date=btn.dataset.lockDate||currentDate();setLocked(date,!isLocked(date));updateUI()});
   document.addEventListener('click',e=>{if(e.target.closest('#calendarGrid,[data-open="foodLog"]'))setTimeout(updateUI,80)},true);
   document.addEventListener('submit',e=>{if(e.target?.id==='mealForm'&&isLocked(currentDate())){e.preventDefault();e.stopImmediatePropagation();const s=document.querySelector('#mealSaved');if(s)s.textContent='Dagen är låst. Lås upp den om du vill lägga till eller ändra mat.'}},true);
   updateUI();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();