// Kampala-based inventory watcher
const inventoryWatcher = db.collection('products')
  .where('stock', '<=', 5)
  .onSnapshot(snap => {
    snap.docChanges().forEach(change => {
      if (change.type === 'modified') {
        triggerSMSAlert(
          `Low stock: ${change.doc.data().name} - ${change.doc.data().stock} left`
        );
      }
    });
  });