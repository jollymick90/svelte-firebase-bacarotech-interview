<script lang="ts">
  import type { SpeakerDetails } from "$lib/type/slots";
  import { onMount } from "svelte";
  import AccordionItem from "../layout/AccordionItem.svelte";

  let speakerList: SpeakerDetails[] = $state([]);
  let selectedSpeaker: SpeakerDetails | null = $state(null);
  let fcmToken: string | null = $state("");
  let isNotificationEnable = $derived(fcmToken && fcmToken !== "");

  async function fetchSpeaker() {
    try {
      const response = await fetch("/api/speaker");
      if (response.ok) {
        let speakers: SpeakerDetails[] = await response.json();
        speakerList = speakers
          .filter((s) => s.name && s.name !== "free" && s.name !== "")
          .sort((a, b) => a.name.localeCompare(b.name));
      }
    } catch (error) {}
  }
  async function followSpeaker(token: string, speaker: SpeakerDetails) {
    try {
      const response = await fetch("/api/follow-speaker", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token, // Il token FCM del dispositivo
          speakerId: speaker.docId, // L'ID dello speaker
          speakerName: speaker.name, // Il nome dello speaker
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        // L'errore (es. 404, 400) verrà catturato qui
        throw new Error(result.message || "Errore durante l'operazione");
      }

      console.log(result.message); // "Ora segui lo speaker con successo"
      // Qui puoi mostrare una notifica di successo all'utente
    } catch (err) {
      console.error("Impossibile seguire lo speaker:", err);
      // Mostra un messaggio di errore all'utente
    }
  }

  async function updateSpeakerToFollow() {
    if (fcmToken && selectedSpeaker) followSpeaker(fcmToken, selectedSpeaker);
  }

  onMount(() => {
    fcmToken = localStorage.getItem("fcm_token");
    fetchSpeaker();
  });
</script>

<AccordionItem open={false} title="Select Speaker To Follow">
  <div class="w-full flex flex-col items-center gap-2">
    {#if !isNotificationEnable}
      <p class="feedback error">Enable notifications to follow the speaker</p>
    {/if}

    <div class="form-group">
      <label for="message"> Seleziona lo speaker che vuoi seguire</label>

      <select class="rounded" bind:value={selectedSpeaker}>
        {#each speakerList as speaker}
          <option value={speaker}>
            {speaker.name}
          </option>
        {/each}
      </select>
    </div>

    <button
      class=" rounded-md bg-primary-500 px-3.5 py-2.5 text-sm font-semibold
                  disabled:bg-primary-200
                  text-white shadow-xs hover:bg-primary-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
      aria-label="save"
      disabled={selectedSpeaker === null}
      onclick={updateSpeakerToFollow}
    >
      Save Option</button
    >
  </div>
</AccordionItem>

<style>
  .feedback {
    margin-top: 10px;
    padding: 10px;
    border-radius: 4px;
  }
  .feedback.success {
    color: #155724;
    background-color: #d4edda;
    border: 1px solid #c3e6cb;
  }
  .feedback.error {
    color: #721c24;
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
  }
</style>
