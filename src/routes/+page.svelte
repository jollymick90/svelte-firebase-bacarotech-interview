<script lang="ts">
  import Background from "$lib/shared/components/Background.svelte";
  import { onMount } from "svelte";
  import { messaging } from "$lib/firebase/firebase.client"; // Usiamo l'alias $lib
  import { getToken, onMessage } from "firebase/messaging";
  import { env } from "$env/dynamic/public";

  let notificationPermission: NotificationPermission = "default";
  let fcmToken = "";
  let error: string | null = null;

  async function requestPermissionAndGetToken() {
    console.log("requestPermissionAndGetToken")
    if (!messaging) {
      return;
    }
    try {
      // Richiesta del permesso
      const permission = await Notification.requestPermission();
      notificationPermission = permission;

      if (permission === "granted") {
        console.log("Permesso per le notifiche accordato.");

        // Ottenimento del token
        const currentToken = await getToken(messaging, {
          vapidKey: env.PUBLIC_CLOUD_MESSAGING_KEY, // Inserisci la chiave VAPID
        });

        if (currentToken) {
          fcmToken = currentToken;
          console.log("Token FCM:", currentToken);
          // Qui dovresti inviare il token al tuo backend per salvarlo
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

  async function getAsyncToken() {
    if (!messaging)
    return;
       const currentToken = await getToken(messaging, {
          vapidKey: env.PUBLIC_CLOUD_MESSAGING_KEY, // Inserisci la chiave VAPID
        });
         if (currentToken) {
          fcmToken = currentToken;
          console.log("Token FCM:", currentToken);
          // Qui dovresti inviare il token al tuo backend per salvarlo
        } else {
          console.warn(
            "Nessun token di registrazione disponibile. Richiedi il permesso per generarne uno."
          );
          error =
            "Impossibile ottenere il token. Assicurati di essere su HTTPS.";
        }
  }

  onMount(() => {
    console.log("....", messaging)
    notificationPermission = Notification.permission;
    if (!messaging)
        return;

    getAsyncToken()
        
    // Gestione dei messaggi quando l'app è in primo piano
    onMessage(messaging, (payload) => {
      console.log("Messaggio ricevuto in primo piano: ", payload);
      // Mostra una notifica personalizzata all'interno della tua UI
      alert(`Nuova notifica: ${payload.notification?.title}`);
    });
  });
</script>

<Background>
  <div class="flex flex-col justify-center items-center gap-5">
    <h1 class="text-secondary-400 text-3xl">Bacaro Interview</h1>

    <a
      href="/login"
      class="rounded-md bg-primary-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-primary-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
    >
      My Profile
    </a>

    <a
      href="/interview"
      class="rounded-md bg-primary-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-primary-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
    >
      Interview Schedule
    </a>

    {#if notificationPermission === "default"}
      <button onclick={() => requestPermissionAndGetToken()}>
        Abilita Notifiche
      </button>
    {:else if notificationPermission === "granted"}
      <p>✅ Le notifiche sono abilitate!</p>
      {#if fcmToken}
        <p>
          <strong>Il tuo token FCM:</strong>
          <input type="text" readonly value={fcmToken} size="50" />
        </p>
      {/if}
    {:else}
      <p>🚫 Hai bloccato le notifiche.</p>
    {/if}

    {#if error}
      <p style="color: red;">{error}</p>
    {/if}
  </div>
</Background>
