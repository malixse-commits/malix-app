# En sak i taget – kodstruktur

Syftet med den här filen är att appen ska utvecklas genom att ändra rätt huvudmodul, inte genom att lägga nya fixskript ovanpå gamla.

## Ägarskap

- `calm-navigation.js` äger startsidan, huvudnavigationen, hubbarna Mat / Mitt kök / Mitt hem samt den enkla handlingslistan.
- `my-time-mobile.js` äger Min tid, fyrkanter, låsning av dagar och följdtid runt röd tid.
- `my-day-summary.js` äger Min dag och veckosammanfattningen inne i Min tid.
- `inner-compass.js` äger Min inre kompass och dagens cirkelavstämningar.
- `calendar-v2.js` äger kalenderpresentationen och läser poster från Min tid.
- `recipe-navigation.js` äger receptdetaljen och kopplingen från recept till matdagbok.
- `smart-kitchen.js` är PLUS-funktionen för kyl, frys och skafferi. Den ska inte äga den vanliga handlingslistan.
- `cleaning-square.js` med städmodulerna äger Mitt hem.
- `app.js` är grundmotorn för mat och receptdata och ska inte bygga om huvudnavigationen.

## Regler vid fortsatt utveckling

1. En vy har en huvudägare. Ändringen görs i den filen.
2. Skapa inte nya `*-fix.js`, `*-patch.js` eller liknande för att skriva över en befintlig funktion.
3. Om en gammal modul ersätts ska den sluta laddas och därefter tas bort när ersättningen är verifierad.
4. Startsidan ska alltid innehålla Dagens översikt och huvudområdena.
5. Fyrkanter 🟥 🟨 🟩 🟦 hör till Min tid. Cirklar 🟢 🔵 🔴 hör till Min inre kompass.
6. Röd tid ska kunna skapa gul förberedelsetid före och vald återhämtning/omställning efter. Alla är riktiga Min tid-poster och ska synas i kalendern.
7. Handlingslistan är en enkel grundfunktion. Användaren kan skriva egna varor, kryssa av och ta bort. Recept kan lägga ingredienser på samma lista.
8. Kyl, frys och skafferi är PLUS och hålls separat från den vanliga handlingslistan.
9. Befintlig `localStorage`-data ska bevaras. Byt inte lagringsnyckel utan migrering.
10. Funktioner ska helst kommunicera med events i stället för att skriva om en annan moduls hela HTML.

## Upprensning genomförd

- Den gamla `free-plus-preview.js`-logiken har gjorts om till en ren, deterministisk bootstrap. Den lägger inte längre till UI och startar inte moduler efter en godtycklig timeout.
- Den dubbla bottennavigationen `tab-navigation.js` är borttagen.
- `dashboard-cleanup.js` är borttagen.
- `evening-reflection.js`, som bara dolde en annan vy efter laddning, är borttagen.
- Den oanvända gamla `my-time.js`-platshållaren är borttagen.
- Navigationen byggs nu av `calm-navigation.js` och ska inte skrivas över av senare navigationsskript.

## Fortsatt arbetssätt

När en funktion ska rättas går vi direkt till ägarfilen ovan. Vi lägger inte en ny fil ovanpå. Äldre specialfiler kan därefter successivt bakas in i sina huvudmoduler och tas bort när funktionen är verifierad.