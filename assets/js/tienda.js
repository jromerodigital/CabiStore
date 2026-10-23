/**
 * CABI STORE — LÓGICA DE TIENDA Y FILTRADO AVANZADO (tienda.js)
 * Inspirado en Shopify Collections (Covers Store) & AJAX Faceted Navigation (USAMS)
 * Puro Vanilla JavaScript - reactivo, ultra rápido y sin dependencias.
 */

const TiendaState = {
  category: "all",
  search: "",
  priceMax: 350,
  inStockOnly: false,
  bestSellerOnly: false,
  sortBy: "bestselling",
  viewMode: "grid" // "grid" o "list"
};

document.addEventListener("DOMContentLoaded", () => {
  initTiendaURLParams();
  setupTiendaEventListeners();
  renderTiendaQuickCategories();
  renderTiendaFiltersCount();
  applyTiendaFilters();
});

// 1. Leer parámetros de URL (?categoria=audio, ?buscar=pistola, etc.)
function initTiendaURLParams() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("categoria")) {
    TiendaState.category = urlParams.get("categoria");
  }
  if (urlParams.has("buscar")) {
    TiendaState.search = urlParams.get("buscar");
    const input = document.getElementById("tienda-search-input");
    if (input) input.value = TiendaState.search;
  }
  if (urlParams.has("orden")) {
    TiendaState.sortBy = urlParams.get("orden");
    const sortSelect = document.getElementById("tienda-sort-select");
    if (sortSelect) sortSelect.value = TiendaState.sortBy;
  }
}

// 2. Renderizar Píldoras Rápidas de Categoría en el Hero
function renderTiendaQuickCategories() {
  const container = document.getElementById("tienda-quick-cats");
  if (!container) return;

  const cats = [
    { id: "all", name: "Todos los productos", emoji: "🛍️" },
    { id: "smartwatch", name: "Smartwatches", emoji: "⌚" },
    { id: "audio", name: "Audio & Música", emoji: "🎧" },
    { id: "masajeadores", name: "Masajeadores", emoji: "💆" },
    { id: "smarthome", name: "Smart Home", emoji: "🏡" },
    { id: "cargadores", name: "Cargadores & Hubs", emoji: "⚡" }
  ];

  container.innerHTML = cats.map(c => `
    <button type="button" class="tienda-quick-cat-pill ${TiendaState.category === c.id ? 'active' : ''}" onclick="setTiendaCategory('${c.id}')">
      <span>${c.emoji}</span>
      <span>${c.name}</span>
    </button>
  `).join("");
}

// 3. Renderizar Contadores Dinámicos en la barra lateral
function renderTiendaFiltersCount() {
  const countAll = PRODUCTS.length;
  const setElText = (id, txt) => {
    const el = document.getElementById(id);
    if (el) el.textContent = txt;
  };

  setElText("count-cat-all", countAll);
  setElText("count-cat-smartwatch", PRODUCTS.filter(p => p.category === "smartwatch").length);
  setElText("count-cat-audio", PRODUCTS.filter(p => p.category === "audio").length);
  setElText("count-cat-masajeadores", PRODUCTS.filter(p => p.category === "masajeadores").length);
  setElText("count-cat-smarthome", PRODUCTS.filter(p => p.category === "smarthome").length);
  setElText("count-cat-cargadores", PRODUCTS.filter(p => p.category === "cargadores").length);

  setElText("count-stock", PRODUCTS.filter(p => !p.isSoldOut).length);
  setElText("count-bestsellers", PRODUCTS.filter(p => p.isBestSeller).length);

  // Sincronizar radio buttons
  document.querySelectorAll("input[name='tienda-cat']").forEach(radio => {
    radio.checked = radio.value === TiendaState.category;
  });
}

// 4. Configurar Listeners
function setupTiendaEventListeners() {
  // Input de búsqueda
  const searchInput = document.getElementById("tienda-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      TiendaState.search = e.target.value.trim().toLowerCase();
      applyTiendaFilters();
    });
  }

  // Slider de precio
  const priceSlider = document.getElementById("tienda-price-slider");
  const priceMaxVal = document.getElementById("tienda-price-max-val");
  if (priceSlider) {
    priceSlider.addEventListener("input", (e) => {
      TiendaState.priceMax = Number(e.target.value);
      if (priceMaxVal) priceMaxVal.textContent = `S/. ${TiendaState.priceMax}`;
      applyTiendaFilters();
    });
  }

  // Selector de orden
  const sortSelect = document.getElementById("tienda-sort-select");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      TiendaState.sortBy = e.target.value;
      applyTiendaFilters();
    });
  }
}

