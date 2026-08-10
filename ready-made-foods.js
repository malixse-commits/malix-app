(() => {
 const groups={
  '🍽️ Färdiga rätter':['Portionsrätt / frysrätt','Färdig lasagne','Färdig paj','Färdig soppa','Färdig pizza','Färdig pastarätt','Pyttipanna','Annan färdigrätt'],
  '🥘 Färdigt & enkelt':['Färdiga köttbullar','Fiskpinnar','Nuggets','Falafel','Pulvermos','Färdigt potatismos','Färdigkokt ris','Färdig pastasås'],
  '🥣 Såser & tillbehör':['Brunsås – pulver','Gräddsås – pulver','Pepparsås – pulver','Bearnaisesås – pulver','Currysås – pulver','Färdig brunsås','Färdig gräddsås','Tacosås','Potatissallad','Coleslaw','Picklad lök','Rostad lök','Bostongurka','Rödbetor','Inlagd gurka','Oliver','Jalapeño','Pepperoni']
 };
 function defaultAmount(name){
   if(/köttbullar/i.test(name))return '5 st';
   if(/fiskpinnar|nuggets|falafel/i.test(name))return '4 st';
   if(/pulvermos|potatismos/i.test(name))return '200 g';
   if(/picklad lök|rostad lök|bostongurka|rödbetor|inlagd gurka|oliver|jalapeño|pepperoni/i.test(name))return '30 g';
   if(/brunsås|gräddsås|pepparsås|bearnaisesås|currysås|tacosås|pastasås/i.test(name))return '50 g';
   if(/potatissallad|coleslaw|ris|pyttipanna/i.test(name))return '200 g';
   return '1 portion';
 }
 function setup(){
   const form=document.querySelector('#mealForm');
   if(!form||form.querySelector('[data-ready-foods]'))return;
   const takeaway=form.querySelector('[data-takeaway-box]');
   const anchor=takeaway||form.querySelector('.meal-picker')||form.querySelector('textarea[name="food"]')?.closest('label');
   if(!anchor)return;
   const box=document.createElement('section');box.dataset.readyFoods='1';box.className='panel calm';
   box.innerHTML=`<h3>🍽️ Färdigt & enkelt</h3><p class="note">Tryck på varje del du åt. Du kan välja flera, till exempel köttbullar + potatismos + picklad lök.</p>${Object.entries(groups).map(([g,items])=>`<h4>${g}</h4><div class="chips">${items.map(x=>`<button type="button" data-ready="${x}">${x}</button>`).join('')}</div>`).join('')}<div data-ready-summary class="note" style="margin-top:12px">Inget tillagt ännu.</div>`;
   anchor.insertAdjacentElement('beforebegin',box);
   const added=[];
   const textarea=form.querySelector('textarea[name="food"]');
   function render(){box.querySelector('[data-ready-summary]').textContent=added.length?'Tillagt: '+added.join(' · '):'Inget tillagt ännu.';}
   box.addEventListener('click',e=>{
     const b=e.target.closest('[data-ready]');if(!b)return;
     const name=b.dataset.ready;
     const amount=prompt(`Hur mycket ${name.toLowerCase()}?`,defaultAmount(name));
     if(amount===null)return;
     const entry=`${name} (${amount.trim()||defaultAmount(name)})`;
     const current=textarea.value.split(/,\s*/).map(x=>x.trim()).filter(Boolean);
     current.push(entry);textarea.value=current.join(', ');textarea.dispatchEvent(new Event('input',{bubbles:true}));
     added.push(entry);b.classList.add('active');render();
   });
   form.addEventListener('reset',()=>setTimeout(()=>{added.length=0;box.querySelectorAll('[data-ready]').forEach(b=>b.classList.remove('active'));render();},0));
 }
 setup();document.addEventListener('click',()=>setTimeout(setup,0),true);
})();