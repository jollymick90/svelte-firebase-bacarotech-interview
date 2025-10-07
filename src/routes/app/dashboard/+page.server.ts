import { adminFirestore } from '$lib/server/admin';

import { redirect } from '@sveltejs/kit';

// src/routes/dashboard/+page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    const userID = locals.userID;

    // Controllo di Autorizzazione: L'autenticazione è già stata verificata nell'hook, 
    // ma la load function deve agire in base ad essa.
    if (!userID) {
        // Teoricamente, il layout superiore dovrebbe già aver reindirizzato, 
        // ma questo è un fail-safe.
        throw redirect(302, '/login'); 
    }

    try {
        // Recupero del profilo utente utilizzando l'UID validato come ID del documento
        // [1]
        const docRef = adminFirestore.collection('user_profiles').doc(userID);
        const doc = await docRef.get(); // [27]

        if (doc.exists) {
            // Ritorna l'oggetto serializzabile al componente Svelte per l'idratazione
            return {
                profile: doc.data()
            };
        }

    } catch (error) {
        console.error("Errore nel recupero dati utente:", error);
        // Gestione degli errori, es. documento non trovato
    }

    return { profile: null };
};
// [29]