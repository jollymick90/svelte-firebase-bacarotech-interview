<script lang="ts">
  import { fakeSlotFree } from "$lib/mock/fake-slot";
  import CardSlot from "./CardSlot.svelte";

  const slots = $state(fakeSlotFree);
</script>

<ul role="list" class="overflow-hidden rounded-md bg-white shadow-sm">
  {#each slots as slot}
    <li class="px-4 py-2">
      <CardSlot {slot} />
    </li>
  {/each}
</ul>
