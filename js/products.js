/* =========================================
   PRODUCTS DATA - FROM PHP API
========================================= */

let catalog = [];
let currentBrandFilter = 'all';
let currentSearch = '';
let currentSort = 'default';

// =========================================
   LOAD PRODUCTS FROM API
========================================= */

async function loadProductsFromAPI() {
    try {
        const response = await fetch('/api/index.php?endpoint=products');
        const data = await response.json();
        
        if (data.success) {
            catalog = data.data;
            console.log(`✅ ${catalog.length} محصول از دیتابیس بارگذاری شد!`);
            updateCatalog();
        } else {
            console.error('❌ خطا در دریافت محصولات:', data.message);
        }
    } catch (error) {
        console.error('❌ خطا در ارتباط با سرور:', error);
    }
}

// =========================================
   HELPERS
========================================= */

function getMainImage(product) {
    if (!product.images || !product.images.length) return '';
    
    // اصلاح مسیر تصویر برای ساختار جدید
    let path = product.images[0];
    if (!path.startsWith('assets/products/')) {
        // حذف 'products/' از ابتدای مسیر و اضافه کردن 'assets/products/'
        path = path.replace(/^products\//, '');
        path = 'assets/products/' + path;
    }
    return path;
}

function getSpecsHTML(specs) {
    if (!specs || typeof specs !== 'object' || !Object.keys(specs).length) return '';
    let html = '<div class="product-specs">';
    for (const [key, value] of Object.entries(specs)) {
        html += `<span><i class="fa-solid fa-circle"></i> ${key}: ${value}</span>`;
    }
    html += '</div>';
    return html;
}

// =========================================
   CARD RENDERER
========================================= */

function buildProductCard(product) {
    const brandColors = {
        atos: '#1a3a5c',
        emka: '#2c7a4a',
        siemens: '#0099d8',
        mesan: '#b87333'
    };
    const brandNames = {
        atos: 'Atos',
        emka: 'Emka',
        siemens: 'Siemens',
        mesan: 'Mesan'
    };
    const categoryNames = {
        kilit: 'قفل',
        mentese: 'لولا',
        conta: 'واشر',
        damper: 'دمپر'
    };
    const specsHTML = getSpecsHTML(product.specs);
    const imgSrc = getMainImage(product);
    const imageCount = (product.images || []).length;

    const card = document.createElement('div');
    card.className = 'product-card';

    card.innerHTML = `
        <div class="product-image">
            <img src="${imgSrc}" alt="${product.name} - ${product.model}" loading="lazy" onerror="this.style.display='none'">
            ${imageCount > 1 ? `<span class="image-count"><i class="fa-regular fa-images"></i> ${imageCount}</span>` : ''}
        </div>
        <div class="product-info">
            <span class="brand-tag" style="background:${brandColors[product.brand] || '#333'}">${brandNames[product.brand] || product.brand}</span>
            <h4>${product.name}</h4>
            <div class="model">${product.model}</div>
            <p class="desc">${product.description}</p>
            ${specsHTML}
            <div class="product-category"><i class="fa-regular fa-tag"></i> ${categoryNames[product.category] || product.category}</div>
        </div>
    `;

    // Click to open the gallery (modal)
    card.addEventListener('click', () => openGallery(product));

    return card;
}

// =========================================
   GALLERY / MODAL
========================================= */

let galleryImages = [];
let galleryIndex = 0;

function openGallery(product) {
    // اصلاح مسیر تصاویر گالری
    galleryImages = (product.images || []).map(img => {
        if (!img.startsWith('assets/products/')) {
            img = img.replace(/^products\//, '');
            img = 'assets/products/' + img;
        }
        return img;
    });
    galleryIndex = 0;

    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const caption = document.getElementById('modalCaption');

    if (!modal || !modalImg || !caption || !galleryImages.length) return;

    modalImg.src = galleryImages[0];
    caption.textContent = `${product.name} - ${product.model} (1/${galleryImages.length})`;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    document.addEventListener('keydown', onGalleryKey);
}

function closeGallery() {
    const modal = document.getElementById('imageModal');
    if (modal) modal.classList.remove('open');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onGalleryKey);
}

function changeGallery(direction) {
    if (!galleryImages.length) return;
    galleryIndex = (galleryIndex + direction + galleryImages.length) % galleryImages.length;

    const modalImg = document.getElementById('modalImage');
    const caption = document.getElementById('modalCaption');
    if (modalImg && caption) {
        modalImg.src = galleryImages[galleryIndex];
        const namePart = caption.textContent?.split('(')[0] || '';
        caption.textContent = `${namePart} (${galleryIndex + 1}/${galleryImages.length})`;
    }
}

function onGalleryKey(e) {
    if (e.key === 'ArrowRight') changeGallery(1);
    else if (e.key === 'ArrowLeft') changeGallery(-1);
    else if (e.key === 'Escape') closeGallery();
}

// Modal navigation listeners
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeGallery();
        });
    }

    const closeBtn = document.querySelector('.modal-close');
    if (closeBtn) closeBtn.addEventListener('click', closeGallery);

    const prevBtn = document.getElementById('modalPrev');
    const nextBtn = document.getElementById('modalNext');
    if (prevBtn) prevBtn.addEventListener('click', () => changeGallery(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => changeGallery(1));
});

// =========================================
   CATALOG ENGINE
========================================= */

const productContainer = document.getElementById('catalogProducts');
const emptyState = document.getElementById('emptyProducts');
const resultsText = document.getElementById('resultsText');
const productCount = document.getElementById('productCount');
const searchInput = document.getElementById('productSearch');
const clearSearch = document.getElementById('clearSearch');
const sortSelect = document.getElementById('sortProducts');
const resetFiltersBtn = document.getElementById('resetFilters');
const filterToggle = document.getElementById('filterToggle');
const sidebar = document.getElementById('catalogSidebar');
const closeFilters = document.getElementById('closeFilters');

