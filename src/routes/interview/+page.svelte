<script lang="ts">
  import type { InterviewSlot } from "$lib/type/slots";
  import { onMount } from "svelte";

  
  import CalendarInterview from "./CalendarInterview.svelte";
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

<div class="mt-5s flex flex-col gap-1 justify-center items-center">
  <h1 class="bold">Interview schedule</h1>
  <CalendarInterview slots={slots}/>
</div>
