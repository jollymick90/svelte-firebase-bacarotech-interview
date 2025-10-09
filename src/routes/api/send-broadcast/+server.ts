import { adminFirestore as adminDB } from '$lib/server/admin';
import {
  getMessaging,
  type Message,
} from 'firebase-admin/messaging';

import {
  error,
  json,
} from '@sveltejs/kit';

export async function POST({ request }) {
    // 🚨 PASSO DI SICUREZZA CRUCIALE 🚨
    // QUI DOVRESTI VERIFICARE SE L'UTENTE CHE FA LA RICHIESTA È UN AMMINISTRATORE
    // Esempio: controlla il suo token JWT o la sua sessione.
    // Se non è un admin, restituisci un errore 403 (Forbidden).
    // const user = await getUserBySession(request); // Esempio di funzione
    // if (!user || !user.isAdmin) {
    //   throw error(403, 'Accesso non autorizzato');
    // }

    try {
        const { message, title } = await request.json();

        if (!message || typeof message !== 'string' || !title || typeof title !== 'string') {
            throw error(400, 'Titolo e messaggio non validi o mancanti');
        }

        // 1. Recupera tutti i token da Firestore
        const tokensSnapshot = await adminDB.collection('fcm_tokens').get();
        if (tokensSnapshot.empty) {
            return json({ success: true, message: "Nessun token a cui inviare la notifica." });
        }
        const tokens = tokensSnapshot.docs.map(doc => doc.id);
        const messages: Message[] = tokens.map((token) => ({
            token,
            data: {
                title: title,
                body: message,
            },
            android: {
                data: {
                    title: title,
                    body: message,
                },
                priority: 'high'
            },
            webpush: {
                data: {
                    title: title,
                    body: message,
                },
                notification: {
                    title
                }
            }

        }))
        // 2. Prepara il messaggio da inviare
        const notificationPayload = {
            notification: {
                title: title, // es. "Annuncio importante"
                body: message, // es. "La manutenzione è programmata per domani."
            },
            // Puoi aggiungere anche un'icona, un suono, etc.
        };

        // 3. Invia la notifica a tutti i token in un colpo solo (multicast)
        const messaging = getMessaging();
        const response = await messaging.sendEach(messages);

        const failedTokens: string[] = [];
        response.responses.forEach((result, index) => {
            const error = result.error;
            if (error) {
                console.warn('Invio fallito al token:', tokens[index], error);
                // Se il token non è più valido, lo aggiungiamo alla lista per la pulizia
                if (
                    error.code === 'messaging/invalid-registration-token' ||
                    error.code === 'messaging/registration-token-not-registered'
                ) {
                    failedTokens.push(tokens[index]);
                }
            }
        });

        // 4. (Opzionale ma consigliato) Rimuovi i token non validi dal database
        if (failedTokens.length > 0) {
            console.log(`Rimozione di ${failedTokens.length} token non validi...`);
            const batch = adminDB.batch();
            failedTokens.forEach(token => {
                const tokenRef = adminDB.collection('fcm_tokens').doc(token);
                batch.delete(tokenRef);
            });
            await batch.commit();
        }

        return json({
            success: true,
            message: `Notifica inviata. Successi: ${response.successCount}, Fallimenti: ${response.failureCount}`,
        });

    } catch (err) {
        console.error("Errore nell'invio della notifica broadcast:", err);
        throw error(500, 'Impossibile inviare la notifica');
    }
}