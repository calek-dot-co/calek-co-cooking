# calek-co-cooking

A simple static recipe site. No build tools, no frameworks — plain HTML, CSS, and JS, hosted on GitHub Pages.

## Adding a recipe

1. Copy `recipes/_template.json` to `recipes/<your-slug>.json` and fill it in.
   It has every field the site supports:

   ```json
   {
     "slug": "your-slug",
     "name": "Recipe Name",
     "tags": ["dinner"],
     "servings": "4",
     "time": "30 min",
     "ingredients": ["1 cup flour", "..."],
     "instructions": ["Step one.", "..."],
     "notes": "..."
   }
   ```

   Every field should stay present in every recipe file — if you don't have
   the content for one, leave it blank (`""` for text fields, `[]` for
   `tags`) rather than deleting the key. The front end skips rendering
   anything left blank (tags row, servings/time, notes) instead of showing
   an empty gap.

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

   `_template.json` itself is a reference file, not a real recipe — it's
   excluded from the homepage automatically.

2. Commit and push to `main`. A GitHub Action automatically regenerates `recipes/index.json` (the homepage's recipe list) — you don't need to edit it by hand.

   To preview the updated index locally before pushing, run:

   ```
   node scripts/build-index.mjs
   ```

## Keeping a recipe off the site

Move its file into `recipes/old/` (any subfolder works). `build-index.mjs`
only reads files directly inside `recipes/`, so anything nested in a
subfolder is skipped when the homepage list is generated — it stays in the
repo but won't show up on the site or be linked from anywhere.

## Running locally

From the repo root:

```
node scripts/dev-server.mjs
```

Then open `http://localhost:8000`. (Any other static file server, e.g. `python3 -m http.server`, works too.)
