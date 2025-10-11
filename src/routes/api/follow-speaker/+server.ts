// src/routes/api/follow-speaker/+server.ts

import { json, error } from '@sveltejs/kit';
import { adminFirestore as adminDB } from '$lib/firebase/firebase-admin.server';

import { FieldValue } from 'firebase-admin/firestore';

/**
 * @description Aggiorna un token FCM esistente per "seguire" uno speaker specifico.
 * @method PATCH
 * @param {object} body - { token: string, speakerId: string, speakerName: string }
 */
export async function PATCH({ request }) {
  try {
    const { token, speakerId, speakerName } = await request.json();

    // 1. Validazione dell'input
    if (!token || typeof token !== 'string') {
      throw error(400, 'Token non valido o mancante');
    }
    if (!speakerId || typeof speakerId !== 'string') {
      throw error(400, 'ID dello speaker non valido o mancante');
    }
    if (!speakerName || typeof speakerName !== 'string') {
      throw error(400, 'Nome dello speaker non valido o mancante');
    }

    // 2. Riferimento al documento del token nel database
    const tokenRef = adminDB.collection('fcm_tokens').doc(token);

    // 3. Verifica se il token esiste prima di aggiornarlo
    const docSnap = await tokenRef.get();
    if (!docSnap.exists) {
      // Se il token non esiste, significa che l'utente non ha mai registrato il suo dispositivo.
      throw error(404, 'Token non trovato. Impossibile seguire lo speaker.');
    }

    // 4. Aggiorna il documento esistente con i dati dello speaker
    await tokenRef.update({
      speakerId: speakerId,
      speakerName: speakerName,
      updatedAt: FieldValue.serverTimestamp(), // Aggiungiamo un timestamp di aggiornamento
    });

    return json({ success: true, message: 'Ora segui lo speaker con successo' });

  } catch (err: any) {
    // Se l'errore è un errore gestito da SvelteKit (come quelli lanciati da noi), rilancialo.
    if (err.status) {
      throw err;
    }
    console.error("Errore nell'aggiornamento dello speaker per il token:", err);
    throw error(500, 'Impossibile aggiornare il token');
  }
}