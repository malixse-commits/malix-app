(() => {
  function placeReflection(){
    const home=document.querySelector('#home');
    const form=document.querySelector('#dailyReflection');
    if(!home||!form)return;
    const section=form.closest('section');
    if(!section||section.dataset.eveningReflection==='1')return;
    section.dataset.eveningReflection='1';
    const heading=section.querySelector('h3');
    if(heading)heading.textContent='🌙 Kvällsreflektion';
    const intro=section.querySelector('p');
    if(intro)intro.textContent='När dagen börjar bli klar kan du skriva några ord. Allt är frivilligt.';
    const dashboard=home.querySelector('.dashboard-panel');
    const wellbeing=[...home.querySelectorAll('[data-wellbeing]')];
    const anchor=wellbeing.length?wellbeing[wellbeing.length-1]:dashboard;
    if(anchor)anchor.insertAdjacentElement('afterend',section);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',placeReflection,{once:true});else placeReflection();
})();