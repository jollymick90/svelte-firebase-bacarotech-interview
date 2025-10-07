// src/hooks.server.ts
import { adminAuth } from '$lib/server/admin';

import type { Handle } from '@sveltejs/kit';

export const handle = (async ({ event, resolve }) => {
    
	if (
		event.url.pathname.startsWith(
			'/.well-known/appspecific/com.chrome.devtools'
		)
	) {
		return new Response(null, { status: 204 }); // Return empty response with 204 No Content
	}
    
    const sessionCookie = event.cookies.get("__session");
    
    event.locals.userID = null; // Inizializza a null

    if (sessionCookie) {
        try {
            // Verifica la sessione utilizzando l'Admin SDK
            const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie);
            
            // Sessione valida: imposta l'UID nell'oggetto locals
            event.locals.userID = decodedClaims.uid;
            event.locals.isAdmin = decodedClaims.admin ?? false;
                console.log("isAdmin", event.locals.isAdmin, decodedClaims)

        } catch (e) {
            // Sessione non valida o scaduta: elimina il cookie non valido
            event.cookies.delete("__session", { path: '/' });
        }
    }
    
    // Prosegue con il ciclo di richiesta
    return resolve(event);
}) satisfies Handle;
