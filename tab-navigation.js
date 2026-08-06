(() => {
  const style=document.createElement('style');
  style.textContent=`body{padding-bottom:78px}.malix-tabs{position:fixed;left:0;right:0;bottom:0;z-index:999;background:#fff;border-top:1px solid #ddd;display:grid;grid-template-columns:repeat(4,1fr);gap:0;padding:6px max(6px,env(safe-area-inset-right)) calc(6px + env(safe-area-inset-bottom)) max(6px,env(safe-area-inset-left));box-shadow:0 -4px 18px rgba(0,0,0,.08)}.malix-tabs button{border:0;background:transparent;padding:8px 4px;font:inherit;display:flex;flex-direction:column;align-items:center;gap:3px}.malix-tabs button.active{font-weight:700}.malix-tabs span{font-size:20px}.malix-tab-panel{display:none}.malix-tab-panel.active{display:block}#homeButton{display:none!important}@media(min-width:900px){.malix-tabs{left:50%;transform:translateX(-50%);max-width:720px;border:1px solid #ddd;border-bottom:0;border-radius:16px 16px 0 0}}`;
  document.head.appendChild(style);
  const main=document.querySelector('main');if(!main)return;
  const tabs=[['today','🌞','Idag'],['food','🍽️','Mat'],['kitchen','🧊','Mitt kök'],['history','📅','Historik']];
  const nav=document.createElement('nav');nav.className='malix-tabs';nav.setAttribute('aria-label','Huvudnavigation');nav.innerHTML=tabs.map(([id,icon,label])=>`<button type="button" data-tab="${id}"><span>${icon}</span><small>${label}</small></button>`).join('');document.body.appendChild(nav);
  const panels={};
  tabs.forEach(([id])=>{const p=document.createElement('section');p.className='malix-tab-panel';p.dataset.tabPanel=id;main.prepend(p);panels[id]=p});
  const home=document.querySelector('#home');
  if(home){
    const hero=home.querySelector('.hero-card'),dashboard=home.querySelector('.dashboard-panel');
    if(hero)panels.today.appendChild(hero);
    if(dashboard)panels.today.appendChild(dashboard);
    home.querySelectorAll('[data-wellbeing]').forEach(x=>panels.today.appendChild(x));
    const reflection=home.querySelector('#dailyReflection')?.closest('section');if(reflection)panels.today.appendChild(reflection);
    const tip=[...home.querySelectorAll('section')].find(s=>/Dagens tips/i.test(s.textContent||''));if(tip)panels.today.appendChild(tip);
    const grid=home.querySelector('.choice-grid');if(grid)panels.food.appendChild(grid);
    const plan=home.querySelector('.plan-preview');if(plan)panels.food.appendChild(plan);
  }
  const kitchen=document.querySelector('#smartKitchen');if(kitchen)panels.kitchen.appendChild(kitchen);
  const foodLog=document.querySelector('#foodLog');if(foodLog){
    const histHeading=[...foodLog.children].find(x=>x.tagName==='H3'&&/Sparade måltider/i.test(x.textContent||''));
    const history=document.createElement('div');history.innerHTML='<h2>📅 Historik</h2><p class="note">Tidigare måltider och matkalender.</p>';
    if(histHeading){let node=histHeading;while(node){const next=node.nextSibling;history.appendChild(node);node=next}}
    panels.history.appendChild(history);
  }
  function showTab(id){
    Object.entries(panels).forEach(([k,p])=>p.classList.toggle('active',k===id));
    nav.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b.dataset.tab===id));
    if(id==='kitchen')window.malixRenderSmartKitchen?.();
    if(id==='history')window.renderMeals?.();
    window.scrollTo({top:0,behavior:'smooth'});
  }
  nav.addEventListener('click',e=>{const b=e.target.closest('[data-tab]');if(b)showTab(b.dataset.tab)});
  document.addEventListener('click',e=>{
    const b=e.target.closest('[data-open]');if(!b)return;
    const v=b.dataset.open;
    if(v==='home')setTimeout(()=>showTab('today'),0);
    if(v==='foodLog'||v==='recipeBank'||v==='finder'||v==='ingredient'||v==='leftovers'||v==='weekPlan'||v==='everyday'||v==='lowEnergy')setTimeout(()=>showTab('food'),0);
    if(v==='smartKitchen')setTimeout(()=>showTab('kitchen'),0);
  },true);
  showTab('today');
})();