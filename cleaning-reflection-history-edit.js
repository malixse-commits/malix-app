(() => {
  const KEY = 'malix-cleaning-square-v2';
  const DAY_ORDER = [1,2,3,4,5,6,0];
  const esc = value => String(value ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; } };
  const save = state => {
    localStorage.setItem(KEY, JSON.stringify(state));
    document.dispatchEvent(new CustomEvent('malix-cleaning-changed'));
  };
  const weekdayName = day => ['Söndag','Måndag','Tisdag','Onsdag','Torsdag','Fredag','Lördag'][Number(day)] || '';

  function completionEntriesForDay(state, key) {
    return Object.entries(state.done?.[key] || {})
      .filter(([, value]) => !!value)
      .map(([id]) => {
        const raw = String(id);
        if (raw.startsWith('Dagens egna::')) {
          const dailyId = raw.slice('Dagens egna::'.length);
          const item = (state.dailyTasks?.[key] || []).find(x => String(x.id) === dailyId);
          return item
            ? {type:'daily', text:String(item.text ?? '')}
            : {type:'ambiguous', raw};
        }
        const parts = raw.split('::');
        if (parts.length === 2 && parts[0] && parts[1]) {
          return {type:'task', room:parts[0], task:parts[1]};
        }
        return {type:'ambiguous', raw};
      });
  }

  function buildHistoryModel(state) {
    const roomDates = new Map();
    const dailyDates = new Map();
    const ambiguousDates = new Map();

    Object.keys(state.done || {}).forEach(key => {
      completionEntriesForDay(state, key).forEach(entry => {
        if (entry.type === 'task') {
          if (!roomDates.has(entry.room)) roomDates.set(entry.room, new Map());
          const dates = roomDates.get(entry.room);
          if (!dates.has(key)) dates.set(key, []);
          dates.get(key).push(entry.task);
        } else if (entry.type === 'daily') {
          if (!dailyDates.has(key)) dailyDates.set(key, []);
          dailyDates.get(key).push(entry.text);
        } else if (entry.type === 'ambiguous') {
          if (!ambiguousDates.has(key)) ambiguousDates.set(key, []);
          ambiguousDates.get(key).push(entry.raw);
        }
      });
    });

    const historyByRoom = new Map();
    roomDates.forEach((dates, room) => {
      const recent = [...dates.keys()].sort().reverse().slice(0, 14);
      historyByRoom.set(room, recent.map(date => ({date, tasks:[...dates.get(date)]})));
    });

    const scheduleByRoom = new Map();
    DAY_ORDER.forEach(day => {
      const room = String(state.schedule?.[day] ?? '').trim();
      if (!room || room === 'Vila / valfritt') return;
      if (!scheduleByRoom.has(room)) scheduleByRoom.set(room, []);
      scheduleByRoom.get(room).push(weekdayName(day));
    });

    const currentRooms = new Set(Object.keys(state.rooms || {}));
    const scheduledRooms = new Set(scheduleByRoom.keys());
    const historyRooms = new Set(historyByRoom.keys());

    const currentSchedule = [...scheduleByRoom.entries()].map(([room, weekdays]) => ({
      room,
      weekdays:[...weekdays],
      history:historyByRoom.get(room) || []
    }));
    const outsideSchedule = [...historyRooms]
      .filter(room => currentRooms.has(room) && !scheduledRooms.has(room))
      .sort((a,b) => a.localeCompare(b, 'sv-SE'))
      .map(room => ({room, history:historyByRoom.get(room) || []}));
    const historicalRooms = [...historyRooms]
      .filter(room => !currentRooms.has(room) && !scheduledRooms.has(room))
      .sort((a,b) => a.localeCompare(b, 'sv-SE'))
      .map(room => ({room, history:historyByRoom.get(room) || []}));

    const recentMap = map => [...map.keys()].sort().reverse().slice(0, 14)
      .map(date => ({date, entries:[...(map.get(date) || [])]}));

    const legacy = Object.entries(state.activityLog || {})
      .filter(([, entries]) => Array.isArray(entries) && entries.length)
      .sort(([a],[b]) => b.localeCompare(a))
      .slice(0, 14)
      .map(([date, entries]) => ({date, entries}));

    const reflections = Object.entries(state.reflections || {})
      .filter(([, reflection]) => reflection?.date)
      .sort(([a],[b]) => b.localeCompare(a))
      .slice(0, 14)
      .map(([date, reflection]) => ({date, reflection}));

    return {
      currentSchedule,
      outsideSchedule,
      historicalRooms,
      daily:recentMap(dailyDates),
      ambiguous:recentMap(ambiguousDates),
      legacy,
      reflections
    };
  }

  function roomHistoryHtml(item, weekdays = []) {
    const days = weekdays.length ? `<p class="eyebrow">${esc(weekdays.join(' · '))}</p>` : '';
    const dates = item.history.length
      ? item.history.map(day => `<div data-clean-room-date="${esc(day.date)}" style="margin-top:10px"><strong>${esc(day.date)}</strong><ul>${day.tasks.map(task => `<li>${esc(task)}</li>`).join('')}</ul></div>`).join('')
      : '<p class="note">Ingen registrerad historik för rummet ännu.</p>';
    return `<article class="recipe-card" data-clean-room="${esc(item.room)}">${days}<h4>${esc(item.room)}</h4>${dates}</article>`;
  }

  function roomGroupHtml(title, items, withWeekdays = false) {
    if (!items.length) return '';
    return `<section data-clean-room-group style="margin-top:16px"><h3>${esc(title)}</h3><div class="recipe-grid">${items.map(item => roomHistoryHtml(item, withWeekdays ? item.weekdays : [])).join('')}</div></section>`;
  }

  function datedListHtml(title, items, renderEntry, attrs = '') {
    if (!items.length) return '';
    return `<section ${attrs} style="margin-top:18px"><h3>${esc(title)}</h3><div class="recipe-grid">${items.map(item => `<article class="recipe-card"><strong>${esc(item.date)}</strong><ul>${item.entries.map(renderEntry).join('')}</ul></article>`).join('')}</div></section>`;
  }

  function legacyEntryHtml(entry) {
    const room = entry?.room == null ? '' : String(entry.room);
    const text = entry?.text == null ? '' : String(entry.text);
    if (room && text) return `<li><strong>${esc(room)}</strong>: ${esc(text)}</li>`;
    if (room) return `<li><strong>Rum/område:</strong> ${esc(room)}</li>`;
    if (text) return `<li>${esc(text)}</li>`;
    return '<li><span class="note">Registreringen saknar sparad rum- och textuppgift.</span></li>';
  }

  function reflectionHistoryHtml(reflection) {
    if (!reflection?.date) return '';
    return `<section data-clean-reflection style="margin-top:10px"><h4>Reflektion</h4>${reflection.managed ? `<p><strong>Orkade jag?</strong> ${esc(reflection.managed)}</p>` : ''}${reflection.feeling ? `<p><strong>Hur blev det?</strong> ${esc(reflection.feeling)}</p>` : ''}${reflection.helped ? `<p><strong>Det här hjälpte mig:</strong> ${esc(reflection.helped)}</p>` : ''}${reflection.notice ? `<p><strong>Jag märkte:</strong> ${esc(reflection.notice)}</p>` : ''}${reflection.note ? `<p><strong>Tar med mig:</strong> ${esc(reflection.note)}</p>` : ''}${reflection.energy ? `<p><strong>Utrymme efteråt:</strong> ${esc(reflection.energy)}</p>` : ''}</section>`;
  }

  function renderHistoryMvp(force = false) {
    const history = document.querySelector('#cleanHistory');
    if (!history || (!force && history.dataset.cleanHistoryMvp === '1')) return;
    const model = buildHistoryModel(load());
    const parts = [
      roomGroupHtml('Aktuell städvecka', model.currentSchedule, true),
      roomGroupHtml('Rum utanför städveckan', model.outsideSchedule),
      roomGroupHtml('Historiska rum', model.historicalRooms),
      datedListHtml('Dagens egna', model.daily, text => `<li>${esc(text)}</li>`, 'data-clean-daily-history'),
      datedListHtml('Osäkra äldre registreringar', model.ambiguous, raw => `<li><strong>Äldre registrering – kan inte delas upp säkert:</strong> ${esc(raw)}</li>`, 'data-clean-ambiguous-history'),
      model.legacy.length ? `<section data-clean-legacy-history style="margin-top:18px"><h3>Äldre registreringar</h3><p class="note">Dessa visas separat och har inte slagits ihop med övrig historik.</p><div class="recipe-grid">${model.legacy.map(item => `<article class="recipe-card"><strong>${esc(item.date)}</strong><ul>${item.entries.map(legacyEntryHtml).join('')}</ul></article>`).join('')}</div></section>` : '',
      model.reflections.length ? `<section data-clean-reflection-history style="margin-top:18px"><h3>Städreflektioner</h3><div class="recipe-grid">${model.reflections.map(item => `<article class="recipe-card" data-clean-reflection-date="${esc(item.date)}"><strong>${esc(item.date)}</strong>${reflectionHistoryHtml(item.reflection)}</article>`).join('')}</div></section>` : ''
    ].filter(Boolean);

    history.innerHTML = parts.length
      ? parts.join('')
      : '<p class="note">Ingen sparad städhistorik ännu.</p>';
    history.dataset.cleanHistoryMvp = '1';
  }

  function editForm(key, reflection) {
    return `<form class="record-form" data-clean-history-edit-form="${esc(key)}" style="margin-top:12px">
      <label>Orkade jag det jag tänkte?
        <select name="managed">
          <option value="">Välj om du vill</option>
          ${['Ja','Delvis','Nej, jag behövde stanna tidigare','Jag hade ingen tydlig plan – jag började bara'].map(v => `<option ${reflection.managed === v ? 'selected' : ''}>${esc(v)}</option>`).join('')}
        </select>
      </label>
      <label>Hur blev det för mig?
        <select name="feeling">
          <option value="">Välj om du vill</option>
          ${['Det gick lättare än jag trodde','Det var lagom','Det tog mycket energi','Jag kom igång, och det känns bra'].map(v => `<option ${reflection.feeling === v ? 'selected' : ''}>${esc(v)}</option>`).join('')}
        </select>
      </label>
      <label>Vad hjälpte mig att komma igång idag?<textarea name="helped" rows="2">${esc(reflection.helped)}</textarea></label>
      <label>Vad märker jag nu?<textarea name="notice" rows="2">${esc(reflection.notice)}</textarea></label>
      <label>Vad tar jag med mig till nästa gång?<textarea name="note" rows="2">${esc(reflection.note)}</textarea></label>
      <label>Finns det utrymme för något mer just nu?
        <select name="energy">
          <option value="">Välj om du vill</option>
          ${['Ja, jag vill fortsätta','Kanske en liten sak','Nej, det räcker nu'].map(v => `<option ${reflection.energy === v ? 'selected' : ''}>${esc(v)}</option>`).join('')}
        </select>
      </label>
      <div class="chips"><button type="submit">Spara ändringar</button><button type="button" class="secondary" data-clean-history-cancel>Avbryt</button></div>
      <p class="status" data-clean-history-status></p>
    </form>`;
  }

  function enhanceHistory() {
    renderHistoryMvp();
    const history = document.querySelector('#cleanHistory');
    if (!history) return;
    const state = load();
    const cards = Array.from(history.querySelectorAll('article.recipe-card[data-clean-reflection-date]'));
    cards.forEach(card => {
      const key = card.dataset.cleanReflectionDate;
      const reflection = state.reflections?.[key];
      if (!key || !reflection?.date || card.querySelector('[data-clean-history-edit]')) return;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'secondary';
      button.dataset.cleanHistoryEdit = key;
      button.textContent = '✏️ Redigera reflektionen';
      card.appendChild(button);
      button.addEventListener('click', () => {
        button.hidden = true;
        const holder = document.createElement('div');
        holder.dataset.cleanHistoryEditor = key;
        holder.innerHTML = editForm(key, load().reflections?.[key] || {});
        card.appendChild(holder);
        const form = holder.querySelector('form');
        form.addEventListener('submit', event => {
          event.preventDefault();
          const next = load();
          const values = Object.fromEntries(new FormData(form).entries());
          next.reflections = next.reflections || {};
          next.reflections[key] = {...next.reflections[key], ...values, date:key};
          save(next);
          const status = form.querySelector('[data-clean-history-status]');
          if (status) status.textContent = 'Ändringarna är sparade ✓';
          setTimeout(() => window.malixOpenCleaning?.('cleaningStructure'), 250);
        });
        holder.querySelector('[data-clean-history-cancel]')?.addEventListener('click', () => {
          holder.remove();
          button.hidden = false;
        });
      });
    });
  }

  let scheduled = false;
  function scheduleEnhance() {
    if (scheduled) return;
    scheduled = true;
    setTimeout(() => {
      scheduled = false;
      enhanceHistory();
    }, 0);
  }

  document.addEventListener('click', event => {
    if (event.target.closest('[data-open-cleaning="cleaningStructure"], [data-calm-open="cleaningStructure"]')) scheduleEnhance();
  }, true);
  document.addEventListener('malix-cleaning-changed', () => {
    if (document.querySelector('[data-clean-history-edit-form]')) return;
    const history = document.querySelector('#cleanHistory');
    if (history) delete history.dataset.cleanHistoryMvp;
    scheduleEnhance();
  });
  const observer = new MutationObserver(scheduleEnhance);
  observer.observe(document.body, {childList:true, subtree:true});
  scheduleEnhance();
})();
