(() => {
  function placeReflection(){
    const home=document.querySelector('#home');
    const form=document.querySelector('#dailyReflection');
    if(!home||!form)return false;
    const section=form.closest('section');
    if(!section)return false;
    section.dataset.eveningReflection='1';
    const heading=section.querySelector('h3');
    if(heading)heading.textContent='🌙 Kvällsreflektion';
    const intro=section.querySelector('p');
    if(intro)intro.textContent='När dagen börjar bli klar kan du skriva några ord. Allt är frivilligt.';
    const dashboard=home.querySelector('.dashboard-panel');
    const wellbeing=[...home.querySelectorAll('[data-wellbeing]')];
    const anchor=wellbeing.length?wellbeing[wellbeing.length-1]:dashboard;
    if(anchor&&section.previousElementSibling!==anchor)anchor.insertAdjacentElement('afterend',section);
    section.hidden=false;
    section.style.display='block';
    return true;
  }
  function ensure(){
    if(placeReflection())return;
    let tries=0;
    const timer=setInterval(()=>{tries++;if(placeReflection()||tries>20)clearInterval(timer);},150);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensure,{once:true});else ensure();
  setTimeout(placeReflection,500);
  setTimeout(placeReflection,1200);
})();