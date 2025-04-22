// Document Ready
document.addEventListener('DOMContentLoaded', function() {
    // Load featured products
    loadFeaturedProducts();
    
    // Initialize cart count
    updateCartCount();
    
    // Newsletter form submission
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            // In a real app, you would send this to your server
            alert(`Thank you for subscribing with ${email}! You'll hear from us soon.`);
            this.reset();
        });
    }
    
    // Initialize Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});

// Load Featured Products
function loadFeaturedProducts() {
    const featuredProductsContainer = document.getElementById('featuredProducts');
    if (!featuredProductsContainer) return;
    
    // Mock product data - in a real app, this would come from an API
    const products = [
        {
            id: 1,
            name: "Organic Sukuma Wiki",
            price: 2000,
            image: "images/sukuma.jpg",
            category: "vegetables",
            description: "Freshly harvested organic kale, packed with nutrients."
        },
        {
            id: 2,
            name: "Organic Matooke",
            price: 5000,
            image: "images/matooke.jpg",
            category: "fruits",
            description: "Traditional Ugandan bananas grown without pesticides."
        },
        {
            id: 3,
            name: "Organic Avocados",
            price: 3000,
            image: "images/avocado.jpg",
            category: "fruits",
            description: "Creamy Hass avocados, perfect for your healthy diet."
        },
        {
            id: 4,
            name: "Organic Mint",
            price: 1500,
            image: "images/mint.jpg",
            category: "herbs",
            description: "Fresh mint leaves for teas and culinary uses."
        }
    ];
    
    let html = '';
    products.forEach(product => {
        html += `
            <div class="col-md-6 col-lg-3">
                <div class="card">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="price">UGX ${product.price.toLocaleString()}</span>
                            <button class="btn btn-sm btn-success add-to-cart" data-id="${product.id}">
                                <i class="fas fa-cart-plus"></i> Add
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    featuredProductsContainer.innerHTML = html;
    
    // Add event listeners to all "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

// Cart Functions
function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Show feedback
    const toast = document.createElement('div');
    toast.className = 'position-fixed bottom-0 end-0 p-3';
    toast.style.zIndex = '11';
    toast.innerHTML = `
        <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header bg-success text-white">
                <strong class="me-auto">Cart Updated</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                Item added to your cart!
            </div>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function updateCartCount() {
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = totalItems;
    }
}

// In a complete implementation, we would also have:
// - Product page functionality
// - Cart page functionality
// - Checkout process
// - User authentication
// - Admin dashboard for product management

const products = [
    {
        id: 1,
        name: "Organic Sukuma Wiki",
        price: 2000,
        image: "images/sukuma.jpg",
        category: "vegetables",
        description: "Freshly harvested organic kale, packed with nutrients."
    },
    {
        id: 2,
        name: "Organic Matooke",
        price: 5000,
        image: "images/matooke.jpg",
        category: "fruits",
        description: "Traditional Ugandan bananas grown without pesticides."
    },
    {
        id: 3,
        name: "Organic Avocados",
        price: 3000,
        image: "images/avocado.jpg",
        category: "fruits",
        description: "Creamy Hass avocados, perfect for your healthy diet."
    },
    {
        id: 4,
        name: "Organic Mint",
        price: 1500,
        image: "images/mint.jpg",
        category: "herbs",
        description: "Fresh mint leaves for teas and culinary uses."
    },
    {
        id: 5,
        name: "Organic Tomatoes",
        price: 2500,
        image: "images/tomatoes.jpg",
        category: "vegetables",
        description: "Juicy vine-ripened tomatoes, full of flavor."
    },
    {
        id: 6,
        name: "Organic Pineapples",
        price: 4000,
        image: "images/pineapple.jpg",
        category: "fruits",
        description: "Sweet and tangy pineapples, rich in vitamins."
    },
    {
        id: 7,
        name: "Organic Ginger",
        price: 3500,
        image: "images/ginger.jpg",
        category: "herbs",
        description: "Fresh ginger root with strong aromatic flavor."
    },
    {
        id: 8,
        name: "Organic Passion Fruits",
        price: 3000,
        image: "images/passion-fruit.jpg",
        category: "fruits",
        description: "Tropical passion fruits bursting with flavor."
    }
];// ===== Cart Functionality =====
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  document.getElementById('cartCount').textContent = count;
}

function addToCart(productId, productName, productPrice) {
  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: productId,
      name: productName,
      price: productPrice,
      quantity: 1
    });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  showToast(`${productName} added to cart`);
}

