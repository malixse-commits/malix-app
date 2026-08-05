(() => {
  function removeDuplicateProduceCard(){
    const produce=document.querySelector('#produceSummary');
    const card=produce?.closest('.summary-card');
    if(card) card.remove();
  }
  removeDuplicateProduceCard();
  new MutationObserver(removeDuplicateProduceCard).observe(document.body,{childList:true,subtree:true});
})();