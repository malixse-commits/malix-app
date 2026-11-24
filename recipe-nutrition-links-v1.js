(() => {
  'use strict';

  const mappings=Object.freeze([
    Object.freeze({
      ingredientId:'rapsolja',
      foodNumber:2189,
      slvName:'Rapsolja'
    }),
    Object.freeze({
      ingredientId:'blandfars',
      foodNumber:2492,
      slvName:'Blandfärs rå nöt 70% gris 30%'
    })
  ]);

  const byId=new Map(mappings.map(row=>[row.ingredientId,row]));

  window.MalixRecipeNutritionLinksV1=Object.freeze({
    mappings,
    get:ingredientId=>byId.get(String(ingredientId||''))||null
  });
})();
