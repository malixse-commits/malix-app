(()=>{
 const KEY='malix-meals';
 const day=s=>{const d=new Date(s);if(Number.isNaN(d.getTime()))return'';return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
 function selectedDay(){const active=document.querySelector('[data-date].selected,[data-date].active,.calendar-day.selected,.calendar-day.active');const raw=active?.dataset?.date;return raw&&/^\d{4}-\d{2}-\d{2}$/.test(raw)?raw:day(new Date().toISOString())}
 function load(){try{const x=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(x)?x:[]}catch{return[]}}
 function init(){const form=document.querySelector('#mealForm');if(!form)return setTimeout(init,200);if(form.dataset.dedupeWired)return;form.dataset.dedupeWired='1';
  form.addEventListener('submit',e=>{const meal=form.elements.meal?.value;if(!meal)return;const target=selectedDay(),items=load(),matches=items.filter(x=>day(x.date)===target&&x.meal===meal);if(!matches.length)return;
   e.preventDefault();e.stopImmediatePropagation();const v=Object.fromEntries(new FormData(form).entries()),existing=matches[0],updated={...existing,...v,date:existing.date||new Date(target+'T12:00:00').toISOString(),updatedAt:new Date().toISOString()};const next=items.filter(x=>!(day(x.date)===target&&x.meal===meal));next.unshift(updated);localStorage.setItem(KEY,JSON.stringify(next.slice(0,100)));form.reset();const s=document.querySelector('#mealSaved');if(s)s.textContent=`${meal} för ${target} är uppdaterad ✓`;document.dispatchEvent(new CustomEvent('malix-meals-updated'));setTimeout(()=>{try{window.renderMeals?.()}catch{}},0)
  },true)
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();