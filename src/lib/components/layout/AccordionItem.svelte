<script lang="ts">
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
  import type { Snippet } from 'svelte';

	// Props per rendere il componente riutilizzabile
	// export let title: string;
	// export let open = false; // Controlla se l'item è aperto di default
    const {title, open, children}: { title: string, open: boolean, children?: Snippet} =$props();
	// Stato interno per gestire l'apertura/chiusura
	let isOpen = $state(open);

	// Genera un ID unico per l'accessibilità (ARIA)
	const uniqueId = crypto.randomUUID();

	function toggle() {
		isOpen = !isOpen;
	}
</script>

<div class="m-4 w-full bg-white rounded-lg shadow-md overflow-hidden">
	<h2>
		<button
			onclick={toggle}
			class="flex w-full items-center justify-between p-5 text-left font-semibold text-gray-800 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 active:bg-gray-100"
			aria-expanded={isOpen}
			aria-controls="accordion-content-{uniqueId}"
		>
			<span>{title}</span>

			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				class="h-5 w-5 transition-transform duration-300"
				class:rotate-180={isOpen}
			>
				<path
					fill-rule="evenodd"
					d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
					clip-rule="evenodd"
				/>
			</svg>
		</button>
	</h2>

	{#if isOpen}
		<div
			transition:slide={{ duration: 300, easing: quintOut }}
			id="accordion-content-{uniqueId}"
			class="p-5 pt-0 text-gray-600"
		>
			{@render children?.()}
		</div>
	{/if}
</div>