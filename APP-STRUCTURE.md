# En sak i taget – kodstruktur

Syftet med den här filen är att undvika att flera skript bygger om samma vy och skriver över varandra.

## Ägarskap

- `calm-navigation.js` äger startsidan, huvudnavigationen, hubbarna Mat / Mitt kök / Mitt hem samt den enkla handlingslistan.
- `my-time-mobile.js` äger Min tid, fyrkanter, låsning av dagar och följdtid runt röd tid.
- `my-day-summary.js` äger Min dag och veckosammanfattningen inne i Min tid.
- `inner-compass.js` äger Min inre kompass och dagens cirkelavstämningar.
- `calendar-v2.js` visar kalenderinformation och läser även poster från Min tid.
- `recipe-navigation.js` äger receptdetaljen och kopplingen från recept till matdagbok.
- `smart-kitchen.js` är PLUS-funktionen för kyl, frys och skafferi. Den ska inte äga den vanliga handlingslistan.
- `cleaning-square.js` och relaterade städfiler äger Mitt hem.

## Regler vid fortsatt utveckling

1. En vy ska ha en huvudägare. Lägg inte in ett nytt skript som ersätter hela samma vy.
2. Nya funktioner ska i första hand kopplas via events eller små tillägg, inte genom att skriva om `innerHTML` för en annan moduls hela vy.
3. Startsidan ska alltid innehålla Dagens översikt och huvudområdena.
4. Fyrkanter: 🟥 🟨 🟩 🟦 hör till Min tid. Cirklar: 🟢 🔵 🔴 hör till Min inre kompass.
5. Röd tid ska kunna skapa gul förberedelsetid före och vald återhämtning/omställning efter. Alla dessa är riktiga Min tid-poster och ska synas i kalendern.
6. Handlingslistan är en enkel grundfunktion. Användaren kan skriva egna varor, kryssa av och ta bort. Recept kan lägga ingredienser på samma lista.
7. Kyl, frys och skafferi är PLUS och ska hållas separat från den vanliga handlingslistan.
8. Bevara befintlig localStorage-data och migrera hellre än att byta lagringsnycklar utan behov.

## Nästa upprensningssteg

- Gå igenom äldre addon-filer och markera vilka som är ersatta av nuvarande ägarfiler.
- Flytta så småningom stabil funktionalitet från många patchfiler till färre modulära filer.
- Ta bort inaktiva eller dubblerade skript från `index.html` först när motsvarande funktion är verifierad i den nya ägarfilen.
