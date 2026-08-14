(()=>{
  function unify(){
    const form=document.querySelector('#dailyReflection');
    if(!form)return false;
    const section=form.closest('section');
    if(section){section.hidden=true;section.style.display='none';section.setAttribute('aria-hidden','true')}
    return true;
  }
  function ensure(){if(unify())return;let n=0;const t=setInterval(()=>{n++;if(unify()||n>20)clearInterval(t)},150)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensure,{once:true});else ensure();
  setTimeout(unify,500);
})();