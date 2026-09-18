(()=>{
  const PREFIX='malix-', META='malix-cloud-meta-v2', LOGOUT_FLAG='malix-explicit-logout-v1', CONFIG=window.MALIX_CLOUD||{};
  const isAppKey=k=>String(k).startsWith(PREFIX)&&!String(k).startsWith('malix-cloud-meta')&&String(k)!==LOGOUT_FLAG;
  const esc=s=>String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[m]));
  const CONFLICT_STATUS='Synkningen är pausad eftersom uppgifterna på den här enheten skiljer sig från molnet. Inga uppgifter har skrivits över.';
  let client=null,user=null,syncTimer=null,applying=false,syncing=false,pendingLocal=false,localGeneration=0,conflictStatus=false;
  function snapshot(){const d={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(isAppKey(k))d[k]=localStorage.getItem(k)}return d}
  function appSnapshot(data){const d={};Object.entries(data||{}).forEach(([k,v])=>{if(isAppKey(k)&&v!=null)d[k]=String(v)});return d}
  function snapshotEmpty(data){return Object.keys(appSnapshot(data)).length===0}
  function snapshotsEqual(a,b){const x=appSnapshot(a),y=appSnapshot(b),kx=Object.keys(x).sort(),ky=Object.keys(y).sort();return kx.length===ky.length&&kx.every((k,i)=>k===ky[i]&&x[k]===y[k])}
  async function fingerprint(data){const entries=Object.entries(appSnapshot(data)).sort(([a],[b])=>a<b?-1:a>b?1:0),bytes=new TextEncoder().encode(JSON.stringify(entries)),digest=await crypto.subtle.digest('SHA-256',bytes);return Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('')}
  function baseMeta(){const m=meta();return m.userId===user?.id&&m.lastSeenRemoteAt&&m.lastSyncedSnapshotHash?m:null}
  async function saveBase(at,data){saveMeta({userId:user.id,lastSeenRemoteAt:at,lastSyncedSnapshotHash:await fingerprint(data)})}
  async function syncDecision(local,r){const remote=r?.state||{},b=baseMeta();if(r&&snapshotsEqual(local,remote))return'none';if(!r){if(b)return'conflict';return snapshotEmpty(local)?'none':'insert'}if(!b)return snapshotEmpty(local)?'pull':'conflict';const localIsBase=(await fingerprint(local))===b.lastSyncedSnapshotHash,remoteIsBase=r.updated_at===b.lastSeenRemoteAt;if(localIsBase&&!remoteIsBase)return'pull';if(!localIsBase&&remoteIsBase)return'push';return'conflict'}
  function stopConflict(){clearTimeout(syncTimer);pendingLocal=false;setStatus(CONFLICT_STATUS);return'conflict'}
  function clearAppData(){applying=true;try{const ks=[];for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(isAppKey(k)||k===META)ks.push(k)}ks.forEach(k=>localStorage.removeItem(k))}finally{applying=false}pendingLocal=false;document.dispatchEvent(new CustomEvent('malix-cloud-updated'))}
  function applySnapshot(data){applying=true;try{const ks=[];for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(isAppKey(k))ks.push(k)}ks.forEach(k=>localStorage.removeItem(k));Object.entries(data||{}).forEach(([k,v])=>{if(isAppKey(k)&&v!=null)localStorage.setItem(k,String(v))})}finally{applying=false}pendingLocal=false;document.dispatchEvent(new CustomEvent('malix-cloud-updated'))}
  function meta(){try{return JSON.parse(localStorage.getItem(META)||'{}')}catch{return{}}}function saveMeta(x){localStorage.setItem(META,JSON.stringify(x))}
  function configured(){return !!(CONFIG.url&&CONFIG.anonKey&&window.supabase?.createClient)}
  function setStatus(t){if(t===CONFLICT_STATUS){conflictStatus=true;document.querySelectorAll('[data-cloud-summary-status]').forEach(x=>x.textContent='Pausad')}document.querySelectorAll('[data-cloud-status],[data-gate-status]').forEach(x=>x.textContent=t)}
  function clearConflictStatus(){conflictStatus=false;document.querySelectorAll('[data-cloud-summary-status]').forEach(x=>x.textContent='Synkad')}
  function explicitlyLoggedOut(){return localStorage.getItem(LOGOUT_FLAG)==='1'}
  function setExplicitLogout(v){if(v)localStorage.setItem(LOGOUT_FLAG,'1');else localStorage.removeItem(LOGOUT_FLAG)}
  async function remoteRow(){if(!client||!user)return null;const {data,error}=await client.from('user_app_state').select('state,updated_at').eq('user_id',user.id).maybeSingle();if(error)throw error;return data}
  async function insertInitial(local){const {data,error}=await client.from('user_app_state').insert({user_id:user.id,state:local}).select('updated_at');if(error){const r=await remoteRow().catch(()=>null);if(r)return{result:stopConflict()};throw error}if(!Array.isArray(data)||data.length!==1)return{result:stopConflict()};const at=data[0]?.updated_at;if(!at)return{result:stopConflict()};await saveBase(at,local);return{result:'pushed',at}}
  async function updateConditional(local,b){const {data,error}=await client.from('user_app_state').update({state:local}).eq('user_id',user.id).eq('updated_at',b.lastSeenRemoteAt).select('updated_at');if(error)throw error;if(!Array.isArray(data)||data.length!==1)return{result:stopConflict()};const at=data[0]?.updated_at;if(!at)return{result:stopConflict()};await saveBase(at,local);return{result:'pushed',at}}
  // TEMPORÄR ENGÅNGSMIGRERING:
  // Tar ett redan känt gammalt konfliktläge över till den nya basmodellen.
  // Ska tas bort helt efter genomförd migrering.
  async function migrateLegacyConflict(){
    if(!client||!user||syncing)return'busy';
    if(user.email?.toLowerCase()!=='kontakt@malix.se')return'not-allowed';
    if(!conflictStatus)return'not-conflict';

    const generationAtStart=localGeneration;
    const local=snapshot();

    syncing=true;
    try{
      const r=await remoteRow();

      if(localGeneration!==generationAtStart)
        return'local-changed';

      if(!r?.updated_at)
        return stopConflict();

      const write=await updateConditional(
        local,
        {lastSeenRemoteAt:r.updated_at}
      );

      if(write.result!=='pushed')
        return write.result;

      // updateConditional() har nu:
      // 1. lyckats med conditional server-write
      // 2. fått serverns nya updated_at
      // 3. sparat basen för exakt snapshoten "local"

      if(localGeneration!==generationAtStart){
        pendingLocal=true;
        schedulePush();
        return'local-changed';
      }

      pendingLocal=false;
      clearConflictStatus();
      setStatus(
        'Synkad '+new Date(write.at).toLocaleTimeString(
          'sv-SE',
          {hour:'2-digit',minute:'2-digit'}
        )
      );
      return'pushed';
    }finally{
      syncing=false;
    }
  }
  function schedulePush(){clearTimeout(syncTimer);syncTimer=setTimeout(()=>{syncTimer=null;if(!user||explicitlyLoggedOut()||!pendingLocal)return;if(syncing){schedulePush();return}push().catch(e=>setStatus(e.message||'Kunde inte synka'))},700)}
  async function push(){if(!client||!user||applying||syncing)return;const generationAtStart=localGeneration;syncing=true;try{const local=snapshot(),r=await remoteRow();if(localGeneration!==generationAtStart)return'local-changed';const decision=await syncDecision(local,r);if(localGeneration!==generationAtStart)return'local-changed';if(decision==='conflict')return stopConflict();if(decision==='none'){if(r)await saveBase(r.updated_at,local);if(localGeneration!==generationAtStart){pendingLocal=true;return'local-changed'}pendingLocal=false;clearConflictStatus();return'none'}if(decision==='pull'){applySnapshot(r.state||{});await saveBase(r.updated_at,r.state||{});if(localGeneration!==generationAtStart){pendingLocal=true;return'local-changed'}pendingLocal=false;clearConflictStatus();return'pulled'}if(decision==='insert'){const write=await insertInitial(local);if(write.result!=='pushed')return write.result;const changed=localGeneration!==generationAtStart;pendingLocal=changed;if(changed)return'local-changed';clearConflictStatus();setStatus('Synkad '+new Date(write.at).toLocaleTimeString('sv-SE',{hour:'2-digit',minute:'2-digit'}));return'pushed'}if(decision==='push'){const b=baseMeta();if(!b)return stopConflict();const write=await updateConditional(local,b);if(write.result!=='pushed')return write.result;const changed=localGeneration!==generationAtStart;pendingLocal=changed;if(changed)return'local-changed';clearConflictStatus();setStatus('Synkad '+new Date(write.at).toLocaleTimeString('sv-SE',{hour:'2-digit',minute:'2-digit'}));return'pushed'}return stopConflict()}finally{syncing=false;if(pendingLocal&&user&&!explicitlyLoggedOut())schedulePush()}}
  async function pull(force=false){if(!client||!user||syncing)return'busy';if(pendingLocal&&!force)return'local-pending';const generationAtStart=localGeneration;syncing=true;try{const r=await remoteRow(),local=snapshot();if(localGeneration!==generationAtStart)return'local-changed';const decision=await syncDecision(local,r);if(localGeneration!==generationAtStart)return'local-changed';if(decision==='conflict')return stopConflict();if(decision==='none'){if(r)await saveBase(r.updated_at,local);if(localGeneration!==generationAtStart){pendingLocal=true;return'local-changed'}pendingLocal=false;clearConflictStatus();return'same'}if(decision==='pull'){applySnapshot(r.state||{});await saveBase(r.updated_at,r.state||{});if(localGeneration!==generationAtStart){pendingLocal=true;return'local-changed'}pendingLocal=false;clearConflictStatus();return'remote'}if(decision==='push'||decision==='insert')return'local';return stopConflict()}finally{syncing=false;if(pendingLocal&&user&&!explicitlyLoggedOut())schedulePush()}}
  function queuePush(){if(!user||applying||explicitlyLoggedOut())return;localGeneration++;pendingLocal=true;schedulePush()}
  async function firstSync(){const generationAtStart=localGeneration,r=await remoteRow(),local=snapshot();if(localGeneration!==generationAtStart)return'local-changed';const decision=await syncDecision(local,r);if(localGeneration!==generationAtStart)return'local-changed';if(decision==='conflict')return stopConflict();if(decision==='pull'){applySnapshot(r.state||{});await saveBase(r.updated_at,r.state||{});if(localGeneration!==generationAtStart){pendingLocal=true;schedulePush();return'local-changed'}pendingLocal=false;clearConflictStatus();return'remote'}if(decision==='push'||decision==='insert')return await push();if(r)await saveBase(r.updated_at,local);if(localGeneration!==generationAtStart){pendingLocal=true;schedulePush();return'local-changed'}pendingLocal=false;clearConflictStatus();return'none'}
  function gate(){let g=document.querySelector('#malixAuthGate');if(!g){g=document.createElement('div');g.id='malixAuthGate';g.style.cssText='position:fixed;inset:0;z-index:99999;background:#f7f4ed;padding:20px;overflow:auto';document.body.appendChild(g)}return g}
  function showGate(){const g=gate();g.style.display='block';g.innerHTML=`<div style="max-width:520px;margin:6vh auto;background:#fff;padding:24px;border-radius:18px;box-shadow:0 8px 30px rgba(0,0,0,.08)"><p style="font-size:2rem;margin:0">🌿</p><h1>En sak i taget</h1><h2>Logga in</h2><p>Dina registreringar visas först när du är inloggad.</p><label>E-post<input type="email" data-gate-email autocomplete="email"></label><label>Lösenord<input type="password" data-gate-password autocomplete="current-password" minlength="8"></label><div class="chips"><button type="button" class="primary" data-gate-signin>Logga in</button><button type="button" class="secondary" data-gate-signup>Skapa konto</button></div><p class="status" data-gate-status></p></div>`}
  function hideGate(){gate().style.display='none'}
  async function signIn(email,password){setExplicitLogout(false);const {data,error}=await client.auth.signInWithPassword({email,password});if(error){setExplicitLogout(true);throw error}user=data.user;await firstSync();hideGate();renderAccount()}
  async function signUp(email,password){setExplicitLogout(false);const {data,error}=await client.auth.signUp({email,password});if(error){setExplicitLogout(true);throw error}if(!data.session){setStatus('Kontrollera din e-post och bekräfta kontot.');setExplicitLogout(true);return}user=data.user;await firstSync();hideGate();renderAccount()}
  async function signOut(){setExplicitLogout(true);if(user){const result=await push();if(result==='conflict'){setExplicitLogout(false);return}if(result==='local-changed'){setExplicitLogout(false);pendingLocal=true;schedulePush();return}}const {error}=await client.auth.signOut({scope:'local'});if(error)console.error(error);user=null;clearConflictStatus();clearAppData();renderAccount();showGate()}
  async function deleteSyncedData(){
    if(!client||!user)return;
    const ok=window.confirm('Detta raderar alla synkade appuppgifter från molnet och från den här webbläsaren. Ditt inloggningskonto finns kvar. Vill du fortsätta?');
    if(!ok)return;
    clearTimeout(syncTimer);
    pendingLocal=false;
    const currentUser=user;
    syncing=true;
    try{
      const {error}=await client.from('user_app_state').delete().eq('user_id',currentUser.id);
      if(error)throw error;
    }finally{syncing=false}
    setExplicitLogout(true);
    clearAppData();
    const {error:signOutError}=await client.auth.signOut({scope:'local'});
    if(signOutError)console.error(signOutError);
    user=null;
    renderAccount();
    showGate();
    setStatus('Dina synkade appuppgifter är raderade. Kontot finns kvar och du kan logga in igen.');
  }
  function accountPanel(){let p=document.querySelector('#malixCloudPanel');const host=document.querySelector('#settingsCloudHost')||document.querySelector('#settingsHub');if(p){if(host&&!host.contains(p))host.appendChild(p);return p}p=document.createElement('section');p.id='malixCloudPanel';p.className='panel calm';p.style.margin='16px 0';host?.appendChild(p);return p}
  function renderAccount(){const p=accountPanel();if(!p)return;if(!configured()){p.innerHTML='<details><summary><strong>☁️ Konto & synkning</strong></summary><p class="note">Synkning förberedd.</p></details>';return}if(!user||explicitlyLoggedOut()){p.innerHTML='<details><summary><strong>☁️ Konto & synkning · Utloggad</strong></summary><p>Logga in för att se dina uppgifter.</p></details>';return}p.innerHTML=`<details><summary><strong>☁️ Konto & synkning · <span data-cloud-summary-status>${conflictStatus?'Pausad':'Synkad'}</span></strong></summary><div style="margin-top:14px"><p>Inloggad som <strong>${esc(user.email||'')}</strong>.</p><div class="chips"><button type="button" class="secondary" data-cloud-pull>Hämta från molnet</button><button type="button" class="secondary" data-cloud-push>Spara till molnet</button><button type="button" class="secondary" data-cloud-logout>Logga ut</button>${conflictStatus&&user.email?.toLowerCase()=='kontakt@malix.se'?'<button type="button" class="secondary" data-cloud-legacy-migrate>Behåll uppgifterna på denna enhet</button>':''}</div><details style="margin-top:14px"><summary>Hantera mina uppgifter</summary><p class="note">Du kan radera dina synkade appuppgifter. Det raderar appens data i molnet och på den här enheten, men inte själva inloggningskontot.</p><button type="button" class="secondary" data-cloud-delete>Radera mina synkade uppgifter</button></details><p class="status" data-cloud-status></p></div></details>`}
  function wire(){document.addEventListener('click',async e=>{try{if(e.target.closest('[data-gate-signin],[data-gate-signup]')){const g=gate(),email=g.querySelector('[data-gate-email]')?.value.trim(),password=g.querySelector('[data-gate-password]')?.value||'';if(!email||password.length<8){setStatus('Fyll i e-post och minst 8 tecken i lösenordet.');return}if(e.target.closest('[data-gate-signin]'))await signIn(email,password);else await signUp(email,password);return}if(e.target.closest('[data-cloud-pull]')){setStatus('Hämtar…');const result=await pull(true);if(result==='remote')setStatus('Molndata hämtad.');else if(result==='same')setStatus('Dina uppgifter är redan synkade.');else if(result==='local')setStatus('Ingen molndata att hämta.');else if(result==='local-changed')setStatus('Hämtningen avbröts eftersom uppgifterna ändrades. Försök igen.');else if(result==='busy')setStatus('En synkning pågår redan. Försök igen om en stund.');return}if(e.target.closest('[data-cloud-push]')){setStatus('Sparar…');const result=await push();if(result==='pulled')setStatus('Molndata hämtad. Inget behövde sparas.');else if(result==='none')setStatus('Dina uppgifter är redan synkade.');else if(result==='local-changed')setStatus('Uppgifterna ändrades under synkningen. En ny synkning väntar.');else if(result===undefined)setStatus('Kunde inte spara till molnet just nu. Försök igen om en stund.');return}if(e.target.closest('[data-cloud-legacy-migrate]')){
      setStatus('Slutför säker synkning…');
      const result=await migrateLegacyConflict();
      if(result==='local-changed')
        setStatus('Uppgifterna ändrades under synkningen. Ingen konflikt har rensats.');
      else if(result==='busy')
        setStatus('En synkning pågår redan.');
      return;
    }if(e.target.closest('[data-cloud-delete]')){await deleteSyncedData();return}if(e.target.closest('[data-cloud-logout]')){await signOut();return}}catch(err){console.error(err);setStatus(err?.message||'Något gick fel. Inga uppgifter har raderats.')}});const os=Storage.prototype.setItem,or=Storage.prototype.removeItem;Storage.prototype.setItem=function(k,v){const r=os.call(this,k,v);if(this===localStorage&&isAppKey(k)&&!applying)queuePush();return r};Storage.prototype.removeItem=function(k){const r=or.call(this,k);if(this===localStorage&&isAppKey(k)&&!applying)queuePush();return r};window.addEventListener('focus',()=>{if(user&&!explicitlyLoggedOut())pull().catch(console.error)});document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&user&&!explicitlyLoggedOut())pull().catch(console.error)})}
  async function init(){wire();renderAccount();if(!configured())return;client=window.supabase.createClient(CONFIG.url,CONFIG.anonKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});if(explicitlyLoggedOut()){try{await client.auth.signOut({scope:'local'})}catch{}user=null;clearAppData();renderAccount();showGate();client.auth.onAuthStateChange((_ev,session)=>{if(explicitlyLoggedOut()){user=null;showGate();return}const next=session?.user||null;if(!next){user=null;clearAppData();renderAccount();showGate()}else{user=next;hideGate();renderAccount()}});return}const {data}=await client.auth.getSession();user=data.session?.user||null;if(!user){clearAppData();renderAccount();showGate()}else{hideGate();renderAccount();try{await firstSync()}catch(e){console.error(e);setStatus('Kunde inte läsa molndata just nu.')}}client.auth.onAuthStateChange((_ev,session)=>{if(explicitlyLoggedOut()){user=null;renderAccount();showGate();return}const next=session?.user||null;if(!next){user=null;clearAppData();renderAccount();showGate()}else{user=next;hideGate();renderAccount()}})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();