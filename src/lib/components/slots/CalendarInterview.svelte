<script lang="ts">
  
  import type { InterviewSlot } from "$lib/type/slots";
  import { onMount } from "svelte";
  import CardSlot from "./CardSlot.svelte";
  
   let slots = $state([] as InterviewSlot[]);
  let slotsLoading = $state(true);
  let slotsError = $state('');
  async function fetchSlots() {
    slotsLoading = true;
    slotsError = "";
    try {
      const response = await fetch("/api/slots");
      if (response.ok) {
        slots = await response.json();
        slots.sort((a,b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
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
  })
</script>

<ul role="list" class="overflow-hidden rounded-md bg-white shadow-sm">
  {#each slots as slot}
    <li class="px-4 py-2">
      <CardSlot {slot} />
    </li>
  {/each}
</ul>
