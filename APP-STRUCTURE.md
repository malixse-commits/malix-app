# En sak i taget – kodstruktur

Syftet med den här filen är att appen ska utvecklas genom att ändra rätt huvudmodul, inte genom att lägga nya fixskript ovanpå gamla.

## Ägarskap

- `calm-navigation.js` äger startsidan, de fyra huvudfyrkanterna, matens mellanmenyer och den fria handlingslistan (`freeShoppingList`).
- `my-time-mobile.js` äger Min tid, fyrkanter, låsning av dagar och följdtid runt röd tid.
- `my-day-summary.js` äger Min dag och veckosammanfattningen inne i Min tid.
- `inner-compass.js` äger Min inre kompass och dagens cirkelavstämningar. Den får inte lägga en extra huvudfyrkant på startsidan.
- `self-care.js` äger Ta hand om mig och dess lugna mellanmeny.
- `calendar-v2.js` äger kalenderpresentationen och läser poster från Min tid.
- `recipe-navigation.js` äger receptdetaljen, kopplingen till matdagboken och recept → fri handlingslista.
- `smart-kitchen.js` äger PLUS-funktionen för kyl, frys och skafferi samt den interna PLUS-listan. Den ska inte äga den fria handlingslistan och får inte lägga kort på startsidan.
- `meal-kitchen-sync.js` och `meal-stock-bridge.js` får uppdatera PLUS-data när mat loggas men ska inte bygga PLUS-vyn.
- `cleaning-square.js` äger de tre huvudvägarna i Mitt hem och Fyrkantstäd-reflektionen.
- `app.js` är grundmotorn för mat och receptdata och ska inte bygga om huvudnavigationen.
- `free-plus-preview.js` är tills vidare bootstrapen. Trots det gamla filnamnet får den bara ladda aktiva moduler i bestämd ordning och aldrig bygga UI.

## Regler vid fortsatt utveckling

1. En vy har en huvudägare. Ändringen görs i den filen.
2. Skapa inte nya `*-fix.js`, `*-patch.js`, `*-bridge.js` eller liknande om funktionen kan ändras i sin huvudfil.
3. Om en gammal modul ersätts ska den först sluta laddas. Filen kan raderas efter att ersättningen är testad.
4. Startsidan ska visa fyra huvudfyrkanter: Mat & mitt kök, Min dag, Mitt hem och Ta hand om mig. Detaljer ligger ett steg längre in.
5. Fyrkanter 🟥 🟨 🟩 🟦 hör till Min tid. Cirklar 🟢 🔵 🔴 hör till Min inre kompass.
6. Röd tid ska kunna skapa gul förberedelsetid före och vald återhämtning/omställning efter. Alla är riktiga Min tid-poster och ska synas i kalendern.
7. Den fria handlingslistan är en grundfunktion. Användaren kan skriva egna varor, kryssa av och ta bort. Recept kan lägga ingredienser på samma lista.
8. PLUS-köket använder lagringsnyckeln `malix-smart-kitchen-v1` och har en separat intern lista för sådant som saknas/tar slut i det inventerade köket.
9. Befintlig `localStorage`-data ska bevaras. Byt inte lagringsnyckel utan migrering.
10. Funktioner ska kommunicera med events eller tydliga `window.malix...`-API:er i stället för att skriva om en annan moduls HTML.
11. Undvik globala överskrivningar av webbläsarfunktioner som `window.prompt`.
12. En huvudmodul ska inte hämtas från en gammal commit via RawGitHack. Den aktiva branchens fil är källan.

## Upprensning genomförd

- Den gamla `free-plus-preview.js`-logiken är en deterministisk bootstrap och bygger inget eget UI.
- `smart-kitchen.js` innehåller nu sin aktiva PLUS-kod direkt och hämtar inte längre en gammal version från commit `611c...`.
- Gratis handlingslista och PLUS-lista har separata vyer och id:n: `freeShoppingList` respektive `plusShoppingList`.
- PLUS-köket lägger inte längre till ett eget kort på startsidan.
- `fridge-check-routine.js` är kopplad direkt till `plusShoppingForm` och använder ett event när PLUS-vyn är redo i stället för en global klicklyssnare.
- Bootstrapen laddar inte längre `oil-stock-fix.js`, `bread-unit-fix.js`, `natural-food-units.js` eller `cook-from-kitchen.js`. De ligger kvar i repot tills den städade versionen är verifierad men påverkar inte appen.
- `meal-stock-bridge.js` skriver inte längre över `window.prompt` globalt.
- Den dubbla bottennavigationen `tab-navigation.js`, `dashboard-cleanup.js`, `evening-reflection.js` och den gamla `my-time.js`-platshållaren är sedan tidigare borttagna.

## Nästa städpass

När den här versionen är testad kan oanvända specialfiler raderas och fler små mat-/städmoduler bakas in i sina huvudägare. Gör det stegvis så att sparad data och fungerande beteenden kan verifieras mellan varje steg.