const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const seedData = require('./firestore.json');

async function seedDatabase() {
  const db = getFirestore();
  
  for (const [collection, docs] of Object.entries(seedData)) {
    if (collection === 'metadata') continue;
    
    const batch = db.batch();
    Object.entries(docs).forEach(([id, data]) => {
      const ref = db.collection(collection).doc(id);
      batch.set(ref, data);
    });
    
    await batch.commit();
    console.log(`Seeded ${Object.keys(docs).length} ${collection}`);
  }
}