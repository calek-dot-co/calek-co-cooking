import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const recipesDir = path.join(__dirname, "..", "recipes");

// readdirSync only lists recipesDir's immediate entries — it does not recurse
// into subdirectories, so recipes/old/**.json (drafts/retired recipes kept out
// of publishing) is skipped automatically. _template.json is a reference file,
// not a real recipe, so it's excluded explicitly.
const recipeFiles = readdirSync(recipesDir).filter(
  (file) => file.endsWith(".json") && file !== "index.json" && file !== "_template.json"
);

const recipes = recipeFiles
  .map((file) => JSON.parse(readFileSync(path.join(recipesDir, file), "utf8")))
  .map(({ slug, name }) => ({ slug, name }))
  .sort((a, b) => a.name.localeCompare(b.name));

writeFileSync(
  path.join(recipesDir, "index.json"),
  JSON.stringify(recipes, null, 2) + "\n"
);

console.log(`Wrote recipes/index.json with ${recipes.length} recipe(s).`);
