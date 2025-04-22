// firestore-function.js - Automatic harvest verification
exports.verifyHarvest = functions.firestore
  .document('harvests/{harvestId}')
  .onCreate(async (snap, context) => {
    const harvest = snap.data();
    
    // 1. AI image analysis (TensorFlow Lite)
    const qualityScore = await analyzeHarvestImage(harvest.photoURL);
    
    // 2. Geo-validate farm location
    const isValidLocation = await ugandaLandCommission
      .verifyFarm(harvest.coordinates);
    
    // 3. Release 50% payment immediately if valid
    if (qualityScore > 0.7 && isValidLocation) {
      await mobileMoney.pay(
        harvest.farmerId, 
        harvest.price * 0.5,
        "Advance payment - GreenHarvest Guarantee"
      );
      
      // Schedule remainder for delivery confirmation
      await db.collection('pendingPayments').add({
        farmerId: harvest.farmerId,
        amount: harvest.price * 0.5,
        releaseCondition: "delivery_confirmed",
        harvestId: context.params.harvestId
      });
    }
  });