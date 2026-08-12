(() => {
 const tips=[
  {title:'🌿 Farmors råd',text:'”En ren trasa och ett gott vatten gör underverk.”',note:'Det enkla räcker ofta långt.'},
  {title:'🌿 Farmors råd',text:'”Gör en liten sak i taget. Rätt som det är märker du: oj, en sak blev hela rummet.”',note:'Men det behöver inte bli hela rummet. Det du gjorde räcker.'},
  {title:'🧦 Farmors råd',text:'”Rena sockor ska vara rena när de går på ett rent golv.”',note:'När golvet är färdigt ska det kännas rent på riktigt.'},
  {title:'🪟 Farmors råd',text:'”Öppnar du fönstret kommer det frisk luft, och det har ingen dött av. Du får bara använda koftan.”',note:'Lite frisk luft kan förändra känslan i ett helt rum.'},
  {title:'🌿 Farmors tanke om städning',text:'”Att städa ska vara roligt. Kanske inte själva göromålet – men när du är klar ska du känna att du har gjort något viktigt. För det gör inte sig självt.”',note:'Se det du faktiskt gjorde, inte bara det som är kvar.'},
  {title:'💡 Ett steg i taget',text:'Välj en liten yta och gör klart just den.',note:'Du behöver inte fortsätta när den är färdig.'},
  {title:'💡 Uppifrån och ner',text:'Damma högre ytor först och ta golvet sist.',note:'En enkel ordning gör att du slipper göra om.'},
  {title:'💡 Fem minuter räknas',text:'En liten insats är fortfarande gjord.',note:'Det är inte allt eller inget.'},
  {title:'💡 Ett fönster räcker',text:'Att tvätta fönster behöver inte betyda hela huset.',note:'Ett fönster idag är ett fönster mindre en annan dag.'},
  {title:'💡 Extra gjort räknas',text:'Möblerade du om, rensade en låda eller gjorde något utöver planen? Skriv upp det.',note:'Det hjälper dig att se vad du faktiskt har gjort.'},
  {title:'🌿 Klart för idag',text:'När dagens rum är gjort får det vara färdigt.',note:'Nästa rum har sin egen dag.'}
 ];
 let index=0;
 function renderTip(box){const t=tips[index%tips.length];box.innerHTML=`<h3>${t.title}</h3><p><strong>${t.text}</strong></p><p class="note">${t.note}</p><button type="button" class="secondary" data-next-clean-tip>Visa ett annat tips</button>`;box.querySelector('[data-next-clean-tip]').onclick=()=>{index=(index+1)%tips.length;renderTip(box)}}
 function init(){const hub=document.querySelector('#homeHub');if(!hub||hub.querySelector('[data-cleaning-tips]'))return;const box=document.createElement('section');box.className='panel calm';box.dataset.cleaningTips='1';box.style.marginTop='20px';renderTip(box);hub.appendChild(box);const intro=document.createElement('section');intro.className='panel calm';intro.style.marginTop='14px';intro.innerHTML='<h3>🌿 Tanken med Mitt hem</h3><p>Städning ska hjälpa vardagen, inte ta över den. Ett rum, en fyrkant eller en liten sak kan vara nog. När du är klar får du gärna känna: jag gjorde något viktigt idag.</p>';hub.appendChild(intro);const material=document.createElement('section');material.className='panel calm';material.style.marginTop='14px';material.innerHTML='<h3>🧹 Vill du arbeta vidare?</h3><p>Städa i fyrkanter bygger på samma tanke: när allt känns för stort kan du börja med en liten yta i taget.</p><a href="https://malix.se/22/stada-i-fyrkanter/13/11/08/" target="_blank" rel="noopener" style="font-weight:700">Läs mer om Städa i fyrkanter på Malix →</a>';hub.appendChild(material)}
 document.addEventListener('click',e=>{if(e.target.closest('[data-calm-open="homeHub"]'))setTimeout(init,0)},true);setTimeout(init,400);
})();