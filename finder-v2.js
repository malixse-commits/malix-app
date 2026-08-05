(() => {
  const target = document.querySelector('#suggestions');
  const message = document.querySelector('#suggestionMessage');
  const showButton = document.querySelector('#showSuggestionsV2');
  const resetButton = document.querySelector('#resetSuggestionsV2');
  if (!target || !showButton || typeof recipes === 'undefined') return;

  const state = { time:null, budget:'any', tag:null, energy:'any' };
  const buttons = [...document.querySelectorAll('[data-finder]')];

  buttons.forEach(button => button.addEventListener('click', () => {
    const key = button.dataset.finder;
    state[key] = button.dataset.value;
    document.querySelectorAll(`[data-finder="${key}"]`).forEach(b => b.classList.toggle('active', b === button));
  }));

  function fitsTime(r) {
    return !state.time || state.time === '999' || Number(r.time || 999) <= Number(state.time);
  }
  function fitsBudget(r) {
    return state.budget === 'any' || !state.budget || r.budget === state.budget;
  }
  function fitsTag(r) {
    return !state.tag || state.tag === 'överraska' || (r.tags || []).includes(state.tag);
  }
  function fitsEnergy(r) {
    if (state.energy === 'any' || !state.energy) return true;
    const time = Number(r.time || 999);
    if (state.energy === 'low') return time <= 20 || (r.tags || []).includes('snabbt') || (r.tags || []).includes('slowcooker');
    if (state.energy === 'normal') return time <= 60;
    return true;
  }

  function score(r) {
    let s = 0;
    if (fitsTime(r)) s += 3;
    if (fitsBudget(r)) s += 3;
    if (fitsTag(r)) s += 4;
    if (fitsEnergy(r)) s += 2;
    if (state.tag === 'överraska') s += Math.random() * 3;
    return s;
  }

  function render(list) {
    target.innerHTML = list.map(card).join('');
  }

  function findSuggestions() {
    let exact = recipes.filter(r => fitsTime(r) && fitsBudget(r) && fitsTag(r) && fitsEnergy(r));
    let note = '';

    if (exact.length < 3) {
      const ranked = recipes
        .filter(r => !exact.includes(r))
        .map(r => ({ r, score: score(r) }))
        .sort((a,b) => b.score - a.score || Number(a.r.time||999) - Number(b.r.time||999))
        .map(x => x.r);
      exact = [...exact, ...ranked].filter((r,i,a) => a.indexOf(r)===i).slice(0,6);
      note = 'Jag hittade inte tillräckligt många som matchade allt exakt, så jag har fyllt på med de närmaste alternativen.';
    } else {
      exact = exact.sort((a,b) => Number(a.time||999)-Number(b.time||999)).slice(0,6);
      note = `${exact.length} förslag som passar dina val.`;
    }

    if (state.tag === 'överraska') exact = [...exact].sort(() => Math.random()-.5).slice(0,6);
    render(exact);
    if (message) message.textContent = note;
  }

  showButton.addEventListener('click', findSuggestions);

  resetButton?.addEventListener('click', () => {
    state.time = null; state.budget = 'any'; state.tag = null; state.energy = 'any';
    buttons.forEach(b => b.classList.remove('active'));
    target.innerHTML = '';
    if (message) message.textContent = 'Välj det som passar idag.';
  });
})();