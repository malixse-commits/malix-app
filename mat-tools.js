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
  const tip = document.querySelector('#dailyTipText'); if (tip) tip.textContent = tips[(dayIndex+tips.length)%tips.length];

  const input = document.querySelector('#ingredientInput');
  const button = document.querySelector('#ingredientSearch');
  const target = document.querySelector('#ingredientResults');
  if (input && button && target && typeof recipes !== 'undefined') {
    const render = list => { target.innerHTML = list.length ? list.slice(0,12).map(card).join('') : '<div class="empty">Jag hittar inget färdigt recept med de råvarorna ännu.</div>'; };
    button.addEventListener('click', event => {
      event.stopImmediatePropagation();
      const words = input.value.split(',').map(x=>x.trim().toLowerCase()).filter(Boolean);
      if (!words.length) { target.innerHTML='<div class="empty">Skriv minst en råvara först.</div>'; return; }
      const ranked = recipes.map(r => {
        const hay=(r.name+' '+r.ingredients.join(' ')+' '+r.leftovers.join(' ')).toLowerCase();
        return {r, score:words.filter(w=>hay.includes(w)).length};
      }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score || a.r.time-b.r.time).map(x=>x.r);
      render(ranked);
    }, true);
  }
})();