// Counters for each brand
const allCountEl = document.getElementById('allCount');
const atosCountEl = document.getElementById('atosCount');
const emkaCountEl = document.getElementById('emkaCount');
const siemensCountEl = document.getElementById('siemensCount');
const mesanCountEl = document.getElementById('mesanCount');

// =========================================
   UPDATE UI
========================================= */

function updateCatalog() {
    // Filter by brand
    let filtered = (currentBrandFilter === 'all')
        ? [...catalog]
        : catalog.filter(p => p.brand === currentBrandFilter);

    // Filter by search (name, model, description, brand, category)
    if (currentSearch.trim()) {
        const term = currentSearch.trim().toLowerCase();
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(term) ||
            p.model.toLowerCase().includes(term) ||
            p.brand.toLowerCase().includes(term) ||
            (p.specs && Object.values(p.specs).some(v => v.toLowerCase().includes(term))) ||
            p.category.toLowerCase().includes(term)
        );
    }

    // Sort
    switch (currentSort) {
        case 'name':
            filtered.sort((a, b) => a.name.localeCompare(b.name, 'fa'));
            break;
        case 'brand':
            filtered.sort((a, b) => a.brand.localeCompare(b.brand, 'fa'));
            break;
        default:
            // default: keep original order (by id)
            break;
    }

    // Update counters
    if (allCountEl) allCountEl.textContent = catalog.length;
    if (atosCountEl) atosCountEl.textContent = catalog.filter(p => p.brand === 'atos').length;
    if (emkaCountEl) emkaCountEl.textContent = catalog.filter(p => p.brand === 'emka').length;
    if (siemensCountEl) siemensCountEl.textContent = catalog.filter(p => p.brand === 'siemens').length;
    if (mesanCountEl) mesanCountEl.textContent = catalog.filter(p => p.brand === 'mesan').length;

    // Update results count
    if (productCount) productCount.textContent = filtered.length;

    // Update results text
    if (resultsText) {
        const brandNames = {
            all: 'همه محصولات',
            atos: 'Atos',
            emka: 'Emka',
            siemens: 'Siemens',
            mesan: 'Mesan'
        };
        const brandLabel = brandNames[currentBrandFilter] || 'محصولات';
        if (currentSearch.trim()) {
            resultsText.textContent = `نتایج جستجو برای «${currentSearch.trim()}»`;
        } else {
            resultsText.textContent = currentBrandFilter === 'all' ? 'همه محصولات' : `برند ${brandLabel}`;
        }
    }

    // Render products or empty state
    if (filtered.length === 0) {
        productContainer.innerHTML = '';
        if (emptyState) emptyState.hidden = false;
        return;
    }

    if (emptyState) emptyState.hidden = true;

    // Render cards
    productContainer.innerHTML = '';
    filtered.forEach(product => {
        productContainer.appendChild(buildProductCard(product));
    });
}

// =========================================
   EVENT LISTENERS
========================================= */

// Brand filters (radio buttons)
document.querySelectorAll('input[name="brand"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        currentBrandFilter = e.target.value;
        updateCatalog();
        if (sidebar) sidebar.classList.remove('open');
    });
});

// Search
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value;
        updateCatalog();
        if (clearSearch) clearSearch.style.display = currentSearch ? 'block' : 'none';
    });
}

if (clearSearch) {
    clearSearch.addEventListener('click', () => {
        if (searchInput) {
            searchInput.value = '';
            currentSearch = '';
            updateCatalog();
            clearSearch.style.display = 'none';
        }
    });
}

// Sort
if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        updateCatalog();
    });
}

// Reset filters
if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', () => {
        const allRadio = document.querySelector('input[name="brand"][value="all"]');
        if (allRadio) allRadio.checked = true;
        currentBrandFilter = 'all';

        if (searchInput) {
            searchInput.value = '';
            currentSearch = '';
            if (clearSearch) clearSearch.style.display = 'none';
        }

        if (sortSelect) sortSelect.value = 'default';
        currentSort = 'default';

        updateCatalog();
        if (sidebar) sidebar.classList.remove('open');
    });
}

// Empty state reset button
const emptyReset = document.getElementById('emptyReset');
if (emptyReset) {
    emptyReset.addEventListener('click', () => {
        resetFiltersBtn?.click();
    });
}

// Mobile filter toggle
if (filterToggle && sidebar) {
    filterToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });
}

if (closeFilters && sidebar) {
    closeFilters.addEventListener('click', () => {
        sidebar.classList.remove('open');
    });
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 950 && sidebar && sidebar.classList.contains('open')) {
        if (!sidebar.contains(e.target) && !filterToggle?.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    }
});

// =========================================
   URL PARAMETER (for direct links from index)
========================================= */

function handleURLParams() {
    const params = new URLSearchParams(window.location.search);
    const brand = params.get('brand');
    if (brand) {
        const brandMap = {
            'atos': 'atos',
            'emka': 'emka',
            'siemens': 'siemens',
            'mesan': 'mesan'
        };
        const mapped = brandMap[brand.toLowerCase()];
        if (mapped) {
            const radio = document.querySelector(`input[name="brand"][value="${mapped}"]`);
            if (radio) {
                radio.checked = true;
                currentBrandFilter = mapped;
            }
        }
    }
}

// =========================================
   INIT
========================================= */

document.addEventListener('DOMContentLoaded', async () => {
    console.log('📦 Arman Tejarat - Loading products from database...');
    
    await loadProductsFromAPI();
    handleURLParams();
    updateCatalog();
});

console.log('📦 Arman Tejarat - Products catalog loaded from database!');