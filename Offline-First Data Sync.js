// firestore-offline.js
import { enableIndexedDbPersistence } from 'firebase/firestore';

export function initOfflineSync() {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Offline persistence already enabled in another tab');
    } else if (err.code === 'unimplemented') {
      console.warn('Browser lacks offline support');
    }
  });

  // Custom sync indicator for rural areas
  document.addEventListener('connection-change', (e) => {
    const badge = document.getElementById('sync-badge');
    badge.textContent = e.detail.online ? 'Synced' : 'Offline (queued)';
    badge.className = e.detail.online ? 'badge bg-success' : 'badge bg-warning';
  });
}