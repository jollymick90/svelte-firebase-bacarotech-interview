<script lang="ts">
  import "../app.css";
  import favicon from "$lib/assets/favicon.ico";
  import Header from "$lib/components/layout/Header.svelte";
  import { authClient } from "$lib/firebase/firebase.client";
  import { getRedirectResult } from "firebase/auth";
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import { userState } from "$lib/store/userstore.svelte";
  import { goto } from "$app/navigation";
  const pathname = $derived(page.url.pathname);
  const isAuthPath = $derived(pathname.includes("app"));
  const userLoggedIn = $derived(userState.loggedin);

  let { children } = $props();
  onMount(() => {
    getRedirectResult(authClient)
      .then((result) => {
        console.log("result on redirect result");
        if (result) {
          // L'utente è stato reindirizzato indietro, abbiamo le sue informazioni
          const user = result.user;
          console.log("Login completato:", user);
          // Qui puoi salvare i dati dell'utente o reindirizzarlo alla dashboard
          window.location.href = "/"; // Reindirizza alla home page
        }
      })
      .catch((error) => {
        // errorMessage = error.message;
        console.error("Errore durante il redirect:", error);
      });
  });

  $inspect(userLoggedIn);
  $effect(() => {
    if (userLoggedIn && !isAuthPath) {
      goto("app/admin");
    }
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>
<Header></Header>
{@render children?.()}
