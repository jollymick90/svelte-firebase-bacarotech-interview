<script lang="ts">
  import type { InterviewSlot } from "$lib/type/slots";
  import { onMount } from "svelte";
  let slots = $state([] as InterviewSlot[]);
  let slotsLoading = $state(true);
  let slotsError = $state("");
  async function fetchSlots() {
    slotsLoading = true;
    slotsError = "";
    try {
      const response = await fetch("/api/slots");
      if (response.ok) {
        slots = await response.json();
        slots.sort(
          (a, b) =>
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );
      } else {
        slotsError = "Errore nel caricamento degli slot.";
      }
    } catch (e: any) {
      slotsError = "Errore di rete: " + e.message;
    } finally {
      slotsLoading = false;
    }
  }

  onMount(() => {
    fetchSlots();
  });
</script>

<section class="slots-list">
  <h2 class="text-xl font-bold mb-4">Slot Attuali</h2>
  {#if slotsLoading}
    <p>Caricamento slot...</p>
  {:else if slotsError}
    <p class="feedback error">{slotsError}</p>
  {:else if slots.length > 0}
    {#each slots as slot}
      <div class="slot-item">
        <span class="slot-name">{slot.speakerName || "Slot libero"}</span>
        <span class="slot-time"
          >{new Date(slot.startTime).toLocaleTimeString()} - {new Date(
            slot.endTime
          ).toLocaleTimeString()}</span
        >
      </div>
    {/each}
  {:else}
    <p>Nessun slot trovato.</p>
  {/if}
</section>

<style>
  .feedback {
    margin-top: 20px;
    padding: 12px;
    border-radius: 4px;
    text-align: center;
    font-weight: 500;
  }

  .error {
    background-color: #fee2e2;
    color: #991b1b;
  }
</style>
