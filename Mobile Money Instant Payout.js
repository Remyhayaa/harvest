// payments.js - MTN/Airtel integration
export async function processFarmerPayout(farmerId, amount) {
  const farmerDoc = await db.collection('farmers').doc(farmerId).get();
  const { mobileMoney } = farmerDoc.data();
  
  const response = await fetch('https://api.flutterwave.com/v3/disbursements', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${FLW_SECRET_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      account_bank: mobileMoney.provider === 'MTN' ? 'MTN' : 'AIRTEL',
      account_number: mobileMoney.number.replace('+256', ''),
      amount: Math.floor(amount), // Whole UGX
      currency: 'UGX',
      reference: `GH-${Date.now()}`,
      narration: `Harvest payment ${new Date().toLocaleDateString('en-UG')}`
    })
  });

  if (!response.ok) throw new Error('Payout failed');
  return response.json(); // Contains Flutterwave transaction ID
}