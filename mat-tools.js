(() => {
  const tips = [
    'Har du en råvara som behöver gå åt? Börja med den innan du planerar något nytt.',
    'Frys gärna in en extra portion när du ändå lagar mat.',
    'Frysta grönsaker kan vara ett enkelt sätt att få in mer färg och variation.',
    'Har du fetaost kvar? Den passar i rostade rotfrukter, sallad eller en enkel kräm.',
    'En slowcooker kan flytta matlagningen till en tid på dagen när du har mer ork.',
    'Rester är inte en misslyckad middag. De kan vara starten på nästa måltid.',
    'En extra frukt eller grönsak räcker som dagens lilla steg.'
  ];
  const date = new Date();
  const dayIndex = Math.floor(new Date(date.getFullYear(),date.getMonth(),date.getDate()).getTime()/86400000) % tips.length;
  const tip = document.querySelector('#dailyTipText');
  if (tip) tip.textContent = tips[(dayIndex+tips.length)%tips.length];

  if (typeof recipes === 'undefined' || typeof card !== 'function') return;

  function wordsFrom(value) {
    return value.toLowerCase().split(/[,;]+/).map(x=>x.trim()).filter(Boolean).flatMap(x=>x.split(/\s+och\s+/));
  }
  function searchable(r) {
    return [r.name, ...(r.ingredients||[]), ...(r.leftovers||[]), ...(r.tags||[]), r.tip||''].join(' ').toLowerCase();
  }
  function rank(value, rescue=false) {
    const words = wordsFrom(value);
    if (!words.length) return [];
    return recipes.map(r => {
      const hay = searchable(r);
      const matches = words.filter(w => hay.includes(w));
      let score = matches.length * 10;
      if (rescue) score += (r.leftovers||[]).filter(x => words.some(w => x.toLowerCase().includes(w) || w.includes(x.toLowerCase()))).length * 8;
      if ((r.tags||[]).includes('ta-vad-du-har')) score += 2;
      if ((r.tags||[]).includes('budget')) score += 1;
      return {r,score,matches};
    }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score || a.r.time-b.r.time).map(x=>x.r);
  }
  function render(target,list,empty) {
    target.innerHTML = list.length ? list.slice(0,18).map(card).join('') : `<div class="empty">${empty}</div>`;
  }

  const ingredientInput = document.querySelector('#ingredientInput');
  const ingredientButton = document.querySelector('#ingredientSearch');
  const ingredientTarget = document.querySelector('#ingredientResults');
  if (ingredientInput && ingredientButton && ingredientTarget) {
    ingredientButton.addEventListener('click', event => {
      event.preventDefault(); event.stopImmediatePropagation();
      const value = ingredientInput.value.trim();
      if (!value) { ingredientTarget.innerHTML='<div class="empty">Skriv minst en råvara först.</div>'; return; }
      render(ingredientTarget,rank(value,false),'Jag hittar inget färdigt recept med de råvarorna ännu. Prova en råvara i taget eller ett närliggande ord.');
    }, true);
  }

  const leftoverInput = document.querySelector('#leftoverInput');
  const leftoverButton = document.querySelector('#leftoverSearch');
  const leftoverTarget = document.querySelector('#leftoverResults');
  if (leftoverInput && leftoverButton && leftoverTarget) {
    leftoverButton.addEventListener('click', event => {
      event.preventDefault(); event.stopImmediatePropagation();
      const value = leftoverInput.value.trim();
      if (!value) { leftoverTarget.innerHTML='<div class="empty">Skriv vad du vill rädda först.</div>'; return; }
      const list = rank(value,true);
      render(leftoverTarget,list,'Jag hittar inget direkt recept ännu. Prova att söka på huvudråvaran, till exempel potatismos, ris, bröd, fetaost, kyckling eller grönsaker.');
    }, true);
  }
})();