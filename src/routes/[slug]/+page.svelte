<script lang="ts">
	import { onMount } from 'svelte';
	export let data;
	let notFound: boolean = false;

	onMount(async () => {
		if (data && data.slug) {
			const res = await fetch(`${import.meta.env.VITE_BACKEND_LAMBDA}?prettyName=${data.slug}`);
			const resJson = await res.json();

			if (resJson && resJson.Count === 0) {
				notFound = true;
			} else {
				window.location.href = resJson.Items[0].targetUrl;
			}
		}
	});
</script>

<!-- 404 error -->
{#if notFound}
	<div class="flex flex-col items-center justify-center space-y-2 h-screen w-screen">
		<h1 class="text-4xl font-bold text-gray-600">404</h1>
		<p class="text-gray-600">Page not found.</p>
	</div>
{/if}
