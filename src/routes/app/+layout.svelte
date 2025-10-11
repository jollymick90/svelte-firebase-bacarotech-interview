<script lang="ts">
  import { userState } from "$lib/store/userstore.svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  const pathname = $derived(page.url.pathname);
  const isAuthPath = $derived(pathname.includes("app"));
  const userLoggedIn = $derived(userState.loggedin);

  let { children } = $props();
  $effect(() => {
    if (!userLoggedIn && isAuthPath) {
      goto("/");
    }
  });
</script>

{@render children?.()}
