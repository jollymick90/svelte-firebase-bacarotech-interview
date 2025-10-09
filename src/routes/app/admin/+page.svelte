<script>
  import BroadcastSender from "$lib/components/admin/BroadcastSender.svelte";
  import ListSlot from "$lib/slots/ListSlot.svelte";
</script>

<div class="flex flex-col gap-2">
  <h1>Admin Page</h1>

  <div>
    <a
      class="rounded-md bg-primary-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-primary-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
      href="/app/admin/slots">Aggiungi Slot</a
    >
  </div>

  <BroadcastSender />

  <ListSlot />
</div>
