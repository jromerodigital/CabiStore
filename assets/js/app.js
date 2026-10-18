/**
 * VITACORE PERÚ - High-Conversion E-Commerce Architecture
 * Exact UI/UX & Flow inspired by The Boost Perú (Shopify Studio / Dawn)
 * Pure Vanilla JavaScript - Ultra-responsive, zero bloat, mobile-first.
 */

const CONFIG = {
  storeName: "VITACORE Perú",
  whatsappNumber: "51953833260",
  freeShippingThreshold: 200,
  currency: "S/."
};

// ==========================================================================
// 1. PRODUCT CATALOG (Clean, Real E-Commerce Items)
// ==========================================================================
const PRODUCTS = [
  {
    id: "pistola-masaje-promax",
    title: "Pistola de Masaje Percusión VITACORE Pro Max + 6 Cabezales de regalo 🎁",
    brand: "VITACORE Pro Therapy",
    category: "masajeadores",
    price: 169.00,
    oldPrice: 289.00,
    bundlePrice: 319.00, // 2 units
    savings: 19.00,
    rating: 4.9,
    reviewsCount: 384,
    ordersCount: 920,
    releasedAt: "2026-10-12",
    isBestSeller: true,
    isNew: false,
    badge: "Oferta",
    isSoldOut: false,
    stockLeft: 2,
    images: [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=700&q=80"
    ],
    description: "Elimina contracturas musculares profundas, fatiga lumbar y tensión del cuello en solo 30 segundos. Motor Brushless ultra silencioso con 30 niveles de potencia.",
    features: [
      "30 Niveles de velocidad regulables",
      "6 Cabezales intercambiables de grado ergonómico",
      "Motor silencioso WhisperDrive (<45dB)",
      "Batería de larga duración hasta 8 horas continuas"
    ]
  },
  {
    id: "masajeador-manos-terapia",
    title: "Masajeador de manos + Muñequera de compresión de regalo 🎁",
    brand: "VITACORE Pro Therapy",
    category: "masajeadores",
    price: 179.00,
    oldPrice: 359.00,
    bundlePrice: 339.00,
    savings: 19.00,
    rating: 5.0,
    reviewsCount: 218,
    ordersCount: 640,
    releasedAt: "2026-10-05",
    isBestSeller: true,
    isNew: false,
    badge: "Oferta",
    isSoldOut: false,
    stockLeft: 3,
    images: [
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=700&q=80"
    ],
    description: "Alivia el dolor del túnel carpiano, artritis y rigidez muscular en los dedos y muñecas con terapia de calor y acupresión inteligente 360°.",
    features: [
      "3 Modos y 5 niveles de intensidad ajustables",
      "3 Niveles de calor terapéutico relajante",
      "Temporizador inteligente de apagado automático",
      "Incluye muñequera de compresión elástica de regalo"
    ]
  },
  {
    id: "masajeador-cervical-4d",
    title: "Masajeador Cervical Térmico 4D Shiatsu para Cuello y Espalda",
    brand: "VITACORE Pro Therapy",
    category: "masajeadores",
    price: 139.00,
    oldPrice: 249.00,
    bundlePrice: 259.00,
    savings: 19.00,
    rating: 4.8,
    reviewsCount: 165,
    ordersCount: 510,
    releasedAt: "2026-09-20",
    isBestSeller: false,
    isNew: false,
    badge: "Oferta",
    isSoldOut: false,
    stockLeft: 4,
    images: [
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=700&q=80"
    ],
    description: "Diseño anatómico con 8 nodos bidireccionales y calefacción infrarroja que disuelven los nudos musculares del cuello, hombros y zona lumbar.",
    features: [
      "8 Rodillos 4D bidireccionales con rotación automática",
      "Termoterapia relajante a temperatura constante",
      "Correas de agarre ajustables para brazos",
      "Adaptador para casa (220V) y para vehículo (12V) incluido"
    ]
  },
  {
    id: "masajeador-ojos-presion",
    title: "Masajeador de ojos inteligente con termoterapia y música Bluetooth",
    brand: "VITACORE Sleep & Care",
    category: "bienestar",
    price: 139.00,
    oldPrice: 279.00,
    bundlePrice: 259.00,
    savings: 19.00,
    rating: 4.9,
    reviewsCount: 142,
    ordersCount: 430,
    releasedAt: "2026-10-14",
    isBestSeller: false,
    isNew: true,
    badge: "Oferta",
    isSoldOut: false,
    stockLeft: 2,
    images: [
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=700&q=80"
    ],
    description: "Compresión de aire multidimensional que alivia migrañas, fatiga ocular provocada por pantallas y ayuda a conciliar el sueño profundo.",
    features: [
      "Presoterapia de aire con micro-vibración",
      "Compresas calientes a 42°C para reducir ojeras",
      "Conexión Bluetooth para reproducir música relajante",
      "Plegable a 180° y ultraligero para viajes"
    ]
  },
  {
    id: "dilatador-nasal-magnetico",
    title: "Dilatador nasal magnético ergonómico anti-ronquidos (Pack x 2)",
    brand: "VITACORE Sleep & Care",
    category: "accesorios",
    price: 79.00,
    oldPrice: 159.00,
    bundlePrice: 145.00,
    savings: 13.00,
    rating: 4.7,
    reviewsCount: 95,
    ordersCount: 310,
    releasedAt: "2026-08-15",
    isBestSeller: false,
    isNew: false,
    badge: "Oferta",
    isSoldOut: false,
    stockLeft: 5,
    images: [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=700&q=80"
    ],
    description: "Maximiza el flujo de aire al dormir o entrenar. Abre las fosas nasales instantáneamente y reduce los ronquidos nocturnos de forma segura.",
    features: [
      "Imanes terapéuticos de grado médico",
      "Silicona ultra suave hipoalergénica",
      "Reutilizable y de fácil lavado",
      "Estuche protector higiénico incluido"
    ]
  },
  {
    id: "smartwatch-ultra-amoled",
    title: "Smartwatch VITACORE Ultra Amoled + Correa deportiva extra de regalo ⌚",
    brand: "VITACORE SmartTech",
    category: "smartwatch",
    price: 189.00,
    oldPrice: 320.00,
    bundlePrice: 350.00,
    savings: 28.00,
    rating: 4.9,
    reviewsCount: 280,
    ordersCount: 815,
    releasedAt: "2026-10-15",
    isBestSeller: true,
    isNew: true,
    badge: "Oferta",
    isSoldOut: false,
    stockLeft: 3,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=700&q=80"
    ],
    description: "Pantalla AMOLED brillante siempre activa. Realiza y recibe llamadas por Bluetooth, monitorea frecuencia cardíaca 24/7 y oxígeno SpO2.",
    features: [
      "Pantalla HD AMOLED de alta resolución",
      "Altavoz y micrófono para llamadas nítidas",
      "Más de 100 modos deportivos y resistencia IP68",
      "Batería de larga duración de 7 a 10 días"
    ]
  },
  {
    id: "smartwatch-elegance-slim",
    title: "Smartwatch VITACORE Elegance Slim (Batería 10 días + 100 Modos Sport)",
    brand: "VITACORE SmartTech",
    category: "smartwatch",
    price: 149.00,
    oldPrice: 249.00,
    bundlePrice: 279.00,
    savings: 19.00,
    rating: 4.8,
    reviewsCount: 153,
    ordersCount: 460,
    releasedAt: "2026-09-10",
    isBestSeller: false,
    isNew: false,
    badge: "Oferta",
    isSoldOut: false,
    stockLeft: 6,
    images: [
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80"
    ],
    description: "Diseño ultraligero de aleación con monitoreo de sueño, contador de pasos y notificaciones de WhatsApp.",
    features: [
      "Cuerpo de aluminio aeroespacial ultra delgado",
      "Resistencia al agua para lluvia y deporte",
      "Monitoreo de frecuencia cardíaca y presión arterial",
      "Notificaciones en tiempo real en tu muñeca"
    ]
  },
  {
    id: "audifonos-pro-anc",
    title: "Audífonos Inalámbricos VITACORE SoundPro con Cancelación de Ruido",
    brand: "VITACORE SoundLab",
    category: "audio",
    price: 149.00,
    oldPrice: 260.00,
    bundlePrice: 279.00,
    savings: 19.00,
    rating: 4.8,
    reviewsCount: 189,
    ordersCount: 590,
    releasedAt: "2026-10-08",
    isBestSeller: true,
    isNew: false,
    badge: "Oferta",
    isSoldOut: false,
    stockLeft: 4,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=700&q=80"
    ],
    description: "Audio de alta fidelidad con bajos profundos y tecnología ANC activa que silencia el ruido ambiental para concentrarte en tus llamadas y música.",
    features: [
      "Cancelación de Ruido Activa Híbrida (ANC)",
      "Hasta 36 horas de autonomía con estuche de carga",
      "Controles táctiles intuitivos de volumen y asistente",
      "Baja latencia ideal para videos y videojuegos"
    ]
  },
  {
    id: "auriculares-air-sport",
    title: "Auriculares Inalámbricos Air Pro con Estuche de Carga Inalámbrica",
    brand: "VITACORE SoundLab",
    category: "audio",
    price: 119.00,
    oldPrice: 199.00,
    bundlePrice: 219.00,
    savings: 19.00,
    rating: 4.9,
    reviewsCount: 204,
    ordersCount: 615,
    releasedAt: "2026-10-16",
    isBestSeller: false,
    isNew: true,
    badge: "Oferta",
    isSoldOut: false,
    stockLeft: 5,
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80"
    ],
    description: "Ajuste ergonómico seguro para running y entrenamientos. Micrófono dual con aislamiento de voz HD.",
    features: [
      "Chip de audio Bluetooth 5.3 con enlace instantáneo",
      "Estuche magnético compacto con indicador LED",
      "Carga rápida: 15 minutos brindan 3 horas de uso",
      "Compatibilidad total con iPhone y Android"
    ]
  },
  {
    id: "parlante-smarthome-alexa",
    title: "Altavoz Inteligente Smart Home con Control de Voz & Reloj LED",
    brand: "VITACORE SmartTech",
    category: "smarthome",
    price: 139.00,
    oldPrice: 239.00,
    bundlePrice: 259.00,
    savings: 19.00,
    rating: 4.8,
    reviewsCount: 165,
    ordersCount: 495,
    releasedAt: "2026-10-11",
    isBestSeller: false,
    isNew: true,
    badge: "Oferta",
    isSoldOut: false,
    stockLeft: 3,
    images: [
      "https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=700&q=80"
    ],
    description: "Controla tu música, alarmas, luces y dispositivos inteligentes del hogar mediante comandos de voz en español.",
    features: [
      "Sonido envolvente 360° nítido y balanceado",
      "Pantalla frontal con indicador de hora y clima",
      "Conexión WiFi y Bluetooth multi-dispositivo",
      "Botón físico de privacidad para apagar micrófono"
    ]
  },
  {
    id: "difusor-ultrasonico-smart",
    title: "Difusor Aromático Ultrasónico Smart Home con Luz Ambiente y App WiFi",
    brand: "VITACORE SmartTech",
    category: "smarthome",
    price: 119.00,
    oldPrice: 199.00,
    bundlePrice: 219.00,
    savings: 19.00,
    rating: 4.7,
    reviewsCount: 124,
    ordersCount: 375,
    releasedAt: "2026-08-28",
    isBestSeller: false,
    isNew: false,
    badge: "Oferta",
    isSoldOut: false,
    stockLeft: 4,
    images: [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=700&q=80"
    ],
    description: "Humedece el aire de tu habitación y difunde aceites esenciales con temporizador programable y luces RGB relajantes.",
    features: [
      "Capacidad de 500ml para hasta 12 horas continuas",
      "Control remoto y compatibilidad con app móvil",
      "7 Colores LED seleccionables",
      "Apagado automático de seguridad cuando se acaba el agua"
    ]
  },
  {
    id: "cargador-rapido-20w-lightning",
    title: "Cargador Rápido 20W Power Delivery + Cable Reforzado 1M",
    brand: "VITACORE Power",
    category: "cargadores",
    price: 69.00,
    oldPrice: 129.00,
    bundlePrice: 119.00,
    savings: 19.00,
    rating: 4.9,
    reviewsCount: 87,
    ordersCount: 240,
    releasedAt: "2026-10-17",
    isBestSeller: true,
    isNew: true,
    badge: "Oferta",
    isSoldOut: false,
    stockLeft: 15,
    images: [
      "/assets/images/categoria-cargadores.png"
    ],
    description: "Carga de alta velocidad de 20W con protocolo Power Delivery inteligente. No recalienta tu dispositivo y protege la salud de tu batería.",
    features: [
      "Carga ultra rápida 20W USB-C PD",
      "Incluye cable reforzado anti-quiebres de 1 metro",
      "Chip inteligente con protección térmica y anti-sobrevoltaje",
      "Compatible con smartphones, tablets y accesorios"
    ]
  }
];

