(() => {
  const monthLabel = document.querySelector('#calendarMonth');
  const grid = document.querySelector('#calendarGrid');
  const detail = document.querySelector('#calendarDayDetail');
  if (!monthLabel || !grid || !detail) return;

  const localKey = window.malixLocalDateKey || (d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`);
  const mealKey = window.malixMealDateKey || (m => m.date ? localKey(new Date(m.date)) : localKey(new Date()));
  const today = () => localKey(new Date());
  window.malixSelectedDateKey = window.malixSelectedDateKey || today();
  let cursor = new Date();
  cursor.setDate(1);

  const getMeals = () => { try { return JSON.parse(localStorage.getItem('malix-meals') || '[]'); } catch { return []; } };
  const getReflections = () => { try { return JSON.parse(localStorage.getItem('en-sak-i-taget-mat-reflections') || '[]'); } catch { return []; } };
  const getTimeItems = () => { try { return JSON.parse(localStorage.getItem('malix-my-time-v1') || '[]'); } catch { return []; } };
  const locked = key => localStorage.getItem(`malix-day-finalized-${key}`) === 'true' || !!((() => { try { return JSON.parse(localStorage.getItem('malix-time-day-locks-v1') || '{}'); } catch { return {}; } })()[key]);

  function mealsFor(key) { return getMeals().filter(m => mealKey(m) === key); }
  function timeFor(key) { return getTimeItems().filter(x => x.type === 'event' && x.date === key).sort((a,b)=>String(a.start||'').localeCompare(String(b.start||''))); }
  function reflectionFor(key) {
    return getReflections().find(r => {
      if (!r.date) return false;
      const d = new Date(r.date);
      return !Number.isNaN(d.getTime()) && localKey(d) === key;
    });
  }
  function icon(c){ return c==='red'?'🟥':c==='yellow'?'🟨':c==='green'?'🟩':'🟦'; }
  function esc(s){ return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }

  function setSelectedDay(key) {
    if (locked(key)) return;
    window.malixSelectedDateKey = key;
    document.dispatchEvent(new CustomEvent('malix-log-date-changed', { detail: { key } }));
    renderCalendar();
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
      const d = new Date(year,month,day), key = localKey(d), mealCount=mealsFor(key).length, timeCount=timeFor(key).length, isToday=key===today(), isLocked=locked(key), selected=key===window.malixSelectedDateKey;
      const bits=[]; if(timeCount) bits.push(`${timeCount} tid${timeCount===1?'':'er'}`); if(mealCount) bits.push(`${mealCount} måltid${mealCount===1?'':'er'}`);
      html += `<button type="button" class="calendar-day ${isToday?'today':''} ${isLocked?'locked':''} ${selected?'selected':''}" data-day="${key}"><strong>${day}</strong><small>${bits.join(' · ')}${isLocked?' 🔒':''}</small></button>`;
    }
    grid.innerHTML = html;
    grid.querySelectorAll('[data-day]').forEach(b=>b.addEventListener('click',()=>renderDay(b.dataset.day)));
    renderDay(window.malixSelectedDateKey || today());
  }

  function renderDay(key) {
    const meals=mealsFor(key), times=timeFor(key), ref=reflectionFor(key), date=new Date(`${key}T12:00:00`), title=new Intl.DateTimeFormat('sv-SE',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(date), isLocked=locked(key);
    const timeHtml = times.length ? `<div class="calendar-time"><h4>🗓️ Min tid</h4>${times.map(x=>`<article class="history-meal"><strong>${icon(x.color)} ${esc(x.start)}–${esc(x.end)} ${esc(x.title)}</strong></article>`).join('')}</div>` : '<div class="calendar-time"><h4>🗓️ Min tid</h4><p>Inga fyrkanter sparade den här dagen.</p></div>';
    const mealHtml = meals.length ? `<div class="calendar-meals"><h4>🍽️ Mat</h4>${meals.map(m=>`<article class="history-meal"><strong>${esc(m.meal)}</strong><p>${esc(m.food || '')}</p>${m.portion?`<small>${esc(m.portion)}</small>`:''}${m.taste||m.satiety?`<small>${[m.taste,m.satiety].filter(Boolean).map(esc).join(' · ')}</small>`:''}</article>`).join('')}</div>` : '<div class="calendar-meals"><h4>🍽️ Mat</h4><p>Ingen mat sparad den här dagen.</p></div>';
    const refHtml = ref ? `<div class="calendar-reflection"><h4>🌙 Reflektion</h4>${ref.good?`<p><strong>Det som blev bra:</strong> ${esc(ref.good)}</p>`:''}${ref.different?`<p><strong>Annorlunda nästa gång:</strong> ${esc(ref.different)}</p>`:''}${ref.keep?`<p><strong>Det jag tar med mig:</strong> ${esc(ref.keep)}</p>`:''}</div>` : '';
    const action = isLocked
      ? '<p class="note">🔒 Den här dagen är låst och kan bara läsas.</p>'
      : `<button type="button" class="primary" id="logThisDay">📝 Logga mat på den här dagen</button><p class="note">Dagen är öppen. Du kan komplettera även i efterhand om du glömde något.</p>`;
    detail.innerHTML = `<div class="dashboard-heading"><div><p class="eyebrow">${key===today()?'Idag':'Kalenderdag'}</p><h3>${title}</h3></div><span class="badge">${isLocked?'🔒 Låst':'Öppen'}</span></div>${timeHtml}${mealHtml}${refHtml}${action}`;
    document.querySelector('#logThisDay')?.addEventListener('click', () => setSelectedDay(key));
  }

  document.querySelector('#calendarPrev')?.addEventListener('click',()=>{cursor.setMonth(cursor.getMonth()-1);renderCalendar();});
  document.querySelector('#calendarNext')?.addEventListener('click',()=>{cursor.setMonth(cursor.getMonth()+1);renderCalendar();});
  document.addEventListener('malix-day-changed',renderCalendar);
  document.addEventListener('malix-time-updated',renderCalendar);
  window.addEventListener('storage',renderCalendar);
  renderCalendar();
})();