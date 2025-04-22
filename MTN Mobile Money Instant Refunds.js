// emergency-refund.js
async function triggerRefund(orderId) {
  const order = await db.collection('orders').doc(orderId).get();
  
  // Ugandan regulatory compliance (BoU limits)
  if (order.data().amount > 1000000) { // 1M UGX cap
    await manualApproval(orderId);
  } else {
    await mtn.momoRefund({
      originalTxId: order.data().mtnId,
      amount: Math.min(order.data().amount, 500000), // 500K UGX auto-limit
      reasonCode: 44 // Agricultural goods
    });
    
    // Blockchain record for transparency
    await celoContract.logRefund(
      orderId, 
      order.data().farmerWallet,
      order.data().buyerPhone
    );
  }
}