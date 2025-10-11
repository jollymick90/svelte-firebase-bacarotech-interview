import { adminFirestore as db } from '$lib/firebase/firebase-admin.server';
import type { InterviewSlot } from '$lib/type/slots';

import { json } from '@sveltejs/kit';

import { error } from '@sveltejs/kit';
import { FieldValue } from 'firebase-admin/firestore';

import type { RequestHandler } from './$types';

async function readFirebaseSlot() {
    try {
        const slotsSnapshot = await db.collection('slots').get()

        const slots = slotsSnapshot.docs.map(doc => ({
            ...doc.data(),
            docId: doc.id
        }));
        return slots as InterviewSlot[]
    } catch (e: any) {
        return null;
    }
}
export const POST: RequestHandler = async () => {
    try {
        const speakersSnapshot = await db.collection('speakers').get();
        const batch = db.batch();
        const speakerNameToIdMap = new Map<string, string>();
        speakersSnapshot.forEach((doc) => {
            speakerNameToIdMap.set(doc.data().name, doc.id);
        });

        const slotsData = await readFirebaseSlot();
        if (!slotsData) {
            return json({ message: 'Errore interno del server.' }, { status: 500 });

        }

        let count = 0;
        console.log(`Aggiunti ${count} nuovi slot.`);

        return json({ message: `${count} slot sono stati creati e associati con successo.` }, { status: 201 });

    } catch (error) {
        console.error("Errore durante la creazione degli slot:", error);
        return json({ message: 'Errore interno del server.' }, { status: 500 });
    }
};


/**
 * @description Assegna uno speaker a un interview slot.
 * @method PATCH
 * @body { slotId: string, speakerId: string, speakerName: string }
 */
export async function PATCH({ request }) {
	try {
		const { slotId, speakerId, speakerName } = await request.json();

		// --- 1. Validazione dell'input ---
		if (!slotId || !speakerId || !speakerName) {
			throw error(400, 'Dati mancanti: sono necessari slotId, speakerId e speakerName.');
		}

		// --- 2. Riferimento al documento dello slot in Firestore ---
		const slotRef = db.collection('slots').doc(slotId);

		// --- 3. Verifica che lo slot esista e sia disponibile (opzionale ma consigliato) ---
		const slotDoc = await slotRef.get();
		if (!slotDoc.exists) {
			throw error(404, `Slot con ID ${slotId} non trovato.`);
		}
		if (slotDoc.data()?.status !== 'AVAILABLE') {
			throw error(409, `Lo slot non è disponibile per la prenotazione.`); // 409 Conflict
		}

		// --- 4. Prepara i dati e aggiorna il documento ---
		await slotRef.update({
			speakerUid: speakerId,
			speakerName: speakerName,
			status: 'BOOKED',
			bookedAt: FieldValue.serverTimestamp() // Usa il timestamp del server per coerenza
		});

		return json({ success: true, message: `Slot ${slotId} assegnato a ${speakerName}` });
	} catch (err: any) {
		// Se è un errore di SvelteKit (con status), rilancialo
		if (err.status) {
			throw err;
		}
		console.error("Errore nell'assegnazione dello slot:", err);
		throw error(500, "Impossibile assegnare lo slot.");
	}
}