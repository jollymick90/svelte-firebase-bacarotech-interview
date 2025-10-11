<script lang="ts">
  import SelectSpeakerNotification from "$lib/components/notification/SelectSpeakerNotification.svelte";
  import CalendarInterview from "$lib/components/slots/CalendarInterview.svelte";  
</script>

<div class="w-full flex flex-col gap-2 items-center">

  <SelectSpeakerNotification />
    
  <CalendarInterview />  
</div>
