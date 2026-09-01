(() => {
  const state={time:null,budget:'any',tag:null,energy:'any'};
  const finder=document.querySelector('#finder');
  if(!finder)return;

  const allRecipes=()=>typeof recipes!=='undefined'&&Array.isArray(recipes)?recipes:[];
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  function setActive(button){
    const key=button.dataset.finder;
    state[key]=button.dataset.value;
    finder.querySelectorAll(`[data-finder="${key}"]`).forEach(b=>b.classList.toggle('active',b===button));
  }

  function exactMatch(r){
    if(state.time&&r.time>Number(state.time))return false;
    if(state.budget&&state.budget!=='any'&&r.budget!==state.budget)return false;
    if(state.tag&&state.tag!=='överraska'&&!r.tags?.includes(state.tag))return false;
    if(state.energy==='low'&&r.time>30)return false;
    if(state.energy==='normal'&&r.time>60)return false;
    return true;
  }

  function score(r){
    let n=0;
    if(state.tag&&state.tag!=='överraska')n+=r.tags?.includes(state.tag)?9:-7;
    if(state.time){const max=Number(state.time);n+=r.time<=max?5:Math.max(-5,-Math.ceil((r.time-max)/20));}
    if(state.budget&&state.budget!=='any')n+=r.budget===state.budget?4:-2;
    if(state.energy==='low')n+=r.time<=15?6:r.time<=30?3:r.time<=60?-2:-5;
    if(state.energy==='normal')n+=r.time<=60?2:-2;
    if(r.tags?.includes('familj'))n+=0.3;
    return n+Math.random()*0.4;
  }

  function card(r){
    return `<article class="recipe-card"><div class="meta"><span class="badge">${esc(r.emoji||'🍲')}</span><span class="badge">⏱️ ${esc(r.time)} min</span><span class="badge">${r.budget==='low'?'💰':'💰💰'}</span></div><h3>${esc(r.name)}</h3><p>${esc(r.tip||'')}</p><button class="primary" type="button" data-finder-open="${esc(r.id)}">Öppna recept</button></article>`;
  }

  function render(){
    const list=allRecipes();
    const root=finder.querySelector('#suggestions');
    const message=finder.querySelector('#suggestionMessage');
    if(!root)return;
    if(!list.length){root.innerHTML='<div class="empty">Receptbanken är inte laddad ännu.</div>';return;}

    let exact=list.filter(exactMatch);
    let relaxed=false;
    let chosen;
    if(state.tag==='överraska'){
      chosen=[...list].sort(()=>Math.random()-.5).slice(0,3);
    }else if(exact.length>=3){
      chosen=[...exact].sort((a,b)=>score(b)-score(a)).slice(0,3);
    }else{
      relaxed=true;
      const pool=new Map(exact.map(r=>[r.id,r]));
      [...list].sort((a,b)=>score(b)-score(a)).forEach(r=>{if(pool.size<3)pool.set(r.id,r)});
      chosen=[...pool.values()].slice(0,3);
    }

    root.innerHTML=chosen.map(card).join('');
    root.querySelectorAll('[data-finder-open]').forEach(b=>b.addEventListener('click',()=>window.openRecipe?.(b.dataset.finderOpen)));
    if(message)message.textContent=relaxed?'Jag hittade inte tre exakta träffar, så jag lättade lite på något av dina val och visar de närmaste förslagen.':'Här är tre förslag som passar dina val.';
  }

  function reset(){
    state.time=null;state.budget='any';state.tag=null;state.energy='any';
    finder.querySelectorAll('[data-finder]').forEach(b=>b.classList.remove('active'));
    const root=finder.querySelector('#suggestions'),message=finder.querySelector('#suggestionMessage');
    if(root)root.innerHTML='';
    if(message)message.textContent='';
  }

  finder.querySelectorAll('[data-finder]').forEach(b=>b.addEventListener('click',()=>setActive(b)));
  finder.querySelector('#showSuggestionsV2')?.addEventListener('click',render);
  finder.querySelector('#resetSuggestionsV2')?.addEventListener('click',reset);
})();