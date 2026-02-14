/**
 * LUXE - Luxury Men's E-commerce
 * Vanilla JS Implementation
 */

// ================== STATE ==================
const state = {
    products: [],
    cart: JSON.parse(localStorage.getItem('luxe_cart')) || [],
    wishlist: JSON.parse(localStorage.getItem('luxe_wishlist')) || [],
    currentCategory: 'all',
    searchQuery: '',
    modalProduct: null,
    modalQty: 1,
    visibleCount: 8 // Start with 8 items (1 category worth)
};

// ================== DOM ELEMENTS ==================
const dom = {
    loadingScreen: document.getElementById('loading-screen'),
    navbar: document.getElementById('navbar'),
    productContainer: document.getElementById('product-container'),
    productCount: document.getElementById('product-count'),
    loadMoreBtn: document.getElementById('load-more'),
    cartDrawer: document.getElementById('cart-drawer'),
    wishlistDrawer: document.getElementById('wishlist-drawer'),
    overlay: document.getElementById('overlay'),

    hero: document.getElementById('hero'),
    checkoutView: document.getElementById('checkout-view'),
    cartCount: document.getElementById('cart-count'),
    cartDrawerCount: document.getElementById('cart-drawer-count'),
    wishlistCount: document.getElementById('wishlist-count'),
    cartItems: document.getElementById('cart-items'),
    wishlistItems: document.getElementById('wishlist-items'),
    cartSubtotal: document.getElementById('cart-subtotal'),
    checkoutSubtotal: document.getElementById('checkout-subtotal'),
    checkoutTotal: document.getElementById('checkout-total'),
    checkoutItems: document.getElementById('checkout-items'),
    searchBar: document.getElementById('search-bar'),
    searchInput: document.getElementById('search-input'),
    searchResults: document.getElementById('search-results'),
    mobileMenu: document.getElementById('mobile-menu'),
    mobileMenuBtn: document.getElementById('mobile-menu-btn'),
    modal: document.getElementById('product-modal'),
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toast-message')
};

// ================== HELPER FUNCTIONS ==================
const formatPrice = (price) => {
    // "fr-MA" uses space as separator (e.g. 1 299)
    // If you explicitly want "1,299", use "en-US" or "en-MA" if supported, or generic "em-US" with MAD suffix.
    // User requested "1,299 MAD" specifically in text, but suggested toLocaleString("fr-MA"). 
    // fr-MA usually formats as "1 299". I will trust the visual requirement "1,299" more if forced, 
    // but the code instruction says `return price.toLocaleString("fr-MA") + " MAD";`.
    // I will use "en-US" for the comma to match the visual "1,299" request exactly, 
    // or just strictly follow the code instruction `toLocaleString("fr-MA")`.
    // Let's follow the user's specific code block instruction.
    return price.toLocaleString("fr-MA") + " MAD";
};

