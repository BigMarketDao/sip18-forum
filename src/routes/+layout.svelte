<script lang="ts">
	import { configStore, type Config } from '$lib/stores/stores_config';
	import { onMount } from 'svelte';
	import '../app.css';
	import { browser } from '$app/environment';
	import ThemeToggle from '$lib/components/theme/ThemeToggle.svelte';
	import AppBar from '$lib/components/theme/AppBar.svelte';
	import { getBnsNameFromAddress, getStxAddress, isLoggedIn } from '$lib/stacks/stacks-connect';
	import { storedBnsData } from '$lib';
	// let { children } = $props();

	export let data: {
		network: string;
		appConfig: Config;
	};
	if (!data.appConfig) throw new Error('no app config present?');
	$: configStore.set(data.appConfig);

	// let isDark = false;

	onMount(async () => {
		if (!browser) return;
		if (isLoggedIn()) {
			const name = await getBnsNameFromAddress(getStxAddress());
			storedBnsData.set(name || getStxAddress());
		}
	});
</script>

<!-- {@render children()} -->
<div
	class="bg-surface-50-950 text-surface-contrast-50-950 from-surface-100-900
	       via-surface-100-900
	       to-surface-100-900 min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]
	       font-extralight"
>
	<div class="">
		<div class="flex min-h-screen flex-col">
			<AppBar />
			<slot />
		</div>
	</div>
</div>
