// Handle MTN/Airtel payment retries
function monitorPendingPayments() {
  const pendingTxs = db.collection('payments')
    .where('status', '==', 'pending')
    .where('createdAt', '>', firebase.firestore.Timestamp.now() - 3600);

  pendingTxs.onSnapshot(snap => {
    snap.forEach(doc => {
      checkFlutterwaveStatus(doc.id).then(status => {
        if (status === 'failed') {
          sendSMS(
            doc.data().phone,
            `Nkubalako! Payment ye ${doc.data().amount} UGX etabwa. Dda mukutuukako: ${retryLink}`
          );
        }
      });
    });
  });
}