// 5. Aplicar Filtros y Actualizar Grid
function applyTiendaFilters() {
  let list = [...PRODUCTS];

  // Filtro Categoría
  if (TiendaState.category && TiendaState.category !== "all") {
    list = list.filter(p => p.category === TiendaState.category);
  }

  // Filtro Búsqueda
  if (TiendaState.search) {
    list = list.filter(p => 
      p.title.toLowerCase().includes(TiendaState.search) ||
      (p.brand && p.brand.toLowerCase().includes(TiendaState.search)) ||
      (p.description && p.description.toLowerCase().includes(TiendaState.search))
    );
  }

  // Filtro Precio Máximo
  if (TiendaState.priceMax < 350) {
    list = list.filter(p => p.price <= TiendaState.priceMax);
  }

  // Filtro Stock
  if (TiendaState.inStockOnly) {
    list = list.filter(p => !p.isSoldOut);
  }

  // Filtro Más Vendidos
  if (TiendaState.bestSellerOnly) {
    list = list.filter(p => p.isBestSeller);
  }

  // Ordenamiento
  switch (TiendaState.sortBy) {
    case "price-asc":
      list.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      list.sort((a, b) => b.price - a.price);
      break;
    case "discount-desc":
      list.sort((a, b) => {
        const discA = ((a.oldPrice - a.price) / a.oldPrice);
        const discB = ((b.oldPrice - b.price) / b.oldPrice);
        return discB - discA;
      });
      break;
    case "rating-desc":
      list.sort((a, b) => b.rating - a.rating);
      break;
    case "newest":
      list.sort((a, b) => new Date(b.releasedAt || 0) - new Date(a.releasedAt || 0));
      break;
    case "bestselling":
    default:
      list.sort((a, b) => (b.ordersCount || 0) - (a.ordersCount || 0));
      break;
  }

  renderTiendaGrid(list);
  renderTiendaActiveTags();
  renderTiendaQuickCategories();

  // Actualizar etiqueta de resultados
  const countLabel = document.getElementById("tienda-results-count");
  if (countLabel) {
    countLabel.innerHTML = `Mostrando <strong>${list.length}</strong> de <strong>${PRODUCTS.length}</strong> productos`;
  }
}

