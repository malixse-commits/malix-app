(() => {
  const todayKey = () => new Date().toISOString().slice(0,10);
  const lockKey = () => `malix-day-locked-${todayKey()}`;
  const getMeals = () => { try { return JSON.parse(localStorage.getItem('malix-meals') || '[]'); } catch { return []; } };
  const isToday = meal => !meal.date || String(meal.date).slice(0,10) === todayKey();
  const todayMeals = () => getMeals().filter(isToday);
  const isLocked = () => localStorage.getItem(lockKey()) === 'true';

  const proteinWords = ['fisk','lax','torsk','fiskpanett','kyckling','kött','köttfärs','korv','ägg','ost','kvarg','yoghurt','filmjölk','mjölk','bön','linser','kikärt','jordnöt'];
  const fiberWords = ['fullkorn','havre','müsli','knäck','bön','linser','kikärt','grönsak','morot','kål','broccoli','ärtor','majs','paprika','frukt','äpple','banan','bär','potatis'];
  const produceWords = ['morot','kål','broccoli','ärtor','majs','paprika','tomat','gurka','sallad','spenat','lök','vitlök','avokado','äpple','banan','bär','frukt','citron','rödbet','palsternack','blomkål','potatis'];
  const plantWords = ['morot','vitkål','kål','broccoli','ärtor','majs','paprika','tomat','gurka','sallad','spenat','lök','vitlök','avokado','äpple','banan','bär','citron','rödbeta','palsternacka','blomkål','potatis','ris','havre','bönor','linser','kikärtor','dill','rosmarin','timjan','chili'];

  function countMealsWith(words, meals) { return meals.filter(meal => words.some(word => (meal.food || '').toLowerCase().includes(word))).length; }
  function uniquePlants(meals) { const text = meals.map(m => m.food || '').join(' ').toLowerCase(); return [...new Set(plantWords.filter(word => text.includes(word)))]; }

  function renderMealStatus(meals) {
    const target = document.querySelector('#mealStatus');
    if (!target) return;
    const types = ['Frukost','Lunch','Middag','Mellanmål','Kvällsmål'];
    target.innerHTML = types.map(type => {
      const done = meals.some(m => m.meal === type);
      return `<div class="meal-status ${done ? 'done' : ''}"><span>${done ? '✓' : '○'}</span><strong>${type}</strong></div>`;
    }).join('');
  }

  function renderLockState() {
    const locked = isLocked();
    const button = document.querySelector('#dayLockButton');
    const status = document.querySelector('#dayLockStatus');
    const form = document.querySelector('#mealForm');
    const notice = document.querySelector('#foodLogLockNotice');
    if (button) button.textContent = locked ? '🔓 Lås upp dagen' : '🔒 Lås dagen';
    if (status) status.textContent = locked ? 'Dagen är låst. Måltiderna ligger kvar men kan inte ändras förrän du låser upp.' : 'När du är färdig för dagen kan du låsa den.';
    if (form) [...form.elements].forEach(el => { el.disabled = locked; });
    if (notice) notice.hidden = !locked;
    document.querySelectorAll('[data-delete-meal]').forEach(btn => { btn.disabled = locked; btn.textContent = locked ? 'Dagen är låst' : 'Ta bort måltiden'; });
  }

  function renderSummary() {
    const meals = todayMeals();
    renderMealStatus(meals);
    const proteinMeals = countMealsWith(proteinWords, meals);
    const fiberMeals = countMealsWith(fiberWords, meals);
    const produceMeals = countMealsWith(produceWords, meals);
    const plants = uniquePlants(meals);
    document.querySelector('#proteinSummary').textContent = meals.length ? `${proteinMeals} av ${meals.length} måltider med tydlig proteinkälla` : 'Ingen mat loggad ännu';
    document.querySelector('#fiberSummary').textContent = meals.length ? `${fiberMeals} av ${meals.length} måltider med tydlig fiberkälla` : 'Ingen mat loggad ännu';
    document.querySelector('#produceSummary').textContent = meals.length ? `${produceMeals} måltider med frukt/grönt i loggen` : 'Ingen mat loggad ännu';
    document.querySelector('#plantSummary').textContent = meals.length ? `${plants.length} olika växter hittade i dagens logg` : 'Ingen mat loggad ännu';
    document.querySelector('#vitaminSummary').textContent = plants.length >= 5 ? 'Flera olika växtkällor – exakt vitamin/mineraldata kommer när livsmedelsdatabasen kopplas in' : 'Exakt vitamin/mineraldata kommer när livsmedelsdatabasen kopplas in';
    const note = document.querySelector('#dailyFoodNote');
    if (!meals.length) note.textContent = 'Börja med att logga en måltid. Översikten fylls på under dagen.';
    else if (plants.length >= 5 && proteinMeals >= 2) note.textContent = 'Dagens logg visar både flera växter och flera måltider med proteinkälla. Detta är en första översikt – inte ett betyg.';
    else note.textContent = 'Det här är en preliminär översikt byggd från orden i din matlogg. Exakta gram, kalorier och vitaminer kommer när livsmedelsdatabasen är kopplad.';
    renderLockState();
  }

  document.querySelector('#dayLockButton')?.addEventListener('click', () => {
    const next = !isLocked();
    if (next && !confirm('Låsa dagens mat? Du kan låsa upp dagen igen om du behöver ändra något.')) return;
    localStorage.setItem(lockKey(), String(next));
    renderSummary();
  });

  document.querySelector('#mealForm')?.addEventListener('submit', event => {
    if (isLocked()) { event.preventDefault(); event.stopImmediatePropagation(); alert('Dagen är låst. Lås upp den på startsidan först.'); return; }
    setTimeout(renderSummary, 120);
  });

  document.querySelector('#mealHistory')?.addEventListener('click', event => {
    if (!event.target.closest('[data-delete-meal]')) return;
    if (isLocked()) { event.preventDefault(); event.stopImmediatePropagation(); alert('Dagen är låst. Lås upp den på startsidan först.'); }
    else setTimeout(renderSummary, 120);
  }, true);

  window.addEventListener('storage', renderSummary);
  renderSummary();
})();