(() => {
  function add(){
    const hub=document.querySelector('#foodHub');
    if(!hub||hub.querySelector('[data-food-month-card]'))return;
    const section=document.createElement('section');
    section.className='panel calm';
    section.style.marginTop='14px';
    section.innerHTML='<p class="eyebrow">Se tillbaka · PLUS</p><h3>🍽️ Månadens matåterblick</h3><p class="note">Se vad den mat du registrerat blev tillsammans under månaden.</p><button type="button" class="secondary" data-food-month-card>Öppna månadens återblick</button>';
    hub.appendChild(section);
  }
  add();
  setTimeout(add,100);
})();