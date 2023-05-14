<script lang="ts">
	import Header from './components/Header.svelte';
	import Form from './components/Form.svelte';
	import { onMount } from 'svelte';

	let windowObj: Window;

	onMount(() => {
		windowObj = window;
	});
</script>

{#if windowObj}
	<div
		class="flex w-screen h-screen justify-center bg-indigo-100 font-mono md:items-center lg:items-center"
	>
		<div
			class="flex flex-col bg-white p-10 shadow space-y-6 w-screen md:w-2/3 lg:w-1/2 md:rounded-lg lg:rounded-lg"
		>
			<Header window={windowObj} />
			<Form />
		</div>
	</div>
{/if}
