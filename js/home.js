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
      <a class="recipe-link" href="recipe.html?slug=${encodeURIComponent(recipe.slug)}" data-slug="${escapeHtml(recipe.slug)}">${escapeHtml(recipe.name)}</a>
    </li>
  `;
}

const recipeModal = document.getElementById("recipe-modal");
const modalContent = document.getElementById("modal-content");

async function openRecipeModal(slug) {
  modalContent.innerHTML = "Loading&hellip;";
  recipeModal.hidden = false;
  document.body.classList.add("modal-open");

  try {
    const res = await fetch(`recipes/${encodeURIComponent(slug)}.json`);
    if (!res.ok) throw new Error(`Recipe "${slug}" not found`);
    const recipe = await res.json();
    modalContent.innerHTML = recipeHtml(recipe);
    fitSplitToViewport();
  } catch (err) {
    modalContent.innerHTML = "<p>Couldn't load this recipe.</p>";
    console.error(err);
  }
}

function closeRecipeModal() {
  recipeModal.hidden = true;
  document.body.classList.remove("modal-open");
  modalContent.innerHTML = "";
}

document.getElementById("recipe-grid").addEventListener("click", (event) => {
  const link = event.target.closest(".recipe-link");
  if (!link) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
  event.preventDefault();
  openRecipeModal(link.dataset.slug);
});

recipeModal.addEventListener("click", (event) => {
  if (event.target.closest("[data-close]")) closeRecipeModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !recipeModal.hidden) closeRecipeModal();
});

loadRecipes();
