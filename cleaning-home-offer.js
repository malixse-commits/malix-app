(() => {
  const WORKBOOK_URL='https://buy.stripe.com/fZudRafps94he51acuaEE08';

  function upgradeHomeHub(){
    const root=document.querySelector('#homeHub');
    if(!root)return;
    const grid=root.querySelector('.choice-grid');
    if(!grid)return;

    const cards=[...grid.querySelectorAll('.choice-card')];
    const byTarget=target=>cards.find(card=>card.dataset.calmOpen===target);
    const today=byTarget('cleaningToday');
    const step=byTarget('cleaningStep');
    const structure=byTarget('cleaningStructure');

    if(today){
      today.querySelector('strong')?.replaceChildren(document.createTextNode('Dagens städning · GRATIS'));
      today.querySelector('small')?.replaceChildren(document.createTextNode('Använd dina grundlistor och välj själv hur mycket som är lagom idag.'));
    }
    if(step){
      step.querySelector('strong')?.replaceChildren(document.createTextNode('En fyrkant i taget · GRATIS'));
      step.querySelector('small')?.replaceChildren(document.createTextNode('Få hjälp att börja med en enda liten sak när allt känns för stort.'));
    }
    if(structure){
      structure.querySelector('strong')?.replaceChildren(document.createTextNode('Min hemstruktur · PLUS'));
      structure.querySelector('small')?.replaceChildren(document.createTextNode('Städvecka, egna rum och listor, prioriteringar och historik över tid.'));
    }

    if(!root.querySelector('#cleaningOfferInfo')){
      const info=document.createElement('section');
      info.id='cleaningOfferInfo';
      info.className='panel calm';
      info.style.marginTop='18px';
      info.innerHTML=`
        <p class="eyebrow">Städa i fyrkanter</p>
        <h3>En sak i taget – även hemma</h3>
        <p>Gratisdelen hjälper dig att komma igång och göra det som är lagom just nu. PLUS är för dig som vill att appen ska hjälpa dig att bygga en egen struktur och komma ihåg den över tid.</p>
        <p class="note"><strong>GRATIS:</strong> Dagens städning och En fyrkant i taget.<br><strong>PLUS:</strong> Min hemstruktur med städvecka, egna rum och listor, prioriteringar och historik.</p>
        <p>Vill du arbeta med hela metoden på papper finns arbetsmaterialet <strong>Städa i fyrkanter</strong> med 23 arbetsblad.</p>
        <a class="secondary" href="${WORKBOOK_URL}" target="_blank" rel="noopener noreferrer">Se arbetsmaterialet · 79 kr</a>`;
      root.appendChild(info);
    }
  }

  function run(){upgradeHomeHub()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
  document.addEventListener('malix-cloud-updated',run);
})();