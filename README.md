# calek-co-cooking

A simple static recipe site. No build tools, no frameworks — plain HTML, CSS, and JS, hosted on GitHub Pages.

## Adding a recipe

1. Add a photo to `images/` (any format works, e.g. `.jpg` or `.svg`).
2. Create `recipes/<your-slug>.json` following this schema:

   ```json
   {
     "slug": "your-slug",
     "name": "Recipe Name",
     "image": "images/your-photo.jpg",
     "tags": ["dinner"],
     "servings": "4",
     "time": "30 min",
     "ingredients": ["1 cup flour", "..."],
     "instructions": ["Step one.", "..."],
     "notes": "Optional. Omit this field entirely if there are none."
   }
   ```

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

3. Commit and push to `main`. A GitHub Action automatically regenerates `recipes/index.json` (the homepage's recipe list) — you don't need to edit it by hand.

   To preview the updated index locally before pushing, run:

   ```
   node scripts/build-index.mjs
   ```

## Running locally

From the repo root:

```
node scripts/dev-server.mjs
```

Then open `http://localhost:8000`. (Any other static file server, e.g. `python3 -m http.server`, works too.)
