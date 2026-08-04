(() => {
  const form = document.querySelector('#mealForm');
  if (!form) return;

  const catalog = {
    Frukost: {
      'Bröd & gryn': ['Brödskiva', 'Knäckebröd', 'Rostat bröd', 'Müsli', 'Havregrynsgröt'],
      'Mejeri': ['Mjölk', 'Filmjölk', 'Yoghurt', 'Kvarg'],
      'Pålägg': ['Ostskiva', 'Ägg', 'Skinka', 'Kalkon', 'Brieost'],
      'Frukt & grönt': ['Banan', 'Äpple', 'Bär', 'Tomat', 'Gurka', 'Sallad'],
      'Dryck': ['Kaffe', 'Te', 'Vatten', 'Juice']
    },
    Lunch: {
      'Maträtt': ['Maträtt från receptbanken', 'Soppa', 'Sallad', 'Smörgåsmåltid'],
      'Protein': ['Fisk', 'Kyckling', 'Kött', 'Köttfärs', 'Ägg', 'Bönor/linser'],
      'Tillbehör': ['Potatis', 'Ris', 'Pasta', 'Bröd'],
      'Grönsaker': ['Sallad', 'Morot', 'Ärtor', 'Majs', 'Paprika', 'Wokgrönsaker'],
      'Sås & dryck': ['Sås', 'Tzatziki', 'Fetaostkräm', 'Vatten', 'Mjölk']
    },
    Middag: {
      'Maträtt': ['Maträtt från receptbanken', 'Gryta', 'Soppa', 'Ugnsrätt'],
      'Protein': ['Fisk', 'Kyckling', 'Kött', 'Köttfärs', 'Ägg', 'Bönor/linser'],
      'Tillbehör': ['Potatis', 'Ris', 'Pasta', 'Rotfrukter', 'Bröd'],
      'Grönsaker': ['Sallad', 'Morot', 'Ärtor', 'Majs', 'Paprika', 'Kål', 'Wokgrönsaker'],
      'Sås & dryck': ['Sås', 'Tzatziki', 'Fetaostkräm', 'Vatten', 'Mjölk']
    },
    Mellanmål: {
      'Snabbt': ['Frukt', 'Yoghurt', 'Kvarg', 'Smörgås', 'Ägg'],
      'Till': ['Müsli', 'Bär', 'Ostskiva', 'Grönsaker'],
      'Dryck': ['Kaffe', 'Te', 'Vatten', 'Mjölk']
    },
    Kvällsmål: {
      'Mat': ['Smörgås', 'Knäckebröd', 'Yoghurt', 'Filmjölk', 'Kvarg', 'Ägg'],
      'Till': ['Ostskiva', 'Frukt', 'Bär', 'Tomat', 'Gurka'],
      'Dryck': ['Te', 'Vatten', 'Mjölk']
    }
  };

  const selected = [];
  const textareaLabel = form.querySelector('textarea[name="food"]').closest('label');
  const picker = document.createElement('section');
  picker.className = 'meal-picker';
  picker.innerHTML = `
    <h3>Välj det som ingick</h3>
    <p class="note">Tryck på ett livsmedel och välj mängd. Du kan också skriva något eget längre ner.</p>
    <div id="foodGroups"></div>
    <div class="panel calm" style="margin:12px 0">
      <strong>Din måltid</strong>
      <div id="selectedFoods" class="chips"><span class="note">Inget valt ännu.</span></div>
    </div>`;
  form.insertBefore(picker, textareaLabel);
  textareaLabel.querySelector('textarea').required = false;
  textareaLabel.querySelector('textarea').placeholder = 'Skriv här om något saknas i listan';
  textareaLabel.firstChild.textContent = 'Något annat?';

  const mealSelect = form.querySelector('select[name="meal"]');
  const groupsEl = picker.querySelector('#foodGroups');
  const selectedEl = picker.querySelector('#selectedFoods');

  function renderGroups() {
    groupsEl.innerHTML = '';
    const groups = catalog[mealSelect.value] || {};
    Object.entries(groups).forEach(([group, foods]) => {
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
    if (/bröd|knäcke/i.test(food)) return '1 skiva';
    if (/ost/i.test(food)) return '1 skiva';
    if (/kaffe|te/i.test(food)) return '1 kopp';
    if (/mjölk|fil|yoghurt|kvarg/i.test(food)) return '2 dl';
    if (/müsli|gröt/i.test(food)) return '1 dl';
    if (/frukt|banan|äpple|ägg/i.test(food)) return '1 st';
    return '1 portion';
  }

  function renderSelected() {
    selectedEl.innerHTML = selected.length
      ? selected.map((item, index) => `<button type="button" data-remove="${index}">${item.food}: ${item.quantity} ×</button>`).join('')
      : '<span class="note">Inget valt ännu.</span>';
    selectedEl.querySelectorAll('[data-remove]').forEach(button => button.addEventListener('click', () => {
      selected.splice(Number(button.dataset.remove), 1);
      renderSelected();
    }));
  }

  mealSelect.addEventListener('change', () => {
    selected.length = 0;
    renderGroups();
    renderSelected();
  });

  form.addEventListener('submit', event => {
    const textarea = form.querySelector('textarea[name="food"]');
    const ownText = textarea.value.trim();
    const pickedText = selected.map(item => `${item.food} (${item.quantity})`).join(', ');
    textarea.value = [pickedText, ownText].filter(Boolean).join(', ');
    if (!textarea.value) {
      event.preventDefault();
      alert('Välj minst ett livsmedel eller skriv vad du åt.');
      return;
    }
    setTimeout(() => {
      selected.length = 0;
      renderSelected();
      renderGroups();
    }, 0);
  }, true);

  renderGroups();
  renderSelected();
})();