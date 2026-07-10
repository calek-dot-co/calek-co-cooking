let ingredientTooltip = null;
let ingredientTooltipTrigger = null;

function ensureIngredientTooltip() {
  if (ingredientTooltip) return ingredientTooltip;
  ingredientTooltip = document.createElement("div");
  ingredientTooltip.className = "ingredient-tooltip";
  ingredientTooltip.id = "ingredient-tooltip";
  ingredientTooltip.setAttribute("role", "tooltip");
  ingredientTooltip.hidden = true;
  document.body.appendChild(ingredientTooltip);
  return ingredientTooltip;
}

function showIngredientTooltip(trigger, container) {
  const indices = trigger.dataset.ingredients.split(",");
  const lines = indices
    .map((i) => container.querySelector(`[data-ingredient-index="${i}"] .ingredient-item__text`))
    .filter(Boolean)
    .map((el) => el.textContent);
  if (lines.length === 0) return;

  const tooltip = ensureIngredientTooltip();
  tooltip.innerHTML = lines.map((line) => `<div>${line}</div>`).join("");
  tooltip.hidden = false;
  ingredientTooltipTrigger = trigger;
  trigger.setAttribute("aria-describedby", "ingredient-tooltip");

  const triggerRect = trigger.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  const gap = 10;

  let left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
  left = Math.max(8, Math.min(left, window.innerWidth - tooltipRect.width - 8));

  let top = triggerRect.top - tooltipRect.height - gap;
  const below = top < 8;
  tooltip.classList.toggle("ingredient-tooltip--below", below);
  if (below) top = triggerRect.bottom + gap;

  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
  tooltip.style.setProperty("--arrow-offset", `${triggerRect.left + triggerRect.width / 2 - left}px`);
}

function hideIngredientTooltip() {
  if (!ingredientTooltip) return;
  ingredientTooltip.hidden = true;
  ingredientTooltipTrigger?.removeAttribute("aria-describedby");
  ingredientTooltipTrigger = null;
}

function initIngredientRefs(container) {
  container.querySelectorAll(".ingredient-ref").forEach((trigger) => {
    trigger.addEventListener("mouseenter", () => showIngredientTooltip(trigger, container));
    trigger.addEventListener("mouseleave", hideIngredientTooltip);
    trigger.addEventListener("focus", () => showIngredientTooltip(trigger, container));
    trigger.addEventListener("blur", hideIngredientTooltip);
    trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      if (ingredientTooltipTrigger === trigger) {
        hideIngredientTooltip();
      } else {
        showIngredientTooltip(trigger, container);
      }
    });
  });
}

document.addEventListener("click", hideIngredientTooltip);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") hideIngredientTooltip();
});
