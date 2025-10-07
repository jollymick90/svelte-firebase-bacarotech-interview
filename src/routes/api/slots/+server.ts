// src/routes/api/slots/+server.ts

import { json } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

// 1. Definizione dei tipi per chiarezza
interface SpeakerDetails {
    uid: string;
    name: string;
}

interface InterviewSlot {
    id: string;
    eventId: string;
    startTime: string; // ISO String per i Timestamp
    endTime: string;   // ISO String per i Timestamp
    status: 'AVAILABLE' | 'BOOKED' | 'CANCELED';
    speakerUid: string | null;
    speakerName: string | null;
    bookedAt: string | null;
}

// Funzione helper per generare un ID pseudo-casuale (simula l'UUID di Firestore)
function generateFakeId(): string {
    return 'slot_' + Math.random().toString(36).substring(2, 9);
}

// 2. Dati Fittizi degli Speaker (Denormalizzazione)
// Questo oggetto simula la collezione /speakers che verrebbe letta per denormalizzare i dati.
const speakerData: SpeakerDetails = {
    name: 'tizio',
    uid: 'abc123',
};

/**
 * Gestisce la richiesta GET per recuperare i dati degli slot fittizi.
 */
export const GET: RequestHandler = async () => {
    const today = new Date();
    const eventId = 'conf_2025_tech';

    // Array di slot per la demo
    const fakeSlots: InterviewSlot[] = [
          // Slot 1: Disponibile
        {
            id: generateFakeId(),
            eventId: eventId,
            startTime: new Date(today.setHours(10, 30, 0, 0)).toISOString(),
            endTime: new Date(today.setHours(11, 0, 0, 0)).toISOString(),
            status: 'AVAILABLE',
            speakerUid: null,
            speakerName: null,
            bookedAt: null,
        },
        // Slot 2: Disponibile
        {
            id: generateFakeId(),
            eventId: eventId,
            startTime: new Date(today.setHours(11, 0, 0, 0)).toISOString(),
            endTime: new Date(today.setHours(11, 30, 0, 0)).toISOString(),
            status: 'AVAILABLE',
            speakerUid: null,
            speakerName: null,
            bookedAt: null,
        },
        // Slot 3: Prenotato
        {
            id: generateFakeId(),
            eventId: eventId,
            startTime: new Date(today.setHours(14, 0, 0, 0)).toISOString(),
            endTime: new Date(today.setHours(14, 30, 0, 0)).toISOString(),
            status: 'BOOKED',
            // Usa il secondo speaker (indice 1)
            speakerUid: speakerData.uid,
            speakerName: speakerData.name,
            
            bookedAt: new Date().toISOString(),
        },
        // Slot 4: Disponibile (Più tardi)
        {
            id: generateFakeId(),
            eventId: eventId,
            startTime: new Date(today.setHours(15, 0, 0, 0)).toISOString(),
            endTime: new Date(today.setHours(15, 30, 0, 0)).toISOString(),
            status: 'AVAILABLE',
            speakerUid: null,
            speakerName: null,
            bookedAt: null,
        }
    ];

    // Restituisce l'array JSON di slot
    return json({
        slots: fakeSlots,
        total: fakeSlots.length,
        timestamp: new Date().toISOString()
    });
};