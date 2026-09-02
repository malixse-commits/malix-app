// Kompatibilitetsfil för äldre index.html.
// All receptdata finns nu i recipe-bank.js.
// document.write används här endast medan denna klassiska script-tagg finns kvar i index.html,
// så att recipe-bank.js laddas synkront innan nästa gamla script-tagg körs.
document.write('<script src="recipe-bank.js?v=20260902-1210"><\/script>');
