<script lang="ts">
	let prettyName: string;
	let targetUrl: string;
	let error: string;
	let submittingForm: boolean = false;
	let mappedUrl: string = '';

	const submitForm = async () => {
		submittingForm = true;
		error = '';
		mappedUrl = '';

		if (!prettyName || !targetUrl) {
			error = 'Please fill in all fields.';
			submittingForm = false;
			return;
		}

		// Pretty name can only contain alphanumeric characters and dashes
		if (!/^[a-zA-Z0-9-]+$/.test(prettyName)) {
			error = 'Pretty name can only contain alphanumeric characters and dashes.';
			submittingForm = false;
			return;
		}

		// Check if targetUrl is a valid URL and is not if current domain
		try {
			const url = new URL(targetUrl);
			if (url.hostname === window.location.hostname) {
				error = 'Target URL cannot be the same as current domain.';
				submittingForm = false;
				return;
			}
		} catch (err) {
			error = 'Target URL is not a valid URL.';
			submittingForm = false;
			return;
		}

		try {
			const res = await fetch(`${import.meta.env.VITE_BACKEND_LAMBDA}?prettyName=${prettyName}`);
			const data = await res.json();

			if (data && 'Count' in data && data.Count !== 0) {
				error = 'Given pretty name is already taken. Please choose another one.';
			} else {
				const res = await fetch(`${import.meta.env.VITE_BACKEND_LAMBDA}`, {
					method: 'POST',
					headers: {
						Origin: window.location.origin,
						'Access-Control-Request-Method': 'POST'
					},
					body: JSON.stringify({
						prettyName,
						targetUrl,
						expirationTimestamp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 // 7 days
					})
				});
				if (res.status === 200) {
					mappedUrl = `${window.location.origin}/${prettyName} is now mapped to ${targetUrl}.`;
				} else {
					error = 'Something went wrong. Please try again.';
				}
			}
		} catch (err) {
			error = JSON.stringify(err);
		}

		submittingForm = false;
	};
</script>

<div class="flex flex-col space-y-1">
	<label for="prettyName" class="text-sm font-bold text-gray-600">Pretty Name</label>
	<input
		id="prettyName"
		type="text"
		placeholder="Pretty Name"
		class="border-2 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-400 focus:ring-1 ring-blue-400"
		required
		bind:value={prettyName}
	/>

	<label for="targetUrl" class="text-sm font-bold text-gray-600">Target URL</label>
	<input
		id="targetUrl"
		type="text"
		placeholder="Target URL"
		class="border-2 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-400 focus:ring-1 ring-blue-400"
		required
		bind:value={targetUrl}
	/>
</div>

<button
	class="block text-white text-lg rounded px-3 py-2 font-semibold bg-blue-500 hover:bg-blue-400 disabled:opacity-30 disabled:pointer-events-none"
	on:click={submitForm}
	disabled={submittingForm}
>
	{#if submittingForm}
		Processing...
	{:else}
		Submit
	{/if}
</button>

<!-- Error message -->
{#if error}
	<p class="text-red-500 text-sm font-bold mt-2">{error}</p>
{/if}

{#if mappedUrl}
	<div class="text-green-600">{mappedUrl}</div>
{/if}
