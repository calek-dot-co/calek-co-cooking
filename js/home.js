async function loadRecipes() {
  const grid = document.getElementById("recipe-grid");
  try {
    const res = await fetch("recipes/index.json");
    const recipes = await res.json();
    grid.innerHTML = recipes.map(recipeRowHtml).join("");
  } catch (err) {
    grid.innerHTML = "<li>Couldn't load recipes.</li>";
    console.error(err);
  }
}

function recipeRowHtml(recipe) {
  const thumb = recipe.image
    ? `<span class="recipe-row__thumb" style="--rotate: ${randomRotation()}deg">
         <img src="${escapeHtml(recipe.image)}" alt="" />
       </span>`
    : "";

  return `
    <li>
      <a class="recipe-row" href="recipe.html?slug=${encodeURIComponent(recipe.slug)}" data-slug="${escapeHtml(recipe.slug)}">
        <span class="recipe-row__name">${escapeHtml(recipe.name)}</span>
        ${thumb}
      </a>
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
  const row = event.target.closest(".recipe-row");
  if (!row) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
  event.preventDefault();
  openRecipeModal(row.dataset.slug);
});

recipeModal.addEventListener("click", (event) => {
  // matches (not closest) — .modal__scroll has data-close and wraps the
  // panel, so closest() would also match clicks bubbling up from inside
  // the panel content. Only close on a direct hit: the scroll container's
  // own background, or the close button itself.
  if (event.target.matches("[data-close]")) closeRecipeModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !recipeModal.hidden) closeRecipeModal();
});

loadRecipes();
