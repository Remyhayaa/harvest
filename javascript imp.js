// 📁 js/checkout.js
document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const shippingForm = document.getElementById('shipping-form');
  const paymentStep = document.getElementById('payment-step');
  const reviewStep = document.getElementById('review-step');
  const placeOrderBtn = document.getElementById('place-order');
  
  // State Management
  let checkoutData = {
    shipping: {},
    payment: {
      method: 'mtn-momo'
    },
    cart: JSON.parse(localStorage.getItem('cart')) || []
  };

  // Initialize Checkout
  initCheckout();

  // Step 1: Shipping Form Submission
  shippingForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate Form
    if (!validateShippingForm()) return;
    
    // Save Shipping Data
    checkoutData.shipping = {
      name: shippingForm.elements.name.value,
      phone: '+256' + shippingForm.elements.phone.value,
      district: shippingForm.elements.district.value,
      address: shippingForm.elements.address.value,
      notes: shippingForm.elements.notes.value
    };
    
    // Calculate Delivery Fee
    checkoutData.deliveryFee = calculateDeliveryFee(checkoutData.shipping.district);
    
    // Proceed to Payment
    goToStep(2);
  });

  // Step 2: Payment Method Selection
  document.querySelectorAll('.payment-card').forEach(card => {
    card.addEventListener('click', function() {
      // Update UI
      document.querySelectorAll('.payment-card').forEach(c => {
        c.classList.remove('selected');
        c.querySelector('.payment-check i').className = 'far fa-circle';
      });
      
      this.classList.add('selected');
      this.querySelector('.payment-check i').className = 'fas fa-check-circle';
      
      // Update Payment Method
      checkoutData.payment.method = this.dataset.method;
      loadPaymentForm(this.dataset.method);
    });
  });

  // Step 3: Place Order
  placeOrderBtn.addEventListener('click', async function() {
    this.disabled = true;
    this.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...';
    
    try {
      // Create Order in Firebase
      const orderId = await createOrder();
      
      // Process Payment
      const paymentResult = await processPayment();
      
      // Show Success
      showOrderSuccess(orderId);
      
      // Clear Cart
      localStorage.removeItem('cart');
    } catch (error) {
      console.error("Checkout error:", error);
      showError("Payment failed: " + error.message);
      this.disabled = false;
      this.innerHTML = '<i class="fas fa-lock me-2"></i>Place Order Securely';
    }
  });

  // Helper Functions
  function initCheckout() {
    // Load saved data if returning customer
    if (localStorage.getItem('checkoutData')) {
      checkoutData = JSON.parse(localStorage.getItem('checkoutData'));
    }
    
    // Initialize payment method UI
    document.querySelector(`.payment-card[data-method="${checkoutData.payment.method}"]`).click();
  }

  function validateShippingForm() {
    // Client-side validation
    const phone = shippingForm.elements.phone.value;
    if (!phone.match(/^(77|78|76)\d{7}$/)) {
      showError("Please enter a valid MTN or Airtel number");
      return false;
    }
    return true;
  }

  function calculateDeliveryFee(district) {
    // Zone-based pricing
    const zones = {
      'Kampala': 5000,
      'Wakiso': 7000,
      // Other districts
      'default': 10000
    };
    return zones[district] || zones.default;
  }

  function loadPaymentForm(method) {
    const container = document.getElementById('payment-form-container');
    
    switch (method) {
      case 'mtn-momo':
        container.innerHTML = `
          <form id="momo-form" class="payment-form">
            <div class="mb-3">
              <label class="form-label">MTN Mobile Number*</label>
              <div class="input-group">
                <span class="input-group-text">+256</span>
                <input type="tel" class="form-control" name="momo-number" 
                       value="${checkoutData.shipping.phone?.replace('+256', '') || ''}"
                       pattern="77[0-9]{7}|78[0-9]{7}" required>
              </div>
            </div>
            <div class="alert alert-info">
              <i class="fas fa-info-circle me-2"></i>
              You'll receive a Mobile Money prompt on your phone
            </div>
          </form>`;
        break;
        
      case 'card':
        container.innerHTML = `
          <form id="card-form" class="payment-form">
            <div class="mb-3">
              <label class="form-label">Card Number*</label>
              <input type="text" class="form-control" name="card-number" 
                     placeholder="4242 4242 4242 4242" required>
            </div>
            <div class="row g-2">
              <div class="col-md-6">
                <label class="form-label">Expiry*</label>
                <input type="text" class="form-control" name="expiry" 
                       placeholder="MM/YY" required>
              </div>
              <div class="col-md-6">
                <label class="form-label">CVV*</label>
                <input type="text" class="form-control" name="cvv" 
                       placeholder="123" required>
              </div>
            </div>
          </form>`;
        break;
    }
  }

  function updateOrderReview() {
    // Calculate Totals
    const subtotal = checkoutData.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + checkoutData.deliveryFee;
    
    // Update UI
    document.getElementById('review-subtotal').textContent = `UGX ${subtotal.toLocaleString()}`;
    document.getElementById('review-delivery').textContent = `UGX ${checkoutData.deliveryFee.toLocaleString()}`;
    document.getElementById('review-total').textContent = `UGX ${total.toLocaleString()}`;
    
    // Render Order Items
    const itemsContainer = document.getElementById('order-items');
    itemsContainer.innerHTML = checkoutData.cart.map(item => `
      <div class="list-group-item">
        <div class="d-flex justify-content-between">
          <div>
            <h6 class="my-1">${item.name}</h6>
            <small class="text-muted">${item.quantity} x UGX ${item.price.toLocaleString()}</small>
          </div>
          <div class="text-end">
            <strong>UGX ${(item.price * item.quantity).toLocaleString()}</strong>
          </div>
        </div>
      </div>
    `).join('');
    
    // Render Delivery Info
    document.getElementById('delivery-details').innerHTML = `
      <p><strong>${checkoutData.shipping.name}</strong></p>
      <p>${checkoutData.shipping.address}</p>
      <p>${checkoutData.shipping.district}</p>
      <p class="mb-2">${checkoutData.shipping.phone}</p>
      ${checkoutData.shipping.notes ? `<hr><p><em>${checkoutData.shipping.notes}</em></p>` : ''}
    `;
  }

  async function createOrder() {
    const orderRef = await db.collection('orders').add({
      orderNumber: generateOrderId(),
      customer: {
        name: checkoutData.shipping.name,
        phone: checkoutData.shipping.phone,
        district: checkoutData.shipping.district,
        address: checkoutData.shipping.address,
        notes: checkoutData.shipping.notes
      },
      items: checkoutData.cart.map(item => ({
        productId: db.doc(`products/${item.id}`),
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
        total: item.price * item.quantity
      })),
      payment: {
        method: checkoutData.payment.method,
        status: 'pending',
        amount: checkoutData.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + checkoutData.deliveryFee
      },
      delivery: {
        status: 'pending',
        fee: checkoutData.deliveryFee
      },
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    return orderRef.id;
  }

  function generateOrderId() {
    const date = new Date();
    return `GH-${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2,'0')}${date.getDate().toString().padStart(2,'0')}-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  async function processPayment() {
    switch (checkoutData.payment.method) {
      case 'mtn-momo':
        return processMobileMoneyPayment();
      case 'card':
        return processCardPayment();
      default:
        throw new Error("Unsupported payment method");
    }
  }

  async function processMobileMoneyPayment() {
    const phone = document.querySelector('#momo-form [name="momo-number"]').value;
    const amount = checkoutData.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + checkoutData.deliveryFee;
    
    // Flutterwave Integration
    return new Promise((resolve, reject) => {
      FlutterwaveCheckout({
        public_key: "FLWPUBK_TEST-XXXXXXXXXXXXXXXX-X",
        tx_ref: `GH-${Date.now()}`,
        amount: amount,
        currency: "UGX",
        payment_options: "mobilemoneyuganda",
        meta: {
          consumer_id: firebase.auth().currentUser?.uid || "guest"
        },
        customer: {
          email: `${phone}@greenharvest.ug`, // Placeholder
          phone_number: phone
        },
        callback: function(response) {
          if (response.status === 'successful') {
            resolve(response);
          } else {
            reject(new Error(response.message));
          }
        },
        onclose: function() {
          reject(new Error("Payment window closed"));
        }
      });
    });
  }

  function goToStep(step) {
    // Hide all steps
    document.querySelectorAll('.checkout-step').forEach(el => {
      el.classList.remove('active');
    });
    
    // Show target step
    switch (step) {
      case 1:
        shippingForm.classList.add('active');
        break;
      case 2:
        paymentStep.classList.add('active');
        break;
      case 3:
        updateOrderReview();
        reviewStep.classList.add('active');
        break;
    }
    
    // Update progress indicator
    document.querySelectorAll('.checkout-progress .step').forEach(el => {
      el.classList.toggle('active', parseInt(el.dataset.step) <= step);
    });
    
    // Save state
    localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
  }

  function showOrderSuccess(orderId) {
    document.getElementById('order-number').textContent = orderId;
    new bootstrap.Modal(document.getElementById('order-success')).show();
  }

  function showError(message) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-danger alert-dismissible fade show';
    alert.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const container = document.querySelector('.container.py-5');
    container.prepend(alert);
    
    setTimeout(() => {
      alert.classList.remove('show');
      setTimeout(() => alert.remove(), 150);
    }, 5000);
  }
});

// Navigation Controls
document.querySelectorAll('.prev-step').forEach(btn => {
  btn.addEventListener('click', () => goToStep(1));
});

document.getElementById('proceed-to-review').addEventListener('click', () => {
  // Validate payment form
  const method = checkoutData.payment.method;
  let isValid = true;
  
  if (method === 'mtn-momo') {
    const momoForm = document.getElementById('momo-form');
    if (!momoForm.checkValidity()) {
      momoForm.reportValidity();
      isValid = false;
    } else {
      checkoutData.payment.phone = '+256' + momoForm.elements['momo-number'].value;
    }
  }
  
  if (isValid) goToStep(3);
});