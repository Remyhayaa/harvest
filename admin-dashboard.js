// 〽️ UGANDA-MAP CENTER COORDINATES
const KAMPALA_CENTER = [0.3136, 32.5811];

// 🔥 FIREBASE INIT
const firebaseConfig = {
  apiKey: "AIzaSyB...",
  authDomain: "greenharvest-ug.firebaseapp.com",
  projectId: "greenharvest-ug",
  storageBucket: "greenharvest-ug.appspot.com",
  messagingSenderId: "123...",
  appId: "1:123...:web:abc..."
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 🗺️ INITIALIZE LEAFLET MAP
const map = L.map('kampala-map').setView(KAMPALA_CENTER, 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// 🛵 BODA-BODA MARKERS (Live Tracking)
const bodaMarkers = {};
db.collection("deliveries").where("status", "==", "in_transit")
  .onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
      const data = change.doc.data();
      const bodaId = data.bodaId;
      
      if (change.type === "added" || change.type === "modified") {
        if (!bodaMarkers[bodaId]) {
          bodaMarkers[bodaId] = L.marker([data.lat, data.lng], {
            icon: L.divIcon({
              className: 'boda-icon',
              html: `<div class="boda-pulse"><i class="fas fa-motorcycle"></i></div>`,
              iconSize: [30, 30]
            })
          }).addTo(map)
            .bindPopup(`Boda ${bodaId}<br>Order: ${data.orderId}`);
        } else {
          bodaMarkers[bodaId].setLatLng([data.lat, data.lng]);
        }
      }
      
      if (change.type === "removed") {
        map.removeLayer(bodaMarkers[bodaId]);
        delete bodaMarkers[bodaId];
      }
    });
  });

// 📦 REAL-TIME ORDER STREAM
const orderStream = document.getElementById('order-stream');
db.collection("orders").orderBy("timestamp", "desc").limit(10)
  .onSnapshot(snapshot => {
    orderStream.innerHTML = '';
    
    snapshot.forEach(doc => {
      const order = doc.data();
      const statusClass = {
        'pending': 'bg-warning',
        'shipped': 'bg-info',
        'delivered': 'bg-success',
        'cancelled': 'bg-danger'
      }[order.status] || 'bg-secondary';
      
      orderStream.innerHTML += `
        <div class="order-card card mb-3">
          <div class="card-body">
            <div class="d-flex justify-content-between mb-2">
              <span class="fw-bold">#${doc.id.slice(-6)}</span>
              <span class="badge ${statusClass} status-badge text-white">
                ${order.status.toUpperCase()}
              </span>
            </div>
            <div class="d-flex justify-content-between mb-1">
              <small class="text-muted">${new Date(order.timestamp?.toDate()).toLocaleString()}</small>
              <small class="fw-bold">UGX ${order.total?.toLocaleString()}</small>
            </div>
            <div class="mt-2">
              <button class="btn btn-sm btn-outline-success me-2">
                <i class="fas fa-phone-alt me-1"></i>Call
              </button>
              <button class="btn btn-sm btn-outline-primary">
                <i class="fas fa-map-marker-alt me-1"></i>Track
              </button>
            </div>
          </div>
        </div>
      `;
    });
    
    if (snapshot.empty) {
      orderStream.innerHTML = `
        <div class="text-center py-4 text-muted">
          <i class="fas fa-clipboard-list fa-3x mb-3"></i>
          <p>No recent orders</p>
        </div>
      `;
    }
  });

// 💰 MOBILE MONEY METRICS
db.collection("transactions").where("method", "==", "mobile_money")
  .onSnapshot(snapshot => {
    let total = 0;
    snapshot.forEach(doc => total += doc.data().amount);
    document.getElementById('mm-amount').textContent = total.toLocaleString();
  });