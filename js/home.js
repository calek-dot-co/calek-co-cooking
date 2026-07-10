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
        <span class="recipe-row__name">${nameWithBreak(recipe.name)}</span>
        ${thumb}
      </a>
    </li>
  `;
}

// Mobile splits the name after the first word (manual <br>, hidden again
// on desktop) to match the two-line mockup; desktop just reads the space.
function nameWithBreak(name) {
  const parts = name.trim().split(/\s+/);
  if (parts.length < 2) return escapeHtml(name);
  const first = escapeHtml(parts[0]);
  const rest = escapeHtml(parts.slice(1).join(" "));
  return `${first}<br class="recipe-row__break"> ${rest}`;
}

const recipeModal = document.getElementById("recipe-modal");
const modalContent = document.getElementById("modal-content");
const modalClose = document.querySelector(".modal__close");
let modalTrigger = null;
let modalScrollY = 0;

async function openRecipeModal(slug) {
  modalTrigger = document.activeElement;
  modalContent.innerHTML = "Loading&hellip;";
  recipeModal.hidden = false;

  // body.modal-open is position:fixed (see base.css) — overflow:hidden alone
  // doesn't stop iOS Safari from scrolling/rubber-banding the body behind a
  // fixed overlay. Pinning it needs an explicit top offset to avoid jumping
  // to the page's scroll origin, then scrollTo restores it on close.
  modalScrollY = window.scrollY;
  document.body.style.top = `-${modalScrollY}px`;
  document.body.classList.add("modal-open");
  modalClose.focus();

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
  document.body.style.top = "";
  window.scrollTo(0, modalScrollY);
  modalContent.innerHTML = "";
  modalTrigger?.focus();
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
