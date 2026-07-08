import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const recipesDir = path.join(__dirname, "..", "recipes");

const recipeFiles = readdirSync(recipesDir).filter(
  (file) => file.endsWith(".json") && file !== "index.json"
);

const recipes = recipeFiles
  .map((file) => JSON.parse(readFileSync(path.join(recipesDir, file), "utf8")))
  .map(({ slug, name, image, tags }) => ({ slug, name, image, tags }))
  .sort((a, b) => a.name.localeCompare(b.name));

writeFileSync(
  path.join(recipesDir, "index.json"),
  JSON.stringify(recipes, null, 2) + "\n"
);

console.log(`Wrote recipes/index.json with ${recipes.length} recipe(s).`);
