
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
            console.log(`✅ ${catalog.length} محصول از دیتابیس بارگذاری شد!`);
            updateCatalog();
        } else {
            console.error('❌ خطا در دریافت محصولات:', data.message);
        }
    } catch (error) {
        console.error('❌ خطا در ارتباط با سرور:', error);
    }
}



function getMainImage(product) {
    return (product.images && product.images.length)
        ? product.images[0]
        : '';
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



const catalog = [
    // ===== ATOS - KILIT =====
    {
        id: 1,
        name: 'قفل صنعتی Atos',
        model: 'KY13.1.5.61.1',
        brand: 'atos',
        category: 'kilit',
        images: [
            'products/Atos/Kilit/Atos-KY13.1.5.61.1-1.jpeg',
            'products/Atos/Kilit/Atos-KY13.1.5.61.1-2.jpeg',
            'products/Atos/Kilit/Atos-KY13.1.5.61.1-3.jpeg'
        ],
        description: 'قفل صنعتی باکیفیت از برند Atos، مناسب برای کابینت‌های صنعتی و تجهیزات حساس.',
        specs: {
            'برند': 'Atos',
            'مدل': 'KY13.1.5.61.1',
            'نوع': 'قفل صنعتی',
            'جنس بدنه': 'فلز مقاوم',
            'کاربرد': 'کابینت‌های صنعتی، تابلوهای برق'
        }
    },
    // ===== ATOS - MENTESE =====
    {
        id: 2,
        name: 'لولا صنعتی Atos',
        model: 'MG35.2.1.V2',
        brand: 'atos',
        category: 'mentese',
        images: [
            'products/Atos/Mentese/Atos-MG35.2.1.V2-1.jpeg',
            'products/Atos/Mentese/Atos-MG35.2.1.V2-2.jpeg',
            'products/Atos/Mentese/Atos-MG35.2.1.V2-3.jpeg',
            'products/Atos/Mentese/Atos-MG35.2.1.V2-4.jpeg'
        ],
        description: 'لولا صنعتی فوق‌مقاوم از برند Atos، مناسب برای درب‌های سنگین صنعتی و کابینت‌های فلزی.',
        specs: {
            'برند': 'Atos',
            'مدل': 'MG35.2.1.V2',
            'نوع': 'لولا صنعتی',
            'جنس بدنه': 'فلز سنگین',
            'کاربرد': 'درب‌های صنعتی، کابینت‌های فلزی'
        }
    },
    // ===== EMKA - CONTA =====
    {
        id: 3,
        name: 'واشر صنعتی Emka',
        model: '1011-06 / 1011-05',
        brand: 'emka',
        category: 'conta',
        images: [
            'products/Emka/Conta/Emka-1011-06 & 1011-05.jpeg'
        ],
        description: 'واشر صنعتی باکیفیت از برند Emka، مناسب برای آب‌بندی و عایق‌کاری در تجهیزات صنعتی و الکتریکی.',
        specs: {
            'برند': 'Emka',
            'مدل': '1011-06 / 1011-05',
            'نوع': 'واشر صنعتی',
            'جنس': 'لاستیک مقاوم',
            'کاربرد': 'آب‌بندی، عایق‌کاری'
        }
    },
    {
        id: 4,
        name: 'واشر صنعتی Emka',
        model: '1011-S154',
        brand: 'emka',
        category: 'conta',
        images: [
            'products/Emka/Conta/Emka-1011-S154 (1).jpeg',
            'products/Emka/Conta/Emka-1011-S154 (2).jpeg'
        ],
        description: 'واشر صنعتی Emka مدل 1011-S154، مناسب برای آب‌بندی در تابلوهای برق و تجهیزات حساس صنعتی.',
        specs: {
            'برند': 'Emka',
            'مدل': '1011-S154',
            'نوع': 'واشر صنعتی',
            'جنس': 'لاستیک مقاوم',
            'کاربرد': 'تابلوهای برق، تجهیزات حساس'
        }
    },
    {
        id: 5,
        name: 'واشر صنعتی Emka',
        model: '1003-11-N',
        brand: 'emka',
        category: 'conta',
        images: [
            'products/Emka/Conta/Emka_1003-11-N.jpeg'
        ],
        description: 'واشر صنعتی Emka مدل 1003-11-N، طراحی شده برای عایق‌کاری و محافظت از تجهیزات در برابر گرد و غبار و رطوبت.',
        specs: {
            'برند': 'Emka',
            'مدل': '1003-11-N',
            'نوع': 'واشر صنعتی',
            'جنس': 'لاستیک مقاوم',
            'کاربرد': 'عایق‌کاری، محافظت در برابر گرد و غبار'
        }
    },
    {
        id: 6,
        name: 'واشر صنعتی Emka',
        model: '1011-05',
        brand: 'emka',
        category: 'conta',
        images: [
            'products/Emka/Conta/Emka_1011-05.jpeg'
        ],
        description: 'واشر صنعتی Emka مدل 1011-05، با کیفیت ساخت بالا و مقاومت عالی در برابر عوامل محیطی.',
        specs: {
            'برند': 'Emka',
            'مدل': '1011-05',
            'نوع': 'واشر صنعتی',
            'جنس': 'لاستیک مقاوم',
            'کاربرد': 'آب‌بندی صنعتی'
        }
    },
    {
        id: 7,
        name: 'واشر صنعتی Emka',
        model: '1011-34-N',
        brand: 'emka',
        category: 'conta',
        images: [
            'products/Emka/Conta/Emka_1011-34-N.jpeg'
        ],
        description: 'واشر صنعتی Emka مدل 1011-34-N، مناسب برای آب‌بندی در صنایع الکترونیک و تجهیزات حساس.',
        specs: {
            'برند': 'Emka',
            'مدل': '1011-34-N',
            'نوع': 'واشر صنعتی',
            'جنس': 'لاستیک مقاوم',
            'کاربرد': 'صنایع الکترونیک، تجهیزات حساس'
        }
    },
    {
        id: 8,
        name: 'واشر صنعتی Emka',
        model: '1011-34',
        brand: 'emka',
        category: 'conta',
        images: [
            'products/Emka/Conta/Emka_1011-34.jpeg'
        ],
        description: 'واشر صنعتی Emka مدل 1011-34، با طراحی دقیق برای عایق‌کاری و محافظت از تجهیزات صنعتی.',
        specs: {
            'برند': 'Emka',
            'مدل': '1011-34',
            'نوع': 'واشر صنعتی',
            'جنس': 'لاستیک مقاوم',
            'کاربرد': 'عایق‌کاری صنعتی'
        }
    },
    {
        id: 9,
        name: 'واشر صنعتی Emka',
        model: 'GM2450-N',
        brand: 'emka',
        category: 'conta',
        images: [
            'products/Emka/Conta/Emka_GM2450-N.jpeg'
        ],
        description: 'واشر صنعتی Emka مدل GM2450-N، مقاوم در برابر حرارت و مواد شیمیایی، مناسب برای صنایع سنگین.',
        specs: {
            'برند': 'Emka',
            'مدل': 'GM2450-N',
            'نوع': 'واشر صنعتی',
            'جنس': 'لاستیک مقاوم به حرارت',
            'کاربرد': 'صنایع سنگین، مقاوم به مواد شیمیایی'
        }
    },
    {
        id: 10,
        name: 'واشر صنعتی Emka',
        model: 'GM2540',
        brand: 'emka',
        category: 'conta',
        images: [
            'products/Emka/Conta/Emka_GM2540.jpeg'
        ],
        description: 'واشر صنعتی Emka مدل GM2540، با کیفیت ساخت عالی و عملکرد قابل اعتماد در شرایط سخت صنعتی.',
        specs: {
            'برند': 'Emka',
            'مدل': 'GM2540',
            'نوع': 'واشر صنعتی',
            'جنس': 'لاستیک مقاوم',
            'کاربرد': 'شرایط سخت صنعتی'
        }
    },
    {
        id: 11,
        name: 'واشر صنعتی Emka',
        model: 'GM2566',
        brand: 'emka',
        category: 'conta',
        images: [
            'products/Emka/Conta/Emka_GM2566.jpeg'
        ],
        description: 'واشر صنعتی Emka مدل GM2566، طراحی شده برای آب‌بندی و عایق‌کاری در تجهیزات صنعتی پیشرفته.',
        specs: {
            'برند': 'Emka',
            'مدل': 'GM2566',
            'نوع': 'واشر صنعتی',
            'جنس': 'لاستیک مقاوم',
            'کاربرد': 'تجهیزات صنعتی پیشرفته'
        }
    },
    // ===== EMKA - KILIT =====
    {
        id: 12,
        name: 'قفل صنعتی Emka',
        model: '1031-U12',
        brand: 'emka',
        category: 'kilit',
        images: [
            'products/Emka/Kilit/Emka-1031-U12-3.jpeg',
            'products/Emka/Kilit/Emka-1031-U12.jpeg'
        ],
        description: 'قفل صنعتی Emka مدل 1031-U12، با مکانیزم قفل‌گذاری ایمن و بدنه مقاوم.',
        specs: {
            'برند': 'Emka',
            'مدل': '1031-U12',
            'نوع': 'قفل صنعتی',
            'جنس بدنه': 'فلز مقاوم',
            'کاربرد': 'کابینت‌های صنعتی، تابلوهای برق'
        }
    },
    {
        id: 13,
        name: 'قفل صنعتی Emka',
        model: '1091-U143',
        brand: 'emka',
        category: 'kilit',
        images: [
            'products/Emka/Kilit/Emka-1091-U143.jpeg'
        ],
        description: 'قفل صنعتی Emka مدل 1091-U143، طراحی شده برای امنیت بالا در تجهیزات حساس صنعتی و الکتریکی.',
        specs: {
            'برند': 'Emka',
            'مدل': '1091-U143',
            'نوع': 'قفل صنعتی',
            'جنس بدنه': 'فلز مقاوم',
            'کاربرد': 'امنیت بالا، تجهیزات حساس'
        }
    },
    {
        id: 14,
        name: 'قفل صنعتی Emka',
        model: '1130-U2',
        brand: 'emka',
        category: 'kilit',
        images: [
            'products/Emka/Kilit/Emka-1130-U2-1.jpeg',
            'products/Emka/Kilit/Emka-1130-U2-2.jpeg',
            'products/Emka/Kilit/Emka-1130-U2-3.jpeg'
        ],
        description: 'قفل صنعتی Emka مدل 1130-U2، با کیفیت ساخت بالا و مکانیزم قفل‌گذاری پیشرفته.',
        specs: {
            'برند': 'Emka',
            'مدل': '1130-U2',
            'نوع': 'قفل صنعتی',
            'جنس بدنه': 'فلز مقاوم',
            'کاربرد': 'صنایع مختلف'
        }
    },
    {
        id: 15,
        name: 'قفل صنعتی Emka',
        model: '1150-SU-61',
        brand: 'emka',
        category: 'kilit',
        images: [
            'products/Emka/Kilit/Emka-1150-SU-61.jpeg'
        ],
        description: 'قفل صنعتی Emka مدل 1150-SU-61، با طراحی خاص و عملکرد مطمئن، مناسب برای تجهیزات صنعتی حساس.',
        specs: {
            'برند': 'Emka',
            'مدل': '1150-SU-61',
            'نوع': 'قفل صنعتی',
            'جنس بدنه': 'فلز مقاوم',
            'کاربرد': 'تجهیزات صنعتی حساس'
        }
    },
    {
        id: 21,
        name: 'قفل صنعتی Emka',
        model: 'Emka-Kilit',
        brand: 'emka',
        category: 'kilit',
        images: [
            'products/Emka/Kilit/Emka-Kilit-2.jpeg',
            'products/Emka/Kilit/Emka-Kilit.jpeg',
            'products/Emka/Kilit/IMG_8039.jpeg',
            'products/Emka/Kilit/KILIT2.jpeg',
            'products/Emka/Kilit/KILIT3.jpeg',
            'products/Emka/Kilit/Kiliti1.jpeg'
        ],
        description: 'قفل صنعتی Emka با کیفیت ساخت بالا، مناسب برای کابینت‌های صنعتی، تابلوهای برق و تجهیزات حساس.',
        specs: {
            'برند': 'Emka',
            'مدل': 'Emka-Kilit',
            'نوع': 'قفل صنعتی',
            'جنس بدنه': 'فلز مقاوم',
            'کاربرد': 'کابینت‌های صنعتی، تابلوهای برق'
        }
    },
    // ===== SIEMENS - DAMPER =====
    {
        id: 16,
        name: 'دمپر صنعتی Siemens',
        model: 'GCA166.1E',
        brand: 'siemens',
        category: 'damper',
        images: [
            'products/Siemens/Damper/SIEMENS-GCA166.1E-1.jpeg',
            'products/Siemens/Damper/SIEMENS-GCA166.1E-2.jpeg',
            'products/Siemens/Damper/SIEMENS-GCA166.1E-3.jpeg'
        ],
        description: 'دمپر صنعتی Siemens مدل GCA166.1E، برای کنترل جریان هوا در سیستم‌های تهویه و HVAC با دقت بالا.',
        specs: {
            'برند': 'Siemens',
            'مدل': 'GCA166.1E',
            'نوع': 'دمپر صنعتی',
            'کاربرد': 'سیستم‌های تهویه و HVAC',
            'ویژگی': 'دقت بالا'
        }
    },
    {
        id: 17,
        name: 'دمپر صنعتی Siemens',
        model: 'GGA126.1E.10',
        brand: 'siemens',
        category: 'damper',
        images: [
            'products/Siemens/Damper/SIEMENS-GGA126.1E.10-1.jpeg',
            'products/Siemens/Damper/SIEMENS-GGA126.1E.10-2.jpeg',
            'products/Siemens/Damper/SIEMENS-GGA126.1E.10-3.jpeg',
            'products/Siemens/Damper/SIEMENS-GGA126.1E.10-4.jpeg',
            'products/Siemens/Damper/SIEMENS-GGA126.1E.10-5.jpeg'
        ],
        description: 'دمپر صنعتی Siemens مدل GGA126.1E.10، با عملکرد دقیق و قابل اعتماد برای سیستم‌های کنترل هوای صنعتی.',
        specs: {
            'برند': 'Siemens',
            'مدل': 'GGA126.1E.10',
            'نوع': 'دمپر صنعتی',
            'کاربرد': 'سیستم‌های کنترل هوای صنعتی',
            'ویژگی': 'عملکرد دقیق و قابل اعتماد'
        }
    },
    {
        id: 18,
        name: 'دمپر صنعتی Siemens',
        model: 'GMA126.1E',
        brand: 'siemens',
        category: 'damper',
        images: [
            'products/Siemens/Damper/SIEMENS-GMA126.1E-1.jpeg',
            'products/Siemens/Damper/SIEMENS-GMA126.1E-2.jpeg'
        ],
        description: 'دمپر صنعتی Siemens مدل GMA126.1E، مناسب برای سیستم‌های تهویه و کنترل جریان هوا با دقت بالا.',
        specs: {
            'برند': 'Siemens',
            'مدل': 'GMA126.1E',
            'نوع': 'دمپر صنعتی',
            'کاربرد': 'سیستم‌های تهویه و کنترل جریان هوا',
            'ویژگی': 'دقت بالا'
        }
    },
    {
        id: 19,
        name: 'دمپر صنعتی Siemens',
        model: 'GNA326.1E.12',
        brand: 'siemens',
        category: 'damper',
        images: [
            'products/Siemens/Damper/SIEMENS-GNA326.1E.12-1.jpeg',
            'products/Siemens/Damper/SIEMENS-GNA326.1E.12-2.jpeg',
            'products/Siemens/Damper/SIEMENS-GNA326.1E.12-3.jpeg',
            'products/Siemens/Damper/SIEMENS-GNA326.1E.12-4.jpeg'
        ],
        description: 'دمپر صنعتی Siemens مدل GNA326.1E.12، با کیفیت ساخت عالی و عملکرد قابل اعتماد در سیستم‌های HVAC.',
        specs: {
            'برند': 'Siemens',
            'مدل': 'GNA326.1E.12',
            'نوع': 'دمپر صنعتی',
            'کاربرد': 'سیستم‌های HVAC',
            'ویژگی': 'کیفیت ساخت عالی'

        }
    },
    {
        id: 20,
        name: 'سنسور دما Siemens',
        model: 'QFA2060D',
        brand: 'siemens',
        category: 'damper',
        images: [
            'products/Siemens/Damper/SIEMENS-QFA2060D-1.jpeg',
            'products/Siemens/Damper/SIEMENS-QFA2060D-2.jpeg',
            'products/Siemens/Damper/SIEMENS-QFA2060D-3.jpeg'
        ],
        description: 'سنسور دما Siemens مدل QFA2060D، برای اندازه‌گیری دقیق دما در سیستم‌های تهویه و کنترل هوای صنعتی.',
        specs: {
            'برند': 'Siemens',
            'مدل': 'QFA2060D',
            'نوع': 'سنسور دما',
            'کاربرد': 'سیستم‌های تهویه و کنترل هوا',
            'ویژگی': 'اندازه‌گیری دقیق دما'
        }
    },
    {
        id: 22,
        name: 'دمپر صنعتی Siemens',
        model: 'GMA-26.1E',
        brand: 'siemens',
        category: 'damper',
        images: [
            'products/Siemens/Damper/SIEMENS-GMA-26.1E-3.jpeg'
        ],
        description: 'دمپر صنعتی Siemens مدل GMA-26.1E، مناسب برای سیستم‌های تهویه و کنترل جریان هوا.',
        specs: {
            'برند': 'Siemens',
            'مدل': 'GMA-26.1E',
            'نوع': 'دمپر صنعتی',
            'کاربرد': 'سیستم‌های تهویه و کنترل جریان هوا'
        }
    },
    {
        id: 23,
        name: 'دمپر صنعتی Siemens',
        model: 'SIEMENS-Damper',
        brand: 'siemens',
        category: 'damper',
        images: [
            'products/Siemens/Damper/SIEMENS-Damper.jpeg'
        ],
        description: 'دمپر صنعتی Siemens با کیفیت ساخت عالی، مناسب برای سیستم‌های تهویه و کنترل هوای صنعتی.',
        specs: {
            'برند': 'Siemens',
            'مدل': 'SIEMENS-Damper',
            'نوع': 'دمپر صنعتی',
            'کاربرد': 'سیستم‌های تهویه و کنترل هوای صنعتی'
        }
    }
];


/* =========================================
   HELPERS
========================================= */

function getMainImage(product) {
    return (product.images && product.images.length)
        ? product.images[0]
        : '';
}

function getSpecsHTML(specs) {
    if (!specs || !Object.keys(specs).length) return '';
    let html = '<div class="product-specs">';
    for (const [key, value] of Object.entries(specs)) {
        html += `<span><i class="fa-solid fa-circle"></i> ${key}: ${value}</span>`;
    }
    html += '</div>';
    return html;
}


/* =========================================
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


/* =========================================
   GALLERY / MODAL
========================================= */

let galleryImages = [];
let galleryIndex = 0;

function openGallery(product) {
    galleryImages = product.images || [];
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


/* =========================================
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

let currentBrandFilter = 'all';
let currentSearch = '';
let currentSort = 'default';


/* =========================================
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


/* =========================================
   EVENT LISTENERS
========================================= */

// Brand filters (radio buttons)
document.querySelectorAll('input[name="brand"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        currentBrandFilter = e.target.value;
        updateCatalog();
        // Close sidebar on mobile after selecting
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
        // Reset brand radio
        const allRadio = document.querySelector('input[name="brand"][value="all"]');
        if (allRadio) allRadio.checked = true;
        currentBrandFilter = 'all';

        // Reset search
        if (searchInput) {
            searchInput.value = '';
            currentSearch = '';
            if (clearSearch) clearSearch.style.display = 'none';
        }

        // Reset sort
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


/* =========================================
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
    updateCatalog();
}


/* =========================================
   INIT
========================================= */

document.addEventListener('DOMContentLoaded', () => {
    handleURLParams();
});


/* =========================================
   PRODUCTS PAGE SPECIFIC (if needed)
========================================= */

console.log('📦 Arman Tejarat - Products catalog loaded!');


