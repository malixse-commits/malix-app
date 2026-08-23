# En sak i taget – kodstruktur

Syftet med den här filen är att appen ska utvecklas genom att ändra rätt huvudmodul, inte genom att lägga nya fixskript ovanpå gamla.

## Ägarskap

- `calm-navigation.js` äger startsidan, de fyra huvudfyrkanterna, matens mellanmenyer och den fria handlingslistan (`freeShoppingList`).
- `my-time-mobile.js` äger Min tid, fyrkanter, låsning av dagar och följdtid runt röd tid.
- `my-day-summary.js` äger Min dag och veckosammanfattningen inne i Min tid. Egna dagsuppgifter från städningen ska visas med användarens text, aldrig med interna id:n.
- `inner-compass.js` äger Min inre kompass och Dagens kompass. Den får inte lägga en extra huvudfyrkant på startsidan.
- `self-care.js` äger Ta hand om mig och dess lugna mellanmeny.
- `recipes-malix.js` samlar nyare Malix-recept och vardagsrecept.
- `desserts-malix.js` samlar efterrätter och klassiska enkla efterrätter.
- `recipe-category-dessert.js` lägger den synliga efterrättskategorin i receptbanken.
- `recipes-extra.js` och `recipes-more.js` innehåller äldre större receptsamlingar och laddas direkt från `index.html` tills de senare kan konsolideras säkert.
- `recipe-serving-suggestions.js` äger serveringsförslag, variationer och smaklyft som visas i receptdetaljen.
- `smart-kitchen.js` äger PLUS-funktionen för kyl, frys och skafferi samt den interna PLUS-listan. Den ska inte äga den fria handlingslistan och får inte lägga kort på startsidan.
- `meal-kitchen-sync.js` och `meal-stock-bridge.js` får uppdatera PLUS-data när mat loggas men ska inte bygga PLUS-vyn.
- `cleaning-square.js` äger de tre huvudvägarna i Mitt hem, dagens egna uppgifter och Fyrkantstäd-reflektionen.
- `cleaning-flex-log.js` äger fri städlogg, veckosummering och samlad städhistorik.
- `app.js` är grundmotorn för mat och receptdata och ska inte bygga om huvudnavigationen.
- `free-plus-preview.js` är bootstrapen. Trots det gamla filnamnet får den bara ladda aktiva moduler i bestämd ordning och aldrig bygga UI.

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
13. Nya Malix-recept läggs i `recipes-malix.js`; efterrätter läggs i `desserts-malix.js`. Skapa inte en ny fil per recept.
14. Veckan samlad är historisk överblick och ska bevaras. En framtida sida för Mina mönster ska läsa samma data i stället för att flytta eller duplicera historiken.
15. Det användaren själv registrerar ska kunna tas bort igen i alla fyra huvudområden. Använd samma tydliga `Ta bort`-mönster där en sparad post visas. Befintlig skyddslogik för låsta dagar ska bevaras tills ett separat beslut tas om låsningen.

## Upprensning genomförd

- `free-plus-preview.js` är en deterministisk bootstrap och bygger inget eget UI.
- `smart-kitchen.js` innehåller sin aktiva PLUS-kod direkt och hämtar inte längre en gammal version från en äldre commit.
- Gratis handlingslista och PLUS-lista har separata vyer och id:n: `freeShoppingList` respektive `plusShoppingList`.
- PLUS-köket lägger inte längre till ett eget kort på startsidan.
- `fridge-check-routine.js` är kopplad till PLUS-köket i stället för att lyssna globalt på all navigation.
- `meal-stock-bridge.js` skriver inte längre över `window.prompt` globalt.
- De gamla och oanvända filerna `oil-stock-fix.js`, `bread-unit-fix.js`, `natural-food-units.js`, `cook-from-kitchen.js`, `delete-meals.js`, `evening-same-as-breakfast.js`, `meal-dedupe.js` och `meal-shortcuts.js` är borttagna.
- De små receptfilerna `taco-recipe.js`, `tomato-sauce-addon.js`, `chalaw-rice-addon.js`, `popup-bread-recipe.js`, `pasta-and-leftovers-recipes.js` och `pancake-oven-omelette-recipes.js` är samlade i `recipes-malix.js` och därefter borttagna.
- De oanvända äldre modulerna `calendar-v2.js`, `finder-v2.js`, `low-energy-v2.js`, `v2-dashboard.js` och `recipe-navigation.js` är borttagna efter kontroll att de inte längre ingår i den aktiva laddningskedjan.
- `my-day-summary.js` översätter nu interna id:n för dagens egna städuppgifter till den text användaren faktiskt skrev.
- Bootstrapen laddar en grupperad lista av aktiva moduler: synkning, recept/kök, matlogg, hem/historik, huvudnavigation och undervyer.
- Den dubbla bottennavigationen `tab-navigation.js`, `dashboard-cleanup.js`, `evening-reflection.js` och den gamla `my-time.js`-platshållaren är sedan tidigare borttagna.

## Nästa möjliga städpass

Nästa större städning bör göras separat efter fortsatt användning. Kandidater är att konsolidera äldre receptsamlingar (`recipes-extra.js` och `recipes-more.js`) och att byta det historiska filnamnet `free-plus-preview.js` till ett tydligare bootstrap-namn. Båda påverkar många beroenden och ska därför inte blandas ihop med vardagliga funktionsändringar.