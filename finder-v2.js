(() => {
  const finder=document.querySelector('#finder');
  if(!finder||finder.dataset.finderV2Ready==='1')return;
  finder.dataset.finderV2Ready='1';

  const state={time:null,budget:'any',tag:null,energy:'any'};
  const allRecipes=()=>typeof recipes!=='undefined'&&Array.isArray(recipes)?recipes:[];

  function activate(button){
    const key=button.dataset.finder;
    state[key]=button.dataset.value;
    finder.querySelectorAll(`[data-finder="${key}"]`).forEach(b=>b.classList.toggle('active',b===button));
  }

  function exactMatch(recipe){
    if(state.time&&Number(recipe.time)>Number(state.time))return false;
    if(state.budget!=='any'&&recipe.budget!==state.budget)return false;
    if(state.tag&&state.tag!=='överraska'&&!recipe.tags?.includes(state.tag))return false;
    if(state.energy==='low'&&Number(recipe.time)>30)return false;
    if(state.energy==='normal'&&Number(recipe.time)>60)return false;
    return true;
  }

  function score(recipe){
    let value=0;
    if(state.tag&&state.tag!=='överraska')value+=recipe.tags?.includes(state.tag)?12:-10;
    if(state.time){
      const max=Number(state.time),diff=Number(recipe.time)-max;
      value+=diff<=0?6:Math.max(-6,-Math.ceil(diff/10));
    }
    if(state.budget!=='any')value+=recipe.budget===state.budget?5:-3;
    if(state.energy==='low')value+=Number(recipe.time)<=15?7:Number(recipe.time)<=30?4:-5;
    if(state.energy==='normal')value+=Number(recipe.time)<=60?2:-3;
    return value;
  }

  function card(recipe){
    const budget=recipe.budget==='low'?'💰 Billigt':'💰💰 Mellan';
    return `<article class="recipe-card"><div class="meta"><span class="badge">${recipe.emoji||'🍲'}</span><span class="badge">⏱️ ${recipe.time} min</span><span class="badge">${budget}</span></div><h3>${recipe.name}</h3><p>${recipe.tip||''}</p><button type="button" class="primary" data-finder-open="${recipe.id}">Öppna recept</button></article>`;
  }

  function showSuggestions(){
    const list=allRecipes(),root=finder.querySelector('#suggestions'),message=finder.querySelector('#suggestionMessage');
    if(!root)return;
    if(!list.length){root.innerHTML='<div class="empty">Receptbanken är inte laddad ännu.</div>';return;}

    let result=[],relaxed=false;
    if(state.tag==='överraska'){
      result=[...list].sort(()=>Math.random()-.5).slice(0,3);
    }else{
      const exact=list.filter(exactMatch);
      if(exact.length>=3){
        result=[...exact].sort((a,b)=>score(b)-score(a)).slice(0,3);
      }else{
        relaxed=true;
        const pool=new Map(exact.map(r=>[r.id,r]));
        [...list].sort((a,b)=>score(b)-score(a)).forEach(r=>{if(pool.size<3)pool.set(r.id,r)});
        result=[...pool.values()].slice(0,3);
      }
    }

    root.innerHTML=result.length?result.map(card).join(''):'<div class="empty">Jag hittar inga recept ännu.</div>';
    root.querySelectorAll('[data-finder-open]').forEach(b=>b.addEventListener('click',()=>window.openRecipe?.(b.dataset.finderOpen)));
    if(message)message.textContent=relaxed?'Det fanns inte tre exakta träffar. Här är de närmaste alternativen utifrån dina val.':'Här är tre förslag utifrån dina val.';
  }

  function reset(){
    state.time=null;state.budget='any';state.tag=null;state.energy='any';
    finder.querySelectorAll('[data-finder]').forEach(b=>b.classList.remove('active'));
    const root=finder.querySelector('#suggestions'),message=finder.querySelector('#suggestionMessage');
    if(root)root.innerHTML='';
    if(message)message.textContent='';
  }

  finder.querySelectorAll('[data-finder]').forEach(b=>b.addEventListener('click',()=>activate(b)));
  finder.querySelector('#showSuggestionsV2')?.addEventListener('click',showSuggestions);
  finder.querySelector('#resetSuggestionsV2')?.addEventListener('click',reset);
})();