// 6. Renderizar Grid o Lista
function renderTiendaGrid(list) {
  const container = document.getElementById("tienda-products-container");
  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = `
      <div class="catalog-empty-box" style="grid-column: 1 / -1; padding: 48px 20px; text-align: center; background: #ffffff; border-radius: 16px; border: 1px dashed #cbd5e1;">
        <div style="font-size: 2.5rem; margin-bottom: 12px;">🔍</div>
        <h3 style="font-size: 1.2rem; font-weight: 800; color: #0f2c3d; margin-bottom: 6px;">No se encontraron productos con estos filtros</h3>
        <p style="color: #64748b; font-size: 0.92rem; margin-bottom: 18px; max-width: 440px; margin-inline: auto;">
          Intenta ajustando el rango de precios o eliminando algunos filtros aplicados para ver más opciones disponibles.
        </p>
        <button type="button" class="btn-load-all-products" onclick="resetAllTiendaFilters()">Limpiar Filtros y Ver Todo</button>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(product => {
    const discountPct = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);

    return `
      <article class="product-card" onclick="openPDP('${product.id}')" aria-label="${product.title}">
        <div class="product-card-media">
          <span class="product-card-badge-pill ${product.isSoldOut ? 'sold-out' : ''}">
            ${product.isSoldOut ? 'Agotado' : `-${discountPct}%`}
          </span>
          <button type="button" class="product-wishlist-btn" onclick="event.stopPropagation(); toggleWishlist(this, '${product.id}')" aria-label="Favorito" title="Guardar en favoritos">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
          <img src="${product.images[0]}" alt="${product.title}" class="product-card-img" loading="lazy" decoding="async">
        </div>
        <div class="product-card-info">
          <span class="product-card-brand">${product.brand}</span>
          <h3 class="product-card-title">${product.title}</h3>
          <div class="product-card-rating">
            <span class="stars-gold">★★★★★</span>
            <span class="rating-num">(${product.reviewsCount})</span>
          </div>
          <div class="product-card-pricing">
            <span class="price-sale">S/. ${product.price.toFixed(2)}</span>
            <span class="price-regular">S/. ${product.oldPrice.toFixed(2)}</span>
          </div>
          <div class="product-card-actions">
            <button type="button" class="btn-card-add-cart-technova" id="btn-add-${product.id}" onclick="event.stopPropagation(); handleAddToCart('${product.id}')" title="Agregar al carrito de compras">
              <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
              <span>${product.isSoldOut ? 'Agotado' : 'Añadir al carrito'}</span>
            </button>
            <button type="button" class="btn-card-cod-fast" onclick="event.stopPropagation(); openCODDirect('${product.id}')" title="Comprar contra entrega al instante">
              <span>⚡ Pide hoy y paga en casa</span>
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

// 7. Renderizar Etiquetas de Filtros Activos (Pills con botón X)
function renderTiendaActiveTags() {
  const container = document.getElementById("tienda-active-tags");
  if (!container) return;

  const tags = [];

  if (TiendaState.category && TiendaState.category !== "all") {
    const catNames = {
      smartwatch: "Smartwatches",
      audio: "Audio & Música",
      masajeadores: "Masajeadores",
      smarthome: "Smart Home",
      cargadores: "Cargadores & Hubs"
    };
    tags.push({
      label: `Categoría: ${catNames[TiendaState.category] || TiendaState.category}`,
      onRemove: () => setTiendaCategory('all')
    });
  }

  if (TiendaState.search) {
    tags.push({
      label: `Búsqueda: "${TiendaState.search}"`,
      onRemove: () => {
        TiendaState.search = "";
        const input = document.getElementById("tienda-search-input");
        if (input) input.value = "";
        applyTiendaFilters();
      }
    });
  }

  if (TiendaState.priceMax < 350) {
    tags.push({
      label: `Hasta S/. ${TiendaState.priceMax}`,
      onRemove: () => {
        TiendaState.priceMax = 350;
        const slider = document.getElementById("tienda-price-slider");
        if (slider) slider.value = 350;
        const priceMaxVal = document.getElementById("tienda-price-max-val");
        if (priceMaxVal) priceMaxVal.textContent = "S/. 350";
        applyTiendaFilters();
      }
    });
  }

  if (TiendaState.inStockOnly) {
    tags.push({
      label: "En stock inmediato",
      onRemove: () => {
        TiendaState.inStockOnly = false;
        const cb = document.getElementById("cb-in-stock");
        if (cb) cb.checked = false;
        applyTiendaFilters();
      }
    });
  }

  if (TiendaState.bestSellerOnly) {
    tags.push({
      label: "Más vendidos",
      onRemove: () => {
        TiendaState.bestSellerOnly = false;
        const cb = document.getElementById("cb-bestseller");
        if (cb) cb.checked = false;
        applyTiendaFilters();
      }
    });
  }

  if (tags.length === 0) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = tags.map((t, idx) => `
    <button type="button" class="active-tag-chip" onclick="removeTiendaTag(${idx})">
      <span>✕</span> ${t.label}
    </button>
  `).join("") + `
    <button type="button" class="btn-reset-filters" onclick="resetAllTiendaFilters()">Limpiar todo</button>
  `;

  window._activeTiendaTags = tags;
}

function removeTiendaTag(idx) {
  if (window._activeTiendaTags && window._activeTiendaTags[idx]) {
    window._activeTiendaTags[idx].onRemove();
  }
}

// 8. Cambiar Categoría
function setTiendaCategory(catId) {
  TiendaState.category = catId;
  const radios = document.querySelectorAll("input[name='tienda-cat']");
  radios.forEach(r => { r.checked = (r.value === catId); });
  applyTiendaFilters();
}

// 9. Cambiar Stock / Bestseller
function toggleTiendaStock(checked) {
  TiendaState.inStockOnly = checked;
  applyTiendaFilters();
}
function toggleTiendaBestSeller(checked) {
  TiendaState.bestSellerOnly = checked;
  applyTiendaFilters();
}

// 10. Switch de Vista (Grid vs List)
function setTiendaView(mode) {
  TiendaState.viewMode = mode;
  const grid = document.getElementById("tienda-products-container");
  const btnGrid = document.getElementById("btn-view-grid");
  const btnList = document.getElementById("btn-view-list");

  if (mode === "list") {
    grid.classList.add("list-mode");
    if (btnGrid) btnGrid.classList.remove("active");
    if (btnList) btnList.classList.add("active");
  } else {
    grid.classList.remove("list-mode");
    if (btnGrid) btnGrid.classList.add("active");
    if (btnList) btnList.classList.remove("active");
  }
}

// 11. Resetear todos los filtros
function resetAllTiendaFilters() {
  TiendaState.category = "all";
  TiendaState.search = "";
  TiendaState.priceMax = 350;
  TiendaState.inStockOnly = false;
  TiendaState.bestSellerOnly = false;
  TiendaState.sortBy = "bestselling";

  const searchInput = document.getElementById("tienda-search-input");
  if (searchInput) searchInput.value = "";

  const slider = document.getElementById("tienda-price-slider");
  if (slider) slider.value = 350;

  const priceMaxVal = document.getElementById("tienda-price-max-val");
  if (priceMaxVal) priceMaxVal.textContent = "S/. 350";

  const cbStock = document.getElementById("cb-in-stock");
  if (cbStock) cbStock.checked = false;

  const cbBest = document.getElementById("cb-bestseller");
  if (cbBest) cbBest.checked = false;

  const sortSelect = document.getElementById("tienda-sort-select");
  if (sortSelect) sortSelect.value = "bestselling";

  document.querySelectorAll("input[name='tienda-cat']").forEach(r => {
    r.checked = (r.value === "all");
  });

  applyTiendaFilters();
}

// 12. Drawer de Filtros en Mobile
function toggleMobileFilterDrawer(show) {
  const drawer = document.getElementById("mobile-filter-drawer");
  if (drawer) {
    drawer.classList.toggle("active", show);
    document.body.style.overflow = show ? "hidden" : "";
  }
}
