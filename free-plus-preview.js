(() => {
  const home = document.querySelector('#home');
  if (!home) return;
  const hero = home.querySelector('.hero-card');
  const compare = document.createElement('section');
  compare.className = 'panel plan-preview';
  compare.innerHTML = `
    <div class="plan-preview-head"><div><p class="eyebrow">Test av upplägget</p><h3>Välj hur mycket hjälp du vill ha</h3><p>Gratis ska fungera i vardagen. Plus ger mer planering, fler recept och smartare hjälp med rester, ekonomi och näring.</p></div><span class="badge">Inget är låst ännu</span></div>
    <div class="plan-grid">
      <article class="plan-card"><span class="plan-label">GRATIS</span><h3>En sak i taget – Mat</h3><p class="plan-price">0 kr</p><ul><li>📝 Matdagbok med datum</li><li>📅 Kalender och låsta dagar</li><li>🌞 Enkel dagsöversikt</li><li>📖 Ett urval vardagsrecept</li><li>😴 Jag orkar inte</li><li>🍲 Grundläggande matförslag</li><li>♻️ Enkla tips för rester</li></ul><button type="button" class="secondary plan-test" data-plan="free">Se Gratis-markeringar</button></article>
      <article class="plan-card plus-card"><span class="plan-label">PLUS</span><h3>Mat Plus</h3><p class="plan-price">Pris bestäms senare</p><ul><li>✓ Allt i Gratis</li><li>📚 Hela receptbanken</li><li>🍽️ Portionsval och näringsöversikt</li><li>♻️ Fler restkedjor och Rädda maten</li><li>📅 Flera smarta veckomatsedlar</li><li>💰 Budget- och matsvinnshjälp</li><li>🌿 Gör måltiden mer komplett</li><li>📊 Veckosammanfattning när den är klar</li></ul><button type="button" class="primary plan-test" data-plan="plus">Se Plus-markeringar</button></article>
    </div><p class="note plan-note">Det här är en förhandsvisning. Vi testar gränsen mellan Gratis och Plus innan betalning eller riktiga lås byggs in.</p>`;
  hero.insertAdjacentElement('afterend', compare);

  const plusViews = new Set(['recipeBank','leftovers','weekPlan']);
  const plusLabels = {
    recipeBank:'PLUS · hela receptbanken',
    leftovers:'PLUS · fördjupad resthjälp',
    weekPlan:'PLUS · smarta veckomatsedlar'
  };
  document.querySelectorAll('#home [data-open]').forEach(card => {
    const view = card.dataset.open;
    const tag = document.createElement('span');
    tag.className = 'tier-tag ' + (plusViews.has(view) ? 'tier-plus' : 'tier-free');
    tag.textContent = plusViews.has(view) ? 'PLUS' : 'GRATIS';
    card.appendChild(tag);
    if (plusViews.has(view)) card.title = plusLabels[view] || 'Plus-funktion';
  });

  function setPreview(plan) {
    document.body.dataset.planPreview = plan;
    document.querySelectorAll('.plan-test').forEach(b => b.classList.toggle('active', b.dataset.plan === plan));
    const note = compare.querySelector('.plan-note');
    note.textContent = plan === 'free'
      ? 'Gratisförhandsvisning: Plus-delarna tonas ned men är fortfarande öppna så att vi kan testa appen.'
      : 'Plusförhandsvisning: hela Mat-upplevelsen visas. Inget köp krävs i testversionen.';
  }
  compare.addEventListener('click', e => {
    const b = e.target.closest('.plan-test');
    if (b) setPreview(b.dataset.plan);
  });
})();