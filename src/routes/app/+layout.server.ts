import { redirect } from '@sveltejs/kit';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
    // Se l'utente non è autenticato (userID è stato impostato a null nell'hook)
    console.log("--- load template")
    if (!locals.userID) {
        // Reindirizza l'utente alla pagina di login
        throw redirect(302, `/login?redirectTo=${url.pathname}`);
    }

    // Passa l'UID al layout per renderizzare elementi specifici dell'utente
    return {
        userID: locals.userID
    };
};
