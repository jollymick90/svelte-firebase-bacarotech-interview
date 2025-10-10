<script lang="ts">
  import { onMount } from "svelte";
  import { messaging } from "$lib/firebase/firebase.client"; // Usiamo l'alias $lib

  import { getToken, onMessage } from "firebase/messaging";
  import { env } from "$env/dynamic/public";

  let notificationPermission: NotificationPermission = "default";
  let fcmToken = "";
  let error: string | null = null;
  async function requestPermissionAndGetToken() {
    if (!messaging) {
      return;
    }
    try {
      // Richiesta del permesso
      const permission = await Notification.requestPermission();
      notificationPermission = permission;

      if (permission === "granted") {
        const currentToken = await getToken(messaging, {
          vapidKey: env.PUBLIC_CLOUD_MESSAGING_KEY, 
        });

        if (currentToken) {
          fcmToken = currentToken;
          
          localStorage.setItem('fcm_token', currentToken);
      
          await saveTokenToServer(currentToken);
        } else {
          console.warn(
            "Nessun token di registrazione disponibile. Richiedi il permesso per generarne uno."
          );
          error =
            "Impossibile ottenere il token. Assicurati di essere su HTTPS.";
        }
      } else {
        console.warn("Permesso per le notifiche negato.");
        error =
          "Hai bloccato le notifiche. Per abilitarle, modifica le impostazioni del tuo browser.";
      }
    } catch (err) {
      console.error(
        "Errore durante la richiesta del permesso o l'ottenimento del token:",
        err
      );
      error = "Si è verificato un errore.";
    }
  }


   async function saveTokenToServer(token: string) {
    try {
      const response = await fetch('/api/save-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new Error('La richiesta al server è fallita');
      }
      
      console.log("Token salvato correttamente sul server.");

    } catch (err) {
      console.error("Errore durante il salvataggio del token sul server:", err);
      // Non mostrare questo errore all'utente, il token è comunque valido sul client
    }
  }
</script>

{#if notificationPermission === "default"}
  <button 
  class="rounded-md bg-primary-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-primary-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
  onclick={() => requestPermissionAndGetToken()}>
    Abilita Notifiche
  </button>
{:else if notificationPermission === "granted"}
  <p>✅ Le notifiche sono abilitate!</p>
{:else}
  <p>🚫 Hai bloccato le notifiche.</p>
{/if}

{#if error}
  <p style="color: red;">{error}</p>
{/if}
