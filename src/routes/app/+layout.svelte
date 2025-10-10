<script lang="ts">
  import Logout from '$lib/components/auth/Logout.svelte';

	
	
	let { children } = $props();
</script>

<nav>
	<Logout />
</nav>
{@render children?.()}
