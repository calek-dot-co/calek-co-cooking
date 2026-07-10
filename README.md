# calek-co-cooking

A simple static recipe site. No build tools, no frameworks — plain HTML, CSS, and JS, hosted on GitHub Pages.

## Adding a recipe

1. Add a photo to `images/` (any dimensions — it's displayed in a fixed
   portrait frame and cropped to fit, so any aspect ratio works).
2. Copy `recipes/_template.json` to `recipes/<your-slug>.json` and fill it in.
   It has every field the site supports:

   ```json
   {
     "slug": "your-slug",
     "name": "Recipe Name",
     "image": "images/your-photo.jpg",
     "tags": ["dinner"],
     "servings": "4",
     "prepTime": "15 mins",
     "cookTime": "10 mins",
     "ingredients": ["1 cup flour", "..."],
     "instructions": ["Step one.", "..."],
     "notes": "..."
   }
   ```

   Every field should stay present in every recipe file — if you don't have
   the content for one, leave it blank (`""` for text fields, `[]` for
   `tags`) rather than deleting the key. The front end skips rendering
   anything left blank (image, tags row, servings/prep/cook time, notes)
   instead of showing an empty gap.

   `ingredients` can also be grouped into labeled sections (e.g. a base
   recipe plus a frosting or topping) by using this shape instead of a
   flat array:

   ```json
   "ingredients": [
     { "items": ["1 cup flour", "..."] },
     { "section": "Frosting", "items": ["125g cream cheese", "..."] }
   ]
   ```

   The first group's `section` can be omitted if those ingredients don't
   need a heading.

   `ingredientRefs` is optional and links words in `instructions` back to
   the ingredient list. Each entry underlines the first occurrence of
   `phrase` (case-insensitive, across all steps) and, on hover/tap/focus,
   pops up the referenced ingredient line(s) looked up by their flat
   position in `ingredients` (0-based, counting across all groups if
   grouped):

   ```json
   "ingredientRefs": [
     { "phrase": "flour", "ingredients": [0] },
     { "phrase": "cream cheese and sugar", "ingredients": [3, 4] }
   ]
   ```

   `_template.json` itself is a reference file, not a real recipe — it's
   excluded from the homepage automatically.

3. Commit and push to `main`. A GitHub Action automatically regenerates `recipes/index.json` (the homepage's recipe list) — you don't need to edit it by hand.

   To preview the updated index locally before pushing, run:

   ```
   node scripts/build-index.mjs
   ```

## Keeping a recipe off the site

Move its file into `recipes/_old/` (any subfolder works). `build-index.mjs`
only reads files directly inside `recipes/`, so anything nested in a
subfolder is skipped when the homepage list is generated — it stays in the
repo but won't show up on the site or be linked from anywhere.

## Running locally

From the repo root:

```
node scripts/dev-server.mjs
```

Then open `http://localhost:8000`. (Any other static file server, e.g. `python3 -m http.server`, works too.)
