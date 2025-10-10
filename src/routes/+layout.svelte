<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.ico';
  import Header from '$lib/components/layout/Header.svelte';
  import { onMount } from 'svelte';
  import { onAuthStateChanged } from 'firebase/auth';
  import { authClient } from '$lib/firebase/firebase.client';
  import { userState } from '$lib/store/userstore.svelte';
	
	let { children } = $props();

	onMount(() => {
		  onMount(() => {
    const unsubscribe = onAuthStateChanged(authClient, (firebaseUser) => {
		console.log("User", firebaseUser)
	userState.loggedin = true;
});
  });
	})
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>
<Header></Header>
{@render children?.()}