// ==========================================================================
// 2. STATE MANAGEMENT
// ==========================================================================
const INITIAL_VISIBLE_LIMIT = 8;

const state = {
  currentCategory: "all",
  searchQuery: "",
  selectedBrand: "all",
  selectedPriceRange: "all",
  sortBy: "bestselling",
  showAllProducts: false,
  activeProduct: PRODUCTS[0],
  activeGalleryIndex: 0,
  codUnits: 1, // 1 or 2
  appliedDiscount: 0,
  appliedCouponCode: null,
  selectedShippingPrice: 0,
  selectedShippingName: "Envío Delivery VITACORE (2-3 días)",
  isLimaCallao: true,
  cart: (() => {
    try {
      const stored = localStorage.getItem("vitacore_cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  })()
};

// ==========================================================================
// 3. INITIALIZATION
// ==========================================================================
document.addEventListener("DOMContentLoaded", async () => {
  initCart();
  renderProductsGrid();
  initCountdownTimer();
  initShippingLogic();
  initStickyBar();
  initAnnouncementCarousel();
  initHeroSlider();
  await fetchProductsFromAPI();
});

async function fetchProductsFromAPI() {
  try {
    const res = await fetch("/api/products");
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.products) && data.products.length > 0) {
        PRODUCTS.length = 0;
        PRODUCTS.push(...data.products);
        renderProductsGrid();
        const seeAllBtn = document.querySelector(".btn-see-all-top");
        if (seeAllBtn) {
          seeAllBtn.textContent = `Ver todo el catálogo (${PRODUCTS.length}) →`;
        }
      }
    }
  } catch (err) {
    console.warn("Usando catálogo local inicial:", err);
  }
}

// ==========================================================================
// 4. INTERACTIVE CATALOG ENGINE (Shopify / Retail Perú Filter & Sort)
// ==========================================================================
function getFilteredAndSortedProducts() {
  const query = state.searchQuery.toLowerCase().trim();

  const filtered = PRODUCTS.filter(product => {
    // 1. Categoría
    if (state.currentCategory !== "all") {
      if (state.currentCategory === "bienestar") {
        if (product.category !== "bienestar" && product.category !== "accesorios") return false;
      } else if (product.category !== state.currentCategory) {
        return false;
      }
    }

    // 2. Marca / Línea
    if (state.selectedBrand !== "all" && product.brand !== state.selectedBrand) {
      return false;
    }

    // 3. Rango de Precio
    if (state.selectedPriceRange === "under-140" && product.price > 140) return false;
    if (state.selectedPriceRange === "140-170" && (product.price < 140 || product.price > 170)) return false;
    if (state.selectedPriceRange === "over-170" && product.price <= 170) return false;

    // 4. Búsqueda por texto
    if (query) {
      const haystack = `${product.title} ${product.brand} ${product.category} ${product.description}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }

    return true;
  });

  // 5. Ordenamiento
  return filtered.sort((a, b) => {
    switch (state.sortBy) {
      case "bestselling":
        return (b.ordersCount || 0) - (a.ordersCount || 0);
      case "newest":
        return new Date(b.releasedAt) - new Date(a.releasedAt);
      case "oldest":
        return new Date(a.releasedAt) - new Date(b.releasedAt);
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "discount-desc": {
        const discA = (a.oldPrice - a.price) / a.oldPrice;
        const discB = (b.oldPrice - b.price) / b.oldPrice;
        return discB - discA;
      }
      default:
        return 0;
    }
  });
}

function renderProductsGrid() {
  const grid = document.getElementById("products-grid");
  if (!grid) return;

  const matched = getFilteredAndSortedProducts();
  const isFiltered =
    state.currentCategory !== "all" ||
    state.selectedBrand !== "all" ||
    state.selectedPriceRange !== "all" ||
    state.searchQuery.trim() !== "";

  const visibleList = (state.showAllProducts || isFiltered)
    ? matched
    : matched.slice(0, INITIAL_VISIBLE_LIMIT);

  // Actualizar subtítulo de estado del catálogo
  const statusEl = document.getElementById("catalog-active-filter-text");
  const sortLabels = {
    "bestselling": "Más pedidos",
    "newest": "Más recientes",
    "oldest": "Más antiguos",
    "price-asc": "Menor precio",
    "price-desc": "Mayor precio",
    "discount-desc": "Mayor descuento"
  };
  if (statusEl) {
    statusEl.textContent = `Mostrando ${visibleList.length} de ${matched.length} productos • Ordenado por: ${sortLabels[state.sortBy] || "Más pedidos"}`;
  }

  // Botón inferior "Ver todos los productos"
  const moreWrap = document.getElementById("catalog-footer-more");
  const moreBtn = document.getElementById("btn-load-all-products");
  if (moreWrap && moreBtn) {
    if (!state.showAllProducts && !isFiltered && matched.length > INITIAL_VISIBLE_LIMIT) {
      moreWrap.style.display = "flex";
      moreBtn.textContent = `Ver todos los productos (${matched.length}) ↓`;
    } else {
      moreWrap.style.display = "none";
    }
  }

  if (visibleList.length === 0) {
    grid.innerHTML = `
      <div class="catalog-empty-box">
        <div style="font-size: 2rem; margin-bottom: 8px;">🔍</div>
        <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 6px;">No encontramos productos con esos filtros</h3>
        <p style="color: #666; font-size: 0.9rem; margin-bottom: 14px;">Prueba buscando otro término o explora nuestro catálogo completo.</p>
        <button type="button" class="btn-load-all-products" onclick="resetAndShowAllCatalog()">Ver Todo el Catálogo (${PRODUCTS.length})</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = visibleList.map(product => {
    const discountPct = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
    let topTagHtml = "";
    if (product.isBestSeller) {
      topTagHtml = `<span class="product-top-tag bestseller">🔥 Más pedido</span>`;
    } else if (product.isNew) {
      topTagHtml = `<span class="product-top-tag new-item">✨ Nuevo</span>`;
    }

    return `
      <article class="product-card" onclick="openPDP('${product.id}')" aria-label="${product.title}">
        <div class="product-card-media">
          ${topTagHtml}
          <img src="${product.images[0]}" alt="${product.title}" class="product-card-img" loading="lazy" decoding="async">
          <span class="product-card-badge ${product.isSoldOut ? 'sold-out' : ''}">
            ${product.isSoldOut ? 'Agotado' : `-${discountPct}% ${product.badge}`}
          </span>
        </div>
        <div class="product-card-info">
          <span class="product-card-brand">${product.brand}</span>
          <h3 class="product-card-title">${product.title}</h3>
          <div class="product-card-rating">
            <span class="stars">★★★★★</span>
            <span class="rating-num">${product.rating.toFixed(1)} (${product.reviewsCount})</span>
          </div>
          <div class="product-card-pricing">
            <span class="price-regular">S/. ${product.oldPrice.toFixed(2)}</span>
            <span class="price-sale">S/. ${product.price.toFixed(2)}</span>
          </div>
          <div class="product-card-actions">
            <button type="button" class="btn-card-buy-now" onclick="event.stopPropagation(); openCODDirect('${product.id}')" title="Comprar este producto de inmediato con Pago Contra Entrega">
              ${product.isSoldOut ? 'Consultar Próximo Lote' : '⚡ Comprar ahora'}
            </button>
            <button type="button" class="btn-card-add-cart" id="btn-add-${product.id}" onclick="event.stopPropagation(); handleAddToCart('${product.id}')" title="Agregar al carrito de compras">
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
              <span>Agregar al carrito</span>
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

// Category filter tabs & cards
function filterByCategory(catSlug, shouldScroll = true) {
  state.currentCategory = catSlug;
  if (catSlug === "all") {
    state.showAllProducts = true;
  }

  // Actualizar tarjetas de categoría superiores
  document.querySelectorAll(".category-card").forEach(c => {
    c.classList.toggle("active", c.dataset.cat === catSlug);
  });

  // Actualizar chips de filtro del catálogo
  document.querySelectorAll(".cat-filter-chip").forEach(chip => {
    chip.classList.toggle("active", chip.dataset.cat === catSlug);
  });

  renderProductsGrid();

  if (shouldScroll) {
    const target = document.getElementById("lo-mas-nuevo");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }
}

function handleCatalogFilterChange() {
  const searchEl = document.getElementById("catalog-search-input");
  const brandEl = document.getElementById("catalog-brand-select");
  const priceEl = document.getElementById("catalog-price-select");
  const sortEl = document.getElementById("catalog-sort-select");

  state.searchQuery = searchEl ? searchEl.value : "";
  state.selectedBrand = brandEl ? brandEl.value : "all";
  state.selectedPriceRange = priceEl ? priceEl.value : "all";
  state.sortBy = sortEl ? sortEl.value : "bestselling";

  renderProductsGrid();
}

function resetAndShowAllCatalog() {
  state.currentCategory = "all";
  state.searchQuery = "";
  state.selectedBrand = "all";
  state.selectedPriceRange = "all";
  state.sortBy = "bestselling";
  state.showAllProducts = true;

  const searchEl = document.getElementById("catalog-search-input");
  const brandEl = document.getElementById("catalog-brand-select");
  const priceEl = document.getElementById("catalog-price-select");
  const sortEl = document.getElementById("catalog-sort-select");

  if (searchEl) searchEl.value = "";
  if (brandEl) brandEl.value = "all";
  if (priceEl) priceEl.value = "all";
  if (sortEl) sortEl.value = "bestselling";

  document.querySelectorAll(".category-card").forEach(c => c.classList.remove("active"));
  document.querySelectorAll(".cat-filter-chip").forEach(chip => {
    chip.classList.toggle("active", chip.dataset.cat === "all");
  });

  renderProductsGrid();

  const target = document.getElementById("lo-mas-nuevo");
  if (target) {
    target.scrollIntoView({ behavior: "smooth" });
  }
}

function expandAllCatalogProducts() {
  state.showAllProducts = true;
  renderProductsGrid();
}

function sortByQuick(sortKey) {
  state.sortBy = sortKey;
  state.showAllProducts = true;
  const sortEl = document.getElementById("catalog-sort-select");
  if (sortEl) sortEl.value = sortKey;
  renderProductsGrid();
}

function focusCatalogSearch() {
  const target = document.getElementById("lo-mas-nuevo");
  const searchEl = document.getElementById("catalog-search-input");
  if (target) target.scrollIntoView({ behavior: "smooth" });
  if (searchEl) {
    setTimeout(() => searchEl.focus(), 350);
  }
}

window.toggleMobileDrawer = function(isOpen) {
  const backdrop = document.getElementById("mobile-drawer-backdrop");
  const panel = document.getElementById("mobile-drawer-panel");
  if (!backdrop || !panel) return;
  if (isOpen) {
    backdrop.classList.add("active");
    panel.classList.add("active");
    document.body.style.overflow = "hidden";
  } else {
    backdrop.classList.remove("active");
    panel.classList.remove("active");
    document.body.style.overflow = "";
  }
};

// Announcement Carousel
function initAnnouncementCarousel() {
  const messages = [
    "¡Pide HOY y paga en casa! Válido solo en Lima Metropolitana 🛵",
    "🚚 Envíos a todo el Perú por Shalom y Olva Courier con número de seguimiento",
    "🎁 ¡Envío GRATIS por compras mayores a S/. 200 en todos los productos!"
  ];
  let idx = 0;
  const el = document.getElementById("announcement-text");
  if (!el) return;

  window.prevAnnouncement = () => {
    idx = (idx - 1 + messages.length) % messages.length;
    el.textContent = messages[idx];
  };
  window.nextAnnouncement = () => {
    idx = (idx + 1) % messages.length;
    el.textContent = messages[idx];
  };

  setInterval(() => {
    window.nextAnnouncement();
  }, 5000);
}

// Hero Banner Multi-Slide Carousel
function initHeroSlider() {
  const track = document.getElementById("hero-slides-track");
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll("#hero-carousel-dots .carousel-dot");
  const counterEl = document.getElementById("hero-slide-counter");
  const pauseBtn = document.getElementById("hero-pause-btn");
  const sliderSection = document.getElementById("hero-slider");

  if (!track || slides.length === 0) return;

  let currentSlide = 0;
  let isPaused = false;
  let isHovering = false;
  const totalSlides = slides.length;

  function renderSlide(idx) {
    currentSlide = (idx + totalSlides) % totalSlides;

    slides.forEach((s, i) => {
      const isActive = i === currentSlide;
      s.classList.toggle("active", isActive);
      s.hidden = !isActive;
    });
    dots.forEach((d, i) => d.classList.toggle("active", i === currentSlide));
    if (counterEl) {
      counterEl.textContent = `${currentSlide + 1} / ${totalSlides}`;
    }
  }

  window.goToHeroSlide = (idx) => {
    renderSlide(idx);
  };
  window.prevHeroSlide = () => {
    renderSlide(currentSlide - 1);
  };
  window.nextHeroSlide = () => {
    renderSlide(currentSlide + 1);
  };
  window.toggleHeroPause = () => {
    isPaused = !isPaused;
    if (pauseBtn) {
      pauseBtn.textContent = isPaused ? "▶" : "||";
    }
  };

  if (sliderSection) {
    sliderSection.addEventListener("mouseenter", () => { isHovering = true; });
    sliderSection.addEventListener("mouseleave", () => { isHovering = false; });

    // Soporte táctil (Swipe en móvil)
    let touchStartX = 0;
    sliderSection.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    sliderSection.addEventListener("touchend", (e) => {
      const diff = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(diff) > 45) {
        if (diff < 0) window.nextHeroSlide();
        else window.prevHeroSlide();
      }
    }, { passive: true });
  }

  setInterval(() => {
    if (!isPaused && !isHovering) {
      renderSlide(currentSlide + 1);
    }
  }, 5500);
}

// ==========================================================================
// 5. PRODUCT DETAIL PAGE (PDP) MODAL & LOGIC
// ==========================================================================
function openPDP(productId) {
  const prod = PRODUCTS.find(p => p.id === productId);
  if (!prod) return;

  state.activeProduct = prod;
  state.activeGalleryIndex = 0;

  // Set PDP content
  document.getElementById("pdp-main-img").src = prod.images[0];
  document.getElementById("pdp-title").textContent = prod.title;
  document.getElementById("pdp-rating-text").textContent = `${prod.rating} (${prod.reviewsCount} Reseñas)`;
  document.getElementById("pdp-price-old").textContent = `S/. ${prod.oldPrice.toFixed(2)}`;
  document.getElementById("pdp-price-current").textContent = `S/. ${prod.price.toFixed(2)}`;
  document.getElementById("pdp-description-text").textContent = prod.description;

  // Thumbnails
  const thumbRow = document.getElementById("pdp-thumbnail-row");
  thumbRow.innerHTML = prod.images.map((img, i) => `
    <img src="${img}" alt="Miniatura ${i + 1}" class="pdp-thumb-item ${i === 0 ? 'active' : ''}" onclick="selectGalleryImage(${i})">
  `).join("");

  // Features list
  const featContainer = document.getElementById("pdp-features-list");
  if (featContainer && prod.features) {
    featContainer.innerHTML = prod.features.map(f => `<li>✓ ${f}</li>`).join("");
  }

  // Update sticky mobile bar details
  updateStickyBar(prod);

  // Open PDP Modal
  const backdrop = document.getElementById("pdp-modal-backdrop");
  if (backdrop) {
    backdrop.classList.add("open");
    document.body.style.overflow = "hidden";
  }
}

function selectGalleryImage(index) {
  state.activeGalleryIndex = index;
  const prod = state.activeProduct;
  document.getElementById("pdp-main-img").src = prod.images[index];

  const thumbs = document.querySelectorAll(".pdp-thumb-item");
  thumbs.forEach((t, i) => {
    t.classList.toggle("active", i === index);
  });
}

function closePDP() {
  const backdrop = document.getElementById("pdp-modal-backdrop");
  if (backdrop) {
    backdrop.classList.remove("open");
    document.body.style.overflow = "auto";
  }
}

// ==========================================================================
// 6. COUNTDOWN TIMER (Urgency CRO - Studio Theme Style)
// ==========================================================================
function initCountdownTimer() {
  let totalSeconds = (3 * 3600) + (22 * 60) + 15; // 03:22:15

  const elHours = document.getElementById("cd-hours");
  const elMins = document.getElementById("cd-mins");
  const elSecs = document.getElementById("cd-secs");

  setInterval(() => {
    if (totalSeconds <= 0) {
      totalSeconds = 4 * 3600; // Reset
    }
    totalSeconds--;

    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    if (elHours) elHours.textContent = String(h).padStart(2, "0");
    if (elMins) elMins.textContent = String(m).padStart(2, "0");
    if (elSecs) elSecs.textContent = String(s).padStart(2, "0");
  }, 1000);
}

// ==========================================================================
// 7. RELEASIT CASH ON DELIVERY (COD) CHECKOUT MODAL
// ==========================================================================
function openCODDirect(productId) {
  const prod = PRODUCTS.find(p => p.id === productId);
  if (prod) state.activeProduct = prod;
  openCODModal();
}

function openCODModal() {
  const prod = state.activeProduct;
  if (!prod) return;

  state.codUnits = 1;
  state.appliedDiscount = 0;
  state.appliedCouponCode = null;

  // Setup Bundle options
  document.getElementById("bundle-img-1").src = prod.images[0];
  document.getElementById("bundle-img-2").src = prod.images[0];
  document.getElementById("bundle-price-1").textContent = `S/. ${prod.price.toFixed(2)}`;
  document.getElementById("bundle-old-1").textContent = `S/. ${prod.oldPrice.toFixed(2)}`;

  document.getElementById("bundle-price-2").textContent = `S/. ${prod.bundlePrice.toFixed(2)}`;
  document.getElementById("bundle-old-2").textContent = `S/. ${(prod.price * 2).toFixed(2)}`;
  document.getElementById("bundle-save-tag").textContent = `¡Ahorra S/. ${prod.savings.toFixed(2)}!`;

  // Select 1 unit by default
  selectBundle(1);

  // Show modal
  const backdrop = document.getElementById("cod-modal-backdrop");
  if (backdrop) {
    backdrop.classList.add("open");
    document.body.style.overflow = "hidden";
  }
}

function closeCODModal() {
  const backdrop = document.getElementById("cod-modal-backdrop");
  if (backdrop) {
    backdrop.classList.remove("open");
    if (!document.getElementById("pdp-modal-backdrop").classList.contains("open")) {
      document.body.style.overflow = "auto";
    }
  }
}

function selectBundle(units) {
  state.codUnits = units;

  const item1 = document.getElementById("bundle-opt-1");
  const item2 = document.getElementById("bundle-opt-2");

  if (units === 1) {
    item1.classList.add("selected");
    item2.classList.remove("selected");
  } else {
    item2.classList.add("selected");
    item1.classList.remove("selected");
  }

  recalculateCODTotals();
}

async function applyCoupon() {
  const input = document.getElementById("cod-coupon-input");
  const code = (input.value || "").trim().toUpperCase();

  if (code === "") {
    alert("Introduce un código de descuento.");
    return;
  }

  try {
    const res = await fetch("/api/coupons/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    });
    const data = await res.json();
    if (res.ok && data.valid) {
      state.appliedDiscount = Number(data.discount) || 0;
      state.appliedCouponCode = data.code || code;
      alert(data.message || `¡Cupón "${code}" aplicado con éxito!`);
    } else {
      state.appliedDiscount = 0;
      state.appliedCouponCode = null;
      alert(data.message || "El código de descuento no es válido o ha expirado.");
    }
  } catch {
    state.appliedDiscount = 0;
    state.appliedCouponCode = null;
    alert("No se pudo verificar el cupón en este momento.");
  }
  recalculateCODTotals();
}

// Shipping selection & Peru Region calculation
function initShippingLogic() {
  const deptSelect = document.getElementById("cod-dept");
  if (deptSelect) {
    deptSelect.addEventListener("change", () => {
      const val = deptSelect.value;
      const isLima = ["PE-LMA", "PE-CAL", "PE-LIM"].includes(val);
      state.isLimaCallao = isLima;
      updateShippingRatesDOM(isLima);
    });
  }

  // Radio clicks
  const shipRadios = document.querySelectorAll(".shipping-option-item");
  shipRadios.forEach(opt => {
    opt.addEventListener("click", () => {
      shipRadios.forEach(o => o.classList.remove("selected"));
      opt.classList.add("selected");
      state.selectedShippingPrice = parseFloat(opt.dataset.price);
      state.selectedShippingName = opt.querySelector(".ship-name").textContent;
      recalculateCODTotals();
    });
  });
}

function updateShippingRatesDOM(isLima) {
  const subtotal = state.codUnits === 1 ? state.activeProduct.price : state.activeProduct.bundlePrice;
  const isFree = subtotal >= CONFIG.freeShippingThreshold;

  const opt1 = document.getElementById("shipping-opt-1");
  const opt2 = document.getElementById("shipping-opt-2");

  if (isLima) {
    opt1.dataset.price = isFree ? "0" : "10";
    opt1.querySelector(".ship-name").textContent = "Envío Delivery VITACORE (2-3 días) - Contraentrega";
    opt1.querySelector(".ship-price-val").textContent = isFree ? "GRATIS" : "S/. 10.00";

    opt2.dataset.price = "15";
    opt2.querySelector(".ship-name").textContent = "Envío Delivery Express 24h Lima - Contraentrega";
    opt2.querySelector(".ship-price-val").textContent = "S/. 15.00";
  } else {
    opt1.dataset.price = isFree ? "0" : "12";
    opt1.querySelector(".ship-name").textContent = "Envío con Agencia Shalom (Previo adelanto)";
    opt1.querySelector(".ship-price-val").textContent = isFree ? "GRATIS" : "S/. 12.00";

    opt2.dataset.price = isFree ? "0" : "15";
    opt2.querySelector(".ship-name").textContent = "Envío con Agencia Olva Courier (Previo adelanto)";
    opt2.querySelector(".ship-price-val").textContent = isFree ? "GRATIS" : "S/. 15.00";
  }

  // Update selected price
  const activeOpt = document.querySelector(".shipping-option-item.selected");
  if (activeOpt) {
    state.selectedShippingPrice = parseFloat(activeOpt.dataset.price);
    state.selectedShippingName = activeOpt.querySelector(".ship-name").textContent;
  }
  recalculateCODTotals();
}

function recalculateCODTotals() {
  const prod = state.activeProduct;
  if (!prod) return;

  const subtotal = (state.codUnits === 1 ? prod.price : prod.bundlePrice) - state.appliedDiscount;
  const total = Math.max(0, subtotal) + state.selectedShippingPrice;

  document.getElementById("cod-subtotal-val").textContent = `S/. ${subtotal.toFixed(2)}`;
  document.getElementById("cod-shipping-val").textContent = state.selectedShippingPrice === 0 ? "GRATIS" : `S/. ${state.selectedShippingPrice.toFixed(2)}`;
  document.getElementById("cod-total-val").textContent = `S/. ${total.toFixed(2)}`;

  const btnSubmit = document.getElementById("btn-submit-cod");
  if (btnSubmit) {
    btnSubmit.innerHTML = `
      <span>CONFIRMAR PEDIDO - S/. ${total.toFixed(2)}</span>
      <span class="sub">(Pago Contra entrega y Previo adelanto)</span>
    `;
  }
}

// ==========================================================================
// 8. SUBMIT COD ORDER TO BACKEND REST API & WHATSAPP
// ==========================================================================
async function submitCODForm(event) {
  event.preventDefault();

  const name = document.getElementById("cod-name").value.trim();
  const email = document.getElementById("cod-email").value.trim();
  const dni = document.getElementById("cod-dni").value.trim();
  const phone = document.getElementById("cod-phone").value.trim();
  const address = document.getElementById("cod-address").value.trim();
  const ref = document.getElementById("cod-ref").value.trim();
  const deptSelect = document.getElementById("cod-dept");
  const dept = deptSelect.options[deptSelect.selectedIndex].text;
  const city = document.getElementById("cod-city").value.trim();
  const dist = document.getElementById("cod-dist").value.trim();

  // Validación
  if (!name || !dni || !phone || !address || !dist) {
    alert("Por favor completa los campos obligatorios (*) para que nuestro equipo pueda despachar tu pedido.");
    return;
  }

  if (phone.length < 9) {
    alert("Introduce un número de WhatsApp peruano válido (9 dígitos).");
    return;
  }

  const prod = state.activeProduct;
  const subtotal = (state.codUnits === 1 ? prod.price : prod.bundlePrice) - state.appliedDiscount;
  let total = subtotal + state.selectedShippingPrice;
  let orderId = `VIT-${Math.floor(100000 + Math.random() * 900000)}`;

  const orderPayload = {
    customer: {
      name,
      email,
      phone,
      dni,
      address,
      reference: ref,
      department: dept,
      province: city || "Lima",
      district: dist
    },
    items: [
      {
        id: prod.id,
        title: prod.title,
        quantity: state.codUnits,
        price: prod.price
      }
    ],
    couponCode: state.appliedCouponCode,
    subtotal,
    shippingRate: {
      name: state.selectedShippingName,
      price: state.selectedShippingPrice
    },
    total,
    paymentMethod: "Cash on Delivery (COD) Contra Entrega",
    status: "Pendiente",
    notes: `Pedido generado en web. Promo: ${state.codUnits} unidad(es).`
  };

  // 1. Guardar en Backend REST API y sincronizar con Google Sheets
  try {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload)
    });
    const data = await res.json();
    if (res.ok && data.order) {
      orderId = data.order.id;
      total = Number(data.order.total) || total;
    }
  } catch (err) {
    console.warn("Aviso al registrar pedido en servidor:", err);
  }

  // 2. Formatear mensaje oficial para WhatsApp
  const waMsg = `👋🏻 Hola equipo *${CONFIG.storeName}*, soy: *${name}*, acabo de realizar un pedido y quiero confirmar mi compra de:

*Pedido:* ${orderId}
*Producto:* ${prod.title} (${state.codUnits} unid.)
*Total a Pagar:* S/. ${total.toFixed(2)}
*Estoy ubicado en:* ${dist}, ${dept}
*Dirección:* ${address}
*DNI:* ${dni}
*Método de envío:* ${state.selectedShippingName}`;

  const encodedMsg = encodeURIComponent(waMsg);
  const waUrl = `https://api.whatsapp.com/send?phone=${CONFIG.whatsappNumber}&text=${encodedMsg}`;

  // 3. Mostrar pantalla de éxito Releasit
  const modalBox = document.querySelector(".cod-modal-card");
  if (modalBox) {
    modalBox.innerHTML = `
      <div class="success-card">
        <div class="success-icon-badge">✓</div>
        <h3 style="font-size: 1.45rem; font-weight: 800; color: #121212; margin-bottom: 8px;">¡Gracias por su compra! 🎉</h3>
        <p style="color: #059669; font-weight: 700; font-size: 1.1rem; margin-bottom: 12px;">
          Pedido N° ${orderId}
        </p>
        <p style="color: #4b5563; font-size: 0.92rem; line-height: 1.6; max-width: 440px; margin: 0 auto 16px;">
          Nos comunicaremos contigo pronto para confirmar tu pedido y coordinar el día de entrega en tu domicilio.
        </p>
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 14px; text-align: left; margin-bottom: 20px; font-size: 0.88rem;">
          <div style="margin-bottom: 4px;"><strong>Cliente:</strong> ${name}</div>
          <div style="margin-bottom: 4px;"><strong>Entrega en:</strong> ${address}, ${dist}</div>
          <div><strong>Total a Pagar al Recibir:</strong> <span style="font-weight: 800; color: #121212;">S/. ${total.toFixed(2)}</span></div>
        </div>
        <a href="${waUrl}" target="_blank" class="btn-wa-success">
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.074-2.115-.515-1.745-.722-2.883-2.485-2.97-2.601-.088-.117-.708-.942-.708-1.798s.446-1.277.606-1.451c.16-.175.348-.218.465-.218.116 0 .233.001.334.007.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.088.072.19.014.305-.058.115-.087.19-.174.291-.088.102-.185.228-.264.307-.088.087-.179.182-.077.357.101.174.449.741.964 1.201.662.591 1.221.774 1.394.861.174.088.277.073.379-.044.102-.117.438-.51.554-.685.118-.175.233-.146.393-.087.16.058 1.019.48 1.194.567.175.088.291.131.335.204.043.072.043.42-.101.825z"/></svg>
          VALIDAR ENTREGA EN WHATSAPP 📲
        </a>
        <div style="margin-top: 16px;">
          <button onclick="closeCODModal()" style="background: none; border: none; color: #9ca3af; font-size: 0.82rem; cursor: pointer;">
            Continuar explorando la tienda
          </button>
        </div>
      </div>
    `;
  }

  // Redirigir a WhatsApp
  setTimeout(() => {
    window.open(waUrl, "_blank");
  }, 1200);
}

// ==========================================================================
// 9. MOBILE STICKY BAR
// ==========================================================================
function initStickyBar() {
  updateStickyBar(PRODUCTS[0]);
}

function updateStickyBar(prod) {
  const thumb = document.getElementById("sticky-thumb");
  const title = document.getElementById("sticky-title");
  const price = document.getElementById("sticky-price");

  if (thumb) thumb.src = prod.images[0];
  if (title) title.textContent = prod.title;
  if (price) price.textContent = `S/. ${prod.price.toFixed(2)}`;
}

// ==========================================================================
// 10. SHOPPING CART SYSTEM (Bolsa de Compras Lateral & Persistencia)
// ==========================================================================
function initCart() {
  updateCartBadge();
  renderCartDrawer();
}

function saveCart() {
  try {
    localStorage.setItem("vitacore_cart", JSON.stringify(state.cart));
  } catch (err) {
    console.warn("Error guardando carrito en localStorage:", err);
  }
}

function updateCartBadge() {
  const totalCount = state.cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const badge = document.getElementById("header-cart-count");
  if (badge) {
    badge.textContent = totalCount;
    badge.style.transform = "scale(1.25)";
    setTimeout(() => { badge.style.transform = "scale(1)"; }, 200);
  }
  const drawerCount = document.getElementById("cart-drawer-count-badge");
  if (drawerCount) {
    drawerCount.textContent = totalCount;
  }
}

function handleAddToCart(productId) {
  const prod = PRODUCTS.find(p => p.id === productId);
  if (!prod) return;

  const existing = state.cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity = (existing.quantity || 1) + 1;
  } else {
    state.cart.push({
      id: prod.id,
      title: prod.title,
      price: prod.price,
      oldPrice: prod.oldPrice,
      image: prod.images[0],
      quantity: 1
    });
  }

  saveCart();
  updateCartBadge();
  renderCartDrawer();

  // Feedback visual en el botón de la tarjeta
  const btn = document.getElementById(`btn-add-${productId}`);
  if (btn) {
    const originalHTML = btn.innerHTML;
    btn.classList.add("added");
    btn.innerHTML = `<span>✓ Agregado</span>`;
    setTimeout(() => {
      btn.classList.remove("added");
      btn.innerHTML = originalHTML;
    }, 1300);
  }

  // Mostrar notificación Toast
  showCartToast(prod.title);

  // Abrir panel lateral de carrito automáticamente
  toggleCartDrawer(true);
}

function toggleCartDrawer(open) {
  const backdrop = document.getElementById("cart-drawer-backdrop");
  if (!backdrop) return;
  if (open) {
    renderCartDrawer();
    backdrop.classList.add("active");
    document.body.style.overflow = "hidden";
  } else {
    backdrop.classList.remove("active");
    if (!document.getElementById("cod-modal-backdrop")?.classList.contains("open") &&
        !document.getElementById("pdp-modal-backdrop")?.classList.contains("open")) {
      document.body.style.overflow = "auto";
    }
  }
}

function renderCartDrawer() {
  const container = document.getElementById("cart-drawer-items");
  const subtotalEl = document.getElementById("cart-drawer-subtotal");
  const shipText = document.getElementById("cart-shipping-text");
  const shipFill = document.getElementById("cart-shipping-fill");
  const checkoutBtn = document.getElementById("btn-cart-checkout");
  if (!container) return;

  if (state.cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty-box">
        <div class="cart-empty-icon">🛍️</div>
        <div class="cart-empty-title">Tu carrito está vacío</div>
        <div class="cart-empty-sub">Aún no has agregado ningún producto a tu pedido.</div>
        <button type="button" class="btn-cart-empty-shop" onclick="toggleCartDrawer(false)">Explorar Catálogo</button>
      </div>
    `;
    if (subtotalEl) subtotalEl.textContent = "S/. 0.00";
    if (shipText) shipText.innerHTML = `¡Agrega <strong>S/. 200.00</strong> para <strong>Envío GRATIS</strong>! 🚚`;
    if (shipFill) shipFill.style.width = "0%";
    if (checkoutBtn) {
      checkoutBtn.disabled = true;
      checkoutBtn.style.opacity = "0.5";
      checkoutBtn.style.cursor = "not-allowed";
    }
    return;
  }

  if (checkoutBtn) {
    checkoutBtn.disabled = false;
    checkoutBtn.style.opacity = "1";
    checkoutBtn.style.cursor = "pointer";
  }

  let subtotal = 0;
  container.innerHTML = state.cart.map(item => {
    const itemTotal = item.price * (item.quantity || 1);
    subtotal += itemTotal;
    return `
      <div class="cart-drawer-item">
        <img src="${item.image}" alt="${item.title}" class="cart-item-img">
        <div class="cart-item-details">
          <div class="cart-item-title">${item.title}</div>
          <div class="cart-item-price">S/. ${item.price.toFixed(2)}</div>
          <div class="cart-item-bottom">
            <div class="cart-qty-control">
              <button type="button" class="cart-qty-btn" onclick="updateCartItemQty('${item.id}', -1)" aria-label="Restar">−</button>
              <span class="cart-qty-num">${item.quantity || 1}</span>
              <button type="button" class="cart-qty-btn" onclick="updateCartItemQty('${item.id}', 1)" aria-label="Sumar">+</button>
            </div>
            <button type="button" class="cart-item-remove" onclick="removeFromCart('${item.id}')">Eliminar</button>
          </div>
        </div>
      </div>
    `;
  }).join("");

  if (subtotalEl) subtotalEl.textContent = `S/. ${subtotal.toFixed(2)}`;

  // Free shipping progress calculation
  const threshold = (typeof CONFIG !== "undefined" && CONFIG.freeShippingThreshold) ? CONFIG.freeShippingThreshold : 200;
  if (shipText && shipFill) {
    if (subtotal >= threshold) {
      shipText.innerHTML = `🎉 ¡Felicidades! Tienes <strong>Envío GRATIS</strong> asegurado 🚚`;
      shipFill.style.width = "100%";
      shipFill.style.background = "#059669";
    } else {
      const remaining = threshold - subtotal;
      const pct = Math.min(100, Math.round((subtotal / threshold) * 100));
      shipText.innerHTML = `¡Te faltan <strong>S/. ${remaining.toFixed(2)}</strong> para <strong>Envío GRATIS</strong>! 🚚`;
      shipFill.style.width = `${pct}%`;
      shipFill.style.background = "#059669";
    }
  }
}

function updateCartItemQty(productId, delta) {
  const item = state.cart.find(i => i.id === productId);
  if (!item) return;
  item.quantity = (item.quantity || 1) + delta;
  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }
  saveCart();
  updateCartBadge();
  renderCartDrawer();
}

function removeFromCart(productId) {
  state.cart = state.cart.filter(i => i.id !== productId);
  saveCart();
  updateCartBadge();
  renderCartDrawer();
}

function checkoutFromCart() {
  if (state.cart.length === 0) return;
  toggleCartDrawer(false);

  const firstItem = state.cart[0];
  const prod = PRODUCTS.find(p => p.id === firstItem.id) || PRODUCTS[0];
  state.activeProduct = prod;
  state.codUnits = firstItem.quantity || 1;

  openCODModal();
}

let toastTimer = null;
function showCartToast(title) {
  const toast = document.getElementById("cart-toast");
  const toastTitle = document.getElementById("cart-toast-title");
  if (!toast) return;

  if (toastTitle) toastTitle.textContent = title;
  toast.classList.add("show");

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);
}

// Global expose
window.openPDP = openPDP;
window.closePDP = closePDP;
window.selectGalleryImage = selectGalleryImage;
window.openCODDirect = openCODDirect;
window.openCODModal = openCODModal;
window.closeCODModal = closeCODModal;
window.selectBundle = selectBundle;
window.applyCoupon = applyCoupon;
window.submitCODForm = submitCODForm;
window.filterByCategory = filterByCategory;
window.handleCatalogFilterChange = handleCatalogFilterChange;
window.resetAndShowAllCatalog = resetAndShowAllCatalog;
window.expandAllCatalogProducts = expandAllCatalogProducts;
window.sortByQuick = sortByQuick;
window.focusCatalogSearch = focusCatalogSearch;
window.handleAddToCart = handleAddToCart;
window.addToCart = handleAddToCart;
window.toggleCartDrawer = toggleCartDrawer;
window.updateCartItemQty = updateCartItemQty;
window.removeFromCart = removeFromCart;
window.checkoutFromCart = checkoutFromCart;


