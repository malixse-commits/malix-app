(() => {
  const SNAPSHOT_KEY = 'malix-reflection-snapshots-v1';
  const emptySnapshots = () => ({ weeks: {}, months: {} });
  const isObject = value => !!value && typeof value === 'object' && !Array.isArray(value);
  const clone = value => JSON.parse(JSON.stringify(value));

  function normalizeSnapshots(value) {
    const out = emptySnapshots();
    if (!isObject(value)) return out;
    if (isObject(value.weeks)) {
      Object.entries(value.weeks).forEach(([key, snapshot]) => {
        if (isObject(snapshot)) out.weeks[key] = clone(snapshot);
      });
    }
    if (isObject(value.months)) {
      Object.entries(value.months).forEach(([key, snapshot]) => {
        if (isObject(snapshot)) out.months[key] = clone(snapshot);
      });
    }
    return out;
  }

  function readAllSnapshots() {
    try {
      const raw = localStorage.getItem(SNAPSHOT_KEY);
      return raw ? normalizeSnapshots(JSON.parse(raw)) : emptySnapshots();
    } catch {
      return emptySnapshots();
    }
  }

  function writeAllSnapshots(value) {
    localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(normalizeSnapshots(value)));
  }

  function periodKey(value, label) {
    const key = String(value ?? '').trim();
    if (!key) throw new TypeError(`${label} krävs.`);
    return key;
  }

  function snapshotObject(value) {
    if (!isObject(value)) throw new TypeError('Snapshot måste vara ett objekt.');
    return clone(value);
  }

  function getWeek(periodStart) {
    const key = periodKey(periodStart, 'periodStart');
    const snapshot = readAllSnapshots().weeks[key];
    return snapshot ? clone(snapshot) : null;
  }

  function getMonth(monthKey) {
    const key = periodKey(monthKey, 'monthKey');
    const snapshot = readAllSnapshots().months[key];
    return snapshot ? clone(snapshot) : null;
  }

  function setWeek(periodStart, snapshot) {
    const key = periodKey(periodStart, 'periodStart');
    const all = readAllSnapshots();
    all.weeks[key] = snapshotObject(snapshot);
    writeAllSnapshots(all);
    return clone(all.weeks[key]);
  }

  function setMonth(monthKey, snapshot) {
    const key = periodKey(monthKey, 'monthKey');
    const all = readAllSnapshots();
    all.months[key] = snapshotObject(snapshot);
    writeAllSnapshots(all);
    return clone(all.months[key]);
  }

  window.malixReflectionSnapshots = Object.freeze({
    storageKey: SNAPSHOT_KEY,
    readAll: readAllSnapshots,
    getWeek,
    getMonth,
    setWeek,
    setMonth
  });

  // Den gamla HTML-hemsidan finns kvar som reserv/struktur medan moduler laddas.
  // free-plus-preview.js laddar nu kärnmodulerna innan denna fil körs.
  function moveFoodLogFirst() {
    const foodToday = document.querySelector('#foodToday');
    const button = foodToday?.querySelector('[data-calm-open="foodLog"]');
    const actionGrid = button?.closest('.choice-grid');
    const subtitle = foodToday?.querySelector('.subtitle');
    if (!foodToday || !actionGrid || !subtitle) return false;
    subtitle.insertAdjacentElement('afterend', actionGrid);
    actionGrid.style.margin = '16px 0';
    return true;
  }

  function ensureFoodLogFirst() {
    if (moveFoodLogFirst()) return;
    let tries = 0;
    const timer = setInterval(() => {
      tries += 1;
      if (moveFoodLogFirst() || tries >= 20) clearInterval(timer);
    }, 50);
  }

  function openHome() {
    document.querySelectorAll('main > .view').forEach(v => v.classList.remove('active-view'));
    const home = document.querySelector('main > #home') || document.querySelector('#home');
    if (home) {
      home.classList.add('active-view');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Endast den särskilda Hem-markören hanteras här.
  // data-calm-open och data-nav-back ägs av calm-navigation.js.
  if (document.documentElement.dataset.calmHomeWired !== '1') {
    document.documentElement.dataset.calmHomeWired = '1';
    document.addEventListener('click', event => {
      const button = event.target.closest('[data-calm-home]');
      if (!button) return;
      event.preventDefault();
      event.stopPropagation();
      openHome();
    }, true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureFoodLogFirst, { once: true });
  } else {
    ensureFoodLogFirst();
  }
  setTimeout(ensureFoodLogFirst, 0);

  document.body.classList.add('calm-ready');
})();