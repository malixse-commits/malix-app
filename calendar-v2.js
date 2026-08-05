(() => {
  const monthLabel = document.querySelector('#calendarMonth');
  const grid = document.querySelector('#calendarGrid');
  const detail = document.querySelector('#calendarDayDetail');
  if (!monthLabel || !grid || !detail) return;

  const localKey = window.malixLocalDateKey || (d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`);
  const mealKey = window.malixMealDateKey || (m => m.date ? localKey(new Date(m.date)) : localKey(new Date()));
  const today = () => localKey(new Date());
  let cursor = new Date();
  cursor.setDate(1);

  const getMeals = () => { try { return JSON.parse(localStorage.getItem('malix-meals') || '[]'); } catch { return []; } };
  const getReflections = () => { try { return JSON.parse(localStorage.getItem('en-sak-i-taget-mat-reflections') || '[]'); } catch { return []; } };
  const locked = key => localStorage.getItem(`malix-day-locked-${key}`) === 'true';

  function mealsFor(key) { return getMeals().filter(m => mealKey(m) === key); }
  function reflectionFor(key) {
    return getReflections().find(r => {
      if (!r.date) return false;
      const d = new Date(r.date);
      return !Number.isNaN(d.getTime()) && localKey(d) === key;
    });
  }

  function renderCalendar() {
    monthLabel.textContent = new Intl.DateTimeFormat('sv-SE',{month:'long',year:'numeric'}).format(cursor);
    const year = cursor.getFullYear(), month = cursor.getMonth();
    const first = new Date(year,month,1);
    const last = new Date(year,month+1,0);
    const startOffset = (first.getDay()+6)%7;
    const headers = ['M','T','O','T','F','L','S'].map(x=>`<div class="calendar-weekday">${x}</div>`).join('');
    let html = headers;
    for(let i=0;i<startOffset;i++) html += '<div></div>';
    for(let day=1;day<=last.getDate();day++){
      const d = new Date(year,month,day), key = localKey(d), count=mealsFor(key).length, isToday=key===today(), isLocked=locked(key);
      html += `<button type="button" class="calendar-day ${isToday?'today':''} ${isLocked?'locked':''}" data-day="${key}"><strong>${day}</strong><small>${count ? `${count} måltid${count===1?'':'er'}` : ''}${isLocked?' 🔒':''}</small></button>`;
    }
    grid.innerHTML = html;
    grid.querySelectorAll('[data-day]').forEach(b=>b.addEventListener('click',()=>renderDay(b.dataset.day)));
    renderDay(today());
  }

  function renderDay(key) {
    const meals=mealsFor(key), ref=reflectionFor(key), date=new Date(`${key}T12:00:00`), title=new Intl.DateTimeFormat('sv-SE',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(date);
    const mealHtml = meals.length ? meals.map(m=>`<article class="history-meal"><strong>${m.meal}</strong><p>${m.food || ''}</p>${m.portion?`<small>${m.portion}</small>`:''}${m.taste||m.satiety?`<small>${[m.taste,m.satiety].filter(Boolean).join(' · ')}</small>`:''}</article>`).join('') : '<p>Ingen mat sparad den här dagen.</p>';
    const refHtml = ref ? `<div class="calendar-reflection"><h4>🌙 Reflektion</h4>${ref.good?`<p><strong>Det som blev bra:</strong> ${ref.good}</p>`:''}${ref.different?`<p><strong>Annorlunda nästa gång:</strong> ${ref.different}</p>`:''}${ref.keep?`<p><strong>Det jag tar med mig:</strong> ${ref.keep}</p>`:''}</div>` : '';
    detail.innerHTML = `<div class="dashboard-heading"><div><p class="eyebrow">${key===today()?'Idag':'Historik'}</p><h3>${title}</h3></div><span class="badge">${locked(key)?'🔒 Låst':'Öppen'}</span></div>${mealHtml}${refHtml}${key!==today()?'<p class="note">Tidigare dagar är historik. Ny mat loggas på dagens datum.</p>':''}`;
  }

  document.querySelector('#calendarPrev')?.addEventListener('click',()=>{cursor.setMonth(cursor.getMonth()-1);renderCalendar();});
  document.querySelector('#calendarNext')?.addEventListener('click',()=>{cursor.setMonth(cursor.getMonth()+1);renderCalendar();});
  document.addEventListener('malix-day-changed',renderCalendar);
  window.addEventListener('storage',renderCalendar);
  renderCalendar();
})();