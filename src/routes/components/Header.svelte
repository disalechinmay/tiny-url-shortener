<script lang="ts">
	export let window: Window;
</script>

<h2 class="text-3xl font-medium text-center">Shorten URLs</h2>

<!-- Information text -->
<p class="text-gray-600">
	Pretty Name: A custom name that you want to use for your shortened URL.
	<br />Example:
	{window.location + '<prettyName>'}
	<br />
	<br />
	Target URL: The URL that you want to shorten.
	<br />Example: https://www.youtube.com/

	<br />
	<br />
	Note: The shortened URL is valid for 7 days.
</p>
