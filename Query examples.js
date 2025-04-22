// 1. Get Paginated Products by Category
const getVegetables = async (page = 1, limit = 10) => {
  const snapshot = await db.collection('products')
    .where('category', '==', 'vegetables')
    .where('isActive', '==', true)
    .orderBy('price')
    .limit(limit)
    .offset((page - 1) * limit)
    .get();
  
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// 2. Get User's Order History
const getUserOrders = async (userId) => {
  const snapshot = await db.collection('orders')
    .where('customer.userId', '==', db.doc(`users/${userId}`))
    .orderBy('createdAt', 'desc')
    .limit(20)
    .get();
  
  return snapshot.docs.map(doc => doc.data());
};

// 3. Update Product Stock After Order
const updateStock = async (productId, quantityChange) => {
  const productRef = db.collection('products').doc(productId);
  await db.runTransaction(async (t) => {
    const doc = await t.get(productRef);
    const newStock = doc.data().stock - quantityChange;
    if (newStock < 0) throw new Error("Insufficient stock");
    t.update(productRef, { stock: newStock });
  });
};