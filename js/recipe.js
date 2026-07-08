async function loadRecipe() {
  const content = document.getElementById("recipe-content");
  const slug = new URLSearchParams(window.location.search).get("slug");

  if (!slug) {
    content.innerHTML = "<p>No recipe specified.</p>";
    return;
  }

  try {
    const res = await fetch(`recipes/${encodeURIComponent(slug)}.json`);
    if (!res.ok) throw new Error(`Recipe "${slug}" not found`);
    const recipe = await res.json();
    document.title = `${recipe.name} — Cooking`;
    content.innerHTML = recipeHtml(recipe);
    fitSplitToViewport();
  } catch (err) {
    content.innerHTML = "<p>Couldn't load this recipe.</p>";
    console.error(err);
  }
}

const MOBILE_BREAKPOINT = 768;

function fitSplitToViewport() {
  const split = document.querySelector(".recipe-split");
  if (!split) return;

  if (window.innerWidth >= MOBILE_BREAKPOINT) {
    split.style.height = "";
    return;
  }

  const top = split.getBoundingClientRect().top;
  split.style.height = `calc(100dvh - ${top}px)`;
}

window.addEventListener("resize", fitSplitToViewport);

function recipeHtml(recipe) {
  const tags = (recipe.tags || [])
    .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`)
    .join("");

  const meta = [recipe.servings && `${escapeHtml(recipe.servings)} servings`, recipe.time && escapeHtml(recipe.time)]
    .filter(Boolean)
    .join(" &middot; ");

  const ingredients = (recipe.ingredients || [])
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");

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
    ${recipe.image ? `<img class="recipe-photo" src="${escapeHtml(recipe.image)}" alt="${escapeHtml(recipe.name)}" />` : ""}
    <h1 class="recipe-title">${escapeHtml(recipe.name)}</h1>
    <div class="recipe-meta-row">
      <div class="recipe-tags">${tags}</div>
      ${meta ? `<span class="recipe-meta">${meta}</span>` : ""}
    </div>
    <div class="recipe-split">
      <section class="recipe-pane">
        <h2 class="recipe-pane__title">Ingredients</h2>
        <ul>${ingredients}</ul>
      </section>
      <section class="recipe-pane">
        <h2 class="recipe-pane__title">Instructions</h2>
        <ol>${instructions}</ol>
      </section>
    </div>
    ${notes}
  `;
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value ?? "";
  return div.innerHTML;
}

loadRecipe();
