<script>
  import BroadcastSender from "$lib/components/admin/BroadcastSender.svelte";
  import CalendarInterview from "$lib/components/slots/CalendarInterview.svelte";
  
</script>

<div class="w-full flex flex-col gap-2">
  <h1>Admin Page</h1>

  <div>
    <a
      class="rounded-md bg-primary-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-primary-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
      href="/app/admin/slots">Modifica Slot</a
    >
  </div>

  <BroadcastSender />
  <div class="w-full ">
    <CalendarInterview />
  </div>  
</div>
