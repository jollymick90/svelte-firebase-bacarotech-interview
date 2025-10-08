<script lang="ts">
    const { slot }: { slot: { name: string, time: string}} = $props();
</script>

<div class="bg-white rounded-lg shadow p-4 mb-1 flex items-center justify-between border border-gray-200
min-w-90
">
  <div class="flex items-center">
    <div class="w-10 h-10 flex items-center justify-center bg-indigo-100 text-primary-700 rounded-full font-bold text-sm">
      {slot.time}
    </div>
    <div class="ml-4">
      <p class="text-gray-900 font-medium">{slot.name}</p>
      <p class="text-gray-500 text-sm">Details</p>
    </div>
  </div>
  
 
</div>
