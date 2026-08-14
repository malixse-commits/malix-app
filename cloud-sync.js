(()=>{
  const PREFIXES=['malix-'];
  const META_KEY='malix-cloud-meta-v1';
  const CONFIG=window.MALIX_CLOUD||{};
  const isAppKey=k=>PREFIXES.some(p=>String(k).startsWith(p))&&k!==META_KEY;
  const esc=s=>String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[m]));
  let client=null,user=null,syncTimer=null,applying=false;

  function snapshot(){const data={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(isAppKey(k))data[k]=localStorage.getItem(k)}return data}
  function applySnapshot(data){if(!data||typeof data!=='object')return;applying=true;try{Object.entries(data).forEach(([k,v])=>{if(isAppKey(k)){if(v===null||v===undefined)localStorage.removeItem(k);else localStorage.setItem(k,String(v))}})}finally{applying=false}}
  function meta(){try{return JSON.parse(localStorage.getItem(META_KEY)||'{}')}catch{return{}}}
  function saveMeta(x){localStorage.setItem(META_KEY,JSON.stringify(x))}
  function configured(){return !!(CONFIG.url&&CONFIG.anonKey&&window.supabase?.createClient)}
  function setStatus(text,kind=''){document.querySelectorAll('[data-cloud-status]').forEach(x=>{x.textContent=text;x.dataset.kind=kind})}

  async function remoteRow(){if(!client||!user)return null;const {data,error}=await client.from('user_app_state').select('state,updated_at').eq('user_id',user.id).maybeSingle();if(error)throw error;return data}
  async function push(){if(!client||!user||applying)return;const state=snapshot(),now=new Date().toISOString();const {error}=await client.from('user_app_state').upsert({user_id:user.id,state,updated_at:now},{onConflict:'user_id'});if(error)throw error;saveMeta({...meta(),lastSyncAt:now,lastLocalChangeAt:now,lastRemoteAppliedAt:now,userId:user.id});setStatus('Synkad '+new Date().toLocaleTimeString('sv-SE',{hour:'2-digit',minute:'2-digit'}),'ok')}
  function queuePush(){if(!user||applying)return;clearTimeout(syncTimer);syncTimer=setTimeout(()=>push().catch(e=>{console.error(e);setStatus('Kunde inte synka just nu','error')}),700)}

  async function reconcile(){
    const remote=await remoteRow(),m=meta();
    if(!remote){await push();return 'local'}
    const remoteAt=remote.updated_at||'';
    const localAt=m.lastLocalChangeAt||'';
    const alreadyApplied=m.lastRemoteAppliedAt||'';
    if(remoteAt&&remoteAt>localAt&&remoteAt!==alreadyApplied){
      applySnapshot(remote.state);
      saveMeta({...m,lastSyncAt:remoteAt,lastLocalChangeAt:remoteAt,lastRemoteAppliedAt:remoteAt,userId:user.id});
      return 'remote';
    }
    if(remoteAt===alreadyApplied||remoteAt<=localAt)return 'same';
    await push();return 'local';
  }

  async function signIn(email,password){const {data,error}=await client.auth.signInWithPassword({email,password});if(error)throw error;user=data.user;const source=await reconcile();renderAccount();if(source==='remote')setTimeout(()=>location.reload(),250)}
  async function signUp(email,password){const {data,error}=await client.auth.signUp({email,password});if(error)throw error;if(!data.session){setStatus('Kontrollera din e-post och bekräfta kontot.','ok');return}user=data.user;await push();renderAccount()}
  async function signOut(){await client.auth.signOut();user=null;renderAccount();setStatus('Utloggad. Data på den här enheten finns kvar tills du loggar in igen.','')}

  function accountPanel(){let panel=document.querySelector('#malixCloudPanel');if(panel)return panel;panel=document.createElement('section');panel.id='malixCloudPanel';panel.className='panel calm';panel.style.margin='16px 0';const home=document.querySelector('#home');const target=home?.querySelector('.hero-card')||document.querySelector('main');if(target?.parentElement)target.insertAdjacentElement('afterend',panel);return panel}
  function renderAccount(){const p=accountPanel();if(!p)return;if(!configured()){p.innerHTML=`<p class="eyebrow">Konto & synkning</p><h3>☁️ Synkning förberedd</h3><p>Appen är redo för gemensam databas och inloggning, men databasen är ännu inte ansluten.</p><p class="note">När Supabase-projektets URL och publika nyckel läggs in kan samma konto användas på mobil och dator.</p><p data-cloud-status class="status"></p>`;return}
    if(user){p.innerHTML=`<p class="eyebrow">Konto & synkning</p><h3>☁️ Synkad mellan dina enheter</h3><p>Inloggad som <strong>${esc(user.email||'')}</strong>.</p><div class="chips"><button type="button" class="secondary" data-cloud-sync>Synka nu</button><button type="button" class="secondary" data-cloud-logout>Logga ut</button></div><p data-cloud-status class="status">${meta().lastSyncAt?'Senast synkad '+new Date(meta().lastSyncAt).toLocaleString('sv-SE'):''}</p>`;return}
    p.innerHTML=`<p class="eyebrow">Konto & synkning</p><h3>☁️ Logga in</h3><p>Samma konto gör att det du registrerar på mobilen kan visas på datorn och tvärtom.</p><label>E-post<input type="email" data-cloud-email autocomplete="email"></label><label>Lösenord<input type="password" data-cloud-password autocomplete="current-password" minlength="8"></label><div class="chips"><button type="button" class="primary" data-cloud-login>Logga in</button><button type="button" class="secondary" data-cloud-signup>Skapa konto</button></div><p data-cloud-status class="status"></p>`}

  function wire(){document.addEventListener('click',async e=>{const p=e.target.closest('#malixCloudPanel');if(!p)return;try{if(e.target.closest('[data-cloud-sync]')){setStatus('Synkar…');const source=await reconcile();setStatus(source==='remote'?'Hämtade senaste från molnet.':'Synkad.','ok');if(source==='remote')setTimeout(()=>location.reload(),200);return}if(e.target.closest('[data-cloud-logout]')){await signOut();return}const email=p.querySelector('[data-cloud-email]')?.value.trim(),password=p.querySelector('[data-cloud-password]')?.value||'';if(e.target.closest('[data-cloud-login]')){if(!email||!password){setStatus('Fyll i e-post och lösenord.','error');return}setStatus('Loggar in…');await signIn(email,password);return}if(e.target.closest('[data-cloud-signup]')){if(!email||password.length<8){setStatus('Ange e-post och minst 8 tecken i lösenordet.','error');return}setStatus('Skapar konto…');await signUp(email,password)}}catch(err){console.error(err);setStatus(err?.message||'Något gick fel.','error')}});
    const origSet=Storage.prototype.setItem,origRemove=Storage.prototype.removeItem;
    Storage.prototype.setItem=function(k,v){const r=origSet.call(this,k,v);if(this===localStorage&&isAppKey(k)&&!applying){const now=new Date().toISOString();saveMeta({...meta(),lastLocalChangeAt:now});queuePush()}return r};
    Storage.prototype.removeItem=function(k){const r=origRemove.call(this,k);if(this===localStorage&&isAppKey(k)&&!applying){const now=new Date().toISOString();saveMeta({...meta(),lastLocalChangeAt:now});queuePush()}return r};
    window.addEventListener('focus',()=>{if(user)reconcile().then(source=>{if(source==='remote')setTimeout(()=>location.reload(),150)}).catch(console.error)});
    document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&user)reconcile().then(source=>{if(source==='remote')setTimeout(()=>location.reload(),150)}).catch(console.error)});
  }

  async function init(){renderAccount();wire();if(!configured())return;client=window.supabase.createClient(CONFIG.url,CONFIG.anonKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});const {data}=await client.auth.getSession();user=data.session?.user||null;renderAccount();if(user){try{const source=await reconcile();if(source==='remote')setTimeout(()=>location.reload(),200)}catch(e){console.error(e);setStatus('Kunde inte läsa molndata just nu.','error')}}client.auth.onAuthStateChange((_event,session)=>{user=session?.user||null;renderAccount()})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();