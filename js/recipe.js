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
  } catch (err) {
    content.innerHTML = "<p>Couldn't load this recipe.</p>";
    console.error(err);
  }
}

loadRecipe();