// ================== PRODUCT DATA ==================
const generateProducts = () => {
    return [
        // --- T-SHIRTS (8) ---
        { id: 101, name: "Midnight Silk Tee", category: "t-shirts", price: 599, image: "./assets/images/1midnight silk tee.jpg", description: "Premium silk blend tee.", sizes: ["S", "M", "L", "XL"], stock: 15 },
        { id: 102, name: "Signature Polo", category: "t-shirts", price: 499, image: "./assets/images/2signature polo.jpg", description: "Classic piqué polo with gold accent.", sizes: ["S", "M", "L"], stock: 25 },
        { id: 103, name: "Essential White Tee", category: "t-shirts", price: 250, image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=800&auto=format&fit=crop", description: "High-weight cotton basic.", sizes: ["S", "M", "L", "XL"], stock: 50 },
        { id: 104, name: "Onyx V-Neck", category: "t-shirts", price: 350, image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800&auto=format&fit=crop", description: "Deep V-neck for a sharp look.", sizes: ["M", "L"], stock: 12 },
        { id: 105, name: "Charcoal Henley", category: "t-shirts", price: 350, image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop", description: "Textured henley with button details.", sizes: ["S", "M", "L", "XL"], stock: 18 },
        { id: 106, name: "Bamboo Fiber Tee", category: "t-shirts", price: 210, image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop", description: "Eco-friendly ultra-soft fabric.", sizes: ["M", "L", "XL"], stock: 30 },
        { id: 107, name: "Vintage Wash Tee", category: "t-shirts", price: 79, image: "./assets/images/7.jpg", description: "Distressed look for casual wear.", sizes: ["S", "M", "L"], stock: 20 },
        { id: 108, name: "Striped Mariner", category: "t-shirts", price: 850, image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800&auto=format&fit=crop", description: "Classic nautical stripes.", sizes: ["M", "L"], stock: 15 },

        // --- SHIRTS (8) ---
        { id: 201, name: "Oxford Elite Shirt", category: "shirts", price: 1850, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop", description: "Structured tailoring.", sizes: ["S", "M", "L", "XL"], stock: 20 },
        { id: 202, name: "Heritage Linen Shirt", category: "shirts", price: 1600, image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop", description: "Breathable linen for summer.", sizes: ["S", "M", "L", "XL"], stock: 18 },
        { id: 203, name: "Royal Blue Dress Shirt", category: "shirts", price: 1450, image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop", description: "Perfect for formal events.", sizes: ["38", "40", "42"], stock: 10 },
        { id: 204, name: "Grandad Collar Shirt", category: "shirts", price: 1350, image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=800&auto=format&fit=crop", description: "Modern collarless design.", sizes: ["M", "L", "XL"], stock: 15 },
        { id: 205, name: "Satin Evening Shirt", category: "shirts", price: 2200, image: "https://images.unsplash.com/photo-1620012253295-c15cc3fe5d3d?q=80&w=800&auto=format&fit=crop", description: "Luxurious satin finish.", sizes: ["S", "M", "L"], stock: 8 },
        { id: 206, name: "Checked Flannel", category: "shirts", price: 1250, image: "https://images.unsplash.com/photo-1618354691229-88d47f285158?q=80&w=800&auto=format&fit=crop", description: "Premium warm flannel.", sizes: ["M", "L", "XL"], stock: 25 },
        { id: 207, name: "Slim Fit Poplin", category: "shirts", price: 1500, image: "https://images.unsplash.com/photo-1603252109303-2751440a9a79?q=80&w=800&auto=format&fit=crop", description: "Crisp white poplin.", sizes: ["38", "40", "42", "44"], stock: 30 },
        { id: 208, name: "Denim Western Shirt", category: "shirts", price: 1750, image: "https://images.unsplash.com/photo-1584030318776-08b796a630ec?q=80&w=800&auto=format&fit=crop", description: "Rugged yet refined.", sizes: ["M", "L", "XL"], stock: 12 },

        // --- PANTS (8) ---
        { id: 301, name: "Noir Tapered Chinos", category: "pants", price: 1250, image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop", description: "Versatile office to evening wear.", sizes: ["30", "32", "34", "36"], stock: 12 },
        { id: 302, name: "Italian Wool Trousers", category: "pants", price: 2450, image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop", description: "Premium wool fabric.", sizes: ["32", "34", "36"], stock: 8 },
        { id: 303, name: "Tech Commuter Pants", category: "pants", price: 1100, image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop", description: "Stretch fabric for movement.", sizes: ["30", "32", "34"], stock: 20 },
        { id: 304, name: "Selvedge Denim Jeans", category: "pants", price: 1899, image: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?q=80&w=800&auto=format&fit=crop", description: "Japanese denim construction.", sizes: ["30", "32", "34", "36"], stock: 15 },
        { id: 305, name: "Linen Drawstring Trousers", category: "pants", price: 1350, image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=800&auto=format&fit=crop", description: "Relaxed fit for summer.", sizes: ["M", "L"], stock: 18 },
        { id: 306, name: "Cargo Joggers", category: "pants", price: 999, image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=800&auto=format&fit=crop", description: "Utility meets luxury.", sizes: ["S", "M", "L"], stock: 25 },
        { id: 307, name: "Pleated Dress Pants", category: "pants", price: 1650, image: "https://images.unsplash.com/photo-1506629082955-511b1aa00272?q=80&w=800&auto=format&fit=crop", description: "Classic pleated front.", sizes: ["32", "34", "36"], stock: 10 },
        { id: 308, name: "Corduroy Slacks", category: "pants", price: 1400, image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop", description: "Vintage inspired texture.", sizes: ["30", "32", "34"], stock: 14 },

        // --- JACKETS (8) ---
        { id: 401, name: "Obsidian Bomber", category: "jackets", price: 4500, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop", description: "Gold hardware details.", sizes: ["M", "L", "XL"], stock: 8 },
        { id: 402, name: "Executive Blazer", category: "jackets", price: 5900, image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop", description: "Tailored fit.", sizes: ["38", "40", "42"], stock: 7 },
        { id: 403, name: "Suede Trucker", category: "jackets", price: 3800, image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=800&auto=format&fit=crop", description: "Genuine suede leather.", sizes: ["M", "L", "XL"], stock: 5 },
        { id: 404, name: "Tech Trench Coat", category: "jackets", price: 4200, image: "https://images.unsplash.com/photo-1544923246-77307dd654cb?q=80&w=800&auto=format&fit=crop", description: "Waterproof city coat.", sizes: ["M", "L"], stock: 10 },
        { id: 405, name: "Double Breasted Peacoat", category: "jackets", price: 4800, image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=800&auto=format&fit=crop", description: "Winter essential.", sizes: ["M", "L", "XL"], stock: 6 },
        { id: 406, name: "Denim Sherpa", category: "jackets", price: 2100, image: "./assets/images/denim .jpg", description: "Lined for warmth.", sizes: ["S", "M", "L"], stock: 15 },
        { id: 407, name: "Puffer Down Gilet", category: "jackets", price: 1950, image: "./assets/images/puffer .jpg", description: "Lightweight layering.", sizes: ["M", "L", "XL"], stock: 20 },
        { id: 408, name: "Varsity Letterman", category: "jackets", price: 2600, image: "https://images.unsplash.com/photo-1559551409-dadc959f76b8?q=80&w=800&auto=format&fit=crop", description: "Retro collegiate style.", sizes: ["M", "L"], stock: 9 },

        // --- SHOES (8) ---
        { id: 501, name: "Vanguard Leather Boots", category: "shoes", price: 3200, image: "./assets/images/Vanguard.jpg", description: "Rugged durability.", sizes: ["8", "9", "10", "11"], stock: 10 },
        { id: 502, name: "Urban Chelsea Boots", category: "shoes", price: 2800, image: "./assets/images/Urban.jpg", description: "Sleek city wear.", sizes: ["8", "9", "10", "11"], stock: 15 },
        { id: 503, name: "Minimalist Loafers", category: "shoes", price: 2400, image: "./assets/images/Minimalist.jpg", description: "Classic silhouette.", sizes: ["9", "10", "11"], stock: 12 },
        { id: 504, name: "Monk Strap Dress Shoes", category: "shoes", price: 3500, image: "https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?q=80&w=800&auto=format&fit=crop", description: "Double buckle elegance.", sizes: ["8", "9", "10"], stock: 8 },
        { id: 505, name: "Low Top Sneakers", category: "shoes", price: 1800, image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=800&auto=format&fit=crop", description: "Premium white leather.", sizes: ["7", "8", "9", "10", "11"], stock: 25 },
        { id: 506, name: "High Top Trainers", category: "shoes", price: 2100, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop", description: "Streetwear aesthetic.", sizes: ["8", "9", "10", "11"], stock: 18 },
        { id: 507, name: "Oxford Brogues", category: "shoes", price: 2900, image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop", description: "Detailed perforation.", sizes: ["9", "10", "11"], stock: 10 },
        { id: 508, name: "Suede Desert Boots", category: "shoes", price: 2300, image: "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?q=80&w=800&auto=format&fit=crop", description: "Casual comfort.", sizes: ["8", "9", "10", "11"], stock: 14 },

        // --- WATCHES (8) ---
        { id: 601, name: "Chronos Gold Edition", category: "watches", price: 12500, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=800&auto=format&fit=crop", description: "Gold plated luxury.", sizes: ["One Size"], stock: 5 },
        { id: 602, name: "Apex Chronograph", category: "watches", price: 8900, image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=800&auto=format&fit=crop", description: "Precision engineering.", sizes: ["One Size"], stock: 8 },
        { id: 603, name: "Diver Pro 300m", category: "watches", price: 10500, image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=800&auto=format&fit=crop", description: "Professional dive watch.", sizes: ["One Size"], stock: 4 },
        { id: 604, name: "Minimalist Dress Watch", category: "watches", price: 4500, image: "./assets/images/Minximalist.jpg", description: "Understated elegance.", sizes: ["One Size"], stock: 15 },
        { id: 605, name: "Aviator Automatic", category: "watches", price: 7800, image: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=800&auto=format&fit=crop", description: "Pilot inspired.", sizes: ["One Size"], stock: 6 },
        { id: 606, name: "Smart Lux Hybrid", category: "watches", price: 5600, image: "./assets/images/Smart.jpg", description: "Connected technology.", sizes: ["One Size"], stock: 20 },
        { id: 607, name: "Vintage Field Watch", category: "watches", price: 3200, image: "./assets/images/Vintage.jpg", description: "Retro military style.", sizes: ["One Size"], stock: 12 },
        { id: 608, name: "Skeleton Mechanical", category: "watches", price: 15000, image: "./assets/images/Skeleton.jpg", description: "Exposed movement.", sizes: ["One Size"], stock: 3 },
    ];
};

// ================== INITIALIZATION ==================
const init = () => {
    state.products = generateProducts();
    updateCartUI();
    updateWishlistUI();

    state.visibleCount = 8; // Step 4: Show 8 items initially (1 category)
    renderProducts();

    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Mobile menu handling
            if (dom.mobileMenu && dom.mobileMenu.classList.contains('menu-open')) {
                dom.mobileMenu.classList.remove('menu-open');
            }
            const category = btn.dataset.cat;
            filterProducts(category);
        });
    });

    dom.loadMoreBtn.addEventListener('click', () => {
        state.visibleCount += 4; // Load more in chunks of 4 (fits 2x2 or 4x1)
        renderProducts();
    });

    if (dom.loadingScreen) {
        setTimeout(() => {
            dom.loadingScreen.classList.add('opacity-0');
            setTimeout(() => {
                dom.loadingScreen.style.display = 'none';
            }, 1000);
        }, 1500);
    }
};

// ================== RENDER PRODUCTS ==================
const renderProducts = () => {
    dom.productContainer.innerHTML = '';

    let filtered = state.products;

    if (state.currentCategory !== 'all') {
        filtered = filtered.filter(p => p.category === state.currentCategory);
    }

    if (state.searchQuery) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(state.searchQuery.toLowerCase()));
    }

    const visibleProducts = filtered.slice(0, state.visibleCount);

    // Step 5: Update product count display
    dom.productCount.textContent = `Showing ${filtered.length} Products`;

    if (visibleProducts.length === 0) {
        dom.productContainer.innerHTML = `
            <div class="col-span-1 md:col-span-3 text-center py-20">
                <p class="text-gray-500 font-serif text-2xl">No products found.</p>
                <button onclick="filterProducts('all')" class="mt-4 text-gold hover:text-white underline">Reset Filters</button>
            </div>
        `;
        dom.loadMoreBtn.classList.add('hidden');
        return;
    }

    visibleProducts.forEach((product, index) => {
        const delay = index * 50;

        const card = document.createElement('div');
        card.className = `product-card group relative bg-transparent animate-[fadeInUp_0.5s_ease-out_forwards]`;
        card.style.animationDelay = `${delay}ms`;

        // Step 3: Update Price Display in Card
        card.innerHTML = `
            <div class="product-image relative w-full h-[450px] overflow-hidden bg-gray-900 cursor-pointer" onclick="openProductModal(${product.id})">
                <img src="${product.image}" loading="lazy" alt="${product.name}" class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 opacity-90 group-hover:opacity-100">
                <div class="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300"></div>
                
                <div class="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/90 to-transparent flex flex-col gap-2">
                    <button onclick="event.stopPropagation(); addToCart(${product.id})" class="w-full bg-white text-black py-3 uppercase text-xs font-bold tracking-widest hover:bg-gold transition-colors">
                        Add to Cart
                    </button>
                     <button onclick="event.stopPropagation(); openProductModal(${product.id})" class="w-full bg-transparent border border-white/30 text-white py-3 uppercase text-xs font-bold tracking-widest hover:bg-white/10 hover:border-white transition-colors backdrop-blur-sm">
                        Quick View
                    </button>
                </div>

                <button onclick="event.stopPropagation(); toggleWishlist(${product.id})" class="absolute top-4 right-4 text-white hover:text-gold transition-transform hover:scale-110 z-10 p-2 rounded-full bg-black/20 backdrop-blur-sm">
                    ${isInWishlist(product.id) ?
                '<svg class="w-5 h-5 fill-gold text-gold" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>' :
                '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>'
            }
                </button>
                
                ${product.stock < 10 ? `<span class="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">Limited</span>` : ''}

            </div>
            <div class="mt-4 text-center">
                <p class="text-xs text-gray-500 uppercase tracking-widest mb-1">${product.category}</p>
                <h3 class="text-white font-serif text-lg tracking-wide group-hover:text-gold transition-colors cursor-pointer" onclick="openProductModal(${product.id})">${product.name}</h3>
                <p class="text-gold mt-1 font-semibold">${formatPrice(product.price)}</p>
            </div>
        `;
        dom.productContainer.appendChild(card);
    });

    if (visibleProducts.length >= filtered.length) {
        dom.loadMoreBtn.classList.add('hidden');
    } else {
        dom.loadMoreBtn.classList.remove('hidden');
    }
};

// ================== FILTER SYSTEM ==================
// ================== FILTER SYSTEM ==================
const filterProducts = (category) => {
    state.currentCategory = category;
    state.visibleCount = 8; // Reset to 8

    document.querySelectorAll('.category-btn').forEach(btn => {
        if (btn.dataset.cat === category) {
            btn.classList.add('text-gold', 'font-medium');
            btn.classList.remove('text-gray-400');
        } else {
            btn.classList.remove('text-gold', 'font-medium');
            btn.classList.add('text-gray-400');
        }
    });

    state.searchQuery = '';
    if (dom.searchInput) dom.searchInput.value = '';

    renderProducts();
};

// ================== NAVIGATION & UI LOGIC ==================
const showHome = () => {
    dom.checkoutView.classList.add('hidden');
    dom.hero.classList.remove('hidden');
    document.getElementById('products-section').classList.remove('hidden');

    closeDrawers();
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        dom.navbar.classList.add('py-4', 'shadow-lg');
        dom.navbar.classList.remove('py-6');
    } else {
        dom.navbar.classList.add('py-6');
        dom.navbar.classList.remove('py-4', 'shadow-lg');
    }
});

// ================== MODAL SYSTEM ==================
const openProductModal = (id) => {
    const product = state.products.find(p => p.id === id);
    if (!product) return;

    state.modalProduct = product;
    state.modalQty = 1;

    document.getElementById('modal-image').src = product.image;
    document.getElementById('modal-category').textContent = product.category;
    document.getElementById('modal-title').textContent = product.name;
    document.getElementById('modal-price').textContent = formatPrice(product.price);
    document.getElementById('modal-description').textContent = product.description;
    document.getElementById('modal-qty').textContent = state.modalQty;

    const reviewEl = document.getElementById('modal-reviews');
    if (reviewEl) reviewEl.textContent = `(${Math.floor(Math.random() * 50) + 5} reviews)`;

    const sizesContainer = document.getElementById('modal-sizes');
    sizesContainer.innerHTML = '';
    product.sizes.forEach((size, idx) => {
        const btn = document.createElement('button');
        btn.className = `w-10 h-10 border border-gray-700 text-gray-400 hover:border-gold hover:text-white transition-colors flex items-center justify-center text-xs uppercase ${idx === 0 ? 'border-gold text-white' : ''}`;
        btn.textContent = size;
        btn.onclick = (e) => {
            document.querySelectorAll('#modal-sizes button').forEach(b => b.classList.remove('border-gold', 'text-white'));
            e.target.classList.add('border-gold', 'text-white');
            e.target.classList.remove('text-gray-400', 'border-gray-700');
        };
        sizesContainer.appendChild(btn);
    });

    const addBtn = document.getElementById('modal-add-to-cart');
    const newBtn = addBtn.cloneNode(true);
    addBtn.parentNode.replaceChild(newBtn, addBtn);
    newBtn.onclick = () => {
        addToCart(product.id, state.modalQty);
        closeModal();
    };

    if (product.stock === 0) {
        newBtn.disabled = true;
        newBtn.textContent = "Out of Stock";
        newBtn.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
        newBtn.disabled = false;
        newBtn.textContent = "Add to Cart";
        newBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }

    dom.modal.classList.remove('hidden');
    setTimeout(() => {
        dom.modal.classList.add('modal-open');
    }, 10);
};

const closeModal = () => {
    dom.modal.classList.remove('modal-open');
    setTimeout(() => {
        dom.modal.classList.add('hidden');
    }, 300);
};

const incrementModalQty = () => {
    if (state.modalProduct && state.modalQty < state.modalProduct.stock) {
        state.modalQty++;
        document.getElementById('modal-qty').textContent = state.modalQty;
    }
};

const decrementModalQty = () => {
    if (state.modalQty > 1) {
        state.modalQty--;
        document.getElementById('modal-qty').textContent = state.modalQty;
    }
};

// ================== SEARCH ==================
const searchBtn = document.getElementById('search-btn');
if (searchBtn) {
    searchBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dom.searchBar.classList.toggle('search-open');
        if (dom.searchBar.classList.contains('search-open')) {
            dom.searchInput.focus();
        }
    });
}

document.addEventListener('click', (e) => {
    if (dom.searchBar && !dom.searchBar.contains(e.target) && searchBtn && !searchBtn.contains(e.target)) {
        dom.searchBar.classList.remove('search-open');
    }
});

if (dom.searchInput) {
    dom.searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value.trim();
        renderProducts();
    });
}

// ================== CART SYSTEM ==================
const addToCart = (productId, qty = 1) => {
    const product = state.products.find(p => p.id === productId);
    if (!product || product.stock === 0) return;

    const existingItem = state.cart.find(item => item.id === productId);

    if (existingItem) {
        if (existingItem.qty + qty <= product.stock) {
            existingItem.qty += qty;
        } else {
            showToast("Max stock reached!", true);
            return;
        }
    } else {
        state.cart.push({ ...product, qty: qty });
    }

    updateCartUI();
    showToast(`Added ${qty} ${product.name} to cart`);
    openCart();
};

const removeFromCart = (productId) => {
    state.cart = state.cart.filter(item => item.id !== productId);
    updateCartUI();
};

const updateCartQty = (productId, change) => {
    const item = state.cart.find(i => i.id === productId);
    if (!item) return;

    const newQty = item.qty + change;
    const maxStock = state.products.find(p => p.id === productId).stock;

    if (newQty > 0 && newQty <= maxStock) {
        item.qty = newQty;
    } else if (newQty > maxStock) {
        showToast("Max stock reached!", true);
    }
    updateCartUI();
};

const updateCartUI = () => {
    localStorage.setItem('luxe_cart', JSON.stringify(state.cart));

    const totalQty = state.cart.reduce((sum, item) => sum + item.qty, 0);
    dom.cartCount.textContent = totalQty;
    dom.cartDrawerCount.textContent = totalQty;

    if (totalQty > 0) {
        dom.cartCount.classList.remove('hidden');
    } else {
        dom.cartCount.classList.add('hidden');
    }

    dom.cartItems.innerHTML = '';
    let subtotal = 0;

    state.cart.forEach(item => {
        subtotal += item.price * item.qty;
        const div = document.createElement('div');
        div.className = 'flex gap-4 border-b border-gray-800 pb-4 animate-[fadeIn_0.3s_ease-out]';
        div.innerHTML = `
            <div class="w-20 h-24 bg-gray-900 rounded overflow-hidden flex-shrink-0">
                <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover">
            </div>
            <div class="flex-1 flex flex-col justify-between">
                <div>
                    <div class="flex justify-between items-start">
                         <h4 class="text-white font-serif text-sm">${item.name}</h4>
                         <button onclick="removeFromCart(${item.id})" class="text-gray-500 hover:text-red-500 transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                         </button>
                    </div>
                    <p class="text-xs text-gray-500 uppercase tracking-widest mt-1">${item.category}</p>
                </div>
                <div class="flex justify-between items-end">
                    <div class="flex items-center border border-gray-700 rounded-sm">
                        <button onclick="updateCartQty(${item.id}, -1)" class="px-2 py-1 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">-</button>
                        <span class="px-2 py-1 text-xs text-white min-w-[20px] text-center">${item.qty}</span>
                         <button onclick="updateCartQty(${item.id}, 1)" class="px-2 py-1 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">+</button>
                    </div>
                    <p class="text-gold text-sm">${formatPrice(item.price * item.qty)}</p>
                </div>
            </div>
        `;
        dom.cartItems.appendChild(div);
    });

    if (state.cart.length === 0) {
        dom.cartItems.innerHTML = `
            <div class="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                <svg class="w-16 h-16 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                <p class="text-gray-500">Your cart is empty.</p>
                <button onclick="closeDrawers()" class="text-gold underline text-sm">Start Shopping</button>
            </div>
        `;
    }

    dom.cartSubtotal.textContent = formatPrice(subtotal);
};

// ================== WISHLIST ==================
const isInWishlist = (id) => state.wishlist.some(i => i.id === id);

const toggleWishlist = (id) => {
    if (isInWishlist(id)) {
        state.wishlist = state.wishlist.filter(i => i.id !== id);
        showToast("Removed from Wishlist");
    } else {
        const product = state.products.find(p => p.id === id);
        if (product) state.wishlist.push(product);
        showToast("Added to Wishlist");
    }
    updateWishlistUI();
    renderProducts();
};

const updateWishlistUI = () => {
    localStorage.setItem('luxe_wishlist', JSON.stringify(state.wishlist));

    dom.wishlistCount.textContent = state.wishlist.length;
    if (state.wishlist.length > 0) {
        dom.wishlistCount.classList.remove('hidden');
    } else {
        dom.wishlistCount.classList.add('hidden');
    }

    dom.wishlistItems.innerHTML = '';
    state.wishlist.forEach(item => {
        const div = document.createElement('div');
        div.className = 'flex gap-4 border-b border-gray-800 pb-4 animate-[fadeIn_0.3s_ease-out]';
        div.innerHTML = `
            <div class="w-16 h-20 bg-gray-900 rounded overflow-hidden flex-shrink-0">
                <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover">
            </div>
            <div class="flex-1">
                <div class="flex justify-between items-start">
                        <h4 class="text-white font-serif text-sm">${item.name}</h4>
                        <button onclick="toggleWishlist(${item.id})" class="text-gray-500 hover:text-red-500 transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                </div>
                <p class="text-gold text-sm mt-1">${formatPrice(item.price)}</p>
                <button onclick="addToCart(${item.id}); toggleWishlist(${item.id})" class="text-xs uppercase tracking-wider text-gray-400 hover:text-white mt-2 border-b border-transparent hover:border-white transition-all pb-0.5">Move to Cart</button>
            </div>
        `;
        dom.wishlistItems.appendChild(div);
    });

    if (state.wishlist.length === 0) {
        dom.wishlistItems.innerHTML = `
            <div class="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                 <svg class="w-16 h-16 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                <p class="text-gray-500">Your wishlist is empty.</p>
            </div>
        `;
    }
};

// ================== DRAWER MANAGEMENT ==================
const openCart = () => {
    closeDrawers();
    dom.cartDrawer.classList.add('drawer-open');
    dom.overlay.classList.add('overlay-active');
    document.body.style.overflow = 'hidden';
};

const openWishlist = () => {
    closeDrawers();
    dom.wishlistDrawer.classList.add('drawer-open');
    dom.overlay.classList.add('overlay-active');
    document.body.style.overflow = 'hidden';
};

const closeDrawers = () => {
    if (dom.cartDrawer) dom.cartDrawer.classList.remove('drawer-open');
    if (dom.wishlistDrawer) dom.wishlistDrawer.classList.remove('drawer-open');
    if (dom.mobileMenu) dom.mobileMenu.classList.remove('menu-open');
    if (dom.overlay) dom.overlay.classList.remove('overlay-active');
    if (dom.searchBar) dom.searchBar.classList.remove('search-open');
    document.body.style.overflow = '';
};

document.getElementById('cart-btn').addEventListener('click', openCart);
document.getElementById('wishlist-btn').addEventListener('click', openWishlist);
document.getElementById('close-cart').addEventListener('click', closeDrawers);
document.getElementById('close-wishlist').addEventListener('click', closeDrawers);
dom.overlay.addEventListener('click', closeDrawers);
document.getElementById('close-modal').addEventListener('click', closeModal);

if (dom.mobileMenuBtn) {
    dom.mobileMenuBtn.addEventListener('click', () => {
        dom.mobileMenu.classList.toggle('menu-open');
    });
}

// ================== CHECKOUT ==================
const goToCheckout = () => {
    if (state.cart.length === 0) {
        showToast("Cart is empty!", true);
        return;
    }

    closeDrawers();
    dom.hero.classList.add('hidden');
    dom.shopControls.classList.add('hidden');
    document.getElementById('products-section').classList.add('hidden');

    dom.checkoutView.classList.remove('hidden');

    dom.checkoutItems.innerHTML = '';
    let subtotal = 0;

    state.cart.forEach(item => {
        subtotal += item.price * item.qty;
        const div = document.createElement('div');
        div.className = 'flex justify-between items-center text-sm';
        div.innerHTML = `
            <div class="flex items-center gap-3">
                <div class="relative">
                    <img src="${item.image}" class="w-12 h-12 object-cover rounded bg-gray-800">
                    <span class="absolute -top-2 -right-2 bg-gray-700 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">${item.qty}</span>
                </div>
                <div class="text-gray-300">
                    <p class="text-white font-medium">${item.name}</p>
                    <p class="text-xs text-gray-500">${item.category}</p>
                </div>
            </div>
            <span class="text-white">${formatPrice(item.price * item.qty)}</span>
        `;
        dom.checkoutItems.appendChild(div);
    });

    dom.checkoutSubtotal.textContent = formatPrice(subtotal);
    dom.checkoutTotal.textContent = formatPrice(subtotal);

    window.scrollTo({ top: 0, behavior: 'smooth' });
};

const processCheckout = () => {
    const email = document.getElementById('checkout-email').value;
    const name = document.getElementById('checkout-name').value;

    if (!email || !name) {
        showToast("Please fill in contact info", true);
        return;
    }

    const btn = document.querySelector('#checkout-view button[onclick="processCheckout()"]');
    btn.textContent = "Processing Payment...";
    btn.disabled = true;
    btn.classList.add('opacity-70', 'cursor-not-allowed');

    setTimeout(() => {
        btn.textContent = "Payment Successful!";
        btn.classList.remove('bg-gold', 'text-black');
        btn.classList.add('bg-green-600', 'text-white');

        setTimeout(() => {
            state.cart = [];
            updateCartUI();

            dom.checkoutView.innerHTML = `
                <div class="flex flex-col items-center justify-center min-h-[50vh] text-center p-6 animate-[fadeInUp_0.5s_ease-out]">
                    <div class="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                        <svg class="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h2 class="text-4xl font-serif text-white mb-4">Thank You, ${name.split(' ')[0]}</h2>
                    <p class="text-gray-400 mb-8 max-w-md">Your order has been placed successfully.</p>
                    <button onclick="window.location.reload()" class="bg-gold text-black px-10 py-4 uppercase tracking-[0.2em] font-bold hover:bg-white transition-all transform hover:scale-105">
                        Continue Shopping
                    </button>
                </div>
            `;
        }, 1500);
    }, 2000);
};

// ================== UTILITIES ==================
const showToast = (message, isError = false) => {
    dom.toastMessage.textContent = message;
    dom.toast.classList.add('toast-active');

    if (isError) {
        dom.toast.querySelector('div').classList.remove('bg-gold');
        dom.toast.querySelector('div').classList.add('bg-red-500');
    } else {
        dom.toast.querySelector('div').classList.add('bg-gold');
        dom.toast.querySelector('div').classList.remove('bg-red-500');
    }

    setTimeout(() => {
        dom.toast.classList.remove('toast-active');
    }, 3000);
};

// ================== START ==================
document.addEventListener('DOMContentLoaded', init);
