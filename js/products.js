(function() {
    'use strict';

    let catalog = [];
    let currentBrandFilter = 'all';
    let currentSearch = '';
    let currentSort = 'default';

    async function loadProductsFromAPI() {
        try {
            const response = await fetch('/api/index.php?endpoint=products');
            const data = await response.json();
            
            if (data.success) {
                catalog = data.data;
                console.log('✅ ' + catalog.length + ' محصول از دیتابیس بارگذاری شد!');
                updateCatalog();
            } else {
                console.error('❌ خطا در دریافت محصولات:', data.message);
            }
        } catch (error) {
            console.error('❌ خطا در ارتباط با سرور:', error);
        }
    }

    function getMainImage(product) {
        if (!product.images || !product.images.length) return '';
        
        let images = product.images;
        if (typeof images === 'string') {
            try {
                images = JSON.parse(images);
            } catch (e) {
                return '';
            }
        }
        
        if (!images || !images.length) return '';
        
        let path = images[0];
        if (!path.startsWith('assets/products/')) {
            path = path.replace(/^products\//, '');
            path = 'assets/products/' + path;
        }
        return path;
    }

    function getSpecsHTML(specs) {
        let specsObj = specs;
        if (typeof specs === 'string') {
            try {
                specsObj = JSON.parse(specs);
            } catch (e) {
                return '';
            }
        }
        
        if (!specsObj || typeof specsObj !== 'object' || !Object.keys(specsObj).length) return '';
        let html = '<div class="product-specs">';
        for (const key in specsObj) {
            if (specsObj.hasOwnProperty(key)) {
                html += '<span><i class="fa-solid fa-circle"></i> ' + key + ': ' + specsObj[key] + '</span>';
            }
        }
        html += '</div>';
        return html;
    }

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
        
        let images = product.images;
        if (typeof images === 'string') {
            try {
                images = JSON.parse(images);
            } catch (e) {
                images = [];
            }
        }
        const imageCount = (images || []).length;

        const card = document.createElement('div');
        card.className = 'product-card';

        card.innerHTML = 
            '<div class="product-image">' +
                '<img src="' + imgSrc + '" alt="' + product.name + ' - ' + product.model + '" loading="lazy" onerror="this.style.display=\'none\'">' +
                (imageCount > 1 ? '<span class="image-count"><i class="fa-regular fa-images"></i> ' + imageCount + '</span>' : '') +
            '</div>' +
            '<div class="product-info">' +
                '<span class="brand-tag" style="background:' + (brandColors[product.brand] || '#333') + '">' + (brandNames[product.brand] || product.brand) + '</span>' +
                '<h4>' + product.name + '</h4>' +
                '<div class="model">' + product.model + '</div>' +
                '<p class="desc">' + product.description + '</p>' +
                specsHTML +
                '<div class="product-category"><i class="fa-regular fa-tag"></i> ' + (categoryNames[product.category] || product.category) + '</div>' +
            '</div>';

        card.addEventListener('click', function() {
            openGallery(product);
        });
        return card;
    }

    let galleryImages = [];
    let galleryIndex = 0;

    function openGallery(product) {
        let images = product.images || [];
        if (typeof images === 'string') {
            try {
                images = JSON.parse(images);
            } catch (e) {
                images = [];
            }
        }
        
        galleryImages = images.map(function(img) {
            if (!img.startsWith('assets/products/')) {
                img = img.replace(/^products\//, '');
                img = 'assets/products/' + img;
            }
            return img;
        });
        galleryIndex = 0;

        var modal = document.getElementById('imageModal');
        var modalImg = document.getElementById('modalImage');
        var caption = document.getElementById('modalCaption');

        if (!modal || !modalImg || !caption || !galleryImages.length) return;

        modalImg.src = galleryImages[0];
        caption.textContent = product.name + ' - ' + product.model + ' (1/' + galleryImages.length + ')';
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', onGalleryKey);
    }

    function closeGallery() {
        var modal = document.getElementById('imageModal');
        if (modal) modal.classList.remove('open');
        document.body.style.overflow = '';
        document.removeEventListener('keydown', onGalleryKey);
    }

    function changeGallery(direction) {
        if (!galleryImages.length) return;
        galleryIndex = (galleryIndex + direction + galleryImages.length) % galleryImages.length;

        var modalImg = document.getElementById('modalImage');
        var caption = document.getElementById('modalCaption');
        if (modalImg && caption) {
            modalImg.src = galleryImages[galleryIndex];
            var namePart = caption.textContent.split('(')[0] || '';
            caption.textContent = namePart + ' (' + (galleryIndex + 1) + '/' + galleryImages.length + ')';
        }
    }

    function onGalleryKey(e) {
        if (e.key === 'ArrowRight') changeGallery(1);
        else if (e.key === 'ArrowLeft') changeGallery(-1);
        else if (e.key === 'Escape') closeGallery();
    }

    document.addEventListener('DOMContentLoaded', function() {
        var modal = document.getElementById('imageModal');
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) closeGallery();
            });
        }

        var closeBtn = document.querySelector('.modal-close');
        if (closeBtn) closeBtn.addEventListener('click', closeGallery);

        var prevBtn = document.getElementById('modalPrev');
        var nextBtn = document.getElementById('modalNext');
        if (prevBtn) prevBtn.addEventListener('click', function() { changeGallery(-1); });
        if (nextBtn) nextBtn.addEventListener('click', function() { changeGallery(1); });
    });

    var productContainer = document.getElementById('catalogProducts');
    var emptyState = document.getElementById('emptyProducts');
    var resultsText = document.getElementById('resultsText');
    var productCount = document.getElementById('productCount');
    var searchInput = document.getElementById('productSearch');
    var clearSearch = document.getElementById('clearSearch');
    var sortSelect = document.getElementById('sortProducts');
    var resetFiltersBtn = document.getElementById('resetFilters');
    var filterToggle = document.getElementById('filterToggle');
    var sidebar = document.getElementById('catalogSidebar');
    var closeFilters = document.getElementById('closeFilters');

    var allCountEl = document.getElementById('allCount');
    var atosCountEl = document.getElementById('atosCount');
    var emkaCountEl = document.getElementById('emkaCount');
    var siemensCountEl = document.getElementById('siemensCount');
    var mesanCountEl = document.getElementById('mesanCount');

    function updateCatalog() {
        console.log('🔄 updateCatalog called, catalog length:', catalog.length);
        
        var filtered = (currentBrandFilter === 'all')
            ? catalog.slice()
            : catalog.filter(function(p) { return p.brand === currentBrandFilter; });

        if (currentSearch.trim()) {
            var term = currentSearch.trim().toLowerCase();
            filtered = filtered.filter(function(p) {
                return p.name.toLowerCase().includes(term) ||
                    p.model.toLowerCase().includes(term) ||
                    p.brand.toLowerCase().includes(term) ||
                    (p.specs && Object.values(p.specs).some(function(v) { return v.toLowerCase().includes(term); })) ||
                    p.category.toLowerCase().includes(term);
            });
        }

        switch (currentSort) {
            case 'name':
                filtered.sort(function(a, b) { return a.name.localeCompare(b.name, 'fa'); });
                break;
            case 'brand':
                filtered.sort(function(a, b) { return a.brand.localeCompare(b.brand, 'fa'); });
                break;
            default:
                break;
        }

        if (allCountEl) allCountEl.textContent = catalog.length;
        if (atosCountEl) atosCountEl.textContent = catalog.filter(function(p) { return p.brand === 'atos'; }).length;
        if (emkaCountEl) emkaCountEl.textContent = catalog.filter(function(p) { return p.brand === 'emka'; }).length;
        if (siemensCountEl) siemensCountEl.textContent = catalog.filter(function(p) { return p.brand === 'siemens'; }).length;
        if (mesanCountEl) mesanCountEl.textContent = catalog.filter(function(p) { return p.brand === 'mesan'; }).length;

        if (productCount) productCount.textContent = filtered.length;

        if (resultsText) {
            var brandNames = {
                all: 'همه محصولات',
                atos: 'Atos',
                emka: 'Emka',
                siemens: 'Siemens',
                mesan: 'Mesan'
            };
            var brandLabel = brandNames[currentBrandFilter] || 'محصولات';
            if (currentSearch.trim()) {
                resultsText.textContent = 'نتایج جستجو برای «' + currentSearch.trim() + '»';
            } else {
                resultsText.textContent = currentBrandFilter === 'all' ? 'همه محصولات' : 'برند ' + brandLabel;
            }
        }

        if (!productContainer) {
            console.error('❌ productContainer not found!');
            return;
        }

        if (filtered.length === 0) {
            productContainer.innerHTML = '';
            if (emptyState) emptyState.hidden = false;
            return;
        }

        if (emptyState) emptyState.hidden = true;

        productContainer.innerHTML = '';
        filtered.forEach(function(product) {
            productContainer.appendChild(buildProductCard(product));
        });
    }

    document.querySelectorAll('input[name="brand"]').forEach(function(radio) {
        radio.addEventListener('change', function(e) {
            currentBrandFilter = e.target.value;
            updateCatalog();
            if (sidebar) sidebar.classList.remove('open');
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            currentSearch = e.target.value;
            updateCatalog();
            if (clearSearch) clearSearch.style.display = currentSearch ? 'block' : 'none';
        });
    }

    if (clearSearch) {
        clearSearch.addEventListener('click', function() {
            if (searchInput) {
                searchInput.value = '';
                currentSearch = '';
                updateCatalog();
                clearSearch.style.display = 'none';
            }
        });
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', function(e) {
            currentSort = e.target.value;
            updateCatalog();
        });
    }

    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function() {
            var allRadio = document.querySelector('input[name="brand"][value="all"]');
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

    var emptyReset = document.getElementById('emptyReset');
    if (emptyReset) {
        emptyReset.addEventListener('click', function() {
            if (resetFiltersBtn) resetFiltersBtn.click();
        });
    }

    if (filterToggle && sidebar) {
        filterToggle.addEventListener('click', function() {
            sidebar.classList.toggle('open');
        });
    }

    if (closeFilters && sidebar) {
        closeFilters.addEventListener('click', function() {
            sidebar.classList.remove('open');
        });
    }

    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 950 && sidebar && sidebar.classList.contains('open')) {
            if (!sidebar.contains(e.target) && !filterToggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        }
    });

    function handleURLParams() {
        var params = new URLSearchParams(window.location.search);
        var brand = params.get('brand');
        if (brand) {
            var brandMap = {
                'atos': 'atos',
                'emka': 'emka',
                'siemens': 'siemens',
                'mesan': 'mesan'
            };
            var mapped = brandMap[brand.toLowerCase()];
            if (mapped) {
                var radio = document.querySelector('input[name="brand"][value="' + mapped + '"]');
                if (radio) {
                    radio.checked = true;
                    currentBrandFilter = mapped;
                }
            }
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        console.log('📦 Arman Tejarat - Loading products from database...');
        loadProductsFromAPI().then(function() {
            handleURLParams();
            updateCatalog();
        });
    });

    console.log('📦 Arman Tejarat - Products catalog loaded from database!');
})();