# En sak i taget – kodstruktur

Syftet med den här filen är att appen ska utvecklas genom att ändra rätt huvudmodul, inte genom att lägga nya fixskript ovanpå gamla.

## Övergripande designprincip för hela appen

**En sak i taget ska inte hjälpa mig att göra mer. Den ska hjälpa mig att förstå vad jag behöver för att leva min vardag på ett mer hållbart och vänligt sätt.**

Hela appen ska ha ett compassionfokuserat förhållningssätt. Det betyder inte att varje del ska bli en CFT-övning. Det betyder att appens sätt att fråga, återkoppla, visa historik och statistik och hjälpa användaren ska vara vänligt, undersökande, icke-dömande och stödja självförståelse.

Appen ska inte främst fråga **"Hur mycket gjorde du?"** utan hjälpa användaren undersöka **"Hur fungerade det här för dig?"**

En generell undersökande riktning för appen är:

**Vad hände? → Vad märkte jag? → Vad hjälpte? → Vad kostade energi? → Vad behövde jag? → Vad kan jag lära mig om mig själv?**

Detta gäller bland annat:

- **Tid/fyrkanterna:** hjälpa användaren se hur aktiviteter påverkar tid, energi och behov av återhämtning. Färgerna är information, inte betyg.
- **Städning:** lite kan räcka. Appen kan hjälpa användaren upptäcka vad som hjälpte att komma igång, när det räckte och hur det kändes efteråt.
- **Rörelse/Det jag gjort för mig själv:** inte bara samla minuter eller prestation, utan också synliggöra vad aktiviteten gjorde för personen – till exempel energi, lugn, glädje, återhämtning eller något annat.
- **Mat:** inte moralisera kring bra eller dålig mat. Hjälpa användaren lägga märke till måltider, mättnad, upplevelse och vad som fungerar i vardagen utan att skapa nya prestationskrav.
- **Min inre kompass:** färgerna är information, inte värderingar. Målet är att märka, undersöka, förstå mer och välja ett vänligt och hjälpsamt nästa steg.
- **Historik och statistik:** hjälpa användaren upptäcka möjliga mönster utan att bedöma dagen eller veckan. Hellre **"Det här verkar återkomma. Känner du igen det?"** än ett betyg eller en slutsats om vad användaren borde göra.

### Skydd mot prestationskrav

Appen riktar sig bland annat till människor som kan ha erfarenhet av att göra för mycket, ställa höga krav på sig själva eller bli överbelastade. Därför får En sak i taget inte själv bli ännu ett prestationsprojekt.

Följande principer ska genomsyra designen:

- **Du behöver inte fylla i allt.**
- **Det är okej att hoppa över.**
- **Tomt är också information.**
- **Lite kan vara tillräckligt.**
- **Historiken är information – inte ett betyg.**
- **Färger beskriver – de värderar inte.**

Var försiktig med streaks, mål, varningar, poäng, prestationsmarkörer och formuleringar som kan skapa känslan att användaren måste använda appen "rätt" eller prestera för appens skull.

### AI-spegling

Om AI-spegling byggs senare ska AI:n vara en spegel, inte ett facit. Den ska inte tala om för användaren vem hen är eller varför hen reagerar.

Lämpliga formuleringar är exempelvis:

- **"Du beskriver…"**
- **"Det verkar som…"**
- **"Du verkar själv ha lagt märke till…"**
- **"Ett möjligt mönster skulle kunna vara…"**
- **"Känner du igen det?"**

Användaren äger alltid tolkningen.

### Kontrollfrågor vid fortsatt utveckling

När en ny funktion, text, statistik eller återkoppling övervägs ska två frågor användas:

1. **Hjälper detta användaren att förstå sig själv bättre?**
2. **Finns det risk att detta får användaren att känna att hen måste prestera mer eller använda appen "rätt"?**

Om något ökar prestationskraven utan att samtidigt hjälpa användaren förstå sig själv behöver lösningen tänkas om.

Den här principen ska styra fortsatt utveckling, men ska inte användas som skäl för att göra om fungerande delar i onödan. Gå igenom appen en del i taget och ändra bara där det finns ett faktiskt behov.

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

## Compassion – kärnprincip

Compassiondelen ska inte främst lära användaren färgerna eller försöka flytta användaren från 🔴 till 🟢. Färgerna är en karta som hjälper användaren att stanna upp och undersöka sin egen erfarenhet.

Den grundläggande processen är:

**Jag märker → jag undersöker → jag förstår mer → jag kan välja hur jag vill agera.**

Reflektionen ska hjälpa användaren att:

1. uppmärksamma vad som hände och vad som blev framträdande,
2. lägga märke till kropp, tankar, känslor och impulser,
3. undersöka behov,
4. möta sig själv med mer förståelse,
5. stanna kvar lite längre och själv undersöka om det finns något mer bakom reaktionen – till exempel en känsla, tanke, rädsla, besvikelse, osäkerhet, skam, ett behov eller något helt annat,
6. se om den ökade förståelsen gör reaktionen mer begriplig,
7. välja ett vänligt och hjälpsamt nästa steg.

Appen ska aldrig tala om för användaren vad som "egentligen" finns bakom en reaktion. Den får ställa öppna frågor och erbjuda exempel som möjligheter, men användaren äger tolkningen. Det ska alltid vara okej att inte veta.

Alla tre systemen används med samma nyfikna syfte:

- 🔴 kan hjälpa användaren undersöka vad hen reagerar på eller försöker skydda sig från.
- 🔵 kan hjälpa användaren undersöka vad som väcker driv och nyfikenhet, och när driv eventuellt börjar bli press.
- 🟢 kan hjälpa användaren undersöka vad som skapar trygghet, lugn och återhämtning.

Historik och Dagens kompass får försiktigt föreslå möjliga återkommande samband, men ska inte fastslå mönster eller förklara vem användaren är. Ett föreslaget samband ska lämnas tillbaka till användaren med en fråga som **"Känner du igen det?"**

Den viktigaste principen är:

**Appen ska inte kategorisera mig. Den ska hjälpa mig att upptäcka och förstå mig själv.**

Kontrollfrågan för nya funktioner i compassiondelen är:

**Hjälper detta användaren att förstå sig själv bättre?**

Om svaret är nej ska funktionen inte automatiskt läggas i compassiondelen.

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