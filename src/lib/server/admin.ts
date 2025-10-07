import {
  env,
} from '$env/dynamic/private'; // Assicurarsi che SvelteKit carichi variabili private
import {
  cert,
  getApps,
  initializeApp,
} from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// La chiave di servizio viene parsata da una variabile d'ambiente stringa
const serviceAccount = JSON.parse(env.FIREBASE_ADMIN_KEY);

if (!getApps().length) {
    // Inizializza l'app di amministrazione con le credenziali di certificato
    initializeApp({
        credential: cert(serviceAccount),
    });
}

// Esporta i servizi amministrativi per l'uso in hooks e +server.ts
export const adminAuth = getAuth();
export const adminFirestore = getFirestore();