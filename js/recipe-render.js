function recipeHtml(recipe) {
  const tags = (recipe.tags || [])
    .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`)
    .join("");

  const meta = [recipe.servings && `${escapeHtml(recipe.servings)} servings`, recipe.time && escapeHtml(recipe.time)]
    .filter(Boolean)
    .join(" &middot; ");

  const ingredients = ingredientsHtml(recipe.ingredients);

  const instructions = (recipe.instructions || [])
    .map((step) => `<li>${escapeHtml(step)}</li>`)
    .join("");

  const notes = recipe.notes
    ? `<div class="recipe-notes">
         <div class="recipe-notes__title">Notes</div>
         <p>${escapeHtml(recipe.notes)}</p>
       </div>`
    : "";

  return `
    <div class="recipe-body">
      ${recipe.image ? `<img class="recipe-photo" src="${escapeHtml(recipe.image)}" alt="${escapeHtml(recipe.name)}" />` : ""}
      <h1 class="recipe-title">${escapeHtml(recipe.name)}</h1>
      <div class="recipe-meta-row">
        <div class="recipe-tags">${tags}</div>
        ${meta ? `<span class="recipe-meta">${meta}</span>` : ""}
      </div>
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
  if (!isGrouped) {
    const items = ingredients.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
    return `<ul>${items}</ul>`;
  }

  return ingredients
    .map((group) => {
      const heading = group.section ? `<h3 class="ingredient-section">${escapeHtml(group.section)}</h3>` : "";
      const items = (group.items || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
      return `${heading}<ul>${items}</ul>`;
    })
    .join("");
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value ?? "";
  return div.innerHTML;
}
