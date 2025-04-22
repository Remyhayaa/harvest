// 📁 scripts/seedDatabase.js
const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

initializeApp({ credential: applicationDefault() });
const db = getFirestore();

const seedProducts = async () => {
  const products = [
    {
      id: "GH-VEG-001",
      name: "Organic Sukuma Wiki",
      price: 2000,
      category: "vegetables",
      stock: 50,
      images: ["products/vegetables/sukuma.jpg"],
      tags: ["organic", "leafy"]
    },
    // ... 10+ more products
  ];

  const batch = db.batch();
  products.forEach(product => {
    const ref = db.collection('products').doc();
    batch.set(ref, {
      ...product,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      isActive: true
    });
  });
  
  await batch.commit();
  console.log("Seeded products successfully");
};

// Execute seeding
seedProducts().catch(console.error);