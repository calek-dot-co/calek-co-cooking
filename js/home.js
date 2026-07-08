async function loadRecipes() {
  const grid = document.getElementById("recipe-grid");
  try {
    const res = await fetch("recipes/index.json");
    const recipes = await res.json();
    grid.innerHTML = recipes.map(recipeCardHtml).join("");
  } catch (err) {
    grid.innerHTML = "<li>Couldn't load recipes.</li>";
    console.error(err);
  }
}

function recipeCardHtml(recipe) {
  const tags = (recipe.tags || [])
    .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`)
    .join("");

  return `
    <li>
      <a class="recipe-card" href="recipe.html?slug=${encodeURIComponent(recipe.slug)}">
        <img class="recipe-card__image" src="${escapeHtml(recipe.image)}" alt="${escapeHtml(recipe.name)}" />
        <div class="recipe-card__body">
          <div class="recipe-card__name">${escapeHtml(recipe.name)}</div>
          <div class="recipe-card__tags">${tags}</div>
        </div>
      </a>
    </li>
  `;
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value ?? "";
  return div.innerHTML;
}

loadRecipes();
