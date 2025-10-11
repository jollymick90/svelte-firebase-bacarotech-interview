import { json, error } from '@sveltejs/kit';
import { adminFirestore as adminDB } from '$lib/firebase/firebase-admin.server';

/**
 * @description Resetta TUTTI gli slot a 'AVAILABLE', rimuovendo i dati degli speaker.
 * @method POST
 */
export async function POST() {
	try {
		// --- 1. Riferimento alla collezione degli slot ---
		const slotsCollectionRef = adminDB.collection('slots');
		const snapshot = await slotsCollectionRef.get();

		if (snapshot.empty) {
			return json({ success: true, message: 'Nessuno slot da resettare.' });
		}

		// --- 2. Inizializza una scrittura batch ---
		const batch = adminDB.batch();

		// --- 3. Itera su ogni slot e aggiungi l'operazione di update al batch ---
		snapshot.forEach((doc) => {
			const slotRef = slotsCollectionRef.doc(doc.id);
			batch.update(slotRef, {
				status: 'AVAILABLE',
				speakerUid: null,
				speakerName: null,
				bookedAt: null
			});
		});

		// --- 4. Esegui tutte le operazioni di aggiornamento in una volta ---
		await batch.commit();

		return json({
			success: true,
			message: `Reset completato con successo per ${snapshot.size} slot.`
		});
	} catch (err) {
		console.error('Errore durante il reset degli slot:', err);
		throw error(500, 'Impossibile resettare gli slot.');
	}
}