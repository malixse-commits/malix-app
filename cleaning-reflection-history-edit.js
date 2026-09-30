(() => {
  const KEY = 'malix-cleaning-square-v2';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; } };
  const save = state => {
    localStorage.setItem(KEY, JSON.stringify(state));
    document.dispatchEvent(new CustomEvent('malix-cleaning-changed'));
  };

  function completionEntriesForDay(state, key) {
    return Object.entries(state.done?.[key] || {})
      .filter(([, value]) => !!value)
      .map(([id]) => {
        const raw = String(id);
        if (raw.startsWith('Dagens egna::')) {
          const dailyId = raw.slice('Dagens egna::'.length);
          const item = (state.dailyTasks?.[key] || []).find(x => String(x.id) === dailyId);
          return item?.text
            ? {type:'daily', text:String(item.text)}
            : {type:'daily-missing', raw};
        }
        const parts = raw.split('::');
        if (parts.length === 2 && parts[0] && parts[1]) {
          return {type:'task', room:parts[0], task:parts[1]};
        }
        return {type:'ambiguous', raw};
      });
  }

  function completionHistoryHtml(entries) {
    if (!entries.length) return '';
    return `<section data-clean-completions><h4>Utförd städning</h4><ul>${entries.map(entry => {
      if (entry.type === 'task') return `<li><strong>${esc(entry.room)}</strong>: ${esc(entry.task)}</li>`;
      if (entry.type === 'daily') return `<li><strong>Dagens egna:</strong> ${esc(entry.text)}</li>`;
      if (entry.type === 'daily-missing') return `<li><strong>Dagens egna:</strong> <span class="note">Completionreferensen ${esc(entry.raw)} finns sparad, men uppgiftstexten saknas.</span></li>`;
      return `<li><strong>Äldre registrering – kan inte delas upp säkert:</strong> ${esc(entry.raw)}</li>`;
    }).join('')}</ul></section>`;
  }

  function legacyHistoryHtml(entries) {
    if (!Array.isArray(entries) || !entries.length) return '';
    return `<section class="panel calm" data-clean-legacy-history style="margin-top:10px"><h4>Äldre registreringar</h4><p class="note">Dessa visas separat och har inte slagits ihop med övrig historik.</p><ul>${entries.map(entry => {
      const room = entry?.room == null ? '' : String(entry.room);
      const text = entry?.text == null ? '' : String(entry.text);
      if (room && text) return `<li><strong>${esc(room)}</strong>: ${esc(text)}</li>`;
      if (room) return `<li><strong>Rum/område:</strong> ${esc(room)}</li>`;
      if (text) return `<li>${esc(text)}</li>`;
      return '<li><span class="note">Registreringen saknar sparad rum- och textuppgift.</span></li>';
    }).join('')}</ul></section>`;
  }

  function reflectionHistoryHtml(reflection) {
    if (!reflection?.date) return '';
    return `<section data-clean-reflection style="margin-top:10px"><h4>Reflektion</h4>${reflection.managed ? `<p><strong>Orkade jag?</strong> ${esc(reflection.managed)}</p>` : ''}${reflection.feeling ? `<p><strong>Hur blev det?</strong> ${esc(reflection.feeling)}</p>` : ''}${reflection.helped ? `<p><strong>Det här hjälpte mig:</strong> ${esc(reflection.helped)}</p>` : ''}${reflection.notice ? `<p><strong>Jag märkte:</strong> ${esc(reflection.notice)}</p>` : ''}${reflection.note ? `<p><strong>Tar med mig:</strong> ${esc(reflection.note)}</p>` : ''}${reflection.energy ? `<p><strong>Utrymme efteråt:</strong> ${esc(reflection.energy)}</p>` : ''}</section>`;
  }

  function renderHistoryMvp(force = false) {
    const history = document.querySelector('#cleanHistory');
    if (!history || (!force && history.dataset.cleanHistoryMvp === '1')) return;
    const state = load();
    const doneDates = Object.entries(state.done || {})
      .filter(([, items]) => Object.values(items || {}).some(Boolean))
      .map(([key]) => key);
    const legacyDates = Object.entries(state.activityLog || {})
      .filter(([, items]) => Array.isArray(items) && items.length)
      .map(([key]) => key);
    const keys = [...new Set([
      ...doneDates,
      ...Object.keys(state.reflections || {}),
      ...legacyDates
    ])].sort().reverse().slice(0, 14);

    history.innerHTML = keys.length
      ? keys.map(key => {
          const completions = completionEntriesForDay(state, key);
          const legacy = state.activityLog?.[key] || [];
          const reflection = state.reflections?.[key] || {};
          return `<article class="recipe-card" data-clean-history-date="${esc(key)}"><strong>${esc(key)}</strong>${completionHistoryHtml(completions)}${legacyHistoryHtml(legacy)}${reflectionHistoryHtml(reflection)}</article>`;
        }).join('')
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
    const cards = Array.from(history.querySelectorAll('article.recipe-card[data-clean-history-date]'));
    cards.forEach(card => {
      const key = card.dataset.cleanHistoryDate;
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
