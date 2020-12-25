// https://adventofcode.com/2020/day/21
// Runtime: ~1 ms

(function() {

function solve(input) {
  console.time("Runtime");

  // Format: {ingredients: Array<string>, allergens: Array<string>}
  let foods = [];
  // Format: {allergen => Set<string>}
  let allergenToIngredients = {};

  input.trim().split('\n').forEach(line => {
    let [ingredients, allergens] = line.split('(contains');
    ingredients = ingredients.trim().split(' ');
    allergens = allergens.trim().replace(')', '').split(/\s*,\s*/);
    foods.push({ingredients, allergens});

    for (let allergen of allergens) {
      let set = allergenToIngredients[allergen];
      if (!set) {
        set = new Set(ingredients);
      } else {
        set = new Set(ingredients.filter(i => set.has(i)));
      }
      allergenToIngredients[allergen] = set;
    }
  });

  let answer1 = 0;
  let matchingIngredients = new Set();
  for (let allergen in allergenToIngredients) {
    matchingIngredients =
        new Set([...matchingIngredients, ...allergenToIngredients[allergen]]);
  }
  for (let food of foods) {
    for (let ingredient of food.ingredients) {
      if (!matchingIngredients.has(ingredient)) ++answer1;
    }
  }
  console.log("Answer 1:", answer1);

  let mapping = {};
  while (1) {
    let stabilized = true;
    for (let allergen in allergenToIngredients) {
      if (allergenToIngredients[allergen].size != 1) continue;
      stabilized = false;
      const ingredient = Array.from(allergenToIngredients[allergen])[0];
      mapping[allergen] = ingredient;
      for (let allergen in allergenToIngredients) {
        allergenToIngredients[allergen].delete(ingredient);
      }
      break;
    }
    if (stabilized) break;
  }

  // Check all allergens were matched.
  for (let allergen in allergenToIngredients) {
    console.assert(allergenToIngredients[allergen].size == 0);
  }

  let answer2 = "";
  for (let allergen of Object.keys(mapping).sort()) {
    if (answer2) answer2 += ',';
    answer2 += mapping[allergen];
  }
  console.log("Answer 2:", answer2);

  console.timeEnd("Runtime");
}

solve(`
mxmxvkd kfcds sqjhc nhms (contains dairy, fish)
trh fvjkl sbzzf mxmxvkd (contains dairy)
sqjhc fvjkl (contains soy)
sqjhc mxmxvkd sbzzf (contains fish)
`);

solve(document.body.textContent);

})();

