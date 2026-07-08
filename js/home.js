async function loadRecipes() {
  const grid = document.getElementById("recipe-grid");
  try {
    const res = await fetch("recipes/index.json");
    const recipes = await res.json();
    grid.innerHTML = recipes.map(recipeLinkHtml).join("");
  } catch (err) {
    grid.innerHTML = "<li>Couldn't load recipes.</li>";
    console.error(err);
  }
}

function recipeLinkHtml(recipe) {
  return `
    <li>
      <a class="recipe-link" href="recipe.html?slug=${encodeURIComponent(recipe.slug)}">${escapeHtml(recipe.name)}</a>
    </li>
  `;
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value ?? "";
  return div.innerHTML;
}

loadRecipes();
