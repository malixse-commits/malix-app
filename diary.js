(() => {
  const form = document.querySelector('#mealForm');
  if (!form) return;

  const localKey = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  const mealDateKey = meal => meal.date ? localKey(new Date(meal.date)) : localKey(new Date());
  const todayKey = () => localKey(new Date());
  const activeKey = () => window.malixSelectedDateKey || todayKey();
  const isLocked = key => localStorage.getItem(`malix-day-locked-${key}`) === 'true';

  const catalog = {
    Frukost: {
      'Bröd & gryn': ['Brödskiva', 'Knäckebröd', 'Rostat bröd', 'Müsli', 'Havregrynsgröt', 'Overnight oats'],
      'Mejeri': ['Mjölk', 'Filmjölk', 'Yoghurt', 'Kvarg', 'Turkisk yoghurt'],
      'Pålägg': ['Ostskiva', 'Ägg', 'Skinka', 'Kalkon', 'Brieost', 'Färskost'],
      'Frukt & grönt': ['Banan', 'Äpple', 'Bär', 'Tomat', 'Gurka', 'Sallad', 'Paprika'],
      'Dryck': ['Kaffe', 'Te', 'Vatten', 'Juice']
    },
    Lunch: {
      'Maträtt': ['Maträtt från receptbanken', 'Soppa', 'Sallad', 'Smörgåsmåltid', 'Gryta'],
      'Protein': ['Fisk', 'Kyckling', 'Kött', 'Köttfärs', 'Ägg', 'Bönor/linser', 'Tofu'],
      'Tillbehör': ['Potatis', 'Ris', 'Pasta', 'Bröd', 'Bulgur', 'Couscous'],
      'Grönsaker': ['Sallad', 'Morot', 'Ärtor', 'Majs', 'Paprika', 'Broccoli', 'Kål', 'Wokgrönsaker'],
      'Sås & dryck': ['Sås', 'Tzatziki', 'Fetaostkräm', 'Filmjölkssås', 'Vatten', 'Mjölk']
    },
    Middag: {
      'Maträtt': ['Maträtt från receptbanken', 'Gryta', 'Soppa', 'Ugnsrätt', 'Pasta', 'Wok'],
      'Protein': ['Fisk', 'Kyckling', 'Kött', 'Köttfärs', 'Ägg', 'Bönor/linser', 'Tofu'],
      'Tillbehör': ['Potatis', 'Ris', 'Pasta', 'Rotfrukter', 'Bröd', 'Bulgur', 'Couscous'],
      'Grönsaker': ['Sallad', 'Morot', 'Ärtor', 'Majs', 'Paprika', 'Kål', 'Broccoli', 'Wokgrönsaker'],
      'Sås & dryck': ['Sås', 'Tzatziki', 'Fetaostkräm', 'Filmjölkssås', 'Vatten', 'Mjölk']
    },
    Mellanmål: {
      'Snabbt': ['Frukt', 'Yoghurt', 'Kvarg', 'Smörgås', 'Ägg', 'Smoothie'],
      'Till': ['Müsli', 'Bär', 'Ostskiva', 'Grönsaker'],
      'Dryck': ['Kaffe', 'Te', 'Vatten', 'Mjölk']
    },
    Kvällsmål: {
      'Mat': ['Smörgås', 'Knäckebröd', 'Yoghurt', 'Filmjölk', 'Kvarg', 'Ägg', 'Gröt'],
      'Till': ['Ostskiva', 'Frukt', 'Bär', 'Tomat', 'Gurka'],
      'Dryck': ['Te', 'Vatten', 'Mjölk']
    }
  };

  const selected = [];
  const textareaLabel = form.querySelector('textarea[name="food"]').closest('label');
  const picker = document.createElement('section');
  picker.className = 'meal-picker';
  picker.innerHTML = `<h3>Välj det som ingick</h3><p class="note">Tryck på ett livsmedel och välj mängd. Du kan också skriva något eget längre ner.</p><div id="activeLogDate" class="note"></div><div id="foodGroups"></div><div class="panel calm" style="margin:12px 0"><strong>Din måltid</strong><div id="selectedFoods" class="chips"><span class="note">Inget valt ännu.</span></div></div>`;
  form.insertBefore(picker, textareaLabel);
  textareaLabel.querySelector('textarea').required = false;
  textareaLabel.querySelector('textarea').placeholder = 'Skriv här om något saknas i listan';
  textareaLabel.firstChild.textContent = 'Något annat?';

  const mealSelect = form.querySelector('select[name="meal"]');
  const groupsEl = picker.querySelector('#foodGroups');
  const selectedEl = picker.querySelector('#selectedFoods');
  const activeDateEl = picker.querySelector('#activeLogDate');

  function activeDateLabel() {
    const d = new Date(`${activeKey()}T12:00:00`);
    return new Intl.DateTimeFormat('sv-SE',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(d);
  }

  function renderActiveDate() {
    const key = activeKey();
    activeDateEl.textContent = isLocked(key) ? `🔒 ${activeDateLabel()} är låst.` : `📅 Du loggar på ${activeDateLabel()}.`;
    [...form.elements].forEach(el => { el.disabled = isLocked(key); });
  }

  function renderGroups() {
    groupsEl.innerHTML = '';
    Object.entries(catalog[mealSelect.value] || {}).forEach(([group, foods]) => {
      const block = document.createElement('fieldset');
      block.innerHTML = `<legend>${group}</legend><div class="chips">${foods.map(food => `<button type="button" data-food="${food}">${food}</button>`).join('')}</div>`;
      groupsEl.appendChild(block);
    });
    groupsEl.querySelectorAll('[data-food]').forEach(button => button.addEventListener('click', () => addFood(button.dataset.food)));
  }

  function addFood(food) {
    const quantity = prompt(`Hur mycket ${food.toLowerCase()}?`, defaultAmount(food));
    if (quantity === null) return;
    selected.push({ food, quantity: quantity.trim() || '1 portion' });
    renderSelected();
  }

  function defaultAmount(food) {
    if (/bröd|knäcke|ost/i.test(food)) return '1 skiva';
    if (/kaffe|te/i.test(food)) return '1 kopp';
    if (/mjölk|fil|yoghurt|kvarg/i.test(food)) return '2 dl';
    if (/müsli|gröt|oats/i.test(food)) return '1 dl';
    if (/frukt|banan|äpple|ägg/i.test(food)) return '1 st';
    return '1 portion';
  }

  function renderSelected() {
    selectedEl.innerHTML = selected.length ? selected.map((item, index) => `<button type="button" data-remove="${index}">${item.food}: ${item.quantity} ×</button>`).join('') : '<span class="note">Inget valt ännu.</span>';
    selectedEl.querySelectorAll('[data-remove]').forEach(button => button.addEventListener('click', () => { selected.splice(Number(button.dataset.remove), 1); renderSelected(); }));
  }

  mealSelect.addEventListener('change', () => { selected.length = 0; renderGroups(); renderSelected(); });

  form.addEventListener('submit', event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    const key = activeKey();
    if (isLocked(key)) { alert('Den här dagen är låst. Välj en öppen dag i kalendern.'); return; }
    const textarea = form.querySelector('textarea[name="food"]');
    const ownText = textarea.value.trim();
    const pickedText = selected.map(item => `${item.food} (${item.quantity})`).join(', ');
    textarea.value = [pickedText, ownText].filter(Boolean).join(', ');
    if (!textarea.value) { alert('Välj minst ett livsmedel eller skriv vad du åt.'); return; }

    const values = Object.fromEntries(new FormData(form).entries());
    const meals = JSON.parse(localStorage.getItem('malix-meals') || '[]');
    const date = new Date(`${key}T12:00:00`);
    meals.unshift({...values,date:date.toISOString()});
    localStorage.setItem('malix-meals', JSON.stringify(meals.slice(0,500)));
    form.reset();
    selected.length = 0;
    renderSelected();
    renderGroups();
    renderActiveDate();
    window.renderMeals();
    const saved = document.querySelector('#mealSaved'); if (saved) saved.textContent = `Måltiden är sparad på ${activeDateLabel()} ✓`;
    document.dispatchEvent(new CustomEvent('malix-day-changed'));
  }, true);

  window.deleteMeal = storageIndex => {
    const meals = JSON.parse(localStorage.getItem('malix-meals') || '[]');
    const meal = meals[storageIndex];
    if (!meal) return;
    const key = mealDateKey(meal);
    if (isLocked(key)) { alert('Den här dagen är låst.'); return; }
    if (!confirm(`Ta bort ${meal.meal.toLowerCase()} – ${meal.food}?`)) return;
    meals.splice(storageIndex, 1);
    localStorage.setItem('malix-meals', JSON.stringify(meals));
    window.renderMeals();
    document.dispatchEvent(new CustomEvent('malix-day-changed'));
  };

  window.renderMeals = () => {
    const meals = JSON.parse(localStorage.getItem('malix-meals') || '[]');
    const history = document.querySelector('#mealHistory');
    if (!history) return;
    const key = activeKey();
    const shown = meals.map((meal, storageIndex) => ({meal, storageIndex})).filter(x => mealDateKey(x.meal) === key);
    history.innerHTML = shown.length ? shown.map(({meal, storageIndex}) => `<article class="recipe-card"><h3>${meal.meal}</h3><p>${meal.food}</p><small>${[meal.portion,meal.taste,meal.satiety].filter(Boolean).join(' · ')}</small>${isLocked(key)?'<div class="badge">🔒 Låst dag</div>':`<div style="margin-top:12px"><button type="button" class="secondary" data-delete-meal="${storageIndex}" onclick="deleteMeal(${storageIndex})">Ta bort måltiden</button></div>`}</article>`).join('') : `<div class="empty">Ingen måltid sparad på ${activeDateLabel()} ännu.</div>`;
    renderActiveDate();
  };

  document.addEventListener('malix-log-date-changed', () => { selected.length=0; renderSelected(); window.renderMeals(); renderActiveDate(); });

  renderGroups(); renderSelected(); renderActiveDate(); window.renderMeals();
})();