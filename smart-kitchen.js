(() => {
  const base=document.createElement('script');
  base.src='https://raw.githack.com/malixse-commits/malix-app/611c440ef42d2173bda5ee2bd023d12e88638873/smart-kitchen.js';
  base.onload=()=>{
    const routine=document.createElement('script');
    routine.src='fridge-check-routine.js';
    document.body.appendChild(routine);
  };
  document.body.appendChild(base);
})();