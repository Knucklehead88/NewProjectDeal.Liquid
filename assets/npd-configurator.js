(function () {

  const root = document.querySelector('[data-npd-configurator]');
  if (!root) return;

  const productForm = document.querySelector('form[action*="/cart/add"]');
  const addToCartBtn = productForm?.querySelector('[type="submit"]');

  if (!productForm || !addToCartBtn) return;

  function ensurePropertyInput(name) {
    let input = productForm.querySelector(`input[name="${CSS.escape(name)}"]`);
    if (!input) {
      input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      productForm.appendChild(input);
    }
    return input;
  }

  function validateSelections() {
    const rows = root.querySelectorAll('.npd-row');
    let allSelected = true;

    rows.forEach(row => {
      if (!row.querySelector('.npd-option.selected')) {
        allSelected = false;
      }
    });

    addToCartBtn.disabled = !allSelected;
    addToCartBtn.style.opacity = allSelected ? "1" : "0.5";
  }

  addToCartBtn.disabled = true;
  addToCartBtn.style.opacity = "0.5";

  // Selection / deselection
root.addEventListener('click', function (e) {

  const btn = e.target.closest('.npd-option');
  if (!btn) return;

  const row = btn.closest('.npd-row');
  const category = btn.dataset.category;
  const value = btn.dataset.value;

  const inputName = `properties[${category}]`;
  const input = ensurePropertyInput(inputName);

  // SELECT / DESELECT
  if (btn.classList.contains('selected')) {
    btn.classList.remove('selected');
    input.value = "";
    validateSelections();
    return;
  }

  row.querySelectorAll('.npd-option').forEach(o => o.classList.remove('selected'));
  btn.classList.add('selected');
  input.value = value;

  validateSelections();

// ===== IMAGE SWAP (Stable Override Method) =====

const optionImage = btn.querySelector('img');
if (!optionImage) return;

const newSrc = optionImage.src.replace(/width=\d+/, 'width=1600');

// Find product media container
const mediaContainer = document.querySelector('.product-media');
if (!mediaContainer) return;

// Check if preview image already exists
let preview = mediaContainer.querySelector('.npd-preview-image');

if (!preview) {
  preview = document.createElement('img');
  preview.className = 'npd-preview-image';
  preview.style.position = 'absolute';
  preview.style.top = '0';
  preview.style.left = '0';
  preview.style.width = '100%';
  preview.style.height = '100%';
  preview.style.objectFit = 'contain';
  preview.style.background = 'white';
  preview.style.zIndex = '5';

  mediaContainer.style.position = 'relative';
  mediaContainer.appendChild(preview);
}

preview.src = newSrc;


});


// CAROUSEL (scroll-based, mobile-safe)
root.querySelectorAll('.npd-carousel').forEach((carousel) => {
  const wrapper = carousel.querySelector('.npd-track-wrapper');
  const prev = carousel.querySelector('.npd-prev');
  const next = carousel.querySelector('.npd-next');

  if (!wrapper || !prev || !next) return;

  function updateArrows() {
    const maxScrollLeft = wrapper.scrollWidth - wrapper.clientWidth;

    // If there's nothing to scroll, hide arrows
    if (maxScrollLeft <= 2) {
      prev.style.display = "none";
      next.style.display = "none";
      return;
    }

    prev.style.display = "flex";
    next.style.display = "flex";

    // Optional: disable at ends
    prev.disabled = wrapper.scrollLeft <= 2;
    next.disabled = wrapper.scrollLeft >= maxScrollLeft - 2;
    prev.style.opacity = prev.disabled ? "0.4" : "1";
    next.style.opacity = next.disabled ? "0.4" : "1";
  }

  function scrollByAmount(dir) {
    // Scroll ~80% of visible width each click
    const amt = Math.max(120, Math.floor(wrapper.clientWidth * 0.8));
    wrapper.scrollBy({ left: dir * amt, behavior: "smooth" });
  }

  prev.addEventListener("click", () => scrollByAmount(-1));
  next.addEventListener("click", () => scrollByAmount(1));

  // Keep arrows correct as user taps arrows or swipes
  wrapper.addEventListener("scroll", updateArrows, { passive: true });
  window.addEventListener("resize", updateArrows);

  // Run after layout settles (Horizon hydration)
  requestAnimationFrame(updateArrows);
  window.addEventListener("load", updateArrows);
});

})();