// ===== Toast Notifications =====
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'position-fixed bottom-0 end-0 p-3';
  toast.style.zIndex = '1100';
  
  toast.innerHTML = `
    <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header bg-success text-white">
        <strong class="me-auto">Success</strong>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body bg-light">
        ${message}
      </div>
    </div>
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// ===== Product Interactions =====
document.addEventListener('DOMContentLoaded', function() {
  // Initialize cart count
  updateCartCount();
  
  // Add to cart buttons
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
      const productId = parseInt(this.dataset.id);
      const productName = this.dataset.name;
      const productPrice = parseFloat(this.dataset.price);
      addToCart(productId, productName, productPrice);
    });
  });
  
  // Initialize tooltips
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(tooltipTriggerEl => {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
  
  // Initialize product image hover effects
  document.querySelectorAll('.product-card').forEach(card => {
    const img = card.querySelector('.card-img-top');
    
    card.addEventListener('mouseenter', () => {
      img.style.transform = 'scale(1.05)';
    });
    
    card.addEventListener('mouseleave', () => {
      img.style.transform = 'scale(1)';
    });
  });
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Lazy load images
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.add('fade-in');
          observer.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
  }
  
  // Testimonial carousel autoplay
  const testimonialCarousel = document.getElementById('testimonialCarousel');
  if (testimonialCarousel) {
    const carousel = new bootstrap.Carousel(testimonialCarousel, {
      interval: 5000,
      pause: 'hover'
    });
  }
});

// ===== Form Validation =====
function validateForms() {
  // Newsletter form
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      if (!this.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
      } else {
        e.preventDefault();
        showToast('Thanks for subscribing!');
        this.reset();
      }
      this.classList.add('was-validated');
    }, false);
  }
}

// Initialize all functionality
document.addEventListener('DOMContentLoaded', function() {
  updateCartCount();
  validateForms();
  
  // Scroll reveal animations
  const scrollReveal = ScrollReveal({
    origin: 'bottom',
    distance: '40px',
    duration: 1000,
    reset: false
  });
  
  scrollReveal.reveal('.hero-section, .section-header, .product-card, .about-section, .testimonials, .newsletter', {
    interval: 200
  });
});
// Initialize About Page Components
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Team card hover effect
    document.querySelectorAll('.team-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            const img = card.querySelector('.team-img');
            img.style.transform = 'scale(1.05)';
        });
        
        card.addEventListener('mouseleave', () => {
            const img = card.querySelector('.team-img');
            img.style.transform = 'scale(1)';
        });
    });

    // Certification modal images
    document.querySelectorAll('.certification-card').forEach(card => {
        card.addEventListener('click', function() {
            const modalId = this.querySelector('button').getAttribute('data-bs-target');
            const modal = document.querySelector(modalId);
            if (modal) {
                const modalImg = modal.querySelector('.modal-body img');
                const cardImg = this.querySelector('img');
                modalImg.src = cardImg.src;
                modalImg.alt = cardImg.alt;
            }
        });
    });

    // Smooth scrolling for timeline anchors
    document.querySelectorAll('.timeline-content a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Initialize carousel if exists
    const aboutCarousel = document.getElementById('aboutCarousel');
    if (aboutCarousel) {
        new bootstrap.Carousel(aboutCarousel, {
            interval: 5000,
            pause: 'hover'
        });
    }
});
/**
 * GREENHARVEST UGANDA - SHOPPING CART SYSTEM
 * Features:
 * - Real-time cart updates
 * - Quantity adjustments
 * - Coupon discounts (e.g., FRESH10 for 10% off)
 * - Persistent storage (LocalStorage)
 * - Currency formatting (UGX)
 */

// ====== CART FUNCTIONS ======
function updateCartUI() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartItemsEl = document.getElementById('cart-items');
  const emptyCartEl = document.getElementById('cart-empty');
  const filledCartEl = document.getElementById('cart-filled');
  const itemCountEl = document.getElementById('item-count');
  const cartCountEl = document.getElementById('cart-count');

  // Update cart badge
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountEl.textContent = totalItems;
  itemCountEl.textContent = `${totalItems} ${totalItems === 1 ? 'Item' : 'Items'}`;

  // Show empty state if cart is empty
  if (cart.length === 0) {
    emptyCartEl.classList.remove('d-none');
    filledCartEl.classList.add('d-none');
    return;
  }

  // Show filled cart
  emptyCartEl.classList.add('d-none');
  filledCartEl.classList.remove('d-none');

  // Clear existing rows
  cartItemsEl.innerHTML = '';

  // Calculate subtotal
  let subtotal = 0;

  // Render each cart item
  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>
        <div class="d-flex align-items-center">
          <img src="${item.image}" alt="${item.name}" class="rounded me-3" width="60">
          <div>
            <h6 class="mb-0">${item.name}</h6>
            <small class="text-muted">${item.category}</small>
          </div>
        </div>
      </td>
      <td class="fw-bold">UGX ${item.price.toLocaleString()}</td>
      <td>
        <div class="input-group" style="width: 120px;">
          <button class="btn btn-outline-secondary minus-btn" data-index="${index}">
            <i class="fas fa-minus"></i>
          </button>
          <input type="text" class="form-control text-center quantity-input" value="${item.quantity}" readonly>
          <button class="btn btn-outline-secondary plus-btn" data-index="${index}">
            <i class="fas fa-plus"></i>
          </button>
        </div>
      </td>
      <td class="fw-bold">UGX ${itemTotal.toLocaleString()}</td>
      <td>
        <button class="btn btn-outline-danger btn-sm remove-btn" data-index="${index}">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;
    cartItemsEl.appendChild(row);
  });

  // Calculate totals
  const shipping = 5000; // Fixed delivery fee
  const discount = parseInt(localStorage.getItem('discount')) || 0;
  const total = subtotal + shipping - discount;

  // Update summary
  document.getElementById('cart-subtotal').textContent = `UGX ${subtotal.toLocaleString()}`;
  document.getElementById('cart-total').textContent = `UGX ${total.toLocaleString()}`;

  // Show discount if applied
  if (discount > 0) {
    document.getElementById('discount-row').classList.remove('d-none');
    document.getElementById('cart-discount').textContent = `-UGX ${discount.toLocaleString()}`;
  } else {
    document.getElementById('discount-row').classList.add('d-none');
  }
}

// ====== EVENT LISTENERS ======
document.addEventListener('DOMContentLoaded', function() {
  // Initialize cart UI
  if (document.getElementById('cart-items')) {
    updateCartUI();
  }

  // Handle cart interactions
  document.addEventListener('click', function(e) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Increase quantity
    if (e.target.classList.contains('plus-btn') || e.target.closest('.plus-btn')) {
      const index = e.target.dataset.index || e.target.closest('.plus-btn').dataset.index;
      cart[index].quantity += 1;
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartUI();
    }

    // Decrease quantity
    if (e.target.classList.contains('minus-btn') || e.target.closest('.minus-btn')) {
      const index = e.target.dataset.index || e.target.closest('.minus-btn').dataset.index;
      if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
      }
    }

    // Remove item
    if (e.target.classList.contains('remove-btn') || e.target.closest('.remove-btn')) {
      const index = e.target.dataset.index || e.target.closest('.remove-btn').dataset.index;
      cart.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartUI();
    }

    // Apply coupon
    if (e.target.id === 'apply-coupon' || e.target.closest('#apply-coupon')) {
      const couponCode = document.getElementById('coupon-code').value.trim();
      const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const successMsg = document.getElementById('coupon-success');
      const errorMsg = document.getElementById('coupon-error');

      // Validate coupon
      if (couponCode === 'FRESH10') {
        const discount = Math.floor(subtotal * 0.1); // 10% off
        localStorage.setItem('discount', discount);
        successMsg.classList.remove('d-none');
        errorMsg.classList.add('d-none');
        updateCartUI();
      } else {
        errorMsg.classList.remove('d-none');
        successMsg.classList.add('d-none');
      }
    }
  });
});