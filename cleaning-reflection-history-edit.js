(() => {
  const KEY = 'malix-cleaning-square-v2';
  const esc = value => String(value || '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; } };
  const save = state => {
    localStorage.setItem(KEY, JSON.stringify(state));
    document.dispatchEvent(new CustomEvent('malix-cleaning-changed'));
  };

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
    const history = document.querySelector('#cleanHistory');
    if (!history) return;
    const state = load();
    const cards = Array.from(history.querySelectorAll('article.recipe-card'));
    cards.forEach(card => {
      const key = card.querySelector('strong')?.textContent?.trim();
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

  document.addEventListener('click', event => {
    if (event.target.closest('[data-open-cleaning="cleaningStructure"]')) setTimeout(enhanceHistory, 0);
  }, true);
  document.addEventListener('malix-cleaning-changed', () => setTimeout(enhanceHistory, 0));
  const observer = new MutationObserver(() => enhanceHistory());
  observer.observe(document.body, {childList:true, subtree:true});
  enhanceHistory();
})();