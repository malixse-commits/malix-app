(() => {
  const style=document.createElement('style');
  style.textContent=`body{padding-bottom:78px}.malix-tabs{position:fixed;left:0;right:0;bottom:0;z-index:999;background:#fff;border-top:1px solid #ddd;display:grid;grid-template-columns:repeat(4,1fr);padding:6px max(6px,env(safe-area-inset-right)) calc(6px + env(safe-area-inset-bottom)) max(6px,env(safe-area-inset-left));box-shadow:0 -4px 18px rgba(0,0,0,.08)}.malix-tabs button{border:0;background:transparent;padding:8px 4px;font:inherit;display:flex;flex-direction:column;align-items:center;gap:3px}.malix-tabs button.active{font-weight:700}.malix-tabs span{font-size:20px}#homeButton{display:none!important}.malix-food-hub .choice-grid{margin-top:14px}@media(min-width:900px){.malix-tabs{left:50%;transform:translateX(-50%);max-width:720px;border:1px solid #ddd;border-bottom:0;border-radius:16px 16px 0 0}}`;
  document.head.appendChild(style);
  const main=document.querySelector('main');if(!main)return;

  // Create a simple food hub. Nothing is moved out of the original views.
  let hub=document.querySelector('#matHub');
  if(!hub){
    hub=document.createElement('section');hub.id='matHub';hub.className='view malix-food-hub';
    hub.innerHTML=`<button class="back" type="button" data-tab-home>← Till Idag</button><p class="eyebrow">Mat</p><h2>🍽️ Mat</h2><p>Välj vad du vill göra.</p><div class="choice-grid">
      <button class="choice-card" type="button" data-go="foodLog"><span>📝</span><strong>Logga min mat</strong><small>Frukost, lunch, middag och mellanmål.</small></button>
      <button class="choice-card" type="button" data-go="recipeBank"><span>📖</span><strong>Recept</strong><small>Öppna receptbanken.</small></button>
      <button class="choice-card" type="button" data-go="finder"><span>🍲</span><strong>Vad ska jag äta?</strong><small>Få hjälp att välja mat.</small></button>
      <button class="choice-card" type="button" data-go="leftovers"><span>♻️</span><strong>Rester</strong><small>Ta hand om det som redan finns.</small></button>
      <button class="choice-card" type="button" data-go="weekPlan"><span>📅</span><strong>Veckomatsedel</strong><small>Planera flera dagar.</small></button>
      <button class="choice-card" type="button" data-go="lowEnergy"><span>😴</span><strong>Jag orkar inte</strong><small>Enklare mat när energin är låg.</small></button>
    </div>`;
    main.appendChild(hub);
  }

  const tabs=[['today','🌞','Idag'],['food','🍽️','Mat'],['kitchen','🧊','Mitt kök'],['history','📅','Historik']];
  const nav=document.createElement('nav');nav.className='malix-tabs';nav.setAttribute('aria-label','Huvudnavigation');nav.innerHTML=tabs.map(([id,icon,label])=>`<button type="button" data-tab="${id}"><span>${icon}</span><small>${label}</small></button>`).join('');document.body.appendChild(nav);

  function activateTab(id){nav.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===id));}
  function go(view,tab){if(typeof show==='function')show(view);activateTab(tab);if(view==='smartKitchen')window.malixRenderSmartKitchen?.();if(view==='foodLog')window.renderMeals?.();window.scrollTo({top:0,behavior:'auto'});}

  nav.addEventListener('click',e=>{const b=e.target.closest('[data-tab]');if(!b)return;const id=b.dataset.tab;if(id==='today')go('home','today');if(id==='food')go('matHub','food');if(id==='kitchen')go('smartKitchen','kitchen');if(id==='history'){go('foodLog','history');setTimeout(()=>{document.querySelector('#mealHistory')?.scrollIntoView({block:'start'});},50);}});
  hub.addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(b)go(b.dataset.go,'food');if(e.target.closest('[data-tab-home]'))go('home','today');});

  // Keep the active tab sensible when old in-app navigation is used.
  document.addEventListener('click',e=>{const b=e.target.closest('[data-open]');if(!b)return;const v=b.dataset.open;if(v==='home')activateTab('today');else if(v==='smartKitchen')activateTab('kitchen');else if(['foodLog','recipeBank','finder','ingredient','leftovers','weekPlan','everyday','lowEnergy','recipeDetail'].includes(v))activateTab('food');},false);
  activateTab('today');
})();