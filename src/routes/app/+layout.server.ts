import { redirect } from '@sveltejs/kit';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
    console.log("--- load app layout redirect")
    // 1. Assumiamo che l'autenticazione sia già stata gestita in hooks.server.ts
    const userIsAdmin = locals.isAdmin?? false; // Se locals non è popolato, l'utente non è Admin
    const currentPath = url.pathname;

    const targetAdminPath = '/app/admin';
    const targetHomePath = '/app/home';

    if (userIsAdmin) {
        // Se l'utente è Admin, deve essere reindirizzato a /app/admin
        if (!currentPath.startsWith(targetAdminPath)) {
            // Impedisce il reindirizzamento se l'utente è già su /app/admin/*
            console.log("--- load app server targetAdminPath", targetAdminPath)
            return redirect(307, targetAdminPath); 
        }
    } else {
        // Se l'utente non è Admin, deve essere reindirizzato a /app/home
        if (!currentPath.startsWith(targetHomePath)) {
            // Impedisce il reindirizzamento se l'utente è già su /app/home/*
            console.log("--- load app server targetHomePath", targetHomePath)
            return redirect(307, targetHomePath);
        }
    }
    
    // Se l'utente è sul percorso corretto per il suo ruolo, o è una rotta non gestita qui (e.g., /login)
    return {}; 
};
