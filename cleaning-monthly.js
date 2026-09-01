(() => {
  const KEY='malix-cleaning-square-v2';
  const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return{}}};
  const monthKey=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
  const monthName=key=>{const [y,m]=key.split('-').map(Number);return new Date(y,m-1,1).toLocaleDateString('sv-SE',{month:'long',year:'numeric'})};
  const changeMonth=(key,delta)=>{const [y,m]=key.split('-').map(Number),d=new Date(y,m-1+delta,1);return monthKey(d)};
  const ensureView=()=>{let root=document.querySelector('#cleaningMonth');if(!root){root=document.createElement('section');root.id='cleaningMonth';root.className='view';document.querySelector('main')?.appendChild(root)}return root};
  const show=id=>{document.querySelectorAll('main > .view').forEach(v=>v.classList.remove('active-view'));document.querySelector('#'+id)?.classList.add('active-view');window.scrollTo({top:0,behavior:'smooth'})};

  function parseDoneId(id,s,key){
    if(id.startsWith('Dagens egna::')){
      const dailyId=id.slice('Dagens egna::'.length),item=(s.dailyTasks?.[key]||[]).find(x=>String(x.id)===String(dailyId));
      return {room:'Dagens egna',task:item?.text||'Egen uppgift'};
    }
    const parts=id.split('::');
    if(parts.length<2)return null;
    return {room:parts.shift(),task:parts.join('::')};
  }

  function collectMonth(s,key){
    const days=new Set(),rooms={},allTasks=[];
    Object.entries(s.done||{}).forEach(([date,done])=>{
      if(!date.startsWith(key+'-'))return;
      Object.entries(done||{}).forEach(([id,isDone])=>{
        if(!isDone)return;
        const parsed=parseDoneId(id,s,date);if(!parsed)return;
        days.add(date);allTasks.push({...parsed,date});
        rooms[parsed.room]=rooms[parsed.room]||{count:0,tasks:new Set(),days:new Set()};
        rooms[parsed.room].count++;rooms[parsed.room].tasks.add(parsed.task);rooms[parsed.room].days.add(date);
      });
    });
    const reflections=Object.entries(s.reflections||{}).filter(([date])=>date.startsWith(key+'-')).map(([date,r])=>({date,...r}));
    return {days:[...days],rooms,allTasks,reflections};
  }

  function completedOverview(data){
    const entries=Object.entries(data.rooms).sort((a,b)=>b[1].count-a[1].count);
    if(!entries.length)return '<p class="note">Det finns ännu ingen städning registrerad den här månaden. En tom månad är också information – inget behöver fyllas i i efterhand.</p>';
    const total=data.allTasks.length;
    const roomText=entries.map(([room,v])=>`<li><strong>${esc(room)}</strong>: ${v.count} ${v.count===1?'sak':'saker'} på ${v.days.size} ${v.days.size===1?'dag':'dagar'}</li>`).join('');
    return `<p>Du markerade <strong>${total}</strong> ${total===1?'sak':'saker'} som gjorda under ${data.days.length} ${data.days.length===1?'dag':'dagar'}.</p><ul>${roomText}</ul>`;
  }

  function energyOverview(data){
    const entries=Object.entries(data.rooms).filter(([room])=>room!=='Dagens egna').sort((a,b)=>b[1].count-a[1].count);
    if(!entries.length)return '<p class="note">Det finns ännu inte tillräckligt med registrerat för att se var energin hamnade.</p>';
    const max=entries[0][1].count,top=entries.filter(([,v])=>v.count===max).map(([room])=>room);
    const detail=entries.slice(0,3).map(([room,v])=>`${esc(room)} (${v.count})`).join(' · ');
    return `<p>Den här månaden syns mest omsorg kring <strong>${top.map(esc).join(' och ')}</strong>. Det betyder inte att andra rum borde ha fått mer – bara att det är här flest registrerade steg hamnade.</p><p class="note">${detail}</p>`;
  }

  function wholeRoomInsights(s,data){
    const insights=[];
    Object.entries(data.rooms).forEach(([room,v])=>{
      if(room==='Dagens egna')return;
      const roomData=s.rooms?.[room];
      const currentTasks=Array.isArray(roomData?.tasks)&&roomData.tasks.length?roomData.tasks:[...(roomData?.standard||[]),...(roomData?.custom||[])];
      const normalized=new Set(currentTasks.map(x=>String(x).trim().toLocaleLowerCase('sv-SE')).filter(Boolean));
      const doneUnique=[...v.tasks].filter(t=>normalized.has(String(t).trim().toLocaleLowerCase('sv-SE')));
      const coverage=normalized.size?doneUnique.length/normalized.size:0;
      if(doneUnique.length>=4&&coverage>=0.7){
        insights.push(`<p>Du storstädade inte nödvändigtvis <strong>${esc(room)}</strong> på en enda dag, men under månaden gjorde du ${doneUnique.length} olika delar där. En sak i taget blev tillsammans en ordentlig genomgång av rummet.</p>`);
      }
    });
    if(!insights.length){
      const spread=Object.entries(data.rooms).filter(([room,v])=>room!=='Dagens egna'&&v.tasks.size>=4).sort((a,b)=>b[1].tasks.size-a[1].tasks.size)[0];
      if(spread)return `<p>I <strong>${esc(spread[0])}</strong> gjorde du ${spread[1].tasks.size} olika slags uppgifter under månaden. De små sakerna blev tillsammans mer än en enstaka städstund.</p>`;
      return '<p class="note">Här kommer appen att uppmärksamma när många små steg tillsammans har blivit en större helhet.</p>';
    }
    return insights.join('');
  }

  function reflectionPatterns(reflections){
    if(!reflections.length)return [];
    const text=reflections.map(r=>[r.managed,r.feeling,r.helped,r.notice,r.note,r.energy].filter(Boolean).join(' ').toLocaleLowerCase('sv-SE'));
    const patterns=[];
    const count=re=>text.filter(t=>re.test(t)).length;
    if(count(/börja|kom igång|började bara/)>=2)patterns.push('Det verkar ofta hjälpa att bara börja, utan att hela uppgiften behöver vara klar i huvudet först.');
    if(count(/lättare än jag trodde|gick lättare|lättare/)>=2)patterns.push('Flera gånger beskrev du att det blev lättare än du först trodde.');
    if(count(/det räcker|räcker nu|stanna|lagom/)>=2)patterns.push('Du verkar flera gånger ha kunnat känna när det var lagom och låta det räcka där.');
    if(count(/musik|radio|podd|podcast/)>=2)patterns.push('Musik, radio eller något att lyssna på återkommer som något som verkar hjälpa dig.');
    if(count(/mat|frukost|kaffe|äta|mätt|hungr/)>=2)patterns.push('Mat, dryck eller att ha fått i dig något återkommer i dina reflektioner som en del av hur städningen fungerade.');
    if(count(/timer|tio minuter|10 minuter|kort stund|lite i taget|en sak/)>=2)patterns.push('Små avgränsade steg återkommer som ett sätt att göra uppgiften mer hanterbar.');
    return patterns;
  }

  function discoveryOverview(data){
    const patterns=reflectionPatterns(data.reflections);
    if(patterns.length)return `<ul>${patterns.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><p class="note">Det här är möjliga mönster i det du själv har skrivit – inte ett facit.</p>`;
    if(data.reflections.length)return '<p>Du har reflekterat under månaden, men det finns ännu inget tydligt återkommande mönster som appen behöver slå fast. Det får vara så.</p>';
    return '<p class="note">När du sparar några reflektioner under månaden kan möjliga återkommande mönster visas här.</p>';
  }

  function takeaway(data,s){
    const patterns=reflectionPatterns(data.reflections);
    const hasWhole=Object.entries(data.rooms).some(([room,v])=>{const d=s.rooms?.[room],tasks=Array.isArray(d?.tasks)?d.tasks:[];return room!=='Dagens egna'&&tasks.length>=4&&v.tasks.size/tasks.length>=0.7});
    if(hasWhole)return 'Små steg behöver inte se stora ut när du gör dem. Den här månaden visar att sådant du gjorde vid olika tillfällen faktiskt kunde växa till en helhet.';
    if(patterns.some(x=>x.includes('bara börja')))return 'Du behöver inte alltid känna dig redo för hela uppgiften. Det du har skrivit pekar på att själva starten ofta kan vara ett tillräckligt första steg.';
    if(patterns.some(x=>x.includes('lagom')))return 'Att stanna när det känns lagom är också en del av att ta hand om hemmet. Det du gjorde får räknas utan att du måste fortsätta.';
    if(data.allTasks.length)return 'Det du faktiskt gjorde den här månaden får räknas. Nästa månad behöver inte bli större – den kan bara bli ännu en möjlighet att ta en sak i taget.';
    return 'Det finns inget krav på att en månad ska innehålla mycket. När du använder städdelen igen börjar du där du är.';
  }

  function availableMonths(s){
    const keys=new Set();
    [...Object.keys(s.done||{}),...Object.keys(s.reflections||{}),...Object.keys(s.dailyTasks||{})].forEach(d=>/^\d{4}-\d{2}-\d{2}$/.test(d)&&keys.add(d.slice(0,7)));
    keys.add(monthKey(new Date()));
    return [...keys].sort().reverse();
  }

  let selectedMonth=monthKey(new Date());
  function render(){
    const root=ensureView(),s=read(),data=collectMonth(s,selectedMonth),months=availableMonths(s);
    root.innerHTML=`<button type="button" class="back" data-month-back>← Mitt hem</button><p class="eyebrow">PLUS · Månadsläsning</p><h2>🌿 Min månad – ${esc(monthName(selectedMonth))}</h2><p class="subtitle">En återblick på det du faktiskt har gjort och det du själv har skrivit. Ingen bedömning och inget krav på att månaden borde ha sett annorlunda ut.</p><section class="panel"><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><button type="button" class="secondary" data-month-prev>← Föregående</button><select id="cleaningMonthSelect" aria-label="Välj månad">${months.map(m=>`<option value="${m}" ${m===selectedMonth?'selected':''}>${esc(monthName(m))}</option>`).join('')}</select><button type="button" class="secondary" data-month-next>Nästa →</button></div></section><section class="panel"><h3>Det här gjorde jag</h3>${completedOverview(data)}</section><section class="panel"><h3>🏠 Här lade jag min energi</h3>${energyOverview(data)}</section><section class="panel calm"><h3>✨ En sak i taget blev till en helhet</h3>${wholeRoomInsights(s,data)}</section><section class="panel"><h3>🧭 Det här verkar jag ha upptäckt</h3>${discoveryOverview(data)}</section><section class="panel calm"><h3>💚 Det här kan jag ta med mig till nästa månad</h3><p>${esc(takeaway(data,s))}</p></section>`;
    root.querySelector('[data-month-back]')?.addEventListener('click',()=>show('homeHub'));
    root.querySelector('[data-month-prev]')?.addEventListener('click',()=>{selectedMonth=changeMonth(selectedMonth,-1);render()});
    root.querySelector('[data-month-next]')?.addEventListener('click',()=>{const next=changeMonth(selectedMonth,1),now=monthKey(new Date());if(next<=now){selectedMonth=next;render()}});
    root.querySelector('#cleaningMonthSelect')?.addEventListener('change',e=>{selectedMonth=e.target.value;render()});
  }

  function addCard(){
    const hub=document.querySelector('#homeHub'),grid=hub?.querySelector('.choice-grid');if(!grid||grid.querySelector('[data-cleaning-month-card]'))return;
    const button=document.createElement('button');button.type='button';button.className='choice-card';button.dataset.cleaningMonthCard='1';button.innerHTML='<span>🌿</span><strong>Månadens återblick · PLUS</strong><small>Se vad de små stegen blev tillsammans och vad du verkar ha upptäckt.</small>';
    button.addEventListener('click',()=>{selectedMonth=monthKey(new Date());render();show('cleaningMonth')});grid.appendChild(button);
  }

  document.addEventListener('malix-cleaning-changed',()=>{if(document.querySelector('#cleaningMonth.active-view'))render()});
  addCard();
  window.malixOpenCleaningMonth=()=>{render();show('cleaningMonth')};
})();