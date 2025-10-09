// src/firebase-messaging-sw.ts
/// <reference lib="webworker" />

import { env } from "$env/dynamic/public";
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging/sw";
import { onBackgroundMessage } from "firebase/messaging/sw";

declare const self: ServiceWorkerGlobalScope;

// const firebaseConfig = {
//     apiKey: "TUA_API_KEY",
//     authDomain: "TUO_AUTH_DOMAIN",
//     projectId: "TUO_PROJECT_ID",
//     storageBucket: "TUO_STORAGE_BUCKET",
//     messagingSenderId: "TUO_MESSAGING_SENDER_ID",
//     appId: "TUA_APP_ID"
// };

const firebaseConfig = {
  apiKey: env.PUBLIC_FIREBASE_ADMIN_KEY,
  authDomain: env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.PUBLIC_FIRESTORE_STORAGEBUCKET,
  messagingSenderId: env.PUBLIC_FIRESTORE_MESSAGINGSENDERID,
  appId: env.PUBLIC_FIRESTORE_APPID,
  measurementId: env.PUBLIC_FIRESTORE_MEASUREMENTID,
};

initializeApp(firebaseConfig);
const messaging = getMessaging();

onBackgroundMessage(messaging, (payload) => {
  console.log('[firebase-messaging-sw.ts] Messaggio ricevuto in background', payload);

  const notificationTitle = payload.notification?.title || 'Nuova Notifica';
  const notificationOptions = {
    body: payload.notification?.body || 'Hai un nuovo messaggio.',
    icon: '/favicon.png' // Assicurati che l'icona esista in public
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});