<script>
  import Background from "$lib/shared/components/Background.svelte";

</script>
<Background>
    <div class="flex flex-col justify-center items-center gap-5 ">
        <h1 class="text-secondary-400 text-3xl">Bacaro Interview</h1>
                  
        <a href="/login" class="rounded-md bg-primary-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-primary-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500">
            My Profile
        </a>

        <a href="/interview" class="rounded-md bg-primary-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-primary-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500">
            Interview Schedule
        </a>
    </div>
</Background>