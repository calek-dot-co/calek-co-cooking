function randomRotation(min = -5, max = 5) {
  return (Math.random() * (max - min) + min).toFixed(1);
}

function recipeHtml(recipe) {
  const tags = (recipe.tags || [])
    .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`)
    .join("");

  const meta = [
    recipe.prepTime && `${escapeHtml(recipe.prepTime)} prep`,
    recipe.cookTime && `${escapeHtml(recipe.cookTime)} cooking`,
    recipe.servings && `serves ${escapeHtml(recipe.servings)}`,
  ]
    .filter(Boolean)
    .join(" &middot; ");

  const photo = recipe.image
    ? `<img class="recipe-photo" src="${escapeHtml(recipe.image)}" alt="${escapeHtml(recipe.name)}" style="--rotate: ${randomRotation()}deg" />`
    : "";

  const ingredients = ingredientsHtml(recipe.ingredients);

  const instructions = instructionsHtml(recipe.instructions, recipe.ingredientRefs);

  const notes = recipe.notes
    ? `<div class="recipe-notes">
         <h2 class="recipe-notes__title">Notes</h2>
         <p>${escapeHtml(recipe.notes)}</p>
       </div>`
    : "";

  return `
    <div class="recipe-body">
      <div class="recipe-header-row">
        ${photo}
        <h1 class="recipe-title">${escapeHtml(recipe.name)}</h1>
      </div>
      ${tags || meta ? `
        <div class="recipe-info">
          ${tags ? `<div class="recipe-tags">${tags}</div>` : ""}
          ${meta ? `<div class="recipe-meta">${meta}</div>` : ""}
        </div>
      ` : ""}
      <div class="recipe-split">
        <section class="recipe-pane">
          <h2 class="recipe-pane__title">Ingredients</h2>
          ${ingredients}
        </section>
        <section class="recipe-pane">
          <h2 class="recipe-pane__title">Instructions</h2>
          <ol>${instructions}</ol>
        </section>
      </div>
      ${notes}
    </div>
  `;
}

function ingredientsHtml(ingredients) {
  if (!ingredients || ingredients.length === 0) return "<ul></ul>";

  const isGrouped = typeof ingredients[0] === "object";
  // Flat index (across groups) so instruction refs can point at a stable
  // ingredient position regardless of section grouping.
  let index = 0;

  if (!isGrouped) {
    const items = ingredients.map((item) => ingredientItemHtml(item, index++)).join("");
    return `<ul>${items}</ul>`;
  }

  return ingredients
    .map((group) => {
      const heading = group.section ? `<h3 class="ingredient-section">${escapeHtml(group.section)}</h3>` : "";
      const items = (group.items || []).map((item) => ingredientItemHtml(item, index++)).join("");
      return `${heading}<ul>${items}</ul>`;
    })
    .join("");
}

function ingredientItemHtml(item, index) {
  return `
    <li data-ingredient-index="${index}">
      <label class="ingredient-item">
        <input type="checkbox" class="ingredient-item__checkbox" />
        <span class="ingredient-item__text">${escapeHtml(item)}</span>
      </label>
    </li>
  `;
}

// Wraps the first mention of each ingredientRefs phrase (case-insensitive,
// in reading order across all steps) in a tappable/hoverable span. The span
// only carries the referenced ingredients' flat indices — the ingredient
// tooltip reads the actual text live from the rendered ingredient list,
// so there's no separate copy of the text to keep in sync.
function instructionsHtml(steps, refs) {
  const used = new Set();

  return (steps || [])
    .map((step) => {
      let segments = [{ text: step, isMatch: false }];

      for (const ref of refs || []) {
        if (used.has(ref)) continue;
        const segmentIndex = segments.findIndex(
          (seg) => !seg.isMatch && seg.text.toLowerCase().includes(ref.phrase.toLowerCase())
        );
        if (segmentIndex === -1) continue;

        const segment = segments[segmentIndex];
        const lower = segment.text.toLowerCase();
        const start = lower.indexOf(ref.phrase.toLowerCase());
        const end = start + ref.phrase.length;

        const before = segment.text.slice(0, start);
        const match = segment.text.slice(start, end);
        const after = segment.text.slice(end);

        const replacement = [];
        if (before) replacement.push({ text: before, isMatch: false });
        replacement.push({ text: match, isMatch: true, ref });
        if (after) replacement.push({ text: after, isMatch: false });

        segments.splice(segmentIndex, 1, ...replacement);
        used.add(ref);
      }

      const html = segments
        .map((segment) => {
          if (!segment.isMatch) return escapeHtml(segment.text);
          const indices = segment.ref.ingredients.join(",");
          return `<span class="ingredient-ref" tabindex="0" role="button" data-ingredients="${indices}">${escapeHtml(segment.text)}</span>`;
        })
        .join("");

      return `<li>${html}</li>`;
    })
    .join("");
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value ?? "";
  return div.innerHTML;
}
