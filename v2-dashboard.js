(() => {
  const localDateKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  const todayKey = () => localDateKey();
  const lockKey = () => `malix-day-finalized-${todayKey()}`;
  const getMeals = () => { try { return JSON.parse(localStorage.getItem('malix-meals') || '[]'); } catch { return []; } };
  const mealDateKey = meal => {
    if (!meal.date) return todayKey();
    const d = new Date(meal.date);
    return Number.isNaN(d.getTime()) ? String(meal.date).slice(0,10) : localDateKey(d);
  };
  const todayMeals = () => getMeals().filter(m => mealDateKey(m) === todayKey());
  const isLocked = () => localStorage.getItem(lockKey()) === 'true';

  const proteinWords = ['fisk','lax','torsk','fiskpanett','kyckling','kött','köttfärs','korv','ägg','ost','kvarg','yoghurt','filmjölk','mjölk','bön','linser','kikärt','jordnöt'];
  const fiberWords = ['fullkorn','havre','müsli','knäck','bön','linser','kikärt','grönsak','morot','kål','broccoli','ärtor','majs','paprika','frukt','äpple','banan','bär','potatis'];
  const produceWords = ['morot','kål','broccoli','ärtor','majs','paprika','tomat','gurka','sallad','spenat','lök','vitlök','avokado','äpple','banan','bär','frukt','citron','rödbet','palsternack','blomkål','potatis'];
  const plantWords = ['morot','vitkål','kål','broccoli','ärtor','majs','paprika','tomat','gurka','sallad','spenat','lök','vitlök','avokado','äpple','banan','bär','citron','rödbeta','palsternacka','blomkål','potatis','ris','havre','bönor','linser','kikärtor','dill','rosmarin','timjan','chili'];

  function countMealsWith(words, meals) { return meals.filter(meal => words.some(word => (meal.food || '').toLowerCase().includes(word))).length; }
  function uniquePlants(meals) { const text = meals.map(m => m.food || '').join(' ').toLowerCase(); return [...new Set(plantWords.filter(word => text.includes(word)))]; }

  function renderMealStatus(meals) {
    const target = document.querySelector('#mealStatus'); if (!target) return;
    const types = ['Frukost','Lunch','Middag','Mellanmål','Kvällsmål'];
    target.innerHTML = types.map(type => { const done = meals.some(m => m.meal === type); return `<div class="meal-status ${done ? 'done' : ''}"><span>${done ? '✓' : '○'}</span><strong>${type}</strong></div>`; }).join('');
  }

  function renderLockState() {
    const locked = isLocked(), button = document.querySelector('#dayLockButton'), status = document.querySelector('#dayLockStatus');
    if (button) { button.textContent = locked ? '🔒 Dagen är låst' : '🔒 Lås dagen'; button.disabled = locked; }
    if (status) status.textContent = locked ? 'Dagen är avslutad och låst.' : 'Lås dagen först när du är säker på att du är färdig.';
  }

  function renderSummary() {
    const meals = todayMeals(); renderMealStatus(meals);
    const proteinMeals = countMealsWith(proteinWords, meals), fiberMeals = countMealsWith(fiberWords, meals), produceMeals = countMealsWith(produceWords, meals), plants = uniquePlants(meals);
    const set=(id,text)=>{const e=document.querySelector(id);if(e)e.textContent=text};
    set('#todayDateLabel', new Intl.DateTimeFormat('sv-SE',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(new Date()));
    set('#proteinSummary', meals.length ? `${proteinMeals} av ${meals.length} måltider med tydlig proteinkälla` : 'Ingen mat loggad ännu');
    set('#fiberSummary', meals.length ? `${fiberMeals} av ${meals.length} måltider med tydlig fiberkälla` : 'Ingen mat loggad ännu');
    set('#produceSummary', meals.length ? `${produceMeals} måltider med frukt/grönt i loggen` : 'Ingen mat loggad ännu');
    set('#plantSummary', meals.length ? `${plants.length} olika växter hittade i dagens logg` : 'Ingen mat loggad ännu');
    set('#vitaminSummary', plants.length >= 5 ? 'Flera olika växtkällor – exakt vitamin/mineraldata kommer när livsmedelsdatabasen kopplas in' : 'Exakt vitamin/mineraldata kommer när livsmedelsdatabasen kopplas in');
    const note = document.querySelector('#dailyFoodNote');
    if (note) {
      if (!meals.length) note.textContent = 'Börja med att logga en måltid. Översikten fylls på under dagen.';
      else if (plants.length >= 5 && proteinMeals >= 2) note.textContent = 'Dagens logg visar både flera växter och flera måltider med proteinkälla. Detta är en första översikt – inte ett betyg.';
      else note.textContent = 'Det här är en preliminär översikt byggd från orden i din matlogg. Exakta gram, kalorier och vitaminer kommer när livsmedelsdatabasen är kopplad.';
    }
    renderLockState();
  }

  document.querySelector('#dayLockButton')?.addEventListener('click', () => {
    if (isLocked()) return;
    if (!confirm('Vill du låsa dagens mat? När dagen är låst går den inte att öppna igen.')) return;
    localStorage.setItem(lockKey(), 'true');
    renderSummary();
    document.dispatchEvent(new CustomEvent('malix-day-changed'));
  });

  window.addEventListener('storage', renderSummary);
  window.malixLocalDateKey = localDateKey;
  window.malixMealDateKey = mealDateKey;
  window.malixRenderToday = renderSummary;
  renderSummary();
})();