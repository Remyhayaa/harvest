// real-time-earnings.js
db.collection('riders').onSnapshot(snap => {
  snap.docChanges().forEach(change => {
    const celo = new CeloWallet(change.doc.data().privateKey);
    celo.showBalance(`${change.doc.data().name} balance: ${balance} cUSD`);
  });
});